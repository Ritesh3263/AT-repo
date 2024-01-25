import {AfterViewInit, Component, ViewChild, Input} from '@angular/core';

import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule } from '@angular/material/table';
import {MatSort, Sort, MatSortModule, SortDirection} from '@angular/material/sort';
import {SelectionModel} from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { AdminService } from 'src/app/services/admin.service';
import { BasketsService } from 'src/app/services/baskets.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([])
  selection = new SelectionModel<any>(true, []);
  search!: string

  @Input() dataCallback: any;
  @Input() rowClickCallback: any;
  @Input() columnDetails: any;
  @Input() enableSearch: boolean = false;
  @Input() searchText: string = '';
  @Input() apiDataKey!: string;
  @Input() dataCallbackOptionalParameter: any = null;
  @Input() sortColumn: string | null = null;
  @Input() sortMode: SortDirection = 'asc';
  @Input() parentComponent: any = null;
  @Input() getRowHighlight: Function = (mainComponent: any, row:any) => { return ''}
  @Input() mainComponent: any = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pagination = {
    pageNumber: 0,
    pageSize: 10,
    totalRows: 0
  }

  constructor(public utilityService: UtilitiesService, private adminService: AdminService, public dialog: MatDialog, private _liveAnnouncer: LiveAnnouncer, private basketService: BasketsService) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async ngOnInit() {
    for(let i = 0; i < this.columnDetails.length; i++) {
      this.displayedColumns.push(this.columnDetails[i].key)
      if(this.columnDetails[i].type == 'menu') {
        this.columnDetails[i].subMenuOptions = await this.columnDetails[i].subMenuOptions(this.parentComponent)
      }
    }

    await this.getData();
  }

  async getData(resetPagination = false) {
    if(resetPagination) {
      this.pagination.pageNumber = 0;
    }
    let results = await this.dataCallback(this.pagination.pageNumber, this.pagination.pageSize, this.sortColumn, this.sortMode, this.search, this.dataCallbackOptionalParameter);
    if(results && results.success && results[this.apiDataKey]) {
      this.dataSource = new MatTableDataSource<any>(results[this.apiDataKey]);
      this.pagination.totalRows = results[this.apiDataKey].length ? results[this.apiDataKey][0].totalRows : 0;
    }
    else {
      this.utilityService.displayInfoMessage(JSON.stringify(results), true)
    }

  }

  handlePageEvent(e: PageEvent) {
    this.pagination.pageSize = e.pageSize;
    this.pagination.pageNumber = e.pageIndex;
    this.getData();
  }


  announceSortChange(sortState: any) {
    this.sortColumn = sortState.active;
    this.sortMode = sortState.direction
    this.getData();

    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  async rowCallback(row:any) {
    if(this.rowClickCallback) {
      let result = await this.rowClickCallback(row)
      if(result && result.reload)
        this.getData();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data ? this.dataSource.data.length : 0;
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
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.symbol + 1}`;
  }

  getSelectedItems() {
    return this.selection.selected;
  }
}
