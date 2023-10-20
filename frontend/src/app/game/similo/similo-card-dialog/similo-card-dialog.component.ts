import {
    ChangeDetectionStrategy,
    Component,
    Inject,
} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
} from '@angular/material/dialog';

import {
    SimiloCard,
    SimiloCardWrapInfo,
} from '../models/similo-card';

@Component({
    selector: 'app-similo-card-dialog',
    templateUrl: './similo-card-dialog.component.html',
    styleUrls: ['./similo-card-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimiloCardDialogComponent {

    SimiloCardWrapInfo = SimiloCardWrapInfo

    constructor(
        public dialogRef: MatDialogRef<SimiloCardDialogComponent, boolean>,
        @Inject(MAT_DIALOG_DATA) public data: {
            title: string;
            card: SimiloCard;
            isBoard: boolean;
            isMaster: boolean;
            actions: {
                text: string;
                value: boolean;
            }[]
            cancelText?: string;
        },
    ) { }

}
