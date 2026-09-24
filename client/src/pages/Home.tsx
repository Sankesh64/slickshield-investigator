import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BrainCircuit,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  CircleUserRound,
  Crosshair,
  Database,
  Download,
  FileText,
  Filter,
  Gauge,
  Globe2,
  Layers3,
  MapPinned,
  Maximize2,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  Navigation,
  PanelRight,
  Play,
  Radio,
  RefreshCw,
  Satellite,
  Search,
  Settings2,
  ShieldCheck,
  ShipWheel,
  SlidersHorizontal,
  Sparkles,
  Target,
  Timer,
  TriangleAlert,
  Waves,
  Wind,
  X,
  Zap,
} from "lucide-react";

type Candidate = {
  name: string;
  mmsi: string;
  type: string;
  color: string;
  initials: string;
  priority: string;
  priorityLabel: string;
  spatial: number;
  temporal: number;
  forward: number;
  stability: number;
  coverage: number;
  track: string;
};

type LayerState = {
  satellite: boolean;
  oil: boolean;
  origin: boolean;
  corridor: boolean;
  ais: boolean;
  forward: boolean;
};

const candidates: Candidate[] = [
  {
    name: "MT Ocean Crest",
    mmsi: "636019842",
    type: "Product tanker",
    color: "#b5ed60",
    initials: "OC",
    priority: "High",
    priorityLabel: "Priority 01",
    spatial: 87,
    temporal: 91,
    forward: 82,
    stability: 94,
    coverage: 87,
    track: "Track intersects origin window",
  },
  {
    name: "MV Blue Meridian",
    mmsi: "311000728",
    type: "Bulk carrier",
    color: "#f1b65c",
    initials: "BM",
    priority: "Medium",
    priorityLabel: "Priority 02",
    spatial: 76,
    temporal: 83,
    forward: 61,
    stability: 81,
    coverage: 79,
    track: "Track clips corridor edge",
  },
  {
    name: "SS Kestrel",
    mmsi: "477038100",
    type: "Container vessel",
    color: "#7fb9ff",
    initials: "SK",
    priority: "Watch",
    priorityLabel: "Priority 03",
    spatial: 64,
    temporal: 72,
    forward: 38,
    stability: 63,
    coverage: 91,
    track: "Low forward consistency",
  },
];

const phases = [
  { label: "Detection", detail: "SlickShield mask", status: "complete", icon: SatelliteGlyph },
  { label: "Backward drift", detail: "Origin ensemble", status: "complete", icon: RefreshCw },
  { label: "Corridor", detail: "3 vessels intersect", status: "complete", icon: Crosshair },
  { label: "ForwardCheck", detail: "Physics validation", status: "complete", icon: Waves },
  { label: "RankGuard", detail: "100 perturbations", status: "complete", icon: ShieldCheck },
];

function SatelliteGlyph({ size = 15 }: { size?: number }) {
  return <Satellite size={size} />;
}

function Metric({ label, value, tone = "lime", suffix = "%" }: { label: string; value: number; tone?: string; suffix?: string }) {
  return (
    <div className="metric">
      <div className="metric-head"><span>{label}</span><b className={`tone-${tone}`}>{value}{suffix}</b></div>
      <div className="metric-bar"><span className={`bar-${tone}`} style={{ width: `${value}%` }} /></div>
    </div>
  );
}

