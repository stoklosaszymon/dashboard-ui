import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {

  }

  headers = new HttpHeaders({
    "Content-type": 'application/json'
  })

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url).pipe(
      catchError( () => { throw "API ERROR" })
    )
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body).pipe(
      catchError( () => { throw "ERROR DURING POST METHOD" })
    )
  }
}
