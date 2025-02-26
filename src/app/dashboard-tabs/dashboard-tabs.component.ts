import { Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { TabsService } from './tabs.service';
import { AsyncPipe } from '@angular/common';
import { debounceTime, from, fromEvent, startWith, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard-tabs',
  imports: [MatTabsModule, DashboardComponent, AsyncPipe],
  template: `
  <mat-tab-group>
    @for(tab of tabs$ | async; track tab.id) {
      <mat-tab class="tab"> 
        @if (isEditMode()) {
        <ng-template mat-tab-label>
          <div contenteditable="true" id="{{tab.id}}" #editable>{{tab.name}}</div>
        </ng-template>
        } @else {
        <ng-template mat-tab-label>
          <div contenteditable="false">{{tab.name}}</div>
        </ng-template>
        }
        <app-dashboard [dashboardId]="tab.id"></app-dashboard>
      </mat-tab>
    }
  </mat-tab-group>`
  ,
  styleUrl: './dashboard-tabs.component.scss'
})
export class DashboardTabsComponent {
  editable = viewChild<ElementRef<HTMLDialogElement>>('editable')
  service = inject(TabsService);
  dashboardService = inject(DashboardService)
  tabs$ = this.service.tabCreated.asObservable().pipe(
    startWith('empty'),
    switchMap(() => this.service.getTabs())
  )
  isEditMode = toSignal(this.dashboardService.editMode$, { initialValue: false })
  update: any
  editEff = effect(() => {
    if (this.editable()) {

      this.update = fromEvent(this.editable()?.nativeElement!, 'input').pipe(
        debounceTime(500),
        switchMap(t => {
          const target = t.target as HTMLDListElement
          console.log('zz',target.innerHTML + target.id)
          return this.service.updateTab({ name: target.innerHTML, id: parseInt(target.id) })
        })
      ).subscribe({
        next: (resp) => console.log('resp', resp)
      })
    }
  })
}
