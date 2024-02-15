import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBrokeragesComponent } from './admin-brokerages.component';

describe('AdminBrokeragesComponent', () => {
  let component: AdminBrokeragesComponent;
  let fixture: ComponentFixture<AdminBrokeragesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminBrokeragesComponent]
    });
    fixture = TestBed.createComponent(AdminBrokeragesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
