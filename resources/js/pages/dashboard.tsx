import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Check, ClipboardCheck, Clock3, History, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Auth } from '@/types';
import { dashboard } from '@/routes';

type ActivityUpdate = {
    id: number;
    status: 'Done' | 'Pending' | 'Removed';
    remark: string | null;
    created_at: string;
    user_name: string | null;
    user_email: string | null;
    user: { name: string } | null;
    daily_activity: { activity: { name: string } };
};

type TrendDay = { label: string; completed: number; total: number; rate: number };
type PendingActivity = { id: number; name: string };
type PageProps = { auth: Auth };

type Props = {
    totalActivities: number;
    completed: number;
    pending: number;
    completionRate: number;
    recentUpdates: ActivityUpdate[];
    weekTrend: TrendDay[];
    pendingActivities: PendingActivity[];
};

export default function Dashboard({
    totalActivities,
    completed,
    pending,
    completionRate,
    recentUpdates,
    weekTrend,
    pendingActivities,
}: Props) {
    const { auth } = usePage<PageProps>().props;
    const points = weekTrend.map((day, index) => ({
        x: 36 + index * 56,
        y: 150 - day.rate * 1.2,
        day,
    }));
    const line = points.map((point) => `${point.x},${point.y}`).join(' ');

    return (
        <>
            <Head title="Dashboard" />
            <main className="mx-auto w-full max-w-[1500px] space-y-6 p-4 md:p-8">
                <header className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Your workspace</p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Welcome back, {auth.user.name.split(' ')[0]}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">A clear view of today’s work and the latest team handovers.</p>
                    </div>
                    <Button asChild className="rounded-lg">
                        <Link href="/activities"><ClipboardCheck /> Open daily checklist</Link>
                    </Button>
                </header>

                <section>
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold tracking-tight">Today at a glance</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Progress across your active team activities.</p>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-[minmax(220px,0.7fr)_minmax(0,2fr)]">
                        <Card className="rounded-2xl shadow-none">
                            <CardHeader className="pb-1">
                                <CardTitle className="text-base">Daily completion</CardTitle>
                                <CardDescription>Completed activities today</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center pt-3">
                                <div className="relative grid size-36 place-items-center">
                                    <svg viewBox="0 0 120 120" className="absolute inset-0 size-full -rotate-90" role="img" aria-label={`${completionRate}% complete`}>
                                        <circle cx="60" cy="60" r="48" fill="none" stroke="var(--color-muted)" strokeWidth="8" />
                                        <circle cx="60" cy="60" r="48" fill="none" stroke="var(--color-primary)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${completionRate * 3.02} 302`} />
                                    </svg>
                                    <div className="text-center">
                                        <p className="text-3xl font-semibold tracking-tight">{completionRate}%</p>
                                        <p className="text-xs text-muted-foreground">complete</p>
                                    </div>
                                </div>
                                <div className="mt-3 grid w-full grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
                                    <div><p className="text-muted-foreground">Completed</p><p className="mt-1 font-semibold">{completed}</p></div>
                                    <div className="text-right"><p className="text-muted-foreground">Still to do</p><p className="mt-1 font-semibold">{pending}</p></div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-none">
                            <CardHeader className="flex-row items-start justify-between space-y-0">
                                <div><CardTitle className="text-base">Weekly activity</CardTitle><CardDescription>Completion rate by day this week</CardDescription></div>
                                <Badge variant="secondary" className="rounded-full">{totalActivities} active {totalActivities === 1 ? 'activity' : 'activities'}</Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-hidden">
                                    <svg viewBox="0 0 380 190" className="h-[190px] w-full" role="img" aria-label="Weekly activity completion chart">
                                        {[30, 70, 110, 150].map((y) => <line key={y} x1="20" x2="365" y1={y} y2={y} stroke="var(--color-border)" strokeDasharray="3 5" />)}
                                        <polyline points={line} fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                        {points.map(({ x, y, day }) => <g key={day.label}><circle cx={x} cy={y} r="5" fill="var(--color-card)" stroke="var(--color-primary)" strokeWidth="3" /><text x={x} y="178" textAnchor="middle" className="fill-muted-foreground" fontSize="11">{day.label}</text></g>)}
                                    </svg>
                                </div>
                                {weekTrend.every((day) => day.total === 0) && <p className="-mt-2 text-center text-xs text-muted-foreground">Updates will appear here as your team records progress.</p>}
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section className="grid gap-4 xl:grid-cols-3">
                    <Card className="overflow-hidden rounded-2xl border-primary/10 bg-primary text-primary-foreground shadow-none xl:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base"><Clock3 className="size-4" /> Needs attention</CardTitle>
                            <CardDescription className="text-primary-foreground/70">Activities still marked pending today</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {pendingActivities.length ? <ul className="divide-y divide-primary-foreground/15">{pendingActivities.map((activity) => <li key={activity.id} className="flex items-center justify-between gap-3 py-3 first:pt-0"><span className="text-sm">{activity.name}</span><span className="size-2 shrink-0 rounded-full bg-amber-300" /></li>)}</ul> : <div className="rounded-xl bg-primary-foreground/10 p-4 text-sm text-primary-foreground/85">{totalActivities ? 'Everything is complete for today.' : 'Add your first activity to start tracking the day.'}</div>}
                            <Button asChild variant="secondary" className="mt-4 w-full rounded-lg"><Link href="/activities">Go to checklist <ArrowRight /></Link></Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl shadow-none">
                        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Sparkles className="size-4 text-primary" /> A steady handover</CardTitle><CardDescription>Keep the next shift in the loop</CardDescription></CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm leading-6 text-muted-foreground">Record what was checked, what changed, and what the next person should pick up.</p>
                            <div className="flex gap-3 rounded-xl bg-muted p-4"><Check className="mt-0.5 size-4 shrink-0 text-primary" /><p className="text-sm">Short, specific notes make daily work easier to follow.</p></div>
                            <Button asChild variant="outline" className="w-full rounded-lg"><Link href="/activities">Add a handover note <ArrowRight /></Link></Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl shadow-none">
                        <CardHeader className="flex-row items-start justify-between space-y-0"><div><CardTitle className="text-base">Recent handovers</CardTitle><CardDescription>Latest team updates</CardDescription></div><Button asChild variant="ghost" size="sm"><Link href="/activity-history">View history <History /></Link></Button></CardHeader>
                        <CardContent className="space-y-4">
                            {recentUpdates.length ? recentUpdates.map((update) => <div key={update.id} className="flex gap-3 border-b border-border pb-4 last:border-0 last:pb-0"><span className={`mt-1 size-2 shrink-0 rounded-full ${update.status === 'Done' ? 'bg-primary' : update.status === 'Removed' ? 'bg-destructive' : 'bg-amber-500'}`} /><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="truncate text-sm font-medium">{update.daily_activity.activity.name}</p><Badge variant={update.status === 'Done' ? 'secondary' : update.status === 'Removed' ? 'destructive' : 'outline'} className="rounded-full">{update.status}</Badge></div><p className="mt-1 truncate text-xs text-muted-foreground">{update.remark || 'No remark provided'} · {update.user_name ?? update.user?.name ?? 'Former user'}</p></div></div>) : <div className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">No handovers recorded yet.</div>}
                        </CardContent>
                    </Card>
                </section>
            </main>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};
