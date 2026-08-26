import { Component } from '@angular/core';
import { ReviewComponent } from '../review/review.component';
import { AiReviewHeroComponent } from '../ai-review-hero/ai-review-hero.component';

@Component({
  selector: 'app-dashbaord',
  imports: [AiReviewHeroComponent, ReviewComponent],
  templateUrl: './dashbaord.component.html',
  styleUrl: './dashbaord.component.css'
})
export class DashbaordComponent {

}
