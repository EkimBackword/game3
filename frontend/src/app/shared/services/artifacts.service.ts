import { Injectable } from '@angular/core';

import { ClankArtifactConfig } from '@shared/clank/clank-artifact.types';

import { getArtifacts } from '../models/artifacts/artifacts.data';

@Injectable({
    providedIn: 'root',
})
export class ArtifactsService {

    readonly store: ClankArtifactConfig[] = [
        ...getArtifacts(),
    ];

    constructor() { }

    getArtifacts() {
        return getArtifacts() ?? [];
    }

}
