import { Injectable } from '@angular/core';
import { ApiService } from '@volvox-ng/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IMapping } from '../models/mapping.model';
import { ISyncState } from '../models/states/sync-state.model';

let _state: ISyncState = {
    activeMapping: null,
    loading: false,
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

    public updateActiveMapping(activeMapping: IMapping): void {
        this.updateState({ ..._state, activeMapping });
    }

    private updateState(state: ISyncState): void {
        this.store$.next(_state = state);
    }
}
