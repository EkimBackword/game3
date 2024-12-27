import {
    Component,
    computed,
    effect,
    HostBinding,
    input,
    OnInit,
} from '@angular/core';

import {
    ClankCostInfoKeysByType,
    ClankCostInfoType,
    ClankElementTypeMap,
} from 'src/app/shared/models/clank-element-types';

import {
    ClankCostInfo,
    ClankElementType,
} from '@shared/clank/clank-info.types';

import { ClankCostInfoDirection } from './clank-cost-info.types';

@Component({
    selector: 'app-clank-cost-info',
    templateUrl: './clank-cost-info.component.html',
    styleUrls: ['./clank-cost-info.component.scss'],
    standalone: false
})
export class ClankCostInfoComponent implements OnInit {

    readonly data = input.required<ClankCostInfo>();
    readonly type = input(ClankCostInfoType.all);
    readonly direction = input(ClankCostInfoDirection.row);
    readonly justifyContent = input('flex-start');
    readonly elementHeight = input(50);

    keysGroup: ClankElementType[][] = [];

    size = computed(() => this.elementHeight() / 2);

    @HostBinding('style.--cost-element-direction') styleDirection = ClankCostInfoDirection.row;
    @HostBinding('style.--cost-element-justify-content') styleJustifyContent = 'flex-start';
    @HostBinding('style.--cost-element-height') height = '50px';

    ClankElementTypeMap = ClankElementTypeMap;

    constructor() {
        effect(() => { this.styleDirection = this.direction(); });
        effect(() => { this.styleJustifyContent = this.justifyContent(); });
        effect(() => { this.height = `${this.elementHeight()}px`; });
    }

    ngOnInit(): void {
        this.keysGroup = ClankCostInfoKeysByType[this.type()];
    }

}
