import {
    noop,
    Subject,
} from 'rxjs';
import {
    map,
    takeUntil,
} from 'rxjs/operators';
import { GameInfoQuery } from 'src/app/game/clank/services/game-info.query';
import { GameInfoStore } from 'src/app/game/clank/services/game-info.store';

import {
    arrayAdd,
    arrayUpdate,
} from '@datorama/akita';
import { ClankCardConfig } from '@shared/clank/clank-card.types';
import {
    ClankCostInfo,
    ClankElementType,
} from '@shared/clank/clank-info.types';
import {
    ClankPlayerConfig,
    GamePlayerColorIdEnum,
    GamePlayerColorInfo,
    GamePlayerColorList,
    GamePlayerStatusIdEnum,
} from '@shared/clank/clank-player.types';

export class ClankPlayer {

    index = 0;
    /** Карты в колоде */
    deck: ClankCardConfig[] = [];
    /** Карты в руке */
    hand: ClankCardConfig[] = [];
    /** Разыгранные карты на этом ходу */
    board: ClankCardConfig[] = [];
    /** Сброшеные карты */
    discard: ClankCardConfig[] = [];
    /** Карты от которых избавились */
    trash: ClankCardConfig[] = [];
    /** Положение на карте */
    mapElemenId = 1;
    /** Количество здоровья */
    heal = 10;
    /** Данный ход этого игрока или нет */
    isActive = false;
    /** Данный ход этого игрока или нет */
    isAdmin = false;
    /** Стиль отображение мипла */
    meepleStyle: Partial<CSSStyleDeclaration> = {};
    /** Информация о цвете игрока */
    colorInfo: GamePlayerColorInfo | undefined;
    /** Информация о наличии очков */
    benefitInfo: ClankCostInfo = {
        sword: 0,
        boot: 0,
        skill: 0,
        clank: 0,
    };

    get colorId() {
        return this.config.colorId;
    }

    set colorId(toColorId: GamePlayerColorIdEnum) {
        let actionLog = `${this.config.name} сменил цвет`;
        if (this.colorInfo != null)  {
            actionLog += ` c ${this.colorInfo.name}`;
        }
        this.config.colorId = toColorId;
        this.updateMeepleStyle();
        if (this.colorInfo != null)  {
            actionLog += ` на ${this.colorInfo.name}`;
        }
        this.updatePlayer(actionLog);
    }

    get isOnline() {
        return this.config.statusId === GamePlayerStatusIdEnum.Online;
    }

    get allCards() {
        return [
            ...this.deck,
            ...this.hand,
            ...this.board,
            ...this.discard,
            ...this.trash,
        ];
    }

    get handInfo() {
        const rowCount = 4;
        return this.hand.map((card, index) => {
            return {
                card,
                left: (index % rowCount) * 120,
                top: Math.floor(index / rowCount) * 280,
            };
        });
    }

    private ngUnsubscribe = new Subject();

    constructor(
        public config: ClankPlayerConfig,
        private gameInfoQuery: GameInfoQuery,
        private gameInfoStore: GameInfoStore,
    ) {
        this.mapElemenId = config.elementId;
        this.updateMeepleStyle();
        this.gameInfoQuery.onAnyChangeSubject.pipe(
            map((state) => {
                this.index = state.players.findIndex(p => p.id === this.config.id);
                this.isAdmin = this.index === 0;
                this.isActive = state.activePlayerId === this.config.id;
            }),
            takeUntil(this.ngUnsubscribe),
        ).subscribe(noop);
    }

    onDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    move(toElemenId: number) {
        const fromElemenId = this.mapElemenId;
        this.mapElemenId = toElemenId;
        this.updatePlayer(`${this.config.name} переместился из ${fromElemenId} в ${toElemenId}`);
    }

    initStartDeck(startCards: ClankCardConfig[]) {
        this.deck = startCards;
        this.shuffleDeck();
        this.drawCard(5);
    }

    drawCard(count: number) {
        while (count > 0) {
            const card = this.deck.pop();
            if (card != null) {
                // card.setPosition(ClankCardPositionEnum.playerHand);
                this.hand.push(card);
            }
            count--;
        }
    }

    useCard(card: ClankCardConfig) {
        this.board = [...this.board, card];
        this.hand = this.hand.filter((p) => p.id !== card.id);
        this.benefitInfo = Object.keys(this.benefitInfo).reduce((acc, key) => {
            const type = key as ClankElementType;
            const prevValue = acc[type] ?? 0;
            const value = card.benefit?.[type] ?? 0;
            acc[type] = prevValue + value;
            return acc;
        }, this.benefitInfo);
        // card.setPosition(ClankCardPositionEnum.playerBoard);
    }

    shuffleDeck() {
        this.deck.sort(() => Math.random() - 0.5);
            // .forEach((p, index) => p.setIndex(index));
    }

    private updateMeepleStyle() {
        const colorInfo = GamePlayerColorList[this.config.colorId];
        this.meepleStyle = {
            width: `${100}px`,
            height: `${100}px`,
            backgroundImage: `url(/assets/images/meeples.png)`,
            backgroundPosition: `-${colorInfo.positionX}px 0px`,
        };
        this.colorInfo = GamePlayerColorList[this.config.colorId];
    }

    private updatePlayer(action: string) {
        this.gameInfoStore.update((state) => ({
            players: arrayUpdate(state.players, this.config.id, this.config),
            actionLogs: arrayAdd(state.actionLogs, action),
        }));
    }

}
