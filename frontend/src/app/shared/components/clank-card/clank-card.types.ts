import { ClankCardState } from '@shared/clank/clank-card.types';
import { ClankPlayerConfig } from '@shared/clank/clank-player.types';

export interface ISelectedPlayerCardInfo {
    id: string;
    state: ClankCardState;
    style: Partial<CSSStyleDeclaration>;
    classes: string[];
    actions: ISelectedPlayerCardAction[];
    isOpen?: boolean;
    openByHover?: boolean;
}

export interface ISelectedPlayerCardAction {
    name: string;
    canUse: (activePlayer: ClankPlayerConfig) => boolean;
    callback: () => void;
}

export const cardWidth = 160;
export const cardHeight = 220;
export const cardsWrapPadding = 16;
