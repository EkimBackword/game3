import {
    Component,
    OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import { GameRouteEnum } from 'src/app/game.routing.enum';
import { SessionStore } from 'src/app/session/session.store';
import { DialogService } from 'src/app/shared/services/dialog.service';

import {
    faDice,
    faGamepad,
    faGears,
    faInfo,
    faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

    menuList = [
        {
            url: `/${GameRouteEnum.NewGame}`,
            name: 'Создать игру',
            icon: faDice,
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
        private sessionStore: SessionStore,
        private dialogService: DialogService,
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
