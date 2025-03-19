import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  messages: any[] = [];

  constructor(private http: HttpClient) {} // <-- no ActivatedRoute here clearly!

  ngOnInit(): void {
    this.http.get<any>('http://localhost:3000/api/recalls').subscribe({
      next: (data) => {
        console.log('Raw fetched data:', data);
        if (Array.isArray(data)) {
          this.messages = data;
          console.log('Assigned messages:', this.messages);
        } else {
          console.warn('Data fetched is not array:', data);
        }
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }
}
