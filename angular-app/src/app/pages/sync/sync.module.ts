import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule, Routes } from '@angular/router';
import { SyncPage } from './sync.page';

const routes: Routes = [
    {
        path: '',
        component: SyncPage,
    },
];

@NgModule({
    declarations: [ SyncPage ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        MatCardModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatProgressBarModule,
        MatIconModule,
        MatCheckboxModule,
    ],
})
export class SyncModule {
}
