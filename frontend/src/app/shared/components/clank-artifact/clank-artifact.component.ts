import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    OnInit,
} from '@angular/core';

import { ClankArtifactConfig } from '@shared/clank/clank-artifact.types';

@Component({
    selector: 'app-clank-artifact',
    templateUrl: './clank-artifact.component.html',
    styleUrls: ['./clank-artifact.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ClankArtifactComponent implements OnInit {

    @Input() data!: ClankArtifactConfig;
    @Input() set height(value: number) {
        this.artifact_height = `${value}px`;
    }
    @HostBinding('style.--artifact_height') artifact_height = `200px`;
    @HostBinding('style.--artifact_background') background = '';

    constructor() { }

    ngOnInit(): void {
        this.background = `url(${this.data.url}) no-repeat center center`;
    }

}
