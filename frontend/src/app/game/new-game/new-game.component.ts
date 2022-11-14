import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import {
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CardsService } from 'src/app/shared/services/cards.service';
import { GamesService } from 'src/app/shared/services/games.service';
import { MapsService } from 'src/app/shared/services/maps.service';

import { ClankSelectDeckValue } from '@shared/clank/clank-card.types';
import { GameInfoConfig } from '@shared/clank/clank-game.types';
import { ClankDlcEnum } from '@shared/clank/clank-info.types';
import { ClankMapConfig } from '@shared/clank/clank-map.types';

import { GameRouteEnum } from '../game.routing';

type GameInfoFormFields = Record<keyof GameInfoConfig, FormControl>;

@Component({
    templateUrl: './new-game.component.html',
    styleUrls: ['./new-game.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewGameComponent implements OnInit, OnDestroy {

    maps: ClankMapConfig[] = [];
    startDecks: ClankSelectDeckValue[] = [];
    dungeonDecks: ClankSelectDeckValue[] = [];

    formFields: GameInfoFormFields = {
        name: new FormControl(null, Validators.required),
        mapId: new FormControl(null, Validators.required),
        mapDlcId: new FormControl(null, Validators.required),
        dungeonDeckIds: new FormControl([ClankDlcEnum.clank], Validators.required),
        startDeckId: new FormControl(ClankDlcEnum.clank, Validators.required),
    };
    form = new FormGroup(this.formFields);

    private ngUnsubscribe = new Subject();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private cardsService: CardsService,
        private gamesService: GamesService,
        private mapsService: MapsService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.maps = this.mapsService.maps;
        this.startDecks = this.cardsService.getSelectStartDecks();
        this.dungeonDecks = this.cardsService.getSelectShareDecks();

        this.formFields.mapId.valueChanges.pipe(
            takeUntil(this.ngUnsubscribe),
        ).subscribe((mapId) => {
            const map = this.maps.find(p => p.id === mapId);
            this.formFields.mapDlcId.setValue(map?.dlc_id);
        });
        this.formFields.mapId.setValue(this.maps?.[0]?.id);

        this.changeDetectorRef.detectChanges();
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    updateSelectedCards(list: ClankSelectDeckValue[], control: FormControl) {
        control.setValue(list.filter(p => p.value));
    }

    submit() {
        if (this.form.invalid) {
            return;
        }
        const formValue: GameInfoConfig = this.form.value;
        const gameId = this.gamesService.addNew(formValue);
        this.router.navigate([GameRouteEnum.Clank, gameId]);
    }

    cancel() {
        this.router.navigate([GameRouteEnum.Menu]);
    }

}
