import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { PromptStoreService } from '../../services/prompt-store.service';
import { Prompt } from '../../models/prompt.model';

@Component({
  selector: 'app-prompt-studio',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './prompt-studio.component.html',
  styleUrl: './prompt-studio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'd-block min-vh-100'
  }
})
export class PromptStudioComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly promptStore = inject(PromptStoreService);

  readonly prompts = this.promptStore.prompts;
  readonly selectedPromptId = signal<number | null>(null);
  readonly pendingDeletePrompt = signal<Prompt | null>(null);
  readonly saveLabel = computed(() => (this.selectedPromptId() !== null ? 'Update Prompt' : 'Save Prompt'));

  readonly promptForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    content: ['', [Validators.required, Validators.maxLength(50000)]]
  });

  selectPrompt(prompt: Prompt): void {
    this.selectedPromptId.set(prompt.id);
    this.promptForm.setValue({
      title: prompt.title,
      content: prompt.content
    });
    this.promptForm.markAsPristine();
  }

  savePrompt(): void {
    if (this.promptForm.invalid) {
      this.promptForm.markAllAsTouched();
      return;
    }

    const formValue = this.promptForm.getRawValue();
    const savedPrompt: Prompt = this.promptStore.savePrompt(
      {
        title: formValue.title.trim(),
        content: formValue.content.trim()
      },
      this.selectedPromptId()
    );

    this.selectedPromptId.set(savedPrompt.id);

    this.promptStore.savePrompt(
      {
        title: formValue.title.trim(),
        content: formValue.content.trim()
      },
      this.selectedPromptId()
    );

    this.promptForm.setValue({
      title: '',
      content: ''
    });
    this.promptForm.markAsPristine();
    this.selectedPromptId.set(null);
  }

  requestDelete(prompt: Prompt, event: Event): void {
    event.stopPropagation();
    this.pendingDeletePrompt.set(prompt);
  }

  cancelDelete(): void {
    this.pendingDeletePrompt.set(null);
  }

  confirmDelete(): void {
    const promptToDelete: Prompt | null = this.pendingDeletePrompt();

    if (promptToDelete === null) {
      return;
    }

    this.promptStore.deletePrompt(promptToDelete.id);

    if (this.selectedPromptId() === promptToDelete.id) {
      this.selectedPromptId.set(null);
      this.promptForm.setValue({
        title: '',
        content: ''
      });
      this.promptForm.markAsPristine();
    }

    this.pendingDeletePrompt.set(null);
  }

  clearEditor(): void {
    this.selectedPromptId.set(null);
    this.promptForm.setValue({
      title: '',
      content: ''
    });
    this.promptForm.markAsPristine();
  }

  isSelected(promptId: number): boolean {
    return this.selectedPromptId() === promptId;
  }

  trackPrompt(index: number, prompt: Prompt): number {
    return prompt.id;
  }
  
}
