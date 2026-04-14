import { ALPHA_PRESETS } from "../../utils/input/sliderMap.js";
import SliderScaleTooltip from "../input/SliderScaleTooltip.jsx";

export default function Slider({ setAlpha, alpha, isLoading = false }) {
  const selectedPresetIndex = Math.max(
    0,
    ALPHA_PRESETS.findIndex((preset) => preset.alpha === alpha)
  );

  return (
    <div className="controls">
      <div className="controls-alpha">
        <div className="alpha-intro">
          <div className="alpha-intro-row">
            <span className="alpha-intro-label">
              Liuguri muutmine mõjutab seda, kui ebatüüpilisi tulemusi
              kuvatakse. {" "}
                <SliderScaleTooltip />
            </span>
          </div>
        </div>

        <div className="controls-alpha-slider">
          <div className="controls-alpha-range">
            <span className="controls-alpha-endpoint">
              Kuva ainult kõige ebatüüpilisemad järjestused
            </span>
            <div className="controls-alpha-track-group">
              <input
                type="range"
                min="0"
                max={ALPHA_PRESETS.length - 1}
                step="1"
                value={selectedPresetIndex}
                onChange={(e) => {
                  const nextPreset = ALPHA_PRESETS[Number(e.target.value)];
                  if (nextPreset) setAlpha(nextPreset.alpha);
                }}
                className="controls-alpha-input"
                disabled={isLoading}
                aria-label="Tundlikkuse valik"
                list="alpha-markers"
              />
              <datalist id="alpha-markers">
                {ALPHA_PRESETS.map((_, index) => (
                  <option key={index} value={index} />
                ))}
              </datalist>

              <div className="controls-alpha-scale">
                {ALPHA_PRESETS.map((preset, index) => (
                  <button
                    key={preset.alpha}
                    type="button"
                    style={{
                      left: `${(index / (ALPHA_PRESETS.length - 1)) * 100}%`,
                    }}
                    onClick={() => setAlpha(preset.alpha)}
                    className={`controls-alpha-scale-label ${
                      index === selectedPresetIndex
                        ? "controls-alpha-scale-label--active"
                        : ""
                    }`}
                    disabled={isLoading}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
            <span className="controls-alpha-endpoint controls-alpha-endpoint-right">
              Kuva rohkem võimalikke ebatüüpilisi järjestusi
            </span>
          </div>
        </div>
        <div className="alpha-apply-note">
          Muudatuse rakendamiseks vajuta uuesti Analüüsi nuppu.
        </div>
      </div>
    </div>
  );
}
