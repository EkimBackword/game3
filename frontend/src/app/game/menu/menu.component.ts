import {
    Component,
    OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { SessionStore } from 'src/app/session/session.store';
import { ConfirmModalComponent } from 'src/app/shared/modals/confirm-modal/confirm-modal.component';

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
        private matDialog: MatDialog,
        private router: Router,
    ) {}

    ngOnInit(): void {
    }

    async logout() {
        const matDialogRef =  this.matDialog.open<ConfirmModalComponent, ConfirmModalComponent['data']>(
            ConfirmModalComponent,
            {
                data: {
                    textList: ['Вы уверены что хотите выйти?'],
                },
            },
        );
        const result = await matDialogRef.afterClosed().toPromise();
        if (!result) {
            return;
        }
        this.sessionStore.logout();
        this.router.navigateByUrl('/login');
    }
}
