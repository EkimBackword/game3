import {
  GamePhaseName,
  GamePlayerId,
} from './game-constants';
import { GameActivePlayers } from './game-players';

export interface GameContext {
    playerCount: number;
    playerIdsOrder: Array<GamePlayerId>;
    playerIdsOrderPosition: number;
    activePlayers: null | GameActivePlayers;
    currentPlayerId: GamePlayerId;
    numMoves: number;
    gameover: boolean;
    turn: number;
    phase: GamePhaseName;
}