import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnChanges,
  SimpleChanges,
  input
} from '@angular/core';

import { EscapeFromAtlantisTileDisplayInfo } from './escape-from-atlantis-tile';

@Component({
    selector: 'app-escape-from-atlantis-tile',
    templateUrl: './escape-from-atlantis-tile.component.html',
    styleUrls: ['./escape-from-atlantis-tile.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class EscapeFromAtlantisTileComponent implements OnChanges {

    readonly tile = input.required<EscapeFromAtlantisTileDisplayInfo>();

    @HostBinding('style') style: Partial<CSSStyleDeclaration> = {};

    ngOnChanges(changes: SimpleChanges): void {
        this.style = this.tile().style();
    }

}
