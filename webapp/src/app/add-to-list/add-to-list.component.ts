import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontendService } from '../frontend_service/frontend.service';
import { MANUFACTURER_COLUMN_ID, STATE_COLUMN_ID, TYPE_COLUMN_ID } from '../choiceURLS';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-to-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-to-list.component.html',
  styleUrl: './add-to-list.component.css'
})
export class AddToListComponent {

  stateChoices: any[] = [];
  manufacturerChoices: any[] = [];
  typeChoices: any[] = [];
  addForm!: FormGroup;
  isSubmitted = false;

  constructor(private frontendService: FrontendService, private formBuilder: FormBuilder, private toaster: ToastrService) {
    this.initializeAll();
    this.addForm = this.formBuilder.group({
      id:[],
      model: ['', Validators.required],
      manufacturer: ['', Validators.required],
      type: ['', Validators.required],
      state: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+$'),  Validators.max(1000000)]],
      serialNumber: ['', Validators.required],
      dateOfPurchase: ['', Validators.required],
      photoURL: ['', Validators.required]
    });
  }

  async initializeAll() {
    await this.frontendService.initializeMsal();
    await this.getStateChoices();
    await this.getManufacturerChoices();
    await this.getTypeChoices();
  }

  async getStateChoices() {
    this.frontendService.getColumnChoices(STATE_COLUMN_ID);
    this.frontendService.stateChoices$.subscribe((newStateChoices) => {
      this.stateChoices = newStateChoices;
    });
  }

  async getManufacturerChoices() {
    this.frontendService.getColumnChoices(MANUFACTURER_COLUMN_ID);
    this.frontendService.manufacturerChoices$.subscribe((newManufacturerChoices) => {
      this.manufacturerChoices = newManufacturerChoices;
    });
  }

  async getTypeChoices() {
    this.frontendService.getColumnChoices(TYPE_COLUMN_ID);
    this.frontendService.typeChoices$.subscribe((newTypeChoices) => {
      this.typeChoices = newTypeChoices;
    });
  }

  async onSubmit() {
    try {
      if (this.addForm.valid) {
        await this.frontendService.addItemsToList(this.addForm.value);
        this.toaster.success('Tool added successfully');
        this.addForm.reset();
      }else{
        this.isSubmitted = true;
        return;
      }
    } catch (error) { 
      this.toaster.error('Error adding tool');
      console.log(error);
    }
  }

  get f() {
    return this.addForm.controls;
  }

}
