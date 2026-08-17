export interface AppNotification {
  id: string;
  matchId: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}