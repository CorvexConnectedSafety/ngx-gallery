import { Injectable, ElementRef, Renderer2 } from '@angular/core';
var NgxGalleryHelperService = /** @class */ (function () {
    function NgxGalleryHelperService(renderer) {
        this.renderer = renderer;
        this.swipeHandlers = new Map();
    }
    NgxGalleryHelperService.prototype.manageSwipe = function (status, element, id, nextHandler, prevHandler) {
        var handlers = this.getSwipeHandlers(id);
        // swipeleft and swiperight are available only if hammerjs is included
        try {
            if (status && !handlers) {
                this.swipeHandlers.set(id, [
                    this.renderer.listen(element.nativeElement, 'swipeleft', function () { return nextHandler(); }),
                    this.renderer.listen(element.nativeElement, 'swiperight', function () { return prevHandler(); })
                ]);
            }
            else if (!status && handlers) {
                handlers.map(function (handler) { return handler(); });
                this.removeSwipeHandlers(id);
            }
        }
        catch (e) { }
    };
    NgxGalleryHelperService.prototype.validateUrl = function (url) {
        if (url.replace) {
            return url.replace(new RegExp(' ', 'g'), '%20')
                .replace(new RegExp('\'', 'g'), '%27');
        }
        else {
            return url;
        }
    };
    NgxGalleryHelperService.prototype.getBackgroundUrl = function (image) {
        return 'url(\'' + this.validateUrl(image) + '\')';
    };
    NgxGalleryHelperService.prototype.getSwipeHandlers = function (id) {
        return this.swipeHandlers.get(id);
    };
    NgxGalleryHelperService.prototype.removeSwipeHandlers = function (id) {
        this.swipeHandlers.delete(id);
    };
    NgxGalleryHelperService.ctorParameters = function () { return [
        { type: Renderer2 }
    ]; };
    NgxGalleryHelperService.decorators = [
        { type: Injectable }
    ];
    NgxGalleryHelperService.ctorParameters = function () { return [
        { type: Renderer2 }
    ]; };
    return NgxGalleryHelperService;
}());
export { NgxGalleryHelperService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktaGVscGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZ2FsbGVyeS8iLCJzb3VyY2VzIjpbInNyYy9uZ3gtZ2FsbGVyeS1oZWxwZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFbEU7SUFLSSxpQ0FBb0IsUUFBbUI7UUFBbkIsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUYvQixrQkFBYSxHQUE0QixJQUFJLEdBQUcsRUFBc0IsQ0FBQztJQUVyQyxDQUFDO0lBRTNDLDZDQUFXLEdBQVgsVUFBWSxNQUFlLEVBQUUsT0FBbUIsRUFBRSxFQUFVLEVBQUUsV0FBcUIsRUFBRSxXQUFxQjtRQUV0RyxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFM0Msc0VBQXNFO1FBQ3RFLElBQUk7WUFDQSxJQUFJLE1BQU0sSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDckIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFO29CQUN2QixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSxjQUFNLE9BQUEsV0FBVyxFQUFFLEVBQWIsQ0FBYSxDQUFDO29CQUM3RSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLFlBQVksRUFBRSxjQUFNLE9BQUEsV0FBVyxFQUFFLEVBQWIsQ0FBYSxDQUFDO2lCQUNqRixDQUFDLENBQUM7YUFDTjtpQkFBTSxJQUFJLENBQUMsTUFBTSxJQUFJLFFBQVEsRUFBRTtnQkFDNUIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFDLE9BQU8sSUFBSyxPQUFBLE9BQU8sRUFBRSxFQUFULENBQVMsQ0FBQyxDQUFDO2dCQUNyQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDaEM7U0FDSjtRQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUU7SUFDbEIsQ0FBQztJQUVELDZDQUFXLEdBQVgsVUFBWSxHQUFXO1FBQ25CLElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRTtZQUNiLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDO2lCQUMxQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzlDO2FBQU07WUFDSCxPQUFPLEdBQUcsQ0FBQztTQUNkO0lBQ0wsQ0FBQztJQUVELGtEQUFnQixHQUFoQixVQUFpQixLQUFhO1FBQzFCLE9BQU8sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQ3RELENBQUM7SUFFTyxrREFBZ0IsR0FBeEIsVUFBeUIsRUFBVTtRQUMvQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFTyxxREFBbUIsR0FBM0IsVUFBNEIsRUFBVTtRQUNsQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNsQyxDQUFDOztnQkF2QzZCLFNBQVM7OztnQkFMMUMsVUFBVTs7O2dCQUZzQixTQUFTOztJQStDMUMsOEJBQUM7Q0FBQSxBQTdDRCxJQTZDQztTQTVDWSx1QkFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBFbGVtZW50UmVmLCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE5neEdhbGxlcnlIZWxwZXJTZXJ2aWNlIHtcblxuICAgIHByaXZhdGUgc3dpcGVIYW5kbGVyczogTWFwPHN0cmluZywgRnVuY3Rpb25bXT4gPSBuZXcgTWFwPHN0cmluZywgRnVuY3Rpb25bXT4oKTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMikge31cblxuICAgIG1hbmFnZVN3aXBlKHN0YXR1czogYm9vbGVhbiwgZWxlbWVudDogRWxlbWVudFJlZiwgaWQ6IHN0cmluZywgbmV4dEhhbmRsZXI6IEZ1bmN0aW9uLCBwcmV2SGFuZGxlcjogRnVuY3Rpb24pOiB2b2lkIHtcblxuICAgICAgICBjb25zdCBoYW5kbGVycyA9IHRoaXMuZ2V0U3dpcGVIYW5kbGVycyhpZCk7XG5cbiAgICAgICAgLy8gc3dpcGVsZWZ0IGFuZCBzd2lwZXJpZ2h0IGFyZSBhdmFpbGFibGUgb25seSBpZiBoYW1tZXJqcyBpcyBpbmNsdWRlZFxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHN0YXR1cyAmJiAhaGFuZGxlcnMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN3aXBlSGFuZGxlcnMuc2V0KGlkLCBbXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKGVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ3N3aXBlbGVmdCcsICgpID0+IG5leHRIYW5kbGVyKCkpLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmxpc3RlbihlbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdzd2lwZXJpZ2h0JywgKCkgPT4gcHJldkhhbmRsZXIoKSlcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXN0YXR1cyAmJiBoYW5kbGVycykge1xuICAgICAgICAgICAgICAgIGhhbmRsZXJzLm1hcCgoaGFuZGxlcikgPT4gaGFuZGxlcigpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZVN3aXBlSGFuZGxlcnMoaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH1cblxuICAgIHZhbGlkYXRlVXJsKHVybDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHVybC5yZXBsYWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdXJsLnJlcGxhY2UobmV3IFJlZ0V4cCgnICcsICdnJyksICclMjAnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcJycsICdnJyksICclMjcnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB1cmw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRCYWNrZ3JvdW5kVXJsKGltYWdlOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuICd1cmwoXFwnJyArIHRoaXMudmFsaWRhdGVVcmwoaW1hZ2UpICsgJ1xcJyknO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0U3dpcGVIYW5kbGVycyhpZDogc3RyaW5nKTogRnVuY3Rpb25bXSB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLnN3aXBlSGFuZGxlcnMuZ2V0KGlkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlbW92ZVN3aXBlSGFuZGxlcnMoaWQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLnN3aXBlSGFuZGxlcnMuZGVsZXRlKGlkKTtcbiAgICB9XG59XG4iXX0=