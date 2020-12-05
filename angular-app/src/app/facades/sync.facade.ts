import { Injectable } from '@angular/core';
import { ApiService } from '@volvox-ng/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IMapping } from '../models/mapping.model';
import { ISyncState } from '../models/states/sync-state.model';

let _state: ISyncState = {
    activeMapping: null,
    loading: false,
    lastSynced: null,
};

@Injectable({
    providedIn: 'root',
})
export class SyncFacade {

    private store$: BehaviorSubject<ISyncState>;

    constructor(
        private readonly myApiService: ApiService,
    ) {
        this.store$ = new BehaviorSubject<ISyncState>(_state);
    }

    public subState(): Observable<ISyncState> {
        return this.store$.asObservable();
    }

    public get snapshot(): ISyncState {
        return this.store$.value;
    }

    public copy(mapping: IMapping, watch: boolean): Observable<any> {
        this.updateState({ ..._state, loading: true });
        return this.myApiService.post<{ mapping: IMapping, watch: boolean }, void>('api/copy', { mapping, watch })
            .pipe(
                tap((): void => this.updateState({ ..._state, loading: false })),
                catchError((err: any): any => {
                    this.updateState({ ..._state, loading: false });
                    throw err;
                }),
            );
    }

    public updateActiveMapping(activeMapping: IMapping): void {
        this.updateState({ ..._state, activeMapping });
    }

    public updateLastSynced(date: Date): void {
        this.updateState({ ..._state, lastSynced: date });
    }

    private updateState(state: ISyncState): void {
        this.store$.next(_state = state);
    }
}
