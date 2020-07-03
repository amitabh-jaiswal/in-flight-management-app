import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AncillaryServiceCardComponent } from './ancillary-service-card.component';
import { MatCardModule } from '@angular/material/card';
import { TestUtility } from 'src/app/utilities/test.utility';
import { By } from '@angular/platform-browser';
import { MaterialModule } from 'src/app/material/material.module';

describe('AncillaryServiceCardComponent', () => {
  let component: AncillaryServiceCardComponent;
  let fixture: ComponentFixture<AncillaryServiceCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule],
      declarations: [AncillaryServiceCardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AncillaryServiceCardComponent);
    component = fixture.componentInstance;
    component.action = 'ADD';
    component.serviceDetails = TestUtility.setUpServiceData();
    component.isUserAdmin = false;
    component.isUpdating = true;
    component.isSelected = false;
    component.newPassenger = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit select event', () => {
    let called = false;
    component.cardSelect.subscribe(() => { called = !called; });
    fixture.debugElement.query(By.css('.mat-card')).nativeElement.click();
    expect(called).toBeTruthy();
  });

});
