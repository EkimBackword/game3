import { Injectable } from '@angular/core';

import { ClankArtifactConfig } from '@shared/clank/clank-artifact.types';

import { getArtifacts } from '../models/artifacts/artifacts.data';
import { preloadImage } from '../models/game.types';

@Injectable({
    providedIn: 'root',
})
export class ArtifactsService {

    readonly store: ClankArtifactConfig[] = [
        ...getArtifacts(),
    ];

    constructor() {
        preloadImage(this.store.map(p => p.url));
    }

    getArtifacts() {
        return getArtifacts() ?? [];
    }

}
