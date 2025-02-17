import { Component, input } from '@angular/core';
import { WidgetConfig } from '../../types/widget';

@Component({
  selector: 'app-widget-base',
  standalone: true,
  imports: [],
  template: ''
})
export class WidgetBaseComponent {
  config = input<WidgetConfig | null>(null);
}
