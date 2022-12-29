import { Injectable } from '@angular/core';

import * as moment from 'moment';
import {
    checkCost,
    CheckCostResult,
} from 'src/app/shared/models/clank-element-types';
import { MomentDateFormat } from 'src/app/shared/models/game.types';
import { updateBenefitInfo } from 'src/app/shared/models/players/player.types';
import { ToastSeverityEnum } from 'src/app/shared/models/toast.types';
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

import { GameInfoQuery } from './game-info.query';

@Injectable()
export class ClankHelpService {

    constructor(
        private gameInfoQuery: GameInfoQuery,
        private toastService: ToastService,
    ) { }

    updateBenefitInfo(data: {
        player: ClankPlayerConfig;
        cost?: ClankCostInfo;
        benefit?: ClankCostInfo;
    }) {
        if (!this.canUse(data)) {
            return false;
        }
        data.player.benefitInfo = updateBenefitInfo({
            benefit: data.player.benefitInfo,
            cost: data.cost ?? {},
            isBenefit: false,
        });
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

        if (player.benefitInfo.heal) {
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
            ? 'добавил шума'
            : 'убрал шум';
        this.addActionLogs(state, {
            text: `${player.name} ${text} (${count} бдзынь)`,
            colorId: player.colorId,
        });
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
        }, {} as Record<GamePlayerColorIdEnum, {
            name: string;
            value: number;
        }>);
        const totalRage = state.dragonInfo.rage + rage;
        for (let index = 0; index < totalRage; index++) {
            const colorId = state.dragonInfo.clankBag.pop();
            const player = state.players.find(p => p.colorId === colorId);
            if (colorId == null || player == null || player.benefitInfo.heal == null || player.isFinish) {
                continue;
            }
            player.benefitInfo.heal--;
            attackResult[colorId].value++;
        }
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
