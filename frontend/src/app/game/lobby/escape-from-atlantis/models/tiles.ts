export const EscapeFromAtlantisTileSettings = {
    type: {
        url: '/assets/escape-from-atlantis/tile-types.png',
        backgroundSize: '300% 100%',
    },
    action: {
        url: '/assets/escape-from-atlantis/tile-actions.png',
        backgroundSize: '500% 300%',
    }
}

export interface EscapeFromAtlantisTileBaseInfo {
    id: number;
    typeId: EscapeFromAtlantisTileTypeIdEnum;
    actionId: EscapeFromAtlantisTileActionIdEnum;
}

export enum EscapeFromAtlantisTileTypeIdEnum {
    Sand = 'Sand',
    Forest = 'Forest',
    Rock = 'Rock',
}

export interface EscapeFromAtlantisTileTypeInfo {
    name: string;
    column: number;
    row: number;
}

export const EscapeFromAtlantisTileTypeTaxonomy: Record<
    EscapeFromAtlantisTileTypeIdEnum,
    EscapeFromAtlantisTileTypeInfo
> = {
    [EscapeFromAtlantisTileTypeIdEnum.Sand]: {
        name: 'Пляж',
        column: 2,
        row: 0,
    },
    [EscapeFromAtlantisTileTypeIdEnum.Forest]: {
        name: 'Лес',
        column: 0,
        row: 0,
    },
    [EscapeFromAtlantisTileTypeIdEnum.Rock]: {
        name: 'Горы',
        column: 1,
        row: 0,
    },
}

export enum EscapeFromAtlantisTileActionIdEnum {
    // useImmediately: true
    AddShark = 'AddShark',
    AddWhale = 'AddWhale',
    AddShip = 'AddShip',
    Whirlpool = 'Whirlpool',
    Vulcan = 'Vulcan',
    // useImmediately: false
    Dolphin = 'Dolphin',
    Wind = 'Wind',
    ReplaceSeaMonster = 'ReplaceSeaMonster',
    ReplaceShark = 'ReplaceShark',
    ReplaceWhale = 'ReplaceWhale',
    // useForDefense: true
    RemoveShark = 'RemoveShark',
    RemoveWhale = 'RemoveWhale',
}

export interface EscapeFromAtlantisTileActionInfo {
    name: string;
    description: string;
    useImmediately: boolean;
    useForDefense: boolean;
    column: number;
    row: number;
}

export const EscapeFromAtlantisTileActionTaxonomy: Record<
    EscapeFromAtlantisTileActionIdEnum,
    EscapeFromAtlantisTileActionInfo
> = {
    [EscapeFromAtlantisTileActionIdEnum.AddShark]: {
        name: 'Добавить акулу',
        description: 'Разместите акулу на месте затопленной плитки.',
        useForDefense: false,
        useImmediately: true,
        column: 0,
        row: 0,
    },
    [EscapeFromAtlantisTileActionIdEnum.AddWhale]: {
        name: 'Добавить кита',
        description: 'Разместите кита на месте затопленной плитки.',
        useForDefense: false,
        useImmediately: true,
        column: 1,
        row: 0,
    },
    [EscapeFromAtlantisTileActionIdEnum.AddShip]: {
        name: 'Добавить лодку',
        description: 'Разместите лодку на месте затопленной плитки. Если гекс содержит пловцов, разместите их на лодке.',
        useForDefense: false,
        useImmediately: true,
        column: 2,
        row: 0,
    },
    [EscapeFromAtlantisTileActionIdEnum.Whirlpool]: {
        name: 'Водоворот',
        description: 'Уберите всех пловцов, лодки и монстров с этого гекса и с соседних.',
        useForDefense: false,
        useImmediately: true,
        column: 3,
        row: 0,
    },
    [EscapeFromAtlantisTileActionIdEnum.Vulcan]: {
        name: 'Вулкан',
        description: 'Закончите игру, при базовых условиях окончания игры.',
        useForDefense: false,
        useImmediately: true,
        column: 4,
        row: 0,
    },
    [EscapeFromAtlantisTileActionIdEnum.Dolphin]: {
        name: 'Дельфин',
        description: 'Переместите своего пловца на 1-3 гекса по морю.',
        useForDefense: false,
        useImmediately: false,
        column: 0,
        row: 1,
    },
    [EscapeFromAtlantisTileActionIdEnum.Wind]: {
        name: 'Попутный ветер',
        description: 'Переместите свою лодку на 1-3 гекса по морю.',
        useForDefense: false,
        useImmediately: false,
        column: 1,
        row: 1,
    },
    [EscapeFromAtlantisTileActionIdEnum.ReplaceSeaMonster]: {
        name: 'Морское чудовище',
        description: 'Переместите морское чудовище на любой свободный участок моря',
        useForDefense: false,
        useImmediately: false,
        column: 2,
        row: 1,
    },
    [EscapeFromAtlantisTileActionIdEnum.ReplaceShark]: {
        name: 'Акула',
        description: 'Переместите акулу на любой свободный участок моря',
        useForDefense: false,
        useImmediately: false,
        column: 3,
        row: 1,
    },
    [EscapeFromAtlantisTileActionIdEnum.ReplaceWhale]: {
        name: 'Кит',
        description: 'Переместите кита на любой свободный участок моря',
        useForDefense: false,
        useImmediately: false,
        column: 4,
        row: 1,
    },
    [EscapeFromAtlantisTileActionIdEnum.RemoveShark]: {
        name: 'Убрать акулу',
        description: 'Если акула перемещается на гекс с вашим пловцом, то вы можете сыграть эту плитку, чтобы убрать эту акулу. Все пловцы на гексе остаются невредимыми.',
        useForDefense: true,
        useImmediately: false,
        column: 0,
        row: 2,
    },
    [EscapeFromAtlantisTileActionIdEnum.RemoveWhale]: {
        name: 'Убрать кита',
        description: 'Если кит перемещается на гекс с вашей лодкой, то вы можете сыграть эту плитку, чтобы убрать этого кита. Ваша лодка остаётся целой.',
        useForDefense: true,
        useImmediately: false,
        column: 1,
        row: 2,
    },
};

