import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recall-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recall-detail.component.html'
})
export class RecallDetailComponent implements OnInit {
  recall: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const recallId = this.route.snapshot.paramMap.get('recall_id');
    this.http.get(`http://localhost:3000/api/recalls/${recallId}`).subscribe(data => {
      this.recall = data;
      console.log('Recall detail:', data);
    }, error => {
      console.error('Error fetching recall detail:', error);
    });
  }
}
