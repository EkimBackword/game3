import {
    animate,
    style,
    transition,
    trigger,
} from '@angular/animations';
import {
    ChangeDetectorRef,
    Component,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';

import * as lodash from 'lodash';
import {
    combineLatest,
    Subject,
} from 'rxjs';
import {
    map,
    takeUntil,
    tap,
} from 'rxjs/operators';
import { ClankCostInfoDirection } from 'src/app/shared/components/clank-cost-info/clank-cost-info.types';
import { ClankElementTypeMap } from 'src/app/shared/models/clank-element-types';
import { UseTokenType } from 'src/app/shared/models/tokens/token.types';
import { DialogService } from 'src/app/shared/services/dialog.service';

import { ClankArtifactConfig } from '@shared/clank/clank-artifact.types';
import {
    ClankElementTypeEnum,
    ClankSecretTypes,
} from '@shared/clank/clank-info.types';
import {
    ClankMapElementConfig,
    ClankMapElementLink,
} from '@shared/clank/clank-map.types';
import { ClankPlayerConfig } from '@shared/clank/clank-player.types';
import { ClankTokenConfig } from '@shared/clank/clank-token.types';

import { ClankHelpService } from '../services/clank-help.service';
import { GameDialogsService } from '../services/game-dialogs.service';
import { GameInfoQuery } from '../services/game-info.query';
import { GameInfoService } from '../services/game-info.service';

@Component({
    selector: 'app-clank-map-element',
    templateUrl: './clank-map-element.component.html',
    styleUrls: ['./clank-map-element.component.scss'],
    animations: [
        trigger(
            'inOutAnimation',
            [
                transition(
                    ':leave',
                    [
                        style({ marginLeft: 0, opacity: 1 }),
                        animate('1s ease-in', style({ marginLeft: 1000, opacity: 0 })),
                    ],
                ),
            ],
        ),
    ],
})
export class ClankMapElementComponent implements OnInit, OnDestroy {

    @Input() mapElement: ClankMapElementConfig | undefined;
    @HostBinding('style') style: Partial<CSSStyleDeclaration> = {};
    link: ClankMapElementLink | undefined;
    activePlayer: ClankPlayerConfig | undefined;
    isMapElementIdShow = false;

    dataSubject = combineLatest([
        this.gameInfoQuery.onMapChangeSubject,
        this.gameInfoQuery.onActivePlayerChangeSubject,
    ]).pipe(
        tap(([mapInfo, activePlayer]) => {
            this.activePlayer = activePlayer;
            const activePlayerPosition = mapInfo.elements.find(p => p.id === activePlayer?.elementId);
            const isActivePlayer = !this.activePlayer?.isFinish && this.activePlayer?.id === this.gameInfoQuery.currentPlayer?.id;
            const isEnterCrystalCave = (this.activePlayer?.benefitInfo.enter_crystal_cave ?? 0) > 0;
            const isIgnoreCrystalCave = (this.activePlayer?.benefitInfo.ignore_crystal_cave ?? 0) > 0;
            const hasTeleport = (this.activePlayer?.benefitInfo.teleport ?? 0) > 0;
            const link = isActivePlayer && (hasTeleport || isIgnoreCrystalCave || !isEnterCrystalCave)
                ? activePlayerPosition?.links.find(p => p.element_id === this.mapElement?.id)
                : void 0;
            if (!link || (!activePlayer?.artifacts.length && this.mapElement?.isStart)) {
                this.link = void 0;
                return;
            }
            if (hasTeleport) {
                this.link = {
                    ...link,
                    cost: {
                        teleport: 1,
                    },
                };
                return;
            }
            this.link = (link?.cost.teleport ?? 0) > 0
                ? void 0
                : link;
        }),
    );

    artifact: ClankArtifactConfig | undefined;
    onArtifactsChangeSubject = this.gameInfoQuery.onArtifactsChangeSubject.pipe(
        map((artifacts) => {
            const artifactsByValue = artifacts.filter(p => this.mapElement?.items?.artefact?.value === p.value);
            const artifact = lodash.maxBy(artifactsByValue, (p) => p.quality.value);
            if (!lodash.isEqual(this.artifact, artifact)) {
                this.artifact = void 0;
                this.changeDetectorRef.detectChanges();
            }
            this.artifact = artifact;
            this.changeDetectorRef.detectChanges();
            return artifactsByValue;
        }),
    );

    visibleTokens: ClankTokenConfig[] = [];
    onTokensChangeSubject = this.gameInfoQuery.onMapTokensChangeSubject.pipe(
        map((tokens) => tokens.filter(token => token?.element_type != null && this.mapElement?.items?.[token.element_type])),
        tap((tokens) => {
            if (!tokens.length) {
                this.visibleTokens = [];
                return;
            }
            const secrets = tokens.filter(token => ClankSecretTypes.includes(token.element_type));
            const nosecrets = tokens.filter(token => !ClankSecretTypes.includes(token.element_type)
                && this.mapElement?.items?.[token.element_type]?.value === token.points?.value,
            );
            this.visibleTokens = secrets.length > 0
                ? [
                    secrets[0],
                    ...nosecrets,
                ]
                : nosecrets;
        }),
    );
    private takeTokenSubject = new Subject<ClankTokenConfig | null>();
    onTakeTokenSubject = this.takeTokenSubject.pipe(
        tap((token) => {
            if (token != null) {
                setTimeout(() => {
                    this.takeTokenSubject.next(null);
                }, 1000);
            }
        }),
    );

    ClankElementTypeMap = ClankElementTypeMap;
    ClankCostInfoDirection = ClankCostInfoDirection;

    get currentPlayer() {
        return this.gameInfoQuery.currentPlayer;
    }

    private ngUnsubscribe = new Subject<void>();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private clankHelpService: ClankHelpService,
        private gameInfoService: GameInfoService,
        private gameInfoQuery: GameInfoQuery,
        private gameDialogsService: GameDialogsService,
        private dialogService: DialogService,
    ) { }

    ngOnInit(): void {
        this.style = this.getStyle();
        this.gameInfoService.isMapElementIdShowSubject.pipe(
            takeUntil(this.ngUnsubscribe),
        ).subscribe((value) => {
            this.isMapElementIdShow = value;
            this.changeDetectorRef.detectChanges();
        });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    async onMove(link: ClankMapElementLink) {
        if (this.mapElement == null || !this.canDoByPlayer(this.activePlayer)) {
            return;
        }
        const isIgnoreSymbolsOnTunnel = this.clankHelpService.hasBenefit(this.activePlayer, ClankElementTypeEnum.ignore_symbols_on_tunnel);
        if (isIgnoreSymbolsOnTunnel) {
            link = {
                ...link,
                cost: (link.cost?.teleport ?? 0) > 0
                    ? {
                        teleport: 1,
                    }
                    : {
                        boot: 1,
                    },
            };
        }
        const isIgnoreMonster = this.clankHelpService.hasBenefit(this.activePlayer, ClankElementTypeEnum.ignore_monster);
        if (isIgnoreMonster) {
            link = {
                ...link,
                cost: {
                    ...link.cost,
                    sword: 0,
                },
            };
        }
        if (!this.clankHelpService.canUse({
            cost: link.cost,
            player: this.activePlayer,
            isMove: true,
        })) {
            return;
        }
        if ((link.cost?.sword ?? 0) > 0) {
            const cost = await this.openDialogAboutSwords(link, this.activePlayer);
            if (cost == null) {
                return;
            }
            link = {
                ...link,
                cost,
            };
        }
        if ((link.cost?.teleport ?? 0) > 0) {
            link = {
                ...link,
                benefit: {},
            };
        }
        const isCrystalCave = this.mapElement.isCrystalCave ?? false;
        const isIgnoreCrystalCave = (this.activePlayer?.benefitInfo.ignore_crystal_cave ?? 0) > 0;

        const success = this.clankHelpService.updateBenefitInfo({
            player: this.activePlayer,
            cost: link.cost,
            benefit: {
                ...link.benefit,
                ...this.mapElement.benefit ?? {},
            },
            skipCheckCanUse: true,
        });
        if (!success) {
            return;
        }
        this.gameInfoService.onMove({
            playerId: this.activePlayer.id,
            mapElement: this.mapElement,
            benefitInfo: {
                ...this.activePlayer.benefitInfo,
                boot: isCrystalCave && !isIgnoreCrystalCave
                    ? 0
                    : this.activePlayer.benefitInfo.boot,
                enter_crystal_cave: (this.activePlayer.benefitInfo.enter_crystal_cave ?? 0) + (isCrystalCave ? 1 : 0),
            },
            skipSocketUpdate: true,
        });

        let isArtifactTaken = false;
        if (this.artifact) {
            isArtifactTaken = await this.takeArtifact(this.artifact);
        }

        let isTokenTaken = false;
        const tokenInfo = this.visibleTokens?.pop();
        if (tokenInfo != null) {
            this.takeTokenSubject.next(tokenInfo);
            await this.gameInfoService.useToken({
                playerId: this.activePlayer.id,
                tokenInfo,
                type: UseTokenType.take,
                skipSocketUpdate: true,
            });
            isTokenTaken = true;
        }

        this.gameInfoService.updateSocketState({
            canCancel: !isArtifactTaken && !isTokenTaken,
        });
    }

    async takeArtifact(artifact: ClankArtifactConfig, skipSocketUpdate = false) {
        if (!this.canDoByPlayerPosition(this.activePlayer)) {
            return false;
        }
        if (!this.canTakeArtifact(this.activePlayer)) {
            return false;
        }
        const matDialogRef = this.dialogService.openConfirm({
            title: 'Хотите ли взять артефакт?',
            textList: [`В ячейке есть артефакт ${artifact.name} (Значимость: ${artifact.value})`],
        });
        const result = await matDialogRef.afterClosed().toPromise();
        if (!result) {
            return false;
        }
        this.gameInfoService.takeArtifact({
            playerId: this.activePlayer.id,
            artifact,
            skipSocketUpdate,
        });
        return true;
    }

    trackById(index: number, item: { id: any }) {
        return item.id;
    }

    private canDoByPlayer(player: ClankPlayerConfig | undefined): player is ClankPlayerConfig {
        return this.activePlayer != null
            && this.activePlayer?.id === this.gameInfoQuery.currentPlayer?.id;
    }

    private canDoByPlayerPosition(player: ClankPlayerConfig | undefined): player is ClankPlayerConfig {
        return this.canDoByPlayer(player)
            && this.activePlayer?.elementId === this.mapElement?.id;
    }

    private canTakeArtifact(player: ClankPlayerConfig) {

        const artefactCount = player.artifacts.length;
        const backpackCount = player.benefitInfo.backpack ?? 0;
        const count = 1 + backpackCount;
        return artefactCount < count;
    }

    private getStyle() {
        if (this.mapElement == null) {
            return {};
        }
        const styleInfo: Partial<CSSStyleDeclaration> = {
            top: `${this.mapElement.position.y}px`,
            left: `${this.mapElement.position.x}px`,
            width: `${this.mapElement.position.width}px`,
            height: `${this.mapElement.position.height}px`,
        };
        return styleInfo;
    }

    private async openDialogAboutSwords(link: ClankMapElementLink, player: ClankPlayerConfig) {
        const matDialogRef =  this.gameDialogsService.openUseSwordsOrHealthComponent({
            player,
            cost: link.cost,
        });
        return await matDialogRef.afterClosed().toPromise();
    }

}
