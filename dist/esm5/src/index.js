import { __extends } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgxGalleryActionComponent } from './ngx-gallery-action.component';
import { NgxGalleryArrowsComponent } from './ngx-gallery-arrows.component';
import { NgxGalleryBulletsComponent } from './ngx-gallery-bullets.component';
import { NgxGalleryImageComponent } from './ngx-gallery-image.component';
import { NgxGalleryThumbnailsComponent } from './ngx-gallery-thumbnails.component';
import { NgxGalleryPreviewComponent } from './ngx-gallery-preview.component';
import { NgxGalleryComponent } from './ngx-gallery.component';
export * from './ngx-gallery.component';
export * from './ngx-gallery-action.component';
export * from './ngx-gallery-image.component';
export * from './ngx-gallery-thumbnails.component';
export * from './ngx-gallery-preview.component';
export * from './ngx-gallery-arrows.component';
export * from './ngx-gallery-bullets.component';
export * from './ngx-gallery-options.model';
export * from './ngx-gallery-image.model';
export * from './ngx-gallery-animation.model';
export * from './ngx-gallery-helper.service';
export * from './ngx-gallery-image-size.model';
export * from './ngx-gallery-layout.model';
export * from './ngx-gallery-order.model';
export * from './ngx-gallery-ordered-image.model';
export * from './ngx-gallery-action.model';
var CustomHammerConfig = /** @class */ (function (_super) {
    __extends(CustomHammerConfig, _super);
    function CustomHammerConfig() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.overrides = {
            'pinch': { enable: false },
            'rotate': { enable: false }
        };
        return _this;
    }
    return CustomHammerConfig;
}(HammerGestureConfig));
export { CustomHammerConfig };
var NgxGalleryModule = /** @class */ (function () {
    function NgxGalleryModule() {
    }
    NgxGalleryModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule
                    ],
                    declarations: [
                        NgxGalleryActionComponent,
                        NgxGalleryArrowsComponent,
                        NgxGalleryBulletsComponent,
                        NgxGalleryImageComponent,
                        NgxGalleryThumbnailsComponent,
                        NgxGalleryPreviewComponent,
                        NgxGalleryComponent
                    ],
                    exports: [
                        NgxGalleryComponent
                    ],
                    providers: [
                        { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig }
                    ]
                },] }
    ];
    return NgxGalleryModule;
}());
export { NgxGalleryModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZ2FsbGVyeS8iLCJzb3VyY2VzIjpbInNyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBdUIsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRXZGLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQzdFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ25GLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQzdFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRTlELGNBQWMseUJBQXlCLENBQUM7QUFDeEMsY0FBYyxnQ0FBZ0MsQ0FBQztBQUMvQyxjQUFjLCtCQUErQixDQUFDO0FBQzlDLGNBQWMsb0NBQW9DLENBQUM7QUFDbkQsY0FBYyxpQ0FBaUMsQ0FBQztBQUNoRCxjQUFjLGdDQUFnQyxDQUFDO0FBQy9DLGNBQWMsaUNBQWlDLENBQUM7QUFDaEQsY0FBYyw2QkFBNkIsQ0FBQztBQUM1QyxjQUFjLDJCQUEyQixDQUFDO0FBQzFDLGNBQWMsK0JBQStCLENBQUM7QUFDOUMsY0FBYyw4QkFBOEIsQ0FBQztBQUM3QyxjQUFjLGdDQUFnQyxDQUFDO0FBQy9DLGNBQWMsNEJBQTRCLENBQUM7QUFDM0MsY0FBYywyQkFBMkIsQ0FBQztBQUMxQyxjQUFjLG1DQUFtQyxDQUFDO0FBQ2xELGNBQWMsNEJBQTRCLENBQUM7QUFFM0M7SUFBd0Msc0NBQW1CO0lBQTNEO1FBQUEscUVBS0M7UUFKRyxlQUFTLEdBQVE7WUFDYixPQUFPLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO1lBQzFCLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7U0FDOUIsQ0FBQzs7SUFDTixDQUFDO0lBQUQseUJBQUM7QUFBRCxDQUFDLEFBTEQsQ0FBd0MsbUJBQW1CLEdBSzFEOztBQUVEO0lBQUE7SUFvQitCLENBQUM7O2dCQXBCL0IsUUFBUSxTQUFDO29CQUNOLE9BQU8sRUFBRTt3QkFDTCxZQUFZO3FCQUNmO29CQUNELFlBQVksRUFBRTt3QkFDVix5QkFBeUI7d0JBQ3pCLHlCQUF5Qjt3QkFDekIsMEJBQTBCO3dCQUMxQix3QkFBd0I7d0JBQ3hCLDZCQUE2Qjt3QkFDN0IsMEJBQTBCO3dCQUMxQixtQkFBbUI7cUJBQ3RCO29CQUNELE9BQU8sRUFBRTt3QkFDTCxtQkFBbUI7cUJBQ3RCO29CQUNELFNBQVMsRUFBRTt3QkFDUCxFQUFFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxRQUFRLEVBQUUsa0JBQWtCLEVBQUU7cUJBQ25FO2lCQUNKOztJQUM4Qix1QkFBQztDQUFBLEFBcEJoQyxJQW9CZ0M7U0FBbkIsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBIYW1tZXJHZXN0dXJlQ29uZmlnLCBIQU1NRVJfR0VTVFVSRV9DT05GSUcgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcblxuaW1wb3J0IHsgTmd4R2FsbGVyeUFjdGlvbkNvbXBvbmVudCB9IGZyb20gJy4vbmd4LWdhbGxlcnktYWN0aW9uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ3hHYWxsZXJ5QXJyb3dzQ29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtZ2FsbGVyeS1hcnJvd3MuY29tcG9uZW50JztcbmltcG9ydCB7IE5neEdhbGxlcnlCdWxsZXRzQ29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtZ2FsbGVyeS1idWxsZXRzLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ3hHYWxsZXJ5SW1hZ2VDb21wb25lbnQgfSBmcm9tICcuL25neC1nYWxsZXJ5LWltYWdlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ3hHYWxsZXJ5VGh1bWJuYWlsc0NvbXBvbmVudCB9IGZyb20gJy4vbmd4LWdhbGxlcnktdGh1bWJuYWlscy5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmd4R2FsbGVyeVByZXZpZXdDb21wb25lbnQgfSBmcm9tICcuL25neC1nYWxsZXJ5LXByZXZpZXcuY29tcG9uZW50JztcbmltcG9ydCB7IE5neEdhbGxlcnlDb21wb25lbnQgfSBmcm9tICcuL25neC1nYWxsZXJ5LmNvbXBvbmVudCc7XG5cbmV4cG9ydCAqIGZyb20gJy4vbmd4LWdhbGxlcnkuY29tcG9uZW50JztcbmV4cG9ydCAqIGZyb20gJy4vbmd4LWdhbGxlcnktYWN0aW9uLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL25neC1nYWxsZXJ5LWltYWdlLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL25neC1nYWxsZXJ5LXRodW1ibmFpbHMuY29tcG9uZW50JztcbmV4cG9ydCAqIGZyb20gJy4vbmd4LWdhbGxlcnktcHJldmlldy5jb21wb25lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9uZ3gtZ2FsbGVyeS1hcnJvd3MuY29tcG9uZW50JztcbmV4cG9ydCAqIGZyb20gJy4vbmd4LWdhbGxlcnktYnVsbGV0cy5jb21wb25lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9uZ3gtZ2FsbGVyeS1vcHRpb25zLm1vZGVsJztcbmV4cG9ydCAqIGZyb20gJy4vbmd4LWdhbGxlcnktaW1hZ2UubW9kZWwnO1xuZXhwb3J0ICogZnJvbSAnLi9uZ3gtZ2FsbGVyeS1hbmltYXRpb24ubW9kZWwnO1xuZXhwb3J0ICogZnJvbSAnLi9uZ3gtZ2FsbGVyeS1oZWxwZXIuc2VydmljZSc7XG5leHBvcnQgKiBmcm9tICcuL25neC1nYWxsZXJ5LWltYWdlLXNpemUubW9kZWwnO1xuZXhwb3J0ICogZnJvbSAnLi9uZ3gtZ2FsbGVyeS1sYXlvdXQubW9kZWwnO1xuZXhwb3J0ICogZnJvbSAnLi9uZ3gtZ2FsbGVyeS1vcmRlci5tb2RlbCc7XG5leHBvcnQgKiBmcm9tICcuL25neC1nYWxsZXJ5LW9yZGVyZWQtaW1hZ2UubW9kZWwnO1xuZXhwb3J0ICogZnJvbSAnLi9uZ3gtZ2FsbGVyeS1hY3Rpb24ubW9kZWwnO1xuXG5leHBvcnQgY2xhc3MgQ3VzdG9tSGFtbWVyQ29uZmlnIGV4dGVuZHMgSGFtbWVyR2VzdHVyZUNvbmZpZyAge1xuICAgIG92ZXJyaWRlcyA9IDxhbnk+e1xuICAgICAgICAncGluY2gnOiB7IGVuYWJsZTogZmFsc2UgfSxcbiAgICAgICAgJ3JvdGF0ZSc6IHsgZW5hYmxlOiBmYWxzZSB9XG4gICAgfTtcbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIENvbW1vbk1vZHVsZVxuICAgIF0sXG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIE5neEdhbGxlcnlBY3Rpb25Db21wb25lbnQsXG4gICAgICAgIE5neEdhbGxlcnlBcnJvd3NDb21wb25lbnQsXG4gICAgICAgIE5neEdhbGxlcnlCdWxsZXRzQ29tcG9uZW50LFxuICAgICAgICBOZ3hHYWxsZXJ5SW1hZ2VDb21wb25lbnQsXG4gICAgICAgIE5neEdhbGxlcnlUaHVtYm5haWxzQ29tcG9uZW50LFxuICAgICAgICBOZ3hHYWxsZXJ5UHJldmlld0NvbXBvbmVudCxcbiAgICAgICAgTmd4R2FsbGVyeUNvbXBvbmVudFxuICAgIF0sXG4gICAgZXhwb3J0czogW1xuICAgICAgICBOZ3hHYWxsZXJ5Q29tcG9uZW50XG4gICAgXSxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgeyBwcm92aWRlOiBIQU1NRVJfR0VTVFVSRV9DT05GSUcsIHVzZUNsYXNzOiBDdXN0b21IYW1tZXJDb25maWcgfVxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgTmd4R2FsbGVyeU1vZHVsZSB7fVxuIl19