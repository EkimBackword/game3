import { Injectable } from '@angular/core';

import * as lodash from 'lodash';
import * as moment from 'moment';
import {
    CheckCostResult,
    ClankElementTypeMap,
} from 'src/app/shared/models/clank-element-types';
import { MomentDateFormat } from 'src/app/shared/models/game.types';
import { updateBenefitInfo } from 'src/app/shared/models/players/player.types';
import {
    UseTokenInfoByType,
    UseTokenType,
} from 'src/app/shared/models/tokens/token.types';
import { SoundService } from 'src/app/shared/services/sound.service';
import { ToastService } from 'src/app/shared/services/toast.service';

import { ClankCardConfig } from '@shared/clank/clank-card.types';
import {
    GameInfoActionLogData,
    GameInfoActionLogType,
    GameInfoState,
} from '@shared/clank/clank-game.types';
import {
    ClankCostInfo,
    ClankEffect,
    ClankElementByTurn,
    ClankElementType,
} from '@shared/clank/clank-info.types';
import { clankMapMumiaZoneTypes } from '@shared/clank/clank-mumia.types';
import {
    ClankPlayerConfig,
    GamePlayerColorIdEnum,
    GamePlayerColorIds,
} from '@shared/clank/clank-player.types';
import { ClankTokenConfig } from '@shared/clank/clank-token.types';
import { ToastSeverityEnum } from '@shared/toast.types';

import { GameDialogsService } from './game-dialogs.service';
import { GameInfoQuery } from './game-info.query';

@Injectable()
export class ClankHelpService {

    constructor(
        private gameInfoQuery: GameInfoQuery,
        private toastService: ToastService,
        private soundService: SoundService,
        private gameDialogsService: GameDialogsService,
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
                if (!player.isFinish) {
                    this.onPlayerFinishGame(player);
                }
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
        if (player.isFinish) {
            return;
        }
        const isAdd = count > 0;
        const text = isAdd
            ? 'получил'
            : 'убрал';
        this.addActionLogs({
            state,
            type: GameInfoActionLogType.Clank,
            data: {
                text: `${player.name} ${text} ${Math.abs(count)} бдзынь | (Здоровье: ${player.benefitInfo.heal ?? 0})`,
                colorId: player.colorId,
                soundUrl: '/assets/sounds/Clank.mp3',
            },
        });
        player.benefitInfo.clank = isAdd
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
        if (player.isFinish) {
            return;
        }
        if (state != null) {
            this.addActionLogs({
                state,
                type: GameInfoActionLogType.Card,
                data: {
                    text: `${player.name} добрал карты (${count}) | (Здоровье: ${player.benefitInfo.heal ?? 0})`,
                    colorId: player.colorId,
                },
            });
        }
        this.soundService.play('/assets/sounds/DrawCard.mp3');
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
        const matDialogRef = this.gameDialogsService.openCardListComponent({
            cards: data.cards,
            title: data.title,
            actionText: data.actionText,
            count: data.count,
        });
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
        this.addActionLogs({
            state,
            type: GameInfoActionLogType.Token,
            data: {
                text: `${player.name} ${UseTokenInfoByType[type].text} ${tokenInfo.name} | (Здоровье: ${player.benefitInfo.heal ?? 0})`,
                colorId: player.colorId,
            },
        });
        return true;
    }

