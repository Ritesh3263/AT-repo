import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import { BasketsService } from 'src/app/services/baskets.service';
import { UtilitiesService } from 'src/app/services/utilities.service';


@Component({
  selector: 'app-edit-symbols',
  templateUrl: './edit-symbols.component.html',
  styleUrls: ['./edit-symbols.component.scss']
})
export class EditSymbolsComponent {
  displayedColumns: string[] = ['symbol', 'name', 'actions'];
  dataSource !: any;
  tickerSymbols !: string;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private basketService: BasketsService, private utilityService: UtilitiesService, private dialogRef: MatDialogRef<EditSymbolsComponent>) {
    this.dataSource = new MatTableDataSource<any>(data.tickers)
  }

  deleteTicker(index: number) {
    for(let i = 0; i < this.data.tickers.length; i++) {
      if(this.data.tickers[i].id == index) {
        this.data.tickers.splice(i, 1);
        this.dataSource = new MatTableDataSource<any>(this.data.tickers)
      }
    }
  }

  clipboardEventHandler(event: any) {
    if(event.type == 'paste') {
      // Event fires before data binding has completed, give a few ms before triggering the lookup
      setTimeout(() => { this.symbolLookup() }, 5);
    }
  }

  keyboardEventHandler(event: any) {
    if(event.code == 'Comma' || event.code == 'Enter') {
      this.symbolLookup()
    }
  }

  symbolLookup() {
    this.basketService.getAllSymbols(1, 1000, '', this.tickerSymbols).then((data) => {
      this.data.tickers = data.symbols;
      this.dataSource = new MatTableDataSource<any>(this.data.tickers)
    })
  }

  updateBasket() {
    let basket = JSON.parse(JSON.stringify(this.data.basket));  // Deep Copy to prevent potential issues
    let tickers = this.data.basket.tickers ? this.data.basket.tickers : [];
    // We need to combine the newly added symbols to the existing list of symbols before sending to API
    if(this.data.mode == 'ADD') {
      basket.tickers = tickers.concat(this.data.tickers);
    }
    else {
      // We need to remove the deleted symbols from the basket symol list before sending to API
      // symbols from existing basket
      let basketTickers = JSON.parse(JSON.stringify(tickers));
      // deleted symbols
      let deletedTickers = JSON.parse(JSON.stringify(this.data.tickers));
      for(let i = 0; i < deletedTickers.length; i++) {
        for(let j = 0; j < basketTickers.length; j++) {
          if(deletedTickers[i].basket_ticker_id == basketTickers[j].basket_ticker_id) {
            basketTickers.splice(j, 1)
          }
        }
      }
      basket.tickers = basketTickers;
    }

    this.basketService.updateBasket(basket).then((data) => {
      if(data && data.success) {
        this.utilityService.displayInfoMessage(`Tickers ${this.data.mode == 'ADD' ? 'Added' : 'Deleted'}`)
        this.dialogRef.close({success: true, id: data.status.id})
      }
      else {
        this.utilityService.displayInfoMessage("Error deleting basket", false)
      }
    })
  }
}