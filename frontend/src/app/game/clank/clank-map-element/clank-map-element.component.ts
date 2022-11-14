import {
    ChangeDetectorRef,
    Component,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';

import {
    combineLatest,
    Subject,
} from 'rxjs';
import { tap } from 'rxjs/operators';
import { ClankElementTypeMap } from 'src/app/shared/models/clank-element-types';

import {
    ClankMapElementConfig,
    ClankMapElementLink,
} from '@shared/clank/clank-map.types';
import { ClankPlayerConfig } from '@shared/clank/clank-player.types';

import { GameInfoQuery } from '../services/game-info.query';
import { GameInfoService } from '../services/game-info.service';

@Component({
    selector: 'app-clank-map-element',
    templateUrl: './clank-map-element.component.html',
    styleUrls: ['./clank-map-element.component.scss'],
})
export class ClankMapElementComponent implements OnInit, OnDestroy {

    @Input() mapElement: ClankMapElementConfig | undefined;
    @HostBinding('style') style: Partial<CSSStyleDeclaration> = {};
    link: ClankMapElementLink | undefined;
    activePlayer: ClankPlayerConfig | undefined;

    dataSubject = combineLatest([
        this.gameInfoQuery.onMapChangeSubject,
        this.gameInfoQuery.onActivePlayerChangeSubject,
    ]).pipe(
        tap(([mapInfo, activePlayer]) => {
            this.activePlayer = activePlayer;
            const activePlayerPosition = mapInfo.elements.find(p => p.id === activePlayer?.elementId);
            this.link = this.activePlayer?.id === this.gameInfoQuery.currentPlayer?.id
                ? activePlayerPosition?.links.find(p => p.element_id === this.mapElement?.id)
                : void 0;
        }),
    );

    ClankElementTypeMap = ClankElementTypeMap;

    get currentPlayer() {
        return this.gameInfoQuery.currentPlayer;
    }

    private ngUnsubscribe = new Subject();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private gameInfoService: GameInfoService,
        private gameInfoQuery: GameInfoQuery,
    ) { }

    ngOnInit(): void {
        this.style = this.getStyle();
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    onMove() {
        if (this.mapElement == null || this.activePlayer == null) {
            return;
        }
        this.gameInfoService.updatePlayer(this.activePlayer.id, {
            elementId: this.mapElement.id,
        });
    }

    trackById(index: number, player: ClankPlayerConfig) {
        return player.id;
    }

    private getStyle() {
        if (this.mapElement == null) {
            return {};
        }
        const style: Partial<CSSStyleDeclaration> = {
            top: `${this.mapElement.position.y}px`,
            left: `${this.mapElement.position.x}px`,
            width: `${this.mapElement.position.width}px`,
            height: `${this.mapElement.position.height}px`,
        };
        return style;
    }

}
