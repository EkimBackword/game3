import { FormControl } from '@angular/forms';

export type FormGroupType<T extends { [K in keyof T]?: any }> = {
    [K in keyof T]: FormControl<T[K] | null>;
};
