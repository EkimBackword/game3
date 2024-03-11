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
import {
    EscapeFromAtlantisCellInfo,
    EscapeFromAtlantisCellSettings,
} from '../../models/cells';
import { EscapeFromAtlantisGameBuilder } from '../../models/game-builder';
import { EscapeFromAtlantisGameType } from '../../models/game-type';
import { EscapeFromAtlantisCellMeepleType } from '../../models/meeples';
import { EscapeFromAtlantisSetupData } from '../../models/setup-data';
import { EscapeFromAtlantisTileDisplayInfo } from '../escape-from-atlantis-tile/escape-from-atlantis-tile';

export class EscapeFromAtlantisCellDisplayInfo {

    private cellSignal: WritableSignal<EscapeFromAtlantisCellInfo>;

    id = computed(() => this.cellSignal().id);

    isFinishCell = computed(() => this.cellSignal().isFinishCell);

    left = computed(() => {
        const config = this.cellSignal();
        return config.position.column * EscapeFromAtlantisCellSettings.columnStep;

    });

    top = computed(() => {
        const config = this.cellSignal();
        const rowOffset = config.position.column % 2 === 0
            ? EscapeFromAtlantisCellSettings.rowOffset
            : 0;
        return config.position.row * EscapeFromAtlantisCellSettings.height + rowOffset;
    });

    style = computed(() => {
        const config = this.cellSignal();
        const left = this.left();
        const top = this.top();
        const result: Partial<CSSStyleDeclaration> = {
            opacity: config.isVisible ? '1' : '0',
            left: `${left}px`,
            top: `${top}px`,
            width: `${EscapeFromAtlantisCellSettings.width}px`,
            height: `${EscapeFromAtlantisCellSettings.height}px`,
        };
        return result;
    });

    // TODO: Определение активной ячейки
    isActive = computed(() => {
        const config = this.cellSignal();
        const takenMeeple = this.client.game.state()?.game.takedMeeple;
        if (takenMeeple == null) {
            return false;
        }

        if (takenMeeple.type === EscapeFromAtlantisCellMeepleType.GameMeeple) {
            return config.tile === null;
        }

        return config.isStartCell;

    })

    className = computed(() => {
        const config = this.cellSignal();
        const isActive = this.isActive();
        if (config.isFinishCell) {
            return 'finish';
        }
        return isActive
            ? 'active'
            : 'disabled';
    });

    EscapeFromAtlantisPlayerMeepleBaseInfo

    meeples = computed(() => {
        const config = this.cellSignal();
        return config.meeples;
    });

    tile: EscapeFromAtlantisTileDisplayInfo | null = null;

    private lobbyService = this.injector.get(LobbyService);
    private sessionQuery = this.injector.get(SessionQuery);
    private toastService = this.injector.get(ToastService);
    private client: LobbyClient<EscapeFromAtlantisGameType, EscapeFromAtlantisSetupData> = this.lobbyService.client;
    private builder = this.client.game.builder as Signal<EscapeFromAtlantisGameBuilder | null>;

    constructor(
        config: EscapeFromAtlantisCellInfo,
        private injector: Injector,
    ) {
        this.cellSignal = signal(config);
        this.tile = config.tile != null
            ? new EscapeFromAtlantisTileDisplayInfo(
                {
                    ...config.tile,
                    cell: this,
                    player: null,
                },
                injector
            )
            : null;
    }

    update(config: EscapeFromAtlantisCellInfo) {
        this.cellSignal.set(config);
        if (this.tile == null) {
            return;
        }

        if (config.tile == null) {
            this.tile = null;
            return;
        }

        this.tile.update({
            ...config.tile,
            cell: this,
            player: null,
        });
    }

    async placeMeeple() {
        if (!this.isActive()) {
            this.toastService.showWarn('Ячейка заблокирована');
            return;
        }

        const builder = this.builder();
        const user = this.sessionQuery.getValue();

        if (builder == null) {
            return;
        }

        const payload = builder.moves.placeMeeple.getPayload(
            {
                cellId: this.id(),
            },
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

}
