import { Component, Input, Output, EventEmitter, } from '@angular/core';
var NgxGalleryArrowsComponent = /** @class */ (function () {
    function NgxGalleryArrowsComponent() {
        this.onPrevClick = new EventEmitter();
        this.onNextClick = new EventEmitter();
    }
    NgxGalleryArrowsComponent.prototype.handlePrevClick = function () {
        this.onPrevClick.emit();
    };
    NgxGalleryArrowsComponent.prototype.handleNextClick = function () {
        this.onNextClick.emit();
    };
    NgxGalleryArrowsComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-gallery-arrows',
                    template: "\n        <div class=\"ngx-gallery-arrow-wrapper ngx-gallery-arrow-left\">\n            <div class=\"ngx-gallery-icon ngx-gallery-arrow\" aria-hidden=\"true\" (click)=\"handlePrevClick()\" [class.ngx-gallery-disabled]=\"prevDisabled\">\n                <i class=\"ngx-gallery-icon-content {{arrowPrevIcon}}\"></i>\n            </div>\n        </div>\n        <div class=\"ngx-gallery-arrow-wrapper ngx-gallery-arrow-right\">\n            <div class=\"ngx-gallery-icon ngx-gallery-arrow\" aria-hidden=\"true\" (click)=\"handleNextClick()\" [class.ngx-gallery-disabled]=\"nextDisabled\">\n                <i class=\"ngx-gallery-icon-content {{arrowNextIcon}}\"></i>\n            </div>\n        </div>\n    ",
                    styles: [".ngx-gallery-arrow-wrapper{position:absolute;height:100%;width:1px;display:table;z-index:2000;table-layout:fixed}.ngx-gallery-arrow-left{left:0}.ngx-gallery-arrow-right{right:0}.ngx-gallery-arrow{top:50%;transform:translateY(-50%);cursor:pointer}.ngx-gallery-arrow.ngx-gallery-disabled{opacity:.6;cursor:default}.ngx-gallery-arrow-left .ngx-gallery-arrow{left:10px}.ngx-gallery-arrow-right .ngx-gallery-arrow{right:10px}"]
                },] }
    ];
    NgxGalleryArrowsComponent.propDecorators = {
        prevDisabled: [{ type: Input }],
        nextDisabled: [{ type: Input }],
        arrowPrevIcon: [{ type: Input }],
        arrowNextIcon: [{ type: Input }],
        onPrevClick: [{ type: Output }],
        onNextClick: [{ type: Output }]
    };
    return NgxGalleryArrowsComponent;
}());
export { NgxGalleryArrowsComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktYXJyb3dzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1nYWxsZXJ5LyIsInNvdXJjZXMiOlsic3JjL25neC1nYWxsZXJ5LWFycm93cy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksR0FBRyxNQUFNLGVBQWUsQ0FBQztBQUV4RTtJQUFBO1FBc0JjLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNqQyxnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFTL0MsQ0FBQztJQVBHLG1EQUFlLEdBQWY7UUFDSSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFFRCxtREFBZSxHQUFmO1FBQ0ksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM1QixDQUFDOztnQkEvQkosU0FBUyxTQUFDO29CQUNQLFFBQVEsRUFBRSxvQkFBb0I7b0JBQzlCLFFBQVEsRUFBRSxtc0JBV1Q7O2lCQUVKOzs7K0JBRUksS0FBSzsrQkFDTCxLQUFLO2dDQUNMLEtBQUs7Z0NBQ0wsS0FBSzs4QkFFTCxNQUFNOzhCQUNOLE1BQU07O0lBU1gsZ0NBQUM7Q0FBQSxBQWhDRCxJQWdDQztTQWhCWSx5QkFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICduZ3gtZ2FsbGVyeS1hcnJvd3MnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJuZ3gtZ2FsbGVyeS1hcnJvdy13cmFwcGVyIG5neC1nYWxsZXJ5LWFycm93LWxlZnRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJuZ3gtZ2FsbGVyeS1pY29uIG5neC1nYWxsZXJ5LWFycm93XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgKGNsaWNrKT1cImhhbmRsZVByZXZDbGljaygpXCIgW2NsYXNzLm5neC1nYWxsZXJ5LWRpc2FibGVkXT1cInByZXZEaXNhYmxlZFwiPlxuICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwibmd4LWdhbGxlcnktaWNvbi1jb250ZW50IHt7YXJyb3dQcmV2SWNvbn19XCI+PC9pPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwibmd4LWdhbGxlcnktYXJyb3ctd3JhcHBlciBuZ3gtZ2FsbGVyeS1hcnJvdy1yaWdodFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5neC1nYWxsZXJ5LWljb24gbmd4LWdhbGxlcnktYXJyb3dcIiBhcmlhLWhpZGRlbj1cInRydWVcIiAoY2xpY2spPVwiaGFuZGxlTmV4dENsaWNrKClcIiBbY2xhc3Mubmd4LWdhbGxlcnktZGlzYWJsZWRdPVwibmV4dERpc2FibGVkXCI+XG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJuZ3gtZ2FsbGVyeS1pY29uLWNvbnRlbnQge3thcnJvd05leHRJY29ufX1cIj48L2k+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBzdHlsZVVybHM6IFsnLi9uZ3gtZ2FsbGVyeS1hcnJvd3MuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hHYWxsZXJ5QXJyb3dzQ29tcG9uZW50IHtcbiAgICBASW5wdXQoKSBwcmV2RGlzYWJsZWQ6IGJvb2xlYW47XG4gICAgQElucHV0KCkgbmV4dERpc2FibGVkOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGFycm93UHJldkljb246IHN0cmluZztcbiAgICBASW5wdXQoKSBhcnJvd05leHRJY29uOiBzdHJpbmc7XG5cbiAgICBAT3V0cHV0KCkgb25QcmV2Q2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgQE91dHB1dCgpIG9uTmV4dENsaWNrID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgaGFuZGxlUHJldkNsaWNrKCk6IHZvaWQge1xuICAgICAgICB0aGlzLm9uUHJldkNsaWNrLmVtaXQoKTtcbiAgICB9XG5cbiAgICBoYW5kbGVOZXh0Q2xpY2soKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25OZXh0Q2xpY2suZW1pdCgpO1xuICAgIH1cbn1cbiJdfQ==