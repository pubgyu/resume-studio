export function SupabaseSetupNotice() {
  return (
    <main className="studio-page">
      <section className="studio-shell studio-shell-loading">
        <div className="panel-card loading-card setup-card">
          <p className="eyebrow hero-brand">Resume Room</p>
          <h1 className="loading-title">Supabase 설정이 필요합니다</h1>
          <p className="intro loading-copy">
            `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`과
            `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`를 넣고, Supabase SQL Editor에서
            `supabase/resumes.sql`을 실행한 뒤 다시 열어 주세요.
          </p>
          <div className="auth-card-meta">
            <span>Env</span>
            <span>SQL</span>
            <span>Redirect URL</span>
          </div>
          <pre className="setup-code">
{`NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...`}
          </pre>
        </div>
      </section>
    </main>
  );
}
