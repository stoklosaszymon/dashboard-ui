import { ComponentFixture, TestBed } from "@angular/core/testing"
import { DashboardComponent } from "./dashboard.component"
import { provideHttpClient } from "@angular/common/http"
import { provideHttpClientTesting } from "@angular/common/http/testing"
import { CoinComponent } from "../widgets/coin/coin.component"
import { By } from "@angular/platform-browser"
import { WidgetWrapperComponent } from "../widget-wrapper/widget-wrapper.component"
import { DashboardService } from "../../dashboard.service"
import { BehaviorSubject, of } from "rxjs"
import { Widget } from "../../types/widget"

ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))
Element.prototype.getAnimations = jest.fn(() => []);

describe('DashboardComponent', () => {
    let component: DashboardComponent
    let fixture: ComponentFixture<DashboardComponent>
    let service: DashboardService
    let dashServiceMock: any

    beforeEach(async () => {
        let newWidgets = [
            { id: 3, name: 'Widget', component: CoinComponent, config: { width: '100px', height: '100px' } },
            { id: 4, name: 'Widget2', component: CoinComponent, config: { width: '100px', height: '100px' } }
        ];

        dashServiceMock = {
            getWidgets: jest.fn().mockReturnValue(of([...newWidgets])),
            editMode$: new BehaviorSubject<boolean>(false).asObservable(),
            widgets$: new BehaviorSubject<Widget[]>([...newWidgets])
        };
        await TestBed.configureTestingModule({
            imports: [WidgetWrapperComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: DashboardService, useValue: dashServiceMock },
            ]
        }).compileComponents()
        fixture = TestBed.createComponent(DashboardComponent)
        component = fixture.componentInstance
        service = TestBed.inject(DashboardService)
    })

    it('should create component', () => {
        expect(component).toBeTruthy()
    })

    it('should display widgets', () => {
        fixture.detectChanges()
        const widgets = fixture.debugElement.queryAll(By.directive(WidgetWrapperComponent))
        expect(widgets.length).toEqual(2)
        expect(service.getWidgets).toHaveBeenCalled()
    })
})