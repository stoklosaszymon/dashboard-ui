import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { TabsService } from './tabs.service';
import { AsyncPipe } from '@angular/common';
import { startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-dashboard-tabs',
  imports: [MatTabsModule, DashboardComponent, AsyncPipe],
  template: `
  <mat-tab-group>
    @for(tab of tabs$ | async; track tab.id) {
      <mat-tab class="tab" label="{{tab.name}}"> 
        <app-dashboard [dashboardId]="tab.id"></app-dashboard>
      </mat-tab>
    }
  </mat-tab-group>`
  ,
  styleUrl: './dashboard-tabs.component.scss'
})
export class DashboardTabsComponent {
  service = inject(TabsService);
  tabs$ = this.service.tabCreated.asObservable().pipe(
    startWith('empty'),
    switchMap( () => this.service.getTabs())
  )
}
