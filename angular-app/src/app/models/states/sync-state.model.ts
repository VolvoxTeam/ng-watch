import { IMapping } from '../mapping.model';

export interface ISyncState {
    activeMapping: IMapping;
    loading: boolean;
    watching: boolean;
    lastSynced: Date;
}