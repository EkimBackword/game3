import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { ClankDungeonRowComponent } from './clank-dungeon-row/clank-dungeon-row.component';
import { ClankGameInfoComponent } from './clank-game-info/clank-game-info.component';
import { ClankMapElementComponent } from './clank-map-element/clank-map-element.component';
import { ClankMapComponent } from './clank-map/clank-map.component';
import { ClankPlayerInfoComponent } from './clank-player-info/clank-player-info.component';
import { ClankComponent } from './clank.component';
import { ChooseSomeActionsComponent } from './dialogs/choose-some-actions/choose-some-actions.component';
import { UseSwordsOrHealthComponent } from './dialogs/use-swords-or-health/use-swords-or-health.component';
import { TrashCardsComponent } from './dialogs/trash-cards/trash-cards.component';

@NgModule({
    declarations: [
        ClankComponent,
        ClankMapComponent,
        ClankMapElementComponent,
        ClankGameInfoComponent,
        ClankPlayerInfoComponent,
        ClankDungeonRowComponent,
        UseSwordsOrHealthComponent,
        ChooseSomeActionsComponent,
        TrashCardsComponent,
    ],
    imports: [
        SharedModule,
    ],
})
export class ClankModule { }
