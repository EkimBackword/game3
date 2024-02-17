import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/shared/shared.module';

import { SimiloV2SetupComponent } from './components/similo-v2-setup/similo-v2-setup.component';
import { SimiloV2CardDialogComponent } from './dialogs/similo-v2-card-dialog/similo-v2-card-dialog.component';
import { SimiloV2Component } from './similo-v2.component';
import { SimiloV2Routes } from './similo-v2.routing';
import { SimiloV2CardComponent } from './components/similo-v2-card/similo-v2-card.component';

@NgModule({
    declarations: [
        SimiloV2Component,
        SimiloV2SetupComponent,
        SimiloV2CardDialogComponent,
        SimiloV2CardComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(SimiloV2Routes),
    ]
})
export class SimiloV2Module {}
