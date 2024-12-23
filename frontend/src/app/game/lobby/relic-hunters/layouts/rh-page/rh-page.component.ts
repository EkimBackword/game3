import {
    ChangeDetectionStrategy,
    Component,
} from '@angular/core';

@Component({
    selector: 'app-rh-page',
    templateUrl: './rh-page.component.html',
    styleUrls: ['./rh-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class RhPageComponent {

    constructor(
    ) {
    }

}
