import {
    Component,
    Input,
    OnInit,
} from '@angular/core';

import { ClankElementTypeMap } from 'src/app/shared/models/clank-element-types';

import { ClankCostInfo } from '@shared/clank/clank-info.types';

@Component({
    selector: 'app-clank-cost-info',
    templateUrl: './clank-cost-info.component.html',
    styleUrls: ['./clank-cost-info.component.scss'],
})
export class ClankCostInfoComponent implements OnInit {

    @Input() data!: ClankCostInfo;

    ClankElementTypeMap = ClankElementTypeMap;

    constructor() { }

    ngOnInit(): void {
    }

}
