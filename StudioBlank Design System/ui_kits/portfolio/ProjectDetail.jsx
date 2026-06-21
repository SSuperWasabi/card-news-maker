/* @jsx React.createElement */
/* Project detail: full-bleed image up top, sidebar of EXIF/meta + caption block. */

function ProjectDetail({ project, onBack }) {
  const [idx, setIdx] = React.useState(0);
  const tiles = Array.from({ length: 6 }, (_, i) => (project.seed + i) % 12);

  return (
    <div style={{ background: "#FAFAFA" }}>
      {/* Sub-header / breadcrumb */}
      <div style={{
        padding: "24px 64px", borderBottom: "1px solid #F4F4F5",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", padding: 0, cursor: "pointer",
          font: "400 13px Inter", color: "#71717A", display: "flex", alignItems: "center", gap: 8
        }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>←</span> All work
        </button>
        <Mono>{project.id} · {project.year}</Mono>
      </div>

      {/* Title block */}
      <section style={{ padding: "96px 64px 48px", display: "grid", gridTemplateColumns: "1fr 360px", gap: 64 }}>
        <div>
          <Eyebrow style={{ marginBottom: 24 }}>{project.cat} · {project.year}</Eyebrow>
          <h1 style={{
            font: "700 56px/1.05 Inter", letterSpacing: "-0.03em", margin: 0, color: "#0A0A0A"
          }}>{project.title}</h1>
          <p style={{
            font: "300 18px/1.65 Inter", color: "#0A0A0A", marginTop: 32, maxWidth: 580
          }}>
            An archive of photographs taken between 2019 and 2024 in northern Iceland.
            Quiet landscapes, long exposures, and the slow geometry of glaciated terrain.
            Edition of 12; printed on Hahnemühle Photo Rag.
          </p>
        </div>
        <aside style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {[
            ["Year",     project.year],
            ["Photographs", project.count],
            ["Medium",   "Silver gelatin · 24 × 30 in"],
            ["Edition",  "12 + 2 AP"],
            ["Status",   project.status]
          ].map(([k, v]) => (
            <div key={k} style={{
              display: "flex", justifyContent: "space-between",
              padding: "12px 0", borderBottom: "1px solid #F4F4F5"
            }}>
              <span style={{ font: "400 13px Inter", color: "#71717A" }}>{k}</span>
              <span style={{ font: "500 13px Inter", color: "#0A0A0A", textTransform: k === "Status" ? "capitalize" : "none" }}>{v}</span>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <Button variant="primary" size="md">Inquire</Button>
            <Button variant="secondary" size="md">Download PDF</Button>
          </div>
        </aside>
      </section>

      {/* Hero photo */}
      <section style={{ padding: "0 64px" }}>
        <PhotoTile seed={tiles[idx]} ratio="3 / 2" />
        <div style={{
          padding: "16px 0 64px", display: "flex", justifyContent: "space-between",
          borderBottom: "1px solid #F4F4F5"
        }}>
          <div style={{ display: "flex", gap: 24 }}>
            <Mono>Plate {String(idx + 1).padStart(2, "0")} / {String(tiles.length).padStart(2, "0")}</Mono>
            <Mono>f/2.8 · 1/250s · ISO 400</Mono>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="ghost" size="sm" onClick={() => setIdx((idx - 1 + tiles.length) % tiles.length)}>← Prev</Button>
            <Button variant="ghost" size="sm" onClick={() => setIdx((idx + 1) % tiles.length)}>Next →</Button>
          </div>
        </div>
      </section>

      {/* Plate grid */}
      <section style={{ padding: "64px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
        {tiles.map((s, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{
            background: "none", border: "none", padding: 0, cursor: "pointer",
            opacity: i === idx ? 1 : 0.6,
            outline: i === idx ? "1px solid #0A0A0A" : "none",
            outlineOffset: 4
          }}>
            <PhotoTile seed={s} ratio="4 / 5" />
            <div style={{
              padding: "12px 0 0", display: "flex", justifyContent: "space-between",
              font: "400 12px Inter", color: "#71717A"
            }}>
              <span>Plate {String(i + 1).padStart(2, "0")}</span>
              <Mono style={{ fontSize: 11 }}>24 × 30 in</Mono>
            </div>
          </button>
        ))}
      </section>
    </div>
  );
}

window.ProjectDetail = ProjectDetail;
