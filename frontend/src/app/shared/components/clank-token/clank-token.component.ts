import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
} from '@angular/core';

import { ClankElementByGame } from '@shared/clank/clank-info.types';
import {
    ClankTokenConfig,
    ClankTokenSecretTypeEnum,
    ClankTokenTypeEnum,
} from '@shared/clank/clank-token.types';

import { ClankElementTypeMap } from '../../models/clank-element-types';

@Component({
    selector: 'app-clank-token',
    templateUrl: './clank-token.component.html',
    styleUrls: ['./clank-token.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ClankTokenComponent {

    readonly isOpen = input(false);
    readonly token = input.required<ClankTokenConfig>();
    readonly size = input(150);

    tokenSize = computed(() => {
        const token = this.token();
        if (token == null) {
            return 0;
        }
        switch (token.element_type) {
            case ClankElementByGame.minor_secret: {
                return this.size() * 0.8;
            }
            default: {
                return this.size();
            }
        }
    });

    style = computed<Partial<CSSStyleDeclaration>>(() => {
        const token = this.token();
        const isOpen = this.isOpen();
        const size = this.tokenSize();
        if (token == null) {
            return {};
        }
        const url = !isOpen && token.type === ClankTokenTypeEnum.secret
            ? ClankElementTypeMap[token.element_type].url
            : token.url;
        const style: Partial<CSSStyleDeclaration> = {
            borderRadius: token.isSquare
                ? '10px'
                : '50%',
            width: `${size}px`,
            height: `${size}px`,
            backgroundImage: `url(${url})`,
            backgroundSize: `${size}px ${size}px`,
        };
        return style;
    });

    ClankTokenTypeEnum = ClankTokenTypeEnum;
    ClankTokenSecretTypeEnum = ClankTokenSecretTypeEnum;

}
