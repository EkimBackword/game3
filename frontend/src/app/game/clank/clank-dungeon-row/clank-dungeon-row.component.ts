import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    Inject,
    OnInit,
} from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

import { map } from 'rxjs/operators';
import { updateBenefitInfoByAction } from 'src/app/shared/models/actions.types';
import { CardsService } from 'src/app/shared/services/cards.service';

import { ClankCardState } from '@shared/clank/clank-card.types';
import { ClankCostInfo } from '@shared/clank/clank-info.types';
import { ClankPlayerConfig } from '@shared/clank/clank-player.types';

import { GameCardService } from '../services/game-card.service';
import { GameInfoQuery } from '../services/game-info.query';
import { GameInfoService } from '../services/game-info.service';

@Component({
    selector: 'app-clank-dungeon-row',
    templateUrl: './clank-dungeon-row.component.html',
    styleUrls: ['./clank-dungeon-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClankDungeonRowComponent implements OnInit {

    dungeonDeckSubject = this.data.gameInfoQuery.onDungeonDeckChangeSubject;

    dungeonRowSubject = this.data.gameInfoQuery.onDungeonRowChangeSubject;

    reserveRowSubject = this.data.gameInfoQuery.onReserveRowChangeSubject.pipe(
        map((cards) => {
            const groups = cards.reduce((acc, card) => {
                const [find_string] = card.id.split('__');
                const group = acc.get(find_string) ?? [];
                acc.set(find_string, [
                    ...group,
                    card,
                ]);
                return acc;
            }, new Map<string, ClankCardState[]>());
            return [...groups.values()];
        }),
    );

    card_width = 160;
    card_height = 220;
    @HostBinding('style.--dungeon_width') dungeon_width = `${this.card_width}px`;
    @HostBinding('style.--dungeon_height') dungeon_height = `${this.card_height}px`;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private cardsService: CardsService,
        private gameCardService: GameCardService,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
            gameInfoQuery: GameInfoQuery;
            gameInfoService: GameInfoService;
            player: ClankPlayerConfig;
        },
    ) { }

    ngOnInit(): void {
    }

    trackById(index: number, item: { id: any }) {
        return item.id;
    }

    buyCard(cardState: ClankCardState) {
        const card = this.cardsService.getCardInfo(cardState);
        if (card == null) {
            return;
        }
        const actions = this.gameCardService.getActions({
            card,
            player: this.data.player,
            type: 'acquire',
        });
        if (!actions.length) {
            return;
        }
        const benefitInfo: ClankCostInfo = updateBenefitInfoByAction({
            player: this.data.player,
            list: actions,
        });
        this.data.gameInfoService.useCard({
            playerId: this.data.player.id,
            cardState,
            benefitInfo,
            type: 'buy',
        });
        this.changeDetectorRef.detectChanges();
    }

}
