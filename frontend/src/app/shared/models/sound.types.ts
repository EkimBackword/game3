export const SoundStateSaveToken = 'NEW_Sound_State_Save_Token' as const;

export interface SoundStateValue {
    value: boolean;
    volume: number;
}

export interface SoundState {
    total: SoundStateValue;
    effects: SoundStateValue;
    background: SoundStateValue;
}

export function getDefaultSoundState() {
    const defaultState: SoundState = {
        total: {
            value: true,
            volume: 0.5,
        },
        effects: {
            value: true,
            volume: 0.5,
        },
        background: {
            value: true,
            volume: 0.2,
        },
    };
    return defaultState;
}

export enum SoundTypeEnum {
    effects = 'effects',
    background = 'background',
}

export interface SoundEffectsOptions {
    type: SoundTypeEnum.effects;
    soundUrl: string;
}

export interface SoundBackgroundOptions {
    type: SoundTypeEnum.background;
    id: string;
    soundUrl: string[];
}

export type SoundPlayOptions =
    | SoundEffectsOptions
    | SoundBackgroundOptions;
