import cors from 'cors';
import express, {
    Request,
    Response,
} from 'express';
import * as http from 'http';
import {
    Namespace,
    Server,
} from 'socket.io';

import { initDragonInfo } from '../../shared/clank/clank-dragon.types';
import {
    GameInfoState,
    GameInfoStatusIdEnum,
} from '../../shared/clank/clank-game.types';
import { ClankDlcEnum } from '../../shared/clank/clank-info.types';
import { ClankMapConfigIds } from '../../shared/clank/clank-map.types';
import { initClankMumiaInfo } from '../../shared/clank/clank-mumia.types';
import {
    ClankPlayerConfig,
    GamePlayerColorIds,
} from '../../shared/clank/clank-player.types';
import { GameState } from '../../shared/game/game-state';
import {
    Lobby,
    LobbyConfig,
    LobbyStatusIdEnum,
} from '../../shared/lobby/lobby';
import {
    LobbyChatMessage,
    LobbyChatMessagePayload,
} from '../../shared/lobby/lobby-chat';
import { LobbyGame } from '../../shared/lobby/lobby-game';
import { LobbyStatistic } from '../../shared/lobby/lobby-statistics';
import {
    SimiloGameInfoState,
    SimiloPlayerConfig,
} from '../../shared/similo/similo-game.types';
import {
    ClankClientToServerEvents,
    ClankServerToClientEvents,
    ClientToServerEvents,
    InterServerEvents,
    LobbyClientToServerEvents,
    LobbyServerToClientEvents,
    ServerToClientEvents,
    SimiloClientToServerEvents,
    SimiloServerToClientEvents,
    SocketData,
    SocketErrorTypeEnum,
    SocketUser,
} from '../../shared/socket.types';

const app = express();
const httpServer = http.createServer(app);

app.use(cors());
app.get('/', (req: Request, res: Response) => {
    res.json({
        data: 'hello world',
    });
});

const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>(httpServer, {
    transports: [
        'websocket',
        'polling',
    ],
    cors: {
        origin: '*',
    },
});

class GamesInfo {
    gamesList = new Map<string, GameInfoState>();
    gamesHistory = new Map<string, GameInfoState[]>();

    constructor() {
        const testGame: GameInfoState = {
            id: 'test',
            name: 'Test',
            statusId: GameInfoStatusIdEnum.Created,
            mapId: ClankMapConfigIds.clank_1,
            mapDlcId: ClankDlcEnum.clank,
            dungeonDeck: [],
            dungeonRow: [],
            reserveRow: [],
            mapTokens: [],
            marketTokens: [],
            artifacts: [],
            players: [],
            dragonInfo: initDragonInfo(),
            mumiaInfo: initClankMumiaInfo(),
            actionLogs: [],
            turnIndex: 0,
            activePlayerIndex: 0,
            activePlayerId: '',
            canCancel: false,
        };
        this.gamesList.set(testGame.id, testGame);
    }

    addState(state: GameInfoState) {
        this.gamesList.set(state.id, state);
        this.gamesHistory.set(state.id, []);
    }

    updateState(state: GameInfoState) {
        const oldState = this.gamesList.get(state.id);
        this.gamesHistory.set(state.id, [
            ...this.gamesHistory.get(state.id) ?? [],
            oldState,
        ]);
        this.gamesList.set(state.id, state);
    }

    cancelState(oldState: GameInfoState) {
        const history = this.gamesHistory.get(oldState.id);
        const state = history.pop();
        this.gamesList.set(state.id, state);
        return state;
    }

    hasStateById(id: string) {
        return this.gamesList.has(id);
    }

    getStateById(id: string) {
        return id ? this.gamesList.get(id) : null;
    }

    getList() {
        return [...this.gamesList.values()];
    }

}

class SimiloTablesInfo {
    gamesList = new Map<string, SimiloGameInfoState>();

    constructor() {}

    addState(state: SimiloGameInfoState) {
        this.gamesList.set(state.id, state);
    }

    updateState(state: SimiloGameInfoState) {
        this.gamesList.set(state.id, state);
    }

    hasStateById(id: string) {
        return this.gamesList.has(id);
    }

    getStateById(id: string) {
        return id ? this.gamesList.get(id) : null;
    }

    getList() {
        return [...this.gamesList.values()];
    }
}

class LobbyInfo {

    data: Lobby;
    history = new Map<number, GameState>();

    constructor(
        config: LobbyConfig,
    ) {
        this.data = {
            id: config.id,
            name: config.name,
            adminId: config.admin.id,
            statusId: LobbyStatusIdEnum.Lobby,
            users: [config.admin],
            chat: {
                list: [],
            },
            game: this.getInitialGame(),
            statistics: [],
        };
    }

