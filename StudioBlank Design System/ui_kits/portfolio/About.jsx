/* @jsx React.createElement */
/* About screen: editorial layout with portrait, bio, and CV table. */

function About() {
  return (
    <div style={{ background: "#FAFAFA", paddingBottom: 128 }}>
      {/* Bio */}
      <section style={{ padding: "128px 64px 96px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 96 }}>
        <div>
          <Eyebrow style={{ marginBottom: 32 }}>About the Studio</Eyebrow>
          <h1 style={{ font: "700 48px/1.1 Inter", letterSpacing: "-0.03em", margin: 0, color: "#0A0A0A" }}>
            A photography practice<br/>
            <span style={{ fontWeight: 300, color: "#71717A" }}>based in Reykjavík.</span>
          </h1>
          <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 24 }}>
            <p style={{ font: "300 17px/1.7 Inter", color: "#0A0A0A", margin: 0 }}>
              Founded in 2019, studioblank is a small photography practice focused on
              landscape, documentary, and editorial work. The studio publishes a quarterly
              journal of new work alongside its archive of editions.
            </p>
            <p style={{ font: "300 17px/1.7 Inter", color: "#0A0A0A", margin: 0 }}>
              Prints are produced in-studio in Reykjavík on Hahnemühle and Canson archival
              papers, in editions of 8 to 24. Commissions are accepted seasonally.
            </p>
          </div>
        </div>
        <div>
          <PhotoTile seed={9} ratio="4 / 5" />
          <Mono style={{ display: "block", marginTop: 12 }}>Studio portrait · Reykjavík, 2024</Mono>
        </div>
      </section>

      {/* CV */}
      <section style={{ padding: "0 64px" }}>
        <Eyebrow style={{ marginBottom: 32 }}>Selected Exhibitions</Eyebrow>
        <div style={{ borderTop: "1px solid #0A0A0A" }}>
          {[
            ["2024", "Northern Light",        "Gallery Atrium, Reykjavík",   "Solo"],
            ["2024", "On Stillness",          "Fotografisk, Stockholm",      "Group"],
            ["2023", "Stones, Series II",     "Kunsthal Bergen",             "Solo"],
            ["2022", "Quiet Geometries",      "Cooper Cole, Toronto",        "Group"],
            ["2021", "Field Studies",         "Aperture, New York",          "Group"],
            ["2020", "First Editions",        "Studio, Reykjavík",           "Solo"]
          ].map(row => (
            <div key={row[1]} style={{
              display: "grid", gridTemplateColumns: "80px 1fr 1fr 100px",
              padding: "20px 0", borderBottom: "1px solid #F4F4F5",
              font: "400 14px Inter", color: "#0A0A0A", alignItems: "baseline"
            }}>
              <Mono>{row[0]}</Mono>
              <span style={{ fontWeight: 500 }}>{row[1]}</span>
              <span style={{ color: "#71717A" }}>{row[2]}</span>
              <span style={{ textAlign: "right", color: "#71717A" }}>{row[3]}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

window.About = About;
