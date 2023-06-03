import * as lodash from 'lodash';

import {
    ClankArtifactQualityMap,
    ClankArtifactQualityTypeEnum,
    ClankArtifactShortConfig,
    ClankArtifactShortConfigWithoutQuality,
} from '@shared/clank/clank-artifact.types';
import { ClankDlcEnum } from '@shared/clank/clank-info.types';

import { mappingArtifacts } from './artifacts.types';

export const getArtifacts = (playerCount: number) => {
    const initList: ClankArtifactShortConfigWithoutQuality[] = [
        {
            name: 'кольцо',
            url: '/5.png',
            value: 5,
            points: {
                value: 5,
            },
        },
        {
            name: 'анх',
            url: '/7.png',
            value: 7,
            points: {
                value: 7,
            },
        },
        {
            name: 'сосуд',
            url: '/10.png',
            value: 10,
            points: {
                value: 10,
            },
        },
        {
            name: 'бананы',
            url: '/15.png',
            value: 15,
            points: {
                value: 15,
            },
        },
        {
            name: 'шит',
            url: '/20.png',
            value: 20,
            points: {
                value: 20,
            },
        },
        {
            name: 'доспех',
            url: '/25.png',
            value: 25,
            points: {
                value: 25,
            },
        },
        {
            name: 'кадило',
            url: '/30.png',
            value: 30,
            points: {
                value: 30,
            },
        },
    ];
    const goldQuality = ClankArtifactQualityMap[ClankArtifactQualityTypeEnum.gold];
    let list: ClankArtifactShortConfig[] = initList.map(p => {
        const artifact: ClankArtifactShortConfig = {
            name: `${goldQuality.name} ${p.name}`,
            url: `${goldQuality.url}${p.url}`,
            value: p.value,
            points: p.points,
            quality: goldQuality,
        };
        return artifact;
    });
    if (playerCount > 4) {
        const silverQuality = ClankArtifactQualityMap[ClankArtifactQualityTypeEnum.silver];
        list = [
            ...list,
            ...initList.filter(p => ![5, 7].includes(p.value)).map(p => {
                const artifact: ClankArtifactShortConfig = {
                    name: `${silverQuality.name} ${p.name}`,
                    url: `${silverQuality.url}${p.url}`,
                    value: p.value,
                    points: p.points,
                    quality: silverQuality,
                };
                return artifact;
            }),
        ];
    }
    if (playerCount < 4) {
        list = list.filter(p => p.value !== 5);
    }
    if (playerCount < 3) {
        const index = lodash.random(0, list.length - 1);
        list = list.filter((_, i) => i !== index);
    }
    return mappingArtifacts(
        list,
        {
            dlc_name: ClankDlcEnum.clank,
            url: '/assets/images/artifacts',
        },
    );
};
