import { Component, Input } from '@angular/core';
import { WidgetWeatherComponent } from '../widgets/widget-weather/widget-weather.component';

@Component({
  selector: 'app-widget-wrapper',
  standalone: true,
  imports: [WidgetWeatherComponent],
  templateUrl: './widget-wrapper.component.html',
  styleUrl: './widget-wrapper.component.scss'
})
export class WidgetWrapperComponent {
  @Input() widget: any;
}
