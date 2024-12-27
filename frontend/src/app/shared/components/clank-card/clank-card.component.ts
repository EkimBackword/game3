import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    HostBinding,
    input,
} from '@angular/core';

import {
    ClankCardHeight,
    ClankCardWidth,
} from '@shared/clank/clank-card.types';

import { ISelectedPlayerCardInfo } from './clank-card.types';

@Component({
    selector: 'app-clank-card',
    templateUrl: './clank-card.component.html',
    styleUrls: ['./clank-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ClankCardComponent {

    readonly data = input<ISelectedPlayerCardInfo>();
    readonly openByHover = input(false);
    readonly width = input(ClankCardWidth);
    readonly height = input(ClankCardHeight);
    card = computed(() => this.data()?.card);
    style = computed<Partial<CSSStyleDeclaration>>(() => {
        const card = this.card();
        const width = this.width();
        const height = this.height();
        if (card == null) {
            return {};
        }
        const positionX = card.column * width;
        const positionY = card.row * height;
        return {
            width: `${width}px`,
            height: `${height}px`,
            backgroundImage: `url(${card.url})`,
            backgroundPosition: `-${positionX}px -${positionY}px`,
            backgroundSize: card.backgroundSize,
            flexShrink: '0',
        };
    });
    canUse = computed(() => {
        return this.data()?.action?.canUse() ?? false;
    });

    @HostBinding('style.--card_width') card_width = `${this.width()}px`;
    @HostBinding('style.--card_height') card_height = `${this.height()}px`;

    constructor(
    ) {
        effect(() => this.card_width = `${this.width()}px`);
        effect(() => this.card_height = `${this.height()}px`);
    }

    useCard() {
        if (!this.canUse()) {
            return;
        }
        this.data()?.action?.callback();
    }

}
