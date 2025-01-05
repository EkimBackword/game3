import * as lodash from 'lodash';
import { GameRouteEnum } from 'src/app/game.routing.enum';
import { simpleShuffle } from 'src/app/game/similo/models/similo-dlc';

import { GameInfoStatusIdEnum } from '@shared/clank/clank-game.types';
import {
    GameConfigCreator,
    GameConfigCreatorConfig,
} from '@shared/game/game-config';
import { GameMoveCreator } from '@shared/game/game-move';
import { GamePhaseCreator } from '@shared/game/game-phase';
import { GameStageCreator } from '@shared/game/game-stage';

import { LobbyGameBuilder } from '../../models/lobby-games-store';
import { LobbyGamesIdEnum } from '../../models/lobby-games.enum';
import { EscapeFromAtlantisTileInfo } from '../components/escape-from-atlantis-tile/escape-from-atlantis-tile';
import { EscapeFromAtlantisSettingsComponent } from '../layouts/escape-from-atlantis-settings/escape-from-atlantis-settings.component';
import {
    defaultEscapeFromAtlantisColumnConfig,
    EscapeFromAtlantisCellInfo,
} from './cells';
import {
    EscapeFromAtlantisEndConditionEnum,
    EscapeFromAtlantisWinConditionEnum,
} from './conditions';
import {
    EscapeFromAtlantisGameType,
    EscapeFromAtlantisTakedMeeple,
} from './game-type';
import {
    defaultEscapeFromAtlantisPlayerMeepleValues,
    EscapeFromAtlantisCellMeepleType,
    EscapeFromAtlantisGameMeepleBaseInfo,
    EscapeFromAtlantisGameMeepleIdEnum,
    EscapeFromAtlantisGameMeepleIds,
    EscapeFromAtlantisGameMeepleTaxonomy,
    EscapeFromAtlantisPlayerMeepleBaseInfo,
} from './meeples';
import { EscapeFromAtlantisPlayerResult } from './player';
import { EscapeFromAtlantisSetupData } from './setup-data';
import {
    defaultEscapeFromAtlantisTileConfig,
    EscapeFromAtlantisTileActionIdEnum,
    EscapeFromAtlantisTileBaseInfo,
} from './tiles';

