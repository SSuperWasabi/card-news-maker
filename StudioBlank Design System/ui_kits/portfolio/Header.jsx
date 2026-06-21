/* @jsx React.createElement */
/* Header: minimal nav. Wordmark left, route links center, studio meta right. */

function Header({ route, onNav }) {
  const links = [
    { id: "work",    label: "Work" },
    { id: "series",  label: "Series" },
    { id: "about",   label: "About" },
    { id: "journal", label: "Journal" },
    { id: "contact", label: "Contact" }
  ];
  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "32px 64px", borderBottom: "1px solid #F4F4F5",
      background: "#FAFAFA", position: "sticky", top: 0, zIndex: 10
    }}>
      <button onClick={() => onNav("work")} style={{
        display: "flex", alignItems: "center", gap: 12, background: "none",
        border: "none", padding: 0, cursor: "pointer"
      }}>
        <div style={{ width: 20, height: 20, background: "#0A0A0A", position: "relative" }}>
          <div style={{
            position: "absolute", right: 0, bottom: 0, width: "50%", height: "50%",
            background: "#FAFAFA"
          }}></div>
        </div>
        <span style={{
          fontFamily: "Inter", fontWeight: 700, fontSize: 16,
          letterSpacing: "-0.02em", color: "#0A0A0A"
        }}>
          studio<span style={{ fontWeight: 300, color: "#A1A1AA" }}>blank</span>
        </span>
      </button>
      <nav style={{ display: "flex", gap: 40, alignItems: "center" }}>
        {links.map(l => (
          <button key={l.id} onClick={() => onNav(l.id)} style={{
            background: "none", border: "none", padding: 0, cursor: "pointer",
            fontFamily: "Inter", fontSize: 13, fontWeight: 400,
            color: route === l.id ? "#0A0A0A" : "#71717A",
            borderBottom: route === l.id ? "1px solid #0A0A0A" : "1px solid transparent",
            paddingBottom: 2
          }}>{l.label}</button>
        ))}
      </nav>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#71717A"
      }}>EST · 2019</div>
    </header>
  );
}

window.Header = Header;
