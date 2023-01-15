import { Injectable } from '@angular/core';

import {
    ClankMapConfig,
    ClankMapConfigIds,
} from '@shared/clank/clank-map.types';

import { getClankMapMinFirst } from '../models/maps/clank_1_min';
import { getClankMapMin2 } from '../models/maps/clank_2_min';

@Injectable({
    providedIn: 'root',
})
export class MapsService {

    maps: ClankMapConfig[] = [
        getClankMapMinFirst(),
        getClankMapMin2(),
    ];

    constructor() { }

    getMapById(id: ClankMapConfigIds | null) {
        return this.maps.find(p => p.id === Number(id));
    }

}
