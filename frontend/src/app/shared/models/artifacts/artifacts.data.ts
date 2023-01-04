import * as lodash from 'lodash';

import { ClankArtifactShortConfig } from '@shared/clank/clank-artifact.types';
import { ClankDlcEnum } from '@shared/clank/clank-info.types';

import { mappingArtifacts } from './artifacts.types';

export const getArtifacts = (playerCount: number) => {
    let list: ClankArtifactShortConfig[] = [
        {
            name: 'Золотое кольцо',
            url: '/5.jpg',
            value: 5,
            points: {
                value: 5,
            },
        },
        {
            name: 'Золотой анх',
            url: '/7.jpg',
            value: 7,
            points: {
                value: 7,
            },
        },
        {
            name: 'Золотой сосуд',
            url: '/10.jpg',
            value: 10,
            points: {
                value: 10,
            },
        },
        {
            name: 'Золотые бананы',
            url: '/15.jpg',
            value: 15,
            points: {
                value: 15,
            },
        },
        {
            name: 'Золотой шит',
            url: '/20.jpg',
            value: 20,
            points: {
                value: 20,
            },
        },
        {
            name: 'Золотой доспех',
            url: '/25.jpg',
            value: 25,
            points: {
                value: 25,
            },
        },
        {
            name: 'Золотое кадило',
            url: '/30.jpg',
            value: 30,
            points: {
                value: 30,
            },
        },
    ];
    if (playerCount > 4) {
        // TODO: Добавить серебреные артефакты
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
