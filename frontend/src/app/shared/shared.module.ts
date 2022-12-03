import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ClankArtifactComponent } from './components/clank-artifact/clank-artifact.component';
import { ClankCardComponent } from './components/clank-card/clank-card.component';
import { ClankCostInfoComponent } from './components/clank-cost-info/clank-cost-info.component';
import { ClankMeepleComponent } from './components/clank-meeple/clank-meeple.component';
import { ClankTokenComponent } from './components/clank-token/clank-token.component';
import { BsToastComponent } from './modals/confirm-modal/bs-toast/bs-toast.component';
import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component';
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
    NgbModule,
];

const exportsComponents = [
    ClankArtifactComponent,
    ClankCardComponent,
    ClankCostInfoComponent,
    ClankMeepleComponent,
    ClankTokenComponent,
    ConfirmModalComponent,
    BsToastComponent,
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
    ],
})
export class SharedModule { }
