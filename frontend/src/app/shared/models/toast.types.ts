import { BsToastComponent } from '../modals/confirm-modal/bs-toast/bs-toast.component';

export enum ToastSeverityEnum {
    primary = 'primary',
    secondary = 'secondary',
    success = 'success',
    info = 'info',
    warning = 'warning',
    danger = 'danger',
}

export interface ToastOptions extends Omit<BsToastComponent['data'], 'message'> {
    duration: number;
}
