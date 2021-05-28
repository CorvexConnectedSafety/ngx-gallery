import { ChangeDetectorRef, Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ElementRef, HostListener, ViewChild, Renderer2 } from '@angular/core';
import { SafeResourceUrl, DomSanitizer, SafeUrl, SafeStyle } from '@angular/platform-browser';
import { NgxGalleryHelperService } from './ngx-gallery-helper.service';
var NgxGalleryPreviewComponent = /** @class */ (function () {
    function NgxGalleryPreviewComponent(sanitization, elementRef, helperService, renderer, changeDetectorRef) {
        this.sanitization = sanitization;
        this.elementRef = elementRef;
        this.helperService = helperService;
        this.renderer = renderer;
        this.changeDetectorRef = changeDetectorRef;
        this.showSpinner = false;
        this.positionLeft = 0;
        this.positionTop = 0;
        this.zoomValue = 1;
        this.loading = false;
        this.rotateValue = 0;
        this.index = 0;
        this.onOpen = new EventEmitter();
        this.onClose = new EventEmitter();
        this.onActiveChange = new EventEmitter();
        this.isOpen = false;
        this.initialX = 0;
        this.initialY = 0;
        this.initialLeft = 0;
        this.initialTop = 0;
        this.isMove = false;
    }
    NgxGalleryPreviewComponent.prototype.ngOnInit = function () {
        if (this.arrows && this.arrowsAutoHide) {
            this.arrows = false;
        }
    };
    NgxGalleryPreviewComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (changes['swipe']) {
            this.helperService.manageSwipe(this.swipe, this.elementRef, 'preview', function () { return _this.showNext(); }, function () { return _this.showPrev(); });
        }
    };
    NgxGalleryPreviewComponent.prototype.ngOnDestroy = function () {
        if (this.keyDownListener) {
            this.keyDownListener();
        }
    };
    NgxGalleryPreviewComponent.prototype.onMouseEnter = function () {
        if (this.arrowsAutoHide && !this.arrows) {
            this.arrows = true;
        }
    };
    NgxGalleryPreviewComponent.prototype.onMouseLeave = function () {
        if (this.arrowsAutoHide && this.arrows) {
            this.arrows = false;
        }
    };
    NgxGalleryPreviewComponent.prototype.onKeyDown = function (e) {
        if (this.isOpen) {
            if (this.keyboardNavigation) {
                if (this.isKeyboardPrev(e)) {
                    this.showPrev();
                }
                else if (this.isKeyboardNext(e)) {
                    this.showNext();
                }
            }
            if (this.closeOnEsc && this.isKeyboardEsc(e)) {
                this.close();
            }
        }
    };
    NgxGalleryPreviewComponent.prototype.open = function (index) {
        var _this = this;
        this.onOpen.emit();
        this.index = index;
        this.isOpen = true;
        this.show(true);
        if (this.forceFullscreen) {
            this.manageFullscreen();
        }
        this.keyDownListener = this.renderer.listen("window", "keydown", function (e) { return _this.onKeyDown(e); });
    };
    NgxGalleryPreviewComponent.prototype.close = function () {
        this.isOpen = false;
        this.closeFullscreen();
        this.onClose.emit();
        this.stopAutoPlay();
        if (this.keyDownListener) {
            this.keyDownListener();
        }
    };
    NgxGalleryPreviewComponent.prototype.imageMouseEnter = function () {
        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.stopAutoPlay();
        }
    };
    NgxGalleryPreviewComponent.prototype.imageMouseLeave = function () {
        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.startAutoPlay();
        }
    };
    NgxGalleryPreviewComponent.prototype.startAutoPlay = function () {
        var _this = this;
        if (this.autoPlay) {
            this.stopAutoPlay();
            this.timer = setTimeout(function () {
                if (!_this.showNext()) {
                    _this.index = -1;
                    _this.showNext();
                }
            }, this.autoPlayInterval);
        }
    };
    NgxGalleryPreviewComponent.prototype.stopAutoPlay = function () {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    };
    NgxGalleryPreviewComponent.prototype.showAtIndex = function (index) {
        this.index = index;
        this.show();
    };
    NgxGalleryPreviewComponent.prototype.showNext = function () {
        if (this.canShowNext()) {
            this.index++;
            if (this.index === this.images.length) {
                this.index = 0;
            }
            this.show();
            return true;
        }
        else {
            return false;
        }
    };
    NgxGalleryPreviewComponent.prototype.showPrev = function () {
        if (this.canShowPrev()) {
            this.index--;
            if (this.index < 0) {
                this.index = this.images.length - 1;
            }
            this.show();
        }
    };
    NgxGalleryPreviewComponent.prototype.canShowNext = function () {
        if (this.loading) {
            return false;
        }
        else if (this.images) {
            return this.infinityMove || this.index < this.images.length - 1 ? true : false;
        }
        else {
            return false;
        }
    };
    NgxGalleryPreviewComponent.prototype.canShowPrev = function () {
        if (this.loading) {
            return false;
        }
        else if (this.images) {
            return this.infinityMove || this.index > 0 ? true : false;
        }
        else {
            return false;
        }
    };
    NgxGalleryPreviewComponent.prototype.manageFullscreen = function () {
        if (this.fullscreen || this.forceFullscreen) {
            var doc = document;
            if (!doc.fullscreenElement && !doc.mozFullScreenElement
                && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
                this.openFullscreen();
            }
            else {
                this.closeFullscreen();
            }
        }
    };
    NgxGalleryPreviewComponent.prototype.getSafeUrl = function (image) {
        return image.substr(0, 10) === 'data:image' ?
            image : this.sanitization.bypassSecurityTrustUrl(image);
    };
    NgxGalleryPreviewComponent.prototype.zoomIn = function () {
        if (this.canZoomIn()) {
            this.zoomValue += this.zoomStep;
            if (this.zoomValue > this.zoomMax) {
                this.zoomValue = this.zoomMax;
            }
        }
    };
    NgxGalleryPreviewComponent.prototype.zoomOut = function () {
        if (this.canZoomOut()) {
            this.zoomValue -= this.zoomStep;
            if (this.zoomValue < this.zoomMin) {
                this.zoomValue = this.zoomMin;
            }
            if (this.zoomValue <= 1) {
                this.resetPosition();
            }
        }
    };
    NgxGalleryPreviewComponent.prototype.rotateLeft = function () {
        this.rotateValue -= 90;
    };
    NgxGalleryPreviewComponent.prototype.rotateRight = function () {
        this.rotateValue += 90;
    };
    NgxGalleryPreviewComponent.prototype.getTransform = function () {
        return this.sanitization.bypassSecurityTrustStyle('scale(' + this.zoomValue + ') rotate(' + this.rotateValue + 'deg)');
    };
    NgxGalleryPreviewComponent.prototype.canZoomIn = function () {
        return this.zoomValue < this.zoomMax ? true : false;
    };
    NgxGalleryPreviewComponent.prototype.canZoomOut = function () {
        return this.zoomValue > this.zoomMin ? true : false;
    };
    NgxGalleryPreviewComponent.prototype.canDragOnZoom = function () {
        return this.zoom && this.zoomValue > 1;
    };
    NgxGalleryPreviewComponent.prototype.mouseDownHandler = function (e) {
        if (this.canDragOnZoom()) {
            this.initialX = this.getClientX(e);
            this.initialY = this.getClientY(e);
            this.initialLeft = this.positionLeft;
            this.initialTop = this.positionTop;
            this.isMove = true;
            e.preventDefault();
        }
    };
    NgxGalleryPreviewComponent.prototype.mouseUpHandler = function (e) {
        this.isMove = false;
    };
    NgxGalleryPreviewComponent.prototype.mouseMoveHandler = function (e) {
        if (this.isMove) {
            this.positionLeft = this.initialLeft + (this.getClientX(e) - this.initialX);
            this.positionTop = this.initialTop + (this.getClientY(e) - this.initialY);
        }
    };
    NgxGalleryPreviewComponent.prototype.getClientX = function (e) {
        return e.touches && e.touches.length ? e.touches[0].clientX : e.clientX;
    };
    NgxGalleryPreviewComponent.prototype.getClientY = function (e) {
        return e.touches && e.touches.length ? e.touches[0].clientY : e.clientY;
    };
    NgxGalleryPreviewComponent.prototype.resetPosition = function () {
        if (this.zoom) {
            this.positionLeft = 0;
            this.positionTop = 0;
        }
    };
    NgxGalleryPreviewComponent.prototype.isKeyboardNext = function (e) {
        return e.keyCode === 39 ? true : false;
    };
    NgxGalleryPreviewComponent.prototype.isKeyboardPrev = function (e) {
        return e.keyCode === 37 ? true : false;
    };
    NgxGalleryPreviewComponent.prototype.isKeyboardEsc = function (e) {
        return e.keyCode === 27 ? true : false;
    };
    NgxGalleryPreviewComponent.prototype.openFullscreen = function () {
        var element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        }
        else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
        else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        }
        else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
    };
    NgxGalleryPreviewComponent.prototype.closeFullscreen = function () {
        if (this.isFullscreen()) {
            var doc = document;
            if (doc.exitFullscreen) {
                doc.exitFullscreen();
            }
            else if (doc.msExitFullscreen) {
                doc.msExitFullscreen();
            }
            else if (doc.mozCancelFullScreen) {
                doc.mozCancelFullScreen();
            }
            else if (doc.webkitExitFullscreen) {
                doc.webkitExitFullscreen();
            }
        }
    };
    NgxGalleryPreviewComponent.prototype.isFullscreen = function () {
        var doc = document;
        return doc.fullscreenElement || doc.webkitFullscreenElement
            || doc.mozFullScreenElement || doc.msFullscreenElement;
    };
    NgxGalleryPreviewComponent.prototype.show = function (first) {
        var _this = this;
        if (first === void 0) { first = false; }
        this.loading = true;
        this.stopAutoPlay();
        this.onActiveChange.emit(this.index);
        if (first || !this.animation) {
            this._show();
        }
        else {
            setTimeout(function () { return _this._show(); }, 600);
        }
    };
    NgxGalleryPreviewComponent.prototype._show = function () {
        var _this = this;
        this.zoomValue = 1;
        this.rotateValue = 0;
        this.resetPosition();
        this.src = this.getSafeUrl(this.images[this.index]);
        this.srcIndex = this.index;
        this.description = this.descriptions[this.index];
        this.changeDetectorRef.markForCheck();
        setTimeout(function () {
            if (_this.isLoaded(_this.previewImage.nativeElement)) {
                _this.loading = false;
                _this.startAutoPlay();
                _this.changeDetectorRef.markForCheck();
            }
            else {
                setTimeout(function () {
                    if (_this.loading) {
                        _this.showSpinner = true;
                        _this.changeDetectorRef.markForCheck();
                    }
                });
                _this.previewImage.nativeElement.onload = function () {
                    _this.loading = false;
                    _this.showSpinner = false;
                    _this.previewImage.nativeElement.onload = null;
                    _this.startAutoPlay();
                    _this.changeDetectorRef.markForCheck();
                };
            }
        });
    };
    NgxGalleryPreviewComponent.prototype.isLoaded = function (img) {
        if (!img.complete) {
            return false;
        }
        if (typeof img.naturalWidth !== 'undefined' && img.naturalWidth === 0) {
            return false;
        }
        return true;
    };
    NgxGalleryPreviewComponent.ctorParameters = function () { return [
        { type: DomSanitizer },
        { type: ElementRef },
        { type: NgxGalleryHelperService },
        { type: Renderer2 },
        { type: ChangeDetectorRef }
    ]; };
    NgxGalleryPreviewComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-gallery-preview',
                    template: "\n        <ngx-gallery-arrows *ngIf=\"arrows\" (onPrevClick)=\"showPrev()\" (onNextClick)=\"showNext()\" [prevDisabled]=\"!canShowPrev()\" [nextDisabled]=\"!canShowNext()\" [arrowPrevIcon]=\"arrowPrevIcon\" [arrowNextIcon]=\"arrowNextIcon\"></ngx-gallery-arrows>\n        <div class=\"ngx-gallery-preview-top\">\n            <div class=\"ngx-gallery-preview-icons\">\n                <ngx-gallery-action *ngFor=\"let action of actions\" [icon]=\"action.icon\" [disabled]=\"action.disabled\" [titleText]=\"action.titleText\" (onClick)=\"action.onClick($event, index)\"></ngx-gallery-action>\n                <a *ngIf=\"download && src\" [href]=\"src\" class=\"ngx-gallery-icon\" aria-hidden=\"true\" download>\n                    <i class=\"ngx-gallery-icon-content {{ downloadIcon }}\"></i>\n                </a>\n                <ngx-gallery-action *ngIf=\"zoom\" [icon]=\"zoomOutIcon\" [disabled]=\"!canZoomOut()\" (onClick)=\"zoomOut()\"></ngx-gallery-action>\n                <ngx-gallery-action *ngIf=\"zoom\" [icon]=\"zoomInIcon\" [disabled]=\"!canZoomIn()\" (onClick)=\"zoomIn()\"></ngx-gallery-action>\n                <ngx-gallery-action *ngIf=\"rotate\" [icon]=\"rotateLeftIcon\" (onClick)=\"rotateLeft()\"></ngx-gallery-action>\n                <ngx-gallery-action *ngIf=\"rotate\" [icon]=\"rotateRightIcon\" (onClick)=\"rotateRight()\"></ngx-gallery-action>\n                <ngx-gallery-action *ngIf=\"fullscreen\" [icon]=\"'ngx-gallery-fullscreen ' + fullscreenIcon\" (onClick)=\"manageFullscreen()\"></ngx-gallery-action>\n                <ngx-gallery-action [icon]=\"'ngx-gallery-close ' + closeIcon\" (onClick)=\"close()\"></ngx-gallery-action>\n            </div>\n        </div>\n        <div class=\"ngx-spinner-wrapper ngx-gallery-center\" [class.ngx-gallery-active]=\"showSpinner\">\n            <i class=\"ngx-gallery-icon ngx-gallery-spinner {{spinnerIcon}}\" aria-hidden=\"true\"></i>\n        </div>\n        <div class=\"ngx-gallery-preview-wrapper\" (click)=\"closeOnClick && close()\" (mouseup)=\"mouseUpHandler($event)\" (mousemove)=\"mouseMoveHandler($event)\" (touchend)=\"mouseUpHandler($event)\" (touchmove)=\"mouseMoveHandler($event)\">\n            <div class=\"ngx-gallery-preview-img-wrapper\">\n                <img *ngIf=\"src\" #previewImage class=\"ngx-gallery-preview-img ngx-gallery-center\" [src]=\"src\" (click)=\"$event.stopPropagation()\" (mouseenter)=\"imageMouseEnter()\" (mouseleave)=\"imageMouseLeave()\" (mousedown)=\"mouseDownHandler($event)\" (touchstart)=\"mouseDownHandler($event)\" [class.ngx-gallery-active]=\"!loading\" [class.animation]=\"animation\" [class.ngx-gallery-grab]=\"canDragOnZoom()\" [style.transform]=\"getTransform()\" [style.left]=\"positionLeft + 'px'\" [style.top]=\"positionTop + 'px'\"/>\n                <ngx-gallery-bullets *ngIf=\"bullets\" [count]=\"images.length\" [active]=\"index\" (onChange)=\"showAtIndex($event)\"></ngx-gallery-bullets>\n            </div>\n            <div class=\"ngx-gallery-preview-text\" *ngIf=\"showDescription && description\" [innerHTML]=\"description\" (click)=\"$event.stopPropagation()\"></div>\n        </div>\n    ",
                    styles: [":host(.ngx-gallery-active){width:100%;height:100%;position:fixed;left:0;top:0;background:rgba(0,0,0,.7);z-index:10000;display:inline-block}:host{display:none}:host /deep/ .ngx-gallery-arrow{font-size:50px}:host /deep/ ngx-gallery-bullets{height:5%;align-items:center;padding:0}.ngx-gallery-preview-img{opacity:0;max-width:90%;max-height:90%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:transform .5s}.ngx-gallery-preview-img.animation{transition:opacity .5s linear,transform .5s}.ngx-gallery-preview-img.ngx-gallery-active{opacity:1}.ngx-gallery-preview-img.ngx-gallery-grab{cursor:grab;cursor:-webkit-grab}.ngx-gallery-icon.ngx-gallery-spinner{font-size:50px;left:0;display:inline-block}:host /deep/ .ngx-gallery-preview-top{position:absolute;width:100%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}:host /deep/ .ngx-gallery-preview-icons{float:right}:host /deep/ .ngx-gallery-preview-icons .ngx-gallery-icon{position:relative;margin-right:10px;margin-top:10px;font-size:25px;cursor:pointer;text-decoration:none}:host /deep/ .ngx-gallery-preview-icons .ngx-gallery-icon.ngx-gallery-icon-disabled{cursor:default;opacity:.4}.ngx-spinner-wrapper{width:50px;height:50px;display:none}.ngx-spinner-wrapper.ngx-gallery-active{display:inline-block}.ngx-gallery-center{position:absolute;left:0;right:0;bottom:0;margin:auto;top:0}.ngx-gallery-preview-text{width:100%;background:rgba(0,0,0,.7);padding:10px;text-align:center;color:#fff;font-size:16px;flex:0 1 auto;z-index:10}.ngx-gallery-preview-wrapper{width:100%;height:100%;display:flex;flex-flow:column}.ngx-gallery-preview-img-wrapper{flex:1 1 auto;position:relative}"]
                },] }
    ];
    NgxGalleryPreviewComponent.ctorParameters = function () { return [
        { type: DomSanitizer },
        { type: ElementRef },
        { type: NgxGalleryHelperService },
        { type: Renderer2 },
        { type: ChangeDetectorRef }
    ]; };
    NgxGalleryPreviewComponent.propDecorators = {
        images: [{ type: Input }],
        descriptions: [{ type: Input }],
        showDescription: [{ type: Input }],
        arrows: [{ type: Input }],
        arrowsAutoHide: [{ type: Input }],
        swipe: [{ type: Input }],
        fullscreen: [{ type: Input }],
        forceFullscreen: [{ type: Input }],
        closeOnClick: [{ type: Input }],
        closeOnEsc: [{ type: Input }],
        keyboardNavigation: [{ type: Input }],
        arrowPrevIcon: [{ type: Input }],
        arrowNextIcon: [{ type: Input }],
        closeIcon: [{ type: Input }],
        fullscreenIcon: [{ type: Input }],
        spinnerIcon: [{ type: Input }],
        autoPlay: [{ type: Input }],
        autoPlayInterval: [{ type: Input }],
        autoPlayPauseOnHover: [{ type: Input }],
        infinityMove: [{ type: Input }],
        zoom: [{ type: Input }],
        zoomStep: [{ type: Input }],
        zoomMax: [{ type: Input }],
        zoomMin: [{ type: Input }],
        zoomInIcon: [{ type: Input }],
        zoomOutIcon: [{ type: Input }],
        animation: [{ type: Input }],
        actions: [{ type: Input }],
        rotate: [{ type: Input }],
        rotateLeftIcon: [{ type: Input }],
        rotateRightIcon: [{ type: Input }],
        download: [{ type: Input }],
        downloadIcon: [{ type: Input }],
        bullets: [{ type: Input }],
        onOpen: [{ type: Output }],
        onClose: [{ type: Output }],
        onActiveChange: [{ type: Output }],
        previewImage: [{ type: ViewChild, args: ['previewImage',] }],
        onMouseEnter: [{ type: HostListener, args: ['mouseenter',] }],
        onMouseLeave: [{ type: HostListener, args: ['mouseleave',] }]
    };
    return NgxGalleryPreviewComponent;
}());
export { NgxGalleryPreviewComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktcHJldmlldy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZ2FsbGVyeS8iLCJzb3VyY2VzIjpbInNyYy9uZ3gtZ2FsbGVyeS1wcmV2aWV3LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM1SyxPQUFPLEVBQUUsZUFBZSxFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFHOUYsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFFdkU7SUErRkksb0NBQW9CLFlBQTBCLEVBQVUsVUFBc0IsRUFDMUQsYUFBc0MsRUFBVSxRQUFtQixFQUNuRSxpQkFBb0M7UUFGcEMsaUJBQVksR0FBWixZQUFZLENBQWM7UUFBVSxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQzFELGtCQUFhLEdBQWIsYUFBYSxDQUF5QjtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkUsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQTdEeEQsZ0JBQVcsR0FBRyxLQUFLLENBQUM7UUFDcEIsaUJBQVksR0FBRyxDQUFDLENBQUM7UUFDakIsZ0JBQVcsR0FBRyxDQUFDLENBQUM7UUFDaEIsY0FBUyxHQUFHLENBQUMsQ0FBQztRQUNkLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsZ0JBQVcsR0FBRyxDQUFDLENBQUM7UUFDaEIsVUFBSyxHQUFHLENBQUMsQ0FBQztRQXFDQSxXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM1QixZQUFPLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztR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OytCQUNMLEtBQUs7dUJBQ0wsS0FBSzsyQkFDTCxLQUFLOzBCQUNMLEtBQUs7MEJBQ0wsS0FBSzs2QkFDTCxLQUFLOzhCQUNMLEtBQUs7NEJBQ0wsS0FBSzswQkFDTCxLQUFLO3lCQUNMLEtBQUs7aUNBQ0wsS0FBSztrQ0FDTCxLQUFLOzJCQUNMLEtBQUs7K0JBQ0wsS0FBSzswQkFDTCxLQUFLO3lCQUVMLE1BQU07MEJBQ04sTUFBTTtpQ0FDTixNQUFNOytCQUVOLFNBQVMsU0FBQyxjQUFjOytCQW1DeEIsWUFBWSxTQUFDLFlBQVk7K0JBTXpCLFlBQVksU0FBQyxZQUFZOztJQXVWOUIsaUNBQUM7Q0FBQSxBQW5kRCxJQW1kQztTQXBiWSwwQkFBMEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3RvclJlZiwgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIE9uSW5pdCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzLCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIFZpZXdDaGlsZCwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTYWZlUmVzb3VyY2VVcmwsIERvbVNhbml0aXplciwgU2FmZVVybCwgU2FmZVN0eWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5cbmltcG9ydCB7IE5neEdhbGxlcnlBY3Rpb24gfSBmcm9tICcuL25neC1nYWxsZXJ5LWFjdGlvbi5tb2RlbCc7XG5pbXBvcnQgeyBOZ3hHYWxsZXJ5SGVscGVyU2VydmljZSB9IGZyb20gJy4vbmd4LWdhbGxlcnktaGVscGVyLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ25neC1nYWxsZXJ5LXByZXZpZXcnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxuZ3gtZ2FsbGVyeS1hcnJvd3MgKm5nSWY9XCJhcnJvd3NcIiAob25QcmV2Q2xpY2spPVwic2hvd1ByZXYoKVwiIChvbk5leHRDbGljayk9XCJzaG93TmV4dCgpXCIgW3ByZXZEaXNhYmxlZF09XCIhY2FuU2hvd1ByZXYoKVwiIFtuZXh0RGlzYWJsZWRdPVwiIWNhblNob3dOZXh0KClcIiBbYXJyb3dQcmV2SWNvbl09XCJhcnJvd1ByZXZJY29uXCIgW2Fycm93TmV4dEljb25dPVwiYXJyb3dOZXh0SWNvblwiPjwvbmd4LWdhbGxlcnktYXJyb3dzPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibmd4LWdhbGxlcnktcHJldmlldy10b3BcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJuZ3gtZ2FsbGVyeS1wcmV2aWV3LWljb25zXCI+XG4gICAgICAgICAgICAgICAgPG5neC1nYWxsZXJ5LWFjdGlvbiAqbmdGb3I9XCJsZXQgYWN0aW9uIG9mIGFjdGlvbnNcIiBbaWNvbl09XCJhY3Rpb24uaWNvblwiIFtkaXNhYmxlZF09XCJhY3Rpb24uZGlzYWJsZWRcIiBbdGl0bGVUZXh0XT1cImFjdGlvbi50aXRsZVRleHRcIiAob25DbGljayk9XCJhY3Rpb24ub25DbGljaygkZXZlbnQsIGluZGV4KVwiPjwvbmd4LWdhbGxlcnktYWN0aW9uPlxuICAgICAgICAgICAgICAgIDxhICpuZ0lmPVwiZG93bmxvYWQgJiYgc3JjXCIgW2hyZWZdPVwic3JjXCIgY2xhc3M9XCJuZ3gtZ2FsbGVyeS1pY29uXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgZG93bmxvYWQ+XG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwibmd4LWdhbGxlcnktaWNvbi1jb250ZW50IHt7IGRvd25sb2FkSWNvbiB9fVwiPjwvaT5cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPG5neC1nYWxsZXJ5LWFjdGlvbiAqbmdJZj1cInpvb21cIiBbaWNvbl09XCJ6b29tT3V0SWNvblwiIFtkaXNhYmxlZF09XCIhY2FuWm9vbU91dCgpXCIgKG9uQ2xpY2spPVwiem9vbU91dCgpXCI+PC9uZ3gtZ2FsbGVyeS1hY3Rpb24+XG4gICAgICAgICAgICAgICAgPG5neC1nYWxsZXJ5LWFjdGlvbiAqbmdJZj1cInpvb21cIiBbaWNvbl09XCJ6b29tSW5JY29uXCIgW2Rpc2FibGVkXT1cIiFjYW5ab29tSW4oKVwiIChvbkNsaWNrKT1cInpvb21JbigpXCI+PC9uZ3gtZ2FsbGVyeS1hY3Rpb24+XG4gICAgICAgICAgICAgICAgPG5neC1nYWxsZXJ5LWFjdGlvbiAqbmdJZj1cInJvdGF0ZVwiIFtpY29uXT1cInJvdGF0ZUxlZnRJY29uXCIgKG9uQ2xpY2spPVwicm90YXRlTGVmdCgpXCI+PC9uZ3gtZ2FsbGVyeS1hY3Rpb24+XG4gICAgICAgICAgICAgICAgPG5neC1nYWxsZXJ5LWFjdGlvbiAqbmdJZj1cInJvdGF0ZVwiIFtpY29uXT1cInJvdGF0ZVJpZ2h0SWNvblwiIChvbkNsaWNrKT1cInJvdGF0ZVJpZ2h0KClcIj48L25neC1nYWxsZXJ5LWFjdGlvbj5cbiAgICAgICAgICAgICAgICA8bmd4LWdhbGxlcnktYWN0aW9uICpuZ0lmPVwiZnVsbHNjcmVlblwiIFtpY29uXT1cIiduZ3gtZ2FsbGVyeS1mdWxsc2NyZWVuICcgKyBmdWxsc2NyZWVuSWNvblwiIChvbkNsaWNrKT1cIm1hbmFnZUZ1bGxzY3JlZW4oKVwiPjwvbmd4LWdhbGxlcnktYWN0aW9uPlxuICAgICAgICAgICAgICAgIDxuZ3gtZ2FsbGVyeS1hY3Rpb24gW2ljb25dPVwiJ25neC1nYWxsZXJ5LWNsb3NlICcgKyBjbG9zZUljb25cIiAob25DbGljayk9XCJjbG9zZSgpXCI+PC9uZ3gtZ2FsbGVyeS1hY3Rpb24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJuZ3gtc3Bpbm5lci13cmFwcGVyIG5neC1nYWxsZXJ5LWNlbnRlclwiIFtjbGFzcy5uZ3gtZ2FsbGVyeS1hY3RpdmVdPVwic2hvd1NwaW5uZXJcIj5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwibmd4LWdhbGxlcnktaWNvbiBuZ3gtZ2FsbGVyeS1zcGlubmVyIHt7c3Bpbm5lckljb259fVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJuZ3gtZ2FsbGVyeS1wcmV2aWV3LXdyYXBwZXJcIiAoY2xpY2spPVwiY2xvc2VPbkNsaWNrICYmIGNsb3NlKClcIiAobW91c2V1cCk9XCJtb3VzZVVwSGFuZGxlcigkZXZlbnQpXCIgKG1vdXNlbW92ZSk9XCJtb3VzZU1vdmVIYW5kbGVyKCRldmVudClcIiAodG91Y2hlbmQpPVwibW91c2VVcEhhbmRsZXIoJGV2ZW50KVwiICh0b3VjaG1vdmUpPVwibW91c2VNb3ZlSGFuZGxlcigkZXZlbnQpXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibmd4LWdhbGxlcnktcHJldmlldy1pbWctd3JhcHBlclwiPlxuICAgICAgICAgICAgICAgIDxpbWcgKm5nSWY9XCJzcmNcIiAjcHJldmlld0ltYWdlIGNsYXNzPVwibmd4LWdhbGxlcnktcHJldmlldy1pbWcgbmd4LWdhbGxlcnktY2VudGVyXCIgW3NyY109XCJzcmNcIiAoY2xpY2spPVwiJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXCIgKG1vdXNlZW50ZXIpPVwiaW1hZ2VNb3VzZUVudGVyKClcIiAobW91c2VsZWF2ZSk9XCJpbWFnZU1vdXNlTGVhdmUoKVwiIChtb3VzZWRvd24pPVwibW91c2VEb3duSGFuZGxlcigkZXZlbnQpXCIgKHRvdWNoc3RhcnQpPVwibW91c2VEb3duSGFuZGxlcigkZXZlbnQpXCIgW2NsYXNzLm5neC1nYWxsZXJ5LWFjdGl2ZV09XCIhbG9hZGluZ1wiIFtjbGFzcy5hbmltYXRpb25dPVwiYW5pbWF0aW9uXCIgW2NsYXNzLm5neC1nYWxsZXJ5LWdyYWJdPVwiY2FuRHJhZ09uWm9vbSgpXCIgW3N0eWxlLnRyYW5zZm9ybV09XCJnZXRUcmFuc2Zvcm0oKVwiIFtzdHlsZS5sZWZ0XT1cInBvc2l0aW9uTGVmdCArICdweCdcIiBbc3R5bGUudG9wXT1cInBvc2l0aW9uVG9wICsgJ3B4J1wiLz5cbiAgICAgICAgICAgICAgICA8bmd4LWdhbGxlcnktYnVsbGV0cyAqbmdJZj1cImJ1bGxldHNcIiBbY291bnRdPVwiaW1hZ2VzLmxlbmd0aFwiIFthY3RpdmVdPVwiaW5kZXhcIiAob25DaGFuZ2UpPVwic2hvd0F0SW5kZXgoJGV2ZW50KVwiPjwvbmd4LWdhbGxlcnktYnVsbGV0cz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5neC1nYWxsZXJ5LXByZXZpZXctdGV4dFwiICpuZ0lmPVwic2hvd0Rlc2NyaXB0aW9uICYmIGRlc2NyaXB0aW9uXCIgW2lubmVySFRNTF09XCJkZXNjcmlwdGlvblwiIChjbGljayk9XCIkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBzdHlsZVVybHM6IFsnLi9uZ3gtZ2FsbGVyeS1wcmV2aWV3LmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTmd4R2FsbGVyeVByZXZpZXdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG5cbiAgICBzcmM6IFNhZmVVcmw7XG4gICAgc3JjSW5kZXg6IG51bWJlcjtcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICAgIHNob3dTcGlubmVyID0gZmFsc2U7XG4gICAgcG9zaXRpb25MZWZ0ID0gMDtcbiAgICBwb3NpdGlvblRvcCA9IDA7XG4gICAgem9vbVZhbHVlID0gMTtcbiAgICBsb2FkaW5nID0gZmFsc2U7XG4gICAgcm90YXRlVmFsdWUgPSAwO1xuICAgIGluZGV4ID0gMDtcblxuICAgIEBJbnB1dCgpIGltYWdlczogc3RyaW5nW10gfCBTYWZlUmVzb3VyY2VVcmxbXTtcbiAgICBASW5wdXQoKSBkZXNjcmlwdGlvbnM6IHN0cmluZ1tdO1xuICAgIEBJbnB1dCgpIHNob3dEZXNjcmlwdGlvbjogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBhcnJvd3M6IGJvb2xlYW47XG4gICAgQElucHV0KCkgYXJyb3dzQXV0b0hpZGU6IGJvb2xlYW47XG4gICAgQElucHV0KCkgc3dpcGU6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZnVsbHNjcmVlbjogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBmb3JjZUZ1bGxzY3JlZW46IGJvb2xlYW47XG4gICAgQElucHV0KCkgY2xvc2VPbkNsaWNrOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGNsb3NlT25Fc2M6IGJvb2xlYW47XG4gICAgQElucHV0KCkga2V5Ym9hcmROYXZpZ2F0aW9uOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGFycm93UHJldkljb246IHN0cmluZztcbiAgICBASW5wdXQoKSBhcnJvd05leHRJY29uOiBzdHJpbmc7XG4gICAgQElucHV0KCkgY2xvc2VJY29uOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZnVsbHNjcmVlbkljb246IHN0cmluZztcbiAgICBASW5wdXQoKSBzcGlubmVySWNvbjogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGF1dG9QbGF5OiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGF1dG9QbGF5SW50ZXJ2YWw6IG51bWJlcjtcbiAgICBASW5wdXQoKSBhdXRvUGxheVBhdXNlT25Ib3ZlcjogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBpbmZpbml0eU1vdmU6IGJvb2xlYW47XG4gICAgQElucHV0KCkgem9vbTogYm9vbGVhbjtcbiAgICBASW5wdXQoKSB6b29tU3RlcDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIHpvb21NYXg6IG51bWJlcjtcbiAgICBASW5wdXQoKSB6b29tTWluOiBudW1iZXI7XG4gICAgQElucHV0KCkgem9vbUluSWNvbjogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHpvb21PdXRJY29uOiBzdHJpbmc7XG4gICAgQElucHV0KCkgYW5pbWF0aW9uOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGFjdGlvbnM6IE5neEdhbGxlcnlBY3Rpb25bXTtcbiAgICBASW5wdXQoKSByb3RhdGU6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcm90YXRlTGVmdEljb246IHN0cmluZztcbiAgICBASW5wdXQoKSByb3RhdGVSaWdodEljb246IHN0cmluZztcbiAgICBASW5wdXQoKSBkb3dubG9hZDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBkb3dubG9hZEljb246IHN0cmluZztcbiAgICBASW5wdXQoKSBidWxsZXRzOiBzdHJpbmc7XG5cbiAgICBAT3V0cHV0KCkgb25PcGVuID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIEBPdXRwdXQoKSBvbkNsb3NlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIEBPdXRwdXQoKSBvbkFjdGl2ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuXG4gICAgQFZpZXdDaGlsZCgncHJldmlld0ltYWdlJykgcHJldmlld0ltYWdlOiBFbGVtZW50UmVmO1xuXG4gICAgcHJpdmF0ZSBpc09wZW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIHRpbWVyO1xuICAgIHByaXZhdGUgaW5pdGlhbFggPSAwO1xuICAgIHByaXZhdGUgaW5pdGlhbFkgPSAwO1xuICAgIHByaXZhdGUgaW5pdGlhbExlZnQgPSAwO1xuICAgIHByaXZhdGUgaW5pdGlhbFRvcCA9IDA7XG4gICAgcHJpdmF0ZSBpc01vdmUgPSBmYWxzZTtcblxuICAgIHByaXZhdGUga2V5RG93bkxpc3RlbmVyOiBGdW5jdGlvbjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgc2FuaXRpemF0aW9uOiBEb21TYW5pdGl6ZXIsIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgICBwcml2YXRlIGhlbHBlclNlcnZpY2U6IE5neEdhbGxlcnlIZWxwZXJTZXJ2aWNlLCBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHt9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuYXJyb3dzICYmIHRoaXMuYXJyb3dzQXV0b0hpZGUpIHtcbiAgICAgICAgICAgIHRoaXMuYXJyb3dzID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgICAgIGlmIChjaGFuZ2VzWydzd2lwZSddKSB7XG4gICAgICAgICAgICB0aGlzLmhlbHBlclNlcnZpY2UubWFuYWdlU3dpcGUodGhpcy5zd2lwZSwgdGhpcy5lbGVtZW50UmVmLFxuICAgICAgICAgICAgICAgICdwcmV2aWV3JywgKCkgPT4gdGhpcy5zaG93TmV4dCgpLCAoKSA9PiB0aGlzLnNob3dQcmV2KCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLmtleURvd25MaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5rZXlEb3duTGlzdGVuZXIoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ21vdXNlZW50ZXInKSBvbk1vdXNlRW50ZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLmFycm93c0F1dG9IaWRlICYmICF0aGlzLmFycm93cykge1xuICAgICAgICAgICAgdGhpcy5hcnJvd3MgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignbW91c2VsZWF2ZScpIG9uTW91c2VMZWF2ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuYXJyb3dzQXV0b0hpZGUgJiYgdGhpcy5hcnJvd3MpIHtcbiAgICAgICAgICAgIHRoaXMuYXJyb3dzID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbktleURvd24oZSkge1xuICAgICAgICBpZiAodGhpcy5pc09wZW4pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmtleWJvYXJkTmF2aWdhdGlvbikge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzS2V5Ym9hcmRQcmV2KGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1ByZXYoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNLZXlib2FyZE5leHQoZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93TmV4dCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmNsb3NlT25Fc2MgJiYgdGhpcy5pc0tleWJvYXJkRXNjKGUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb3BlbihpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25PcGVuLmVtaXQoKTtcblxuICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgICAgIHRoaXMuaXNPcGVuID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zaG93KHRydWUpO1xuXG4gICAgICAgIGlmICh0aGlzLmZvcmNlRnVsbHNjcmVlbikge1xuICAgICAgICAgICAgdGhpcy5tYW5hZ2VGdWxsc2NyZWVuKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmtleURvd25MaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFwid2luZG93XCIsIFwia2V5ZG93blwiLCAoZSkgPT4gdGhpcy5vbktleURvd24oZSkpO1xuICAgIH1cblxuICAgIGNsb3NlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmlzT3BlbiA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNsb3NlRnVsbHNjcmVlbigpO1xuICAgICAgICB0aGlzLm9uQ2xvc2UuZW1pdCgpO1xuXG4gICAgICAgIHRoaXMuc3RvcEF1dG9QbGF5KCk7XG5cbiAgICAgICAgaWYgKHRoaXMua2V5RG93bkxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmtleURvd25MaXN0ZW5lcigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW1hZ2VNb3VzZUVudGVyKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5hdXRvUGxheSAmJiB0aGlzLmF1dG9QbGF5UGF1c2VPbkhvdmVyKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BBdXRvUGxheSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW1hZ2VNb3VzZUxlYXZlKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5hdXRvUGxheSAmJiB0aGlzLmF1dG9QbGF5UGF1c2VPbkhvdmVyKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0QXV0b1BsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXJ0QXV0b1BsYXkoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmF1dG9QbGF5KSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BBdXRvUGxheSgpO1xuXG4gICAgICAgICAgICB0aGlzLnRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNob3dOZXh0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRleCA9IC0xO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dOZXh0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcy5hdXRvUGxheUludGVydmFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0b3BBdXRvUGxheSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMudGltZXIpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNob3dBdEluZGV4KGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICB9XG5cbiAgICBzaG93TmV4dCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuY2FuU2hvd05leHQoKSkge1xuICAgICAgICAgICAgdGhpcy5pbmRleCsrO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pbmRleCA9PT0gdGhpcy5pbWFnZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG93UHJldigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuY2FuU2hvd1ByZXYoKSkge1xuICAgICAgICAgICAgdGhpcy5pbmRleC0tO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pbmRleCA8IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4ID0gdGhpcy5pbWFnZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjYW5TaG93TmV4dCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMubG9hZGluZykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW1hZ2VzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbmZpbml0eU1vdmUgfHwgdGhpcy5pbmRleCA8IHRoaXMuaW1hZ2VzLmxlbmd0aCAtIDEgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjYW5TaG93UHJldigpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMubG9hZGluZykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW1hZ2VzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbmZpbml0eU1vdmUgfHwgdGhpcy5pbmRleCA+IDAgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtYW5hZ2VGdWxsc2NyZWVuKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5mdWxsc2NyZWVuIHx8IHRoaXMuZm9yY2VGdWxsc2NyZWVuKSB7XG4gICAgICAgICAgICBjb25zdCBkb2MgPSA8YW55PmRvY3VtZW50O1xuXG4gICAgICAgICAgICBpZiAoIWRvYy5mdWxsc2NyZWVuRWxlbWVudCAmJiAhZG9jLm1vekZ1bGxTY3JlZW5FbGVtZW50XG4gICAgICAgICAgICAgICAgJiYgIWRvYy53ZWJraXRGdWxsc2NyZWVuRWxlbWVudCAmJiAhZG9jLm1zRnVsbHNjcmVlbkVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5GdWxsc2NyZWVuKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VGdWxsc2NyZWVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRTYWZlVXJsKGltYWdlOiBzdHJpbmcpOiBTYWZlVXJsIHtcbiAgICAgICAgcmV0dXJuIGltYWdlLnN1YnN0cigwLCAxMCkgPT09ICdkYXRhOmltYWdlJyA/XG4gICAgICAgICAgICBpbWFnZSA6IHRoaXMuc2FuaXRpemF0aW9uLmJ5cGFzc1NlY3VyaXR5VHJ1c3RVcmwoaW1hZ2UpO1xuICAgIH1cblxuICAgIHpvb21JbigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuY2FuWm9vbUluKCkpIHtcbiAgICAgICAgICAgIHRoaXMuem9vbVZhbHVlICs9IHRoaXMuem9vbVN0ZXA7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnpvb21WYWx1ZSA+IHRoaXMuem9vbU1heCkge1xuICAgICAgICAgICAgICAgIHRoaXMuem9vbVZhbHVlID0gdGhpcy56b29tTWF4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgem9vbU91dCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuY2FuWm9vbU91dCgpKSB7XG4gICAgICAgICAgICB0aGlzLnpvb21WYWx1ZSAtPSB0aGlzLnpvb21TdGVwO1xuXG4gICAgICAgICAgICBpZiAodGhpcy56b29tVmFsdWUgPCB0aGlzLnpvb21NaW4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnpvb21WYWx1ZSA9IHRoaXMuem9vbU1pbjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuem9vbVZhbHVlIDw9IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0UG9zaXRpb24oKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcm90YXRlTGVmdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yb3RhdGVWYWx1ZSAtPSA5MDtcbiAgICB9XG5cbiAgICByb3RhdGVSaWdodCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yb3RhdGVWYWx1ZSArPSA5MDtcbiAgICB9XG5cbiAgICBnZXRUcmFuc2Zvcm0oKTogU2FmZVN0eWxlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2FuaXRpemF0aW9uLmJ5cGFzc1NlY3VyaXR5VHJ1c3RTdHlsZSgnc2NhbGUoJyArIHRoaXMuem9vbVZhbHVlICsgJykgcm90YXRlKCcgKyB0aGlzLnJvdGF0ZVZhbHVlICsgJ2RlZyknKTtcbiAgICB9XG5cbiAgICBjYW5ab29tSW4oKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnpvb21WYWx1ZSA8IHRoaXMuem9vbU1heCA/IHRydWUgOiBmYWxzZTtcbiAgICB9XG5cbiAgICBjYW5ab29tT3V0KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy56b29tVmFsdWUgPiB0aGlzLnpvb21NaW4gPyB0cnVlIDogZmFsc2U7XG4gICAgfVxuXG4gICAgY2FuRHJhZ09uWm9vbSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuem9vbSAmJiB0aGlzLnpvb21WYWx1ZSA+IDE7XG4gICAgfVxuXG4gICAgbW91c2VEb3duSGFuZGxlcihlKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmNhbkRyYWdPblpvb20oKSkge1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsWCA9IHRoaXMuZ2V0Q2xpZW50WChlKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbFkgPSB0aGlzLmdldENsaWVudFkoZSk7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxMZWZ0ID0gdGhpcy5wb3NpdGlvbkxlZnQ7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxUb3AgPSB0aGlzLnBvc2l0aW9uVG9wO1xuICAgICAgICAgICAgdGhpcy5pc01vdmUgPSB0cnVlO1xuXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb3VzZVVwSGFuZGxlcihlKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaXNNb3ZlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgbW91c2VNb3ZlSGFuZGxlcihlKSB7XG4gICAgICAgIGlmICh0aGlzLmlzTW92ZSkge1xuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbkxlZnQgPSB0aGlzLmluaXRpYWxMZWZ0ICsgKHRoaXMuZ2V0Q2xpZW50WChlKSAtIHRoaXMuaW5pdGlhbFgpO1xuICAgICAgICAgICAgdGhpcy5wb3NpdGlvblRvcCA9IHRoaXMuaW5pdGlhbFRvcCArICh0aGlzLmdldENsaWVudFkoZSkgLSB0aGlzLmluaXRpYWxZKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Q2xpZW50WChlKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIGUudG91Y2hlcyAmJiBlLnRvdWNoZXMubGVuZ3RoID8gZS50b3VjaGVzWzBdLmNsaWVudFggOiBlLmNsaWVudFg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRDbGllbnRZKGUpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gZS50b3VjaGVzICYmIGUudG91Y2hlcy5sZW5ndGggPyBlLnRvdWNoZXNbMF0uY2xpZW50WSA6IGUuY2xpZW50WTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc2V0UG9zaXRpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnpvb20pIHtcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25MZWZ0ID0gMDtcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25Ub3AgPSAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc0tleWJvYXJkTmV4dChlKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBlLmtleUNvZGUgPT09IDM5ID8gdHJ1ZSA6IGZhbHNlO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNLZXlib2FyZFByZXYoZSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gZS5rZXlDb2RlID09PSAzNyA/IHRydWUgOiBmYWxzZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzS2V5Ym9hcmRFc2MoZSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gZS5rZXlDb2RlID09PSAyNyA/IHRydWUgOiBmYWxzZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9wZW5GdWxsc2NyZWVuKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gPGFueT5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cbiAgICAgICAgaWYgKGVsZW1lbnQucmVxdWVzdEZ1bGxzY3JlZW4pIHtcbiAgICAgICAgICAgIGVsZW1lbnQucmVxdWVzdEZ1bGxzY3JlZW4oKTtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50Lm1zUmVxdWVzdEZ1bGxzY3JlZW4pIHtcbiAgICAgICAgICAgIGVsZW1lbnQubXNSZXF1ZXN0RnVsbHNjcmVlbigpO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQubW96UmVxdWVzdEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgIGVsZW1lbnQubW96UmVxdWVzdEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuKSB7XG4gICAgICAgICAgICBlbGVtZW50LndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNsb3NlRnVsbHNjcmVlbigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaXNGdWxsc2NyZWVuKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGRvYyA9IDxhbnk+ZG9jdW1lbnQ7XG5cbiAgICAgICAgICAgIGlmIChkb2MuZXhpdEZ1bGxzY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBkb2MuZXhpdEZ1bGxzY3JlZW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZG9jLm1zRXhpdEZ1bGxzY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBkb2MubXNFeGl0RnVsbHNjcmVlbigpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkb2MubW96Q2FuY2VsRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGRvYy5tb3pDYW5jZWxGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRvYy53ZWJraXRFeGl0RnVsbHNjcmVlbikge1xuICAgICAgICAgICAgICAgIGRvYy53ZWJraXRFeGl0RnVsbHNjcmVlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc0Z1bGxzY3JlZW4oKSB7XG4gICAgICAgIGNvbnN0IGRvYyA9IDxhbnk+ZG9jdW1lbnQ7XG5cbiAgICAgICAgcmV0dXJuIGRvYy5mdWxsc2NyZWVuRWxlbWVudCB8fCBkb2Mud2Via2l0RnVsbHNjcmVlbkVsZW1lbnRcbiAgICAgICAgICAgIHx8IGRvYy5tb3pGdWxsU2NyZWVuRWxlbWVudCB8fCBkb2MubXNGdWxsc2NyZWVuRWxlbWVudDtcbiAgICB9XG5cblxuXG4gICAgcHJpdmF0ZSBzaG93KGZpcnN0ID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zdG9wQXV0b1BsYXkoKTtcblxuICAgICAgICB0aGlzLm9uQWN0aXZlQ2hhbmdlLmVtaXQodGhpcy5pbmRleCk7XG5cbiAgICAgICAgaWYgKGZpcnN0IHx8ICF0aGlzLmFuaW1hdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fc2hvdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLl9zaG93KCksIDYwMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIF9zaG93KCkge1xuICAgICAgICB0aGlzLnpvb21WYWx1ZSA9IDE7XG4gICAgICAgIHRoaXMucm90YXRlVmFsdWUgPSAwO1xuICAgICAgICB0aGlzLnJlc2V0UG9zaXRpb24oKTtcblxuICAgICAgICB0aGlzLnNyYyA9IHRoaXMuZ2V0U2FmZVVybCg8c3RyaW5nPnRoaXMuaW1hZ2VzW3RoaXMuaW5kZXhdKTtcbiAgICAgICAgdGhpcy5zcmNJbmRleCA9IHRoaXMuaW5kZXg7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSB0aGlzLmRlc2NyaXB0aW9uc1t0aGlzLmluZGV4XTtcbiAgICAgICAgdGhpcy5jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTG9hZGVkKHRoaXMucHJldmlld0ltYWdlLm5hdGl2ZUVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydEF1dG9QbGF5KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmxvYWRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1NwaW5uZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICB0aGlzLnByZXZpZXdJbWFnZS5uYXRpdmVFbGVtZW50Lm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1NwaW5uZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmV2aWV3SW1hZ2UubmF0aXZlRWxlbWVudC5vbmxvYWQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0QXV0b1BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc0xvYWRlZChpbWcpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKCFpbWcuY29tcGxldGUpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgaW1nLm5hdHVyYWxXaWR0aCAhPT0gJ3VuZGVmaW5lZCcgJiYgaW1nLm5hdHVyYWxXaWR0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuIl19