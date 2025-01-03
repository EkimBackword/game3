import {
    effect,
    Injectable,
    signal,
} from '@angular/core';

import {
    faVolumeOff,
    faVolumeUp,
} from '@fortawesome/free-solid-svg-icons';

import { mergeByDefault } from '../models/shared.types';
import {
    getDefaultSoundState,
    SoundPlayOptions,
    SoundState,
    SoundStateSaveToken,
    SoundStateValue,
    SoundTypeEnum,
} from '../models/sound.types';

@Injectable({
    providedIn: 'root',
})
export class SoundService {

    private store = new Map<string, {
        audio: HTMLAudioElement;
        options: SoundPlayOptions;
    }>();

    private readonly soundStateSignal = signal<SoundState>(getDefaultSoundState());

    readonly soundState = this.soundStateSignal.asReadonly();

    constructor() {
        const SoundStateJson = localStorage.getItem(SoundStateSaveToken);
        const soundStateV2 = mergeByDefault(
            JSON.parse(SoundStateJson ?? '{}'),
            getDefaultSoundState(),
        );
        this.soundStateSignal.set(soundStateV2);

        effect(() => {
            const soundState = this.soundState();
            for (const item of [...this.store.values()]) {
                const value = this.getSoundStateValue(item.options.type, soundState);
                if (!value && !item.audio.paused && !item.audio.ended) {
                    item.audio.pause();
                }
            }
        });

        effect(() => {
            const soundState = this.soundState();
            for (const item of [...this.store.values()]) {
                if (!item.audio.paused && !item.audio.ended) {
                    item.audio.volume = this.getSoundStateVolume(item.options.type, soundState);
                }
            }
        });
    }

    getSoundValue(key: keyof SoundState) {
        const soundState = this.soundState();
        return soundState[key].value;
    }

    getSoundVolume(key: keyof SoundState) {
        const soundState = this.soundState();
        return soundState[key].volume;
    }

    getSoundIcon(key: keyof SoundState) {
        return this.getSoundValue(key)
            ? faVolumeUp
            : faVolumeOff;
    }

    changeSoundValue(key: keyof SoundState, value?: boolean) {
        const soundState = this.soundState();
        const soundStateByType = soundState[key];
        this.changeSoundState(
            key,
            {
                value: value ?? !soundStateByType.value,
                volume: soundStateByType.volume,
            }
        );
    }

    changeTotalVolume(key: keyof SoundState, value: number) {
        const volume = Math.min(Math.max(value, 0), 1);
        this.changeSoundState(
            key,
            {
                value: volume > 0,
                volume: volume,
            }
        );
    }

    private changeSoundState(key: keyof SoundState, value: Partial<SoundStateValue>) {
        const oldState = this.soundState();
        const newState = {
            ...oldState,
            [key]: mergeByDefault(value, oldState[key])
        };
        if (key != 'total') {
            newState.total.value = newState.effects.value || newState.background.value;
        } else {
            newState.effects.value = newState.total.value;
            newState.background.value = newState.total.value;
        }
        this.soundStateSignal.set(newState);
        localStorage.setItem(SoundStateSaveToken, JSON.stringify(newState));
    }

    private getSoundStateValue(type: SoundPlayOptions['type'], soundState = this.soundState()) {
        const valueByType = type === SoundTypeEnum.effects
            ? soundState.effects.value
            : soundState.background.value;
        return soundState.total.value && valueByType;
    }

    private getSoundStateVolume(type: SoundPlayOptions['type'], soundState = this.soundState()) {
        const volumeByType = type === SoundTypeEnum.effects
            ? soundState.effects.volume
            : soundState.background.volume;
        return soundState.total.volume * volumeByType;
    }

    play(options: SoundPlayOptions) {
        const value = this.getSoundStateValue(options.type);
        if (!value) {
            return;
        }
        const id = options.type === SoundTypeEnum.effects
            ? options.soundUrl
            : options.id;
        let item = this.store.get(id);
        if (item == null) {
            item = {
                options,
                audio: this.getAudio(options),
            }
            this.store.set(id, item);
        } else if (!item.audio.paused && !item.audio.ended) {
            return;
        }

        item.audio.volume = this.getSoundStateVolume(options.type);
        try {
            item.audio.play();
        } catch {
            item.audio.addEventListener("canplaythrough", (event) => {
                item?.audio.play();
            });
        }
    }

    pause(id: string) {
        let item = this.store.get(id);
        if (item == null || item.audio.paused || item.audio.ended) {
            return;
        }
        item.audio.pause();
    }

    private getAudio(options: SoundPlayOptions) {
        if (options.type === SoundTypeEnum.effects) {
            return new Audio(options.soundUrl);
        }
        if (options.soundUrl.length === 0) {
            const audio = new Audio(options.soundUrl[0]);
            audio.loop = true;
            return audio;
        }
        let index = 0;
        const palylist = new Audio(options.soundUrl[index]);
        palylist.onended = () => {
            index = (index + 1) % options.soundUrl.length;
            palylist.src = options.soundUrl[index];
            try {
                palylist.play();
            } catch {
                palylist.addEventListener("canplaythrough", (event) => {
                    palylist.play();
                });
            }
        };
        return palylist;
    }

}
