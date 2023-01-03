import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import * as moment from 'moment';
import { cardWidth } from 'src/app/shared/components/clank-card/clank-card.types';
import {
    checkCost,
    CheckCostResult,
} from 'src/app/shared/models/clank-element-types';
import { MomentDateFormat } from 'src/app/shared/models/game.types';
import { updateBenefitInfo } from 'src/app/shared/models/players/player.types';
import {
    UseTokenInfoByType,
    UseTokenType,
} from 'src/app/shared/models/tokens/token.types';
import { ToastService } from 'src/app/shared/services/toast.service';

import { ClankCardConfig } from '@shared/clank/clank-card.types';
import {
    GameInfoActionLogData,
    GameInfoState,
} from '@shared/clank/clank-game.types';
import { ClankCostInfo } from '@shared/clank/clank-info.types';
import {
    ClankPlayerConfig,
    GamePlayerColorIdEnum,
    GamePlayerColorIds,
} from '@shared/clank/clank-player.types';
import { ClankTokenConfig } from '@shared/clank/clank-token.types';
import { ToastSeverityEnum } from '@shared/toast.types';

import {
    CardListComponent,
    CardListComponentResult,
} from '../dialogs/card-list/card-list.component';
import { GameInfoQuery } from './game-info.query';

@Injectable()
export class ClankHelpService {

    constructor(
        private gameInfoQuery: GameInfoQuery,
        private toastService: ToastService,
        private matDialog: MatDialog,
    ) { }

    updateBenefitInfo(data: {
        player: ClankPlayerConfig;
        cost?: ClankCostInfo;
        benefit?: ClankCostInfo;
        skipCheckCanUse?: boolean
    }) {
        const canUse = !data.skipCheckCanUse
            ? this.canUse(data)
            : true;
        if (!canUse) {
            return false;
        }
        data.player.benefitInfo = updateBenefitInfo({
            benefit: data.player.benefitInfo,
            cost: data.cost ?? {},
            isBenefit: false,
        });
        if ((data.player.benefitInfo.additional_coin ?? 0) > 0 && (data.benefit?.coin ?? 0) > 0) {
            const coin = data.benefit?.coin ?? 0;
            data.benefit = {
                ...data.benefit ?? {},
                coin: coin > 0
                    ? coin + 1
                    : 0,
            };
        }
        data.player.benefitInfo = updateBenefitInfo({
            benefit: data.player.benefitInfo,
            cost: data.benefit ?? {},
            isBenefit: true,
        });
        this.checkBenefit(data.player);
        return true;
    }

    checkBenefit(player: ClankPlayerConfig) {
        if ((player.benefitInfo.boot ?? 0) > 0
            && (player.benefitInfo.enter_crystal_cave ?? 0) > 0
            && (player.benefitInfo.ignore_crystal_cave ?? 0) === 0
        ) {
            player.benefitInfo.boot = 0;
        }

        if (player.benefitInfo.heal != null) {
            if (player.benefitInfo.heal > 10) {
                player.benefitInfo.heal = 10;
            }
            if (player.benefitInfo.heal <= 0) {
                player.benefitInfo.heal = 0;
                this.onPlayerFinishGame(player);
            }
        }
    }

    addClank({
        state,
        player,
        count,
    }: {
        state: GameInfoState;
        player: ClankPlayerConfig;
        count: number;
    }) {
        const text = count > 0
            ? 'получил'
            : 'убрал';
        this.addActionLogs(state, {
            text: `${player.name} ${text} ${Math.abs(count)} бдзынь`,
            colorId: player.colorId,
        });
        player.benefitInfo.clank = count > 0
            ? (player.benefitInfo.clank ?? 0) + count
            : player.benefitInfo.clank;
        state.dragonInfo.clankAria[player.colorId] += count;
    }

    checkClankAria(state: GameInfoState) {
        GamePlayerColorIds.forEach(colorId => {
            if (state.dragonInfo.clankAria[colorId] < 0) {
                state.dragonInfo.clankAria[colorId] = 0;
            }
        });
    }

