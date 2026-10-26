<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\ActivityUpdate;
use App\Models\DailyActivity;
use App\Models\User;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ActivityController extends Controller
{
    public function dashboard(): Response
    {
        $today = now()->toDateString();
        $weekStart = now()->startOfWeek();
        $weekEnd = now()->endOfWeek();

        $activities = Activity::query()
            ->where('is_active', true)
            ->with([
                'dailyActivities' => fn ($query) => $query->whereDate('activity_date', $today),
            ])
            ->get();

        $totalActivities = $activities->count();
        $completed = $activities->filter(
            fn (Activity $activity) => $activity->dailyActivities->first()?->status === 'Done'
        )->count();
        $pending = $totalActivities - $completed;

        $recentUpdates = ActivityUpdate::query()
            ->with(['user', 'dailyActivity.activity'])
            ->latest()
            ->take(4)
            ->get();

        $weekEntries = DailyActivity::query()
            ->whereBetween('activity_date', [$weekStart->toDateString(), $weekEnd->toDateString()])
            ->whereHas('activity', fn ($query) => $query->where('is_active', true))
            ->get(['activity_date', 'status'])
            ->groupBy(fn (DailyActivity $entry) => $entry->activity_date->toDateString());

        $weekTrend = collect(range(0, 6))->map(function (int $offset) use ($weekStart, $weekEntries) {
            $date = $weekStart->copy()->addDays($offset);
            $entries = $weekEntries->get($date->toDateString(), collect());
            $done = $entries->where('status', 'Done')->count();
            $total = $entries->count();

            return [
                'label' => $date->format('D'),
                'completed' => $done,
                'total' => $total,
                'rate' => $total === 0 ? 0 : (int) round(($done / $total) * 100),
            ];
        });

        $pendingActivities = $activities
            ->filter(fn (Activity $activity) => $activity->dailyActivities->first()?->status !== 'Done')
            ->take(4)
            ->map(fn (Activity $activity) => ['id' => $activity->id, 'name' => $activity->name])
            ->values();

        return Inertia::render('dashboard', [
            'totalActivities' => $totalActivities,
            'completed' => $completed,
            'pending' => $pending,
            'completionRate' => $totalActivities === 0
                ? 0
                : (int) round(($completed / $totalActivities) * 100),
            'recentUpdates' => $recentUpdates,
            'weekTrend' => $weekTrend,
            'pendingActivities' => $pendingActivities,
        ]);
    }

    public function index(Request $request): Response
    {
        $today = now()->toDateString();
        $validated = $request->validate([
            'date' => ['nullable', 'date'],
        ]);
        $activityDate = $validated['date'] ?? $today;

        $activities = Activity::query()
            ->where('is_active', true)
            ->with([
                'dailyActivities' => fn ($query) => $query->whereDate('activity_date', $activityDate),
            ])
            ->orderBy('name')
            ->get();

        $recentUpdates = ActivityUpdate::query()
            ->with(['user', 'dailyActivity.activity'])
            ->whereHas('dailyActivity', fn ($query) => $query->whereDate('activity_date', $activityDate))
            ->latest()
            ->get();

        return Inertia::render('activities/index', [
            'activities' => $activities,
            'recentUpdates' => $recentUpdates,
            'today' => $activityDate,
            'isToday' => $activityDate === $today,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
        ]);

        Activity::create($validated);

        return to_route('activities.index')
            ->with('success', 'Activity created successfully.');
    }

    public function update(Request $request, Activity $activity): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
        ]);

        $activity->update($validated);

        return to_route('activities.index', ['date' => $request->query('date')])
            ->with('success', 'Activity updated successfully.');
    }

    public function destroy(Request $request, Activity $activity): RedirectResponse
    {
        $removedOn = now()->toDateString();

        DB::transaction(function () use ($activity, $request, $removedOn) {
            $activity->update(['is_active' => false]);

            $dailyActivity = $this->dailyActivityForDate($activity, $removedOn);
            $dailyActivity->updates()->create([
                'user_id' => $request->user()->id,
                'user_name' => $request->user()->name,
                'user_email' => $request->user()->email,
                'status' => 'Removed',
                'remark' => 'Activity removed from the active checklist.',
            ]);
        });

        return to_route('activities.index', ['date' => $removedOn])
            ->with('success', 'Activity removed from the active checklist. The removal is recorded in handover history.');
    }

    public function updateStatus(
        Request $request,
        Activity $activity
    ): RedirectResponse {
        $validated = $request->validate([
            'activity_date' => ['required', 'date'],
            'status' => ['required', Rule::in(['Done', 'Pending'])],
            'remark' => ['required', 'string', 'max:2000'],
        ]);

        DB::transaction(function () use ($validated, $activity, $request) {
            $dailyActivity = $this->dailyActivityForDate($activity, $validated['activity_date']);

            $dailyActivity->update([
                'status' => $validated['status'],
            ]);

            $dailyActivity->updates()->create([
                'user_id' => $request->user()->id,
                'user_name' => $request->user()->name,
                'user_email' => $request->user()->email,
                'status' => $validated['status'],
                'remark' => $validated['remark'] ?? null,
            ]);
        });

        return to_route('activities.index', ['date' => $validated['activity_date']])
            ->with('success', 'Activity status and history updated.');
    }

    public function history(Request $request): Response
    {
        $validated = $request->validate([
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
        ]);

        $updates = ActivityUpdate::query()
            ->with(['user', 'dailyActivity.activity'])
            ->when(
                $validated['from'] ?? null,
                fn ($query, $from) => $query->whereDate('created_at', '>=', $from)
            )
            ->when(
                $validated['to'] ?? null,
                fn ($query, $to) => $query->whereDate('created_at', '<=', $to)
            )
            ->when(
                $validated['user_id'] ?? null,
                fn ($query, $userId) => $query->where('user_id', $userId)
            )
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $users = User::query()
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        return Inertia::render('activities/history', [
            'updates' => $updates,
            'filters' => $validated,
            'users' => $users,
        ]);
    }

    private function dailyActivityForDate(Activity $activity, string $date): DailyActivity
    {
        $dailyActivity = DailyActivity::query()
            ->where('activity_id', $activity->id)
            ->whereDate('activity_date', $date)
            ->first();

        if ($dailyActivity) {
            return $dailyActivity;
        }

        try {
            return DailyActivity::create([
                'activity_id' => $activity->id,
                'activity_date' => $date,
                'status' => 'Pending',
            ]);
        } catch (UniqueConstraintViolationException $exception) {
            $dailyActivity = DailyActivity::query()
                ->where('activity_id', $activity->id)
                ->whereDate('activity_date', $date)
                ->first();

            if (! $dailyActivity) {
                throw $exception;
            }

            return $dailyActivity;
        }
    }
}
