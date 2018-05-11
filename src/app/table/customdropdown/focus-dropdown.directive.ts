import { Directive, HostListener } from '@angular/core';

declare var jQuery: any;

@Directive({
  selector: '[focusDropdown]'
})
export class FocusDropdownDirective {
  constructor () {
  }

  @HostListener('focus', ['$event'])
  onFocus (event) {

    jQuery(event.target).addClass('focus-control');
    jQuery(event.target).parents('li, .input-hold').addClass('focus-parentcontrol');
    jQuery(event.target).parents('li').find('label').addClass('focus-control');
    jQuery(event.target).next('span').addClass('focus-control');
  }

  @HostListener('blur', ['$event'])
  onBlur (event) {
    jQuery(event.target).removeClass('focus-control');
    jQuery(event.target).parents('li, .input-hold').removeClass('focus-parentcontrol');
    jQuery(event.target).parents('li').find('label').removeClass('focus-control');
    jQuery(event.target).next('span').removeClass('focus-control');
  }
}
