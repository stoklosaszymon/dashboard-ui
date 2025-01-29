import { Component, ElementRef, effect, inject, signal, viewChildren } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { WidgetWrapperComponent } from '../widget/widget-wrapper.component';
import { CommonModule } from '@angular/common';
import { Subject, combineLatest, delay, fromEvent, map, of, skip, switchMap, tap } from 'rxjs';
import { WidgetWeatherComponent } from '../widgets/widget-weather/widget-weather.component';
import { DashboardService } from '../../dashboard.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [WidgetWrapperComponent, CdkDropList, CdkDrag, CdkDragHandle, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  components = viewChildren<ElementRef<HTMLButtonElement>>('widget');
  observer!: ResizeObserver;
  resize$ = new Subject<ResizeObserverEntry>();
  dashboardService = inject(DashboardService);

  editMode = toSignal(this.dashboardService.editMode$);

  editEffect = effect(() => {
    if (this.editMode()) {
      this.setUpResizeObserver();
    }
  })

  widgets = signal([
    {
      id: 1,
      name: 'weather',
      component: WidgetWeatherComponent,
      config: {
        width: '350px',
        height: '265px'
      },
    }
  ])

  widgetEffect = effect(() => {
    if (this.widgets().length) {
      this.clearResizeObserver();
      this.setUpResizeObserver();
    }
  })

  ngOnInit() {
    this.observer = new ResizeObserver(entries => {
      this.resize$.next(entries[0])
    })

    const mouseUp$ = fromEvent(document.getElementsByClassName('dashboard')[0], 'mouseup')

    this.resize$.pipe(
      skip(1),
      switchMap((entry) => combineLatest([of(entry), mouseUp$]).pipe(
        delay(1000),
        map( combined => combined[0]),
        map((entry) => {
          const widgetId = entry.target.attributes.getNamedItem("id")?.textContent;
          return { id: widgetId, element: entry.target }
        }),
        tap((widget) => {
          if (widget.id) {
            let index = this.widgets().findIndex(w => w.id === parseInt(widget.id!));
            let config = { width: `${widget.element.scrollWidth}px`, height: `${widget.element.scrollHeight}px` }
            let newWidgets = this.widgets();
            newWidgets.splice(index, 1, { ...this.widgets()[index], config: config });
            this.widgets.set(newWidgets)
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

  onDragStart(event: any): void {
    document.body.classList.add('moving')
  }

  onDragEnd(event: any): void {
    document.body.classList.remove('moving')
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
        id: this.widgets().length,
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
  }
}
