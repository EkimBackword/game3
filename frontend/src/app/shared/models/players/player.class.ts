import {
    noop,
    Subject,
} from 'rxjs';
import {
    map,
    takeUntil,
} from 'rxjs/operators';
import { GameInfoQuery } from 'src/app/game/services/game-info/game-info.query';
import { GameInfoStore } from 'src/app/game/services/game-info/game-info.store';

import {
    arrayAdd,
    arrayUpdate,
} from '@datorama/akita';

import { ClankCard } from '../cards/card.class';
import {
    ClankPlayerConfig,
    GamePlayerColorIdEnum,
    GamePlayerColorInfo,
    GamePlayerColorList,
    GamePlayerStatusIdEnum,
} from './player.types';

export class ClankPlayer {

    index = 0;
    /** Карты в колоде */
    deck: ClankCard[] = [];
    /** Карты в руке */
    hand: ClankCard[] = [];
    /** Разыгранные карты на этом ходу */
    board: ClankCard[] = [];
    /** Сброшеные карты */
    discard: ClankCard[] = [];
    /** Карты от которых избавились */
    trash: ClankCard[] = [];
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

    initStartDeck(startCards: ClankCard[]) {
        this.deck = startCards.map(p => p.getCopy(this.config.id));
        console.log(this.deck, startCards);
    }

    private updateMeepleStyle() {
        const positionX = this.config.colorId * 100;
        this.meepleStyle = {
            width: `${100}px`,
            height: `${100}px`,
            backgroundImage: `url(/assets/images/meeples.png)`,
            backgroundPosition: `-${positionX}px 0px`,
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
