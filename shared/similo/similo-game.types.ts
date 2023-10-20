import { GameInfoStatusIdEnum } from '../clank/clank-game.types';
import { GamePlayerColorIdEnum } from '../clank/clank-player.types';
import {
  SimiloCardConfig,
  SimiloDlcEnum,
} from './similo-dlc.types';

export interface SimiloGameInfoConfig {
    name: string;
}

export interface SimiloGameInfoState extends SimiloGameInfoConfig {
    id: string;
    statusId: GameInfoStatusIdEnum;
    players: SimiloPlayerConfig[];
    mainDlc: SimiloDlcEnum;
    helpDlc: SimiloDlcEnum;
    mainDeck: SimiloCardConfig[];
    helpDeck: SimiloCardConfig[];
    masterPlayerId: string;
    isMasterTurn: boolean;
    countCardsForClose: number;
    turnIndex: number;
}

export interface SimiloPlayerConfig {
    /** Id пользователя */
    id: string;
    /** Имя пользователя */
    name: string;
    /** Id цвета игрока */
    colorId: GamePlayerColorIdEnum;
    /** Онлайн или оффлайн */
    isOnline: boolean;
    /** Создатель игры */
    isAdmin: boolean;
}