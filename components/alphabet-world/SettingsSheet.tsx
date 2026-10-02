import { useState } from "react";
import type { Dict } from "./i18n";
import {
  BYOK_PRESETS,
  saveByok,
  type ByokConfig,
  type ByokProviderId,
} from "./byok";
import { apiTestKey } from "./api";
import type { ApiFormat } from "./byok";

export function SettingsSheet({
  s,
  current,
  onSave,
  onClear,
}: {
  s: Dict;
  current: ByokConfig | null;
  onSave: (cfg: ByokConfig) => void;
  onClear: () => void;
}) {
  const initial = current ?? {
    provider: "deepseek" as ByokProviderId,
    apiKey: "",
    model: "",
  };
  const [provider, setProvider] = useState<ByokProviderId>(initial.provider);
  const [apiKey, setApiKey] = useState(initial.apiKey);
  const [model, setModel] = useState(initial.model ?? "");
  const [baseUrl, setBaseUrl] = useState(initial.baseUrl ?? "");
  const [format, setFormat] = useState<ApiFormat>(initial.format ?? "openai");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testOk, setTestOk] = useState<boolean | null>(null);
  const preset = BYOK_PRESETS[provider];

  // برای سفارشی فقط آدرس لازم است؛ مدل اختیاری است
const needsUrl = provider === "custom";
const canSave =
  apiKey.trim().length > 8 &&
  (!needsUrl || baseUrl.trim().startsWith("https://"));

  const submit = () => {
    if (!canSave) return;
    const isCustom = provider === "custom";
    const cfg: ByokConfig = {
      provider,
      apiKey: apiKey.trim(),
      model: model.trim() || undefined,
      baseUrl: isCustom ? baseUrl.trim() || undefined : undefined,
      format: isCustom ? format : undefined,
    };
    saveByok(cfg);
    onSave(cfg);
  };

  const clear = () => {
    saveByok(null);
    setApiKey("");
    setModel("");
    setBaseUrl("");
    setFormat("openai");
    setTestResult(null);
    setTestOk(null);
    onClear();
  };

  const test = async () => {
    if (apiKey.trim().length < 8) {
      setTestOk(false);
      setTestResult(s.settings.keyTooShort);
      return;
    }
    setTesting(true);
    setTestOk(null);
    setTestResult(null);
    try {
      const isCustom = provider === "custom";
      const res = await apiTestKey({
        provider,
        apiKey: apiKey.trim(),
        model: model.trim() || undefined,
        baseUrl: isCustom ? baseUrl.trim() || undefined : undefined,
        format: isCustom ? format : undefined,
      });
      setTestOk(res.ok);
      // اگر سرور مدل دیگری را پیشنهاد داد، آن را می‌پذیریم
      if (res.ok && res.suggestedModel) {
        setModel(res.suggestedModel);
        saveByok({
          provider,
          apiKey: apiKey.trim(),
          model: res.suggestedModel,
          baseUrl: provider === "custom" ? baseUrl.trim() || undefined : undefined,
          format: provider === "custom" ? format : undefined,
        });
      }
      setTestResult(
        res.ok ? s.settings.testOk(res.model ?? res.suggestedModel ?? "") : `${s.settings.testFail} ${res.error ?? ""}`
      );
    } catch {
      setTestOk(false);
      setTestResult(`${s.settings.testFail} network-error`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <>
      <h2>{s.settings.title}</h2>
      <p className="aw-sub">{s.settings.sub}</p>

      <div className="aw-set-status">
        <span
          className={`aw-set-dot ${current ? "on" : ""}`}
          aria-hidden="true"
        />
        <span>{current ? s.settings.active : s.settings.inactive}</span>
        {current ? <b>{BYOK_PRESETS[current.provider].label}</b> : null}
      </div>

      <div className="aw-set-form">
        <label className="aw-set-label">{s.settings.provider}</label>
        <div className="aw-set-providers">
          {(Object.keys(BYOK_PRESETS) as ByokProviderId[]).map((id) => (
            <button
              key={id}
              type="button"
              className={`aw-set-prov ${provider === id ? "sel" : ""}`}
              onClick={() => setProvider(id)}
            >
              {BYOK_PRESETS[id].label}
            </button>
          ))}
        </div>

        <label className="aw-set-label" htmlFor="aw-byok-key">
          {s.settings.apiKey}
        </label>
        <input
          id="aw-byok-key"
          className="aw-set-input"
          dir="ltr"
          type="password"
          autoComplete="off"
          spellCheck={false}
          placeholder={s.settings.apiKeyPlaceholder}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />

        {provider === "custom" ? (
          <>
            <label className="aw-set-label">{s.settings.apiFormat}</label>
            <div className="aw-set-providers">
              <button
                type="button"
                className={`aw-set-prov ${format === "openai" ? "sel" : ""}`}
                onClick={() => setFormat("openai")}
              >
                {s.settings.formatOpenai}
              </button>
              <button
                type="button"
                className={`aw-set-prov ${format === "anthropic" ? "sel" : ""}`}
                onClick={() => setFormat("anthropic")}
              >
                {s.settings.formatAnthropic}
              </button>
            </div>
            <div className="aw-set-hint">{s.settings.formatHint}</div>

            <label className="aw-set-label" htmlFor="aw-byok-base">
              {s.settings.baseUrl}
            </label>
            <input
              id="aw-byok-base"
              className="aw-set-input"
              dir="ltr"
              type="url"
              autoComplete="off"
              spellCheck={false}
              placeholder={s.settings.baseUrlPlaceholder}
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
            />
            <div className="aw-set-hint">{s.settings.baseUrlHint}</div>
          </>
        ) : null}

        <label className="aw-set-label" htmlFor="aw-byok-model">
          {s.settings.model}
        </label>
        <input
          id="aw-byok-model"
          className="aw-set-input"
          dir="ltr"
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder={provider === "custom" ? (format === "anthropic" ? "atria-1" : "gpt-4o-mini") : preset.defaultModel}
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
        <div className="aw-set-hint">
          {provider === "custom" ? s.settings.customHint : s.settings.modelHint}
        </div>
        {provider === "custom" ? (
          <div className="aw-set-examples" dir="ltr">
            {s.settings.customExamples}
          </div>
        ) : null}

        {testResult ? (
          <div className={`aw-set-test ${testOk ? "ok" : "bad"}`} dir="auto">
            {testResult}
          </div>
        ) : null}

        <div className="aw-set-actions">
          <button
            className="aw-btn aw-btn-primary"
            onClick={submit}
            disabled={!canSave}
          >
            {s.settings.save}
          </button>
          <button
            className="aw-btn aw-btn-ghost"
            onClick={test}
            disabled={testing || !canSave}
          >
            {testing ? s.settings.testing : s.settings.test}
          </button>
          {current ? (
            <button className="aw-btn aw-btn-ghost" onClick={clear}>
              {s.settings.clear}
            </button>
          ) : null}
        </div>
      </div>

      <div className="aw-set-guide">
        <div className="aw-set-guide-title">
          {provider === "atria"
            ? "چطور کلید Atria بگیرم؟"
            : provider === "groq"
              ? "چطور کلید رایگان Groq بگیرم؟"
              : s.settings.guideTitle}
        </div>
        <ol className="aw-set-steps">
          {(
            provider === "atria"
              ? s.settings.guideAtria
              : provider === "groq"
                ? s.settings.guideGroq
                : s.settings.guide
          ).map((g, i) => (
            <li key={i}>{g.step}</li>
          ))}
        </ol>
        <div className="aw-set-note">
          {provider === "groq" ? s.settings.groqFree : s.settings.free}
        </div>
        <a
          className="aw-set-link"
          href={preset.keyUrl}
          target="_blank"
          rel="noopener noreferrer"
          dir="ltr"
        >
          {s.settings.learnMore} →
        </a>
        <div className="aw-set-privacy">{s.settings.privacy}</div>
      </div>
    </>
  );
}