import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSymbolsComponent } from './delete-symbols.component';

describe('DeleteSymbolsComponent', () => {
  let component: DeleteSymbolsComponent;
  let fixture: ComponentFixture<DeleteSymbolsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteSymbolsComponent]
    });
    fixture = TestBed.createComponent(DeleteSymbolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
