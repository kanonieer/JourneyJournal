import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFaceAuthComponent } from './add-face-auth.component';

describe('AddFaceAuthComponent', () => {
  let component: AddFaceAuthComponent;
  let fixture: ComponentFixture<AddFaceAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFaceAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFaceAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
