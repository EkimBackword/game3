import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ViewChild,
} from '@angular/core';
import { MatTable } from '@angular/material/table';

import {
    Subject,
    takeUntil,
    tap,
} from 'rxjs';
import { GameRouteEnum } from 'src/app/game.routing.enum';
import { GamesService } from 'src/app/shared/services/games.service';

import { faLink } from '@fortawesome/free-solid-svg-icons';
import { LobbyStatusById } from '@shared/lobby/lobby';

interface FindLobbyTableItem {
    id: string;
    name: string;
    status: string;
    url: string;
}

@Component({
    templateUrl: './lobby-search.component.html',
    styleUrls: ['./lobby-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LobbySearchComponent {

    @ViewChild(MatTable) table!: MatTable<FindLobbyTableItem>;

    displayedColumns: (keyof FindLobbyTableItem)[] = ['name', 'status'];
    dataSource: FindLobbyTableItem[] = [];
    linkIcon = faLink;

    private ngUnsubscribe = new Subject<void>();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private gamesService: GamesService,
    ) { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.gamesService.lobbyListSubject.pipe(
            tap((lobbyList) => {
                this.dataSource = lobbyList.map(lobby => {
                    const item: FindLobbyTableItem = {
                        id: lobby.id,
                        name: lobby.name,
                        status: LobbyStatusById[lobby.statusId].name,
                        url: `/${GameRouteEnum.Lobby}/${lobby.id}`,
                    };
                    return item;
                });
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
