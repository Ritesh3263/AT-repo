import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSymbolsComponent } from './edit-symbols.component';

describe('EditSymbolsComponent', () => {
  let component: EditSymbolsComponent;
  let fixture: ComponentFixture<EditSymbolsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditSymbolsComponent]
    });
    fixture = TestBed.createComponent(EditSymbolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
