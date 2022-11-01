import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';

import {
    MenuItem,
    Message,
} from 'primeng-lts/api';
import {
    combineLatest,
    Subject,
} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ClankPlayer } from 'src/app/shared/models/players/player.class';
import { ToastSeverityEnum } from 'src/app/shared/models/toast.types';

import { GameInfoQuery } from '../../services/game-info/game-info.query';
import { GameInfoService } from '../../services/game-info/game-info.service';

@Component({
    selector: 'app-clank-player-info',
    templateUrl: './clank-player-info.component.html',
    styleUrls: ['./clank-player-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClankPlayerInfoComponent implements OnInit, OnDestroy {

    helpInfo: Message[] = [
        {
            severity: ToastSeverityEnum.info,
            detail: 'Используйте CTRL + колёсико мышки для масштабирования карты',
        },
    ];

    activePlayer: ClankPlayer | undefined;
    items: MenuItem[] = [];
    private _activeItem!: MenuItem;
    get activeItem(): MenuItem {
        return this._activeItem;
    }
    set activeItem(item: MenuItem) {
        this._activeItem = item;
        this.activePlayer = item.id != null
            ? this.gameInfoService.players.get(item.id)
            : void 0;
    }

    private ngUnsubscribe = new Subject();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private gameInfoQuery: GameInfoQuery,
        private gameInfoService: GameInfoService,
    ) { }

    ngOnInit(): void {
        combineLatest([
            this.gameInfoQuery.onPlayersChangeSubject,
            this.gameInfoQuery.onActivePlayerChangeSubject,
        ]).pipe(
            takeUntil(this.ngUnsubscribe),
        ).subscribe(() => {
            this.items = this.gameInfoService.playersList.map(p => {
                const player: MenuItem = {
                    id: p.config.id,
                    label: p.config.name,
                    icon: 'pi pi-user',
                };
                return player;
            });
            const currentPlayerId = this.gameInfoService.currentPlayer?.config.id;
            this.activeItem = this.items.find(p => p.id === currentPlayerId) ?? this.items[0];
            this.changeDetectorRef.detectChanges();
        });

        this.gameInfoQuery.onAnyChangeSubject.pipe(
            takeUntil(this.ngUnsubscribe),
        ).subscribe(() => {
            this.changeDetectorRef.detectChanges();
        });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
