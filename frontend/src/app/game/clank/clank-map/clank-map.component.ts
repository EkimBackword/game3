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
    filter,
    map,
    takeUntil,
} from 'rxjs/operators';
import { ClankMapElement } from 'src/app/shared/models/maps/clank-map-element.class';
import { ClankMapConfig } from 'src/app/shared/models/maps/clank-maps.types';
import { MapsService } from 'src/app/shared/services/maps.service';

import { GameInfoQuery } from '../../services/game-info/game-info.query';
import { GameInfoService } from '../../services/game-info/game-info.service';

@Component({
    selector: 'app-clank-map',
    templateUrl: './clank-map.component.html',
    styleUrls: ['./clank-map.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClankMapComponent implements OnInit, AfterViewInit, OnDestroy {

    mapInfo: ClankMapConfig | undefined;
    mapElements: ClankMapElement[] = [];
    backgroundImage: string | undefined;

    @ViewChild('clankMapContainer', { read: ElementRef }) clankMapContainer: ElementRef<HTMLElement> | undefined;

    private userScale = 1;
    private userTranslateX = 0;
    private userTranslateY = 0;
    private autoScale = 1;
    private ngUnsubscribe = new Subject();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private gameInfoService: GameInfoService,
        private gameInfoQuery: GameInfoQuery,
        private mapsService: MapsService,
        private elementRef: ElementRef<HTMLElement>,
    ) { }

    ngOnInit(): void {
        this.gameInfoQuery.onMapChangeSubject.pipe(
            map((id) => this.mapsService.getMapById(id)),
            takeUntil(this.ngUnsubscribe),
        ).subscribe((mapInfo) => {
            this.mapInfo = mapInfo;
            this.mapElements = [
                ...this.gameInfoService.mapElements.values(),
            ];
            this.backgroundImage = `url(${mapInfo?.url})`;
            this.onResize();
            this.changeDetectorRef.detectChanges();
        });

        this.gameInfoQuery.onAnyChangeSubject.pipe(
            takeUntil(this.ngUnsubscribe),
        ).subscribe((data) => {
            console.log(data);
            this.changeDetectorRef.detectChanges();
        });
    }

    ngAfterViewInit() {
        this.onResize();

        fromEvent(window, 'resize').pipe(
            takeUntil(this.ngUnsubscribe),
        ).subscribe(() => this.onResize());

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
