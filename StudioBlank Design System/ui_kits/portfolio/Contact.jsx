/* @jsx React.createElement */
/* Contact screen: editorial form layout. */

function Contact() {
  const [form, setForm] = React.useState({ name: "", email: "", subject: "general", message: "" });
  const [sent, setSent] = React.useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div style={{ background: "#FAFAFA", padding: "128px 64px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 128, maxWidth: 1200, margin: "0 auto" }}>
        <div>
          <Eyebrow style={{ marginBottom: 32 }}>Contact</Eyebrow>
          <h1 style={{ font: "700 48px/1.1 Inter", letterSpacing: "-0.03em", margin: 0, color: "#0A0A0A" }}>
            Inquiries,<br/>commissions,<br/>
            <span style={{ fontWeight: 300, color: "#71717A" }}>and editions.</span>
          </h1>
          <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              ["Studio",  "Laugavegur 24, 101 Reykjavík"],
              ["Email",   "studio@studioblank.is"],
              ["Press",   "press@studioblank.is"],
              ["Hours",   "By appointment · Tue — Sat"]
            ].map(([k, v]) => (
              <div key={k} style={{
                display: "grid", gridTemplateColumns: "120px 1fr", padding: "12px 0",
                borderBottom: "1px solid #F4F4F5"
              }}>
                <span style={{ font: "500 11px Inter", letterSpacing: "0.14em", textTransform: "uppercase", color: "#71717A" }}>{k}</span>
                <span style={{ font: "400 14px Inter", color: "#0A0A0A" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <label style={{ font: "500 11px Inter", letterSpacing: "0.14em", textTransform: "uppercase", color: "#71717A", display: "block", marginBottom: 8 }}>Name</label>
            <Input value={form.name} onChange={set("name")} placeholder="Your name" />
          </div>
          <div>
            <label style={{ font: "500 11px Inter", letterSpacing: "0.14em", textTransform: "uppercase", color: "#71717A", display: "block", marginBottom: 8 }}>Email</label>
            <Input value={form.email} onChange={set("email")} placeholder="you@domain.com" />
          </div>
          <div>
            <label style={{ font: "500 11px Inter", letterSpacing: "0.14em", textTransform: "uppercase", color: "#71717A", display: "block", marginBottom: 12 }}>Subject</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["general", "commission", "press", "edition"].map(s => (
                <Chip key={s} selected={form.subject === s} onClick={() => setForm({ ...form, subject: s })}>{s}</Chip>
              ))}
            </div>
          </div>
          <div>
            <label style={{ font: "500 11px Inter", letterSpacing: "0.14em", textTransform: "uppercase", color: "#71717A", display: "block", marginBottom: 8 }}>Message</label>
            <textarea value={form.message} onChange={set("message")} rows={6} placeholder="Tell us about your project."
              style={{
                width: "100%", boxSizing: "border-box", background: "#fff", border: "1px solid #D4D4D8",
                padding: 12, fontFamily: "Inter", fontSize: 14, fontWeight: 400, color: "#0A0A0A",
                borderRadius: 0, outline: "none", resize: "vertical"
              }} />
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
            <Button variant="primary" size="md" type="submit">Send Inquiry</Button>
            {sent && <Mono style={{ color: "#16A34A" }}>↗ Message queued · we'll reply within 48 hours.</Mono>}
          </div>
        </form>
      </div>
    </div>
  );
}

window.Contact = Contact;
