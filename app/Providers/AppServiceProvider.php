<?php

namespace App\Providers;

use App\Contracts\MalwareScanner;
use App\Models\Deadline;
use App\Models\MatterEvent;
use App\Models\Task;
use App\Models\User;
use App\Services\ClamAvMalwareScanner;
use App\Services\GoogleCalendarSyncDispatcher;
use App\Services\NotificationAccess;
use Carbon\CarbonImmutable;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Notifications\Events\NotificationSending;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(MalwareScanner::class, ClamAvMalwareScanner::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        Event::listen(NotificationSending::class, function (NotificationSending $event): bool {
            if (! $event->notifiable instanceof User) {
                return true;
            }

            return app(NotificationAccess::class)->allowsNotification($event->notifiable, $event->notification);
        });

        foreach ([MatterEvent::class, Deadline::class, Task::class] as $calendarModel) {
            $calendarModel::saved(fn () => app(GoogleCalendarSyncDispatcher::class)->dispatchAll());
            $calendarModel::deleted(fn () => app(GoogleCalendarSyncDispatcher::class)->dispatchAll());
        }

        RateLimiter::for('signature-sign', fn (Request $request) => Limit::perMinute(10)->by($request->ip()));

        ResetPassword::toMailUsing(function (object $notifiable, string $token) {
            $resetUrl = rtrim((string) config('app.url'), '/').route('password.reset', [
                'token' => $token,
                'email' => $notifiable->getEmailForPasswordReset(),
            ], false);

            return (new MailMessage)
                ->subject('[Keamanan Akun] Permintaan Reset Password RPK Workspace')
                ->view('mail.auth-reset-password', [
                    'token' => $token,
                    'resetUrl' => $resetUrl,
                    'recipientName' => $notifiable->name ?? 'Rekan Pengguna',
                ]);
        });

        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
            return (new MailMessage)
                ->subject('[Verifikasi Email] Konfirmasi Alamat Email RPK Workspace')
                ->view('mail.auth-verify-email', [
                    'verificationUrl' => $url,
                    'recipientName' => $notifiable->name ?? 'Rekan Pengguna',
                ]);
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        Model::preventLazyLoading(! app()->isProduction());

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
