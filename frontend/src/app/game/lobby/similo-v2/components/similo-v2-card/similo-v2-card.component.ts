import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    Input,
    OnChanges,
    SimpleChanges,
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
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimiloV2CardComponent implements OnChanges {

    @Input() card!: SimiloCardConfig;
    @Input() isMaster = false;
    @Input() isBoard = false;
    @Input() withHover = false;
    @Input() needOpen = false;
    @Input() isFinished = false;

    style: Partial<CSSStyleDeclaration> = {};
    isOpen = false;

    @HostBinding('style.--card_width.px') cardWidth = SimiloV2Settings.card.width;
    @HostBinding('style.--card_height.px') cardHeight = SimiloV2Settings.card.height;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.card) {
            this.updateStyle();
        }
        this.changeDetectorRef.markForCheck();
    }

    private updateStyle() {
        this.style = this.getStyle();
        this.isOpen = this.getOpenState();
    }

    private getStyle() {
        if (this.card == null) {
            return {};
        }
        const positionX = this.card.column * this.cardWidth;
        const positionY = this.card.row * this.cardHeight;
        return {
            backgroundImage: `url(${this.card.url})`,
            backgroundPosition: `-${positionX}px -${positionY}px`,
            backgroundSize: this.card.backgroundSize,
            flexShrink: '0',
        };
    }

    private getOpenState() {
        if (this.card == null) {
            return false;
        }
        if (this.isFinished || this.card.isSearchable || this.needOpen) {
            return true;
        }
        switch (this.card.position) {
            case SimiloCardPosition.Board: {
                return this.card.isOpen;
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

}
