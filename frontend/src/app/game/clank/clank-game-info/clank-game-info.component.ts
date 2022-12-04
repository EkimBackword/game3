import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { tap } from 'rxjs/operators';
import { ClankCostInfoType } from 'src/app/shared/models/clank-element-types';
import { ToastService } from 'src/app/shared/services/toast.service';

import { GameInfoStatusIdEnum } from '@shared/clank/clank-game.types';
import {
    ClankPlayerConfig,
    GamePlayerColorIdEnum,
    GamePlayerColorIds,
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

    @ViewChild('GameActionLogs', { static: false }) GameActionLogs!: ElementRef<HTMLElement>;

    ClankCostInfoType = ClankCostInfoType;
    isStarted = false;
    isFinished = false;

    statusSubject = this.gameInfoQuery.onStatusChangeSubject.pipe(
        tap((statusId) => {
            this.isStarted = statusId === GameInfoStatusIdEnum.Started;
            this.isFinished = statusId === GameInfoStatusIdEnum.Finished;
        }),
    );

    onActionLogs = this.gameInfoQuery.onActionLogsChangeSubject;

    nameSubject = this.gameInfoQuery.onNameChangeSubject;

    GamePlayerColorList = GamePlayerColorList;
    validColorList = false;
    invalidColorText = 'Цвета игроков должны отличатся';
    playersSubject = this.gameInfoQuery.onPlayersChangeSubject.pipe(
        tap((players) => {
            this.validColorList = !GamePlayerColorIds.some((id) => {
                const playerCount = players.filter(p => p.colorId === id).length;
                return playerCount > 1;
            });
            this.changeDetectorRef.detectChanges();
        }),
    );

    activePlayerSubject = this.gameInfoQuery.onActivePlayerChangeSubject;

    GamePlayerStatusIdEnum = GamePlayerStatusIdEnum;

    get currentPlayer() {
        return this.gameInfoQuery.currentPlayer;
    }

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private gameInfoQuery: GameInfoQuery,
        private gameInfoService: GameInfoService,
        private toastService: ToastService,
        private router: Router,
    ) { }

    ngOnInit(): void {

    }

    startGame() {
        if (!this.validColorList) {
            this.toastService.showWarn(this.invalidColorText);
            return;
        }
        this.gameInfoService.startGame();
    }

    finishGame() {
        this.gameInfoService.finishGame();
    }

    exitGame() {
        this.router.navigate(['/']);
    }

    trackById(index: number, item: { id: any }) {
        return item.id;
    }

    changeColor(player: ClankPlayerConfig, colorId: GamePlayerColorIdEnum) {
        this.gameInfoService.updatePlayer(
            player.id,
            {
                colorId,
            },
        );
    }

}
