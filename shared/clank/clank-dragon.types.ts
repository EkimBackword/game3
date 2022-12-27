import { GamePlayerColorIdEnum } from './clank-player.types';

export interface ClankDragonInfo {
    /** Ярость дракона */
    rage: number;
    /** Ярость дракона */
    clankBag: GamePlayerColorIdEnum[];
    /** Ярость дракона */
    clankAria: Record<GamePlayerColorIdEnum, number>;
}

export const initDragonInfo = (rage = 0) => {
    const data: ClankDragonInfo = {
        rage,
        clankBag: Array(24).fill(GamePlayerColorIdEnum.Black),
        clankAria: {
            Blue: 0,
            Green: 0,
            Red: 0,
            Yellow: 0,
            Black: 0,
        },
    };
    return data;
}