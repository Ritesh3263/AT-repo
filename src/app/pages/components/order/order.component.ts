import { Component, ViewChild, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms'
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', maxHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})

export class OrderComponent {
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSource2 = new MatTableDataSource<InsideOrders>(ELEMENT_DATA2);
  dataSourcePosition = new MatTableDataSource<PositionOrders>(ELEMENT_DATA_POSITION);
  columnsToDisplay = ['ACTION','ACCOUNT_ID', 'BASKET_ID', 'ORDER_ID', 'ORDER_DATE', 'STATUS'];
  columnsToDisplayInside = ['SYMBOL', 'QUANTITY', 'TRADE_ACTION'];
  columnsToDisplayPositions = ['ACCOUNT_ID', 'POSITION_ID', 'QUANTITY', 'PRICE']
  expandedElement!: InsideOrders | null;

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChild(MatSort) sort = {} as MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator.toArray()[10];
    this.dataSourcePosition.paginator = this.paginator.toArray()[10];
    this.dataSource.sort = this.sort;
  }


  getChangeStyle(STATUS: string): string {
    if (STATUS === 'Confirmed') {
      return 'positive-value'; // CSS class for positive values
    } else if (STATUS === 'Pending') {
      return 'negative-value'; // CSS class for negative values
    } else {
      return ''; // No special style for zero values
    }
  }
  
}

export interface PeriodicElement {
  ACCOUNT_ID : number;
  BASKET_ID : number;
  ORDER_ID: number;
  ORDER_DATE : string;
  STATUS : string;
}

export interface InsideOrders {
  SYMBOL : string;
  QUANTITY : number;
  TRADE_ACTION : string;
}

export interface PositionOrders {
  ACCOUNT_ID : number;
  POSITION_ID : number;
  QUANTITY : number;
  PRICE : number;
}



const ELEMENT_DATA: PeriodicElement[] = [
  {
    ACCOUNT_ID: 4546564878,
    BASKET_ID: 9965564878,
    ORDER_ID: 4382,
    ORDER_DATE :  '2022-08-29',
    STATUS : "Confirmed",
  },
  {
    ACCOUNT_ID: 9846564878,
    BASKET_ID: 4546564878,
    ORDER_ID: 4382,
    ORDER_DATE :  '2022-08-09',
    STATUS : "Pending",
  },
  {
    ACCOUNT_ID: 8879954662,
    BASKET_ID: 4546564878,
    ORDER_ID: 4382,
    ORDER_DATE :  '2022-08-19',
    STATUS : "Pending",
  },
  {
    ACCOUNT_ID: 6685244332,
    BASKET_ID: 4546564878,
    ORDER_ID: 4382,
    ORDER_DATE :  '2022-08-29',
    STATUS : "Confirmed",
  },
  {
    ACCOUNT_ID: 5562242488,
    BASKET_ID: 4546564878,
    ORDER_ID: 4382,
    ORDER_DATE :  '2022-08-29',
    STATUS : "Confirmed",
  },
  {
    ACCOUNT_ID: 56632485131,
    BASKET_ID: 4546564878,
    ORDER_ID: 4382,
    ORDER_DATE :  '2022-08-09',
    STATUS : "Pending",
  },
  {
    ACCOUNT_ID: 77521235785,
    BASKET_ID: 4546564878,
    ORDER_ID: 4382,
    ORDER_DATE :  '2022-08-19',
    STATUS : "Confirmed",
  },
  {
    ACCOUNT_ID: 6568234232,
    BASKET_ID: 4546564878,
    ORDER_ID: 4382,
    ORDER_DATE :  '2022-08-29',
    STATUS : "Pending",
  },
  {
    ACCOUNT_ID: 7756219998,
    BASKET_ID: 4546564878,
    ORDER_ID: 4382,
    ORDER_DATE :  '2022-08-29',
    STATUS : "Confirmed",
  },
  {
    ACCOUNT_ID: 77561324551,
    BASKET_ID: 4546564878,
    ORDER_ID: 4382,
    ORDER_DATE :  '2022-08-29',
    STATUS : "Confirmed",
  },
];

const ELEMENT_DATA2: InsideOrders[] = [
  {
    SYMBOL : 'TSLA',
    QUANTITY: 4382,
    TRADE_ACTION : "Confirmed",
  },
  {
    SYMBOL : 'TSLA',
    QUANTITY: 4382,
    TRADE_ACTION : "Pending",
  },
  {
    SYMBOL : 'TSLA',
    QUANTITY: 4382,
    TRADE_ACTION : "Pending",
  },

  {
    SYMBOL : 'TSLA',
    QUANTITY: 4382,
    TRADE_ACTION : "Confirmed",
  },
  {
    SYMBOL : 'TSLA',
    QUANTITY: 4382,
    TRADE_ACTION : "Confirmed",
  },
];

const ELEMENT_DATA_POSITION: PositionOrders[] = [ 
  {
    ACCOUNT_ID : 4546564878,
    POSITION_ID : 88456224,
    QUANTITY : 120,
    PRICE : 333.25,
  },
  {
    ACCOUNT_ID : 4546564878,
    POSITION_ID : 88456224,
    QUANTITY : 120,
    PRICE : 333.25,
  },
  {
    ACCOUNT_ID : 4546564878,
    POSITION_ID : 88456224,
    QUANTITY : 120,
    PRICE : 333.25,
  },
  {
    ACCOUNT_ID : 4546564878,
    POSITION_ID : 88456224,
    QUANTITY : 120,
    PRICE : 333.25,
  },
  {
    ACCOUNT_ID : 4546564878,
    POSITION_ID : 88456224,
    QUANTITY : 120,
    PRICE : 333.25,
  },
  {
    ACCOUNT_ID : 4546564878,
    POSITION_ID : 88456224,
    QUANTITY : 120,
    PRICE : 333.25,
  },

]
