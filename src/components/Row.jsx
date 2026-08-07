import { S } from "../styles.js";

export default function Row({ label, value }) {
  return (
    <div style={S.row}>
      <div style={S.rowLabel}>{label}</div>
      <div style={S.rowValue}>{value}</div>
    </div>
  );
}
