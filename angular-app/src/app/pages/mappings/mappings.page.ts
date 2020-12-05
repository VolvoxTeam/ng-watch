import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog, ConfirmDialogData, ConfirmDialogResult } from '@volvox-ng/core';
import { Observable } from 'rxjs';
import { MappingsFacade } from '../../facades/mappings.facade';
import { IMapping } from '../../models/mapping.model';
import { IMappingsState } from '../../models/states/mappings-state.model';
import { MappingsDialog } from './mappings-dialog/mappings.dialog';

@Component({
    selector: 'ng-watch-mappings',
    templateUrl: './mappings.page.html',
    styleUrls: [ './mappings.page.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MappingsPage implements OnInit {

    public mappingsState$: Observable<IMappingsState>;

    constructor(
        private readonly myMappingsFacade: MappingsFacade,
        private readonly myMatDialog: MatDialog,
    ) {
    }

    public ngOnInit(): void {
        this.mappingsState$ = this.myMappingsFacade.subState();
        this.loadMappings();
    }

    public addMapping(): void {
        this.myMatDialog
            .open(MappingsDialog, {
                width: '600px',
            })
            .afterClosed()
            .subscribe((result: boolean): void => {
                if (result) {
                    this.loadMappings();
                }
            });
    }

    public editMapping(mapping: IMapping): void {
        this.myMatDialog
            .open(MappingsDialog, {
                width: '600px',
                data: mapping,
            })
            .afterClosed()
            .subscribe((result: boolean): void => {
                if (result) {
                    this.loadMappings();
                }
            });
    }

    public deleteMapping(mapping: IMapping): void {
        this.myMatDialog
            .open(ConfirmDialog, {
                width: '600px',
                data: {} as ConfirmDialogData,
            })
            .afterClosed()
            .subscribe(async (result: ConfirmDialogResult): Promise<void> => {
                if (result === ConfirmDialogResult.confirmed) {
                    await this.myMappingsFacade.deleteMapping(mapping.id).toPromise();
                    this.loadMappings();
                }
            });
    }

    private loadMappings(): void {
        this.myMappingsFacade.loadMappings()
            .subscribe((mappings: IMapping[]): void => {
                //
            });
    }

}