export class EscapeFromAtlantisGameBuilder
    implements LobbyGameBuilder<EscapeFromAtlantisGameType, EscapeFromAtlantisSetupData> {

    path: GameRouteEnum = GameRouteEnum.EscapeFromAtlantis;

    config: GameConfigCreatorConfig = {
        id: LobbyGamesIdEnum.EscapeFromAtlantis,
        name: 'Последний день атлантиды'
    };

    setupDataSettings = EscapeFromAtlantisSettingsComponent;

    moves = {
        useTile: new GameMoveCreator<EscapeFromAtlantisGameType, {
            game: EscapeFromAtlantisGameType,
        }>({
            type: 'useTile',
            name: 'Сыграть плитку',
        }),
        getTile: new GameMoveCreator<EscapeFromAtlantisGameType, {
            tile: EscapeFromAtlantisTileInfo,
        }>({
            type: 'getTile',
            name: 'Получить плитку',
        }),
        takeMeeple: new GameMoveCreator<
            EscapeFromAtlantisGameType,
            EscapeFromAtlantisTakedMeeple
        >({
            type: 'takeMeeple',
            name: 'Взять исследователя',
        }),
        placeMeeple: new GameMoveCreator<EscapeFromAtlantisGameType, {
            cellId: EscapeFromAtlantisCellInfo['id'],
        }>({
            type: 'placeMeeple',
            name: 'Поместить исследователя на плитку',
        }),
    }

    phases = {
        prepare: new GamePhaseCreator<EscapeFromAtlantisGameType>({
            id: 'prepare',
            name: 'Фаза подготовки',
        }),
        survive: new GamePhaseCreator<EscapeFromAtlantisGameType>({
            id: 'survive',
            name: 'Фаза спасения',
        })
    };

    stages = {
        // 1) Фаза подготовки
        // Взять исследователя
        // Разместить исследователя
        // Взять лодку
        // Разместить лодку
        // 2) Фаза спасения
        // Сыграть плитку
        // Взять исследователя
        // Разместить исследователя
        // Взять лодку
        // Разместить лодку
        // Взять плитку
        // Взять монстра
        // Передвинуть монстра

        prepare: new GameStageCreator<EscapeFromAtlantisGameType>({
            id: 'prepare',
            name: 'Подготовка',
        }),
        useTile: new GameStageCreator<EscapeFromAtlantisGameType>({
            id: 'useTile',
            name: 'Использование плитки',
        }),
        playerMove: new GameStageCreator<EscapeFromAtlantisGameType>({
            id: 'playerMove',
            name: 'Передвижение людей и/или лодки',
        }),
        getTile: new GameStageCreator<EscapeFromAtlantisGameType>({
            id: 'getTile',
            name: 'Получение плитки',
        }),
        monsterMove: new GameStageCreator<EscapeFromAtlantisGameType>({
            id: 'monsterMove',
            name: 'Передвижение монстра',
        }),
        wait: new GameStageCreator<EscapeFromAtlantisGameType>({
            id: 'wait',
            name: 'Ожидание',
        }),
    };

    getInitialSetupData() {
        const result: EscapeFromAtlantisSetupData = {
            playerMap: {},
            useTwoMeeples: false,
            endCondition: EscapeFromAtlantisEndConditionEnum.Basic,
            winCondition: EscapeFromAtlantisWinConditionEnum.Basic,
        };
        return result;
    }

    getConfig() {
        const gameCreator = new GameConfigCreator<
            EscapeFromAtlantisGameType,
            EscapeFromAtlantisSetupData
        >(this.config);
        return gameCreator.create({
            minPlayers: 2,
            disableUndo: true,
            setup: (context, setupData) => {
                let playerMeepleId = 0;
                let gameMeepleId = 0;
                const game: EscapeFromAtlantisGameType = {
                    ...setupData,
                    statusId: GameInfoStatusIdEnum.Created,
                    cells: [],
                    meeplesReserv: [],
                    playersResult: [],
                    winners: [],
                    takedMeeple: null,
                };

                let tileId = 0;
                const tiles = defaultEscapeFromAtlantisTileConfig.reduce<EscapeFromAtlantisTileBaseInfo[]>((list, config) => {
                    return [
                        ...list,
                        ...Array(config.count).fill(0).map(() => {
                            const tile: EscapeFromAtlantisTileBaseInfo = {
                                id: tileId++,
                                typeId: config.typeId,
                                actionId: config.actionId,
                            };
                            return tile;
                        })
                    ];
                }, []);
                const shuffledTiles = simpleShuffle(tiles);

                Object.values(game.playerMap).forEach(player => {
                    return defaultEscapeFromAtlantisPlayerMeepleValues.map(value => {
                        const meeple: EscapeFromAtlantisPlayerMeepleBaseInfo = {
                            type: EscapeFromAtlantisCellMeepleType.PlayerMeeple,
                            id: playerMeepleId++,
                            value,
                            color: player.color,
                        };
                        player.meeples.push(meeple);
                    });
                });

                EscapeFromAtlantisGameMeepleIds.forEach(meepleId => {
                    const meepleInfo = EscapeFromAtlantisGameMeepleTaxonomy[meepleId];
                    const players = Object.values(game.playerMap);
                    const countMeepleForPlayer = meepleInfo.userCount * players.length;
                    Array(meepleInfo.count).fill(0).forEach((_, index) => {
                        const meeple: EscapeFromAtlantisGameMeepleBaseInfo = {
                            type: EscapeFromAtlantisCellMeepleType.GameMeeple,
                            id: gameMeepleId++,
                            meepleId,
                            meeples: [],
                        };
                        if (index < countMeepleForPlayer) {
                            players[Math.floor(index / 2)].meeples.push(meeple);
                        } else {
                            game.meeplesReserv.push(meeple);
                        }
                    })
                });

                let cellId = 0;
                game.cells = defaultEscapeFromAtlantisColumnConfig.reduce<EscapeFromAtlantisCellInfo[]>((
                    cells,
                    columnConfig,
                    column
                ) => {
                    const columnCells = Array(columnConfig.count).fill(0).map((_, row) => {
                        const cell: EscapeFromAtlantisCellInfo = {
                            id: cellId++,
                            position: {
                                column,
                                row,
                            },
                            isVisible: row >= columnConfig.visibleRange[0] && row <= columnConfig.visibleRange[1],
                            isStartCell: columnConfig.startRange != null
                                ? row >= columnConfig.startRange[0] &&
                                  row <= columnConfig.startRange[1] &&
                                  row != columnConfig.seaMonsterRowIndex
                                : false,
                            isFinishCell: columnConfig.hasFinish && [
                                0,
                                columnConfig.count - 1
                            ].includes(row),
                            startMonster: columnConfig.seaMonsterRowIndex === row
                                ? EscapeFromAtlantisGameMeepleIdEnum.SeaMonster
                                : null,
                            tile: null,
                            meeples: [],
                        };
                        const tile = cell.isStartCell
                            ? shuffledTiles.pop()
                            : null;
                        if (tile != null) {
                            cell.tile = tile;
                        }
                        const monsterIndex = cell.startMonster != null
                            ? game.meeplesReserv.findIndex(p => p.type === EscapeFromAtlantisCellMeepleType.GameMeeple && p.meepleId === cell.startMonster)
                            : null
                        if (monsterIndex!= null && monsterIndex !== -1) {
                            cell.meeples = game.meeplesReserv.splice(monsterIndex, 1);
                        }
                        return cell;
                    })
                    return [
                        ...cells,
                        ...columnCells,
                    ];
                }, []);
                return {
                    game,
                    payloads: [],
                };
            },
            endIf: (options) => {
                if (options.game.statusId != GameInfoStatusIdEnum.Started) {
                    return false;
                }
                switch (options.game.endCondition) {
                    case EscapeFromAtlantisEndConditionEnum.LastMeeple: {
                        const hasMeeplesOnMap = options.game.cells.some(cell => {
                            return !cell.isFinishCell
                                && cell.meeples.some(p => p.type === EscapeFromAtlantisCellMeepleType.PlayerMeeple);
                        });
                        return !hasMeeplesOnMap;
                    }
                    case EscapeFromAtlantisEndConditionEnum.LastTile: {
                        const hasTilesOnMap = options.game.cells.some(cell => cell.tile != null);
                        return !hasTilesOnMap;
                    }
                    default: {
                        const cellWithVulcanTile = options.game.cells.find(cell => {
                            return cell.tile != null && cell.tile.actionId === EscapeFromAtlantisTileActionIdEnum.Vulcan;
                        });
                        return cellWithVulcanTile != null;
                    }
                }
            },
            onEnd: (options) => {
                const winCondition = options.game.winCondition;
                const playerMeeples = options.game.cells
                    .filter(cell => cell.isFinishCell)
                    .flatMap(cell => cell.meeples)
                    .filter((meeple): meeple is EscapeFromAtlantisPlayerMeepleBaseInfo => {
                        return meeple.type === EscapeFromAtlantisCellMeepleType.PlayerMeeple;
                    });
                const players = Object.values(options.game.playerMap).map(player => {
                    const meeples = playerMeeples.filter((meeple) => meeple.color = player.color);
                    const points = winCondition === EscapeFromAtlantisWinConditionEnum.Basic
                        ? lodash.sumBy(meeples, p => p.value)
                        : meeples.length;
                    const result: EscapeFromAtlantisPlayerResult = {
                        ...player,
                        points,
                    };
                    return result;
                });
                const sortedPlayers = lodash.orderBy(players, p => p.points, 'desc');
                const winner = lodash.maxBy(players, p => p.points);
                const result: EscapeFromAtlantisGameType = {
                    ...options.game,
                    statusId: GameInfoStatusIdEnum.Finished,
                    winners: winner != null
                        ? sortedPlayers.filter(p => p.points === winner?.points)
                        : [],
                    playersResult: sortedPlayers,
                };
                return {
                    game: result,
                    payloads: [],
                };
            },
            phases: {
                ...this.phases.prepare.create({
                    isStart: true,
                    turn: {
                        activePlayers: [{
                            currentPlayer: {
                                stage: this.stages.prepare.id,
                                minMoves: (context) => 1,
                                maxMoves: (context) => 1,
                            },
                            others: {
                                stage: this.stages.wait.id,
                                isFinished: true,
                            },
                        }],
                        stages: {
                            ...this.stages.prepare.create({
                                moves: {
                                    ...this.moves.takeMeeple.create({
                                        callback: async (options, args) => {
                                            const game = lodash.cloneDeep(options.game);
                                            if (game.takedMeeple != null) {
                                                return {
                                                    success: false,
                                                    message: 'Исследователь уже выбран',
                                                };
                                            }

                                            game.takedMeeple = args;
                                            return {
                                                success: true,
                                                saveState: true,
                                                game,
                                            };
                                        },
                                        noLimit: true,
                                    }),
                                    ...this.moves.placeMeeple.create({
                                        callback: async (options, args) => {
                                            const game = lodash.cloneDeep(options.game);
                                            const meeple = game.takedMeeple;
                                            if (meeple == null) {
                                                return {
                                                    success: false,
                                                    message: 'Исследователь не найден',
                                                };
                                            }

                                            const player = meeple?.playerId != null
                                                ? game.playerMap[meeple.playerId]
                                                : null;
                                            if (player == null) {
                                                return {
                                                    success: false,
                                                    message: 'Игрок не найден',
                                                };
                                            }

                                            const cellTo = game.cells.find((cell) => cell.id === args.cellId);
                                            if (cellTo == null) {
                                                return {
                                                    success: false,
                                                    message: 'Ячейка для размещения не найден',
                                                };
                                            }

                                            const meepleIndex = player.meeples.findIndex(p => p.id === meeple.id);
                                            if (meepleIndex === -1) {
                                                return {
                                                    success: false,
                                                    message: 'Местоположение исследователя не найдено (meepleIndex)',
                                                };
                                            }

                                            const data = player.meeples.splice(meepleIndex, 1);
                                            cellTo.meeples.push(data[0]);
                                            game.takedMeeple = null;
                                            return {
                                                success: true,
                                                saveState: true,
                                                game,
                                            };
                                        },
                                    }),
                                },
                            }),
                            ...this.stages.wait.create({}),
                        },
                    },
                    endIf: (options) => {
                        const hasMeeplesOnHand = Object.values(options.game.playerMap).some(player => {
                            return player.meeples.length > 0;
                        });
                        return !hasMeeplesOnHand
                            ? {
                                next: this.phases.survive.id,
                            }
                            : false;
                    },
                    onEnd: (options) => {
                        // TODO: Переход к следующей фазе
                        const game = lodash.cloneDeep(options.game);
                        game.statusId = GameInfoStatusIdEnum.Started;
                        return {
                            game,
                            payloads: [],
                        };
                    }
                }),
                ...this.phases.survive.create({
                    turn: {
                        activePlayers: [
                            {
                                currentPlayer: {
                                    stage: this.stages.useTile.id,
                                    minMoves: (context) => 0,
                                    maxMoves: (context) => 1,
                                },
                                others: {
                                    stage: this.stages.wait.id,
                                    isFinished: true,
                                },
                                nextIndex: 1,
                            },
                            {
                                currentPlayer: {
                                    stage: this.stages.playerMove.id,
                                    minMoves: (context) => 0,
                                    maxMoves: (context) => 3,
                                },
                                others: {
                                    stage: this.stages.wait.id,
                                    isFinished: true,
                                },
                                nextIndex: 2,
                            },
                            {
                                currentPlayer: {
                                    stage: this.stages.getTile.id,
                                    minMoves: (context) => 0,
                                    maxMoves: (context) => 1,
                                },
                                others: {
                                    stage: this.stages.wait.id,
                                    isFinished: true,
                                },
                                nextIndex: 3,
                            },
                            {
                                currentPlayer: {
                                    stage: this.stages.monsterMove.id,
                                },
                                others: {
                                    stage: this.stages.wait.id,
                                    isFinished: true,
                                },
                            },
                        ],
                        stages: {
                            ...this.stages.useTile.create({
                                moves: {
                                    ...this.moves.useTile.create({
                                        callback: async (options, args) => {
                                            return {
                                                success: true,
                                                saveState: true,
                                                game: args.game,
                                            };
                                        },
                                    }),
                                },
                            }),
                            ...this.stages.playerMove.create({
                                moves: {
                                    ...this.moves.takeMeeple.create({
                                        callback: async (options, args) => {
                                            const game = lodash.cloneDeep(options.game);
                                            if (game.takedMeeple != null) {
                                                return {
                                                    success: false,
                                                    message: 'Исследователь уже выбран',
                                                };
                                            }

                                            game.takedMeeple = args;
                                            return {
                                                success: true,
                                                saveState: true,
                                                game,
                                            };
                                        },
                                        noLimit: true,
                                    }),
                                    ...this.moves.placeMeeple.create({
                                        callback: async (options, args) => {
                                            const game = lodash.cloneDeep(options.game);
                                            const meeple = game.takedMeeple;
                                            if (meeple == null) {
                                                return {
                                                    success: false,
                                                    message: 'Исследователь ещё не выбран',
                                                };
                                            }

                                            const cellFrom = meeple.cellId != null
                                                ? game.cells.find(cell => cell.id === meeple.cellId)
                                                : null;
                                            if (cellFrom == null) {
                                                return {
                                                    success: false,
                                                    message: 'Местоположение исследователя не найдено (cellFrom)',
                                                };
                                            }

                                            const cellTo = game.cells.find((cell) => cell.id === args.cellId);
                                            if (cellTo == null) {
                                                return {
                                                    success: false,
                                                    message: 'Ячейка для размещения не найдена',
                                                };
                                            }

                                            const fromMeeplesList = meeple.gameMeepleId != null
                                                ? cellFrom.meeples.find((p): p is EscapeFromAtlantisGameMeepleBaseInfo => {
                                                    return p.type === EscapeFromAtlantisCellMeepleType.GameMeeple && p.id === meeple.gameMeepleId
                                                })?.meeples
                                                : cellFrom.meeples
                                            if (fromMeeplesList == null) {
                                                return {
                                                    success: false,
                                                    message: 'Местоположение исследователя не найдено (fromMeeplesList)',
                                                };
                                            }

                                            const meepleIndex = fromMeeplesList.findIndex(p => p.id === meeple.id);
                                            if (meepleIndex) {
                                                return {
                                                    success: false,
                                                    message: 'Местоположение исследователя не найдено (meepleIndex)',
                                                };
                                            }
                                            const data = fromMeeplesList.splice(meepleIndex, 1);
                                            cellTo.meeples.push(data[0]);
                                            game.takedMeeple = null;
                                            return {
                                                success: true,
                                                saveState: true,
                                                game,
                                            };
                                        },
                                    }),
                                },
                            }),
                            ...this.stages.getTile.create({
                                moves: {
                                    ...this.moves.getTile.create({
                                        callback: async (options, args) => {
                                            const game = lodash.cloneDeep(options.game);
                                            const cell = game.cells.find(cell => cell.tile?.id === args.tile.id);
                                            if (cell == null) {
                                                return {
                                                    success: false,
                                                    message: 'Ячейка не найдена',
                                                };
                                            }
                                            cell.tile = null;
                                            game.playerMap[options.playerId].tiles.push(args.tile);
                                            // TODO: кинуть кубик
                                            return {
                                                success: true,
                                                saveState: true,
                                                game,
                                            };
                                        },
                                    }),
                                },
                            }),
                            ...this.stages.monsterMove.create({
                                moves: {
                                },
                            }),
                        }
                    }
                }),
            },
        })
    }

}