export interface EscapeFromAtlantisTileConfig {
    typeId: EscapeFromAtlantisTileTypeIdEnum;
    actionId: EscapeFromAtlantisTileActionIdEnum;
    count: number;
}

export const defaultEscapeFromAtlantisTileConfig: EscapeFromAtlantisTileConfig[] = [
    //#region Sand
    {
        typeId: EscapeFromAtlantisTileTypeIdEnum.Sand,
        actionId: EscapeFromAtlantisTileActionIdEnum.AddShark,
        count: 3,
    },
    {
        typeId: EscapeFromAtlantisTileTypeIdEnum.Sand,
        actionId: EscapeFromAtlantisTileActionIdEnum.AddWhale,
        count: 3,
    },
    {
        typeId: EscapeFromAtlantisTileTypeIdEnum.Sand,
        actionId: EscapeFromAtlantisTileActionIdEnum.AddShip,
        count: 1,
    },
    {
        typeId: EscapeFromAtlantisTileTypeIdEnum.Sand,
        actionId: EscapeFromAtlantisTileActionIdEnum.Wind,
        count: 2,
    },
    {
        typeId: EscapeFromAtlantisTileTypeIdEnum.Sand,
        actionId: EscapeFromAtlantisTileActionIdEnum.Dolphin,
        count: 3,
    },
    {
        typeId: EscapeFromAtlantisTileTypeIdEnum.Sand,
        actionId: EscapeFromAtlantisTileActionIdEnum.ReplaceShark,
        count: 1,
    },
    {
        typeId: EscapeFromAtlantisTileTypeIdEnum.Sand,
        actionId: EscapeFromAtlantisTileActionIdEnum.ReplaceWhale,
        count: 1,
    },
    {
        typeId: EscapeFromAtlantisTileTypeIdEnum.Sand,
        actionId: EscapeFromAtlantisTileActionIdEnum.ReplaceSeaMonster,
        count: 1,
    },
    {
        typeId: EscapeFromAtlantisTileTypeIdEnum.Sand,
        actionId: EscapeFromAtlantisTileActionIdEnum.RemoveShark,
        count: 1,
    },
    //#endregion Sand

    //#region Forest
    {
        typeId: EscapeFromAtlantisTileTypeIdEnum.Forest,
        actionId: EscapeFromAtlantisTileActionIdEnum.Whirlpool,
        count: 2,
    },
    {
        typeId: EscapeFromAtlantisTileTypeIdEnum.Forest,
        actionId: EscapeFromAtlantisTileActionIdEnum.AddShip,
        count: 3,
    },
    {
        typeId: EscapeFromAtlantisTileTypeIdEnum.Forest,
        actionId: EscapeFromAtlantisTileActionIdEnum.AddShark,
        count: 2,
    },
    {
        typeId: EscapeFromAtlantisTileTypeIdEnum.Forest,
        actionId: EscapeFromAtlantisTileActionIdEnum.AddWhale,
        count: 2,
    },
    {
        typeId: EscapeFromAtlantisTileTypeIdEnum.Forest,
        actionId: EscapeFromAtlantisTileActionIdEnum.RemoveShark,
        count: 1,
    },
    {
        typeId: EscapeFromAtlantisTileTypeIdEnum.Forest,
        actionId: EscapeFromAtlantisTileActionIdEnum.RemoveWhale,
        count: 2,
    },
    {
        typeId: EscapeFromAtlantisTileTypeIdEnum.Forest,
        actionId: EscapeFromAtlantisTileActionIdEnum.Dolphin,
        count: 1,
    },
    {
        typeId: EscapeFromAtlantisTileTypeIdEnum.Forest,
        actionId: EscapeFromAtlantisTileActionIdEnum.ReplaceShark,
        count: 1,
    },
    {
        typeId: EscapeFromAtlantisTileTypeIdEnum.Forest,
        actionId: EscapeFromAtlantisTileActionIdEnum.RemoveWhale,
        count: 1,
    },
    {
        typeId: EscapeFromAtlantisTileTypeIdEnum.Forest,
        actionId: EscapeFromAtlantisTileActionIdEnum.ReplaceSeaMonster,
        count: 1,
    },
    //#endregion Forest

    //#region Rock
    {
        typeId: EscapeFromAtlantisTileTypeIdEnum.Rock,
        actionId: EscapeFromAtlantisTileActionIdEnum.Vulcan,
        count: 1,
    },
    {
        typeId: EscapeFromAtlantisTileTypeIdEnum.Rock,
        actionId: EscapeFromAtlantisTileActionIdEnum.AddShark,
        count: 1,
    },
    {
        typeId: EscapeFromAtlantisTileTypeIdEnum.Rock,
        actionId: EscapeFromAtlantisTileActionIdEnum.Whirlpool,
        count: 4,
    },
    {
        typeId: EscapeFromAtlantisTileTypeIdEnum.Rock,
        actionId: EscapeFromAtlantisTileActionIdEnum.RemoveShark,
        count: 1,
    },
    {
        typeId: EscapeFromAtlantisTileTypeIdEnum.Rock,
        actionId: EscapeFromAtlantisTileActionIdEnum.RemoveWhale,
        count: 1,
    },
    //#endregion Rock
]
