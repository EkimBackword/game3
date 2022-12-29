import { Injectable } from '@angular/core';

import * as moment from 'moment';
import {
    checkCost,
    CheckCostResult,
} from 'src/app/shared/models/clank-element-types';
import { MomentDateFormat } from 'src/app/shared/models/game.types';
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
} from '@shared/clank/clank-player.types';

import { GameInfoQuery } from './game-info.query';

@Injectable()
export class ClankHelpService {

    constructor(
        private gameInfoQuery: GameInfoQuery,
        private toastService: ToastService,
    ) { }

    checkBenefit(
        player: ClankPlayerConfig,
        state: GameInfoState,
    ) {
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

        if (player.benefitInfo.card && player.benefitInfo.card > 0) {
            this.drawCards(player, player.benefitInfo.card);
            this.addActionLogs(state, {
                text: `${player.name} добрал карты (${player.benefitInfo.card})`,
                colorId: player.colorId,
            });
            delete player.benefitInfo.card;
        }

        if (player.benefitInfo.pyramid_dice) {
            // TODO: бросить кубик
            delete player.benefitInfo.pyramid_dice;
            this.addActionLogs(state, {
                text: `${player.name} бросает кубик`,
                colorId: player.colorId,
            });
        }

        if (player.benefitInfo.dragon_rage && state.dragonInfo.rage < (this.gameInfoQuery.mapInfo?.dragonInfo.maxRage ?? 0)) {
            state.dragonInfo.rage++;
            delete player.benefitInfo.dragon_rage;
            this.addActionLogs(state, {
                text: `Повышается ярость дракона`,
            });
        }

        if (player.benefitInfo.dragon_attack) {
            this.onDragonAttack(state);
            delete player.benefitInfo.dragon_attack;
        }

        if (player.benefitInfo.clank) {
            state.dragonInfo.clankAria[player.colorId] += player.benefitInfo.clank;
            const text = player.benefitInfo.clank > 0
                ? 'добавил шума'
                : 'убрал шум';
            this.addActionLogs(state, {
                text: `${player.name} ${text} (${player.benefitInfo.clank} бдзынь)`,
                colorId: player.colorId,
            });
            delete player.benefitInfo.clank;
        }

        // TODO: реакция на другие
    }

    drawCards(player: ClankPlayerConfig, count: number) {
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

    onDragonAttack(state: GameInfoState, rage = 0) {
        (Object.keys(state.dragonInfo.clankAria) as GamePlayerColorIdEnum[]).forEach((key) => {
            const count = state.dragonInfo.clankAria[key];
            if (count > 0) {
                state.dragonInfo.clankBag = [
                    ...state.dragonInfo.clankBag,
                    ...Array(count).fill(key),
                ];
            }
            state.dragonInfo.clankAria[key] = 0;
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
