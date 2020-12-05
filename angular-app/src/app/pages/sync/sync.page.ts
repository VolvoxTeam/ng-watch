import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent, isNullOrUndefined, LoggerService } from '@volvox-ng/core';
import { Observable } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { SharedDataFacade } from '../../facades/shared-data.facade';
import { SyncFacade } from '../../facades/sync.facade';
import { IMapping } from '../../models/mapping.model';
import { ISyncState } from '../../models/states/sync-state.model';

@Component({
    selector: 'ng-watch-sync',
    templateUrl: './sync.page.html',
    styleUrls: [ './sync.page.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SyncPage extends BaseComponent implements OnInit {

    public filteredMappings$: Observable<IMapping[]>;
    public syncState$: Observable<ISyncState>;

    public formGroup: FormGroup;

    constructor(
        private readonly mySharedDataFacade: SharedDataFacade,
        private readonly myLoggerService: LoggerService,
        private readonly mySyncFacade: SyncFacade,
    ) {
        super();
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.syncState$ = this.mySyncFacade.subState();
        this.formGroup = new FormGroup({
            mapping: new FormControl(null, [ Validators.required ]),
            watch: new FormControl(false),
        });

        this.filteredMappings$ = this.formGroup.get('mapping').valueChanges.pipe(
            startWith(''),
            map((val: string): IMapping[] => this.filterMappings(val))
        );
    }

    public get mappingDisplay(): (val: string | IMapping) => string {
        return (val: string | IMapping): string => {
            if (isNullOrUndefined(val)) {
                return '';
            }

            if (typeof val !== 'string') {
                return val.name;
            }
            return val;
        };
    }

    public onMappingChange(mapping: IMapping): void {
        this.mySyncFacade.updateActiveMapping(mapping);
    }

    public copy(mapping: IMapping): void {
        const watch: boolean = this.formGroup.get('watch').value;
        this.mySyncFacade.copy(mapping, watch)
            .pipe(
                catchError((err: any): any => {
                    this.myLoggerService.logError('Error', err, true);
                    throw err;
                })
            )
            .subscribe((): void => {
                this.myLoggerService.logSuccess('Copied', 'Source was copied to target', true);
                this.mySyncFacade.updateLastSynced(new Date());
                if (watch) {
                    this.myLoggerService.logSuccess(null, 'Watching for file changes...', true);
                }
            });
    }

    private filterMappings(filter: string): IMapping[] {
        return this.mySharedDataFacade.snapshot.mappings.filter((val: IMapping): boolean =>
            val.name.includes(filter) ||
            val.source.includes(filter) ||
            val.target.includes(filter));
    }

}
