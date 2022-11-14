import {
    Component,
    OnInit,
} from '@angular/core';

import { GamesService } from '../shared/services/games.service';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {

    constructor(
        private gamesService: GamesService,
    ) { }

    ngOnInit(): void {
        this.gamesService.init();
    }

}
