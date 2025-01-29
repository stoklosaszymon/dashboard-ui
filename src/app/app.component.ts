import { Component, ElementRef, ViewChild, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { WidgetsListComponent } from './widgets-list/widgets-list.component';
import { MenuComponent } from './menu/menu.component';
import { DashboardService } from './dashboard.service';
import { toSignal } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent, WidgetsListComponent, MenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  dashboardService = inject(DashboardService);
  @ViewChild('widgetsList') widgetList!: ElementRef;
  title = 'dashboard-ui';
  editMode = toSignal<boolean>(this.dashboardService.editMode$);

}

