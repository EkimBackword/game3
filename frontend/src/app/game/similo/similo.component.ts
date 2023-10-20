import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
    ActivatedRoute,
    Router,
} from '@angular/router';

import {
    catchError,
    combineLatest,
    EMPTY,
    filter,
    fromEvent,
    map,
    startWith,
    Subject,
    takeUntil,
    tap,
} from 'rxjs';
import { SessionQuery } from 'src/app/session/session.query';
import {
    SimiloGameSocket,
    SocketService,
} from 'src/app/shared/services/socket.service';
import { ToastService } from 'src/app/shared/services/toast.service';

import { SimiloCardPosition } from '@shared/similo/similo-dlc.types';
import { SimiloGameInfoState } from '@shared/similo/similo-game.types';
import { SocketErrorTypeEnum } from '@shared/socket.types';

import {
    SimiloCard,
    SimiloCardWrapInfo,
} from './models/similo-card';
import { SimiloRules } from './models/similo-rules';
import { SimiloScene } from './models/similo-scene';
import { SimiloGameInfoQuery } from './services/similo-game-info.query';
import { SimiloGameInfoStore } from './services/similo-game-info.store';
import { SimiloCardDialogComponent } from './similo-card-dialog/similo-card-dialog.component';

@Component({
    templateUrl: './similo.component.html',
    styleUrls: ['./similo.component.scss'],
    providers: [
        SimiloGameInfoQuery,
        SimiloGameInfoStore,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimiloComponent implements OnInit, AfterViewInit, OnDestroy {

    scene = new SimiloScene();
    board: SimiloCard[] = [];
    deck: SimiloCard[] = [];
    isMaster = true;

    SimiloRules = SimiloRules;
    SimiloCardPosition = SimiloCardPosition;
    SimiloCardWrapInfo = SimiloCardWrapInfo;

    private gameId!: string;
    private socket!: SimiloGameSocket;
    private ngUnsubscribe = new Subject<void>();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private matDialog: MatDialog,
        private route: ActivatedRoute,
        private similoGameInfoQuery: SimiloGameInfoQuery,
        private similoGameInfoStore: SimiloGameInfoStore,
        private sessionQuery: SessionQuery,
        private router: Router,
        private socketService: SocketService,
        private toastService: ToastService,
    ) {
    }

    ngOnInit(): void {
        this.route.paramMap.pipe(
            map((params) => params.get('id') ?? 'EmptyId'),
            catchError((error) => {
                console.warn(error);
                return EMPTY;
            }),
            takeUntil(this.ngUnsubscribe),
        ).subscribe(gameId => {
            this.gameId = gameId;
            this.connectToGame();
            this.changeDetectorRef.detectChanges();
        });
    }

    ngAfterViewInit() {
        combineLatest([
            this.similoGameInfoQuery.onAnyChangeSubject,
            fromEvent(window, 'resize').pipe(
                startWith(null),
                tap(() => this.onResize())
            ),
        ]).pipe(
            takeUntil(this.ngUnsubscribe),
        ).subscribe(([state]) => {
            this.board = state.mainDeck.map((card, index) => new SimiloCard(
                card,
                this.scene.cardSize,
                index,
            ));
            this.deck = state.helpDeck.map((card, index) => new SimiloCard(
                card,
                this.scene.cardSize,
                index,
            ));
            this.isMaster = this.similoGameInfoQuery.isMaster;
            console.log({
                state,
                board: this.board,
                deck: this.deck,
            })
            this.changeDetectorRef.markForCheck();
        })
    }

    ngOnDestroy(): void {
        this.socket?.disconnect();
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    trackById(index: number, item: SimiloCard) {
        return item.state.id;
    }

    updateSocketState(state: SimiloGameInfoState) {
        this.similoGameInfoStore.update(state);
        this.socket?.emit('updateGame', state);
    }

    kickUser(userId: string) {
        this.socket?.emit('kickUser', userId);
    }

    openCard(card: SimiloCard, isBoard: boolean) {
        switch (card.state.position) {
            case SimiloCardPosition.Board: {
                this.openCardDialog({
                    title: 'Убирать персонажа?',
                    card,
                    isBoard,
                    isMaster: this.isMaster,
                    actions: !this.isMaster
                        ? [{
                            text: 'Убирать',
                            value: true,
                        }]
                        : [],
                    cancelText: 'Закрыть',
                }).afterClosed().pipe(
                    filter(result => result != null),
                    takeUntil(this.ngUnsubscribe),
                ).subscribe((result) => {
                    this.updateCardOpenState(card, !result);
                });
                return;
            }
            case SimiloCardPosition.Deck: {
                return;
            }
            case SimiloCardPosition.Hand: {
                if (!this.isMaster) {
                    return;
                }
                this.openCardDialog({
                    title: 'Добавть подсказку',
                    card,
                    isBoard,
                    isMaster: this.isMaster,
                    actions: [{
                        text: 'Похожий',
                        value: true,
                    },{
                        text: 'Отличается',
                        value: false,
                    }],
                    cancelText: 'Закрыть',
                }).afterClosed().pipe(
                    filter(result => result != null),
                    takeUntil(this.ngUnsubscribe),
                ).subscribe((result) => {
                    const position = result
                        ? SimiloCardPosition.Similar
                        : SimiloCardPosition.NotSimilar;
                    this.updateCardPosition(card, position);
                });
                return;
            }
            case SimiloCardPosition.Similar:
            case SimiloCardPosition.NotSimilar: {
                this.openCardDialog({
                    title: 'Просмотр подсказки',
                    card,
                    isBoard,
                    isMaster: this.isMaster,
                    actions: [],
                    cancelText: 'Закрыть',
                }).afterClosed().pipe(
                    filter(result => result != null),
                    takeUntil(this.ngUnsubscribe),
                ).subscribe();
                return;
            }
        }
    }

    private updateCardPosition(card: SimiloCard, position: SimiloCardPosition) {
        const state = this.similoGameInfoQuery.getValue();

        state.helpDeck[card.deckIndex] = {
            ...card.state,
            position,
            index: state.helpDeck.filter(p => p.position === position).length,
        };

        const nextCard = this.deck.find(p => p.state.position === SimiloCardPosition.Deck);
        if (nextCard != null) {
            state.helpDeck[nextCard.deckIndex] = {
                ...nextCard.state,
                position: card.state.position,
                index: card.state.index,
            };
        }

        this.updateSocketState(state);
    }

    private updateCardOpenState(card: SimiloCard, isOpen: boolean) {
        const state = this.similoGameInfoQuery.getValue();
        state.helpDeck[card.deckIndex] = {
            ...card.state,
            isOpen,
        };
        this.updateSocketState(state);
    }

    private openCardDialog(data: SimiloCardDialogComponent['data']) {
        return this.matDialog.open<
            SimiloCardDialogComponent,
            SimiloCardDialogComponent['data'],
            boolean
        >(
            SimiloCardDialogComponent,
            {
                data,
                width: `${SimiloCardWrapInfo.cardWidth * 2}px`,
            },
        );
    }

    private onResize() {
        const height = SimiloCardWrapInfo.cardHeight * 4;
        const zoom = document.body.clientHeight / height;
        this.scene.setZoom(zoom)
    }

    private connectToGame() {
        this.socket = this.socketService.getSimiloGameSocket(this.gameId);
        if (this.socket == null) {
            return;
        }

        this.socket.on('connect', () => {
            this.toastService.showSuccess('Успешное подключение к игре');
        });

        this.socket.on('disconnect', (reason) => {
            if (reason !== 'io client disconnect') {
                this.socket?.connect();
            } else {
                this.toastService.showWarn('Разрыв соединения');
            }
        });

        this.socket.on('gameUpdated', (state) => {
            this.similoGameInfoStore.update(state);
        });

        this.socket.on('userKicked', (userId) => {
            if (userId !== this.sessionQuery.id) {
                return;
            }
            this.router.navigate(['/']);
        });

        this.socket.on('error', (message, type) => {
            this.toastService.showError(message);
            if (type === SocketErrorTypeEnum.gameNotFound) {
                this.router.navigate(['/']);
            }
        });

        setTimeout(() => {
            if (this.socket?.disconnected) {
                this.socket.connect();
            }
        }, 500);
    }

}
