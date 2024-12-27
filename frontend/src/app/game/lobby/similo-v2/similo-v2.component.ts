import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    DestroyRef,
    ElementRef,
    HostBinding,
    inject,
    Signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
    debounceTime,
    fromEvent,
    startWith,
} from 'rxjs';
import { SessionQuery } from 'src/app/session/session.query';

import { faHourglassStart } from '@fortawesome/free-solid-svg-icons';
import { GameInfoStatusIdEnum } from '@shared/clank/clank-game.types';
import {
    SimiloCardConfig,
    SimiloCardPosition,
} from '@shared/similo/similo-dlc.types';

import { LobbyClient } from '../models/lobby-client';
import { LobbyService } from '../services/lobby.service';
import {
    SimiloV2GameBuilder,
    SimiloV2GameType,
    SimiloV2SetupData,
} from './models/similo-game';
import {
    SimiloV2Settings,
    SimiloV2TurnStage,
} from './models/similo-settings';

@Component({
    selector: 'app-similo-v2',
    templateUrl: './similo-v2.component.html',
    styleUrls: ['./similo-v2.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SimiloV2Component implements AfterViewInit {

    private lobbyService = inject(LobbyService);
    private sessionQuery = inject(SessionQuery);
    private destroyRef = inject(DestroyRef);
    private elementRef = inject(ElementRef);
    private changeDetectorRef = inject(ChangeDetectorRef);

    client: LobbyClient<
        SimiloV2GameType,
        SimiloV2SetupData
    > = this.lobbyService.client;

    builder = this.client.game.builder as Signal<SimiloV2GameBuilder | null>;

    @HostBinding('style.--similo-game-opacity') opacity = 0;
    @HostBinding('style.--similo-game-zoom') zoom = 1;
    @HostBinding('style.--similo-game-padding.px') padding = SimiloV2Settings.padding;
    @HostBinding('style.--similo-game-card-span.px') cardSpan = SimiloV2Settings.cardSpan;
    @HostBinding('style.--similo-game-header-height.px') headerHeight = SimiloV2Settings.headerHeight;
    @HostBinding('style.--similo-game-header-font-size.px') headerFontSize = SimiloV2Settings.headerFontSize;
    @HostBinding('style.--similo-game-title-height.px') titleHeight = SimiloV2Settings.titleHeight;
    @HostBinding('style.--similo-game-title-font-size.px') titleFontSize = SimiloV2Settings.titleFontSize;
    @HostBinding('style.--similo-card-width.px') cardWidth = SimiloV2Settings.card.width;
    @HostBinding('style.--similo-card-height.px') cardHeight = SimiloV2Settings.card.height;

    @HostBinding('style.--board-width.px') boardWidth =
        SimiloV2Settings.boardCardsInRow
        * (SimiloV2Settings.card.width + SimiloV2Settings.cardSpan);

    @HostBinding('style.--board-height.px') boardHeight =
        (SimiloV2Settings.boardCardsCount / SimiloV2Settings.boardCardsInRow)
        * (SimiloV2Settings.card.height + SimiloV2Settings.cardSpan);

    @HostBinding('style.--deck-width.px') deckWidth =
        (SimiloV2Settings.deckCardsCount)
        * (SimiloV2Settings.card.width + SimiloV2Settings.cardSpan);

    @HostBinding('style.--deck-height.px') deckHeight =
        SimiloV2Settings.card.height + SimiloV2Settings.cardSpan;

    @HostBinding('style.--similar-width.px') similarWidth =
        this.cardSpan + this.cardWidth;

    @HostBinding('style.--similo-game-height.px') gameHeight =
        this.headerHeight * 2 + this.padding * 2
        + this.boardHeight + this.titleHeight + this.padding * 2
        + this.deckHeight + this.cardSpan + this.titleHeight + this.padding * 2;

    @HostBinding('style.--similo-game-width.px') gameWidth =
        this.padding * 2  + this.boardWidth + (this.cardSpan * 2 + this.similarWidth) * 2 + this.cardSpan;

    boardSignal = computed(() => {
        const state = this.client.game.state();
        return (state?.game.mainDeck ?? [])
            .sort((a, b) => a.index - b.index);
    });

    deckSignal = computed(() => {
        const state = this.client.game.state();
        return (state?.game.helpDeck ?? [])
            .filter(p => p.position === SimiloCardPosition.Deck)
            .sort((a, b) => a.index - b.index);
    });

    handSignal = computed(() => {
        const state = this.client.game.state();
        return (state?.game.helpDeck ?? [])
            .filter(p => p.position === SimiloCardPosition.Hand)
            .sort((a, b) => a.index - b.index);
    });

    similarSignal = computed(() => {
        const state = this.client.game.state();
        return (state?.game.helpDeck ?? [])
            .filter(p => p.position === SimiloCardPosition.Similar)
            .sort((a, b) => a.index - b.index);
    });

    notSimilarSignal = computed(() => {
        const state = this.client.game.state();
        return (state?.game.helpDeck ?? [])
            .filter(p => p.position === SimiloCardPosition.NotSimilar)
            .sort((a, b) => a.index - b.index);
    });

    isMaster = computed(() => {
        const state = this.client.game.state();
        const user = this.sessionQuery.getValue();
        return state?.context.currentPlayerId === user.id
    });

    isWatcher = computed(() => {
        const players = this.client.game.players();
        const user = this.sessionQuery.getValue();
        return !players?.has(user.id);
    });

    turnStage = computed(() => {
        const state = this.client.game.state();
        const builder = this.builder();
        if (state == null
            || state.game.statusId === GameInfoStatusIdEnum.Finished
            || builder == null) {
            return SimiloV2TurnStage.NONE;
        }
        const currentPlayerId = state.context.currentPlayerId;
        const stage = state.context.activePlayers?.[currentPlayerId].stage;
        return stage === builder.stages.help.id
            ? SimiloV2TurnStage.MASTER
            : SimiloV2TurnStage.USERS
    });

    headerInfo = computed(() => {
        const state = this.client.game.state();
        const turnStage = this.turnStage();
        if (state == null) {
            return {
                text: 'Not found',
                class: '',
            };
        }
        if (state.game.statusId === GameInfoStatusIdEnum.Finished) {
            return {
                text: state.game.isWin
                    ? 'Победа'
                    : 'Поражение',
                class: state.game.isWin
                    ? 'text-success'
                    : 'text-danger',
            };
        }
        const isMasterTurn = turnStage === SimiloV2TurnStage.MASTER;
        const countCardsForClose = !isMasterTurn && state.context.allPlayers?.maxMoves != null
            ? state.context.allPlayers.maxMoves - state.context.allPlayers.numMoves
            : 0;
        return {
            text: isMasterTurn
                ? 'Очевидец делает подсказку'
                : `Нужно убрать: ${countCardsForClose} шт`,
            class: '',
        };
    });

    isFinished = computed(() => {
        const state = this.client.game.state();
        return state?.game.statusId === GameInfoStatusIdEnum.Finished;
    });

    defaultCardClass = computed(() => {
        const state = this.client.game.state();
        if (state === null || state.game.statusId !== GameInfoStatusIdEnum.Finished) {
            return null;
        }
        return 'card-finished';
    });

    searchableCardClass = computed(() => {
        const state = this.client.game.state();
        if (state === null || state.game.statusId !== GameInfoStatusIdEnum.Finished) {
            return null;
        }
        return state.game.isWin
            ? `card-win`
            : `card-lose`;
    });

    icons = {
        active: faHourglassStart,
    };

    GameInfoStatusIdEnum = GameInfoStatusIdEnum;
    SimiloV2TurnStage = SimiloV2TurnStage;

    trackById(index: number, item: SimiloCardConfig) {
        return item.id;
    }

    async openCard(card: SimiloCardConfig) {
        if (this.isFinished() || this.isWatcher()) {
            this.builder()?.openCardDialog({
                card,
                isMaster: this.isMaster(),
                actions: [],
            });
            return;
        }
        const payload = this.getMovePayload(card);
        if (payload == null) {
            return;
        }
        const result = await this.client.game.makeMove(payload);
        if (!result.success || !result.saveState) {
            return;
        }

        this.lobbyService.addState(result.state);
    }

    private getMovePayload(card: SimiloCardConfig) {
        const builder = this.builder();
        const user = this.sessionQuery.getValue();
        const state = this.client.game.state();
        const stage = state?.context.activePlayers?.[user.id].stage;

        if (builder == null || stage == null || !this.canUseCard(card)) {
            return null;
        }

        if (stage == builder.stages.help.id && card.position === SimiloCardPosition.Hand) {
            return builder.moves.helpCardById.getPayload({
                card
            }, user.id);
        }

        if (stage == builder.stages.choose.id && card.position === SimiloCardPosition.Board) {
            return builder.moves.chooseCardById.getPayload({
                card
            }, user.id);
        }

        return builder.moves.showCardById.getPayload({
            card
        }, user.id);
    }

    private canUseCard(card: SimiloCardConfig) {
        switch (card.position) {
            case SimiloCardPosition.Board:
            case SimiloCardPosition.Similar:
            case SimiloCardPosition.NotSimilar: {
                return true;
            }
            case SimiloCardPosition.Hand: {
                return this.isMaster();
            }
            default: {
                return false;
            }
        }
    }

    finishGame() {
        this.lobbyService.finishGame();
    }

    ngAfterViewInit() {
        fromEvent(window, 'resize').pipe(
            // TODO: заменить changeDetectorRef на signalApi
            startWith(null),
            debounceTime(100),
            takeUntilDestroyed(this.destroyRef),
        ).subscribe(() => this.onResize());
    }

    private onResize() {
        const clientHeight = this.elementRef.nativeElement.clientHeight;
        const zoomByHeight = clientHeight / this.gameHeight;
        const clientWidth = this.elementRef.nativeElement.clientWidth;
        const zoomByWidth = clientWidth / this.gameWidth;

        this.zoom = Math.min(zoomByWidth, zoomByHeight);
        this.opacity = 1;
        this.changeDetectorRef.markForCheck();
    }

}
