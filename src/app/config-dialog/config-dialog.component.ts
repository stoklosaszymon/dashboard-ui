import { Component, inject, model } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Widget } from '../types/widget';

@Component({
  selector: 'app-config-dialog',
  imports: [],
  templateUrl: './config-dialog.component.html',
  styleUrl: './config-dialog.component.scss'
})
export class ConfigDialogComponent {
  readonly data = inject<Widget>(MAT_DIALOG_DATA);
  readonly name = model(this.data.name);
  readonly id = model(this.data.id);
}
