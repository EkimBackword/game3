import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    OnInit,
} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
    cardHeight,
    cardsWrapHeader,
    cardsWrapPadding,
    cardWidth,
    ISelectedPlayerCardInfo,
} from 'src/app/shared/components/clank-card/clank-card.types';
import { ClankCostInfoDirection } from 'src/app/shared/components/clank-cost-info/clank-cost-info.types';
import {
    ClankCostInfoType,
    ClankElementTypeMap,
} from 'src/app/shared/models/clank-element-types';
import { UseTokenType } from 'src/app/shared/models/tokens/token.types';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { ToastService } from 'src/app/shared/services/toast.service';

import {
    faHourglassStart,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import {
    ClankElementByTurn,
    ClankElementByTurnList,
} from '@shared/clank/clank-info.types';
import {
    ClankPlayerConfig,
    GamePlayerColorList,
} from '@shared/clank/clank-player.types';
import {
    ClankTokenConfig,
    ClankTokenTypeEnum,
} from '@shared/clank/clank-token.types';

import { ClankDungeonRowComponent } from '../clank-dungeon-row/clank-dungeon-row.component';
import { CardsService } from '../services/cards.service';
import { ClankHelpService } from '../services/clank-help.service';
import { GameDialogsService } from '../services/game-dialogs.service';
import { GameInfoQuery } from '../services/game-info.query';
import { GameInfoService } from '../services/game-info.service';

@Component({
    selector: 'app-clank-player-info',
    templateUrl: './clank-player-info.component.html',
    styleUrls: ['./clank-player-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClankPlayerInfoComponent implements OnInit {

    GamePlayerColorList = GamePlayerColorList;
    icons = {
        user: faUser,
        active: faHourglassStart,
    };
    ClankCostInfoType = ClankCostInfoType;
    ClankCostInfoDirection = ClankCostInfoDirection;
    ClankTokenTypeEnum = ClankTokenTypeEnum;
    cardsWrapInfo = {
        cardsInRow: 4,
        cardWidth,
        cardHeight,
        cardWidthKoef: 0.8,
        headerHeight: cardsWrapHeader,
        deckTop: cardsWrapHeader,
        deckLeft: `${cardsWrapPadding}px`,
        boardLeft: `calc(33% + ${cardsWrapPadding}px)`,
        discardLeft: `calc(66% + ${cardsWrapPadding}px)`,
        handHeaderTop: cardHeight + cardsWrapHeader + cardsWrapPadding,
        handTop: cardHeight + cardsWrapHeader + cardsWrapPadding * 3,
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

    activePlayer: ClankPlayerConfig | undefined;
    activePlayerSubject = this.gameInfoQuery.onActivePlayerChangeSubject.pipe(
        tap((player) => {
            this.activePlayer = player;
        }),
    );

    canCancelSubject = this.gameInfoQuery.onCanCancelChangeSubject;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private clankHelpService: ClankHelpService,
        private cardsService: CardsService,
        private gameInfoQuery: GameInfoQuery,
        private gameInfoService: GameInfoService,
        private gameDialogsService: GameDialogsService,
        private matBottomSheet: MatBottomSheet,
        private dialogService: DialogService,
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

    cancelState() {
        this.gameInfoService.cancelState();
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
                panelClass: 'my-mat-bottom-sheet-container',
            },
        );
    }

    async useAll() {
        const list = this.selectedPlayerCardsSubject.getValue();
        const hand = list.filter(p => p.handIndex != null)
            .sort((a, b) => (a.handIndex ?? 0) - (b.handIndex ?? 0));
        for (const item of hand) {
            if (item.action == null || item.action.eventName !== 'onUse' || !item.action.canUse()) {
                continue;
            }
            await item.action.callback();
        }
    }

    async finishTurn(activePlayer: ClankPlayerConfig ) {
        if (activePlayer.hand.length > 0) {
            this.toastService.showWarn(`Остались неиспользованные карты (${activePlayer.hand.length} шт.)`);
            return;
        }
        const unusedList = ClankElementByTurnList
            .filter(p => p !== ClankElementByTurn.clank && (activePlayer.benefitInfo[p] ?? 0) > 0)
            .map(p => `Остались неиспользованные очки (${ClankElementTypeMap[p].name}: ${activePlayer.benefitInfo[p]})`);
        if (unusedList.length > 0) {
            const result = await this.openConfirmDialog(
                'Вы уверены что хотите закончить ход?',
                unusedList,
            );
            if (!result) {
                return;
            }
        }

        if (activePlayer.needTrashCards.length > 0) {
            const matDialogRef = this.gameDialogsService.openTrashCardsComponent({
                cards: [
                    ...activePlayer.discard,
                    ...activePlayer.board,
                    ...activePlayer.hand,
                ],
                needTrashCards: activePlayer.needTrashCards,
            });
            const result = await matDialogRef.afterClosed().toPromise();
            if (result == null) {
                return;
            }
            this.gameInfoService.finishTurn(result);
        } else {
            this.gameInfoService.finishTurn({
                discard: [
                    ...activePlayer.discard,
                    ...activePlayer.board,
                    ...activePlayer.hand,
                ],
                trash: [],
            });
        }
    }

    trackById(index: number, player: { id: any }) {
        return player.id;
    }

    private async openConfirmDialog(title: string, textList: string[]) {
        const matDialogRef = this.dialogService.openConfirm({
            title,
            textList,
        });
        return await matDialogRef.afterClosed().toPromise();
    }

    private updatePlayerCards(player: ClankPlayerConfig | undefined) {
        if (player == null) {
            this.selectedPlayerCardsSubject.next([]);
            return;
        }
        let deck: ISelectedPlayerCardInfo[] = [];
        let board: ISelectedPlayerCardInfo[] = [];
        let discard: ISelectedPlayerCardInfo[] = [];
        let hand: ISelectedPlayerCardInfo[] = [];
        if (player.isFinish) {
            const allCards = [
                ...player.deck ?? [],
                ...player.board ?? [],
                ...player.discard ?? [],
                ...player.hand ?? [],
            ];
            discard = allCards.map((card, index) => {
                const data: ISelectedPlayerCardInfo = {
                    id: card.id,
                    card,
                    style: {
                        left: this.cardsWrapInfo.discardLeft,
                        top: `${this.cardsWrapInfo.deckTop}px`,
                        zIndex: `${index}`,
                    },
                    isOpen: true,
                    disablePopover: true,
                    classes: [],
                    action: {
                        name: 'Посмотреть карты',
                        eventName: null,
                        btnClass: 'btn-primary',
                        canUse: () => true,
                        callback: async () => {
                            this.gameDialogsService.openCardListComponent({
                                title: `Колода игрока ${player.name}`,
                                cards: allCards,
                            });
                        },
                    },
                };
                return data;
            });
        } else {
            deck = (player?.deck ?? []).map((card, index) => {
                const data: ISelectedPlayerCardInfo = {
                    id: card.id,
                    card,
                    style: {
                        left: this.cardsWrapInfo.deckLeft,
                        top: `${this.cardsWrapInfo.deckTop}px`,
                        zIndex: `${index}`,
                    },
                    isOpen: false,
                    disablePopover: true,
                    classes: [],
                };
                return data;
            });
            board = (player?.board ?? []).map((card, index) => {
                const data: ISelectedPlayerCardInfo = {
                    id: card.id,
                    card,
                    style: {
                        left: this.cardsWrapInfo.boardLeft,
                        top: `${this.cardsWrapInfo.deckTop}px`,
                        zIndex: `${index}`,
                    },
                    isOpen: true,
                    disablePopover: true,
                    classes: [],
                    action: {
                        name: 'Посмотреть карты',
                        eventName: null,
                        btnClass: 'btn-primary',
                        canUse: () => true,
                        callback: async () => {
                            this.gameDialogsService.openCardListComponent({
                                title: 'Список разыгранных на этом ходу карт',
                                cards: player.board,
                            });
                        },
                    },
                };
                return data;
            });
            discard = (player?.discard ?? []).map((card, index) => {
                const data: ISelectedPlayerCardInfo = {
                    id: card.id,
                    card,
                    style: {
                        left: this.cardsWrapInfo.discardLeft,
                        top: `${this.cardsWrapInfo.deckTop}px`,
                        zIndex: `${index}`,
                    },
                    isOpen: true,
                    disablePopover: true,
                    classes: [],
                    action: {
                        name: 'Посмотреть карты',
                        eventName: null,
                        btnClass: 'btn-primary',
                        canUse: () => true,
                        callback: async () => {
                            this.gameDialogsService.openCardListComponent({
                                title: 'Список сброшеных карт',
                                cards: player.discard,
                            });
                        },
                    },
                };
                return data;
            });
            hand = (player?.hand ?? []).map((card, index) => {
                const leftIndex = (index % this.cardsWrapInfo.cardsInRow);
                const topIndex = Math.floor(index / this.cardsWrapInfo.cardsInRow);
                const left = leftIndex * this.cardsWrapInfo.cardWidth * this.cardsWrapInfo.cardWidthKoef;
                const top = topIndex * this.cardsWrapInfo.cardHeight * this.cardsWrapInfo.cardWidthKoef + this.cardsWrapInfo.handTop;
                const data: ISelectedPlayerCardInfo = {
                    id: card.id,
                    card,
                    style: {
                        left: `${left}px`,
                        top: `${top}px`,
                        zIndex: `${index}`,
                    },
                    isOpen: true,
                    handIndex: index,
                    classes: [`card_container__hand`],
                    action: {
                        name: this.cardsService.getCardActionName(card, 'onUse'),
                        eventName: 'onUse',
                        btnClass: 'btn-primary',
                        canUse: () => this.activePlayer != null
                            && player.id === this.activePlayer.id
                            && this.activePlayer.id === this.currentPlayer?.id,
                        callback: async () => {
                            await this.gameInfoService.useCard(card, 'onUse');
                            this.changeDetectorRef.detectChanges();
                        },
                    },
                };
                return data;
            });
        }
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
            height: this.cardsWrapInfo.handTop + rowCount * this.cardsWrapInfo.cardHeight + cardsWrapPadding * 2,
        });
    }

}
