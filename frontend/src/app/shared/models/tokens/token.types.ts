import {
    ClankTokenConfig,
    ClankTokenGroup,
} from '@shared/clank/clank-token.types';

export const mappingTokens = (data: ClankTokenGroup, withCopy: boolean) => {
    const {tokens, ...config} = data;
    return tokens.flatMap((token) => {
        const copyCount = withCopy ? Math.abs(token.count) : 1;
        return Array(copyCount).fill(1).map((_, copy_index) => {
            const find_string = `${config.dlc_name}_${token.index}_${config.type}`;
            const cardConfig: ClankTokenConfig = {
                ...token,
                ...config,
                url: `${config.url}${token.url}`,
                id: `${find_string}__${copy_index}`,
                find_string,
                copy_index,
            };
            return cardConfig;
        });
    });
};
