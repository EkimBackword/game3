import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';

import { MessageService } from 'primeng-lts/api';
import { DialogModule } from 'primeng-lts/dialog';
import { DragDropModule } from 'primeng-lts/dragdrop';
import { MessageModule } from 'primeng-lts/message';
import { MessagesModule } from 'primeng-lts/messages';
import { TabMenuModule } from 'primeng-lts/tabmenu';
import { ToastModule } from 'primeng-lts/toast';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ClankArtifactComponent } from './components/clank-artifact/clank-artifact.component';
import { ClankCardComponent } from './components/clank-card/clank-card.component';
import { ClankCostInfoComponent } from './components/clank-cost-info/clank-cost-info.component';
import { ClankMeepleComponent } from './components/clank-meeple/clank-meeple.component';
import { ClankTokenComponent } from './components/clank-token/clank-token.component';
import { SharedComponent } from './shared.component';

const exports = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    DialogModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    DragDropModule,
    TabMenuModule,
];

const exportsComponents = [
    ClankArtifactComponent,
    ClankCardComponent,
    ClankCostInfoComponent,
    ClankMeepleComponent,
    ClankTokenComponent,
];

@NgModule({
    imports: [
        ...exports,
    ],
    exports: [
        ...exports,
        ...exportsComponents,
    ],
    declarations: [
        SharedComponent,
        ...exportsComponents,
    ],
    providers: [
        MessageService,
    ],
})
export class SharedModule { }
