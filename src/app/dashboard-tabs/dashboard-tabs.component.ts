import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { DashboardComponent } from '../components/dashboard/dashboard.component';

@Component({
  selector: 'app-dashboard-tabs',
  imports: [MatTabsModule, DashboardComponent],
  template: `
  <mat-tab-group>
    @for(tab of tabs; track tab.id) {
      <mat-tab label="First"> 
        <app-dashboard [dashboardId]="tab.id"></app-dashboard>
      </mat-tab>
    }
  </mat-tab-group>`
  ,
  styleUrl: './dashboard-tabs.component.scss'
})
export class DashboardTabsComponent {
  tabs = [{id: 1, widgets: []}]
}
