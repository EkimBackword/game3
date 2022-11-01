import { Injectable } from '@angular/core';

import {
    ClankMapConfig,
    ClankMapConfigIds,
} from '../models/maps/clank-maps.types';
import { getClankMapFirst } from '../models/maps/clank_1';

@Injectable({
    providedIn: 'root',
})
export class MapsService {

    maps: ClankMapConfig[] = [
        getClankMapFirst(),
    ];

    constructor() { }

    getMapById(id: ClankMapConfigIds) {
        return this.maps.find(p => p.id === id);
    }

}
