import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreJourneyComponent } from './explore-journey.component';

describe('ExploreJourneyComponent', () => {
  let component: ExploreJourneyComponent;
  let fixture: ComponentFixture<ExploreJourneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreJourneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
