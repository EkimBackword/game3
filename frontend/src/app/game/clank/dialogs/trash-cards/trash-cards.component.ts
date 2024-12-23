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

import {
    cardHeight,
    cardWidth,
    ISelectedPlayerCardInfo,
} from 'src/app/shared/components/clank-card/clank-card.types';

import {
    ClankCardConfig,
    ClankCardName,
} from '@shared/clank/clank-card.types';

export interface TrashCardsComponentData {
    cards: ClankCardConfig[];
    needTrashCards: ClankCardName[];
}

export interface TrashCardsComponentItem {
    data: ISelectedPlayerCardInfo;
    value: boolean;
    selectable: boolean;
}

export interface TrashCardsComponentTrashInfo {
    name: ClankCardName;
    value: boolean;
}

export interface TrashCardsComponentResult {
    discard: ClankCardConfig[];
    trash: ClankCardConfig[];
}

@Component({
    selector: 'app-trash-cards',
    templateUrl: './trash-cards.component.html',
    styleUrls: ['./trash-cards.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class TrashCardsComponent implements OnInit {

    selectedCount = 0;
    totalCount = 0;
    trashInfo: TrashCardsComponentTrashInfo[] = [];
    list: TrashCardsComponentItem[] = [];
    unselectableCards: ClankCardConfig[] = [];

    cardsWrapInfo = {
        cardWidth,
        cardHeight,
    };

    get allSelected() {
        return !this.trashInfo.some(p => !p.value);
    }

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        public dialogRef: MatDialogRef<TrashCardsComponent, TrashCardsComponentResult>,
        @Inject(MAT_DIALOG_DATA) public data: TrashCardsComponentData,
    ) { }

    ngOnInit(): void {
        this.totalCount = this.data.needTrashCards.length;
        this.trashInfo = this.data.needTrashCards.sort((a, b) => {
            if (a === ClankCardName.All) {
                return 1;
            }
            if (b === ClankCardName.All) {
                return -1;
            }
            return 0;
        }).map(name => {
            const result: TrashCardsComponentTrashInfo = {
                name,
                value: false,
            };
            return result;
        });
        this.list = [];
        this.unselectableCards = [];
        for (const card of this.data.cards) {
            const selectable = this.trashInfo.some(p => !p.value && (
                p.name === ClankCardName.All || p.name === card.name
            ));
            if (selectable) {
                const item: TrashCardsComponentItem = {
                    data: {
                        id: card.id,
                        card,
                        classes: [],
                        isOpen: true,
                        style: {},
                    },
                    value: false,
                    selectable: true,
                };
                this.list.push(item);
            } else {
                this.unselectableCards.push(card);
            }
        }
        this.checkTrashCards();
    }

    selectCard(item: TrashCardsComponentItem) {
        if (!item.selectable && !item.value) {
            return;
        }
        item.value = !item.value;
        this.selectedCount += item.value ? 1 : -1;
        this.checkTrashCards();
    }

    close() {
        const result: TrashCardsComponentResult = {
            discard: this.unselectableCards,
            trash: [],
        };
        for (const item of this.list) {
            if (item.value) {
                result.trash.push(item.data.card);
            } else {
                result.discard.push(item.data.card);
            }
        }
        this.dialogRef.close(result);
    }

    private checkTrashCards() {
        this.trashInfo.forEach(p => p.value = false);
        for (const item of this.list) {
            if (!item.value) {
                continue;
            }
            this.updateTrashInfoByCardName(item);
        }
        for (const item of this.list) {
            item.selectable = this.trashInfo.some(p => !p.value && (
                p.name === ClankCardName.All
                || p.name === item.data.card.name
            ));
        }
        this.changeDetectorRef.detectChanges();
    }

    private updateTrashInfoByCardName(item: TrashCardsComponentItem) {
        for (const trashItem of this.trashInfo) {
            if (trashItem.value) {
                continue;
            }
            if (trashItem.name === ClankCardName.All || trashItem.name === item.data.card.name) {
                trashItem.value = true;
                return;
            }
        }
    }

}