    onConnect(user: SocketUser) {
        this.data.users.push(user);
        const needChangeGameState = this.data.game.state.context.activePlayers[user.id] != null;
        if (needChangeGameState) {
            this.data.game.state.context.activePlayers[user.id].isOnline = true;
        }
        return {
            needChangeGameState,
        };
    }

    onDisconnect(user: SocketUser) {
        this.data.users = this.data.users.filter(p => p.id !== user.id);
        const needChangeGameState = this.data.game.state.context.activePlayers[user.id] != null;
        if (needChangeGameState) {
            this.data.game.state.context.activePlayers[user.id].isOnline = false;
        }
        return {
            needChangeGameState,
        };
    }

    sendMessage(sender: SocketUser, payload: LobbyChatMessagePayload) {
        const id = this.data.chat.list.length + 1;
        const message: LobbyChatMessage = {
            id,
            sender,
            payload,
        };
        this.data.chat.list.push(message);
        return message;
    }

    addStatistics(statistic: LobbyStatistic) {
        this.data.statistics.push(statistic);
    }

    changeGame(game: LobbyGame) {
        this.data.game = game;
        this.history.clear();
        this.history.set(this.data.game.state.id, this.data.game.state);
    }

    addState(state: GameState) {
        this.data.game.state = state;
        this.history.set(state.id, state);
        return state;
    }

    goToStateById(stateId: number) {
        const currentState = this.data.game.state;
        const oldState = this.history.get(stateId);
        const state: GameState = {
            ...oldState,
            id: currentState.id + 1,
        };
        this.addState(state);
        return state;
    }

    private getInitialGame() {
        const initial: GameState = {
            id: 0,
            game: {},
            context: {
                playerCount: 0,
                playerIdsOrder: [],
                playerIdsOrderPosition: 0,
                activePlayers: {},
                currentPlayerId: null,
                numMoves: 0,
                gameover: false,
                turn: 0,
                phase: '',
            },
        };
        const game: LobbyGame = {
            id: null,
            setupData: null,
            state: initial,
            log: [],
        };
        return game;
    }

}

class LobbyStore {

    lobbyList = new Map<string, LobbyInfo>();

    constructor() {}

    hasLobby(id: string) {
        return this.lobbyList.has(id);
    }

    addLobby(config: LobbyConfig) {
        const lobby = new LobbyInfo(config);
        this.lobbyList.set(config.id, lobby);
    }

    getLobby(id: string) {
        return this.lobbyList.get(id);
    }

    getLobbyList() {
        return [...this.lobbyList.values()].map(p => p.data);
    }

}

const clankGames = new GamesInfo();
const similoTables = new SimiloTablesInfo();
const lobbyStore = new LobbyStore();

io.on('connection', (socket) => {

    let user: SocketUser = {
        id: '',
        name: '',
    };

    socket.on('disconnect', () => {
    });

    socket.on('setUserInfo', (_user: SocketUser) => {
        user = _user;
    });

    socket.on('addGame', (game) => {
        if (clankGames.hasStateById(game.id)) {
            return;
        }
        clankGames.addState(game);
        socket.emit('gameListChanged', clankGames.getList());
    });

    socket.emit('gameListChanged', clankGames.getList());

    socket.on('addSimiloTable', (game) => {
        if (similoTables.hasStateById(game.id)) {
            return;
        }
        similoTables.addState(game);
        socket.emit('similoTablesChanged', similoTables.getList());
    });

    socket.emit('similoTablesChanged', similoTables.getList());

    socket.on('addLobby', (config) => {
        if (lobbyStore.hasLobby(config.id)) {
            return;
        }
        lobbyStore.addLobby({
            ...config,
            admin: user,
        });
        socket.emit('lobbyStoreChanged', lobbyStore.getLobbyList());
    });

    socket.emit('lobbyStoreChanged', lobbyStore.getLobbyList());

});

const gameRegExp = /^\/clank-(.+)$/;
const clankNamespaceOf = io.of(gameRegExp) as Namespace<
    ClankClientToServerEvents,
    ClankServerToClientEvents,
    InterServerEvents,
    SocketData
