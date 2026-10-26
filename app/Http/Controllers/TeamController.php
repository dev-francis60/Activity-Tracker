<?php

namespace App\Http\Controllers;

use App\Models\ActivityUpdate;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
        ]);

        $members = User::query()
            ->withCount('activityUpdates')
            ->withMax('activityUpdates', 'created_at')
            ->when(filled($validated['search'] ?? null), function ($query) use ($validated) {
                $search = trim($validated['search']);

                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate(12)
            ->withQueryString();

        $todayUpdates = ActivityUpdate::query()
            ->whereDate('created_at', now()->toDateString());

        return Inertia::render('team/index', [
            'members' => $members,
            'search' => $validated['search'] ?? '',
            'summary' => [
                'members' => User::query()->count(),
                'contributors_today' => (clone $todayUpdates)->distinct('user_id')->count('user_id'),
                'updates_today' => $todayUpdates->count(),
            ],
        ]);
    }
}
