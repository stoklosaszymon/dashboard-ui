import { HttpClient } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Widget } from './types/widget';
import { WidgetWeatherComponent } from './components/widgets/widget-weather/widget-weather.component';
import { StockWidget } from './components/widgets/stock-widget/stock-widget.component';
import { ExchangeWidgetComponent } from './components/widgets/exchange/exchange-widget.component';
import { NewsComponent } from './components/widgets/news/news.component';
import { ClocksComponent } from './components/widgets/clocks/clocks.component';

const componentMap = [
  {
    name: '_WidgetWeatherComponent',
    component: WidgetWeatherComponent
  },
  {
    name: '_StockWidget',
    component: StockWidget,
  },
  {
    name: '_ExchangeWidgetComponent',
    component: ExchangeWidgetComponent,
  },
  {
    name: '_NewsComponent',
    component: NewsComponent,
  },
  {
    name: '_ClocksComponent',
    component: ClocksComponent,
  }
]

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  editMode$ = new BehaviorSubject(true);
  http = inject(HttpClient)


  toggleEditMode() {
    this.editMode$.next(!this.editMode$.getValue())
  }

  getWidgets(): any {
    return this.http.get<Widget[]>('http://localhost:3000/widgets').pipe(
      map(resp => resp.map(config => ({ ...config, component: componentMap.find(m => m.name == config.component)?.component })))
    )
  }

  update(widgets: any): any {
    return this.http.post<Widget[]>('http://localhost:3000/widgets', widgets).pipe(
      map(resp => resp.map(config => ({ ...config, component: componentMap.find(m => m.name == config.component)?.component })))
    )
  }
}
