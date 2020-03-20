import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  fullNameLength = 0;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      email: [''],
      skills: this.fb.group({
        skillName: [''],
        experienceInYears: [''],
        proficiency: ['beginner']
      }),
    });

    this.employeeForm.get('fullName').valueChanges.subscribe(
      (value: string) => {
        this.fullNameLength = value.length;
      }
    );

    // this.employeeForm.valueChanges.subscribe(
    //   (value: any) => {
    //     console.log(JSON.stringify(value));
    //   }
    // );

    this.employeeForm.get('skills').valueChanges.subscribe(
      (value: any) => {
        console.log(JSON.stringify(value));
      }
    );
  }

  onSubmit(): void {
    console.log(this.employeeForm.value);

    console.log(this.employeeForm.dirty);
    console.log(this.employeeForm.touched);

    console.log(this.employeeForm.controls.fullName.dirty);
    console.log(this.employeeForm.get('fullName').value);
  }

  // setValue - to update all form controls
  // onLoadDataClick(): void {
  //   this.employeeForm.setValue({
  //     fullName: 'Nenad Stojkovic',
  //     email: 'nenad@gmail.com',
  //     skills: {
  //       skillName: 'C#',
  //       experienceInYears: 5,
  //       proficiency: 'intermediate'
  //     }
  //   });
  // }

  // patchValue - to update a sub-set of form controls
  onLoadDataClick(): void {
    this.employeeForm.patchValue({
      fullName: 'Pragim Technologies',
      email: 'pragim@pragimtech.com',
      // skills: {
      //   skillName: 'C#',
      //   experienceInYears: 5,
      //   proficiency: 'beginner'
      // }
    });
  }

}