>;
clankNamespaceOf.on('connection', (socket) => {
    const clankNamespace = socket.nsp;
    const user: SocketUser = {
        id: socket.handshake.auth.id,
        name: socket.handshake.auth.name,
    };

    const getGameInfo = () => {
        const match = gameRegExp.exec(clankNamespace.name);
        const gameId = match?.[1];
        const gameInfo = clankGames.getStateById(gameId);

        if (gameInfo == null) {
            socket.emit(
                'error',
                `Игра #${gameId} не найдена`,
                SocketErrorTypeEnum.gameNotFound,
            );
            return null;
        }
        return gameInfo;
    };

    const onConnect = () => {
        const gameInfo = getGameInfo();
        if (gameInfo == null) {
            return;
        }

        // Если игрок вернулся, то ему надо восстановить статус
        const player = gameInfo.players.find(p => p.id === user.id);
        if (player) {
            player.isOnline = true;
            clankNamespace.emit('gameUpdated', gameInfo);
            return;
        }

        // Если игра не начата, то к ней можно присоединится при налиичии свободных мест
        const colorId = GamePlayerColorIds.find(id => !gameInfo.players.some(p => p.colorId === id));
        if (gameInfo.statusId === GameInfoStatusIdEnum.Created && colorId != null) {
            const playerConfig: ClankPlayerConfig = {
                ...user,
                colorId,
                isOnline: true,
                isAdmin: gameInfo.players.length === 0,
                elementId: 1,
                benefitInfo: {
                    heal: 10,
                    coin: 0,
                },
                deck: [],
                hand: [],
                board: [],
                discard: [],
                trash: [],
                needTrashCards: [],
                tokens: [],
                artifacts: [],
                isRescued: false,
                isEscaped: false,
                isFinish: false,
            };
            gameInfo.players.push(playerConfig);
            clankNamespace.emit('gameUpdated', gameInfo);
            return;
        }

        // Если игра начата, а игрок не найден, то он зритель
    };

    const onDisconnect = () => {
        const gameInfo = getGameInfo();
        if (gameInfo == null) {
            return;
        }

        const player = gameInfo.players.find(p => p.id === user.id);
        if (player == null) {
            return;
        }

        if (gameInfo.statusId !== GameInfoStatusIdEnum.Created || player.isAdmin) {
            player.isOnline = false;
            clankNamespace.emit('gameUpdated', gameInfo);
            return;
        }

        gameInfo.players = gameInfo.players.filter(p => p.id !== user.id);
        clankNamespace.emit('gameUpdated', gameInfo);
    };

    onConnect();
    console.log(`${user?.name} connected from ${clankNamespace.name}`);

    socket.on('updateGame', (state) => {
        const gameInfo = getGameInfo();
        if (gameInfo == null) {
            return;
        }
        clankGames.updateState(state);
        socket.broadcast.emit('gameUpdated', state);
    });

    socket.on('cancelState', (oldState) => {
        const gameInfo = getGameInfo();
        if (gameInfo == null) {
            return;
        }
        const state = clankGames.cancelState(oldState);
        clankNamespace.emit('gameUpdated', state);
    });

    socket.on('kickUser', (userId: string) => {
        const userSocket = [...socket.nsp.sockets.values()].find(p => p.handshake.auth.id === userId);
        if (userSocket == null) {
            return;
        }
        userSocket.emit('userKicked', userId);
    });

    socket.on('disconnect', () => {
        onDisconnect();
        console.log(`${user?.name} disconnected from ${clankNamespace.name}`);
    });
});

const similoRegExp = /^\/similo-(.+)$/;
const similoNamespaceOf = io.of(similoRegExp) as Namespace<
    SimiloClientToServerEvents,
    SimiloServerToClientEvents,
    InterServerEvents,
    SocketData
