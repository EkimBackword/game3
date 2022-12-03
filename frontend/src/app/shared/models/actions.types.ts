import {
    ClankCardAction,
    ClankCardActionList,
} from '@shared/clank/clank-card.types';
import {
    ClankCostInfo,
    ClankElementType,
} from '@shared/clank/clank-info.types';
import { ClankPlayerConfig } from '@shared/clank/clank-player.types';

import {
    checkCost,
    CheckCostResult,
} from './clank-element-types';
import { updateBenefitInfo } from './players/player.types';

export interface CheckActionResult extends CheckCostResult {
    list: ClankCardAction[];
}

export const checkAction = (data: {
    actions: ClankCardActionList,
    player: ClankPlayerConfig;
}): CheckActionResult => {
    if (data.actions.cost) {
        const canUseByTotalCost = checkCost({
            cost: data.actions.cost,
            player: data.player,
        });
        if (!canUseByTotalCost.success) {
            return {
                ...canUseByTotalCost,
                list: [],
            };
        }
    }
    if (data.actions.list == null) {
        return {
            success: true,
            list: [],
            message: null,
        };
    }
    const result: CheckActionResult = {
        success: data.actions.type === 'some'
            ? false
            : true,
        list: data.actions.type === 'some'
            ? []
            : data.actions.list,
        message: null,
    };
    for (const action of data.actions.list) {
        const canUseByAction = action.cost != null
            ? checkCost({
                cost: action.cost,
                player: data.player,
            })
            : {
                success: true,
                message: null,
            };
        if (data.actions.type === 'every' && !canUseByAction.success) {
            return {
                ...canUseByAction,
                list: [],
            };
        }
        if (data.actions.type === 'some' && canUseByAction.success) {
            result.success = true;
            result.list?.push(action);
        }
    }
    return result;
};

export const updateBenefitInfoByAction = (data: {
    player: ClankPlayerConfig;
    list: ClankCardAction[];
}): ClankCostInfo => {
    return data.list.reduce((acc, action) => {
        if (!checkHasElement({
            player: data.player,
            action,
        })) {
            return acc;
        }
        if (action.cost != null) {
            acc = updateBenefitInfo({
                benefit: acc,
                cost: action.cost,
                isBenefit: false,
            });
        }
        if (action.benefit != null) {
            acc = updateBenefitInfo({
                benefit: acc,
                cost: action.benefit,
                isBenefit: true,
            });
        }
        return acc;
    }, data.player.benefitInfo);
};

export const checkHasElement = (data: {
    player: ClankPlayerConfig;
    action: ClankCardAction;
}) => {
    if (data.action.has == null) {
        return true;
    }
    const cost = data.action.has.cost;
    const count = (Object.keys(cost) as ClankElementType[]).reduce((acc, key) => {
        const playerPoints = data.player.benefitInfo[key] ?? 0;
        const costPoints = cost[key] ?? 0;
        if (playerPoints >= costPoints) {
            acc++;
        }
        return acc;
    }, 0);
    return count >= data.action.has.count;
};
