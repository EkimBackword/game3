import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    DestroyRef,
    ElementRef,
    HostBinding,
    Injector,
    Signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
    debounceTime,
    fromEvent,
    startWith,
} from 'rxjs';
import { SessionQuery } from 'src/app/session/session.query';

import { LobbyClient } from '../../../models/lobby-client';
import { LobbyService } from '../../../services/lobby.service';
import { EscapeFromAtlantisGameBuilder } from '../../models/game-builder';
import { EscapeFromAtlantisGameType } from '../../models/game-type';
import { EscapeFromAtlantisMeepleSettings } from '../../models/meeples';
import { EscapeFromAtlantisSetupData } from '../../models/setup-data';
import { EscapeFromAtlantisPlayerDisplayInfo } from './escape-from-atlantis-player';

@Component({
    selector: 'app-escape-from-atlantis-player',
    templateUrl: './escape-from-atlantis-player.component.html',
    styleUrls: ['./escape-from-atlantis-player.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EscapeFromAtlantisPlayerComponent implements AfterViewInit {

    client: LobbyClient<EscapeFromAtlantisGameType, EscapeFromAtlantisSetupData> = this.lobbyService.client;
    builder = this.client.game.builder as Signal<EscapeFromAtlantisGameBuilder | null>;
    currentPlayerIndex = 0;

    @HostBinding('style.--zoom-wrapper-opacity') opacity = 0;
    @HostBinding('style.--zoom-wrapper-zoom') zoom = 0;
    @HostBinding('style.--zoom-wrapper-width.px') width = EscapeFromAtlantisMeepleSettings.zoomWrapperWidth;

    players = computed(() => {
        const players = this.client.game.players();
        const state = this.client.game.state();
        if (state == null) {
            return [];
        }
        return [...players.values()].map((player) => {
            const playerInfo = state.game.playerMap[player.id];
            return new EscapeFromAtlantisPlayerDisplayInfo(
                {
                    ...player,
                    ...playerInfo,
                },
                this.injector
            );
        })
    });

    isWatcher = computed(() => {
        const players = this.client.game.players();
        const user = this.sessionQuery.getValue();
        return !players?.has(user.id);
    });

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private destroyRef: DestroyRef,
        private elementRef: ElementRef,
        private lobbyService: LobbyService,
        private injector: Injector,
        private sessionQuery: SessionQuery,
    ) {
    }

    finishGame() {
        this.lobbyService.finishGame();
    }

    undoState() {
        this.lobbyService.undoState();
    }

    trackById(index: number, cell: { id: Signal<any>; }) {
        return cell.id();
    }

    ngAfterViewInit() {
        this.onResize();

        fromEvent(window, 'resize').pipe(
            startWith(null),
            debounceTime(0),
            takeUntilDestroyed(this.destroyRef),
        ).subscribe(() => this.onResize());


        const players = this.players();
        const isWatcher = this.isWatcher();
        this.currentPlayerIndex = !isWatcher
            ? players.findIndex(p => p.isCurrentPlayer()) ?? 0
            : 0;
        this.changeDetectorRef.markForCheck();
    }

    private onResize() {
        const clientWidth = this.elementRef.nativeElement.clientWidth;
        const zoomByWidth = clientWidth / (this.width + 50);
        this.zoom = zoomByWidth;
        this.opacity = 1;
        this.changeDetectorRef.markForCheck();
    }

}
