import { AfterViewInit, Component, Inject, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmTradeComponent } from '../confirm-trade/confirm-trade.component';
import { CalculateDialogComponent } from '../calculate-dialog/calculate-dialog.component';
import { BasketTradeService } from '../../../../services/basket-trade.service';
import { FormControl, Validators, FormBuilder, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { WebsocketService } from 'src/app/services/websocket.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { BasketsService } from 'src/app/services/baskets.service';
import { JourneyInfoComponent } from '../journey-info/journey-info.component';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { BrokerageService } from 'src/app/services/brokerage.service';
import { UserService } from 'src/app/services/user.service';

export interface PeriodicElement {
  symbol: string;
  shares: number;
  new_shares: number;
  price: number,
  transaction_type: string,
  invested: number,
  reBalance: number
  new_invested: number
}

// const ELEMENT_DATA: PeriodicElement[] = [
//   {ticker_id: 'TSLA', purchase_date: '2023/10/18', current_cost: 300.000, new_cost: 25, price: 350.00, current_shares: 10, new_shares: 10, current_invested: 3000.000, new_invested: +3500.00, current_market_value: 3500.000, new_market_value: +3500, p_l_amount: 0.000, p_l_percent: 0.000},
//   {ticker_id: 'AAPL', purchase_date: '2023/10/18', current_cost: 200.000, new_cost: 0, price: 250.00, current_shares: 15, new_shares: 10, current_invested: 2500.000, new_invested: +2500.00, current_market_value: 3750.000, new_market_value: +2500.00, p_l_amount: 0.000, p_l_percent: 0.000},
// ];

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ backgroundColor: 'lightgreen', }),
        animate(5000)
      ]),
    ]),
  ],
  styleUrls: ['./trade.component.scss']
})
export class TradeComponent implements AfterViewInit, OnDestroy {
  isPositions: boolean = false;
  showSpinner: boolean = false;
  user_id: any = null;
  displayedColumns: string[] = ['select', 'symbol', 'price','cost', 'shares', 'invested'];
  form: FormGroup = new FormGroup(''); // FormGroup
  dropDownDetails = ["Equal Distribution", "Investment Per stock", "Scale Up", "Scale Down"]
  // displayedColumns: string[] = ['select', 'symbol', 'purchasedate', 'costcurrent', 'costnew', 'price', 'sharescurrent', 'sharesnew', 'investedcurrent', 'investednew', 'marketcurrent', 'marketnew', 'pl', 'plpercent'];
  // displayedColumnsOne: string[] = ['select', 'symbol', 'purchasedate', 'costcurrent', 'price', 'sharescurrent', 'investedcurrent', 'marketcurrent', 'pl', 'plpercent'];
  cash_balance: any = 0.00;
  account_balance: any = 0.00;
  invested: any = 0.00;
  market_value: any = 0.00;
  length = 0;
  pageSize = 0;
  pageIndex = 0;
  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  isDisplayColumn: boolean = true;
  isOne: boolean = true;
  symbols: any = []
  isReBalance: boolean = false;
  linkedAccount: any = {}
  basket: any = {}
  isRebalanceButtonDisableOrEnable: boolean = true;
  isClosePositionsButtonDisabledOrEnabled: boolean = true;
  activeBrokerages:any;
  brokerageIsDisconnected:boolean = true;
  closePositionsButtonClicked:boolean =false;
  RebalanceButtonClicked:boolean =false;
  Number: any = Number;
  isTradeStation:boolean=true;
  isAmountChange:boolean = false;

  constructor(private fb: FormBuilder, private renderer: Renderer2, public dialog: MatDialog, private basketTradeService: BasketTradeService, private webSocketService: WebsocketService, private basketService: BasketsService, @Inject(JourneyInfoComponent) private parentComponent: JourneyInfoComponent, private utilityService: UtilitiesService, private brokerageService: BrokerageService, private userService: UserService) {
    // this.getAccountBasketPosition();
    // this.getBrokerageAccountPosition();
    this.form = this.fb.group({
      investmentType: new FormControl({ value: '', disabled: true }, Validators.required),
      percent: new FormControl({ value: '', disabled: true }, Validators.required),
      amount: new FormControl({ value: '', disabled: true }, Validators.required)
    })
  }
  symbolInput: any = [];
  originalData: any = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  basketId: number = 0;


