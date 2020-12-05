import { Injectable } from '@angular/core';
import { ApiService } from '@volvox-ng/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IMapping } from '../models/mapping.model';
import { ISharedDataState } from '../models/states/shared-data-state.model';

let _state: ISharedDataState = {
    mappings: [],
};

@Injectable({
    providedIn: 'root',
})
export class SharedDataFacade {

    private store$: BehaviorSubject<ISharedDataState>;

    constructor(
        private readonly myApiService: ApiService,
    ) {
        this.store$ = new BehaviorSubject<ISharedDataState>(_state);
    }

    public subState(): Observable<ISharedDataState> {
        return this.store$.asObservable();
    }

    public get snapshot(): ISharedDataState {
        return this.store$.value;
    }

    public loadMappings(): Observable<IMapping[]> {
        this.updateState({ ..._state, mappings: [] });
        return this.myApiService.get<IMapping[]>(`api/mappings`)
            .pipe(
                tap((mappings: IMapping[]): void => this.updateState({ ..._state, mappings }))
            );
    }

    private updateState(state: ISharedDataState): void {
        this.store$.next(_state = state);
    }
}
