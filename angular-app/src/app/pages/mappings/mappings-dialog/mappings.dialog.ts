import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent, LoggerService } from '@volvox-ng/core';
import { Observable } from 'rxjs';
import { MappingsFacade } from '../../../facades/mappings.facade';
import { IMapping } from '../../../models/mapping.model';
import { IMappingsState } from '../../../models/states/mappings-state.model';

@Component({
    selector: 'ng-watch-mappings-dialog',
    templateUrl: './mappings.dialog.html',
    styleUrls: [ './mappings.dialog.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MappingsDialog extends BaseComponent implements OnInit {

    public dialogHeader: string;
    public isNew: boolean;
    public formGroup: FormGroup;
    public mappingsState$: Observable<IMappingsState>;

    constructor(
        private readonly myMatDialogRef: MatDialogRef<MappingsDialog>,
        @Inject(MAT_DIALOG_DATA) private readonly mapping: IMapping,
        private readonly myMappingsFacade: MappingsFacade,
        private readonly myLoggerService: LoggerService,
    ) {
        super();
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.mappingsState$ = this.myMappingsFacade.subState();
        this.isNew = !this.mapping;
        this.dialogHeader = this.isNew ? 'ng-watch.mappings.dialog.add-caption' : 'ng-watch.mappings.dialog.edit-caption';

        this.formGroup = new FormGroup({
            name: new FormControl(null, [ Validators.required ]),
            source: new FormControl(null, [ Validators.required ]),
            target: new FormControl(null, [ Validators.required ]),
        });

        if (this.mapping) {
            this.formGroup.patchValue(this.mapping);
        }
    }

    public async save(): Promise<void> {
        if (!this.formGroup.valid) {
            this.myLoggerService.logWarning('Warning', 'Please fill in all fields!', true);
            return;
        }

        const mergedMapping: IMapping = { ...this.formGroup.getRawValue(), id: this.mapping.id };
        if (this.isNew) {
            await this.myMappingsFacade.addMapping(mergedMapping).toPromise();
            this.myLoggerService.logSuccess('Success', 'Mapping created', true);
        } else {
            await this.myMappingsFacade.editMapping(mergedMapping).toPromise();
            this.myLoggerService.logSuccess('Success', 'Mapping updated', true);
        }
        this.myMatDialogRef.close(true);
    }

}
