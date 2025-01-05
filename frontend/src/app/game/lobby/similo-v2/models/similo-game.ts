import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import * as lodash from 'lodash';
import { lastValueFrom } from 'rxjs';
import { GameRouteEnum } from 'src/app/game.routing.enum';

import { GameInfoStatusIdEnum } from '@shared/clank/clank-game.types';
import {
    GameConfigCreator,
    GameConfigCreatorConfig,
} from '@shared/game/game-config';
import { GameMoveCreator } from '@shared/game/game-move';
import { GamePhaseCreator } from '@shared/game/game-phase';
import { GameStageCreator } from '@shared/game/game-stage';
import {
    SimiloCardConfig,
    SimiloCardPosition,
    SimiloDlcEnum,
} from '@shared/similo/similo-dlc.types';
import { SimiloGameInfoStatistics } from '@shared/similo/similo-game.types';

import { getCardsByDlcDeck } from '../../../similo/models/similo-dlc';
import { LobbyGameBuilder } from '../../models/lobby-games-store';
import { LobbyGamesIdEnum } from '../../models/lobby-games.enum';
import { SimiloV2SetupComponent } from '../components/similo-v2-setup/similo-v2-setup.component';
import { SimiloV2CardDialogComponent } from '../dialogs/similo-v2-card-dialog/similo-v2-card-dialog.component';
import { SimiloV2Settings } from './similo-settings';

export interface SimiloV2SetupData {
    mainDlc: SimiloDlcEnum;
    helpDlc: SimiloDlcEnum | null;
    masterPlayerId: string | null;
}

export interface SimiloV2GameType extends SimiloV2SetupData {
    statusId: GameInfoStatusIdEnum;
    mainDeck: SimiloCardConfig[];
    helpDeck: SimiloCardConfig[];
    isWin: boolean;
    statistics: SimiloGameInfoStatistics[];
}

export class SimiloV2GameBuilder implements LobbyGameBuilder<SimiloV2GameType, SimiloV2SetupData> {

    path = GameRouteEnum.Similo;

    config: GameConfigCreatorConfig = {
        id: LobbyGamesIdEnum.Similo,
        name: 'Similo',
    };

    setupDataSettings = SimiloV2SetupComponent;

    moves = {
        helpCardById: new GameMoveCreator<SimiloV2GameType, {
            card: SimiloCardConfig;
        }>({
            type: 'helpCardById',
            name: 'Дать подсказку',
        }),
        chooseCardById: new GameMoveCreator<SimiloV2GameType, {
            card: SimiloCardConfig;
        }>({
            type: 'chooseCardById',
            name: 'Выбрать карту',
        }),
        showCardById: new GameMoveCreator<SimiloV2GameType, {
            card: SimiloCardConfig;
        }>({
            type: 'showCardById',
            name: 'Посмотреть карту',
        }),
    };

    phases = {
        main: new GamePhaseCreator<SimiloV2GameType>({
            id: 'main',
            name: 'Основной',
        }),
    };

    stages = {
        wait: new GameStageCreator<SimiloV2GameType>({
            id: 'wait',
            name: 'Ожидание',
        }),
        help: new GameStageCreator<SimiloV2GameType>({
            id: 'help',
            name: 'Помощь',
        }),
        choose: new GameStageCreator<SimiloV2GameType>({
            id: 'choose',
            name: 'Выбор',
        }),
    };

    getInitialSetupData(): SimiloV2SetupData {
        const result: SimiloV2SetupData = {
            mainDlc: SimiloDlcEnum.HarryPotter,
            helpDlc: null,
            masterPlayerId: null,
        };
        return result;
    }

