import { Component, ElementRef, computed, input, output, viewChild } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CdkDrag, CdkDragHandle, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { Widget } from '../../types/widget';

@Component({
  selector: 'app-widget-wrapper',
  standalone: true,
  imports: [NgComponentOutlet, MatIconModule, CdkDrag, CdkDragHandle, CommonModule, CdkDragPlaceholder],
  templateUrl: './widget-wrapper.component.html',
  styleUrl: './widget-wrapper.component.scss'
})
export class WidgetWrapperComponent {

  widgetRef = viewChild<ElementRef<HTMLDivElement>>('widgetRef');
  widget = input<Widget | null>(null);
  placeholderSize = computed( () => ({ width: this.widget()?.config.width, height: this.widget()?.config.height}))
  styles = computed( () => this.widget()?.config)
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
}
