import {
    ChangeDetectionStrategy,
    Component,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-similo-rules',
    templateUrl: './similo-rules.component.html',
    styleUrls: ['./similo-rules.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SimiloRulesComponent {

    constructor(
        public dialogRef: MatDialogRef<SimiloRulesComponent, void>,
    ) { }

}
