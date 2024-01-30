import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
// import * as XLSX from 'xlsx';
// import { HttpClient } from '@angular/common/http';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
// import { AdminService } from '../../admin.service';
// import callScriptJs from './script';
declare const TradingView: any;
declare var google: any;


export interface PeriodicElement {
  symbol: string;
  name: string;
  invested: number;
  change: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {symbol: 'TSLA', name: 'Tesla Inc', invested: 1800, change: '2%'},
  {symbol: 'GOOG', name: 'Alphabet Inc', invested: 42000, change: '3.05%'},
  {symbol: 'MSFT', name: 'Microsoft Corp.', invested: 6000, change: '10.2%'},
  {symbol: 'AAPL', name: 'Apple Inc', invested: 5029, change: '6.25%'},
  {symbol: 'NVDA', name: 'Nvidia Corp.', invested: 1150, change: '9.6%'},
  
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {


  displayedColumns: string[] = ['symbol', 'name', 'invested', 'change'];
  dataSource = ELEMENT_DATA;


  public form: FormGroup;

  constructor(private formBuilder: FormBuilder, private _renderer2: Renderer2) {
    this.form = this.formBuilder.group({
      'SymbolChange': ['AAPL']
    })
  }

  @ViewChild('TradingFundamentalDataWidget') TradingFundamentalDataWidget?: ElementRef;
  @ViewChild('TradingCompanyProfileWidget') TradingCompanyProfileWidget?: ElementRef;
  @ViewChild('TradingTechnicalAnalysisWidget') TradingTechnicalAnalysisWidget?: ElementRef;
  @ViewChild('tradingMinChartWidget', { static: true }) tradingMinChartWidget?: ElementRef;

  isLoading: boolean = false;
  tickersOptions:any = [];


  

  /////////////////// For Google Charts //////////////////////////

  drawDonutChart(){
    var data = google.visualization.arrayToDataTable([
      ['Task', 'Hours per Day'],
      ['Tech Industry',     11],
      ['Gold',      2],
      ['Gov-Bonds',  2],
      ['ETF', 2],
      ['MF',    7]
    ]);

    var options = {
      
      backgroundColor: {
        'fill': 'transparent',
        'opacity': 100,
      },
      // title: 'My Daily Activities',
      pieHole: 0.4,
      colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'],
      // is3D: true
    };

    var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
    chart.draw(data, options);
  }

  drawLineChart(){
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Days');
    data.addColumn('number', 'This Basket');

    data.addRows([
      [0, 0],   [1, 10],  [2, 23],  [3, 17],  [4, 18],  [5, 9],
      [6, 11],  [7, 27],  [8, 33],  [9, 40],  [10, 32], [11, 35],
      [12, 30], [13, 40], [14, 42], [15, 47], [16, 44], [17, 48],
      [18, 52], [19, 54], [20, 42], [21, 55], [22, 56], [23, 57],
      [24, 60], [25, 50], [26, 52], [27, 51], [28, 49], [29, 53],
      [30, 55], [31, 60], [32, 61], [33, 59], [34, 62], [35, 65],
      [36, 62], [37, 58], [38, 55], [39, 61], [40, 64], [41, 65],
      [42, 63], [43, 66], [44, 67], [45, 69], [46, 69], [47, 70],
      [48, 72], [49, 68], [50, 66], [51, 65], [52, 67], [53, 70],
      [54, 71], [55, 72], [56, 73], [57, 75], [58, 70], [59, 68],
      [60, 64], [61, 60], [62, 65], [63, 67], [64, 68], [65, 69],
      [66, 70], [67, 72], [68, 75], [69, 80]
    ]);

      

    var options = {
      backgroundColor: {
        'fill': 'transparent'
      },
      chartArea: {
        backgroundColor: {
          fill: 'transparent',
          fillOpacity: 0.1
        },
      },
      chart: {
        
      },
      width: '100%',
      height: 500,
      
    };

    var chart = new google.charts.Line(document.getElementById('line_top_x'));

    chart.draw(data, google.charts.Line.convertOptions(options));
  }

  //////////////////////////////////////////////////////////////


  ngOnInit(): void {

    /////////////////// For Google Charts //////////////////////////

    google.charts.load('current', {packages: ['corechart']});
    google.charts.setOnLoadCallback(this.drawDonutChart);
    google.charts.load('current', {packages:['line']});
    google.charts.setOnLoadCallback(this.drawLineChart);
    // callScriptJs();
    //////////////////////////////////////////////////////////////


    // this.form.controls['SymbolChange'].value
    //   .pipe(
    //     debounceTime(100),
    //     tap(() => (this.isLoading = true)),
    //     switchMap((value) =>

    //       this.adminService    /*** this call is to get auto-completes data**/
    //         .getTickersBySearch(value)
    //         .pipe(finalize(() => {

    //           (this.isLoading = false);
    //         }))
    //     )
    //   )
    //   .subscribe((res:any) => {
    //     if (res.status) {
    //       this.tickersOptions = []
    //       this.tickersOptions = res.data;
    //     }

    //   });
  }
  // onChangeTicker() {
  //       this.companyProfileWidget();
  //   this.fundamentalDataWidget();
  //   this.technicalAnalysisWidget();
  //   this.minChartWidget();

  // }
  // onSelectTicker(value:any){
  //   this.form.controls['SymbolChange'].setValue(value.option.value.ticker_symbol )
  //   this.onChangeTicker()

  // }
  ngAfterViewInit() {

    // this.marketDataWidget();
    this.companyProfileWidget();
    this.fundamentalDataWidget();
    this.technicalAnalysisWidget();
    this.minChartWidget();

  }
  
  fundamentalDataWidget() {
    let elementToRemove =  this.TradingFundamentalDataWidget?.nativeElement;
    elementToRemove.innerHTML = ''
    let input = null;
    input = JSON.stringify(this.form.controls['SymbolChange'].value);

    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-financials.js";
    script.text = `
  {
    "colorTheme": "light",
    "isTransparent": false,
    "largeChartUrl": "",
    "displayMode": "regular",
    "height": 500,
    "symbol": ${input},
    "locale": "en"
  }
  
  `;

    this.TradingFundamentalDataWidget?.nativeElement.appendChild(script);
  }

  script :any;
  companyProfileWidget() {
    let elementToRemove =  this.TradingCompanyProfileWidget?.nativeElement;
    elementToRemove.innerHTML = ''

    let input = null;
    input = JSON.stringify(this.form.controls['SymbolChange'].value);
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js";
    script.text = `
  {
    "height": 500,
    "colorTheme": "light",
    "isTransparent": false,
    "symbol": ${input},
    "locale": "en"
  }
  
  `;

    this.TradingCompanyProfileWidget?.nativeElement.appendChild(script);
  }


  technicalAnalysisWidget() {
    let elementToRemove =  this.TradingTechnicalAnalysisWidget?.nativeElement;
    elementToRemove.innerHTML = ''
    let input = null;
    input = JSON.stringify(this.form.controls['SymbolChange'].value);
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.text = `
  {
    "interval": "1m",
    "isTransparent": false,
    "height": 300,
    "symbol": ${input},
    "showIntervalTabs": true,
    "locale": "en",
    "colorTheme": "light"
  }
  `;

    this.TradingTechnicalAnalysisWidget?.nativeElement.appendChild(script);
  }
  displayFn(user: any) {
    if (user) {
      let name = user.ticker_symbol
      return name;
    }
  }

    /***Market Data Widget***/
    minChartWidget() {
      let elementToRemove =  this.tradingMinChartWidget?.nativeElement;
      elementToRemove.innerHTML = ''
      let input = null;
      input = JSON.stringify(this.form.controls['SymbolChange'].value);
      let script = this._renderer2.createElement('script');
      script.type = `text/javascript`;
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
      script.text = `
    {
      "symbol": ${input},
      "height": 300,
      "locale": "en",
      "dateRange": "12M",
      "colorTheme": "light",
      "isTransparent": false,
      "autosize": false,
      "largeChartUrl": ""
    }`;
  
      this.tradingMinChartWidget?.nativeElement.appendChild(script);
  
    }
  
}
