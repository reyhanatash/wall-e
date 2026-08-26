import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiReviewHeroComponent } from './ai-review-hero.component';

describe('AiReviewHeroComponent', () => {
  let component: AiReviewHeroComponent;
  let fixture: ComponentFixture<AiReviewHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiReviewHeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiReviewHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
