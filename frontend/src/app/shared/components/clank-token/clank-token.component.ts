import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
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
})
export class ClankTokenComponent implements OnInit, OnChanges {

    @Input() isOpen = false;
    @Input() token!: ClankTokenConfig;
    @Input() size = 150;

    style: Partial<CSSStyleDeclaration> = {};

    ClankTokenTypeEnum = ClankTokenTypeEnum;
    ClankTokenSecretTypeEnum = ClankTokenSecretTypeEnum;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
        this.style = this.getStyle();
        this.changeDetectorRef.detectChanges();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.token || changes.size) {
            this.style = this.getStyle();
        }
        this.changeDetectorRef.detectChanges();
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
            case ClankElementByGame.minor_secret: {
                return this.size * 0.8;
            }
            default: {
                return this.size;
            }
        }
    }

}
