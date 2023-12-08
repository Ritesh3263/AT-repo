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

  concatTickers(tickers: any) {
    if(!tickers && tickers.length){
      return;
    }
    if(!(this.data.tickers && this.data.tickers.length)) {
      this.data.tickers = tickers;
      return;
    }
    for(let i = 0; i < tickers.length; i++) {
      let existing = this.data.tickers.find((ticker: any) => {return ticker.id == tickers[i].id});
      if(!(existing && existing.id)) {
        this.data.tickers.push(tickers[i])
      }
    }
  }

  symbolLookup() {
    if(!this.tickerSymbols || this.tickerSymbols == '')
      return;
    this.basketService.getAllSymbols(0, 1000, '', this.tickerSymbols).then((data) => {
      if(data.error || !data.symbols) {
        this.utilityService.displayInfoMessage(data.error, true)
      }
      else {
        if(data && data.symbols)
          this.concatTickers(data.symbols)
        this.dataSource = new MatTableDataSource<any>(this.data.tickers)

        // Now we must validate all input symbols were able to be retrieved
        let inputSymbols = this.tickerSymbols.split(',')
        if(data.symbols.length !== inputSymbols.length) {
          let invalidSymbols = [];
          for(let i = 0; i < inputSymbols.length; i++) {
            let valid = data.symbols.find((symbol:any) => {return symbol.symbol.toUpperCase().trim() === inputSymbols[i].toUpperCase().trim()})
            if(!(valid && valid.id) && inputSymbols[i].trim()) {
              invalidSymbols.push(inputSymbols[i])
            }
          }
          if(invalidSymbols.length)
            this.utilityService.displayInfoMessage("Some symbols are invalid: " + invalidSymbols.toString(), true, 8000)
        }
      }
    })
  }

  updateBasket() {
    this.basketService.editSymbols(this.data.basket.id, this.data.tickers, this.data.mode == 'ADD' ? 'PATCH' : 'DELETE').then((data) => {
      if(data.error || !data.success) {
        this.utilityService.displayInfoMessage(data.error, true)
      }
      else {
        this.utilityService.displayInfoMessage(`Symbols ${this.data.mode == 'ADD' ? 'Added' : 'Deleted'}`)
        this.dialogRef.close({success: true})
      }
    })
  }
}