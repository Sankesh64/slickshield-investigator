# SlickShield Investigator — Execution Plan

## Product intent

Build a defensible oil-spill attribution investigation workspace. The system combines satellite observation, environmental drift modelling, and AIS evidence to generate and stress-test **candidate vessel hypotheses**. It must communicate evidence strength and uncertainty rather than claim legal responsibility or causation.

## MVP success criteria

The first release is successful when an investigator can open one locked case, inspect the detected slick and origin uncertainty on a map, see AIS vessels intersecting the attribution corridor, compare ForwardCheck and RankGuard evidence, and request an explanation that is grounded only in structured evidence.

## Phase 0 — Lock one compatible event

1. Select one real Sentinel-1 GRD VV scene and record its acquisition time, bounding box, and source URL.
2. Prepare or verify an oil/non-oil mask and document the detection confidence.
3. Fetch matching ERA5 wind and ocean-current forcing for the same spatial and temporal window.
4. Obtain matching AIS tracks, clearly labeling any synthetic or coverage-limited data.
5. Create a `case_001` manifest that records source, timestamp, CRS, resolution, license, and data-quality limitations.

## Phase 1 — Build the scientific and API skeleton

1. Keep the frontend and scientific engine separate.
2. Implement FastAPI endpoints for detection, drift, corridor, ForwardCheck, RankGuard, and evidence explanation.
3. Store normalized geospatial outputs in PostGIS: slick geometry, origin ensemble, corridor, AIS tracks, and candidate scores.
4. Use GeoJSON as the frontend interchange format.

## Phase 2 — Make the map work first

1. Render the case region, satellite footprint, slick polygon, origin uncertainty, corridor, vessel tracks, and ForwardCheck prediction.
2. Add layer toggles and a map legend.
3. Add vessel selection so the evidence panel and metrics update from the selected candidate.
4. Verify the map at desktop and mobile breakpoints before integrating AI assistance.

## Phase 3 — Add detection and drift

1. Implement or integrate SlickShield detection for the locked Sentinel-1 scene.
2. Calculate slick area, centroid, boundary, orientation, and confidence.
3. Seed particles from the detected slick and run backward drift with documented wind/current readers.
4. Produce an ensemble-derived origin region and release-time window instead of a single exact point.

## Phase 4 — Add AIS attribution logic

1. Normalize MMSI, timestamp, latitude, longitude, SOG, COG, and vessel metadata.
2. Filter tracks by origin region and release-time window.
3. Build the Attribution Corridor from origin uncertainty plus AIS coverage.
4. Rank candidates with interpretable component scores: spatial, temporal, trajectory, data quality, and coverage.

## Phase 5 — Add ForwardCheck and RankGuard

1. For each top candidate, simulate possible release positions and times forward through the same environmental forcing.
2. Compare the predicted footprint to the observed slick and report a ForwardCheck consistency score.
3. Perturb evidence weights in a reproducible 100-run RankGuard evaluation.
4. Report Top-3 stability and keep it separate from any claim of guilt or probability.

## Phase 6 — Add the evidence assistant

1. Pass only structured, verified evidence JSON to the assistant.
2. Require the assistant to explain observations, candidate selection, ForwardCheck, RankGuard, uncertainty, and limitations.
3. Prohibit invented vessel movements, inferred missing records, or language that turns evidence scores into guilt probabilities.
4. Keep explanation generation after the scientific pipeline, never inside it.

## Phase 7 — Production hardening

1. Replace simulated case values in the prototype with the locked event manifest.
2. Add loading, empty, and failure states for each API stage.
3. Add reproducible scientific fixtures and API contract tests.
4. Add access controls, audit logging, data retention rules, and source licensing review before handling sensitive investigations.
5. Deploy frontend, FastAPI service, PostGIS, and worker processes separately with monitored job status.

## Current prototype delivered

The current frontend demonstrates the final investigation workspace using clearly labeled simulated `CASE-001` data. It includes:

- Pipeline health for Detection, Backward drift, Corridor, ForwardCheck, and RankGuard.
- Slick, origin ensemble, corridor, AIS, and ForwardCheck map layers with interactive toggles.
- Candidate vessel ranking with spatial/temporal compatibility, ForwardCheck, and RankGuard stability.
- Candidate detail panel with evidence strength bars, timeline, and stability chart.
- Evidence-grounded investigation summary modal.
- Evidence assistant modal that uses candidate metrics and includes scientific limitations.
- Responsive layout for desktop and mobile.

## Recommended next engineering task

Complete **Phase 0** before wiring live APIs: lock one event and publish the manifest. The scientific and UI integration should be validated against that single case before adding more scenes, global coverage, or real-time AIS.
