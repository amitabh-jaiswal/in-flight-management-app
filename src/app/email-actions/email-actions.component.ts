import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-email-actions',
  templateUrl: './email-actions.component.html',
  styleUrls: ['./email-actions.component.scss']
})
export class EmailActionsComponent implements OnInit {

  mode: string

  constructor(private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._route.queryParamMap.subscribe((params) => {
      if (params.has('mode')) {
        this.mode = params.get('mode');
      }
    });
  }
}
