import { GameConfigCreator } from './game-config';
import { GameMoveCreator } from './game-move';
import { GamePhaseCreator } from './game-phase';
import { GameStageCreator } from './game-stage';

interface TestGameType {
    name: string;
    list1: string[][];
    list2: number[][];
}

interface TestSetupData {
    x: number;
    y: number;
}

const TestGameMoves = {
    changeName: new GameMoveCreator<TestGameType, {
        name: string;
    }>({
        type: 'changeName',
        name: 'Сменить имя',
    }),
    changeList1: new GameMoveCreator<TestGameType, {
        x: number;
        y: number;
        value: string;
    }>({
        type: 'changeList1',
        name: 'Изменить первый лист',
    }),
    changeList2: new GameMoveCreator<TestGameType, {
        x: number;
        y: number;
        value: number;
    }>({
        type: 'changeList2',
        name: 'Изменить второй лист',
    }),
};

const TestGameStages = {
    stage1: new GameStageCreator<TestGameType>({
        id: 'stage1',
        name: 'Стадия 1',
    }),
    stage2: new GameStageCreator<TestGameType>({
        id: 'stage2',
        name: 'Стадия 2',
    }),
    stage3: new GameStageCreator<TestGameType>({
        id: 'stage3',
        name: 'Стадия 3',
    }),
}

const TestGamePhases = {
    phase1: new GamePhaseCreator<TestGameType>({
        id: 'phase1',
        name: 'Первая фаза',
    }),
    phase2: new GamePhaseCreator<TestGameType>({
        id: 'phase2',
        name: 'Вторая фаза',
    }),
};

const TestGameCreator = new GameConfigCreator<
    TestGameType,
    TestSetupData
>({
    id: -1,
    name: 'Test game',
});

const TestGame = TestGameCreator.create({
    setup: (context, setupData) => {
        const result: TestGameType = {
            name: 'Start',
            list1: Array(setupData.x).fill(Array(setupData.y).fill('')),
            list2: Array(setupData.x).fill(Array(setupData.y).fill('')),
        };
        return result;
    },
    moves: {
        ...TestGameMoves.changeName.create({
            callback: (state, props) => {
                const game: TestGameType = {
                    ...state.game,
                    name: props.name
                };
                return game;
            }
        }),
    },
    phases: {
        ...TestGamePhases.phase1.create({
            turn: {
                stages: {
                    ...TestGameStages.stage1.create({
                        moves: {
                            ...TestGameMoves.changeList1.create({
                                callback: (state, props) => {
                                    const game: TestGameType = {
                                        ...state.game,
                                        list1: state.game.list1.map((columns, x) => {
                                            return columns.map((value, y) => {
                                                if (x === props.x && y === props.y) {
                                                    return props.value;
                                                }
                                                return value;
                                            })
                                        }),
                                    };
                                    return game;
                                },
                            })
                        },
                        next: TestGameStages.stage2.id,
                    }),
                    ...TestGameStages.stage2.create({
                        moves: {
                            ...TestGameMoves.changeList2.create({
                                callback: (state, props) => {
                                    const game: TestGameType = {
                                        ...state.game,
                                        list2: state.game.list2.map((columns, x) => {
                                            return columns.map((value, y) => {
                                                if (x === props.x && y === props.y) {
                                                    return props.value;
                                                }
                                                return value;
                                            })
                                        }),
                                    };
                                    return game;
                                },
                            })
                        }
                    })
                }
            }
        }),
        ...TestGamePhases.phase2.create({
            turn: {
                stages: {
                    ...TestGameStages.stage3.create({})
                }
            }
        }),
    },
});