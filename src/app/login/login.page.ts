import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, UserRole } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [FormsModule],
})
export class LoginPage implements OnInit {
  email = '';
  password = '';
  showPassword = false;
  errorMessage = '';

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly landingByRole: Record<UserRole, string> = {
    admin: '/home',
    member: '/home',
  };

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('session') === 'replaced') {
      this.errorMessage = 'This account signed in on another device. Please sign in again.';
    }
  }

  async signIn(): Promise<void> {
    this.errorMessage = '';
    try {
      const role = await this.auth.login(this.email, this.password);
      await this.router.navigateByUrl(this.landingByRole[role]);
    } catch (error) {
      this.errorMessage = error instanceof Error && error.message.startsWith('Firebase is not configured')
        ? error.message
        : 'Email or password is incorrect. Please try again.';
    }
  }
}
