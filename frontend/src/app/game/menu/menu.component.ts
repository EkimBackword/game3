import {
    Component,
    OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import {
    firstValueFrom,
    lastValueFrom,
} from 'rxjs';
import { GameRouteEnum } from 'src/app/game.routing.enum';
import { SessionQuery } from 'src/app/session/session.query';
import { SessionStore } from 'src/app/session/session.store';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { GamesService } from 'src/app/shared/services/games.service';

import {
    faDice,
    faGamepad,
    faMagnifyingGlass,
    faTrophy,
    IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

    menuList: {
        url?: string;
        callback?: () => void;
        name: string;
        icon: IconDefinition;
        disabled: boolean;
    }[] = [
        {
            url: `/${GameRouteEnum.NewGame}`,
            name: 'Создать стол для Clank',
            icon: faDice,
            disabled: false,
        },
        {
            callback: async () => {
                const userState = this.sessionQuery.getValue();
                const matDialogRef = this.dialogService.openSingleInput({
                    title: 'Создать стол для Similo',
                    label: 'Название:',
                    value: `Similo ${userState.name}`,
                    applyText: 'Создать'
                });
                const result = await lastValueFrom(matDialogRef.afterClosed());
                if (!result) {
                    return;
                }

                const gameId = this.gamesService.addSimiloTable({
                    name: result.value,
                });
                this.router.navigate([GameRouteEnum.Similo, gameId]);
            },
            name: 'Создать стол для Similo',
            icon: faGamepad,
            disabled: false,
        },
        {
            url: `/${GameRouteEnum.FindGame}`,
            name: 'Поиск игры',
            icon: faMagnifyingGlass,
            disabled: false,
        },
        {
            url: `/${GameRouteEnum.Clank}/test`,
            name: 'Тестовая игра',
            icon: faGamepad,
            disabled: false,
        },
        {
            callback: async () => {
                const userState = this.sessionQuery.getValue();
                const matDialogRef = this.dialogService.openSingleInput({
                    title: 'Создать лобби',
                    label: 'Название:',
                    value: `Lobby by ${userState.name}`,
                    applyText: 'Создать'
                });
                const result = await lastValueFrom(matDialogRef.afterClosed());
                if (!result) {
                    return;
                }

                const lobbyId = await firstValueFrom(this.gamesService.addLobby(result.value));
                this.router.navigate([GameRouteEnum.Lobby, lobbyId]);
            },
            name: 'Создать лобби',
            icon: faTrophy,
            disabled: false,
        },
        {
            url: `/${GameRouteEnum.Lobby}/${GameRouteEnum.Search}`,
            name: 'Поиск лобби',
            icon: faMagnifyingGlass,
            disabled: false,
        },
        // {
        //     url: `/${GameRouteEnum.Settings}`,
        //     name: 'Настройки',
        //     icon: faGears,
        //     disabled: true,
        // },
        // {
        //     url: `/${GameRouteEnum.Help}`,
        //     name: 'Помощь',
        //     icon: faInfo,
        //     disabled: false,
        // },
    ];

    constructor(
        private sessionQuery: SessionQuery,
        private sessionStore: SessionStore,
        private dialogService: DialogService,
        private gamesService: GamesService,
        private router: Router,
    ) {}

    ngOnInit(): void {
    }

    async logout() {
        const matDialogRef = this.dialogService.openConfirm({
            textList: ['Вы уверены что хотите выйти?'],
        });
        const result = await lastValueFrom(matDialogRef.afterClosed());
        if (!result) {
            return;
        }
        this.sessionStore.logout();
        this.router.navigateByUrl('/login');
    }
}
