import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
} from '@angular/material/dialog';

import { ClankDragonInfo } from '@shared/clank/clank-dragon.types';
import {
    ClankMapDragonInfo,
    ClankMapDragonTrackItem,
} from '@shared/clank/clank-map.types';
import {
    ClankPlayerConfig,
    GamePlayerColorIdEnum,
    GamePlayerColorInfo,
    GamePlayerColorList,
} from '@shared/clank/clank-player.types';

interface DragonInfoLogClankPlayer {
    /** Имя пользователя */
    name: string;
    /** Id цвета игрока */
    colorId: GamePlayerColorIdEnum;
    /** Информация о цвете */
    colorInfo: GamePlayerColorInfo;
    /** Количесто кланков в мешке */
    clankInBag: number;
    /** Сколько кланков отправлялось в мешок */
    clankToBagTotalCount: number;
    /** Сколько кланков в области CLANK */
    clankAria: number;
}

@Component({
    selector: 'app-dragon-info-log',
    templateUrl: './dragon-info-log.component.html',
    styleUrls: ['./dragon-info-log.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragonInfoLogComponent implements OnInit, OnDestroy {

    players: DragonInfoLogClankPlayer[] = [];
    dragonInfo: DragonInfoLogClankPlayer | null = null;
    dragonPosition: ClankMapDragonTrackItem | undefined;
    showClankInBag = false;

    constructor(
        public changeDetectorRef: ChangeDetectorRef,
        public dialogRef: MatDialogRef<DragonInfoLogComponent, void>,
        @Inject(MAT_DIALOG_DATA) public data: {
            mapDragonInfo: ClankMapDragonInfo,
            dragonInfo: ClankDragonInfo,
            players: ClankPlayerConfig[],
        },
    ) {
    }

    ngOnInit(): void {
        this.players = this.data.players.map((player) => {
            return {
                name: player.name,
                colorId: player.colorId,
                colorInfo: GamePlayerColorList[player.colorId],
                clankInBag: this.data.dragonInfo.clankBag.filter(colorId => colorId === player.colorId).length,
                clankToBagTotalCount: this.data.dragonInfo.clankToBagTotalCount[player.colorId],
                clankAria: this.data.dragonInfo.clankAria[player.colorId],
            };
        });
        const dragonColorId = GamePlayerColorIdEnum.Black;
        this.dragonInfo = {
            name: 'Дракон',
            colorId: dragonColorId,
            colorInfo: GamePlayerColorList[dragonColorId],
            clankInBag: this.data.dragonInfo.clankBag.filter(colorId => colorId === dragonColorId).length,
            clankToBagTotalCount: 0,
            clankAria: 0,
        };
        this.dragonPosition = this.data?.mapDragonInfo.track.find(p => p.rage === this.data.dragonInfo.rage);
        window['showClankInBag'] = (value: boolean) => {
            this.showClankInBag = value;
            this.changeDetectorRef.detectChanges();
        };
    }

    ngOnDestroy(): void {
        delete window['showClankInBag'];
    }

}
