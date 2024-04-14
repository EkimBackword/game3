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

import { RelicHuntersBenefit } from '../../models/benefit';
import {
    RelicHuntersCardInfo,
    RelicHuntersCardSelectable,
    RelicHuntersCardTypeEnum,
} from '../../models/cards';

export interface RhCardListDialogWithSelect {
    title: string;
    cards: RelicHuntersCardInfo[];
    canSelect: true;
    submitNameWithSelected: string;
    submitNameWithoutSelected: string;
    benefitType: keyof RelicHuntersBenefit | null;
    showNumber?: boolean
    limit: number | null;
}

export interface RhCardListDialogWithoutSelect {
    title: string;
    cards: RelicHuntersCardInfo[];
    canSelect: false;
}

@Component({
    selector: 'app-rh-card-list-dialog',
    templateUrl: './rh-card-list-dialog.component.html',
    styleUrls: ['./rh-card-list-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RhCardListDialogComponent implements OnInit {

    cards: RelicHuntersCardSelectable[] = [];
    selectedCards: RelicHuntersCardInfo[] = [];

    constructor(
        public dialogRef: MatDialogRef<RhCardListDialogComponent, RelicHuntersCardInfo[]>,
        @Inject(MAT_DIALOG_DATA) public data: RhCardListDialogWithSelect | RhCardListDialogWithoutSelect,
    ) { }

    ngOnInit(): void {
        const benefitType = this.data.canSelect
            ? this.data.benefitType
            : null;
        const cards = this.data.cards.filter(p => {
            return benefitType != null
                ? p.type != RelicHuntersCardTypeEnum.assistant && p.benefit[benefitType] == null
                : true;
        });
        this.cards = cards.map(card => {
            const result: RelicHuntersCardSelectable = {
                selected: false,
                selectedIndex: -1,
                card,
            };
            return result;
        });
    }

    close(cards?: RelicHuntersCardInfo[]) {
        this.dialogRef.close(cards);
    }

    selectCard(item: RelicHuntersCardSelectable) {
        if (!this.data.canSelect) {
            return;
        }

        if (!item.selected) {
            this.selectedCards.push(item.card);
        } else {
            this.selectedCards = this.selectedCards.filter(p => p.id != item.card.id);
        }

        this.cards = this.cards.map((p) => {
            p.selectedIndex = this.selectedCards.findIndex(card => p.card.id === card.id);
            p.selected = p.selectedIndex != -1;
            return p;
        });
    }

}
