import {
    ChangeDetectorRef,
    ComponentMirror,
    ComponentRef,
    Directive,
    EventEmitter,
    Injector,
    Input,
    OnChanges,
    OnDestroy,
    reflectComponentType,
    SimpleChange,
    SimpleChanges,
    ViewContainerRef,
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DynamicComponentData } from '../models/dynamic-component.models';
import { assertNotNullOrUndefined } from '../models/shared.types';

@Directive({
    selector: '[dynamicComponent]',
    standalone: false
})
export class DynamicComponentDirective implements OnChanges, OnDestroy {

    @Input() dynamicComponent!: DynamicComponentData<any>;
    private componentMirror: ComponentMirror<any> | null = null;
    private componentRef: ComponentRef<any> | null = null;
    private componentInstance: any | null = null;
    private changeDetectorRef: ChangeDetectorRef | null = null;

    private ngUnsubscribe = new Subject<void>();

    constructor(
        private viewContainerRef: ViewContainerRef,
        private injector: Injector,
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        assertNotNullOrUndefined(this.dynamicComponent.component);

        const previousValue: DynamicComponentData<any> = changes.dynamicComponent?.previousValue;
        const currentValue: DynamicComponentData<any> = changes.dynamicComponent?.currentValue;
        const shouldCreateNewComponent = previousValue?.component !== currentValue?.component ||
            previousValue?.injector !== currentValue?.injector;

        if (shouldCreateNewComponent) {
            this.destroyComponent();
            this.createComponent();
        }

        assertNotNullOrUndefined(this.componentMirror);
        assertNotNullOrUndefined(this.componentRef);

        this.bindInputs();
        this.bindOutputs();

        if ((this.componentRef.instance as OnChanges).ngOnChanges) {
            const componentChanges = this.makeComponentChanges(
                previousValue,
                currentValue,
                shouldCreateNewComponent
            );
            this.componentRef.instance.ngOnChanges(componentChanges);
        }

        if (!shouldCreateNewComponent) {
            this.changeDetectorRef?.markForCheck();
        }
    }

    ngOnDestroy() {
        this.destroyComponent();
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private destroyComponent() {
        this.componentRef?.destroy();
        this.viewContainerRef.clear();
    }

    private createComponent() {
        this.componentMirror = reflectComponentType(this.dynamicComponent.component);
        this.componentRef = this.viewContainerRef.createComponent(
            this.dynamicComponent.component,
            {
                injector: this.dynamicComponent.injector ?? this.injector,
            }
        );
        this.changeDetectorRef = this.componentRef.injector.get(ChangeDetectorRef);
        this.componentInstance = this.componentRef.instance;
    }

    private bindInputs() {
        if (this.componentMirror == null || this.componentInstance == null) {
            return
        }
        const userInputs = this.dynamicComponent.inputs ?? {};
        for (const input of this.componentMirror.inputs) {
            const inputValue = userInputs?.[input.propName];
            this.componentInstance[input.propName] = inputValue;
        }
    }

    private bindOutputs() {
        this.ngUnsubscribe.next(); // to remove old subscription
        this.componentMirror?.outputs.forEach(outputInfo => {
            const outputEvent = this.componentInstance?.[outputInfo.propName];
            if (!(outputEvent instanceof EventEmitter)) {
                throw new Error(`Component output ${ outputInfo.propName } must be a typeof EventEmitter`);
            }
            const outputFunction = this.dynamicComponent.outputs?.[outputInfo.propName];
            if (outputFunction == null) {
                return;
            }
            if (!(outputFunction instanceof Function)) {
                throw new Error(`User output ${ outputInfo.propName } must be a function`);
            }
            outputEvent.pipe(
                takeUntil(this.ngUnsubscribe),
            ).subscribe((event) => outputFunction(event));
        });
    }

    private makeComponentChanges(
        previousValue: DynamicComponentData<any>,
        currentValue: DynamicComponentData<any>,
        firstChange: boolean,
    ): SimpleChanges {
        const previuosInputs = previousValue != null && !firstChange
            ? previousValue.inputs ?? {}
            : {};
        const currentInputs = currentValue.inputs ?? {};
        return Object.keys(currentInputs).reduce<SimpleChanges>((changes, inputName) => {
            const currentInputValue = currentInputs[inputName];
            const previuosInputValue = previuosInputs[inputName];
            if (currentInputValue !== previuosInputValue) {
                changes[inputName] = new SimpleChange(
                    firstChange ? undefined : previuosInputValue,
                    currentInputValue,
                    firstChange,
                );
            }
            return changes;
        }, {});
    }

}
