import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';

import {
    ClankCardConfig,
    ClankCardHeight,
    ClankCardState,
    ClankCardWidth,
} from '@shared/clank/clank-card.types';

import { CardsService } from '../../services/cards.service';

@Component({
    selector: 'app-clank-card',
    templateUrl: './clank-card.component.html',
    styleUrls: ['./clank-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClankCardComponent implements OnInit, OnChanges {

    @Input() isOpen = false;
    @Input() width = ClankCardWidth;
    @Input() height = ClankCardHeight;
    @Input() state: ClankCardState | undefined;
    card: ClankCardConfig | undefined;

    style: Partial<CSSStyleDeclaration> = {};

    @HostBinding('style.--card_width') card_width = `${this.width}px`;
    @HostBinding('style.--card_height') card_height = `${this.height}px`;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private cardsService: CardsService,
    ) { }

    ngOnInit(): void {
        this.card = this.getCardInfo();
        this.updateStyle();
        this.changeDetectorRef.detectChanges();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.card) {
            this.card = this.getCardInfo();
        }
        if (changes.card || changes.width || changes.height) {
            this.updateStyle();
        }
        this.changeDetectorRef.detectChanges();
    }

    updateStyle() {
        this.card_width = `${this.width}px`;
        this.card_height = `${this.height}px`;
        this.style = this.getStyle();
    }

    private getCardInfo() {
        if (this.state == null) {
            return void 0;
        }
        const [find_string] = this.state.id.split('__');
        return this.cardsService.store.find(p => p.find_string === find_string);
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
