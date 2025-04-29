import { Component, Renderer2, inject } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WidgetWeatherComponent } from '../components/widgets/widget-weather/widget-weather.component';
import { StockWidget } from '../components/widgets/stock-widget/stock-widget.component';
import { MatIconModule } from '@angular/material/icon';
import { DashboardService } from '../dashboard.service';
import { ExchangeWidgetComponent } from '../components/widgets/exchange/exchange-widget.component';
import { AsyncPipe, DOCUMENT, NgComponentOutlet } from '@angular/common';
import { ClocksComponent } from '../components/widgets/clocks/clocks.component';
import { CoinComponent } from '../components/widgets/coin/coin.component';
import { TabsService } from '../dashboard-tabs/tabs.service';
import { map, startWith, switchMap } from 'rxjs';
import { NewsComponent } from '../components/widgets/news/news.component';

@Component({
  selector: 'app-widgets-list',
  imports: [DragDropModule, MatIconModule, NgComponentOutlet, AsyncPipe],
  templateUrl: './widgets-list.component.html',
  styleUrl: './widgets-list.component.scss'
})
export class WidgetsListComponent {

  dashboardService = inject(DashboardService);
  document = inject(DOCUMENT)
  renderer = inject(Renderer2)
  tabService = inject(TabsService)

  widgets = [
    { name: 'stock', component: StockWidget },
    { name: 'exchange', component: ExchangeWidgetComponent },
    { name: 'clocks', component: ClocksComponent },
    { name: 'coin', component: CoinComponent },
    { name: 'news', component: NewsComponent },
  ]

  tabs = this.tabService.tabCreated.pipe(
    startWith('emoty'),
    switchMap((tab: string) => {
      return this.tabService.getTabs().pipe(
        map((tabs) => tabs.map(tab => `dashboard-${tab.id}`)),
      )
    })
  )

  onDragStart(event: any): void {
    this.renderer.addClass(this.document.body, 'dragging')
  }

  onDragEnd(event: any): void {
    this.renderer.removeClass(this.document.body, 'dragging')
  }

  close() {
    this.dashboardService.toggleWidgetsMenu();
  }
}
