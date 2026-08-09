import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './features/components/navbar/navbar.component';
import { ReviewWorkspaceComponent } from './features/components/review/review.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    NavbarComponent,
    ReviewWorkspaceComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Wall-E AI Code Reviwer';
}
