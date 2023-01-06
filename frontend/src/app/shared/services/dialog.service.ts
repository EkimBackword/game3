import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';

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
}
