import { Injectable } from '@angular/core';

import { SessionQuery } from 'src/app/session/session.query';
import { ClankCard } from 'src/app/shared/models/cards/card.class';
import { ClankMapElement } from 'src/app/shared/models/maps/clank-map-element.class';
import { ClankPlayer } from 'src/app/shared/models/players/player.class';
import {
    ClankPlayerConfig,
    GamePlayerColorIdEnum,
    GamePlayerStatusIdEnum,
} from 'src/app/shared/models/players/player.types';
import { CardsService } from 'src/app/shared/services/cards.service';
import { MapsService } from 'src/app/shared/services/maps.service';

import {
    arrayAdd,
    arrayRemove,
    arrayUpdate,
} from '@datorama/akita';

import { GameInfoQuery } from './game-info.query';
import { GameInfoStore } from './game-info.store';
import {
    GameInfoState,
    GameInfoStatusIdEnum,
} from './game-info.types';

@Injectable()
export class GameInfoService {

    /** Список игроков */
    players = new Map<string, ClankPlayer>();
    /** Элементы карты */
    mapElements = new Map<number, ClankMapElement>();
    /** Карты в колоде */
    deck: ClankCard[] = [];
    /** Карты в резерве */
    reserve: ClankCard[] = [];

    /** Индекс активного игрока */
    activePlayerIndex = 0;
    /** Активный игрок */
    activePlayer: ClankPlayer | undefined;

    get currentPlayer() {
        const { id } = this.sessionQuery.getValue();
        return this.players.get(id);
    }

    get playersList() {
        return [...this.players.values()];
    }

    get mapElementsList() {
        return [...this.mapElements.values()];
    }

    constructor(
        private gameInfoQuery: GameInfoQuery,
        private gameInfoStore: GameInfoStore,
        private sessionQuery: SessionQuery,
        private cardsService: CardsService,
        private mapsService: MapsService,
    ) { }

    initGameInfo(state: GameInfoState) {
        const map = this.mapsService.getMapById(state.mapId);
        if (map == null) {
            return;
        }
        map.elements.forEach(config => {
            const mapElement = new ClankMapElement(
                config,
                this.gameInfoQuery,
                this.gameInfoStore,
            );
            this.mapElements.set(config.id, mapElement);
        });
        this.players = new Map();
        state.players.forEach((config, index) => {
            if (config.id === state.activePlayerId) {
                this.activePlayerIndex = index;
            }
            this.setPlayer(config);
        });
        this.activePlayer = this.players.get(state.activePlayerId);
        this.deck = [];
        this.reserve = [];
        this.gameInfoStore.update({ ...state });
    }

    connect() {
        const { id } = this.sessionQuery.getValue();
        const gameInfo = this.gameInfoStore.getValue();
        const player = gameInfo.players.find(p => p.id === id);
        // Если игрок вернулся, то ему надо восстановить статус
        if (player != null) {
            this.updatePlayer(id, {
                statusId: GamePlayerStatusIdEnum.Online,
            });
            return;
        }
        // Если игра не начата, то к ней можно присоединится
        if (gameInfo.statusId === GameInfoStatusIdEnum.Created && this.players.size < 4) {
            this.addPlayer(gameInfo.players.length);
            return;
        }
        // Если игра начата, а игрок не найден, то он зритель
    }

    disconnect() {
        const { id } = this.sessionQuery.getValue();
        const gameInfo = this.gameInfoStore.getValue();
        const player = gameInfo.players.find(p => p.id === id);
        if (player == null) {
            return;
        }
        if (gameInfo.statusId !== GameInfoStatusIdEnum.Created) {
            this.updatePlayer(id, {
                statusId: GamePlayerStatusIdEnum.Offline,
            });
            return;
        }
        this.removePlayer(id);
    }

    addPlayer(colorId: GamePlayerColorIdEnum) {
        const { id, name } = this.sessionQuery.getValue();
        const playerConfig: ClankPlayerConfig = {
            id,
            name,
            colorId,
            statusId: GamePlayerStatusIdEnum.Online,
            elementId: 1,
        };
        this.setPlayer(playerConfig);
        this.gameInfoStore.update(({players}) => ({
            players: arrayAdd(players, playerConfig),
        }));
    }

    private setPlayer(config: ClankPlayerConfig) {
        const player = new ClankPlayer(
            config,
            this.gameInfoQuery,
            this.gameInfoStore,
        );
        this.players.set(config.id, player);
        this.mapElements.get(player.mapElemenId)?.enter(player);
    }

    removePlayer(id: string) {
        const player = this.players.get(id);
        if (player == null) {
            return;
        }
        this.mapElements.get(player.mapElemenId)?.leave(player);
        player.onDestroy();
        this.players.delete(id);
        this.gameInfoStore.update(({players}) => ({
            players: arrayRemove(players, id),
        }));
    }

    updatePlayer(id: string, player: Partial<ClankPlayerConfig>) {
        this.gameInfoStore.update(({players}) => ({
            players: arrayUpdate(players, id, player),
        }));
    }

    startGame() {
        const gameInfo = this.gameInfoStore.getValue();
        const startCards: ClankCard[] = this.cardsService.getStartDeckCards(
            gameInfo.startDeckId,
        );
        this.activePlayerIndex = Math.floor(Math.random() * this.players.size);
        const activePlayerId = gameInfo.players[this.activePlayerIndex].id;
        this.activePlayer = this.players.get(activePlayerId);
        this.players.forEach(player => {
            player.initStartDeck(startCards);
        });
        this.deck = this.cardsService.getShareDecksCards(
            gameInfo.shareDeckIds,
        );
        this.reserve = this.cardsService.getReserveDecksCards(
            gameInfo.reserveDeckIds,
            this.players.size,
        );
        this.gameInfoStore.update((state) => ({
            statusId: GameInfoStatusIdEnum.Started,
            activePlayerId,
        }));
    }

    finishGame() {
        this.mapElements.forEach(p => p.onDestroy());
        this.gameInfoStore.update((state) => ({
            statusId: GameInfoStatusIdEnum.Finished,
        }));
    }

    finishTern() {
        this.activePlayerIndex++;
        if (this.activePlayerIndex > this.players.size) {
            this.activePlayerIndex = 0;
        }
        const activePlayerId = this.playersList[this.activePlayerIndex].config.id;
        this.activePlayer = this.players.get(activePlayerId);
        this.gameInfoStore.update((state) => ({
            activePlayerId,
        }));
    }

    getLinks() {
        if (this.activePlayer == null) {
            return [];
        }
        const mapElement = this.mapElements.get(this.activePlayer.mapElemenId);
        return mapElement?.config.links ?? [];
    }

}
