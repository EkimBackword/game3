import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';

import { EscapeFromAtlantisCellDisplayInfo } from './escape-from-atlantis-cell';

@Component({
    selector: 'app-escape-from-atlantis-cell',
    templateUrl: './escape-from-atlantis-cell.component.html',
    styleUrls: ['./escape-from-atlantis-cell.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class EscapeFromAtlantisCellComponent implements OnChanges {

    @Input({ required: true }) cell!: EscapeFromAtlantisCellDisplayInfo;

    @HostBinding('style') style: Partial<CSSStyleDeclaration> = {};
    @HostBinding('class') className = 'default';

    ngOnChanges(changes: SimpleChanges): void {
        this.style = this.cell.style();
        this.className = this.cell.className();
    }

}