    getConfig() {
        const gameCreator = new GameConfigCreator<
            SimiloV2GameType,
            SimiloV2SetupData
        >(this.config);
        return gameCreator.create({
            minPlayers: 2,
            disableUndo: true,
            moves: {
                ...this.moves.showCardById.create({
                    callback: async (options, { card }) => {
                        await this.openCardDialog({
                            card,
                            isMaster: options.context.currentPlayerId === options.playerId,
                            actions: [],
                        });
                        return {
                            success: true,
                            saveState: false,
                        };
                    }
                })
            },
            phases: {
                ...this.phases.main.create({
                    isStart: true,
                    turn: {
                        order: {
                            first: (options) => {
                                return options.context.playerIdsOrder.findIndex(id => id === options.game.masterPlayerId);
                            },
                            next: (options) => {
                                return options.context.playerIdsOrderPosition;
                            }
                        },
                        activePlayers: [
                            {
                                currentPlayer: {
                                    stage: this.stages.help.id,
                                    minMoves: (context) => 1,
                                    maxMoves: (context) => 1,
                                },
                                others: {
                                    stage: this.stages.wait.id,
                                    isFinished: true,
                                },
                                nextIndex: 1,
                            },
                            {
                                all: {
                                    stage: this.stages.choose.id,
                                    minMoves: (context) => {
                                        return context.turn < 5
                                            ? context.turn
                                            : 1;
                                    },
                                    maxMoves: (context) => {
                                        return context.turn < 5
                                            ? context.turn
                                            : 1;
                                    },
                                },
                            }
                        ],
                        stages: {
                            ...this.stages.help.create({
                                moves: {
                                    ...this.moves.helpCardById.create({
                                        callback: async (options, { card }) => {
                                            const game = {...options.game};
                                            const position = await this.openCardDialog({
                                                card,
                                                isMaster: options.context.currentPlayerId === options.playerId,
                                                actions: [{
                                                    text: 'Похожий',
                                                    value: SimiloCardPosition.Similar,
                                                },{
                                                    text: 'Отличается',
                                                    value: SimiloCardPosition.NotSimilar,
                                                }],
                                            });

                                            if (position == null) {
                                                return {
                                                    success: true,
                                                    saveState: false,
                                                };
                                            }

                                            const cardIndex = game.helpDeck.findIndex(p => p.id === card.id);
                                            game.helpDeck[cardIndex] = {
                                                ...card,
                                                position,
                                                index: game.helpDeck.filter(p => p.position === position).length,
                                            };

                                            const nextCardIndex = game.helpDeck.findIndex(p => p.position === SimiloCardPosition.Deck);
                                            if (nextCardIndex != -1) {
                                                game.helpDeck[nextCardIndex] = {
                                                    ...game.helpDeck[nextCardIndex],
                                                    position: card.position,
                                                    index: card.index,
                                                };
                                            }
                                            return {
                                                success: true,
                                                saveState: true,
                                                game,
                                            };
                                        },
                                        undoable: false,
                                        noLimit: false,
                                    }),
                                }
                            }),
                            ...this.stages.choose.create({
                                moves: {
                                    ...this.moves.chooseCardById.create({
                                        callback: async (options, { card }) => {
                                            const isOpen = await this.openCardDialog({
                                                card,
                                                isMaster: options.context.currentPlayerId === options.playerId,
                                                actions: [{
                                                    text: 'Убрать карту',
                                                    value: false,
                                                }],
                                            })

                                            if (isOpen == null) {
                                                return {
                                                    success: true,
                                                    saveState: false,
                                                }
                                            }
                                            const game = { ...options.game };

                                            game.mainDeck[card.index] = {
                                                ...card,
                                                isOpen,
                                            };

                                            return {
                                                success: true,
                                                saveState: true,
                                                game,
                                            };
                                        },
                                        undoable: false,
                                        noLimit: false,
                                    })
                                }
                            }),
                            ...this.stages.wait.create({}),
                        }
                    }
                })
            },
            setup: (context, setupData) => {
                const cards = getCardsByDlcDeck(setupData.mainDlc, SimiloCardPosition.Board);
                const main = cards.splice(0, SimiloV2Settings.boardCardsCount);
                const help = setupData.helpDlc != null && setupData.helpDlc != setupData.mainDlc
                    ? getCardsByDlcDeck(setupData.helpDlc, SimiloCardPosition.Deck)
                    : cards;
                const game: SimiloV2GameType = {
                    ...setupData,
                    mainDeck: this.getSimiloMainDeck(main),
                    helpDeck: this.getSimiloHelpDeck(help),
                    statusId: GameInfoStatusIdEnum.Started,
                    isWin: false,
                    statistics: [],
                };
                return {
                    game,
                    payloads: [],
                };
            },
            endIf: (options) => {
                const searchableCard = options.game.mainDeck.find(p => p.isSearchable);
                return !searchableCard?.isOpen || options.context.turn > 5;
            },
            onEnd: (options) => {
                const searchableCard = options.game.mainDeck.find(p => p.isSearchable);
                const result: SimiloV2GameType = {
                    ...options.game,
                    isWin: searchableCard?.isOpen ?? false,
                    statusId: GameInfoStatusIdEnum.Finished,
                };
                return {
                    game: result,
                    payloads: [],
                };
            },
        });
    }

    private matDialog = inject(MatDialog);

    private getSimiloMainDeck(cards: SimiloCardConfig[]) {
        const searchableIndex = lodash.random(0, SimiloV2Settings.boardCardsCount - 1);
        return cards.map((card, index) => {
            card.position = SimiloCardPosition.Board;
            card.index = index;
            card.isOpen = true;
            card.isSearchable = index === searchableIndex;
            return card;
        });
    }

    private getSimiloHelpDeck(cards: SimiloCardConfig[]) {
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

    async openCardDialog<T>(data: SimiloV2CardDialogComponent<T>['data']) {
        const dialogRef = this.matDialog.open<
            SimiloV2CardDialogComponent<T>,
            SimiloV2CardDialogComponent<T>['data'],
            T
        >(
            SimiloV2CardDialogComponent,
            {
                data,
                width: `${SimiloV2Settings.card.width * 2}px`,
            },
        );

        return await lastValueFrom(dialogRef.afterClosed());
    }

}
