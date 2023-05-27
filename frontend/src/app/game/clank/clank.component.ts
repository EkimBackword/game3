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
    debounceTime,
    map,
    takeUntil,
} from 'rxjs/operators';
import { CardsService } from 'src/app/game/clank/services/cards.service';
import { PlayerPointsResult } from 'src/app/shared/models/players/player.types';

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { GameInfoStatusIdEnum } from '@shared/clank/clank-game.types';
import { GamePlayerColorList } from '@shared/clank/clank-player.types';

import { ClankHelpService } from './services/clank-help.service';
import { GameDialogsService } from './services/game-dialogs.service';
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
        GameDialogsService,
        ClankHelpService,
        CardsService,
    ],
})
export class ClankComponent implements OnInit {

    private ngUnsubscribe = new Subject();

    statusSubject = this.gameInfoQuery.onStatusChangeSubject;
    playersSubject = this.gameInfoQuery.onPlayersChangeSubject.pipe(
        debounceTime(0),
        map((players) => {
            const state = this.gameInfoQuery.getValue();
            let winner: PlayerPointsResult | undefined;
            const rows = players.map((player) => {
                const curseCount = player.benefitInfo.curse ?? 0;
                const result: PlayerPointsResult = {
                    config: player,
                    name: player.name,
                    colorInfo: GamePlayerColorList[player.colorId],
                    coins: 0,
                    curse: {
                        points: -(curseCount * 2),
                        count: curseCount,
                    },
                    tokens: {
                        points: 0,
                        list: [],
                    },
                    artifacts: {
                        points: 0,
                        list: [],
                    },
                    cards: {
                        points: 0,
                        list: [],
                    },
                    isNotCalculated: (!player.isEscaped && !player.isRescued) || (player.artifacts.length === 0),
                    master: 0,
                    total: 0,
                };
                result.coins = player.benefitInfo.coin ?? 0;
                result.master = player.isEscaped ? 20 : 0;
                result.tokens = player.tokens.reduce((acc, token) => {
                    const points = token.points?.value ?? 0;
                    acc.points += points;
                    acc.list.push({
                        points,
                        item: token,
                    });
                    return acc;
                }, result.tokens);
                result.artifacts = player.artifacts.reduce((acc, artefact) => {
                    const points = artefact.points?.value ?? 0;
                    acc.points += points;
                    acc.list.push({
                        points,
                        item: artefact,
                    });
                    return acc;
                }, result.artifacts);
                const cardList = [
                    ...player.deck,
                    ...player.board,
                    ...player.discard,
                    ...player.hand,
                ];
                result.cards = cardList.reduce((acc, card) => {
                    const points = this.cardsService.getPoints({
                        state,
                        player,
                        card,
                    });
                    acc.points += points;
                    acc.list.push({
                        points,
                        item: card,
                    });
                    return acc;
                }, result.cards);
                result.total = result.coins
                    + result.curse.points
                    + result.tokens.points
                    + result.artifacts.points
                    + result.cards.points
                    + result.master;
                if (!result.isNotCalculated && (winner == null || winner.total < result.total)) {
                    winner = result;
                }
                return result;
            });
            return {
                rows: rows.sort((previos, current) => {
                    const orderPrevios = previos.total * (previos.isNotCalculated ? 1 : 10000);
                    const orderCurrent = current.total * (current.isNotCalculated ? 1 : 10000);
                    return orderCurrent - orderPrevios;
                }),
                winner,
            };
        }),
    );
    GameInfoStatusIdEnum = GameInfoStatusIdEnum;

    icons = {
        link: faExternalLinkAlt,
    };

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private route: ActivatedRoute,
        private router: Router,
        private gameInfoService: GameInfoService,
        private gameInfoQuery: GameInfoQuery,
        private gameDialogsService: GameDialogsService,
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

    resetGame() {
        this.gameInfoService.resetGame();
    }

    exitGame() {
        this.router.navigate(['/']);
    }

    openPlayerRowDetail(player: PlayerPointsResult) {
        this.gameDialogsService.openPlayerRowDetail(player);
    }

    openLogsList() {
        this.gameDialogsService.openLogsList({
            groups: this.gameInfoQuery.logGroups,
        });
    }

}
