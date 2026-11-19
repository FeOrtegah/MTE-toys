import Icon from "../atoms/Icon.jsx";
const TABS = [
  { key: "pedidos", label: "Pedidos", icon: "package" },
  {
    key: "crear-producto",
    label: "Crear producto",
    icon: "plus",
  },
  { key: "productos", label: "Productos", icon: "bear" },
  { key: "combos", label: "Combos", icon: "gift" },
  { key: "envio", label: "Envío", icon: "truck" },
  { key: "etiquetas", label: "Etiquetas", icon: "tag" },
  { key: "cupones", label: "Cupones", icon: "ticket" },
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
            <Icon name={tab.icon} />
          </span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default AdminTabs;