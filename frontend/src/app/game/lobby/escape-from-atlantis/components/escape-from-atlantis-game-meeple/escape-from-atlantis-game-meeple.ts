import {
    computed,
    Injector,
    signal,
    Signal,
    WritableSignal,
} from '@angular/core';

import { SessionQuery } from 'src/app/session/session.query';
import { ToastService } from 'src/app/shared/services/toast.service';

import { LobbyClient } from '../../../models/lobby-client';
import { LobbyService } from '../../../services/lobby.service';
import { EscapeFromAtlantisPlayerDisplayInfo } from '../../layouts/escape-from-atlantis-player/escape-from-atlantis-player';
import { EscapeFromAtlantisGameBuilder } from '../../models/game-builder';
import {
    EscapeFromAtlantisGameType,
    EscapeFromAtlantisTakedMeeple,
} from '../../models/game-type';
import {
    EscapeFromAtlantisGameMeepleBaseInfo,
    EscapeFromAtlantisGameMeepleTaxonomy,
    EscapeFromAtlantisMeepleSettings,
} from '../../models/meeples';
import { EscapeFromAtlantisSetupData } from '../../models/setup-data';
import { EscapeFromAtlantisCellDisplayInfo } from '../escape-from-atlantis-cell/escape-from-atlantis-cell';

export interface EscapeFromAtlantisGameMeepleInfo extends EscapeFromAtlantisGameMeepleBaseInfo {
    index: number;
    cell: EscapeFromAtlantisCellDisplayInfo | null;
    player: EscapeFromAtlantisPlayerDisplayInfo | null;
}

export class EscapeFromAtlantisGameMeepleDisplayInfo {

    private configSignal: WritableSignal<EscapeFromAtlantisGameMeepleInfo>;

    size = EscapeFromAtlantisMeepleSettings.size;

    id = computed(() => this.configSignal().id);

    left = computed(() => {
        const config = this.configSignal();
        return EscapeFromAtlantisMeepleSettings.getLeft(
            config.index,
            config.cell != null ? config.cell.left() : 0,
            config.cell != null
        );
    });

    top = computed(() => {
        const config = this.configSignal();
        return EscapeFromAtlantisMeepleSettings.getTop(
            config.index,
            config.cell != null ? config.cell.top() : 0,
            config.cell != null
        );
    });

    zIndex = computed(() => {
        const config = this.configSignal();
        return Math.floor(config.index / 2);
    });

    style = computed(() => {
        const config = this.configSignal();
        const left = this.left();
        const top = this.top();
        const zIndex = this.zIndex();
        const colorInfo = EscapeFromAtlantisGameMeepleTaxonomy[config.meepleId];
        const positionX = colorInfo.column * this.size;
        const style: Partial<CSSStyleDeclaration> = {
            left: `${left}px`,
            top: `${top}px`,
            zIndex: `${zIndex}`,
            width: `${this.size}px`,
            height: `${this.size}px`,
            backgroundImage: `url(/assets/escape-from-atlantis/game-meeples-v4.png)`,
            backgroundPosition: `-${positionX}px 0px`,
            backgroundSize: '400% 100%',
        };
        return style;
    });

    className = computed(() => {
        const config = this.configSignal();
        const takedMeeple = this.client.game.state()?.game.takedMeeple;
        const className = takedMeeple?.id === config.id
            ? 'meeple taked'
            : 'meeple';
        return className;
    });

    private lobbyService = this.injector.get(LobbyService);
    private sessionQuery = this.injector.get(SessionQuery);
    private toastService = this.injector.get(ToastService);
    private client: LobbyClient<EscapeFromAtlantisGameType, EscapeFromAtlantisSetupData> = this.lobbyService.client;
    private builder = this.client.game.builder as Signal<EscapeFromAtlantisGameBuilder | null>;

    constructor(
        config: EscapeFromAtlantisGameMeepleInfo,
        private injector: Injector,
    ) {
        this.configSignal = signal(config);
    }

    update(config: EscapeFromAtlantisGameMeepleInfo) {
        this.configSignal.set(config);
    }

    async takeMeeple() {
        const builder = this.builder();
        const user = this.sessionQuery.getValue();

        if (builder == null) {
            return;
        }

        const payload = builder.moves.takeMeeple.getPayload(
            this.getTakeInfo(),
            user.id,
        );
        const result = await this.client.game.makeMove(payload);
        if (!result.success) {
            this.toastService.showWarn(result.error);
            return;
        }

        if (result.saveState) {
            this.lobbyService.addState(result.state);
        }
    }

    private getTakeInfo() {
        const config = this.configSignal();
        const result: EscapeFromAtlantisTakedMeeple = {
            id: config.id,
            type: config.type,
            cellId: config.cell?.id() ?? null,
            gameMeepleId: null,
            playerId: config.player?.id() ?? null,
        };
        return result;
    }

}
