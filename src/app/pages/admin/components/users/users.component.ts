import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { AdminService } from 'src/app/services/admin.service';
import { EditUserComponent } from '../modals/edit-user/edit-user.component';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  pageNumber = 0;
  pageSize = 10;
  search: string | null = null
  sortMode: string | null = null
  sortColumn: string | null = null
  columnDetails = [
    {
      label: null,
      key: 'profilePhoto',
      type: 'image'
    },
    {
      label: 'Name',
      key: 'displayName',
      type: 'text'
    },
    {
      label: 'Email',
      key: 'email',
      type: 'text'
    },
    {
      label: 'Login Provider',
      key: 'authenticationProvider',
      type: 'text'
    },
    {
      label: 'Roles',
      key: 'roles',
      type: 'text'
    },
    {
      label: 'Baskets',
      key: 'baskets',
      type: 'text'
    },
    {
      label: 'Subscribers',
      key: 'subscribers',
      type: 'text'
    },
    {
      label: 'Followers',
      key: 'followers',
      type: 'text'
    } ,
    {
      label: 'Created At',
      key: 'createdAt',
      type: 'date'
    }
  ]

  constructor(public utilityService: UtilitiesService, private adminService: AdminService, public dialog: MatDialog) {}

  async getUsers(pageNumber: number, pageSize: number, sortColumn : string | null = null, sortMode : string | null = null, search : string | null = null) {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.sortMode = sortMode;
    this.sortColumn = sortColumn;
    this.search = search;
    return await this.adminService.getUsers(pageNumber, pageSize, sortColumn, sortMode, search)
  }

  async createUser() {
    let dialogRef= this.dialog.open(EditUserComponent, {
      panelClass: 'custom-modal',
      disableClose: true,
      data: {header: "Create User", user: {}, mode: "CREATE"}
    });

    return new Promise((resolve) => {
      dialogRef.afterClosed().subscribe(async result => {
        return resolve({reload: result && result.success});
      });
    })
  }

  async editUser(user: any) {
    let dialogRef= this.dialog.open(EditUserComponent, {
      panelClass: 'custom-modal',
      disableClose: true,
      data: {header: "Edit User", user: JSON.parse(JSON.stringify(user)), mode: "EDIT"}
    });

    return new Promise((resolve) => {
      dialogRef.afterClosed().subscribe(async result => {
        return resolve({reload: result && result.success});
      });
    })

  }
}
