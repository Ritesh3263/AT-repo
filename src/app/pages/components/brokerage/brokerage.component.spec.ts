import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerageComponent } from './brokerage.component';

describe('BrokerageComponent', () => {
  let component: BrokerageComponent;
  let fixture: ComponentFixture<BrokerageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrokerageComponent]
    });
    fixture = TestBed.createComponent(BrokerageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
