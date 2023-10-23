import { GameInfoStatusIdEnum } from '@shared/clank/clank-game.types';
import {
    SimiloCardConfig,
    SimiloCardPosition,
} from '@shared/similo/similo-dlc.types';
import { SimiloGameInfoState } from '@shared/similo/similo-game.types';

export interface SimiloSizeSettingsBase {
    cardWidth: number;
    cardHeight: number;
    cardZoom: number;
    cardsCount: number;
    cardsInRow: number;
    cardSpan: number;
    totalMargin: number;
    headerTitleHeight: number;
    headerTextHeight: number;
}

export interface SimiloCardSizeSettings {
    width: number;
    height: number;
    span: number;
    margin: number;
}

export const SimiloSizeSettings: SimiloSizeSettingsBase = {
    cardWidth: 296,
    cardHeight: 449,
    cardZoom: 0.55,
    cardsCount: 12,
    cardsInRow: 6,
    cardSpan: 30,
    totalMargin: 10,
    headerTitleHeight: 40,
    headerTextHeight: 20,
}

export interface SimiloCardsBox {
    getLeft: (settings: SimiloCardSizeSettings) => number;
    getTop: (settings: SimiloCardSizeSettings) => number;
    getWidth: (settings: SimiloCardSizeSettings) => number;
    getHeight: (settings: SimiloCardSizeSettings) => number;
    paddingTop: (settings: SimiloCardSizeSettings) => number;
    paddingLeft: (settings: SimiloCardSizeSettings) => number;
}

export interface SimiloSceneBoxItem {
    name: string;
    left: number;
    top: number;
    paddingTop: number;
    paddingLeft: number;
    width: number;
    height: number;
}

const boardBox: SimiloCardsBox = {
    getLeft: (settings) => settings.margin,
    getTop: (settings) => settings.margin,
    getWidth: (settings) => {
        return (settings.width + settings.span) * SimiloSizeSettings.cardsInRow - settings.span;
    },
    getHeight: (settings) => {
        const rowCount = Math.ceil(SimiloSizeSettings.cardsCount / SimiloSizeSettings.cardsInRow);
        return (settings.height + settings.span) * rowCount - settings.span
    },
    paddingTop: (settings) => settings.span + SimiloSizeSettings.headerTextHeight,
    paddingLeft: () => 0,
};

const deckBox: SimiloCardsBox = {
    getLeft: (settings) => settings.margin,
    getTop: (settings) => boardBox.getHeight(settings) + settings.margin + settings.span + SimiloCardWrapInfo.boardBox.paddingTop(settings),
    getWidth: (settings) => {
        const cardCount = 1 + 5; // 1 колода + 5 карты на руке
        return (settings.width + settings.span) * cardCount - settings.span
    },
    getHeight: (settings) => {
        const rowCount = 1;
        return (settings.height + settings.span) * rowCount;
    },
    paddingTop: (settings) => settings.span + SimiloSizeSettings.headerTextHeight,
    paddingLeft: () => 0,
};

const similarBox: SimiloCardsBox = {
    getLeft: (settings) => boardBox.getWidth(settings) + settings.margin + settings.span,
    getTop: (settings) => settings.margin,
    getWidth: (settings) => {
        const cardCount = 1;
        return (settings.width + settings.span) * cardCount + settings.span;
    },
    getHeight: (settings) => {
        const rowCount = 3;
        return (settings.height + settings.span) * rowCount + settings.span;
    },
    paddingTop: (settings) => boardBox.paddingTop(settings),
    paddingLeft: (settings) => settings.span,
};

const notSimilarBox: SimiloCardsBox = {
    getLeft: (settings) => boardBox.getWidth(settings) + similarBox.getWidth(settings) + settings.margin + settings.span,
    getTop: (settings) => settings.margin,
    getWidth: (settings) => {
        const cardCount = 1;
        return (settings.width + settings.span) * cardCount + settings.span;
    },
    getHeight: (settings) => {
        const rowCount = 3;
        return (settings.height + settings.span) * rowCount + settings.span;
    },
    paddingTop: (settings) => boardBox.paddingTop(settings),
    paddingLeft: (settings) => settings.span,
};

export const SimiloCardWrapInfo = {
    boardBox,
    deckBox,
    similarBox,
    notSimilarBox,
};

export class SimiloCard {

    style = this.getStyle();
    withHover = this.getWithHover();
    filter = this.getFilter();

