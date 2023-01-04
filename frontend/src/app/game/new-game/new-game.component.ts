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
import { GameRouteEnum } from 'src/app/game.routing.enum';
import { GamesService } from 'src/app/shared/services/games.service';
import { MapsService } from 'src/app/shared/services/maps.service';

import { ClankSelectDeckValue } from '@shared/clank/clank-card.types';
import {
    ClankDlcEnum,
    ClankDlcList,
} from '@shared/clank/clank-info.types';
import {
    ClankMapConfig,
    ClankMapConfigIds,
} from '@shared/clank/clank-map.types';

@Component({
    templateUrl: './new-game.component.html',
    styleUrls: ['./new-game.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewGameComponent implements OnInit, OnDestroy {

    maps: ClankMapConfig[] = [];
    startDecks: ClankSelectDeckValue[] = [];
    dungeonDecks: ClankSelectDeckValue[] = [];

    formFields = {
        name: new FormControl<string>(
            '',
            {
                nonNullable: true,
                validators: [
                    Validators.required,
                ],
            }),
        mapId: new FormControl<ClankMapConfigIds>(
            ClankMapConfigIds.clank_1,
            {
                nonNullable: true,
                validators: [
                    Validators.required,
                ],
            }),
        mapDlcId: new FormControl<ClankDlcEnum>(
            ClankDlcEnum.clank,
            {
                nonNullable: true,
                validators: [
                    Validators.required,
                ],
            }),
    };
    form = new FormGroup(this.formFields);

    private ngUnsubscribe = new Subject();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private gamesService: GamesService,
        private mapsService: MapsService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.maps = this.mapsService.maps;
        this.startDecks = ClankDlcList.map(dlc => ({
            ...dlc,
            value: dlc.id === ClankDlcEnum.clank,
            disabled: false,
        }));
        this.dungeonDecks = ClankDlcList.map(dlc => ({
            ...dlc,
            value: dlc.id === ClankDlcEnum.clank,
            disabled: false,
        }));

        this.formFields.mapId.valueChanges.pipe(
            takeUntil(this.ngUnsubscribe),
        ).subscribe((mapId) => {
            const map = this.maps.find(p => p.id === mapId);
            this.formFields.mapDlcId.setValue(map?.dlc_id ?? ClankDlcEnum.clank);
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
        const gameId = this.gamesService.addNew(this.form.getRawValue());
        this.router.navigate([GameRouteEnum.Clank, gameId]);
    }

    cancel() {
        this.router.navigate([GameRouteEnum.Menu]);
    }

}
