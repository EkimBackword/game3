import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
} from '@angular/core';

import { SoundState } from 'src/app/shared/models/sound.types';
import { SoundService } from 'src/app/shared/services/sound.service';

@Component({
    selector: 'app-sound-settings-by-type',
    standalone: false,
    templateUrl: './sound-settings-by-type.component.html',
    styleUrl: './sound-settings-by-type.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoundSettingsByTypeComponent {

    private soundService = inject(SoundService);

    key = input.required<keyof SoundState>();

    label = input.required<string>();

    icon = computed(() => {
        const key = this.key();
        return this.soundService.getSoundIcon(key);
    });

    volume = computed(() => {
        const key = this.key();
        return this.soundService.getSoundVolume(key);
    });

    max = 1;

    min = 0;

    step = 0.1;

    changeSoundValue() {
        const key = this.key();
        this.soundService.changeSoundValue(key);
    }

    changeTotalVolume(value: number) {
        const key = this.key();
        this.soundService.changeTotalVolume(key, value);
    }

}
