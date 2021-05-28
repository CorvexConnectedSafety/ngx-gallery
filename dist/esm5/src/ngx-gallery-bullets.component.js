import { Component, Input, Output, EventEmitter, } from '@angular/core';
var NgxGalleryBulletsComponent = /** @class */ (function () {
    function NgxGalleryBulletsComponent() {
        this.active = 0;
        this.onChange = new EventEmitter();
    }
    NgxGalleryBulletsComponent.prototype.getBullets = function () {
        return Array(this.count);
    };
    NgxGalleryBulletsComponent.prototype.handleChange = function (event, index) {
        this.onChange.emit(index);
    };
    NgxGalleryBulletsComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-gallery-bullets',
                    template: "\n        <div class=\"ngx-gallery-bullet\" *ngFor=\"let bullet of getBullets(); let i = index;\" (click)=\"handleChange($event, i)\" [ngClass]=\"{ 'ngx-gallery-active': i == active }\"></div>\n    ",
                    styles: [":host{position:absolute;z-index:2000;display:inline-flex;left:50%;transform:translateX(-50%);bottom:0;padding:10px}.ngx-gallery-bullet{width:10px;height:10px;border-radius:50%;cursor:pointer;background:#fff}.ngx-gallery-bullet:not(:first-child){margin-left:5px}.ngx-gallery-bullet.ngx-gallery-active,.ngx-gallery-bullet:hover{background:#000}"]
                },] }
    ];
    NgxGalleryBulletsComponent.propDecorators = {
        count: [{ type: Input }],
        active: [{ type: Input }],
        onChange: [{ type: Output }]
    };
    return NgxGalleryBulletsComponent;
}());
export { NgxGalleryBulletsComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktYnVsbGV0cy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZ2FsbGVyeS8iLCJzb3VyY2VzIjpbInNyYy9uZ3gtZ2FsbGVyeS1idWxsZXRzLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxHQUFHLE1BQU0sZUFBZSxDQUFDO0FBRXhFO0lBQUE7UUFTYSxXQUFNLEdBQVcsQ0FBQyxDQUFDO1FBRWxCLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBUzVDLENBQUM7SUFQRywrQ0FBVSxHQUFWO1FBQ0ksT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCxpREFBWSxHQUFaLFVBQWEsS0FBWSxFQUFFLEtBQWE7UUFDcEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUIsQ0FBQzs7Z0JBbkJKLFNBQVMsU0FBQztvQkFDUCxRQUFRLEVBQUUscUJBQXFCO29CQUMvQixRQUFRLEVBQUUsd01BRVQ7O2lCQUVKOzs7d0JBRUksS0FBSzt5QkFDTCxLQUFLOzJCQUVMLE1BQU07O0lBU1gsaUNBQUM7Q0FBQSxBQXBCRCxJQW9CQztTQWJZLDBCQUEwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ25neC1nYWxsZXJ5LWJ1bGxldHMnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJuZ3gtZ2FsbGVyeS1idWxsZXRcIiAqbmdGb3I9XCJsZXQgYnVsbGV0IG9mIGdldEJ1bGxldHMoKTsgbGV0IGkgPSBpbmRleDtcIiAoY2xpY2spPVwiaGFuZGxlQ2hhbmdlKCRldmVudCwgaSlcIiBbbmdDbGFzc109XCJ7ICduZ3gtZ2FsbGVyeS1hY3RpdmUnOiBpID09IGFjdGl2ZSB9XCI+PC9kaXY+XG4gICAgYCxcbiAgICBzdHlsZVVybHM6IFsnLi9uZ3gtZ2FsbGVyeS1idWxsZXRzLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTmd4R2FsbGVyeUJ1bGxldHNDb21wb25lbnQge1xuICAgIEBJbnB1dCgpIGNvdW50OiBudW1iZXI7XG4gICAgQElucHV0KCkgYWN0aXZlOiBudW1iZXIgPSAwO1xuXG4gICAgQE91dHB1dCgpIG9uQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgZ2V0QnVsbGV0cygpOiBudW1iZXJbXSB7XG4gICAgICAgIHJldHVybiBBcnJheSh0aGlzLmNvdW50KTtcbiAgICB9XG5cbiAgICBoYW5kbGVDaGFuZ2UoZXZlbnQ6IEV2ZW50LCBpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25DaGFuZ2UuZW1pdChpbmRleCk7XG4gICAgfVxufVxuIl19