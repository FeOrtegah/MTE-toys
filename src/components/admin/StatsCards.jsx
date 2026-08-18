function StatsCards({ stats, pedidosStats }) {
  return (
    <div className="admin-stats">
      <div className="stat-card">
        <span className="stat-value">
          {stats.totalJuguetes}
        </span>

        <span className="stat-label">
          Juguetes distintos
        </span>
      </div>

      <div className="stat-card">
        <span className="stat-value">
          {stats.stockTotal}
        </span>

        <span className="stat-label">
          Unidades en stock
        </span>
      </div>

      <div className="stat-card">
        <span className="stat-value">
          {stats.enOferta}
        </span>

        <span className="stat-label">
          Productos en oferta
        </span>
      </div>

      <div className="stat-card">
        <span className="stat-value">
          {stats.combos}
        </span>

        <span className="stat-label">
          Combos activos
        </span>
      </div>

      <div className="stat-card stat-warning">
        <span className="stat-value">
          {stats.sinStock}
        </span>

        <span className="stat-label">
          Sin stock
        </span>
      </div>

      <div className="stat-card">
        <span className="stat-value">
          {pedidosStats.pendientes}
        </span>

        <span className="stat-label">
          Pedidos pendientes
        </span>
      </div>

      <div className="stat-card">
        <span className="stat-value">
          {pedidosStats.pagados}
        </span>

        <span className="stat-label">
          Pedidos pagados
        </span>
      </div>
    </div>
  );
}

export default StatsCards;