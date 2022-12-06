import { ClankDlcEnum } from '@shared/clank/clank-info.types';
import {
    ClankMapConfig,
    ClankMapConfigIds,
} from '@shared/clank/clank-map.types';

export const getClankMapFirst = () => {
    const map: ClankMapConfig = {
        id: ClankMapConfigIds.clank_1,
        dlc_id: ClankDlcEnum.clank,
        name: 'Кланк! Подземное приключение',
        url: '/assets/images/maps/clank_1.jpg',
        width: 3000,
        height: 3000,
        dragonInfo: {
            url: '/assets/images/dragon.png',
            maxRage: 6,
            track: [
                {
                    rage: 0,
                    position: {
                        x: 1940,
                        y: 2750,
                        width: 200,
                        height: 200,
                    },
                    clank: 2,
                    startUserCount: 4,
                },
                {
                    rage: 1,
                    position: {
                        x: 2240,
                        y: 2720,
                        width: 200,
                        height: 200,
                    },
                    clank: 2,
                    startUserCount: 3,
                },
                {
                    rage: 2,
                    position: {
                        x: 2520,
                        y: 2560,
                        width: 200,
                        height: 200,
                    },
                    clank: 3,
                    startUserCount: 2,
                },
                {
                    rage: 3,
                    position: {
                        x: 2690,
                        y: 2300,
                        width: 200,
                        height: 200,
                    },
                    clank: 3,
                    startUserCount: 1,
                },
                {
                    rage: 4,
                    position: {
                        x: 2740,
                        y: 2020,
                        width: 200,
                        height: 200,
                    },
                    clank: 4,
                    startUserCount: 0,
                },
                {
                    rage: 5,
                    position: {
                        x: 2740,
                        y: 1730,
                        width: 200,
                        height: 200,
                    },
                    clank: 4,
                    startUserCount: 0,
                },
                {
                    rage: 6,
                    position: {
                        x: 2740,
                        y: 1430,
                        width: 200,
                        height: 200,
                    },
                    clank: 5,
                    startUserCount: 0,
                },
            ],
        },
        elements: [
            {
                id: 1,
                position: {
                    x: 65,
                    y: 75,
                    width: 230,
                    height: 180,
                },
                links: [
                    {
                        element_id: 2,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
                isStart: true,
            },
            {
                id: 2,
                position: {
                    x: 65,
                    y: 310,
                    width: 230,
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
                        element_id: 3,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
            },
            {
                id: 3,
                position: {
                    x: 510,
                    y: 310,
                    width: 230,
                    height: 180,
                },
                links: [
                    {
                        element_id: 2,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 4,
                        cost: {
                            boot: 2,
                        },
                    },
                    {
                        element_id: 7,
                        cost: {
                            teleport: 1,
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
                id: 4,
                position: {
                    x: 930,
                    y: 310,
                    width: 230,
                    height: 180,
                },
                links: [
                    {
                        element_id: 3,
                        cost: {
                            boot: 2,
                        },
                    },
                    {
                        element_id: 5,
                        cost: {
                            boot: 2,
                        },
                    },
                    {
                        element_id: 9,
                        cost: {
                            key: 1,
                            boot: 1,
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
                id: 5,
                position: {
                    x: 1340,
                    y: 310,
                    width: 230,
                    height: 180,
                },
                links: [
                    {
                        element_id: 4,
                        cost: {
                            boot: 2,
                        },
                    },
                    {
                        element_id: 5,
                        cost: {
                            teleport: 1,
                        },
                    },
                    {
                        element_id: 10,
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
                id: 6,
                position: {
                    x: 1800,
                    y: 235,
                    width: 230,
                    height: 180,
                },
                links: [
                    {
                        element_id: 5,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 11,
                        cost: {
                            boot: 1,
                            key: 1,
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
                id: 7,
                position: {
                    x: 130,
                    y: 575,
                    width: 280,
                    height: 280,
                },
                links: [
                    {
                        element_id: 3,
                        cost: {
                            boot: 2,
                        },
                    },
                    {
                        element_id: 12,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                ],
                isCrystalCave: true,
                items: {
                    major_secret: {
                        count: 1,
                    },
                },
            },
            {
                id: 8,
                position: {
                    x: 585,
                    y: 625,
                    width: 280,
                    height: 280,
                },
                links: [
                    {
                        element_id: 3,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 13,
                        cost: {
                            boot: 2,
                        },
                    },
                    {
                        element_id: 14,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                ],
                isCrystalCave: true,
            },
            {
                id: 9,
                position: {
                    x: 954,
                    y: 665,
                    width: 230,
                    height: 180,
                },
                links: [
                    {
                        element_id: 4,
                        cost: {
                            boot: 1,
                            key: 1,
                        },
                    },
                    {
                        element_id: 14,
                        cost: {
                            boot: 1,
                            key: 1,
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
                id: 10,
                position: {
                    x: 1320,
                    y: 680,
                    width: 280,
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
                        element_id: 5,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 11,
                        cost: {
                            boot: 2,
                        },
                    },
                    {
                        element_id: 15,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                ],
                isCrystalCave: true,
                items: {
                    minor_secret: {
                        count: 2,
                    },
                },
            },
            {
                id: 11,
                position: {
                    x: 1733,
                    y: 585,
                    width: 230,
                    height: 180,
                },
                links: [
                    {
                        element_id: 6,
                        cost: {
                            boot: 1,
                            key: 1,
                        },
                    },
                    {
                        element_id: 10,
                        cost: {
                            boot: 2,
                        },
                    },
                    {
                        element_id: 16,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
            },
            {
                id: 12,
                position: {
                    x: 72,
                    y: 986,
                    width: 230,
                    height: 180,
                },
                links: [
                    {
                        element_id: 7,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 17,
                        cost: {
                            boot: 2,
                        },
                    },
                ],
                items: {
                    heal: {
                        count: -1,
                        value: 1,
                    },
                },
            },
            {
                id: 13,
                position: {
                    x: 455,
                    y: 1035,
                    width: 230,
                    height: 180,
                },
                links: [
                    {
                        element_id: 8,
                        cost: {
                            boot: 2,
                        },
                    },
                    {
                        element_id: 18,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 17,
                        cost: {
                            boot: 1,
                            sword: 1,
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
                    x: 895,
                    y: 1010,
                    width: 280,
                    height: 280,
                },
                links: [
                    {
                        element_id: 8,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 9,
                        cost: {
                            boot: 1,
                            key: 1,
                        },
                    },
                    {
                        element_id: 18,
                        cost: {
                            boot: 2,
                        },
                    },
                    {
                        element_id: 19,
                        cost: {
                            boot: 1,
                            sword: 2,
                        },
                    },
                    {
                        element_id: 15,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
                isCrystalCave: true,
            },
            {
                id: 15,
                position: {
                    x: 1370,
                    y: 1075,
                    width: 230,
                    height: 180,
                },
                links: [
                    {
                        element_id: 14,
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
                        element_id: 16,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 21,
                        cost: {
                            boot: 1,
                            key: 1,
                        },
                    },
                ],
            },
            {
                id: 16,
                position: {
                    x: 1785,
                    y: 980,
                    width: 230,
                    height: 180,
                },
                links: [
                    {
                        element_id: 15,
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
                        element_id: 21,
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
                id: 17,
                isDungeon: true,
                position: {
                    x: 155,
                    y: 1350,
                    width: 230,
                    height: 180,
                },
                links: [
                    {
                        element_id: 12,
                        cost: {
                            boot: 2,
                        },
                    },
                    {
                        element_id: 13,
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
                        element_id: 24,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 23,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 18,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
            },
            {
                id: 18,
                isDungeon: true,
                position: {
                    x: 572,
                    y: 1330,
                    width: 280,
                    height: 280,
                },
                links: [
                    {
                        element_id: 13,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 14,
                        cost: {
                            boot: 2,
                        },
                    },
                    {
                        element_id: 17,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 25,
                        cost: {
                            boot: 2,
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
                isCrystalCave: true,
                items: {
                    artefact: {
                        count: 1,
                        value: 5,
                    },
                },
            },
            {
                id: 19,
                isDungeon: true,
                position: {
                    x: 1015,
                    y: 1425,
                    width: 213,
                    height: 253,
                },
                links: [
                    {
                        element_id: 14,
                        cost: {
                            boot: 1,
                            sword: 2,
                        },
                    },
                    {
                        element_id: 26,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
                isMarket: true,
                items: {
                    minor_secret: {
                        count: 2,
                    },
                },
            },
            {
                id: 20,
                isDungeon: true,
                position: {
                    x: 1475,
                    y: 1420,
                    width: 215,
                    height: 254,
                },
                links: [
                    {
                        element_id: 21,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 27,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 28,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                ],
                isMarket: true,
                items: {
                    minor_secret: {
                        count: 2,
                    },
                },
            },
            {
                id: 21,
                isDungeon: true,
                position: {
                    x: 1808,
                    y: 1304,
                    width: 230,
                    height: 180,
                },
                links: [
                    {
                        element_id: 15,
                        cost: {
                            boot: 1,
                            key: 1,
                        },
                    },
                    {
                        element_id: 16,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 20,
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
                ],
                items: {
                    artefact: {
                        count: 1,
                        value: 7,
                    },
                },
            },
            {
                id: 22,
                isDungeon: true,
                position: {
                    x: 2145,
                    y: 1340,
                    width: 280,
                    height: 280,
                },
                links: [
                    {
                        element_id: 21,
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
                        element_id: 29,
                        cost: {
                            boot: 1,
                            key: 1,
                        },
                    },
                ],
                isCrystalCave: true,
                items: {
                    minor_secret: {
                        count: 2,
                    },
                },
            },
            {
                id: 23,
                isDungeon: true,
                position: {
                    x: 92,
                    y: 1832,
                    width: 220,
                    height: 480,
                },
                links: [
                    {
                        element_id: 24,
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
                ],
                items: {
                    monkey_idol: {
                        count: 2,
                        value: 5,
                    },
                },
            },
            {
                id: 24,
                isDungeon: true,
                position: {
                    x: 328,
                    y: 1568,
                    width: 280,
                    height: 280,
                },
                links: [
                    {
                        element_id: 17,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
                isCrystalCave: true,
                items: {
                    artefact: {
                        count: 1,
                        value: 15,
                    },
                },
            },
            {
                id: 25,
                isDungeon: true,
                position: {
                    x: 575,
                    y: 1873,
                    width: 250,
                    height: 200,
                },
                links: [
                    {
                        element_id: 18,
                        cost: {
                            boot: 2,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 26,
                        cost: {
                            boot: 1,
                            key: 1,
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
                id: 26,
                isDungeon: true,
                position: {
                    x: 1015,
                    y: 1755,
                    width: 215,
                    height: 255,
                },
                links: [
                    {
                        element_id: 18,
                        cost: {
                            boot: 1,
                        },
                    },
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
                            key: 1,
                        },
                    },
                    {
                        element_id: 27,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 30,
                        cost: {
                            boot: 2,
                        },
                    },
                    {
                        element_id: 31,
                        cost: {
                            boot: 1,
                            sword: 2,
                        },
                    },
                ],
                isMarket: true,
            },
            {
                id: 27,
                isDungeon: true,
                position: {
                    x: 1475,
                    y: 1755,
                    width: 215,
                    height: 255,
                },
                links: [
                    {
                        element_id: 20,
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
                        element_id: 32,
                        cost: {
                            boot: 1,
                            key: 1,
                        },
                    },
                ],
                isMarket: true,
                items: {
                    artefact: {
                        count: 1,
                        value: 10,
                    },
                },
            },
            {
                id: 28,
                isDungeon: true,
                position: {
                    x: 1792,
                    y: 1635,
                    width: 280,
                    height: 280,
                },
                links: [
                    {
                        element_id: 20,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                ],
                isCrystalCave: true,
                items: {
                    major_secret: {
                        count: 1,
                    },
                },
            },
            {
                id: 29,
                isDungeon: true,
                position: {
                    x: 2342,
                    y: 1755,
                    width: 250,
                    height: 200,
                },
                links: [
                    {
                        element_id: 22,
                        cost: {
                            boot: 1,
                            key: 1,
                        },
                    },
                    {
                        element_id: 35,
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
                id: 30,
                isDungeon: true,
                position: {
                    x: 528,
                    y: 2118,
                    width: 225,
                    height: 180,
                },
                links: [
                    {
                        element_id: 23,
                        cost: {
                            boot: 2,
                        },
                    },
                    {
                        element_id: 26,
                        cost: {
                            boot: 2,
                        },
                    },
                    {
                        element_id: 36,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 31,
                        cost: {
                            boot: 1,
                            sword: 2,
                        },
                    },
                    {
                        element_id: 36,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
                items: {
                    minor_secret: {
                        count: 1,
                    },
                },
            },
            {
                id: 31,
                isDungeon: true,
                position: {
                    x: 940,
                    y: 2157,
                    width: 225,
                    height: 170,
                },
                links: [
                    {
                        element_id: 26,
                        cost: {
                            boot: 1,
                            sword: 2,
                        },
                    },
                    {
                        element_id: 30,
                        cost: {
                            boot: 1,
                            sword: 2,
                        },
                    },
                    {
                        element_id: 32,
                        cost: {
                            boot: 1,
                            key: 1,
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
                        value: 20,
                    },
                },
            },
            {
                id: 32,
                isDungeon: true,
                position: {
                    x: 1307,
                    y: 2150,
                    width: 280,
                    height: 280,
                },
                links: [
                    {
                        element_id: 27,
                        cost: {
                            boot: 1,
                            key: 1,
                        },
                    },
                    {
                        element_id: 31,
                        cost: {
                            boot: 1,
                            key: 1,
                        },
                    },
                    {
                        element_id: 33,
                        cost: {
                            boot: 1,
                            sword: 2,
                        },
                    },
                ],
                isCrystalCave: true,
                items: {
                    minor_secret: {
                        count: 2,
                    },
                },
            },
            {
                id: 33,
                isDungeon: true,
                position: {
                    x: 1736,
                    y: 2249,
                    width: 220,
                    height: 170,
                },
                links: [
                    {
                        element_id: 32,
                        cost: {
                            boot: 1,
                            sword: 2,
                        },
                    },
                    {
                        element_id: 34,
                        cost: {
                            boot: 2,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 38,
                        cost: {
                            boot: 1,
                            sword: 2,
                        },
                    },
                    {
                        element_id: 39,
                        cost: {
                            boot: 1,
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
                id: 34,
                isDungeon: true,
                position: {
                    x: 2062,
                    y: 1970,
                    width: 220,
                    height: 170,
                },
                links: [
                    {
                        element_id: 28,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 33,
                        cost: {
                            boot: 2,
                            sword: 1,
                        },
                    },
                ],
                items: {
                    heal: {
                        count: -1,
                        value: 1,
                    },
                },
            },
            {
                id: 35,
                isDungeon: true,
                position: {
                    x: 2344,
                    y: 2072,
                    width: 230,
                    height: 170,
                },
                links: [
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
                        value: 30,
                    },
                },
            },
            {
                id: 36,
                isDungeon: true,
                position: {
                    x: 202,
                    y: 2422,
                    width: 230,
                    height: 170,
                },
                links: [
                    {
                        element_id: 30,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 37,
                        cost: {
                            boot: 1,
                            key: 1,
                        },
                    },
                ],
            },
            {
                id: 37,
                isDungeon: true,
                position: {
                    x: 700,
                    y: 2442,
                    width: 250,
                    height: 190,
                },
                links: [
                    {
                        element_id: 36,
                        cost: {
                            boot: 1,
                            key: 1,
                        },
                    },
                    {
                        element_id: 31,
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
                id: 38,
                isDungeon: true,
                position: {
                    x: 1200,
                    y: 2450,
                    width: 220,
                    height: 170,
                },
                links: [
                    {
                        element_id: 31,
                        cost: {
                            boot: 2,
                        },
                    },
                    {
                        element_id: 33,
                        cost: {
                            boot: 1,
                            sword: 2,
                        },
                    },
                    {
                        element_id: 39,
                        cost: {
                            boot: 2,
                            sword: 1,
                        },
                    },
                ],
                items: {
                    heal: {
                        count: -1,
                        value: 1,
                    },
                },
            },
            {
                id: 39,
                isDungeon: true,
                position: {
                    x: 2120,
                    y: 2300,
                    width: 280,
                    height: 280,
                },
                links: [
                    {
                        element_id: 33,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 38,
                        cost: {
                            boot: 2,
                            sword: 1,
                        },
                    },
                ],
                isCrystalCave: true,
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
