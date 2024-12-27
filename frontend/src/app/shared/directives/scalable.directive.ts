import {
    ContentChildren,
    Directive,
    ElementRef,
    NgZone,
    OnDestroy,
    OnInit,
    QueryList,
} from '@angular/core';

@Directive({
    selector: '[appScalable]',
    standalone: false
})
export class ScalableDirective implements OnInit, OnDestroy {

    private observer!: ResizeObserver;

    constructor(
        public scalableContainerDirective: ScalableContainerDirective,
        public elementRef: ElementRef<HTMLElement>,
        private ngZone: NgZone,
    ) {
    }

    ngOnInit(): void {
        this.elementRef.nativeElement.style.transformOrigin = `left top`;
        this.observer = new ResizeObserver((entries) => this.ngZone.run(() => { this.scalableContainerDirective.onResize() }));
        this.observer.observe(this.elementRef.nativeElement);
    }

    ngOnDestroy(): void {
        this.observer.disconnect();
    }

}

@Directive({
    selector: '[appScalableContainer]',
    standalone: false
})
export class ScalableContainerDirective implements OnInit, OnDestroy {

    @ContentChildren(ScalableDirective) list!: QueryList<ScalableDirective>;

    private observer!: ResizeObserver;

    constructor(
        public elementRef: ElementRef<HTMLElement>,
        private ngZone: NgZone,
    ) {
    }

    ngOnInit(): void {
        this.observer = new ResizeObserver((entries) => this.ngZone.run(() => { this.onResize() }));
        this.observer.observe(this.elementRef.nativeElement);
    }

    onResize() {
        const containerWidth = this.elementRef.nativeElement.clientWidth;
        for (const item of this.list) {
            const element = item.elementRef.nativeElement;
            const elementWidth = element.clientWidth;
            const scale = containerWidth < elementWidth
                ? containerWidth / elementWidth
                : 1;
            element.style.transform = `scale(${scale})`;
        }
    }

    ngOnDestroy(): void {
        this.observer.disconnect();
    }

}
