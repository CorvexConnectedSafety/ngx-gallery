import { Component, Input, Output, EventEmitter, HostListener, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { DomSanitizer, SafeStyle, SafeResourceUrl } from '@angular/platform-browser';
import { NgxGalleryHelperService } from './ngx-gallery-helper.service';
import { NgxGalleryOrder } from './ngx-gallery-order.model';
var NgxGalleryThumbnailsComponent = /** @class */ (function () {
    function NgxGalleryThumbnailsComponent(sanitization, elementRef, helperService) {
        this.sanitization = sanitization;
        this.elementRef = elementRef;
        this.helperService = helperService;
        this.minStopIndex = 0;
        this.onActiveChange = new EventEmitter();
        this.index = 0;
    }
    NgxGalleryThumbnailsComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (changes['selectedIndex']) {
            this.validateIndex();
        }
        if (changes['swipe']) {
            this.helperService.manageSwipe(this.swipe, this.elementRef, 'thumbnails', function () { return _this.moveRight(); }, function () { return _this.moveLeft(); });
        }
        if (this.images) {
            this.remainingCountValue = this.images.length - (this.rows * this.columns);
        }
    };
    NgxGalleryThumbnailsComponent.prototype.onMouseEnter = function () {
        this.mouseenter = true;
    };
    NgxGalleryThumbnailsComponent.prototype.onMouseLeave = function () {
        this.mouseenter = false;
    };
    NgxGalleryThumbnailsComponent.prototype.reset = function (index) {
        this.selectedIndex = index;
        this.setDefaultPosition();
        this.index = 0;
        this.validateIndex();
    };
    NgxGalleryThumbnailsComponent.prototype.getImages = function () {
        if (!this.images) {
            return [];
        }
        if (this.remainingCount) {
            return this.images.slice(0, this.rows * this.columns);
        }
        else if (this.lazyLoading && this.order != NgxGalleryOrder.Row) {
            var stopIndex = 0;
            if (this.order === NgxGalleryOrder.Column) {
                stopIndex = (this.index + this.columns + this.moveSize) * this.rows;
            }
            else if (this.order === NgxGalleryOrder.Page) {
                stopIndex = this.index + ((this.columns * this.rows) * 2);
            }
            if (stopIndex <= this.minStopIndex) {
                stopIndex = this.minStopIndex;
            }
            else {
                this.minStopIndex = stopIndex;
            }
            return this.images.slice(0, stopIndex);
        }
        else {
            return this.images;
        }
    };
    NgxGalleryThumbnailsComponent.prototype.handleClick = function (event, index) {
        if (!this.hasLink(index)) {
            this.selectedIndex = index;
            this.onActiveChange.emit(index);
            event.stopPropagation();
            event.preventDefault();
        }
    };
    NgxGalleryThumbnailsComponent.prototype.hasLink = function (index) {
        if (this.links && this.links.length && this.links[index])
            return true;
    };
    NgxGalleryThumbnailsComponent.prototype.moveRight = function () {
        if (this.canMoveRight()) {
            this.index += this.moveSize;
            var maxIndex = this.getMaxIndex() - this.columns;
            if (this.index > maxIndex) {
                this.index = maxIndex;
            }
            this.setThumbnailsPosition();
        }
    };
    NgxGalleryThumbnailsComponent.prototype.moveLeft = function () {
        if (this.canMoveLeft()) {
            this.index -= this.moveSize;
            if (this.index < 0) {
                this.index = 0;
            }
            this.setThumbnailsPosition();
        }
    };
    NgxGalleryThumbnailsComponent.prototype.canMoveRight = function () {
        return this.index + this.columns < this.getMaxIndex() ? true : false;
    };
    NgxGalleryThumbnailsComponent.prototype.canMoveLeft = function () {
        return this.index !== 0 ? true : false;
    };
    NgxGalleryThumbnailsComponent.prototype.getThumbnailLeft = function (index) {
        var calculatedIndex;
        if (this.order === NgxGalleryOrder.Column) {
            calculatedIndex = Math.floor(index / this.rows);
        }
        else if (this.order === NgxGalleryOrder.Page) {
            calculatedIndex = (index % this.columns) + (Math.floor(index / (this.rows * this.columns)) * this.columns);
        }
        else if (this.order == NgxGalleryOrder.Row && this.remainingCount) {
            calculatedIndex = index % this.columns;
        }
        else {
            calculatedIndex = index % Math.ceil(this.images.length / this.rows);
        }
        return this.getThumbnailPosition(calculatedIndex, this.columns);
    };
    NgxGalleryThumbnailsComponent.prototype.getThumbnailTop = function (index) {
        var calculatedIndex;
        if (this.order === NgxGalleryOrder.Column) {
            calculatedIndex = index % this.rows;
        }
        else if (this.order === NgxGalleryOrder.Page) {
            calculatedIndex = Math.floor(index / this.columns) - (Math.floor(index / (this.rows * this.columns)) * this.rows);
        }
        else if (this.order == NgxGalleryOrder.Row && this.remainingCount) {
            calculatedIndex = Math.floor(index / this.columns);
        }
        else {
            calculatedIndex = Math.floor(index / Math.ceil(this.images.length / this.rows));
        }
        return this.getThumbnailPosition(calculatedIndex, this.rows);
    };
    NgxGalleryThumbnailsComponent.prototype.getThumbnailWidth = function () {
        return this.getThumbnailDimension(this.columns);
    };
    NgxGalleryThumbnailsComponent.prototype.getThumbnailHeight = function () {
        return this.getThumbnailDimension(this.rows);
    };
    NgxGalleryThumbnailsComponent.prototype.setThumbnailsPosition = function () {
        this.thumbnailsLeft = -((100 / this.columns) * this.index) + '%';
        this.thumbnailsMarginLeft = -((this.margin - (((this.columns - 1)
            * this.margin) / this.columns)) * this.index) + 'px';
    };
    NgxGalleryThumbnailsComponent.prototype.setDefaultPosition = function () {
        this.thumbnailsLeft = '0px';
        this.thumbnailsMarginLeft = '0px';
    };
    NgxGalleryThumbnailsComponent.prototype.canShowArrows = function () {
        if (this.remainingCount) {
            return false;
        }
        else if (this.arrows && this.images && this.images.length > this.getVisibleCount()
            && (!this.arrowsAutoHide || this.mouseenter)) {
            return true;
        }
        else {
            return false;
        }
    };
    NgxGalleryThumbnailsComponent.prototype.validateIndex = function () {
        if (this.images) {
            var newIndex = void 0;
            if (this.order === NgxGalleryOrder.Column) {
                newIndex = Math.floor(this.selectedIndex / this.rows);
            }
            else {
                newIndex = this.selectedIndex % Math.ceil(this.images.length / this.rows);
            }
            if (this.remainingCount) {
                newIndex = 0;
            }
            if (newIndex < this.index || newIndex >= this.index + this.columns) {
                var maxIndex = this.getMaxIndex() - this.columns;
                this.index = newIndex > maxIndex ? maxIndex : newIndex;
                this.setThumbnailsPosition();
            }
        }
    };
    NgxGalleryThumbnailsComponent.prototype.getSafeUrl = function (image) {
        return this.sanitization.bypassSecurityTrustStyle(this.helperService.getBackgroundUrl(image));
    };
    NgxGalleryThumbnailsComponent.prototype.getThumbnailPosition = function (index, count) {
        return this.getSafeStyle('calc(' + ((100 / count) * index) + '% + '
            + ((this.margin - (((count - 1) * this.margin) / count)) * index) + 'px)');
    };
    NgxGalleryThumbnailsComponent.prototype.getThumbnailDimension = function (count) {
        if (this.margin !== 0) {
            return this.getSafeStyle('calc(' + (100 / count) + '% - '
                + (((count - 1) * this.margin) / count) + 'px)');
        }
        else {
            return this.getSafeStyle('calc(' + (100 / count) + '% + 1px)');
        }
    };
    NgxGalleryThumbnailsComponent.prototype.getMaxIndex = function () {
        if (this.order == NgxGalleryOrder.Page) {
            var maxIndex = (Math.floor(this.images.length / this.getVisibleCount()) * this.columns);
            if (this.images.length % this.getVisibleCount() > this.columns) {
                maxIndex += this.columns;
            }
            else {
                maxIndex += this.images.length % this.getVisibleCount();
            }
            return maxIndex;
        }
        else {
            return Math.ceil(this.images.length / this.rows);
        }
    };
    NgxGalleryThumbnailsComponent.prototype.getVisibleCount = function () {
        return this.columns * this.rows;
    };
    NgxGalleryThumbnailsComponent.prototype.getSafeStyle = function (value) {
        return this.sanitization.bypassSecurityTrustStyle(value);
    };
    NgxGalleryThumbnailsComponent.ctorParameters = function () { return [
        { type: DomSanitizer },
        { type: ElementRef },
        { type: NgxGalleryHelperService }
    ]; };
    NgxGalleryThumbnailsComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-gallery-thumbnails',
                    template: "\n    <div class=\"ngx-gallery-thumbnails-wrapper ngx-gallery-thumbnail-size-{{size}}\">\n        <div class=\"ngx-gallery-thumbnails\" [style.transform]=\"'translateX(' + thumbnailsLeft + ')'\" [style.marginLeft]=\"thumbnailsMarginLeft\">\n            <a [href]=\"hasLink(i) ? links[i] : '#'\" [target]=\"linkTarget\" class=\"ngx-gallery-thumbnail\" *ngFor=\"let image of getImages(); let i = index;\" [style.background-image]=\"getSafeUrl(image)\" (click)=\"handleClick($event, i)\" [style.width]=\"getThumbnailWidth()\" [style.height]=\"getThumbnailHeight()\" [style.left]=\"getThumbnailLeft(i)\" [style.top]=\"getThumbnailTop(i)\" [ngClass]=\"{ 'ngx-gallery-active': i == selectedIndex, 'ngx-gallery-clickable': clickable }\" [attr.aria-label]=\"labels[i]\">\n                <div class=\"ngx-gallery-icons-wrapper\">\n                    <ngx-gallery-action *ngFor=\"let action of actions\" [icon]=\"action.icon\" [disabled]=\"action.disabled\" [titleText]=\"action.titleText\" (onClick)=\"action.onClick($event, i)\"></ngx-gallery-action>\n                </div>\n                <div class=\"ngx-gallery-remaining-count-overlay\" *ngIf=\"remainingCount && remainingCountValue && (i == (rows * columns) - 1)\">\n                    <span class=\"ngx-gallery-remaining-count\">+{{remainingCountValue}}</span>\n                </div>\n            </a>\n        </div>\n    </div>\n    <ngx-gallery-arrows *ngIf=\"canShowArrows()\" (onPrevClick)=\"moveLeft()\" (onNextClick)=\"moveRight()\" [prevDisabled]=\"!canMoveLeft()\" [nextDisabled]=\"!canMoveRight()\" [arrowPrevIcon]=\"arrowPrevIcon\" [arrowNextIcon]=\"arrowNextIcon\"></ngx-gallery-arrows>\n    ",
                    styles: [":host{width:100%;display:inline-block;position:relative}.ngx-gallery-thumbnails-wrapper{width:100%;height:100%;position:absolute;overflow:hidden}.ngx-gallery-thumbnails{height:100%;width:100%;position:absolute;left:0;transform:translateX(0);transition:transform .5s ease-in-out;will-change:transform}.ngx-gallery-thumbnails .ngx-gallery-thumbnail{position:absolute;height:100%;background-position:center;background-repeat:no-repeat;text-decoration:none}.ngx-gallery-thumbnail-size-cover .ngx-gallery-thumbnails .ngx-gallery-thumbnail{background-size:cover}.ngx-gallery-thumbnail-size-contain .ngx-gallery-thumbnails .ngx-gallery-thumbnail{background-size:contain}.ngx-gallery-remaining-count-overlay{width:100%;height:100%;position:absolute;left:0;top:0;background-color:rgba(0,0,0,.4)}.ngx-gallery-remaining-count{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:30px}"]
                },] }
    ];
    NgxGalleryThumbnailsComponent.ctorParameters = function () { return [
        { type: DomSanitizer },
        { type: ElementRef },
        { type: NgxGalleryHelperService }
    ]; };
    NgxGalleryThumbnailsComponent.propDecorators = {
        images: [{ type: Input }],
        links: [{ type: Input }],
        labels: [{ type: Input }],
        linkTarget: [{ type: Input }],
        columns: [{ type: Input }],
        rows: [{ type: Input }],
        arrows: [{ type: Input }],
        arrowsAutoHide: [{ type: Input }],
        margin: [{ type: Input }],
        selectedIndex: [{ type: Input }],
        clickable: [{ type: Input }],
        swipe: [{ type: Input }],
        size: [{ type: Input }],
        arrowPrevIcon: [{ type: Input }],
        arrowNextIcon: [{ type: Input }],
        moveSize: [{ type: Input }],
        order: [{ type: Input }],
        remainingCount: [{ type: Input }],
        lazyLoading: [{ type: Input }],
        actions: [{ type: Input }],
        onActiveChange: [{ type: Output }],
        onMouseEnter: [{ type: HostListener, args: ['mouseenter',] }],
        onMouseLeave: [{ type: HostListener, args: ['mouseleave',] }]
    };
    return NgxGalleryThumbnailsComponent;
}());
export { NgxGalleryThumbnailsComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktdGh1bWJuYWlscy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZ2FsbGVyeS8iLCJzb3VyY2VzIjpbInNyYy9uZ3gtZ2FsbGVyeS10aHVtYm5haWxzLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzSCxPQUFPLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxlQUFlLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUVyRixPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUN2RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFHNUQ7SUFxREksdUNBQW9CLFlBQTBCLEVBQVUsVUFBc0IsRUFDbEUsYUFBc0M7UUFEOUIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFBVSxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ2xFLGtCQUFhLEdBQWIsYUFBYSxDQUF5QjtRQTVCbEQsaUJBQVksR0FBRyxDQUFDLENBQUM7UUF1QlAsbUJBQWMsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRXRDLFVBQUssR0FBRyxDQUFDLENBQUM7SUFHbUMsQ0FBQztJQUV0RCxtREFBVyxHQUFYLFVBQVksT0FBc0I7UUFBbEMsaUJBYUM7UUFaRyxJQUFJLE9BQU8sQ0FBQyxlQUFlLENBQUMsRUFBRTtZQUMxQixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDeEI7UUFFRCxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNsQixJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQzFELFlBQVksRUFBRSxjQUFNLE9B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Z0JBdFBpQyxZQUFZO2dCQUFzQixVQUFVO2dCQUNuRCx1QkFBdUI7OztnQkF0RHJELFNBQVMsU0FBQztvQkFDUCxRQUFRLEVBQUUsd0JBQXdCO29CQUNsQyxRQUFRLEVBQUUsNG5EQWNUOztpQkFFSjs7O2dCQXhCUSxZQUFZO2dCQURvRSxVQUFVO2dCQUcxRix1QkFBdUI7Ozt5QkFnQzNCLEtBQUs7d0JBQ0wsS0FBSzt5QkFDTCxLQUFLOzZCQUNMLEtBQUs7MEJBQ0wsS0FBSzt1QkFDTCxLQUFLO3lCQUNMLEtBQUs7aUNBQ0wsS0FBSzt5QkFDTCxLQUFLO2dDQUNMLEtBQUs7NEJBQ0wsS0FBSzt3QkFDTCxLQUFLO3VCQUNMLEtBQUs7Z0NBQ0wsS0FBSztnQ0FDTCxLQUFLOzJCQUNMLEtBQUs7d0JBQ0wsS0FBSztpQ0FDTCxLQUFLOzhCQUNMLEtBQUs7MEJBQ0wsS0FBSztpQ0FFTCxNQUFNOytCQXNCTixZQUFZLFNBQUMsWUFBWTsrQkFJekIsWUFBWSxTQUFDLFlBQVk7O0lBaU85QixvQ0FBQztDQUFBLEFBNVNELElBNFNDO1NBelJZLDZCQUE2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRG9tU2FuaXRpemVyLCBTYWZlU3R5bGUsIFNhZmVSZXNvdXJjZVVybCB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuXG5pbXBvcnQgeyBOZ3hHYWxsZXJ5SGVscGVyU2VydmljZSB9IGZyb20gJy4vbmd4LWdhbGxlcnktaGVscGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTmd4R2FsbGVyeU9yZGVyIH0gZnJvbSAnLi9uZ3gtZ2FsbGVyeS1vcmRlci5tb2RlbCc7XG5pbXBvcnQgeyBOZ3hHYWxsZXJ5QWN0aW9uIH0gZnJvbSAnLi9uZ3gtZ2FsbGVyeS1hY3Rpb24ubW9kZWwnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ25neC1nYWxsZXJ5LXRodW1ibmFpbHMnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cIm5neC1nYWxsZXJ5LXRodW1ibmFpbHMtd3JhcHBlciBuZ3gtZ2FsbGVyeS10aHVtYm5haWwtc2l6ZS17e3NpemV9fVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibmd4LWdhbGxlcnktdGh1bWJuYWlsc1wiIFtzdHlsZS50cmFuc2Zvcm1dPVwiJ3RyYW5zbGF0ZVgoJyArIHRodW1ibmFpbHNMZWZ0ICsgJyknXCIgW3N0eWxlLm1hcmdpbkxlZnRdPVwidGh1bWJuYWlsc01hcmdpbkxlZnRcIj5cbiAgICAgICAgICAgIDxhIFtocmVmXT1cImhhc0xpbmsoaSkgPyBsaW5rc1tpXSA6ICcjJ1wiIFt0YXJnZXRdPVwibGlua1RhcmdldFwiIGNsYXNzPVwibmd4LWdhbGxlcnktdGh1bWJuYWlsXCIgKm5nRm9yPVwibGV0IGltYWdlIG9mIGdldEltYWdlcygpOyBsZXQgaSA9IGluZGV4O1wiIFtzdHlsZS5iYWNrZ3JvdW5kLWltYWdlXT1cImdldFNhZmVVcmwoaW1hZ2UpXCIgKGNsaWNrKT1cImhhbmRsZUNsaWNrKCRldmVudCwgaSlcIiBbc3R5bGUud2lkdGhdPVwiZ2V0VGh1bWJuYWlsV2lkdGgoKVwiIFtzdHlsZS5oZWlnaHRdPVwiZ2V0VGh1bWJuYWlsSGVpZ2h0KClcIiBbc3R5bGUubGVmdF09XCJnZXRUaHVtYm5haWxMZWZ0KGkpXCIgW3N0eWxlLnRvcF09XCJnZXRUaHVtYm5haWxUb3AoaSlcIiBbbmdDbGFzc109XCJ7ICduZ3gtZ2FsbGVyeS1hY3RpdmUnOiBpID09IHNlbGVjdGVkSW5kZXgsICduZ3gtZ2FsbGVyeS1jbGlja2FibGUnOiBjbGlja2FibGUgfVwiIFthdHRyLmFyaWEtbGFiZWxdPVwibGFiZWxzW2ldXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5neC1nYWxsZXJ5LWljb25zLXdyYXBwZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5neC1nYWxsZXJ5LWFjdGlvbiAqbmdGb3I9XCJsZXQgYWN0aW9uIG9mIGFjdGlvbnNcIiBbaWNvbl09XCJhY3Rpb24uaWNvblwiIFtkaXNhYmxlZF09XCJhY3Rpb24uZGlzYWJsZWRcIiBbdGl0bGVUZXh0XT1cImFjdGlvbi50aXRsZVRleHRcIiAob25DbGljayk9XCJhY3Rpb24ub25DbGljaygkZXZlbnQsIGkpXCI+PC9uZ3gtZ2FsbGVyeS1hY3Rpb24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5neC1nYWxsZXJ5LXJlbWFpbmluZy1jb3VudC1vdmVybGF5XCIgKm5nSWY9XCJyZW1haW5pbmdDb3VudCAmJiByZW1haW5pbmdDb3VudFZhbHVlICYmIChpID09IChyb3dzICogY29sdW1ucykgLSAxKVwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm5neC1nYWxsZXJ5LXJlbWFpbmluZy1jb3VudFwiPit7e3JlbWFpbmluZ0NvdW50VmFsdWV9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPG5neC1nYWxsZXJ5LWFycm93cyAqbmdJZj1cImNhblNob3dBcnJvd3MoKVwiIChvblByZXZDbGljayk9XCJtb3ZlTGVmdCgpXCIgKG9uTmV4dENsaWNrKT1cIm1vdmVSaWdodCgpXCIgW3ByZXZEaXNhYmxlZF09XCIhY2FuTW92ZUxlZnQoKVwiIFtuZXh0RGlzYWJsZWRdPVwiIWNhbk1vdmVSaWdodCgpXCIgW2Fycm93UHJldkljb25dPVwiYXJyb3dQcmV2SWNvblwiIFthcnJvd05leHRJY29uXT1cImFycm93TmV4dEljb25cIj48L25neC1nYWxsZXJ5LWFycm93cz5cbiAgICBgLFxuICAgIHN0eWxlVXJsczogWycuL25neC1nYWxsZXJ5LXRodW1ibmFpbHMuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hHYWxsZXJ5VGh1bWJuYWlsc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG5cbiAgICB0aHVtYm5haWxzTGVmdDogc3RyaW5nO1xuICAgIHRodW1ibmFpbHNNYXJnaW5MZWZ0OiBzdHJpbmc7XG4gICAgbW91c2VlbnRlcjogYm9vbGVhbjtcbiAgICByZW1haW5pbmdDb3VudFZhbHVlOiBudW1iZXI7XG5cbiAgICBtaW5TdG9wSW5kZXggPSAwO1xuXG4gICAgQElucHV0KCkgaW1hZ2VzOiBzdHJpbmdbXSB8IFNhZmVSZXNvdXJjZVVybFtdO1xuICAgIEBJbnB1dCgpIGxpbmtzOiBzdHJpbmdbXTtcbiAgICBASW5wdXQoKSBsYWJlbHM6IHN0cmluZ1tdO1xuICAgIEBJbnB1dCgpIGxpbmtUYXJnZXQ6IHN0cmluZztcbiAgICBASW5wdXQoKSBjb2x1bW5zOiBudW1iZXI7XG4gICAgQElucHV0KCkgcm93czogbnVtYmVyO1xuICAgIEBJbnB1dCgpIGFycm93czogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBhcnJvd3NBdXRvSGlkZTogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBtYXJnaW46IG51bWJlcjtcbiAgICBASW5wdXQoKSBzZWxlY3RlZEluZGV4OiBudW1iZXI7XG4gICAgQElucHV0KCkgY2xpY2thYmxlOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHN3aXBlOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHNpemU6IHN0cmluZztcbiAgICBASW5wdXQoKSBhcnJvd1ByZXZJY29uOiBzdHJpbmc7XG4gICAgQElucHV0KCkgYXJyb3dOZXh0SWNvbjogc3RyaW5nO1xuICAgIEBJbnB1dCgpIG1vdmVTaXplOiBudW1iZXI7XG4gICAgQElucHV0KCkgb3JkZXI6IG51bWJlcjtcbiAgICBASW5wdXQoKSByZW1haW5pbmdDb3VudDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBsYXp5TG9hZGluZzogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBhY3Rpb25zOiBOZ3hHYWxsZXJ5QWN0aW9uW107XG5cbiAgICBAT3V0cHV0KCkgb25BY3RpdmVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBwcml2YXRlIGluZGV4ID0gMDtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgc2FuaXRpemF0aW9uOiBEb21TYW5pdGl6ZXIsIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgcHJpdmF0ZSBoZWxwZXJTZXJ2aWNlOiBOZ3hHYWxsZXJ5SGVscGVyU2VydmljZSkge31cblxuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICAgICAgaWYgKGNoYW5nZXNbJ3NlbGVjdGVkSW5kZXgnXSkge1xuICAgICAgICAgICAgdGhpcy52YWxpZGF0ZUluZGV4KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2hhbmdlc1snc3dpcGUnXSkge1xuICAgICAgICAgICAgdGhpcy5oZWxwZXJTZXJ2aWNlLm1hbmFnZVN3aXBlKHRoaXMuc3dpcGUsIHRoaXMuZWxlbWVudFJlZixcbiAgICAgICAgICAgICd0aHVtYm5haWxzJywgKCkgPT4gdGhpcy5tb3ZlUmlnaHQoKSwgKCkgPT4gdGhpcy5tb3ZlTGVmdCgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmltYWdlcykge1xuICAgICAgICAgICAgdGhpcy5yZW1haW5pbmdDb3VudFZhbHVlID0gdGhpcy5pbWFnZXMubGVuZ3RoIC0gKHRoaXMucm93cyAqIHRoaXMuY29sdW1ucyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdtb3VzZWVudGVyJykgb25Nb3VzZUVudGVyKCkge1xuICAgICAgICB0aGlzLm1vdXNlZW50ZXIgPSB0cnVlO1xuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ21vdXNlbGVhdmUnKSBvbk1vdXNlTGVhdmUoKSB7XG4gICAgICAgIHRoaXMubW91c2VlbnRlciA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJlc2V0KGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gaW5kZXg7XG4gICAgICAgIHRoaXMuc2V0RGVmYXVsdFBvc2l0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5pbmRleCA9IDA7XG4gICAgICAgIHRoaXMudmFsaWRhdGVJbmRleCgpO1xuICAgIH1cblxuICAgIGdldEltYWdlcygpOiBzdHJpbmdbXSB8IFNhZmVSZXNvdXJjZVVybFtdIHtcbiAgICAgICAgaWYgKCF0aGlzLmltYWdlcykge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucmVtYWluaW5nQ291bnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmltYWdlcy5zbGljZSgwLCB0aGlzLnJvd3MgKiB0aGlzLmNvbHVtbnMpO1xuICAgICAgICB9IFxuICAgICAgICBlbHNlIGlmICh0aGlzLmxhenlMb2FkaW5nICYmIHRoaXMub3JkZXIgIT0gTmd4R2FsbGVyeU9yZGVyLlJvdykge1xuICAgICAgICAgICAgbGV0IHN0b3BJbmRleCA9IDA7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm9yZGVyID09PSBOZ3hHYWxsZXJ5T3JkZXIuQ29sdW1uKSB7XG4gICAgICAgICAgICAgICAgc3RvcEluZGV4ID0gKHRoaXMuaW5kZXggKyB0aGlzLmNvbHVtbnMgKyB0aGlzLm1vdmVTaXplKSAqIHRoaXMucm93cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMub3JkZXIgPT09IE5neEdhbGxlcnlPcmRlci5QYWdlKSB7XG4gICAgICAgICAgICAgICAgc3RvcEluZGV4ID0gdGhpcy5pbmRleCArICgodGhpcy5jb2x1bW5zICogdGhpcy5yb3dzKSAqIDIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc3RvcEluZGV4IDw9IHRoaXMubWluU3RvcEluZGV4KSB7XG4gICAgICAgICAgICAgICAgc3RvcEluZGV4ID0gdGhpcy5taW5TdG9wSW5kZXg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubWluU3RvcEluZGV4ID0gc3RvcEluZGV4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbWFnZXMuc2xpY2UoMCwgc3RvcEluZGV4KTtcbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbWFnZXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVDbGljayhldmVudDogRXZlbnQsIGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmhhc0xpbmsoaW5kZXgpKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgIHRoaXMub25BY3RpdmVDaGFuZ2UuZW1pdChpbmRleCk7XG5cbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhc0xpbmsoaW5kZXg6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5saW5rcyAmJiB0aGlzLmxpbmtzLmxlbmd0aCAmJiB0aGlzLmxpbmtzW2luZGV4XSkgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgbW92ZVJpZ2h0KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5jYW5Nb3ZlUmlnaHQoKSkge1xuICAgICAgICAgICAgdGhpcy5pbmRleCArPSB0aGlzLm1vdmVTaXplO1xuICAgICAgICAgICAgbGV0IG1heEluZGV4ID0gdGhpcy5nZXRNYXhJbmRleCgpIC0gdGhpcy5jb2x1bW5zO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pbmRleCA+IG1heEluZGV4KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleCA9IG1heEluZGV4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNldFRodW1ibmFpbHNQb3NpdGlvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW92ZUxlZnQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmNhbk1vdmVMZWZ0KCkpIHtcbiAgICAgICAgICAgIHRoaXMuaW5kZXggLT0gdGhpcy5tb3ZlU2l6ZTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuaW5kZXggPCAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc2V0VGh1bWJuYWlsc1Bvc2l0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjYW5Nb3ZlUmlnaHQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4ICsgdGhpcy5jb2x1bW5zIDwgdGhpcy5nZXRNYXhJbmRleCgpID8gdHJ1ZSA6IGZhbHNlO1xuICAgIH1cblxuICAgIGNhbk1vdmVMZWZ0KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5pbmRleCAhPT0gMCA/IHRydWUgOiBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXRUaHVtYm5haWxMZWZ0KGluZGV4OiBudW1iZXIpOiBTYWZlU3R5bGUge1xuICAgICAgICBsZXQgY2FsY3VsYXRlZEluZGV4O1xuXG4gICAgICAgIGlmICh0aGlzLm9yZGVyID09PSBOZ3hHYWxsZXJ5T3JkZXIuQ29sdW1uKSB7XG4gICAgICAgICAgICBjYWxjdWxhdGVkSW5kZXggPSBNYXRoLmZsb29yKGluZGV4IC8gdGhpcy5yb3dzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLm9yZGVyID09PSBOZ3hHYWxsZXJ5T3JkZXIuUGFnZSkge1xuICAgICAgICAgICAgY2FsY3VsYXRlZEluZGV4ID0gKGluZGV4ICUgdGhpcy5jb2x1bW5zKSArIChNYXRoLmZsb29yKGluZGV4IC8gKHRoaXMucm93cyAqIHRoaXMuY29sdW1ucykpICogdGhpcy5jb2x1bW5zKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLm9yZGVyID09IE5neEdhbGxlcnlPcmRlci5Sb3cgJiYgdGhpcy5yZW1haW5pbmdDb3VudCkge1xuICAgICAgICAgICAgY2FsY3VsYXRlZEluZGV4ID0gaW5kZXggJSB0aGlzLmNvbHVtbnM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjYWxjdWxhdGVkSW5kZXggPSBpbmRleCAlIE1hdGguY2VpbCh0aGlzLmltYWdlcy5sZW5ndGggLyB0aGlzLnJvd3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGh1bWJuYWlsUG9zaXRpb24oY2FsY3VsYXRlZEluZGV4LCB0aGlzLmNvbHVtbnMpO1xuICAgIH1cblxuICAgIGdldFRodW1ibmFpbFRvcChpbmRleDogbnVtYmVyKTogU2FmZVN0eWxlIHtcbiAgICAgICAgbGV0IGNhbGN1bGF0ZWRJbmRleDtcblxuICAgICAgICBpZiAodGhpcy5vcmRlciA9PT0gTmd4R2FsbGVyeU9yZGVyLkNvbHVtbikge1xuICAgICAgICAgICAgY2FsY3VsYXRlZEluZGV4ID0gaW5kZXggJSB0aGlzLnJvd3M7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5vcmRlciA9PT0gTmd4R2FsbGVyeU9yZGVyLlBhZ2UpIHtcbiAgICAgICAgICAgIGNhbGN1bGF0ZWRJbmRleCA9IE1hdGguZmxvb3IoaW5kZXggLyB0aGlzLmNvbHVtbnMpIC0gKE1hdGguZmxvb3IoaW5kZXggLyAodGhpcy5yb3dzICogdGhpcy5jb2x1bW5zKSkgKiB0aGlzLnJvd3MpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMub3JkZXIgPT0gTmd4R2FsbGVyeU9yZGVyLlJvdyAmJiB0aGlzLnJlbWFpbmluZ0NvdW50KSB7XG4gICAgICAgICAgICBjYWxjdWxhdGVkSW5kZXggPSBNYXRoLmZsb29yKGluZGV4IC8gdGhpcy5jb2x1bW5zKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNhbGN1bGF0ZWRJbmRleCA9IE1hdGguZmxvb3IoaW5kZXggLyBNYXRoLmNlaWwodGhpcy5pbWFnZXMubGVuZ3RoIC8gdGhpcy5yb3dzKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5nZXRUaHVtYm5haWxQb3NpdGlvbihjYWxjdWxhdGVkSW5kZXgsIHRoaXMucm93cyk7XG4gICAgfVxuXG4gICAgZ2V0VGh1bWJuYWlsV2lkdGgoKTogU2FmZVN0eWxlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGh1bWJuYWlsRGltZW5zaW9uKHRoaXMuY29sdW1ucyk7XG4gICAgfVxuXG4gICAgZ2V0VGh1bWJuYWlsSGVpZ2h0KCk6IFNhZmVTdHlsZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFRodW1ibmFpbERpbWVuc2lvbih0aGlzLnJvd3MpO1xuICAgIH1cblxuICAgIHNldFRodW1ibmFpbHNQb3NpdGlvbigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy50aHVtYm5haWxzTGVmdCA9IC0gKCgxMDAgLyB0aGlzLmNvbHVtbnMpICogdGhpcy5pbmRleCkgKyAnJSdcblxuICAgICAgICB0aGlzLnRodW1ibmFpbHNNYXJnaW5MZWZ0ID0gLSAoKHRoaXMubWFyZ2luIC0gKCgodGhpcy5jb2x1bW5zIC0gMSlcbiAgICAgICAgKiB0aGlzLm1hcmdpbikgLyB0aGlzLmNvbHVtbnMpKSAqIHRoaXMuaW5kZXgpICsgJ3B4JztcbiAgICB9XG5cbiAgICBzZXREZWZhdWx0UG9zaXRpb24oKTogdm9pZCB7XG4gICAgICAgIHRoaXMudGh1bWJuYWlsc0xlZnQgPSAnMHB4JztcbiAgICAgICAgdGhpcy50aHVtYm5haWxzTWFyZ2luTGVmdCA9ICcwcHgnO1xuICAgIH1cblxuICAgIGNhblNob3dBcnJvd3MoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLnJlbWFpbmluZ0NvdW50KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5hcnJvd3MgJiYgdGhpcy5pbWFnZXMgJiYgdGhpcy5pbWFnZXMubGVuZ3RoID4gdGhpcy5nZXRWaXNpYmxlQ291bnQoKVxuICAgICAgICAgICAgJiYgKCF0aGlzLmFycm93c0F1dG9IaWRlIHx8IHRoaXMubW91c2VlbnRlcikpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFsaWRhdGVJbmRleCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2VzKSB7XG4gICAgICAgICAgICBsZXQgbmV3SW5kZXg7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm9yZGVyID09PSBOZ3hHYWxsZXJ5T3JkZXIuQ29sdW1uKSB7XG4gICAgICAgICAgICAgICAgbmV3SW5kZXggPSBNYXRoLmZsb29yKHRoaXMuc2VsZWN0ZWRJbmRleCAvIHRoaXMucm93cyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld0luZGV4ID0gdGhpcy5zZWxlY3RlZEluZGV4ICUgTWF0aC5jZWlsKHRoaXMuaW1hZ2VzLmxlbmd0aCAvIHRoaXMucm93cyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnJlbWFpbmluZ0NvdW50KSB7XG4gICAgICAgICAgICAgICAgbmV3SW5kZXggPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobmV3SW5kZXggPCB0aGlzLmluZGV4IHx8IG5ld0luZGV4ID49IHRoaXMuaW5kZXggKyB0aGlzLmNvbHVtbnMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXhJbmRleCA9IHRoaXMuZ2V0TWF4SW5kZXgoKSAtIHRoaXMuY29sdW1ucztcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4ID0gbmV3SW5kZXggPiBtYXhJbmRleCA/IG1heEluZGV4IDogbmV3SW5kZXg7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNldFRodW1ibmFpbHNQb3NpdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0U2FmZVVybChpbWFnZTogc3RyaW5nKTogU2FmZVN0eWxlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2FuaXRpemF0aW9uLmJ5cGFzc1NlY3VyaXR5VHJ1c3RTdHlsZSh0aGlzLmhlbHBlclNlcnZpY2UuZ2V0QmFja2dyb3VuZFVybChpbWFnZSkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0VGh1bWJuYWlsUG9zaXRpb24oaW5kZXg6IG51bWJlciwgY291bnQ6IG51bWJlcik6IFNhZmVTdHlsZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFNhZmVTdHlsZSgnY2FsYygnICsgKCgxMDAgLyBjb3VudCkgKiBpbmRleCkgKyAnJSArICdcbiAgICAgICAgICAgICsgKCh0aGlzLm1hcmdpbiAtICgoKGNvdW50IC0gMSkgKiB0aGlzLm1hcmdpbikgLyBjb3VudCkpICogaW5kZXgpICsgJ3B4KScpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0VGh1bWJuYWlsRGltZW5zaW9uKGNvdW50OiBudW1iZXIpOiBTYWZlU3R5bGUge1xuICAgICAgICBpZiAodGhpcy5tYXJnaW4gIT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFNhZmVTdHlsZSgnY2FsYygnICsgKDEwMCAvIGNvdW50KSArICclIC0gJ1xuICAgICAgICAgICAgICAgICsgKCgoY291bnQgLSAxKSAqIHRoaXMubWFyZ2luKSAvIGNvdW50KSArICdweCknKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFNhZmVTdHlsZSgnY2FsYygnICsgKDEwMCAvIGNvdW50KSArICclICsgMXB4KScpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRNYXhJbmRleCgpOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5vcmRlciA9PSBOZ3hHYWxsZXJ5T3JkZXIuUGFnZSkge1xuICAgICAgICAgICAgbGV0IG1heEluZGV4ID0gKE1hdGguZmxvb3IodGhpcy5pbWFnZXMubGVuZ3RoIC8gdGhpcy5nZXRWaXNpYmxlQ291bnQoKSkgKiB0aGlzLmNvbHVtbnMpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pbWFnZXMubGVuZ3RoICUgdGhpcy5nZXRWaXNpYmxlQ291bnQoKSA+IHRoaXMuY29sdW1ucykge1xuICAgICAgICAgICAgICAgIG1heEluZGV4ICs9IHRoaXMuY29sdW1ucztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG1heEluZGV4ICs9IHRoaXMuaW1hZ2VzLmxlbmd0aCAlIHRoaXMuZ2V0VmlzaWJsZUNvdW50KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBtYXhJbmRleDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwodGhpcy5pbWFnZXMubGVuZ3RoIC8gdGhpcy5yb3dzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0VmlzaWJsZUNvdW50KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbHVtbnMgKiB0aGlzLnJvd3M7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRTYWZlU3R5bGUodmFsdWU6IHN0cmluZyk6IFNhZmVTdHlsZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNhbml0aXphdGlvbi5ieXBhc3NTZWN1cml0eVRydXN0U3R5bGUodmFsdWUpO1xuICAgIH1cbn1cbiJdfQ==