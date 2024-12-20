import { Component, ElementRef, effect, input, signal, viewChildren } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { WidgetWrapperComponent } from '../widget/widget-wrapper.component';
import { CommonModule } from '@angular/common';
import { Subject, delay, map, of, switchMap, tap } from 'rxjs';

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

  editMode = input(false);

  editEffect = effect(() => {
    if (this.editMode()) {
      this.clearResizeObserver();
      this.setUpResizeObserver();
    }
  })

  widgets = signal([
    {
      name: 'weather', config: {
        width: '700px',
        height: '400px'
      }
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
    });

    this.resize$.pipe(
      switchMap((entry) => of(entry).pipe(
      delay(1000),
        map((entry) => {
          const widgetName = entry.target.attributes.getNamedItem("id")?.textContent;
          return { name: widgetName ? widgetName : '', element: entry.target }
        }),
        tap((widget) => {
          console.log(widget.name);
          let w = this.widgets().find(w => w.name === widget.name.replace('widget-', ''));
          if (w?.config) {
            w.config = { width: `${widget.element.scrollWidth}px`, height: `${widget.element.scrollHeight}px` }
          }
        })
      )),
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
        name: event.previousContainer.data[event.previousIndex].name,
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
