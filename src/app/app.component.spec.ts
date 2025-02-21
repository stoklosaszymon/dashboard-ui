import { ComponentFixture, TestBed } from "@angular/core/testing"
import { AppComponent } from "./app.component"
import { DashboardService } from "./dashboard.service"
import { inject } from "@angular/core"
import { provideHttpClient } from "@angular/common/http"
import { provideHttpClientTesting } from "@angular/common/http/testing"
import { By } from "@angular/platform-browser"
import { provideAnimations } from "@angular/platform-browser/animations"

ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))
        Element.prototype.getAnimations = jest.fn(() => []);

describe('AppComponent', () => {
    let component: AppComponent
    let fixture: ComponentFixture<AppComponent>
    let service: DashboardService

    beforeAll(() => {
        Element.prototype.getAnimations = jest.fn(() => []);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideAnimations()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance
        service = TestBed.inject(DashboardService)
    })

    it('should be created', () => {
        expect(component).toBeTruthy()
    })

    it('should display widget list', () => {
        service.toggleEditMode();
        fixture.detectChanges();
        const menuElement = fixture.debugElement.query(By.css('[data-testid="widgets-list"]'));
        expect(menuElement).toBeTruthy();
    })
})