    drawCards({
        state,
        player,
        count,
    }: {
        state?: GameInfoState;
        player: ClankPlayerConfig;
        count: number;
    }) {
        if (state != null) {
            this.addActionLogs(state, {
                text: `${player.name} добрал карты (${count})`,
                colorId: player.colorId,
            });
        }
        while (count > 0) {
            if (player.deck.length === 0) {
                player.deck = this.shuffle(player.discard);
                player.discard = [];
            }
            const card = player.deck.pop();
            if (card != null) {
                player.hand.push(card);
            }
            count--;
        }
    }

    async discard(data: {
        player: ClankPlayerConfig;
        card: ClankCardConfig;
        count: number;
    }) {
        const cards = data.player.hand.filter(p => p.id !== data.card.id);
        const result = await this.chooseCards({
            cards,
            count: data.count,
            errorText: 'Недостаточно карт для сброса',
            title: 'Выберите карты для сброса',
            actionText: 'Сбросить карту',
        });
        if (result.data) {
            data.player.hand = result.data.other;
            data.player.discard = [
                ...data.player.discard,
                ...result.data.selected,
            ];
        }
        return result;
    }

    async chooseCards(data: {
        cards: ClankCardConfig[],
        count: number;
        errorText: string;
        title: string;
        actionText: string;
    }) {
        if (data.cards.length < data.count) {
            this.toastService.showWarn(data.errorText);
            return {
                success: true,
            };
        }
        const matDialogRef = this.matDialog.open<
            CardListComponent,
            CardListComponent['data'],
            CardListComponentResult
        >(
            CardListComponent,
            {
                data: {
                    cards: data.cards,
                    title: data.title,
                    actionText: data.actionText,
                    count: data.count,
                },
                width: `${cardWidth * 5}px`,
            },
        );
        const result = await matDialogRef.afterClosed().toPromise();
        if (result == null) {
            return {
                success: false,
            };
        }
        return {
            success: true,
            data: result,
        };
    }

    openCardList(cards: ClankCardConfig[], title: string) {
        this.matDialog.open<
            CardListComponent,
            CardListComponent['data'],
            CardListComponentResult
        >(
            CardListComponent,
            {
                data: {
                    cards,
                    title,
                },
                width: `${cardWidth * 5}px`,
            },
        );
    }

    takeToken(
        state: GameInfoState,
        player: ClankPlayerConfig,
        tokenInfo: ClankTokenConfig,
        type: UseTokenType,
    ): boolean {
        if (player == null) {
            return true;
        }

        if (tokenInfo.needIncreaseDragonRage) {
            this.increaseDragonRage(state);
        }

        if (tokenInfo.drawCards) {
            this.drawCards({
                state,
                player,
                count: tokenInfo.drawCards,
            });
        }

        if ([UseTokenType.buy, UseTokenType.use].includes(type) || tokenInfo.isImmediatelyBenefit) {
            this.updateBenefitInfo({
                player,
                cost: tokenInfo.cost,
                benefit: tokenInfo.benefit,
            });

            if (tokenInfo.needTrashCards) {
                player.needTrashCards = [
                    ...player.needTrashCards,
                    ...tokenInfo.needTrashCards,
                ];
            }
        }

        if ([UseTokenType.buy, UseTokenType.take].includes(type) && (!tokenInfo.isImmediatelyBenefit || !tokenInfo.isUsable)) {
            player.tokens = [
                ...player.tokens,
                tokenInfo,
            ];
        } else {
            player.tokens = player.tokens.filter(p => p.id !== tokenInfo.id);
        }

        state.mapTokens = state.mapTokens.filter(p => p.id !== tokenInfo.id);
        state.marketTokens = state.marketTokens.filter(p => p.id !== tokenInfo.id);
        this.addActionLogs(state, {
            text: `${player.name} ${UseTokenInfoByType[type].text} ${tokenInfo.name}`,
            colorId: player.colorId,
        });
        return true;
    }

