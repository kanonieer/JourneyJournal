import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpLoginComponent } from './sign-up-login.component';

describe('SignUpLoginComponent', () => {
  let component: SignUpLoginComponent;
  let fixture: ComponentFixture<SignUpLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
