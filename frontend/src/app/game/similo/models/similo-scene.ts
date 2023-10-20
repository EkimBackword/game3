import {
    SimiloCardSize,
    SimiloCardWrapInfo,
} from './similo-card';

export class SimiloScene {

    zoom: number = 1;
    cardSize: SimiloCardSize = {
        width: SimiloCardWrapInfo.cardWidth,
        height: SimiloCardWrapInfo.cardHeight,
    }
    headers = {
        board: {
            name: 'Персонажи (должен остаться только загаданый)',
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            padding: 0,
        },
        deck: {
            name: 'Колода ведущего',
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            padding: 0,
        },
        similar: {
            name: 'Похожий на',
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            padding: 0,
        },
        notSimilar: {
            name: 'Отличается от',
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            padding: 0,
        },
    }

    constructor() {
        this.setZoom(SimiloCardWrapInfo.cardZoom);
    }

    setZoom(zoom) {
        const width = SimiloCardWrapInfo.cardWidth * zoom;
        const height = SimiloCardWrapInfo.cardHeight * zoom;

        this.zoom = zoom;
        this.cardSize = {
            width,
            height,
        }

        this.headers.board.left = SimiloCardWrapInfo.boardBox.getLeft(width);
        this.headers.board.top = SimiloCardWrapInfo.boardBox.getTop(height);
        this.headers.board.width = SimiloCardWrapInfo.boardBox.getWidth(width);
        this.headers.board.height = SimiloCardWrapInfo.boardBox.getHeight(height);
        this.headers.board.padding = SimiloCardWrapInfo.boardBox.padding;

        this.headers.deck.left = SimiloCardWrapInfo.deckBox.getLeft(width);
        this.headers.deck.top = SimiloCardWrapInfo.deckBox.getTop(height);
        this.headers.deck.width = SimiloCardWrapInfo.deckBox.getWidth(width);
        this.headers.deck.height = SimiloCardWrapInfo.deckBox.getHeight(height);
        this.headers.deck.padding = SimiloCardWrapInfo.deckBox.padding;

        this.headers.similar.left = SimiloCardWrapInfo.similarBox.getLeft(width);
        this.headers.similar.top = SimiloCardWrapInfo.similarBox.getTop(height);
        this.headers.similar.width = SimiloCardWrapInfo.similarBox.getWidth(width);
        this.headers.similar.height = SimiloCardWrapInfo.similarBox.getHeight(height);
        this.headers.similar.padding = SimiloCardWrapInfo.similarBox.padding;

        this.headers.notSimilar.left = SimiloCardWrapInfo.notSimilarBox.getLeft(width);
        this.headers.notSimilar.top = SimiloCardWrapInfo.notSimilarBox.getTop(height);
        this.headers.notSimilar.width = SimiloCardWrapInfo.notSimilarBox.getWidth(width);
        this.headers.notSimilar.height = SimiloCardWrapInfo.notSimilarBox.getHeight(height);
        this.headers.notSimilar.padding = SimiloCardWrapInfo.notSimilarBox.padding;
    }

}
