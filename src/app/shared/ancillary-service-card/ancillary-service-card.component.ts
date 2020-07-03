import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ServiceDetail } from 'src/app/models/service-detail.model';

@Component({
  selector: 'app-ancillary-service-card',
  templateUrl: './ancillary-service-card.component.html',
  styleUrls: ['./ancillary-service-card.component.scss']
})
export class AncillaryServiceCardComponent implements OnInit {

  @Input() serviceDetails: ServiceDetail;
  // tslint:disable-next-line:no-input-rename
  @Input('isAdmin') isUserAdmin?: boolean;
  @Input() isUpdating?: boolean;
  @Input() isSelected?: boolean;
  @Output() cardSelect?: EventEmitter<void> = new EventEmitter<void>();
  @Input() action: ActionType;
  @Input() newPassenger?: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  onSelect() {
    if (this.isUpdating)
      this.cardSelect.emit();
  }
}
export type ActionType = 'ADD' | 'REMOVE';
