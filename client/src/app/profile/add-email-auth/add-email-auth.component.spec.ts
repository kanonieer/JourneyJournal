import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmailAuthComponent } from './add-email-auth.component';

describe('AddEmailAuthComponent', () => {
  let component: AddEmailAuthComponent;
  let fixture: ComponentFixture<AddEmailAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEmailAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmailAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
