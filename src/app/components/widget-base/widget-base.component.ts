import { Component, input } from '@angular/core';
import { WidgetConfig } from '../../types/widget';

@Component({
    selector: 'app-widget-base',
    imports: [],
    template: ''
})
export class WidgetBaseComponent {
  config = input<WidgetConfig | null>(null);
}
