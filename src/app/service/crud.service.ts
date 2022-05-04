import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../component/dashboard/dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  serviceURL : string ;

  constructor(private http : HttpClient) {
    this.serviceURL = "http://localhost:8080/api/task"
  }


  addTask(task : Task) : Observable<Task> {
    return this.http.post<Task>(this.serviceURL,task);
  }

  getAllTask(searchKey:string) : Observable<Task[]> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("searchKey",searchKey);
    return this.http.get<Task[]>(this.serviceURL,{params:queryParams});
  }

  deleteTask(task : Task) : Observable<Task> {
    return this.http.delete<Task>(this.serviceURL+'/'+task.id);
  }

  editTask(task : Task) : Observable<Task> {
    return this.http.put<Task>(this.serviceURL,task);
  }
}
