import { Component, Input, computed, effect, input, signal } from '@angular/core';
import { WidgetWeatherComponent } from '../widgets/widget-weather/widget-weather.component';
import { NgComponentOutlet } from '@angular/common';
import { GaleryComponent } from '../widgets/galery/galery.component';

@Component({
  selector: 'app-widget-wrapper',
  standalone: true,
  imports: [WidgetWeatherComponent, NgComponentOutlet],
  templateUrl: './widget-wrapper.component.html',
  styleUrl: './widget-wrapper.component.scss'
})
export class WidgetWrapperComponent {
  widgetsMap: { [id: string]: any}= { 
    "weather": WidgetWeatherComponent,
    "galery": GaleryComponent
 }

  widget = input('');
  getComponent() {
    return this.widgetsMap[this.widget()]
  }

}
