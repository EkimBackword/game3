import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
} from '@angular/core';

import { SessionQuery } from 'src/app/session/session.query';
import { recordKeys } from 'src/app/shared/models/shared.types';
import { DialogService } from 'src/app/shared/services/dialog.service';

import {
    faCog,
    faDoorOpen,
    faMagnifyingGlassMinus,
    faMagnifyingGlassPlus,
    faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';

import { LobbyService } from '../../../services/lobby.service';
import { RhBenefitComponentData } from '../../models/benefit';
import { RhLobbyClient } from '../../models/game-lobby-types';
import { RelicHuntersTileTypeTaxonomy } from '../../models/tile';

@Component({
    selector: 'app-rh-sidebar',
    standalone: false,
    templateUrl: './rh-sidebar.component.html',
    styleUrl: './rh-sidebar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RhSidebarComponent implements AfterViewInit {

    private sessionQuery = inject(SessionQuery);
    private lobbyService = inject(LobbyService);
    dialogService = inject(DialogService);

    client: RhLobbyClient = this.lobbyService.client;
    builder = this.client.game.builder;

    icons = {
        help: faQuestionCircle,
        settings: faCog,
        exit: faDoorOpen,
        zoomIn: faMagnifyingGlassPlus,
        zoomOut: faMagnifyingGlassMinus,
    };

    RelicHuntersTileTypeTaxonomy = recordKeys(RelicHuntersTileTypeTaxonomy)
        .map((type) => {
            const size = 60;
            const value = RelicHuntersTileTypeTaxonomy[type];
            const benefits = value.benefits.map(key => {
                const benefit: RhBenefitComponentData = {
                    key,
                    value: 0,
                    size,
                    inlineView: false,
                    hideValue: true,
                };
                return benefit;
            });
            const result = {
                type,
                benefits,
                width: size,
                height: size,
            };
            return result;
        })
        .filter(p => p.benefits.length > 0);

    isWatcher = computed(() => {
        const players = this.client.game.players();
        const user = this.sessionQuery.getValue();
        return players == null || [...players.values()].every(p => p.sessionId !== user.id);
    });

    disableZoomOut = computed(() => this.client.game.zoom() <= 0.7);

    disableZoomIn = computed(() => this.client.game.zoom() >= 1);

    ngAfterViewInit(): void {
        this.client.game.zoom.set(1);
    }

    finishGame() {
        this.lobbyService.finishGame();
    }

    /** Уменьшение масштаба карты */
    zoomOut() {
        this.client.game.zoom.update((value) => value - 0.1);
    }

    /** Увеличение масштаба карты */
    zoomIn() {
        this.client.game.zoom.update((value) => value + 0.1);
    }

}
