import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import { tap } from 'rxjs/operators';

import { GameInfoStatusIdEnum } from '@shared/clank/clank-game.types';
import {
    ClankPlayerConfig,
    GamePlayerColorList,
    GamePlayerStatusIdEnum,
} from '@shared/clank/clank-player.types';

import { GameInfoQuery } from '../services/game-info.query';
import { GameInfoService } from '../services/game-info.service';

@Component({
    selector: 'app-clank-game-info',
    templateUrl: './clank-game-info.component.html',
    styleUrls: ['./clank-game-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClankGameInfoComponent implements OnInit {

    isStarted = false;
    isFinished = false;

    statusSubject = this.gameInfoQuery.onStatusChangeSubject.pipe(
        tap((statusId) => {
            this.isStarted = statusId === GameInfoStatusIdEnum.Started;
            this.isFinished = statusId === GameInfoStatusIdEnum.Finished;
            this.changeDetectorRef.detectChanges();
        }),
    );

    nameSubject = this.gameInfoQuery.onNameChangeSubject;

    playersSubject = this.gameInfoQuery.onPlayersChangeSubject;

    activePlayerSubject = this.gameInfoQuery.onActivePlayerChangeSubject;

    GamePlayerStatusIdEnum = GamePlayerStatusIdEnum;
    GamePlayerColorList = GamePlayerColorList;

    get currentPlayer() {
        return this.gameInfoQuery.currentPlayer;
    }

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private gameInfoQuery: GameInfoQuery,
        private gameInfoService: GameInfoService,
        private router: Router,
    ) { }

    ngOnInit(): void {

    }

    startGame() {
        this.gameInfoService.startGame();
    }

    finishGame() {
        this.gameInfoService.finishGame();
    }

    exitGame() {
        this.router.navigate(['/']);
    }

    trackById(index: number, player: ClankPlayerConfig) {
        return player.id;
    }

    changeColor(player: ClankPlayerConfig) {
        this.gameInfoService.updatePlayer(
            player.id,
            {
                colorId: player.colorId,
            },
        );
    }

}
