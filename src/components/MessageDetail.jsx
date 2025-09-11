import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = "https://68c2fcadf9928dbf33f063ba.mockapi.io/Rabbi/api";
const ENDPOINT = "rabitMessage";

export default function MessageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchItem = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/${ENDPOINT}/${id}`);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();
      setItem(data);
    } catch (e) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [id]);

  const onSave = async (e) => {
    e.preventDefault();
    if (!item) return;
    try {
      setSaving(true);
      const res = await fetch(`${API_BASE}/${ENDPOINT}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: item.name,
          message: item.message,
          massage_sent_time: item.massage_sent_time || Math.floor(Date.now() / 1000),
        }),
      });
      if (!res.ok) throw new Error(`Save failed: ${res.status}`);
      navigate(`/messages/${id}`);
      await fetchItem();
    } catch (e) {
      alert(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!confirm("Delete this message?")) return;
    try {
      const res = await fetch(`${API_BASE}/${ENDPOINT}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      navigate(`/messages`);
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  };

  if (loading) return <div className="bd-container" style={{ padding: "2rem 0 3rem" }}>Loading...</div>;
  if (error) return <div className="bd-container" style={{ padding: "2rem 0 3rem", color: "#b91c1c" }}>Error: {error}</div>;
  if (!item) return <div className="bd-container" style={{ padding: "2rem 0 3rem" }}>Not found.</div>;

  return (
    <div className="bd-container" style={{ padding: "2rem 0 3rem", display: "grid", gap: 16 }}>
      {/* Top nav */}
      <div className="bd-navbar bd-card" style={{ position: "sticky", top: 0 }}>
        <div className="bd-nav-row">
          <button className="bd-btn" onClick={() => navigate(-1)}>← Return</button>
          <div style={{ fontWeight: 800 }}>Message #{id}</div>
          <div />
        </div>
      </div>

      <form onSubmit={onSave} className="bd-card" style={{ padding: 16, display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <label style={{ fontWeight: 600 }}>Name</label>
          <input className="bd-input" value={item.name || ""} onChange={(e) => setItem({ ...item, name: e.target.value })} />
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          <label style={{ fontWeight: 600 }}>Message</label>
          <input className="bd-input" value={item.message || ""} onChange={(e) => setItem({ ...item, message: e.target.value })} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="bd-btn bd-btn-primary" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          <button type="button" className="bd-btn" onClick={onDelete}>Delete</button>
          <button type="button" className="bd-btn" onClick={() => navigate(-1)}>Return</button>
        </div>
      </form>

      <article className="bd-card" style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
          <h3 style={{ margin: 0 }}>{item.name || "Anonymous"}</h3>
          <time style={{ color: "#6b7280", fontSize: 12 }}>{formatUnixTime(item.massage_sent_time)}</time>
        </div>
        <p style={{ margin: "8px 0 0" }}>{item.message}</p>
      </article>
    </div>
  );
}

function formatUnixTime(sec) {
  if (!sec) return "";
  try {
    const d = new Date(sec * 1000);
    return d.toLocaleString();
  } catch {
    return "";
  }
} 