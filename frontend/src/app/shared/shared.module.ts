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

@NgModule({
    imports: [
        ...exports,
    ],
    exports: [
        ...exports,
    ],
    declarations: [
        SharedComponent,
    ],
    providers: [
        MessageService,
    ],
})
export class SharedModule { }
