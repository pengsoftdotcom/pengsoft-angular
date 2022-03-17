import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { SecurityService } from '../services/support/security.service';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[hasAnyAuthority]'
})
export class HasAnyAuthorityDirective implements OnInit {

    @Input('hasAnyAuthority') authorityCodes: string | undefined;

    @Input('title') exclusive: string | undefined;

    constructor(private el: ElementRef, private security: SecurityService) { }

    ngOnInit(): void {
        if (!this.security.hasAnyAuthority(this.authorityCodes, this.exclusive)) {
            this.el.nativeElement.remove();
        }
    }

}
