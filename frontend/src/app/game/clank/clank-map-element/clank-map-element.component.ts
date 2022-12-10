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
import { ClankCostInfoDirection } from 'src/app/shared/components/clank-cost-info/clank-cost-info.types';
import {
    checkCost,
    ClankElementTypeMap,
} from 'src/app/shared/models/clank-element-types';
import { updateBenefitInfo } from 'src/app/shared/models/players/player.types';
import { ToastSeverityEnum } from 'src/app/shared/models/toast.types';
import { ToastService } from 'src/app/shared/services/toast.service';

import { ClankArtifactConfig } from '@shared/clank/clank-artifact.types';
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
            const isActivePlayer = this.activePlayer?.id === this.gameInfoQuery.currentPlayer?.id;
            const isEnterCrystalCave = (this.activePlayer?.benefitInfo.enter_crystal_cave ?? 0) > 0;
            const isIgnoreCrystalCave = (this.activePlayer?.benefitInfo.ignore_crystal_cave ?? 0) > 0;
            this.link = isActivePlayer && (isIgnoreCrystalCave || !isEnterCrystalCave)
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
    ClankCostInfoDirection = ClankCostInfoDirection;

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
        const isCrystalCave = this.mapElement.isCrystalCave ?? false;
        const benefitInfo = updateBenefitInfo({
            benefit: this.activePlayer.benefitInfo,
            cost: link.cost,
            isBenefit: false,
        });
        this.gameInfoService.updatePlayer(this.activePlayer.id, {
            elementId: this.mapElement.id,
            benefitInfo: {
                ...benefitInfo,
                enter_crystal_cave: isCrystalCave ? 1 : 0,
            },
            isFinish: this.mapElement.isStart ?? false,
        });
        if (this.token != null) {
            this.gameInfoService.takeToken(this.activePlayer.id, this.token);
        }
    }

    takeArtifact(artifact: ClankArtifactConfig) {
        if (!this.canDoByPlayerPosition(this.activePlayer)) {
            return;
        }
        const artefactCount = this.activePlayer.benefitInfo.artefact ?? 0;
        const backpackCount = this.activePlayer.benefitInfo.backpack ?? 0;
        const count = 1 + backpackCount;
        if (artefactCount >= count) {
            return;
        }
        this.gameInfoService.takeArtifact(this.activePlayer.id, artifact);
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
        const result = checkCost({
            cost: link.cost,
            player,
            isMove: true,
        });
        if (result.message) {
            this.toastService.show(
                result.success
                    ? ToastSeverityEnum.success
                    : ToastSeverityEnum.warning,
                result.message,
            );
        }
        return result.success;
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
