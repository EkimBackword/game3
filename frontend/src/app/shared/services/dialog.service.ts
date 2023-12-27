import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';
import { SingleInputModalComponent } from '../modals/single-input-modal/single-input-modal.component';
import { SingleInputModalComponentResult } from '../modals/single-input-modal/single-input-modal.model';

@Injectable({
    providedIn: 'root',
})
export class DialogService {

    constructor(
        private matDialog: MatDialog,
    ) { }

    openConfirm(data: ConfirmModalComponent['data']) {
        return this.matDialog.open<
            ConfirmModalComponent,
            ConfirmModalComponent['data'],
            boolean
        >(
            ConfirmModalComponent,
            {
                data,
            },
        );
    }

    openSingleInput(data: SingleInputModalComponent['data']) {
        return this.matDialog.open<
            SingleInputModalComponent,
            SingleInputModalComponent['data'],
            SingleInputModalComponentResult
        >(
            SingleInputModalComponent,
            {
                data,
                width: '400px',
            },
        );
    }
}
