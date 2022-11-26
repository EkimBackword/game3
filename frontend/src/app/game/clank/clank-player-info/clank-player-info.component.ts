import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    OnInit,
} from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { updateBenefitInfo } from 'src/app/shared/models/players/player.types';
import { CardsService } from 'src/app/shared/services/cards.service';

import {
    ClankCardPositionEnum,
    ClankCardState,
} from '@shared/clank/clank-card.types';
import { ClankPlayerConfig } from '@shared/clank/clank-player.types';

import { GameInfoQuery } from '../services/game-info.query';
import { GameInfoService } from '../services/game-info.service';

@Component({
    selector: 'app-clank-player-info',
    templateUrl: './clank-player-info.component.html',
    styleUrls: ['./clank-player-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClankPlayerInfoComponent implements OnInit {

    selectedCard: ClankCardState | null = null;

    selectedPlayerSubject = new BehaviorSubject<ClankPlayerConfig | undefined>(void 0);

    card_width = 160;
    card_height = 220;
    @HostBinding('style.--player_card_width') player_card_width = `${this.card_width}px`;
    @HostBinding('style.--player_card_height') player_card_height = `${this.card_height}px`;

    get selectedPlayer() {
        return this.selectedPlayerSubject.getValue();
    }

    set selectedPlayer(player: ClankPlayerConfig | undefined) {
        this.selectedPlayerSubject.next(player);
    }

    get handRow() {
        if (this.selectedPlayer == null) {
            return [];
        }
        const rowCount = 4;
        return this.selectedPlayer.hand.map((card, index) => {
            return {
                card,
                left: (index % rowCount) * this.card_width * 0.8,
                top: Math.floor(index / rowCount) * this.card_height * 0.8,
            };
        });
    }

    playersSubject = this.gameInfoQuery.onPlayersChangeSubject.pipe(
        tap((players) => {
            this.selectedPlayer = this.selectedPlayer != null
                ? players.find(p => p.id === this.selectedPlayer?.id)
                : this.gameInfoQuery.currentPlayer;
        }),
    );

    activePlayerSubject = this.gameInfoQuery.onActivePlayerChangeSubject;

    get currentPlayer() {
        return this.gameInfoQuery.currentPlayer;
    }

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private gameInfoQuery: GameInfoQuery,
        private gameInfoService: GameInfoService,
        private cardsService: CardsService,
    ) { }

    ngOnInit(): void {
    }

    onSelectPlayer(player: ClankPlayerConfig) {
        if (this.selectedPlayer?.id === player.id) {
            return;
        }
        this.selectedPlayer = player;
    }

    onSelectCard(event: MouseEvent, card: ClankCardState) {
        if (this.selectedCard != null && this.selectedCard.id === card.id) {
            this.unselectCard();
            return;
        }

        this.selectedCard = card;
        this.changeDetectorRef.detectChanges();
    }

    useSelecetCard(event: MouseEvent, player: ClankPlayerConfig) {
        if (this.selectedCard == null) {
            return;
        }
        const cardInfo = this.getSelectedCardInfo();
        this.gameInfoService.updatePlayer(player.id, {
            benefitInfo: cardInfo?.benefit != null
                ? updateBenefitInfo({
                    benefit: player.benefitInfo,
                    cost: cardInfo.benefit,
                    isBenefit: true,
                })
                : player.benefitInfo,
            hand: player.hand.filter(p => p.id !== this.selectedCard?.id),
            board: [
                ...player.board,
                {
                    id: this.selectedCard.id,
                    index: this.selectedCard.index,
                    position: ClankCardPositionEnum.playerBoard,
                    player_id: player.id,
                },
            ],
        });
        this.unselectCard();
    }

    finishTurn() {
        this.gameInfoService.finishTurn();
    }

    trackById(index: number, player: ClankPlayerConfig) {
        return player.id;
    }

    private unselectCard() {
        this.selectedCard = null;
        this.changeDetectorRef.detectChanges();
    }

    private getSelectedCardInfo() {
        if (this.selectedCard == null) {
            return;
        }
        const [find_string] = this.selectedCard.id.split('__');
        return this.cardsService.store.find(p => p.find_string === find_string);
    }

}
