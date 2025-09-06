import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DebugAgent, DebugResponse } from '../services/debug-agent';

@Component({
  selector: 'app-chat-widget',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-widget.html',
  styleUrl: './chat-widget.scss'
})
export class ChatWidget {
  query = '';
  results: DebugResponse[] = [];
  loading = false;

  constructor(private debugService: DebugAgent, private cdr: ChangeDetectorRef) {}

  submitQuery() {
    if (!this.query.trim()) return;

    this.loading = true;

    this.debugService.sendQuery(this.query).subscribe({
      next: (res) => {
        this.results.unshift(res); // show latest on top
        this.query = '';
        this.loading = false;
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges(); // Manually trigger change detection
      },
    });
  }
}
