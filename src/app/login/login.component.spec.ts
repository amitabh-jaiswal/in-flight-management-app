import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { MockStore, provideMockStore, } from '@ngrx/store/testing';
import { MemoizedSelectorWithProps } from '@ngrx/store';
import { AppState } from '../store/state/app.state';
import { User } from '../models/user.model';
import { UserState } from '../store/state/user.state';
import { Props } from '@ngrx/store/src/models';
import { By } from '@angular/platform-browser';
import { LoginStart } from '../store/actions/auth.actions';
import { AuthRequest } from '../models/auth-request';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestUtility } from '../utilities/test.utility';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockStore: MockStore;
  let mockUserSelect: MemoizedSelectorWithProps<AppState, Props<UserState>, UserState>;
  let dispatchSpy;
  // const storeSpy = jasmine.createSpyObj('Store', ['dispatch']);

  function updateForm(email: string, password: string) {
    fixture.componentInstance.loginForm.controls[`email`].setValue(email);
    fixture.componentInstance.loginForm.controls[`password`].setValue(password);
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        NoopAnimationsModule
      ],
      declarations: [LoginComponent],
      providers: [provideMockStore()]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    mockUserSelect = mockStore.overrideSelector('user', { isLoggedIn: true, user: TestUtility.setUpUserData() });
    dispatchSpy = spyOn(mockStore, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login sucessfully', fakeAsync(() => {
    updateForm('test@gocraft.com', 'password1234');
    fixture.detectChanges();
    expect(fixture.componentInstance.loginForm.controls[`email`].value).toBe('test@gocraft.com');
    expect(fixture.componentInstance.loginForm.controls[`password`].value).toBe('password1234');
    fixture.componentInstance.onSubmit();
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new LoginStart(new AuthRequest('test@gocraft.com', 'password1234'))
    );
  }));

  it('should not login with invalid input', fakeAsync(() => {
    fixture.componentInstance.onSubmit();
    expect(dispatchSpy).toHaveBeenCalledTimes(0);
  }));

});
