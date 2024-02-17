const SimiloV2CardSize = {
    width: 296,
    height: 449,
}

export const SimiloV2Settings = {
    card: SimiloV2CardSize,
    boardCardsCount: 12,
    boardCardsInRow: 6,
    deckCardsCount: 5,
    padding: 15,
    cardSpan: 30,
    headerHeight: 60,
    headerFontSize: 40,
    titleHeight: 50,
    titleFontSize: 30,
}

export enum SimiloV2TurnStage {
    NONE,
    MASTER,
    USERS,
}
