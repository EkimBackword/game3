import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BsToastComponent } from '../modals/confirm-modal/bs-toast/bs-toast.component';
import {
    ToastOptions,
    ToastSeverityEnum,
} from '../models/toast.types';

@Injectable({
    providedIn: 'root',
})
export class ToastService {

    constructor(
        private matSnackBar: MatSnackBar,
    ) { }

    show(severity: ToastSeverityEnum, message: string, options?: ToastOptions) {
        switch (severity) {
            case ToastSeverityEnum.success:
                return this.showSuccess(message, options);
            case ToastSeverityEnum.info:
                return this.showInfo(message, options);
            case ToastSeverityEnum.warning:
                return this.showWarn(message, options);
            case ToastSeverityEnum.danger:
                return this.showError(message, options);
        }
    }

    showSuccess(message: string, options?: ToastOptions) {
        this.open({
            icon: 'done',
            severity: ToastSeverityEnum.success,
            message,
        }, options);
    }

    showInfo(message: string, options?: ToastOptions) {
        this.open({
            icon: 'info',
            severity: ToastSeverityEnum.info,
            message,
        }, options);
    }

    showWarn(message: string, options?: ToastOptions) {
        this.open({
            icon: 'warning',
            severity: ToastSeverityEnum.warning,
            message,
        }, options);
    }

    showError(message: string, options?: ToastOptions) {
        this.open({
            icon: 'error',
            severity: ToastSeverityEnum.danger,
            message,
        }, options);
    }

    private open(data: BsToastComponent['data'], options?: ToastOptions) {
        const {duration, ...dataFromOptions} = options ?? {};
        this.matSnackBar.openFromComponent(BsToastComponent, {
            data: Object.assign({}, data, dataFromOptions),
            duration: options?.duration ?? 2500,
            horizontalPosition: 'center',
            verticalPosition: 'top',
        });
    }

}
