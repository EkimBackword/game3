import { Injectable } from '@angular/core';

import { MessageService } from 'primeng-lts/api';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { ToastSeverityEnum } from '../models/toast.types';

@Injectable({
    providedIn: 'root',
})
export class ToastService {

    private onConfirmResultSubject = new Subject<boolean>();

    constructor(
        private messageService: MessageService,
    ) { }

    showSuccess(message: string, title = 'Success') {
        this.messageService.add({
            severity: ToastSeverityEnum.success,
            summary: title,
            detail: message,
        });
    }

    showInfo(message: string, title = 'Info') {
        this.messageService.add({
            severity: ToastSeverityEnum.info,
            summary: title,
            detail: message,
        });
    }

    showWarn(message: string, title = 'Warn') {
        this.messageService.add({
            severity: ToastSeverityEnum.warn,
            summary: title,
            detail: message,
        });
    }

    showError(message: string, title = 'Error') {
        this.messageService.add({
            severity: ToastSeverityEnum.error,
            summary: title,
            detail: message,
        });
    }

    showConfirm(title = 'Вы уверены?', message = 'Сделайте выбор') {
        this.messageService.clear();
        this.messageService.add({
            key: 'c',
            sticky: true,
            severity: 'warn',
            summary: title,
            detail: message,
        });
        return this.onConfirmResultSubject.pipe(
            take(1),
        );
    }

    setConfirmResult(value: boolean) {
        this.messageService.clear('c');
        this.onConfirmResultSubject.next(value);
    }

}
