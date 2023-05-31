import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import {
    ChooseCardEventComponent,
    ChooseCardEventComponentData,
    ChooseCardEventComponentItem,
} from 'src/app/game/clank/dialogs/choose-card-event/choose-card-event.component';
import { cardWidth } from 'src/app/shared/components/clank-card/clank-card.types';

import { ClankCostInfo } from '@shared/clank/clank-info.types';

import {
    CardListComponent,
    CardListComponentResult,
} from '../dialogs/card-list/card-list.component';
import { DragonInfoLogComponent } from '../dialogs/dragon-info-log/dragon-info-log.component';
import { LogsListComponent } from '../dialogs/logs-list/logs-list.component';
import { PlayerRowDetailComponent } from '../dialogs/player-row-detail/player-row-detail.component';
import {
    TrashCardsComponent,
    TrashCardsComponentData,
    TrashCardsComponentResult,
} from '../dialogs/trash-cards/trash-cards.component';
import { UseSwordsOrHealthComponent } from '../dialogs/use-swords-or-health/use-swords-or-health.component';

@Injectable()
export class GameDialogsService {

    constructor(
        private matDialog: MatDialog,
    ) { }

    openPlayerRowDetail(data: PlayerRowDetailComponent['data']) {
        return this.matDialog.open(
            PlayerRowDetailComponent,
            {
                data,
                width: `${cardWidth * 5}px`,
            },
        );
    }

    openUseSwordsOrHealthComponent(data: UseSwordsOrHealthComponent['data']) {
        return this.matDialog.open<
            UseSwordsOrHealthComponent,
            UseSwordsOrHealthComponent['data'],
            ClankCostInfo
        >(
            UseSwordsOrHealthComponent,
            {
                data,
                disableClose: false,
                width: '400px',
            },
        );
    }

    openTrashCardsComponent(data: TrashCardsComponentData) {
        return this.matDialog.open<
            TrashCardsComponent,
            TrashCardsComponentData,
            TrashCardsComponentResult
        >(
            TrashCardsComponent,
            {
                data,
                width: `${cardWidth * 5}px`,
            },
        );
    }

    openChooseCardEventComponent(data: ChooseCardEventComponentData) {
        return this.matDialog.open<
            ChooseCardEventComponent,
            ChooseCardEventComponentData,
            ChooseCardEventComponentItem[]
        >(
            ChooseCardEventComponent,
            {
                data,
                width: '600px',
            },
        );
    }

    openCardListComponent(data: CardListComponent['data']) {
        return this.matDialog.open<
            CardListComponent,
            CardListComponent['data'],
            CardListComponentResult
        >(
            CardListComponent,
            {
                data,
                width: `${cardWidth * 5}px`,
            },
        );
    }

    openLogsList(data: LogsListComponent['data']) {
        return this.matDialog.open<
            LogsListComponent,
            LogsListComponent['data']
        >(
            LogsListComponent,
            {
                data,
                width: `${cardWidth * 5}px`,
            },
        );
    }

    openDragonInfoLog(data: DragonInfoLogComponent['data']) {
        return this.matDialog.open<
            DragonInfoLogComponent,
            DragonInfoLogComponent['data']
        >(
            DragonInfoLogComponent,
            {
                data,
                width: `${cardWidth * 6}px`,
            },
        );
    }

}
