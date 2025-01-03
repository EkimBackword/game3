import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    Injector,
    input,
    OnDestroy,
    OnInit,
} from '@angular/core';

import moment from 'moment';
import {
    GameLog,
    GameLogGroup,
    MomentDateFormat,
    MomentDateGroupFormat,
} from 'src/app/shared/models/game.types';
import { SoundTypeEnum } from 'src/app/shared/models/sound.types';
import { SoundService } from 'src/app/shared/services/sound.service';
import { ToastService } from 'src/app/shared/services/toast.service';

import {
    faTasks,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {
    GameActionsEnum,
    GameActionsMove,
} from '@shared/game/game-actions';
import { GameLogEntry } from '@shared/game/game-state';
import { ToastSeverityEnum } from '@shared/toast.types';

import { GameClient } from '../../../models/game-client';
import { RelicHuntersBenefit } from '../../models/benefit';
import { RelicHuntersGameBuilder } from '../../models/game-builder';
import {
    RhMoveTypes,
    RhUseMovePointsArgs,
    RhUseResearchPointsArgs,
} from '../../models/game-move-args-types';
import { RelicHuntersSetupData } from '../../models/game-setup-data';
import { RelicHuntersGameType } from '../../models/game-type';
import { RelicHuntersHeroColorTaxonomy } from '../../models/hero';
import { RelicHuntersPlayer } from '../../models/player';

@Component({
    selector: 'app-rh-logs',
    templateUrl: './rh-logs.component.html',
    styleUrl: './rh-logs.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class RhLogsComponent implements OnInit, OnDestroy {

    game = input.required<GameClient<RelicHuntersGameType, RelicHuntersSetupData>>();

    builder = computed(() => {
        return this.game().builder() as RelicHuntersGameBuilder | null;
    });

    logGroups = computed(() => {
        const game = this.game();
        const state = game.state();
        const logs = game.log();
        if (state == null) {
            return [];
        }

        const logsMap = new Map<string, GameLog<RelicHuntersPlayer>[]>();
        let index = 0;
        for (const log of logs) {
            const player = log.action.payload.playerId
                ? state.game.playerMap[log.action.payload.playerId]
                : null;
            const color = player != null
                ? RelicHuntersHeroColorTaxonomy[player?.color].color ?? '#666'
                : '#666';
            const data: GameLog<RelicHuntersPlayer> =  {
                ...log,
                tagName: this.getTagName(log),
                index: index++,
                player,
                color,
                createdAtMoment: moment(log.createdAt, MomentDateFormat),
            };
            const name = data.createdAtMoment.format(MomentDateGroupFormat);
            const list = logsMap.get(name) ?? [];
            list.push(data);
            logsMap.set(name, list);
        }
        return [...logsMap.entries()].map(([name, list]) => {
            const result: GameLogGroup<RelicHuntersPlayer> = {
                name,
                dateForOrder: list[0].createdAtMoment,
                list: list.sort((a, b) => {
                    const momentDiff = b.createdAtMoment.diff(a.createdAtMoment);
                    if (momentDiff === 0) {
                        return b.stateId - a.stateId;
                    }
                    return momentDiff;
                }),
            };
            return result;
        }).sort((a, b) => b.dateForOrder.diff(a.dateForOrder));
    });

    currentLogInfo = computed(() => {
        const game = this.game()
        const state = game.state();
        return {
            id: state?.stateId ?? -1,
            log: state?.log ?? [],
            playerMap: state?.game.playerMap ?? {},
        }
    }, {
        equal: (a, b) => a.id === b.id,
    });

    icons = {
        logs: faTasks,
        close: faXmark,
    };

    constructor(
        private toastService: ToastService,
        private soundService: SoundService,
        private injector: Injector,
    ) {
        effect(() => {
            const currentLogInfo = this.currentLogInfo();
            for (const log of currentLogInfo.log) {
                this.notifyByLog(log, currentLogInfo.playerMap);
            }
        });
    }

    ngOnInit(): void {
        effect(() => {
            const soundValue = this.soundService.getSoundValue('background');
            if (soundValue) {
                this.soundService.play({
                    id: 'MainThemeRh',
                    type: SoundTypeEnum.background,
                    soundUrl: [
                        '/assets/sounds/MainThemeRh0.mp3',
                        '/assets/sounds/MainThemeRh1.mp3',
                        '/assets/sounds/MainThemeRh2.mp3',
                        '/assets/sounds/MainThemeRh3.mp3',
                        '/assets/sounds/MainThemeRh4.mp3',
                    ]
                });
            }
        }, {
            injector: this.injector,
        });
    }

    ngOnDestroy(): void {
        this.soundService.pause('MainThemeRh');
    }

    trackByLogIndex(index: number, log: GameLog<RelicHuntersPlayer>) {
        return log.index;
    }

    private getTagName(log: GameLogEntry) {
        switch (log.action.type) {
            case GameActionsEnum.GAME_EVENT: {
                switch (log.action.payload.type) {
                    case 'endTurn':
                        return 'rh-logs-end-turn';
                    default:
                        return 'empty';
                }
            }
            case GameActionsEnum.UNDO: {
                return 'undo';
            }
            default: {
                switch (log.action.payload.type) {
                    case RhMoveTypes.getMovePoints:
                    case RhMoveTypes.getResearchPoints:
                    case RhMoveTypes.getCoins:
                    case RhMoveTypes.drawCards:
                    case RhMoveTypes.trashCards:
                    case RhMoveTypes.restCards:
                        return 'rh-logs-get-points';
                    case RhMoveTypes.getTileType:
                        return 'rh-logs-get-tile';
                    case RhMoveTypes.useMovePoints:
                        return 'rh-logs-use-move-points';
                    case RhMoveTypes.useResearchPoints:
                        return 'rh-logs-use-research-points';
                    default:
                        return 'empty'
                }
            }
        }
    }

    private notifyByLog(log: GameLogEntry, playerMap: Record<string, RelicHuntersPlayer>): void {
        const player = log.action.payload.playerId
            ? playerMap[log.action.payload.playerId]
            : null;
        const name = player?.name ?? '-';
        const color = player != null
            ? RelicHuntersHeroColorTaxonomy[player?.color].color ?? '#666'
            : '#666';
        switch (log.action.type) {
            case GameActionsEnum.GAME_EVENT: {
                const type = log.action.payload.type;
                switch (type) {
                    case 'startGame':
                    case 'endTurn': {
                        this.showToast({
                            name,
                            color,
                            message: type === 'endTurn'
                                ? 'Закончил ход'
                                : 'Игра началась',
                            soundUrl: '/assets/sounds/StartTurn.mp3',
                        });
                        return;
                    }
                    default: {
                        return;
                    };
                }
            }
            case GameActionsEnum.UNDO: {
                this.showToast({
                    name,
                    color,
                    message: 'Отменил ход',
                    soundUrl: '/assets/sounds/Cancel.mp3',
                });
                return;
            }
            default: {
                this.showToast({
                    name,
                    color,
                    message: `Выполнил действие "${log.action.payload.name}"`,
                    soundUrl: this.getSoundUrl(log.action),
                });
                return;
            }
        }
    }

    private getSoundUrl(action: ReturnType<typeof GameActionsMove>) {
        switch (action.payload.type) {
            case RhMoveTypes.getCoins:
                return '/assets/sounds/Coins.mp3';
            case RhMoveTypes.drawCards:
            case RhMoveTypes.trashCards:
            case RhMoveTypes.restCards:
                return '/assets/sounds/DrawCard.mp3';
            case RhMoveTypes.useMovePoints: {
                const args: RhUseMovePointsArgs = action.payload.args;
                if (args.cellTo.isOpen || args.cellTo.researchCost !== 0) {
                    return '/assets/sounds/Move.mp3';
                }
                return this.getSoundUrlByBenefit(args.cellTo.benefit);
            }
            case RhMoveTypes.useResearchPoints: {
                const args: RhUseResearchPointsArgs = action.payload.args;
                return this.getSoundUrlByBenefit(args.cell.benefit);
            }
            default:
                return null;
        }
    }

    private getSoundUrlByBenefit(benefit: Partial<RelicHuntersBenefit>) {
        if (benefit.coins != null) {
            return '/assets/sounds/Coins.mp3';
        }
        if (benefit.draw != null || benefit.trash != null || benefit.rest != null) {
            return '/assets/sounds/DrawCard.mp3';
        }
        return '/assets/sounds/GetPoints.mp3';
    }

    private showToast(options: {
        name: string;
        color: string;
        message: string;
        soundUrl: string | null;
    }) {
        if (options.soundUrl != null) {
            this.soundService.play({
                type: SoundTypeEnum.effects,
                soundUrl: options.soundUrl,
            });
        }
        this.toastService.show(
            ToastSeverityEnum.secondary,
            `Игрок: ${options.name}`,
            {
                bodyText: options.message,
                iconStyle: {
                    color: options.color,
                },
                bodyStyle: {
                    backgroundColor: options.color,
                },
                duration: 2000,
            }
        );
    }

}
