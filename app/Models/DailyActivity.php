<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class DailyActivity extends Model
{
    protected $fillable = [
        'activity_id',
        'activity_date',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'activity_date' => 'date',
        ];
    }

    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }

    public function updates(): HasMany
    {
        return $this->hasMany(ActivityUpdate::class);
    }

    public function latestUpdate(): HasOne
    {
        return $this->hasOne(ActivityUpdate::class)->latestOfMany();
    }
}
