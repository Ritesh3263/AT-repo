import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBasketComponent } from './delete-basket.component';

describe('DeleteBasketComponent', () => {
  let component: DeleteBasketComponent;
  let fixture: ComponentFixture<DeleteBasketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteBasketComponent]
    });
    fixture = TestBed.createComponent(DeleteBasketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
