import {
    SimiloCardsBox,
    SimiloCardSizeSettings,
    SimiloCardWrapInfo,
    SimiloSceneBoxItem,
    SimiloSizeSettings,
} from './similo-card';

export interface SimiloSceneHeaders {
    board: SimiloSceneBoxItem;
    deck: SimiloSceneBoxItem;
    similar: SimiloSceneBoxItem;
    notSimilar: SimiloSceneBoxItem;
}

export class SimiloScene {

    zoom: number = 1;
    cardSize: SimiloCardSizeSettings = {
        width: SimiloSizeSettings.cardWidth,
        height: SimiloSizeSettings.cardHeight,
        span: SimiloSizeSettings.cardSpan,
        margin: SimiloSizeSettings.totalMargin,
    }
    headers!: SimiloSceneHeaders;

    constructor() {
        this.setZoom(SimiloSizeSettings.cardZoom);
    }

    setZoom(zoom) {
        this.zoom = zoom;
        this.cardSize = {
            width: SimiloSizeSettings.cardWidth * zoom,
            height: SimiloSizeSettings.cardHeight * zoom,
            span: SimiloSizeSettings.cardSpan * zoom,
            margin: SimiloSizeSettings.totalMargin * zoom,
        }
        this.headers = {
            board: this.getSizeByBox(
                'Персонажи',
                SimiloCardWrapInfo.boardBox,
            ),
            deck: this.getSizeByBox(
                'Колода очевидца',
                SimiloCardWrapInfo.deckBox,
            ),
            similar: this.getSizeByBox(
                'Похожий на',
                SimiloCardWrapInfo.similarBox,
            ),
            notSimilar: this.getSizeByBox(
                'Отличается от',
                SimiloCardWrapInfo.notSimilarBox,
            ),
        };
    }

    private getSizeByBox(name: string, box: SimiloCardsBox) {
        const data: SimiloSceneBoxItem = {
            name,
            left: box.getLeft(this.cardSize),
            top: box.getTop(this.cardSize),
            width: box.getWidth(this.cardSize),
            height: box.getHeight(this.cardSize),
            paddingTop: box.paddingTop(this.cardSize),
            paddingLeft: box.paddingLeft(this.cardSize),
        }
        return data;
    }

}
