import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import * as XLSX from 'xlsx';
// import { HttpClient } from '@angular/common/http';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { BasketsService } from 'src/app/services/baskets.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { JourneyInfoComponent } from '../journey-info/journey-info.component';
// import { AdminService } from '../../admin.service';
declare const TradingView: any;
declare const google: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  public form: FormGroup;
  length = 0;
  pageSize = 10;
  pageIndex = 0;
  basketId: number = 0;
  currentDate: Date = new Date();

  constructor(@Inject(JourneyInfoComponent) private parentComponent: JourneyInfoComponent, private formBuilder: FormBuilder, private _renderer2: Renderer2, private utilityService: UtilitiesService, private basketService: BasketsService) {
    this.form = this.formBuilder.group({
      'SymbolChange': ['AAPL']
    })
  }

  @ViewChild('TradingFundamentalDataWidget') TradingFundamentalDataWidget?: ElementRef;
  @ViewChild('TradingCompanyProfileWidget') TradingCompanyProfileWidget?: ElementRef;
  @ViewChild('TradingTechnicalAnalysisWidget') TradingTechnicalAnalysisWidget?: ElementRef;
  @ViewChild('tradingMinChartWidget', { static: true }) tradingMinChartWidget?: ElementRef;

  isLoading: boolean = false;
  tickersOptions: any = [];


  ngOnInit(id = null): void {
    this.basketId = id || this.parentComponent.getBasketId();
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.load('current', { 'packages': ['line'] });
    google.charts.load('current', { 'packages': ['bar'] });

    this.getBasketSymbols();
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
    let elementToRemove = this.TradingFundamentalDataWidget?.nativeElement;
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

  script: any;
  companyProfileWidget() {
    let elementToRemove = this.TradingCompanyProfileWidget?.nativeElement;
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
    let elementToRemove = this.TradingTechnicalAnalysisWidget?.nativeElement;
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
    let elementToRemove = this.tradingMinChartWidget?.nativeElement;
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
  /**
     * drawChart function is used to create Piechart
     * @param symbols is like array symbols
     */

  array: any[] = []
  drawChart(symbols: any) {
    this.array.push(['Task', 'Hours per Day'])
    symbols.forEach((ele: any) => {
      this.array.push([ele.symbol, Math.floor(Math.random() * 10) + 1]);
    })

    var data = google.visualization.arrayToDataTable(this.array);

    var options = {
      title: 'My Daily Activities'
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
  }
  /**
     * drawLineChart function is used to create LineChart
     * @param symbols is like array symbols
     */

  drawLineChart(symbols: any) {


    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Day');
    symbols.forEach((ele: any) => {
      data.addColumn('number', ele.symbol);
    })
    var lineRowData: any[] = []
    /**index forloop */
    for (let i = 1; i <= 10; i++) {
      var lineColumnData: number[] = []
      lineColumnData.push(i)
      symbols.forEach((ele: any) => {
        lineColumnData.push(Math.floor(Math.random() * 100) + 1)
      })
      lineRowData.push(lineColumnData)
    }
    data.addRows(lineRowData);

    var options = {
      chart: {
        title: 'Symbols',
        subtitle: 'in millions of dollars (USD)'
      },
      axes: {
        x: {
          0: { side: 'top' }
        }
      }
    };

    var chart = new google.charts.Line(document.getElementById('line_top_x'));

    chart.draw(data, google.charts.Line.convertOptions(options));
  }

  /**
   * getBasketSymbols get symbols by basket Id
   * @param resetPage 
   */
  getBasketSymbols(resetPage = false) {
    if (resetPage) {
      this.pageIndex = 0;
      this.length = 0;
    }
    this.basketService.getSymbols(this.basketId, this.pageIndex, this.pageSize).then((data) => {
      if (data.error || !data.symbols) {
        this.utilityService.displayInfoMessage(data.error, true)
      }
      else {

        google.charts.setOnLoadCallback(this.drawChart(data.symbols));
        google.charts.setOnLoadCallback(this.drawLineChart(data.symbols));
        google.charts.setOnLoadCallback(this.drawWaterFallChart(data.symbols));
        google.charts.setOnLoadCallback(this.drawBarchartChart(data.symbols));


      }
    })
  }

  /**
   * drawWaterFallChart function is used to create waterFallChart
   * @param symbols is like array symbols
   */

  drawWaterFallChart(symbols: any) {
    var array: any[] = [];
    symbols.forEach((ele: any) => {
      array.push([ele.symbol, Math.floor(Math.random() * 100) + 1, Math.floor(Math.random() * 100) + 1, Math.floor(Math.random() * 100) + 1, Math.floor(Math.random() * 100) + 1])
    })
    var data = google.visualization.arrayToDataTable(array, true);

    var options = {
      legend: 'none',
      bar: { groupWidth: '100%' }, // Remove space between bars.
      candlestick: {
        fallingColor: { strokeWidth: 0, fill: '#a52714' }, // red
        risingColor: { strokeWidth: 0, fill: '#0f9d58' }   // green
      }
    };
    var chart = new google.visualization.CandlestickChart(document.getElementById('chart_div'));

    chart.draw(data, options);
  }
  /**
   * drawBarchartChart function is used to create barchart
   * @param symbols is like array symbols
   */

  drawBarchartChart(symbols: any) {
    var array: any[] = [['symbol', this.getDate(0), this.getDate(1), this.getDate(2)]]
    symbols.forEach((ele: any) => {
      array.push([ele.symbol, Math.floor(Math.random() * 1000) + 1, Math.floor(Math.random() * 1000) + 1, Math.floor(Math.random() * 1000) + 1])

    })
    var data = google.visualization.arrayToDataTable(array);

    var options = {
      chart: {
        title: 'Symbol Prices',
      },
      bars: 'horizontal' // Required for Material Bar Charts.
    };

    var chart = new google.charts.Bar(document.getElementById('barchart_material'));

    chart.draw(data, google.charts.Bar.convertOptions(options));
  }

  /**
   * getDate function is returns dates
   * @param day is like 0,1,2 
   * @returns today, yesterday, dayafter yesterday
   */

  getDate(day: number): string {
    const today = new Date();
    const yesterday = new Date(today);
    if (day != 0) {
      yesterday.setDate(today.getDate() - day);
    }
    // Format the date as "yyyy-MM-dd"
    const formattedDate = this.formatDate(yesterday);
    return formattedDate;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}