    increaseDragonRage(state: GameInfoState) {
        const track = this.gameInfoQuery.mapInfo?.dragonInfo.track ?? [];
        const nextDragonPosition = track.find(p => p.rage === (state.dragonInfo.rage + 1));
        const playersCount = state.players.length;
        const canIncreaseRageByUserCount = nextDragonPosition?.canIncreaseRageByUserCount == null
            || playersCount >= nextDragonPosition.canIncreaseRageByUserCount;
        const lastTrackElement = track[track.length - 1];
        if (!canIncreaseRageByUserCount || state.dragonInfo.rage === lastTrackElement.rage) {
            return;
        }
        state.dragonInfo.rage++;
        this.addActionLogs({
            state,
            type: GameInfoActionLogType.Dragon,
            data: {
                text: `Повышается ярость дракона`,
            },
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
                state.dragonInfo.clankToBagTotalCount[colorId] += count;
            }
            state.dragonInfo.clankAria[colorId] = 0;
        });
        state.dragonInfo.clankBag = this.simpleShuffle(state.dragonInfo.clankBag);
        const attackResult = state.players.reduce((acc, player) => {
            acc[player.colorId] = {
                isDragon: false,
                isFinish: player.isFinish,
                name: player.name,
                value: 0,
                initHeal: player.benefitInfo.heal ?? 0,
                heal: player.benefitInfo.heal ?? 0,
            };
            return acc;
        }, {
            [GamePlayerColorIdEnum.Black]: {
                isDragon: true,
                name: 'Дракон',
                value: 0,
                initHeal: 0,
                heal: 0,
            },
        } as Record<GamePlayerColorIdEnum, {
            isDragon: boolean;
            isFinish: boolean;
            name: string;
            value: number;
            initHeal: number;
            heal: number;
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
            attackResult[colorId].heal = player.benefitInfo.heal ?? 0;
        }
        // TODO: Добавить кубики для отображения атаки дракона
        this.addActionLogs({
            state,
            type: GameInfoActionLogType.Dragon,
            data: {
                text: `Дракон атакует`,
                subtext: Object.values(attackResult).map(p => {
                    if (p.isDragon || p.isFinish) {
                        return `${p.name}: ${p.value} мимо`;
                    }
                    return `${p.name}: ${p.value} урона (${p.initHeal} → ${p.heal})`;
                }).join('\r\n'),
                isDragon: true,
                soundUrl: '/assets/sounds/DragonAttack.mp3',
            },
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
        const startMapElement = this.gameInfoQuery.mapInfo?.elements.find(p => p.isStart);
        player.isRescued = !mapElement?.isDungeon;
        player.isEscaped = false;
        player.isFinish = true;
        player.elementId = startMapElement?.id ?? 1;
    }

    addActionLogs(params: {
        state: GameInfoState;
        type: GameInfoActionLogType;
        data: GameInfoActionLogData;
    }) {
        const momentTime = moment();
        params.state.actionLogs.push({
            index: params.state.actionLogs.length,
            turnIndex: params.state.turnIndex,
            createdAt: momentTime.format(MomentDateFormat),
            data: params.data,
            type: params.type,
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
        const result = this.checkCost({
            cost: data.cost,
            player: data.player,
            isMove: data.isMove,
        });
        this.showToast(result);
        return result.success;
    }

    hasBenefit(player: ClankPlayerConfig, key: ClankElementType) {
        return (player.benefitInfo[key] ?? 0) > 0 || player.tokens.some(p => !p.isUsable && (p.benefit?.[key] ?? 0) > 0);
    }

    changeMumiaPosition(state: GameInfoState) {
        const mapInfo = this.gameInfoQuery.mapInfo;
        const mumiaInfo = mapInfo?.mumiaInfo;
        if (mapInfo == null || mumiaInfo == null) {
            return;
        }
        const newZoneIndex = lodash.random(mumiaInfo.zones.length - 1);
        const mapZoneInfo = mumiaInfo.zones[newZoneIndex];
        const zoneType = clankMapMumiaZoneTypes[mapZoneInfo.zone];
        if (state.mumiaInfo.zone === mapZoneInfo.zone) {
            this.addActionLogs({
                state,
                type: GameInfoActionLogType.Mumia,
                data: {
                    text: `Мумия осталась в той же зоне`,
                },
            });
            return;
        }
        const cursedPlayers: string[] = [];
        state.players.forEach(player => {
            const mapElement = mapInfo.elements.find(p => p.id === player.elementId);
            if (mapElement?.mumiaZoneType === mapZoneInfo.zone) {
                this.updateBenefitInfo({
                    player,
                    benefit: {
                        curse: 1,
                    },
                });
                cursedPlayers.push(player.name);
            }
        });
        state.mumiaInfo.zone = mapZoneInfo.zone;
        this.addActionLogs({
            state,
            type: GameInfoActionLogType.Mumia,
            data: {
                text: `Мумия переместилась в зону "${zoneType.name}"`,
                subtext: cursedPlayers.length > 0
                    ? 'Игроки получившие проклятие:\r\n' + cursedPlayers.join('\r\n')
                    : `В зоне "${zoneType.name}" нет игроков`,
            },
        });
    }

    private checkCost(data: {
        cost: Partial<Record<ClankElementType, number>>;
        player: ClankPlayerConfig;
        isMove?: boolean;
    }): CheckCostResult {
        for (const key in data.cost) {
            if (Object.prototype.hasOwnProperty.call(data.cost, key)) {
                const type = key as ClankElementType;
                const costInfo = ClankElementTypeMap[type];
                const costPoints = data.cost[type] ?? 0;
                const userPoints = data.player.benefitInfo[type] ?? 0;
                const healthPoints = data.player.benefitInfo.heal ?? 0;
                const isIgnoreMonster = this.hasBenefit(data.player, ClankEffect.ignore_monster);
                if (data.isMove && key === ClankElementByTurn.sword) {
                    if (!isIgnoreMonster && (userPoints + healthPoints) < costPoints) {
                        return {
                            success: false,
                            message: `Требуется ${costInfo.name}: ${costPoints} (У вас есть ${costInfo.name}: ${userPoints} | Здоровя: ${healthPoints})`,
                        };
                    }
                    continue;
                }
                if (userPoints < costPoints) {
                    return {
                        success: false,
                        message: `Требуется ${costInfo.name}: ${costPoints} (У вас есть ${costInfo.name}: ${userPoints})`,
                    };
                }
            }
        }
        return {
            success: true,
            message: null,
        };
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
