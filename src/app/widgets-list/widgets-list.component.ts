import { Component, inject } from '@angular/core';
import { CdkDragPlaceholder, DragDropModule } from '@angular/cdk/drag-drop';
import { WidgetWeatherComponent } from '../components/widgets/widget-weather/widget-weather.component';
import { StockWidget } from '../components/widgets/stock-widget/stock-widget.component';
import { MatIconModule } from '@angular/material/icon';
import { DashboardService } from '../dashboard.service';
import { ExchangeWidgetComponent } from '../components/widgets/exchange/exchange-widget.component';
import { NewsComponent } from '../components/widgets/news/news.component';
import { NgComponentOutlet } from '@angular/common';
import { ClocksComponent } from '../components/widgets/clocks/clocks.component';

@Component({
  selector: 'app-widgets-list',
  standalone: true,
  imports: [DragDropModule, MatIconModule, CdkDragPlaceholder, NgComponentOutlet],
  templateUrl: './widgets-list.component.html',
  styleUrl: './widgets-list.component.scss'
})
export class WidgetsListComponent {

  dashboardService = inject(DashboardService);

  widgets = [
    { name: 'Weather', component: WidgetWeatherComponent },
    { name: 'Temp', component: StockWidget },
    { name: 'exchange', component: ExchangeWidgetComponent },
    { name: 'clocks', component: ClocksComponent },
    //{ name: 'news', component: NewsComponent },
  ]

  onDragStart(event: any): void {
    console.log('drag event start', event);
    
    document.body.classList.add('dragging')
  }

  onDragEnd(event: any): void {
    document.body.classList.remove('dragging')
  }

  close() {
    this.dashboardService.toggleEditMode();
  }
}
