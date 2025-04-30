import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigDialogComponent } from './config-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('ConfigDialogComponent', () => {
  let component: ConfigDialogComponent;
  let fixture: ComponentFixture<ConfigDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigDialogComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations(),
        {
          provide: MatDialogRef,
          useValue: {
            close: (res: any) => { },
            componentInstance: (res: any) => { }
          }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            name: 'test',
            id: '1111',
            dashboardId: 1,
            config: {
              width: '100px',
              height: '100px'
            }
          }
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ConfigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
