import { AfterViewInit, Component, Inject, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmTradeComponent } from '../confirm-trade/confirm-trade.component';
import { CalculateDialogComponent } from '../calculate-dialog/calculate-dialog.component';
import {  BasketTradeService } from '../../../../services/basket-trade.service';
import {FormControl, Validators, FormBuilder, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import { WebsocketService } from 'src/app/services/websocket.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { BasketsService } from 'src/app/services/baskets.service';
import { JourneyInfoComponent } from '../journey-info/journey-info.component';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { BrokerageService } from 'src/app/services/brokerage.service';
import { UserService } from 'src/app/services/user.service';

export interface PeriodicElement {
  ticker_id: string;
  current_cost: number;
  new_cost: number;
  current_shares: number;
  new_shares: number;
  purchase_date: string,
  price: number,
  current_invested: number,
  new_invested: number,
  current_market_value: number,
  new_market_value: number,
  p_l_amount: number,
  p_l_percent: number
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
export class TradeComponent implements AfterViewInit,OnDestroy {
  isPositions:boolean=false;
  showSpinner:boolean = false;
  user_id:any=null;
 displayedColumns: string[]  = ['select', 'symbol', 'purchasedate', 'costcurrent', 'price', 'sharescurrent', 'investedcurrent', 'marketcurrent', 'pl', 'plpercent'];
 form: FormGroup = new FormGroup(''); // FormGroup
 dropDownDetails = ["Equal Distribution","Investment Per stock","Scale Up","Scale Down"]
  // displayedColumns: string[] = ['select', 'symbol', 'purchasedate', 'costcurrent', 'costnew', 'price', 'sharescurrent', 'sharesnew', 'investedcurrent', 'investednew', 'marketcurrent', 'marketnew', 'pl', 'plpercent'];
  // displayedColumnsOne: string[] = ['select', 'symbol', 'purchasedate', 'costcurrent', 'price', 'sharescurrent', 'investedcurrent', 'marketcurrent', 'pl', 'plpercent'];
  cash_balance :any= 0.00;
  account_balance :any = 0.00;
  invested:any=0.00;
  market_value:any = 0.00;
  accountId:any = null;
  length = 0;
  pageSize = 10;
  pageIndex = 0;
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  selection = new SelectionModel<PeriodicElement>(true, []);
  isDisplayColumn:boolean=true;
  symbols: any =[]

  constructor(private fb: FormBuilder,private renderer: Renderer2, public dialog: MatDialog,private basketTradeService :BasketTradeService,private webSocketService: WebsocketService,private basketService:BasketsService,@Inject(JourneyInfoComponent) private parentComponent: JourneyInfoComponent, private utilityService: UtilitiesService,private brokerageService:BrokerageService,private userService:UserService) {
    // this.getAccountBasketPosition();
    // this.getBrokerageAccountPosition();
    this.form = this.fb.group ({
      investmentType: new FormControl('', [Validators.required]),
      percent: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required])
    })
  }
  symbolInput:any=[];
  originalData:any=[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  basketId:number=0;
  async ngAfterViewInit(id = null) {
    this.basketId = id || this.parentComponent.getBasketId();
    this.loadUserDetails();
    this.getBasketSymbols();
    this.dataSource.paginator = this.paginator;
    await this.webSocketService.connect("ws/intrinio");
    await this.webSocketService.receiveMessages()

   /**continues receiving response from websocket*/
    this.webSocketService.getMessages().subscribe((message: any) => {
      this.dataSource.data.forEach((ele:any)=>{
        if(message && ele.ticker_id === JSON.parse(message).symbol){
          ele.price =JSON.parse(message).latest_price;
        }
      })
  });
    
    
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
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.current_cost + 1}`;
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

    let inputModelPopup={
     account_balance:this.cash_balance+this.market_value,
     cash_balance : this.cash_balance,
     basket_id : this.basketId,
     symbols :this.selection.selected
    }
    const dialogRef = this.dialog.open(ConfirmTradeComponent, {
      panelClass: 'custom-modal',
      disableClose: true,
      data:inputModelPopup
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if(result){
        this.getBasketSymbols();
      }
    });
  }

  calculateDialog() {
    this.isDisplayColumn = true;
      this.displayedColumns = ['select', 'symbol', 'purchasedate', 'costcurrent', 'costnew', 'price', 'sharescurrent', 'sharesnew', 'investedcurrent', 'investednew', 'marketcurrent', 'marketnew', 'pl', 'plpercent'];

    // this.dialog.open(CalculateDialogComponent, {
    //   panelClass: 'custom-modal',
    //   disableClose: true
    // });
  }
 async getAccountBasketPosition(){
  this.showSpinner= true;
    this.basketTradeService.getAccountBasketPosition(1).then((data) => {
      this.showSpinner =false;
      if(data) {
        this.displayedColumns = ['select', 'symbol', 'purchasedate', 'costcurrent', 'price', 'sharescurrent', 'investedcurrent', 'marketcurrent', 'pl', 'plpercent'];
        for(let i=0;i<data.length;i++){
          data[i].current_market_value =Number((data[i].price*data[i].current_shares).toFixed(2))
          // if(i==0){
          //   this.symbolInput = data[i].ticker_id;
          // }else{
          //   this.symbolInput = this.symbolInput+','+data[i].ticker_id;
          // }
          this.isPositions=true
          this.dataSource.data= data
          this.isDisplayColumn =false;
        }
        // this.getSymbolPrice();
        // this.basket = data.basket;
        // this.dataSource = new MatTableDataSource<PeriodicElement>(this.basket.tickers);
      }
    })
  }

  async getBrokerageAccountPosition(){
    this.showSpinner= true;
      this.basketTradeService.getBrokerageAccountPosition('ts','Sreekanth','SIM1213784M').then((data) => {
        this.showSpinner =false;
        if(data){
          this.displayedColumns = ['select', 'symbol', 'purchasedate', 'costcurrent', 'price', 'sharescurrent', 'investedcurrent', 'marketcurrent', 'pl', 'plpercent'];
          data.Positions.forEach((ele:any)=>{
            this.symbolInput.push(ele.Symbol);
            ele.new_cost=null;
            ele.current_cost=Number(ele.TotalCost)/Number(ele.Quantity);
            ele.purchase_date=ele.Timestamp
            ele.ticker_id=ele.Symbol;
            ele.price = Number(ele.Last);
            ele.current_market_value = Number(ele.MarketValue);
            ele.new_market_value = null;
            ele.current_shares=Number(ele.Quantity);
            ele.new_shares=null;
            ele.current_invested = Number(ele.TotalCost);
            ele.new_invested = null;
            ele.p_l_amount=0.00;
            ele.p_l_percent=0.00;

          })
          this.isPositions=true
          this.dataSource.data= data.Positions;
          this.originalData = JSON.parse(JSON.stringify([...data.Positions]));
          this.setSymbolsForBrokeragePrice(this.symbolInput,true)
          this.isDisplayColumn =false;
        }
      })
    }
  cancel(){
    this.form.reset(); // Reset to initial form values
    this.isDisplayColumn = false;
    this.displayedColumns = ['select', 'symbol', 'purchasedate', 'costcurrent', 'price', 'sharescurrent', 'investedcurrent', 'marketcurrent', 'pl', 'plpercent'];
    this.dataSource = new MatTableDataSource<any>(this.symbols);
    this.selection = new SelectionModel<any>(this.symbols, []);          
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
    let total:number = this.dataSource.data.reduce((acc, current:any) => acc + current[column], 0)
    if(column == 'current_market_value'){
      this.market_value = total
    }else if(column == 'current_invested'){
      this.invested = total
    }
    // Sum the values in the column
    return Number(total);
  }

/****
 * on selected investmentment type onSelectInvestmentType function is called 
 */
  onSelectInvestmentType(investmentType:any){
    this.form.controls['percent'].setValue(null);
    this.form.controls['amount'].setValue(null);
  }

/****
 * on entering percent value onChangePercent function is called 
 */
  onChangePercent(percent:any){
    percent = Number(percent);
      /**convert string to number **/
      if (0 < percent && percent <= 100) {
          var selectedPosition = this.selection.selected;
          let totalAmount = 0;
          for (let i = 0; i < selectedPosition.length; i++) {
              if ((this.form.controls['investmentType'].value == 'Equal Distribution') || (this.form.controls['investmentType'].value == 'Investment Per stock')) {
                  let Amount = ((percent * this.cash_balance) / 100).toFixed(3);
                  this.form.controls['amount'].setValue(Number(Amount));
                  let total = this.form.controls['investmentType'].value == 'Equal Distribution' ? this.form.controls['amount'].value / selectedPosition.length : this.form.controls['amount'].value;
                  selectedPosition[i].new_shares = ~~(total / selectedPosition[i].price);

                  if (selectedPosition[i].new_shares != 0) {
                      selectedPosition[i].new_invested = Number((selectedPosition[i].new_shares * selectedPosition[i].price).toFixed(3));
                      selectedPosition[i].new_market_value = Number((selectedPosition[i].new_shares * selectedPosition[i].price).toFixed(3))
                      selectedPosition[i].new_cost = Number((((selectedPosition[i].current_invested + Number(selectedPosition[i].new_invested)) / (selectedPosition[i].new_shares + selectedPosition[i].current_shares)) - selectedPosition[i].current_cost).toFixed(3));
                  }
              }
              else {
                  for(let i=0;i<selectedPosition.length;i++){
                  selectedPosition[i].new_shares = selectedPosition[i].current_shares == 0 ? 0 : ~~((selectedPosition[i].current_shares * percent) / 100);
                  selectedPosition[i].new_invested = Number((selectedPosition[i].new_shares * selectedPosition[i].price).toFixed(3));
                  selectedPosition[i].new_market_value = Number((selectedPosition[i].new_shares * selectedPosition[i].price).toFixed(3));
                  totalAmount = totalAmount + Number(selectedPosition[i].new_shares * selectedPosition[i].price);
                  if (selectedPosition.length - 1 == i) {
                      this.form.controls['amount'].setValue(totalAmount.toFixed(3))
                  }
                  if (this.form.controls['investmentType'].value == 'Scale Down' && selectedPosition[i].current_shares != 0 && selectedPosition[i].new_shares != 0) {
                        selectedPosition[i].new_cost = Number(((selectedPosition[i].current_shares - selectedPosition[i].new_shares) <= 0 ? (selectedPosition[i].price - selectedPosition[i].current_cost) : ((selectedPosition[i].current_invested - selectedPosition[i].new_invested) / (selectedPosition[i].current_shares - selectedPosition[i].new_shares)) - selectedPosition[i].current_cost).toFixed(3));
                      selectedPosition[i].new_shares = -1 *  selectedPosition[i].new_shares;
                      selectedPosition[i].new_invested = -1 *  selectedPosition[i].new_invested;
                      selectedPosition[i].new_market_value = -1 * selectedPosition[i].new_market_value;
                  } else if (this.form.controls['investmentType'].value == 'Scale Up' && selectedPosition[i].new_shares != 0) {
                     selectedPosition[i].new_cost =Number((((selectedPosition[i].current_invested + selectedPosition[i].new_invested) / (selectedPosition[i].current_shares + selectedPosition[i].new_shares)) - selectedPosition[i].current_cost).toFixed(3));
                  }


              }
          }
        }
      } else {
          this.form.controls['amount'].setValue(0);

      }

  }

onChangeAmount(amount:any){
  amount = Number(amount);
  /**convert string to number **/
  if (0 < amount) {

      var selectedTickers = this.selection.selected;
      /***
       * mValue is selected tickers sum of market value, Used for calculating the percent
       * 
       */
      var mValue = selectedTickers.reduce(function (total:any, currentValue:any) {
          return total + currentValue.current_market_value; // Add the value of the 'value' key to the total
      }, 0);

      for (let i = 0; i < selectedTickers.length; i++) {
          if ((this.form.controls['investmentType'].value == 'Equal Distribution') || (this.form.controls['investmentType'].value == 'Investment Per stock')) {
              if (selectedTickers.length - 1 == i) {
                  let percent = ((amount / this.cash_balance) * 100).toFixed(2);
                  this.form.controls['percent'].setValue(Number(percent));
              }
              let total = this.form.controls['investmentType'].value == 'Equal Distribution' ? this.form.controls['amount'].value / selectedTickers.length : this.form.controls['amount'].value;
              selectedTickers[i].new_shares = ~~(total / selectedTickers[i].price);
              if (selectedTickers[i].new_shares != 0) {
                  selectedTickers[i].new_invested = Number((selectedTickers[i].new_shares * selectedTickers[i].price).toFixed(3));
                  selectedTickers[i].new_market_value = Number((selectedTickers[i].new_shares * selectedTickers[i].price).toFixed(3));
                  selectedTickers[i].new_cost = Number((((selectedTickers[i].current_invested + Number(selectedTickers[i].new_invested)) / (selectedTickers[i].new_shares + selectedTickers[i].current_shares)) - selectedTickers[i].current_cost).toFixed(3));
                }
            
          }
          else {
              let percent = Number(((amount * 100) / mValue).toFixed(2));
              selectedTickers[i].new_shares = selectedTickers[i].current_shares == 0 ? 0 : ~~((selectedTickers[i].current_shares * percent) / 100);
              selectedTickers[i].new_invested = Number((selectedTickers[i].new_shares * selectedTickers[i].price).toFixed(3));
              selectedTickers[i].new_market_value = Number((selectedTickers[i].new_shares * selectedTickers[i].price).toFixed(3));
              if (selectedTickers.length - 1 == i) {
                  this.form.controls['percent'].setValue(percent)
              }
              if (this.form.controls['investmentType'].value == 'Scale Down' && selectedTickers[i].current_shares != 0 && selectedTickers[i].new_shares != 0) {
                  selectedTickers[i].new_cost = Number(((selectedTickers[i].current_shares - selectedTickers[i].new_shares) <= 0 ? (selectedTickers[i].price - selectedTickers[i].current_cost) : ((selectedTickers[i].current_invested - selectedTickers[i].new_invested) / (selectedTickers[i].current_shares - selectedTickers[i].new_shares)) - selectedTickers[i].current_cost).toFixed(3));
                  selectedTickers[i].new_shares = -1 *  selectedTickers[i].new_shares;
                  selectedTickers[i].new_invested = -1 *  selectedTickers[i].new_invested;
                  selectedTickers[i].new_market_value = -1 * selectedTickers[i].new_market_value;
              } else if (this.form.controls['investmentType'].value == 'Scale up' && selectedTickers[i].new_shares != 0) {
                  selectedTickers[i].new_cost = Number((((selectedTickers[i].current_invested + selectedTickers[i].new_invested) / (selectedTickers[i].current_shares + selectedTickers[i].new_shares)) - selectedTickers[i].current_cost).toFixed(3));
                  // selectedTickers[i].transaction_type = 'Buy';
                  
              } 
          }
      }

  } else {
      this.form.controls['percent'].setValue(0);

  }
}

closeAllPositions(){
  this.calculateDialog();
 var selectedPosition = this.selection.selected;
 for(let i =0;i<selectedPosition.length;i++){
  selectedPosition[i].new_shares = -1 * selectedPosition[i].current_shares
  selectedPosition[i].new_invested =-1 * Number((selectedPosition[i].current_shares * selectedPosition[i].price).toFixed(3))
  selectedPosition[i].new_market_value = -1 *Number((selectedPosition[i].current_shares * selectedPosition[i].price).toFixed(3))
  selectedPosition[i].new_cost = Number((selectedPosition[i].price - selectedPosition[i].current_cost).toFixed(3));

 }


}

getSymbolPrice(){
  this.basketTradeService.getSymbolPrice(this.symbolInput).then((data) => {
    console.log("hello,data",data)
  });

}

ngOnDestroy() {
  this.webSocketService.closeConnection();
}

getColor(price: any) {
  let a = null
  for (let i = 0; i < this.originalData.length; i++) {
    if (this.originalData[i].ticker_id == price.ticker_id && this.originalData[i].price != price.price) {
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


  getBasketSymbols(resetPage = false) {
    if(resetPage) {
      this.pageIndex = 0;
      this.length = 0;
    }
    this.basketService.getSymbols(this.basketId, this.pageIndex, this.pageSize).then((data) => {
      if(data.error || !data.symbols) {
        this.utilityService.displayInfoMessage(data.error, true)
      }
      else {
          this.displayedColumns = ['select', 'symbol', 'purchasedate', 'costcurrent', 'price', 'sharescurrent', 'investedcurrent', 'marketcurrent', 'pl', 'plpercent'];
          data.symbols.forEach((ele:any)=>{
            this.symbolInput.push(ele.symbol);
            ele.new_cost=null;
            ele.current_cost=0;
            ele.purchase_date=null
            ele.ticker_id=ele.symbol;
            ele.price = Number(ele.price);
            ele.current_market_value = 0;
            ele.new_market_value = null;
            ele.current_shares=0;
            ele.new_shares=null;
            ele.current_invested = 0;
            ele.new_invested = null;
            ele.p_l_amount=0.00;
            ele.p_l_percent=0.00;

          })
          this.isPositions=true
          this.symbols = data.symbols
          this.dataSource = new MatTableDataSource<any>(data.symbols);
          this.selection = new SelectionModel<any>(data.symbols, []);          
          this.originalData = JSON.parse(JSON.stringify([...data.symbols]));
          this.symbolInput.length>0?this.setSymbolsForBrokeragePrice(this.symbolInput,true):null
          this.isDisplayColumn =false;
      }
    })
  }

    /***getBrokerageAccount function is used to get  active Accounts related to brokerage*/
    getBrokerageAccount(brokerage:any,user_id:any){
      this.showSpinner = true;
      this.brokerageService.getBrokerageAccounts(brokerage,user_id?user_id:this.user_id).then((data) => {
      this.showSpinner=false;
        if(data.error || !data.success) {
          this.utilityService.displayInfoMessage(data.error, true)
        }
        else if(data.Accounts) {
          this.account_balance = data.Accounts[0].BuyingPower;
          this.cash_balance = data.Accounts[0].CashBalance;
          this.accountId = data.Accounts[0].AccountID;
        }
        
      })
    }
  /***loadUserDetails function is used to get user information  */
  loadUserDetails() {
    this.showSpinner = true;
    this.userService.getUserDetails().then((user:any) => {
      this.showSpinner = false;
      this.user_id = user.firstName?user.firstName:null
      this.getBrokerageAccount('ts',null);
    })
  }
}



