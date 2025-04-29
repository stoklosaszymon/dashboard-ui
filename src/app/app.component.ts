import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WidgetsListComponent } from './widgets-list/widgets-list.component';
import { MenuComponent } from './menu/menu.component';
import { DashboardService } from './dashboard.service';
import { toSignal } from '@angular/core/rxjs-interop'
import { DashboardTabsComponent } from "./dashboard-tabs/dashboard-tabs.component";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, WidgetsListComponent, MenuComponent, DashboardTabsComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {

  dashboardService = inject(DashboardService);
  @ViewChild('widgetsList') widgetList!: ElementRef;
  title = 'dashboard-ui';
  editMode = toSignal<boolean>(this.dashboardService.editMode$);
  showWidgetList = toSignal<boolean>(this.dashboardService.showWidgetsMenu$);
}

