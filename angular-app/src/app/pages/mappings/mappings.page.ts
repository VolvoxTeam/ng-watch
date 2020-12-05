import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent, ConfirmDialog, ConfirmDialogData, ConfirmDialogResult } from '@volvox-ng/core';
import { Observable } from 'rxjs';
import { MappingsFacade } from '../../facades/mappings.facade';
import { SharedDataFacade } from '../../facades/shared-data.facade';
import { IMapping } from '../../models/mapping.model';
import { IMappingsState } from '../../models/states/mappings-state.model';
import { MappingsDialog } from './mappings-dialog/mappings.dialog';
import { ISharedDataState } from '../../models/states/shared-data-state.model';

@Component({
    selector: 'ng-watch-mappings',
    templateUrl: './mappings.page.html',
    styleUrls: [ './mappings.page.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MappingsPage extends BaseComponent implements OnInit {

    public mappingsState$: Observable<IMappingsState>;
    public sharedDataState$: Observable<ISharedDataState>;

    constructor(
        private readonly mySharedDataFacade: SharedDataFacade,
        private readonly myMappingsFacade: MappingsFacade,
        private readonly myMatDialog: MatDialog,
    ) {
        super();
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.sharedDataState$ = this.mySharedDataFacade.subState();
        this.mappingsState$ = this.myMappingsFacade.subState();
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
        this.mySharedDataFacade.loadMappings().toPromise().then();
    }

}
