import { Injectable, effect, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  editMode$ = new BehaviorSubject(false);


  toggleEditMode() {
    this.editMode$.next(!this.editMode$.getValue())
  }
}
