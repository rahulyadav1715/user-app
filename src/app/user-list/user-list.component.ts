import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  displayedColumns: string[] = ['userName', 'email', 'phoneNo', 'action'];
  dataSource = new MatTableDataSource<User>();

  userForm!: FormGroup;
  showValidation = false;

  userList: Array<User> = [];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      users: this.formBuilder.array([])
    });
    
    const users = localStorage.getItem('users');
    if (users) {
      this.userList = JSON.parse(users);
      if (this.userList.length > 0) {
        this.userList.forEach(user => {
          this.addNewRow(user);
        })
      }
    }
  }

  get userFormArray(): any {
    return this.userForm.get('users') as FormArray;
  }

  addNewRow(user: User) {
    const formGroup = this.initializeUserForm();
    this.userFormArray.push(formGroup);
    formGroup.patchValue(user);
    this.dataSource = new MatTableDataSource(this.userFormArray.controls);
    this.showValidation = false;
  }

  initializeUserForm(): FormGroup {
    return this.formBuilder.group({
      userName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNo: new FormControl('', [Validators.required]),
      isEdit: new FormControl(false),
    });
  }

  onEdit(rowFormGroup: FormGroup, index: number) {
    rowFormGroup.controls['isEdit'].setValue(true);
    rowFormGroup.patchValue(this.userList[index]);
  }

  onCancel(rowFormGroup: FormGroup, index: number) {
    rowFormGroup.controls['isEdit'].setValue(false);
    rowFormGroup.patchValue(this.userList[index]);
  }

  onSave(rowFormGroup: FormGroup, index: number) {
    if (rowFormGroup.invalid) {
      rowFormGroup.markAllAsTouched();
      this.showValidation = true;
      return;
    }
    this.showValidation = false;

    const formValue = JSON.parse(JSON.stringify(rowFormGroup.value));
    delete formValue.isEdit;
    this.userList[index] = { ...this.userList[index], ...formValue };
    localStorage.setItem('users', JSON.stringify(this.userList));
    rowFormGroup.controls['isEdit'].setValue(false);
  }

}
