import { Component, OnInit } from '@angular/core';
import { KafkaService } from './kafka.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  messages: any[] = [];

  constructor(private kafkaService: KafkaService) {}

  ngOnInit() {
    this.kafkaService.getMessages().subscribe(data => {
      this.messages = data;
    });
  }
}
