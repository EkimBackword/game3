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
import { GameActionsUndo } from '../../shared/game/game-actions';
import { GamePlayerId } from '../../shared/game/game-constants';
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
import { LobbyGameChangeOptions } from '../../shared/lobby/lobby-game';
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
            game: {
                id: null,
                setupData: null,
                players: {},
                state: null,
                log: [],
            },
            statistics: [],
        };
    }

    onConnect(user: SocketUser) {
        if (this.data.users.some(p => p.id === user.id)) {
            console.log(`Has user ${user.name}`);
            return {
                gameChanged: false,
            };
        }

        this.data.users.push(user);
        console.log(`Add user ${user.name}`);
        if (this.data.game.players[user.id] == null) {
            return {
                gameChanged: false,
            };
        }

        this.data.game.players[user.id] = {
            ...this.data.game.players[user.id],
            online: true,
        };
        return {
            gameChanged: true,
        };
    }

    onDisconnect(user: SocketUser) {
        this.data.users = this.data.users.filter(p => p.id !== user.id);
        if (this.data.game.players[user.id] == null) {
            return {
                gameChanged: false,
            };
        }

        this.data.game.players[user.id] = {
            ...this.data.game.players[user.id],
            online: false,
        };

        return {
            gameChanged: true,
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

    startGame(state: GameState) {
        this.data.game = {
            ...this.data.game,
            state: state,
            log: [],
        };
        this.history.clear();
        this.history.set(state.stateId, state);
        this.data.statusId = LobbyStatusIdEnum.Game;
    }

    finishGame() {
        this.data.statusId = LobbyStatusIdEnum.Lobby;
    }

    changeGame(game: LobbyGameChangeOptions) {
        this.data.game = {
            ...this.data.game,
            id: game.id,
            setupData: game.setupData,
            players: {},
        };
    }

    changeSetupData(setupData) {
        this.data.game = {
            ...this.data.game,
            setupData,
        };
    }

    joinToGame(user: SocketUser) {
        this.data.game = {
            ...this.data.game,
            players: {
                ...this.data.game.players,
                [user.id]: {
                    ...user,
                    online: true,
                }
            }
        };
    }

    leaveFromGame(userId: string) {
        if (this.data.game.players[userId] != null) {
            delete this.data.game.players[userId];
        }
    }

    addState(state: GameState) {
        this.data.game.state = state;
        this.data.game.log = [
            ...this.data.game.log,
            ...state.log,
        ];
        this.history.set(state.stateId, state);
    }

    undoState(playerId: GamePlayerId, createdAt: string) {
        const currentState = this.data.game.state;
        if (currentState.prevStateId == null
            || !this.history.has(currentState.prevStateId)) {
            return false;
        }
        const oldState = this.history.get(currentState.prevStateId);
        const stateId = currentState.stateId + 1;

        const state: GameState = {
            ...oldState,
            log: [
                {
                    stateId,
                    action: GameActionsUndo(playerId),
                    turn: this.data.game.state.context.turn,
                    phase: this.data.game.state.context.phase,
                    automatic: true,
                    createdAt,
                }
            ],
            stateId: stateId,
        };
        this.addState(state);
        return true;
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

    const totalNamespace = socket.nsp;

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
        totalNamespace.emit('gameListChanged', clankGames.getList());
    });

    socket.emit('gameListChanged', clankGames.getList());

    socket.on('addSimiloTable', (game) => {
        if (similoTables.hasStateById(game.id)) {
            return;
        }
        similoTables.addState(game);
        totalNamespace.emit('similoTablesChanged', similoTables.getList());
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
        totalNamespace.emit('lobbyStoreChanged', lobbyStore.getLobbyList());
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

        const result = lobby.onConnect(user);
        socket.broadcast.emit('usersChanged', lobby.data.users);
        if (result.gameChanged) {
            socket.broadcast.emit('gameChanged', lobby.data.game);
        }
        socket.emit('connectToLobby', lobby.data);
    };

    const onDisconnect = () => {
        const lobby = getLobby();
        if (lobby == null) {
            return;
        }

        const result = lobby.onDisconnect(user);
        socket.broadcast.emit('usersChanged', lobby.data.users);
        if (result.gameChanged) {
            socket.broadcast.emit('gameChanged', lobby.data.game);
        }
    };

    onConnect();

    socket.on('disconnect', () => {
        onDisconnect();
    });

    socket.on('addStatistics', (statistic) => {
        const lobby = getLobby();
        if (lobby == null) {
            return;
        }
        lobby.addStatistics(statistic);
        lobbyNamespace.emit('statisticsChanged', lobby.data.statistics);
    });

    socket.on('sendMessage', (payload) => {
        const lobby = getLobby();
        if (lobby == null) {
            return;
        }
        const message = lobby.sendMessage(user, payload);
        lobbyNamespace.emit('messageSended', message);
    });

    socket.on('startGame', (state) => {
        const lobby = getLobby();
        if (lobby == null) {
            return;
        }
        lobby.startGame(state);
        lobbyNamespace.emit('gameChanged', lobby.data.game);
        lobbyNamespace.emit('statusChanged', lobby.data.statusId);
        io.emit('lobbyStoreChanged', lobbyStore.getLobbyList());
    });

    socket.on('finishGame', () => {
        const lobby = getLobby();
        if (lobby == null) {
            return;
        }
        lobby.finishGame();
        lobbyNamespace.emit('gameChanged', lobby.data.game);
        lobbyNamespace.emit('statusChanged', lobby.data.statusId);
        io.emit('lobbyStoreChanged', lobbyStore.getLobbyList());
    });

    socket.on('changeGame', (game) => {
        const lobby = getLobby();
        if (lobby == null) {
            return;
        }
        lobby.changeGame(game);
        lobbyNamespace.emit('gameChanged', lobby.data.game);
        io.emit('lobbyStoreChanged', lobbyStore.getLobbyList());
    });

    socket.on('changeSetupData', (setupData) => {
        const lobby = getLobby();
        if (lobby == null) {
            return;
        }
        lobby.changeSetupData(setupData);
        lobbyNamespace.emit('gameChanged', lobby.data.game);
        io.emit('lobbyStoreChanged', lobbyStore.getLobbyList());
    });

    socket.on('joinToGame', (setupData) => {
        const lobby = getLobby();
        if (lobby == null) {
            return;
        }
        lobby.joinToGame(user);
        if (setupData != null) {
            lobby.changeSetupData(setupData);
        }
        lobbyNamespace.emit('gameChanged', lobby.data.game);
        io.emit('lobbyStoreChanged', lobbyStore.getLobbyList());
    });

    socket.on('leaveFromGame', (setupData) => {
        const lobby = getLobby();
        if (lobby == null) {
            return;
        }
        lobby.leaveFromGame(user.id);
        if (setupData != null) {
            lobby.changeSetupData(setupData);
        }
        lobbyNamespace.emit('gameChanged', lobby.data.game);
        io.emit('lobbyStoreChanged', lobbyStore.getLobbyList());
    });

    socket.on('addState', (newState) => {
        const lobby = getLobby();
        if (lobby == null) {
            return;
        }
        lobby.addState(newState);
        lobbyNamespace.emit('gameChanged', lobby.data.game);
    });

    socket.on('undoState', (createdAt) => {
        const lobby = getLobby();
        if (lobby == null) {
            return;
        }
        const success = lobby.undoState(user.id, createdAt);
        if (!success) {
            return null;
        }
        lobbyNamespace.emit('gameChanged', lobby.data.game);
    });

    socket.on('kickUser', (userId: string, setupData) => {
        const lobby = getLobby();
        if (lobby == null) {
            return;
        }

        lobby.leaveFromGame(user.id);
        if (setupData != null) {
            lobby.changeSetupData(setupData);
        }
        lobbyNamespace.emit('gameChanged', lobby.data.game);
        io.emit('lobbyStoreChanged', lobbyStore.getLobbyList());

        const userSocket = [...socket.nsp.sockets.values()].find(p => p.handshake.auth.id === userId);
        if (userSocket == null) {
            return;
        }
        userSocket.emit('userKicked', userId);
    });

});

const port = 3000;
httpServer.listen(port, () => console.log(`Example app listening on port ${port}!`));
