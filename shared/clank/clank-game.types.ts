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
    /** DLC к которому привязана карта */
    mapDlcId: ClankDlcEnum;
    /** Список DLC участвующийх в игре */
    dungeonDeckIds: ClankDlcEnum[];
    /** DLC для определения стартовой руки игрока */
    startDeckId: ClankDlcEnum;
}

export interface GameInfoActionLog {
    index: number;
    turnIndex: number;
    createdAt: string;
    data: GameInfoActionLogData;
}

export interface GameInfoActionLogData {
    text: string;
    subtext?: string;
    isDragon?: boolean;
    colorId?: GamePlayerColorIdEnum;
    hideToast?: boolean;
    severity?: ToastSeverityEnum;
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
}