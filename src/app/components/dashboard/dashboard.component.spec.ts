import { ComponentFixture, TestBed } from "@angular/core/testing"
import { DashboardComponent } from "./dashboard.component"
import { provideHttpClient } from "@angular/common/http"
import { provideHttpClientTesting } from "@angular/common/http/testing"
import { CoinComponent } from "../widgets/coin/coin.component"
import { By } from "@angular/platform-browser"
import { WidgetWrapperComponent } from "../widget-wrapper/widget-wrapper.component"
import { DashboardService } from "../../dashboard.service"
import { of } from "rxjs"

ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))
Element.prototype.getAnimations = jest.fn(() => []);

describe('DashboardComponent', () =>{
    let component: DashboardComponent
    let fixture: ComponentFixture<DashboardComponent>
    let service: DashboardService

    beforeEach( async () => {
        await TestBed.configureTestingModule({
            imports: [WidgetWrapperComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                DashboardService
            ]
        }).compileComponents()
        fixture = TestBed.createComponent(DashboardComponent)
        component = fixture.componentInstance
        service = TestBed.inject(DashboardService)
    })

    it('should create component', () => {
        expect(component).toBeTruthy()
    })

    it('should display components', () => {
        let newWidgets = [
            { id: 3, name: 'Widget', component: CoinComponent, config: { width: '100px', height: '100px' } },
            { id: 4, name: 'Widget2', component: CoinComponent, config: { width: '100px', height: '100px' } }
        ];
        jest.spyOn(service, 'getWidgets').mockReturnValue(of(newWidgets))
        fixture.detectChanges()
        const widgets = fixture.debugElement.queryAll(By.directive(WidgetWrapperComponent))
        expect(widgets.length).toEqual(newWidgets.length)
        expect(service.getWidgets).toHaveBeenCalled()
    })
})