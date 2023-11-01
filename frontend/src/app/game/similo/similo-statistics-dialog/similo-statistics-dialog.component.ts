import {
    ChangeDetectionStrategy,
    Component,
    Inject,
} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
} from '@angular/material/dialog';

import * as lodash from 'lodash';

import { GameInfoStatus } from '@shared/clank/clank-game.types';
import { SimiloGameInfoStatistics } from '@shared/similo/similo-game.types';

import { SimiloDlcDeckList } from '../models/similo-dlc';

interface SimiloStatisticsDialogItem {
    index: number;
    masterName: string;
    status: string;
    winState: string;
    mainDlcName: string;
    helpDlcName: string;
    turnIndex: number;
}

interface SimiloStatisticsWinInfo {
    count: number;
    countByMaster: Record<string, number>;
    maxInfo: {
        count: number;
        name: string;
    };
}

const columnsNames: Record<keyof SimiloStatisticsDialogItem, string> = {
    index: '№',
    masterName: 'Очевидец',
    status: 'Состояние',
    winState: 'Статус',
    mainDlcName: 'Колода персонажей',
    helpDlcName: 'Колода подсказок',
    turnIndex: 'Количество ходов',
};

@Component({
    selector: 'app-similo-statistics-dialog',
    templateUrl: './similo-statistics-dialog.component.html',
    styleUrls: ['./similo-statistics-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimiloStatisticsDialogComponent {

    winInfo = this.getEmptyInfo();
    loseInfo = this.getEmptyInfo();
    dataSource: SimiloStatisticsDialogItem[] = [];
    displayedColumns = Object.keys(columnsNames);
    columnsNames = columnsNames;

    constructor(
        public dialogRef: MatDialogRef<SimiloStatisticsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SimiloGameInfoStatistics[],
    ) {
        this.winInfo = this.getEmptyInfo();
        this.loseInfo = this.getEmptyInfo();
        this.dataSource = data.map((stats, index) => {
            this.addStatsInfo(stats);
            const item: SimiloStatisticsDialogItem = {
                index: index + 1,
                masterName: stats.masterName,
                status: GameInfoStatus[stats.statusId].name,
                winState: stats.isWin ? 'Победа' : 'Поражение',
                mainDlcName: SimiloDlcDeckList.find(p => p.dlc_name === stats.mainDlc)?.name ?? 'Not found',
                helpDlcName: SimiloDlcDeckList.find(p => p.dlc_name === stats.helpDlc)?.name ?? 'Not found',
                turnIndex: stats.turnIndex,
            };
            return item;
        });
        this.updateMaxInfo(this.winInfo);
        this.updateMaxInfo(this.loseInfo);
    }

    private getEmptyInfo() {
        const info: SimiloStatisticsWinInfo = {
            count: 0,
            countByMaster: {},
            maxInfo: {
                count: 0,
                name: '',
            },
        };
        return info;
    }

    private addStatsInfo(stats: SimiloGameInfoStatistics) {
        const info = stats.isWin
            ? this.winInfo
            : this.loseInfo
        if (info.countByMaster[stats.masterName] == null) {
            info.countByMaster[stats.masterName] = 0;
        }
        info.count++;
        info.countByMaster[stats.masterName]++;
    }

    private updateMaxInfo(info: SimiloStatisticsWinInfo) {
        const list = Object.entries(info.countByMaster).map(([name, count]) => {
            return {
                name,
                count,
            };
        });
        const max = lodash.maxBy(list, (p) => p.count);
        const filteredList = list.filter(p => p.count === max?.count);
        info.maxInfo = {
            count: max?.count ?? 0,
            name: filteredList.map(p => p.name).join(', '),
        }
    }

}
