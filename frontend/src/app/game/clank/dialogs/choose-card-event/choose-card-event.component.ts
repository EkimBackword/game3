import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
} from '@angular/material/dialog';

export interface ChooseCardEventComponentData {
    count: number;
    list: ChooseCardEventComponentItem[];
}

export interface ChooseCardEventComponentItem {
    description: string;
    event: () => boolean;
}

interface ChooseCardEventItem extends ChooseCardEventComponentItem {
    checked: boolean;
}

@Component({
    selector: 'app-choose-card-event',
    templateUrl: './choose-card-event.component.html',
    styleUrls: ['./choose-card-event.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChooseCardEventComponent implements OnInit {

    count = 0;
    list: ChooseCardEventItem[] = [];
    canSelect = false;
    canSubmit = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ChooseCardEventComponentData,
        private dialogRef: MatDialogRef<ChooseCardEventComponent, ChooseCardEventComponentItem[]>,
        private changeDetectorRef: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
        this.count = this.data.count ?? 0;
        this.list = this.data.list?.map(action => {
            const item: ChooseCardEventItem = {
                ...action,
                checked: false,
            };
            return item;
        }) ?? [];
        this.checkCount();
        this.changeDetectorRef.markForCheck();
    }

    onSelect() {
        this.checkCount();
        this.changeDetectorRef.markForCheck();
    }

    submit() {
        const result = this.list.filter(p => p.checked);
        this.dialogRef.close(result);
    }

    cancel() {
        this.dialogRef.close();
    }

    private checkCount() {
        this.canSelect = this.list.filter(p => p.checked).length < this.count;
        this.canSubmit = this.list.filter(p => p.checked).length === this.count;
    }

}
