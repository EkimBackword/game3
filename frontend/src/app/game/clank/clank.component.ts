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
import { CardsService } from 'src/app/game/clank/services/cards.service';
import { PlayerPointsResult } from 'src/app/shared/models/players/player.types';

import { GameInfoStatusIdEnum } from '@shared/clank/clank-game.types';
import { GamePlayerColorList } from '@shared/clank/clank-player.types';

import { ClankHelpService } from './services/clank-help.service';
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
        ClankHelpService,
        CardsService,
    ],
})
export class ClankComponent implements OnInit {

    private ngUnsubscribe = new Subject();

    statusSubject = this.gameInfoQuery.onStatusChangeSubject;
    playersSubject = this.gameInfoQuery.onPlayersChangeSubject.pipe(
        map((players) => {
            const state = this.gameInfoQuery.getValue();
            let winner: PlayerPointsResult | undefined;
            const rows = players.map((player) => {
                const result: PlayerPointsResult = {
                    config: player,
                    name: player.name,
                    colorInfo: GamePlayerColorList[player.colorId],
                    coins: 0,
                    tokens: 0,
                    artifacts: 0,
                    master: 0,
                    cards: 0,
                    total: 0,
                };
                if (!player.isEscaped && !player.isRescued) {
                    return result;
                }
                result.coins = player.benefitInfo.coin ?? 0;
                result.master = player.isEscaped ? 20 : 0;
                result.tokens = player.tokens.reduce((acc, token) => acc + (token.points?.value ?? 0), 0);
                result.artifacts = player.artifacts.reduce((acc, artefact) => acc + (artefact.points?.value ?? 0), 0);
                const cardList = [
                    ...player.deck,
                    ...player.board,
                    ...player.discard,
                    ...player.hand,
                ];
                for (const card of cardList) {
                    result.cards += this.cardsService.getPoints({
                        state,
                        player,
                        card,
                    });
                }
                result.total = result.coins
                    + result.tokens
                    + result.artifacts
                    + result.master
                    + result.cards;
                if (winner == null || winner.total < result.total) {
                    winner = result;
                }
                return result;
            });
            return {
                rows: rows.sort((a, b) => b.total - a.total),
                winner,
            };
        }),
    );
    GameInfoStatusIdEnum = GameInfoStatusIdEnum;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private route: ActivatedRoute,
        private router: Router,
        private gameInfoService: GameInfoService,
        private gameInfoQuery: GameInfoQuery,
        private cardsService: CardsService,
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

        this.gameInfoService.useManualFunctionSubject.pipe(
            takeUntil(this.ngUnsubscribe),
        ).subscribe(() => this.changeDetectorRef.detectChanges());
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    startGame() {
        this.gameInfoService.startGame();
    }

    exitGame() {
        this.router.navigate(['/']);
    }

}
