import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import {
    checkAction,
    CheckActionResult,
} from 'src/app/shared/models/actions.types';
import { checkCost } from 'src/app/shared/models/clank-element-types';
import { ToastSeverityEnum } from 'src/app/shared/models/toast.types';
import { ToastService } from 'src/app/shared/services/toast.service';

import {
    ClankCardAction,
    ClankCardActionList,
    ClankCardConfig,
} from '@shared/clank/clank-card.types';
import { ClankPlayerConfig } from '@shared/clank/clank-player.types';
import { ClankTokenConfig } from '@shared/clank/clank-token.types';

import { ChooseSomeActionsComponent } from '../dialogs/choose-some-actions/choose-some-actions.component';

@Injectable({
    providedIn: 'root',
})
export class GameCardService {

    constructor(
        private toastService: ToastService,
        private matDialog: MatDialog,
    ) { }

    async getActions({
        card,
        player,
        type,
    }: {
        card: ClankCardConfig;
        player: ClankPlayerConfig;
        type: 'actions' | 'acquire';
    }) {
        const result = this.checkActions(card[type], player);
        if (!result.success) {
            return [];
        }
        const count = card.actions?.count ?? 1;
        if (result.message != null) {
            this.toastService.showWarn(result.message);
        }
        if (card.actions?.type === 'some' && result.list.length > count) {
            const dialog = this.matDialog.open<
                ChooseSomeActionsComponent,
                ChooseSomeActionsComponent['data'],
                ClankCardAction[]
            >(
                ChooseSomeActionsComponent,
                {
                    data: {
                        actions: card.actions,
                        player,
                    },
                    width: '500px',
                },
            );
            return await dialog.afterClosed().toPromise() ?? [];
        }
        return result.list;
    }

    private checkActions(
        actions: ClankCardActionList | undefined,
        player: ClankPlayerConfig,
    ): CheckActionResult {
        if (actions == null) {
            return {
                success: false,
                list: [],
                message: null,
            };
        }
        const result = checkAction({
            actions,
            player,
        });
        if (result.message) {
            this.toastService.show(
                result.success
                    ? ToastSeverityEnum.success
                    : ToastSeverityEnum.warning,
                result.message,
            );
        }
        return result;
    }

    canUseToken(tokenInfo: ClankTokenConfig, player: ClankPlayerConfig) {
        if (tokenInfo.cost == null) {
            return true;
        }
        const result = checkCost({
            cost: tokenInfo.cost,
            player,
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
}
