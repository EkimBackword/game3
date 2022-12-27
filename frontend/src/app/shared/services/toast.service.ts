import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
    faCheckCircle,
    faEnvelopeOpenText,
    faExclamationCircle,
    faExclamationTriangle,
    faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

import { BsToastComponent } from '../modals/bs-toast/bs-toast.component';
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

    show(severity: ToastSeverityEnum, message: string, options?: Partial<ToastOptions>) {
        switch (severity) {
            case ToastSeverityEnum.success:
                return this.showSuccess(message, options);
            case ToastSeverityEnum.info:
                return this.showInfo(message, options);
            case ToastSeverityEnum.warning:
                return this.showWarn(message, options);
            case ToastSeverityEnum.danger:
                return this.showError(message, options);
            default:
                this.open({
                    icon: faEnvelopeOpenText,
                    severity: ToastSeverityEnum.secondary,
                    message,
                }, options);
        }
    }

    showSuccess(message: string, options?: Partial<ToastOptions>) {
        this.open({
            icon: faCheckCircle,
            severity: ToastSeverityEnum.success,
            message,
        }, options);
    }

    showInfo(message: string, options?: Partial<ToastOptions>) {
        this.open({
            icon: faInfoCircle,
            severity: ToastSeverityEnum.info,
            message,
        }, options);
    }

    showWarn(message: string, options?: Partial<ToastOptions>) {
        this.open({
            icon: faExclamationCircle,
            severity: ToastSeverityEnum.warning,
            message,
        }, options);
    }

    showError(message: string, options?: Partial<ToastOptions>) {
        this.open({
            icon: faExclamationTriangle,
            severity: ToastSeverityEnum.danger,
            message,
        }, options);
    }

    private open(data: BsToastComponent['data'], options?: Partial<ToastOptions>) {
        const {duration, ...dataFromOptions} = options ?? {};
        this.matSnackBar.openFromComponent(BsToastComponent, {
            data: Object.assign({}, data, dataFromOptions),
            duration: options?.duration ?? 2500,
            horizontalPosition: 'center',
            verticalPosition: 'top',
        });
    }

}
