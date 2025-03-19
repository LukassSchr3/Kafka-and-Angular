import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { RecallDetailComponent } from './recall-detail/recall-detail.component';
import { MainComponent } from './main.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: AppComponent, pathMatch: 'full' },
      { path: 'recall/:recall_id', component: RecallDetailComponent },
    ]
  },
];
