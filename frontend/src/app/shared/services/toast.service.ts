import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Subject } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import {
    faCheckCircle,
    faEnvelopeOpenText,
    faExclamationCircle,
    faExclamationTriangle,
    faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { ToastSeverityEnum } from '@shared/toast.types';

import { BsToastComponent } from '../modals/bs-toast/bs-toast.component';
import { ToastOptions } from '../models/toast.types';

@Injectable({
    providedIn: 'root',
})
export class ToastService {

    private defaultDuration = 1000;
    private queue = new Subject<{
        data: BsToastComponent['data'];
        options?: Partial<ToastOptions>;
    }>();

    constructor(
        private matSnackBar: MatSnackBar,
    ) {
        this.queue.pipe(
            concatMap((params) => this.open(params)),
        ).subscribe();
    }

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
                this.queue.next({
                    data: {
                        icon: faEnvelopeOpenText,
                        severity: ToastSeverityEnum.secondary,
                        message,
                    },
                    options,
                });
        }
    }

    showSuccess(message: string, options?: Partial<ToastOptions>) {
        this.queue.next({
            data: {
                icon: faCheckCircle,
                severity: ToastSeverityEnum.success,
                message,
            },
            options,
        });
    }

    showInfo(message: string, options?: Partial<ToastOptions>) {
        this.queue.next({
            data: {
                icon: faInfoCircle,
                severity: ToastSeverityEnum.info,
                message,
            },
            options,
        });
    }

    showWarn(message: string, options?: Partial<ToastOptions>) {
        this.queue.next({
            data: {
                icon: faExclamationCircle,
                severity: ToastSeverityEnum.warning,
                message,
            },
            options,
        });
    }

    showError(message: string, options?: Partial<ToastOptions>) {
        this.queue.next({
            data: {
                icon: faExclamationTriangle,
                severity: ToastSeverityEnum.danger,
                message,
            },
            options,
        });
    }

    private open({ data, options }: {
        data: BsToastComponent['data'];
        options?: Partial<ToastOptions>;
    }) {
        const {duration, ...dataFromOptions} = options ?? {};
        const snackBarRef = this.matSnackBar.openFromComponent(BsToastComponent, {
            data: Object.assign({}, data, dataFromOptions),
            duration: options?.duration ?? this.defaultDuration,
            horizontalPosition: 'center',
            verticalPosition: 'top',
        });
        return snackBarRef.afterDismissed();
    }

}
