import { ClankCardState } from 'src/app/shared/models/cards/cards.types';
import { ClankDlcEnum } from 'src/app/shared/models/clank.types';
import { ClankPlayerConfig } from 'src/app/shared/models/players/player.types';

import { ClankMapConfigIds } from '../../../shared/models/maps/clank-maps.types';

export enum GameInfoStatusIdEnum {
    Empty,
    New,
    Created,
    Started,
    Finished,
}

export interface GameInfoConfig {
    /** Имя вводится при создании */
    name: string;
    /** Карта игры */
    mapId: ClankMapConfigIds;
    /** Карта игры */
    reserveDeckIds: ClankDlcEnum[];
    /** Карта игры */
    startDeckId: ClankDlcEnum;
    /** Карта игры */
    shareDeckIds: ClankDlcEnum[];
}

export interface GameInfoState extends GameInfoConfig {
    /** ID присваивается после создания */
    id: string;
    /** Статус игры */
    statusId: GameInfoStatusIdEnum;
    /**
     * Список игроков
     * @description Состояния игроков могут меняться,
     * что должно отображатся на карте
     */
    players: ClankPlayerConfig[];
    /**
     * Список карт
     * @description Состояния карт могут меняться,
     * что должно отображатся на карте
     */
    cards: ClankCardState[];
    /** Идентификатор активного игрока */
    activePlayerId: string;
    /** Идентификатор активного игрока */
    actionLogs: string[];
}

export function createInitialGameInfoState(): GameInfoState {
    return {
        id: '',
        name: 'Not found',
        statusId: GameInfoStatusIdEnum.Empty,
        mapId: ClankMapConfigIds.clank_1,
        reserveDeckIds: [ClankDlcEnum.clank],
        startDeckId: ClankDlcEnum.clank,
        shareDeckIds: [ClankDlcEnum.clank],
        players: [],
        cards: [],
        activePlayerId: '',
        actionLogs: [],
    };
}
