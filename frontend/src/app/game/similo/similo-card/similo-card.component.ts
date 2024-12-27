import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    EventEmitter,
    HostBinding,
    input,
    Output,
} from '@angular/core';

import { SimiloCardPosition } from '@shared/similo/similo-dlc.types';

import { SimiloCard } from '../models/similo-card';

@Component({
    selector: 'app-similo-card',
    templateUrl: './similo-card.component.html',
    styleUrls: ['./similo-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SimiloCardComponent {

    readonly card = input.required<SimiloCard>();
    readonly width = input<number>();
    readonly height = input<number>();
    readonly isMaster = input(false);
    readonly isBoard = input(false);
    readonly withHover = input(false);
    readonly needOpen = input(false);
    @Output() openCard = new EventEmitter<void>();
    style = computed<Partial<CSSStyleDeclaration>>(() => {
        const card = this.card();
        const cardWidth = this.cardWidth();
        const cardHeight = this.cardHeight();
        const cardWidthPx = this.cardWidthPx();
        const cardHeightPx = this.cardHeightPx();
        if (card == null) {
            return {};
        }
        const positionX = card.state.column * cardWidth;
        const positionY = card.state.row * cardHeight;
        return {
            width: cardWidthPx,
            height: cardHeightPx,
            backgroundImage: `url(${card.state.url})`,
            backgroundPosition: `-${positionX}px -${positionY}px`,
            backgroundSize: card.state.backgroundSize,
            flexShrink: '0',
        };
    })
    isOpen = computed(() => {
        const card = this.card();
        const needOpen = this.needOpen();
        if (card == null) {
            return false;
        }
        if (card.state.isSearchable || needOpen) {
            return true;
        }
        switch (card.state.position) {
            case SimiloCardPosition.Board: {
                return card.state.isOpen;
            }
            case SimiloCardPosition.Deck: {
                return false;
            }
            case SimiloCardPosition.Hand: {
                return this.isMaster();
            }
            case SimiloCardPosition.Similar: {
                return true;
            }
            case SimiloCardPosition.NotSimilar: {
                return true;
            }
        }
    })

    cardWidth = computed(() => {
        const width = this.width();
        const card = this.card();
        return width ?? card.size.width ?? 0;
    });
    cardWidthPx = computed(() => `${this.cardWidth()}px`);
    @HostBinding('style.--card_width') card_width?: string;

    cardHeight = computed(() => {
        const height = this.height();
        const card = this.card();
        return height ?? card.size.height ?? 0;
    });
    cardHeightPx = computed(() => `${this.cardHeight()}px`);
    @HostBinding('style.--card_height') card_height?: string;

    constructor(
    ) {
        effect(() => this.card_width = this.cardWidthPx());
        effect(() => this.card_height = this.cardHeightPx());
    }

}
