import {
    ChangeDetectionStrategy,
    Component,
    computed,
    HostBinding,
    input,
} from '@angular/core';

import {
    SimiloCardConfig,
    SimiloCardPosition,
} from '@shared/similo/similo-dlc.types';

import { SimiloV2Settings } from '../../models/similo-settings';

@Component({
    selector: 'app-similo-v2-card',
    templateUrl: './similo-v2-card.component.html',
    styleUrls: ['./similo-v2-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SimiloV2CardComponent {

    readonly card = input.required<SimiloCardConfig>();
    readonly isMaster = input(false);
    readonly isBoard = input(false);
    readonly withHover = input(false);
    readonly needOpen = input(false);
    readonly isFinished = input(false);

    style = computed<Partial<CSSStyleDeclaration>>(() => {
        const card = this.card();
        if (card == null) {
            return {};
        }
        const positionX = card.column * this.cardWidth;
        const positionY = card.row * this.cardHeight;
        return {
            backgroundImage: `url(${card.url})`,
            backgroundPosition: `-${positionX}px -${positionY}px`,
            backgroundSize: card.backgroundSize,
            flexShrink: '0',
        };
    })
    isOpen = computed(() => {
        const card = this.card();
        const isFinished = this.isFinished();
        const needOpen = this.needOpen();
        if (card == null) {
            return false;
        }
        if (isFinished || card.isSearchable || needOpen) {
            return true;
        }
        switch (card.position) {
            case SimiloCardPosition.Board: {
                return card.isOpen;
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
    });

    @HostBinding('style.--card_width.px') cardWidth = SimiloV2Settings.card.width;
    @HostBinding('style.--card_height.px') cardHeight = SimiloV2Settings.card.height;

}
