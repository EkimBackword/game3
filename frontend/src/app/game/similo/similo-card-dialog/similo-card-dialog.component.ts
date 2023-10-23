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
    SimiloSizeSettings,
} from '../models/similo-card';

@Component({
    selector: 'app-similo-card-dialog',
    templateUrl: './similo-card-dialog.component.html',
    styleUrls: ['./similo-card-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimiloCardDialogComponent {

    cardSize: {
        width: number;
        height: number;
    } = {
        width: SimiloSizeSettings.cardWidth,
        height: SimiloSizeSettings.cardHeight,
    }

    constructor(
        public dialogRef: MatDialogRef<SimiloCardDialogComponent, boolean>,
        @Inject(MAT_DIALOG_DATA) public data: {
            card: SimiloCard;
            isMaster: boolean;
            actions: {
                text: string;
                value: boolean;
            }[]
            cancelText?: string;
        },
    ) {
        const zoom = document.body.clientHeight / (2 * SimiloSizeSettings.cardHeight);
        this.cardSize = {
            width: SimiloSizeSettings.cardWidth * zoom,
            height: SimiloSizeSettings.cardHeight * zoom,
        };
    }

}
