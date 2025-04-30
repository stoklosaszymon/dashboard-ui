import { Component, inject, model } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Widget } from '../types/widget';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../dashboard.service';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-config-dialog',
  imports: [FormsModule],
  templateUrl: './config-dialog.component.html',
  styleUrl: './config-dialog.component.scss'
})
export class ConfigDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ConfigDialogComponent>);
  readonly data = inject<Widget>(MAT_DIALOG_DATA);
  readonly name = model(this.data.name);
  width = model(this.data.config.width);
  height = model(this.data.config.height);
  readonly dashboardId = model(this.data.dashboardId)
  readonly id = model(this.data.id);

  service = inject(DashboardService);

  save() {
    this.data.config = { width: this.width(), height: this.height() };
    this.service.updateConfig(this.data).pipe(
      switchMap(() => {
        return this.service.getWidgets(this.dashboardId() as number)
      }),
      tap( () => this.dialogRef.close())
    ).subscribe()
  }

}
