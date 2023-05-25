import { GamePlayerColorIdEnum } from './clank-player.types';

export interface ClankDragonInfo {
    /** Ярость дракона */
    rage: number;
    /** Список кланков в мешке */
    clankBag: GamePlayerColorIdEnum[];
    /** Сколько кланков отправлялось в мешок */
    clankToBagTotalCount: Record<GamePlayerColorIdEnum, number>;
    /** Сколько кланков в области CLANK */
    clankAria: Record<GamePlayerColorIdEnum, number>;
    /** Счётчик последних раундов */
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
        clankToBagTotalCount: {
            Blue: 0,
            Green: 0,
            Red: 0,
            Yellow: 0,
            Purple: 0,
            Orange: 0,
            Black: 0,
        },
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