import { Component, inject } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WidgetWeatherComponent } from '../components/widgets/widget-weather/widget-weather.component';
import { StockWidget } from '../components/widgets/stock-widget/stock-widget.component';
import { MatIconModule } from '@angular/material/icon';
import { DashboardService } from '../dashboard.service';
import { ExchangeWidgetComponent } from '../components/widgets/exchange/exchange-widget.component';
import { NgComponentOutlet } from '@angular/common';
import { ClocksComponent } from '../components/widgets/clocks/clocks.component';
import { CoinComponent } from '../components/widgets/coin/coin.component';

@Component({
    selector: 'app-widgets-list',
    imports: [DragDropModule, MatIconModule, NgComponentOutlet],
    templateUrl: './widgets-list.component.html',
    styleUrl: './widgets-list.component.scss'
})
export class WidgetsListComponent {

  dashboardService = inject(DashboardService);

  widgets = [
    { name: 'weather', component: WidgetWeatherComponent },
    { name: 'stock', component: StockWidget },
    { name: 'exchange', component: ExchangeWidgetComponent },
    { name: 'clocks', component: ClocksComponent },
    { name: 'coin', component: CoinComponent },
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
