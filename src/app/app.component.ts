import { AfterViewInit, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import axios from 'axios';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'assignment';

  constructor(
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) {}

  @ViewChild(MatTable) table: MatTable<User> | undefined;

  @ViewChild(MatSort)
  sort!: MatSort;
  apiData: any[] = [];

  submitted = false;

  contactForm = this.formBuilder.group({
    first_name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    last_name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    avatar: new FormControl('', [Validators.required]),
  });

  dataSource = new MatTableDataSource<User>();
  displayedColumns = ['id', 'first_name', 'last_name', 'email', 'avatar'];

  ngOnInit() {
    this.getDataFromApi();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  addDataToTable() {
    this.submitted = true;
    if (this.contactForm.valid) {
      let formData = this.contactForm.getRawValue();
      formData = { ...formData, id: 9 };

      let copyOfDS = this.apiData;
      copyOfDS.push(formData);

      this.dataSource.data = copyOfDS;

      this._snackBar.open('Row Added!!!', 'Close');

      this.table?.renderRows();
    } else {
      // Swal.fire({
      //   title: 'Invalid Data',
      //   text: 'Enter valid data',
      //   icon: 'error',
      //   confirmButtonText: 'Okay',
      // });
      // }).then((result) => {
      //   // if (result.isConfirmed) {
      //   //   Swal.fire(
      //   //     'Deleted!',
      //   //     'Your imaginary file has been deleted.',
      //   //     'success'
      //   //   )
      //   // For more information about handling dismissals please visit
      //   // https://sweetalert2.github.io/#handling-dismissals
      //   }
      // });
    }
  }

  async getDataFromApi() {
    let data = await axios.get('https://reqres.in/api/users');
    this.apiData = data.data.data;
    this.dataSource.data = this.apiData;
  }

  get first_name() {
    return this.contactForm.get('first_name');
  }

  get last_name() {
    return this.contactForm.get('last_name');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get avatar() {
    return this.contactForm.get('avatar');
  }
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}
