import { environment } from 'src/environments/environment';

export class GameLogger {

    private production = environment.production;

    constructor() {
    }

    warn(message: string) {
        if (!this.production) {
            return;
        }
        console.warn(message);
    }

    error(message: string, data?: any) {
        console.error(message, data);
    }

}

export const gameLogger = new GameLogger();
