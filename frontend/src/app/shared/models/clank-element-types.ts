import { ClankElementType } from '@shared/clank/clank-info.types';
import { ClankPlayerConfig } from '@shared/clank/clank-player.types';

export interface ClankElementTypeInfo {
    name: string;
    url: string;
}

export const ClankElementTypeMap: Record<string, ClankElementTypeInfo> = {
    [ClankElementType.skill]: {
        name: 'Навык',
        url: '/assets/images/skill.png',
    },
    [ClankElementType.sword]: {
        name: 'Меч',
        url: '/assets/images/sword.png',
    },
    [ClankElementType.boot]: {
        name: 'Ботинок',
        url: '/assets/images/boot.png',
    },
    [ClankElementType.clank]: {
        name: 'Шум',
        url: '/assets/images/clank.png',
    },
    [ClankElementType.heal]: {
        name: 'Здоровье',
        url: '/assets/images/heal.png',
    },
    [ClankElementType.pyramid_dice]: {
        name: 'Кубик пирамиды',
        url: '/assets/images/pyramid_dice.png',
    },
    [ClankElementType.curse]: {
        name: 'Проклятие',
        url: '/assets/images/tokens/map_tokens/clank_proklyatie_mumii/token.jpg',
    },
    [ClankElementType.coin]: {
        name: 'Монета',
        url: '/assets/images/coins/coins.png',
    },
    [ClankElementType.card]: {
        name: 'Карта',
        url: '/assets/images/cards/cards_back.jpg',
    },
    [ClankElementType.companion]: {
        name: 'Компаньон',
        url: '/assets/images/companion.png',
    },
    [ClankElementType.monkey_idol]: {
        name: 'Обезьяний идол',
        url: '/assets/images/tokens/map_tokens/idol_5_1.jpg',
    },
    [ClankElementType.mastery_token]: {
        name: 'Жетон мастерства',
        url: '/assets/images/tokens/bonus/master.png',
    },
    [ClankElementType.dragon_egg]: {
        name: 'Драконье яйцо',
        url: '/assets/images/tokens/secrets/small_egg.jpg',
    },
    [ClankElementType.cup]: {
        name: 'Кубок',
        url: '/assets/images/tokens/secrets/big_cup.jpg',
    },
    [ClankElementType.teleport]: {
        name: 'Телепорт',
        url: '/assets/images//teleport.png',
    },
    [ClankElementType.artefact]: {
        name: 'Артефакт',
        url: '/assets/images/artefact.png',
    },
    [ClankElementType.key]: {
        name: 'Отмычки',
        url: '/assets/images/tokens/market/key_token.jpg',
    },
    [ClankElementType.minor_secret]: {
        name: 'Маленький секрет',
        url: '/assets/images/tokens/secrets/small_back.jpg',
    },
    [ClankElementType.major_secret]: {
        name: 'Большой секрет',
        url: '/assets/images/tokens/secrets/big_back.jpg',
    },
};

export interface CheckCostResult {
    success: boolean;
    message: string | null;
}

export const checkCost = (data: {
    cost: Partial<Record<ClankElementType, number>>;
    player: ClankPlayerConfig;
    canReplaceSwordByHealth?: boolean;
}): CheckCostResult => {
    for (const key in data.cost) {
        if (Object.prototype.hasOwnProperty.call(data.cost, key)) {
            const type = key as ClankElementType;
            const costInfo = ClankElementTypeMap[type];
            const costPoints = data.cost[type] ?? 0;
            const userPoints = data.player.benefitInfo[type] ?? 0;
            const healthPoints = data.player.benefitInfo.heal ?? 0;
            if (data.canReplaceSwordByHealth && key === ClankElementType.sword && (userPoints + healthPoints) < costPoints) {
                return {
                    success: false,
                    message: `Требуется ${costInfo.name}: ${costPoints} (У вас есть ${costInfo.name}: ${userPoints} | Здоровя: ${healthPoints})`,
                };
            }
            if (userPoints < costPoints) {
                return {
                    success: false,
                    message: `Требуется ${costInfo.name}: ${costPoints} (У вас есть ${costInfo.name}: ${userPoints})`,
                };
            }
        }
    }
    return {
        success: true,
        message: null,
    };
};
