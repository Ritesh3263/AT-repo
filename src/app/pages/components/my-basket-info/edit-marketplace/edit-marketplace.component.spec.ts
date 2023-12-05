import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMarketplaceComponent } from './edit-marketplace.component';

describe('EditMarketplaceComponent', () => {
  let component: EditMarketplaceComponent;
  let fixture: ComponentFixture<EditMarketplaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditMarketplaceComponent]
    });
    fixture = TestBed.createComponent(EditMarketplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
