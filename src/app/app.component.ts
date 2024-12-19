import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MenuComponent } from './menu/menu.component';
import { WidgetsListComponent } from './widgets-list/widgets-list.component';
import { RainComponent } from './components/widgets/widget-weather/rain/rain.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent, MenuComponent, WidgetsListComponent, RainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  @ViewChild('widgetsList') widgetList!: ElementRef;
  title = 'dashboard-ui';
  editMode = false;

  showWidgetsList() {
    this.editMode = !this.editMode;
  }

}
