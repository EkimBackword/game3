import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
    catchError,
    EMPTY,
    map,
    Subject,
    takeUntil,
} from 'rxjs';

import { LobbyService } from './services/lobby.service';

@Component({
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        LobbyService,
    ]
})
export class LobbyComponent implements OnInit, OnDestroy {

    private ngUnsubscribe = new Subject<void>();

    constructor(
        private activatedRoute: ActivatedRoute,
        private lobbyService: LobbyService,
    ) {
    }

    ngOnInit(): void {
        this.activatedRoute.paramMap.pipe(
            map((params) => params.get('id') ?? 'EmptyId'),
            catchError((error) => {
                console.warn(error);
                return EMPTY;
            }),
            takeUntil(this.ngUnsubscribe),
        ).subscribe(lobbyId => {
            this.lobbyService.init(lobbyId);
        });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
