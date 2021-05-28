import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
export class NgxGalleryActionComponent {
    constructor() {
        this.disabled = false;
        this.titleText = '';
        this.onClick = new EventEmitter();
    }
    handleClick(event) {
        if (!this.disabled) {
            this.onClick.emit(event);
        }
        event.stopPropagation();
        event.preventDefault();
    }
}
NgxGalleryActionComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-gallery-action',
                template: `
        <div class="ngx-gallery-icon" [class.ngx-gallery-icon-disabled]="disabled"
            aria-hidden="true"
            title="{{ titleText }}"
            (click)="handleClick($event)">
                <i class="ngx-gallery-icon-content {{ icon }}"></i>
        </div>`,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
NgxGalleryActionComponent.propDecorators = {
    icon: [{ type: Input }],
    disabled: [{ type: Input }],
    titleText: [{ type: Input }],
    onClick: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktYWN0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1nYWxsZXJ5LyIsInNvdXJjZXMiOlsic3JjL25neC1nYWxsZXJ5LWFjdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQWFoRyxNQUFNLE9BQU8seUJBQXlCO0lBWHRDO1FBYWEsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUNqQixjQUFTLEdBQUcsRUFBRSxDQUFDO1FBRWQsWUFBTyxHQUF3QixJQUFJLFlBQVksRUFBRSxDQUFDO0lBVWhFLENBQUM7SUFSRyxXQUFXLENBQUMsS0FBWTtRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM1QjtRQUVELEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN4QixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDM0IsQ0FBQzs7O1lBekJKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5QixRQUFRLEVBQUU7Ozs7OztlQU1DO2dCQUNYLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2FBQ2xEOzs7bUJBRUksS0FBSzt1QkFDTCxLQUFLO3dCQUNMLEtBQUs7c0JBRUwsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ25neC1nYWxsZXJ5LWFjdGlvbicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBjbGFzcz1cIm5neC1nYWxsZXJ5LWljb25cIiBbY2xhc3Mubmd4LWdhbGxlcnktaWNvbi1kaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgdGl0bGU9XCJ7eyB0aXRsZVRleHQgfX1cIlxuICAgICAgICAgICAgKGNsaWNrKT1cImhhbmRsZUNsaWNrKCRldmVudClcIj5cbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cIm5neC1nYWxsZXJ5LWljb24tY29udGVudCB7eyBpY29uIH19XCI+PC9pPlxuICAgICAgICA8L2Rpdj5gLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIE5neEdhbGxlcnlBY3Rpb25Db21wb25lbnQge1xuICAgIEBJbnB1dCgpIGljb246IHN0cmluZztcbiAgICBASW5wdXQoKSBkaXNhYmxlZCA9IGZhbHNlO1xuICAgIEBJbnB1dCgpIHRpdGxlVGV4dCA9ICcnO1xuXG4gICAgQE91dHB1dCgpIG9uQ2xpY2s6IEV2ZW50RW1pdHRlcjxFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBoYW5kbGVDbGljayhldmVudDogRXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLm9uQ2xpY2suZW1pdChldmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG59XG4iXX0=