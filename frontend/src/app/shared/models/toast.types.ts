import { BsToastComponent } from '../modals/bs-toast/bs-toast.component';

export interface ToastOptions extends Omit<BsToastComponent['data'], 'message'> {
    duration: number;
}
