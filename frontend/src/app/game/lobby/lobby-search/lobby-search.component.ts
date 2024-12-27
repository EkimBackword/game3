import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTable } from '@angular/material/table';

import { tap } from 'rxjs';
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
    standalone: false
})
export class LobbySearchComponent implements AfterViewInit {

    @ViewChild(MatTable) table!: MatTable<FindLobbyTableItem>;

    displayedColumns: (keyof FindLobbyTableItem)[] = ['name', 'status'];
    dataSource: FindLobbyTableItem[] = [];
    linkIcon = faLink;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private destroyRef: DestroyRef,
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
            takeUntilDestroyed(this.destroyRef),
        ).subscribe(() => {
            this.changeDetectorRef.detectChanges();
        });
    }

}
