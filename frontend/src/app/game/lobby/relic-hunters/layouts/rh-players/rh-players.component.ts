import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    DestroyRef,
    ElementRef,
    HostBinding,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
    debounceTime,
    fromEvent,
    startWith,
} from 'rxjs';
import { SessionQuery } from 'src/app/session/session.query';
import { recordKeys } from 'src/app/shared/models/shared.types';
import { ToastService } from 'src/app/shared/services/toast.service';

import {
    faBan,
    faForwardStep,
    faHourglassStart,
    faStore,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { GamePlayerId } from '@shared/game/game-constants';
import { GameMovePayload } from '@shared/game/game-move';

import { LobbyService } from '../../../services/lobby.service';
import {
    RelicHuntersBenefitTaxonomy,
    RhBenefitComponentData,
} from '../../models/benefit';
import {
    RelicHuntersCardSettings,
    RelicHuntersCardTypeEnum,
} from '../../models/cards';
import { RhLobbyClient } from '../../models/game-lobby-types';
import { RhEventEndTurnArgs } from '../../models/game-move-args-types';
import { RelicHuntersHeroColorTaxonomy } from '../../models/hero';
import { RelicHuntersPlayerCardInfo } from '../../models/player';
import { RelicHuntersTileTypes } from '../../models/tile';

const handHeaderTop = RelicHuntersCardSettings.header + RelicHuntersCardSettings.height + RelicHuntersCardSettings.padding;

@Component({
    selector: 'app-rh-players',
    templateUrl: './rh-players.component.html',
    styleUrls: [
        './rh-btn-by-hover.scss',
        './rh-players.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class RhPlayersComponent implements AfterViewInit {

    client: RhLobbyClient = this.lobbyService.client;
    builder = this.client.game.builder;

    @HostBinding('style.--zoom-wrapper-opacity') opacity = 0;
    @HostBinding('style.--zoom-wrapper-zoom') zoom = 0;
    @HostBinding('style.--zoom-wrapper-width.px') width = RelicHuntersCardSettings.padding
        + RelicHuntersCardSettings.padding * 2
        + (RelicHuntersCardSettings.width + RelicHuntersCardSettings.padding) * 3;

    cardsWrapInfo = {
        cardStep: RelicHuntersCardSettings.cardStep,
        cardsInRow: Math.floor((this.width - RelicHuntersCardSettings.cardStep) / RelicHuntersCardSettings.cardStep),
        cardWidth: RelicHuntersCardSettings.width,
        cardHeight: RelicHuntersCardSettings.height,
        headerHeight: RelicHuntersCardSettings.header,
        deckTop: RelicHuntersCardSettings.header,
        deckLeft: RelicHuntersCardSettings.padding,
        boardLeft: RelicHuntersCardSettings.padding + RelicHuntersCardSettings.padding + RelicHuntersCardSettings.width,
        discardLeft: RelicHuntersCardSettings.padding + (RelicHuntersCardSettings.padding + RelicHuntersCardSettings.width) * 2,
        handHeaderTop: handHeaderTop,
        handTop: handHeaderTop + RelicHuntersCardSettings.header + RelicHuntersCardSettings.padding,
        tokenSize: 50,
    };

    players = computed(() => {
        const state = this.client.game.state();
        const players = this.client.game.players();
        const selectedPlayerId = this.client.game.selectedPlayerId();
        const user = this.sessionQuery.getValue();
        const builder = this.builder();

        if (state == null) {
            return [];
        }
        return [...players.values()].map((player) => {
            const playerInfo = state.game.playerMap[player.id];
            const isActive = player.id == state?.context.currentPlayerId;
            const isCurrent = player.id === user.id;
            const isSelected = player.id === selectedPlayerId;

            let deck = playerInfo.deck.map((card, index) => {
                const result: RelicHuntersPlayerCardInfo = {
                    id: card.id,
                    card,
                    style: {
                        left: `${this.cardsWrapInfo.deckLeft}px`,
                        top: `${this.cardsWrapInfo.deckTop}px`,
                        zIndex: `${index}`,
                    },
                    isOpen: false,
                    useOnlyActivePlayer: true,
                    actions: [],
                };
                return result;
            });
            let board = playerInfo.board.map((card, index) => {
                const result: RelicHuntersPlayerCardInfo = {
                    id: card.id,
                    card,
                    style: {
                        left: `${this.cardsWrapInfo.boardLeft}px`,
                        top: `${this.cardsWrapInfo.deckTop}px`,
                        zIndex: `${index}`,
                    },
                    isOpen: true,
                    useOnlyActivePlayer: false,
                    actions: [{
                        name: 'Посмотреть карты',
                        callback: async () => {
                            if (state == null || builder == null) {
                                return;
                            }

                            builder.openCardListModal({
                                title: 'Список разыгранных карт',
                                cards: board.map(p => p.card),
                                canSelect: false,
                            });
                        },
                    }],
                };
                return result;
            });
            let discard = playerInfo.discard.map((card, index) => {
                const result: RelicHuntersPlayerCardInfo = {
                    id: card.id,
                    card,
                    style: {
                        left: `${this.cardsWrapInfo.discardLeft}px`,
                        top: `${this.cardsWrapInfo.deckTop}px`,
                        zIndex: `${index}`,
                    },
                    isOpen: true,
                    useOnlyActivePlayer: false,
                    actions: [{
                        name: 'Посмотреть карты',
                        callback: async () => {
                            if (state == null || builder == null) {
                                return;
                            }

                            builder.openCardListModal({
                                title: 'Список сброшеных карт',
                                cards: discard.map(p => p.card),
                                canSelect: false,
                            });
                        },
                    }],
                };
                return result;
            });
            let hand = playerInfo.hand.map((card, index) => {
                const leftIndex = (index % this.cardsWrapInfo.cardsInRow);
                const topIndex = Math.floor(index / this.cardsWrapInfo.cardsInRow);
                const left = this.cardsWrapInfo.deckLeft + leftIndex * this.cardsWrapInfo.cardStep;
                const top = topIndex * this.cardsWrapInfo.cardHeight + this.cardsWrapInfo.handTop;
                const cardBenefit = card.type != RelicHuntersCardTypeEnum.assistant
                    ? card.benefit
                    : {
                        move: 0,
                    };
                const result: RelicHuntersPlayerCardInfo = {
                    id: card.id,
                    card,
                    style: {
                        left: `${left}px`,
                        top: `${top}px`,
                        zIndex: `${index}`,
                    },
                    // TODO: Добавить флаг разрешения просмотра
                    isOpen: isCurrent,
                    useOnlyActivePlayer: true,
                    actions: recordKeys(cardBenefit).flatMap(key => {
                        if (builder == null) {
                            return [];
                        }

                        const benefit: RhBenefitComponentData = {
                            key,
                            value: key !== 'tileType'
                                ? card.benefit[key] ?? 0
                                : 0,
                            tileType: key !== 'tileType'
                                ? void 0
                                : card.benefit[key]?.[0],
                            size: 50,
                            inlineView: true,
                        };
                        switch (key) {
                            case 'move': return {
                                benefit,
                                name: builder.moves.getMovePoints.name,
                                callback: async () => {
                                    const payload = builder.moves.getMovePoints.getPayload(
                                        {
                                            card,
                                            key,
                                            value: card.benefit[key] ?? 0,
                                        },
                                        user.id,
                                    );
                                    this.makeMove(payload);
                                },
                            }
                            case 'research': return {
                                benefit,
                                name: builder.moves.getResearchPoints.name,
                                callback: async () => {
                                    const payload = builder.moves.getResearchPoints.getPayload(
                                        {
                                            card,
                                            key,
                                            value: card.benefit[key] ?? 0,
                                        },
                                        user.id,
                                    );
                                    this.makeMove(payload);
                                },
                            }
                            case 'coins': return {
                                benefit,
                                name: builder.moves.getCoins.name,
                                callback: async () => {
                                    const payload = builder.moves.getCoins.getPayload(
                                        {
                                            card,
                                            key,
                                            value: card.benefit[key] ?? 0,
                                        },
                                        user.id,
                                    );
                                    this.makeMove(payload);
                                },
                            }
                            case 'draw': return {
                                benefit,
                                name: builder.moves.drawCards.name,
                                callback: async () => {
                                    const payload = builder.moves.drawCards.getPayload(
                                        {
                                            card,
                                            key,
                                            value: card.benefit[key] ?? 0,
                                        },
                                        user.id,
                                    );
                                    this.makeMove(payload);
                                },
                            }
                            case 'trash': return {
                                benefit,
                                name: builder.moves.trashCards.name,
                                callback: async () => {
                                    const payload = builder.moves.trashCards.getPayload(
                                        {
                                            card,
                                            key,
                                            value: card.benefit[key] ?? 0,
                                        },
                                        user.id,
                                    );
                                    this.makeMove(payload);
                                },
                            }
                            case 'rest': return {
                                benefit,
                                name: builder.moves.restCards.name,
                                callback: async () => {
                                    const payload = builder.moves.restCards.getPayload(
                                        {
                                            card,
                                            key,
                                            value: card.benefit[key] ?? 0,
                                        },
                                        user.id,
                                    );
                                    this.makeMove(payload);
                                },
                            }
                            case 'tileType': return {
                                benefit,
                                name: builder.moves.getTileType.name,
                                callback: async () => {
                                    const payload = builder.moves.getTileType.getPayload(
                                        {
                                            card,
                                            tileTypes: card.benefit[key] ?? [],
                                        },
                                        user.id,
                                    );
                                    this.makeMove(payload);
                                },
                            }
                        }
                    }),
                };
                return result;
            });


            const rowCount = Math.ceil(hand.length / this.cardsWrapInfo.cardsInRow);
            const playerArea = {
                width: this.width,
                height: this.cardsWrapInfo.handTop
                    + rowCount * this.cardsWrapInfo.cardHeight
                    + RelicHuntersCardSettings.padding,
            };

            return {
                id: player.id,
                data: player,
                info: playerInfo,
                isActive,
                isCurrent,
                isSelected,
                icon: isActive ? this.icons.active : this.icons.user,
                colorInfo: RelicHuntersHeroColorTaxonomy[playerInfo.color],
                playerArea,
                cards: [
                    ...deck,
                    ...board,
                    ...discard,
                    ...hand,
                ].sort((a, b) => a.card.index - b.card.index),
                benefits: recordKeys(playerInfo.benefit).flatMap(key => {
                    if (key === 'tileType') {
                        const tiles = playerInfo.benefit[key];
                        const tileMap = tiles.reduce((acc, tileType) => {
                            const item: RhBenefitComponentData = acc.get(tileType) ?? {
                                key,
                                value: 0,
                                size: 50,
                                tileType,
                                inlineView: false,
                            };
                            acc.set(tileType, {
                                ...item,
                                value: item.value + 1,
                            });
                            return acc;
                        }, new Map<RelicHuntersTileTypes, RhBenefitComponentData>);
                        return [...tileMap.values()];
                    };
                    const benefitInfo = RelicHuntersBenefitTaxonomy[key];
                    if (benefitInfo.column == null || !benefitInfo.showOnPlayerArea) {
                        return [];
                    }
                    const result: RhBenefitComponentData = {
                        key,
                        value: playerInfo.benefit[key],
                        size: 50,
                        inlineView: false,
                    };
                    return result;
                })
            };
        })
    });

    activePlayer = computed(() => {
        const players = this.players();
        return players.find(player => player.isActive);
    });

    currentPlayer = computed(() => {
        const players = this.players();
        return players.find(player => player.isCurrent);
    });

    selectedPlayer = computed(() => {
        const players = this.players();
        return players.find(player => player.isSelected);
    });

    isWatcher = computed(() => {
        const players = this.client.game.players();
        const user = this.sessionQuery.getValue();
        return !players?.has(user.id);
    });

    icons = {
        user: faUser,
        active: faHourglassStart,
        endTurn: faForwardStep,
        cancel: faBan,
        store: faStore,
    }

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private destroyRef: DestroyRef,
        private elementRef: ElementRef,
        private lobbyService: LobbyService,
        private sessionQuery: SessionQuery,
        private toastService: ToastService,
    ) {
        window['getMovePoints'] = async (value: number) => {
            const builder = this.builder();
            const selectedPlayerId = this.client.game.selectedPlayerId();

            if (builder == null || selectedPlayerId == null) {
                return;
            }

            const payload = builder.moves.getMovePoints.getPayload(
                {
                    card: null,
                    key: 'move',
                    value,
                },
                selectedPlayerId,
            );
            this.makeMove(payload);
        };
        window['getResearchPoints'] = async (value: number) => {
            const builder = this.builder();
            const selectedPlayerId = this.client.game.selectedPlayerId();

            if (builder == null || selectedPlayerId == null) {
                return;
            }

            const payload = builder.moves.getResearchPoints.getPayload(
                {
                    card: null,
                    key: 'research',
                    value,
                },
                selectedPlayerId,
            );
            this.makeMove(payload);
        };
    }

    async clickOnCard(popover: NgbPopover, card: RelicHuntersPlayerCardInfo) {
        const canUse = card.useOnlyActivePlayer
            ? this.selectedPlayer()?.isCurrent && this.selectedPlayer()?.isActive
            : true
        if (!card.actions.length || !canUse) {
            return;
        }
		if (popover.isOpen()) {
			popover.close();
            return;
		}
        if (card.actions.length === 1) {
            await card.actions[0].callback();
            return;
        }
        popover.open({
            actions: card.actions,
        });
	}

    openMarket() {
        const state = this.client.game.state();
        const builder = this.builder();

        if (state == null || builder == null) {
            return;
        }

        builder.openCardListModal({
            title: 'Рынок',
            cards: [
                ...Object.values(state.game.marketCards).flatMap(cards => cards),
                ...state.game.reservCards,
            ],
            canSelect: false,
        });
    }

    async endTurn() {
        const user = this.sessionQuery.getValue();
        const builder = this.builder();

        if (builder == null) {
            return;
        }

        const payload = builder.moves.endTurn.getPayload(
            {
                force: false,
                relicType: null,
            },
            user.id,
        );

        const moveResult = await this.client.game.makeMove(payload);
        if (!moveResult.success) {
            this.toastService.showWarn(moveResult.error);
            return;
        }

        if (!moveResult.saveState) {
            return
        }

        const endTurnArgs: RhEventEndTurnArgs = {
            force: true,
            options: {
                log: moveResult.state.log
            }
        };
        const eventResult = await this.client.game.makeEvent(
            {
                type: 'endTurn',
                args: endTurnArgs,
            },
            moveResult.state,
        );

        if (!eventResult.success) {
            this.toastService.showWarn(eventResult.error);
            return;
        }

        if (!eventResult.saveState) {
            return;
        }

        this.lobbyService.addState(eventResult.state);
    }

    undoState() {
        this.lobbyService.undoState();
    }

    trackById(index: number, cell: { id: any; }) {
        return cell.id;
    }

    onSelectPlayer(id: GamePlayerId) {
        this.client.game.selectedPlayerId.set(id);
    }

    ngAfterViewInit() {
        fromEvent(window, 'resize').pipe(
            // TODO: заменить changeDetectorRef на signalApi
            startWith(null),
            debounceTime(100),
            takeUntilDestroyed(this.destroyRef),
        ).subscribe(() => this.onResize());


        const selectedPlayerId = this.currentPlayer()?.id ?? this.players()[0].id;
        this.client.game.selectedPlayerId.set(selectedPlayerId);
        this.changeDetectorRef.markForCheck();
    }

    private onResize() {
        const clientWidth = this.elementRef.nativeElement.clientWidth;
        const zoomByWidth = clientWidth / (this.width);
        this.zoom = zoomByWidth;
        this.opacity = 1;
        this.changeDetectorRef.markForCheck();
    }

    private async makeMove(payload: GameMovePayload<any>) {
        const result = await this.client.game.makeMove(payload);
        if (!result.success) {
            this.toastService.showWarn(result.error);
            return;
        }

        if (result.saveState) {
            this.lobbyService.addState(result.state);
        }
    }

}
