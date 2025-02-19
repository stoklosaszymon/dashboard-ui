import { Component, ElementRef, inject, viewChild } from '@angular/core';
import {MatIconModule} from '@angular/material/icon'
import { DashboardService } from '../dashboard.service';

@Component({
    selector: 'app-menu',
    imports: [MatIconModule],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss'
})
export class MenuComponent {
    menu = viewChild<ElementRef<HTMLDivElement>>("menu");
    dashboardService = inject(DashboardService);

    menuToggle() {
      this.menu()?.nativeElement.classList.toggle('expand');
    }

    addWidget() {
      this.dashboardService.toggleEditMode(); 
    }
}
