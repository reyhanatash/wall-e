import { Component } from '@angular/core';

@Component({
  selector: 'app-review-workspace',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
})
export class ReviewWorkspaceComponent {
  repositoryUrl = 'https://github.com/org/repo';
  authToken = '';
  reviewPrompt = 'Focus on null safety and defensive checks';
  strictness = 6;
  retryFailedSteps = true;
  isAdvancedOpen = true;

  chips = [
    'Focus on null safety and defensive checks',
    'Flag security-sensitive file and auth flows',
    'Prioritize readability and maintainability',
    'Look for unhandled async and race conditions',
  ];

  selectedChips = new Set<string>([
    'Focus on null safety and defensive checks',
  ]);

  toggleAdvanced(): void {
    this.isAdvancedOpen = !this.isAdvancedOpen;
  }

  onRepoUrlChange(value: string): void {
    this.repositoryUrl = value;
  }

  onAuthTokenChange(value: string): void {
    this.authToken = value;
  }

  onPromptChange(value: string): void {
    this.reviewPrompt = value;
  }

  onStrictnessChange(value: string): void {
    this.strictness = Number(value);
  }

  toggleRetry(): void {
    this.retryFailedSteps = !this.retryFailedSteps;
  }

  isChipSelected(chip: string): boolean {
    return this.selectedChips.has(chip);
  }

  toggleChip(chip: string): void {
    if (this.selectedChips.has(chip)) {
      this.selectedChips.delete(chip);
    } else {
      this.selectedChips.add(chip);
    }

    this.syncPromptFromChips();
  }

  private syncPromptFromChips(): void {
    const chipsText = Array.from(this.selectedChips).join('\n');
    this.reviewPrompt = chipsText || '';
  }

  runReview(): void {
    // اینجا بعداً به API وصلش می‌کنی
    console.log({
      repositoryUrl: this.repositoryUrl,
      branch: 'main',
      authToken: this.authToken,
      reviewPrompt: this.reviewPrompt,
      strictness: this.strictness,
      retryFailedSteps: this.retryFailedSteps,
      selectedChips: Array.from(this.selectedChips),
    });
  }
}
