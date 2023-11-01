import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
} from '@angular/core';

import { Subject } from 'rxjs';

import { SimiloCardPosition } from '@shared/similo/similo-dlc.types';

import { SimiloCard } from '../models/similo-card';

@Component({
    selector: 'app-similo-card',
    templateUrl: './similo-card.component.html',
    styleUrls: ['./similo-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimiloCardComponent implements OnChanges, OnDestroy {

    @Input() card!: SimiloCard;
    @Input() width: number | undefined;
    @Input() height: number | undefined;
    @Input() isMaster = false;
    @Input() isBoard = false;
    @Input() withHover = false;
    @Input() needOpen = false;
    @Output() openCard = new EventEmitter<void>();
    style: Partial<CSSStyleDeclaration> = {};
    isOpen = false;

    cardWidth: number = 0;
    @HostBinding('style.--card_width') card_width = `${this.cardWidth}px`;

    cardHeight: number = 0;
    @HostBinding('style.--card_height') card_height = `${this.cardHeight}px`;

    private ngUnsubscribe = new Subject<void>();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.card || changes.width || changes.height) {
            this.updateStyle();
        }
        this.changeDetectorRef.markForCheck();
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    onOpenCard() {
        this.openCard.emit();
    }

    private updateStyle() {
        this.cardWidth = this.width ?? this.card.size.width;
        this.cardHeight = this.height ?? this.card.size.height;
        this.card_width = `${this.cardWidth}px`;
        this.card_height = `${this.cardHeight}px`;
        this.style = this.getStyle();
        this.isOpen = this.getOpenState();
    }

    private getOpenState() {
        if (this.card == null) {
            return false;
        }
        if (this.card.state.isSearchable || this.needOpen) {
            return true;
        }
        switch (this.card.state.position) {
            case SimiloCardPosition.Board: {
                return this.card.state.isOpen;
            }
            case SimiloCardPosition.Deck: {
                return false;
            }
            case SimiloCardPosition.Hand: {
                return this.isMaster;
            }
            case SimiloCardPosition.Similar: {
                return true;
            }
            case SimiloCardPosition.NotSimilar: {
                return true;
            }
        }
    }

    private getStyle() {
        if (this.card == null) {
            return {};
        }
        const positionX = this.card.state.column * this.cardWidth;
        const positionY = this.card.state.row * this.cardHeight;
        return {
            width: this.card_width,
            height: this.card_height,
            backgroundImage: `url(${this.card.state.url})`,
            backgroundPosition: `-${positionX}px -${positionY}px`,
            backgroundSize: this.card.state.backgroundSize,
            flexShrink: '0',
        };
    }

}
