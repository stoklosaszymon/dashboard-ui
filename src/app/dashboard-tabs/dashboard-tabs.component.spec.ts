import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTabsComponent } from './dashboard-tabs.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';

ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))
Element.prototype.getAnimations = jest.fn(() => []);

describe('DashboardTabsComponent', () => {
  let component: DashboardTabsComponent;
  let fixture: ComponentFixture<DashboardTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTabsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideAnimations()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
