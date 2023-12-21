import {AfterViewInit, Component, ViewChild, Input} from '@angular/core';

import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule } from '@angular/material/table';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';

import { MatDialog } from '@angular/material/dialog';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([])
  search!: string
  sortColumn!: string
  sortMode!: string

  @Input() dataCallback: any;
  @Input() rowClickCallback: any;
  @Input() columnDetails: any;
  @Input() enableSearch: boolean = false;
  @Input() searchText: string = '';
  @Input() apiDataKey!: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pagination = {
    pageNumber: 0,
    pageSize: 10,
    totalRows: 0
  }

  constructor(public utilityService: UtilitiesService, private adminService: AdminService, public dialog: MatDialog, private _liveAnnouncer: LiveAnnouncer) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async ngOnInit() {
    for(let i = 0; i < this.columnDetails.length; i++) {
      this.displayedColumns.push(this.columnDetails[i].key)
    }
    await this.getData();
  }

  async getData() {
    let results = await this.dataCallback(this.pagination.pageNumber, this.pagination.pageSize, this.sortColumn, this.sortMode, this.search);

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
}
