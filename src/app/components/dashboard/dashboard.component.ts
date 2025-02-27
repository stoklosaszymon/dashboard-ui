import { Component, ElementRef, computed, effect, inject, input, signal, viewChild, viewChildren } from '@angular/core';
import { CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { WidgetWrapperComponent } from '../widget-wrapper/widget-wrapper.component';
import { CommonModule } from '@angular/common';
import { Subject, debounceTime, map, skip, tap } from 'rxjs';
import { DashboardService } from '../../dashboard.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { Widget } from '../../types/widget';

@Component({
  selector: 'app-dashboard',
  imports: [WidgetWrapperComponent, CdkDropList, CommonModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  wrappers = viewChildren<WidgetWrapperComponent>('widget');
  components = computed(() => this.wrappers().map(w => w.widgetRef()))
  dashboard = viewChild<ElementRef<HTMLElement>>('dashboard');
  observer!: ResizeObserver;
  resize$ = new Subject<ResizeObserverEntry>();
  dashboardService = inject(DashboardService);
  dashboardId = input(0);
  lastSize: {width: number, height: number} = { width: 0, height: 0 }

  editMode = toSignal(this.dashboardService.editMode$, { initialValue: false });
  widgets = signal<Widget[]>([]);

  widgetEffect = effect(() => {
    if (this.widgets()) {
      this.clearResizeObserver();
      this.setUpResizeObserver();
    }
  })

  ngOnInit() {
    this.dashboardService.getWidgets(this.dashboardId()).subscribe((resp: any) => {
      this.widgets.set(resp)
    })

    this.observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].target.getBoundingClientRect();
  
      if (this.lastSize?.width !== width || this.lastSize?.height !== height) {
        this.lastSize = { width, height }; 
        this.resize$.next(entries[0]);
      }
    });
  
    this.resize$.pipe(
      skip(1),  
      debounceTime(500), 
      map(entry => ({
        id: entry.target.getAttribute("id"),
        width: entry.target.clientWidth,
        height: entry.target.clientHeight
      })),
      tap(widget => {
        if (!widget.id) return;
  
        const index = this.widgets().findIndex(w => w.id === parseInt(widget.id!));
        if (index === -1) return;
  
        const config = { width: `${widget.width}px`, height: `${widget.height}px` };
        const newWidgets = [...this.widgets()];
        newWidgets[index] = { ...newWidgets[index], config };
  
        if (this.editMode()) {
          this.widgets.update(() => newWidgets);
          this.updateWidgets();
        }
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.clearResizeObserver();
    this.resize$.unsubscribe();
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  clearResizeObserver() {
    if (this.observer) {
      for (let w of this.components()) {
        this.observer.unobserve(w?.nativeElement as Element);
      }
    }
  }

  setUpResizeObserver(): void {

    if (this.editMode()) {
      for (let w of this.components()) {
        this.observer.observe(w?.nativeElement as Element);
      }
    }
  }

  removeWidget(id: number) {
    this.widgets.set(this.widgets().filter(w => w.id != id));
    this.updateWidgets();
  }


  dropWidget(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {

      const newArr = this.widgets();
      moveItemInArray(
        newArr,
        event.previousIndex,
        event.currentIndex
      );
      this.widgets.set(newArr);
    } else {
      const widget = {
        id: Math.floor(Math.random() * 10000) + 1,
        name: event.previousContainer.data[event.previousIndex].name,
        component: event.previousContainer.data[event.previousIndex].component,
        config: {
          width: '100px',
          height: '100px'
        }
      }
      this.widgets.update(widgets => [
        ...widgets.slice(0, event.currentIndex),
        widget,
        ...widgets.slice(event.currentIndex)
      ])
    }
    this.updateWidgets();
  }

  updateWidgets() {
    const req = this.widgets().map(w => ({ ...w, component: w.component.name, dashboardId: this.dashboardId() }));
    this.dashboardService.update(req).subscribe({
      next: (resp: any) => console.log('succesfully updated', resp),
      error: () => console.log('error occured updating widgets')
    })
  }
}

