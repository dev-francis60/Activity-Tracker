<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityUpdate extends Model
{
    protected $fillable = [
        'daily_activity_id',
        'user_id',
        'user_name',
        'user_email',
        'status',
        'remark',
    ];

    public function dailyActivity(): BelongsTo
    {
        return $this->belongsTo(DailyActivity::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
