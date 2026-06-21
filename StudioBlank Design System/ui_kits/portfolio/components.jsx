/* @jsx React.createElement */
/* Shared primitive components for the StudioBlank portfolio UI kit.
   Sharp edges, zero shadow, weight-contrast typography. */

const { useState } = React;

// ---------- Button ---------------------------------------------------------
function Button({ variant = "primary", size = "md", disabled, children, onClick, type = "button", style = {} }) {
  const variants = {
    primary:     { background: "#0A0A0A", color: "#FAFAFA", border: "1px solid #0A0A0A" },
    secondary:   { background: "transparent", color: "#0A0A0A", border: "1px solid #0A0A0A" },
    ghost:       { background: "transparent", color: "#0A0A0A", border: "1px solid transparent" },
    destructive: { background: "#DC2626", color: "#FAFAFA", border: "1px solid #DC2626" }
  };
  const sizes = {
    sm: { height: 32, padding: "0 16px", fontSize: 12, minWidth: 64 },
    md: { height: 40, padding: "0 24px", fontSize: 14, minWidth: 96 },
    lg: { height: 48, padding: "0 32px", fontSize: 16, minWidth: 128 }
  };
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        fontFamily: "Inter, sans-serif", fontWeight: 500, borderRadius: 0,
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.3 : 1,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        transition: "background-color 160ms, color 160ms, border-color 160ms",
        ...variants[variant], ...sizes[size], ...style
      }}
    >{children}</button>
  );
}

// ---------- Input ----------------------------------------------------------
function Input({ value, onChange, placeholder, error, disabled, type = "text", style = {} }) {
  const [focus, setFocus] = useState(false);
  const borderColor = error ? "#DC2626" : focus ? "#0A0A0A" : disabled ? "#E5E5E5" : "#D4D4D8";
  const borderWidth = focus ? 2 : 1;
  return (
    <input
      type={type} value={value || ""} onChange={onChange} placeholder={placeholder} disabled={disabled}
      onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      style={{
        height: 40, width: "100%", boxSizing: "border-box",
        background: disabled ? "#F4F4F5" : "#FFFFFF",
        border: `${borderWidth}px solid ${borderColor}`,
        padding: `0 ${12 - (focus ? 1 : 0)}px`,
        fontFamily: "Inter", fontSize: 14, fontWeight: 400,
        color: disabled ? "#A1A1AA" : "#0A0A0A",
        borderRadius: 0, outline: "none",
        ...style
      }}
    />
  );
}

// ---------- Chip -----------------------------------------------------------
function Chip({ variant = "default", selected, children, onClick }) {
  const styles = {
    default:  { background: "transparent", color: "#71717A", border: "1px solid #D4D4D8" },
    selected: { background: "#0A0A0A", color: "#FAFAFA", border: "1px solid #0A0A0A" },
    featured: { background: "transparent", color: "#0A0A0A", border: "1px solid #0A0A0A" },
    published:{ background: "#0A0A0A", color: "#FAFAFA", border: "1px solid #0A0A0A" }
  };
  const v = selected ? styles.selected : styles[variant];
  return (
    <button onClick={onClick} style={{
      fontFamily: "Inter", fontWeight: 400, fontSize: 12, textTransform: "uppercase",
      letterSpacing: "0.05em", padding: "0 14px", height: 28,
      display: "inline-flex", alignItems: "center", borderRadius: 0, cursor: "pointer",
      ...v
    }}>{children}</button>
  );
}

// ---------- Divider / Eyebrow ---------------------------------------------
function Eyebrow({ children, style = {} }) {
  return <div style={{
    fontFamily: "Inter", fontSize: 11, fontWeight: 500, letterSpacing: "0.14em",
    textTransform: "uppercase", color: "#71717A", ...style
  }}>{children}</div>;
}

function Mono({ children, style = {} }) {
  return <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#71717A", ...style }}>{children}</span>;
}

// ---------- Image placeholder ---------------------------------------------
// A flat geometric placeholder. Different `seed` integers produce distinct
// looking abstract monochrome compositions, so a gallery has variety without
// any actual photography in the design system.
function PhotoTile({ seed = 0, ratio = "4 / 5", style = {} }) {
  const gradients = [
    "linear-gradient(140deg, #1a1a1a 0%, #555 100%)",
    "linear-gradient(160deg, #c8c8c8 0%, #8a8a8a 100%)",
    "linear-gradient(180deg, #2a2a2a 0%, #2a2a2a 55%, #b8b8b8 55%, #b8b8b8 100%)",
    "linear-gradient(120deg, #0a0a0a 0%, #2a2a2a 60%, #777 100%)",
    "linear-gradient(200deg, #e5e5e5 0%, #777 100%)",
    "linear-gradient(135deg, #1a1a1a 0%, #1a1a1a 40%, #999 40%, #999 100%)",
    "linear-gradient(150deg, #3a3a3a 0%, #1a1a1a 100%)",
    "linear-gradient(170deg, #b8b8b8 0%, #4a4a4a 100%)",
    "radial-gradient(circle at 30% 30%, #ddd 0%, #4a4a4a 70%)",
    "linear-gradient(115deg, #0a0a0a 0%, #0a0a0a 35%, #5a5a5a 35%, #5a5a5a 65%, #c0c0c0 65%, #c0c0c0 100%)",
    "linear-gradient(180deg, #1a1a1a 0%, #4a4a4a 50%, #1a1a1a 100%)",
    "linear-gradient(135deg, #6a6a6a 0%, #1a1a1a 100%)"
  ];
  return (
    <div style={{
      aspectRatio: ratio, width: "100%", background: gradients[seed % gradients.length],
      ...style
    }} />
  );
}

Object.assign(window, { Button, Input, Chip, Eyebrow, Mono, PhotoTile });
