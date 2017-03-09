import {Directive, ElementRef, Output, EventEmitter, HostListener} from '@angular/core';

@Directive({
    selector: '[clickOutside]'
})

export class ClickOutsideDirective {
    @Output()
    public clickOutside = new EventEmitter();

    constructor(private _elementRef: ElementRef) {
    }

    @HostListener('document:click', ['$event.target'])
    public onClick(targetElement) { 
        if (!targetElement) {
            return;
        }

        //infoLogoObj keeps infoLogo image block for preventing earlier pop-up closing
        let infoLogoObj = document.getElementById("img-user");
        const clickedInside = infoLogoObj.contains(targetElement);
        if (!clickedInside) {
            this.clickOutside.emit(null);
        }
    }
}