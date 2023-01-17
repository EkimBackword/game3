import { GamePlayerColorIdEnum } from './clank-player.types';

export interface ClankDragonInfo {
    /** Ярость дракона */
    rage: number;
    /** Ярость дракона */
    clankBag: GamePlayerColorIdEnum[];
    /** Ярость дракона */
    clankAria: Record<GamePlayerColorIdEnum, number>;
    /** Ярость дракона */
    endGameCounter: ClankDragonEndGameCounter;
}

export interface ClankDragonEndGameCounter {
    /** Флаг, который говорит начался ли отсчет ходов */
    inited: boolean;
    /** Цвет игрока, в начале хода которого будет происходить отсчёт */
    colorId: GamePlayerColorIdEnum;
    /** Позиция счётчика */
    index: number;
}

export const initDragonInfo = (rage = 0, playerCount = 4) => {
    const initDragonClank = playerCount < 4
        ? 6 * playerCount
        : 24
    const data: ClankDragonInfo = {
        rage,
        clankBag: Array(initDragonClank).fill(GamePlayerColorIdEnum.Black),
        clankAria: {
            Blue: 0,
            Green: 0,
            Red: 0,
            Yellow: 0,
            Purple: 0,
            Orange: 0,
            Black: 0,
        },
        endGameCounter: {
            inited: false,
            colorId: GamePlayerColorIdEnum.Black,
            index: 0,
        }
    };
    return data;
}