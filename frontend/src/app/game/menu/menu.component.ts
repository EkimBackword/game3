import {
    Component,
    OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import { SessionStore } from 'src/app/session/session.store';
import { ToastService } from 'src/app/shared/services/toast.service';

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
            url: '/clank/test',
            name: 'Test',
            icon: faDice,
        },
        {
            url: '/new-game',
            name: 'New game',
            icon: faDice,
        },
        {
            url: '/find-game',
            name: 'Find game',
            icon: faMagnifyingGlass,
        },
        {
            url: '/join-game',
            name: 'Join game',
            icon: faGamepad,
        },
        {
            url: '/settings',
            name: 'Settings',
            icon: faGears,
        },
        {
            url: '/help',
            name: 'Help',
            icon: faInfo,
        },
    ];

    constructor(
        private sessionStore: SessionStore,
        private toastService: ToastService,
        private router: Router,
    ) {}

    ngOnInit(): void {
    }

    async logout() {
        const result = await this.toastService.showConfirm('Вы уверены что хотите выйти?').toPromise();
        if (!result) {
            return;
        }
        this.sessionStore.logout();
        this.router.navigateByUrl('/login');
    }
}
