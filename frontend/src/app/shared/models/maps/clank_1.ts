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
        dragonTrack: [
            {
                position: {
                    x: 1940,
                    y: 2700,
                    width: 200,
                    height: 250,
                },
                clank: 2,
                startUserCount: 4,
            },
        ],
        elements: [
            {
                id: 1,
                position: {
                    x: 83,
                    y: 60,
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
                    x: 83,
                    y: 320,
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
                    x: 533,
                    y: 326,
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
                    x: 957,
                    y: 334,
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
                    x: 1375,
                    y: 336,
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
                    x: 1825,
                    y: 256,
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
                    x: 143,
                    y: 573,
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
                    x: 615,
                    y: 640,
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
                    x: 983,
                    y: 690,
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
                    x: 1337,
                    y: 700,
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
            },
            {
                id: 11,
                position: {
                    x: 1753,
                    y: 607,
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
                    x: 85,
                    y: 988,
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
            },
            {
                id: 13,
                position: {
                    x: 480,
                    y: 1037,
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
                    x: 923,
                    y: 1020,
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
                    x: 1382,
                    y: 1095,
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
                    x: 1790,
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
                position: {
                    x: 169,
                    y: 1345,
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
                position: {
                    x: 590,
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
                position: {
                    x: 1032,
                    y: 1426,
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
                position: {
                    x: 1487,
                    y: 1429,
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
                position: {
                    x: 1800,
                    y: 1305,
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
                position: {
                    x: 2130,
                    y: 1338,
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
            },
            {
                id: 23,
                position: {
                    x: 100,
                    y: 1810,
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
                position: {
                    x: 350,
                    y: 1557,
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
                position: {
                    x: 578,
                    y: 1850,
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
                position: {
                    x: 1030,
                    y: 1745,
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
                position: {
                    x: 1485,
                    y: 1750,
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
                position: {
                    x: 1786,
                    y: 1620,
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
                position: {
                    x: 2325,
                    y: 1735,
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
                position: {
                    x: 542,
                    y: 2095,
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
                position: {
                    x: 950,
                    y: 2135,
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
                position: {
                    x: 1307,
                    y: 2122,
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
            },
            {
                id: 33,
                position: {
                    x: 1736,
                    y: 2230,
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
                position: {
                    x: 2056,
                    y: 1964,
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
                position: {
                    x: 2335,
                    y: 2060,
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
                position: {
                    x: 214,
                    y: 2400,
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
                position: {
                    x: 698,
                    y: 2398,
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
                position: {
                    x: 1208,
                    y: 2424,
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
                position: {
                    x: 2108,
                    y: 2273,
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
