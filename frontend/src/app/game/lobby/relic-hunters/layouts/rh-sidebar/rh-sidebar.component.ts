import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    Signal,
} from '@angular/core';

import { SessionQuery } from 'src/app/session/session.query';
import { recordKeys } from 'src/app/shared/models/shared.types';
import { DialogService } from 'src/app/shared/services/dialog.service';

import {
    faCog,
    faDoorOpen,
    faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';

import { LobbyClient } from '../../../models/lobby-client';
import { LobbyService } from '../../../services/lobby.service';
import { RhBenefitComponentData } from '../../models/benefit';
import { RelicHuntersGameBuilder } from '../../models/game-builder';
import { RelicHuntersSetupData } from '../../models/game-setup-data';
import { RelicHuntersGameType } from '../../models/game-type';
import { RelicHuntersTileTypeTaxonomy } from '../../models/tile';

@Component({
    selector: 'app-rh-sidebar',
    standalone: false,
    templateUrl: './rh-sidebar.component.html',
    styleUrl: './rh-sidebar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RhSidebarComponent {

    private sessionQuery = inject(SessionQuery);
    private lobbyService = inject(LobbyService);
    dialogService = inject(DialogService);

    client: LobbyClient<RelicHuntersGameType, RelicHuntersSetupData> = this.lobbyService.client;
    builder = this.client.game.builder as Signal<RelicHuntersGameBuilder | null>;

    icons = {
        help: faQuestionCircle,
        settings: faCog,
        exit: faDoorOpen,
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
        return !players?.has(user.id);
    });

    finishGame() {
        this.lobbyService.finishGame();
    }

}
