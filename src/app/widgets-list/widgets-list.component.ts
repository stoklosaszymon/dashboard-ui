import { Component } from '@angular/core';
import { DragDropModule,CdkDragPreview } from '@angular/cdk/drag-drop';
import { WidgetWeatherComponent } from '../components/widgets/widget-weather/widget-weather.component';
import { GaleryComponent } from '../components/widgets/galery/galery.component';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-widgets-list',
  standalone: true,
  imports: [DragDropModule, CdkDragPreview, WidgetWeatherComponent, NgComponentOutlet, GaleryComponent],
  templateUrl: './widgets-list.component.html',
  styleUrl: './widgets-list.component.scss'
})
export class WidgetsListComponent {

  widgets = [
    { name: 'Weather', component: WidgetWeatherComponent },
    { name: 'galery', component: GaleryComponent }
  ]

  onDragStart(event: any): void {
    document.body.classList.add('dragging')
  }

  onDragEnd(event: any): void {
    document.body.classList.remove('dragging')
  }
}
