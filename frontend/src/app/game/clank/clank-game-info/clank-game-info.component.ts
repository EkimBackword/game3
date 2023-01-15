import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import { tap } from 'rxjs/operators';
import { ClankCostInfoType } from 'src/app/shared/models/clank-element-types';
import { MapsService } from 'src/app/shared/services/maps.service';
import { SoundService } from 'src/app/shared/services/sound.service';
import { ToastService } from 'src/app/shared/services/toast.service';

import { GameInfoStatusIdEnum } from '@shared/clank/clank-game.types';
import {
    ClankMapConfig,
    ClankMapConfigIds,
} from '@shared/clank/clank-map.types';
import {
    ClankPlayerConfig,
    GamePlayerColorIdEnum,
    GamePlayerColorIds,
    GamePlayerColorList,
    GamePlayerStatusIdEnum,
} from '@shared/clank/clank-player.types';
import { ClankTokenTypeEnum } from '@shared/clank/clank-token.types';

import { GameInfoQuery } from '../services/game-info.query';
import { GameInfoService } from '../services/game-info.service';

@Component({
    selector: 'app-clank-game-info',
    templateUrl: './clank-game-info.component.html',
    styleUrls: ['./clank-game-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClankGameInfoComponent implements OnInit {

    ClankCostInfoType = ClankCostInfoType;
    ClankTokenTypeEnum = ClankTokenTypeEnum;
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
    GamePlayerColorIds = GamePlayerColorIds;
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

    maps: ClankMapConfig[] = this.mapsService.maps;
    selectedMapId: ClankMapConfigIds = ClankMapConfigIds.clank_1;
    onMapChangeSubject = this.gameInfoQuery.onMapChangeSubject.pipe(
        tap((mapInfo) => {
            this.selectedMapId = mapInfo.id;
            this.changeDetectorRef.detectChanges();
        }),
    );

    get currentPlayer() {
        return this.gameInfoQuery.currentPlayer;
    }

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private gameInfoQuery: GameInfoQuery,
        private gameInfoService: GameInfoService,
        private mapsService: MapsService,
        private toastService: ToastService,
        public soundService: SoundService,
        private router: Router,
    ) { }

    ngOnInit(): void {
    }

    selectedMapChanged(selectedMapId: number) {
        const selectedMap = this.mapsService.getMapById(selectedMapId);
        if (selectedMap == null) {
            return;
        }
        this.gameInfoService.changeMap(selectedMap);
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

    kickUser(userId: string) {
        this.gameInfoService.kickUser(userId);
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
