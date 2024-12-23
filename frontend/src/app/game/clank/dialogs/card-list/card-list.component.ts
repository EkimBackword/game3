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

import { Subject } from 'rxjs';
import {
    cardHeight,
    CardListItem,
    cardWidth,
} from 'src/app/shared/components/clank-card/clank-card.types';

import { ClankCardConfig } from '@shared/clank/clank-card.types';

export interface CardListComponentResult {
    selected: ClankCardConfig[];
    other: ClankCardConfig[];
}

@Component({
    selector: 'app-card-list',
    templateUrl: './card-list.component.html',
    styleUrls: ['./card-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CardListComponent implements OnInit {

    totalCount = 0;
    selectedCount = 0;

    list: CardListItem[] = [];
    cardsWrapInfo = {
        cardWidth,
        cardHeight,
    };

    onChangeSubject = new Subject<boolean>();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        public dialogRef: MatDialogRef<CardListComponent, CardListComponentResult>,
        @Inject(MAT_DIALOG_DATA) public data: {
            title: string;
            cards: ClankCardConfig[];
            actionText?: string;
            showActionButton?: boolean;
            cancelText?: string;
            count?: number;
        },
    ) { }

    ngOnInit(): void {
        this.totalCount = this.data.count ?? 0;
        this.list = this.data.cards.map((card) => {
            const item = new CardListItem(card);
            item.value = this.totalCount === 0;
            item.data.action = this.getAction(item);
            return item;
        });
    }

    close() {
        const defaultResult: CardListComponentResult = {
            selected: [],
            other: [],
        };
        const result = this.list.reduce((acc, item) => {
            if (item.value) {
                acc.selected.push(item.data.card);
            } else {
                acc.other.push(item.data.card);
            }
            return acc;
        }, defaultResult);
        this.dialogRef.close(result);
    }

    cancel() {
        this.dialogRef.close();
    }

    private onSelect(item: CardListItem) {
        item.value = !item.value;
        item.data.action = this.getAction(item);
        this.selectedCount += item.value ? 1 : -1;
        this.onChangeSubject.next(true);
        this.changeDetectorRef.detectChanges();
    }

    private getAction(item: CardListItem) {
        if (!item.value) {
            return {
                name: 'Выбрать карту',
                eventName: null,
                btnClass: 'btn-primary',
                canUse: () => this.selectedCount < this.totalCount,
                callback: () => this.onSelect(item),
            };
        }
        return {
            name: 'Снять выбор',
            eventName: null,
            btnClass: 'btn-danger',
            canUse: () => this.totalCount > 0,
            callback: () => this.onSelect(item),
        };
    }

}
