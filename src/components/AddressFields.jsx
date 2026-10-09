import { inputClass } from "./formStyles.js";

export default function AddressFields({ values, errors, onChange, showName = false }) {
  const labelClass = "mb-1 block text-xs font-semibold text-gray-700";
  const errorText = (name) => errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>;

  return (
    <div className="space-y-4">
      {showName && (
        <div>
          <label htmlFor="name" className={labelClass}>Address name *</label>
          <input id="name" name="name" value={values.name} onChange={onChange} placeholder="e.g. Home, Work" className={inputClass} />
          {errorText("name")}
        </div>
      )}
      <div>
        <label htmlFor="city" className={labelClass}>City *</label>
        <input id="city" name="city" value={values.city} onChange={onChange} placeholder="e.g. Cairo, Alexandria, Giza" className={inputClass} />
        {errorText("city")}
      </div>
      <div>
        <label htmlFor="details" className={labelClass}>Street Address *</label>
        <textarea
          id="details"
          name="details"
          rows={3}
          value={values.details}
          onChange={onChange}
          placeholder="Street name, building number, floor, apartment..."
          className={inputClass}
        />
        {errorText("details")}
      </div>
      <div>
        <label htmlFor="phone" className={labelClass}>
          Phone Number * <span className="font-normal text-gray-400">(Egyptian numbers only)</span>
        </label>
        <input id="phone" name="phone" type="tel" value={values.phone} onChange={onChange} placeholder="01xxxxxxxxx" className={inputClass} />
        {errorText("phone")}
      </div>
    </div>
  );
}
