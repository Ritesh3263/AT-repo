import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectDialogComponent } from './connect-dialog.component';

describe('ConnectDialogComponent', () => {
  let component: ConnectDialogComponent;
  let fixture: ComponentFixture<ConnectDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectDialogComponent]
    });
    fixture = TestBed.createComponent(ConnectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
