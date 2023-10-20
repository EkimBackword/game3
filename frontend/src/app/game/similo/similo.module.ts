import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { SimiloCardDialogComponent } from './similo-card-dialog/similo-card-dialog.component';
import { SimiloCardComponent } from './similo-card/similo-card.component';
import { SimiloRulesComponent } from './similo-rules/similo-rules.component';
import { SimiloTableInfoComponent } from './similo-table-info/similo-table-info.component';
import { SimiloComponent } from './similo.component';

@NgModule({
    declarations: [
        SimiloComponent,
        SimiloCardComponent,
        SimiloCardDialogComponent,
        SimiloRulesComponent,
        SimiloTableInfoComponent,
    ],
    imports: [
        SharedModule,
    ]
})
export class SimiloModule {}
