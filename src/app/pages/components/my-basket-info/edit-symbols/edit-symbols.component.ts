import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import { BasketsService } from 'src/app/services/baskets.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap, startWith, debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-symbols',
  templateUrl: './edit-symbols.component.html',
  styleUrls: ['./edit-symbols.component.scss']
})
export class EditSymbolsComponent {
  displayedColumns: string[] = ['symbol', 'name', 'actions'];
  dataSource !: any;

  lookupControl!: any;
  filteredOptions!: Observable<any[]>;
  replaceTickers: boolean = false;
  isLoading: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private basketService: BasketsService, private utilityService: UtilitiesService, private dialogRef: MatDialogRef<EditSymbolsComponent>) {
    this.dataSource = new MatTableDataSource<any>(data.tickers)
  }

  ngOnInit() {
    this.lookupControl = new FormControl<any>('')
    this.resetAutocomplete()
  }

  resetAutocomplete() {
    this.lookupControl.setValue('')
    this.filteredOptions = this.lookupControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(val => {
          return this._filter(this.lookupControl.getRawValue())
        })
      );
  }

  deleteTicker(index: number) {
    for(let i = 0; i < this.data.tickers.length; i++) {
      if(this.data.tickers[i].id == index) {
        this.data.tickers.splice(i, 1);
        this.dataSource = new MatTableDataSource<any>(this.data.tickers)
      }
    }
  }

  clipboardEventHandler(event: any, trigger: any) {
    if(event.type == 'paste') {
      // Event fires before data binding has completed, give a few ms before triggering the lookup
      setTimeout(() => { this.symbolLookup(); trigger.closePanel() }, 5);
    }
  }

  keyboardEventHandler(event: any) {
    if(event.code == 'Comma' || event.code == 'Enter') {
      this.symbolLookup()
    }
    //this._filter(this.lookupControl.getRawValue())
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
    if(!this.lookupControl.getRawValue() || this.lookupControl.getRawValue() == '')
      return;
    this.basketService.getAllSymbols(0, 1000, '', this.lookupControl.getRawValue()).then((data) => {
      if(data.error || !data.symbols) {
        this.utilityService.displayInfoMessage(data.error, true)
      }
      else {
        if(data && data.symbols)
          this.concatTickers(data.symbols)
        this.dataSource = new MatTableDataSource<any>(this.data.tickers)

        // Now we must validate all input symbols were able to be retrieved
        let inputSymbols = this.lookupControl.getRawValue().split(',')
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

        this.resetAutocomplete()
      }
    })
  }

  updateBasket() {
    this.isLoading = true;
    this.basketService.editSymbols(this.data.basket.id, this.data.tickers, this.data.mode == 'ADD' ? 'PATCH' : 'DELETE', this.replaceTickers).then((data) => {
      this.isLoading = false;
      if(data.error || !data.success) {
        this.utilityService.displayInfoMessage(data.error, true)
      }
      else {
        this.utilityService.displayInfoMessage(`Symbols ${this.data.mode == 'ADD' ? 'Added' : 'Deleted'}`)
        this.dialogRef.close({success: true})
      }
    })
  }

  private async _filter(value: any) {
    if(!value || (value && ((typeof value == 'string' && value.includes(',')) || (typeof value == 'object' && value.symbol.includes(','))))) {
      return []
    }
    const filterValue = typeof value == 'string' ? value.toLowerCase() : value.symbol.toLowerCase();
    let results = await this.basketService.getAllSymbols(0, 10, filterValue);
    if(!(results.symbols && results.symbols.length)) {
      this.utilityService.displayInfoMessage("Some symbols are invalid: " + value.toString(), true, 8000)
    }
    return results.symbols;
  }

  displayFn(ticker: any): string {
    return ticker && ticker.symbol ? ticker.symbol : ''
  }

  addSymbol(symbol: any) {
    this.concatTickers([symbol])
    this.dataSource = new MatTableDataSource<any>(this.data.tickers)
  }
}
