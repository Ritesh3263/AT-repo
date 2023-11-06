import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBasketComponent } from './create-basket.component';

describe('CreateBasketComponent', () => {
  let component: CreateBasketComponent;
  let fixture: ComponentFixture<CreateBasketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateBasketComponent]
    });
    fixture = TestBed.createComponent(CreateBasketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