    increaseDragonRage(state: GameInfoState) {
        const maxRage = this.gameInfoQuery.mapInfo?.dragonInfo.maxRage ?? 0;
        if (state.dragonInfo.rage === maxRage) {
            return;
        }
        state.dragonInfo.rage++;
        this.addActionLogs(state, {
            text: `Повышается ярость дракона`,
        });
    }

    onDragonAttack(state: GameInfoState, rage = 0) {
        GamePlayerColorIds.forEach(colorId => {
            const count = state.dragonInfo.clankAria[colorId];
            if (count > 0) {
                state.dragonInfo.clankBag = [
                    ...state.dragonInfo.clankBag,
                    ...Array(count).fill(colorId),
                ];
            }
            state.dragonInfo.clankAria[colorId] = 0;
        });
        state.dragonInfo.clankBag = this.simpleShuffle(state.dragonInfo.clankBag);
        const attackResult = state.players.reduce((acc, player) => {
            acc[player.colorId] = {
                name: player.name,
                value: 0,
            };
            return acc;
        }, {
            [GamePlayerColorIdEnum.Black]: {
                name: 'Дракон',
                value: 0,
            },
        } as Record<GamePlayerColorIdEnum, {
            name: string;
            value: number;
        }>);
        const dangerRage = state.dungeonRow.reduce((acc, card) => acc + (card.danger ?? 0), 0);
        const mapInfo = this.gameInfoQuery.mapInfo;
        const dragonPosition = mapInfo?.dragonInfo.track.find(p => p.rage === state.dragonInfo.rage);
        const clankCount = dragonPosition?.clank ?? state.dragonInfo.rage;
        const totalRage = clankCount + dangerRage + rage;
        for (let index = 0; index < totalRage; index++) {
            const colorId = state.dragonInfo.clankBag.pop();
            if (colorId == null) {
                continue;
            }
            attackResult[colorId].value++;
            const player = state.players.find(p => p.colorId === colorId);
            if (player == null || player.benefitInfo.heal == null || player.isFinish) {
                continue;
            }
            this.updateBenefitInfo({
                player,
                benefit: {
                    heal: -1,
                },
            });
        }
        // TODO: Добавить кубики для отображения атаки дракона
        this.addActionLogs(state, {
            text: `Дракон атакует`,
            subtext: Object.values(attackResult).map(p => `${p.name}: ${p.value} урона`).join('\r\n'),
            isDragon: true,
        });
    }

    shuffle(deck: ClankCardConfig[]) {
        return this.simpleShuffle(deck).map((card, index) => {
            const newState: ClankCardConfig = {
                ...card,
                index,
            };
            return newState;
        });
    }

    simpleShuffle<T = any>(list: T[]) {
        return list.sort(() => Math.random() - 0.5);
    }

    onPlayerFinishGame(player: ClankPlayerConfig) {
        const mapElement = this.gameInfoQuery.mapInfo?.elements.find(p => p.id === player.elementId);
        player.isRescued = !mapElement?.isDungeon;
        player.isEscaped = false;
        player.isFinish = true;
    }

    addActionLogs(state: GameInfoState, data: GameInfoActionLogData) {
        const momentTime = moment();
        state.actionLogs.push({
            index: state.actionLogs.length,
            turnIndex: state.turnIndex,
            createdAt: momentTime.format(MomentDateFormat),
            data,
        });
    }

    canUse(data: {
        player: ClankPlayerConfig;
        cost?: ClankCostInfo;
        isMove?: boolean;
    }) {
        if (data.cost == null) {
            return true;
        }
        const result = checkCost({
            cost: data.cost,
            player: data.player,
            isMove: data.isMove,
        });
        this.showToast(result);
        return result.success;
    }

    private showToast(result: CheckCostResult) {
        if (!result.message) {
            return;
        }
        this.toastService.show(
            result.success
                ? ToastSeverityEnum.success
                : ToastSeverityEnum.warning,
            result.message,
        );
    }

}
