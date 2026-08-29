import { Inject, Injectable, computed, signal } from '@angular/core';
import { Prompt } from '../models/prompt.model';
import { PromptApiService } from './prompt-api.service';
import { PromptApiResponse } from '../models/PromptApiResponse';


@Injectable({ providedIn: 'root' })
export class PromptStoreService {

  private readonly promptApi = Inject(PromptApiService);

  private readonly promptsState = signal<Prompt[]>([
    {
      id: 1,
      title: 'security',
      content: ' Review this code as a senior application security engineer, focusing on OWASP Top 10 vulnerabilities, authentication/authorization, injection, data exposure, secrets, input validation, API security, insecure dependencies, and attack vectors; identify severity, explain the risk and exploitation scenario, and provide concrete secure fixes.'
    },
    {
      id: 2,
      title: 'lint',
      content: 'Review this code as a strict linter: identify code-quality issues, bugs, bad practices, unused code, complexity, naming problems, maintainability issues, and violations of common language/framework best practices, and suggest concise fixes professional.'
    },
    {
      id: 3,
      title: 'performance',
      content: 'Review this code for performance issues, including unnecessary computation, inefficient algorithms, excessive memory usage, redundant API/database calls, unnecessary rendering, blocking operations, and scalability bottlenecks; identify the impact and suggest optimized solutions.'
    },
    {
      id: 4,
      title: 'code quality',
      content: 'Review this code for code quality: identify code smells, duplication, unclear naming, unnecessary complexity, poor readability, SOLID violations, tight coupling, low cohesion, and maintainability issues; suggest clean, simple, and idiomatic improvements'
    }
  ]);

  readonly prompts = computed(() => this.promptsState());
  private readonly _prompts = signal<Prompt[]>([]);

  loadPrompts(): void {
    this.promptApi.getPrompts().subscribe({
      next: (response: PromptApiResponse[]) => {
        const prompts: Prompt[] = response
          .filter(prompt => prompt.active)
          .map(prompt => ({
            id: prompt.id,
            title: prompt.name,
            content: prompt.command
          }));

        this._prompts.set(prompts);
      },
      error: (error: unknown) => {
        console.error('Failed to load prompts', error);
      }
    });
  }

  savePrompt(prompt: Omit<Prompt, 'id'>, selectedId: number | null): Prompt {
    if (selectedId !== null) {
      let updatedPrompt: Prompt | null = null;
      this.promptsState.update((currentPrompts: Prompt[]) =>
        currentPrompts.map((currentPrompt: Prompt) => {
          if (currentPrompt.id === selectedId) {
            updatedPrompt = {
              ...currentPrompt,
              title: prompt.title,
              content: prompt.content
            };
            return updatedPrompt;
          }
          return currentPrompt;
        })
      );

      if (updatedPrompt !== null) {
        return updatedPrompt;
      }
    }

    const nextId: number = this.promptsState().reduce(
      (maxId: number, currentPrompt: Prompt) => Math.max(maxId, currentPrompt.id),
      0
    ) + 1;

    const newPrompt: Prompt = {
      id: nextId,
      title: prompt.title,
      content: prompt.content
    };

    this.promptsState.update((currentPrompts: Prompt[]) => [newPrompt, ...currentPrompts]);
    return newPrompt;
  }

  deletePrompt(promptId: number): void {
    this.promptsState.update((currentPrompts: Prompt[]) =>
      currentPrompts.filter((currentPrompt: Prompt) => currentPrompt.id !== promptId)
    );
  }

  getPromptById(promptId: number): Prompt | undefined {
    return this.promptsState().find((prompt: Prompt) => prompt.id === promptId);
  }
}
