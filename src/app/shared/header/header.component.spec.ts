import { LayoutModule, BreakpointObserver } from '@angular/cdk/layout';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { HeaderComponent } from './header.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MaterialModule } from 'src/app/material/material.module';
import { TestUtility } from 'src/app/utilities/test.utility';
import { Logout } from 'src/app/store/actions/auth.actions';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockBreakPointObserver: BreakpointObserver;
  let mockStore: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        NoopAnimationsModule,
        LayoutModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        MaterialModule,
        RouterTestingModule
      ],
      providers: [
        provideMockStore()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    mockBreakPointObserver = TestBed.inject(BreakpointObserver);
    mockStore = TestBed.inject(MockStore);
    mockStore.overrideSelector('user', { isLoggedIn: true, user: TestUtility.setUpUserData() });
    fixture.detectChanges();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch a logout action', () => {
    const spyDispatch = spyOn(mockStore, 'dispatch').and.callFake(() => console.log('Action Dispatched'));
    component.logout();
    expect(spyDispatch).toHaveBeenCalledTimes(1);
    expect(spyDispatch).toHaveBeenCalledWith(new Logout());
  });

});
