import { Component } from '@angular/core';
import {
  WalleApiService,
  WallePullRequest,
  WalleReviewRequest
} from '../../services/api.service';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-review-workspace',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class ReviewWorkspaceComponent {
  repositoryUrl = 'https://github.com/reyhanatash/wall-e';
  branch = 'main';
  authToken = '';

  reviewPrompt = 'Focus on null safety and defensive checks';
  strictness = 6;
  retryFailedSteps = true;
  isAdvancedOpen = true;

  pullRequests: WallePullRequest[] = [];
  selectedPullRequest: WallePullRequest | null = null;

  isLoadingPullRequests = false;
  isRunningReview = false;

  reviewResult: any = null;
  errorMessage = '';

  chips = [
    'Focus on null safety and defensive checks',
    'Flag security-sensitive file and auth flows',
    'Prioritize readability and maintainability',
    'Look for unhandled async and race conditions',
  ];

  selectedChips = new Set<string>([
    'Focus on null safety and defensive checks',
  ]);

  constructor(
    private readonly walleApiService: WalleApiService
  ) { }

  toggleAdvanced(): void {
    this.isAdvancedOpen = !this.isAdvancedOpen;
  }

  onRepoUrlChange(value: string): void {
    this.repositoryUrl = value;
    this.pullRequests = [];
    this.selectedPullRequest = null;
    this.reviewResult = null;
    this.errorMessage = '';
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

  loadPullRequests(): void {
    if (!this.repositoryUrl.trim()) {
      this.errorMessage = 'Repository URL is required.';
      return;
    }

    this.isLoadingPullRequests = true;
    this.errorMessage = '';
    this.pullRequests = [];
    this.selectedPullRequest = null;
    this.reviewResult = null;

    this.walleApiService
      .getPullRequests(
        this.repositoryUrl,
        this.branch
      )
      .subscribe({
        next: (response) => {
          console.log('WALL-E PR RESPONSE:', response);

          this.pullRequests = response.pull_requests || [];

          console.log('WALL-E PULL REQUESTS:', this.pullRequests);

          this.isLoadingPullRequests = false;

          if (!this.pullRequests.length) {
            this.errorMessage =
              'No pull requests found for this repository.';
          }
        },
        error: (error) => {
          this.isLoadingPullRequests = false;

          this.errorMessage =
            error?.error?.message ||
            'Failed to load pull requests.';
        }
      });
  }

  onPullRequestChange(value: string): void {
    const prNumber = Number(value);

    this.selectedPullRequest =
      this.pullRequests.find(
        pr => pr.number === prNumber
      ) || null;

    this.reviewResult = null;
    this.errorMessage = '';
  }

  runReview(): void {
    if (!this.repositoryUrl.trim()) {
      this.errorMessage = 'Repository URL is required.';
      return;
    }

    if (!this.selectedPullRequest) {
      this.errorMessage =
        'Please select a pull request first.';
      return;
    }

    const request: WalleReviewRequest = {
      "review_types": [
    "lint",
    "performance",
    "ui-accessibility"

  ],
      action: 'review',
      repo_url: this.repositoryUrl,
      branch: this.branch,
      pr_number: this.selectedPullRequest.number,
      pr_title: this.selectedPullRequest.title,
      pr_author: this.selectedPullRequest.author,
      pr_branch: this.selectedPullRequest.branch,
      pr_url: this.selectedPullRequest.url,
      pr_body: this.selectedPullRequest.body,
      review_prompt: this.reviewPrompt,
      auto_fix: this.retryFailedSteps,
      fix_suggestion: true

    };

    this.isRunningReview = true;
    this.reviewResult = null;
    this.errorMessage = '';

    this.walleApiService
      .reviewPullRequest(request)
      .subscribe({
        next: (response) => {
          this.reviewResult = response;
          this.isRunningReview = false;
        },
        error: (error) => {
          this.isRunningReview = false;

          this.errorMessage =
            error?.error?.message ||
            'Failed to run AI code review.';
        }
      });
  }
}