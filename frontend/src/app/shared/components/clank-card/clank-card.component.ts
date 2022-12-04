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
    ClankCardWidth,
} from '@shared/clank/clank-card.types';

import { CardsService } from '../../services/cards.service';
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
export class ClankCardComponent implements OnInit, OnChanges {

    @Input() data: ISelectedPlayerCardInfo | undefined;
    @Input() openByHover = false;
    @Input() width = ClankCardWidth;
    @Input() height = ClankCardHeight;
    card: ClankCardConfig | undefined;
    style: Partial<CSSStyleDeclaration> = {};
    actions: ISelectedPlayerCardAction[] = [];

    @HostBinding('style.--card_width') card_width = `${this.width}px`;
    @HostBinding('style.--card_height') card_height = `${this.height}px`;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private cardsService: CardsService,
    ) { }

    ngOnInit(): void {
        this.updateCardInfo();
        this.updateStyle();
        this.changeDetectorRef.detectChanges();
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

    updateStyle() {
        this.card_width = `${this.width}px`;
        this.card_height = `${this.height}px`;
        this.style = this.getStyle();
    }

    private updateCardInfo() {
        this.card = this.getCardInfo();
        this.actions = this.data?.actions.filter(p => p.canUse()) ?? [];
    }

    private getCardInfo() {
        if (this.data?.state == null) {
            return void 0;
        }
        const [find_string] = this.data.state.id.split('__');
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
