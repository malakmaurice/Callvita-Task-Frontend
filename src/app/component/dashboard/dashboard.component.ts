import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/service/crud.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

export interface Task {
  id: Number,
  name: string,
  description: string
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  closeResult = '';
  searchKey: string='';
 
  edited: boolean = false
  saveForm: FormGroup = new FormGroup({});
  submittedSaveorm = false;
  task: Task = { id: -1, name: '', description: '' }

  taskArr: Task[] = [
  ];

  constructor(private crudService: CrudService, private modalService: NgbModal, private fb: FormBuilder) {
    this.saveForm = fb.group({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });
  }



  ngOnInit(): void {
    this.getAllTask();
    this.submittedSaveorm=false;
    this.saveForm.reset();
  }

  get description() { return this.saveForm.get('description'); }
  get name() { return this.saveForm.get('name'); }

  saveTask() {
    this.submittedSaveorm = true;
    if (this.saveForm.valid) {

      
      this.task.name = this.name?.value;
      this.task.description = this.description?.value;
      console.log(this.task)
      if (this.edited) {
        this.crudService.editTask(this.task).subscribe((data) => {
          this.ngOnInit();
        }, err => {
          alert(err);
        });
      } else {
        this.crudService.addTask(this.task).subscribe((data) => {
          this.ngOnInit();
        }, err => {
          alert(err);
        });
      }
    }
  }
  getAllTask() {
    this.crudService.getAllTask(this.searchKey).subscribe(res => {

      this.taskArr = res;
    }, err => {
      alert("Unable to get list of tasks");
    });
  }

  deleteTask(etask: Task) {
    this.crudService.deleteTask(etask).subscribe(res => {
      this.ngOnInit();
    }, err => {
      alert("Failed to delete task");
    });
  }

  open(content: any, task?: Task | undefined, edited: boolean = false) {
    this.edited = edited;
    if (task != undefined) {
      this.saveForm.patchValue({
        name: task.name,
        description: task.description
      })
      this.task = task;
    }
    this.modalService.open(content,
      { ariaLabelledBy: 'modal-basic-title', windowClass: 'my-class' }).result.then((result: any) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason: any) => {
        this.closeResult =
          `Dismissed ${this.getDismissReason(reason)}`;
      });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
