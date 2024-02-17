import * as moment from 'moment';
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

export function getCurrentTime() {
    return moment().format(MomentDateFormat);
}

export const MomentDateGroupFormat = 'HH:mm';

export function preloadImage(urls: string[]) {
    for (const url of urls) {
        const img = new Image();
        img.src = url;
    }
}