    constructor(
        public state: SimiloCardConfig,
        public size: SimiloCardSizeSettings,
        public deckIndex: number,
        private isMaster: boolean,
        private tableState: SimiloGameInfoState,
    ) {
    }

    private getWithHover() {
        switch (this.state.position) {
            case SimiloCardPosition.Hand: {
                return this.isMaster;
            }
            case SimiloCardPosition.Board: {
                return this.state.isOpen;
            }
            case SimiloCardPosition.Similar:
            case SimiloCardPosition.NotSimilar: {
                return true;
            }
            case SimiloCardPosition.Deck:
            default: {
                return false
            }
        }
    }

    private getFilter() {
        if (this.tableState.statusId === GameInfoStatusIdEnum.Finished) {
            if (!this.state.isSearchable) {
                return 'grayscale(100%)';
            }
            return this.tableState.isWin
                ? `drop-shadow(5px 5px 5px var(--bs-success)) drop-shadow(-5px -5px 5px var(--bs-success))`
                : `drop-shadow(5px 5px 5px var(--bs-danger)) drop-shadow(-5px -5px 5px var(--bs-danger))`;
        }
        return;
    }

    private getStyle() {
        switch (this.state.position) {
            case SimiloCardPosition.Board: {
                const topIndex = Math.floor(this.state.index / SimiloSizeSettings.cardsInRow);
                const leftIndex = (this.state.index % SimiloSizeSettings.cardsInRow);
                const left = leftIndex * (this.size.width + this.size.span);
                const top = topIndex * (this.size.height + this.size.span);
                const style: Partial<CSSStyleDeclaration> = {
                    left: `${left + SimiloCardWrapInfo.boardBox.getLeft(this.size)}px`,
                    top: `${top + SimiloCardWrapInfo.boardBox.getTop(this.size) + SimiloCardWrapInfo.boardBox.paddingTop(this.size)}px`,
                };
                return style;
            }
            case SimiloCardPosition.Similar: {
                const topIndex = this.state.index;
                const leftIndex = 0;
                const left = leftIndex * (this.size.width + this.size.span);
                const top = topIndex * (this.size.height + this.size.span);
                const style: Partial<CSSStyleDeclaration> = {
                    left: `${left + SimiloCardWrapInfo.similarBox.getLeft(this.size) + SimiloCardWrapInfo.notSimilarBox.paddingLeft(this.size)}px`,
                    top: `${top + SimiloCardWrapInfo.similarBox.getTop(this.size) + SimiloCardWrapInfo.similarBox.paddingTop(this.size)}px`,
                };
                return style;
            }
            case SimiloCardPosition.NotSimilar: {
                const topIndex = this.state.index;
                const leftIndex = 0;
                const left = leftIndex * (this.size.width + this.size.span);
                const top = topIndex * (this.size.height + this.size.span);
                const style: Partial<CSSStyleDeclaration> = {
                    left: `${left + SimiloCardWrapInfo.notSimilarBox.getLeft(this.size) + SimiloCardWrapInfo.notSimilarBox.paddingLeft(this.size)}px`,
                    top: `${top + SimiloCardWrapInfo.notSimilarBox.getTop(this.size) + SimiloCardWrapInfo.notSimilarBox.paddingTop(this.size)}px`,
                };
                return style;
            }
            case SimiloCardPosition.Hand: {
                const topIndex = 0;
                const leftIndex = this.state.index + 1;
                const left = leftIndex * (this.size.width + this.size.span);
                const top = topIndex * (this.size.height + this.size.span);
                const style: Partial<CSSStyleDeclaration> = {
                    left: `${left + SimiloCardWrapInfo.deckBox.getLeft(this.size)}px`,
                    top: `${top + SimiloCardWrapInfo.deckBox.getTop(this.size) + SimiloCardWrapInfo.deckBox.paddingTop(this.size)}px`,
                };
                return style;
            }
            default: {
                const topIndex = 0;
                const leftIndex = 0;
                const left = leftIndex * (this.size.width + this.size.span);
                const top = topIndex * (this.size.height + this.size.span);
                const style: Partial<CSSStyleDeclaration> = {
                    left: `${left + SimiloCardWrapInfo.deckBox.getLeft(this.size)}px`,
                    top: `${top + SimiloCardWrapInfo.deckBox.getTop(this.size) + SimiloCardWrapInfo.deckBox.paddingTop(this.size)}px`,
                };
                return style;
            }
        }
    }

}
