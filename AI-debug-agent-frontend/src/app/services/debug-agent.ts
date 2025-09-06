import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface DebugResponse {
  reply: string;
  sources: {
    stackoverflow: { title: string; link: string }[];
    github: { title: string; link: string }[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class DebugAgent {
  private apiUrl = 'http://localhost:5000/api/debug';
  private sessionId = 'dev-session-1'; // Keep session memory

  constructor(private http: HttpClient) {}

  sendQuery(message: string): Observable<DebugResponse> {
    return this.http.post<DebugResponse>(this.apiUrl, {
      sessionId: this.sessionId,
      message,
    });
  }
}
