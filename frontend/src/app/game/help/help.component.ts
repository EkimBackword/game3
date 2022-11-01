import {
    Component,
    OnInit,
} from '@angular/core';

import { ClankCard } from 'src/app/shared/models/cards/card.class';

@Component({
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {

    cards: ClankCard[] = [];

    constructor() { }

    ngOnInit(): void {
        import('../../shared/models/cards/cards_clank.data').then((response) => {
            this.cards = response.getClankDeckCards();
        });
    }

}
