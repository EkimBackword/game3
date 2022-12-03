import {
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';

import { Subject } from 'rxjs';

import { SessionQuery } from './session/session.query';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

    title = 'frontend';
    isLoading$ = this.sessionQuery.selectLoading();

    private ngUnsubscribe = new Subject<void>();

    constructor(
        private sessionQuery: SessionQuery,
    ) {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
