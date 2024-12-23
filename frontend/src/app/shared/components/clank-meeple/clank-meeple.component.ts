import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';

import {
    ClankPlayerConfig,
    GamePlayerColorInfo,
    GamePlayerColorList,
} from '@shared/clank/clank-player.types';

@Component({
    selector: 'app-clank-meeple',
    templateUrl: './clank-meeple.component.html',
    styleUrls: ['./clank-meeple.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ClankMeepleComponent implements OnInit, OnChanges {

    @Input() player: ClankPlayerConfig | undefined;
    @Input() size = 100;

    /** Информация о цвете игрока */
    colorInfo: GamePlayerColorInfo | null = null;

    /** Стиль отображение мипла */
    meepleStyle: Partial<CSSStyleDeclaration> = {};

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
        this.colorInfo = this.getColorInfo();
        this.meepleStyle = this.getMeepleStyle();
        this.changeDetectorRef.detectChanges();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.player) {
            this.colorInfo = this.getColorInfo();
        }
        if (changes.player || changes.size) {
            this.meepleStyle = this.getMeepleStyle();
        }
        this.changeDetectorRef.detectChanges();
    }

    private getColorInfo() {
        if (this.player == null) {
            return null;
        }
        return GamePlayerColorList[this.player.colorId];

    }

    private getMeepleStyle() {
        if (this.colorInfo == null) {
            return {};
        }
        const positionX = this.colorInfo.column * this.size;
        const style: Partial<CSSStyleDeclaration> = {
            width: `${this.size}px`,
            height: `${this.size}px`,
            backgroundImage: `url(/assets/images/meeples.png)`,
            backgroundPosition: `-${positionX}px 0px`,
            backgroundSize: '600% 100%',
        };
        return style;
    }

}
