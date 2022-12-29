import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
} from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { ClankCostInfoType } from 'src/app/shared/models/clank-element-types';

import { ClankCostInfo } from '@shared/clank/clank-info.types';
import { ClankPlayerConfig } from '@shared/clank/clank-player.types';

export interface UseSwordsOrHealthData {
    player: ClankPlayerConfig;
    cost: ClankCostInfo;
}

@Component({
    selector: 'app-use-swords-or-health',
    templateUrl: './use-swords-or-health.component.html',
    styleUrls: ['./use-swords-or-health.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseSwordsOrHealthComponent implements OnInit, OnDestroy {

    cost: ClankCostInfo = {};
    formValue: ClankCostInfo = {
        sword: 0,
        heal: 0,
    };
    totalValue = 0;
    maxSword = 0;
    playerSword = 0;
    playerHeal = 0;
    ClankCostInfoType = ClankCostInfoType;

    private ngUnsubscribe = new Subject();

    constructor(
        public dialogRef: MatDialogRef<UseSwordsOrHealthComponent, ClankCostInfo | null>,
        private changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: UseSwordsOrHealthData,
    ) { }

    ngOnInit(): void {
        const {sword, heal, ...cost} = this.data.cost;
        this.cost = cost;

        this.totalValue = sword ?? 0;
        this.playerSword = this.data.player.benefitInfo.sword ?? 0;
        this.maxSword = Math.min(this.playerSword, this.totalValue) || 1;
        this.playerHeal = this.data.player.benefitInfo.heal ?? 0;

        const initSword = this.totalValue <= this.playerSword
            ? this.totalValue
            : this.playerSword;
        this.onSwordChange(initSword);
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    onSwordChange(value: number) {
        this.formValue = {
            sword: value,
            heal: this.totalValue - value,
        };
        this.changeDetectorRef.markForCheck();
    }

    close() {
        this.dialogRef.close({
            ...this.cost,
            ...this.formValue,
        });
    }

    cancel() {
        this.dialogRef.close(null);
    }

}
