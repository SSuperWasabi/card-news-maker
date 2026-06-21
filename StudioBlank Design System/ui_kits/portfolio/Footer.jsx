/* @jsx React.createElement */
/* Footer: ink section, generous padding, no ornament. */

function Footer() {
  const cols = [
    { title: "Index", links: ["Selected Works", "Series", "Archive", "Editions", "Exhibitions"] },
    { title: "Studio", links: ["About", "Press", "CV", "Contact"] },
    { title: "Elsewhere", links: ["Instagram", "Are.na", "Mailing List"] }
  ];
  return (
    <footer style={{
      background: "#0A0A0A", color: "#FAFAFA",
      padding: "96px 64px 48px",
      display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 64
    }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <div style={{ width: 28, height: 28, background: "#FAFAFA", position: "relative" }}>
            <div style={{ position: "absolute", right: 0, bottom: 0, width: "50%", height: "50%", background: "#0A0A0A" }} />
          </div>
          <span style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 20, letterSpacing: "-0.02em" }}>
            studio<span style={{ fontWeight: 300, color: "#71717A" }}>blank</span>
          </span>
        </div>
        <p style={{ fontFamily: "Inter", fontWeight: 300, fontSize: 14, lineHeight: 1.65, color: "#A1A1AA", maxWidth: 360, margin: 0 }}>
          Photographs of quiet landscapes, slow geometry, and the spaces between. Selected work, 2019&ndash;2024.
        </p>
      </div>
      {cols.map(c => (
        <div key={c.title}>
          <div style={{
            fontFamily: "Inter", fontWeight: 500, fontSize: 11, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "#71717A", marginBottom: 20
          }}>{c.title}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {c.links.map(l => (
              <a key={l} href="#" style={{
                fontFamily: "Inter", fontSize: 14, fontWeight: 300, color: "#FAFAFA",
                textDecoration: "none"
              }}>{l}</a>
            ))}
          </div>
        </div>
      ))}
      <div style={{
        gridColumn: "1 / -1", marginTop: 48, paddingTop: 24,
        borderTop: "1px solid #2a2a2a", display: "flex", justifyContent: "space-between",
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#71717A"
      }}>
        <span>© 2024 studioblank</span>
        <span>All work copyright the artists · No reproduction without permission</span>
      </div>
    </footer>
  );
}

window.Footer = Footer;
