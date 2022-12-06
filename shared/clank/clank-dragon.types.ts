import {
  GamePlayerColorIdEnum,
  GamePlayerColorList,
} from './clank-player.types';

export enum DragonColorIdEnum {
    Empty = 'Empty',
}

type ClankDragonBagItem = GamePlayerColorIdEnum | DragonColorIdEnum;

export interface DragonColorInfo {
    name: string;
    color: string;
}

export const DragonColorList: Record<ClankDragonBagItem, DragonColorInfo> = {
    ...GamePlayerColorList,
    [DragonColorIdEnum.Empty]: {
        name: 'Дракон',
        color: '#EF4E5A',
    },
}

export interface ClankDragonInfo {
    /** Ярость дракона */
    rage: number;
    /** Ярость дракона */
    clankBag: ClankDragonBagItem[];
    /** Ярость дракона */
    clankAria: Record<GamePlayerColorIdEnum, number>;
}

export const initDragonInfo = (rage = 0) => {
    const data: ClankDragonInfo = {
        rage,
        clankBag: Array(24).fill(DragonColorIdEnum.Empty),
        clankAria: {
            Blue: 0,
            Green: 0,
            Red: 0,
            Yellow: 0,
        },
    };
    return data;
}