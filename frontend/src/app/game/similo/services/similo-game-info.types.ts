import { guid } from '@datorama/akita';
import { GameInfoStatusIdEnum } from '@shared/clank/clank-game.types';
import { SimiloDlcEnum } from '@shared/similo/similo-dlc.types';
import {
    SimiloGameInfoConfig,
    SimiloGameInfoState,
} from '@shared/similo/similo-game.types';

export function createInitialSimiloGameInfoState(config: SimiloGameInfoConfig): SimiloGameInfoState {
    return {
        ...config,
        id: guid(),
        statusId: GameInfoStatusIdEnum.Created,
        players: [],
        mainDlc: SimiloDlcEnum.WildAnimals,
        helpDlc: SimiloDlcEnum.WildAnimals,
        mainDeck: [],
        helpDeck: [],
        masterPlayerId: '',
        isMasterTurn: true,
        countCardsForClose: 0,
        turnIndex: 0,
    };
}
