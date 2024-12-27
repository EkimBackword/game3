import {
    ChangeDetectionStrategy,
    Component,
    computed,
    HostBinding,
    input,
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
    standalone: false
})
export class RhCardComponent {

    readonly card = input.required<RelicHuntersCardInfo>();
    readonly isOpen = input(false);

    @HostBinding('style.width.px') width = RelicHuntersCardSettings.width;
    @HostBinding('style.height.px') height = RelicHuntersCardSettings.height;

    frontStyle = computed<Partial<CSSStyleDeclaration>>(() => this.getFrontStyle());
    colorStyle = computed<Partial<CSSStyleDeclaration>>(() => this.getColorStyle());
    backStyle: Partial<CSSStyleDeclaration> = {
        width: `${this.width}px`,
        height: `${this.height}px`,
        backgroundImage: `url(${RelicHuntersCardSettings.backUrl})`,
        backgroundSize: '100% 100%',
    };

    constructor(
    ) { }

    private getFrontStyle() {
        const card = this.card();
        if (card == null) {
            return {};
        }

        const style: Partial<CSSStyleDeclaration> = {
            width: `${this.width}px`,
            height: `${this.height}px`,
            backgroundImage: `url(${card.url})`,
            backgroundSize: '100% 100%',
        };
        return style;
    }

    private getColorStyle() {
        const card = this.card();
        if (card?.color == null) {
            return {};
        }

        const width = RelicHuntersHeroSettings.sizeCard;
        const height = RelicHuntersHeroSettings.sizeCard;
        const color = RelicHuntersHeroColorTaxonomy[card.color];
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
