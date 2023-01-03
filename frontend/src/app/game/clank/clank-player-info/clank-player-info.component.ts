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
import { ClankCostInfoDirection } from 'src/app/shared/components/clank-cost-info/clank-cost-info.types';
import { ConfirmModalComponent } from 'src/app/shared/modals/confirm-modal/confirm-modal.component';
import {
    ClankCostInfoType,
    ClankElementTypeMap,
} from 'src/app/shared/models/clank-element-types';
import { UseTokenType } from 'src/app/shared/models/tokens/token.types';
import { ToastService } from 'src/app/shared/services/toast.service';

import {
    ClankElementByTurn,
    ClankElementByTurnList,
} from '@shared/clank/clank-info.types';
import { ClankPlayerConfig } from '@shared/clank/clank-player.types';
import {
    ClankTokenConfig,
    ClankTokenTypeEnum,
} from '@shared/clank/clank-token.types';

import { ClankDungeonRowComponent } from '../clank-dungeon-row/clank-dungeon-row.component';
import {
    TrashCardsComponent,
    TrashCardsComponentData,
    TrashCardsComponentResult,
} from '../dialogs/trash-cards/trash-cards.component';
import { CardsService } from '../services/cards.service';
import { ClankHelpService } from '../services/clank-help.service';
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
    ClankCostInfoDirection = ClankCostInfoDirection;
    ClankTokenTypeEnum = ClankTokenTypeEnum;
    cardsWrapInfo = {
        cardsInRow: 4,
        cardWidth,
        cardHeight,
        cardWidthKoef: 0.8,
        deckTop: cardsWrapPadding,
        deckLeft: `${cardsWrapPadding}px`,
        boardLeft: `calc(33% + ${cardsWrapPadding}px)`,
        discardLeft: `calc(66% + ${cardsWrapPadding}px)`,
        boardTop: 300 + cardsWrapPadding * 2,
        tokenSize: 50,
    };

    @HostBinding('style.--player_card_height') player_card_height = `${this.cardsWrapInfo.cardHeight}px`;
    @HostBinding('style.--player_card_width') player_card_width = `${this.cardsWrapInfo.cardWidth}px`;
    @HostBinding('style.--player_token_size') player_token_size = `${this.cardsWrapInfo.tokenSize}px`;

    selectedPlayerSubject = new BehaviorSubject<ClankPlayerConfig | undefined>(void 0);
    selectedPlayerAreaSubject = new BehaviorSubject<{
        width: number;
        height: number;
    }>({
        width: 0,
        height: 0,
    });
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
        this.updatePlayerCards(player);
        this.selectedPlayerSubject.next(player);
    }

    playersSubject = this.gameInfoQuery.onPlayersChangeSubject.pipe(
        tap((players) => {
            this.selectedPlayer = this.selectedPlayer != null
                ? players.find(p => p.id === this.selectedPlayer?.id)
                : this.gameInfoQuery.currentPlayer;
        }),
    );

    activePlayerSubject = this.gameInfoQuery.onActivePlayerChangeSubject;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private clankHelpService: ClankHelpService,
        private cardsService: CardsService,
        private gameInfoQuery: GameInfoQuery,
        private gameInfoService: GameInfoService,
        private matBottomSheet: MatBottomSheet,
        private matDialog: MatDialog,
        private toastService: ToastService,
    ) { }

    ngOnInit(): void {
    }

    onSelectPlayer(player: ClankPlayerConfig) {
        if (this.selectedPlayer?.id === player.id) {
            return;
        }
        this.selectedPlayer = player;
    }

    useToken(tokenInfo: ClankTokenConfig, playerId: string) {
        this.gameInfoService.useToken({
            playerId,
            tokenInfo,
            type: UseTokenType.use,
        });
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
                    clankHelpService: this.clankHelpService,
                    cardsService: this.cardsService,
                },
            },
        );
    }

    async finishTurn() {
        if (this.activePlayer.hand.length > 0) {
            this.toastService.showWarn(`Остались неиспользованные карты (${this.activePlayer.hand.length} шт.)`);
            return;
        }
        const unusedList = ClankElementByTurnList
            .filter(p => p !== ClankElementByTurn.clank && (this.activePlayer.benefitInfo[p] ?? 0) > 0)
            .map(p => `Остались неиспользованные очки (${ClankElementTypeMap[p].name}: ${this.activePlayer.benefitInfo[p]})`);
        if (unusedList.length > 0) {
            const matDialogRef = this.matDialog.open<ConfirmModalComponent, ConfirmModalComponent['data']>(
                ConfirmModalComponent,
                {
                    data: {
                        title: 'Вы уверены что хотите закончить ход?',
                        textList: unusedList,
                    },
                },
            );
            const result = await matDialogRef.afterClosed().toPromise();
            if (!result) {
                return;
            }
        }

        if (this.activePlayer.needTrashCards.length > 0) {
            const matDialogRef = this.matDialog.open<
                TrashCardsComponent,
                TrashCardsComponentData,
                TrashCardsComponentResult
            >(
                TrashCardsComponent,
                {
                    data: {
                        cards: [
                            ...this.activePlayer.discard,
                            ...this.activePlayer.board,
                            ...this.activePlayer.hand,
                        ],
                        needTrashCards: this.activePlayer.needTrashCards,
                    },
                    width: `${this.cardsWrapInfo.cardWidth * 5}px`,
                },
            );
            const result = await matDialogRef.afterClosed().toPromise();
            if (result == null) {
                return;
            }
            this.gameInfoService.finishTurn(result);
        } else {
            this.gameInfoService.finishTurn({
                discard: [
                    ...this.activePlayer.discard,
                    ...this.activePlayer.board,
                    ...this.activePlayer.hand,
                ],
                trash: [],
            });
        }
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
                card,
                style: {
                    left: this.cardsWrapInfo.deckLeft,
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
                card,
                style: {
                    left: this.cardsWrapInfo.boardLeft,
                    top: `${this.cardsWrapInfo.deckTop}px`,
                    zIndex: `${index}`,
                },
                isOpen: true,
                classes: [],
                actions: [{
                    name: 'Посмотреть карты',
                    btnClass: 'btn-primary',
                    canUse: () => true,
                    callback: async () => {
                        this.clankHelpService.openCardList(player.board, 'Список разыгранных на этом ходу карт');
                    },
                }],
            };
            return data;
        });
        const discard = (player?.discard ?? []).map((card, index) => {
            const data: ISelectedPlayerCardInfo = {
                id: card.id,
                card,
                style: {
                    left: this.cardsWrapInfo.discardLeft,
                    top: `${this.cardsWrapInfo.deckTop}px`,
                    zIndex: `${index}`,
                },
                isOpen: true,
                classes: [],
                actions: [{
                    name: 'Посмотреть карты',
                    btnClass: 'btn-primary',
                    canUse: () => true,
                    callback: async () => {
                        this.clankHelpService.openCardList(player.discard, 'Список сброшеных карт');
                    },
                }],
            };
            return data;
        });
        const hand = (player?.hand ?? []).map((card, index) => {
            const leftIndex = (index % this.cardsWrapInfo.cardsInRow);
            const topIndex = Math.floor(index / this.cardsWrapInfo.cardsInRow);
            const left = leftIndex * this.cardsWrapInfo.cardWidth * this.cardsWrapInfo.cardWidthKoef;
            const top = topIndex * this.cardsWrapInfo.cardHeight * this.cardsWrapInfo.cardWidthKoef + this.cardsWrapInfo.boardTop;
            const data: ISelectedPlayerCardInfo = {
                id: card.id,
                card,
                style: {
                    left: `${left}px`,
                    top: `${top}px`,
                    zIndex: `${index}`,
                },
                isOpen: true,
                classes: [`card_container__hand`],
                actions: [
                    {
                        name: this.cardsService.getCardActionName(card, 'onUse'),
                        btnClass: 'btn-primary',
                        canUse: () => player.id === this.activePlayer.id
                            && this.activePlayer.id === this.currentPlayer?.id,
                        callback: async () => {
                            await this.gameInfoService.useCard(card, 'onUse');
                            this.changeDetectorRef.detectChanges();
                        },
                    },
                ],
            };
            return data;
        });
        const cards = [
            ...deck,
            ...board,
            ...discard,
            ...hand,
        ].sort((a, b) => a.card.initIndex - b.card.initIndex);
        this.selectedPlayerCardsSubject.next(cards);

        const rowCount = Math.ceil(hand.length / this.cardsWrapInfo.cardsInRow);
        this.selectedPlayerAreaSubject.next({
            width: (this.cardsWrapInfo.cardsInRow - 1) * this.cardsWrapInfo.cardWidth * this.cardsWrapInfo.cardWidthKoef
                + this.cardsWrapInfo.cardWidth * 1.2,
            height: this.cardsWrapInfo.boardTop + rowCount * this.cardsWrapInfo.cardHeight + cardsWrapPadding * 2,
        });
    }

}
