import { Component, input, output } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { Widget } from '../../types/widget';

@Component({
  selector: 'app-widget-wrapper',
  standalone: true,
  imports: [NgComponentOutlet, MatIconModule, CdkDrag, CdkDragHandle, CommonModule],
  templateUrl: './widget-wrapper.component.html',
  styleUrl: './widget-wrapper.component.scss'
})
export class WidgetWrapperComponent {

  widget = input<Widget>();
  component: any = input('');
  editMode = input(false);
  remove = output<number>();

  removeWidget() {
    this.remove.emit(this.widget()!.id)
  }

  onDragStart(event: any): void {
    document.body.classList.add('moving')
  }

  onDragEnd(event: any): void {
    document.body.classList.remove('moving')
  }

  getStyles() {
    return this.widget()?.config
  }
}
