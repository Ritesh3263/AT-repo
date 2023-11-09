import { Component } from '@angular/core';

export interface PeriodicElement {
  tickersymbol: string;
  tickername: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {tickersymbol: 'AAPL', tickername: 'Apple Inc'},
  {tickersymbol: 'AMZ', tickername: 'Amazon'},
  {tickersymbol: 'AAPL', tickername: 'Apple Inc'},
  {tickersymbol: 'AMZ', tickername: 'Amazon'},
  {tickersymbol: 'AAPL', tickername: 'Apple Inc'},
  {tickersymbol: 'AMZ', tickername: 'Amazon'},
  {tickersymbol: 'AAPL', tickername: 'Apple Inc'},
  {tickersymbol: 'AMZ', tickername: 'Amazon'},
  {tickersymbol: 'AAPL', tickername: 'Apple Inc'},
  {tickersymbol: 'AMZ', tickername: 'Amazon'},
  {tickersymbol: 'AAPL', tickername: 'Apple Inc'},
  {tickersymbol: 'AMZ', tickername: 'Amazon'},
];

@Component({
  selector: 'app-delete-symbols',
  templateUrl: './delete-symbols.component.html',
  styleUrls: ['./delete-symbols.component.scss']
})
export class DeleteSymbolsComponent {
  displayedColumns: string[] = ['tickersymbol', 'tickername', 'actions'];
  dataSource = ELEMENT_DATA;
}
