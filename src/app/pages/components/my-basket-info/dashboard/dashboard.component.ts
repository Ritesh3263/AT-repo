import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import * as XLSX from 'xlsx';
// import { HttpClient } from '@angular/common/http';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
// import { AdminService } from '../../admin.service';
declare const TradingView: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
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


  ngOnInit(): void {

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
    "width": 500,
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
    "width": 500,
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
    "width": 500,
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
      "width": 500,
      "height": 260,
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
