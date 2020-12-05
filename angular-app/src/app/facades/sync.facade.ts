import { Injectable } from '@angular/core';
import { ApiService } from '@volvox-ng/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IMapping } from '../models/mapping.model';
import { ISyncState } from '../models/states/sync-state.model';

let _state: ISyncState = {
    activeMapping: null,
    loading: false,
    lastSynced: null,
    watching: false,
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

    public getLastSynced(): Observable<Date> {
        return this.myApiService.get<string>('/api/copy/last-synced')
            .pipe(
                map((lastSynced: string): Date => {
                    this.updateState({ ..._state, lastSynced: new Date(lastSynced) });
                    return new Date(lastSynced);
                }),
            );
    }

    public copy(mapping: IMapping, watch: boolean): Observable<string> {
        this.updateState({ ..._state, loading: true });
        return this.myApiService.post<{ mapping: IMapping, watch: boolean }, string>('api/copy', { mapping, watch })
            .pipe(
                tap((lastSynced: string): void => this.updateState({
                    ..._state,
                    lastSynced: new Date(lastSynced),
                    loading: false,
                    watching: watch,
                })),
                catchError((err: any): string => {
                    this.updateState({ ..._state, loading: false });
                    throw err;
                }),
            );
    }

    public updateActiveMapping(activeMapping: IMapping): void {
        this.updateState({ ..._state, activeMapping });
    }

    public updateWatchingStatus(watching: boolean): void {
        this.updateState({ ..._state, watching });
    }

    private updateState(state: ISyncState): void {
        this.store$.next(_state = state);
    }
}
