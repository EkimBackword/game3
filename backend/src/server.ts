import express, {
    Request,
    Response,
} from 'express';
import * as http from 'http';
import { Server } from 'socket.io';

import { initDragonInfo } from '../../shared/clank/clank-dragon.types';
import {
    GameInfoState,
    GameInfoStatusIdEnum,
} from '../../shared/clank/clank-game.types';
import { ClankDlcEnum } from '../../shared/clank/clank-info.types';
import {
    ClankPlayerConfig,
    GamePlayerColorIds,
} from '../../shared/clank/clank-player.types';
import {
    ClientToServerEvents,
    InterServerEvents,
    ServerToClientEvents,
    SocketData,
    SocketErrorTypeEnum,
    SocketUser,
} from '../../shared/socket.types';

const app = express();
const httpServer = http.createServer(app);

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

const gamesList = new Map<string, GameInfoState>();
const testGame: GameInfoState = {
    id: 'test',
    name: 'Test',
    statusId: 2,
    mapId: 0,
    mapDlcId: ClankDlcEnum.clank,
    dungeonDeckIds: [ClankDlcEnum.clank],
    startDeckId: ClankDlcEnum.clank,
    dungeonDeck: [],
    dungeonRow: [],
    reserveRow: [],
    mapTokens: [],
    marketTokens: [],
    artifacts: [],
    players: [],
    dragonInfo: initDragonInfo(),
    actionLogs: [],
    turnIndex: 0,
    activePlayerIndex: 0,
    activePlayerId: '',
};
gamesList.set(testGame.id, testGame);

io.on('connection', (socket) => {

    socket.on('disconnect', () => {
    });

    socket.on('addGame', (game) => {
        if (gamesList.has(game.id)) {
            return;
        }
        gamesList.set(game.id, game);
        socket.broadcast.emit('gameListChanged', [...gamesList.values()]);
    });

    socket.emit('gameListChanged', [...gamesList.values()]);
});

const gameRegExp = /^\/clank-(.+)$/;
io.of(gameRegExp).on('connection', (socket) => {
    const clankNamespace = socket.nsp;
    const user: SocketUser = {
        id: socket.handshake.auth.id,
        name: socket.handshake.auth.name,
    };

    const getGameInfo = () => {
        const match = gameRegExp.exec(clankNamespace.name);
        const gameId = match?.[1];
        const gameInfo = gameId ? gamesList.get(gameId) : null;

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
        gamesList.set(state.id, state);
        socket.broadcast.emit('gameUpdated', state);
    });

    socket.on('disconnect', () => {
        onDisconnect();
        console.log(`${user?.name} disconnected from ${clankNamespace.name}`);
    });
});

const port = 3000;
httpServer.listen(port, () => console.log(`Example app listening on port ${port}!`));
