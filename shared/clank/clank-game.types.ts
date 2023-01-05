import { ToastSeverityEnum } from '../toast.types';
import { ClankArtifactConfig } from './clank-artifact.types';
import { ClankCardConfig } from './clank-card.types';
import { ClankDragonInfo } from './clank-dragon.types';
import { ClankDlcEnum } from './clank-info.types';
import { ClankMapConfigIds } from './clank-map.types';
import {
  ClankPlayerConfig,
  GamePlayerColorIdEnum,
} from './clank-player.types';
import { ClankTokenConfig } from './clank-token.types';

export enum GameInfoStatusIdEnum {
    Created = 1,
    Started = 2,
    Finished = 3,
}

export const GameInfoStatus: Record<GameInfoStatusIdEnum, {
    name: string
}> = {
    [GameInfoStatusIdEnum.Created]: {
        name: 'Новая игра',
    },
    [GameInfoStatusIdEnum.Started]: {
        name: 'Игра в прогрессе',
    },
    [GameInfoStatusIdEnum.Finished]: {
        name: 'Законченая игра',
    },
}

export interface GameInfoConfig {
    /** Имя вводится при создании */
    name: string;
    /** Карта игры */
    mapId: ClankMapConfigIds;
    /** DLC к которому привязана карта */
    mapDlcId: ClankDlcEnum;
}

export enum GameInfoActionLogType {
    Game,
    Turn,
    Clank,
    Card,
    Token,
    Dragon,
    Move,
    ManualFunction,
}

export interface GameInfoActionLog {
    index: number;
    turnIndex: number;
    createdAt: string;
    data: GameInfoActionLogData;
    type: GameInfoActionLogType;
}

export interface GameInfoActionLogData {
    text: string;
    subtext?: string;
    isDragon?: boolean;
    colorId?: GamePlayerColorIdEnum;
    hideToast?: boolean;
    severity?: ToastSeverityEnum;
    soundUrl?: string;
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
    /** Информация о драконе */
    dragonInfo: ClankDragonInfo;
    /** Колода подземелья */
    dungeonDeck: ClankCardConfig[];
    /** Подземный ряд */
    dungeonRow: ClankCardConfig[];
    /** Общий резерв */
    reserveRow: ClankCardConfig[];
    /** Жетоны на карте */
    mapTokens: ClankTokenConfig[];
    /** Жетоны в магазине */
    marketTokens: ClankTokenConfig[];
    /** Артефакты */
    artifacts: ClankArtifactConfig[];
    /** Индекс активного игрока */
    activePlayerIndex: number;
    /** Идентификатор активного игрока */
    activePlayerId: string;
    /** Идентификатор активного игрока */
    turnIndex: number;
    /** Идентификатор активного игрока */
    actionLogs: GameInfoActionLog[];
    /** Возможность отменить ход */
    canCancel: boolean;
}