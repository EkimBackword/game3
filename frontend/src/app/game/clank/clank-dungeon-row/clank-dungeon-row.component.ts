import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    Inject,
    OnInit,
} from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

import {
    combineLatest,
    Subject,
} from 'rxjs';
import {
    map,
    tap,
} from 'rxjs/operators';
import {
    cardHeight,
    cardsWrapPadding,
    cardWidth,
    ISelectedPlayerCardInfo,
} from 'src/app/shared/components/clank-card/clank-card.types';
import { ClankCostInfoType } from 'src/app/shared/models/clank-element-types';
import { UseTokenType } from 'src/app/shared/models/tokens/token.types';
import { ToastService } from 'src/app/shared/services/toast.service';

import { ClankCardConfig } from '@shared/clank/clank-card.types';
import { ClankMapElementConfig } from '@shared/clank/clank-map.types';
import { ClankPlayerConfig } from '@shared/clank/clank-player.types';
import { ClankTokenConfig } from '@shared/clank/clank-token.types';

import { CardsService } from '../services/cards.service';
import { ClankHelpService } from '../services/clank-help.service';
import { GameInfoQuery } from '../services/game-info.query';
import { GameInfoService } from '../services/game-info.service';

@Component({
    selector: 'app-clank-dungeon-row',
    templateUrl: './clank-dungeon-row.component.html',
    styleUrls: ['./clank-dungeon-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClankDungeonRowComponent implements OnInit {

    ClankCostInfoType = ClankCostInfoType;
    cardsWrapInfo = {
        rowCount: 7,
        cardWidth,
        cardHeight,
        dungeonRowTop: 0,
        reserveRowTop: cardHeight + cardsWrapPadding,
        dungeonTokenSize: 80,
        clankCostInfoHeight: 25,
    };

    playerPosition: ClankMapElementConfig | undefined;

    @HostBinding('style.--dungeon_width') dungeon_width = `${this.cardsWrapInfo.cardWidth}px`;
    @HostBinding('style.--dungeon_height') dungeon_height = `${this.cardsWrapInfo.cardHeight}px`;
    @HostBinding('style.--dungeon_token_size') dungeon_token_size = `${this.cardsWrapInfo.dungeonTokenSize}px`;
    @HostBinding('style.--clank_cost_info_height') clank_cost_info_height = `${this.cardsWrapInfo.clankCostInfoHeight}px`;

    cardsSubject = combineLatest([
        this.data.gameInfoQuery.onDungeonDeckChangeSubject,
        this.data.gameInfoQuery.onDungeonRowChangeSubject,
        this.data.gameInfoQuery.onReserveRowChangeSubject,
    ]).pipe(
        map(([
            dungeonDeckCards,
            dungeonRowCards,
            reserveRowCards,
        ]) => {
            const firstCard = dungeonDeckCards[0];
            const dungeonDeck: ISelectedPlayerCardInfo[] = firstCard != null
                ? [{
                    id: firstCard.id,
                    card: firstCard,
                    style: {
                        left: `0px`,
                        top: `${this.cardsWrapInfo.dungeonRowTop}px`,
                    },
                    isOpen: false,
                    classes: [],
                }]
                : [];
            const dungeonRow: ISelectedPlayerCardInfo[] = dungeonRowCards.map((card, index) => {
                const data: ISelectedPlayerCardInfo = {
                    id: card.id,
                    card,
                    style: {
                        left: `${(cardWidth + cardsWrapPadding) * (index + 1)}px`,
                        top: `${this.cardsWrapInfo.dungeonRowTop}px`,
                    },
                    isOpen: true,
                    classes: [],
                    action: {
                        name: this.data.cardsService.getCardActionName(card, 'onAcquire'),
                        eventName: 'onAcquire',
                        btnClass: 'btn-primary',
                        canUse: () => this.activePlayer?.id === this.currentPlayer?.id,
                        callback: () => this.buyCard(card),
                    },
                };
                return data;
            });
            const reserveRowGroups = new Map<string, number>();
            const reserveRow: ISelectedPlayerCardInfo[] = reserveRowCards.map((card) => {
                const [find_string] = card.id.split('__');
                const index = reserveRowGroups.get(find_string) ?? reserveRowGroups.size;
                reserveRowGroups.set(find_string, index);
                const data: ISelectedPlayerCardInfo = {
                    id: card.id,
                    card,
                    style: {
                        left: `${(cardWidth + cardsWrapPadding) * index}px`,
                        top: `${this.cardsWrapInfo.reserveRowTop}px`,
                    },
                    isOpen: true,
                    classes: [],
                    action: {
                        name: this.data.cardsService.getCardActionName(card, 'onAcquire'),
                        eventName: 'onAcquire',
                        btnClass: 'btn-primary',
                        canUse: () => this.activePlayer?.id === this.currentPlayer?.id,
                        callback: () => this.buyCard(card),
                    },
                };
                return data;
            });
            return [
                ...dungeonDeck,
                ...dungeonRow,
                ...reserveRow,
            ].sort((a, b) => a.card.initIndex - b.card.initIndex);
        }),
    );

    onMarketTokensChangeSubject = this.data.gameInfoQuery.onMarketTokensChangeSubject.pipe(
        map((tokens) => {
            const groups = tokens.reduce((acc, token) => {
                const group = acc.get(token.name) ?? [];
                group.push(token);
                acc.set(token.name, group);
                return acc;
            }, new Map<string, ClankTokenConfig[]>());
            return [...groups.values()];
        }),
    );

    onChangeSubject = new Subject<boolean>();
    onPlayersChangeSubject = this.data.gameInfoQuery.onPlayersChangeSubject.pipe(
        tap((players) => {
            this.activePlayer = this.data.gameInfoQuery.activePlayer;
            this.currentPlayer = this.data.gameInfoQuery.currentPlayer;
            this.onChangeSubject.next(true);
        }),
    );

    activePlayer: ClankPlayerConfig | undefined;
    currentPlayer: ClankPlayerConfig | undefined;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private toastService: ToastService,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
            gameInfoQuery: GameInfoQuery;
            gameInfoService: GameInfoService;
            clankHelpService: ClankHelpService;
            cardsService: CardsService;
        },
    ) { }

    ngOnInit(): void {
        this.activePlayer = this.data.gameInfoQuery.activePlayer;
        this.currentPlayer = this.data.gameInfoQuery.currentPlayer;
        const mapInfo = this.data.gameInfoQuery.mapInfo;
        this.playerPosition = mapInfo?.elements.find(p => p.id === this.activePlayer?.elementId);
    }

    trackById(index: number, item: { id: any }) {
        return item.id;
    }

    async buyCard(card: ClankCardConfig) {
        if (this.activePlayer == null || this.activePlayer.id !== this.currentPlayer?.id) {
            return;
        }
        if (card.onlyDepthsArea && !this.playerPosition?.isDungeon) {
            this.toastService.showWarn(`Можно купить только в подземелье`);
            return;
        }
        if (card.onlyCrystalCave && !this.playerPosition?.isCrystalCave) {
            this.toastService.showWarn(`Можно купить только в Кристальной пещере`);
            return;
        }
        this.data.gameInfoService.useCard(card, 'onAcquire');
        this.changeDetectorRef.detectChanges();
    }

    useToken(tokenInfo: ClankTokenConfig) {
        if (this.activePlayer == null || this.activePlayer.id !== this.currentPlayer?.id || !this.playerPosition?.isMarket) {
            return;
        }
        if (!this.data.clankHelpService.canUse({
            cost: tokenInfo.cost,
            player: this.activePlayer,
        })) {
            return;
        }
        this.data.gameInfoService.useToken({
            playerId: this.activePlayer.id,
            tokenInfo,
            type: UseTokenType.buy,
        });
    }

}
