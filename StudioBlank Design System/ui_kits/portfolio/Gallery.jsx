/* @jsx React.createElement */
/* Gallery screen: hero band + filter chips + image grid. */

function Gallery({ onOpenProject }) {
  const [filter, setFilter] = React.useState("all");
  const filters = ["all", "landscape", "portrait", "street", "studio", "archive"];
  const projects = [
    { id: "p01", title: "Glacier, North",    year: 2024, cat: "landscape", seed: 0, count: 24, status: "published" },
    { id: "p02", title: "Stones, Series II", year: 2023, cat: "landscape", seed: 1, count: 11, status: "published" },
    { id: "p03", title: "Untitled (Wall)",   year: 2022, cat: "studio",    seed: 2, count: 8,  status: "featured" },
    { id: "p04", title: "Hjorundfjord",      year: 2024, cat: "landscape", seed: 3, count: 18, status: "published" },
    { id: "p05", title: "Portraits 04",      year: 2023, cat: "portrait",  seed: 4, count: 6,  status: "draft" },
    { id: "p06", title: "Berlin, October",   year: 2022, cat: "street",    seed: 5, count: 22, status: "published" },
    { id: "p07", title: "Field Studies",     year: 2021, cat: "archive",   seed: 6, count: 31, status: "archived" },
    { id: "p08", title: "Interiors",         year: 2024, cat: "studio",    seed: 7, count: 9,  status: "published" },
    { id: "p09", title: "Morning Set",       year: 2023, cat: "landscape", seed: 8, count: 14, status: "published" }
  ];
  const visible = projects.filter(p => filter === "all" || p.cat === filter);

  return (
    <div>
      <section style={{ padding: "128px 64px 96px", background: "#FAFAFA" }}>
        <Eyebrow style={{ marginBottom: 32 }}>Selected Work · 2019 — 2024</Eyebrow>
        <h1 style={{
          font: "700 64px/1.05 Inter", letterSpacing: "-0.04em", margin: 0,
          color: "#0A0A0A", maxWidth: 980
        }}>
          Photographs of quiet landscapes,<br/>
          <span style={{ fontWeight: 300, color: "#71717A" }}>slow geometry,</span> and the spaces between.
        </h1>
        <div style={{
          marginTop: 64, display: "flex", gap: 96,
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#71717A"
        }}>
          <div><span style={{ color: "#0A0A0A" }}>143</span> works</div>
          <div><span style={{ color: "#0A0A0A" }}>12</span> series</div>
          <div><span style={{ color: "#0A0A0A" }}>4</span> exhibitions</div>
          <div><span style={{ color: "#0A0A0A" }}>2024</span> most recent</div>
        </div>
      </section>

      <section style={{
        padding: "32px 64px", borderTop: "1px solid #F4F4F5",
        borderBottom: "1px solid #F4F4F5", display: "flex",
        justifyContent: "space-between", alignItems: "center", background: "#FAFAFA"
      }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {filters.map(f => (
            <Chip key={f} selected={filter === f} onClick={() => setFilter(f)}>{f}</Chip>
          ))}
        </div>
        <Mono>{visible.length} / {projects.length} works</Mono>
      </section>

      <section style={{
        padding: "64px", display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)", gap: 48, background: "#FAFAFA"
      }}>
        {visible.map((p) => (
          <button key={p.id} onClick={() => onOpenProject(p)} style={{
            background: "none", border: "none", padding: 0, cursor: "pointer",
            textAlign: "left", display: "flex", flexDirection: "column", gap: 16
          }}>
            <PhotoTile seed={p.seed} ratio="4 / 5" />
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ font: "500 14px Inter", color: "#0A0A0A" }}>{p.title}</span>
                <Mono style={{ fontSize: 11 }}>{p.year}</Mono>
              </div>
              <span style={{ font: "300 13px Inter", color: "#71717A" }}>
                {p.count} photographs · {p.cat}
              </span>
            </div>
          </button>
        ))}
      </section>
    </div>
  );
}

window.Gallery = Gallery;
