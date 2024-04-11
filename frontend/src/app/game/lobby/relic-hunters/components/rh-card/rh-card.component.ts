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
    RelicHuntersCardInfo,
    RelicHuntersCardSettings,
} from '../../models/cards';
import {
    RelicHuntersHeroColorTaxonomy,
    RelicHuntersHeroSettings,
} from '../../models/hero';

@Component({
    selector: 'app-rh-card',
    templateUrl: './rh-card.component.html',
    styleUrls: ['./rh-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RhCardComponent implements OnChanges {

    @Input({ required: true }) card!: RelicHuntersCardInfo;
    @Input() isOpen = false;

    @HostBinding('style.width.px') width = RelicHuntersCardSettings.width;
    @HostBinding('style.height.px') height = RelicHuntersCardSettings.height;

    frontStyle: Partial<CSSStyleDeclaration> = {};
    colorStyle: Partial<CSSStyleDeclaration> = {};
    backStyle: Partial<CSSStyleDeclaration> = {
        width: `${this.width}px`,
        height: `${this.height}px`,
        backgroundImage: `url(${RelicHuntersCardSettings.backUrl})`,
        backgroundSize: '100% 100%',
    };

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
        this.frontStyle = this.getFrontStyle();
        this.colorStyle = this.getColorStyle();
    }

    private getFrontStyle() {
        if (this.card == null) {
            return {};
        }

        const style: Partial<CSSStyleDeclaration> = {
            width: `${this.width}px`,
            height: `${this.height}px`,
            backgroundImage: `url(${this.card.url})`,
            backgroundSize: '100% 100%',
        };
        return style;
    }

    private getColorStyle() {
        if (this.card?.color == null) {
            return {};
        }

        const width = RelicHuntersHeroSettings.sizeCard;
        const height = RelicHuntersHeroSettings.sizeCard;
        const color = RelicHuntersHeroColorTaxonomy[this.card.color];
        const positionX = color.column * width;
        const positionY = 2 * height;
        const style: Partial<CSSStyleDeclaration> = {
            position: 'absolute',
            bottom: `${RelicHuntersHeroSettings.cardBottom}px`,
            right: `${RelicHuntersHeroSettings.cardRight}px`,
            width: `${width}px`,
            height: `${height}px`,
            backgroundImage: `url(${RelicHuntersHeroSettings.url})`,
            backgroundPosition: `-${positionX}px -${positionY}px`,
            backgroundSize: RelicHuntersHeroSettings.backgroundSize,
        };
        return style;
    }

}
