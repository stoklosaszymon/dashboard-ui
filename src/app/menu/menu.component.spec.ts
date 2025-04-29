import { MenuComponent } from "./menu.component"
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { DashboardService } from "../dashboard.service"
import { provideHttpClientTesting } from "@angular/common/http/testing"
import { provideHttpClient } from "@angular/common/http"
import { By } from "@angular/platform-browser"

describe('MenuComponent', () => {
    let component: MenuComponent
    let fixture: ComponentFixture<MenuComponent>
    let service: DashboardService

    beforeEach( async () => {
        await TestBed.configureTestingModule({
            imports: [MenuComponent],
            providers: [
                DashboardService,
                provideHttpClient(),
                provideHttpClientTesting(),
            ]
        })

        fixture = TestBed.createComponent(MenuComponent)
        component = fixture.componentInstance
        service = TestBed.inject(DashboardService)
    })

    it('should create component', () => {
        expect(component).toBeTruthy();
    })

    it('should open menu on button click', () => {
        fixture.debugElement.query(By.css('[data-testid=menu]')).nativeElement.click();
        fixture.detectChanges();
        const menu = fixture.debugElement.query(By.css('[data-testid=circle-menu]'))
        expect(menu).toBeTruthy();
    })

    it('should show widget list', () => {
        jest.spyOn(service, 'toggleWidgetsMenu');
        fixture.debugElement.query(By.css('[data-testid=edit-mode]')).nativeElement.click();
        fixture.detectChanges();
        expect(service.toggleWidgetsMenu).toHaveBeenCalled();
    })
})