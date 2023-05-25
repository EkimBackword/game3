import { ClankDlcEnum } from '@shared/clank/clank-info.types';
import {
    ClankMapConfig,
    ClankMapConfigIds,
    ClankMapMumiaZoneTypeEnum,
} from '@shared/clank/clank-map.types';

export const getClankMapMinMumiiFirst = () => {
    const map: ClankMapConfig = {
        id: ClankMapConfigIds.clank_proklyatie_mumii_1,
        dlc_id: ClankDlcEnum.clank_proklyatie_mumii,
        name: 'Проклятие мумии! Пирамида',
        url: '/assets/images/maps/clank_proklyatie_mumii_1.jpg',
        width: 3490,
        height: 3400,
        dragonInfo: {
            url: '/assets/images/dragon.png',
            clankAria: {
                x: 2810,
                y: 200,
                width: 630,
                height: 700,
            },
            track: [
                {
                    rage: 0,
                    position: {
                        x: 3340,
                        y: 2976,
                        width: 125,
                        height: 125,
                    },
                    clank: 2,
                    startUserCount: 4,
                },
                {
                    rage: 1,
                    position: {
                        x: 3340,
                        y: 2826,
                        width: 125,
                        height: 125,
                    },
                    clank: 2,
                    startUserCount: 3,
                },
                {
                    rage: 2,
                    position: {
                        x: 3340,
                        y: 2674,
                        width: 125,
                        height: 125,
                    },
                    clank: 3,
                    startUserCount: 2,
                },
                {
                    rage: 3,
                    position: {
                        x: 3340,
                        y: 2524,
                        width: 125,
                        height: 125,
                    },
                    clank: 3,
                    startUserCount: 1,
                },
                {
                    rage: 4,
                    position: {
                        x: 3340,
                        y: 2373,
                        width: 125,
                        height: 125,
                    },
                    clank: 4,
                    startUserCount: 0,
                },
                {
                    rage: 5,
                    position: {
                        x: 3340,
                        y: 2223,
                        width: 125,
                        height: 125,
                    },
                    clank: 4,
                    startUserCount: 0,
                },
                {
                    rage: 6,
                    position: {
                        x: 3340,
                        y: 2071,
                        width: 125,
                        height: 125,
                    },
                    clank: 5,
                    startUserCount: 0,
                },
                {
                    rage: 7,
                    position: {
                        x: 3340,
                        y: 1920,
                        width: 125,
                        height: 125,
                    },
                    clank: 5,
                    startUserCount: 0,
                },
                {
                    rage: 8,
                    position: {
                        x: 3340,
                        y: 1775,
                        width: 125,
                        height: 125,
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
                        x: 1902,
                        y: 256,
                        height: 175,
                        width: 175,
                    },
                    isFinish: false,
                },
                {
                    index: 1,
                    clank: 1,
                    position: {
                        x: 2079,
                        y: 438,
                        height: 175,
                        width: 175,
                    },
                    isFinish: false,
                },
                {
                    index: 2,
                    clank: 2,
                    position: {
                        x: 2256,
                        y: 620,
                        height: 175,
                        width: 175,
                    },
                    isFinish: false,
                },
                {
                    index: 3,
                    clank: 3,
                    position: {
                        x: 2434,
                        y: 800,
                        height: 175,
                        width: 175,
                    },
                    isFinish: false,
                },
                {
                    index: 4,
                    clank: 0,
                    position: {
                        x: 2650,
                        y: 1005,
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
                    x: 1557,
                    y: 71,
                    width: 235,
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
                    x: 1457,
                    y: 281,
                    width: 235,
                    height: 180,
                },
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Sun,
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
                            teleport: 1,
                        },
                    },
                    {
                        element_id: 4,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
            },
            {
                id: 3,
                position: {
                    x: 1176,
                    y: 507,
                    width: 280,
                    height: 280,
                },
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Sun,
                isCrystalCave: true,
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
                            boot: 1,
                            sword: 2,
                        },
                    },
                    {
                        element_id: 5,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                        benefit: {
                            curse: 1,
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
                id: 4,
                position: {
                    x: 1802,
                    y: 594,
                    width: 235,
                    height: 180,
                },
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Sun,
                links: [
                    {
                        element_id: 2,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 3,
                        cost: {
                            boot: 1,
                            sword: 2,
                        },
                    },
                    {
                        element_id: 6,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 7,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 8,
                        cost: {
                            boot: 2,
                        },
                    },
                ],
            },
            {
                id: 5,
                position: {
                    x: 860,
                    y: 933,
                    width: 235,
                    height: 180,
                },
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Sun,
                links: [
                    {
                        element_id: 3,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                        benefit: {
                            curse: 1,
                        },
                    },
                    {
                        element_id: 6,
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
                        element_id: 10,
                        cost: {
                            boot: 2,
                        },
                    },
                ],
            },
            {
                id: 6,
                position: {
                    x: 1262,
                    y: 932,
                    width: 235,
                    height: 180,
                },
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Sun,
                links: [
                    {
                        element_id: 5,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 4,
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
                ],
            },
            {
                id: 7,
                position: {
                    x: 1786,
                    y: 903,
                    width: 280,
                    height: 280,
                },
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Sun,
                isCrystalCave: true,
                links: [
                    {
                        element_id: 4,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 12,
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
                id: 8,
                position: {
                    x: 2151,
                    y: 929,
                    width: 235,
                    height: 180,
                },
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Sun,
                links: [
                    {
                        element_id: 4,
                        cost: {
                            boot: 2,
                        },
                    },
                    {
                        element_id: 13,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 14,
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
                id: 9,
                position: {
                    x: 443,
                    y: 1342,
                    width: 235,
                    height: 180,
                },
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Sun,
                links: [
                    {
                        element_id: 5,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 16,
                        cost: {
                            boot: 1,
                        },
                        benefit: {
                            curse: 1,
                        },
                    },
                    {
                        element_id: 17,
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
                id: 10,
                position: {
                    x: 789,
                    y: 1283,
                    width: 280,
                    height: 280,
                },
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Sun,
                isCrystalCave: true,
                links: [
                    {
                        element_id: 5,
                        cost: {
                            boot: 2,
                        },
                    },
                    {
                        element_id: 11,
                        cost: {
                            boot: 1,
                            sword: 3,
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
                    major_secret: {
                        count: 1,
                    },
                },
            },
            {
                id: 11,
                position: {
                    x: 1351,
                    y: 1254,
                    width: 280,
                    height: 280,
                },
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Sun,
                isCrystalCave: true,
                links: [
                    {
                        element_id: 6,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 10,
                        cost: {
                            boot: 1,
                            sword: 3,
                        },
                    },
                    {
                        element_id: 19,
                        cost: {
                            boot: 1,
                        },
                        benefit: {
                            curse: 1,
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
                    x: 1703,
                    y: 1331,
                    width: 235,
                    height: 180,
                },
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Sun,
                links: [
                    {
                        element_id: 7,
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
                        element_id: 19,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                ],
            },
            {
                id: 13,
                position: {
                    x: 2027,
                    y: 1333,
                    width: 235,
                    height: 180,
                },
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Sun,
                links: [
                    {
                        element_id: 8,
                        cost: {
                            teleport: 1,
                        },
                    },
                    {
                        element_id: 12,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 14,
                        cost: {
                            boot: 1,
                            key_token: 1,
                        },
                    },
                    {
                        element_id: 21,
                        cost: {
                            teleport: 1,
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
                    minor_secret: {
                        count: 2,
                    },
                },
            },
            {
                id: 14,
                position: {
                    x: 2405,
                    y: 1201,
                    width: 235,
                    height: 180,
                },
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Sun,
                links: [
                    {
                        element_id: 8,
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
                    {
                        element_id: 22,
                        cost: {
                            boot: 1,
                        },
                        benefit: {
                            curse: 2,
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
                id: 15,
                position: {
                    x: 2710,
                    y: 1294,
                    width: 280,
                    height: 280,
                },
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Sun,
                isCrystalCave: true,
                links: [
                    {
                        element_id: 22,
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
                id: 16,
                isDungeon: true,
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Axe,
                position: {
                    x: 23,
                    y: 1764,
                    width: 235,
                    height: 180,
                },
                links: [
                    {
                        element_id: 9,
                        cost: {
                            boot: 1,
                        },
                        benefit: {
                            curse: 1,
                        },
                    },
                    {
                        element_id: 24,
                        cost: {
                            teleport: 1,
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
                isDungeon: true,
                isCrystalCave: true,
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Axe,
                position: {
                    x: 382,
                    y: 1726,
                    width: 280,
                    height: 280,
                },
                links: [
                    {
                        element_id: 9,
                        cost: {
                            teleport: 2,
                        },
                    },
                    {
                        element_id: 18,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 25,
                        cost: {
                            boot: 1,
                            sword: 2,
                        },
                    },
                    {
                        element_id: 24,
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
                id: 18,
                isDungeon: true,
                isMarket: true,
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Axe,
                position: {
                    x: 896,
                    y: 1725,
                    width: 230,
                    height: 270,
                },
                links: [
                    {
                        element_id: 10,
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
                        element_id: 19,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
            },
            {
                id: 19,
                isDungeon: true,
                isMarket: true,
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Axe,
                position: {
                    x: 1299,
                    y: 1731,
                    width: 230,
                    height: 270,
                },
                links: [
                    {
                        element_id: 11,
                        cost: {
                            boot: 1,
                        },
                        benefit: {
                            curse: 1,
                        },
                    },
                    {
                        element_id: 12,
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
                    {
                        element_id: 20,
                        cost: {
                            boot: 2,
                        },
                        benefit: {
                            heal: 1,
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
                    minor_secret: {
                        count: 2,
                    },
                },
            },
            {
                id: 20,
                isDungeon: true,
                isCrystalCave: true,
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Snake,
                position: {
                    x: 1655,
                    y: 1727,
                    width: 280,
                    height: 280,
                },
                links: [
                    {
                        element_id: 19,
                        cost: {
                            boot: 2,
                        },
                    },
                    {
                        element_id: 21,
                        cost: {
                            boot: 1,
                            key_token: 1,
                        },
                    },
                    {
                        element_id: 27,
                        cost: {
                            boot: 1,
                        },
                        benefit: {
                            curse: 1,
                        },
                    },
                ],
            },
            {
                id: 21,
                isDungeon: true,
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Snake,
                position: {
                    x: 2044,
                    y: 1748,
                    width: 215,
                    height: 480,
                },
                links: [
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
                            key_token: 1,
                        },
                    },
                    {
                        element_id: 22,
                        cost: {
                            teleport: 1,
                        },
                    },
                    {
                        element_id: 27,
                        cost: {
                            teleport: 1,
                        },
                    },
                    {
                        element_id: 34,
                        cost: {
                            boot: 1,
                        },
                        benefit: {
                            curse: 1,
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
                id: 22,
                isDungeon: true,
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Snake,
                position: {
                    x: 2513,
                    y: 1739,
                    width: 235,
                    height: 180,
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
                            boot: 1,
                        },
                        benefit: {
                            curse: 2,
                        },
                    },
                    {
                        element_id: 15,
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
                        element_id: 28,
                        cost: {
                            boot: 1,
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
                id: 23,
                isDungeon: true,
                isCrystalCave: true,
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Snake,
                position: {
                    x: 2840,
                    y: 1732,
                    width: 280,
                    height: 280,
                },
                links: [
                    {
                        element_id: 28,
                        cost: {
                            boot: 1,
                        },
                        benefit: {
                            curse: 3,
                        },
                    },
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
                id: 24,
                isDungeon: true,
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Axe,
                position: {
                    x: 406,
                    y: 2161,
                    width: 235,
                    height: 180,
                },
                links: [
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
                    {
                        element_id: 25,
                        cost: {
                            boot: 1,
                        },
                        benefit: {
                            curse: 1,
                        },
                    },
                    {
                        element_id: 29,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 30,
                        cost: {
                            boot: 1,
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
                id: 25,
                isDungeon: true,
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Axe,
                position: {
                    x: 905,
                    y: 2075,
                    width: 235,
                    height: 180,
                },
                links: [
                    {
                        element_id: 17,
                        cost: {
                            boot: 1,
                            sword: 2,
                        },
                    },
                    {
                        element_id: 24,
                        cost: {
                            boot: 1,
                        },
                        benefit: {
                            curse: 1,
                        },
                    },
                    {
                        element_id: 26,
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
                id: 26,
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Chair,
                isDungeon: true,
                isMarket: true,
                position: {
                    x: 1277,
                    y: 2080,
                    width: 230,
                    height: 270,
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
                            key_token: 1,
                        },
                    },
                    {
                        element_id: 27,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 30,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 32,
                        cost: {
                            boot: 1,
                            key_token: 1,
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
                id: 27,
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Chair,
                isDungeon: true,
                position: {
                    x: 1677,
                    y: 2199,
                    width: 235,
                    height: 180,
                },
                links: [
                    {
                        element_id: 20,
                        cost: {
                            boot: 1,
                        },
                        benefit: {
                            curse: 1,
                            heal: 1,
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
                        element_id: 26,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 34,
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
                id: 28,
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Snake,
                isDungeon: true,
                isMarket: true,
                position: {
                    x: 2502,
                    y: 2148,
                    width: 230,
                    height: 270,
                },
                links: [
                    {
                        element_id: 22,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 23,
                        cost: {
                            boot: 1,
                        },
                        benefit: {
                            curse: 3,
                        },
                    },
                    {
                        element_id: 29,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 34,
                        cost: {
                            boot: 1,
                        },
                    },
                ],
            },
            {
                id: 29,
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Snake,
                isDungeon: true,
                position: {
                    x: 2810,
                    y: 2167,
                    width: 235,
                    height: 180,
                },
                links: [
                    {
                        element_id: 23,
                        cost: {
                            boot: 1,
                            key_token: 1,
                        },
                    },
                    {
                        element_id: 24,
                        cost: {
                            boot: 1,
                        },
                    },
                    {
                        element_id: 28,
                        cost: {
                            boot: 1,
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
                    minor_secret: {
                        count: 2,
                    },
                },
            },
            {
                id: 30,
                isDungeon: true,
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Axe,
                isCrystalCave: true,
                position: {
                    x: 648,
                    y: 2358,
                    width: 280,
                    height: 280,
                },
                links: [
                    {
                        element_id: 24,
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
                        element_id: 31,
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
                id: 31,
                isDungeon: true,
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Axe,
                position: {
                    x: 974,
                    y: 2716,
                    width: 235,
                    height: 180,
                },
                links: [
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
                            boot: 2,
                        },
                    },
                    {
                        element_id: 36,
                        cost: {
                            teleport: 1,
                        },
                    },
                    {
                        element_id: 37,
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
                id: 32,
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Chair,
                isDungeon: true,
                isCrystalCave: true,
                position: {
                    x: 1346,
                    y: 2569,
                    width: 280,
                    height: 280,
                },
                links: [
                    {
                        element_id: 26,
                        cost: {
                            boot: 1,
                            key_token: 1,
                        },
                    },
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
                        },
                        benefit: {
                            curse: 1,
                        },
                    },
                ],
                items: {
                    monkey_idol: {
                        count: 1,
                        value: 10,
                    },
                },
            },
            {
                id: 33,
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Chair,
                isDungeon: true,
                position: {
                    x: 1761,
                    y: 2542,
                    width: 235,
                    height: 180,
                },
                links: [
                    {
                        element_id: 32,
                        cost: {
                            boot: 1,
                        },
                        benefit: {
                            curse: 1,
                        },
                    },
                    {
                        element_id: 34,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 37,
                        cost: {
                            boot: 1,
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
                id: 34,
                isDungeon: true,
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Snake,
                isCrystalCave: true,
                position: {
                    x: 2140,
                    y: 2417,
                    width: 280,
                    height: 280,
                },
                links: [
                    {
                        element_id: 21,
                        cost: {
                            boot: 1,
                        },
                        benefit: {
                            curse: 1,
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
                        },
                    },
                    {
                        element_id: 33,
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
                id: 35,
                isDungeon: true,
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Snake,
                isCrystalCave: true,
                position: {
                    x: 2692,
                    y: 2502,
                    width: 280,
                    height: 280,
                },
                links: [
                    {
                        element_id: 29,
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
                        benefit: {
                            curse: 1,
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
                id: 36,
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Chair,
                isDungeon: true,
                isCrystalCave: true,
                position: {
                    x: 1225,
                    y: 2957,
                    width: 280,
                    height: 280,
                },
                links: [
                    {
                        element_id: 31,
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
                        element_id: 39,
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
                id: 37,
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Chair,
                isDungeon: true,
                position: {
                    x: 1667,
                    y: 2838,
                    width: 235,
                    height: 180,
                },
                links: [
                    {
                        element_id: 31,
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
                        element_id: 36,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 38,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 39,
                        cost: {
                            boot: 1,
                            key_token: 1,
                        },
                    },
                ],
            },
            {
                id: 38,
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Chair,
                isDungeon: true,
                position: {
                    x: 2020,
                    y: 2948,
                    width: 235,
                    height: 180,
                },
                links: [
                    {
                        element_id: 37,
                        cost: {
                            boot: 1,
                            sword: 1,
                        },
                    },
                    {
                        element_id: 35,
                        cost: {
                            boot: 2,
                        },
                        benefit: {
                            curse: 1,
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
                id: 39,
                mumiaZoneType: ClankMapMumiaZoneTypeEnum.Chair,
                isDungeon: true,
                position: {
                    x: 1630,
                    y: 3203,
                    width: 235,
                    height: 180,
                },
                links: [
                    {
                        element_id: 36,
                        cost: {
                            boot: 1,
                            sword: 2,
                        },
                    },
                    {
                        element_id: 37,
                        cost: {
                            boot: 1,
                            key_token: 1,
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
        ],
    };
    return map;
};
