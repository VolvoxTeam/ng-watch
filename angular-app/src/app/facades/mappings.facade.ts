import { Injectable } from '@angular/core';
import { ApiService } from '@volvox-ng/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IMapping } from '../models/mapping.model';
import { IMappingsState } from '../models/states/mappings-state.model';

let _state: IMappingsState = {
    loading: false,
    saving: false,
};

@Injectable({
    providedIn: 'root',
})
export class MappingsFacade {

    private store$: BehaviorSubject<IMappingsState>;

    constructor(
        private readonly myApiService: ApiService,
    ) {
        this.store$ = new BehaviorSubject<IMappingsState>(_state);
    }

    public subState(): Observable<IMappingsState> {
        return this.store$.asObservable();
    }

    public addMapping(mapping: IMapping): Observable<IMapping> {
        this.updateState({ ..._state, saving: true });
        return this.myApiService.post<IMapping, IMapping>(`api/mappings`, mapping)
            .pipe(
                tap((): void => this.updateState({ ..._state, saving: false }))
            );
    }

    public editMapping(mapping: IMapping): Observable<IMapping> {
        this.updateState({ ..._state, saving: true });
        return this.myApiService.patch<IMapping, IMapping>(`api/mappings`, mapping)
            .pipe(
                tap((): void => this.updateState({ ..._state, saving: false }))
            );
    }

    public deleteMapping(mappingId: number): Observable<number> {
        this.updateState({ ..._state, saving: true });
        return this.myApiService.delete<number>(`api/mappings/${mappingId}`)
            .pipe(
                tap((): void => this.updateState({ ..._state, saving: false }))
            );
    }

    private updateState(state: IMappingsState): void {
        this.store$.next(_state = state);
    }

}
