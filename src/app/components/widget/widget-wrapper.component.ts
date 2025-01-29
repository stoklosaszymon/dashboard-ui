import { Component, input } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-widget-wrapper',
  standalone: true,
  imports: [NgComponentOutlet],
  templateUrl: './widget-wrapper.component.html',
  styleUrl: './widget-wrapper.component.scss'
})
export class WidgetWrapperComponent {

  widget = input('');
  component: any = input('');

}
