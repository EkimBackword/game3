import {
    Component,
    OnInit,
} from '@angular/core';

import { ClankCardConfig } from '@shared/clank/clank-card.types';

@Component({
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {

    cards: ClankCardConfig[] = [];

    constructor() { }

    ngOnInit(): void {
    }

}
