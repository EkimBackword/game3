import {
    ClankCostInfo,
    ClankElementType,
} from '@shared/clank/clank-info.types';

export const updateBenefitInfo = (data: {
    benefit: ClankCostInfo,
    cost: ClankCostInfo,
    isBenefit: boolean,
}) => {
    return (Object.keys(data.benefit) as ClankElementType[]).reduce((acc, key) => {
        const prevValue = acc[key] ?? 0;
        const nextValue = data.cost?.[key] ?? 0;
        acc[key] = data.isBenefit
            ? prevValue + nextValue
            : prevValue - nextValue;
        return acc;
    }, data.benefit);
};
