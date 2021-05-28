import { Component, Input, Output, EventEmitter, HostListener, ElementRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { NgxGalleryHelperService } from './ngx-gallery-helper.service';
import { NgxGalleryAnimation } from './ngx-gallery-animation.model';
export class NgxGalleryImageComponent {
    constructor(sanitization, elementRef, helperService) {
        this.sanitization = sanitization;
        this.elementRef = elementRef;
        this.helperService = helperService;
        this.onClick = new EventEmitter();
        this.onActiveChange = new EventEmitter();
        this.canChangeImage = true;
    }
    ngOnInit() {
        if (this.arrows && this.arrowsAutoHide) {
            this.arrows = false;
        }
        if (this.autoPlay) {
            this.startAutoPlay();
        }
    }
    ngOnChanges(changes) {
        if (changes['swipe']) {
            this.helperService.manageSwipe(this.swipe, this.elementRef, 'image', () => this.showNext(), () => this.showPrev());
        }
    }
    onMouseEnter() {
        if (this.arrowsAutoHide && !this.arrows) {
            this.arrows = true;
        }
        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.stopAutoPlay();
        }
    }
    onMouseLeave() {
        if (this.arrowsAutoHide && this.arrows) {
            this.arrows = false;
        }
        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.startAutoPlay();
        }
    }
    reset(index) {
        this.selectedIndex = index;
    }
    getImages() {
        if (!this.images) {
            return [];
        }
        if (this.lazyLoading) {
            let indexes = [this.selectedIndex];
            let prevIndex = this.selectedIndex - 1;
            if (prevIndex === -1 && this.infinityMove) {
                indexes.push(this.images.length - 1);
            }
            else if (prevIndex >= 0) {
                indexes.push(prevIndex);
            }
            let nextIndex = this.selectedIndex + 1;
            if (nextIndex == this.images.length && this.infinityMove) {
                indexes.push(0);
            }
            else if (nextIndex < this.images.length) {
                indexes.push(nextIndex);
            }
            return this.images.filter((img, i) => indexes.indexOf(i) != -1);
        }
        else {
            return this.images;
        }
    }
    startAutoPlay() {
        this.stopAutoPlay();
        this.timer = setInterval(() => {
            if (!this.showNext()) {
                this.selectedIndex = -1;
                this.showNext();
            }
        }, this.autoPlayInterval);
    }
    stopAutoPlay() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
    handleClick(event, index) {
        if (this.clickable) {
            this.onClick.emit(index);
            event.stopPropagation();
            event.preventDefault();
        }
    }
    show(index) {
        this.selectedIndex = index;
        this.onActiveChange.emit(this.selectedIndex);
        this.setChangeTimeout();
    }
    showNext() {
        if (this.canShowNext() && this.canChangeImage) {
            this.selectedIndex++;
            if (this.selectedIndex === this.images.length) {
                this.selectedIndex = 0;
            }
            this.onActiveChange.emit(this.selectedIndex);
            this.setChangeTimeout();
            return true;
        }
        else {
            return false;
        }
    }
    showPrev() {
        if (this.canShowPrev() && this.canChangeImage) {
            this.selectedIndex--;
            if (this.selectedIndex < 0) {
                this.selectedIndex = this.images.length - 1;
            }
            this.onActiveChange.emit(this.selectedIndex);
            this.setChangeTimeout();
        }
    }
    setChangeTimeout() {
        this.canChangeImage = false;
        let timeout = 1000;
        if (this.animation === NgxGalleryAnimation.Slide
            || this.animation === NgxGalleryAnimation.Fade) {
            timeout = 500;
        }
        setTimeout(() => {
            this.canChangeImage = true;
        }, timeout);
    }
    canShowNext() {
        if (this.images) {
            return this.infinityMove || this.selectedIndex < this.images.length - 1
                ? true : false;
        }
        else {
            return false;
        }
    }
    canShowPrev() {
        if (this.images) {
            return this.infinityMove || this.selectedIndex > 0 ? true : false;
        }
        else {
            return false;
        }
    }
    getSafeUrl(image) {
        return this.sanitization.bypassSecurityTrustStyle(this.helperService.getBackgroundUrl(image));
    }
}
NgxGalleryImageComponent.ctorParameters = () => [
    { type: DomSanitizer },
    { type: ElementRef },
    { type: NgxGalleryHelperService }
];
NgxGalleryImageComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-gallery-image',
                template: `
        <div class="ngx-gallery-image-wrapper ngx-gallery-animation-{{animation}} ngx-gallery-image-size-{{size}}">
            <div class="ngx-gallery-image" *ngFor="let image of getImages(); let i = index;" [ngClass]="{ 'ngx-gallery-active': selectedIndex == image.index, 'ngx-gallery-inactive-left': selectedIndex > image.index, 'ngx-gallery-inactive-right': selectedIndex < image.index, 'ngx-gallery-clickable': clickable }" [style.background-image]="getSafeUrl(image.src)" (click)="handleClick($event, image.index)">
                <div class="ngx-gallery-icons-wrapper">
                    <ngx-gallery-action *ngFor="let action of actions" [icon]="action.icon" [disabled]="action.disabled" [titleText]="action.titleText" (onClick)="action.onClick($event, image.index)"></ngx-gallery-action>
                </div>
                <div class="ngx-gallery-image-text" *ngIf="showDescription && descriptions[image.index]" [innerHTML]="descriptions[image.index]" (click)="$event.stopPropagation()"></div>
            </div>
        </div>
        <ngx-gallery-bullets *ngIf="bullets" [count]="images.length" [active]="selectedIndex" (onChange)="show($event)"></ngx-gallery-bullets>
        <ngx-gallery-arrows class="ngx-gallery-image-size-{{size}}" *ngIf="arrows" (onPrevClick)="showPrev()" (onNextClick)="showNext()" [prevDisabled]="!canShowPrev()" [nextDisabled]="!canShowNext()" [arrowPrevIcon]="arrowPrevIcon" [arrowNextIcon]="arrowNextIcon"></ngx-gallery-arrows>
    `,
                styles: [":host{width:100%;display:inline-block;position:relative}.ngx-gallery-image-wrapper{width:100%;height:100%;position:absolute;left:0;top:0;overflow:hidden}.ngx-gallery-image{background-position:center;background-repeat:no-repeat;height:100%;width:100%;position:absolute;top:0}.ngx-gallery-image.ngx-gallery-active{z-index:1000}.ngx-gallery-image-size-cover .ngx-gallery-image{background-size:cover}.ngx-gallery-image-size-contain .ngx-gallery-image{background-size:contain}.ngx-gallery-animation-fade .ngx-gallery-image{left:0;opacity:0;transition:.5s ease-in-out}.ngx-gallery-animation-fade .ngx-gallery-image.ngx-gallery-active{opacity:1}.ngx-gallery-animation-slide .ngx-gallery-image{transition:.5s ease-in-out}.ngx-gallery-animation-slide .ngx-gallery-image.ngx-gallery-active{left:0}.ngx-gallery-animation-slide .ngx-gallery-image.ngx-gallery-inactive-left{left:-100%}.ngx-gallery-animation-slide .ngx-gallery-image.ngx-gallery-inactive-right{left:100%}.ngx-gallery-animation-rotate .ngx-gallery-image{transition:1s;transform:scale(3.5,3.5) rotate(90deg);left:0;opacity:0}.ngx-gallery-animation-rotate .ngx-gallery-image.ngx-gallery-active{transform:scale(1,1) rotate(0);opacity:1}.ngx-gallery-animation-zoom .ngx-gallery-image{transition:1s;transform:scale(2.5,2.5);left:0;opacity:0}.ngx-gallery-animation-zoom .ngx-gallery-image.ngx-gallery-active{transform:scale(1,1);opacity:1}.ngx-gallery-image-text{width:100%;background:rgba(0,0,0,.7);padding:10px;text-align:center;color:#fff;font-size:16px;position:absolute;bottom:0;z-index:10}"]
            },] }
];
NgxGalleryImageComponent.ctorParameters = () => [
    { type: DomSanitizer },
    { type: ElementRef },
    { type: NgxGalleryHelperService }
];
NgxGalleryImageComponent.propDecorators = {
    images: [{ type: Input }],
    clickable: [{ type: Input }],
    selectedIndex: [{ type: Input }],
    arrows: [{ type: Input }],
    arrowsAutoHide: [{ type: Input }],
    swipe: [{ type: Input }],
    animation: [{ type: Input }],
    size: [{ type: Input }],
    arrowPrevIcon: [{ type: Input }],
    arrowNextIcon: [{ type: Input }],
    autoPlay: [{ type: Input }],
    autoPlayInterval: [{ type: Input }],
    autoPlayPauseOnHover: [{ type: Input }],
    infinityMove: [{ type: Input }],
    lazyLoading: [{ type: Input }],
    actions: [{ type: Input }],
    descriptions: [{ type: Input }],
    showDescription: [{ type: Input }],
    bullets: [{ type: Input }],
    onClick: [{ type: Output }],
    onActiveChange: [{ type: Output }],
    onMouseEnter: [{ type: HostListener, args: ['mouseenter',] }],
    onMouseLeave: [{ type: HostListener, args: ['mouseleave',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktaW1hZ2UuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWdhbGxlcnkvIiwic291cmNlcyI6WyJzcmMvbmd4LWdhbGxlcnktaW1hZ2UuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFHLFVBQVUsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNwSSxPQUFPLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRXBFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBRXZFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBbUJwRSxNQUFNLE9BQU8sd0JBQXdCO0lBNEJqQyxZQUFvQixZQUEwQixFQUNsQyxVQUFzQixFQUFVLGFBQXNDO1FBRDlELGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQ2xDLGVBQVUsR0FBVixVQUFVLENBQVk7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBeUI7UUFSeEUsWUFBTyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDN0IsbUJBQWMsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRTlDLG1CQUFjLEdBQUcsSUFBSSxDQUFDO0lBSytELENBQUM7SUFFdEYsUUFBUTtRQUNKLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3BDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1NBQ3ZCO1FBRUQsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2YsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQ3hCO0lBQ0wsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFzQjtRQUM5QixJQUFJLE9BQU8sQ0FBQyxP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U0FDckU7YUFBTTtZQUNILE9BQU8sS0FBSyxDQUFDO1NBQ2hCO0lBQ0wsQ0FBQztJQUVELFVBQVUsQ0FBQyxLQUFhO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDbEcsQ0FBQzs7O1lBdktpQyxZQUFZO1lBQ3RCLFVBQVU7WUFBeUIsdUJBQXVCOzs7WUE3Q3JGLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsbUJBQW1CO2dCQUM3QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7O0tBV1Q7O2FBRUo7OztZQXRCUSxZQUFZO1lBRDJDLFVBQVU7WUFHakUsdUJBQXVCOzs7cUJBc0IzQixLQUFLO3dCQUNMLEtBQUs7NEJBQ0wsS0FBSztxQkFDTCxLQUFLOzZCQUNMLEtBQUs7b0JBQ0wsS0FBSzt3QkFDTCxLQUFLO21CQUNMLEtBQUs7NEJBQ0wsS0FBSzs0QkFDTCxLQUFLO3VCQUNMLEtBQUs7K0JBQ0wsS0FBSzttQ0FDTCxLQUFLOzJCQUNMLEtBQUs7MEJBQ0wsS0FBSztzQkFDTCxLQUFLOzJCQUNMLEtBQUs7OEJBQ0wsS0FBSztzQkFDTCxLQUFLO3NCQUVMLE1BQU07NkJBQ04sTUFBTTsyQkF5Qk4sWUFBWSxTQUFDLFlBQVk7MkJBVXpCLFlBQVksU0FBQyxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIEhvc3RMaXN0ZW5lciwgIEVsZW1lbnRSZWYsIE9uSW5pdCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIsIFNhZmVTdHlsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuXG5pbXBvcnQgeyBOZ3hHYWxsZXJ5SGVscGVyU2VydmljZSB9IGZyb20gJy4vbmd4LWdhbGxlcnktaGVscGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTmd4R2FsbGVyeU9yZGVyZWRJbWFnZSB9IGZyb20gJy4vbmd4LWdhbGxlcnktb3JkZXJlZC1pbWFnZS5tb2RlbCc7XG5pbXBvcnQgeyBOZ3hHYWxsZXJ5QW5pbWF0aW9uIH0gZnJvbSAnLi9uZ3gtZ2FsbGVyeS1hbmltYXRpb24ubW9kZWwnO1xuaW1wb3J0IHsgTmd4R2FsbGVyeUFjdGlvbiB9IGZyb20gJy4vbmd4LWdhbGxlcnktYWN0aW9uLm1vZGVsJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICduZ3gtZ2FsbGVyeS1pbWFnZScsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBjbGFzcz1cIm5neC1nYWxsZXJ5LWltYWdlLXdyYXBwZXIgbmd4LWdhbGxlcnktYW5pbWF0aW9uLXt7YW5pbWF0aW9ufX0gbmd4LWdhbGxlcnktaW1hZ2Utc2l6ZS17e3NpemV9fVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5neC1nYWxsZXJ5LWltYWdlXCIgKm5nRm9yPVwibGV0IGltYWdlIG9mIGdldEltYWdlcygpOyBsZXQgaSA9IGluZGV4O1wiIFtuZ0NsYXNzXT1cInsgJ25neC1nYWxsZXJ5LWFjdGl2ZSc6IHNlbGVjdGVkSW5kZXggPT0gaW1hZ2UuaW5kZXgsICduZ3gtZ2FsbGVyeS1pbmFjdGl2ZS1sZWZ0Jzogc2VsZWN0ZWRJbmRleCA+IGltYWdlLmluZGV4LCAnbmd4LWdhbGxlcnktaW5hY3RpdmUtcmlnaHQnOiBzZWxlY3RlZEluZGV4IDwgaW1hZ2UuaW5kZXgsICduZ3gtZ2FsbGVyeS1jbGlja2FibGUnOiBjbGlja2FibGUgfVwiIFtzdHlsZS5iYWNrZ3JvdW5kLWltYWdlXT1cImdldFNhZmVVcmwoaW1hZ2Uuc3JjKVwiIChjbGljayk9XCJoYW5kbGVDbGljaygkZXZlbnQsIGltYWdlLmluZGV4KVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJuZ3gtZ2FsbGVyeS1pY29ucy13cmFwcGVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZ3gtZ2FsbGVyeS1hY3Rpb24gKm5nRm9yPVwibGV0IGFjdGlvbiBvZiBhY3Rpb25zXCIgW2ljb25dPVwiYWN0aW9uLmljb25cIiBbZGlzYWJsZWRdPVwiYWN0aW9uLmRpc2FibGVkXCIgW3RpdGxlVGV4dF09XCJhY3Rpb24udGl0bGVUZXh0XCIgKG9uQ2xpY2spPVwiYWN0aW9uLm9uQ2xpY2soJGV2ZW50LCBpbWFnZS5pbmRleClcIj48L25neC1nYWxsZXJ5LWFjdGlvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibmd4LWdhbGxlcnktaW1hZ2UtdGV4dFwiICpuZ0lmPVwic2hvd0Rlc2NyaXB0aW9uICYmIGRlc2NyaXB0aW9uc1tpbWFnZS5pbmRleF1cIiBbaW5uZXJIVE1MXT1cImRlc2NyaXB0aW9uc1tpbWFnZS5pbmRleF1cIiAoY2xpY2spPVwiJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXCI+PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxuZ3gtZ2FsbGVyeS1idWxsZXRzICpuZ0lmPVwiYnVsbGV0c1wiIFtjb3VudF09XCJpbWFnZXMubGVuZ3RoXCIgW2FjdGl2ZV09XCJzZWxlY3RlZEluZGV4XCIgKG9uQ2hhbmdlKT1cInNob3coJGV2ZW50KVwiPjwvbmd4LWdhbGxlcnktYnVsbGV0cz5cbiAgICAgICAgPG5neC1nYWxsZXJ5LWFycm93cyBjbGFzcz1cIm5neC1nYWxsZXJ5LWltYWdlLXNpemUte3tzaXplfX1cIiAqbmdJZj1cImFycm93c1wiIChvblByZXZDbGljayk9XCJzaG93UHJldigpXCIgKG9uTmV4dENsaWNrKT1cInNob3dOZXh0KClcIiBbcHJldkRpc2FibGVkXT1cIiFjYW5TaG93UHJldigpXCIgW25leHREaXNhYmxlZF09XCIhY2FuU2hvd05leHQoKVwiIFthcnJvd1ByZXZJY29uXT1cImFycm93UHJldkljb25cIiBbYXJyb3dOZXh0SWNvbl09XCJhcnJvd05leHRJY29uXCI+PC9uZ3gtZ2FsbGVyeS1hcnJvd3M+XG4gICAgYCxcbiAgICBzdHlsZVVybHM6IFsnLi9uZ3gtZ2FsbGVyeS1pbWFnZS5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIE5neEdhbGxlcnlJbWFnZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcbiAgICBASW5wdXQoKSBpbWFnZXM6IE5neEdhbGxlcnlPcmRlcmVkSW1hZ2VbXTtcbiAgICBASW5wdXQoKSBjbGlja2FibGU6IGJvb2xlYW47XG4gICAgQElucHV0KCkgc2VsZWN0ZWRJbmRleDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIGFycm93czogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBhcnJvd3NBdXRvSGlkZTogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBzd2lwZTogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBhbmltYXRpb246IHN0cmluZztcbiAgICBASW5wdXQoKSBzaXplOiBzdHJpbmc7XG4gICAgQElucHV0KCkgYXJyb3dQcmV2SWNvbjogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGFycm93TmV4dEljb246IHN0cmluZztcbiAgICBASW5wdXQoKSBhdXRvUGxheTogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBhdXRvUGxheUludGVydmFsOiBudW1iZXI7XG4gICAgQElucHV0KCkgYXV0b1BsYXlQYXVzZU9uSG92ZXI6IGJvb2xlYW47XG4gICAgQElucHV0KCkgaW5maW5pdHlNb3ZlOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGxhenlMb2FkaW5nOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGFjdGlvbnM6IE5neEdhbGxlcnlBY3Rpb25bXTtcbiAgICBASW5wdXQoKSBkZXNjcmlwdGlvbnM6IHN0cmluZ1tdO1xuICAgIEBJbnB1dCgpIHNob3dEZXNjcmlwdGlvbjogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBidWxsZXRzOiBib29sZWFuO1xuXG4gICAgQE91dHB1dCgpIG9uQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgQE91dHB1dCgpIG9uQWN0aXZlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgY2FuQ2hhbmdlSW1hZ2UgPSB0cnVlO1xuXG4gICAgcHJpdmF0ZSB0aW1lcjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgc2FuaXRpemF0aW9uOiBEb21TYW5pdGl6ZXIsXG4gICAgICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHJpdmF0ZSBoZWxwZXJTZXJ2aWNlOiBOZ3hHYWxsZXJ5SGVscGVyU2VydmljZSkge31cblxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5hcnJvd3MgJiYgdGhpcy5hcnJvd3NBdXRvSGlkZSkge1xuICAgICAgICAgICAgdGhpcy5hcnJvd3MgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmF1dG9QbGF5KSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0QXV0b1BsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICAgICAgaWYgKGNoYW5nZXNbJ3N3aXBlJ10pIHtcbiAgICAgICAgICAgIHRoaXMuaGVscGVyU2VydmljZS5tYW5hZ2VTd2lwZSh0aGlzLnN3aXBlLCB0aGlzLmVsZW1lbnRSZWYsICdpbWFnZScsICgpID0+IHRoaXMuc2hvd05leHQoKSwgKCkgPT4gdGhpcy5zaG93UHJldigpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ21vdXNlZW50ZXInKSBvbk1vdXNlRW50ZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLmFycm93c0F1dG9IaWRlICYmICF0aGlzLmFycm93cykge1xuICAgICAgICAgICAgdGhpcy5hcnJvd3MgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYXV0b1BsYXkgJiYgdGhpcy5hdXRvUGxheVBhdXNlT25Ib3Zlcikge1xuICAgICAgICAgICAgdGhpcy5zdG9wQXV0b1BsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ21vdXNlbGVhdmUnKSBvbk1vdXNlTGVhdmUoKSB7XG4gICAgICAgIGlmICh0aGlzLmFycm93c0F1dG9IaWRlICYmIHRoaXMuYXJyb3dzKSB7XG4gICAgICAgICAgICB0aGlzLmFycm93cyA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYXV0b1BsYXkgJiYgdGhpcy5hdXRvUGxheVBhdXNlT25Ib3Zlcikge1xuICAgICAgICAgICAgdGhpcy5zdGFydEF1dG9QbGF5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXNldChpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IGluZGV4O1xuICAgIH1cblxuICAgIGdldEltYWdlcygpOiBOZ3hHYWxsZXJ5T3JkZXJlZEltYWdlW10ge1xuICAgICAgICBpZiAoIXRoaXMuaW1hZ2VzKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5sYXp5TG9hZGluZykge1xuICAgICAgICAgICAgbGV0IGluZGV4ZXMgPSBbdGhpcy5zZWxlY3RlZEluZGV4XTtcbiAgICAgICAgICAgIGxldCBwcmV2SW5kZXggPSB0aGlzLnNlbGVjdGVkSW5kZXggLSAxO1xuXG4gICAgICAgICAgICBpZiAocHJldkluZGV4ID09PSAtMSAmJiB0aGlzLmluZmluaXR5TW92ZSkge1xuICAgICAgICAgICAgICAgIGluZGV4ZXMucHVzaCh0aGlzLmltYWdlcy5sZW5ndGggLSAxKVxuICAgICAgICAgICAgfSBlbHNlIGlmIChwcmV2SW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICAgIGluZGV4ZXMucHVzaChwcmV2SW5kZXgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgbmV4dEluZGV4ID0gdGhpcy5zZWxlY3RlZEluZGV4ICsgMTtcblxuICAgICAgICAgICAgaWYgKG5leHRJbmRleCA9PSB0aGlzLmltYWdlcy5sZW5ndGggJiYgdGhpcy5pbmZpbml0eU1vdmUpIHtcbiAgICAgICAgICAgICAgICBpbmRleGVzLnB1c2goMCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5leHRJbmRleCA8IHRoaXMuaW1hZ2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGluZGV4ZXMucHVzaChuZXh0SW5kZXgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbWFnZXMuZmlsdGVyKChpbWcsIGkpID0+IGluZGV4ZXMuaW5kZXhPZihpKSAhPSAtMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbWFnZXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGFydEF1dG9QbGF5KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnN0b3BBdXRvUGxheSgpO1xuXG4gICAgICAgIHRoaXMudGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuc2hvd05leHQoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IC0xO1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd05leHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcy5hdXRvUGxheUludGVydmFsKTtcbiAgICB9XG5cbiAgICBzdG9wQXV0b1BsYXkoKSB7XG4gICAgICAgIGlmICh0aGlzLnRpbWVyKSB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlQ2xpY2soZXZlbnQ6IEV2ZW50LCBpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmNsaWNrYWJsZSkge1xuICAgICAgICAgICAgdGhpcy5vbkNsaWNrLmVtaXQoaW5kZXgpO1xuXG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG93KGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gaW5kZXg7XG4gICAgICAgIHRoaXMub25BY3RpdmVDaGFuZ2UuZW1pdCh0aGlzLnNlbGVjdGVkSW5kZXgpO1xuICAgICAgICB0aGlzLnNldENoYW5nZVRpbWVvdXQoKTtcbiAgICB9XG5cbiAgICBzaG93TmV4dCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuY2FuU2hvd05leHQoKSAmJiB0aGlzLmNhbkNoYW5nZUltYWdlKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXgrKztcblxuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJbmRleCA9PT0gdGhpcy5pbWFnZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5vbkFjdGl2ZUNoYW5nZS5lbWl0KHRoaXMuc2VsZWN0ZWRJbmRleCk7XG4gICAgICAgICAgICB0aGlzLnNldENoYW5nZVRpbWVvdXQoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG93UHJldigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuY2FuU2hvd1ByZXYoKSAmJiB0aGlzLmNhbkNoYW5nZUltYWdlKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXgtLTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJbmRleCA8IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSB0aGlzLmltYWdlcy5sZW5ndGggLSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm9uQWN0aXZlQ2hhbmdlLmVtaXQodGhpcy5zZWxlY3RlZEluZGV4KTtcbiAgICAgICAgICAgIHRoaXMuc2V0Q2hhbmdlVGltZW91dCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q2hhbmdlVGltZW91dCgpIHtcbiAgICAgICAgdGhpcy5jYW5DaGFuZ2VJbWFnZSA9IGZhbHNlO1xuICAgICAgICBsZXQgdGltZW91dCA9IDEwMDA7XG5cbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uID09PSBOZ3hHYWxsZXJ5QW5pbWF0aW9uLlNsaWRlXG4gICAgICAgICAgICB8fCB0aGlzLmFuaW1hdGlvbiA9PT0gTmd4R2FsbGVyeUFuaW1hdGlvbi5GYWRlKSB7XG4gICAgICAgICAgICAgICAgdGltZW91dCA9IDUwMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jYW5DaGFuZ2VJbWFnZSA9IHRydWU7XG4gICAgICAgIH0sIHRpbWVvdXQpO1xuICAgIH1cblxuICAgIGNhblNob3dOZXh0KCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5pbWFnZXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmluZmluaXR5TW92ZSB8fCB0aGlzLnNlbGVjdGVkSW5kZXggPCB0aGlzLmltYWdlcy5sZW5ndGggLSAxXG4gICAgICAgICAgICAgICAgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjYW5TaG93UHJldigpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2VzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbmZpbml0eU1vdmUgfHwgdGhpcy5zZWxlY3RlZEluZGV4ID4gMCA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFNhZmVVcmwoaW1hZ2U6IHN0cmluZyk6IFNhZmVTdHlsZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNhbml0aXphdGlvbi5ieXBhc3NTZWN1cml0eVRydXN0U3R5bGUodGhpcy5oZWxwZXJTZXJ2aWNlLmdldEJhY2tncm91bmRVcmwoaW1hZ2UpKTtcbiAgICB9XG59XG4iXX0=