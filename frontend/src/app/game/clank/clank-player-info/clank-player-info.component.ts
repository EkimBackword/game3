import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    OnInit,
} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';

import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfirmModalComponent } from 'src/app/shared/modals/confirm-modal/confirm-modal.component';
import { updateBenefitInfoByAction } from 'src/app/shared/models/actions.types';
import { updateBenefitInfo } from 'src/app/shared/models/players/player.types';
import { CardsService } from 'src/app/shared/services/cards.service';

import { ClankCardState } from '@shared/clank/clank-card.types';
import { ClankCostInfo } from '@shared/clank/clank-info.types';
import { ClankPlayerConfig } from '@shared/clank/clank-player.types';

import { ClankDungeonRowComponent } from '../clank-dungeon-row/clank-dungeon-row.component';
import { GameCardService } from '../services/game-card.service';
import { GameInfoQuery } from '../services/game-info.query';
import { GameInfoService } from '../services/game-info.service';

@Component({
    selector: 'app-clank-player-info',
    templateUrl: './clank-player-info.component.html',
    styleUrls: ['./clank-player-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClankPlayerInfoComponent implements OnInit {

    selectedPlayerSubject = new BehaviorSubject<ClankPlayerConfig | undefined>(void 0);

    card_width = 160;
    card_height = 220;
    @HostBinding('style.--player_card_width') player_card_width = `${this.card_width}px`;
    @HostBinding('style.--player_card_height') player_card_height = `${this.card_height}px`;

    get selectedPlayer() {
        return this.selectedPlayerSubject.getValue();
    }

    set selectedPlayer(player: ClankPlayerConfig | undefined) {
        this.selectedPlayerSubject.next(player);
    }

    get handRow() {
        if (this.selectedPlayer == null) {
            return [];
        }
        const rowCount = 4;
        return this.selectedPlayer.hand.map((card, index) => {
            return {
                card,
                left: (index % rowCount) * this.card_width * 0.8,
                top: Math.floor(index / rowCount) * this.card_height * 0.8,
            };
        });
    }

    playersSubject = this.gameInfoQuery.onPlayersChangeSubject.pipe(
        tap((players) => {
            this.selectedPlayer = this.selectedPlayer != null
                ? players.find(p => p.id === this.selectedPlayer?.id)
                : this.gameInfoQuery.currentPlayer;
        }),
    );

    activePlayerSubject = this.gameInfoQuery.onActivePlayerChangeSubject;

    get currentPlayer() {
        return this.gameInfoQuery.currentPlayer;
    }

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private gameInfoQuery: GameInfoQuery,
        private gameInfoService: GameInfoService,
        private cardsService: CardsService,
        private gameCardService: GameCardService,
        private matBottomSheet: MatBottomSheet,
        private matDialog: MatDialog,
    ) { }

    ngOnInit(): void {
    }

    onSelectPlayer(player: ClankPlayerConfig) {
        if (this.selectedPlayer?.id === player.id) {
            return;
        }
        this.selectedPlayer = player;
    }

    async useCard(cardState: ClankCardState, player: ClankPlayerConfig) {
        const card = this.cardsService.getCardInfo(cardState);
        if (card == null) {
            return;
        }
        const actions = this.gameCardService.getActions({
            card,
            player,
            type: 'actions',
        });
        if (card.actions != null && !actions.length) {
            const matDialogRef =  this.matDialog.open<ConfirmModalComponent, ConfirmModalComponent['data']>(
                ConfirmModalComponent,
                {
                    data: {
                        text: 'Вы уверены что хотите разыграть эту карту?',
                    },
                },
            );
            const result = await matDialogRef.afterClosed().toPromise();
            if (!result) {
                return;
            }
        }
        const benefitInfo: ClankCostInfo = actions.length
            ? updateBenefitInfoByAction({
                player,
                list: actions,
            })
            : player.benefitInfo;
        this.gameInfoService.useCard({
            playerId: player.id,
            cardState,
            benefitInfo: card?.benefit != null
                ? updateBenefitInfo({
                    benefit: benefitInfo,
                    cost: card.benefit,
                    isBenefit: true,
                })
                : player.benefitInfo,
            type: 'moveToBoard',
        });
        this.changeDetectorRef.detectChanges();
    }

    openDungeonRow(player: ClankPlayerConfig) {
        const bottomSheetRef = this.matBottomSheet.open<
            ClankDungeonRowComponent,
            ClankDungeonRowComponent['data']
        >(
            ClankDungeonRowComponent,
            {
                data: {
                    gameInfoQuery: this.gameInfoQuery,
                    gameInfoService: this.gameInfoService,
                    player,
                },
            },
        );
        bottomSheetRef.afterDismissed().subscribe(() => {
            console.log('afterDismissed');
        });
    }

    finishTurn() {
        this.gameInfoService.finishTurn();
    }

    trackById(index: number, player: ClankPlayerConfig) {
        return player.id;
    }

}
