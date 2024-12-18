import { ChangeDetectionStrategy, Component, ElementRef, Input, QueryList, SimpleChange, ViewChild, ViewChildren, effect, input, signal, viewChildren } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { WidgetWrapperComponent } from '../widget/widget-wrapper.component';
import { CommonModule } from '@angular/common';

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

  editMode = input(false);

  editEffect = effect(() => {
    if (this.editMode()) {
      this.setUpResizeObserver();
    }
  })

  widgets = signal([
    {
      name: 'Weather', config: {
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

  ngOnDestroy() {
    this.clearResizeObserver();
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

      this.observer = new ResizeObserver(entries => {
        let element = entries[0].target;
        let widgetId = element.attributes.getNamedItem("id")?.textContent;
        let widget = this.widgets().find(widget => widget.name === widgetId?.replace('widget-', ''));
        if (widget?.config) {
          widget.config = { width: `${element.scrollWidth}px`, height: `${element.scrollHeight}px` }
        }
      });

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
        name: event.previousContainer.data[event.previousIndex],
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
