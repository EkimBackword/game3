import {
    ChangeDetectionStrategy,
    Component,
    Inject,
} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
} from '@angular/material/dialog';

import { SimiloCardConfig } from '@shared/similo/similo-dlc.types';

@Component({
    selector: 'app-similo-v2-card-dialog',
    templateUrl: './similo-v2-card-dialog.component.html',
    styleUrls: ['./similo-v2-card-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SimiloV2CardDialogComponent<T> {

    constructor(
        public dialogRef: MatDialogRef<SimiloV2CardDialogComponent<T>, T>,
        @Inject(MAT_DIALOG_DATA) public data: {
            card: SimiloCardConfig;
            isMaster: boolean;
            actions: {
                text: string;
                value: T;
                class?: string;
            }[]
            cancelText?: string;
        },
    ) {
    }

}
