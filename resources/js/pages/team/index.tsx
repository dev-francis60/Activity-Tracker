import { Head, Link, useForm } from '@inertiajs/react';
import { type ReactNode, type SubmitEvent } from 'react';
import { ArrowUpRight, Clock3, History, Search, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Member = {
    id: number;
    name: string;
    email: string;
    activity_updates_count: number;
    activity_updates_max_created_at: string | null;
};
type PaginationLink = { url: string | null; label: string; active: boolean };
type Props = {
    members: { data: Member[]; links: PaginationLink[]; current_page: number; last_page: number; total: number };
    search: string;
    summary: { members: number; contributors_today: number; updates_today: number };
};

export default function TeamIndex({ members, search, summary }: Props) {
    const form = useForm({ search });

    function findMembers(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        form.get('/team', { preserveScroll: true });
    }

    return <>
        <Head title="Team" />
        <main className="mx-auto w-full max-w-[1500px] space-y-6 p-4 md:p-8">
            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Your workspace</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">Team</h1>
                    <p className="mt-1 text-sm text-muted-foreground">See who is keeping daily support work moving and find their handovers.</p>
                </div>
                <Button asChild variant="outline"><Link href="/activity-history"><History className="size-4" /> Search all history</Link></Button>
            </header>

            <section aria-label="Team activity summary" className="grid gap-4 sm:grid-cols-3">
                <SummaryCard label="Team members" value={summary.members} icon={<UsersRound className="size-4" />} />
                <SummaryCard label="Contributors today" value={summary.contributors_today} icon={<UsersRound className="size-4" />} />
                <SummaryCard label="Updates today" value={summary.updates_today} icon={<History className="size-4" />} />
            </section>

            <Card className="rounded-2xl shadow-none">
                <CardHeader>
                    <CardTitle className="text-base">People and recent activity</CardTitle>
                    <CardDescription>Search by name or email. Open a person’s history to review their updates and handover notes.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                    <form onSubmit={findMembers} className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
                        <div className="space-y-2">
                            <Label htmlFor="team-search">Find a team member</Label>
                            <Input id="team-search" value={form.data.search} onChange={(event) => form.setData('search', event.target.value)} placeholder="Search by name or email" />
                        </div>
                        <Button type="submit" disabled={form.processing}><Search className="size-4" />{form.processing ? 'Searching…' : 'Search team'}</Button>
                        <Button asChild variant="outline"><Link href="/team">Clear</Link></Button>
                    </form>

                    {!members.data.length ? (
                        <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center">
                            <UsersRound className="mx-auto size-8 text-muted-foreground/60" />
                            <p className="mt-3 font-medium">No team members found</p>
                            <p className="mt-1 text-sm text-muted-foreground">Try another name or email address.</p>
                        </div>
                    ) : (
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            {members.data.map((member) => <MemberCard key={member.id} member={member} />)}
                        </div>
                    )}

                    {members.last_page > 1 && <nav aria-label="Team member pages" className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                        <p className="text-sm text-muted-foreground">Showing {members.data.length} of {members.total} members · Page {members.current_page} of {members.last_page}</p>
                        <div className="flex flex-wrap gap-2">{members.links.map((page, index) => {
                            const label = page.label.replace('&laquo;', '←').replace('&raquo;', '→');
                            return page.url ? (
                                <Button key={`${page.label}-${index}`} asChild variant={page.active ? 'default' : 'outline'} size="sm">
                                    <Link href={page.url} preserveScroll aria-current={page.active ? 'page' : undefined}>{label}</Link>
                                </Button>
                            ) : <Button key={`${page.label}-${index}`} variant="outline" size="sm" disabled>{label}</Button>;
                        })}</div>
                    </nav>}
                </CardContent>
            </Card>
        </main>
    </>;
}

function SummaryCard({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
    return <Card className="rounded-2xl shadow-none">
        <CardContent className="flex items-center justify-between p-5">
            <div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p></div>
            <span className="rounded-xl bg-primary/10 p-3 text-primary">{icon}</span>
        </CardContent>
    </Card>;
}

function MemberCard({ member }: { member: Member }) {
    const initials = member.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
    const lastUpdate = member.activity_updates_max_created_at
        ? new Date(member.activity_updates_max_created_at).toLocaleString()
        : 'No updates yet';

    return <article className="flex min-w-0 flex-col justify-between gap-5 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/30">
        <div className="flex min-w-0 items-start gap-3">
            <div aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{initials || '?'}</div>
            <div className="min-w-0 flex-1">
                <h2 className="truncate font-medium">{member.name}</h2>
                <p className="truncate text-sm text-muted-foreground">{member.email}</p>
            </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>{member.activity_updates_count} {member.activity_updates_count === 1 ? 'update' : 'updates'} recorded</span>
            <span className="flex items-center gap-1"><Clock3 className="size-3.5" />{lastUpdate}</span>
        </div>
        <Button asChild variant="outline" className="w-full justify-between">
            <Link href={`/activity-history?user_id=${member.id}`}>View history <ArrowUpRight className="size-4" /></Link>
        </Button>
    </article>;
}
