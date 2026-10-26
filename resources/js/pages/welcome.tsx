import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ClipboardCheck, Clock3, History, ShieldCheck, Sparkles } from 'lucide-react';
import { dashboard, login, register } from '@/routes';

const steps = [
    {
        number: '01',
        icon: ClipboardCheck,
        title: 'Keep daily checks visible',
        description: 'Give recurring support work one shared checklist, so every shift knows what needs attention.',
    },
    {
        number: '02',
        icon: Clock3,
        title: 'Leave a useful handover',
        description: 'Every update records its status, a required remark, who made it, and when it happened.',
    },
    {
        number: '03',
        icon: History,
        title: 'Find the history later',
        description: 'Review a day’s handover or filter the update log by date range and team member.',
    },
];

export default function Welcome() {
    const { auth } = usePage().props;
    const destination = auth.user ? dashboard() : register();

    return (
        <>
            <Head title="Daily activity tracking and team handovers" />
            <main className="landing-page min-h-screen overflow-hidden bg-[#f2f0e6] text-[#123b35]">
                <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
                    <Link href="/" className="group flex items-center gap-2.5" aria-label="Activity Tracker home">
                        <span className="grid size-9 place-items-center rounded-xl bg-[#0d4941] text-[#f2f0e6] transition-transform duration-300 group-hover:rotate-[-8deg]">
                            <ActivityMark />
                        </span>
                        <span className="text-lg font-semibold tracking-[-0.04em]">Activity Tracker</span>
                    </Link>

                    <nav aria-label="Main navigation" className="hidden items-center gap-8 text-sm font-medium text-[#31554f] md:flex">
                        <a className="transition-colors hover:text-[#0d4941]" href="#about">About</a>
                        <a className="transition-colors hover:text-[#0d4941]" href="#workflow">How it works</a>
                        <a className="transition-colors hover:text-[#0d4941]" href="#team">For the team</a>
                    </nav>

                    <div className="flex items-center gap-2.5">
                        {auth.user ? (
                            <Link href={dashboard()} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#0d4941] px-4 text-sm font-medium text-white transition hover:bg-[#093a34] sm:px-5">
                                Open workspace <ArrowUpRight className="size-4" />
                            </Link>
                        ) : (
                            <>
                                <Link href={login()} className="hidden h-10 items-center rounded-full border border-[#9eada6] px-5 text-sm font-medium transition hover:border-[#0d4941] hover:bg-white/70 sm:inline-flex">Log in</Link>
                                <Link href={register()} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#0d4941] px-4 text-sm font-medium text-white transition hover:bg-[#093a34] sm:px-5">Sign up <ArrowUpRight className="size-4" /></Link>
                            </>
                        )}
                    </div>
                </header>

                <section id="about" className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 pb-14 pt-8 sm:px-8 md:min-h-[540px] md:grid-cols-[0.95fr_1.05fr] md:gap-10 md:pb-20 md:pt-10 lg:px-12 lg:pb-24">
                    <div className="relative z-10 landing-rise">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#c9d4c8] bg-white/65 px-3.5 py-2 text-xs font-semibold tracking-[0.09em] text-[#315e55] shadow-sm">
                            <span className="size-2 rounded-full bg-[#8cad71]" /> MADE FOR APPLICATIONS SUPPORT
                        </div>
                        <h1 className="max-w-[700px] text-[clamp(2.9rem,5.4vw,4rem)] leading-[0.96] font-semibold tracking-[-0.075em] text-[#103b35]">
                            The work gets done. <span className="relative inline-block">The handover<span className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-[#dceca3] md:-bottom-2 md:h-3" /></span> stays clear.
                        </h1>
                        <p className="mt-6 max-w-[520px] text-base leading-7 text-[#45625c] sm:text-lg sm:leading-8">
                            Keep daily support activities, status updates, and shift notes together—so the next person can pick up with confidence.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <Link href={destination} className="group inline-flex h-12 items-center gap-3 rounded-full bg-[#0d4941] px-6 text-sm font-semibold text-white shadow-[0_12px_30px_-14px_rgba(13,73,65,0.55)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#093a34]">
                                {auth.user ? 'Go to dashboard' : 'Get started'}
                                <span className="grid size-7 place-items-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5"><ArrowRight className="size-4" /></span>
                            </Link>
                            <a href="#workflow" className="inline-flex h-12 items-center gap-2 rounded-full px-4 text-sm font-semibold text-[#31554f] transition hover:bg-white/60">See how it works <ArrowDown className="size-4" /></a>
                        </div>
                        <div className="mt-8 flex items-center gap-3 text-sm text-[#58726b]">
                            <span className="grid size-8 place-items-center rounded-full border border-[#c9d4c8] bg-white/60"><ShieldCheck className="size-4 text-[#0d6558]" /></span>
                            <span>Team workspace protected by sign-in</span>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-[590px] landing-rise landing-delay-2">
                        <div className="absolute -left-4 top-[18%] size-24 rounded-full border border-[#afc9c6] bg-[#d8e9e6]/80 sm:-left-8 sm:size-32" />
                        <div className="absolute -right-3 top-[7%] size-14 rounded-full border border-[#a8c1ba] bg-[#e5edc7] sm:-right-5 sm:size-[4.5rem]" />
                        <div className="absolute bottom-[5%] left-[5%] size-14 rounded-full border border-[#a8c1ba] bg-[#d9e8e4] sm:size-[4.5rem]" />
                        <div className="absolute inset-x-[7%] bottom-0 top-[14%] rounded-[38%] bg-[#d2e5e2] sm:rounded-[42%]" />
                        <div className="relative landing-float px-3 py-8 sm:px-8 sm:py-10">
                            <div className="mx-auto max-w-[440px] rotate-[1deg] rounded-[28px] border border-white bg-white/90 p-4 shadow-[0_30px_80px_-32px_rgba(10,57,50,0.32)] backdrop-blur-sm sm:p-6">
                                <div className="flex items-center justify-between gap-4 border-b border-[#e8ede8] pb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="grid size-10 place-items-center rounded-2xl bg-[#e4f0dc] text-[#0d4941]"><ClipboardCheck className="size-5" /></span>
                                        <div><p className="text-sm font-semibold text-[#123b35]">Daily handover</p><p className="mt-0.5 text-xs text-[#73867e]">A sample checklist preview</p></div>
                                    </div>
                                    <span className="rounded-full bg-[#eff5e8] px-3 py-1.5 text-[11px] font-semibold text-[#39704a]">PRODUCT PREVIEW</span>
                                </div>
                                <div className="mt-5 grid grid-cols-[1fr_116px] gap-4">
                                    <div className="space-y-3">
                                        <PreviewTask title="Compare SMS totals with logs" status="Done" />
                                        <PreviewTask title="Review overnight alerts" status="Pending" />
                                        <PreviewTask title="Confirm service health checks" status="Pending" />
                                    </div>
                                    <div className="flex flex-col items-center justify-center rounded-2xl bg-[#f2f5f0] px-3 py-4 text-center">
                                        <svg viewBox="0 0 84 84" className="size-[76px] -rotate-90" aria-hidden="true">
                                            <circle cx="42" cy="42" r="33" fill="none" stroke="#dce5dd" strokeWidth="7" />
                                            <circle cx="42" cy="42" r="33" fill="none" stroke="#176456" strokeWidth="7" strokeLinecap="round" strokeDasharray="91 208" />
                                        </svg>
                                        <span className="-mt-[50px] mb-7 text-sm font-bold text-[#173e37]">Daily</span>
                                        <span className="text-[10px] leading-4 text-[#70857d]">Progress at a glance</span>
                                    </div>
                                </div>
                                <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#0d4941] px-4 py-3.5 text-white">
                                    <div className="flex items-center gap-2.5"><span className="grid size-7 place-items-center rounded-full bg-white/15"><Check className="size-4" /></span><span className="text-xs font-medium">Every update, ready for the next shift</span></div>
                                    <ArrowRight className="size-4 text-[#c8e4cd]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="border-y border-[#e5e3d8] bg-[#f8f7f1]/70">
                    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-5 py-5 text-center text-xs font-semibold tracking-[0.04em] text-[#547069] sm:grid-cols-4 sm:px-8 lg:px-12">
                        {['DAILY CHECKLISTS', 'CLEAR HANDOVERS', 'TEAM VISIBILITY', 'SEARCHABLE HISTORY'].map((label) => <div key={label} className="flex items-center justify-center gap-2.5 py-2"><span className="size-1.5 rounded-full bg-[#749a78]" />{label}</div>)}
                    </div>
                </div>

                <section id="workflow" className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 md:grid-cols-[0.9fr_1.1fr] md:items-center md:py-28 lg:px-12">
                    <div className="relative mx-auto w-full max-w-[440px] landing-reveal">
                        <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-[34px] bg-[#e3f0aa] sm:translate-x-5 sm:translate-y-5" />
                        <div className="relative overflow-hidden rounded-[34px] bg-[#dff0b5] p-6 sm:p-8">
                            <div className="absolute -right-12 -top-12 size-48 rounded-full border border-[#c5df8a]" />
                            <div className="absolute -right-5 -top-5 size-32 rounded-full border border-[#c5df8a]" />
                            <div className="relative flex min-h-[340px] flex-col justify-between sm:min-h-[390px]">
                                <div className="flex items-center justify-between"><span className="rounded-full border border-[#b8d77c] bg-white/50 px-3 py-1.5 text-xs font-semibold text-[#3f654a]">THE DAILY RHYTHM</span><Sparkles className="size-5 text-[#477858]" /></div>
                                <div className="relative mx-auto my-8 w-full max-w-[300px]">
                                    <div className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-[0_16px_35px_-20px_rgba(18,59,53,0.35)]">
                                        <div className="flex items-center justify-between"><div><p className="text-xs font-medium text-[#71877e]">SHIFT NOTE</p><p className="mt-1 text-sm font-semibold text-[#173e37]">Ready for handover</p></div><span className="grid size-10 place-items-center rounded-full bg-[#e5f0dd] text-[#0d6558]"><Check className="size-5" /></span></div>
                                        <div className="mt-5 space-y-2.5"><div className="h-2 rounded-full bg-[#e3eae3]" /><div className="h-2 w-4/5 rounded-full bg-[#e3eae3]" /><div className="h-2 w-3/5 rounded-full bg-[#e3eae3]" /></div>
                                        <div className="mt-5 flex items-center gap-2 border-t border-[#edf0ea] pt-4"><span className="size-7 rounded-full bg-[#d8e8e1]" /><div><div className="h-2 w-20 rounded-full bg-[#cbdad2]" /><div className="mt-1.5 h-1.5 w-14 rounded-full bg-[#e2e9e1]" /></div><span className="ml-auto text-[10px] font-medium text-[#698078]">RECORDED</span></div>
                                    </div>
                                    <div className="absolute -bottom-5 -left-6 flex items-center gap-2 rounded-2xl border border-white bg-white px-3 py-2.5 shadow-lg sm:-left-10"><span className="grid size-8 place-items-center rounded-xl bg-[#e9dff0] text-[#5d4867]"><Clock3 className="size-4" /></span><span className="text-xs font-semibold text-[#31554f]">Time-stamped updates</span></div>
                                </div>
                                <p className="max-w-[280px] text-sm font-medium leading-6 text-[#446453]">A shared record makes the small details easier to pick up—and harder to lose.</p>
                            </div>
                        </div>
                    </div>

                    <div id="team" className="landing-reveal landing-delay-1">
                        <p className="text-xs font-bold tracking-[0.16em] text-[#668275]">ONE PLACE FOR THE WHOLE SHIFT</p>
                        <h2 className="mt-4 max-w-[560px] text-4xl leading-[1.03] font-semibold tracking-[-0.06em] text-[#123b35] sm:text-5xl">Less chasing. More clarity.</h2>
                        <p className="mt-5 max-w-[520px] text-base leading-7 text-[#5c716a]">A practical view of what’s done, what’s pending, and what the next person needs to know.</p>
                        <div className="mt-8 divide-y divide-[#e5e9e0]">
                            {steps.map(({ number, icon: Icon, title, description }) => <div key={number} className="group grid grid-cols-[44px_1fr] gap-4 py-5 first:pt-0"><span className="grid size-10 place-items-center rounded-xl border border-[#e3e9e1] bg-white text-[#287064] transition duration-300 group-hover:-translate-y-0.5 group-hover:bg-[#eaf2e8]"><Icon className="size-[18px]" /></span><div><div className="flex items-center gap-3"><h3 className="text-base font-semibold tracking-tight text-[#183f38]">{title}</h3><span className="text-[10px] font-semibold tracking-[0.12em] text-[#8aa097]">{number}</span></div><p className="mt-1.5 max-w-[480px] text-sm leading-6 text-[#657a72]">{description}</p></div></div>)}
                        </div>
                    </div>
                </section>

                <section className="relative overflow-hidden bg-[#0d4941] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12">
                    <div className="absolute -right-24 -top-36 size-[420px] rounded-full border border-white/10" />
                    <div className="absolute -right-8 -top-20 size-[280px] rounded-full border border-white/10" />
                    <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-end">
                        <div><p className="text-xs font-semibold tracking-[0.16em] text-[#bfd5bd]">MAKE THE NEXT SHIFT EASIER</p><h2 className="mt-4 max-w-[650px] text-4xl leading-[1.03] font-semibold tracking-[-0.06em] sm:text-5xl">Good support work deserves a clear record.</h2><p className="mt-4 max-w-[540px] text-sm leading-6 text-[#d0e0d9]">Bring the checklist, updates, and handover into one calm workspace.</p></div>
                        <Link href={destination} className="group inline-flex h-12 shrink-0 items-center gap-3 self-start rounded-full bg-[#e3f0b5] px-6 text-sm font-semibold text-[#123b35] transition duration-300 hover:-translate-y-0.5 hover:bg-white md:self-auto">{auth.user ? 'Open workspace' : 'Create your account'}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></Link>
                    </div>
                </section>

                <footer id="contact" className="bg-[#f2f0e6] px-5 pb-8 pt-12 sm:px-8 sm:pt-16 lg:px-12">
                    <div className="mx-auto grid max-w-7xl gap-10 border-b border-[#dcded3] pb-10 sm:grid-cols-[1.4fr_1fr_1fr]">
                        <div><Link href="/" className="inline-flex items-center gap-2.5"><span className="grid size-8 place-items-center rounded-lg bg-[#0d4941] text-white"><ActivityMark /></span><span className="font-semibold tracking-[-0.04em]">Activity Tracker</span></Link><p className="mt-4 max-w-[280px] text-sm leading-6 text-[#5c716a]">Daily activities and handovers, made easier to follow.</p></div>
                        <div><p className="text-xs font-bold tracking-[0.12em] text-[#678078]">EXPLORE</p><div className="mt-4 grid gap-3 text-sm text-[#31554f]"><a href="#about" className="hover:text-[#0d4941]">About</a><a href="#workflow" className="hover:text-[#0d4941]">How it works</a><a href="#team" className="hover:text-[#0d4941]">For the team</a></div></div>
                        <div><p className="text-xs font-bold tracking-[0.12em] text-[#678078]">YOUR ACCOUNT</p><div className="mt-4 grid gap-3 text-sm text-[#31554f]">{auth.user ? <><Link href={dashboard()} className="hover:text-[#0d4941]">Dashboard</Link><Link href="/activities" className="hover:text-[#0d4941]">Daily activities</Link></> : <><Link href={login()} className="hover:text-[#0d4941]">Log in</Link><Link href={register()} className="hover:text-[#0d4941]">Sign up</Link></>}</div></div>
                    </div>
                    <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 pt-5 text-xs text-[#73867e] sm:flex-row"><span>© {new Date().getFullYear()} Activity Tracker</span><span>Made for clearer team handovers.</span></div>
                </footer>
            </main>
        </>
    );
}

function PreviewTask({ title, status }: { title: string; status: 'Done' | 'Pending' }) {
    return <div className="rounded-xl border border-[#edf0ea] bg-white px-3 py-3">
        <div className="flex items-start gap-2.5"><span className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-full ${status === 'Done' ? 'bg-[#dcecdf] text-[#28704e]' : 'border border-[#d6e0d9]'}`}>{status === 'Done' && <Check className="size-3" />}</span><div className="min-w-0"><p className="text-[11px] leading-4 font-semibold text-[#254941]">{title}</p><p className={`mt-1 text-[9px] font-semibold tracking-[0.08em] ${status === 'Done' ? 'text-[#4a865b]' : 'text-[#87958d]'}`}>{status.toUpperCase()}</p></div></div>
    </div>;
}

function ActivityMark() {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true"><path d="M3 12h4l3-8 4 16 3-8h4" /></svg>;
}
