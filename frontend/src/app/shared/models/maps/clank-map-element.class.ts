import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GameInfoQuery } from 'src/app/game/clank/services/game-info.query';
import { GameInfoStore } from 'src/app/game/clank/services/game-info.store';

import { ClankMapElementConfig } from '@shared/clank/clank-map.types';

import { ClankPlayer } from '../players/player.class';

export class ClankMapElement {

    players = new Map<string, ClankPlayer>();

    style: Partial<CSSStyleDeclaration> = {};

    get playersList() {
        return [...this.players.values()];
    }

    private ngUnsubscribe = new Subject();

    constructor(
        public config: ClankMapElementConfig,
        private gameInfoQuery: GameInfoQuery,
        private gameInfoStore: GameInfoStore,
    ) {
        this.initStyle();
        this.initListeners();
    }

    onDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    enter(player: ClankPlayer) {
        this.players.set(player.config.id, player);
        player.move(this.config.id);
    }

    leave(player: ClankPlayer) {
        this.players.delete(player.config.id);
    }

    private initListeners() {
        this.gameInfoQuery.onPlayersChangeSubject.pipe(
            takeUntil(this.ngUnsubscribe),
        ).subscribe((players) => {
            players.forEach(p => {
                const player = this.players.get(p.id);
                if (player != null && player.mapElemenId !== this.config.id) {
                    this.leave(player);
                }
            });
        });
    }

    private initStyle() {
        this.style = {
            top: `${this.config?.position.y}px`,
            left: `${this.config?.position.x}px`,
            width: `${this.config?.position.width}px`,
            height: `${this.config?.position.height}px`,
        };
    }

}
