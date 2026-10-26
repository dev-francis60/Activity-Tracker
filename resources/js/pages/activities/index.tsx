import { Head, useForm } from '@inertiajs/react';
import { type SubmitEvent, useState } from 'react';
import { CalendarDays, CheckCircle2, ClipboardList, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type DailyActivity = { id: number; activity_date: string; status: 'Done' | 'Pending' };
type Activity = { id: number; name: string; description: string | null; daily_activities: DailyActivity[] };
type ActivityUpdate = {
    id: number; status: string; remark: string | null; created_at: string;
    user_name: string | null; user_email: string | null;
    user: { name: string; email: string } | null; daily_activity: { activity: { name: string } };
};
type Props = { activities: Activity[]; recentUpdates: ActivityUpdate[]; today: string; isToday: boolean };

export default function ActivitiesIndex({ activities, recentUpdates, today, isToday }: Props) {
    const createForm = useForm({ name: '', description: '' });
    const completed = activities.filter((activity) => activity.daily_activities[0]?.status === 'Done').length;
    const pending = activities.length - completed;

    function createActivity(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        createForm.post('/activities', { onSuccess: () => createForm.reset() });
    }

    return <>
        <Head title="Daily activities" />
        <main className="mx-auto w-full max-w-[1500px] min-w-0 space-y-6 p-4 md:p-8">
            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div><p className="text-sm font-medium text-muted-foreground">Your workspace</p><h1 className="mt-1 text-2xl font-semibold tracking-tight">Daily activities</h1><p className="mt-1 text-sm text-muted-foreground">Track team progress and leave a clear handover for the next shift.</p></div>
                <form method="get" action="/activities" className="flex items-end gap-2 rounded-xl border border-border bg-card p-3">
                    <div className="space-y-1"><Label htmlFor="activity-date" className="flex items-center gap-2 text-xs text-muted-foreground"><CalendarDays className="size-3.5 text-primary" />{isToday ? 'Today' : 'Viewing day'}</Label><Input id="activity-date" name="date" type="date" defaultValue={today} className="h-9 w-40" /></div>
                    <Button type="submit" variant="outline" size="sm">View day</Button>
                </form>
            </header>

            <section className="grid gap-4 sm:grid-cols-3">
                <SummaryCard title="Active activities" value={activities.length} />
                <SummaryCard title={isToday ? 'Completed today' : 'Completed on selected day'} value={completed} tone="text-primary" />
                <SummaryCard title={isToday ? 'Still to do today' : 'Pending on selected day'} value={pending} tone="text-amber-700 dark:text-amber-300" />
            </section>

            <Card className="rounded-2xl shadow-none">
                <CardHeader><CardTitle className="text-base">Add an activity</CardTitle><CardDescription>Set a clear task for your team’s daily checklist.</CardDescription></CardHeader>
                <CardContent><form onSubmit={createActivity} className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
                    <div className="space-y-2"><Label htmlFor="activity-name">Activity name</Label><Input id="activity-name" value={createForm.data.name} onChange={(event) => createForm.setData('name', event.target.value)} placeholder="e.g. Review overnight alerts" required />{createForm.errors.name && <p className="text-sm text-destructive">{createForm.errors.name}</p>}</div>
                    <div className="space-y-2"><Label htmlFor="activity-description">Description <span className="font-normal text-muted-foreground">(optional)</span></Label><Input id="activity-description" value={createForm.data.description} onChange={(event) => createForm.setData('description', event.target.value)} placeholder="Add useful context for the team" /></div>
                    <Button type="submit" disabled={createForm.processing} className="min-w-36">{createForm.processing ? 'Adding…' : 'Add activity'}</Button>
                </form></CardContent>
            </Card>

            <Card className="overflow-hidden rounded-2xl shadow-none">
                <CardHeader className="border-b border-border"><CardTitle className="flex items-center gap-2 text-base"><ClipboardList className="size-4 text-primary" /> Activity checklist</CardTitle><CardDescription>Update the selected day’s status and leave a note about what the next person should know.</CardDescription></CardHeader>
                <div className="divide-y divide-border">
                    {!activities.length && <div className="p-10 text-center"><CheckCircle2 className="mx-auto size-8 text-primary/70" /><p className="mt-3 font-medium">Your checklist is ready</p><p className="mt-1 text-sm text-muted-foreground">Add an activity above to start tracking daily work.</p></div>}
                    {activities.map((activity) => <ActivityRow key={activity.id} activity={activity} today={today} />)}
                </div>
            </Card>

            <Card className="overflow-hidden rounded-2xl shadow-none">
                <CardHeader className="border-b border-border"><CardTitle className="text-base">Handover log · {today}</CardTitle><CardDescription>Every status update recorded for this day, newest first.</CardDescription></CardHeader>
                <div className="divide-y divide-border">
                    {!recentUpdates.length && <p className="p-6 text-sm text-muted-foreground">No updates were recorded for this day.</p>}
                    {recentUpdates.map((update) => { const personName = update.user_name ?? update.user?.name ?? 'Former user'; const personEmail = update.user_email ?? update.user?.email; return <div key={update.id} className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-start"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="font-medium">{update.daily_activity.activity.name}</p><StatusBadge status={update.status} /></div><p className="mt-2 text-sm">{update.remark || 'No remark recorded'}</p><p className="mt-1 text-xs text-muted-foreground">{personName}{personEmail ? ` · ${personEmail}` : ''}</p></div><time dateTime={update.created_at} className="shrink-0 text-xs text-muted-foreground">{new Date(update.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</time></div>; })}
                </div>
            </Card>
        </main>
    </>;
}

function ActivityRow({ activity, today }: { activity: Activity; today: string }) {
    const currentStatus = activity.daily_activities[0]?.status ?? 'Pending';
    const form = useForm({ activity_date: today, status: currentStatus as 'Done' | 'Pending', remark: '' });
    function submitUpdate(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        form.patch(`/activities/${activity.id}/status`, { onSuccess: () => form.reset('remark') });
    }
    return <article className="p-5">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><h3 className="font-medium">{activity.name}</h3>{activity.description && <p className="mt-1 text-sm text-muted-foreground">{activity.description}</p>}</div><div className="flex items-center gap-2"><StatusBadge status={currentStatus} /><ActivityActions activity={activity} date={today} /></div></div>
        <form onSubmit={submitUpdate} className="grid gap-3 md:grid-cols-[160px_1fr_auto] md:items-end">
            <div className="space-y-2"><Label htmlFor={`status-${activity.id}`} className="text-xs">New status</Label><Select value={form.data.status} onValueChange={(value) => form.setData('status', value as 'Done' | 'Pending')}><SelectTrigger id={`status-${activity.id}`}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Done">Done</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label htmlFor={`remark-${activity.id}`} className="text-xs">Handover remark <span className="text-destructive">*</span></Label><Input id={`remark-${activity.id}`} value={form.data.remark} onChange={(event) => form.setData('remark', event.target.value)} placeholder="What was checked? What remains to be done?" required />{form.errors.remark && <p className="text-sm text-destructive">{form.errors.remark}</p>}</div>
            <Button type="submit" disabled={form.processing} variant="outline">{form.processing ? 'Saving…' : 'Save update'}</Button>
        </form>
    </article>;
}

function ActivityActions({ activity, date }: { activity: Activity; date: string }) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const editForm = useForm({ name: activity.name, description: activity.description ?? '' });
    const deleteForm = useForm({});

    function updateActivity(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        editForm.patch(`/activities/${activity.id}?date=${encodeURIComponent(date)}`, {
            preserveScroll: true,
            onSuccess: () => setEditOpen(false),
        });
    }

    function deleteActivity() {
        deleteForm.delete(`/activities/${activity.id}?date=${encodeURIComponent(date)}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteOpen(false),
        });
    }

    return <div className="flex items-center gap-1">
        <Dialog open={editOpen} onOpenChange={(open) => {
            setEditOpen(open);
            if (open) editForm.setData({ name: activity.name, description: activity.description ?? '' });
        }}>
            <DialogTrigger asChild><Button type="button" variant="ghost" size="sm" aria-label={`Edit ${activity.name}`}><Pencil className="size-3.5" /><span className="sr-only sm:not-sr-only">Edit</span></Button></DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Edit activity</DialogTitle><DialogDescription>Update the name or description shown in the daily checklist.</DialogDescription></DialogHeader>
                <form onSubmit={updateActivity} className="space-y-4">
                    <div className="space-y-2"><Label htmlFor={`edit-name-${activity.id}`}>Activity name</Label><Input id={`edit-name-${activity.id}`} value={editForm.data.name} onChange={(event) => editForm.setData('name', event.target.value)} required />{editForm.errors.name && <p className="text-sm text-destructive">{editForm.errors.name}</p>}</div>
                    <div className="space-y-2"><Label htmlFor={`edit-description-${activity.id}`}>Description <span className="font-normal text-muted-foreground">(optional)</span></Label><Input id={`edit-description-${activity.id}`} value={editForm.data.description} onChange={(event) => editForm.setData('description', event.target.value)} />{editForm.errors.description && <p className="text-sm text-destructive">{editForm.errors.description}</p>}</div>
                    <DialogFooter><DialogClose asChild><Button type="button" variant="outline" disabled={editForm.processing}>Cancel</Button></DialogClose><Button type="submit" disabled={editForm.processing}>{editForm.processing ? 'Saving…' : 'Save changes'}</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild><Button type="button" variant="ghost" size="sm" aria-label={`Delete ${activity.name}`} className="text-destructive hover:text-destructive"><Trash2 className="size-3.5" /><span className="sr-only sm:not-sr-only">Delete</span></Button></DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Remove this activity?</DialogTitle><DialogDescription><span className="font-medium text-foreground">{activity.name}</span> will leave the active checklist. Existing daily updates and handover history will remain available in reports.</DialogDescription></DialogHeader>
                <DialogFooter><DialogClose asChild><Button type="button" variant="outline" disabled={deleteForm.processing}>Cancel</Button></DialogClose><Button type="button" variant="destructive" onClick={deleteActivity} disabled={deleteForm.processing}>{deleteForm.processing ? 'Removing…' : 'Remove activity'}</Button></DialogFooter>
            </DialogContent>
        </Dialog>
    </div>;
}

function SummaryCard({ title, value, tone = 'text-foreground' }: { title: string; value: number; tone?: string }) {
    return <Card className="rounded-2xl shadow-none"><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-muted-foreground">{title}</p><p className={`mt-2 text-3xl font-semibold tracking-tight ${tone}`}>{value}</p></div><div className="grid size-10 place-items-center rounded-xl bg-secondary text-primary"><ClipboardList className="size-5" /></div></CardContent></Card>;
}

function StatusBadge({ status }: { status: string }) {
    const done = status === 'Done';
    const removed = status === 'Removed';
    return <Badge variant={done ? 'secondary' : removed ? 'destructive' : 'outline'} className={`rounded-full ${done ? 'text-primary' : !removed ? 'border-amber-500/40 text-amber-800 dark:text-amber-200' : ''}`}>{status}</Badge>;
}
