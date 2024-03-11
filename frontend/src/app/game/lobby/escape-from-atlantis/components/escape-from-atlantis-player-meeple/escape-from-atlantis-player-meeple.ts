import {
    computed,
    Injector,
    signal,
    Signal,
    WritableSignal,
} from '@angular/core';

import { SessionQuery } from 'src/app/session/session.query';
import { ToastService } from 'src/app/shared/services/toast.service';

import { GamePlayerColorList } from '@shared/clank/clank-player.types';

import { LobbyClient } from '../../../models/lobby-client';
import { LobbyService } from '../../../services/lobby.service';
import { EscapeFromAtlantisPlayerDisplayInfo } from '../../layouts/escape-from-atlantis-player/escape-from-atlantis-player';
import { EscapeFromAtlantisGameBuilder } from '../../models/game-builder';
import {
    EscapeFromAtlantisGameType,
    EscapeFromAtlantisTakedMeeple,
} from '../../models/game-type';
import {
    EscapeFromAtlantisMeepleSettings,
    EscapeFromAtlantisPlayerMeepleBaseInfo,
} from '../../models/meeples';
import { EscapeFromAtlantisSetupData } from '../../models/setup-data';
import { EscapeFromAtlantisCellDisplayInfo } from '../escape-from-atlantis-cell/escape-from-atlantis-cell';
import { EscapeFromAtlantisGameMeepleDisplayInfo } from '../escape-from-atlantis-game-meeple/escape-from-atlantis-game-meeple';

export interface EscapeFromAtlantisPlayerMeepleInfo extends EscapeFromAtlantisPlayerMeepleBaseInfo {
    index: number;
    cell: EscapeFromAtlantisCellDisplayInfo | null;
    gameMeeple: EscapeFromAtlantisGameMeepleDisplayInfo | null;
    player: EscapeFromAtlantisPlayerDisplayInfo | null;
}

export class EscapeFromAtlantisPlayerMeepleDisplayInfo {

    private configSignal: WritableSignal<EscapeFromAtlantisPlayerMeepleInfo>;

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
        const colorInfo = GamePlayerColorList[config.color];
        const positionX = colorInfo.column * this.size;
        const positionY = config.cell == null
            ? this.size
            : 0;
        const style: Partial<CSSStyleDeclaration> = {
            left: `${left}px`,
            top: `${top}px`,
            zIndex: `${zIndex}`,
            width: `${this.size}px`,
            height: `${this.size}px`,
            backgroundImage: `url(/assets/escape-from-atlantis/meeples.png)`,
            backgroundPosition: `-${positionX}px -${positionY}px`,
            backgroundSize: '700% 200%',
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

    showValue = computed(() => {
        const config = this.configSignal();
        return config.cell == null;
    });

    value = computed(() => {
        const config = this.configSignal();
        const showValue = this.showValue();
        return showValue
            ? config.value
            : null;
    });

    private lobbyService = this.injector.get(LobbyService);
    private sessionQuery = this.injector.get(SessionQuery);
    private toastService = this.injector.get(ToastService);
    private client: LobbyClient<EscapeFromAtlantisGameType, EscapeFromAtlantisSetupData> = this.lobbyService.client;
    private builder = this.client.game.builder as Signal<EscapeFromAtlantisGameBuilder | null>;

    constructor(
        config: EscapeFromAtlantisPlayerMeepleInfo,
        private injector: Injector,
    ) {
        this.configSignal = signal(config);
    }

    update(config: EscapeFromAtlantisPlayerMeepleInfo) {
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
            gameMeepleId: config.gameMeeple?.id() ?? null,
            playerId: config.player?.id() ?? null,
        };
        return result;
    }

}
