import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppNotification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<AppNotification[]>([]);
  private subscribedMatchIds$ = new BehaviorSubject<string[]>([]);

  notifications = this.notifications$.asObservable();
  subscribedMatchIds = this.subscribedMatchIds$.asObservable();

  toggleMatchSubscription(matchId: string, matchTitle: string): boolean {
    const currentSubs = this.subscribedMatchIds$.value;
    const exists = currentSubs.includes(matchId);

    if (exists) {
      const updated = currentSubs.filter(id => id !== matchId);
      this.subscribedMatchIds$.next(updated);
      this.addNotification(matchId, 'Odjava sa utakmice', `Isključili ste obaveštenja za: ${matchTitle}`);
      return false;
    } else {
      this.subscribedMatchIds$.next([...currentSubs, matchId]);
      this.addNotification(matchId, 'Prijava na utakmicu 🏀', `Uspešno ste se prijavili za utakmicu: ${matchTitle}`);
      return true;
    }
  }

  notifyLike(postTitle: string): void {
    this.addNotification(
      'post-like',
      'Novi lajk! ❤️',
      `Sviđa vam se objava: "${postTitle}"`
    );
  }

  notifyComment(postTitle: string, commentText: string): void {
    this.addNotification(
      'post-comment',
      'Novi komentar! 💬',
      `Dodat je komentar na "${postTitle}": "${commentText}"`
    );
  }

  isSubscribed(matchId: string): boolean {
    return this.subscribedMatchIds$.value.includes(matchId);
  }

  addNotification(matchId: string, title: string, message: string): void {
    const newNotif: AppNotification = {
      id: Date.now().toString(),
      matchId,
      title,
      message,
      timestamp: new Date(),
      read: false
    };
    this.notifications$.next([newNotif, ...this.notifications$.value]);
  }

  markAllAsRead(): void {
    const updated = this.notifications$.value.map(n => ({ ...n, read: true }));
    this.notifications$.next(updated);
  }

  getUnreadCount(): number {
    return this.notifications$.value.filter(n => !n.read).length;
  }
}