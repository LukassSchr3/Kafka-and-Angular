import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  template: '<router-outlet></router-outlet>',
})
export class MainComponent {}
