import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
} from '@angular/material/dialog';

import { GameState } from '@shared/game/game-state';

import { LobbyService } from '../../../services/lobby.service';
import { RelicHuntersGameType } from '../../models/game-type';
import {
    RelicHuntersHeroColorInfo,
    RelicHuntersHeroColorTaxonomy,
    RelicHuntersHeroSettings,
} from '../../models/hero';
import { RelicHuntersPlayer } from '../../models/player';

@Component({
    selector: 'app-rh-winner-dialog',
    templateUrl: './rh-winner-dialog.component.html',
    styleUrls: ['./rh-winner-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class RhWinnerDialogComponent implements OnInit {

    winner: RelicHuntersPlayer | null = null;
    colorInfo: RelicHuntersHeroColorInfo | null = null;
    heroStyle: Partial<CSSStyleDeclaration> = {}

    constructor(
        public dialogRef: MatDialogRef<RhWinnerDialogComponent>,
        private lobbyService: LobbyService,
        @Inject(MAT_DIALOG_DATA) public data: {
            state: GameState<RelicHuntersGameType>;
        },
    ) {
    }

    ngOnInit(): void {
        this.winner = this.data.state.game.winner;
        if (this.winner == null) {
            return;
        }
        const colorId = this.winner.color;
        this.colorInfo = RelicHuntersHeroColorTaxonomy[colorId];
        const heroSize = RelicHuntersHeroSettings.sizeMeeple;
        const positionHeroX = this.colorInfo.column * heroSize;
        const positionHeroY = RelicHuntersHeroSettings.heroIndex * heroSize;
        this.heroStyle = {
            width: `${heroSize}px`,
            height: `${heroSize}px`,
            backgroundImage: `url(${RelicHuntersHeroSettings.url})`,
            backgroundPosition: `-${positionHeroX}px -${positionHeroY}px`,
            backgroundSize: RelicHuntersHeroSettings.backgroundSize,
            flexShrink: '0',
        };
    }

    finishGame() {
        this.lobbyService.finishGame();
        this.dialogRef.close();
    }

}
