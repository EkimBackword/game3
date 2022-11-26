import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';

import { ClankElementType } from '@shared/clank/clank-info.types';
import {
    ClankTokenConfig,
    ClankTokenSecretTypeEnum,
    ClankTokenState,
    ClankTokenTypeEnum,
} from '@shared/clank/clank-token.types';

import { ClankElementTypeMap } from '../../models/clank-element-types';
import { TokensService } from '../../services/tokens.service';

@Component({
    selector: 'app-clank-token',
    templateUrl: './clank-token.component.html',
    styleUrls: ['./clank-token.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClankTokenComponent implements OnInit, OnChanges {

    @Input() isOpen = false;
    @Input() state!: ClankTokenState;
    @Input() size = 150;

    token: ClankTokenConfig | undefined;
    style: Partial<CSSStyleDeclaration> = {};

    ClankTokenTypeEnum = ClankTokenTypeEnum;
    ClankTokenSecretTypeEnum = ClankTokenSecretTypeEnum;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private tokensService: TokensService,
    ) { }

    ngOnInit(): void {
        this.token = this.getTokenInfo();
        this.style = this.getStyle();
        this.changeDetectorRef.detectChanges();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.card) {
            this.token = this.getTokenInfo();
        }
        if (changes.card || changes.width || changes.height) {
            this.style = this.getStyle();
        }
        this.changeDetectorRef.detectChanges();
    }

    private getTokenInfo() {
        if (this.state == null) {
            return void 0;
        }
        const [find_string] = this.state.id.split('__');
        return this.tokensService.store.find(p => p.find_string === find_string);
    }

    private getStyle() {
        if (this.token == null) {
            return {};
        }
        const url = !this.isOpen && this.token.type === ClankTokenTypeEnum.secret
            ? ClankElementTypeMap[this.token.element_type].url
            : this.token.url;
        const size = this.getSize();
        const style: Partial<CSSStyleDeclaration> = {
            borderRadius: this.token.isSquare
                ? '10px'
                : '50%',
            width: `${size}px`,
            height: `${size}px`,
            backgroundImage: `url(${url})`,
            backgroundSize: `${size}px ${size}px`,
        };
        return style;
    }

    private getSize() {
        if (this.token == null) {
            return 0;
        }
        switch (this.token.element_type) {
            case ClankElementType.minor_secret: {
                return this.size * 0.8;
            }
            default: {
                return this.size;
            }
        }
    }

}
