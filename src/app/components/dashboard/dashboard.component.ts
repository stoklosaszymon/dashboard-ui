import { Component, ElementRef, effect, inject, input, signal, viewChild, viewChildren } from '@angular/core';
import { CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { WidgetWrapperComponent } from '../widget-wrapper/widget-wrapper.component';
import { CommonModule } from '@angular/common';
import { Subject, combineLatest, delay, fromEvent, map, of, skip, switchMap, tap } from 'rxjs';
import { DashboardService } from '../../dashboard.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { Widget } from '../../types/widget';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [WidgetWrapperComponent, CdkDropList, CommonModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  components = viewChildren<ElementRef<HTMLButtonElement>>('widget');
  dashboard = viewChild<ElementRef<HTMLElement>>('dashboard');
  observer!: ResizeObserver;
  resize$ = new Subject<ResizeObserverEntry>();
  dashboardService = inject(DashboardService);
  dashboardId = input();

  editMode = toSignal(this.dashboardService.editMode$, { initialValue: false });

  editEffect = effect(() => {
    if (this.editMode()) {
      this.setUpResizeObserver();
    }
  })

  widgets = signal<Widget[]>([]);

  widgetEffect = effect(() => {
    if(this.widgets() && this.widgets().length) {
      this.clearResizeObserver();
      this.setUpResizeObserver();
    }
  })

  ngOnInit() {
    this.dashboardService.getWidgets().subscribe( (resp: any) => {
      console.log('resp', resp)
      this.widgets.set(resp)
    })

    this.observer = new ResizeObserver(entries => {
      this.resize$.next(entries[0])
    })

    const mouseUp$ = fromEvent(this.dashboard()?.nativeElement!, 'mouseup')

    this.resize$.pipe(
      skip(1),
      switchMap((entry) => combineLatest([of(entry), mouseUp$]).pipe(
        delay(1000),
        map(combined => combined[0]),
        map((entry) => {
          const widgetId = entry.target.attributes.getNamedItem("id")?.textContent;
          return { id: widgetId, element: entry.target }
        }),
        tap((widget) => {
          if (widget.id) {
            let index = this.widgets().findIndex(w => w.id === parseInt(widget.id!));
            let config = { width: `${widget.element.clientWidth}px`, height: `${widget.element.clientHeight}px` }
            let newWidgets = this.widgets();
            newWidgets.splice(index, 1, { ...this.widgets()[index], config: config });
            this.widgets.set(newWidgets)
            console.log(this.widgets());
          }
        }),
      ))
    ).subscribe({
      next: (entry) => console.log(this.widgets())
    })
  }

  ngOnDestroy() {
    this.clearResizeObserver();
    this.resize$.unsubscribe();
  }

  clearResizeObserver() {
    if (this.observer) {
      for (let widget of this.components()) {
        this.observer.unobserve(widget.nativeElement);
      }
    }
  }

  setUpResizeObserver(): void {

    if (this.editMode()) {
      for (let widget of this.components()) {
        this.observer.observe(widget.nativeElement);
      }
    }
  }

  removeWidget(id: number) {
    console.log('widgetId: ', id);
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
      console.log('widget', widget);
      
      this.widgets.update(widgets => [
        ...widgets.slice(0, event.currentIndex),
        widget,
        ...widgets.slice(event.currentIndex)
      ])
    }
    console.log('widgets', this.widgets());
    this.updateWidgets();
  }

  updateWidgets() {
    const req = this.widgets().map( w => ({...w, component: w.component.name}));
    console.log('request', req);
    this.dashboardService.update(req).subscribe({
      next: (resp: any) => console.log('succesfully updated', resp),
      error: () => console.log('error occured updating widgets')
    })
  }
}

