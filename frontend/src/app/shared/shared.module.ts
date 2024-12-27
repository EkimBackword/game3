import {
    CommonModule,
    NgOptimizedImage,
} from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import {
    MAT_MOMENT_DATE_FORMATS,
    MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ClankArtifactComponent } from './components/clank-artifact/clank-artifact.component';
import { ClankCardComponent } from './components/clank-card/clank-card.component';
import { ClankCostInfoComponent } from './components/clank-cost-info/clank-cost-info.component';
import { ClankMeepleComponent } from './components/clank-meeple/clank-meeple.component';
import { ClankTokenComponent } from './components/clank-token/clank-token.component';
import { DynamicComponentDirective } from './directives/dynamic-component.directive';
import {
    ScalableContainerDirective,
    ScalableDirective,
} from './directives/scalable.directive';
import { BsToastComponent } from './modals/bs-toast/bs-toast.component';
import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component';
import { SingleInputModalComponent } from './modals/single-input-modal/single-input-modal.component';
import { SharedComponent } from './shared.component';

const exports = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatBottomSheetModule,
    MatProgressBarModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatDatepickerModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatListModule,
    MatTableModule,
    NgbModule,
    NgOptimizedImage,
    MatTabsModule,
];

const exportsComponents = [
    ClankArtifactComponent,
    ClankCardComponent,
    ClankCostInfoComponent,
    ClankMeepleComponent,
    ClankTokenComponent,
    ConfirmModalComponent,
    SingleInputModalComponent,
    BsToastComponent,
    DynamicComponentDirective,
    ScalableDirective,
    ScalableContainerDirective,
];

@NgModule({
    imports: [
        ...exports,
    ],
    exports: [
        ...exports,
        ...exportsComponents,
    ],
    declarations: [
        SharedComponent,
        ...exportsComponents,
    ],
    providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
        provideHttpClient(),
    ],
})
export class SharedModule { }
