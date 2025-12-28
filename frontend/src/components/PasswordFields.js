import React, { useState } from "react";

const PasswordField = ({
  label,
  htmlFor,
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-xs font-medium uppercase tracking-wide text-slate-300"
      >
        {label}
        {required && <span className="ml-0.5 text-emerald-400">*</span>}
      </label>
      <div className="relative">
        <input
          id={htmlFor}
          name={htmlFor}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="input-field pr-11"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-medium text-slate-400 hover:text-slate-200"
        >
          {visible ? "Скрыть" : "Показать"}
        </button>
      </div>
    </div>
  );
};

export default PasswordField;
