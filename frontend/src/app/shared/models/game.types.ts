import { Moment } from 'moment';

import { GameInfoActionLog } from '@shared/clank/clank-game.types';

export interface GameInfoActionLogGroup {
    name: string;
    dateForOrder: Moment;
    list: GameInfoActionLogFrontend[];
}

export interface GameInfoActionLogFrontend extends GameInfoActionLog {
    createdAtMoment: Moment;
}

export const MomentDateFormat = 'YYYY MM DD HH:mm:ss Z';

export const MomentDateGroupFormat = 'HH:mm';
