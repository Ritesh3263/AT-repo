import { Component } from '@angular/core';

export interface PeriodicElement {
  tickersymbol: string;
  tickername: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {tickersymbol: 'Amazon', tickername: 'Amazon'},
  {tickersymbol: 'Google', tickername: 'Google'},
  {tickersymbol: 'Amazon', tickername: 'Amazon'},
  {tickersymbol: 'Google', tickername: 'Google'},
  {tickersymbol: 'Amazon', tickername: 'Amazon'},
  {tickersymbol: 'Google', tickername: 'Google'},
];

@Component({
  selector: 'app-add-symbols',
  templateUrl: './add-symbols.component.html',
  styleUrls: ['./add-symbols.component.scss']
})
export class AddSymbolsComponent {
  displayedColumns: string[] = ['tickersymbol', 'tickername', 'actions'];
  dataSource = ELEMENT_DATA;
}
