import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray, FormControl } from '@angular/forms';
import { CustomValidators } from '../shared/custom.validators';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from './employee.service';
import { IEmployee } from './IEmployee';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;

  formErrors = {
  };

  validationMessages = {
    fullName: {
      required: 'Full Name is required.',
      minlength: 'Full Name must be greater than 2 characters.',
      maxlength: 'Full Name must be less than 10 characters.'
    },
    email: {
      required: 'Email is required.',
      emailDomain: 'Email domian should be gmail.com'
    },
    confirmEmail: {
      required: 'Confirm Email is required.'
    },
    emailGroup: {
      emailMismatch: 'Email and Confirm Email do not match.'
    },
    phone: {
      required: 'Phone is required.'
    }
  };

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private employeeService: EmployeeService) { }

  ngOnInit() {
    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactPreference: ['email'],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, CustomValidators.emailDomain('gmail.com')]],
        confirmEmail: ['', [Validators.required]],
      }, { validator: matchEmails }),
      phone: [''],
      skills: this.fb.array([
        this.addSkillFormGroup()
      ])
    });

    this.employeeForm.get('contactPreference')
      .valueChanges.subscribe((data: string) => {
        this.onContactPrefernceChange(data);
    });

    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    });

    this.route.paramMap.subscribe(params => {
      const empId = +params.get('id');
      if (empId) {
        this.getEmployee(empId);
      }
    });
  }

  getEmployee(id: number) {
    this.employeeService.getEmployee(id)
      .subscribe(
        (employee: IEmployee) => this.editEmployee(employee),
        (err: any) => console.log(err)
      );
  }

  // FIX: custom Validator emailDomain doesn't work now
  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPreference: employee.contactPreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email
      },
      phone: employee.phone
    });
  }

  addSkillButtonClick(): void {
    (this.employeeForm.get('skills') as FormArray).push(this.addSkillFormGroup());
  }

  removeSkillButtonClick(skillGroupIndex: number): void {
    (this.employeeForm.get('skills') as FormArray).removeAt(skillGroupIndex);
  }

  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required]
    });
  }

  onContactPrefernceChange(selectedValue: string) {
    const phoneFormControl = this.employeeForm.get('phone');
    const emailFormControl = this.employeeForm.get('emailGroup').get('email');
    const confirmEmailFormControl = this.employeeForm.get('emailGroup').get('confirmEmail');
    if (selectedValue === 'phone') {
      // phoneFormControl.setValidators([Validators.required, Validators.minLength(5)]);
      phoneFormControl.setValidators(Validators.required);
      emailFormControl.clearValidators();
      confirmEmailFormControl.clearValidators();
    } else {
      phoneFormControl.clearValidators();
      emailFormControl.setValidators(Validators.required);
      confirmEmailFormControl.setValidators(Validators.required);
    }
    phoneFormControl.updateValueAndValidity();
    emailFormControl.updateValueAndValidity();
    confirmEmailFormControl.updateValueAndValidity();
  }

  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty || abstractControl.value !== '')) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }

    });
  }

  onSubmit(): void {
    console.log(this.employeeForm.value);

    console.log(this.employeeForm.dirty);
    console.log(this.employeeForm.touched);

    console.log(this.employeeForm.controls.fullName.dirty);
    console.log(this.employeeForm.get('fullName').value);
  }

  onLoadDataClick(): void {
    const formArray = new FormArray([
      new FormControl('John', Validators.required),
      new FormGroup({
        country: new FormControl('', Validators.required)
      }),
      new FormArray([])
    ]);

    // console.log(formArray.length);

    // for (const control of formArray.controls) {
    //   if (control instanceof FormControl) {
    //     console.log('control is FormControl');
    //   }
    //   if (control instanceof FormGroup) {
    //     console.log('control is FormGroup');
    //   }
    //   if (control instanceof FormArray) {
    //     console.log('control is FormArray');
    //   }
    // }

    const formArray1 = this.fb.array([
      new FormControl('John', Validators.required),
      new FormControl('IT', Validators.required),
      new FormControl('', Validators.required)
    ]);

    // console.log(formArray1.value);
    // console.log(formArray1.valid);

    // formArray1.push(new FormControl('Mark', Validators.required));

    // console.log(formArray1.at(3).value);

    const formGroup = this.fb.group([
      new FormControl('John', Validators.required),
      new FormControl('IT', Validators.required),
      new FormControl('', Validators.required)
    ]);

    console.log(formArray1);
    console.log(formGroup);

  }

}

function matchEmails(group: AbstractControl): { [key: string]: any } | null {
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');

  if (emailControl.value === confirmEmailControl.value || (confirmEmailControl.pristine
    && confirmEmailControl.value === '')) {
    return null;
  } else {
    return { emailMismatch: true };
  }
}

