import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Widget } from './types/widget';
import { provideHttpClient } from '@angular/common/http';
import { WidgetWeatherComponent } from './components/widgets/widget-weather/widget-weather.component';
import { StockWidget } from './components/widgets/stock-widget/stock-widget.component';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DashboardService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle editMode$', () => {
    service.toggleEditMode();
    expect(service.editMode$.getValue()).toBe(true);

    service.toggleEditMode();
    expect(service.editMode$.getValue()).toBe(false);
  });

  it('should fetch widgets and map components correctly', () => {
    const mockWidgets: Widget[] = [
      { id: 1, name: 'Weather Widget', component: '_WidgetWeatherComponent', config: { width: '100px', height: '100px' } },
      { id: 2, name: 'Stock Widget', component: '_StockWidget', config: { width: '100px', height: '100px' } }
    ];

      service.getWidgets().subscribe((widgets: Widget[]) => {
        expect(widgets.length).toBe(2);
        expect(widgets[0].name).toBe('Weather Widget');
        expect(widgets[1].component.name).toBe('_StockWidget');
        expect(widgets[1].component).toBe(StockWidget);
      });

    const req = httpMock.expectOne('http://localhost:3000/widgets');
    expect(req.request.method).toBe('GET');
    req.flush(mockWidgets);
  });

  it('should update widgets via HTTP POST', () => {
    const updatedWidgets: Widget[] = [
      { id: 3, name: 'Updated News Widget', component: '_NewsComponent', config: { width: '100px', height: '100px' } }
    ];

    service.update(updatedWidgets).subscribe((widgets: Widget[]) => {
      expect(widgets.length).toBe(1);
      expect(widgets[0].name).toBe('Updated News Widget');
    });

    const req = httpMock.expectOne('http://localhost:3000/widgets');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(updatedWidgets);
    req.flush(updatedWidgets);
  });
});