>;
similoNamespaceOf.on('connection', (socket) => {
    const similoNamespace = socket.nsp;
    const user: SocketUser = {
        id: socket.handshake.auth.id,
        name: socket.handshake.auth.name,
    };

    const getSimiloTableInfo = () => {
        const match = similoRegExp.exec(similoNamespace.name);
        const gameId = match?.[1];
        const gameInfo = similoTables.getStateById(gameId);

        if (gameInfo == null) {
            socket.emit(
                'error',
                `Игра #${gameId} не найдена`,
                SocketErrorTypeEnum.gameNotFound,
            );
            return null;
        }
        return gameInfo;
    };

    const onConnect = () => {
        const gameInfo = getSimiloTableInfo();
        if (gameInfo == null) {
            return;
        }

        // Если игрок вернулся, то ему надо восстановить статус
        const player = gameInfo.players.find(p => p.id === user.id);
        if (player) {
            player.isOnline = true;
            similoNamespace.emit('gameUpdated', gameInfo);
            return;
        }

        // Если игра не начата, то к ней можно присоединится при налиичии свободных мест
        const colorId = GamePlayerColorIds.find(id => !gameInfo.players.some(p => p.colorId === id));
        if (gameInfo.statusId === GameInfoStatusIdEnum.Created && colorId != null) {
            const playerConfig: SimiloPlayerConfig = {
                ...user,
                colorId,
                isOnline: true,
                isAdmin: gameInfo.players.length === 0,
            };
            gameInfo.players.push(playerConfig);
            if (gameInfo.players.length === 1) {
                gameInfo.masterPlayerId = gameInfo.players[0].id;
            }
            similoNamespace.emit('gameUpdated', gameInfo);
            return;
        }

        // Если игра начата, а игрок не найден, то он зритель
    };

    const onDisconnect = () => {
        const gameInfo = getSimiloTableInfo();
        if (gameInfo == null) {
            return;
        }

        const player = gameInfo.players.find(p => p.id === user.id);
        if (player == null) {
            return;
        }

        if (gameInfo.statusId !== GameInfoStatusIdEnum.Created || player.isAdmin) {
            player.isOnline = false;
            similoNamespace.emit('gameUpdated', gameInfo);
            return;
        }

        gameInfo.players = gameInfo.players.filter(p => p.id !== user.id);
        similoNamespace.emit('gameUpdated', gameInfo);
    };

    onConnect();
    console.log(`${user?.name} connected from ${similoNamespace.name}`);

    socket.on('updateGame', (state) => {
        const gameInfo = getSimiloTableInfo();
        if (gameInfo == null) {
            return;
        }
        similoTables.updateState(state);
        socket.broadcast.emit('gameUpdated', state);
    });

    socket.on('kickUser', (userId: string) => {
        const userSocket = [...socket.nsp.sockets.values()].find(p => p.handshake.auth.id === userId);
        if (userSocket == null) {
            return;
        }
        userSocket.emit('userKicked', userId);
    });

    socket.on('disconnect', () => {
        onDisconnect();
        console.log(`${user?.name} disconnected from ${similoNamespace.name}`);
    });
});

const lobbyRegExp = /^\/lobby-(.+)$/;
const lobbyNamespaceOf = io.of(lobbyRegExp) as Namespace<
    LobbyClientToServerEvents,
    LobbyServerToClientEvents,
    InterServerEvents,
    SocketData
>;
lobbyNamespaceOf.on('connection', (socket) => {
    const lobbyNamespace = socket.nsp;
    const user: SocketUser = {
        id: socket.handshake.auth.id,
        name: socket.handshake.auth.name,
    };

    const getLobby = () => {
        const match = lobbyRegExp.exec(lobbyNamespace.name);
        const lobbyId = match?.[1];
        const lobby = lobbyStore.getLobby(lobbyId);

        if (lobby == null) {
            socket.emit(
                'error',
                `Лобби #${lobbyId} не найдено`,
                SocketErrorTypeEnum.gameNotFound,
            );
            return null;
        }
        return lobby;
    };

    const onConnect = () => {
        const lobby = getLobby();
        if (lobby == null) {
            return;
        }

        const { needChangeGameState } = lobby.onConnect(user);
        lobbyNamespace.emit('usersChanged', lobby.data.users);
        if (needChangeGameState) {
            lobbyNamespace.emit('gameStateChanged', lobby.data.game.state);
        }
        return;
    };

    const onDisconnect = () => {
        const lobby = getLobby();
        if (lobby == null) {
            return;
        }

        const { needChangeGameState } = lobby.onDisconnect(user);
        lobbyNamespace.emit('usersChanged', lobby.data.users);
        if (needChangeGameState) {
            lobbyNamespace.emit('gameStateChanged', lobby.data.game.state);
        }
    };

    onConnect();

    socket.on('disconnect', () => {
        onDisconnect();
    });

    socket.on('sendMessage', (payload) => {
        const lobby = getLobby();
        if (lobby == null) {
            return;
        }
        const message = lobby.sendMessage(user, payload);
        socket.broadcast.emit('messageSended', message);
    });

    socket.on('addStatistics', (statistic) => {
        const lobby = getLobby();
        if (lobby == null) {
            return;
        }
        lobby.addStatistics(statistic);
        socket.broadcast.emit('statisticsChanged', lobby.data.statistics);
    });

    socket.on('changeGame', (game) => {
        const lobby = getLobby();
        if (lobby == null) {
            return;
        }
        lobby.changeGame(game);
        socket.broadcast.emit('gameChanged', game);
    });

    socket.on('addState', (newState) => {
        const lobby = getLobby();
        if (lobby == null) {
            return;
        }
        const state = lobby.addState(newState);
        socket.broadcast.emit('gameStateChanged', state);
    });

    socket.on('kickUser', (userId: string) => {
        const userSocket = [...socket.nsp.sockets.values()].find(p => p.handshake.auth.id === userId);
        if (userSocket == null) {
            return;
        }
        userSocket.emit('userKicked', userId);
    });

});

const port = 3000;
httpServer.listen(port, () => console.log(`Example app listening on port ${port}!`));
