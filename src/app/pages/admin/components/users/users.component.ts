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
  search: string | null = null;

  pageNumber = 0;
  pageSize = 10;

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
    return await this.adminService.getUsers(pageNumber, pageSize, sortColumn, sortMode, search)
  }

  createUser() {
    let dialogRef= this.dialog.open(EditUserComponent, {
      panelClass: 'custom-modal',
      disableClose: true,
      data: {header: "Create User", user: null, mode: "CREATE"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result && result.success) {
        this.getUsers(this.pageNumber, this.pageSize);
      }
    });
  }

  editUser(user: any) {
    let dialogRef= this.dialog.open(EditUserComponent, {
      panelClass: 'custom-modal',
      disableClose: true,
      data: {header: "Edit User", user: user, mode: "EDIT"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result && result.success) {
        this.getUsers(this.pageNumber, this.pageSize);
      }
    });
  }
}
