import { LocationStrategy } from '@angular/common';
import { Component } from '@angular/core';
import { BasketTradeService } from 'src/app/services/basket-trade.service';
import { BrokerageService } from 'src/app/services/brokerage.service';
import {MatExpansionModule} from '@angular/material/expansion';
declare var google: any;

export interface PeriodicElement {
  account: string;
  name: string;
  invested: number;
  change: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {account: '5465d44ssd55', name: 'Tesla Inc', invested: 1800, change: '2%'},
  {account: '454d5sd56454d', name: 'Alphabet Inc', invested: 42000, change: '3.05%'},
  {account: 'sdad4545645d', name: 'Microsoft Corp.', invested: 6000, change: '10.2%'},
  {account: '754sdsds1213', name: 'Apple Inc', invested: 5029, change: '6.25%'},
  {account: '778954dsds52', name: 'Nvidia Corp.', invested: 1150, change: '9.6%'},
  
];


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  state:any;
constructor(private basketTradeService:BasketTradeService,private location:LocationStrategy,private brokerageService:BrokerageService){
 /* user details through route */
 this.state = this.location.getState();
 if(this.state && this.state.user){
        /***getSync service is used for sync position,accounts and orders*/
    this.brokerageService.getSync().then((data: any) => {}); //  (TODO--Multiple brokerage handling) 
}

}
displayedColumns: string[] = ['account', 'name', 'invested', 'change'];
dataSource = ELEMENT_DATA;


drawLineChart() {

  var data = new google.visualization.DataTable();
  data.addColumn('number', 'December 2023');
  data.addColumn('number', 'Basket 1');
  data.addColumn('number', 'Basket 2');
  data.addColumn('number', 'Basket 3');

  data.addRows([
   
    [1,  4.8,  6.3,  3.6],
    [2,  4.2,  6.2,  3.4],
    [3,  6.6,  8.4,  5.2],
    [4,  5.3,  7.9,  4.7],
    [5, 12.8, 30.9, 11.6],
    [6,  16.9, 42.9, 14.8],
    [7,  12.3, 29.2, 10.6],
    [8,   7.6, 12.3,  9.6],
    [9,   8.8, 13.6,  7.7],
    [10,  11.9, 17.6, 10.4],
    [11,  11.7, 18.8, 10.5],
    [12,  25.4,   57, 25.7],
    [13,  30.9, 69.5, 32.4],
    [14,  37.8, 80.8, 41.8]
  ]);

  var options = {
   
    // hAxis: {gridlineColor: '#000'},
    vAxis: {gridlines: { color: 'transparent'},
    },
    // hAxis: {
    //   baseline: 1,
    //   baselineColor: 'blue'
    // },
    backgroundColor: {
      'fill': 'transparent',
      'opacity': 100,
    },
    chartArea: {
      backgroundColor: {
        fill: 'transparent',
        fillOpacity: 0.1
      },
    },
    chart: {
      /* title: 'Box Office Earnings in First Two Weeks of Opening',
      subtitle: 'in millions of dollars (USD)' */
    },
    // width: 1200,
    height: 400
  };

  var chart = new google.charts.Line(document.getElementById('linechart_material'));

  chart.draw(data, google.charts.Line.convertOptions(options));
}
ngOnInit(): void {
  google.charts.load('current', {'packages':['line']});
  google.charts.setOnLoadCallback(this.drawLineChart);
}


}
