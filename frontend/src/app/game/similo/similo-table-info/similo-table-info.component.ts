import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnDestroy,
    Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import * as lodash from 'lodash';
import {
    debounceTime,
    Subject,
    takeUntil,
} from 'rxjs';

import { faUser } from '@fortawesome/free-solid-svg-icons';
import { GameInfoStatusIdEnum } from '@shared/clank/clank-game.types';
import {
    GamePlayerColorIdEnum,
    GamePlayerColorIds,
    GamePlayerColorList,
    GamePlayerStatusIdEnum,
} from '@shared/clank/clank-player.types';
import {
    SimiloCardConfig,
    SimiloCardPosition,
    SimiloDlcEnum,
} from '@shared/similo/similo-dlc.types';
import {
    SimiloGameInfoState,
    SimiloPlayerConfig,
} from '@shared/similo/similo-game.types';

import { SimiloCardWrapInfo } from '../models/similo-card';
import {
    getCardsByDlcDeck,
    SimiloDlcDeckList,
} from '../models/similo-dlc';
import { SimiloPlayerTypes } from '../models/similo-rules';
import { SimiloGameInfoQuery } from '../services/similo-game-info.query';
import { SimiloRulesComponent } from '../similo-rules/similo-rules.component';

@Component({
    selector: 'app-similo-table-info',
    templateUrl: './similo-table-info.component.html',
    styleUrls: ['./similo-table-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimiloTableInfoComponent implements AfterViewInit, OnDestroy {

    @Output() updateSocketState = new EventEmitter<SimiloGameInfoState>();
    @Output() kickUser = new EventEmitter<string>();

    state: SimiloGameInfoState | undefined;

    players: SimiloPlayerConfig[] = [];
    validColorList = false;
    invalidColorText = 'Цвета игроков должны отличатся';

    icons = {
        player: faUser,
    }

    GamePlayerColorList = GamePlayerColorList;
    GamePlayerColorIds = GamePlayerColorIds;
    GamePlayerStatusIdEnum = GamePlayerStatusIdEnum;
    GameInfoStatusIdEnum = GameInfoStatusIdEnum;
    SimiloDlcDeckList = SimiloDlcDeckList;
    SimiloPlayerTypes = SimiloPlayerTypes;

    get currentPlayer() {
        return this.similoGameInfoQuery.currentPlayer;
    }

    private ngUnsubscribe = new Subject<void>();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private similoGameInfoQuery: SimiloGameInfoQuery,
        private matDialog: MatDialog,
        // private gameDialogsService: GameDialogsService,
        // private mapsService: MapsService,
        // private toastService: ToastService,
        private router: Router,
    ) { }

    ngAfterViewInit() {
        this.similoGameInfoQuery.onAnyChangeSubject.pipe(
            debounceTime(0),
            takeUntil(this.ngUnsubscribe),
        ).subscribe((state) => {
            this.players = lodash.cloneDeep(state.players).sort((a, b) => {
                const aKoef = a.id === this.currentPlayer?.id ? 1 : 0;
                const bKoef = b.id === this.currentPlayer?.id ? 1 : 0;
                return bKoef - aKoef;
            });
            this.validColorList = !GamePlayerColorIds.some((id) => {
                const playerCount = this.players.filter(p => p.colorId === id).length;
                return playerCount > 1;
            });
            this.state = state;
            this.changeDetectorRef.markForCheck();
        })
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    startGame() {
        const state = this.similoGameInfoQuery.getValue();
        const cards = getCardsByDlcDeck(state.mainDlc, SimiloCardPosition.Board);
        const main = cards.splice(0, SimiloCardWrapInfo.cardsCount);
        const help = state.helpDlc != state.mainDlc
            ? getCardsByDlcDeck(state.helpDlc, SimiloCardPosition.Deck)
            : cards;
        state.mainDeck = this.getInitedMainDeck(main);
        state.helpDeck = this.getInitedHelpDeck(help);
        state.statusId = GameInfoStatusIdEnum.Started;
        state.isMasterTurn = true;
        state.countCardsForClose = 0;
        state.turnIndex = 1;
        state.isWin = false;
        this.updateSocketState.emit(state)
    }

    resetGame() {
        const state = this.similoGameInfoQuery.getValue();
        state.mainDeck = [];
        state.helpDeck = [];
        state.statusId = GameInfoStatusIdEnum.Created;
        state.isWin = false;
        this.updateSocketState.emit(state)
    }

    exitGame() {
        this.router.navigate(['/']);
    }

    changeGameName(name: string) {
        const state = this.similoGameInfoQuery.getValue();
        state.name = name;
        this.updateSocketState.emit(state);
    }

    mainDlcChanged(mainDlc: SimiloDlcEnum) {
        const state = this.similoGameInfoQuery.getValue();
        state.mainDlc = mainDlc;
        state.helpDlc = mainDlc;
        this.updateSocketState.emit(state);
    }

    helpDlcChanged(helpDlc: SimiloDlcEnum) {
        const state = this.similoGameInfoQuery.getValue();
        state.helpDlc = helpDlc;
        this.updateSocketState.emit(state);
    }

    setMasterPlayerId(player: SimiloPlayerConfig) {
        const state = this.similoGameInfoQuery.getValue();
        state.masterPlayerId = player.id;
        this.updateSocketState.emit(state);
    }

    changeColor(player: SimiloPlayerConfig, colorId: GamePlayerColorIdEnum) {
        const state = this.similoGameInfoQuery.getValue();
        state.players = state.players.map(p => {
            if (p.id === player.id) {
                p.colorId = colorId;
            }
            return p;
        });
        this.updateSocketState.emit(state);
    }

    trackById(index: number, item: { id: any }) {
        return item.id;
    }

    openSimiloRules() {
        return this.matDialog.open<SimiloRulesComponent>(
            SimiloRulesComponent,
            {
                width: `${SimiloCardWrapInfo.cardWidth * 2}px`,
            },
        );
    }

    private getInitedMainDeck(cards: SimiloCardConfig[]) {
        const searchableIndex = lodash.random(0, SimiloCardWrapInfo.cardsCount - 1);
        return cards.map((card, index) => {
            card.position = SimiloCardPosition.Board;
            card.index = index;
            card.isOpen = true;
            card.isSearchable = index === searchableIndex;
            return card;
        });
    }

    private getInitedHelpDeck(cards: SimiloCardConfig[]) {
        return cards.map((card, index) => {
            card.position = index < 5
                ? SimiloCardPosition.Hand
                : SimiloCardPosition.Deck;
            card.index = index < 5
                ? index
                : index - 5;
            return card;
        })
    }

}
