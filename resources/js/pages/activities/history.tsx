import { Head, Link, useForm } from '@inertiajs/react';
import { type SubmitEvent } from 'react';
import { History, SlidersHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ActivityUpdate = {
    id: number; status: 'Done' | 'Pending' | 'Removed'; remark: string | null; created_at: string;
    user_name: string | null; user_email: string | null;
    user: { name: string; email: string } | null; daily_activity: { activity_date: string; activity: { name: string } };
};
type PaginationLink = { url: string | null; label: string; active: boolean };
type Person = { id: number; name: string; email: string };
type Props = {
    updates: { data: ActivityUpdate[]; links: PaginationLink[]; current_page: number; last_page: number; total: number };
    filters: { from?: string | null; to?: string | null; user_id?: string | number | null; search?: string | null };
    users: Person[];
};

export default function ActivityHistory({ updates, filters, users }: Props) {
    const filterForm = useForm({ from: filters.from ?? '', to: filters.to ?? '', user_id: filters.user_id ? String(filters.user_id) : '', search: filters.search ?? '' });
    function applyFilters(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        filterForm.get('/activity-history', { preserveScroll: true });
    }

    return <>
        <Head title="Activity history" />
        <main className="mx-auto w-full max-w-[1500px] space-y-6 p-4 md:p-8">
            <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-muted-foreground">Your workspace</p><h1 className="mt-1 text-2xl font-semibold tracking-tight">Activity history</h1><p className="mt-1 text-sm text-muted-foreground">Review status changes and handover notes from your team.</p></div><Badge variant="secondary" className="w-fit rounded-full">{updates.total} {updates.total === 1 ? 'update' : 'updates'}</Badge></header>

            <Card className="rounded-2xl shadow-none">
                <CardHeader><CardTitle className="flex items-center gap-2 text-base"><SlidersHorizontal className="size-4 text-primary" /> Find handover updates</CardTitle><CardDescription>Search activities, remarks, status, or the person who recorded an update.</CardDescription></CardHeader>
                <CardContent><form onSubmit={applyFilters} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1.2fr_auto_auto] xl:items-end">
                    <div className="space-y-2"><Label htmlFor="history-search">Search history</Label><Input id="history-search" value={filterForm.data.search} onChange={(event) => filterForm.setData('search', event.target.value)} placeholder="Activity, remark, name, or email" /></div>
                    <div className="space-y-2"><Label htmlFor="history-from">From</Label><Input id="history-from" type="date" value={filterForm.data.from} onChange={(event) => filterForm.setData('from', event.target.value)} /></div>
                    <div className="space-y-2"><Label htmlFor="history-to">To</Label><Input id="history-to" type="date" value={filterForm.data.to} onChange={(event) => filterForm.setData('to', event.target.value)} /></div>
                    <div className="space-y-2"><Label htmlFor="history-user">Updated by</Label><Select value={filterForm.data.user_id || 'all'} onValueChange={(value) => filterForm.setData('user_id', value === 'all' ? '' : value)}><SelectTrigger id="history-user"><SelectValue placeholder="All team members" /></SelectTrigger><SelectContent><SelectItem value="all">All team members</SelectItem>{users.map((user) => <SelectItem key={user.id} value={String(user.id)}>{user.name}</SelectItem>)}</SelectContent></Select></div>
                    <Button type="submit" disabled={filterForm.processing} className="min-w-32">{filterForm.processing ? 'Applying…' : 'Apply filters'}</Button>
                    <Button asChild variant="outline"><Link href="/activity-history">Clear filters</Link></Button>
                </form></CardContent>
            </Card>

            <Card className="overflow-hidden rounded-2xl shadow-none">
                <CardHeader className="border-b border-border"><CardTitle className="flex items-center gap-2 text-base"><History className="size-4 text-primary" /> Handover updates</CardTitle><CardDescription>Newest updates appear first.</CardDescription></CardHeader>
                {!updates.data.length ? <div className="p-12 text-center"><History className="mx-auto size-8 text-muted-foreground/60" /><p className="mt-3 font-medium">No updates match these filters</p><p className="mt-1 text-sm text-muted-foreground">Try a different phrase, date range, or team member.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-muted/70 text-xs font-medium text-muted-foreground"><tr><th scope="col" className="px-5 py-3">Activity</th><th scope="col" className="px-5 py-3">Date and time</th><th scope="col" className="px-5 py-3">Updated by</th><th scope="col" className="px-5 py-3">Status</th><th scope="col" className="px-5 py-3">Handover remark</th></tr></thead><tbody className="divide-y divide-border">{updates.data.map((update) => { const name = update.user_name ?? update.user?.name ?? 'Former user'; const email = update.user_email ?? update.user?.email; return <tr key={update.id} className="align-top"><td className="px-5 py-4 font-medium">{update.daily_activity.activity.name}</td><td className="whitespace-nowrap px-5 py-4 text-muted-foreground">{new Date(update.created_at).toLocaleString()}</td><td className="px-5 py-4"><p>{name}</p>{email && <p className="mt-1 text-xs text-muted-foreground">{email}</p>}</td><td className="px-5 py-4"><StatusBadge status={update.status} /></td><td className="max-w-sm px-5 py-4 text-muted-foreground">{update.remark || 'No remark recorded'}</td></tr>; })}</tbody></table></div>}
                {updates.last_page > 1 && <nav aria-label="Activity history pages" className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4"><p className="text-sm text-muted-foreground">Page {updates.current_page} of {updates.last_page}</p><div className="flex flex-wrap gap-2">{updates.links.map((page, index) => {
                    const label = page.label.replace('&laquo;', '←').replace('&raquo;', '→');

                    return page.url ? (
                        <Button key={`${page.label}-${index}`} asChild variant={page.active ? 'default' : 'outline'} size="sm">
                            <Link href={page.url} preserveScroll aria-current={page.active ? 'page' : undefined}>{label}</Link>
                        </Button>
                    ) : (
                        <Button key={`${page.label}-${index}`} variant="outline" size="sm" disabled>
                            {label}
                        </Button>
                    );
                })}</div></nav>}
            </Card>
        </main>
    </>;
}

function StatusBadge({ status }: { status: ActivityUpdate['status'] }) {
    const done = status === 'Done';
    const removed = status === 'Removed';
    return <Badge variant={done ? 'secondary' : removed ? 'destructive' : 'outline'} className={`rounded-full ${done ? 'text-primary' : !removed ? 'border-amber-500/40 text-amber-800 dark:text-amber-200' : ''}`}>{status}</Badge>;
}
