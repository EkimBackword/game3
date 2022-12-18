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

import { checkCost } from 'src/app/shared/models/clank-element-types';

import {
    ClankCardAction,
    ClankCardActionList,
} from '@shared/clank/clank-card.types';
import { ClankPlayerConfig } from '@shared/clank/clank-player.types';

interface ChooseSomeActionsComponentItem {
    action: ClankCardAction;
    checked: boolean;
    disable: boolean;
    disableTooltip: string | null;
}

@Component({
    selector: 'app-choose-some-actions',
    templateUrl: './choose-some-actions.component.html',
    styleUrls: ['./choose-some-actions.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChooseSomeActionsComponent implements OnInit {

    count = 0;
    canSelect = false;
    list: ChooseSomeActionsComponentItem[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {
            actions: ClankCardActionList;
            player: ClankPlayerConfig;
        },
        public dialogRef: MatDialogRef<ChooseSomeActionsComponent, ClankCardAction[]>,
        private changeDetectorRef: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
        this.count = this.data.actions.count ?? 0;
        this.list = this.data.actions.list?.map(action => {
            const canUse = action.cost
                ? checkCost({
                    cost: action.cost,
                    player: this.data.player,
                })
                : {
                    success: true,
                    message: null,
                };
            const item: ChooseSomeActionsComponentItem = {
                action,
                checked: false,
                disable: !canUse.success,
                disableTooltip: canUse.message,
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
        const result = this.list.filter(p => p.checked)
            .map(p => p.action);
        this.dialogRef.close(result);
    }

    cancel() {
        this.dialogRef.close([]);
    }

    private checkCount() {
        this.canSelect = this.list.filter(p => p.checked).length < this.count;
    }

}
