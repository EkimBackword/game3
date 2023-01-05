import { Injectable } from '@angular/core';

import {
    faVolumeOff,
    faVolumeUp,
} from '@fortawesome/free-solid-svg-icons';

@Injectable({
    providedIn: 'root',
})
export class SoundService {

    private sounds = new Map<string, HTMLAudioElement>();

    soundState = {
        value: true,
        icon: faVolumeUp,
    };

    constructor() {
        const json = localStorage.getItem('SoundState');
        this.soundState = json
            ? JSON.parse(json)
            : {
                value: true,
                icon: faVolumeUp,
            };
    }

    changeSoundState(value = !this.soundState.value) {
        this.soundState = {
            value,
            icon: value
                ? faVolumeUp
                : faVolumeOff,
        };
        localStorage.setItem('SoundState', JSON.stringify(this.soundState));
    }

    play(soundUrl: string) {
        if (!this.soundState.value) {
            return;
        }
        let sound = this.sounds.get(soundUrl);
        if (sound == null) {
            sound = new Audio(soundUrl);
            this.sounds.set(soundUrl, sound);
        }
        sound.play();
    }

}
