import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [NgFor],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: true
})
export class NavbarComponent {

  isMenuOpen = false;

  menuItems = [
    { label: 'Dashboard', link: '/dashboard' },
    { label: 'Prompts', link: '/prompts' },
    { label: 'Reviews', link: '/reviews' },
    { label: 'History', link: '/history' }
  ];

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

}
