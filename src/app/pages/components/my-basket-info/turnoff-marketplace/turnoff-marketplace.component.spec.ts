import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoffMarketplaceComponent } from './turnoff-marketplace.component';

describe('TurnoffMarketplaceComponent', () => {
  let component: TurnoffMarketplaceComponent;
  let fixture: ComponentFixture<TurnoffMarketplaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TurnoffMarketplaceComponent]
    });
    fixture = TestBed.createComponent(TurnoffMarketplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
