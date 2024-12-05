import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FrontendService } from '../frontend_service/frontend.service';
import { STATE_COLUMN_ID, MANUFACTURER_COLUMN_ID, TYPE_COLUMN_ID } from '../choiceURLS';
import { UserService } from '../frontend_service/user.service';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.css'
})
export class UpdateComponent {

  stateChoices: any[] = [];
  manufacturerChoices: any[] = [];
  typeChoices: any[] = [];
  updateForm!: FormGroup;
  isSubmitted = false;

  updatingItem: any;
  users: any[] = [];
  currentUserToBeUpdated: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private frontendService: FrontendService,
    private router: Router,
    private toaster: ToastrService,
    private userService: UserService
  ) {

    this.initMsal();

    this.activatedRoute.params.subscribe((params) => {
      if (params.listItemId) {
        this.getItem(params.listItemId);
      }
    });

    this.initializeAll();

  }

  async initMsal() {
    await this.frontendService.initializeMsal();
  }

  async initializeAll() {
    await this.getStateChoices();
    await this.getManufacturerChoices();
    await this.getTypeChoices();
  }

  async getItem(id: string) {
    await this.frontendService.getItemById(id);
  }

  ngOnInit() {
    this.frontendService.gotItem$.subscribe((newItem) => {
      this.updatingItem = newItem;
      if (this.updatingItem.length == 1) {
        this.getUsers();
        this.getCurrentUser();
        this.userService.updatePerson$.subscribe((newUser) => {
          this.currentUserToBeUpdated = newUser;
          if (this.currentUserToBeUpdated.length == 1) {
            this.initializeForm();
          }
        })
      }
    });
  }

  
  async initializeForm() {

    const dateOfPurchase = new Date(this.updatingItem[0].fields.PurchaseDate);
    const formattedDate = dateOfPurchase.toISOString().split('T')[0];

    console.log(this.currentUserToBeUpdated[0].fields.id)

    this.updateForm = this.formBuilder.group({
      id: [this.updatingItem[0].fields.Title],
      model: [this.updatingItem[0].fields.Model, Validators.required],
      manufacturer: [this.updatingItem[0].fields.Manufacturer, Validators.required],
      type: [this.updatingItem[0].fields.AssetType, Validators.required],
      state: [this.updatingItem[0].fields.Status, Validators.required],
      price: [this.updatingItem[0].fields.PurchasePrice, [Validators.required, Validators.pattern('^[0-9]+$'), Validators.max(1000000)]],
      serialNumber: [this.updatingItem[0].fields.SerialNumber, Validators.required],
      dateOfPurchase: [formattedDate, Validators.required],
      photoURL: [this.updatingItem[0].fields.photoURL, Validators.required],
      personId: [this.currentUserToBeUpdated[0].fields.name]
    });

  }

  async getUsers() {
    await this.userService.getUsers();
    this.userService.users$.subscribe((newUser) => {
      this.users = newUser;
    });
  }

  async getCurrentUser() {
    await this.userService.getPersonById(this.updatingItem[0].fields.personIdLookupId);
    this.userService.updatePerson$.subscribe((newUser) => {
      this.currentUserToBeUpdated = newUser;
    });
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


  get f() {
    return this.updateForm.controls;
  }

  async onSubmit() {

    this.isSubmitted = true;
    if (this.updateForm.invalid) {
      this.toaster.error('Invalid form!');
      return;
    }

    const formData = this.updateForm.value;
    const id = this.updatingItem[0].fields.id;

    this.updatingItem = ({
      id: id,
      model: formData.model,
      manufacturer: formData.manufacturer,
      type: formData.type,
      state: formData.state,
      price: formData.price,
      serialNumber: formData.serialNumber,
      dateOfPurchase: formData.dateOfPurchase,
      photoURL: formData.photoURL,
      personId: formData.personId
    });

    try {
      await this.frontendService.updateItem(id, this.updatingItem);
      this.toaster.success('Tool updated successfully');
      this.router.navigateByUrl("/");
    } catch (error) {
      this.toaster.error('Invalid form!');
    }
  }

  async deleteItem() {

    const id = this.updatingItem[0].fields.id;

    try {
      await this.frontendService.deleteItem(id);
      this.toaster.success('Tool deleted successfully');
      this.router.navigateByUrl("/");
    } catch (error) {
      this.toaster.error('Tool delete error');
    }

  }


}
