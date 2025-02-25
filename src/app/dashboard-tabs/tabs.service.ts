import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable, Subject } from 'rxjs';
import { Tab, Widget } from '../types/widget';

@Injectable({
  providedIn: 'root'
})
export class TabsService {
    service = inject(ApiService)
    tabCreated = new Subject<string>();

    getTabs(): Observable<Tab[]> {
      return this.service.get<Tab[]>('http://localhost:3000/widgets/www/tabs')
    }

    createTab(tabName: string) {
      return this.service.post<Tab>('http://localhost:3000/widgets/www/tab', { name: tabName })
    }
}
