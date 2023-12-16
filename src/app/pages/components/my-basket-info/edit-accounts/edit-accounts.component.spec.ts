import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAccountsComponent } from './edit-accounts.component';

describe('EditAccountsComponent', () => {
  let component: EditAccountsComponent;
  let fixture: ComponentFixture<EditAccountsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditAccountsComponent]
    });
    fixture = TestBed.createComponent(EditAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
