import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
var NgxGalleryActionComponent = /** @class */ (function () {
    function NgxGalleryActionComponent() {
        this.disabled = false;
        this.titleText = '';
        this.onClick = new EventEmitter();
    }
    NgxGalleryActionComponent.prototype.handleClick = function (event) {
        if (!this.disabled) {
            this.onClick.emit(event);
        }
        event.stopPropagation();
        event.preventDefault();
    };
    NgxGalleryActionComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-gallery-action',
                    template: "\n        <div class=\"ngx-gallery-icon\" [class.ngx-gallery-icon-disabled]=\"disabled\"\n            aria-hidden=\"true\"\n            title=\"{{ titleText }}\"\n            (click)=\"handleClick($event)\">\n                <i class=\"ngx-gallery-icon-content {{ icon }}\"></i>\n        </div>",
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] }
    ];
    NgxGalleryActionComponent.propDecorators = {
        icon: [{ type: Input }],
        disabled: [{ type: Input }],
        titleText: [{ type: Input }],
        onClick: [{ type: Output }]
    };
    return NgxGalleryActionComponent;
}());
export { NgxGalleryActionComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktYWN0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1nYWxsZXJ5LyIsInNvdXJjZXMiOlsic3JjL25neC1nYWxsZXJ5LWFjdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVoRztJQUFBO1FBYWEsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUNqQixjQUFTLEdBQUcsRUFBRSxDQUFDO1FBRWQsWUFBTyxHQUF3QixJQUFJLFlBQVksRUFBRSxDQUFDO0lBVWhFLENBQUM7SUFSRywrQ0FBVyxHQUFYLFVBQVksS0FBWTtRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM1QjtRQUVELEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN4QixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDM0IsQ0FBQzs7Z0JBekJKLFNBQVMsU0FBQztvQkFDUCxRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixRQUFRLEVBQUUsd1NBTUM7b0JBQ1gsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07aUJBQ2xEOzs7dUJBRUksS0FBSzsyQkFDTCxLQUFLOzRCQUNMLEtBQUs7MEJBRUwsTUFBTTs7SUFVWCxnQ0FBQztDQUFBLEFBMUJELElBMEJDO1NBZlkseUJBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnbmd4LWdhbGxlcnktYWN0aW9uJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IGNsYXNzPVwibmd4LWdhbGxlcnktaWNvblwiIFtjbGFzcy5uZ3gtZ2FsbGVyeS1pY29uLWRpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgICB0aXRsZT1cInt7IHRpdGxlVGV4dCB9fVwiXG4gICAgICAgICAgICAoY2xpY2spPVwiaGFuZGxlQ2xpY2soJGV2ZW50KVwiPlxuICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwibmd4LWdhbGxlcnktaWNvbi1jb250ZW50IHt7IGljb24gfX1cIj48L2k+XG4gICAgICAgIDwvZGl2PmAsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgTmd4R2FsbGVyeUFjdGlvbkNvbXBvbmVudCB7XG4gICAgQElucHV0KCkgaWNvbjogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRpc2FibGVkID0gZmFsc2U7XG4gICAgQElucHV0KCkgdGl0bGVUZXh0ID0gJyc7XG5cbiAgICBAT3V0cHV0KCkgb25DbGljazogRXZlbnRFbWl0dGVyPEV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIGhhbmRsZUNsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMub25DbGljay5lbWl0KGV2ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbn1cbiJdfQ==