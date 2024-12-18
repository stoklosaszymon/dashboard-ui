import { Component } from '@angular/core';
import { DragDropModule,CdkDragPreview } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-widgets-list',
  standalone: true,
  imports: [DragDropModule, CdkDragPreview],
  templateUrl: './widgets-list.component.html',
  styleUrl: './widgets-list.component.scss'
})
export class WidgetsListComponent {

  widgets = [
    'Weather',
    'To Do',
    'Note',
    'Reminder',
    'Calendar'
  ]

  onDragStart(event: any): void {
    document.body.classList.add('dragging')
  }

  onDragEnd(event: any): void {
    document.body.classList.remove('dragging')
  }
}
