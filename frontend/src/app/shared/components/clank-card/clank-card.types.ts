import {
    ClankCardBaseConfigEvents,
    ClankCardConfig,
} from '@shared/clank/clank-card.types';

export interface ISelectedPlayerCardInfo {
    id: string;
    card: ClankCardConfig;
    style: Partial<CSSStyleDeclaration>;
    classes: string[];
    actions: ISelectedPlayerCardAction[];
    isOpen?: boolean;
    handIndex?: number;
    disablePopover?: boolean;
    openByHover?: boolean;
}

export interface ISelectedPlayerCardAction {
    name: string;
    eventName: keyof ClankCardBaseConfigEvents | null;
    btnClass: string;
    canUse: () => boolean;
    callback: () => void;
}

export class CardListItem {

    data!: ISelectedPlayerCardInfo;
    selectable = true;
    value = false;

    constructor(card: ClankCardConfig) {
        this.data = {
            id: card.id,
            card,
            isOpen: true,
            openByHover: false,
            style: {},
            classes: [],
            actions: [],
        };
    }

}

export const cardWidth = 160;
export const cardHeight = 220;
export const cardsWrapPadding = 16;
export const cardsWrapHeader = 30;
