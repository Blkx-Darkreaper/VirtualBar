import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.sass']
})
export class CheckboxComponent implements OnInit {
  @Input() labelValue;
  id: string;
  name: string;
  isChecked: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
