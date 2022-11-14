import { GameInfoStore } from 'src/app/game/clank/services/game-info.store';

import {
    arrayAdd,
    arrayUpdate,
} from '@datorama/akita';
import {
    ClankCardConfig,
    ClankCardPositionEnum,
    ClankCardPositionNames,
    ClankCardState,
} from '@shared/clank/clank-card.types';
import { GameInfoState } from '@shared/clank/clank-game.types';
import { ClankDlcEnum } from '@shared/clank/clank-info.types';

export class ClankCard {

    id = '';

    get state(): ClankCardState {
        return {
            id: this.id,
            index: this.index,
            position: this.position,
            player_id: this.playerId,
        };
    }

    constructor(
        public config: ClankCardConfig,
        public index: number,
        public copy_index: number,
        public dlc_name: ClankDlcEnum,
        public url: string,
        public position: ClankCardPositionEnum,
        private gameInfoStore?: GameInfoStore,
        public playerId?: string,
    ) {
        this.id = `${dlc_name}_${index}_${copy_index}_${playerId}`;
    }

    getCopy(playerId?: string) {
        return new ClankCard(
            this.config,
            this.index,
            this.copy_index,
            this.dlc_name,
            this.url,
            this.position,
            this.gameInfoStore,
            playerId,
        );
    }

    setPosition(position: ClankCardPositionEnum) {
        this.position = position;
        this.updateCard(`Карта ${this.config.name} переместилась ${ClankCardPositionNames[this.position]}`);
    }

    setIndex(index: number) {
        this.index = index;
    }

    private updateCard(action?: string) {
        if (this.gameInfoStore == null) {
            return;
        }
        this.gameInfoStore.update((state) => {
            const result: Partial<GameInfoState> = {
                cards: arrayUpdate(state.cards, this.id, this.state),
            };
            if (action != null) {
                result.actionLogs = arrayAdd(state.actionLogs, action);
            }
            return result;
        });
    }

}
