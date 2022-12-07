import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';
import {
    ActivatedRoute,
    Router,
} from '@angular/router';

import {
    EMPTY,
    Subject,
} from 'rxjs';
import {
    catchError,
    map,
    takeUntil,
} from 'rxjs/operators';

import { GameInfoStatusIdEnum } from '@shared/clank/clank-game.types';

import { GameInfoQuery } from './services/game-info.query';
import { GameInfoService } from './services/game-info.service';
import { GameInfoStore } from './services/game-info.store';

@Component({
    templateUrl: './clank.component.html',
    styleUrls: ['./clank.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        GameInfoService,
        GameInfoStore,
        GameInfoQuery,
    ],
})
export class ClankComponent implements OnInit {

    private ngUnsubscribe = new Subject();

    statusSubject = this.gameInfoQuery.onStatusChangeSubject;
    GameInfoStatusIdEnum = GameInfoStatusIdEnum;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private route: ActivatedRoute,
        private router: Router,
        private gameInfoService: GameInfoService,
        private gameInfoQuery: GameInfoQuery,
    ) { }

    ngOnInit(): void {
        this.route.paramMap.pipe(
            map((params) => params.get('id') ?? 'EmptyId'),
            catchError((error) => {
                console.warn(error);
                return EMPTY;
            }),
            takeUntil(this.ngUnsubscribe),
        ).subscribe(gameId => {
            this.gameInfoService.connectToGame(gameId);
            this.changeDetectorRef.detectChanges();
        });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    exitGame() {
        this.router.navigate(['/']);
    }

}
