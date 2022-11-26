import {
    ClankArtifactConfig,
    ClankArtifactGroup,
    ClankArtifactShortConfig,
} from '@shared/clank/clank-artifact.types';

export const mappingArtifacts = (list: ClankArtifactShortConfig[], group: ClankArtifactGroup) => {
    const dlc_name = group.dlc_name;
    return list.flatMap((artifact) => {
        const cardConfig: ClankArtifactConfig = {
            ...artifact,
            id: `${dlc_name}__${artifact.value}`,
            dlc_name: group.dlc_name,
            url: `${group.url}${artifact.url}`,
        };
        return cardConfig;
    });
};
