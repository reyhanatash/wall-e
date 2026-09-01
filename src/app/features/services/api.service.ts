import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WallePullRequest {
  number: number;
  title: string;
  author: string;
  branch: string;
  base_branch: string;
  url: string;
  body: string;
  state: string;
}

export interface WallePrListResponse {
  success: boolean;
  action: string;
  repository: string;
  branch: string;
  count: number;
  pull_requests: WallePullRequest[];
}

export interface WalleReviewRequest {
  review_types:any;
  action: 'review';
  repo_url: string;
  branch: string;
  pr_number: number;
  pr_title?: string;
  pr_author?: string;
  pr_branch?: string;
  pr_url?: string;
  pr_body?: string;
  review_prompt?: string;
  auto_fix?: boolean;
  fix_suggestion: boolean
}

@Injectable({
  providedIn: 'root'
})
export class WalleApiService {
  private readonly apiUrl = '/walle/review';

  constructor(private readonly http: HttpClient) {}

  getPullRequests(
    repoUrl: string,
    branch: string
  ): Observable<WallePrListResponse> {
    return this.http.post<WallePrListResponse>(this.apiUrl, {
      action: 'list_prs',
      repo_url: repoUrl,
      branch
    });
  }

  reviewPullRequest(request: WalleReviewRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, request);
  }
}