function MapPanel({ selected, layers, setLayers }: { selected: Candidate; layers: LayerState; setLayers: React.Dispatch<React.SetStateAction<LayerState>> }) {
  return (
    <section className="map-card">
      <div className="map-toolbar">
        <div className="map-tabs">
          <button className="map-tab active"><MapPinned size={14} /> Investigation map</button>
          <button className="map-tab"><Satellite size={14} /> SAR preview</button>
        </div>
        <div className="map-toolbar-actions">
          <button className="icon-button" aria-label="Map search"><Search size={15} /></button>
          <button className="icon-button" aria-label="Map settings"><SlidersHorizontal size={15} /></button>
          <button className="icon-button" aria-label="Fullscreen"><Maximize2 size={15} /></button>
        </div>
      </div>
      <div className="map-viewport">
        <div className="map-grid" />
        <div className="map-noise" />
        <div className="map-compass"><span>N</span><div className="compass-arrow">↑</div></div>
        <div className="map-coordinates">18°14' N<br />72°48' E</div>
        <div className="sea-label label-1">ARABIAN SEA</div>
        <div className="sea-label label-2">MUMBAI OFFSHORE</div>
        <div className="coastline c1" /><div className="coastline c2" /><div className="coastline c3" />

        {layers.satellite && <div className="satellite-footprint"><span>S1 / GRD VV</span></div>}
        {layers.origin && <div className="origin-halo halo-outer"><div className="halo-inner" /><span className="origin-label">ORIGIN ENSEMBLE · 18.21°N 72.78°E</span></div>}
        {layers.corridor && <div className="corridor-shape"><span>ATTRIBUTION CORRIDOR</span></div>}
        {layers.oil && <div className="slick-shape"><div className="slick-core" /><span className="slick-label">DETECTED SLICK<br /><b>4.8 km²</b></span></div>}
        {layers.forward && <div className="forward-prediction"><div className="prediction-path" /><span>FORWARD PREDICTION</span></div>}

        {layers.ais && <>
          <div className="vessel-track track-a"><span className="vessel-dot" /><span className="track-caption">MT Ocean Crest</span></div>
          <div className="vessel-track track-b"><span className="vessel-dot amber" /><span className="track-caption">MV Blue Meridian</span></div>
          <div className="vessel-track track-c"><span className="vessel-dot blue" /><span className="track-caption">SS Kestrel</span></div>
        </>}

        <div className="map-legend">
          <div><i className="legend-dot lime" /> Detected oil</div>
          <div><i className="legend-dot amber" /> Origin uncertainty</div>
          <div><i className="legend-line" /> AIS track</div>
        </div>
        <div className="map-scale"><span>0</span><span>10 km</span><div className="scale-line" /></div>
        <div className="map-status"><span className="live-dot" /> Layers synced <b>12:42:08 UTC</b></div>
      </div>
      <div className="layer-strip">
        <div className="layer-title"><Layers3 size={14} /> Layers</div>
        {([{ key: "satellite", label: "Satellite" }, { key: "oil", label: "Oil mask" }, { key: "origin", label: "Origin" }, { key: "corridor", label: "Corridor" }, { key: "ais", label: "AIS tracks" }, { key: "forward", label: "ForwardCheck" }] as { key: keyof LayerState; label: string }[]).map((layer) => (
          <button key={layer.key} className={`layer-toggle ${layers[layer.key] ? "on" : ""}`} onClick={() => setLayers((current) => ({ ...current, [layer.key]: !current[layer.key] }))}>
            <span className="layer-check">{layers[layer.key] ? <Check size={11} /> : null}</span>{layer.label}
          </button>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [selectedId, setSelectedId] = useState(candidates[0].mmsi);
  const [layers, setLayers] = useState({ satellite: true, oil: true, origin: true, corridor: true, ais: true, forward: true });
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const selected = useMemo(() => candidates.find((candidate) => candidate.mmsi === selectedId) ?? candidates[0], [selectedId]);

  const announce = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block"><div className="brand-mark"><div className="brand-wave" /></div><div><div className="brand-name">Slick<span>Shield</span></div><div className="brand-kicker">Ocean intelligence / v0.1</div></div></div>
        <div className="topbar-center"><span className="status-pulse" /> All systems nominal <span className="topbar-divider" /> Data window <b>14 NOV 2025 · 04:00–12:00 UTC</b></div>
        <div className="topbar-actions"><button className="top-action" onClick={() => announce("Export package queued for CASE-001") }><Download size={15} /> Export</button><button className="avatar"><CircleUserRound size={18} /></button></div>
      </header>

      <div className="workspace">
        <aside className="sidebar">
          <div className="case-heading"><div><div className="eyebrow">Active investigation</div><h1>Case 001</h1></div><button className="more-button"><MoreHorizontal size={18} /></button></div>
          <div className="case-meta"><span className="case-status"><span className="status-dot" /> In review</span><span>Updated 8m ago</span></div>

          <div className="case-select"><div className="case-icon"><AlertTriangle size={16} /></div><div><span className="tiny-label">CASE FILE</span><b>MH-2025-001</b></div><ChevronDown size={15} /></div>

          <div className="sidebar-section"><div className="section-label">Pipeline health <span>5 / 5</span></div><div className="phase-list">{phases.map((phase) => { const Icon = phase.icon; return <div className="phase-row" key={phase.label}><div className="phase-icon"><Icon size={14} /></div><div className="phase-copy"><b>{phase.label}</b><span>{phase.detail}</span></div><div className="phase-check"><Check size={12} /></div></div>; })}</div></div>

          <div className="sidebar-section case-facts"><div className="section-label">Case facts <button onClick={() => announce("Fact sheet is read-only in the prototype")}><MoreHorizontal size={15} /></button></div><div className="fact-grid"><div><span>Location</span><b>18.2°N, 72.8°E</b></div><div><span>Observation</span><b>Sentinel-1 / VV</b></div><div><span>Slick area</span><b>4.8 km²</b></div><div><span>Confidence</span><b className="tone-lime">91%</b></div></div></div>

          <div className="sidebar-foot"><button className="sidebar-link" onClick={() => announce("Data sources panel opened") }><Database size={15} /> Data sources <ArrowUpRight size={13} /></button><button className="sidebar-link" onClick={() => announce("Model settings are locked for CASE-001") }><Settings2 size={15} /> Model settings <ArrowUpRight size={13} /></button><div className="version-line">OID ENGINE <b>BUILD 0.4.18</b></div></div>
        </aside>

        <main className="main-canvas">
          <div className="main-heading"><div><div className="eyebrow">INVESTIGATION WORKSPACE <span className="mono">/ CASE-001</span></div><h2>Satellite-to-vessel attribution</h2><p>Generate and stress-test candidate hypotheses from observable evidence.</p></div><div className="heading-actions"><button className="ghost-action" onClick={() => setFilterOpen((value) => !value)}><Filter size={15} /> Filters</button><button className="primary-action" onClick={() => { setSummaryOpen(true); announce("Investigation summary generated from structured evidence"); }}><Sparkles size={15} /> Generate summary</button></div></div>
          {filterOpen && <div className="filter-bar"><span className="filter-title"><SlidersHorizontal size={14} /> Showing candidates with corridor overlap</span><button onClick={() => announce("Filter set to spatial + temporal compatibility")}>Spatial + temporal <ChevronDown size={13} /></button><button onClick={() => setFilterOpen(false)}><X size={14} /></button></div>}

          <div className="stat-row"><div className="stat-card"><div className="stat-top"><span>Detected slick</span><Satellite size={15} /></div><div className="stat-value">4.8 <small>km²</small></div><div className="stat-foot"><span className="trend-up"><ArrowUpRight size={12} /> 0.6 km²</span> vs last mask pass</div></div><div className="stat-card"><div className="stat-top"><span>Origin window</span><Target size={15} /></div><div className="stat-value">08:00 <small>UTC</small></div><div className="stat-foot"><span className="tone-amber">± 2.4 hrs</span> ensemble uncertainty</div></div><div className="stat-card"><div className="stat-top"><span>Corridor vessels</span><ShipWheel size={15} /></div><div className="stat-value">03 <small>tracks</small></div><div className="stat-foot"><span className="trend-up"><ArrowUpRight size={12} /> 2 high-coverage</span> AIS evidence</div></div><div className="stat-card"><div className="stat-top"><span>Top-3 stability</span><Gauge size={15} /></div><div className="stat-value">94 <small>%</small></div><div className="stat-foot"><span className="trend-up"><ArrowUpRight size={12} /> stable</span> across 100 runs</div></div></div>

          <MapPanel selected={selected} layers={layers} setLayers={setLayers} />

          <section className="evidence-section"><div className="section-heading"><div><div className="eyebrow">EVIDENCE RANKING</div><h3>Candidate vessels</h3></div><div className="evidence-actions"><span className="table-note"><span className="live-dot" /> 3 candidates in corridor</span><button className="icon-button"><MoreHorizontal size={16} /></button></div></div><div className="candidate-table"><div className="table-header"><span>Candidate</span><span>Spatial / temporal</span><span>ForwardCheck</span><span>RankGuard</span><span>Priority</span><span /></div>{candidates.map((candidate, index) => <button className={`candidate-row ${selectedId === candidate.mmsi ? "selected" : ""}`} key={candidate.mmsi} onClick={() => setSelectedId(candidate.mmsi)}><div className="candidate-name"><div className="vessel-avatar" style={{ background: `${candidate.color}18`, color: candidate.color, borderColor: `${candidate.color}45` }}>{candidate.initials}</div><div><b>{candidate.name}</b><span>{candidate.type} · {candidate.mmsi}</span></div></div><div className="table-metrics"><div><span className="metric-number">{candidate.spatial}%</span><span className="mini-bar"><i style={{ width: `${candidate.spatial}%`, background: candidate.color }} /></span></div><div><span className="metric-number">{candidate.temporal}%</span><span className="mini-bar"><i style={{ width: `${candidate.temporal}%`, background: candidate.color }} /></span></div></div><div className="forward-cell"><span className={`score-pill ${candidate.forward > 75 ? "good" : candidate.forward > 50 ? "mid" : "low"}`}>{candidate.forward}%</span><span>{candidate.track}</span></div><div className="stability-cell"><span>{candidate.stability}%</span><div className="stability-dots">{Array.from({ length: 10 }).map((_, dotIndex) => <i key={dotIndex} className={dotIndex < Math.round(candidate.stability / 10) ? "filled" : ""} />)}</div></div><div><span className={`priority-tag ${index === 0 ? "priority-high" : index === 1 ? "priority-mid" : "priority-watch"}`}>{candidate.priority}</span></div><div className="row-chevron"><ArrowUpRight size={15} /></div></button>)}</div></section>

          <div className="disclaimer"><TriangleAlert size={15} /><div><b>Investigative intelligence, not a legal determination.</b> Results describe evidence strength and model consistency. They do not establish causation, fault, or probability of guilt.</div><button onClick={() => announce("Methodology reference opened")}>Methodology <ArrowUpRight size={13} /></button></div>
        </main>

        <aside className="evidence-panel">
          <div className="panel-heading"><div><div className="eyebrow">SELECTED CANDIDATE</div><h3>{selected.name}</h3><span className="panel-subtitle">{selected.type} · MMSI {selected.mmsi}</span></div><button className="panel-close" onClick={() => announce("Candidate detail remains pinned for comparison")}><PanelRight size={16} /></button></div>
          <div className="candidate-hero"><div className="hero-ring"><div className="hero-initials">{selected.initials}</div></div><div><span className="tiny-label">INVESTIGATION PRIORITY</span><div className="hero-priority">{selected.priorityLabel} <span className="priority-badge">{selected.forward}% forward</span></div></div></div>
          <div className="assistant-note"><div className="note-icon"><BrainCircuit size={16} /></div><div><span className="tiny-label">ASSISTANT READOUT</span><p>{selected.name} remains a {selected.priority.toLowerCase()}-priority candidate because its track overlaps the estimated origin corridor and its forward-drift footprint is {selected.forward > 75 ? "consistent" : "partially consistent"} with the observed slick.</p><button onClick={() => setAssistantOpen(true)}>Why is this candidate here? <ArrowUpRight size={13} /></button></div></div>
          <div className="panel-section"><div className="section-label">Evidence strength <CircleHelp size={14} /></div><Metric label="Spatial compatibility" value={selected.spatial} /><Metric label="Temporal compatibility" value={selected.temporal} tone="amber" /><Metric label="Forward consistency" value={selected.forward} tone={selected.forward > 75 ? "lime" : "amber"} /><Metric label="AIS coverage" value={selected.coverage} tone="blue" /></div>
          <div className="panel-section"><div className="section-label">RankGuard stability <span className="section-value">{selected.stability}/100</span></div><div className="rankguard-chart"><div className="chart-grid-lines"><i /><i /><i /></div><svg viewBox="0 0 300 72" preserveAspectRatio="none" aria-label="RankGuard stability chart"><path d="M0 57 C18 52 28 48 42 50 S65 32 78 40 S102 26 117 36 S133 21 149 31 S172 16 187 26 S203 14 219 23 S243 10 258 17 S281 7 300 10" fill="none" stroke="#b5ed60" strokeWidth="2.5" /><path d="M0 72 L0 57 C18 52 28 48 42 50 S65 32 78 40 S102 26 117 36 S133 21 149 31 S172 16 187 26 S203 14 219 23 S243 10 258 17 S281 7 300 10 L300 72 Z" fill="url(#chartFill)" opacity=".3" /><defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b5ed60" /><stop offset="1" stopColor="#b5ed60" stopOpacity="0" /></linearGradient></defs></svg></div><div className="chart-foot"><span>0 runs</span><span>100 perturbations</span></div></div>
          <div className="panel-section timeline"><div className="section-label">Evidence timeline</div><div className="timeline-row"><div className="timeline-marker complete"><Satellite size={12} /></div><div><b>Satellite observation</b><span>14 Nov · 10:20 UTC</span></div></div><div className="timeline-row"><div className="timeline-marker"><Wind size={12} /></div><div><b>Origin ensemble resolved</b><span>14 Nov · 10:58 UTC</span></div></div><div className="timeline-row"><div className="timeline-marker"><ShipWheel size={12} /></div><div><b>Track intersection found</b><span>14 Nov · 11:14 UTC</span></div></div><div className="timeline-row"><div className="timeline-marker"><Zap size={12} /></div><div><b>ForwardCheck complete</b><span>14 Nov · 11:26 UTC</span></div></div></div>
          <button className="panel-primary" onClick={() => setAssistantOpen(true)}><MessageSquareText size={16} /> Explain with evidence assistant</button>
          <div className="panel-footer"><span><Timer size={13} /> 2m 14s analysis runtime</span><span><Database size={13} /> 4 sources</span></div>
        </aside>
      </div>

      {summaryOpen && <div className="modal-backdrop" onClick={() => setSummaryOpen(false)}><div className="modal-card summary-modal" onClick={(event) => event.stopPropagation()}><div className="modal-top"><div><div className="eyebrow">STRUCTURED EVIDENCE → EXPLANATION</div><h3>Investigation summary</h3></div><button className="panel-close" onClick={() => setSummaryOpen(false)}><X size={17} /></button></div><div className="summary-lead"><Sparkles size={18} /><p>The system detected a <b>4.8 km²</b> slick off Mumbai on Sentinel-1 GRD VV imagery. Backward drift places the potential origin within an ensemble region centered at <b>18.21°N, 72.78°E</b>, with a <b>±2.4 hour</b> release-time uncertainty.</p></div><div className="summary-grid"><div><span className="tiny-label">CORRIDOR</span><b>3 vessel tracks intersect</b></div><div><span className="tiny-label">TOP CANDIDATE</span><b>MT Ocean Crest · {candidates[0].forward}% ForwardCheck</b></div><div><span className="tiny-label">RANKGUARD</span><b>{candidates[0].stability}% top-3 stability</b></div><div><span className="tiny-label">LIMITATION</span><b>Coverage varies by AIS source</b></div></div><p className="modal-disclaimer">This summary reports candidate evidence and model consistency only. It does not identify a responsible party or establish causation.</p><button className="primary-action modal-action" onClick={() => { setSummaryOpen(false); announce("Summary copied to export package"); }}><FileText size={15} /> Add to case brief</button></div></div>}
      {assistantOpen && <div className="modal-backdrop" onClick={() => setAssistantOpen(false)}><div className="modal-card assistant-modal" onClick={(event) => event.stopPropagation()}><div className="modal-top"><div><div className="eyebrow">EVIDENCE ASSISTANT</div><h3>Why {selected.name} appears</h3></div><button className="panel-close" onClick={() => setAssistantOpen(false)}><X size={17} /></button></div><div className="assistant-answer"><div className="answer-mark"><BrainCircuit size={20} /></div><p>{selected.name} is ranked as <b>{selected.priority.toLowerCase()} priority</b> based on the supplied evidence, not a finding of responsibility. Its AIS track shows <b>{selected.spatial}% spatial compatibility</b> with the origin corridor and <b>{selected.temporal}% temporal compatibility</b> with the release window. ForwardCheck produced a <b>{selected.forward}% consistency score</b>, while RankGuard kept it in the top three across <b>{selected.stability}%</b> of controlled perturbations.</p></div><div className="answer-list"><div><Check size={14} /> Evidence is sourced from the case manifest</div><div><Check size={14} /> No missing AIS records are inferred</div><div><TriangleAlert size={14} /> Score is not probability of guilt</div></div><button className="ghost-action full-width" onClick={() => setAssistantOpen(false)}>Close explanation</button></div></div>}
      {notice && <div className="toast"><Check size={15} /> {notice}</div>}
    </div>
  );
}
