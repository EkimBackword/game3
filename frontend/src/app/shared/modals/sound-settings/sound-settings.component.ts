import {
    ChangeDetectionStrategy,
    Component,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { SoundService } from '../../services/sound.service';

@Component({
    selector: 'app-sound-settings',
    standalone: false,
    templateUrl: './sound-settings.component.html',
    styleUrl: './sound-settings.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoundSettingsComponent {

    max = 1;
    min = 0;
    step = 0.1;

    constructor(
        public dialogRef: MatDialogRef<SoundSettingsComponent>,
        public soundService: SoundService,
    ) {
    }

}
