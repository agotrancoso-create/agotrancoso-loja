export default function Loading() {
  return (
    <section className="ago-route-loading" aria-busy="true" aria-label="Carregando conteúdo">
      <div className="ago-route-loading-inner">
        <div className="ago-route-loading-mark" aria-hidden="true" />
        <div className="ago-route-loading-line" aria-hidden="true" />
        <div className="ago-route-loading-line" aria-hidden="true" />
        <div className="ago-route-loading-grid" aria-hidden="true">
          <div className="ago-route-loading-card" />
          <div className="ago-route-loading-card" />
          <div className="ago-route-loading-card" />
        </div>
      </div>
    </section>
  );
}
