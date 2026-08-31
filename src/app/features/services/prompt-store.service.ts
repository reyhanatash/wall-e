import { Injectable, computed, inject, signal } from '@angular/core';
import { Prompt } from '../models/prompt.model';
import { PromptApiService } from './prompt-api.service';
import { PromptApiResponse } from '../models/PromptApiResponse';

@Injectable({ providedIn: 'root' })
export class PromptStoreService {

  private readonly promptApi = inject(PromptApiService);

  private readonly promptsState = signal<Prompt[]>([
    {
      id: 1,
      title: 'security',
      content: `Find only real security vulnerabilities caused by added (+) lines.
Check XSS/unsafe DOM or HTML, exposed secrets, auth/authorization flaws,
unsafe URLs/APIs, injection, and client-side security bypasses.
No speculation, generic advice, style, or code-quality issues.
If the diff does not prove the vulnerability, return no finding.`
    },
    {
      id: 2,
      title: 'performance',
      content: `Find only real performance problems caused by added (+) lines.
Check expensive repeated work, Angular rendering/change detection,
RxJS misuse, memory leaks, repeated requests, expensive templates,
and inefficient loops/data processing.
No micro-optimizations or theoretical concerns.
If the diff does not show a concrete performance impact, return no finding.`
    },
    {
      id: 3,
      title: 'code-quality',
      content: `Find only important maintainability problems caused by added (+) lines.
Check meaningful duplication, dead code, unnecessary complexity,
bad Angular/TypeScript structure, and redundancy with a real consequence.
Do not report naming/style, formatting, harmless duplication,
empty attributes/classes, or code that is merely unconventional.`
    },
    {
      id: 4,
      title: 'bug-risk',
      content: `Find only real bugs caused by added (+) lines.
Check wrong logic, conditions, null/undefined failures, state errors,
async races, incorrect API usage, broken Angular bindings/expressions,
and malformed structures that actually break behavior.
The failure must be directly explainable from the diff.
No speculation or "could be better" findings.`
    },
    {
      id: 5,
      title: 'ui-accessibility',
      content: `Find only real UI, HTML, Angular, or accessibility problems caused by added (+) lines.
Check malformed HTML, bad nesting, broken Angular syntax, label/control issues,
inaccessible controls, incorrect ARIA/semantics, keyboard failures,
and CSS/layout changes that actually break the UI.
Void elements such as input, img, br, hr, meta and link must not have closing tags.
Do not report empty attributes/classes, minimal inputs, cosmetic issues, or preferences.`
    },
    {
      id: 6,
      title: 'lint',
      content: `Find only concrete lint violations in added (+) lines.
Check TypeScript/Angular ESLint, template, HTML, CSS/SCSS rules,
and syntax/patterns that a common lint rule would reliably reject.
Do not invent project rules or report formatting, style, recommendations,
empty attributes/classes, or harmless redundancy.
If no reliable violation exists, return no finding.`
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

    const nextId: number =
      this.promptsState().reduce(
        (maxId: number, currentPrompt: Prompt) =>
          Math.max(maxId, currentPrompt.id),
        0
      ) + 1;

    const newPrompt: Prompt = {
      id: nextId,
      title: prompt.title,
      content: prompt.content
    };

    this.promptsState.update(
      (currentPrompts: Prompt[]) => [
        newPrompt,
        ...currentPrompts
      ]
    );

    return newPrompt;
  }

  deletePrompt(promptId: number): void {
    this.promptsState.update((currentPrompts: Prompt[]) =>
      currentPrompts.filter(
        (currentPrompt: Prompt) =>
          currentPrompt.id !== promptId
      )
    );
  }

  getPromptById(promptId: number): Prompt | undefined {
    return this.promptsState().find(
      (prompt: Prompt) => prompt.id === promptId
    );
  }
}
