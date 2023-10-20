import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatTable } from '@angular/material/table';

import {
    combineLatest,
    Subject,
} from 'rxjs';
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

import { SimiloDlcDeckList } from '../similo/models/similo-dlc';

interface FindGameTableItem {
    id: string;
    name: string;
    status: string;
    mapName?: string;
    gameUrl: GameRouteEnum;
}

@Component({
    templateUrl: './find-game.component.html',
    styleUrls: ['./find-game.component.scss'],
})
export class FindGameComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(MatTable) table!: MatTable<GameInfoState>;

    displayedColumns: (keyof FindGameTableItem)[] = ['name', 'status', 'mapName'];
    dataSource: FindGameTableItem[] = [];
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
        combineLatest([
            this.gamesService.gamesListSubject,
            this.gamesService.similoTablesSubject,
        ]).pipe(
            tap(([clank, similo]) => {
                this.dataSource = [
                    ...clank.map((game) => {
                        const item: FindGameTableItem = {
                            id: game.id,
                            name: game.name,
                            status: GameInfoStatus[game.statusId].name,
                            mapName: this.mapsService.getMapById(game.mapId)?.name,
                            gameUrl: GameRouteEnum.Clank,
                        };
                        return item;
                    }),
                    ...similo.map((game) => {
                        const item: FindGameTableItem = {
                            id: game.id,
                            name: game.name,
                            status: GameInfoStatus[game.statusId].name,
                            mapName: SimiloDlcDeckList.find(p => p.dlc_name === game.mainDlc)?.name,
                            gameUrl: GameRouteEnum.Similo,
                        };
                        return item;
                    }),
                ];
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
