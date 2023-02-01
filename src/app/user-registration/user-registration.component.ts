import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { passwordMatch } from '../validations/password-match';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent implements OnInit {

  displayedColumns: string[] = ['userName', 'email', 'phoneNo', 'password', 'confirmPassword', 'action'];
  dataSource = new MatTableDataSource<User>();

  userForm!: FormGroup;
  showValidation = false;

  constructor(private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    localStorage.removeItem('users');
    this.userForm = this.formBuilder.group({
      users: this.formBuilder.array([])
    });
    this.addNewRow();
  }

  get userFormArray(): any {
    return this.userForm.get('users') as FormArray;
  }

  addNewRow(checkValidation: boolean = false) {
    if (checkValidation && this.isFormInvalid()) {
      return;
    }
    this.showValidation = false;
    this.userFormArray.push(this.initializeUserForm());
    this.dataSource = new MatTableDataSource(this.userFormArray.controls);
  }

  deleteRow(i: number) {
    this.userFormArray.removeAt(i);
    this.dataSource = new MatTableDataSource(this.userFormArray.controls);
    localStorage.setItem('users', JSON.stringify(this.userForm.value.users));
  }

  initializeUserForm(): FormGroup {
    return this.formBuilder.group({
      userName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNo: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      hidePassword: new FormControl(true),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      hideConfirmPassword: new FormControl(true),
    }, { validators: passwordMatch });
  }

  isFormInvalid() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.showValidation = true;
      return true;
    }
    this.showValidation = false;
    return false;
  }

  onSubmit() {
    if (this.isFormInvalid()) {
      return;
    }

    let users: Array<any> = JSON.parse(JSON.stringify(this.userForm.value.users));
    users = users.map(user => {
      delete user.hidePassword;
      delete user.confirmPassword;
      delete user.hideConfirmPassword;
      return user;
    })
    localStorage.setItem('users', JSON.stringify(users));
    this.router.navigate(['user-detail']);
  }

}
