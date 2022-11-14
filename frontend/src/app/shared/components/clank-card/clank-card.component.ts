import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
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
export class ClankCardComponent implements OnChanges {

    @Input() isOpen = false;
    @Input() width = ClankCardWidth;
    @Input() height = ClankCardHeight;
    @Input() state: ClankCardState | undefined;
    card: ClankCardConfig | undefined;

    style: Partial<CSSStyleDeclaration> = {};

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private cardsService: CardsService,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.card) {
            this.card = this.getCardInfo();
        }
        if (changes.card || changes.width || changes.height) {
            this.style = this.getStyle();
        }
        this.changeDetectorRef.detectChanges();
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
        const positionX = this.card.column * ClankCardWidth;
        const positionY = this.card.row * ClankCardHeight;
        return {
            width: `${ClankCardWidth}px`,
            height: `${ClankCardHeight}px`,
            backgroundImage: `url(${this.card.url})`,
            backgroundPosition: `-${positionX}px -${positionY}px`,
            backgroundSize: this.card.backgroundSize,
            flexShrink: '0',
        };
    }

}
