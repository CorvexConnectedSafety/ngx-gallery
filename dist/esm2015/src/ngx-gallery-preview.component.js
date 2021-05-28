import { ChangeDetectorRef, Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ElementRef, HostListener, ViewChild, Renderer2 } from '@angular/core';
import { SafeResourceUrl, DomSanitizer, SafeUrl, SafeStyle } from '@angular/platform-browser';
import { NgxGalleryHelperService } from './ngx-gallery-helper.service';
export class NgxGalleryPreviewComponent {
    constructor(sanitization, elementRef, helperService, renderer, changeDetectorRef) {
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
    ngOnInit() {
        if (this.arrows && this.arrowsAutoHide) {
            this.arrows = false;
        }
    }
    ngOnChanges(changes) {
        if (changes['swipe']) {
            this.helperService.manageSwipe(this.swipe, this.elementRef, 'preview', () => this.showNext(), () => this.showPrev());
        }
    }
    ngOnDestroy() {
        if (this.keyDownListener) {
            this.keyDownListener();
        }
    }
    onMouseEnter() {
        if (this.arrowsAutoHide && !this.arrows) {
            this.arrows = true;
        }
    }
    onMouseLeave() {
        if (this.arrowsAutoHide && this.arrows) {
            this.arrows = false;
        }
    }
    onKeyDown(e) {
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
    }
    open(index) {
        this.onOpen.emit();
        this.index = index;
        this.isOpen = true;
        this.show(true);
        if (this.forceFullscreen) {
            this.manageFullscreen();
        }
        this.keyDownListener = this.renderer.listen("window", "keydown", (e) => this.onKeyDown(e));
    }
    close() {
        this.isOpen = false;
        this.closeFullscreen();
        this.onClose.emit();
        this.stopAutoPlay();
        if (this.keyDownListener) {
            this.keyDownListener();
        }
    }
    imageMouseEnter() {
        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.stopAutoPlay();
        }
    }
    imageMouseLeave() {
        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.startAutoPlay();
        }
    }
    startAutoPlay() {
        if (this.autoPlay) {
            this.stopAutoPlay();
            this.timer = setTimeout(() => {
                if (!this.showNext()) {
                    this.index = -1;
                    this.showNext();
                }
            }, this.autoPlayInterval);
        }
    }
    stopAutoPlay() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }
    showAtIndex(index) {
        this.index = index;
        this.show();
    }
    showNext() {
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
    }
    showPrev() {
        if (this.canShowPrev()) {
            this.index--;
            if (this.index < 0) {
                this.index = this.images.length - 1;
            }
            this.show();
        }
    }
    canShowNext() {
        if (this.loading) {
            return false;
        }
        else if (this.images) {
            return this.infinityMove || this.index < this.images.length - 1 ? true : false;
        }
        else {
            return false;
        }
    }
    canShowPrev() {
        if (this.loading) {
            return false;
        }
        else if (this.images) {
            return this.infinityMove || this.index > 0 ? true : false;
        }
        else {
            return false;
        }
    }
    manageFullscreen() {
        if (this.fullscreen || this.forceFullscreen) {
            const doc = document;
            if (!doc.fullscreenElement && !doc.mozFullScreenElement
                && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
                this.openFullscreen();
            }
            else {
                this.closeFullscreen();
            }
        }
    }
    getSafeUrl(image) {
        return image.substr(0, 10) === 'data:image' ?
            image : this.sanitization.bypassSecurityTrustUrl(image);
    }
    zoomIn() {
        if (this.canZoomIn()) {
            this.zoomValue += this.zoomStep;
            if (this.zoomValue > this.zoomMax) {
                this.zoomValue = this.zoomMax;
            }
        }
    }
    zoomOut() {
        if (this.canZoomOut()) {
            this.zoomValue -= this.zoomStep;
            if (this.zoomValue < this.zoomMin) {
                this.zoomValue = this.zoomMin;
            }
            if (this.zoomValue <= 1) {
                this.resetPosition();
            }
        }
    }
    rotateLeft() {
        this.rotateValue -= 90;
    }
    rotateRight() {
        this.rotateValue += 90;
    }
    getTransform() {
        return this.sanitization.bypassSecurityTrustStyle('scale(' + this.zoomValue + ') rotate(' + this.rotateValue + 'deg)');
    }
    canZoomIn() {
        return this.zoomValue < this.zoomMax ? true : false;
    }
    canZoomOut() {
        return this.zoomValue > this.zoomMin ? true : false;
    }
    canDragOnZoom() {
        return this.zoom && this.zoomValue > 1;
    }
    mouseDownHandler(e) {
        if (this.canDragOnZoom()) {
            this.initialX = this.getClientX(e);
            this.initialY = this.getClientY(e);
            this.initialLeft = this.positionLeft;
            this.initialTop = this.positionTop;
            this.isMove = true;
            e.preventDefault();
        }
    }
    mouseUpHandler(e) {
        this.isMove = false;
    }
    mouseMoveHandler(e) {
        if (this.isMove) {
            this.positionLeft = this.initialLeft + (this.getClientX(e) - this.initialX);
            this.positionTop = this.initialTop + (this.getClientY(e) - this.initialY);
        }
    }
    getClientX(e) {
        return e.touches && e.touches.length ? e.touches[0].clientX : e.clientX;
    }
    getClientY(e) {
        return e.touches && e.touches.length ? e.touches[0].clientY : e.clientY;
    }
    resetPosition() {
        if (this.zoom) {
            this.positionLeft = 0;
            this.positionTop = 0;
        }
    }
    isKeyboardNext(e) {
        return e.keyCode === 39 ? true : false;
    }
    isKeyboardPrev(e) {
        return e.keyCode === 37 ? true : false;
    }
    isKeyboardEsc(e) {
        return e.keyCode === 27 ? true : false;
    }
    openFullscreen() {
        const element = document.documentElement;
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
    }
    closeFullscreen() {
        if (this.isFullscreen()) {
            const doc = document;
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
    }
    isFullscreen() {
        const doc = document;
        return doc.fullscreenElement || doc.webkitFullscreenElement
            || doc.mozFullScreenElement || doc.msFullscreenElement;
    }
    show(first = false) {
        this.loading = true;
        this.stopAutoPlay();
        this.onActiveChange.emit(this.index);
        if (first || !this.animation) {
            this._show();
        }
        else {
            setTimeout(() => this._show(), 600);
        }
    }
    _show() {
        this.zoomValue = 1;
        this.rotateValue = 0;
        this.resetPosition();
        this.src = this.getSafeUrl(this.images[this.index]);
        this.srcIndex = this.index;
        this.description = this.descriptions[this.index];
        this.changeDetectorRef.markForCheck();
        setTimeout(() => {
            if (this.isLoaded(this.previewImage.nativeElement)) {
                this.loading = false;
                this.startAutoPlay();
                this.changeDetectorRef.markForCheck();
            }
            else {
                setTimeout(() => {
                    if (this.loading) {
                        this.showSpinner = true;
                        this.changeDetectorRef.markForCheck();
                    }
                });
                this.previewImage.nativeElement.onload = () => {
                    this.loading = false;
                    this.showSpinner = false;
                    this.previewImage.nativeElement.onload = null;
                    this.startAutoPlay();
                    this.changeDetectorRef.markForCheck();
                };
            }
        });
    }
    isLoaded(img) {
        if (!img.complete) {
            return false;
        }
        if (typeof img.naturalWidth !== 'undefined' && img.naturalWidth === 0) {
            return false;
        }
        return true;
    }
}
NgxGalleryPreviewComponent.ctorParameters = () => [
    { type: DomSanitizer },
    { type: ElementRef },
    { type: NgxGalleryHelperService },
    { type: Renderer2 },
    { type: ChangeDetectorRef }
];
NgxGalleryPreviewComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-gallery-preview',
                template: `
        <ngx-gallery-arrows *ngIf="arrows" (onPrevClick)="showPrev()" (onNextClick)="showNext()" [prevDisabled]="!canShowPrev()" [nextDisabled]="!canShowNext()" [arrowPrevIcon]="arrowPrevIcon" [arrowNextIcon]="arrowNextIcon"></ngx-gallery-arrows>
        <div class="ngx-gallery-preview-top">
            <div class="ngx-gallery-preview-icons">
                <ngx-gallery-action *ngFor="let action of actions" [icon]="action.icon" [disabled]="action.disabled" [titleText]="action.titleText" (onClick)="action.onClick($event, index)"></ngx-gallery-action>
                <a *ngIf="download && src" [href]="src" class="ngx-gallery-icon" aria-hidden="true" download>
                    <i class="ngx-gallery-icon-content {{ downloadIcon }}"></i>
                </a>
                <ngx-gallery-action *ngIf="zoom" [icon]="zoomOutIcon" [disabled]="!canZoomOut()" (onClick)="zoomOut()"></ngx-gallery-action>
                <ngx-gallery-action *ngIf="zoom" [icon]="zoomInIcon" [disabled]="!canZoomIn()" (onClick)="zoomIn()"></ngx-gallery-action>
                <ngx-gallery-action *ngIf="rotate" [icon]="rotateLeftIcon" (onClick)="rotateLeft()"></ngx-gallery-action>
                <ngx-gallery-action *ngIf="rotate" [icon]="rotateRightIcon" (onClick)="rotateRight()"></ngx-gallery-action>
                <ngx-gallery-action *ngIf="fullscreen" [icon]="'ngx-gallery-fullscreen ' + fullscreenIcon" (onClick)="manageFullscreen()"></ngx-gallery-action>
                <ngx-gallery-action [icon]="'ngx-gallery-close ' + closeIcon" (onClick)="close()"></ngx-gallery-action>
            </div>
        </div>
        <div class="ngx-spinner-wrapper ngx-gallery-center" [class.ngx-gallery-active]="showSpinner">
            <i class="ngx-gallery-icon ngx-gallery-spinner {{spinnerIcon}}" aria-hidden="true"></i>
        </div>
        <div class="ngx-gallery-preview-wrapper" (click)="closeOnClick && close()" (mouseup)="mouseUpHandler($event)" (mousemove)="mouseMoveHandler($event)" (touchend)="mouseUpHandler($event)" (touchmove)="mouseMoveHandler($event)">
            <div class="ngx-gallery-preview-img-wrapper">
                <img *ngIf="src" #previewImage class="ngx-gallery-preview-img ngx-gallery-center" [src]="src" (click)="$event.stopPropagation()" (mouseenter)="imageMouseEnter()" (mouseleave)="imageMouseLeave()" (mousedown)="mouseDownHandler($event)" (touchstart)="mouseDownHandler($event)" [class.ngx-gallery-active]="!loading" [class.animation]="animation" [class.ngx-gallery-grab]="canDragOnZoom()" [style.transform]="getTransform()" [style.left]="positionLeft + 'px'" [style.top]="positionTop + 'px'"/>
                <ngx-gallery-bullets *ngIf="bullets" [count]="images.length" [active]="index" (onChange)="showAtIndex($event)"></ngx-gallery-bullets>
            </div>
            <div class="ngx-gallery-preview-text" *ngIf="showDescription && description" [innerHTML]="description" (click)="$event.stopPropagation()"></div>
        </div>
    `,
                styles: [":host(.ngx-gallery-active){width:100%;height:100%;position:fixed;left:0;top:0;background:rgba(0,0,0,.7);z-index:10000;display:inline-block}:host{display:none}:host /deep/ .ngx-gallery-arrow{font-size:50px}:host /deep/ ngx-gallery-bullets{height:5%;align-items:center;padding:0}.ngx-gallery-preview-img{opacity:0;max-width:90%;max-height:90%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:transform .5s}.ngx-gallery-preview-img.animation{transition:opacity .5s linear,transform .5s}.ngx-gallery-preview-img.ngx-gallery-active{opacity:1}.ngx-gallery-preview-img.ngx-gallery-grab{cursor:grab;cursor:-webkit-grab}.ngx-gallery-icon.ngx-gallery-spinner{font-size:50px;left:0;display:inline-block}:host /deep/ .ngx-gallery-preview-top{position:absolute;width:100%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}:host /deep/ .ngx-gallery-preview-icons{float:right}:host /deep/ .ngx-gallery-preview-icons .ngx-gallery-icon{position:relative;margin-right:10px;margin-top:10px;font-size:25px;cursor:pointer;text-decoration:none}:host /deep/ .ngx-gallery-preview-icons .ngx-gallery-icon.ngx-gallery-icon-disabled{cursor:default;opacity:.4}.ngx-spinner-wrapper{width:50px;height:50px;display:none}.ngx-spinner-wrapper.ngx-gallery-active{display:inline-block}.ngx-gallery-center{position:absolute;left:0;right:0;bottom:0;margin:auto;top:0}.ngx-gallery-preview-text{width:100%;background:rgba(0,0,0,.7);padding:10px;text-align:center;color:#fff;font-size:16px;flex:0 1 auto;z-index:10}.ngx-gallery-preview-wrapper{width:100%;height:100%;display:flex;flex-flow:column}.ngx-gallery-preview-img-wrapper{flex:1 1 auto;position:relative}"]
            },] }
];
NgxGalleryPreviewComponent.ctorParameters = () => [
    { type: DomSanitizer },
    { type: ElementRef },
    { type: NgxGalleryHelperService },
    { type: Renderer2 },
    { type: ChangeDetectorRef }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktcHJldmlldy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZ2FsbGVyeS8iLCJzb3VyY2VzIjpbInNyYy9uZ3gtZ2FsbGVyeS1wcmV2aWV3LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM1SyxPQUFPLEVBQUUsZUFBZSxFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFHOUYsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFpQ3ZFLE1BQU0sT0FBTywwQkFBMEI7SUFnRW5DLFlBQW9CLFlBQTBCLEVBQVUsVUFBc0IsRUFDMUQsYUFBc0MsRUFBVSxRQUFtQixFQUNuRSxpQkFBb0M7UUFGcEMsaUJBQVksR0FBWixZQUFZLENBQWM7UUFBVSxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQzFELGtCQUFhLEdBQWIsYUFBYSxDQUF5QjtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkUsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQTdEeEQsZ0JBQVcsR0FBRyxLQUFLLENBQUM7UUFDcEIsaUJBQVksR0FBRyxDQUFDLENBQUM7UUFDakIsZ0JBQVcsR0FBRyxDQUFDLENBQUM7UUFDaEIsY0FBUyxHQUFHLENBQUMsQ0FBQztRQUNkLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsZ0JBQVcsR0FBRyxDQUFDLENBQUM7UUFDaEIsVUFBSyxHQUFHLENBQUMsQ0FBQztRQXFDQSxXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM1QixZQUFPLEdBQUcsSUFB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b3J0IHsgQ2hhbmdlRGV0ZWN0b3JSZWYsIENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBPbkluaXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgRWxlbWVudFJlZiwgSG9zdExpc3RlbmVyLCBWaWV3Q2hpbGQsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU2FmZVJlc291cmNlVXJsLCBEb21TYW5pdGl6ZXIsIFNhZmVVcmwsIFNhZmVTdHlsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuXG5pbXBvcnQgeyBOZ3hHYWxsZXJ5QWN0aW9uIH0gZnJvbSAnLi9uZ3gtZ2FsbGVyeS1hY3Rpb24ubW9kZWwnO1xuaW1wb3J0IHsgTmd4R2FsbGVyeUhlbHBlclNlcnZpY2UgfSBmcm9tICcuL25neC1nYWxsZXJ5LWhlbHBlci5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICduZ3gtZ2FsbGVyeS1wcmV2aWV3JyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8bmd4LWdhbGxlcnktYXJyb3dzICpuZ0lmPVwiYXJyb3dzXCIgKG9uUHJldkNsaWNrKT1cInNob3dQcmV2KClcIiAob25OZXh0Q2xpY2spPVwic2hvd05leHQoKVwiIFtwcmV2RGlzYWJsZWRdPVwiIWNhblNob3dQcmV2KClcIiBbbmV4dERpc2FibGVkXT1cIiFjYW5TaG93TmV4dCgpXCIgW2Fycm93UHJldkljb25dPVwiYXJyb3dQcmV2SWNvblwiIFthcnJvd05leHRJY29uXT1cImFycm93TmV4dEljb25cIj48L25neC1nYWxsZXJ5LWFycm93cz5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm5neC1nYWxsZXJ5LXByZXZpZXctdG9wXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibmd4LWdhbGxlcnktcHJldmlldy1pY29uc1wiPlxuICAgICAgICAgICAgICAgIDxuZ3gtZ2FsbGVyeS1hY3Rpb24gKm5nRm9yPVwibGV0IGFjdGlvbiBvZiBhY3Rpb25zXCIgW2ljb25dPVwiYWN0aW9uLmljb25cIiBbZGlzYWJsZWRdPVwiYWN0aW9uLmRpc2FibGVkXCIgW3RpdGxlVGV4dF09XCJhY3Rpb24udGl0bGVUZXh0XCIgKG9uQ2xpY2spPVwiYWN0aW9uLm9uQ2xpY2soJGV2ZW50LCBpbmRleClcIj48L25neC1nYWxsZXJ5LWFjdGlvbj5cbiAgICAgICAgICAgICAgICA8YSAqbmdJZj1cImRvd25sb2FkICYmIHNyY1wiIFtocmVmXT1cInNyY1wiIGNsYXNzPVwibmd4LWdhbGxlcnktaWNvblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIGRvd25sb2FkPlxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cIm5neC1nYWxsZXJ5LWljb24tY29udGVudCB7eyBkb3dubG9hZEljb24gfX1cIj48L2k+XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDxuZ3gtZ2FsbGVyeS1hY3Rpb24gKm5nSWY9XCJ6b29tXCIgW2ljb25dPVwiem9vbU91dEljb25cIiBbZGlzYWJsZWRdPVwiIWNhblpvb21PdXQoKVwiIChvbkNsaWNrKT1cInpvb21PdXQoKVwiPjwvbmd4LWdhbGxlcnktYWN0aW9uPlxuICAgICAgICAgICAgICAgIDxuZ3gtZ2FsbGVyeS1hY3Rpb24gKm5nSWY9XCJ6b29tXCIgW2ljb25dPVwiem9vbUluSWNvblwiIFtkaXNhYmxlZF09XCIhY2FuWm9vbUluKClcIiAob25DbGljayk9XCJ6b29tSW4oKVwiPjwvbmd4LWdhbGxlcnktYWN0aW9uPlxuICAgICAgICAgICAgICAgIDxuZ3gtZ2FsbGVyeS1hY3Rpb24gKm5nSWY9XCJyb3RhdGVcIiBbaWNvbl09XCJyb3RhdGVMZWZ0SWNvblwiIChvbkNsaWNrKT1cInJvdGF0ZUxlZnQoKVwiPjwvbmd4LWdhbGxlcnktYWN0aW9uPlxuICAgICAgICAgICAgICAgIDxuZ3gtZ2FsbGVyeS1hY3Rpb24gKm5nSWY9XCJyb3RhdGVcIiBbaWNvbl09XCJyb3RhdGVSaWdodEljb25cIiAob25DbGljayk9XCJyb3RhdGVSaWdodCgpXCI+PC9uZ3gtZ2FsbGVyeS1hY3Rpb24+XG4gICAgICAgICAgICAgICAgPG5neC1nYWxsZXJ5LWFjdGlvbiAqbmdJZj1cImZ1bGxzY3JlZW5cIiBbaWNvbl09XCInbmd4LWdhbGxlcnktZnVsbHNjcmVlbiAnICsgZnVsbHNjcmVlbkljb25cIiAob25DbGljayk9XCJtYW5hZ2VGdWxsc2NyZWVuKClcIj48L25neC1nYWxsZXJ5LWFjdGlvbj5cbiAgICAgICAgICAgICAgICA8bmd4LWdhbGxlcnktYWN0aW9uIFtpY29uXT1cIiduZ3gtZ2FsbGVyeS1jbG9zZSAnICsgY2xvc2VJY29uXCIgKG9uQ2xpY2spPVwiY2xvc2UoKVwiPjwvbmd4LWdhbGxlcnktYWN0aW9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwibmd4LXNwaW5uZXItd3JhcHBlciBuZ3gtZ2FsbGVyeS1jZW50ZXJcIiBbY2xhc3Mubmd4LWdhbGxlcnktYWN0aXZlXT1cInNob3dTcGlubmVyXCI+XG4gICAgICAgICAgICA8aSBjbGFzcz1cIm5neC1nYWxsZXJ5LWljb24gbmd4LWdhbGxlcnktc3Bpbm5lciB7e3NwaW5uZXJJY29ufX1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwibmd4LWdhbGxlcnktcHJldmlldy13cmFwcGVyXCIgKGNsaWNrKT1cImNsb3NlT25DbGljayAmJiBjbG9zZSgpXCIgKG1vdXNldXApPVwibW91c2VVcEhhbmRsZXIoJGV2ZW50KVwiIChtb3VzZW1vdmUpPVwibW91c2VNb3ZlSGFuZGxlcigkZXZlbnQpXCIgKHRvdWNoZW5kKT1cIm1vdXNlVXBIYW5kbGVyKCRldmVudClcIiAodG91Y2htb3ZlKT1cIm1vdXNlTW92ZUhhbmRsZXIoJGV2ZW50KVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5neC1nYWxsZXJ5LXByZXZpZXctaW1nLXdyYXBwZXJcIj5cbiAgICAgICAgICAgICAgICA8aW1nICpuZ0lmPVwic3JjXCIgI3ByZXZpZXdJbWFnZSBjbGFzcz1cIm5neC1nYWxsZXJ5LXByZXZpZXctaW1nIG5neC1nYWxsZXJ5LWNlbnRlclwiIFtzcmNdPVwic3JjXCIgKGNsaWNrKT1cIiRldmVudC5zdG9wUHJvcGFnYXRpb24oKVwiIChtb3VzZWVudGVyKT1cImltYWdlTW91c2VFbnRlcigpXCIgKG1vdXNlbGVhdmUpPVwiaW1hZ2VNb3VzZUxlYXZlKClcIiAobW91c2Vkb3duKT1cIm1vdXNlRG93bkhhbmRsZXIoJGV2ZW50KVwiICh0b3VjaHN0YXJ0KT1cIm1vdXNlRG93bkhhbmRsZXIoJGV2ZW50KVwiIFtjbGFzcy5uZ3gtZ2FsbGVyeS1hY3RpdmVdPVwiIWxvYWRpbmdcIiBbY2xhc3MuYW5pbWF0aW9uXT1cImFuaW1hdGlvblwiIFtjbGFzcy5uZ3gtZ2FsbGVyeS1ncmFiXT1cImNhbkRyYWdPblpvb20oKVwiIFtzdHlsZS50cmFuc2Zvcm1dPVwiZ2V0VHJhbnNmb3JtKClcIiBbc3R5bGUubGVmdF09XCJwb3NpdGlvbkxlZnQgKyAncHgnXCIgW3N0eWxlLnRvcF09XCJwb3NpdGlvblRvcCArICdweCdcIi8+XG4gICAgICAgICAgICAgICAgPG5neC1nYWxsZXJ5LWJ1bGxldHMgKm5nSWY9XCJidWxsZXRzXCIgW2NvdW50XT1cImltYWdlcy5sZW5ndGhcIiBbYWN0aXZlXT1cImluZGV4XCIgKG9uQ2hhbmdlKT1cInNob3dBdEluZGV4KCRldmVudClcIj48L25neC1nYWxsZXJ5LWJ1bGxldHM+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJuZ3gtZ2FsbGVyeS1wcmV2aWV3LXRleHRcIiAqbmdJZj1cInNob3dEZXNjcmlwdGlvbiAmJiBkZXNjcmlwdGlvblwiIFtpbm5lckhUTUxdPVwiZGVzY3JpcHRpb25cIiAoY2xpY2spPVwiJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgc3R5bGVVcmxzOiBbJy4vbmd4LWdhbGxlcnktcHJldmlldy5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIE5neEdhbGxlcnlQcmV2aWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuXG4gICAgc3JjOiBTYWZlVXJsO1xuICAgIHNyY0luZGV4OiBudW1iZXI7XG4gICAgZGVzY3JpcHRpb246IHN0cmluZztcbiAgICBzaG93U3Bpbm5lciA9IGZhbHNlO1xuICAgIHBvc2l0aW9uTGVmdCA9IDA7XG4gICAgcG9zaXRpb25Ub3AgPSAwO1xuICAgIHpvb21WYWx1ZSA9IDE7XG4gICAgbG9hZGluZyA9IGZhbHNlO1xuICAgIHJvdGF0ZVZhbHVlID0gMDtcbiAgICBpbmRleCA9IDA7XG5cbiAgICBASW5wdXQoKSBpbWFnZXM6IHN0cmluZ1tdIHwgU2FmZVJlc291cmNlVXJsW107XG4gICAgQElucHV0KCkgZGVzY3JpcHRpb25zOiBzdHJpbmdbXTtcbiAgICBASW5wdXQoKSBzaG93RGVzY3JpcHRpb246IGJvb2xlYW47XG4gICAgQElucHV0KCkgYXJyb3dzOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGFycm93c0F1dG9IaWRlOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHN3aXBlOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGZ1bGxzY3JlZW46IGJvb2xlYW47XG4gICAgQElucHV0KCkgZm9yY2VGdWxsc2NyZWVuOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGNsb3NlT25DbGljazogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBjbG9zZU9uRXNjOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGtleWJvYXJkTmF2aWdhdGlvbjogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBhcnJvd1ByZXZJY29uOiBzdHJpbmc7XG4gICAgQElucHV0KCkgYXJyb3dOZXh0SWNvbjogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGNsb3NlSWNvbjogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGZ1bGxzY3JlZW5JY29uOiBzdHJpbmc7XG4gICAgQElucHV0KCkgc3Bpbm5lckljb246IHN0cmluZztcbiAgICBASW5wdXQoKSBhdXRvUGxheTogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBhdXRvUGxheUludGVydmFsOiBudW1iZXI7XG4gICAgQElucHV0KCkgYXV0b1BsYXlQYXVzZU9uSG92ZXI6IGJvb2xlYW47XG4gICAgQElucHV0KCkgaW5maW5pdHlNb3ZlOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHpvb206IGJvb2xlYW47XG4gICAgQElucHV0KCkgem9vbVN0ZXA6IG51bWJlcjtcbiAgICBASW5wdXQoKSB6b29tTWF4OiBudW1iZXI7XG4gICAgQElucHV0KCkgem9vbU1pbjogbnVtYmVyO1xuICAgIEBJbnB1dCgpIHpvb21Jbkljb246IHN0cmluZztcbiAgICBASW5wdXQoKSB6b29tT3V0SWNvbjogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGFuaW1hdGlvbjogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBhY3Rpb25zOiBOZ3hHYWxsZXJ5QWN0aW9uW107XG4gICAgQElucHV0KCkgcm90YXRlOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHJvdGF0ZUxlZnRJY29uOiBzdHJpbmc7XG4gICAgQElucHV0KCkgcm90YXRlUmlnaHRJY29uOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZG93bmxvYWQ6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZG93bmxvYWRJY29uOiBzdHJpbmc7XG4gICAgQElucHV0KCkgYnVsbGV0czogc3RyaW5nO1xuXG4gICAgQE91dHB1dCgpIG9uT3BlbiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICBAT3V0cHV0KCkgb25DbG9zZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICBAT3V0cHV0KCkgb25BY3RpdmVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcblxuICAgIEBWaWV3Q2hpbGQoJ3ByZXZpZXdJbWFnZScpIHByZXZpZXdJbWFnZTogRWxlbWVudFJlZjtcblxuICAgIHByaXZhdGUgaXNPcGVuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSB0aW1lcjtcbiAgICBwcml2YXRlIGluaXRpYWxYID0gMDtcbiAgICBwcml2YXRlIGluaXRpYWxZID0gMDtcbiAgICBwcml2YXRlIGluaXRpYWxMZWZ0ID0gMDtcbiAgICBwcml2YXRlIGluaXRpYWxUb3AgPSAwO1xuICAgIHByaXZhdGUgaXNNb3ZlID0gZmFsc2U7XG5cbiAgICBwcml2YXRlIGtleURvd25MaXN0ZW5lcjogRnVuY3Rpb247XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNhbml0aXphdGlvbjogRG9tU2FuaXRpemVyLCBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBoZWxwZXJTZXJ2aWNlOiBOZ3hHYWxsZXJ5SGVscGVyU2VydmljZSwgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmKSB7fVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmFycm93cyAmJiB0aGlzLmFycm93c0F1dG9IaWRlKSB7XG4gICAgICAgICAgICB0aGlzLmFycm93cyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgICBpZiAoY2hhbmdlc1snc3dpcGUnXSkge1xuICAgICAgICAgICAgdGhpcy5oZWxwZXJTZXJ2aWNlLm1hbmFnZVN3aXBlKHRoaXMuc3dpcGUsIHRoaXMuZWxlbWVudFJlZixcbiAgICAgICAgICAgICAgICAncHJldmlldycsICgpID0+IHRoaXMuc2hvd05leHQoKSwgKCkgPT4gdGhpcy5zaG93UHJldigpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5rZXlEb3duTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMua2V5RG93bkxpc3RlbmVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdtb3VzZWVudGVyJykgb25Nb3VzZUVudGVyKCkge1xuICAgICAgICBpZiAodGhpcy5hcnJvd3NBdXRvSGlkZSAmJiAhdGhpcy5hcnJvd3MpIHtcbiAgICAgICAgICAgIHRoaXMuYXJyb3dzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ21vdXNlbGVhdmUnKSBvbk1vdXNlTGVhdmUoKSB7XG4gICAgICAgIGlmICh0aGlzLmFycm93c0F1dG9IaWRlICYmIHRoaXMuYXJyb3dzKSB7XG4gICAgICAgICAgICB0aGlzLmFycm93cyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25LZXlEb3duKGUpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNPcGVuKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5rZXlib2FyZE5hdmlnYXRpb24pIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0tleWJvYXJkUHJldihlKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dQcmV2KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzS2V5Ym9hcmROZXh0KGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd05leHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5jbG9zZU9uRXNjICYmIHRoaXMuaXNLZXlib2FyZEVzYyhlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9wZW4oaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLm9uT3Blbi5lbWl0KCk7XG5cbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgICB0aGlzLmlzT3BlbiA9IHRydWU7XG4gICAgICAgIHRoaXMuc2hvdyh0cnVlKTtcblxuICAgICAgICBpZiAodGhpcy5mb3JjZUZ1bGxzY3JlZW4pIHtcbiAgICAgICAgICAgIHRoaXMubWFuYWdlRnVsbHNjcmVlbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5rZXlEb3duTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcIndpbmRvd1wiLCBcImtleWRvd25cIiwgKGUpID0+IHRoaXMub25LZXlEb3duKGUpKTtcbiAgICB9XG5cbiAgICBjbG9zZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pc09wZW4gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jbG9zZUZ1bGxzY3JlZW4oKTtcbiAgICAgICAgdGhpcy5vbkNsb3NlLmVtaXQoKTtcblxuICAgICAgICB0aGlzLnN0b3BBdXRvUGxheSgpO1xuXG4gICAgICAgIGlmICh0aGlzLmtleURvd25MaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5rZXlEb3duTGlzdGVuZXIoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGltYWdlTW91c2VFbnRlcigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuYXV0b1BsYXkgJiYgdGhpcy5hdXRvUGxheVBhdXNlT25Ib3Zlcikge1xuICAgICAgICAgICAgdGhpcy5zdG9wQXV0b1BsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGltYWdlTW91c2VMZWF2ZSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuYXV0b1BsYXkgJiYgdGhpcy5hdXRvUGxheVBhdXNlT25Ib3Zlcikge1xuICAgICAgICAgICAgdGhpcy5zdGFydEF1dG9QbGF5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGFydEF1dG9QbGF5KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5hdXRvUGxheSkge1xuICAgICAgICAgICAgdGhpcy5zdG9wQXV0b1BsYXkoKTtcblxuICAgICAgICAgICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zaG93TmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZXggPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93TmV4dCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMuYXV0b1BsYXlJbnRlcnZhbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdG9wQXV0b1BsYXkoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnRpbWVyKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG93QXRJbmRleChpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgfVxuXG4gICAgc2hvd05leHQoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmNhblNob3dOZXh0KCkpIHtcbiAgICAgICAgICAgIHRoaXMuaW5kZXgrKztcblxuICAgICAgICAgICAgaWYgKHRoaXMuaW5kZXggPT09IHRoaXMuaW1hZ2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXggPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2hvd1ByZXYoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmNhblNob3dQcmV2KCkpIHtcbiAgICAgICAgICAgIHRoaXMuaW5kZXgtLTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuaW5kZXggPCAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleCA9IHRoaXMuaW1hZ2VzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2FuU2hvd05leHQoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmxvYWRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmltYWdlcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5maW5pdHlNb3ZlIHx8IHRoaXMuaW5kZXggPCB0aGlzLmltYWdlcy5sZW5ndGggLSAxID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2FuU2hvd1ByZXYoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmxvYWRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmltYWdlcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5maW5pdHlNb3ZlIHx8IHRoaXMuaW5kZXggPiAwID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWFuYWdlRnVsbHNjcmVlbigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZnVsbHNjcmVlbiB8fCB0aGlzLmZvcmNlRnVsbHNjcmVlbikge1xuICAgICAgICAgICAgY29uc3QgZG9jID0gPGFueT5kb2N1bWVudDtcblxuICAgICAgICAgICAgaWYgKCFkb2MuZnVsbHNjcmVlbkVsZW1lbnQgJiYgIWRvYy5tb3pGdWxsU2NyZWVuRWxlbWVudFxuICAgICAgICAgICAgICAgICYmICFkb2Mud2Via2l0RnVsbHNjcmVlbkVsZW1lbnQgJiYgIWRvYy5tc0Z1bGxzY3JlZW5FbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuRnVsbHNjcmVlbigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlRnVsbHNjcmVlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0U2FmZVVybChpbWFnZTogc3RyaW5nKTogU2FmZVVybCB7XG4gICAgICAgIHJldHVybiBpbWFnZS5zdWJzdHIoMCwgMTApID09PSAnZGF0YTppbWFnZScgP1xuICAgICAgICAgICAgaW1hZ2UgOiB0aGlzLnNhbml0aXphdGlvbi5ieXBhc3NTZWN1cml0eVRydXN0VXJsKGltYWdlKTtcbiAgICB9XG5cbiAgICB6b29tSW4oKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmNhblpvb21JbigpKSB7XG4gICAgICAgICAgICB0aGlzLnpvb21WYWx1ZSArPSB0aGlzLnpvb21TdGVwO1xuXG4gICAgICAgICAgICBpZiAodGhpcy56b29tVmFsdWUgPiB0aGlzLnpvb21NYXgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnpvb21WYWx1ZSA9IHRoaXMuem9vbU1heDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHpvb21PdXQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmNhblpvb21PdXQoKSkge1xuICAgICAgICAgICAgdGhpcy56b29tVmFsdWUgLT0gdGhpcy56b29tU3RlcDtcblxuICAgICAgICAgICAgaWYgKHRoaXMuem9vbVZhbHVlIDwgdGhpcy56b29tTWluKSB7XG4gICAgICAgICAgICAgICAgdGhpcy56b29tVmFsdWUgPSB0aGlzLnpvb21NaW47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnpvb21WYWx1ZSA8PSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNldFBvc2l0aW9uKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJvdGF0ZUxlZnQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucm90YXRlVmFsdWUgLT0gOTA7XG4gICAgfVxuXG4gICAgcm90YXRlUmlnaHQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucm90YXRlVmFsdWUgKz0gOTA7XG4gICAgfVxuXG4gICAgZ2V0VHJhbnNmb3JtKCk6IFNhZmVTdHlsZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNhbml0aXphdGlvbi5ieXBhc3NTZWN1cml0eVRydXN0U3R5bGUoJ3NjYWxlKCcgKyB0aGlzLnpvb21WYWx1ZSArICcpIHJvdGF0ZSgnICsgdGhpcy5yb3RhdGVWYWx1ZSArICdkZWcpJyk7XG4gICAgfVxuXG4gICAgY2FuWm9vbUluKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy56b29tVmFsdWUgPCB0aGlzLnpvb21NYXggPyB0cnVlIDogZmFsc2U7XG4gICAgfVxuXG4gICAgY2FuWm9vbU91dCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuem9vbVZhbHVlID4gdGhpcy56b29tTWluID8gdHJ1ZSA6IGZhbHNlO1xuICAgIH1cblxuICAgIGNhbkRyYWdPblpvb20oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnpvb20gJiYgdGhpcy56b29tVmFsdWUgPiAxO1xuICAgIH1cblxuICAgIG1vdXNlRG93bkhhbmRsZXIoZSk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5jYW5EcmFnT25ab29tKCkpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbFggPSB0aGlzLmdldENsaWVudFgoZSk7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxZID0gdGhpcy5nZXRDbGllbnRZKGUpO1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsTGVmdCA9IHRoaXMucG9zaXRpb25MZWZ0O1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsVG9wID0gdGhpcy5wb3NpdGlvblRvcDtcbiAgICAgICAgICAgIHRoaXMuaXNNb3ZlID0gdHJ1ZTtcblxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW91c2VVcEhhbmRsZXIoZSk6IHZvaWQge1xuICAgICAgICB0aGlzLmlzTW92ZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIG1vdXNlTW92ZUhhbmRsZXIoZSkge1xuICAgICAgICBpZiAodGhpcy5pc01vdmUpIHtcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25MZWZ0ID0gdGhpcy5pbml0aWFsTGVmdCArICh0aGlzLmdldENsaWVudFgoZSkgLSB0aGlzLmluaXRpYWxYKTtcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25Ub3AgPSB0aGlzLmluaXRpYWxUb3AgKyAodGhpcy5nZXRDbGllbnRZKGUpIC0gdGhpcy5pbml0aWFsWSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldENsaWVudFgoZSk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBlLnRvdWNoZXMgJiYgZS50b3VjaGVzLmxlbmd0aCA/IGUudG91Y2hlc1swXS5jbGllbnRYIDogZS5jbGllbnRYO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Q2xpZW50WShlKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIGUudG91Y2hlcyAmJiBlLnRvdWNoZXMubGVuZ3RoID8gZS50b3VjaGVzWzBdLmNsaWVudFkgOiBlLmNsaWVudFk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXNldFBvc2l0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy56b29tKSB7XG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uTGVmdCA9IDA7XG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uVG9wID0gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaXNLZXlib2FyZE5leHQoZSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gZS5rZXlDb2RlID09PSAzOSA/IHRydWUgOiBmYWxzZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzS2V5Ym9hcmRQcmV2KGUpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gMzcgPyB0cnVlIDogZmFsc2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc0tleWJvYXJkRXNjKGUpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gMjcgPyB0cnVlIDogZmFsc2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvcGVuRnVsbHNjcmVlbigpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IDxhbnk+ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG4gICAgICAgIGlmIChlbGVtZW50LnJlcXVlc3RGdWxsc2NyZWVuKSB7XG4gICAgICAgICAgICBlbGVtZW50LnJlcXVlc3RGdWxsc2NyZWVuKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5tc1JlcXVlc3RGdWxsc2NyZWVuKSB7XG4gICAgICAgICAgICBlbGVtZW50Lm1zUmVxdWVzdEZ1bGxzY3JlZW4oKTtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50Lm1velJlcXVlc3RGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICBlbGVtZW50Lm1velJlcXVlc3RGdWxsU2NyZWVuKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbikge1xuICAgICAgICAgICAgZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjbG9zZUZ1bGxzY3JlZW4oKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmlzRnVsbHNjcmVlbigpKSB7XG4gICAgICAgICAgICBjb25zdCBkb2MgPSA8YW55PmRvY3VtZW50O1xuXG4gICAgICAgICAgICBpZiAoZG9jLmV4aXRGdWxsc2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgZG9jLmV4aXRGdWxsc2NyZWVuKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRvYy5tc0V4aXRGdWxsc2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgZG9jLm1zRXhpdEZ1bGxzY3JlZW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZG9jLm1vekNhbmNlbEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBkb2MubW96Q2FuY2VsRnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkb2Mud2Via2l0RXhpdEZ1bGxzY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBkb2Mud2Via2l0RXhpdEZ1bGxzY3JlZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaXNGdWxsc2NyZWVuKCkge1xuICAgICAgICBjb25zdCBkb2MgPSA8YW55PmRvY3VtZW50O1xuXG4gICAgICAgIHJldHVybiBkb2MuZnVsbHNjcmVlbkVsZW1lbnQgfHwgZG9jLndlYmtpdEZ1bGxzY3JlZW5FbGVtZW50XG4gICAgICAgICAgICB8fCBkb2MubW96RnVsbFNjcmVlbkVsZW1lbnQgfHwgZG9jLm1zRnVsbHNjcmVlbkVsZW1lbnQ7XG4gICAgfVxuXG5cblxuICAgIHByaXZhdGUgc2hvdyhmaXJzdCA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuc3RvcEF1dG9QbGF5KCk7XG5cbiAgICAgICAgdGhpcy5vbkFjdGl2ZUNoYW5nZS5lbWl0KHRoaXMuaW5kZXgpO1xuXG4gICAgICAgIGlmIChmaXJzdCB8fCAhdGhpcy5hbmltYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX3Nob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5fc2hvdygpLCA2MDApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfc2hvdygpIHtcbiAgICAgICAgdGhpcy56b29tVmFsdWUgPSAxO1xuICAgICAgICB0aGlzLnJvdGF0ZVZhbHVlID0gMDtcbiAgICAgICAgdGhpcy5yZXNldFBvc2l0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5zcmMgPSB0aGlzLmdldFNhZmVVcmwoPHN0cmluZz50aGlzLmltYWdlc1t0aGlzLmluZGV4XSk7XG4gICAgICAgIHRoaXMuc3JjSW5kZXggPSB0aGlzLmluZGV4O1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gdGhpcy5kZXNjcmlwdGlvbnNbdGhpcy5pbmRleF07XG4gICAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCh0aGlzLnByZXZpZXdJbWFnZS5uYXRpdmVFbGVtZW50KSkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRBdXRvUGxheSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5sb2FkaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dTcGlubmVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2aWV3SW1hZ2UubmF0aXZlRWxlbWVudC5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dTcGlubmVyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJldmlld0ltYWdlLm5hdGl2ZUVsZW1lbnQub25sb2FkID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydEF1dG9QbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHByaXZhdGUgaXNMb2FkZWQoaW1nKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghaW1nLmNvbXBsZXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGltZy5uYXR1cmFsV2lkdGggIT09ICd1bmRlZmluZWQnICYmIGltZy5uYXR1cmFsV2lkdGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cbiJdfQ==