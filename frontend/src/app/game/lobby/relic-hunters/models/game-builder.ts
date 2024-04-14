import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import * as lodash from 'lodash';
import { lastValueFrom } from 'rxjs';
import { GameRouteEnum } from 'src/app/game.routing.enum';
import { simpleShuffle } from 'src/app/game/similo/models/similo-dlc';
import { recordKeys } from 'src/app/shared/models/shared.types';

import { GameInfoStatusIdEnum } from '@shared/clank/clank-game.types';
import {
    GameConfigCreator,
    GameConfigCreatorConfig,
} from '@shared/game/game-config';
import { GamePlayerId } from '@shared/game/game-constants';
import { GameMoveCreator } from '@shared/game/game-move';
import { GamePhaseCreator } from '@shared/game/game-phase';
import { GameStageCreator } from '@shared/game/game-stage';
import { TurnOrderDefault } from '@shared/game/game-turn';

import { LobbyGameBuilder } from '../../models/lobby-games-store';
import { LobbyGamesIdEnum } from '../../models/lobby-games.enum';
import { RhCardListDialogComponent } from '../dialogs/rh-card-list-dialog/rh-card-list-dialog.component';
import {
    RhEndTurnDialogComponent,
    RhEndTurnDialogResult,
} from '../dialogs/rh-end-turn-dialog/rh-end-turn-dialog.component';
import { RhSettingsComponent } from '../layouts/rh-settings/rh-settings.component';
import {
    getRelicHuntersDeck,
    RelicHuntersCardInfo,
    RelicHuntersCardSettings,
    RelicHuntersCardTypeEnum,
} from './cards';
import {
    RelicHuntersCellInfo,
    RelicHuntersCellPosition,
    RelicHuntersCellTaxonomy,
} from './cell';
import { RelicHuntersSetupData } from './game-setup-data';
import { RelicHuntersGameType } from './game-type';
import {
    RelicHuntersMapEnum,
    RelicHuntersMapTaxonomy,
} from './map';
import { RelicHuntersPlayer } from './player';
import {
    RelicHuntersTileTypeList,
    RelicHuntersTileTypes,
} from './tile';

export enum RelicHuntersGameStagesIds {
    usingCards = 'usingCards',
    waiting = 'waiting',
}

