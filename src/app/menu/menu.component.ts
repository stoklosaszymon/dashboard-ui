import { Component, ElementRef, inject, viewChild } from '@angular/core';
import {MatIconModule} from '@angular/material/icon'
import { DashboardService } from '../dashboard.service';
import { TabsService } from '../dashboard-tabs/tabs.service';

@Component({
    selector: 'app-menu',
    imports: [MatIconModule],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss'
})
export class MenuComponent {
    menu = viewChild<ElementRef<HTMLDivElement>>("menu");
    dashboardService = inject(DashboardService);
    tabService = inject(TabsService)

    menuToggle() {
      this.menu()?.nativeElement.classList.toggle('expand');
    }

    addWidget() {
      this.dashboardService.toggleEditMode(); 
    }

    addTab() {
      this.tabService.createTab('test').subscribe( (resp) => {
        this.tabService.tabCreated.next('New Tab')        
      })
    }
}
