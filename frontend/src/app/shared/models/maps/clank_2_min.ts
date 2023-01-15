import { ClankDlcEnum } from '@shared/clank/clank-info.types';
import {
    ClankMapConfig,
    ClankMapConfigIds,
} from '@shared/clank/clank-map.types';

export const getClankMapMin2 = () => {
    const map: ClankMapConfig = {
        id: ClankMapConfigIds.clank_2,
        dlc_id: ClankDlcEnum.clank,
        name: 'Кланк! Продвинутая сторона',
        url: '/assets/images/maps/clank_2_min.png',
        width: 3000,
        height: 2730,
        dragonInfo: {
            url: '/assets/images/dragon.png',
            clankAria: {
                x: 2340,
                y: 520,
                width: 520,
                height: 600,
            },
            track: [
                {
                    rage: 0,
                    position: {
                        x: 2808,
                        y: 2550,
                        width: 120,
                        height: 120,
                    },
                    clank: 2,
                    startUserCount: 4,
                },
                {
                    rage: 1,
                    position: {
                        x: 2808,
                        y: 2404,
                        width: 120,
                        height: 120,
                    },
                    clank: 2,
                    startUserCount: 3,
                },
                {
                    rage: 2,
                    position: {
                        x: 2808,
                        y: 2257,
                        width: 120,
                        height: 120,
                    },
                    clank: 3,
                    startUserCount: 2,
                },
                {
                    rage: 3,
                    position: {
                        x: 2808,
                        y: 2111,
                        width: 120,
                        height: 120,
                    },
                    clank: 3,
                    startUserCount: 1,
                },
                {
                    rage: 4,
                    position: {
                        x: 2808,
                        y: 1964,
                        width: 120,
                        height: 120,
                    },
                    clank: 4,
                    startUserCount: 0,
                },
                {
                    rage: 5,
                    position: {
                        x: 2808,
                        y: 1819,
                        width: 120,
                        height: 120,
                    },
                    clank: 4,
                    startUserCount: 0,
                },
                {
                    rage: 6,
                    position: {
                        x: 2808,
                        y: 1671,
                        width: 120,
                        height: 120,
                    },
                    clank: 5,
                    startUserCount: 0,
                },
                {
                    rage: 7,
                    position: {
                        x: 2808,
                        y: 1525,
                        width: 120,
                        height: 120,
                    },
                    clank: 5,
                    startUserCount: 0,
                },
                {
                    rage: 8,
                    position: {
                        x: 2808,
                        y: 1384,
                        width: 120,
                        height: 120,
                    },
                    clank: 6,
                    startUserCount: 0,
                },
            ],
            endGameTrack: [
                {
                    index: 0,
                    clank: 0,
                    position: {
                        x: 513,
                        y: 53,
                        height: 175,
                        width: 175,
                    },
                    isFinish: false,
                },
                {
                    index: 1,
                    clank: 1,
                    position: {
                        x: 754,
                        y: 53,
                        height: 175,
                        width: 175,
                    },
                    isFinish: false,
                },
                {
                    index: 2,
                    clank: 2,
                    position: {
                        x: 994,
                        y: 53,
                        height: 175,
                        width: 175,
                    },
                    isFinish: false,
                },
                {
                    index: 3,
                    clank: 3,
                    position: {
                        x: 1224,
                        y: 53,
                        height: 175,
                        width: 175,
                    },
                    isFinish: false,
                },
                {
                    index: 4,
                    clank: 0,
                    position: {
                        x: 1464,
                        y: 53,
                        height: 175,
                        width: 175,
                    },
                    isFinish: true,
                },
            ],
        },
        elements: [
            {
                id: 1,
                position: {
                    x: 82,
                    y: 99,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 0,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
                isStart: true,
            },
            {
                id: 0,
                position: {
                    x: 734,
                    y: 310,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 1,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 2,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 7,
                        cost: {
                            teleport: 1,
                        },
                    },
                ],
            },
            {
                id: 2,
                position: {
                    x: 1075,
                    y: 453,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 0,
                        cost: {
                            teleport: 1,
                        },
                    },
                    {
                        element_id: 3,
                        cost: {
                            boot: 2,
                        },
                    },
                    {
                        element_id: 8,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
            },
            {
                id: 3,
                position: {
                    x: 1560,
                    y: 413,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 2,
                        cost: {
                            teleport: 1,
                        },
                    },
                    {
                        element_id: 4,
                        cost: {
                            boot: 2,
                        },
                    },
                    {
                        element_id: 10,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
                items: {
                    minor_secret: {
                        count: 2,
                    },
                },
            },
            {
                id: 4,
                position: {
                    x: 2028,
                    y: 552,
                    width: 280,
                    height: 280,
                },
                isCrystalCave: true,
                links: [
                    {
                        element_id: 3,
                        cost: {
                            teleport: 2,
                        },
                    },
                    {
                        element_id: 5,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 18,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
                items: {
                    minor_secret: {
                        count: 2,
                    },
                },
            },
            {
                id: 5,
                position: {
                    x: 93,
                    y: 485,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 4,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 6,
                        cost: {
                            boot: 1,
                            sword: 2,
                        },
                    },
                ],
                items: {
                    major_secret: {
                        count: 1,
                    },
                },
            },
            {
                id: 6,
                position: {
                    x: 396,
                    y: 489,
                    width: 280,
                    height: 280,
                },
                isCrystalCave: true,
                links: [
                    {
                        element_id: 5,
                        cost: {
                            boot: 1,
                            sword: 2,
                        },
                    },
                    {
                        element_id: 7,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 11,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 13,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
            },
            {
                id: 7,
                position: {
                    x: 752,
                    y: 618,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 0,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 6,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 8,
                        cost: {
                            boot: 1,
                            sword: 3,
                        },
                    },
                ],
            },
            {
                id: 8,
                position: {
                    x: 1056,
                    y: 718,
                    width: 280,
                    height: 280,
                },
                isCrystalCave: true,
                links: [
                    {
                        element_id: 2,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 7,
                        cost: {
                            boot: 1,
                            sword: 3,
                        },
                    },
                    {
                        element_id: 9,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 14,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 15,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
            },
            {
                id: 9,
                position: {
                    x: 1397,
                    y: 737,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 8,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 10,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 16,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 17,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
            },
            {
                id: 10,
                position: {
                    x: 1769,
                    y: 710,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 3,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 9,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 17,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 18,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                ],
            },
            {
                id: 11,
                position: {
                    x: 99,
                    y: 734,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 6,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 12,
                        cost: {
                            boot: 1,
                            key_token: 1,
                        },
                    },
                ],
                items: {
                    minor_secret: {
                        count: 2,
                    },
                },
            },
            {
                id: 12,
                position: {
                    x: 83,
                    y: 1080,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 11,
                        cost: {
                            boot: 1,
                            key_token: 1,
                        },
                    },
                    {
                        element_id: 13,
                        cost: {
                            boot: 1,
                            key_token: 1,
                        },
                    },
                ],
                items: {
                    major_secret: {
                        count: 1,
                    },
                },
            },
            {
                id: 13,
                position: {
                    x: 433,
                    y: 1005,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 6,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 12,
                        cost: {
                            boot: 1,
                            key_token: 1,
                        },
                    },
                    {
                        element_id: 14,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 19,
                        cost: {
                            boot: 2,
                        },
                    },
                ],
                items: {
                    minor_secret: {
                        count: 2,
                    },
                },
            },
            {
                id: 14,
                position: {
                    x: 766,
                    y: 928,
                    width: 280,
                    height: 280,
                },
                isCrystalCave: true,
                links: [
                    {
                        element_id: 8,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 13,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 20,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                ],
            },
            {
                id: 15,
                position: {
                    x: 1060,
                    y: 1040,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 8,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 21,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                ],
            },
            {
                id: 16,
                position: {
                    x: 1359,
                    y: 1016,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 9,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 22,
                        cost: {
                            boot: 1,
                            key_token: 1,
                        },
                    },
                ],
                items: {
                    major_secret: {
                        count: 1,
                    },
                },
            },
            {
                id: 17,
                position: {
                    x: 1688,
                    y: 1028,
                    width: 280,
                    height: 280,
                },
                isCrystalCave: true,
                links: [
                    {
                        element_id: 9,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 10,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 23,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 24,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                ],
            },
            {
                id: 18,
                isMarket: true,
                position: {
                    x: 2086,
                    y: 979,
                    width: 230,
                    height: 280,
                },
                links: [
                    {
                        element_id: 4,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 10,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 24,
                        cost: {
                            boot: 1,
                            sword: 2,
                        },
                    },
                ],
            },
            {
                id: 19,
                isDungeon: true,
                position: {
                    x: 144,
                    y: 1382,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 13,
                        cost: {
                            boot: 2,
                        },
                    },
                    {
                        element_id: 29,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
                items: {
                    major_secret: {
                        count: 1,
                    },
                },
            },
            {
                id: 20,
                isDungeon: true,
                isMarket: true,
                position: {
                    x: 725,
                    y: 1300,
                    width: 230,
                    height: 280,
                },
                links: [
                    {
                        element_id: 14,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 25,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 26,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
            },
            {
                id: 21,
                isDungeon: true,
                position: {
                    x: 1036,
                    y: 1327,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 15,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 26,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                ],
                items: {
                    major_secret: {
                        count: 1,
                    },
                },
            },
            {
                id: 22,
                isDungeon: true,
                position: {
                    x: 1541,
                    y: 1355,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 16,
                        cost: {
                            boot: 1,
                            key_token: 1,
                        },
                    },
                    {
                        element_id: 23,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 26,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 27,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                ],
                items: {
                    artefact: {
                        count: 1,
                        value: 7,
                    },
                },
            },
            {
                id: 23,
                isDungeon: true,
                position: {
                    x: 1938,
                    y: 1548,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 17,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 22,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 33,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
                items: {
                    minor_secret: {
                        count: 2,
                    },
                },
            },
            {
                id: 24,
                isDungeon: true,
                position: {
                    x: 2387,
                    y: 1386,
                    width: 220,
                    height: 490,
                },
                links: [
                    {
                        element_id: 17,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 18,
                        cost: {
                            boot: 1,
                            sword: 2,
                        },
                    },
                    {
                        element_id: 33,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 38,
                        cost: {
                            teleport: 1,
                        },
                    },
                ],
                items: {
                    monkey_idol: {
                        count: 3,
                        value: 5,
                    },
                },
            },
            {
                id: 25,
                isDungeon: true,
                position: {
                    x: 567,
                    y: 1626,
                    width: 240,
                    height: 200,
                },
                links: [
                    {
                        element_id: 20,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 29,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                ],
                items: {
                    artefact: {
                        count: 1,
                        value: 10,
                    },
                },
            },
            {
                id: 26,
                isDungeon: true,
                isMarket: true,
                position: {
                    x: 1143,
                    y: 1593,
                    width: 230,
                    height: 280,
                },
                links: [
                    {
                        element_id: 20,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 21,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 22,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 31,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
            },
            {
                id: 27,
                isDungeon: true,
                isMarket: true,
                position: {
                    x: 1524,
                    y: 1649,
                    width: 230,
                    height: 280,
                },
                links: [
                    {
                        element_id: 22,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 33,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 32,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
            },
            {
                id: 28,
                isDungeon: true,
                isMarket: true,
                position: {
                    x: 90,
                    y: 2037,
                    width: 230,
                    height: 280,
                },
                links: [
                    {
                        element_id: 29,
                        cost: {
                            boot: 1,
                            key_token: 1,
                        },
                    },
                    {
                        element_id: 39,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
            },
            {
                id: 29,
                isDungeon: true,
                position: {
                    x: 409,
                    y: 1896,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 19,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 25,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 28,
                        cost: {
                            boot: 1,
                            key_token: 1,
                        },
                    },
                    {
                        element_id: 34,
                        cost: {
                            boot: 1,
                            key_token: 1,
                        },
                    },
                    {
                        element_id: 35,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
                items: {
                    minor_secret: {
                        count: 2,
                    },
                },
            },
            {
                id: 30,
                isDungeon: true,
                position: {
                    x: 833,
                    y: 1868,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 31,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 36,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                ],
                items: {
                    artefact: {
                        count: 1,
                        value: 20,
                    },
                },
            },
            {
                id: 31,
                isDungeon: true,
                isCrystalCave: true,
                position: {
                    x: 1203,
                    y: 1919,
                    width: 280,
                    height: 280,
                },
                links: [
                    {
                        element_id: 30,
                        cost: {
                            teleport: 1,
                        },
                    },
                    {
                        element_id: 26,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
                items: {
                    major_secret: {
                        count: 1,
                    },
                },
            },
            {
                id: 32,
                isDungeon: true,
                position: {
                    x: 1587,
                    y: 1961,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 27,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
                items: {
                    major_secret: {
                        count: 1,
                    },
                },
            },
            {
                id: 33,
                isDungeon: true,
                position: {
                    x: 2017,
                    y: 1866,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 23,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 24,
                        cost: {
                            teleport: 1,
                        },
                    },
                    {
                        element_id: 27,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 37,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 38,
                        cost: {
                            boot: 2,
                        },
                    },
                ],
                items: {
                    artefact: {
                        count: 1,
                        value: 5,
                    },
                },
            },
            {
                id: 34,
                isDungeon: true,
                position: {
                    x: 385,
                    y: 2209,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 29,
                        cost: {
                            boot: 1,
                            key_token: 1,
                        },
                    },
                ],
                items: {
                    artefact: {
                        count: 1,
                        value: 25,
                    },
                },
            },
            {
                id: 35,
                isDungeon: true,
                isCrystalCave: true,
                position: {
                    x: 672,
                    y: 2137,
                    width: 280,
                    height: 280,
                },
                links: [
                    {
                        element_id: 29,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 36,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 41,
                        cost: {
                            boot: 2,
                            sword: 1,
                        },
                    },
                ],
            },
            {
                id: 36,
                isDungeon: true,
                position: {
                    x: 1115,
                    y: 2227,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 35,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 30,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 37,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 42,
                        cost: {
                            boot: 1,
                        },
                        benefit: {
                            heal: 1,
                        },
                    },
                ],
                items: {
                    minor_secret: {
                        count: 2,
                    },
                },
            },
            {
                id: 37,
                isDungeon: true,
                position: {
                    x: 1685,
                    y: 2196,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 33,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 36,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 43,
                        cost: {
                            boot: 1,
                            sword: 2,
                        },
                    },
                ],
                items: {
                    artefact: {
                        count: 1,
                        value: 15,
                    },
                },
            },
            {
                id: 38,
                isDungeon: true,
                position: {
                    x: 2338,
                    y: 2095,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 24,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 33,
                        cost: {
                            boot: 2,
                        },
                    },
                    {
                        element_id: 43,
                        cost: {
                            boot: 1,
                            key_token: 1,
                        },
                    },
                ],
                items: {
                    minor_secret: {
                        count: 2,
                    },
                },
            },
            {
                id: 39,
                isDungeon: true,
                position: {
                    x: 135,
                    y: 2429,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 28,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 40,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
                items: {
                    major_secret: {
                        count: 1,
                    },
                },
            },
            {
                id: 40,
                isDungeon: true,
                position: {
                    x: 516,
                    y: 2452,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 39,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 41,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                ],
                items: {
                    artefact: {
                        count: 1,
                        value: 30,
                    },
                },
            },
            {
                id: 41,
                isDungeon: true,
                position: {
                    x: 1079,
                    y: 2447,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 40,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 35,
                        cost: {
                            boot: 2,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 42,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                        benefit: {
                            heal: 1,
                        },
                    },
                ],
                items: {
                    minor_secret: {
                        count: 2,
                    },
                },
            },
            {
                id: 42,
                isDungeon: true,
                isCrystalCave: true,
                position: {
                    x: 1447,
                    y: 2361,
                    width: 280,
                    height: 280,
                },
                links: [
                    {
                        element_id: 36,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 41,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                ],
            },
            {
                id: 43,
                isDungeon: true,
                position: {
                    x: 2068,
                    y: 2398,
                    width: 240,
                    height: 180,
                },
                links: [
                    {
                        element_id: 37,
                        cost: {
                            boot: 1,
                            sword: 2,
                        },
                    },
                    {
                        element_id: 38,
                        cost: {
                            boot: 1,
                            key_token: 1,
                        },
                    },
                ],
                items: {
                    major_secret: {
                        count: 1,
                    },
                },
            },
        ],
    };
    return map;
};
