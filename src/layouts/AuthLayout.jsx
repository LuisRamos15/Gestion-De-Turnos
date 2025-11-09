export default function AuthLayout({ title, children, hint }) {
  return (
    <div className="auth-bg">
      <header className="auth-header">
        <div className="brand">Gestión de Turnos EPS</div>
        <nav className="auth-nav">
          {/* Los enlaces concretos se ponen en cada pantalla (login/registro) */}
        </nav>
      </header>
      <main className="auth-main">
        <section className="auth-card">
          {title && <h1 className="auth-title">{title}</h1>}
          {hint && <p className="auth-hint">{hint}</p>}
          {children}
        </section>
      </main>
      <footer className="auth-footer">
        <span> {new Date().getFullYear()} EPS Demo</span>
      </footer>
    </div>
  );
}