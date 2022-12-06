import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    OnInit,
} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';

import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
    cardHeight,
    cardsWrapPadding,
    cardWidth,
    ISelectedPlayerCardInfo,
} from 'src/app/shared/components/clank-card/clank-card.types';
import { ConfirmModalComponent } from 'src/app/shared/modals/confirm-modal/confirm-modal.component';
import { updateBenefitInfoByAction } from 'src/app/shared/models/actions.types';
import { UseCardType } from 'src/app/shared/models/cards/cards.types';
import { ClankCostInfoType } from 'src/app/shared/models/clank-element-types';
import { updateBenefitInfo } from 'src/app/shared/models/players/player.types';
import { CardsService } from 'src/app/shared/services/cards.service';

import { ClankCardState } from '@shared/clank/clank-card.types';
import { ClankCostInfo } from '@shared/clank/clank-info.types';
import { ClankPlayerConfig } from '@shared/clank/clank-player.types';

import { ClankDungeonRowComponent } from '../clank-dungeon-row/clank-dungeon-row.component';
import { GameCardService } from '../services/game-card.service';
import { GameInfoQuery } from '../services/game-info.query';
import { GameInfoService } from '../services/game-info.service';

@Component({
    selector: 'app-clank-player-info',
    templateUrl: './clank-player-info.component.html',
    styleUrls: ['./clank-player-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClankPlayerInfoComponent implements OnInit {

    ClankCostInfoType = ClankCostInfoType;
    cardsWrapInfo = {
        rowCount: 4,
        cardWidth,
        cardHeight,
        deckTop: cardsWrapPadding * 2,
        deckLeft: (cardWidth + cardsWrapPadding) * 0 + cardsWrapPadding,
        boardLeft: (cardWidth + cardsWrapPadding) * 1 + cardsWrapPadding,
        discardLeft: (cardWidth + cardsWrapPadding) * 2 + cardsWrapPadding,
        boardTop: 300 + cardsWrapPadding * 2,
    };

    @HostBinding('style.--player_card_height') player_card_height = `${this.cardsWrapInfo.cardHeight}px`;
    @HostBinding('style.--player_card_width') player_card_width = `${this.cardsWrapInfo.cardWidth}px`;

    selectedPlayerSubject = new BehaviorSubject<ClankPlayerConfig | undefined>(void 0);
    selectedPlayerCardsSubject = new BehaviorSubject<ISelectedPlayerCardInfo[]>([]);

    get currentPlayer() {
        return this.gameInfoQuery.currentPlayer;
    }

    get activePlayer() {
        return this.gameInfoQuery.activePlayer;
    }

    get selectedPlayer() {
        return this.selectedPlayerSubject.getValue();
    }

    set selectedPlayer(player: ClankPlayerConfig | undefined) {
        this.selectedPlayerSubject.next(player);
    }

    playersSubject = this.gameInfoQuery.onPlayersChangeSubject.pipe(
        tap((players) => {
            this.selectedPlayer = this.selectedPlayer != null
                ? players.find(p => p.id === this.selectedPlayer?.id)
                : this.gameInfoQuery.currentPlayer;
            this.updatePlayerCards(this.selectedPlayer);
        }),
    );

    activePlayerSubject = this.gameInfoQuery.onActivePlayerChangeSubject;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private gameInfoQuery: GameInfoQuery,
        private gameInfoService: GameInfoService,
        private cardsService: CardsService,
        private gameCardService: GameCardService,
        private matBottomSheet: MatBottomSheet,
        private matDialog: MatDialog,
    ) { }

    ngOnInit(): void {
    }

    onSelectPlayer(player: ClankPlayerConfig) {
        if (this.selectedPlayer?.id === player.id) {
            return;
        }
        this.selectedPlayer = player;
    }

    async useCard(cardState: ClankCardState, player: ClankPlayerConfig) {
        const card = this.cardsService.getCardInfo(cardState);
        if (card == null) {
            return;
        }
        const actions = this.gameCardService.getActions({
            card,
            player,
            type: 'actions',
        });
        if (card.actions != null && !actions.length) {
            const matDialogRef =  this.matDialog.open<ConfirmModalComponent, ConfirmModalComponent['data']>(
                ConfirmModalComponent,
                {
                    data: {
                        text: 'Вы уверены что хотите разыграть эту карту?',
                    },
                },
            );
            const result = await matDialogRef.afterClosed().toPromise();
            if (!result) {
                return;
            }
        }
        const benefitInfo: ClankCostInfo = actions.length
            ? updateBenefitInfoByAction({
                player,
                list: actions,
            })
            : player.benefitInfo;
        this.gameInfoService.useCard({
            playerId: player.id,
            cardState,
            benefitInfo: card?.benefit != null
                ? updateBenefitInfo({
                    benefit: benefitInfo,
                    cost: card.benefit,
                    isBenefit: true,
                })
                : player.benefitInfo,
            type: UseCardType.use,
        });
        this.changeDetectorRef.detectChanges();
    }

    openDungeonRow(player: ClankPlayerConfig) {
        this.matBottomSheet.open<
            ClankDungeonRowComponent,
            ClankDungeonRowComponent['data']
        >(
            ClankDungeonRowComponent,
            {
                data: {
                    gameInfoQuery: this.gameInfoQuery,
                    gameInfoService: this.gameInfoService,
                    player,
                },
            },
        );
    }

    finishTurn() {
        // TODO: Добавить проверку на неиспользованные ресурсы
        this.gameInfoService.finishTurn();
    }

    trackById(index: number, player: { id: any }) {
        return player.id;
    }

    private updatePlayerCards(player: ClankPlayerConfig | undefined) {
        if (player == null) {
            this.selectedPlayerCardsSubject.next([]);
            return;
        }
        const deck = (player?.deck ?? []).map((card, index) => {
            const data: ISelectedPlayerCardInfo = {
                id: card.id,
                state: card,
                style: {
                    left: `${this.cardsWrapInfo.deckLeft}px`,
                    top: `${this.cardsWrapInfo.deckTop}px`,
                    zIndex: `${index}`,
                },
                isOpen: false,
                classes: [],
                actions: [],
            };
            return data;
        });
        const board = (player?.board ?? []).map((card, index) => {
            const data: ISelectedPlayerCardInfo = {
                id: card.id,
                state: card,
                style: {
                    left: `${this.cardsWrapInfo.boardLeft}px`,
                    top: `${this.cardsWrapInfo.deckTop}px`,
                    zIndex: `${index}`,
                },
                isOpen: true,
                classes: [],
                actions: [],
            };
            return data;
        });
        const discard = (player?.discard ?? []).map((card, index) => {
            const data: ISelectedPlayerCardInfo = {
                id: card.id,
                state: card,
                style: {
                    left: `${this.cardsWrapInfo.discardLeft}px`,
                    top: `${this.cardsWrapInfo.deckTop}px`,
                    zIndex: `${index}`,
                },
                isOpen: true,
                classes: [],
                actions: [],
            };
            return data;
        });
        const hand = (player?.hand ?? []).map((card, index) => {
            const leftIndex = (index % this.cardsWrapInfo.rowCount);
            const topIndex = Math.floor(index / this.cardsWrapInfo.rowCount);
            const left = leftIndex * this.cardsWrapInfo.cardWidth * 0.8;
            const top = topIndex * this.cardsWrapInfo.cardHeight * 0.8 + this.cardsWrapInfo.boardTop;
            const data: ISelectedPlayerCardInfo = {
                id: card.id,
                state: card,
                style: {
                    left: `${left}px`,
                    top: `${top}px`,
                    zIndex: `${index}`,
                },
                isOpen: true,
                classes: [`card_container__hand`],
                actions: [{
                    name: 'Использовать карту',
                    canUse: () => player.id === this.activePlayer.id
                        && this.activePlayer.id === this.currentPlayer?.id,
                    callback: () => this.useCard(card, player),
                }],
            };
            return data;
        });
        const cards = [
            ...deck,
            ...board,
            ...discard,
            ...hand,
        ].sort((a, b) => a.state.initIndex - b.state.initIndex);
        this.selectedPlayerCardsSubject.next(cards);
    }

}
