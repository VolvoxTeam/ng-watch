import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// tslint:disable:typedef
const routes: Routes = [
    {
        path: 'mappings',
        loadChildren: () => import('./pages/mappings/mappings.module').then(m => m.MappingsModule),
    },
    {
        path: 'sync',
        loadChildren: () => import('./pages/sync/sync.module').then(m => m.SyncModule),
    },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ],
})
export class AppRoutingModule {
}
