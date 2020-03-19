import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;

  constructor() { }

  ngOnInit() {
    // FormGroup -> Go to Definition
    this.employeeForm = new FormGroup({
      // FormControl -> Go to Definition
      fullName: new FormControl(),
      email: new FormControl(),
      skills: new FormGroup({
        skillName: new FormControl(),
        experienceInYears: new FormControl(),
        proficiency: new FormControl()
      })
    });
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
