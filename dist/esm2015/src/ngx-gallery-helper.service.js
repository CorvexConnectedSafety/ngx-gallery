import { Injectable, ElementRef, Renderer2 } from '@angular/core';
export class NgxGalleryHelperService {
    constructor(renderer) {
        this.renderer = renderer;
        this.swipeHandlers = new Map();
    }
    manageSwipe(status, element, id, nextHandler, prevHandler) {
        const handlers = this.getSwipeHandlers(id);
        // swipeleft and swiperight are available only if hammerjs is included
        try {
            if (status && !handlers) {
                this.swipeHandlers.set(id, [
                    this.renderer.listen(element.nativeElement, 'swipeleft', () => nextHandler()),
                    this.renderer.listen(element.nativeElement, 'swiperight', () => prevHandler())
                ]);
            }
            else if (!status && handlers) {
                handlers.map((handler) => handler());
                this.removeSwipeHandlers(id);
            }
        }
        catch (e) { }
    }
    validateUrl(url) {
        if (url.replace) {
            return url.replace(new RegExp(' ', 'g'), '%20')
                .replace(new RegExp('\'', 'g'), '%27');
        }
        else {
            return url;
        }
    }
    getBackgroundUrl(image) {
        return 'url(\'' + this.validateUrl(image) + '\')';
    }
    getSwipeHandlers(id) {
        return this.swipeHandlers.get(id);
    }
    removeSwipeHandlers(id) {
        this.swipeHandlers.delete(id);
    }
}
NgxGalleryHelperService.ctorParameters = () => [
    { type: Renderer2 }
];
NgxGalleryHelperService.decorators = [
    { type: Injectable }
];
NgxGalleryHelperService.ctorParameters = () => [
    { type: Renderer2 }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktaGVscGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZ2FsbGVyeS8iLCJzb3VyY2VzIjpbInNyYy9uZ3gtZ2FsbGVyeS1oZWxwZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHbEUsTUFBTSxPQUFPLHVCQUF1QjtJQUloQyxZQUFvQixRQUFtQjtRQUFuQixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBRi9CLGtCQUFhLEdBQTRCLElBQUksR0FBRyxFQUFzQixDQUFDO0lBRXJDLENBQUM7SUFFM0MsV0FBVyxDQUFDLE1BQWUsRUFBRSxPQUFtQixFQUFFLEVBQVUsRUFBRSxXQUFxQixFQUFFLFdBQXFCO1FBRXRHLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUUzQyxzRUFBc0U7UUFDdEUsSUFBSTtZQUNBLElBQUksTUFBTSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNyQixJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUU7b0JBQ3ZCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUM3RSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLFlBQVksRUFBRSxHQUFHLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztpQkFDakYsQ0FBQyxDQUFDO2FBQ047aUJBQU0sSUFBSSxDQUFDLE1BQU0sSUFBSSxRQUFRLEVBQUU7Z0JBQzVCLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUNoQztTQUNKO1FBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRTtJQUNsQixDQUFDO0lBRUQsV0FBVyxDQUFDLEdBQVc7UUFDbkIsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFO1lBQ2IsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUM7aUJBQzFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDOUM7YUFBTTtZQUNILE9BQU8sR0FBRyxDQUFDO1NBQ2Q7SUFDTCxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsS0FBYTtRQUMxQixPQUFPLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQztJQUN0RCxDQUFDO0lBRU8sZ0JBQWdCLENBQUMsRUFBVTtRQUMvQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFTyxtQkFBbUIsQ0FBQyxFQUFVO1FBQ2xDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7OztZQXZDNkIsU0FBUzs7O1lBTDFDLFVBQVU7OztZQUZzQixTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgRWxlbWVudFJlZiwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBOZ3hHYWxsZXJ5SGVscGVyU2VydmljZSB7XG5cbiAgICBwcml2YXRlIHN3aXBlSGFuZGxlcnM6IE1hcDxzdHJpbmcsIEZ1bmN0aW9uW10+ID0gbmV3IE1hcDxzdHJpbmcsIEZ1bmN0aW9uW10+KCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHt9XG5cbiAgICBtYW5hZ2VTd2lwZShzdGF0dXM6IGJvb2xlYW4sIGVsZW1lbnQ6IEVsZW1lbnRSZWYsIGlkOiBzdHJpbmcsIG5leHRIYW5kbGVyOiBGdW5jdGlvbiwgcHJldkhhbmRsZXI6IEZ1bmN0aW9uKTogdm9pZCB7XG5cbiAgICAgICAgY29uc3QgaGFuZGxlcnMgPSB0aGlzLmdldFN3aXBlSGFuZGxlcnMoaWQpO1xuXG4gICAgICAgIC8vIHN3aXBlbGVmdCBhbmQgc3dpcGVyaWdodCBhcmUgYXZhaWxhYmxlIG9ubHkgaWYgaGFtbWVyanMgaXMgaW5jbHVkZWRcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChzdGF0dXMgJiYgIWhhbmRsZXJzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zd2lwZUhhbmRsZXJzLnNldChpZCwgW1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmxpc3RlbihlbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdzd2lwZWxlZnQnLCAoKSA9PiBuZXh0SGFuZGxlcigpKSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4oZWxlbWVudC5uYXRpdmVFbGVtZW50LCAnc3dpcGVyaWdodCcsICgpID0+IHByZXZIYW5kbGVyKCkpXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzdGF0dXMgJiYgaGFuZGxlcnMpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVycy5tYXAoKGhhbmRsZXIpID0+IGhhbmRsZXIoKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVTd2lwZUhhbmRsZXJzKGlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9XG5cbiAgICB2YWxpZGF0ZVVybCh1cmw6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmICh1cmwucmVwbGFjZSkge1xuICAgICAgICAgICAgcmV0dXJuIHVybC5yZXBsYWNlKG5ldyBSZWdFeHAoJyAnLCAnZycpLCAnJTIwJylcbiAgICAgICAgICAgICAgICAucmVwbGFjZShuZXcgUmVnRXhwKCdcXCcnLCAnZycpLCAnJTI3Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdXJsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0QmFja2dyb3VuZFVybChpbWFnZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiAndXJsKFxcJycgKyB0aGlzLnZhbGlkYXRlVXJsKGltYWdlKSArICdcXCcpJztcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFN3aXBlSGFuZGxlcnMoaWQ6IHN0cmluZyk6IEZ1bmN0aW9uW10gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5zd2lwZUhhbmRsZXJzLmdldChpZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW1vdmVTd2lwZUhhbmRsZXJzKGlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zd2lwZUhhbmRsZXJzLmRlbGV0ZShpZCk7XG4gICAgfVxufVxuIl19