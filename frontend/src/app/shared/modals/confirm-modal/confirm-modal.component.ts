import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
} from '@angular/material/dialog';

import { ConfirmModalComponentData } from './confirm-modal.model';

@Component({
    selector: 'app-confirm-modal',
    templateUrl: './confirm-modal.component.html',
    styleUrls: ['./confirm-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ConfirmModalComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<ConfirmModalComponent, boolean>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmModalComponentData,
    ) { }

    ngOnInit(): void {
    }

    close(value: boolean) {
        this.dialogRef.close(value);
    }

}
