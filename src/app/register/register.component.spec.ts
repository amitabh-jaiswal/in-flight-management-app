import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { MemoizedSelectorWithProps } from '@ngrx/store';
import { AppState } from '../store/state/app.state';
import { Props } from '@ngrx/store/src/models';
import { UserState } from '../store/state/user.state';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { User } from '../models/user.model';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthRequest } from '../models/auth-request';
import { SignUpStart } from '../store/actions/auth.actions';
import { MaterialModule } from '../material/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestUtility } from '../utilities/test.utility';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockStore: MockStore;
  let dispatchSpy: any;
  let mockUserSelect: MemoizedSelectorWithProps<AppState, Props<UserState>, UserState>;

  function updateForm(email: string, password: string, confirmPassword: string) {
    fixture.componentInstance.registerForm.controls[`email`].setValue(email);
    fixture.componentInstance.registerForm.controls[`password`].setValue(password);
    fixture.componentInstance.registerForm.controls[`confirmPassword`].setValue(confirmPassword);
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        NoopAnimationsModule
      ],
      declarations: [RegisterComponent],
      providers: [provideMockStore()]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    mockUserSelect = mockStore.overrideSelector('user', { isLoggedIn: true, user: TestUtility.setUpUserData() });
    dispatchSpy = spyOn(mockStore, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register', fakeAsync(() => {
    updateForm('test@gocraft.com', 'password1234', 'password1234');
    expect(fixture.componentInstance.registerForm.controls[`email`].value).toBe('test@gocraft.com');
    expect(fixture.componentInstance.registerForm.controls[`password`].value).toBe('password1234');
    expect(fixture.componentInstance.registerForm.controls[`confirmPassword`].value).toBe('password1234');
    fixture.detectChanges();
    fixture.componentInstance.onSubmit();
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new SignUpStart(new AuthRequest('test@gocraft.com', 'password1234'))
    );
  }));

  it('should not register with invalid input', fakeAsync(() => {
    fixture.componentInstance.onSubmit();
    expect(dispatchSpy).toHaveBeenCalledTimes(0);
  }));

});
