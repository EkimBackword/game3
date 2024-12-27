import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';

import {
    fromEvent,
    Subject,
} from 'rxjs';
import {
    debounceTime,
    filter,
    startWith,
    takeUntil,
    tap,
} from 'rxjs/operators';

import { ClankDragonInfo } from '@shared/clank/clank-dragon.types';
import {
    ClankMapConfig,
    ClankMapDragonInfo,
} from '@shared/clank/clank-map.types';
import { ClankMumiaPositionInfo } from '@shared/clank/clank-mumia.types';
import {
    ClankPlayerConfig,
    GamePlayerColorList,
} from '@shared/clank/clank-player.types';

import { CardsService } from '../services/cards.service';
import { GameDialogsService } from '../services/game-dialogs.service';
import { GameInfoQuery } from '../services/game-info.query';
import { GameInfoService } from '../services/game-info.service';

@Component({
    selector: 'app-clank-map',
    templateUrl: './clank-map.component.html',
    styleUrls: ['./clank-map.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ClankMapComponent implements OnInit, AfterViewInit, OnDestroy {

    mapInfo: ClankMapConfig | undefined;
    backgroundImage: string | null = null;

    mapSubject = this.gameInfoQuery.onMapChangeSubject.pipe(
        tap((mapInfo) => {
            this.mapInfo = mapInfo;
            this.backgroundImage = this.mapInfo != null
                ? `url(${mapInfo.url})`
                : null;
            this.onResize();
            this.changeDetectorRef.detectChanges();
        }),
    );

    playersSubject = this.gameInfoQuery.onPlayersChangeSubject;

    playersPositionSubject = this.gameInfoQuery.onPlayersPositionChangeSubject;

    searchPlayerIdStream = this.gameInfoQuery.searchPlayerIdStream;

    dragonPositionSubject = this.gameInfoQuery.onDragonPositionChangeSubject;

    mumiaPositionChangeSubject = this.gameInfoQuery.onMumiaPositionChangeSubject;

    GamePlayerColorList = GamePlayerColorList;

    @ViewChild('clankMapContainer', { read: ElementRef }) clankMapContainer: ElementRef<HTMLElement> | undefined;

    private userScale = 1;
    private userTranslateX = 0;
    private userTranslateY = 0;
    private autoScale = 1;
    private ngUnsubscribe = new Subject<void>();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private gameInfoService: GameInfoService,
        private cardsService: CardsService,
        private gameDialogsService: GameDialogsService,
        private gameInfoQuery: GameInfoQuery,
        private elementRef: ElementRef<HTMLElement>,
    ) { }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        this.onResize();

        fromEvent(window, 'resize').pipe(
            // TODO: заменить changeDetectorRef на signalApi
            startWith(null),
            debounceTime(100),
            takeUntil(this.ngUnsubscribe),
        ).subscribe(() => {
            this.onResize();
            this.changeDetectorRef.detectChanges();
        });

        fromEvent<WheelEvent>(this.elementRef.nativeElement, 'wheel').pipe(
            filter((event) => event.ctrlKey),
            takeUntil(this.ngUnsubscribe),
        ).subscribe((event) => {
            event.preventDefault();
            const delta = event.deltaY * -0.0005;
            const scale = this.userScale + delta;
            this.userScale = Math.min(Math.max(1, scale), 2);
            this.onResize();
        });

        fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mousedown').pipe(
            filter(event => event.button === 1),
            filter(() => this.mapInfo != null),
            takeUntil(this.ngUnsubscribe),
        ).subscribe((downEvent) => {
            let clientX = downEvent.clientX;
            let clientY = downEvent.clientY;
            fromEvent<MouseEvent>(window, 'mousemove').pipe(
                takeUntil(fromEvent(window, 'mouseup')),
            ).subscribe((event) => {
                if (this.mapInfo == null) {
                    return;
                }
                const width = this.mapInfo.width * this.autoScale * this.userScale;
                const maxWidth = 0;
                const minWidth = -(width - this.elementRef.nativeElement.clientWidth);
                const height = this.mapInfo.height * this.autoScale * this.userScale;
                const maxHeight = 0;
                const minHeight = -(height - this.elementRef.nativeElement.clientHeight);
                const userTranslateX = this.userTranslateX + (event.clientX - clientX);
                this.userTranslateX = Math.min(Math.max(minWidth, userTranslateX), maxWidth);
                const userTranslateY = this.userTranslateY + (event.clientY - clientY);
                this.userTranslateY = Math.min(Math.max(minHeight, userTranslateY), maxHeight);
                clientX = event.clientX;
                clientY = event.clientY;
                this.onResize();
                this.changeDetectorRef.detectChanges();
            });
        });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    trackById(index: number, item: { player: ClankPlayerConfig; }) {
        return item.player.id;
    }

    openDragonInfoLog(
        mapDragonInfo: ClankMapDragonInfo,
        dragonInfo: ClankDragonInfo,
        players: ClankPlayerConfig[],
    ) {
        this.gameDialogsService.openDragonInfoLog({
            mapDragonInfo,
            dragonInfo,
            players,
        });
    }

    async openMumiaDialogEvents(mumiaPosition: ClankMumiaPositionInfo) {
        if (mumiaPosition.mapMumiaInfo == null) {
            return;
        }
        const mumia = this.cardsService.getCardByFindString(mumiaPosition.mapMumiaInfo.card_find_string);
        if (mumia == null) {
            return;
        }
        await this.gameInfoService.useCard(mumia, 'onAcquire');
        this.changeDetectorRef.detectChanges();
    }

    private onResize() {
        if (this.mapInfo == null) {
            return;
        }
        this.autoScale = (this.elementRef.nativeElement.clientWidth) / this.mapInfo.width;
        this.updateScale();
    }

    private updateScale() {
        if (this.clankMapContainer == null) {
            return;
        }
        const scale = this.userScale * this.autoScale;
        const translate = (scale - 1) * 50 * (1 / scale);
        this.clankMapContainer.nativeElement.style.transform = `scale(${scale}) translate(${translate}%, ${translate}%)`;
        this.clankMapContainer.nativeElement.style.left = `${this.userTranslateX}px`;
        this.clankMapContainer.nativeElement.style.top = `${this.userTranslateY}px`;
    }

}
