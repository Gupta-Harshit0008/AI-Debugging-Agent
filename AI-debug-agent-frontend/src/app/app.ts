import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatWidget } from './chat-widget/chat-widget';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [ChatWidget,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

   deferredPrompt: any;

  ngOnInit() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault(); // prevent automatic prompt
      this.deferredPrompt = e; // save the event
    });
  }

  installPWA() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt(); // show install prompt
      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('PWA installed');
        } else {
          console.log('PWA install dismissed');
        }
        this.deferredPrompt = null;
      });
    }
  }
  protected readonly title = signal('AI-debug-agent-frontend');
}
