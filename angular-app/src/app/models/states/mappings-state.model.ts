import { IMapping } from '../mapping.model';

export interface IMappingsState {
    loading: boolean;
    saving: boolean;
    mappings: IMapping[];
}