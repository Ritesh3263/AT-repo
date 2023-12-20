import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { AdminService } from 'src/app/services/admin.service';
import { CreateUserComponent } from '../modals/create-user/create-user.component';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  displayedColumns: string[] = ['profilePhoto', 'displayName', 'email', 'authenticationProvider', 'roles', 'baskets', 'subscribers', 'followers',  'createdAt'];
  dataSource = new MatTableDataSource<any>([]);
  search: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pagination = {
    pageNumber: 0,
    pageSize: 10,
    totalRows: 0
  }

  constructor(public utilityService: UtilitiesService, private adminService: AdminService, public dialog: MatDialog) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.adminService.getUsers(this.pagination.pageNumber, this.pagination.pageSize, this.search).then((results) => {
      if(results && results.success && results.users) {
        this.dataSource = new MatTableDataSource<any>(results.users);
        this.pagination.totalRows = results.users.length ? results.users[0].totalRows : 0;
      }
      else {
        this.utilityService.displayInfoMessage(JSON.stringify(results), true)
      }
    })
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.pageSize = e.pageSize;
    this.pagination.pageNumber = e.pageIndex;
    this.getUsers();
  }

  createUser() {
    let dialogRef= this.dialog.open(CreateUserComponent, {
      panelClass: 'custom-modal',
      disableClose: true,
      data: {header: "Create User", user: null, mode: "CREATE"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result && result.success) {
        this.getUsers();
      }
    });
  }
}
