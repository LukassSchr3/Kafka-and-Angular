import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class KafkaService {
  constructor(private http: HttpClient) {}

  getMessages() {
    return this.http.get<string[]>('http://localhost:3000/api/messages');
  }
}


