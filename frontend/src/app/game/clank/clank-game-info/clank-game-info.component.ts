import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import {
    combineLatest,
    Subject,
} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ClankPlayer } from 'src/app/shared/models/players/player.class';
import {
    GamePlayerColorList,
    GamePlayerStatusIdEnum,
} from 'src/app/shared/models/players/player.types';

import { GameInfoQuery } from '../../services/game-info/game-info.query';
import { GameInfoService } from '../../services/game-info/game-info.service';
import { GameInfoStatusIdEnum } from '../../services/game-info/game-info.types';

@Component({
    selector: 'app-clank-game-info',
    templateUrl: './clank-game-info.component.html',
    styleUrls: ['./clank-game-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClankGameInfoComponent implements OnInit, OnDestroy {

    isStarted = false;
    isFinished = false;
    gameName = 'Not found';

    players: ClankPlayer[] = [];
    currentPlayer: ClankPlayer | undefined;

    GamePlayerColorList = GamePlayerColorList;
    GamePlayerStatusIdEnum = GamePlayerStatusIdEnum;

    private ngUnsubscribe = new Subject();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private gameInfoQuery: GameInfoQuery,
        private gameInfoService: GameInfoService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.gameInfoQuery.onNameChangeSubject.pipe(
            takeUntil(this.ngUnsubscribe),
        ).subscribe((name) => {
            this.gameName = name ?? 'Not found';
            this.changeDetectorRef.detectChanges();
        });

        combineLatest([
            this.gameInfoQuery.onPlayersChangeSubject,
            this.gameInfoQuery.onActivePlayerChangeSubject,
        ]).pipe(
            takeUntil(this.ngUnsubscribe),
        ).subscribe(() => {
            this.players = [
                ...this.gameInfoService.players.values(),
            ];
            this.currentPlayer = this.gameInfoService.currentPlayer;
            this.changeDetectorRef.detectChanges();
        });

        this.gameInfoQuery.onStatusChangeSubject.pipe(
            takeUntil(this.ngUnsubscribe),
        ).subscribe((statusId) => {
            this.isStarted = statusId === GameInfoStatusIdEnum.Started;
            this.isFinished = statusId === GameInfoStatusIdEnum.Finished;
            this.changeDetectorRef.detectChanges();
        });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    startGame() {
        this.gameInfoService.startGame();
    }

    finishGame() {
        this.gameInfoService.finishGame();
    }

    exitGame() {
        this.gameInfoService.disconnect();
        this.router.navigate(['/']);
    }

    trackById(index: number, player: ClankPlayer) {
        return player.config.id;
    }

}
