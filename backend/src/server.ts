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
import {
    SimiloGameInfoState,
    SimiloPlayerConfig,
} from '../../shared/similo/similo-game.types';
import {
    ClankClientToServerEvents,
    ClankServerToClientEvents,
    ClientToServerEvents,
    InterServerEvents,
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

const clankGames = new GamesInfo();
const similoTables = new SimiloTablesInfo();

io.on('connection', (socket) => {

    socket.on('disconnect', () => {
    });

    socket.on('addGame', (game) => {
        if (clankGames.hasStateById(game.id)) {
            return;
        }
        clankGames.addState(game);
        socket.broadcast.emit('gameListChanged', clankGames.getList());
    });

    socket.emit('gameListChanged', clankGames.getList());

    socket.on('addSimiloTable', (game) => {
        if (clankGames.hasStateById(game.id)) {
            return;
        }
        similoTables.addState(game);
        socket.broadcast.emit('similoTablesChanged', similoTables.getList());
    });

    socket.emit('similoTablesChanged', similoTables.getList());
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

const port = 3000;
httpServer.listen(port, () => console.log(`Example app listening on port ${port}!`));
