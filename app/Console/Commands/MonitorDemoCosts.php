<?php

namespace App\Console\Commands;

use App\Models\PronunciationLog;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class MonitorDemoCosts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'demo:monitor-costs';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Monitor daily demo costs and pause if over limit';

    private const DAILY_LIMIT = 25.00;
    private const WARNING_THRESHOLD = 20.00;

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $todaysCost = PronunciationLog::getTodaysCost();
        
        $this->info("Today's Azure cost: $" . number_format($todaysCost, 2));

        if ($todaysCost >= self::DAILY_LIMIT) {
            // Pause demo until end of day
            Cache::put('demo_paused', true, now()->endOfDay());
            
            Log::warning('Demo paused due to cost limit', [
                'cost' => $todaysCost,
                'limit' => self::DAILY_LIMIT,
            ]);

            $this->sendCostAlert($todaysCost, 'LIMIT_EXCEEDED');
            $this->error("Demo paused - cost limit exceeded!");
            
        } elseif ($todaysCost >= self::WARNING_THRESHOLD) {
            Log::info('Demo cost warning threshold reached', [
                'cost' => $todaysCost,
                'threshold' => self::WARNING_THRESHOLD,
            ]);

            $this->sendCostAlert($todaysCost, 'WARNING');
            $this->warn("Warning: Approaching cost limit");
        }

        // Additional stats
        $totalUsers = PronunciationLog::whereDate('created_at', today())
            ->distinct('email')
            ->count();
            
        $totalAttempts = PronunciationLog::whereDate('created_at', today())
            ->count();

        $this->info("Today's stats:");
        $this->info("- Users: {$totalUsers}");
        $this->info("- Attempts: {$totalAttempts}");
        $this->info("- Average cost per user: $" . number_format($totalUsers > 0 ? $todaysCost / $totalUsers : 0, 4));

        return Command::SUCCESS;
    }

    private function sendCostAlert(float $cost, string $type)
    {
        $adminEmail = env('ADMIN_EMAIL', 'sean@compelenglish.com');
        
        $subject = $type === 'LIMIT_EXCEEDED' 
            ? "🚨 Demo Cost Limit Exceeded - ${cost}"
            : "⚠️ Demo Cost Warning - ${cost}";
            
        $message = $type === 'LIMIT_EXCEEDED'
            ? "Demo has been automatically paused until tomorrow. Daily limit: $" . self::DAILY_LIMIT
            : "Demo cost approaching limit. Warning threshold: $" . self::WARNING_THRESHOLD;

        // In production, send actual email
        Log::info('Cost alert email', [
            'to' => $adminEmail,
            'subject' => $subject,
            'message' => $message,
            'cost' => $cost,
        ]);

        // Uncomment for actual email sending:
        /*
        Mail::raw($message, function ($mail) use ($adminEmail, $subject) {
            $mail->to($adminEmail)
                 ->subject($subject);
        });
        */
    }
}