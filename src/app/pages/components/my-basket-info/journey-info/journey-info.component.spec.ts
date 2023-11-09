import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneyInfoComponent } from './journey-info.component';

describe('JourneyInfoComponent', () => {
  let component: JourneyInfoComponent;
  let fixture: ComponentFixture<JourneyInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JourneyInfoComponent]
    });
    fixture = TestBed.createComponent(JourneyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
