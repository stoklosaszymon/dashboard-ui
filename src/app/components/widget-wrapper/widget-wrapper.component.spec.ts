import { ComponentFixture, TestBed } from "@angular/core/testing"
import { WidgetWrapperComponent } from "./widget-wrapper.component"
import { Widget } from "../../types/widget"
import { By } from "@angular/platform-browser"
import { CoinComponent } from "../widgets/coin/coin.component"
import { StockWidget } from "../widgets/stock-widget/stock-widget.component"

ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))
Element.prototype.getAnimations = jest.fn(() => []);
describe('WidgetWrapper', () => {
    let component: WidgetWrapperComponent
    let fixture: ComponentFixture<WidgetWrapperComponent>
    let widget: Widget
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WidgetWrapperComponent]
        })
        fixture = TestBed.createComponent(WidgetWrapperComponent);
        component = fixture.componentInstance
        widget = { id: 3, name: 'Updated News Widget', component: CoinComponent, config: { width: '100px', height: '100px' } }
    })

    it('should create component', () => {
        expect(component).toBeTruthy();
    })

    it('should display component', () => {
        fixture.componentRef.setInput('widget', widget);
        fixture.detectChanges();
        const cmp = fixture.debugElement.query(By.css("[data-testid=component]"));
        expect(cmp).toBeTruthy();
    })

    it('should display toolbar when edit mode is enabled', () => {
        fixture.componentRef.setInput('widget', widget);
        fixture.componentRef.setInput('editMode', true);
        fixture.detectChanges();
        const toolbar = fixture.debugElement.query(By.css("[data-testid=toolbar]"));
        expect(toolbar).toBeTruthy();
    })

    it('should call removeWidget on delete', () => {
        fixture.componentRef.setInput('widget', widget);
        fixture.componentRef.setInput('editMode', true);
        jest.spyOn(component, 'removeWidget')
        fixture.detectChanges();
        fixture.debugElement.query(By.css("[data-testid=delete]")).nativeElement.click();
        expect(component.removeWidget).toHaveBeenCalled();
    })

    it('should emit id on delete', () => {
        fixture.componentRef.setInput('editMode', true);
        fixture.componentRef.setInput('widget', widget);
        jest.spyOn(component.remove, 'emit');
        fixture.detectChanges();
        fixture.debugElement.query(By.css("[data-testid=delete]")).nativeElement.click();
        fixture.detectChanges();
        expect(component.remove.emit).toHaveBeenCalled();
        expect(component.remove.emit).toHaveBeenCalledWith(widget.id)
    })

    it('should set size the same size as a config', () => {
        fixture.componentRef.setInput('editMode', true);
        fixture.componentRef.setInput('widget', widget);
        fixture.detectChanges();
        let wrapper = fixture.nativeElement.querySelector('[data-testid=widget-wrapper]')
        let styles = getComputedStyle(wrapper);
        expect(styles.width).toBe(widget.config.width)
        expect(styles.height).toBe(widget.config.height)
    })
})