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
export class CustomHammerConfig extends HammerGestureConfig {
    constructor() {
        super(...arguments);
        this.overrides = {
            'pinch': { enable: false },
            'rotate': { enable: false }
        };
    }
}
export class NgxGalleryModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZ2FsbGVyeS8iLCJzb3VyY2VzIjpbInNyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUF1QixNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLG1CQUFtQixFQUFFLHFCQUFxQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFdkYsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDM0UsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDM0UsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDN0UsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDekUsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDbkYsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDN0UsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFOUQsY0FBYyx5QkFBeUIsQ0FBQztBQUN4QyxjQUFjLGdDQUFnQyxDQUFDO0FBQy9DLGNBQWMsK0JBQStCLENBQUM7QUFDOUMsY0FBYyxvQ0FBb0MsQ0FBQztBQUNuRCxjQUFjLGlDQUFpQyxDQUFDO0FBQ2hELGNBQWMsZ0NBQWdDLENBQUM7QUFDL0MsY0FBYyxpQ0FBaUMsQ0FBQztBQUNoRCxjQUFjLDZCQUE2QixDQUFDO0FBQzVDLGNBQWMsMkJBQTJCLENBQUM7QUFDMUMsY0FBYywrQkFBK0IsQ0FBQztBQUM5QyxjQUFjLDhCQUE4QixDQUFDO0FBQzdDLGNBQWMsZ0NBQWdDLENBQUM7QUFDL0MsY0FBYyw0QkFBNEIsQ0FBQztBQUMzQyxjQUFjLDJCQUEyQixDQUFDO0FBQzFDLGNBQWMsbUNBQW1DLENBQUM7QUFDbEQsY0FBYyw0QkFBNEIsQ0FBQztBQUUzQyxNQUFNLE9BQU8sa0JBQW1CLFNBQVEsbUJBQW1CO0lBQTNEOztRQUNJLGNBQVMsR0FBUTtZQUNiLE9BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7WUFDMUIsUUFBUSxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtTQUM5QixDQUFDO0lBQ04sQ0FBQztDQUFBO0FBc0JELE1BQU0sT0FBTyxnQkFBZ0I7OztZQXBCNUIsUUFBUSxTQUFDO2dCQUNOLE9BQU8sRUFBRTtvQkFDTCxZQUFZO2lCQUNmO2dCQUNELFlBQVksRUFBRTtvQkFDVix5QkFBeUI7b0JBQ3pCLHlCQUF5QjtvQkFDekIsMEJBQTBCO29CQUMxQix3QkFBd0I7b0JBQ3hCLDZCQUE2QjtvQkFDN0IsMEJBQTBCO29CQUMxQixtQkFBbUI7aUJBQ3RCO2dCQUNELE9BQU8sRUFBRTtvQkFDTCxtQkFBbUI7aUJBQ3RCO2dCQUNELFNBQVMsRUFBRTtvQkFDUCxFQUFFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxRQUFRLEVBQUUsa0JBQWtCLEVBQUU7aUJBQ25FO2FBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEhhbW1lckdlc3R1cmVDb25maWcsIEhBTU1FUl9HRVNUVVJFX0NPTkZJRyB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuXG5pbXBvcnQgeyBOZ3hHYWxsZXJ5QWN0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtZ2FsbGVyeS1hY3Rpb24uY29tcG9uZW50JztcbmltcG9ydCB7IE5neEdhbGxlcnlBcnJvd3NDb21wb25lbnQgfSBmcm9tICcuL25neC1nYWxsZXJ5LWFycm93cy5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmd4R2FsbGVyeUJ1bGxldHNDb21wb25lbnQgfSBmcm9tICcuL25neC1nYWxsZXJ5LWJ1bGxldHMuY29tcG9uZW50JztcbmltcG9ydCB7IE5neEdhbGxlcnlJbWFnZUNvbXBvbmVudCB9IGZyb20gJy4vbmd4LWdhbGxlcnktaW1hZ2UuY29tcG9uZW50JztcbmltcG9ydCB7IE5neEdhbGxlcnlUaHVtYm5haWxzQ29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtZ2FsbGVyeS10aHVtYm5haWxzLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ3hHYWxsZXJ5UHJldmlld0NvbXBvbmVudCB9IGZyb20gJy4vbmd4LWdhbGxlcnktcHJldmlldy5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmd4R2FsbGVyeUNvbXBvbmVudCB9IGZyb20gJy4vbmd4LWdhbGxlcnkuY29tcG9uZW50JztcblxuZXhwb3J0ICogZnJvbSAnLi9uZ3gtZ2FsbGVyeS5jb21wb25lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9uZ3gtZ2FsbGVyeS1hY3Rpb24uY29tcG9uZW50JztcbmV4cG9ydCAqIGZyb20gJy4vbmd4LWdhbGxlcnktaW1hZ2UuY29tcG9uZW50JztcbmV4cG9ydCAqIGZyb20gJy4vbmd4LWdhbGxlcnktdGh1bWJuYWlscy5jb21wb25lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9uZ3gtZ2FsbGVyeS1wcmV2aWV3LmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL25neC1nYWxsZXJ5LWFycm93cy5jb21wb25lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9uZ3gtZ2FsbGVyeS1idWxsZXRzLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL25neC1nYWxsZXJ5LW9wdGlvbnMubW9kZWwnO1xuZXhwb3J0ICogZnJvbSAnLi9uZ3gtZ2FsbGVyeS1pbWFnZS5tb2RlbCc7XG5leHBvcnQgKiBmcm9tICcuL25neC1nYWxsZXJ5LWFuaW1hdGlvbi5tb2RlbCc7XG5leHBvcnQgKiBmcm9tICcuL25neC1nYWxsZXJ5LWhlbHBlci5zZXJ2aWNlJztcbmV4cG9ydCAqIGZyb20gJy4vbmd4LWdhbGxlcnktaW1hZ2Utc2l6ZS5tb2RlbCc7XG5leHBvcnQgKiBmcm9tICcuL25neC1nYWxsZXJ5LWxheW91dC5tb2RlbCc7XG5leHBvcnQgKiBmcm9tICcuL25neC1nYWxsZXJ5LW9yZGVyLm1vZGVsJztcbmV4cG9ydCAqIGZyb20gJy4vbmd4LWdhbGxlcnktb3JkZXJlZC1pbWFnZS5tb2RlbCc7XG5leHBvcnQgKiBmcm9tICcuL25neC1nYWxsZXJ5LWFjdGlvbi5tb2RlbCc7XG5cbmV4cG9ydCBjbGFzcyBDdXN0b21IYW1tZXJDb25maWcgZXh0ZW5kcyBIYW1tZXJHZXN0dXJlQ29uZmlnICB7XG4gICAgb3ZlcnJpZGVzID0gPGFueT57XG4gICAgICAgICdwaW5jaCc6IHsgZW5hYmxlOiBmYWxzZSB9LFxuICAgICAgICAncm90YXRlJzogeyBlbmFibGU6IGZhbHNlIH1cbiAgICB9O1xufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtcbiAgICAgICAgQ29tbW9uTW9kdWxlXG4gICAgXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgTmd4R2FsbGVyeUFjdGlvbkNvbXBvbmVudCxcbiAgICAgICAgTmd4R2FsbGVyeUFycm93c0NvbXBvbmVudCxcbiAgICAgICAgTmd4R2FsbGVyeUJ1bGxldHNDb21wb25lbnQsXG4gICAgICAgIE5neEdhbGxlcnlJbWFnZUNvbXBvbmVudCxcbiAgICAgICAgTmd4R2FsbGVyeVRodW1ibmFpbHNDb21wb25lbnQsXG4gICAgICAgIE5neEdhbGxlcnlQcmV2aWV3Q29tcG9uZW50LFxuICAgICAgICBOZ3hHYWxsZXJ5Q29tcG9uZW50XG4gICAgXSxcbiAgICBleHBvcnRzOiBbXG4gICAgICAgIE5neEdhbGxlcnlDb21wb25lbnRcbiAgICBdLFxuICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7IHByb3ZpZGU6IEhBTU1FUl9HRVNUVVJFX0NPTkZJRywgdXNlQ2xhc3M6IEN1c3RvbUhhbW1lckNvbmZpZyB9XG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hHYWxsZXJ5TW9kdWxlIHt9XG4iXX0=