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

import { GamePlayerId } from '@shared/game/game-constants';

import { recordKeys } from '../../../../../shared/models/shared.types';
import {
    RelicHuntersBenefitSettings,
    RhBenefitComponentData,
} from '../../models/benefit';
import {
    RelicHuntersActiveCellInfo,
    RelicHuntersCellInfo,
} from '../../models/cell';
import {
    RelicHuntersTileSettings,
    RelicHuntersTileTypes,
    RelicHuntersTileUtils,
} from '../../models/tile';

@Component({
    selector: 'app-rh-cell',
    templateUrl: './rh-cell.component.html',
    styleUrls: ['./rh-cell.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class RhCellComponent {

    readonly cell = input.required<RelicHuntersCellInfo>();
    readonly activeCoords = input.required<RelicHuntersActiveCellInfo[]>();
    readonly usedCellIds = input.required<RelicHuntersCellInfo['id'][]>();
    readonly selectedPlayerId = input<GamePlayerId | null>(null);
    readonly forPopover = input(false);
    @Output() onClick = new EventEmitter<void>();

    private activeCoordInfo = computed(() => {
        const isDisabled = this.isDisabled();
        const activeCoords = this.activeCoords();
        const cell = this.cell();

        return !isDisabled
            ? activeCoords.find(p => {
                return p.row === cell.position.row && p.column === cell.position.column
            }) ?? null
            : null;
    })

    style = computed<Partial<CSSStyleDeclaration>>(() => {
        const cell = this.cell();
        const forPopover = this.forPopover();
        if (forPopover) {
            return {
                opacity: '1',
                left: `0px`,
                top: `0px`,
                width: `${RelicHuntersTileSettings.width}px`,
                height: `${RelicHuntersTileSettings.height}px`
            }
        }
        const left = RelicHuntersTileUtils.getLeft(cell);
        const top = RelicHuntersTileUtils.getTop(cell);
        const result: Partial<CSSStyleDeclaration> = {
            opacity: cell.isVisible ? '1' : '0',
            left: `${left}px`,
            top: `${top}px`,
            width: `${RelicHuntersTileSettings.width}px`,
            height: `${RelicHuntersTileSettings.height}px`,
        };
        return result;
    })
    @HostBinding('style') cellStyle: Partial<CSSStyleDeclaration> = {};

    isDisabled = computed(() => this.cell().tileType === RelicHuntersTileTypes.Vulcan);
    @HostBinding('class.isDisabled') classIsDisabled = false;

    isActive = computed(() => this.activeCoordInfo() != null);
    @HostBinding('class.isActive') classIsActive = false;

    isCurrent = computed(() => this.activeCoordInfo()?.isCurrent ?? false);
    @HostBinding('class.isCurrent') classIsCurrent = false;

    hasPlayer = computed(() => {
        const forPopover = this.forPopover();
        const players = this.cell().players;
        return forPopover || players.length > 0;
    });
    @HostBinding('class.hasPlayer') classHasPlayer = false;

    hasSelectedPlayer = computed(() => {
        const forPopover = this.forPopover();
        const players = this.cell().players;
        const selectedPlayerId = this.selectedPlayerId();
        return !forPopover && selectedPlayerId != null && players.includes(selectedPlayerId);
    })
    @HostBinding('class.hasSelectedPlayer') classHasSelectedPlayer = false;

    isUsed = computed(() => {
        const cell = this.cell();
        const usedCellIds = this.usedCellIds();
        return cell.relicType == null || cell.hasRelict
            ? usedCellIds.includes(cell.id)
            : true;
    });
    @HostBinding('class.isUsed') classIsUsed = false;

    benefits = computed(() => {
        const benefits = this.cell().benefit
        return recordKeys(benefits).map((key) => {
            if (key == 'tileType') {
                return null;
            }
            const value = benefits[key];
            if (value == null) {
                return null;
            }
            const result: RhBenefitComponentData = {
                key,
                value,
                size: RelicHuntersBenefitSettings.size,
                inlineView: true,
            };
            return result;
        }).filter((p): p is RhBenefitComponentData => p != null);
    });

    research = computed<RhBenefitComponentData>(() => {
        const cell = this.cell();
        return {
            key: 'research',
            value: cell.researchCost,
            size: RelicHuntersBenefitSettings.size * 0.6,
            inlineView: true,
        };
    });

    move = computed<RhBenefitComponentData>(() => {
        const cellValue = this.cell();
        return {
            key: 'move',
            value: cellValue.isOpen
                ? cellValue.moveCostOpen
                : cellValue.moveCostClose,
            size: RelicHuntersBenefitSettings.size * 0.6,
            inlineView: true,
        };
    });

    levelDots = computed<number[]>(() => Array(this.cell().level).fill(0));

    classNames = computed<string[]>(() => {
        const isDisabled = this.isDisabled();
        const isActive = this.isActive();
        const classNames = {
            default: 'cell-border',
            disabled: 'disabled',
            active: 'active',
        }
        if (isDisabled) {
            return [ classNames.default, classNames.disabled ];
        }
        return isActive
            ? [classNames.default, classNames.active]
            : [classNames.default];
    });

    isOpen = computed(() => this.cell().isOpen || this.forPopover());

    constructor(
    ) {
        effect(() => this.cellStyle = this.style());
        effect(() => this.classIsDisabled = this.isDisabled());
        effect(() => this.classIsActive = this.isActive());
        effect(() => this.classIsCurrent = this.isCurrent());
        effect(() => this.classHasPlayer = this.hasPlayer());
        effect(() => this.classHasSelectedPlayer = this.hasSelectedPlayer());
        effect(() => this.classIsUsed = this.isUsed());
    }

    click() {
        if (!this.isActive() || (this.isCurrent() && this.isUsed())) {
            return;
        }
        this.onClick.emit()
    }

}
