import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { ClankDungeonRowComponent } from './clank-dungeon-row/clank-dungeon-row.component';
import { ClankGameInfoComponent } from './clank-game-info/clank-game-info.component';
import { ClankMapElementComponent } from './clank-map-element/clank-map-element.component';
import { ClankMapComponent } from './clank-map/clank-map.component';
import { ClankPlayerInfoComponent } from './clank-player-info/clank-player-info.component';
import { ClankComponent } from './clank.component';
import { CardListComponent } from './dialogs/card-list/card-list.component';
import { ChooseCardEventComponent } from './dialogs/choose-card-event/choose-card-event.component';
import { PlayerRowDetailComponent } from './dialogs/player-row-detail/player-row-detail.component';
import { TrashCardsComponent } from './dialogs/trash-cards/trash-cards.component';
import { UseSwordsOrHealthComponent } from './dialogs/use-swords-or-health/use-swords-or-health.component';

@NgModule({
    declarations: [
        ClankComponent,
        ClankMapComponent,
        ClankMapElementComponent,
        ClankGameInfoComponent,
        ClankPlayerInfoComponent,
        ClankDungeonRowComponent,
        UseSwordsOrHealthComponent,
        TrashCardsComponent,
        CardListComponent,
        ChooseCardEventComponent,
        PlayerRowDetailComponent,
    ],
    imports: [
        SharedModule,
    ],
})
export class ClankModule { }
