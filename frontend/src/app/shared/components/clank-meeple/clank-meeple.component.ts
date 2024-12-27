import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
} from '@angular/core';

import {
    ClankPlayerConfig,
    GamePlayerColorList,
} from '@shared/clank/clank-player.types';

@Component({
    selector: 'app-clank-meeple',
    templateUrl: './clank-meeple.component.html',
    styleUrls: ['./clank-meeple.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ClankMeepleComponent {

    readonly player = input<ClankPlayerConfig>();
    readonly size = input(100);

    /** Информация о цвете игрока */
    colorInfo = computed(() => {
        const player = this.player();
        if (player == null) {
            return null;
        }
        return GamePlayerColorList[player.colorId];
    });

    /** Стиль отображение мипла */
    meepleStyle = computed<Partial<CSSStyleDeclaration>>(() => {
        const colorInfo = this.colorInfo();
        const size = this.size();
        if (colorInfo == null) {
            return {};
        }
        const positionX = colorInfo.column * size;
        const style: Partial<CSSStyleDeclaration> = {
            width: `${size}px`,
            height: `${size}px`,
            backgroundImage: `url(/assets/images/meeples.png)`,
            backgroundPosition: `-${positionX}px 0px`,
            backgroundSize: '600% 100%',
        };
        return style;
    });

}
