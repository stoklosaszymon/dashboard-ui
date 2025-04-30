import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DashboardTabsComponent } from './dashboard-tabs.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DashboardService } from '../dashboard.service';
import { By } from '@angular/platform-browser';
import { TabsService } from './tabs.service';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { CoinComponent } from '../components/widgets/coin/coin.component';
import { TabDirective } from './tab.directive';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Widget } from '../types/widget';

ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))
Element.prototype.getAnimations = jest.fn(() => []);

describe('DashboardTabsComponent', () => {
  let component: DashboardTabsComponent;
  let fixture: ComponentFixture<DashboardTabsComponent>;
  let dashServiceMock: any
  let tabServiceMock: any
  let editModeSubject: BehaviorSubject<boolean>

  beforeEach(() => {
    let widgets = [
      { id: 3, name: 'Widget', component: CoinComponent, config: { width: '100px', height: '100px' } },
      { id: 4, name: 'Widget2', component: CoinComponent, config: { width: '100px', height: '100px' } }
    ];

    editModeSubject = new BehaviorSubject<boolean>(true);
    dashServiceMock = {
      getWidgets: jest.fn().mockReturnValue(of([...widgets])),
      editMode$: editModeSubject.asObservable(),
      widgets$: new BehaviorSubject<Widget[]>([]) 
    };

    tabServiceMock = {
      tabCreated: new Subject(),
      getTabs: jest.fn().mockReturnValue(of([{ id: 1, name: 'Tab1' }, { id: 2, name: 'Tab2' }])),
      updateTab: jest.fn().mockReturnValue(of({ id: 1, name: 'newTab' }))
    };

    fixture = TestBed.configureTestingModule({
      imports: [DashboardTabsComponent, TabDirective],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations(),
        { provide: DashboardService, useValue: dashServiceMock },
        { provide: TabsService, useValue: tabServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).createComponent(DashboardTabsComponent)
     
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call get tabs', () => {
    fixture.detectChanges();
    jest.spyOn(tabServiceMock, 'getTabs')
    expect(tabServiceMock.getTabs).toHaveBeenCalled();
  })

  it('should display editable label when edit mode is on', () => {
    fixture.detectChanges();
    let tabs = fixture.debugElement.query(By.css('[data-testid=editable]'))
    expect(tabs).toBeTruthy();
  })

  it('should display noraml labels when edit mode is off', () => {
    editModeSubject.next(false)
    fixture.detectChanges();
    let tabs = fixture.debugElement.query(By.css('[data-testid=uneditable]'))
    expect(component.isEditMode()).toEqual(false);
    expect(tabs).toBeTruthy();
  })

  it('should call update tab on input change', fakeAsync( () => {
    fixture.detectChanges();
    let tabs = fixture.debugElement.queryAll(By.directive(TabDirective))
    expect(tabs.length).toEqual(2)
    let tab = tabs[0].nativeElement;
    tab.innerHTML = 'new name'
    tab.dispatchEvent(new Event('input'));
    tick(600)
    expect(tabServiceMock.updateTab).toHaveBeenCalledWith({id: 1, name: 'new name'})

  }))

})
