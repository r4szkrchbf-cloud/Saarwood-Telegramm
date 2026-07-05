import { useCallback, useId } from 'react';
import { usePrompterStore } from '../../store/prompterStore';
import { speechService } from '../../services/SpeechRecognitionService';
import type { PresenterProfile } from '../../types';
import './SettingsPanel.css';

interface SettingsPanelProps {
  onClose: () => void;
}

/**
 * SettingsPanel
 *
 * Presenter preferences and display configuration.
 * All changes are persisted to localStorage via Zustand's persist middleware.
 */
export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const display = usePrompterStore((s) => s.display);
  const profiles = usePrompterStore((s) => s.profiles);
  const activeProfileId = usePrompterStore((s) => s.activeProfileId);
  const tier = usePrompterStore((s) => s.tier);
  const setDisplay = usePrompterStore((s) => s.setDisplay);
  const speechEnabled = usePrompterStore((s) => s.speechEnabled);
  const setSpeechEnabled = usePrompterStore((s) => s.setSpeechEnabled);
  const saveProfile = usePrompterStore((s) => s.saveProfile);
  const deleteProfile = usePrompterStore((s) => s.deleteProfile);
  const applyProfile = usePrompterStore((s) => s.applyProfile);
  const setTier = usePrompterStore((s) => s.setTier);

  const fontSizeId = useId();
  const fontFamilyId = useId();
  const lineHeightId = useId();
  const textColorId = useId();
  const bgColorId = useId();
  const textAlignId = useId();
  const cuePositionId = useId();
  const profileNameId = useId();

  const handleSaveProfile = useCallback(() => {
    const nameInput = document.getElementById(profileNameId) as HTMLInputElement | null;
    const name = nameInput?.value.trim();
    if (!name) return;
    const profile: PresenterProfile = {
      id: `profile-${Date.now()}`,
      name,
      displaySettings: { ...display },
    };
    saveProfile(profile);
    if (nameInput) nameInput.value = '';
  }, [display, saveProfile, profileNameId]);

  return (
    <div className="settings-panel" role="complementary" aria-label="Display settings">
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
        <button
          type="button"
          className="settings-close-btn"
          onClick={onClose}
          aria-label="Close settings"
          title="Close settings"
        >
          Close
        </button>
      </div>

      {/* ─── Tier selector ─────────────────────────────────────────────── */}
      <fieldset className="settings-group">
        <legend>Tier</legend>
        <div className="tier-radio-group" role="radiogroup" aria-label="Application tier">
          {(['basic', 'professional', 'expert'] as const).map((t) => (
            <label key={t} className={`tier-label ${tier === t ? 'active' : ''}`}>
              <input
                type="radio"
                name="tier"
                value={t}
                checked={tier === t}
                onChange={() => setTier(t)}
              />
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </label>
          ))}
        </div>
      </fieldset>

      {/* ─── Display ───────────────────────────────────────────────────── */}
      <fieldset className="settings-group">
        <legend>Display</legend>

        <div className="settings-row">
          <label htmlFor={fontSizeId}>Font size</label>
          <input
            id={fontSizeId}
            type="range"
            min={16}
            max={120}
            step={2}
            value={display.fontSize}
            onChange={(e) => setDisplay({ fontSize: Number(e.target.value) })}
          />
          <span className="settings-value">{display.fontSize}px</span>
        </div>

        <div className="settings-row">
          <label htmlFor={fontFamilyId}>Font family</label>
          <select
            id={fontFamilyId}
            value={display.fontFamily}
            onChange={(e) => setDisplay({ fontFamily: e.target.value })}
          >
            <option value="sans-serif">Sans-serif</option>
            <option value="serif">Serif</option>
            <option value="Arial, sans-serif">Arial</option>
            <option value="'Courier New', monospace">Courier New</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
          </select>
        </div>

        <div className="settings-row">
          <label htmlFor={lineHeightId}>Line height</label>
          <input
            id={lineHeightId}
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={display.lineHeight}
            onChange={(e) => setDisplay({ lineHeight: Number(e.target.value) })}
          />
          <span className="settings-value">
            {display.lineHeight.toFixed(1)}×
          </span>
        </div>

        <div className="settings-row">
          <label htmlFor={textColorId}>Text color</label>
          <input
            id={textColorId}
            type="color"
            value={display.textColor}
            onChange={(e) => setDisplay({ textColor: e.target.value })}
          />
        </div>

        <div className="settings-row">
          <label htmlFor={bgColorId}>Background</label>
          <input
            id={bgColorId}
            type="color"
            value={display.backgroundColor}
            onChange={(e) => setDisplay({ backgroundColor: e.target.value })}
          />
        </div>

        <div className="settings-row">
          <label htmlFor={textAlignId}>Text align</label>
          <select
            id={textAlignId}
            value={display.textAlign}
            onChange={(e) =>
              setDisplay({
                textAlign: e.target.value as 'left' | 'center' | 'right',
              })
            }
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>

        <div className="settings-row">
          <label>
            <input
              type="checkbox"
              checked={display.darkMode}
              onChange={(e) => setDisplay({ darkMode: e.target.checked })}
            />
            Dark mode (Director UI)
          </label>
        </div>

        <div className="settings-row">
          <label>
            <input
              type="checkbox"
              checked={display.cueMarkerEnabled}
              onChange={(e) =>
                setDisplay({ cueMarkerEnabled: e.target.checked })
              }
            />
            Cue marker
          </label>
        </div>

        {display.cueMarkerEnabled && (
          <div className="settings-row">
            <label htmlFor={cuePositionId}>Cue position</label>
            <input
              id={cuePositionId}
              type="range"
              min={5}
              max={80}
              step={1}
              value={display.cueMarkerPosition}
              onChange={(e) =>
                setDisplay({ cueMarkerPosition: Number(e.target.value) })
              }
            />
            <span className="settings-value">{display.cueMarkerPosition}%</span>
          </div>
        )}

        {speechService.isSupported && (
          <div className="settings-row">
            <label>
              <input
                type="checkbox"
                checked={speechEnabled}
                onChange={(e) => setSpeechEnabled(e.target.checked)}
              />
              Voice tracking
            </label>
          </div>
        )}

        {!speechService.isSupported && (
          <div className="settings-row">
            <span className="settings-value">
              Voice tracking is not available in this browser because the Web Speech API is not supported.
            </span>
          </div>
        )}
      </fieldset>

      {/* ─── Presenter Profiles (Professional+) ──────────────────────── */}
      {tier !== 'basic' && (
        <fieldset className="settings-group">
          <legend>Presenter Profiles</legend>

          <div className="settings-row">
            <label htmlFor={profileNameId}>New profile name</label>
            <input
              id={profileNameId}
              type="text"
              placeholder="e.g. John Doe"
              className="profile-name-input"
            />
            <button type="button" className="btn-small" onClick={handleSaveProfile}>
              Save current settings
            </button>
          </div>

          <ul className="profile-list" aria-label="Saved presenter profiles">
            {profiles.map((p) => (
              <li
                key={p.id}
                className={`profile-item ${activeProfileId === p.id ? 'active' : ''}`}
              >
                <span className="profile-name">{p.name}</span>
                <button
                  type="button"
                  className="btn-small"
                  onClick={() => applyProfile(p.id)}
                  aria-label={`Apply profile ${p.name}`}
                >
                  Apply
                </button>
                <button
                  type="button"
                  className="btn-small btn-small--danger"
                  onClick={() => deleteProfile(p.id)}
                  aria-label={`Delete profile ${p.name}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </fieldset>
      )}
    </div>
  );
}
