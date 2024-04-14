import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';

import { recordKeys } from '../../../../../shared/models/shared.types';

import { RelicHuntersBenefitSettings } from '../../models/benefit';
import {
    RelicHuntersActiveCellInfo,
    RelicHuntersCellInfo,
} from '../../models/cell';
import {
    RelicHuntersTileSettings,
    RelicHuntersTileTypes,
    RelicHuntersTileTypeTaxonomy,
    RelicHuntersTileUtils,
} from '../../models/tile';
import { RhBenefitComponent } from '../rh-benefit/rh-benefit.component';

@Component({
    selector: 'app-rh-cell',
    templateUrl: './rh-cell.component.html',
    styleUrls: ['./rh-cell.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RhCellComponent implements OnChanges {

    @Input({ required: true }) cell!: RelicHuntersCellInfo;
    @Input({ required: true }) activeCoords: RelicHuntersActiveCellInfo[] = [];
    @Input({ required: true }) usedCellIds: RelicHuntersCellInfo['id'][] = [];
    @Output() onClick = new EventEmitter<void>();

    @HostBinding('style') cellStyle: Partial<CSSStyleDeclaration> = {};
    @HostBinding('style.width.px') width = RelicHuntersTileSettings.width;
    @HostBinding('style.height.px') height = RelicHuntersTileSettings.height;

    @HostBinding('class.isDisabled') isDisabled = false;
    @HostBinding('class.isActive') isActive = false;
    @HostBinding('class.isCurrent') isCurrent = false;
    @HostBinding('class.isUsed') isUsed = false;
    tileStyle: Partial<CSSStyleDeclaration> = {};
    benefits: RhBenefitComponent['data'][] = [];
    research: RhBenefitComponent['data'] = {
        key: 'research',
        value: 0,
        size: RelicHuntersBenefitSettings.size * 0.6,
        inlineView: true,
    };
    move: RhBenefitComponent['data'] = {
        key: 'move',
        value: 0,
        size: RelicHuntersBenefitSettings.size * 0.6,
        inlineView: true,
    };
    levelDots: number[] = [];
    classNames: string[] = [];

    constructor(
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.updateStyles();
    }

    click() {
        if (!this.isActive || (this.isCurrent && this.isUsed)) {
            return;
        }
        this.onClick.emit()
    }

    private updateStyles() {
        this.isDisabled = this.cell.tileType === RelicHuntersTileTypes.Vulcan;
        const activeCoordInfo = !this.isDisabled
            ? this.activeCoords.find(p => {
                return p.row === this.cell.position.row && p.column === this.cell.position.column
            }) ?? null
            : null;
        this.isActive = activeCoordInfo != null;
        this.isCurrent = activeCoordInfo?.isCurrent ?? false;
        this.isUsed = this.cell.relicType == null || this.cell.hasRelict
            ? this.usedCellIds.includes(this.cell.id)
            : true;
        this.cellStyle = this.getCellStyle();
        this.tileStyle = this.getTileStyle();
        this.benefits = recordKeys(this.cell.benefit).map((key) => {
            if (key == 'tileType') {
                return null;
            }
            const value = this.cell.benefit[key];
            if (value == null) {
                return null;
            }
            const result: RhBenefitComponent['data'] = {
                key,
                value,
                size: RelicHuntersBenefitSettings.size,
                inlineView: true,
            };
            return result;
        }).filter((p): p is this['benefits'][number] => p != null);
        this.research = {
            key: 'research',
            value: this.cell.researchCost,
            size: RelicHuntersBenefitSettings.size * 0.6,
            inlineView: true,
        };
        this.move = {
            key: 'move',
            value: this.cell.isOpen
                ? this.cell.moveCostOpen
                : this.cell.moveCostClose,
            size: RelicHuntersBenefitSettings.size * 0.6,
            inlineView: true,
        };
        this.levelDots = Array(this.cell.level).fill(0);
        this.classNames = this.getClassNames();
    }

    private getCellStyle() {
        const left = RelicHuntersTileUtils.getLeft(this.cell);
        const top = RelicHuntersTileUtils.getTop(this.cell);
        const result: Partial<CSSStyleDeclaration> = {
            opacity: this.cell.isVisible ? '1' : '0',
            left: `${left}px`,
            top: `${top}px`,
        };
        return result;
    }

    private getTileStyle() {
        const tileType = RelicHuntersTileTypeTaxonomy[this.cell.tileType];
        const positionX = tileType.column * this.width;
        const rowIndex = this.cell.isOpen
            ? RelicHuntersTileSettings.openRow
            : RelicHuntersTileSettings.closeRow
        const positionY = rowIndex * this.height;
        const result: Partial<CSSStyleDeclaration> = {
            width: `${this.width}px`,
            height: `${this.height}px`,
            backgroundImage: `url(${RelicHuntersTileSettings.url})`,
            backgroundPosition: `-${positionX}px -${positionY}px`,
            backgroundSize: RelicHuntersTileSettings.backgroundSize,
        };
        return result;
    }

    private getClassNames() {
        const classNames = {
            default: 'cell-border',
            disabled: 'disabled',
            active: 'active',
        }
        if (this.isDisabled) {
            return [ classNames.default, classNames.disabled ];
        }
        return this.isActive
            ? [classNames.default, classNames.active]
            : [classNames.default];
    }

}
