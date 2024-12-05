import { CommonModule, formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { FrontendService } from '../frontend_service/frontend.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { STATE_COLUMN_ID, MANUFACTURER_COLUMN_ID, TYPE_COLUMN_ID } from '../choiceURLS';
import { UserService } from '../frontend_service/user.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  msalService = inject(MsalService);
  http = inject(HttpClient);
  items: any[] = [];
  date: any[] = [];
  showForm = false;

  stateChoices: any[] = [];
  manufacturerChoices: any[] = [];
  typeChoices: any[] = [];
  addForm!: FormGroup;
  isSubmitted = false;

  users: any[] = [];
  showUserForm = false;
  addUser!: FormGroup;

  depositItemId: any;

  constructor(private frontendService: FrontendService, private router: Router,
    private formBuilder: FormBuilder, private toaster: ToastrService,
    private userService: UserService) {

    this.initializeMsal();

    this.addForm = this.formBuilder.group({
      id: [],
      model: ['', Validators.required],
      manufacturer: ['', Validators.required],
      type: ['', Validators.required],
      state: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.max(1000000)]],
      serialNumber: ['', Validators.required],
      dateOfPurchase: ['', Validators.required],
      photoURL: ['', Validators.required],
      personId: ['']
    });

    this.addUser = this.formBuilder.group({
      personId: ['']
    });

  }

  ngOnInit() {
    this.callAppropiateGet();
    this.getUsers();
  }

  private async callAppropiateGet() {
    this.frontendService.getListItems();
    if (this.router.url == "/deploy") {
      await this.getDeployedItems();
    }
    else if (this.router.url == "/deposit") {
      await this.getDepositedItems();

    }
  }

  async getUsers() {
    await this.userService.getUsers();
    this.userService.users$.subscribe((newUser) => {
      this.users = newUser;
    });
  }

  async initializeMsal() {
    await this.frontendService.initializeMsal();

    const accounts = this.msalService.instance.getAllAccounts();
    if (accounts.length > 0) {
      console.log('Already logged in:', accounts);
      this.callAppropiateGet();
      this.initializeAll();
      return;
    }

    const response = await this.msalService.instance.handleRedirectPromise();

    if (response) {
      console.log('Authentication successful:', response);
      this.callAppropiateGet();
      this.initializeAll();
    }

  }

  async getDeployedItems() {
    await this.frontendService.getAllOtherItem();
    this.frontendService.allOtherItems$.subscribe((newItems) => {
      this.items = newItems;
      for (let index = 0; index < this.items.length; index++) {
        this.items[index].fields.PurchaseDate = formatDate(this.items[index].fields.PurchaseDate, "yyyy.MM.dd", "en-US");
      }
    });
  }

  async getDepositedItems() {
    await this.frontendService.getAvailableItems();
    this.frontendService.availableItems$.subscribe((newItems) => {
      this.items = newItems;
      for (let index = 0; index < this.items.length; index++) {
        this.items[index].fields.PurchaseDate = formatDate(this.items[index].fields.PurchaseDate, "yyyy.MM.dd", "en-US");
      }
    });
  }

  openForm() {
    this.showForm = true;
    this.initializeAll();
  }

  closeForm() {
    this.isSubmitted = false;
    this.addForm.reset();
    this.showForm = false;
  }

  closeUserForm() {
    this.isSubmitted = false;
    this.addUser.reset();
    this.showUserForm = false;
  }

  async initializeAll() {
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
        this.isSubmitted = false;
        await this.callAppropiateGet();
      } else {
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

  async depositItem(depositItemId: string) {

    // open user pop up form
    this.showUserForm = true;
    this.depositItemId = depositItemId;
    console.log("depid: ", this.depositItemId);

  }

  async onSubmitUser() {

    try {
      if (this.addUser.valid) {
        try {
          console.log("thisAddUserValue", this.addUser.value.personId)
          await this.frontendService.modifyStatusOfItem(this.depositItemId, this.addUser.value.personId);
          await this.callAppropiateGet();
          console.log("depositItem modify available: ", this.items);
          this.toaster.success('Successfully booked tool');
          this.showUserForm = false;
        } catch (error) {
          console.log("error", error);
        }
      } else {
        this.isSubmitted = true;
        return;
      }
    } catch (error) {
      this.toaster.error('Error booking tool');
      console.log(error);
    }


  }

}
