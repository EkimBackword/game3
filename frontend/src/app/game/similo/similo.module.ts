import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { SimiloComponent } from './similo.component';
import { SimiloCardComponent } from './similo-card/similo-card.component';
import { SimiloCardDialogComponent } from './similo-card-dialog/similo-card-dialog.component';
import { SimiloTableInfoComponent } from './similo-table-info/similo-table-info.component';

@NgModule({
    declarations: [
        SimiloComponent,
        SimiloCardComponent,
        SimiloCardDialogComponent,
        SimiloTableInfoComponent
    ],
    imports: [
        SharedModule,
    ]
})
export class SimiloModule {}
