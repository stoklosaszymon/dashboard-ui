import { Component, inject } from '@angular/core';
import { DragDropModule,CdkDragPreview } from '@angular/cdk/drag-drop';
import { WidgetWeatherComponent } from '../components/widgets/widget-weather/widget-weather.component';
import { NgComponentOutlet } from '@angular/common';
import { StockWidget } from '../components/widgets/stock-widget/stock-widget.component';
import { MatIconModule } from '@angular/material/icon';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-widgets-list',
  standalone: true,
  imports: [DragDropModule, NgComponentOutlet, MatIconModule],
  templateUrl: './widgets-list.component.html',
  styleUrl: './widgets-list.component.scss'
})
export class WidgetsListComponent {

  dashboardService = inject(DashboardService);

  widgets = [
    { name: 'Weather', component: WidgetWeatherComponent },
    { name: 'Temp', component: StockWidget },
  ]

  onDragStart(event: any): void {
    document.body.classList.add('dragging')
  }

  onDragEnd(event: any): void {
    document.body.classList.remove('dragging')
  }

  close() {
    this.dashboardService.toggleEditMode();
  }
}
