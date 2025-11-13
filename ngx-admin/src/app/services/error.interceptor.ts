import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenStorageService } from './token-storage.service';
import { NbToastrService } from '@nebular/theme';

/**
 * Intercepteur global pour gérer les erreurs HTTP de manière centralisée
 * Améliore l'expérience utilisateur avec des messages d'erreur cohérents
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private toastrService: NbToastrService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Une erreur est survenue';

        if (error.error instanceof ErrorEvent) {
          // Erreur côté client
          errorMessage = `Erreur: ${error.error.message}`;
        } else {
          // Erreur côté serveur
          switch (error.status) {
            case 400:
              errorMessage = 'Requête invalide. Veuillez vérifier les données saisies.';
              break;
            case 401:
              errorMessage = 'Session expirée. Veuillez vous reconnecter.';
              this.handleUnauthorized();
              break;
            case 403:
              errorMessage = "Vous n'avez pas les permissions nécessaires pour cette action.";
              break;
            case 404:
              errorMessage = 'Ressource non trouvée.';
              break;
            case 409:
              errorMessage = 'Conflit: Cette ressource existe déjà ou a été modifiée.';
              break;
            case 422:
              errorMessage = 'Les données fournies ne sont pas valides.';
              break;
            case 500:
              errorMessage = 'Erreur serveur. Veuillez réessayer ultérieurement.';
              break;
            case 503:
              errorMessage = 'Service temporairement indisponible.';
              break;
            default:
              errorMessage = error.error?.message || `Erreur ${error.status}: ${error.statusText}`;
          }
        }

        // Afficher le toast seulement si ce n'est pas une erreur 401 (déjà gérée)
        if (error.status !== 401) {
          this.showErrorToast(errorMessage, error.status);
        }

        console.error('Erreur HTTP interceptée:', {
          url: req.url,
          method: req.method,
          status: error.status,
          message: errorMessage,
          error: error,
        });

        return throwError(() => error);
      }),
    );
  }

  private handleUnauthorized(): void {
    // Déconnexion et redirection
    this.tokenStorage.signOut();
    this.router.navigate(['/auth/login']);
    this.toastrService.warning('Votre session a expiré', 'Authentification requise', {
      duration: 5000,
      icon: 'alert-circle-outline',
    });
  }

  private showErrorToast(message: string, status: number): void {
    const duration = 5000;
    const icon = 'alert-circle-outline';

    if (status >= 500) {
      this.toastrService.danger(message, 'Erreur Serveur', { duration, icon });
    } else if (status >= 400) {
      this.toastrService.warning(message, 'Attention', { duration, icon });
    } else {
      this.toastrService.info(message, 'Information', { duration, icon });
    }
  }
}