  ngAfterViewInit(id = null) {
    //this.webSocketService.connect('ws/intrinio').then((data)=>{})
    //this.webSocketService.receiveMessages().then((data)=>{})
    /**continues receiving response from websocket*/
    //   this.webSocketService.getMessages().subscribe((message: any) => {
    //     if(!JSON.parse(message).error){
    //     this.dataSource.data.forEach((ele:any)=>{
    //       if(message && ele.symbol === JSON.parse(message).symbol){
    //         ele.price =JSON.parse(message).latest_price;
    //       }
    //     })
    //   }
    // });


  }

  async ngOnInit(id = null) {
    this.basketId = id || this.parentComponent.getBasketId();
    this.basketService.updateBasketSymbolPrices(this.basketId)
    this.basket = await this.parentComponent.getBasket()

    if(this.basket.broker_code){
       // if condition is to check if brokerage is connected
      this.activeBrokerages = await this.brokerageService.getBrokerages();
      if(this.activeBrokerages.success && this.activeBrokerages.brokerages.length){
        this.brokerageIsDisconnected = this.activeBrokerages.brokerages.some((obj:any) => obj.active_brokerage_key === this.basket.broker_code);
      }
    }
    // Get account linked to basket to get broker code
    let data = await this.basketService.getBasketAccounts(this.basketId)
    if (data && data.success && data.accounts && data.accounts.length) {
      let account = this.linkedAccount = data.accounts[0];
      if (account.brokerageAccountData && account.brokerageAccountData.Accounts && account.brokerageAccountData.Accounts.length) {
        if(this.basket.broker_code && account.broker_code === this.basket.broker_code){
          account.brokerageAccountData.Accounts.forEach((ele:any)=>{
            if(this.basket.account === ele.AccountID){
              this.isTradeStation =true
              this.account_balance = Number(ele.BuyingPower);
              this.cash_balance = Number(ele.CashBalance);
            }
          })
        }else{
          this.isTradeStation =false;;
          this.account_balance = Number(account.brokerageAccountData.Accounts[0].BuyingPower);
          this.cash_balance = Number(account.brokerageAccountData.Accounts[0].CashBalance);
        }
       
      }
    }
    
    this.getSymbolsAlongWithPosition();
    // this.dataSource.paginator = this.paginator;
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.checkedFunction();
      return;
    }
    this.selection.select(...this.dataSource.data);
    this.checkedFunction();

  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.price + 1}`;
  }

  getChangeStyle(costnew: number): string {
    if (costnew > 0) {
      return 'positive-value'; // CSS class for positive values
    } else if (costnew < 0) {
      return 'negative-value'; // CSS class for negative values
    } else {
      return ''; // No special style for zero values
    }
  }

  confirmTrade() {
    // this.webSocketService.closeConnection();
    var inputArray = this.selection.selected.filter(element => element.new_shares !==  0 );
    if(inputArray.length >0){
    let inputModelPopup = {
      account_balance: this.account_balance,
      cash_balance: Number(this.cash_balance),
      basket_id: this.basketId,
      linkedAccount: this.linkedAccount,
      transaction_id: null,
      symbols: inputArray
    }

    const dialogRef = this.dialog.open(ConfirmTradeComponent, {
      panelClass: 'custom-modal',
      disableClose: true,
      data: inputModelPopup
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.isReBalance = false;
      if (result) {
        this.form.reset(); // Reset to initial form values
        this.closePositionsButtonClicked =false;
        this.RebalanceButtonClicked =false;
        this.displayedColumns = ['select', 'symbol', 'price','cost', 'shares', 'invested'];
        this.isDisplayColumn=false;
        this.getLinkedAccount();
        // this.getSymbolsAlongWithPosition(this.isTradeStation);
        // this.webSocketService.connect('ws/intrinio').then((data)=>{})
      }
    });
  }
  else{
      this.utilityService.displayInfoMessage("Total new invested amount should be grater then zero", true)
  }
  }

  calculateDialog() {
    this.isDisplayColumn = true;
    this.displayedColumns = ['select', 'symbol', 'price',"cost", 'shares', 'new_shares', 'invested', 'new_invested'];
    this.selection.selected.forEach((element: any) => {
    if (element.new_shares == 0) {
    this.unselectRow(element)
    }
    });
    // this.dialog.open(CalculateDialogComponent, {
    //   panelClass: 'custom-modal',
    //   disableClose: true
    // });
  }
  //  async getAccountBasketPosition(){
  //   this.showSpinner= true;
  //     this.basketTradeService.getAccountBasketPosition(1).then((data) => {
  //       this.showSpinner =false;
  //       if(data) {
  //         this.displayedColumns = ['select', 'symbol', 'purchasedate', 'costcurrent', 'price', 'sharescurrent', 'investedcurrent', 'marketcurrent', 'pl', 'plpercent'];
  //         for(let i=0;i<data.length;i++){
  //           data[i].current_market_value =Number((data[i].price*data[i].current_shares).toFixed(2))
  //           // if(i==0){
  //           //   this.symbolInput = data[i].ticker_id;
  //           // }else{
  //           //   this.symbolInput = this.symbolInput+','+data[i].ticker_id;
  //           // }
  //           this.isPositions=true
  //           this.dataSource.data= data
  //           this.isDisplayColumn =false;
  //         }
  //         // this.getSymbolPrice();
  //         // this.basket = data.basket;
  //         // this.dataSource = new MatTableDataSource<PeriodicElement>(this.basket.tickers);
  //       }
  //     })
  //   }

  // async getBrokerageAccountPosition(){
  //   this.showSpinner= true;
  //     this.basketTradeService.getBrokerageAccountPosition('ts','Sreekanth','SIM1213784M').then((data) => {
  //       this.showSpinner =false;
  //       if(data){
  //         this.displayedColumns = ['select', 'symbol', 'purchasedate', 'costcurrent', 'price', 'sharescurrent', 'investedcurrent', 'marketcurrent', 'pl', 'plpercent'];
  //         data.Positions.forEach((ele:any)=>{
  //           this.symbolInput.push(ele.Symbol);
  //           ele.new_cost=null;
  //           ele.current_cost=Number(ele.TotalCost)/Number(ele.Quantity);
  //           ele.purchase_date=ele.Timestamp
  //           ele.ticker_id=ele.Symbol;
  //           ele.price = Number(ele.Last);
  //           ele.current_market_value = Number(ele.MarketValue);
  //           ele.new_market_value = null;
  //           ele.current_shares=Number(ele.Quantity);
  //           ele.new_shares=null;
  //           ele.current_invested = Number(ele.TotalCost);
  //           ele.new_invested = null;
  //           ele.p_l_amount=0.00;
  //           ele.p_l_percent=0.00;

  //         })
  //         this.isPositions=true
  //         this.dataSource.data= data.Positions;
  //         this.originalData = JSON.parse(JSON.stringify([...data.Positions]));
  //         this.setSymbolsForBrokeragePrice(this.symbolInput,true)
  //         this.isDisplayColumn =false;
  //       }
  //     })
  //   }
  cancel() {
    this.isClosePositionsButtonDisabledOrEnabled = true;
    this.symbols.forEach((ele: any) => {
      ele.new_shares = 0;
      ele.new_invested = 0;
      if (ele.shares != 0) {
        this.isClosePositionsButtonDisabledOrEnabled = false;
      }
    })
    this.form.reset(); // Reset to initial form values
    this.isDisplayColumn = false;
    this.isReBalance = false;
    this.displayedColumns = ['select', 'symbol', 'price','cost', 'shares', 'invested'];
    this.dataSource = new MatTableDataSource<any>(this.symbols);
    this.selection = new SelectionModel<any>(this.symbols, []);
    this.checkedFunction()
    this.closePositionsButtonClicked =false;
    this.RebalanceButtonClicked =false;
  }

  getErrorMessage(value: string) {
    if (this.form.controls[value].hasError('required')) {
      return 'You must enter a value';
    }
    return ''
  }

  isControlValid(field: string) {
    return this.form.controls[field].touched && this.form.controls[field].errors?.['required']
  }

  isFormValid() {
    return this.form.valid;
  }

  calculateTotal(column: string): number {
    let total: number = this.dataSource.data.reduce((acc, current: any) => Number(acc) + Number(current[column]), 0)
    if (column === 'invested') {
      this.invested = total
      // this.market_value = total
    }
    // Sum the values in the column
    return Number(total);
  }

  /****
   * on selected investmentment type onSelectInvestmentType function is called
   */
  onSelectInvestmentType(investmentType: any) {
    this.form.controls['percent'].setValue(null);
    this.form.controls['amount'].setValue(null);
    this.setNewSharesToOriginalState();
    this.isDisplayColumn=false;
    this.displayedColumns = ['select', 'symbol', 'price',"cost", 'shares', 'invested'];
  }

  /****
   * on entering percent value onChangePercent function is called
   */
  onChangePercent(percent: any) {
    
    this.isAmountChange = false;
    percent = Number(percent);
    var selectedPosition = this.selection.selected;
    /**convert string to number **/
    if (0 < percent && percent <= 100) {
      this.isDisplayColumn = true;
      this.displayedColumns = ['select', 'symbol', 'price',"cost", 'shares', 'new_shares', 'invested', 'new_invested'];
      let totalAmount = 0;
      for (let i = 0; i < selectedPosition.length; i++) {
        // bellow if condition is for calculating investment-per-position and equalDistribution
        if (!this.isReBalance || (this.isReBalance && selectedPosition[i].reBalance != 2)) {
          if ((this.form.controls['investmentType'].value == 'Equal Distribution') || (this.form.controls['investmentType'].value == 'Investment Per stock')) {
            let Amount = ((percent * this.cash_balance) / 100).toFixed(3);
            this.form.controls['amount'].setValue(Number(Amount));
            let total = this.form.controls['investmentType'].value == 'Equal Distribution' ? this.form.controls['amount'].value / selectedPosition.length : this.form.controls['amount'].value;
            selectedPosition[i].new_shares = ~~(total / selectedPosition[i].price);
            selectedPosition[i].transaction_type = 'BUY';
            if (selectedPosition[i].new_shares != 0) {
              selectedPosition[i].new_invested = Number((selectedPosition[i].new_shares * selectedPosition[i].price).toFixed(3));
            }else {
              selectedPosition[i].new_invested = 0;
            }
          }
          else {
            //  else condition is for calculating Scale-Down and Scale-UP
            selectedPosition[i].new_shares = selectedPosition[i].shares == 0 ? 0 : ~~((selectedPosition[i].shares * percent) / 100);
            selectedPosition[i].new_invested = selectedPosition[i].new_shares == 0 ? 0 : Number((selectedPosition[i].new_shares * selectedPosition[i].price).toFixed(2));
            totalAmount = totalAmount + (selectedPosition[i].new_shares == 0 ? 0 : Number(selectedPosition[i].new_shares * selectedPosition[i].price));
            if (selectedPosition.length - 1 == i) {
              this.form.controls['amount'].setValue(totalAmount.toFixed(3))
            }
            selectedPosition[i].transaction_type = 'BUY';

            if (this.form.controls['investmentType'].value == 'Scale Down' && selectedPosition[i].new_shares != 0) {
              selectedPosition[i].transaction_type = 'SELL';
              selectedPosition[i].new_shares = -1 * selectedPosition[i].new_shares;
              selectedPosition[i].new_invested = -1 * selectedPosition[i].new_invested;
            }

          }
        }
      }
    } else {
      this.form.controls['amount'].setValue(0);
      this.isDisplayColumn = false;
      this.displayedColumns = ['select', 'symbol', 'price',"cost", 'shares', 'invested'];
      this.setNewSharesToOriginalState();


    }

  }

  onChangeAmount(amount: any) {
    this.isAmountChange = true;
    amount = Number(amount);
    var selectedTickers = this.selection.selected;
    /**convert string to number **/
    if (0 < amount && amount<this.cash_balance) {
      this.isDisplayColumn = true;
      this.displayedColumns = ['select', 'symbol', 'price',"cost", 'shares', 'new_shares', 'invested', 'new_invested'];
      /***
       * mValue is selected tickers sum of market value, Used for calculating the percent
       *
       */
      var mValue = selectedTickers.reduce(function (total: any, currentValue: any) {
        return total + currentValue.invested; // Add the value of the 'value' key to the total
      }, 0);

      for (let i = 0; i < selectedTickers.length; i++) {
        // bellow if condition is for calculating investment-per-position and equalDistribution
        if (!this.isReBalance || (this.isReBalance && selectedTickers[i].reBalance != 2)) {
          if ((this.form.controls['investmentType'].value == 'Equal Distribution') || (this.form.controls['investmentType'].value == 'Investment Per stock')) {
            if (selectedTickers.length - 1 == i) {
              let percent = ((amount / this.cash_balance) * 100).toFixed(2);
              this.form.controls['percent'].setValue(Number(percent));
            }
            let total = this.form.controls['investmentType'].value == 'Equal Distribution' ? this.form.controls['amount'].value / selectedTickers.length : this.form.controls['amount'].value;
            selectedTickers[i].new_shares = ~~(total / selectedTickers[i].price);
            selectedTickers[i].transaction_type = 'BUY';
            if (selectedTickers[i].new_shares != 0) {
              selectedTickers[i].new_invested = Number((selectedTickers[i].new_shares * selectedTickers[i].price).toFixed(3));
            }
            else {
              selectedTickers[i].new_invested = 0;
            }

          }
          else {
            //  else condition is for calculating Scale-Down and Scale-UP
            let percent = Number(((amount * 100) / mValue).toFixed(2));
            selectedTickers[i].new_shares = selectedTickers[i].shares == 0 ? 0 : ~~((selectedTickers[i].shares * percent) / 100);
            selectedTickers[i].new_invested = Number((selectedTickers[i].new_shares * selectedTickers[i].price).toFixed(3));
            selectedTickers[i].transaction_type = 'BUY';
            if (selectedTickers.length - 1 == i && percent <= 100) {
              this.form.controls['percent'].setValue(percent)
            }else if(selectedTickers.length - 1 == i ){
              this.form.controls['percent'].setValue(0)
              this.setNewSharesToOriginalState();
            }
            if (this.form.controls['investmentType'].value == 'Scale Down' && selectedTickers[i].shares != 0 && selectedTickers[i].new_shares != 0 && 0 < percent && percent <= 100) {
              selectedTickers[i].transaction_type = 'SELL';
              selectedTickers[i].new_shares = -1 * selectedTickers[i].new_shares;
              selectedTickers[i].new_invested = -1 * selectedTickers[i].new_invested;
            }
          }
        }
      }
    } else {
      this.form.controls['percent'].setValue(0);
      this.isDisplayColumn = false;
      this.displayedColumns = ['select', 'symbol', 'price',"cost", 'shares', 'invested'];
      this.setNewSharesToOriginalState();
    }
  }

  setNewSharesToOriginalState(){
    this.selection.selected.forEach((ele: any) => {
      if(!this.RebalanceButtonClicked || ele.reBalance != 2){
        ele.new_shares = 0;
        ele.new_invested = 0;
      }
    })
  }

  closeAllPositions() {
    this.closePositionsButtonClicked = true;
    this.calculateDialog();
    this.selection.select(...this.dataSource.data);
    this.form.reset();
    this.form.controls['investmentType'].disable();
    this.form.controls['amount'].disable();
    this.form.controls['percent'].disable();
    var selectedPosition = this.selection.selected;
    if (selectedPosition.length > 0) {
      for (let i = 0; i < selectedPosition.length; i++) {
        if (selectedPosition[i].shares != 0) {
          selectedPosition[i].transaction_type = 'SELL';
          selectedPosition[i].new_shares = -1 * selectedPosition[i].shares
          selectedPosition[i].new_invested = -1 * Number((selectedPosition[i].shares * selectedPosition[i].price).toFixed(3))
        } else {
          if (this.isRowSelected(selectedPosition[i])) {
            this.unselectRow(selectedPosition[i])
            selectedPosition[i].new_shares = 0;
            selectedPosition[i].new_invested = 0;
          }
        }
      }
    }
  }

  getSymbolPrice() {
    this.basketTradeService.getSymbolPrice(this.symbolInput).then((data) => {
      console.log("hello,data", data)
    });

  }

  ngOnDestroy() {
    // this.webSocketService.closeConnection();
  }

  getColor(price: any) {
    let a = null
    for (let i = 0; i < this.originalData.length; i++) {
      if (this.originalData[i].symbol == price.symbol && this.originalData[i].price != price.price) {
        return true;
      }
    }
    return a;
  }

  /**
  * setSymbolsForBrokeragePrice function is used for set symbols for price or remove symbols from price list
  * track is true set symbol for price
  * track is false remove symbol for price list
  */
  setSymbolsForBrokeragePrice(symbols: any, track: boolean) {
    this.basketTradeService.setSymbolsForBrokeragePrice({ symbols: symbols, track: track }).then((data) => { })
  }


  // async getBasketSymbols(resetPage = false) {
  //   if (resetPage) {
  //     this.pageIndex = 0;
  //     this.length = 0;
  //   }
  //   var positions = await this.getActivePositionsByBasketId();
  //   this.basketService.getSymbols(this.basketId, this.pageIndex, this.pageSize, null, null).then((data) => {
  //     if (data.error || !data.symbols) {
  //       this.utilityService.displayInfoMessage(data.error, true)
  //     }
  //     else {
  //       this.displayedColumns = ['select', 'symbol', 'price', 'shares', 'invested'];
  //       if (positions.success && !positions.message) {
  //         data.symbols.forEach((ele: any) => {
  //           this.symbolInput.push(ele.symbol);
  //           ele.price = Number(ele.price);
  //           ele.new_shares = null;
  //           ele.shares = 0;
  //           ele.transactionType = null
  //           ele.new_invested = null;
  //           positions.orders.forEach((elePosition: any) => {
  //             if (elePosition.symbol === ele.symbol) {
  //               ele.shares = elePosition.position;
  //             }
  //           })
  //           ele.invested = ele.shares * ele.price;
  //         })
  //       } else {
  //         data.symbols.forEach((ele: any) => {
  //           this.symbolInput.push(ele.symbol);
  //           ele.price = Number(ele.price);
  //           ele.shares = 0;
  //           ele.new_shares = null;
  //           ele.transactionType = null
  //           ele.invested = ele.shares * ele.price;;
  //           ele.new_invested = null;
  //         })
  //       }

  //       this.isPositions = true
  //       this.symbols = data.symbols
  //       this.dataSource = new MatTableDataSource<any>(data.symbols);
  //       this.selection = new SelectionModel<any>(data.symbols, []);
  //       this.originalData = JSON.parse(JSON.stringify([...data.symbols]));
  //       this.symbolInput.length > 0 ? this.setSymbolsForBrokeragePrice(this.symbolInput, true) : null
  //       this.isDisplayColumn = false;
  //     }
  //   })
  // }


  // async getActivePositionsByBasketId() {
  //   try {
  //     var oupPut = await this.basketTradeService.getActivePositionsByBasketId(this.basketId)
  //     return oupPut.orders.message ? { success: false } : oupPut;
  //   } catch (err) {
  //     return { success: false }
  //   }
  // }

  isRowSelected(row: any): boolean {
    return this.selection.isSelected(row);
  }
  unselectRow(row: any): void {
    this.selection.deselect(row);
  }
  /***getBrokerageAccount function is used to get  active Accounts related to brokerage*/
  async getSymbolsAlongWithPosition(usePythonAPI = false) {

    if(usePythonAPI) {
      // this.showSpinner = true;
      this.basketTradeService.getSymbolsAlongWithPosition(this.basketId).then((data) => {
        // this.showSpinner=false;
        if (data && data.success && data.symbols) {
          this.UpdatedInvestmentTypeDropDownValues()
          this.isPositions = true;
          this.symbols = data.symbols;
          this.symbols.forEach((ele: any) => {
            this.market_value =  this.market_value+(ele.shares*ele.price)
            if (ele.reBalance === 0 || ele.reBalance === 2) {
              this.isRebalanceButtonDisableOrEnable = false;
            }
            if (ele.shares != 0) {
              this.UpdatedInvestmentTypeDropDownValues(true)
              this.isClosePositionsButtonDisabledOrEnabled = false;
            }
          })
          this.dataSource = new MatTableDataSource<any>(data.symbols);
          this.selection = new SelectionModel<any>(data.symbols, []);
          this.checkedFunction();
          this.originalData = JSON.parse(JSON.stringify([...data.symbols]));
          // this.symbolInput.length>0?this.setSymbolsForBrokeragePrice(this.symbolInput,true):null
          this.isDisplayColumn = false;
        }

      })
    }
    else {
      let data = await this.basketService.getSymbols(this.basketId, 0, 100, null, null)
      if(data && data.symbols) {
        this.market_value = data.symbols[0].basket_market_value?data.symbols[0].basket_market_value:0;
        this.invested = data.symbols[0].basket_invested?data.symbols[0].basket_invested:0;
        this.UpdatedInvestmentTypeDropDownValues()
        this.isPositions = true;
          for(let i = data.symbols.length - 1; i >= 0; i--){
            data.symbols[i].price = Number(data.symbols[i].price)
            data.symbols[i].invested = Number(data.symbols[i].invested)
            data.symbols[i].cost = Number(data.symbols[i].cost)
            data.symbols[i].shares = Number(data.symbols[i].shares)
            data.symbols[i].new_invested = 0;
            data.symbols[i].new_shares = 0;
            if(data.symbols[i].shares && data.symbols[i].shares != 0){
              this.UpdatedInvestmentTypeDropDownValues(true)
            }

            /** the symbol is not linked to basket and no active shares that object is removed*/
            if(data.symbols[i].deleted_at && !data.symbols[i].shares){
               data.symbols.splice(i, 1);
            }else if(data.symbols[i].deleted_at && data.symbols[i].shares){
              /** the symbol is not linked to basket and active shares(required reBalance) */
              data.symbols[i].reBalance=2
              this.isClosePositionsButtonDisabledOrEnabled = false;
              this.isRebalanceButtonDisableOrEnable = false;
            }else if(!data.symbols[i].deleted_at && !data.symbols[i].shares){
              /** the symbol is linked to basket and no active shares(required reBalance) */
              data.symbols[i].reBalance=0
              this.isRebalanceButtonDisableOrEnable = false;
            }else{
              /** the symbol is linked to basket and  active shares(not required reBalance) */
              data.symbols[i].reBalance=1 
              this.isClosePositionsButtonDisabledOrEnabled = false;
            }

            

          }
          this.symbols = data.symbols;
        this.dataSource = new MatTableDataSource<any>(data.symbols);
        this.selection = new SelectionModel<any>(data.symbols, []);
        this.checkedFunction();
        this.originalData = JSON.parse(JSON.stringify([...data.symbols]));
        // this.symbolInput.length>0?this.setSymbolsForBrokeragePrice(this.symbolInput,true):null
        this.isDisplayColumn = false;
      }

    }


  }


  reBalance() {
    this.RebalanceButtonClicked = true;
    this.calculateDialog();
    this.selection.select(...this.dataSource.data);
    this.isReBalance = true;
    this.form.controls['investmentType'].setValue("Investment Per stock");
    var selectedPosition = this.selection.selected;
    this.form.controls['investmentType'].disable();
    this.form.controls['amount'].enable();
    this.form.controls['percent'].enable();
    if (selectedPosition.length > 0) {
      for (let i = 0; i < selectedPosition.length; i++) {
        if (selectedPosition[i].shares != 0 && selectedPosition[i].reBalance == 2) { //2 is for symbol is not linked to basket but symbol have active position
          selectedPosition[i].transaction_type = 'SELL';
          selectedPosition[i].new_shares = -1 * selectedPosition[i].shares
          selectedPosition[i].new_invested = -1 * Number((selectedPosition[i].shares * selectedPosition[i].price).toFixed(3))
        } else if (selectedPosition[i].reBalance == 0) { //0 is for symbol is  linked to basket but symbol have active position
          selectedPosition[i].new_shares = 0;
          selectedPosition[i].new_invested = 0;
        }
        else if (selectedPosition[i].reBalance == 1) { //1 is for symbol is  linked to basket but symbol have no active position
          selectedPosition[i].new_shares = 0;
          selectedPosition[i].new_invested = 0;
          if (this.isRowSelected(selectedPosition[i])) {
            this.unselectRow(selectedPosition[i])
          }
        }
      }
    }
  }
  // If amount changes, calculate percentage
  setPercentageBasedOnAmount() {
    let amount = this.form.controls['amount'].value
    this.form.controls['percent'].setValue((amount / this.cash_balance) * 100.0)
  }

  navigateLinkAccount() {
    this.utilityService.navigate(`baskets/${this.basketId}/account`)
  }
  navigateLinkBrokerage() {
    this.utilityService.navigate(`/brokerage`)
  }

  /**
   * singleSelect function is used for select and unselect row 
   * @param event 
   * @param row 
   */
  singleSelect(event: Event, row: any) {
    let target = event.target as HTMLInputElement
    event.stopPropagation()
    if(!this.closePositionsButtonClicked){
      this.checkedFunction();
      if (this.form.controls['amount'].value != '' || this.form.controls['percent'].value != '') {
        if (!target.checked) {
          row.new_shares = 0
          row.new_invested = 0
        }
        if(this.isAmountChange){
          this.onChangeAmount(this.form.controls['amount'].value)
        }else{
        this.onChangePercent(this.form.controls['percent'].value)
        }
      }
    }

  }

  checkedFunction() {
    if (this.selection.selected.length == 0 && !this.form.controls['percent'].value) {
      this.form.controls['amount'].disable();
      this.form.controls['investmentType'].disable();
      this.form.controls['percent'].disable();
    } else {
      this.form.controls['amount'].enable();
      this.form.controls['investmentType'].enable();
      this.form.controls['percent'].enable();
    }
  }

UpdatedInvestmentTypeDropDownValues(all=false){
  if(all){
    this.dropDownDetails = ["Equal Distribution", "Investment Per stock", "Scale Up", "Scale Down"]
  }else{
    this.dropDownDetails = ["Equal Distribution", "Investment Per stock"]
  }

}




async getLinkedAccount(){
  // Get account linked to basket to get broker code
  let data = await this.basketService.getBasketAccounts(this.basketId)
  if (data && data.success && data.accounts && data.accounts.length) {
    let account = this.linkedAccount = data.accounts[0];
    if (account.brokerageAccountData && account.brokerageAccountData.Accounts && account.brokerageAccountData.Accounts.length) {
      if(this.basket.broker_code && account.broker_code === this.basket.broker_code){
        account.brokerageAccountData.Accounts.forEach((ele:any)=>{
          if(this.basket.account === ele.AccountID){
            this.isTradeStation =true
            this.account_balance = Number(ele.BuyingPower);
            this.cash_balance = Number(ele.CashBalance);
            // this.market_value = account.brokerageAccountData.Accounts[0].MarketValue;
          }
        })
      }else{
        this.isTradeStation =false;;
        this.account_balance = Number(account.brokerageAccountData.Accounts[0].BuyingPower);
        this.cash_balance = Number(account.brokerageAccountData.Accounts[0].CashBalance);
        // this.market_value = account.brokerageAccountData.Accounts[0].MarketValue;
      }
     
    }
    this.getSymbolsAlongWithPosition();
  }
}


}
