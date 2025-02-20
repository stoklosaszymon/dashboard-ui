import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ClocksComponent } from "./clocks.component"
import { By } from "@angular/platform-browser";

describe('Clocks Component', () => {
    let component: ClocksComponent
    let fixture: ComponentFixture<ClocksComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
          imports: [ ClocksComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ClocksComponent);
        component = fixture.componentInstance;
    })

    it('creates component', () => {
        expect(component).toBeTruthy();
    }) 

    it('should call setup on init', () => {
        jest.spyOn(component, 'setup');
        fixture.detectChanges();
        expect(component.setup).toHaveBeenCalled()
        expect(component.timezones.length).toBeGreaterThan(0);
    })

    it('should display 4 clock', () => {
        const clocksToDisplay = 4;
        fixture.componentRef.setInput('count', clocksToDisplay);
        fixture.detectChanges(); // Trigger change detection
        const clockElement = fixture.debugElement.queryAll(By.css('[data-testid="clock"]'));
        expect(clockElement).toBeTruthy();
        expect(clockElement.length).toEqual(clocksToDisplay);
    })

});