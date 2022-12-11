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
import { PlayerPointsResult } from 'src/app/shared/models/players/player.types';
import { CardsService } from 'src/app/shared/services/cards.service';

import { GameInfoStatusIdEnum } from '@shared/clank/clank-game.types';
import { GamePlayerColorList } from '@shared/clank/clank-player.types';

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
    playersSubject = this.gameInfoQuery.onPlayersChangeSubject.pipe(
        map((players) => {
            let winner: PlayerPointsResult | undefined;
            const rows = players.map(player => {
                const coins = player.benefitInfo.coin ?? 0;
                const tokens = player.tokens.reduce((acc, token) => acc + (token.points?.value ?? 0), 0);
                const artifacts = player.artifacts.reduce((acc, artefact) => acc + (artefact.points?.value ?? 0), 0);
                const cards = [
                    ...player.deck,
                    ...player.board,
                    ...player.discard,
                    ...player.hand,
                ].reduce((acc, cardState) => {
                    const card = this.cardsService.getCardInfo(cardState);
                    return acc + (card?.points?.value ?? 0);
                }, 0);
                const result: PlayerPointsResult = {
                    config: player,
                    name: player.name,
                    colorInfo: GamePlayerColorList[player.colorId],
                    coins,
                    tokens,
                    artifacts,
                    cards,
                    total: coins + tokens + cards,
                };
                if (winner == null || winner.total < result.total) {
                    winner = result;
                }
                return result;
            });
            return {
                rows,
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
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    exitGame() {
        this.router.navigate(['/']);
    }

}
