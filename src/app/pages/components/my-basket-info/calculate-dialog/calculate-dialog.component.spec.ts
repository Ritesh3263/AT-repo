import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculateDialogComponent } from './calculate-dialog.component';

describe('CalculateDialogComponent', () => {
  let component: CalculateDialogComponent;
  let fixture: ComponentFixture<CalculateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalculateDialogComponent]
    });
    fixture = TestBed.createComponent(CalculateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
