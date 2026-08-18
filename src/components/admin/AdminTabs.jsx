const TABS = [
  { key: "pedidos", label: "Pedidos", icon: "📦" },
  {
    key: "crear-producto",
    label: "Crear producto",
    icon: "➕",
  },
  { key: "productos", label: "Productos", icon: "🧸" },
  { key: "combos", label: "Combos", icon: "🎁" },
];

function AdminTabs({ activeTab, onChange }) {
  return (
    <div className="admin-tabs">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={
            activeTab === tab.key
              ? "admin-tab admin-tab-active"
              : "admin-tab"
          }
          onClick={() => onChange(tab.key)}
        >
          <span className="admin-tab-icon">
            {tab.icon}
          </span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default AdminTabs;