import {
    Component,
    HostBinding,
    Input,
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
})
export class ClankCostInfoComponent implements OnInit {

    @Input() data!: ClankCostInfo;
    @Input() type = ClankCostInfoType.all;
    @Input() @HostBinding('style.--cost-element-direction') direction = ClankCostInfoDirection.row;
    @Input() set elementHeight(value: number) {
        this.height = `${value ?? 50}px`;
    }

    keysGroup: ClankElementType[][] = [];

    @HostBinding('style.--cost-element-height') height = '50px';

    ClankElementTypeMap = ClankElementTypeMap;

    constructor() { }

    ngOnInit(): void {
        this.keysGroup = ClankCostInfoKeysByType[this.type];
    }

}
