import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeartLoading from "./HeartLoading";

const API_BASE = "https://68c2fcadf9928dbf33f063ba.mockapi.io/Rabbi/api";
const ENDPOINT = "rabitMessage";

function FullscreenLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        inset: 0,                 
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center", 
        backgroundColor: "#fff7f9",
        zIndex: 9999,        
      }}
    >
      <HeartLoading size={100} color="#e11d48" />
      <div style={{ marginTop: 12, fontWeight: 600, color: "#b91c1c" }}>
      </div>
    </div>
  );
}

export default function Messages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);  

  const [name, setName] = useState("LookNut");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

 
  const bottomRef = useRef(null);

  const scrollToBottom = (smooth = true) => {
    bottomRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "end",
    });
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/${ENDPOINT}`);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

 
  useLayoutEffect(() => {
    if (isInitialLoading) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [isInitialLoading]);

  useEffect(() => {
 
    const timer = setTimeout(() => setIsInitialLoading(false), 1000); 
    fetchMessages().then(() => {
 
      scrollToBottom(false);
    });
    return () => clearTimeout(timer);
  }, []);

  const sortedAsc = useMemo(() => {
    return [...items].sort(
      (a, b) => (a.massage_sent_time || 0) - (b.massage_sent_time || 0)
    );
  }, [items]);

  useEffect(() => {
    if (!loading && !isInitialLoading) {
      scrollToBottom(true);
    }
  }, [sortedAsc, loading, isInitialLoading]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name || !message.trim()) return;
    try {
      setSubmitting(true);
      const body = {
        name,
        message: message.trim(),
        massage_sent_time: Math.floor(Date.now() / 1000),
      };
      const res = await fetch(`${API_BASE}/${ENDPOINT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
      setMessage("");
      await fetchMessages();
      scrollToBottom();
    } catch (e) {
      alert(e.message || "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this message?")) return;
    try {
      const res = await fetch(`${API_BASE}/${ENDPOINT}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      await fetchMessages();
      scrollToBottom();
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  };

  // +++ ฟูลสกรีนโหลดครั้งแรก (เต็มจอ 100% ไอคอนกลางหน้าจอ)
  if (isInitialLoading) {
    return <FullscreenLoading  />;
  }


  return (
    <div className="bd-container" style={{ padding: "2rem 0 3rem"  }}>
 
      <div className="bd-navbar bd-card" style={{ position: "sticky", top: 0, marginBottom: 16, zIndex: 5  , marginLeft:20, marginRight:20}}>
        <div className="bd-nav-row">
          <button className="bd-btn" onClick={() => navigate(-1)} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderLeft: "2px solid currentColor", borderBottom: "2px solid currentColor", transform: "rotate(45deg)" }} />
            Return
          </button>
          <div style={{ fontWeight: 800 }}>Love Messages</div>
          <div />
        </div>
      </div>

      {/* Composer */}
      <form onSubmit={onSubmit} className="bd-card" style={{ padding: 16, marginBottom: 12, display: "grid", gap: 12 , marginLeft:20, marginRight:20}}>
        <div style={{ display: "grid", gap: 6 }}>
          <label style={{ fontWeight: 600 }}>From</label>
          <div style={{ position: "relative", display: "inline-block" }}>
            <select className="bd-input" value={name} onChange={(e) => setName(e.target.value)} style={{ paddingRight: 28 }}>
              <option value="LookNut">LookNut</option>
              <option value="Boss">Boss</option>
            </select>
            <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#6b7280" }}>▼</span>
          </div>
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <label style={{ fontWeight: 600 }}>Message</label>
          <textarea
            className="bd-input"
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write something sweet..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e);
              }
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button className="bd-btn bd-btn-primary" disabled={submitting}>
            {submitting ? "Sending..." : "Send"}
          </button>
          <button type="button" className="bd-btn" onClick={() => { fetchMessages().then(() => scrollToBottom()); }} disabled={loading}>
            Refresh
          </button>
        </div>
      </form>

      {loading && <div className="bd-card" style={{ padding: 16 }}>Loading...</div>}
      {error && <div className="bd-card" style={{ padding: 16, color: "#b91c1c" }}>Error: {error}</div>}

 
      {!loading && !error && (
        <div className="bd-card" style={{ padding: 0, marginLeft:20, marginRight:20 }}>
          <div
            style={{
              display: "flex",         
              flexDirection: "column",
              gap: 0,
              padding: 12,
              height: "calc(80vh - 280px)",  
              overflowY: "auto",           
            }}
          >
            {sortedAsc.length === 0 && (
              <div className="bd-card" style={{ padding: 16, margin: 8 }}>
                No messages yet.
              </div>
            )}

            {sortedAsc.map((m) => {
              const isLookNut = (m.name || "").toLowerCase() === "looknut";
              return (
                <div key={m.id} style={{ display: "grid", justifyContent: isLookNut ? "end" : "start", padding: "6px 4px" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-end", flexDirection: isLookNut ? "row-reverse" : "row" }}>
                    <div title={m.name} style={{ width: 32, height: 32, borderRadius: 999, background: isLookNut ? "#fb7185" : "#60a5fa",  color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12 }}>
                      {(m.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="bd-card" style={{ maxWidth: 520, padding: 10, borderRadius: 14, borderTopLeftRadius: isLookNut ? 14 : 4, borderTopRightRadius: isLookNut ? 4 : 14, background: isLookNut ? "#fee2e2" : "#e0f2fe" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <div style={{ fontWeight: 700, color: "#111827" }}>{m.name || "Anonymous"}</div>
                        <time style={{ color: "#6b7280", fontSize: 11 }}>{formatUnixTime(m.massage_sent_time)}</time>
                      </div>
                      <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{m.message}</div>
                      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <button className="bd-btn" style={{ padding: "4px 8px" }} onClick={() => onDelete(m.id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

    
            <div ref={bottomRef} />
          </div>
        </div>
      )}
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