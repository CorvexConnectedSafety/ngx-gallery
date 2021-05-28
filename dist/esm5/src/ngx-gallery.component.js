import { __read, __spread } from "tslib";
import { Component, Input, HostListener, ViewChild, OnInit, HostBinding, DoCheck, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { NgxGalleryPreviewComponent } from './ngx-gallery-preview.component';
import { NgxGalleryImageComponent } from './ngx-gallery-image.component';
import { NgxGalleryThumbnailsComponent } from './ngx-gallery-thumbnails.component';
import { NgxGalleryHelperService } from './ngx-gallery-helper.service';
import { NgxGalleryOptions } from './ngx-gallery-options.model';
import { NgxGalleryLayout } from './ngx-gallery-layout.model';
import { NgxGalleryOrderedImage } from './ngx-gallery-ordered-image.model';
var NgxGalleryComponent = /** @class */ (function () {
    function NgxGalleryComponent(myElement) {
        this.myElement = myElement;
        this.imagesReady = new EventEmitter();
        this.change = new EventEmitter();
        this.previewOpen = new EventEmitter();
        this.previewClose = new EventEmitter();
        this.previewChange = new EventEmitter();
        this.oldImagesLength = 0;
        this.selectedIndex = 0;
        this.breakpoint = undefined;
        this.prevBreakpoint = undefined;
    }
    NgxGalleryComponent.prototype.ngOnInit = function () {
        this.options = this.options.map(function (opt) { return new NgxGalleryOptions(opt); });
        this.sortOptions();
        this.setBreakpoint();
        this.setOptions();
        this.checkFullWidth();
        if (this.currentOptions) {
            this.selectedIndex = this.currentOptions.startIndex;
        }
    };
    NgxGalleryComponent.prototype.ngDoCheck = function () {
        if (this.images !== undefined && (this.images.length !== this.oldImagesLength)
            || (this.images !== this.oldImages)) {
            this.oldImagesLength = this.images.length;
            this.oldImages = this.images;
            this.setOptions();
            this.setImages();
            if (this.images && this.images.length) {
                this.imagesReady.emit();
            }
            if (this.image) {
                this.image.reset(this.currentOptions.startIndex);
            }
            if (this.currentOptions.thumbnailsAutoHide && this.currentOptions.thumbnails
                && this.images.length <= 1) {
                this.currentOptions.thumbnails = false;
                this.currentOptions.imageArrows = false;
            }
            this.resetThumbnails();
        }
    };
    NgxGalleryComponent.prototype.ngAfterViewInit = function () {
        this.checkFullWidth();
    };
    NgxGalleryComponent.prototype.onResize = function () {
        var _this = this;
        this.setBreakpoint();
        if (this.prevBreakpoint !== this.breakpoint) {
            this.setOptions();
            this.resetThumbnails();
        }
        if (this.currentOptions && this.currentOptions.fullWidth) {
            if (this.fullWidthTimeout) {
                clearTimeout(this.fullWidthTimeout);
            }
            this.fullWidthTimeout = setTimeout(function () {
                _this.checkFullWidth();
            }, 200);
        }
    };
    NgxGalleryComponent.prototype.getImageHeight = function () {
        return (this.currentOptions && this.currentOptions.thumbnails) ?
            this.currentOptions.imagePercent + '%' : '100%';
    };
    NgxGalleryComponent.prototype.getThumbnailsHeight = function () {
        if (this.currentOptions && this.currentOptions.image) {
            return 'calc(' + this.currentOptions.thumbnailsPercent + '% - '
                + this.currentOptions.thumbnailsMargin + 'px)';
        }
        else {
            return '100%';
        }
    };
    NgxGalleryComponent.prototype.getThumbnailsMarginTop = function () {
        if (this.currentOptions && this.currentOptions.layout === NgxGalleryLayout.ThumbnailsBottom) {
            return this.currentOptions.thumbnailsMargin + 'px';
        }
        else {
            return '0px';
        }
    };
    NgxGalleryComponent.prototype.getThumbnailsMarginBottom = function () {
        if (this.currentOptions && this.currentOptions.layout === NgxGalleryLayout.ThumbnailsTop) {
            return this.currentOptions.thumbnailsMargin + 'px';
        }
        else {
            return '0px';
        }
    };
    NgxGalleryComponent.prototype.openPreview = function (index) {
        if (this.currentOptions.previewCustom) {
            this.currentOptions.previewCustom(index);
        }
        else {
            this.previewEnabled = true;
            this.preview.open(index);
        }
    };
    NgxGalleryComponent.prototype.onPreviewOpen = function () {
        this.previewOpen.emit();
        if (this.image && this.image.autoPlay) {
            this.image.stopAutoPlay();
        }
    };
    NgxGalleryComponent.prototype.onPreviewClose = function () {
        this.previewEnabled = false;
        this.previewClose.emit();
        if (this.image && this.image.autoPlay) {
            this.image.startAutoPlay();
        }
    };
    NgxGalleryComponent.prototype.selectFromImage = function (index) {
        this.select(index);
    };
    NgxGalleryComponent.prototype.selectFromThumbnails = function (index) {
        this.select(index);
        if (this.currentOptions && this.currentOptions.thumbnails && this.currentOptions.preview
            && (!this.currentOptions.image || this.currentOptions.thumbnailsRemainingCount)) {
            this.openPreview(this.selectedIndex);
        }
    };
    NgxGalleryComponent.prototype.show = function (index) {
        this.select(index);
    };
    NgxGalleryComponent.prototype.showNext = function () {
        this.image.showNext();
    };
    NgxGalleryComponent.prototype.showPrev = function () {
        this.image.showPrev();
    };
    NgxGalleryComponent.prototype.canShowNext = function () {
        if (this.images && this.currentOptions) {
            return (this.currentOptions.imageInfinityMove || this.selectedIndex < this.images.length - 1)
                ? true : false;
        }
        else {
            return false;
        }
    };
    NgxGalleryComponent.prototype.canShowPrev = function () {
        if (this.images && this.currentOptions) {
            return (this.currentOptions.imageInfinityMove || this.selectedIndex > 0) ? true : false;
        }
        else {
            return false;
        }
    };
    NgxGalleryComponent.prototype.previewSelect = function (index) {
        this.previewChange.emit({ index: index, image: this.images[index] });
    };
    NgxGalleryComponent.prototype.moveThumbnailsRight = function () {
        this.thubmnails.moveRight();
    };
    NgxGalleryComponent.prototype.moveThumbnailsLeft = function () {
        this.thubmnails.moveLeft();
    };
    NgxGalleryComponent.prototype.canMoveThumbnailsRight = function () {
        return this.thubmnails.canMoveRight();
    };
    NgxGalleryComponent.prototype.canMoveThumbnailsLeft = function () {
        return this.thubmnails.canMoveLeft();
    };
    NgxGalleryComponent.prototype.resetThumbnails = function () {
        if (this.thubmnails) {
            this.thubmnails.reset(this.currentOptions.startIndex);
        }
    };
    NgxGalleryComponent.prototype.select = function (index) {
        this.selectedIndex = index;
        this.change.emit({
            index: index,
            image: this.images[index]
        });
    };
    NgxGalleryComponent.prototype.checkFullWidth = function () {
        if (this.currentOptions && this.currentOptions.fullWidth) {
            this.width = document.body.clientWidth + 'px';
            this.left = (-(document.body.clientWidth -
                this.myElement.nativeElement.parentNode.innerWidth) / 2) + 'px';
        }
    };
    NgxGalleryComponent.prototype.setImages = function () {
        this.smallImages = this.images.map(function (img) { return img.small; });
        this.mediumImages = this.images.map(function (img, i) { return new NgxGalleryOrderedImage({
            src: img.medium,
            index: i
        }); });
        this.bigImages = this.images.map(function (img) { return img.big; });
        this.descriptions = this.images.map(function (img) { return img.description; });
        this.links = this.images.map(function (img) { return img.url; });
        this.labels = this.images.map(function (img) { return img.label; });
    };
    NgxGalleryComponent.prototype.setBreakpoint = function () {
        this.prevBreakpoint = this.breakpoint;
        var breakpoints;
        if (typeof window !== 'undefined') {
            breakpoints = this.options.filter(function (opt) { return opt.breakpoint >= window.innerWidth; })
                .map(function (opt) { return opt.breakpoint; });
        }
        if (breakpoints && breakpoints.length) {
            this.breakpoint = breakpoints.pop();
        }
        else {
            this.breakpoint = undefined;
        }
    };
    NgxGalleryComponent.prototype.sortOptions = function () {
        this.options = __spread(this.options.filter(function (a) { return a.breakpoint === undefined; }), this.options
            .filter(function (a) { return a.breakpoint !== undefined; })
            .sort(function (a, b) { return b.breakpoint - a.breakpoint; }));
    };
    NgxGalleryComponent.prototype.setOptions = function () {
        var _this = this;
        this.currentOptions = new NgxGalleryOptions({});
        this.options
            .filter(function (opt) { return opt.breakpoint === undefined || opt.breakpoint >= _this.breakpoint; })
            .map(function (opt) { return _this.combineOptions(_this.currentOptions, opt); });
        this.width = this.currentOptions.width;
        this.height = this.currentOptions.height;
    };
    NgxGalleryComponent.prototype.combineOptions = function (first, second) {
        Object.keys(second).map(function (val) { return first[val] = second[val] !== undefined ? second[val] : first[val]; });
    };
    NgxGalleryComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    NgxGalleryComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-gallery',
                    template: "\n    <div class=\"ngx-gallery-layout {{currentOptions?.layout}}\">\n        <ngx-gallery-image *ngIf=\"currentOptions?.image\" [style.height]=\"getImageHeight()\" [images]=\"mediumImages\" [clickable]=\"currentOptions?.preview\" [selectedIndex]=\"selectedIndex\" [arrows]=\"currentOptions?.imageArrows\" [arrowsAutoHide]=\"currentOptions?.imageArrowsAutoHide\" [arrowPrevIcon]=\"currentOptions?.arrowPrevIcon\" [arrowNextIcon]=\"currentOptions?.arrowNextIcon\" [swipe]=\"currentOptions?.imageSwipe\" [animation]=\"currentOptions?.imageAnimation\" [size]=\"currentOptions?.imageSize\" [autoPlay]=\"currentOptions?.imageAutoPlay\" [autoPlayInterval]=\"currentOptions?.imageAutoPlayInterval\" [autoPlayPauseOnHover]=\"currentOptions?.imageAutoPlayPauseOnHover\" [infinityMove]=\"currentOptions?.imageInfinityMove\"  [lazyLoading]=\"currentOptions?.lazyLoading\" [actions]=\"currentOptions?.imageActions\" [descriptions]=\"descriptions\" [showDescription]=\"currentOptions?.imageDescription\" [bullets]=\"currentOptions?.imageBullets\" (onClick)=\"openPreview($event)\" (onActiveChange)=\"selectFromImage($event)\"></ngx-gallery-image>\n\n        <ngx-gallery-thumbnails *ngIf=\"currentOptions?.thumbnails\" [style.marginTop]=\"getThumbnailsMarginTop()\" [style.marginBottom]=\"getThumbnailsMarginBottom()\" [style.height]=\"getThumbnailsHeight()\" [images]=\"smallImages\" [links]=\"currentOptions?.thumbnailsAsLinks ? links : []\" [labels]=\"labels\" [linkTarget]=\"currentOptions?.linkTarget\" [selectedIndex]=\"selectedIndex\" [columns]=\"currentOptions?.thumbnailsColumns\" [rows]=\"currentOptions?.thumbnailsRows\" [margin]=\"currentOptions?.thumbnailMargin\" [arrows]=\"currentOptions?.thumbnailsArrows\" [arrowsAutoHide]=\"currentOptions?.thumbnailsArrowsAutoHide\" [arrowPrevIcon]=\"currentOptions?.arrowPrevIcon\" [arrowNextIcon]=\"currentOptions?.arrowNextIcon\" [clickable]=\"currentOptions?.image || currentOptions?.preview\" [swipe]=\"currentOptions?.thumbnailsSwipe\" [size]=\"currentOptions?.thumbnailSize\" [moveSize]=\"currentOptions?.thumbnailsMoveSize\" [order]=\"currentOptions?.thumbnailsOrder\" [remainingCount]=\"currentOptions?.thumbnailsRemainingCount\" [lazyLoading]=\"currentOptions?.lazyLoading\" [actions]=\"currentOptions?.thumbnailActions\"  (onActiveChange)=\"selectFromThumbnails($event)\"></ngx-gallery-thumbnails>\n\n        <ngx-gallery-preview [images]=\"bigImages\" [descriptions]=\"descriptions\" [showDescription]=\"currentOptions?.previewDescription\" [arrowPrevIcon]=\"currentOptions?.arrowPrevIcon\" [arrowNextIcon]=\"currentOptions?.arrowNextIcon\" [closeIcon]=\"currentOptions?.closeIcon\" [fullscreenIcon]=\"currentOptions?.fullscreenIcon\" [spinnerIcon]=\"currentOptions?.spinnerIcon\" [arrows]=\"currentOptions?.previewArrows\" [arrowsAutoHide]=\"currentOptions?.previewArrowsAutoHide\" [swipe]=\"currentOptions?.previewSwipe\" [fullscreen]=\"currentOptions?.previewFullscreen\" [forceFullscreen]=\"currentOptions?.previewForceFullscreen\" [closeOnClick]=\"currentOptions?.previewCloseOnClick\" [closeOnEsc]=\"currentOptions?.previewCloseOnEsc\" [keyboardNavigation]=\"currentOptions?.previewKeyboardNavigation\" [animation]=\"currentOptions?.previewAnimation\" [autoPlay]=\"currentOptions?.previewAutoPlay\" [autoPlayInterval]=\"currentOptions?.previewAutoPlayInterval\" [autoPlayPauseOnHover]=\"currentOptions?.previewAutoPlayPauseOnHover\" [infinityMove]=\"currentOptions?.previewInfinityMove\" [zoom]=\"currentOptions?.previewZoom\" [zoomStep]=\"currentOptions?.previewZoomStep\" [zoomMax]=\"currentOptions?.previewZoomMax\" [zoomMin]=\"currentOptions?.previewZoomMin\" [zoomInIcon]=\"currentOptions?.zoomInIcon\" [zoomOutIcon]=\"currentOptions?.zoomOutIcon\" [actions]=\"currentOptions?.actions\" [rotate]=\"currentOptions?.previewRotate\" [rotateLeftIcon]=\"currentOptions?.rotateLeftIcon\" [rotateRightIcon]=\"currentOptions?.rotateRightIcon\" [download]=\"currentOptions?.previewDownload\" [downloadIcon]=\"currentOptions?.downloadIcon\" [bullets]=\"currentOptions?.previewBullets\" (onClose)=\"onPreviewClose()\" (onOpen)=\"onPreviewOpen()\" (onActiveChange)=\"previewSelect($event)\" [class.ngx-gallery-active]=\"previewEnabled\"></ngx-gallery-preview>\n    </div>\n    ",
                    providers: [NgxGalleryHelperService],
                    styles: [":host{display:inline-block}:host>*{float:left}:host /deep/ *{box-sizing:border-box}:host /deep/ .ngx-gallery-icon{color:#fff;font-size:25px;position:absolute;z-index:2000;display:inline-block}:host /deep/ .ngx-gallery-icon .ngx-gallery-icon-content{display:block}:host /deep/ .ngx-gallery-clickable{cursor:pointer}:host /deep/ .ngx-gallery-icons-wrapper .ngx-gallery-icon{position:relative;margin-right:5px;margin-top:5px;font-size:20px;cursor:pointer}:host /deep/ .ngx-gallery-icons-wrapper{float:right}:host .ngx-gallery-layout{width:100%;height:100%;display:flex;flex-direction:column}:host .ngx-gallery-layout.thumbnails-top ngx-gallery-image{order:2}:host .ngx-gallery-layout.thumbnails-top ngx-gallery-thumbnails{order:1}:host .ngx-gallery-layout.thumbnails-bottom ngx-gallery-image{order:1}:host .ngx-gallery-layout.thumbnails-bottom ngx-gallery-thumbnails{order:2}"]
                },] }
    ];
    NgxGalleryComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    NgxGalleryComponent.propDecorators = {
        options: [{ type: Input }],
        images: [{ type: Input }],
        imagesReady: [{ type: Output }],
        change: [{ type: Output }],
        previewOpen: [{ type: Output }],
        previewClose: [{ type: Output }],
        previewChange: [{ type: Output }],
        preview: [{ type: ViewChild, args: [NgxGalleryPreviewComponent,] }],
        image: [{ type: ViewChild, args: [NgxGalleryImageComponent,] }],
        thubmnails: [{ type: ViewChild, args: [NgxGalleryThumbnailsComponent,] }],
        width: [{ type: HostBinding, args: ['style.width',] }],
        height: [{ type: HostBinding, args: ['style.height',] }],
        left: [{ type: HostBinding, args: ['style.left',] }],
        onResize: [{ type: HostListener, args: ['window:resize',] }]
    };
    return NgxGalleryComponent;
}());
export { NgxGalleryComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnkuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWdhbGxlcnkvIiwic291cmNlcyI6WyJzcmMvbmd4LWdhbGxlcnkuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFDdEQsV0FBVyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHakcsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDN0UsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDekUsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDbkYsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFFdkUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFFaEUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDOUQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFFM0U7SUFtREksNkJBQW9CLFNBQXFCO1FBQXJCLGNBQVMsR0FBVCxTQUFTLENBQVk7UUFqQy9CLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNqQyxXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQThDLENBQUM7UUFDeEUsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2pDLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNsQyxrQkFBYSxHQUFHLElBQUksWUFBWSxFQUE4QyxDQUFDO1FBVXpGLG9CQUFlLEdBQUcsQ0FBQyxDQUFDO1FBRXBCLGtCQUFhLEdBQUcsQ0FBQyxDQUFDO1FBS1Ys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dGVuZXIsIFZpZXdDaGlsZCwgT25Jbml0LFxuICAgIEhvc3RCaW5kaW5nLCBEb0NoZWNrLCBFbGVtZW50UmVmLCBBZnRlclZpZXdJbml0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU2FmZVJlc291cmNlVXJsIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5cbmltcG9ydCB7IE5neEdhbGxlcnlQcmV2aWV3Q29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtZ2FsbGVyeS1wcmV2aWV3LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ3hHYWxsZXJ5SW1hZ2VDb21wb25lbnQgfSBmcm9tICcuL25neC1nYWxsZXJ5LWltYWdlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ3hHYWxsZXJ5VGh1bWJuYWlsc0NvbXBvbmVudCB9IGZyb20gJy4vbmd4LWdhbGxlcnktdGh1bWJuYWlscy5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmd4R2FsbGVyeUhlbHBlclNlcnZpY2UgfSBmcm9tICcuL25neC1nYWxsZXJ5LWhlbHBlci5zZXJ2aWNlJztcblxuaW1wb3J0IHsgTmd4R2FsbGVyeU9wdGlvbnMgfSBmcm9tICcuL25neC1nYWxsZXJ5LW9wdGlvbnMubW9kZWwnO1xuaW1wb3J0IHsgTmd4R2FsbGVyeUltYWdlIH0gZnJvbSAnLi9uZ3gtZ2FsbGVyeS1pbWFnZS5tb2RlbCc7XG5pbXBvcnQgeyBOZ3hHYWxsZXJ5TGF5b3V0IH0gZnJvbSAnLi9uZ3gtZ2FsbGVyeS1sYXlvdXQubW9kZWwnO1xuaW1wb3J0IHsgTmd4R2FsbGVyeU9yZGVyZWRJbWFnZSB9IGZyb20gJy4vbmd4LWdhbGxlcnktb3JkZXJlZC1pbWFnZS5tb2RlbCc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnbmd4LWdhbGxlcnknLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cIm5neC1nYWxsZXJ5LWxheW91dCB7e2N1cnJlbnRPcHRpb25zPy5sYXlvdXR9fVwiPlxuICAgICAgICA8bmd4LWdhbGxlcnktaW1hZ2UgKm5nSWY9XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VcIiBbc3R5bGUuaGVpZ2h0XT1cImdldEltYWdlSGVpZ2h0KClcIiBbaW1hZ2VzXT1cIm1lZGl1bUltYWdlc1wiIFtjbGlja2FibGVdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdcIiBbc2VsZWN0ZWRJbmRleF09XCJzZWxlY3RlZEluZGV4XCIgW2Fycm93c109XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VBcnJvd3NcIiBbYXJyb3dzQXV0b0hpZGVdPVwiY3VycmVudE9wdGlvbnM/LmltYWdlQXJyb3dzQXV0b0hpZGVcIiBbYXJyb3dQcmV2SWNvbl09XCJjdXJyZW50T3B0aW9ucz8uYXJyb3dQcmV2SWNvblwiIFthcnJvd05leHRJY29uXT1cImN1cnJlbnRPcHRpb25zPy5hcnJvd05leHRJY29uXCIgW3N3aXBlXT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZVN3aXBlXCIgW2FuaW1hdGlvbl09XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VBbmltYXRpb25cIiBbc2l6ZV09XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VTaXplXCIgW2F1dG9QbGF5XT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZUF1dG9QbGF5XCIgW2F1dG9QbGF5SW50ZXJ2YWxdPVwiY3VycmVudE9wdGlvbnM/LmltYWdlQXV0b1BsYXlJbnRlcnZhbFwiIFthdXRvUGxheVBhdXNlT25Ib3Zlcl09XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VBdXRvUGxheVBhdXNlT25Ib3ZlclwiIFtpbmZpbml0eU1vdmVdPVwiY3VycmVudE9wdGlvbnM/LmltYWdlSW5maW5pdHlNb3ZlXCIgIFtsYXp5TG9hZGluZ109XCJjdXJyZW50T3B0aW9ucz8ubGF6eUxvYWRpbmdcIiBbYWN0aW9uc109XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VBY3Rpb25zXCIgW2Rlc2NyaXB0aW9uc109XCJkZXNjcmlwdGlvbnNcIiBbc2hvd0Rlc2NyaXB0aW9uXT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZURlc2NyaXB0aW9uXCIgW2J1bGxldHNdPVwiY3VycmVudE9wdGlvbnM/LmltYWdlQnVsbGV0c1wiIChvbkNsaWNrKT1cIm9wZW5QcmV2aWV3KCRldmVudClcIiAob25BY3RpdmVDaGFuZ2UpPVwic2VsZWN0RnJvbUltYWdlKCRldmVudClcIj48L25neC1nYWxsZXJ5LWltYWdlPlxuXG4gICAgICAgIDxuZ3gtZ2FsbGVyeS10aHVtYm5haWxzICpuZ0lmPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbHNcIiBbc3R5bGUubWFyZ2luVG9wXT1cImdldFRodW1ibmFpbHNNYXJnaW5Ub3AoKVwiIFtzdHlsZS5tYXJnaW5Cb3R0b21dPVwiZ2V0VGh1bWJuYWlsc01hcmdpbkJvdHRvbSgpXCIgW3N0eWxlLmhlaWdodF09XCJnZXRUaHVtYm5haWxzSGVpZ2h0KClcIiBbaW1hZ2VzXT1cInNtYWxsSW1hZ2VzXCIgW2xpbmtzXT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxzQXNMaW5rcyA/IGxpbmtzIDogW11cIiBbbGFiZWxzXT1cImxhYmVsc1wiIFtsaW5rVGFyZ2V0XT1cImN1cnJlbnRPcHRpb25zPy5saW5rVGFyZ2V0XCIgW3NlbGVjdGVkSW5kZXhdPVwic2VsZWN0ZWRJbmRleFwiIFtjb2x1bW5zXT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxzQ29sdW1uc1wiIFtyb3dzXT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxzUm93c1wiIFttYXJnaW5dPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbE1hcmdpblwiIFthcnJvd3NdPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbHNBcnJvd3NcIiBbYXJyb3dzQXV0b0hpZGVdPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbHNBcnJvd3NBdXRvSGlkZVwiIFthcnJvd1ByZXZJY29uXT1cImN1cnJlbnRPcHRpb25zPy5hcnJvd1ByZXZJY29uXCIgW2Fycm93TmV4dEljb25dPVwiY3VycmVudE9wdGlvbnM/LmFycm93TmV4dEljb25cIiBbY2xpY2thYmxlXT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZSB8fCBjdXJyZW50T3B0aW9ucz8ucHJldmlld1wiIFtzd2lwZV09XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsc1N3aXBlXCIgW3NpemVdPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbFNpemVcIiBbbW92ZVNpemVdPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbHNNb3ZlU2l6ZVwiIFtvcmRlcl09XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsc09yZGVyXCIgW3JlbWFpbmluZ0NvdW50XT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxzUmVtYWluaW5nQ291bnRcIiBbbGF6eUxvYWRpbmddPVwiY3VycmVudE9wdGlvbnM/LmxhenlMb2FkaW5nXCIgW2FjdGlvbnNdPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbEFjdGlvbnNcIiAgKG9uQWN0aXZlQ2hhbmdlKT1cInNlbGVjdEZyb21UaHVtYm5haWxzKCRldmVudClcIj48L25neC1nYWxsZXJ5LXRodW1ibmFpbHM+XG5cbiAgICAgICAgPG5neC1nYWxsZXJ5LXByZXZpZXcgW2ltYWdlc109XCJiaWdJbWFnZXNcIiBbZGVzY3JpcHRpb25zXT1cImRlc2NyaXB0aW9uc1wiIFtzaG93RGVzY3JpcHRpb25dPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdEZXNjcmlwdGlvblwiIFthcnJvd1ByZXZJY29uXT1cImN1cnJlbnRPcHRpb25zPy5hcnJvd1ByZXZJY29uXCIgW2Fycm93TmV4dEljb25dPVwiY3VycmVudE9wdGlvbnM/LmFycm93TmV4dEljb25cIiBbY2xvc2VJY29uXT1cImN1cnJlbnRPcHRpb25zPy5jbG9zZUljb25cIiBbZnVsbHNjcmVlbkljb25dPVwiY3VycmVudE9wdGlvbnM/LmZ1bGxzY3JlZW5JY29uXCIgW3NwaW5uZXJJY29uXT1cImN1cnJlbnRPcHRpb25zPy5zcGlubmVySWNvblwiIFthcnJvd3NdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdBcnJvd3NcIiBbYXJyb3dzQXV0b0hpZGVdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdBcnJvd3NBdXRvSGlkZVwiIFtzd2lwZV09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld1N3aXBlXCIgW2Z1bGxzY3JlZW5dPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdGdWxsc2NyZWVuXCIgW2ZvcmNlRnVsbHNjcmVlbl09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0ZvcmNlRnVsbHNjcmVlblwiIFtjbG9zZU9uQ2xpY2tdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdDbG9zZU9uQ2xpY2tcIiBbY2xvc2VPbkVzY109XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0Nsb3NlT25Fc2NcIiBba2V5Ym9hcmROYXZpZ2F0aW9uXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3S2V5Ym9hcmROYXZpZ2F0aW9uXCIgW2FuaW1hdGlvbl09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0FuaW1hdGlvblwiIFthdXRvUGxheV09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0F1dG9QbGF5XCIgW2F1dG9QbGF5SW50ZXJ2YWxdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdBdXRvUGxheUludGVydmFsXCIgW2F1dG9QbGF5UGF1c2VPbkhvdmVyXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3QXV0b1BsYXlQYXVzZU9uSG92ZXJcIiBbaW5maW5pdHlNb3ZlXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3SW5maW5pdHlNb3ZlXCIgW3pvb21dPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdab29tXCIgW3pvb21TdGVwXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3Wm9vbVN0ZXBcIiBbem9vbU1heF09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld1pvb21NYXhcIiBbem9vbU1pbl09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld1pvb21NaW5cIiBbem9vbUluSWNvbl09XCJjdXJyZW50T3B0aW9ucz8uem9vbUluSWNvblwiIFt6b29tT3V0SWNvbl09XCJjdXJyZW50T3B0aW9ucz8uem9vbU91dEljb25cIiBbYWN0aW9uc109XCJjdXJyZW50T3B0aW9ucz8uYWN0aW9uc1wiIFtyb3RhdGVdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdSb3RhdGVcIiBbcm90YXRlTGVmdEljb25dPVwiY3VycmVudE9wdGlvbnM/LnJvdGF0ZUxlZnRJY29uXCIgW3JvdGF0ZVJpZ2h0SWNvbl09XCJjdXJyZW50T3B0aW9ucz8ucm90YXRlUmlnaHRJY29uXCIgW2Rvd25sb2FkXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3RG93bmxvYWRcIiBbZG93bmxvYWRJY29uXT1cImN1cnJlbnRPcHRpb25zPy5kb3dubG9hZEljb25cIiBbYnVsbGV0c109XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0J1bGxldHNcIiAob25DbG9zZSk9XCJvblByZXZpZXdDbG9zZSgpXCIgKG9uT3Blbik9XCJvblByZXZpZXdPcGVuKClcIiAob25BY3RpdmVDaGFuZ2UpPVwicHJldmlld1NlbGVjdCgkZXZlbnQpXCIgW2NsYXNzLm5neC1nYWxsZXJ5LWFjdGl2ZV09XCJwcmV2aWV3RW5hYmxlZFwiPjwvbmd4LWdhbGxlcnktcHJldmlldz5cbiAgICA8L2Rpdj5cbiAgICBgLFxuICAgIHN0eWxlVXJsczogWycuL25neC1nYWxsZXJ5LmNvbXBvbmVudC5zY3NzJ10sXG4gICAgcHJvdmlkZXJzOiBbTmd4R2FsbGVyeUhlbHBlclNlcnZpY2VdXG59KVxuZXhwb3J0IGNsYXNzIE5neEdhbGxlcnlDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIERvQ2hlY2ssIEFmdGVyVmlld0luaXQgICB7XG4gICAgQElucHV0KCkgb3B0aW9uczogTmd4R2FsbGVyeU9wdGlvbnNbXTtcbiAgICBASW5wdXQoKSBpbWFnZXM6IE5neEdhbGxlcnlJbWFnZVtdO1xuXG4gICAgQE91dHB1dCgpIGltYWdlc1JlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIEBPdXRwdXQoKSBjaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPHsgaW5kZXg6IG51bWJlcjsgaW1hZ2U6IE5neEdhbGxlcnlJbWFnZTsgfT4oKTtcbiAgICBAT3V0cHV0KCkgcHJldmlld09wZW4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgQE91dHB1dCgpIHByZXZpZXdDbG9zZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICBAT3V0cHV0KCkgcHJldmlld0NoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8eyBpbmRleDogbnVtYmVyOyBpbWFnZTogTmd4R2FsbGVyeUltYWdlOyB9PigpO1xuXG4gICAgc21hbGxJbWFnZXM6IHN0cmluZ1tdIHwgU2FmZVJlc291cmNlVXJsW107XG4gICAgbWVkaXVtSW1hZ2VzOiBOZ3hHYWxsZXJ5T3JkZXJlZEltYWdlW107XG4gICAgYmlnSW1hZ2VzOiBzdHJpbmdbXSB8IFNhZmVSZXNvdXJjZVVybFtdO1xuICAgIGRlc2NyaXB0aW9uczogc3RyaW5nW107XG4gICAgbGlua3M6IHN0cmluZ1tdO1xuICAgIGxhYmVsczogc3RyaW5nW107XG5cbiAgICBvbGRJbWFnZXM6IE5neEdhbGxlcnlJbWFnZVtdO1xuICAgIG9sZEltYWdlc0xlbmd0aCA9IDA7XG5cbiAgICBzZWxlY3RlZEluZGV4ID0gMDtcbiAgICBwcmV2aWV3RW5hYmxlZDogYm9vbGVhbjtcblxuICAgIGN1cnJlbnRPcHRpb25zOiBOZ3hHYWxsZXJ5T3B0aW9ucztcblxuICAgIHByaXZhdGUgYnJlYWtwb2ludDogbnVtYmVyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgIHByaXZhdGUgcHJldkJyZWFrcG9pbnQ6IG51bWJlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBwcml2YXRlIGZ1bGxXaWR0aFRpbWVvdXQ6IGFueTtcblxuICAgIEBWaWV3Q2hpbGQoTmd4R2FsbGVyeVByZXZpZXdDb21wb25lbnQpIHByZXZpZXc6IE5neEdhbGxlcnlQcmV2aWV3Q29tcG9uZW50O1xuICAgIEBWaWV3Q2hpbGQoTmd4R2FsbGVyeUltYWdlQ29tcG9uZW50KSBpbWFnZTogTmd4R2FsbGVyeUltYWdlQ29tcG9uZW50O1xuICAgIEBWaWV3Q2hpbGQoTmd4R2FsbGVyeVRodW1ibmFpbHNDb21wb25lbnQpIHRodWJtbmFpbHM6IE5neEdhbGxlcnlUaHVtYm5haWxzQ29tcG9uZW50O1xuXG4gICAgQEhvc3RCaW5kaW5nKCdzdHlsZS53aWR0aCcpIHdpZHRoOiBzdHJpbmc7XG4gICAgQEhvc3RCaW5kaW5nKCdzdHlsZS5oZWlnaHQnKSBoZWlnaHQ6IHN0cmluZztcbiAgICBASG9zdEJpbmRpbmcoJ3N0eWxlLmxlZnQnKSBsZWZ0OiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG15RWxlbWVudDogRWxlbWVudFJlZikge31cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLm9wdGlvbnMubWFwKChvcHQpID0+IG5ldyBOZ3hHYWxsZXJ5T3B0aW9ucyhvcHQpKTtcbiAgICAgICAgdGhpcy5zb3J0T3B0aW9ucygpO1xuICAgICAgICB0aGlzLnNldEJyZWFrcG9pbnQoKTtcbiAgICAgICAgdGhpcy5zZXRPcHRpb25zKCk7XG4gICAgICAgIHRoaXMuY2hlY2tGdWxsV2lkdGgoKTtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudE9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IDxudW1iZXI+dGhpcy5jdXJyZW50T3B0aW9ucy5zdGFydEluZGV4O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdEb0NoZWNrKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pbWFnZXMgIT09IHVuZGVmaW5lZCAmJiAodGhpcy5pbWFnZXMubGVuZ3RoICE9PSB0aGlzLm9sZEltYWdlc0xlbmd0aClcbiAgICAgICAgICAgIHx8ICh0aGlzLmltYWdlcyAhPT0gdGhpcy5vbGRJbWFnZXMpKSB7XG4gICAgICAgICAgICB0aGlzLm9sZEltYWdlc0xlbmd0aCA9IHRoaXMuaW1hZ2VzLmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMub2xkSW1hZ2VzID0gdGhpcy5pbWFnZXM7XG4gICAgICAgICAgICB0aGlzLnNldE9wdGlvbnMoKTtcbiAgICAgICAgICAgIHRoaXMuc2V0SW1hZ2VzKCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmltYWdlcyAmJiB0aGlzLmltYWdlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlc1JlYWR5LmVtaXQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuaW1hZ2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlLnJlc2V0KDxudW1iZXI+dGhpcy5jdXJyZW50T3B0aW9ucy5zdGFydEluZGV4KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudE9wdGlvbnMudGh1bWJuYWlsc0F1dG9IaWRlICYmIHRoaXMuY3VycmVudE9wdGlvbnMudGh1bWJuYWlsc1xuICAgICAgICAgICAgICAgICYmIHRoaXMuaW1hZ2VzLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50T3B0aW9ucy50aHVtYm5haWxzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50T3B0aW9ucy5pbWFnZUFycm93cyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnJlc2V0VGh1bWJuYWlscygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNoZWNrRnVsbFdpZHRoKCk7XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScpIG9uUmVzaXplKCkge1xuICAgICAgICB0aGlzLnNldEJyZWFrcG9pbnQoKTtcblxuICAgICAgICBpZiAodGhpcy5wcmV2QnJlYWtwb2ludCAhPT0gdGhpcy5icmVha3BvaW50KSB7XG4gICAgICAgICAgICB0aGlzLnNldE9wdGlvbnMoKTtcbiAgICAgICAgICAgIHRoaXMucmVzZXRUaHVtYm5haWxzKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jdXJyZW50T3B0aW9ucyAmJiB0aGlzLmN1cnJlbnRPcHRpb25zLmZ1bGxXaWR0aCkge1xuXG4gICAgICAgICAgICBpZiAodGhpcy5mdWxsV2lkdGhUaW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZnVsbFdpZHRoVGltZW91dCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZnVsbFdpZHRoVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tGdWxsV2lkdGgoKTtcbiAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRJbWFnZUhlaWdodCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gKHRoaXMuY3VycmVudE9wdGlvbnMgJiYgdGhpcy5jdXJyZW50T3B0aW9ucy50aHVtYm5haWxzKSA/XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRPcHRpb25zLmltYWdlUGVyY2VudCArICclJyA6ICcxMDAlJztcbiAgICB9XG5cbiAgICBnZXRUaHVtYm5haWxzSGVpZ2h0KCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRPcHRpb25zICYmIHRoaXMuY3VycmVudE9wdGlvbnMuaW1hZ2UpIHtcbiAgICAgICAgICAgIHJldHVybiAnY2FsYygnICsgdGhpcy5jdXJyZW50T3B0aW9ucy50aHVtYm5haWxzUGVyY2VudCArICclIC0gJ1xuICAgICAgICAgICAgKyB0aGlzLmN1cnJlbnRPcHRpb25zLnRodW1ibmFpbHNNYXJnaW4gKyAncHgpJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAnMTAwJSc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRUaHVtYm5haWxzTWFyZ2luVG9wKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRPcHRpb25zICYmIHRoaXMuY3VycmVudE9wdGlvbnMubGF5b3V0ID09PSBOZ3hHYWxsZXJ5TGF5b3V0LlRodW1ibmFpbHNCb3R0b20pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRPcHRpb25zLnRodW1ibmFpbHNNYXJnaW4gKyAncHgnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICcwcHgnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0VGh1bWJuYWlsc01hcmdpbkJvdHRvbSgpOiBzdHJpbmcge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50T3B0aW9ucyAmJiB0aGlzLmN1cnJlbnRPcHRpb25zLmxheW91dCA9PT0gTmd4R2FsbGVyeUxheW91dC5UaHVtYm5haWxzVG9wKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50T3B0aW9ucy50aHVtYm5haWxzTWFyZ2luICsgJ3B4JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAnMHB4JztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9wZW5QcmV2aWV3KGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudE9wdGlvbnMucHJldmlld0N1c3RvbSkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50T3B0aW9ucy5wcmV2aWV3Q3VzdG9tKGluZGV4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHJldmlld0VuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5wcmV2aWV3Lm9wZW4oaW5kZXgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25QcmV2aWV3T3BlbigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wcmV2aWV3T3Blbi5lbWl0KCk7XG5cbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UgJiYgdGhpcy5pbWFnZS5hdXRvUGxheSkge1xuICAgICAgICAgICAgdGhpcy5pbWFnZS5zdG9wQXV0b1BsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uUHJldmlld0Nsb3NlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnByZXZpZXdFbmFibGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMucHJldmlld0Nsb3NlLmVtaXQoKTtcblxuICAgICAgICBpZiAodGhpcy5pbWFnZSAmJiB0aGlzLmltYWdlLmF1dG9QbGF5KSB7XG4gICAgICAgICAgICB0aGlzLmltYWdlLnN0YXJ0QXV0b1BsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbGVjdEZyb21JbWFnZShpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0KGluZGV4KTtcbiAgICB9XG5cbiAgICBzZWxlY3RGcm9tVGh1bWJuYWlscyhpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0KGluZGV4KTtcblxuICAgICAgICBpZiAodGhpcy5jdXJyZW50T3B0aW9ucyAmJiB0aGlzLmN1cnJlbnRPcHRpb25zLnRodW1ibmFpbHMgJiYgdGhpcy5jdXJyZW50T3B0aW9ucy5wcmV2aWV3XG4gICAgICAgICAgICAmJiAoIXRoaXMuY3VycmVudE9wdGlvbnMuaW1hZ2UgfHwgdGhpcy5jdXJyZW50T3B0aW9ucy50aHVtYm5haWxzUmVtYWluaW5nQ291bnQpKSB7XG4gICAgICAgICAgICB0aGlzLm9wZW5QcmV2aWV3KHRoaXMuc2VsZWN0ZWRJbmRleCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG93KGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZWxlY3QoaW5kZXgpO1xuICAgIH1cblxuICAgIHNob3dOZXh0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmltYWdlLnNob3dOZXh0KCk7XG4gICAgfVxuXG4gICAgc2hvd1ByZXYoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaW1hZ2Uuc2hvd1ByZXYoKTtcbiAgICB9XG5cbiAgICBjYW5TaG93TmV4dCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2VzICYmIHRoaXMuY3VycmVudE9wdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5jdXJyZW50T3B0aW9ucy5pbWFnZUluZmluaXR5TW92ZSB8fCB0aGlzLnNlbGVjdGVkSW5kZXggPCB0aGlzLmltYWdlcy5sZW5ndGggLSAxKVxuICAgICAgICAgICAgICAgID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2FuU2hvd1ByZXYoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmltYWdlcyAmJiB0aGlzLmN1cnJlbnRPcHRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuY3VycmVudE9wdGlvbnMuaW1hZ2VJbmZpbml0eU1vdmUgfHwgdGhpcy5zZWxlY3RlZEluZGV4ID4gMCkgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcmV2aWV3U2VsZWN0KGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5wcmV2aWV3Q2hhbmdlLmVtaXQoe2luZGV4LCBpbWFnZTogdGhpcy5pbWFnZXNbaW5kZXhdfSk7XG4gICAgfVxuXG4gICAgbW92ZVRodW1ibmFpbHNSaWdodCgpIHtcbiAgICAgICAgdGhpcy50aHVibW5haWxzLm1vdmVSaWdodCgpO1xuICAgIH1cblxuICAgIG1vdmVUaHVtYm5haWxzTGVmdCgpIHtcbiAgICAgICAgdGhpcy50aHVibW5haWxzLm1vdmVMZWZ0KCk7XG4gICAgfVxuXG4gICAgY2FuTW92ZVRodW1ibmFpbHNSaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGh1Ym1uYWlscy5jYW5Nb3ZlUmlnaHQoKTtcbiAgICB9XG5cbiAgICBjYW5Nb3ZlVGh1bWJuYWlsc0xlZnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRodWJtbmFpbHMuY2FuTW92ZUxlZnQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc2V0VGh1bWJuYWlscygpIHtcbiAgICAgICAgaWYgKHRoaXMudGh1Ym1uYWlscykge1xuICAgICAgICAgICAgdGhpcy50aHVibW5haWxzLnJlc2V0KDxudW1iZXI+dGhpcy5jdXJyZW50T3B0aW9ucy5zdGFydEluZGV4KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc2VsZWN0KGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gaW5kZXg7XG5cbiAgICAgICAgdGhpcy5jaGFuZ2UuZW1pdCh7XG4gICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgIGltYWdlOiB0aGlzLmltYWdlc1tpbmRleF1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjaGVja0Z1bGxXaWR0aCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudE9wdGlvbnMgJiYgdGhpcy5jdXJyZW50T3B0aW9ucy5mdWxsV2lkdGgpIHtcbiAgICAgICAgICAgIHRoaXMud2lkdGggPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoICsgJ3B4JztcbiAgICAgICAgICAgIHRoaXMubGVmdCA9ICgtKGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggLVxuICAgICAgICAgICAgICAgIHRoaXMubXlFbGVtZW50Lm5hdGl2ZUVsZW1lbnQucGFyZW50Tm9kZS5pbm5lcldpZHRoKSAvIDIpICsgJ3B4JztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc2V0SW1hZ2VzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNtYWxsSW1hZ2VzID0gdGhpcy5pbWFnZXMubWFwKChpbWcpID0+IDxzdHJpbmc+aW1nLnNtYWxsKTtcbiAgICAgICAgdGhpcy5tZWRpdW1JbWFnZXMgPSB0aGlzLmltYWdlcy5tYXAoKGltZywgaSkgPT4gbmV3IE5neEdhbGxlcnlPcmRlcmVkSW1hZ2Uoe1xuICAgICAgICAgICAgc3JjOiBpbWcubWVkaXVtLFxuICAgICAgICAgICAgaW5kZXg6IGlcbiAgICAgICAgfSkpO1xuICAgICAgICB0aGlzLmJpZ0ltYWdlcyA9IHRoaXMuaW1hZ2VzLm1hcCgoaW1nKSA9PiA8c3RyaW5nPmltZy5iaWcpO1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9ucyA9IHRoaXMuaW1hZ2VzLm1hcCgoaW1nKSA9PiA8c3RyaW5nPmltZy5kZXNjcmlwdGlvbik7XG4gICAgICAgIHRoaXMubGlua3MgPSB0aGlzLmltYWdlcy5tYXAoKGltZykgPT4gPHN0cmluZz5pbWcudXJsKTtcbiAgICAgICAgdGhpcy5sYWJlbHMgPSB0aGlzLmltYWdlcy5tYXAoKGltZykgPT4gPHN0cmluZz5pbWcubGFiZWwpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0QnJlYWtwb2ludCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wcmV2QnJlYWtwb2ludCA9IHRoaXMuYnJlYWtwb2ludDtcbiAgICAgICAgbGV0IGJyZWFrcG9pbnRzO1xuXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgYnJlYWtwb2ludHMgPSB0aGlzLm9wdGlvbnMuZmlsdGVyKChvcHQpID0+IG9wdC5icmVha3BvaW50ID49IHdpbmRvdy5pbm5lcldpZHRoKVxuICAgICAgICAgICAgICAgIC5tYXAoKG9wdCkgPT4gb3B0LmJyZWFrcG9pbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJyZWFrcG9pbnRzICYmIGJyZWFrcG9pbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5icmVha3BvaW50ID0gYnJlYWtwb2ludHMucG9wKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJyZWFrcG9pbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHNvcnRPcHRpb25zKCk6IHZvaWQge1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBbXG4gICAgICAgICAgICAuLi50aGlzLm9wdGlvbnMuZmlsdGVyKChhKSA9PiBhLmJyZWFrcG9pbnQgPT09IHVuZGVmaW5lZCksXG4gICAgICAgICAgICAuLi50aGlzLm9wdGlvbnNcbiAgICAgICAgICAgICAgICAuZmlsdGVyKChhKSA9PiBhLmJyZWFrcG9pbnQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAuc29ydCgoYSwgYikgPT4gYi5icmVha3BvaW50IC0gYS5icmVha3BvaW50KVxuICAgICAgICBdO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0T3B0aW9ucygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jdXJyZW50T3B0aW9ucyA9IG5ldyBOZ3hHYWxsZXJ5T3B0aW9ucyh7fSk7XG5cbiAgICAgICAgdGhpcy5vcHRpb25zXG4gICAgICAgICAgICAuZmlsdGVyKChvcHQpID0+IG9wdC5icmVha3BvaW50ID09PSB1bmRlZmluZWQgfHwgb3B0LmJyZWFrcG9pbnQgPj0gdGhpcy5icmVha3BvaW50KVxuICAgICAgICAgICAgLm1hcCgob3B0KSA9PiB0aGlzLmNvbWJpbmVPcHRpb25zKHRoaXMuY3VycmVudE9wdGlvbnMsIG9wdCkpO1xuXG4gICAgICAgIHRoaXMud2lkdGggPSA8c3RyaW5nPnRoaXMuY3VycmVudE9wdGlvbnMud2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gPHN0cmluZz50aGlzLmN1cnJlbnRPcHRpb25zLmhlaWdodDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbWJpbmVPcHRpb25zKGZpcnN0OiBOZ3hHYWxsZXJ5T3B0aW9ucywgc2Vjb25kOiBOZ3hHYWxsZXJ5T3B0aW9ucykge1xuICAgICAgICBPYmplY3Qua2V5cyhzZWNvbmQpLm1hcCgodmFsKSA9PiBmaXJzdFt2YWxdID0gc2Vjb25kW3ZhbF0gIT09IHVuZGVmaW5lZCA/IHNlY29uZFt2YWxdIDogZmlyc3RbdmFsXSk7XG4gICAgfVxufVxuXG4iXX0=