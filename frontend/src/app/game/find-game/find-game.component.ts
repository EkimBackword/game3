import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatTable } from '@angular/material/table';

import { Subject } from 'rxjs';
import {
    takeUntil,
    tap,
} from 'rxjs/operators';
import { GameRouteEnum } from 'src/app/game.routing.enum';
import { GamesService } from 'src/app/shared/services/games.service';
import { MapsService } from 'src/app/shared/services/maps.service';

import { faLink } from '@fortawesome/free-solid-svg-icons';
import {
    GameInfoState,
    GameInfoStatus,
} from '@shared/clank/clank-game.types';

@Component({
    templateUrl: './find-game.component.html',
    styleUrls: ['./find-game.component.scss'],
})
export class FindGameComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(MatTable) table!: MatTable<GameInfoState>;

    displayedColumns: string[] = ['name', 'statusId', 'mapId'];
    dataSource: GameInfoState[] = [];
    clankUrl = GameRouteEnum.Clank;

    linkIcon = faLink;
    GameInfoStatus = GameInfoStatus;

    private ngUnsubscribe = new Subject<void>();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private gamesService: GamesService,
        public mapsService: MapsService,
    ) { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.gamesService.gamesListSubject.pipe(
            tap((list) => {
                this.dataSource = list;
                this.table.renderRows();
            }),
            takeUntil(this.ngUnsubscribe),
        ).subscribe(() => {
            this.changeDetectorRef.detectChanges();
        });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
