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
import { EscapeFromAtlantisCellSettings } from '../../models/cells';
import { EscapeFromAtlantisGameBuilder } from '../../models/game-builder';
import { EscapeFromAtlantisGameType } from '../../models/game-type';
import { EscapeFromAtlantisSetupData } from '../../models/setup-data';
import {
    EscapeFromAtlantisTileActionTaxonomy,
    EscapeFromAtlantisTileBaseInfo,
    EscapeFromAtlantisTileSettings,
    EscapeFromAtlantisTileTypeTaxonomy,
} from '../../models/tiles';
import { EscapeFromAtlantisCellDisplayInfo } from '../escape-from-atlantis-cell/escape-from-atlantis-cell';

export interface EscapeFromAtlantisTileInfo extends EscapeFromAtlantisTileBaseInfo {
    cell: EscapeFromAtlantisCellDisplayInfo | null;
    player: EscapeFromAtlantisPlayerDisplayInfo | null;
}

export class EscapeFromAtlantisTileDisplayInfo {

    private configSignal: WritableSignal<EscapeFromAtlantisTileInfo>;

    width = EscapeFromAtlantisCellSettings.width;
    height = EscapeFromAtlantisCellSettings.height;

    id = computed(() => {
        const config = this.configSignal();
        return config.id;
    });

    action = computed(() => {
        const config = this.configSignal();
        return EscapeFromAtlantisTileActionTaxonomy[config.actionId];
    });

    type = computed(() => {
        const config = this.configSignal();
        return EscapeFromAtlantisTileTypeTaxonomy[config.typeId];
    });

    style = computed(() => {
        const config = this.configSignal();
        const action = this.action();
        const type = this.type();
        const cellStyle = config.cell?.style();

        const result: Partial<CSSStyleDeclaration> = {
            opacity: '0',
            top: `${0}px`,
            left: `${0}px`,
            width: `${this.width}px`,
            height: `${this.height}px`,
            backgroundImage: `url(/assets/escape-from-atlantis/tile-actions.png)`,
            backgroundPosition: '0px 0px',
            backgroundSize: '500% 300%',
        };

        if (config.player != null) {
            const positionX = action.column * this.width;
            const positionY = action.row * this.height;
            result.opacity = '1';
            result.backgroundImage = `url(${EscapeFromAtlantisTileSettings.action.url})`;
            result.backgroundPosition = `-${positionX}px -${positionY}px`;
            result.backgroundSize = EscapeFromAtlantisTileSettings.action.backgroundSize;
            return result;
        }

        if (cellStyle != null) {
            const positionX = type.column * this.width;
            const positionY = type.row * this.height;
            result.opacity = '1';
            result.left = cellStyle.left;
            result.top = cellStyle.top;
            result.backgroundImage = `url(${EscapeFromAtlantisTileSettings.type.url})`;
            result.backgroundPosition = `-${positionX}px -${positionY}px`;
            result.backgroundSize = EscapeFromAtlantisTileSettings.type.backgroundSize;
            return result;
        }

        return result;
    })

    private lobbyService = this.injector.get(LobbyService);
    private sessionQuery = this.injector.get(SessionQuery);
    private toastService = this.injector.get(ToastService);
    private client: LobbyClient<EscapeFromAtlantisGameType, EscapeFromAtlantisSetupData> = this.lobbyService.client;
    private builder = this.client.game.builder as Signal<EscapeFromAtlantisGameBuilder | null>;

    constructor(
        config: EscapeFromAtlantisTileInfo,
        private injector: Injector,
    ) {
        this.configSignal = signal(config);
    }

    update(config: EscapeFromAtlantisTileInfo) {
        this.configSignal.set(config);
    }

}
