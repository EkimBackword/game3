import {
    SimiloCardConfig,
    SimiloCardPosition,
} from '@shared/similo/similo-dlc.types';

const cardsInRow = 6;
const cardsCount = 12;
const cardWidth = 296;
const cardHeight = 449;
const cardSpan = 30;
const totalMargin = 10;
const headerTextHeight = 40;

export interface SimiloCardsBox {
    getLeft: (width: number) => number;
    getTop: (height: number) => number;
    getWidth: (width: number) => number;
    getHeight: (height: number) => number;
    padding: number
}

export interface SimiloSceneBoxItem {
    name: string;
    left: number;
    top: number;
    padding: number;
    width: number;
    height: number;
}

const boardBox: SimiloCardsBox = {
    getLeft: (width: number) => totalMargin,
    getTop: (height: number) => totalMargin,
    getWidth: (width: number) => {
        return (width + cardSpan) * cardsInRow - cardSpan
    },
    getHeight: (height: number) => {
        const rowCount = Math.ceil(cardsCount / cardsInRow);
        return (height + cardSpan) * rowCount - cardSpan
    },
    padding: cardSpan + headerTextHeight,
};

const deckBox: SimiloCardsBox = {
    getLeft: (width: number) => totalMargin,
    getTop: (height: number) => boardBox.getHeight(height) + totalMargin + cardSpan + SimiloCardWrapInfo.boardBox.padding,
    getWidth: (width: number) => {
        const cardCount = 1 + 5; // 1 колода + 5 карты на руке
        return (width + cardSpan) * cardCount - cardSpan
    },
    getHeight: (height: number) => {
        const rowCount = 1;
        return (height + cardSpan) * rowCount;
    },
    padding: cardSpan,
};

const similarBox: SimiloCardsBox = {
    getLeft: (width: number) => boardBox.getWidth(width) + totalMargin + cardSpan,
    getTop: (height: number) => totalMargin,
    getWidth: (width: number) => {
        const cardCount = 1;
        return (width + cardSpan) * cardCount + cardSpan;
    },
    getHeight: (height: number) => {
        const rowCount = 3;
        return (height + cardSpan) * rowCount + cardSpan;
    },
    padding: cardSpan,
};

const notSimilarBox: SimiloCardsBox = {
    getLeft: (width: number) => boardBox.getWidth(width) + similarBox.getWidth(width) + totalMargin + cardSpan,
    getTop: (height: number) => totalMargin,
    getWidth: (width: number) => {
        const cardCount = 1;
        return (width + cardSpan) * cardCount + cardSpan;
    },
    getHeight: (height: number) => {
        const rowCount = 3;
        return (height + cardSpan) * rowCount + cardSpan;
    },
    padding: cardSpan,
};

export const SimiloCardWrapInfo = {
    cardsInRow: cardsInRow,
    cardsCount: cardsCount,
    cardWidth,
    cardHeight,
    cardSpan,
    cardZoom: 0.55,
    boardBox,
    deckBox,
    similarBox,
    notSimilarBox,
};

export interface SimiloCardSize {
    width: number;
    height: number;
}

export class SimiloCard {

    style = this.getStyle();

    constructor(
        public state: SimiloCardConfig,
        public size: SimiloCardSize,
        public deckIndex: number,
    ) {
    }

    private getStyle() {
        switch (this.state.position) {
            case SimiloCardPosition.Board: {
                const topIndex = Math.floor(this.state.index / SimiloCardWrapInfo.cardsInRow);
                const leftIndex = (this.state.index % SimiloCardWrapInfo.cardsInRow);
                const left = leftIndex * (this.size.width + SimiloCardWrapInfo.cardSpan);
                const top = topIndex * (this.size.height + SimiloCardWrapInfo.cardSpan);
                const style: Partial<CSSStyleDeclaration> = {
                    left: `${left + SimiloCardWrapInfo.boardBox.getLeft(this.size.width)}px`,
                    top: `${top + SimiloCardWrapInfo.boardBox.getTop(this.size.height) + SimiloCardWrapInfo.boardBox.padding}px`,
                };
                return style;
            }
            case SimiloCardPosition.Similar: {
                const topIndex = this.state.index;
                const leftIndex = 0;
                const left = leftIndex * (this.size.width + SimiloCardWrapInfo.cardSpan);
                const top = topIndex * (this.size.height + SimiloCardWrapInfo.cardSpan);
                const style: Partial<CSSStyleDeclaration> = {
                    left: `${left + SimiloCardWrapInfo.similarBox.getLeft(this.size.width) + SimiloCardWrapInfo.notSimilarBox.padding}px`,
                    top: `${top + SimiloCardWrapInfo.similarBox.getTop(this.size.height) + SimiloCardWrapInfo.similarBox.padding}px`,
                };
                return style;
            }
            case SimiloCardPosition.NotSimilar: {
                const topIndex = this.state.index;
                const leftIndex = 0;
                const left = leftIndex * (this.size.width + SimiloCardWrapInfo.cardSpan);
                const top = topIndex * (this.size.height + SimiloCardWrapInfo.cardSpan);
                const style: Partial<CSSStyleDeclaration> = {
                    left: `${left + SimiloCardWrapInfo.notSimilarBox.getLeft(this.size.width) + SimiloCardWrapInfo.notSimilarBox.padding}px`,
                    top: `${top + SimiloCardWrapInfo.notSimilarBox.getTop(this.size.height) + SimiloCardWrapInfo.notSimilarBox.padding}px`,
                };
                return style;
            }
            case SimiloCardPosition.Hand: {
                const topIndex = 0;
                const leftIndex = this.state.index + 1;
                const left = leftIndex * (this.size.width + SimiloCardWrapInfo.cardSpan);
                const top = topIndex * (this.size.height + SimiloCardWrapInfo.cardSpan);
                const style: Partial<CSSStyleDeclaration> = {
                    left: `${left + SimiloCardWrapInfo.deckBox.getLeft(this.size.width)}px`,
                    top: `${top + SimiloCardWrapInfo.deckBox.getTop(this.size.height) + SimiloCardWrapInfo.deckBox.padding}px`,
                };
                return style;
            }
            default: {
                const topIndex = 0;
                const leftIndex = 0;
                const left = leftIndex * (this.size.width + SimiloCardWrapInfo.cardSpan);
                const top = topIndex * (this.size.height + SimiloCardWrapInfo.cardSpan);
                const style: Partial<CSSStyleDeclaration> = {
                    left: `${left + SimiloCardWrapInfo.deckBox.getLeft(this.size.width)}px`,
                    top: `${top + SimiloCardWrapInfo.deckBox.getTop(this.size.height) + SimiloCardWrapInfo.deckBox.padding}px`,
                };
                return style;
            }
        }
    }

}
