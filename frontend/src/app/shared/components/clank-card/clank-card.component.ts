import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
    ClankCardConfig,
    ClankCardHeight,
    ClankCardWidth,
} from '@shared/clank/clank-card.types';

import {
    ISelectedPlayerCardAction,
    ISelectedPlayerCardInfo,
} from './clank-card.types';

@Component({
    selector: 'app-clank-card',
    templateUrl: './clank-card.component.html',
    styleUrls: ['./clank-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClankCardComponent implements OnInit, OnChanges, OnDestroy {

    @Input() data: ISelectedPlayerCardInfo | undefined;
    @Input() openByHover = false;
    @Input() width = ClankCardWidth;
    @Input() height = ClankCardHeight;
    @Input() onChangeSubject: Subject<boolean> | undefined;
    card: ClankCardConfig | undefined;
    style: Partial<CSSStyleDeclaration> = {};
    actions: ISelectedPlayerCardAction[] = [];

    @HostBinding('style.--card_width') card_width = `${this.width}px`;
    @HostBinding('style.--card_height') card_height = `${this.height}px`;

    private ngUnsubscribe = new Subject();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
        this.init();

        this.onChangeSubject?.pipe(
            takeUntil(this.ngUnsubscribe),
        ).subscribe(() => this.init());
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.data) {
            this.updateCardInfo();
        }
        if (changes.data || changes.width || changes.height) {
            this.updateStyle();
        }
        this.changeDetectorRef.detectChanges();
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    updateStyle() {
        this.card_width = `${this.width}px`;
        this.card_height = `${this.height}px`;
        this.style = this.getStyle();
    }

    private init() {
        this.updateCardInfo();
        this.updateStyle();
        this.changeDetectorRef.detectChanges();
    }

    private updateCardInfo() {
        this.card = this.data?.card;
        this.actions = this.data?.actions.filter(p => p.canUse()) ?? [];
    }

    private getStyle() {
        if (this.card == null) {
            return {};
        }
        const positionX = this.card.column * this.width;
        const positionY = this.card.row * this.height;
        return {
            width: `${this.width}px`,
            height: `${this.height}px`,
            backgroundImage: `url(${this.card.url})`,
            backgroundPosition: `-${positionX}px -${positionY}px`,
            backgroundSize: this.card.backgroundSize,
            flexShrink: '0',
        };
    }

}
