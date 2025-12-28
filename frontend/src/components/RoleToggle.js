import React from "react";

const RoleToggle = ({ value, onChange }) => {
  const roles = [
    { key: "player", label: "Игрок" },
    { key: "parent", label: "Родитель" },
    { key: "scout", label: "Скаут" },
    { key: "coach", label: "Тренер" },
  ];

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-300">
        Роль в системе
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {roles.map((role) => {
          const active = value === role.key;
          return (
            <button
              key={role.key}
              type="button"
              onClick={() =>
                onChange({ target: { name: "role", value: role.key } })
              }
              className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                active
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-200 shadow-[0_0_0_1px_rgba(16,185,129,0.5)]"
                  : "border-slate-700 bg-slate-900/60 text-slate-300 hover:border-emerald-400/60 hover:text-emerald-200"
              }`}
            >
              {role.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoleToggle;
