import React from "react";

const FormField = ({
  label,
  htmlFor,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
  helpText,
}) => (
  <div className="space-y-1.5">
    <label
      htmlFor={htmlFor}
      className="block text-xs font-medium uppercase tracking-wide text-slate-300 dark:text-slate-300"
    >
      {label}
      {required && <span className="ml-0.5 text-emerald-400">*</span>}
    </label>
    <input
      id={htmlFor}
      name={htmlFor}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
      className="input-field"
    />
    {helpText && <p className="text-xs text-slate-500">{helpText}</p>}
  </div>
);

export default FormField;
