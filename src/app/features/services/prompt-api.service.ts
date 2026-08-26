import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PromptApiResponse } from '../models/PromptApiResponse';



@Injectable({
  providedIn: 'root'
})
export class PromptApiService {
  private readonly http = inject(HttpClient);

  getPrompts(): Observable<PromptApiResponse[]> {
    return this.http.get<PromptApiResponse[]>('/ai/prompts');
  }
}