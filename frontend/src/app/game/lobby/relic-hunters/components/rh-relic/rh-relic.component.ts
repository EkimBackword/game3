import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';

import {
    RelicHuntersRelicSettings,
    RelicHuntersRelicTypeEnum,
    RelicHuntersRelicTypeTaxonomy,
} from '../../models/relic';

@Component({
    selector: 'app-rh-relic',
    templateUrl: './rh-relic.component.html',
    styleUrls: ['./rh-relic.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class RhRelicComponent implements OnChanges {

    @Input({ required: true }) relicType!: RelicHuntersRelicTypeEnum;
    @Input() size = RelicHuntersRelicSettings.size;

    style: Partial<CSSStyleDeclaration> = {};

    constructor(
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.style = this.getRelicStyle();
    }

    private getRelicStyle() {
        const relicType = RelicHuntersRelicTypeTaxonomy[this.relicType];
        const positionX = relicType.column * this.size;
        const rowIndex = 0;
        const positionY = rowIndex * this.size;
        const result: Partial<CSSStyleDeclaration> = {
            width: `${this.size}px`,
            height: `${this.size}px`,
            backgroundImage: `url(${RelicHuntersRelicSettings.url})`,
            backgroundPosition: `-${positionX}px -${positionY}px`,
            backgroundSize: RelicHuntersRelicSettings.backgroundSize,
        };
        return result;
    }

}
