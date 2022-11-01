import {
    Component,
    OnInit,
} from '@angular/core';
import {
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { LoginFormFields } from '../session.model';
import { SessionQuery } from '../session.query';
import { SessionStore } from '../session.store';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

    formFields: LoginFormFields = {
        login: new FormControl('', Validators.required),
    };
    form = new FormGroup(this.formFields);

    constructor(
        private sessionStore: SessionStore,
        private sessionQuery: SessionQuery,
        private router: Router,
    ) { }

    ngOnInit(): void {
    }

    login() {
        if (this.form.invalid) {
            console.warn(this.form.errors);
            return;
        }
        this.sessionStore.login(this.form.value);
        this.router.navigateByUrl(this.sessionQuery.redirectUrl ?? '');
    }

}
