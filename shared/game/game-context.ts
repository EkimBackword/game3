import {
  GamePhaseName,
  GamePlayerId,
} from './game-constants';
import {
  GameActivePlayers,
  GamePlayerMovesCounter,
} from './game-players';

export interface GameContext {
    playerCount: number;
    playerIdsOrder: GamePlayerId[];
    playerIdsOrderPosition: number;
    allPlayers: GamePlayerMovesCounter | null;
    activePlayers: GameActivePlayers | null;
    _nextActivePlayersIndex: number | null;
    currentPlayerId: GamePlayerId;
    gameover: boolean;
    turn: number;
    phase: GamePhaseName | null;
}