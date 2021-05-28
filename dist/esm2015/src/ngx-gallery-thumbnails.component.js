import { Component, Input, Output, EventEmitter, HostListener, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { DomSanitizer, SafeStyle, SafeResourceUrl } from '@angular/platform-browser';
import { NgxGalleryHelperService } from './ngx-gallery-helper.service';
import { NgxGalleryOrder } from './ngx-gallery-order.model';
export class NgxGalleryThumbnailsComponent {
    constructor(sanitization, elementRef, helperService) {
        this.sanitization = sanitization;
        this.elementRef = elementRef;
        this.helperService = helperService;
        this.minStopIndex = 0;
        this.onActiveChange = new EventEmitter();
        this.index = 0;
    }
    ngOnChanges(changes) {
        if (changes['selectedIndex']) {
            this.validateIndex();
        }
        if (changes['swipe']) {
            this.helperService.manageSwipe(this.swipe, this.elementRef, 'thumbnails', () => this.moveRight(), () => this.moveLeft());
        }
        if (this.images) {
            this.remainingCountValue = this.images.length - (this.rows * this.columns);
        }
    }
    onMouseEnter() {
        this.mouseenter = true;
    }
    onMouseLeave() {
        this.mouseenter = false;
    }
    reset(index) {
        this.selectedIndex = index;
        this.setDefaultPosition();
        this.index = 0;
        this.validateIndex();
    }
    getImages() {
        if (!this.images) {
            return [];
        }
        if (this.remainingCount) {
            return this.images.slice(0, this.rows * this.columns);
        }
        else if (this.lazyLoading && this.order != NgxGalleryOrder.Row) {
            let stopIndex = 0;
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
    }
    handleClick(event, index) {
        if (!this.hasLink(index)) {
            this.selectedIndex = index;
            this.onActiveChange.emit(index);
            event.stopPropagation();
            event.preventDefault();
        }
    }
    hasLink(index) {
        if (this.links && this.links.length && this.links[index])
            return true;
    }
    moveRight() {
        if (this.canMoveRight()) {
            this.index += this.moveSize;
            let maxIndex = this.getMaxIndex() - this.columns;
            if (this.index > maxIndex) {
                this.index = maxIndex;
            }
            this.setThumbnailsPosition();
        }
    }
    moveLeft() {
        if (this.canMoveLeft()) {
            this.index -= this.moveSize;
            if (this.index < 0) {
                this.index = 0;
            }
            this.setThumbnailsPosition();
        }
    }
    canMoveRight() {
        return this.index + this.columns < this.getMaxIndex() ? true : false;
    }
    canMoveLeft() {
        return this.index !== 0 ? true : false;
    }
    getThumbnailLeft(index) {
        let calculatedIndex;
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
    }
    getThumbnailTop(index) {
        let calculatedIndex;
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
    }
    getThumbnailWidth() {
        return this.getThumbnailDimension(this.columns);
    }
    getThumbnailHeight() {
        return this.getThumbnailDimension(this.rows);
    }
    setThumbnailsPosition() {
        this.thumbnailsLeft = -((100 / this.columns) * this.index) + '%';
        this.thumbnailsMarginLeft = -((this.margin - (((this.columns - 1)
            * this.margin) / this.columns)) * this.index) + 'px';
    }
    setDefaultPosition() {
        this.thumbnailsLeft = '0px';
        this.thumbnailsMarginLeft = '0px';
    }
    canShowArrows() {
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
    }
    validateIndex() {
        if (this.images) {
            let newIndex;
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
                const maxIndex = this.getMaxIndex() - this.columns;
                this.index = newIndex > maxIndex ? maxIndex : newIndex;
                this.setThumbnailsPosition();
            }
        }
    }
    getSafeUrl(image) {
        return this.sanitization.bypassSecurityTrustStyle(this.helperService.getBackgroundUrl(image));
    }
    getThumbnailPosition(index, count) {
        return this.getSafeStyle('calc(' + ((100 / count) * index) + '% + '
            + ((this.margin - (((count - 1) * this.margin) / count)) * index) + 'px)');
    }
    getThumbnailDimension(count) {
        if (this.margin !== 0) {
            return this.getSafeStyle('calc(' + (100 / count) + '% - '
                + (((count - 1) * this.margin) / count) + 'px)');
        }
        else {
            return this.getSafeStyle('calc(' + (100 / count) + '% + 1px)');
        }
    }
    getMaxIndex() {
        if (this.order == NgxGalleryOrder.Page) {
            let maxIndex = (Math.floor(this.images.length / this.getVisibleCount()) * this.columns);
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
    }
    getVisibleCount() {
        return this.columns * this.rows;
    }
    getSafeStyle(value) {
        return this.sanitization.bypassSecurityTrustStyle(value);
    }
}
NgxGalleryThumbnailsComponent.ctorParameters = () => [
    { type: DomSanitizer },
    { type: ElementRef },
    { type: NgxGalleryHelperService }
];
NgxGalleryThumbnailsComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-gallery-thumbnails',
                template: `
    <div class="ngx-gallery-thumbnails-wrapper ngx-gallery-thumbnail-size-{{size}}">
        <div class="ngx-gallery-thumbnails" [style.transform]="'translateX(' + thumbnailsLeft + ')'" [style.marginLeft]="thumbnailsMarginLeft">
            <a [href]="hasLink(i) ? links[i] : '#'" [target]="linkTarget" class="ngx-gallery-thumbnail" *ngFor="let image of getImages(); let i = index;" [style.background-image]="getSafeUrl(image)" (click)="handleClick($event, i)" [style.width]="getThumbnailWidth()" [style.height]="getThumbnailHeight()" [style.left]="getThumbnailLeft(i)" [style.top]="getThumbnailTop(i)" [ngClass]="{ 'ngx-gallery-active': i == selectedIndex, 'ngx-gallery-clickable': clickable }" [attr.aria-label]="labels[i]">
                <div class="ngx-gallery-icons-wrapper">
                    <ngx-gallery-action *ngFor="let action of actions" [icon]="action.icon" [disabled]="action.disabled" [titleText]="action.titleText" (onClick)="action.onClick($event, i)"></ngx-gallery-action>
                </div>
                <div class="ngx-gallery-remaining-count-overlay" *ngIf="remainingCount && remainingCountValue && (i == (rows * columns) - 1)">
                    <span class="ngx-gallery-remaining-count">+{{remainingCountValue}}</span>
                </div>
            </a>
        </div>
    </div>
    <ngx-gallery-arrows *ngIf="canShowArrows()" (onPrevClick)="moveLeft()" (onNextClick)="moveRight()" [prevDisabled]="!canMoveLeft()" [nextDisabled]="!canMoveRight()" [arrowPrevIcon]="arrowPrevIcon" [arrowNextIcon]="arrowNextIcon"></ngx-gallery-arrows>
    `,
                styles: [":host{width:100%;display:inline-block;position:relative}.ngx-gallery-thumbnails-wrapper{width:100%;height:100%;position:absolute;overflow:hidden}.ngx-gallery-thumbnails{height:100%;width:100%;position:absolute;left:0;transform:translateX(0);transition:transform .5s ease-in-out;will-change:transform}.ngx-gallery-thumbnails .ngx-gallery-thumbnail{position:absolute;height:100%;background-position:center;background-repeat:no-repeat;text-decoration:none}.ngx-gallery-thumbnail-size-cover .ngx-gallery-thumbnails .ngx-gallery-thumbnail{background-size:cover}.ngx-gallery-thumbnail-size-contain .ngx-gallery-thumbnails .ngx-gallery-thumbnail{background-size:contain}.ngx-gallery-remaining-count-overlay{width:100%;height:100%;position:absolute;left:0;top:0;background-color:rgba(0,0,0,.4)}.ngx-gallery-remaining-count{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:30px}"]
            },] }
];
NgxGalleryThumbnailsComponent.ctorParameters = () => [
    { type: DomSanitizer },
    { type: ElementRef },
    { type: NgxGalleryHelperService }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktdGh1bWJuYWlscy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZ2FsbGVyeS8iLCJzb3VyY2VzIjpbInNyYy9uZ3gtZ2FsbGVyeS10aHVtYm5haWxzLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzSCxPQUFPLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxlQUFlLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUVyRixPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUN2RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFzQjVELE1BQU0sT0FBTyw2QkFBNkI7SUFrQ3RDLFlBQW9CLFlBQTBCLEVBQVUsVUFBc0IsRUFDbEUsYUFBc0M7UUFEOUIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFBVSxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ2xFLGtCQUFhLEdBQWIsYUFBYSxDQUF5QjtRQTVCbEQsaUJBQVksR0FBRyxDQUFDLENBQUM7UUF1QlAsbUJBQWMsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRXRDLFVBQUssR0FBRyxDQUFDLENBQUM7SUFHbUMsQ0FBQztJQUV0RCxXQUFXLENBQUMsT0FBc0I7UUFDOUIsSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUU7WUFDMUIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQ3hCO1FBRUQsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDbEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxFQUMxRCxZQUFZLEVBQUUsR0FBRyxF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LEtBQUs7b0JBQ0wsS0FBSztxQkFDTCxLQUFLO3lCQUNMLEtBQUs7c0JBQ0wsS0FBSzttQkFDTCxLQUFLO3FCQUNMLEtBQUs7NkJBQ0wsS0FBSztxQkFDTCxLQUFLOzRCQUNMLEtBQUs7d0JBQ0wsS0FBSztvQkFDTCxLQUFLO21CQUNMLEtBQUs7NEJBQ0wsS0FBSzs0QkFDTCxLQUFLO3VCQUNMLEtBQUs7b0JBQ0wsS0FBSzs2QkFDTCxLQUFLOzBCQUNMLEtBQUs7c0JBQ0wsS0FBSzs2QkFFTCxNQUFNOzJCQXNCTixZQUFZLFNBQUMsWUFBWTsyQkFJekIsWUFBWSxTQUFDLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyLCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERvbVNhbml0aXplciwgU2FmZVN0eWxlLCBTYWZlUmVzb3VyY2VVcmwgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcblxuaW1wb3J0IHsgTmd4R2FsbGVyeUhlbHBlclNlcnZpY2UgfSBmcm9tICcuL25neC1nYWxsZXJ5LWhlbHBlci5zZXJ2aWNlJztcbmltcG9ydCB7IE5neEdhbGxlcnlPcmRlciB9IGZyb20gJy4vbmd4LWdhbGxlcnktb3JkZXIubW9kZWwnO1xuaW1wb3J0IHsgTmd4R2FsbGVyeUFjdGlvbiB9IGZyb20gJy4vbmd4LWdhbGxlcnktYWN0aW9uLm1vZGVsJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICduZ3gtZ2FsbGVyeS10aHVtYm5haWxzJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJuZ3gtZ2FsbGVyeS10aHVtYm5haWxzLXdyYXBwZXIgbmd4LWdhbGxlcnktdGh1bWJuYWlsLXNpemUte3tzaXplfX1cIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm5neC1nYWxsZXJ5LXRodW1ibmFpbHNcIiBbc3R5bGUudHJhbnNmb3JtXT1cIid0cmFuc2xhdGVYKCcgKyB0aHVtYm5haWxzTGVmdCArICcpJ1wiIFtzdHlsZS5tYXJnaW5MZWZ0XT1cInRodW1ibmFpbHNNYXJnaW5MZWZ0XCI+XG4gICAgICAgICAgICA8YSBbaHJlZl09XCJoYXNMaW5rKGkpID8gbGlua3NbaV0gOiAnIydcIiBbdGFyZ2V0XT1cImxpbmtUYXJnZXRcIiBjbGFzcz1cIm5neC1nYWxsZXJ5LXRodW1ibmFpbFwiICpuZ0Zvcj1cImxldCBpbWFnZSBvZiBnZXRJbWFnZXMoKTsgbGV0IGkgPSBpbmRleDtcIiBbc3R5bGUuYmFja2dyb3VuZC1pbWFnZV09XCJnZXRTYWZlVXJsKGltYWdlKVwiIChjbGljayk9XCJoYW5kbGVDbGljaygkZXZlbnQsIGkpXCIgW3N0eWxlLndpZHRoXT1cImdldFRodW1ibmFpbFdpZHRoKClcIiBbc3R5bGUuaGVpZ2h0XT1cImdldFRodW1ibmFpbEhlaWdodCgpXCIgW3N0eWxlLmxlZnRdPVwiZ2V0VGh1bWJuYWlsTGVmdChpKVwiIFtzdHlsZS50b3BdPVwiZ2V0VGh1bWJuYWlsVG9wKGkpXCIgW25nQ2xhc3NdPVwieyAnbmd4LWdhbGxlcnktYWN0aXZlJzogaSA9PSBzZWxlY3RlZEluZGV4LCAnbmd4LWdhbGxlcnktY2xpY2thYmxlJzogY2xpY2thYmxlIH1cIiBbYXR0ci5hcmlhLWxhYmVsXT1cImxhYmVsc1tpXVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJuZ3gtZ2FsbGVyeS1pY29ucy13cmFwcGVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZ3gtZ2FsbGVyeS1hY3Rpb24gKm5nRm9yPVwibGV0IGFjdGlvbiBvZiBhY3Rpb25zXCIgW2ljb25dPVwiYWN0aW9uLmljb25cIiBbZGlzYWJsZWRdPVwiYWN0aW9uLmRpc2FibGVkXCIgW3RpdGxlVGV4dF09XCJhY3Rpb24udGl0bGVUZXh0XCIgKG9uQ2xpY2spPVwiYWN0aW9uLm9uQ2xpY2soJGV2ZW50LCBpKVwiPjwvbmd4LWdhbGxlcnktYWN0aW9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJuZ3gtZ2FsbGVyeS1yZW1haW5pbmctY291bnQtb3ZlcmxheVwiICpuZ0lmPVwicmVtYWluaW5nQ291bnQgJiYgcmVtYWluaW5nQ291bnRWYWx1ZSAmJiAoaSA9PSAocm93cyAqIGNvbHVtbnMpIC0gMSlcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJuZ3gtZ2FsbGVyeS1yZW1haW5pbmctY291bnRcIj4re3tyZW1haW5pbmdDb3VudFZhbHVlfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxuZ3gtZ2FsbGVyeS1hcnJvd3MgKm5nSWY9XCJjYW5TaG93QXJyb3dzKClcIiAob25QcmV2Q2xpY2spPVwibW92ZUxlZnQoKVwiIChvbk5leHRDbGljayk9XCJtb3ZlUmlnaHQoKVwiIFtwcmV2RGlzYWJsZWRdPVwiIWNhbk1vdmVMZWZ0KClcIiBbbmV4dERpc2FibGVkXT1cIiFjYW5Nb3ZlUmlnaHQoKVwiIFthcnJvd1ByZXZJY29uXT1cImFycm93UHJldkljb25cIiBbYXJyb3dOZXh0SWNvbl09XCJhcnJvd05leHRJY29uXCI+PC9uZ3gtZ2FsbGVyeS1hcnJvd3M+XG4gICAgYCxcbiAgICBzdHlsZVVybHM6IFsnLi9uZ3gtZ2FsbGVyeS10aHVtYm5haWxzLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTmd4R2FsbGVyeVRodW1ibmFpbHNDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuXG4gICAgdGh1bWJuYWlsc0xlZnQ6IHN0cmluZztcbiAgICB0aHVtYm5haWxzTWFyZ2luTGVmdDogc3RyaW5nO1xuICAgIG1vdXNlZW50ZXI6IGJvb2xlYW47XG4gICAgcmVtYWluaW5nQ291bnRWYWx1ZTogbnVtYmVyO1xuXG4gICAgbWluU3RvcEluZGV4ID0gMDtcblxuICAgIEBJbnB1dCgpIGltYWdlczogc3RyaW5nW10gfCBTYWZlUmVzb3VyY2VVcmxbXTtcbiAgICBASW5wdXQoKSBsaW5rczogc3RyaW5nW107XG4gICAgQElucHV0KCkgbGFiZWxzOiBzdHJpbmdbXTtcbiAgICBASW5wdXQoKSBsaW5rVGFyZ2V0OiBzdHJpbmc7XG4gICAgQElucHV0KCkgY29sdW1uczogbnVtYmVyO1xuICAgIEBJbnB1dCgpIHJvd3M6IG51bWJlcjtcbiAgICBASW5wdXQoKSBhcnJvd3M6IGJvb2xlYW47XG4gICAgQElucHV0KCkgYXJyb3dzQXV0b0hpZGU6IGJvb2xlYW47XG4gICAgQElucHV0KCkgbWFyZ2luOiBudW1iZXI7XG4gICAgQElucHV0KCkgc2VsZWN0ZWRJbmRleDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIGNsaWNrYWJsZTogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBzd2lwZTogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBzaXplOiBzdHJpbmc7XG4gICAgQElucHV0KCkgYXJyb3dQcmV2SWNvbjogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGFycm93TmV4dEljb246IHN0cmluZztcbiAgICBASW5wdXQoKSBtb3ZlU2l6ZTogbnVtYmVyO1xuICAgIEBJbnB1dCgpIG9yZGVyOiBudW1iZXI7XG4gICAgQElucHV0KCkgcmVtYWluaW5nQ291bnQ6IGJvb2xlYW47XG4gICAgQElucHV0KCkgbGF6eUxvYWRpbmc6IGJvb2xlYW47XG4gICAgQElucHV0KCkgYWN0aW9uczogTmd4R2FsbGVyeUFjdGlvbltdO1xuXG4gICAgQE91dHB1dCgpIG9uQWN0aXZlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgcHJpdmF0ZSBpbmRleCA9IDA7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNhbml0aXphdGlvbjogRG9tU2FuaXRpemVyLCBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgIHByaXZhdGUgaGVscGVyU2VydmljZTogTmd4R2FsbGVyeUhlbHBlclNlcnZpY2UpIHt9XG5cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgICAgIGlmIChjaGFuZ2VzWydzZWxlY3RlZEluZGV4J10pIHtcbiAgICAgICAgICAgIHRoaXMudmFsaWRhdGVJbmRleCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNoYW5nZXNbJ3N3aXBlJ10pIHtcbiAgICAgICAgICAgIHRoaXMuaGVscGVyU2VydmljZS5tYW5hZ2VTd2lwZSh0aGlzLnN3aXBlLCB0aGlzLmVsZW1lbnRSZWYsXG4gICAgICAgICAgICAndGh1bWJuYWlscycsICgpID0+IHRoaXMubW92ZVJpZ2h0KCksICgpID0+IHRoaXMubW92ZUxlZnQoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pbWFnZXMpIHtcbiAgICAgICAgICAgIHRoaXMucmVtYWluaW5nQ291bnRWYWx1ZSA9IHRoaXMuaW1hZ2VzLmxlbmd0aCAtICh0aGlzLnJvd3MgKiB0aGlzLmNvbHVtbnMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignbW91c2VlbnRlcicpIG9uTW91c2VFbnRlcigpIHtcbiAgICAgICAgdGhpcy5tb3VzZWVudGVyID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdtb3VzZWxlYXZlJykgb25Nb3VzZUxlYXZlKCkge1xuICAgICAgICB0aGlzLm1vdXNlZW50ZXIgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXNldChpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IGluZGV4O1xuICAgICAgICB0aGlzLnNldERlZmF1bHRQb3NpdGlvbigpO1xuXG4gICAgICAgIHRoaXMuaW5kZXggPSAwO1xuICAgICAgICB0aGlzLnZhbGlkYXRlSW5kZXgoKTtcbiAgICB9XG5cbiAgICBnZXRJbWFnZXMoKTogc3RyaW5nW10gfCBTYWZlUmVzb3VyY2VVcmxbXSB7XG4gICAgICAgIGlmICghdGhpcy5pbWFnZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnJlbWFpbmluZ0NvdW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbWFnZXMuc2xpY2UoMCwgdGhpcy5yb3dzICogdGhpcy5jb2x1bW5zKTtcbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSBpZiAodGhpcy5sYXp5TG9hZGluZyAmJiB0aGlzLm9yZGVyICE9IE5neEdhbGxlcnlPcmRlci5Sb3cpIHtcbiAgICAgICAgICAgIGxldCBzdG9wSW5kZXggPSAwO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5vcmRlciA9PT0gTmd4R2FsbGVyeU9yZGVyLkNvbHVtbikge1xuICAgICAgICAgICAgICAgIHN0b3BJbmRleCA9ICh0aGlzLmluZGV4ICsgdGhpcy5jb2x1bW5zICsgdGhpcy5tb3ZlU2l6ZSkgKiB0aGlzLnJvd3M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLm9yZGVyID09PSBOZ3hHYWxsZXJ5T3JkZXIuUGFnZSkge1xuICAgICAgICAgICAgICAgIHN0b3BJbmRleCA9IHRoaXMuaW5kZXggKyAoKHRoaXMuY29sdW1ucyAqIHRoaXMucm93cykgKiAyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHN0b3BJbmRleCA8PSB0aGlzLm1pblN0b3BJbmRleCkge1xuICAgICAgICAgICAgICAgIHN0b3BJbmRleCA9IHRoaXMubWluU3RvcEluZGV4O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1pblN0b3BJbmRleCA9IHN0b3BJbmRleDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW1hZ2VzLnNsaWNlKDAsIHN0b3BJbmRleCk7XG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW1hZ2VzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlQ2xpY2soZXZlbnQ6IEV2ZW50LCBpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5oYXNMaW5rKGluZGV4KSkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICB0aGlzLm9uQWN0aXZlQ2hhbmdlLmVtaXQoaW5kZXgpO1xuXG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYXNMaW5rKGluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMubGlua3MgJiYgdGhpcy5saW5rcy5sZW5ndGggJiYgdGhpcy5saW5rc1tpbmRleF0pIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIG1vdmVSaWdodCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuY2FuTW92ZVJpZ2h0KCkpIHtcbiAgICAgICAgICAgIHRoaXMuaW5kZXggKz0gdGhpcy5tb3ZlU2l6ZTtcbiAgICAgICAgICAgIGxldCBtYXhJbmRleCA9IHRoaXMuZ2V0TWF4SW5kZXgoKSAtIHRoaXMuY29sdW1ucztcblxuICAgICAgICAgICAgaWYgKHRoaXMuaW5kZXggPiBtYXhJbmRleCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXggPSBtYXhJbmRleDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zZXRUaHVtYm5haWxzUG9zaXRpb24oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1vdmVMZWZ0KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5jYW5Nb3ZlTGVmdCgpKSB7XG4gICAgICAgICAgICB0aGlzLmluZGV4IC09IHRoaXMubW92ZVNpemU7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmluZGV4IDwgMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXggPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNldFRodW1ibmFpbHNQb3NpdGlvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2FuTW92ZVJpZ2h0KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5pbmRleCArIHRoaXMuY29sdW1ucyA8IHRoaXMuZ2V0TWF4SW5kZXgoKSA/IHRydWUgOiBmYWxzZTtcbiAgICB9XG5cbiAgICBjYW5Nb3ZlTGVmdCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXggIT09IDAgPyB0cnVlIDogZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0VGh1bWJuYWlsTGVmdChpbmRleDogbnVtYmVyKTogU2FmZVN0eWxlIHtcbiAgICAgICAgbGV0IGNhbGN1bGF0ZWRJbmRleDtcblxuICAgICAgICBpZiAodGhpcy5vcmRlciA9PT0gTmd4R2FsbGVyeU9yZGVyLkNvbHVtbikge1xuICAgICAgICAgICAgY2FsY3VsYXRlZEluZGV4ID0gTWF0aC5mbG9vcihpbmRleCAvIHRoaXMucm93cyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5vcmRlciA9PT0gTmd4R2FsbGVyeU9yZGVyLlBhZ2UpIHtcbiAgICAgICAgICAgIGNhbGN1bGF0ZWRJbmRleCA9IChpbmRleCAlIHRoaXMuY29sdW1ucykgKyAoTWF0aC5mbG9vcihpbmRleCAvICh0aGlzLnJvd3MgKiB0aGlzLmNvbHVtbnMpKSAqIHRoaXMuY29sdW1ucyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5vcmRlciA9PSBOZ3hHYWxsZXJ5T3JkZXIuUm93ICYmIHRoaXMucmVtYWluaW5nQ291bnQpIHtcbiAgICAgICAgICAgIGNhbGN1bGF0ZWRJbmRleCA9IGluZGV4ICUgdGhpcy5jb2x1bW5zO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2FsY3VsYXRlZEluZGV4ID0gaW5kZXggJSBNYXRoLmNlaWwodGhpcy5pbWFnZXMubGVuZ3RoIC8gdGhpcy5yb3dzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmdldFRodW1ibmFpbFBvc2l0aW9uKGNhbGN1bGF0ZWRJbmRleCwgdGhpcy5jb2x1bW5zKTtcbiAgICB9XG5cbiAgICBnZXRUaHVtYm5haWxUb3AoaW5kZXg6IG51bWJlcik6IFNhZmVTdHlsZSB7XG4gICAgICAgIGxldCBjYWxjdWxhdGVkSW5kZXg7XG5cbiAgICAgICAgaWYgKHRoaXMub3JkZXIgPT09IE5neEdhbGxlcnlPcmRlci5Db2x1bW4pIHtcbiAgICAgICAgICAgIGNhbGN1bGF0ZWRJbmRleCA9IGluZGV4ICUgdGhpcy5yb3dzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMub3JkZXIgPT09IE5neEdhbGxlcnlPcmRlci5QYWdlKSB7XG4gICAgICAgICAgICBjYWxjdWxhdGVkSW5kZXggPSBNYXRoLmZsb29yKGluZGV4IC8gdGhpcy5jb2x1bW5zKSAtIChNYXRoLmZsb29yKGluZGV4IC8gKHRoaXMucm93cyAqIHRoaXMuY29sdW1ucykpICogdGhpcy5yb3dzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLm9yZGVyID09IE5neEdhbGxlcnlPcmRlci5Sb3cgJiYgdGhpcy5yZW1haW5pbmdDb3VudCkge1xuICAgICAgICAgICAgY2FsY3VsYXRlZEluZGV4ID0gTWF0aC5mbG9vcihpbmRleCAvIHRoaXMuY29sdW1ucyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjYWxjdWxhdGVkSW5kZXggPSBNYXRoLmZsb29yKGluZGV4IC8gTWF0aC5jZWlsKHRoaXMuaW1hZ2VzLmxlbmd0aCAvIHRoaXMucm93cykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGh1bWJuYWlsUG9zaXRpb24oY2FsY3VsYXRlZEluZGV4LCB0aGlzLnJvd3MpO1xuICAgIH1cblxuICAgIGdldFRodW1ibmFpbFdpZHRoKCk6IFNhZmVTdHlsZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFRodW1ibmFpbERpbWVuc2lvbih0aGlzLmNvbHVtbnMpO1xuICAgIH1cblxuICAgIGdldFRodW1ibmFpbEhlaWdodCgpOiBTYWZlU3R5bGUge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRUaHVtYm5haWxEaW1lbnNpb24odGhpcy5yb3dzKTtcbiAgICB9XG5cbiAgICBzZXRUaHVtYm5haWxzUG9zaXRpb24oKTogdm9pZCB7XG4gICAgICAgIHRoaXMudGh1bWJuYWlsc0xlZnQgPSAtICgoMTAwIC8gdGhpcy5jb2x1bW5zKSAqIHRoaXMuaW5kZXgpICsgJyUnXG5cbiAgICAgICAgdGhpcy50aHVtYm5haWxzTWFyZ2luTGVmdCA9IC0gKCh0aGlzLm1hcmdpbiAtICgoKHRoaXMuY29sdW1ucyAtIDEpXG4gICAgICAgICogdGhpcy5tYXJnaW4pIC8gdGhpcy5jb2x1bW5zKSkgKiB0aGlzLmluZGV4KSArICdweCc7XG4gICAgfVxuXG4gICAgc2V0RGVmYXVsdFBvc2l0aW9uKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnRodW1ibmFpbHNMZWZ0ID0gJzBweCc7XG4gICAgICAgIHRoaXMudGh1bWJuYWlsc01hcmdpbkxlZnQgPSAnMHB4JztcbiAgICB9XG5cbiAgICBjYW5TaG93QXJyb3dzKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5yZW1haW5pbmdDb3VudCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYXJyb3dzICYmIHRoaXMuaW1hZ2VzICYmIHRoaXMuaW1hZ2VzLmxlbmd0aCA+IHRoaXMuZ2V0VmlzaWJsZUNvdW50KClcbiAgICAgICAgICAgICYmICghdGhpcy5hcnJvd3NBdXRvSGlkZSB8fCB0aGlzLm1vdXNlZW50ZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhbGlkYXRlSW5kZXgoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmltYWdlcykge1xuICAgICAgICAgICAgbGV0IG5ld0luZGV4O1xuXG4gICAgICAgICAgICBpZiAodGhpcy5vcmRlciA9PT0gTmd4R2FsbGVyeU9yZGVyLkNvbHVtbikge1xuICAgICAgICAgICAgICAgIG5ld0luZGV4ID0gTWF0aC5mbG9vcih0aGlzLnNlbGVjdGVkSW5kZXggLyB0aGlzLnJvd3MpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdJbmRleCA9IHRoaXMuc2VsZWN0ZWRJbmRleCAlIE1hdGguY2VpbCh0aGlzLmltYWdlcy5sZW5ndGggLyB0aGlzLnJvd3MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5yZW1haW5pbmdDb3VudCkge1xuICAgICAgICAgICAgICAgIG5ld0luZGV4ID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG5ld0luZGV4IDwgdGhpcy5pbmRleCB8fCBuZXdJbmRleCA+PSB0aGlzLmluZGV4ICsgdGhpcy5jb2x1bW5zKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWF4SW5kZXggPSB0aGlzLmdldE1heEluZGV4KCkgLSB0aGlzLmNvbHVtbnM7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleCA9IG5ld0luZGV4ID4gbWF4SW5kZXggPyBtYXhJbmRleCA6IG5ld0luZGV4O1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRUaHVtYm5haWxzUG9zaXRpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFNhZmVVcmwoaW1hZ2U6IHN0cmluZyk6IFNhZmVTdHlsZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNhbml0aXphdGlvbi5ieXBhc3NTZWN1cml0eVRydXN0U3R5bGUodGhpcy5oZWxwZXJTZXJ2aWNlLmdldEJhY2tncm91bmRVcmwoaW1hZ2UpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFRodW1ibmFpbFBvc2l0aW9uKGluZGV4OiBudW1iZXIsIGNvdW50OiBudW1iZXIpOiBTYWZlU3R5bGUge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRTYWZlU3R5bGUoJ2NhbGMoJyArICgoMTAwIC8gY291bnQpICogaW5kZXgpICsgJyUgKyAnXG4gICAgICAgICAgICArICgodGhpcy5tYXJnaW4gLSAoKChjb3VudCAtIDEpICogdGhpcy5tYXJnaW4pIC8gY291bnQpKSAqIGluZGV4KSArICdweCknKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFRodW1ibmFpbERpbWVuc2lvbihjb3VudDogbnVtYmVyKTogU2FmZVN0eWxlIHtcbiAgICAgICAgaWYgKHRoaXMubWFyZ2luICE9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRTYWZlU3R5bGUoJ2NhbGMoJyArICgxMDAgLyBjb3VudCkgKyAnJSAtICdcbiAgICAgICAgICAgICAgICArICgoKGNvdW50IC0gMSkgKiB0aGlzLm1hcmdpbikgLyBjb3VudCkgKyAncHgpJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRTYWZlU3R5bGUoJ2NhbGMoJyArICgxMDAgLyBjb3VudCkgKyAnJSArIDFweCknKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0TWF4SW5kZXgoKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMub3JkZXIgPT0gTmd4R2FsbGVyeU9yZGVyLlBhZ2UpIHtcbiAgICAgICAgICAgIGxldCBtYXhJbmRleCA9IChNYXRoLmZsb29yKHRoaXMuaW1hZ2VzLmxlbmd0aCAvIHRoaXMuZ2V0VmlzaWJsZUNvdW50KCkpICogdGhpcy5jb2x1bW5zKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuaW1hZ2VzLmxlbmd0aCAlIHRoaXMuZ2V0VmlzaWJsZUNvdW50KCkgPiB0aGlzLmNvbHVtbnMpIHtcbiAgICAgICAgICAgICAgICBtYXhJbmRleCArPSB0aGlzLmNvbHVtbnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBtYXhJbmRleCArPSB0aGlzLmltYWdlcy5sZW5ndGggJSB0aGlzLmdldFZpc2libGVDb3VudCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbWF4SW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKHRoaXMuaW1hZ2VzLmxlbmd0aCAvIHRoaXMucm93cyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFZpc2libGVDb3VudCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2x1bW5zICogdGhpcy5yb3dzO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0U2FmZVN0eWxlKHZhbHVlOiBzdHJpbmcpOiBTYWZlU3R5bGUge1xuICAgICAgICByZXR1cm4gdGhpcy5zYW5pdGl6YXRpb24uYnlwYXNzU2VjdXJpdHlUcnVzdFN0eWxlKHZhbHVlKTtcbiAgICB9XG59XG4iXX0=