import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FrontendService } from '../frontend_service/frontend.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../frontend_service/user.service';

@Component({
  selector: 'app-add-person',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-person.component.html',
  styleUrl: './add-person.component.css'
})
export class AddPersonComponent {

  addForm!: FormGroup;
  isSubmitted = false;

  constructor(private frontendService: FrontendService, private formBuilder: FormBuilder, private toaster: ToastrService, private userService: UserService) {
    this.initializeAll();
    this.addForm = this.formBuilder.group({
      id:[],
      name: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  async initializeAll() {
    await this.frontendService.initializeMsal();
    await this.userService.getUsers();
  }

  async onSubmit() {
    try {
      if (this.addForm.valid) {
        await this.userService.addPersonToList(this.addForm.value);
        this.toaster.success('Person added successfully');
        this.addForm.reset();
      }else{
        this.isSubmitted = true;
        return;
      }
    } catch (error) { 
      this.toaster.error('Error adding person');
      console.log(error);
    }
  }

  get f() {
    return this.addForm.controls;
  }

}
