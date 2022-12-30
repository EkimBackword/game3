import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {
    MAT_SNACK_BAR_DATA,
    MatSnackBarRef,
} from '@angular/material/snack-bar';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ToastSeverityEnum } from '@shared/toast.types';

@Component({
    selector: 'app-bs-toast',
    templateUrl: './bs-toast.component.html',
    styleUrls: ['./bs-toast.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BsToastComponent implements OnInit {

    constructor(
        private matSnackBarRef: MatSnackBarRef<BsToastComponent>,
        @Inject(MAT_SNACK_BAR_DATA) public data: {
            icon: IconDefinition;
            severity: ToastSeverityEnum;
            message: string;
            submessage?: string;
            iconStyle?: Partial<CSSStyleDeclaration>;
            bodyText?: string;
            bodyStyle?: Partial<CSSStyleDeclaration>;
        },
    ) { }

    ngOnInit(): void {
    }

    close() {
        this.matSnackBarRef.dismiss();
    }

}
