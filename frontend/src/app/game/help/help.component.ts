import {
    Component,
    OnInit,
} from '@angular/core';
import {
    DomSanitizer,
    SafeUrl,
} from '@angular/platform-browser';
import { Router } from '@angular/router';

import { ClankDlcEnum } from '@shared/clank/clank-info.types';

interface RulebookInfo {
    id: ClankDlcEnum;
    name: string;
    url: string;
}

@Component({
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {

    rulebooks: RulebookInfo[] = [
        {
            id: ClankDlcEnum.clank,
            name: 'Кланк! Подземное приключение',
            url: '/assets/images/pdf/clank_rulebook.PDF',
        },
        {
            id: ClankDlcEnum.clank_proklyatie_mumii,
            name: 'Кланк! Проклятие мумии',
            url: '/assets/images/pdf/clank_proklyatie_mumii_rulebook.PDF',
        },
    ];
    id: ClankDlcEnum | null = null;
    url: SafeUrl | null = null;

    constructor(
        private sanitizer: DomSanitizer,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.setUrl(this.rulebooks[0]);
    }

    setUrl(rulebook: RulebookInfo) {
        this.id = rulebook.id;
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(rulebook.url);
    }

    exit() {
        this.router.navigate(['/']);
    }

}
