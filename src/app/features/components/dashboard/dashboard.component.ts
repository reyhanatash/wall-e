import { Component } from '@angular/core';
import { ReviewWorkspaceComponent } from '../review/review.component';
import { AiReviewHeroComponent } from '../ai-review-hero/ai-review-hero.component';

@Component({
  selector: 'app-dashboard',
  imports: [AiReviewHeroComponent, ReviewWorkspaceComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
