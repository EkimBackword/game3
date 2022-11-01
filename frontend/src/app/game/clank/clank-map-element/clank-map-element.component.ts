import {
    ChangeDetectorRef,
    Component,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';

import { Subject } from 'rxjs';
import {
    filter,
    takeUntil,
} from 'rxjs/operators';
import {
    ClankElementTypeInfo,
    ClankElementTypeMap,
} from 'src/app/shared/models/clank.types';
import { ClankMapElement } from 'src/app/shared/models/maps/clank-map-element.class';
import { ClankMapElementLink } from 'src/app/shared/models/maps/clank-maps.types';

import { GameInfoQuery } from '../../services/game-info/game-info.query';
import { GameInfoService } from '../../services/game-info/game-info.service';

@Component({
    selector: 'app-clank-map-element',
    templateUrl: './clank-map-element.component.html',
    styleUrls: ['./clank-map-element.component.scss'],
})
export class ClankMapElementComponent implements OnInit, OnDestroy {

    @Input() mapElement: ClankMapElement | undefined;
    @HostBinding('style') style: Partial<CSSStyleDeclaration> = {};
    link: ClankMapElementLink | undefined;

    ClankElementTypeMap = ClankElementTypeMap as Record<any, ClankElementTypeInfo>;

    private ngUnsubscribe = new Subject();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private gameInfoService: GameInfoService,
        private gameInfoQuery: GameInfoQuery,
    ) { }

    ngOnInit(): void {
        this.style = this.mapElement?.style ?? {};
        this.gameInfoQuery.onAnyChangeSubject.pipe(
            filter(() => this.mapElement != null),
            takeUntil(this.ngUnsubscribe),
        ).subscribe((state) => {
            const links = this.gameInfoService.getLinks();
            this.link = links.find(p => p.element_id === this.mapElement?.config.id);
            this.changeDetectorRef.detectChanges();
        });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    onMove() {
        if (this.mapElement == null || this.gameInfoService.activePlayer == null) {
            return;
        }
        this.mapElement.enter(this.gameInfoService.activePlayer);
    }

}
