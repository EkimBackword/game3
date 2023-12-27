import {
    Injectable,
    OnDestroy,
    signal,
} from '@angular/core';
import { Router } from '@angular/router';

import { SessionQuery } from 'src/app/session/session.query';
import {
    LobbySocket,
    SocketService,
} from 'src/app/shared/services/socket.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Injectable()
export class LobbyService implements OnDestroy {

    private lobbyIdSignal = signal('');

    readonly lobbyId = this.lobbyIdSignal.asReadonly();

    private socket: LobbySocket | undefined;

    constructor(
        private toastService: ToastService,
        private socketService: SocketService,
        private sessionQuery: SessionQuery,
        private router: Router,
    ) { }

    ngOnDestroy() {
        this.socket?.disconnect()
    }

    init(lobbyId: string) {
        if (this.lobbyIdSignal() === lobbyId) {
            return;
        }

        this.lobbyIdSignal.set(lobbyId);
        this.socket = this.socketService.getLobbySocket(lobbyId);

        this.socket.on('connect', () => {
            this.toastService.showSuccess('Успешное подключение к игре');
        });

        this.socket.on('disconnect', (reason) => {
            if (reason !== 'io client disconnect') {
                this.socket?.connect();
            } else {
                this.toastService.showWarn('Разрыв соединения');
                this.socket?.removeAllListeners();
                this.socket = void 0;
                this.lobbyIdSignal.set('');
            }
        });

        this.socket.on('userKicked', (userId) => {
            if (userId !== this.sessionQuery.id) {
                return;
            }
            this.router.navigate(['/']);
        });

        setTimeout(() => {
            if (this.socket?.disconnected) {
                this.socket.connect();
            }
        }, 500);
    }

}
