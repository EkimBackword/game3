import {
    ClankTokenConfig,
    ClankTokenGroup,
} from '@shared/clank/clank-token.types';

export enum UseTokenType {
    use = 'use',
    take = 'take',
    buy = 'buy',
}

export const UseTokenInfoByType: Record<UseTokenType, {
    text: string,
}> = {
    [UseTokenType.use]: {
        text: 'использовал жетон',
    },
    [UseTokenType.take]: {
        text: 'взял жетон',
    },
    [UseTokenType.buy]: {
        text: 'купил жетон',
    },
};

export const mappingTokens = (data: ClankTokenGroup, withCopy: boolean) => {
    const {tokens, ...config} = data;
    return tokens.flatMap((token, index) => {
        const copyCount = withCopy ? Math.abs(token.count) : 1;
        return Array(copyCount).fill(1).map((_, copy_index) => {
            const cardConfig: ClankTokenConfig = {
                ...token,
                ...config,
                url: `${config.url}${token.url}`,
                id: `${config.dlc_name}_${config.type}_${index}_${copy_index}`,
                index,
                copy_index,
            };
            return cardConfig;
        });
    });
};
