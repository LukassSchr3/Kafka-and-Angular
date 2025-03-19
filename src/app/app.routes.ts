import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MainComponent } from './main.component';
import { RecallDetailComponent } from './recall-detail/recall-detail.component';
import { AddRecallComponent } from './add-recall/add-recall.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: AppComponent, pathMatch: 'full' },
      { path: 'recall/:recall_id', component: RecallDetailComponent },
      { path: 'recalls/new', component: AddRecallComponent }
    ]
  }
];
