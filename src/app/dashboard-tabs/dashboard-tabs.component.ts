import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { TabsService } from './tabs.service';
import { AsyncPipe } from '@angular/common';
import { startWith, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { DashboardService } from '../dashboard.service';
import { TabDirective } from './tab.directive';

@Component({
  selector: 'app-dashboard-tabs',
  imports: [MatTabsModule, DashboardComponent, AsyncPipe, TabDirective],
  template: `
  <mat-tab-group>
    @for(tab of tabs$ | async; track tab.id) {
      <mat-tab class="tab"> 
        @if (isEditMode()) {
        <ng-template mat-tab-label>
          <div data-testid="editable" appTab contenteditable="true" id="{{tab.id}}" #editable>{{tab.name}}</div>
        </ng-template>
        } @else {
        <ng-template mat-tab-label>
          <div data-testid="uneditable" contenteditable="false">{{tab.name}}</div>
        </ng-template>
        }
        <ng-template matTabContent>
          <app-dashboard [dashboardId]="tab.id"></app-dashboard>
        </ng-template>
      </mat-tab>
    }
  </mat-tab-group>`
  ,
  styleUrl: './dashboard-tabs.component.scss'
})
export class DashboardTabsComponent {
  service = inject(TabsService);
  dashboardService = inject(DashboardService)
  tabs$ = this.service.tabCreated.asObservable().pipe(
    startWith('empty'),
    switchMap(() => this.service.getTabs()),
    tap( (res) => console.log(res))
  )
  isEditMode = toSignal(this.dashboardService.editMode$, { initialValue: false })
}
