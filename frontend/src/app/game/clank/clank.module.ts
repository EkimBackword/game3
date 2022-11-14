import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { ClankGameInfoComponent } from './clank-game-info/clank-game-info.component';
import { ClankMapElementComponent } from './clank-map-element/clank-map-element.component';
import { ClankMapComponent } from './clank-map/clank-map.component';
import { ClankPlayerInfoComponent } from './clank-player-info/clank-player-info.component';
import { ClankComponent } from './clank.component';

@NgModule({
    declarations: [
        ClankComponent,
        ClankMapComponent,
        ClankMapElementComponent,
        ClankGameInfoComponent,
        ClankPlayerInfoComponent,
    ],
    imports: [
        SharedModule,
    ],
})
export class ClankModule { }
