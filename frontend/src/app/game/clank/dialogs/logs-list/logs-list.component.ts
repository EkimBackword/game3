import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
} from '@angular/material/dialog';

import { cloneDeep } from 'lodash';
import { GameInfoActionLogGroup } from 'src/app/shared/models/game.types';

import { GameInfoActionLogTypeList } from '@shared/clank/clank-game.types';

@Component({
    selector: 'app-logs-list',
    templateUrl: './logs-list.component.html',
    styleUrls: ['./logs-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class LogsListComponent implements OnInit {

    list = GameInfoActionLogTypeList.map(type => ({
        type,
        value: true,
    }));
    groups: GameInfoActionLogGroup[] = [];
    searchString = '';

    constructor(
        public changeDetectorRef: ChangeDetectorRef,
        public dialogRef: MatDialogRef<LogsListComponent, void>,
        @Inject(MAT_DIALOG_DATA) public data: {
            groups: GameInfoActionLogGroup[],
        },
    ) { }

    ngOnInit(): void {
        this.filterGroups();
    }

    filterGroups() {
        const searchString = this.searchString.toLowerCase();
        this.groups = cloneDeep(this.data.groups).map(group => {
            return {
                ...group,
                list: group.list.filter(log => {
                    const filterByType = this.list.some(p => p.type === log.type && p.value);
                    const filterByText = this.searchString.length < 0
                        || log.data.text.toLowerCase().includes(searchString)
                        || log.data.subtext?.toLowerCase()?.includes(searchString);
                    return filterByType && filterByText;
                }),
            };
        }).filter(group => group.list.length > 0);
        this.changeDetectorRef.detectChanges();
    }

}
