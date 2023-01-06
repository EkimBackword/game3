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

import {
    cardHeight,
    CardListItem,
    cardWidth,
} from 'src/app/shared/components/clank-card/clank-card.types';
import { PlayerPointsResult } from 'src/app/shared/models/players/player.types';

@Component({
    selector: 'app-player-row-detail',
    templateUrl: './player-row-detail.component.html',
    styleUrls: ['./player-row-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerRowDetailComponent implements OnInit {

    list: CardListItem[] = [];

    cardsWrapInfo = {
        cardWidth,
        cardHeight,
    };

    constructor(
        public dialogRef: MatDialogRef<PlayerRowDetailComponent>,
        @Inject(MAT_DIALOG_DATA) public data: PlayerPointsResult,
    ) { }

    ngOnInit(): void {
        this.list = this.data.cards.list.map((card) => new CardListItem(card));
    }

    close() {
        this.dialogRef.close();
    }

}
