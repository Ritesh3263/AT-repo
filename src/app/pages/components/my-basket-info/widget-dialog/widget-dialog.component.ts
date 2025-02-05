import { Component, ElementRef, ViewChild ,AfterViewInit, Renderer2,Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-widget-dialog',
  templateUrl: './widget-dialog.component.html',
  styleUrls: ['./widget-dialog.component.scss']
})
export class WidgetDialogComponent implements AfterViewInit {
  @ViewChild('TradingFundamentalDataWidget') TradingFundamentalDataWidget?: ElementRef;
  @ViewChild('TradingCompanyProfileWidget') TradingCompanyProfileWidget?: ElementRef;
  @ViewChild('TradingTechnicalAnalysisWidget') TradingTechnicalAnalysisWidget?: ElementRef;
  @ViewChild('tradingMinChartWidget', { static: true }) tradingMinChartWidget?: ElementRef;
  @ViewChild('tradingSymbolInfoWidget') tradingSymbolInfoWidget?: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private _renderer2: Renderer2) {  }

  ngAfterViewInit() {

    // this.marketDataWidget();
    this.companyProfileWidget();
    this.fundamentalDataWidget();
    this.technicalAnalysisWidget();
    this.minChartWidget();
    this.symbolInfoWidget();

  }

  fundamentalDataWidget() {
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
    "symbol": ${JSON.stringify(this.data.symbol)},
    "locale": "en"
  }

  `;

    this.TradingFundamentalDataWidget?.nativeElement.appendChild(script);

}


companyProfileWidget() {
  let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js";
    script.text = `
  {
    "height": 500,
    "colorTheme": "light",
    "isTransparent": false,
    "symbol": ${JSON.stringify(this.data.symbol)},
    "locale": "en"
  }

  `;

    this.TradingCompanyProfileWidget?.nativeElement.appendChild(script);
  }


  technicalAnalysisWidget() {
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.text = `
  {
    "interval": "1m",
    "isTransparent": false,
    "height": 300,
    "symbol": ${JSON.stringify(this.data.symbol)},
    "showIntervalTabs": true,
    "locale": "en",
    "colorTheme": "light"
  }
  `;

    this.TradingTechnicalAnalysisWidget?.nativeElement.appendChild(script);

  }

    /***Market Data Widget***/
    minChartWidget() {
      let script = this._renderer2.createElement('script');
      script.type = `text/javascript`;
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
      script.text = `
    {
      "symbol": ${JSON.stringify(this.data.symbol)},
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


    symbolInfoWidget() {
      let script = this._renderer2.createElement('script');
      script.type = `text/javascript`;
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js";
      script.text = `
    {
      "symbol": ${JSON.stringify(this.data.symbol)},
      "height": "500",
      "locale": "en",
      "colorTheme": "light",
      "isTransparent": false
    }


    `;

      this.tradingSymbolInfoWidget?.nativeElement.appendChild(script);


    }
}
