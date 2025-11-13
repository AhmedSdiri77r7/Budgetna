import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: any;
}

/**
 * Service de gestion des notifications
 * Permet de gérer les notifications en temps réel pour les utilisateurs
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$: Observable<number> = this.unreadCountSubject.asObservable();

  constructor() {
    // Charger les notifications depuis le localStorage au démarrage
    this.loadNotificationsFromStorage();
  }

  /**
   * Ajouter une nouvelle notification
   */
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      read: false,
    };

    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = [newNotification, ...currentNotifications];

    // Limiter à 50 notifications max
    if (updatedNotifications.length > 50) {
      updatedNotifications.pop();
    }

    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
    this.saveNotificationsToStorage();
  }

  /**
   * Marquer une notification comme lue
   */
  markAsRead(notificationId: string): void {
    const notifications = this.notificationsSubject.value;
    const updatedNotifications = notifications.map(n => (n.id === notificationId ? { ...n, read: true } : n));

    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
    this.saveNotificationsToStorage();
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  markAllAsRead(): void {
    const notifications = this.notificationsSubject.value;
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));

    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
    this.saveNotificationsToStorage();
  }

  /**
   * Supprimer une notification
   */
  deleteNotification(notificationId: string): void {
    const notifications = this.notificationsSubject.value;
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);

    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
    this.saveNotificationsToStorage();
  }

  /**
   * Effacer toutes les notifications
   */
  clearAll(): void {
    this.notificationsSubject.next([]);
    this.unreadCountSubject.next(0);
    this.saveNotificationsToStorage();
  }

  /**
   * Obtenir les notifications non lues
   */
  getUnreadNotifications(): Notification[] {
    return this.notificationsSubject.value.filter(n => !n.read);
  }

  /**
   * Notifications prédéfinies pour les événements métier
   */
  notifyBudgetCreated(budgetName: string): void {
    this.addNotification({
      type: 'success',
      title: 'Budget créé',
      message: `Le budget "${budgetName}" a été créé avec succès.`,
      actionUrl: '/pages/layout/accordion',
      actionLabel: 'Voir les budgets',
    });
  }

  notifyBudgetValidated(budgetName: string): void {
    this.addNotification({
      type: 'success',
      title: 'Budget validé',
      message: `Le budget "${budgetName}" a été validé.`,
      actionUrl: '/pages/layout/accordion',
      actionLabel: 'Voir les détails',
    });
  }

  notifyBudgetPending(budgetName: string): void {
    this.addNotification({
      type: 'warning',
      title: 'Budget en attente',
      message: `Le budget "${budgetName}" nécessite votre validation.`,
      actionUrl: '/pages/layout/accordion',
      actionLabel: 'Valider',
    });
  }

  notifyBudgetRejected(budgetName: string, reason?: string): void {
    this.addNotification({
      type: 'danger',
      title: 'Budget rejeté',
      message: reason ? `Budget "${budgetName}" rejeté: ${reason}` : `Le budget "${budgetName}" a été rejeté.`,
      actionUrl: '/pages/layout/accordion',
      actionLabel: 'Voir les détails',
    });
  }

  notifyBudgetDeleted(budgetName: string): void {
    this.addNotification({
      type: 'info',
      title: 'Budget supprimé',
      message: `Le budget "${budgetName}" a été supprimé.`,
    });
  }

  // Méthodes privées
  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateUnreadCount(): void {
    const unreadCount = this.notificationsSubject.value.filter(n => !n.read).length;
    this.unreadCountSubject.next(unreadCount);
  }

  private saveNotificationsToStorage(): void {
    try {
      const notifications = this.notificationsSubject.value;
      localStorage.setItem('app_notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des notifications:', error);
    }
  }

  private loadNotificationsFromStorage(): void {
    try {
      const stored = localStorage.getItem('app_notifications');
      if (stored) {
        const notifications = JSON.parse(stored);
        this.notificationsSubject.next(notifications);
        this.updateUnreadCount();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    }
  }
}
