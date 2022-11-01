import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';
import {
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { ClankSelectDeckValue } from 'src/app/shared/models/cards/cards.types';
import { ClankDlcEnum } from 'src/app/shared/models/clank.types';
import { ClankMapConfig } from 'src/app/shared/models/maps/clank-maps.types';
import { CardsService } from 'src/app/shared/services/cards.service';
import { GamesService } from 'src/app/shared/services/games.service';
import { MapsService } from 'src/app/shared/services/maps.service';

import { GameRouteEnum } from '../game.routing';
import { GameInfoConfig } from '../services/game-info/game-info.types';

type GameInfoFormFields = Record<keyof GameInfoConfig, FormControl>;

@Component({
    templateUrl: './new-game.component.html',
    styleUrls: ['./new-game.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewGameComponent implements OnInit {

    maps: ClankMapConfig[] = [];
    reserveDecks: ClankSelectDeckValue[] = [];
    startDecks: ClankSelectDeckValue[] = [];
    shareDecks: ClankSelectDeckValue[] = [];

    formFields: GameInfoFormFields = {
        name: new FormControl(null, Validators.required),
        mapId: new FormControl(null, Validators.required),
        reserveDeckIds: new FormControl([ClankDlcEnum.clank], Validators.required),
        startDeckId: new FormControl(ClankDlcEnum.clank, Validators.required),
        shareDeckIds: new FormControl([ClankDlcEnum.clank], Validators.required),
    };
    form = new FormGroup(this.formFields);

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private cardsService: CardsService,
        private gamesService: GamesService,
        private mapsService: MapsService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.maps = this.mapsService.maps;
        this.reserveDecks = this.cardsService.getSelectReserveDecks().map(p => {
            p.value = this.formFields.reserveDeckIds.value.includes(p.id);
            return p;
        });
        this.startDecks = this.cardsService.getSelectStartDecks();
        this.shareDecks = this.cardsService.getSelectShareDecks().map(p => {
            p.value = this.formFields.shareDeckIds.value.includes(p.id);
            return p;
        });
        this.formFields.mapId.setValue(this.maps?.[0]?.id);
        this.changeDetectorRef.detectChanges();
    }

    updateSelectedCards(list: ClankSelectDeckValue[], control: FormControl) {
        control.setValue(list.filter(p => p.value));
    }

    submit() {
        const formValue: GameInfoConfig = this.form.value;
        const gameId = this.gamesService.addNew(formValue);
        this.router.navigate([GameRouteEnum.Clank, gameId]);
    }

    cancel() {

    }

}
