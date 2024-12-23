import {
    ChangeDetectionStrategy,
    Component,
    Inject,
} from '@angular/core';
import {
    FormControl,
    FormGroup,
} from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
} from '@angular/material/dialog';

import {
    SingleInputModalComponenData,
    SingleInputModalComponentResult,
} from './single-input-modal.model';

@Component({
    selector: 'app-single-input-modal',
    templateUrl: './single-input-modal.component.html',
    styleUrls: ['./single-input-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SingleInputModalComponent {

    form = new FormGroup({
        value: new FormControl(this.data.value ?? '', {
            nonNullable: true,
        }),
    });

    constructor(
        public dialogRef: MatDialogRef<SingleInputModalComponent, SingleInputModalComponentResult>,
        @Inject(MAT_DIALOG_DATA) public data: SingleInputModalComponenData,
    ) {
    }

    apply() {
        this.dialogRef.close(this.form.getRawValue());
    }

    cancel() {
        this.dialogRef.close();
    }

}
