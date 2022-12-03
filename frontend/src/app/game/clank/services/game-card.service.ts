import { Injectable } from '@angular/core';

import {
    checkAction,
    CheckActionResult,
} from 'src/app/shared/models/actions.types';
import { ToastSeverityEnum } from 'src/app/shared/models/toast.types';
import { ToastService } from 'src/app/shared/services/toast.service';

import {
    ClankCardActionList,
    ClankCardConfig,
} from '@shared/clank/clank-card.types';
import { ClankPlayerConfig } from '@shared/clank/clank-player.types';

@Injectable({
    providedIn: 'root',
})
export class GameCardService {

    constructor(
        private toastService: ToastService,
    ) { }

    getActions({
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
        if (card.actions?.type === 'some' && result.list.length > count) {
            /**
             * TODO: Открыть модальное окно с выбором события
             * .open(result)
             */
            return result.list.filter((_, index) => index < count);
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
}
