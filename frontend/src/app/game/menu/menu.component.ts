import {
    Component,
    OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import { GameRouteEnum } from 'src/app/game.routing.enum';
import { SessionQuery } from 'src/app/session/session.query';
import { SessionStore } from 'src/app/session/session.store';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { GamesService } from 'src/app/shared/services/games.service';

import {
    faDice,
    faGamepad,
    faGears,
    faInfo,
    faMagnifyingGlass,
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
            callback: () => {
                const userState = this.sessionQuery.getValue();
                const gameId = this.gamesService.addSimiloTable({
                    name: `Similo ${userState.name}`,
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
            url: `/${GameRouteEnum.Settings}`,
            name: 'Настройки',
            icon: faGears,
            disabled: true,
        },
        {
            url: `/${GameRouteEnum.Help}`,
            name: 'Помощь',
            icon: faInfo,
            disabled: false,
        },
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
        const matDialogRef =  this.dialogService.openConfirm({
            textList: ['Вы уверены что хотите выйти?'],
        });
        const result = await matDialogRef.afterClosed().toPromise();
        if (!result) {
            return;
        }
        this.sessionStore.logout();
        this.router.navigateByUrl('/login');
    }
}
