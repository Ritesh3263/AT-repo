import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmTradeComponent } from './confirm-trade.component';

describe('ConfirmTradeComponent', () => {
  let component: ConfirmTradeComponent;
  let fixture: ComponentFixture<ConfirmTradeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmTradeComponent]
    });
    fixture = TestBed.createComponent(ConfirmTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
