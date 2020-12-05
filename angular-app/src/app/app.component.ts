import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { TranslateService } from '@ngx-translate/core';
import { I18nSupported, LoggerComponent, LoggerService, VolvoxTranslateService } from '@volvox-ng/core';
import { environment } from '../environments/environment';
import { SharedDataFacade } from './facades/shared-data.facade';

@Component({
    selector: 'ng-watch-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

    @ViewChild(MatSidenav)
    private sideNav: MatSidenav;

    @ViewChild(LoggerComponent)
    private set logger(logger: LoggerComponent) {
        this.myLoggerService.logger(logger, {
            debug: !environment.production,
            closeOnClick: true,
        });
    }

    constructor(
        private readonly myTranslateService: TranslateService,
        private readonly myVolvoxTranslateService: VolvoxTranslateService,
        private readonly myLoggerService: LoggerService,
        private readonly mySharedDataFacade: SharedDataFacade,
    ) {
    }

    public ngOnInit(): void {
        this.initI18n();
        this.loadMappings();
    }

    /**
     * Opens or closes the sidenav
     */
    public toggleSideNav(): void {
        this.sideNav.toggle().then();
    }

    /**
     * Loads all mappings
     * @private
     */
    private loadMappings(): void {
        this.mySharedDataFacade.loadMappings().toPromise().then();
    }

    /**
     * Initializes translation
     * @private
     */
    private initI18n(): void {
        this.myTranslateService.setDefaultLang('en-US');
        this.myVolvoxTranslateService.merge(I18nSupported.enUS).then((): void => {
        });
    }

}
