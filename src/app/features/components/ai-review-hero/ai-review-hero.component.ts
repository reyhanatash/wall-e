import { Component } from '@angular/core';

@Component({
  selector: 'app-ai-review-hero',
  standalone: true,
  templateUrl: './ai-review-hero.component.html',
  styleUrls: ['./ai-review-hero.component.css'],
})
export class AiReviewHeroComponent {
  steps = [
    'Paste a repository URL and choose a branch.',
    'Add a custom prompt or select a preset template.',
    'Run review and inspect findings in the line-by-line tab.',
  ];

  checklist = [
    'Add URL',
    'Add prompt',
    'Run review',
    'Open line-by-line tab',
  ];

  trySampleRepository(): void {
    console.log('Try sample repository');
  }
}