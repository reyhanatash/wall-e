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
      title: 'Welcome Email Draft',
      content: 'Write a warm welcome email for a new customer who just signed up for a 14-day free trial. Include a friendly greeting, 3 onboarding steps, and a helpful closing line.'
    },
    {
      id: 2,
      title: 'Meeting Summary Prompt',
      content: 'Summarize the meeting notes into action items, decisions made, blockers, and owners. Use concise bullet points and keep the tone professional.'
    },
    {
      id: 3,
      title: 'Social Post Generator',
      content: 'Create 5 short social media post variations for a product launch. Use a confident tone, include a light call to action, and avoid hashtags unless clearly relevant.'
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
