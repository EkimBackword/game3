import {
    Component,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';

import {
    combineLatest,
    Subject,
} from 'rxjs';
import {
    map,
    tap,
} from 'rxjs/operators';
import { ClankElementTypeMap } from 'src/app/shared/models/clank-element-types';
import { updateBenefitInfo } from 'src/app/shared/models/players/player.types';
import { ToastService } from 'src/app/shared/services/toast.service';

import { ClankArtifactConfig } from '@shared/clank/clank-artifact.types';
import { ClankElementType } from '@shared/clank/clank-info.types';
import {
    ClankMapElementConfig,
    ClankMapElementLink,
} from '@shared/clank/clank-map.types';
import { ClankPlayerConfig } from '@shared/clank/clank-player.types';
import { ClankTokenState } from '@shared/clank/clank-token.types';

import { GameInfoQuery } from '../services/game-info.query';
import { GameInfoService } from '../services/game-info.service';

@Component({
    selector: 'app-clank-map-element',
    templateUrl: './clank-map-element.component.html',
    styleUrls: ['./clank-map-element.component.scss'],
})
export class ClankMapElementComponent implements OnInit, OnDestroy {

    @Input() mapElement: ClankMapElementConfig | undefined;
    @HostBinding('style') style: Partial<CSSStyleDeclaration> = {};
    link: ClankMapElementLink | undefined;
    activePlayer: ClankPlayerConfig | undefined;

    dataSubject = combineLatest([
        this.gameInfoQuery.onMapChangeSubject,
        this.gameInfoQuery.onActivePlayerChangeSubject,
    ]).pipe(
        tap(([mapInfo, activePlayer]) => {
            this.activePlayer = activePlayer;
            const activePlayerPosition = mapInfo.elements.find(p => p.id === activePlayer?.elementId);
            this.link = this.activePlayer?.id === this.gameInfoQuery.currentPlayer?.id
                ? activePlayerPosition?.links.find(p => p.element_id === this.mapElement?.id)
                : void 0;
        }),
    );

    onArtifactsChangeSubject = this.gameInfoQuery.onArtifactsChangeSubject;

    token: ClankTokenState | undefined;
    onTokensChangeSubject = this.gameInfoQuery.onTokensChangeSubject.pipe(
        map((tokens) => tokens.filter(token => token?.element_type != null && this.mapElement?.items?.[token.element_type])),
        tap((tokens) => {
            this.token = tokens[0];
        }),
    );

    ClankElementTypeMap = ClankElementTypeMap;

    get currentPlayer() {
        return this.gameInfoQuery.currentPlayer;
    }

    private ngUnsubscribe = new Subject();

    constructor(
        private toastService: ToastService,
        private gameInfoService: GameInfoService,
        private gameInfoQuery: GameInfoQuery,
    ) { }

    ngOnInit(): void {
        this.style = this.getStyle();
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    onMove(link: ClankMapElementLink) {
        if (this.mapElement == null || !this.canDoByPlayer(this.activePlayer)) {
            return;
        }
        if (!this.canActivePlayerMove(link, this.activePlayer)) {
            return;
        }
        if ((link.cost?.sword ?? 0) > 0) {
            // TODO: Вопрос о том сколько мечей и сколько здоровья хочет потратить игрок
        }
        this.gameInfoService.updatePlayer(this.activePlayer.id, {
            elementId: this.mapElement.id,
            benefitInfo: updateBenefitInfo({
                benefit: this.activePlayer.benefitInfo,
                cost: link.cost,
                isBenefit: false,
            }),
            isFinish: this.mapElement.id === 1,
        });
        if (this.token != null) {
            this.gameInfoService.takeToken(this.activePlayer, this.token);
        }
    }

    takeArtifact(artifact: ClankArtifactConfig) {
        if (!this.canDoByPlayerPosition(this.activePlayer)) {
            return;
        }
        const hasBackpack = this.activePlayer.tokens.some(p => p.element_type === ClankElementType.backpack);
        const count = hasBackpack ? 2 : 1;
        if (this.activePlayer.artifacts.length >= count) {
            return;
        }
        this.gameInfoService.takeArtifact(this.activePlayer, artifact);
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

    private canActivePlayerMove(link: ClankMapElementLink, player: ClankPlayerConfig) {
        let canMove = false;
        for (const key in link.cost) {
            if (Object.prototype.hasOwnProperty.call(link.cost, key)) {
                const type = key as ClankElementType;
                const costInfo = ClankElementTypeMap[type];
                const costPoints = link.cost[type] ?? 0;
                const userPoints = player.benefitInfo[type] ?? 0;
                if (type === ClankElementType.key) {
                    if ((player.tokens ?? []).some((p) => p.element_type === type)) {
                        canMove = true;
                        continue;
                    }
                    this.toastService.showWarn(`Требуется ${costInfo.name}`);
                    return false;
                }
                if (key === ClankElementType.sword && (userPoints + player.health) < costPoints) {
                    this.toastService.showWarn(`Требуется ${costInfo.name}: ${costPoints} (У вас есть ${costInfo.name}: ${userPoints} | Здоровя: ${player.health})`);
                    return false;
                }
                if (userPoints < costPoints) {
                    this.toastService.showWarn(`Требуется ${costInfo.name}: ${costPoints} (У вас есть ${costInfo.name}: ${userPoints})`);
                    return false;
                }
                canMove = true;
            }
        }
        return canMove;
    }

    private getStyle() {
        if (this.mapElement == null) {
            return {};
        }
        const style: Partial<CSSStyleDeclaration> = {
            top: `${this.mapElement.position.y}px`,
            left: `${this.mapElement.position.x}px`,
            width: `${this.mapElement.position.width}px`,
            height: `${this.mapElement.position.height}px`,
        };
        return style;
    }

}
