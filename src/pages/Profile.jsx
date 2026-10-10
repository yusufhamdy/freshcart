import { useEffect, useState } from "react";
import { FaBuilding, FaMapMarkerAlt, FaPencilAlt, FaPhoneAlt, FaPlus, FaRegTrashAlt } from "react-icons/fa";
import AccountLayout from "../components/AccountLayout.jsx";
import AddressFields from "../components/AddressFields.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Loader from "../components/Loader.jsx";
import { primaryButtonClass } from "../components/formStyles.js";
import { useToast } from "../context/ToastContext.jsx";
import { addAddress, getAddresses, removeAddress } from "../services/addresses.js";
import { validateAddress } from "../utils/validation.js";

const emptyForm = { name: "", city: "", details: "", phone: "" };

export default function Profile() {
  const { showToast } = useToast();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadAddresses() {
    const response = await getAddresses();
    setAddresses(response.data);
  }

  useEffect(() => {
    loadAddresses()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function openModal(address = null) {
    setEditing(address);
    setForm(address ? { name: address.name, city: address.city, details: address.details, phone: address.phone } : emptyForm);
    setErrors({});
    setModalOpen(true);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave(e) {
    e.preventDefault();
    // Ignore a second submit while the first one is still running
    if (saving) return;
    const found = validateAddress(form, true);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    try {
      // The API has no update request, so an edit replaces the old address.
      // The new address is created first: if that fails the original is still
      // there, instead of being deleted with nothing to show for it.
      await addAddress({ ...form, name: form.name.trim(), city: form.city.trim(), details: form.details.trim() });

      if (editing) {
        try {
          await removeAddress(editing._id);
        } catch {
          // The replacement exists but the old one could not be removed, so the
          // account now holds both. Report that honestly rather than claiming a
          // clean update, and reload so the list matches the server.
          await loadAddresses().catch(() => {});
          showToast("Address saved, but the old address could not be removed", "error");
          setModalOpen(false);
          return;
        }
      }

      await loadAddresses();
      showToast(editing ? "Address updated" : "Address added");
      setModalOpen(false);
    } catch (err) {
      // Creation failed: the previous address is untouched.
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(address) {
    if (saving) return;
    if (!window.confirm("Delete this address?")) return;
    setSaving(true);
    try {
      await removeAddress(address._id);
      await loadAddresses();
      showToast("Address deleted");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AccountLayout active="addresses">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">My Addresses</h2>
              <p className="text-xs text-gray-500">Manage your saved delivery addresses</p>
            </div>
            <button onClick={() => openModal()} className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-700">
              <FaPlus className="text-xs" /> Add Address
            </button>
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : addresses.length === 0 ? (
            <p className="py-16 text-center text-gray-500">You have no saved addresses yet.</p>
          ) : (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {addresses.map((address) => (
                <div key={address._id} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600"><FaMapMarkerAlt /></span>
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="font-semibold text-gray-900">{address.name}</p>
                    <p className="text-gray-600">{address.details}</p>
                    <p className="mt-1 flex flex-wrap gap-x-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><FaPhoneAlt /> {address.phone}</span>
                      <span className="flex items-center gap-1"><FaBuilding /> {address.city}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openModal(address)} aria-label="Edit address" className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-600 hover:text-green-600"><FaPencilAlt /></button>
                    <button onClick={() => handleDelete(address)} aria-label="Delete address" className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-600 hover:text-red-500"><FaRegTrashAlt /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleSave} noValidate className="animate-fade-up max-h-full w-full max-w-md space-y-4 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">{editing ? "Edit Address" : "Add Address"}</h3>
            <AddressFields values={form} errors={errors} onChange={handleChange} showName />
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className={primaryButtonClass}>{saving ? "Saving..." : "Save"}</button>
              <button type="button" onClick={() => setModalOpen(false)} className="w-full rounded-lg border border-gray-200 py-2.5 text-sm text-gray-600">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </AccountLayout>
  );
}