export class RelicHuntersGameBuilder
    implements LobbyGameBuilder<RelicHuntersGameType, RelicHuntersSetupData> {

    private matDialog = inject(MatDialog);

    path: GameRouteEnum = GameRouteEnum.RelicHunters;

    config: GameConfigCreatorConfig = {
        id: LobbyGamesIdEnum.RelicHunters,
        name: 'Охотники за реликвиями'
    };

    setupDataSettings = RhSettingsComponent;

    moves = {
        getMovePoints: new GameMoveCreator<RelicHuntersGameType, {
            card: RelicHuntersCardInfo | null;
            value: number;
        }>({
            type: 'getMovePoints',
            name: 'Получить очки перемещения',
        }),
        getResearchPoints: new GameMoveCreator<RelicHuntersGameType, {
            card: RelicHuntersCardInfo | null;
            value: number;
        }>({
            type: 'getResearchPoints',
            name: 'Получить очки раскопки',
        }),
        getCoins: new GameMoveCreator<RelicHuntersGameType, {
            card: RelicHuntersCardInfo;
            value: number;
        }>({
            type: 'getCoins',
            name: 'Получить монеты',
        }),
        drawCards: new GameMoveCreator<RelicHuntersGameType, {
            card: RelicHuntersCardInfo;
            value: number;
        }>({
            type: 'drawCards',
            name: 'Добрать карты',
        }),
        trashCards: new GameMoveCreator<RelicHuntersGameType, {
            card: RelicHuntersCardInfo;
            value: number;
        }>({
            type: 'trashCards',
            name: 'Удалить карты',
        }),
        restCards: new GameMoveCreator<RelicHuntersGameType, {
            card: RelicHuntersCardInfo;
            value: number;
        }>({
            type: 'restCards',
            name: 'Замешать карты',
        }),
        getTileType: new GameMoveCreator<RelicHuntersGameType, {
            card: RelicHuntersCardInfo;
            tileTypes: RelicHuntersTileTypes[];
        }>({
            type: 'getTileType',
            name: 'Получить очки местности',
        }),
        useMovePoints: new GameMoveCreator<RelicHuntersGameType, {
            cellFrom: RelicHuntersCellInfo;
            cellTo: RelicHuntersCellInfo;
            player: RelicHuntersPlayer;
        }>({
            type: 'useMovePoints',
            name: 'Перемещение',
        }),
        useResearchPoints: new GameMoveCreator<RelicHuntersGameType, {
            cell: RelicHuntersCellInfo;
            player: RelicHuntersPlayer;
        }>({
            type: 'useResearchPoints',
            name: 'Раскопки',
        }),
        endTurn: new GameMoveCreator<RelicHuntersGameType, {
            force: boolean;
        }>({
            type: 'endTurn',
            name: 'Закончить ход',
        }),
    }

    phases = {
        main: new GamePhaseCreator<RelicHuntersGameType>({
            id: 'main',
            name: 'Основная фаза',
        }),
    };

    stages = {
        [RelicHuntersGameStagesIds.usingCards]: new GameStageCreator<RelicHuntersGameType>({
            id: RelicHuntersGameStagesIds.usingCards,
            name: 'Ход игрока',
        }),
        [RelicHuntersGameStagesIds.waiting]: new GameStageCreator<RelicHuntersGameType>({
            id: RelicHuntersGameStagesIds.waiting,
            name: 'Ожидание хода',
        }),
    };

    getInitialSetupData() {
        const result: RelicHuntersSetupData = {
            playerMap: {},
            mapId: RelicHuntersMapEnum.Basic
        };
        return result;
    }

    getConfig() {
        const gameCreator = new GameConfigCreator<
            RelicHuntersGameType,
            RelicHuntersSetupData
        >(this.config);
        return gameCreator.create({
            minPlayers: 2,
            disableUndo: true,
            setup: (context, setupData) => {
                const map = RelicHuntersMapTaxonomy[setupData.mapId];
                const allCards = getRelicHuntersDeck();
                const deckCards = simpleShuffle([...allCards.filter(p => p.type === RelicHuntersCardTypeEnum.deck)]);
                const assistantCards = simpleShuffle([...allCards.filter(p => p.type === RelicHuntersCardTypeEnum.assistant)]);
                const reservCards = simpleShuffle([...allCards.filter(p => p.type === RelicHuntersCardTypeEnum.reserv)]);
                const heroCards = allCards.filter(p => p.color != null);
                const game: RelicHuntersGameType = {
                    statusId: GameInfoStatusIdEnum.Started,
                    mapId: setupData.mapId,
                    firstPlayerIndex: lodash.random(0, context.playerCount - 1),
                    playerMap: Object.keys(setupData.playerMap).reduce((acc, playerId) => {
                        const color = setupData.playerMap[playerId].color;
                        const player: RelicHuntersPlayer = {
                            ...setupData.playerMap[playerId],
                            deck: simpleShuffle([...heroCards.filter(p => p.color === color)]),
                            hand: [],
                            board: [],
                            discard: [],
                            trash: [],
                            artifacts: [],
                            usedCellIds: [],
                            benefit: {
                                move: 0,
                                research: 0,
                                coins: 0,
                                draw: 0,
                                trash: 0,
                                rest: 0,
                                tileType: [],
                            },
                        };
                        this.drawCards(player, 5);
                        return {
                            ...acc,
                            [playerId]: player,
                        }
                    }, {} as Record<GamePlayerId, RelicHuntersPlayer>),
                    cells: [],
                    deckCards,
                    assistantCards,
                    reservCards,
                    marketCards: {},
                    winner: null,
                };

                const levels = simpleShuffle([
                    ...simpleShuffle([...RelicHuntersCellTaxonomy.level1]),
                    ...simpleShuffle([...RelicHuntersCellTaxonomy.level2]),
                    ...simpleShuffle([...RelicHuntersCellTaxonomy.level3]),
                ]);


                let cellId = 0;
                let rowIndex = -1;
                game.cells = map.levels.flatMap((levelData, levelIndex) => {
                    const level = levelIndex + 1;
                    let tiles = level <= 3
                        ? levels.filter(tile => tile.level === level)
                        : RelicHuntersCellTaxonomy.relic.filter(tile => {
                            return tile.relicType != null && !levelData.excludeRelicTypes.includes(tile.relicType);
                        });
                    if (levelData.hasRelic) {
                        for (const tileType of RelicHuntersTileTypeList) {
                            const index = tiles.findIndex(p => p.tileType === tileType);
                            const relict = RelicHuntersCellTaxonomy.relic.find(p => p.tileType === tileType);
                            if (relict != null && index >= 0) {
                                tiles[index] = relict;
                            }
                        }
                        tiles = simpleShuffle([...tiles]);
                    }
                    return levelData.rows.flatMap((rowData) => {
                        rowIndex++;
                        return Array(map.columnCount).fill(0).map((_, columnIndex) => {
                            const position: RelicHuntersCellPosition = {
                                row: rowIndex,
                                column: columnIndex,
                            };
                            const isCamp = map.campPosition.row === position.row
                                && map.campPosition.column === position.column;
                            const isVisible = rowData.visibleCells.start <= columnIndex
                                && rowData.visibleCells.end >= columnIndex;
                            const hasVulcan = rowData.vulcanColumns.includes(columnIndex);
                            const tile = isVisible && !hasVulcan
                                ? (
                                    isCamp
                                        ? RelicHuntersCellTaxonomy.camp
                                        : tiles.pop()
                                )
                                : null;
                            if (tile != null) {
                                const cell: RelicHuntersCellInfo = {
                                    ...tile,
                                    id: cellId++,
                                    isVisible,
                                    isCamp,
                                    isOpen: isCamp,
                                    hasRelict: tile.relicType != null,
                                    position,
                                    level,
                                    players: isCamp
                                        ? Object.keys(setupData.playerMap)
                                        : []
                                }
                                return cell;
                            }
                            const vulcanCell: RelicHuntersCellInfo = {
                                ...RelicHuntersCellTaxonomy.vulcan,
                                id: cellId++,
                                isVisible,
                                isCamp: false,
                                isOpen: true,
                                hasRelict: false,
                                position,
                                level,
                                players: [],
                            };
                            return vulcanCell;
                        });
                    })
                });
                return this.updateMarket(game);
            },
            endIf: (options) => {
                if (options.game.statusId != GameInfoStatusIdEnum.Started) {
                    return false;
                }
                return Object.values(options.game.playerMap).some(player => player.artifacts.length === 2);
            },
            onEnd: (options) => {
                const winner = Object.values(options.game.playerMap).find(player => player.artifacts.length === 2) ?? null;
                const result: RelicHuntersGameType = {
                    ...options.game,
                    statusId: GameInfoStatusIdEnum.Finished,
                    winner: winner,
                };
                return result;
            },
            phases: {
                ...this.phases.main.create({
                    isStart: true,
                    onBegin: (options) => {
                        const game = lodash.cloneDeep(options.game);
                        const coins = [0, 1, 2, 4];
                        const firstPlayerIndex = options.context.playerIdsOrder.length - options.game.firstPlayerIndex;
                        options.context.playerIdsOrder
                            .forEach((playerId, index) => {
                                const orderIndex = (firstPlayerIndex + index) % options.context.playerIdsOrder.length;
                                game.playerMap[playerId].benefit.coins = coins[orderIndex] ?? 0;
                            });
                        return game;
                    },
                    turn: {
                        endIf: (options) => {
                            const currentPlayer = options.context.activePlayers?.[options.context.currentPlayerId];
                            return currentPlayer == null || currentPlayer.stage == null || currentPlayer.stage === this.stages.waiting.id;
                        },
                        onEnd: (options) => {
                            const game = lodash.cloneDeep(options.game);
                            const player = game.playerMap[options.context.currentPlayerId];
                            if (player.board.length > 0) {
                                player.discard = [
                                    ...player.discard,
                                    ...player.board,
                                ];
                                player.board = [];
                            }
                            return this.updateMarket(game);
                        },
                        activePlayers: [{
                            currentPlayer: {
                                stage: this.stages.usingCards.id,
                            },
                            others: {
                                stage: this.stages.waiting.id,
                                isFinished: true,
                            },
                        }],
                        order: {
                            first: (options) => options.game.firstPlayerIndex,
	                        next: TurnOrderDefault.next,
                        },
                        stages: {
                            ...this.stages.usingCards.create({
                                moves: {
                                    ...this.moves.getMovePoints.create({
                                        undoable: true,
                                        noLimit: true,
                                        callback: async (options, args) => {
                                            const game = lodash.cloneDeep(options.game);
                                            const player = game.playerMap[options.playerId];
                                            if (args.card != null) {
                                                this.useCard(player, args.card);
                                            }
                                            player.benefit.move += args.value;
                                            return {
                                                success: true,
                                                saveState: true,
                                                game,
                                            }
                                        }
                                    }),
                                    ...this.moves.getResearchPoints.create({
                                        undoable: true,
                                        noLimit: true,
                                        callback: async (options, args) => {
                                            const game = lodash.cloneDeep(options.game);
                                            const player = game.playerMap[options.playerId];
                                            if (args.card != null) {
                                                this.useCard(player, args.card);
                                            }
                                            player.benefit.research += args.value;
                                            return {
                                                success: true,
                                                saveState: true,
                                                game,
                                            }
                                        }
                                    }),
                                    ...this.moves.getCoins.create({
                                        undoable: true,
                                        noLimit: true,
                                        callback: async (options, args) => {
                                            const game = lodash.cloneDeep(options.game);
                                            const player = game.playerMap[options.playerId];
                                            this.useCard(player, args.card);
                                            player.benefit.coins += args.value;
                                            return {
                                                success: true,
                                                saveState: true,
                                                game,
                                            }
                                        }
                                    }),
                                    ...this.moves.drawCards.create({
                                        undoable: true,
                                        noLimit: true,
                                        callback: async (options, args) => {
                                            const game = lodash.cloneDeep(options.game);
                                            const player = game.playerMap[options.playerId];
                                            this.useCard(player, args.card);
                                            this.drawCards(player, args.value);
                                            return {
                                                success: true,
                                                saveState: true,
                                                game,
                                            }
                                        }
                                    }),
                                    ...this.moves.trashCards.create({
                                        undoable: true,
                                        noLimit: true,
                                        callback: async (options, args) => {
                                            const game = lodash.cloneDeep(options.game);
                                            const player = game.playerMap[options.playerId];
                                            this.useCard(player, args.card);
                                            const success = await this.openTrashCardsModal(player, args.value);
                                            if (!success) {
                                                return {
                                                    success,
                                                    message: 'Отмена удаления',
                                                }
                                            }
                                            return {
                                                success: true,
                                                saveState: true,
                                                game,
                                            }
                                        }
                                    }),
                                    ...this.moves.restCards.create({
                                        undoable: true,
                                        noLimit: true,
                                        callback: async (options, args) => {
                                            const game = lodash.cloneDeep(options.game);
                                            const player = game.playerMap[options.playerId];
                                            this.useCard(player, args.card);
                                            const success = await this.openRestCardsModal(player, args.value);
                                            if (!success) {
                                                return {
                                                    success,
                                                    message: 'Отмена отдыха',
                                                }
                                            }
                                            return {
                                                success: true,
                                                saveState: true,
                                                game,
                                            }
                                        }
                                    }),
                                    ...this.moves.getTileType.create({
                                        undoable: true,
                                        noLimit: true,
                                        callback: async (options, args) => {
                                            const game = lodash.cloneDeep(options.game);
                                            const player = game.playerMap[options.playerId];
                                            this.useCard(player, args.card);
                                            args.tileTypes.forEach(p => {
                                                player.benefit.tileType.push(p);
                                            });
                                            return {
                                                success: true,
                                                saveState: true,
                                                game,
                                            }
                                        }
                                    }),
                                    ...this.moves.useMovePoints.create({
                                        undoable: true,
                                        noLimit: true,
                                        callback: async (options, args) => {
                                            const game = lodash.cloneDeep(options.game);
                                            const moveCost = args.cellTo.isOpen
                                                ? args.cellTo.moveCostOpen
                                                : args.cellTo.moveCostClose;
                                            const tileTypeIndex = args.player.benefit.tileType.findIndex(p => p === args.cellTo.tileType);
                                            if (tileTypeIndex === -1 && args.player.benefit.move < moveCost) {
                                                return {
                                                    success: false,
                                                    message: 'Недостаточно очков передвижения'
                                                }
                                            }
                                            const cellFrom = game.cells.find(p => p.id === args.cellFrom.id);
                                            if (cellFrom == null) {
                                                return {
                                                    success: false,
                                                    message: 'Ячейка игрока не найдена'
                                                }
                                            }

                                            const cellTo = game.cells.find(p => p.id === args.cellTo.id);
                                            if (cellTo == null) {
                                                return {
                                                    success: false,
                                                    message: 'Ячейка для перемещения не найдена'
                                                }
                                            }

                                            cellFrom.players = cellFrom.players.filter(id => id != args.player.id);
                                            cellTo.players.push(args.player.id);

                                            if (tileTypeIndex !== -1) {
                                                args.player.benefit.tileType.splice(tileTypeIndex, 1);
                                            }
                                            const player = game.playerMap[args.player.id];
                                            if (tileTypeIndex !== -1) {
                                                player.benefit.tileType.splice(tileTypeIndex, 1);
                                            } else {
                                                player.benefit.move -= moveCost;
                                            }
                                            if (!cellTo.isOpen) {
                                                cellTo.isOpen = true;

                                                if (cellTo.researchCost === 0) {
                                                    const success = await this.getCellBenefits(cellTo, player);
                                                    if (!success) {
                                                        return {
                                                            success,
                                                            message: 'Отмена',
                                                        };
                                                    }
                                                }
                                            }
                                            return {
                                                success: true,
                                                saveState: true,
                                                game,
                                            }
                                        }
                                    }),
                                    ...this.moves.useResearchPoints.create({
                                        undoable: true,
                                        noLimit: true,
                                        callback: async (options, args) => {
                                            const game = lodash.cloneDeep(options.game);
                                            if (args.cell.researchCost == 0) {
                                                return {
                                                    success: false,
                                                    message: 'Только первый игрок, перевернувший жетон, может получить награду',
                                                }
                                            }
                                            const tileTypeIndex = args.player.benefit.tileType.findIndex(p => p === args.cell.tileType);

                                            if (tileTypeIndex === -1 && args.cell.researchCost > args.player.benefit.research) {
                                                return {
                                                    success: false,
                                                    message: 'Недостаточно очков раскопки'
                                                }
                                            }

                                            const cell = game.cells.find(p => p.id === args.cell.id);
                                            if (cell == null) {
                                                return {
                                                    success: false,
                                                    message: 'Ячейка для перемещения не найдена'
                                                }
                                            }

                                            const player = game.playerMap[args.player.id];
                                            player.usedCellIds.push(cell.id);
                                            if (tileTypeIndex !== -1) {
                                                player.benefit.tileType.splice(tileTypeIndex, 1);
                                            } else {
                                                player.benefit.research -= cell.researchCost;
                                            }

                                            if (cell.hasRelict && cell.relicType != null) {
                                                player.artifacts.push(cell.relicType);
                                                cell.hasRelict = false;
                                                return {
                                                    success: true,
                                                    saveState: true,
                                                    game,
                                                }
                                            }

                                            const success = await this.getCellBenefits(cell, player);
                                            if (!success) {
                                                return {
                                                    success,
                                                    message: 'Отмена',
                                                };
                                            }
                                            return {
                                                success: true,
                                                saveState: true,
                                                game,
                                            }
                                        }
                                    }),
                                    ...this.moves.endTurn.create({
                                        noLimit: true,
                                        undoable: false,
                                        callback: async (options, args) => {
                                            const game = lodash.cloneDeep(options.game);
                                            const player = game.playerMap[options.playerId];
                                            if (!args.force) {
                                                const success = await this.openDiscardModal(player);
                                                if (!success) {
                                                    return {
                                                        success: false,
                                                        message: 'Игрок отменил действие',
                                                    };
                                                }
                                                const count = 5 - player.hand.length;
                                                this.drawCards(player, count);
                                            }

                                            const result = await this.openEndTurnModal(game, player, args.force);
                                            if (result == null) {
                                                return {
                                                    success: false,
                                                    message: 'Игрок отменил действие',
                                                };
                                            }

                                            if (result.value || args.force) {
                                                const cellFrom = game.cells.find(p => p.players.includes(player.id));
                                                if (cellFrom == null) {
                                                    return {
                                                        success: false,
                                                        message: 'Ячейка игрока не найдена'
                                                    }
                                                }

                                                const cellTo = game.cells.find(p => p.isCamp);
                                                if (cellTo == null) {
                                                    return {
                                                        success: false,
                                                        message: 'Ячейка для перемещения не найдена'
                                                    }
                                                }

                                                cellFrom.players = cellFrom.players.filter(id => id != player.id);
                                                cellTo.players.push(player.id);

                                                const assistantCards = args.force
                                                    ? [
                                                        game.assistantCards.pop(),
                                                        game.assistantCards.pop(),
                                                    ].filter((p): p is RelicHuntersCardInfo => p != null)
                                                    : [];
                                                player.deck = simpleShuffle([
                                                    ...player.deck,
                                                    ...player.hand,
                                                    ...player.board,
                                                    ...player.discard,
                                                    ...result.selectedCards,
                                                    ...assistantCards,
                                                ]);
                                                player.hand = [];
                                                player.board = [];
                                                player.discard = [];
                                                result.selectedCards.forEach((card) => {
                                                    if (card.type === RelicHuntersCardTypeEnum.reserv) {
                                                        game.reservCards = game.reservCards.filter(p => p.id !== card.id);
                                                    } else {
                                                        game.marketCards[card.index] = game.marketCards[card.index].filter(p => p.id !== card.id);
                                                        if (game.marketCards[card.index].length === 0) {
                                                            delete game.marketCards[card.index];
                                                        }
                                                    }
                                                });

                                                player.benefit.coins -= result.coins;
                                                this.drawCards(player, 5);
                                            }

                                            player.benefit.move = 0;
                                            player.benefit.research = 0;
                                            player.benefit.tileType = [];
                                            player.usedCellIds = [];
                                            return {
                                                success: true,
                                                saveState: true,
                                                game,
                                            }
                                        }
                                    })
                                },
                            }),
                            ...this.stages.waiting.create({}),
                        },
                    },
                }),
            },
        })
    }

    private updateMarket(game: RelicHuntersGameType) {
        const newGame = lodash.cloneDeep(game);
        while (Object.keys(newGame.marketCards).length < 4) {
            const card = newGame.deckCards.pop();
            if (card == null) {
                break;
            }
            newGame.marketCards[card.index] = [
                ...newGame.marketCards[card.index] ?? [],
                card,
            ];
        }
        return newGame;
    }

    private drawCards(player: RelicHuntersPlayer, count: number) {
        while (count > 0) {
            const card = player.deck.pop();
            if (card != null) {
                player.hand.push(card);
            }
            count--;
        }
    }

    private async openDiscardModal(player: RelicHuntersPlayer) {
        if (!player.hand.length) {
            return true;
        }
        const cards = await this.openCardListModal({
            title: 'Сброс карт',
            cards: player.hand,
            canSelect: true,
            submitNameWithSelected: 'Сборсить',
            submitNameWithoutSelected: 'Продолжить без сброса',
            benefitType: null,
            limit: null,
        });
        if (cards == null) {
            return false;
        }

        cards.forEach(card => this.useCard(player, card));
        return true;
    }

    private useCard(player: RelicHuntersPlayer, card: RelicHuntersCardInfo) {
        player.hand = player.hand.filter(p => p.id !== card.id);
        player.board.push(card);
    }

    private async openTrashCardsModal(player: RelicHuntersPlayer, count: number) {
        const cards = await this.openCardListModal({
            title: 'Удаление карт',
            cards: [
                ...player.hand,
                ...player.board,
                ...player.discard,
            ],
            canSelect: true,
            submitNameWithSelected: 'Удалить',
            submitNameWithoutSelected: 'Продолжить без удаления',
            benefitType: 'trash',
            limit: count,
        });
        if (cards == null) {
            return false;
        }

        this.trashCards(player, cards);
        return true;
    }

    private trashCards(player: RelicHuntersPlayer, cards: RelicHuntersCardInfo[]) {
        cards.forEach((card) => {
            player.hand = player.hand.filter(p => p.id !== card.id);
            player.board = player.board.filter(p => p.id !== card.id);
            player.discard = player.discard.filter(p => p.id !== card.id);
            player.trash.push(card);
        });
    }

    private async openRestCardsModal(player: RelicHuntersPlayer, count: number) {
        const cards = await this.openCardListModal({
            title: 'Восстановление карт',
            cards: player.discard,
            canSelect: true,
            submitNameWithSelected: 'Восстановить',
            submitNameWithoutSelected: 'Продолжить без восстановления',
            benefitType: 'rest',
            showNumber: true,
            limit: count,
        });
        if (cards == null) {
            return false;
        }

        this.restCards(player, cards);
        return true;
    }

    private restCards(player: RelicHuntersPlayer, cards: RelicHuntersCardInfo[]) {
        cards.forEach((card) => {
            player.discard = player.discard.filter(p => p.id !== card.id);
            player.deck.unshift(card);
        })
    }

    private async openEndTurnModal(
        game: RelicHuntersGameType,
        player: RelicHuntersPlayer,
        force: boolean,
    ) {
        const width = RelicHuntersCardSettings.padding
            + 5 * (RelicHuntersCardSettings.width + RelicHuntersCardSettings.padding);
        const dialogRef = this.matDialog.open<
            RhEndTurnDialogComponent,
            RhEndTurnDialogComponent['data'],
            RhEndTurnDialogResult
        >(
            RhEndTurnDialogComponent,
            {
                data: {
                    game,
                    player,
                    force,
                },
                width: `${width}px`,
            },
        );

        return await lastValueFrom(dialogRef.afterClosed());
    }

    async openCardListModal(data: RhCardListDialogComponent['data']) {
        const width = RelicHuntersCardSettings.padding
            + 5 * (RelicHuntersCardSettings.width + RelicHuntersCardSettings.padding);
        const dialogRef = this.matDialog.open<
            RhCardListDialogComponent,
            RhCardListDialogComponent['data'],
            RelicHuntersCardInfo[]
        >(
            RhCardListDialogComponent,
            {
                data,
                width: `${width}px`,
            },
        );

        return await lastValueFrom(dialogRef.afterClosed());
    }

    private async getCellBenefits(cell: RelicHuntersCellInfo, player: RelicHuntersPlayer): Promise<boolean> {
        for (const key of recordKeys(cell.benefit)) {
            if (key == 'tileType') {
                continue;
            }
            const value = cell.benefit[key] ?? 0;
            if (key == 'draw') {
                this.drawCards(player, value);
                continue;
            }
            if (key == 'trash') {
                const success = await this.openTrashCardsModal(player, value);
                if (!success) {
                    return success;
                }
                continue;
            }
            if (key == 'rest') {
                const success = await this.openRestCardsModal(player, value);
                if (!success) {
                    return success;
                }
                continue;
            }
            player.benefit[key] += value;
        }
        return true;
    }

}
