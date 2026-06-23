"use client";

import { useState, useEffect, useRef } from "react";

type FontSize = "sm" | "base" | "lg" | "xl";
type FontFamily = "serif" | "sans";
type LineHeight = "normal" | "relaxed" | "loose";
type ContentWidth = "narrow" | "normal" | "wide";

type Settings = {
  fontSize: FontSize;
  fontFamily: FontFamily;
  lineHeight: LineHeight;
  contentWidth: ContentWidth;
  highContrast: boolean;
};

const DEFAULTS: Settings = {
  fontSize: "base",
  fontFamily: "serif",
  lineHeight: "relaxed",
  contentWidth: "normal",
  highContrast: false,
};

const STORAGE_KEY = "ahau-reader-settings";

const FONT_SIZE_MAP: Record<FontSize, string> = {
  sm:   "0.9375rem",
  base: "1.0625rem",
  lg:   "1.1875rem",
  xl:   "1.375rem",
};
const FONT_FAMILY_MAP: Record<FontFamily, string> = {
  serif: '"Instrument Serif", Georgia, serif',
  sans:  '"Syne", system-ui, sans-serif',
};
const LINE_HEIGHT_MAP: Record<LineHeight, string> = {
  normal:  "1.6",
  relaxed: "1.8",
  loose:   "2.1",
};
const CONTENT_WIDTH_MAP: Record<ContentWidth, string> = {
  narrow: "580px",
  normal: "720px",
  wide:   "900px",
};

function applySettings(s: Settings) {
  const root = document.documentElement;
  root.style.setProperty("--reader-font-size",     FONT_SIZE_MAP[s.fontSize]);
  root.style.setProperty("--reader-font-family",   FONT_FAMILY_MAP[s.fontFamily]);
  root.style.setProperty("--reader-line-height",   LINE_HEIGHT_MAP[s.lineHeight]);
  root.style.setProperty("--reader-content-width", CONTENT_WIDTH_MAP[s.contentWidth]);
  if (s.highContrast) {
    root.classList.add("high-contrast");
  } else {
    root.classList.remove("high-contrast");
  }
}

const GearIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" aria-hidden>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

type OptionButtonProps = {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
};

function OptionButton({ active, onClick, children, className = "" }: OptionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "px-3 py-1.5 rounded-lg text-sm font-display font-medium transition-all border",
        active
          ? "bg-accent text-ink-inverse border-accent"
          : "bg-surface text-ink-secondary border-surface-border hover:border-accent/50 hover:text-ink",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// Hook compartido — carga y aplica settings
function useReaderSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: Settings = { ...DEFAULTS, ...JSON.parse(saved) };
        setSettings(parsed);
        applySettings(parsed);
      } else {
        applySettings(DEFAULTS);
      }
    } catch {
      applySettings(DEFAULTS);
    }
  }, []);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    applySettings(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }

  function reset() {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  return { settings, update, reset };
}

// Panel de opciones — reutilizable en ambas variantes
function SettingsPanel({
  settings,
  update,
  reset,
  position = "right",
}: {
  settings: Settings;
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  reset: () => void;
  position?: "right" | "left";
}) {
  return (
    <div
      className={[
        "absolute z-50 bg-surface border border-surface-border rounded-2xl shadow-card-hover p-5 w-72 bottom-full mb-3",
        position === "right" ? "right-0" : "left-0",
      ].join(" ")}
    >
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs font-display font-semibold uppercase tracking-widest text-ink-muted">
          Configuración de lectura
        </p>
        <button
          onClick={reset}
          className="text-2xs font-display text-ink-muted hover:text-accent transition-colors"
        >
          Restablecer
        </button>
      </div>

      <div className="space-y-5">
        {/* Tamaño de fuente */}
        <div>
          <p className="text-xs font-display font-semibold text-ink-secondary mb-2">
            Tamaño de fuente
          </p>
          <div className="flex gap-2">
            {(["sm", "base", "lg", "xl"] as FontSize[]).map((size) => (
              <OptionButton
                key={size}
                active={settings.fontSize === size}
                onClick={() => update("fontSize", size)}
                className="flex-1 justify-center"
              >
                {size === "sm"   && <span className="text-xs">A</span>}
                {size === "base" && <span className="text-sm">A</span>}
                {size === "lg"   && <span className="text-base">A</span>}
                {size === "xl"   && <span className="text-lg">A</span>}
              </OptionButton>
            ))}
          </div>
        </div>

        {/* Tipografía */}
        <div>
          <p className="text-xs font-display font-semibold text-ink-secondary mb-2">
            Tipografía
          </p>
          <div className="flex gap-2">
            <OptionButton
              active={settings.fontFamily === "serif"}
              onClick={() => update("fontFamily", "serif")}
              className="flex-1"
            >
              <span style={{ fontFamily: "Instrument Serif, serif" }}>Serif</span>
            </OptionButton>
            <OptionButton
              active={settings.fontFamily === "sans"}
              onClick={() => update("fontFamily", "sans")}
              className="flex-1"
            >
              <span style={{ fontFamily: "Syne, sans-serif" }}>Sans</span>
            </OptionButton>
          </div>
        </div>

        {/* Interlineado */}
        <div>
          <p className="text-xs font-display font-semibold text-ink-secondary mb-2">
            Interlineado
          </p>
          <div className="flex gap-2">
            {(["normal", "relaxed", "loose"] as LineHeight[]).map((lh) => (
              <OptionButton
                key={lh}
                active={settings.lineHeight === lh}
                onClick={() => update("lineHeight", lh)}
                className="flex-1"
              >
                {lh === "normal"  && "Normal"}
                {lh === "relaxed" && "Relajado"}
                {lh === "loose"   && "Amplio"}
              </OptionButton>
            ))}
          </div>
        </div>

        {/* Ancho */}
        <div>
          <p className="text-xs font-display font-semibold text-ink-secondary mb-2">
            Ancho de lectura
          </p>
          <div className="flex gap-2">
            {(["narrow", "normal", "wide"] as ContentWidth[]).map((w) => (
              <OptionButton
                key={w}
                active={settings.contentWidth === w}
                onClick={() => update("contentWidth", w)}
                className="flex-1"
              >
                {w === "narrow" && "Estrecho"}
                {w === "normal" && "Normal"}
                {w === "wide"   && "Ancho"}
              </OptionButton>
            ))}
          </div>
        </div>

        {/* Alto contraste */}
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs font-display font-semibold text-ink-secondary">
            Alto contraste
          </p>
          <button
            role="switch"
            aria-checked={settings.highContrast}
            onClick={() => update("highContrast", !settings.highContrast)}
            className={[
              "relative w-11 h-6 rounded-full border transition-all duration-200",
              settings.highContrast
                ? "bg-accent border-accent"
                : "bg-surface-raised border-surface-border",
            ].join(" ")}
          >
            <span
              className={[
                "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200",
                settings.highContrast ? "translate-x-5" : "translate-x-0",
              ].join(" ")}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Variante Desktop — va dentro del sidebar de ArticleLayout ──
export function ReaderSettingsDesktop() {
  const [open, setOpen] = useState(false);
  const { settings, update, reset } = useReaderSettings();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Configuración de lectura"
        aria-expanded={open}
        className={[
          "w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border transition-all duration-200 text-sm font-display font-medium",
          open
            ? "border-accent text-accent bg-surface-raised"
            : "border-surface-border bg-surface text-ink-secondary hover:border-accent/50 hover:text-ink",
        ].join(" ")}
      >
        <GearIcon />
        Lectura
      </button>
      {open && (
        <SettingsPanel
          settings={settings}
          update={update}
          reset={reset}
          position="left"
        />
      )}
    </div>
  );
}

// ── Variante Móvil — FAB circular, solo visible en móvil ──
export function ReaderSettingsMobile() {
  const [open, setOpen] = useState(false);
  const { settings, update, reset } = useReaderSettings();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Configuración de lectura"
        aria-expanded={open}
        className={[
          "w-14 h-14 flex items-center justify-center rounded-full border-2 shadow-card-hover transition-all duration-200",
          open
            ? "border-accent text-accent bg-surface-raised"
            : "border-surface-border bg-surface text-ink-secondary hover:border-accent/50 hover:text-ink",
        ].join(" ")}
      >
        <GearIcon />
      </button>

      {/* Panel — siempre abre hacia arriba y a la izquierda */}
      {open && (
        <div className="absolute z-50 bottom-full mb-3 right-0 bg-surface border border-surface-border rounded-2xl shadow-card-hover p-5 w-72">
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs font-display font-semibold uppercase tracking-widest text-ink-muted">
              Configuración de lectura
            </p>
            <button
              onClick={reset}
              className="text-2xs font-display text-ink-muted hover:text-accent transition-colors"
            >
              Restablecer
            </button>
          </div>

          <div className="space-y-5">
            {/* Tamaño de fuente */}
            <div>
              <p className="text-xs font-display font-semibold text-ink-secondary mb-2">
                Tamaño de fuente
              </p>
              <div className="flex gap-2">
                {(["sm", "base", "lg", "xl"] as FontSize[]).map((size) => (
                  <OptionButton
                    key={size}
                    active={settings.fontSize === size}
                    onClick={() => update("fontSize", size)}
                    className="flex-1 justify-center"
                  >
                    {size === "sm"   && <span className="text-xs">A</span>}
                    {size === "base" && <span className="text-sm">A</span>}
                    {size === "lg"   && <span className="text-base">A</span>}
                    {size === "xl"   && <span className="text-lg">A</span>}
                  </OptionButton>
                ))}
              </div>
            </div>

            {/* Tipografía */}
            <div>
              <p className="text-xs font-display font-semibold text-ink-secondary mb-2">
                Tipografía
              </p>
              <div className="flex gap-2">
                <OptionButton
                  active={settings.fontFamily === "serif"}
                  onClick={() => update("fontFamily", "serif")}
                  className="flex-1"
                >
                  <span style={{ fontFamily: "Instrument Serif, serif" }}>Serif</span>
                </OptionButton>
                <OptionButton
                  active={settings.fontFamily === "sans"}
                  onClick={() => update("fontFamily", "sans")}
                  className="flex-1"
                >
                  <span style={{ fontFamily: "Syne, sans-serif" }}>Sans</span>
                </OptionButton>
              </div>
            </div>

            {/* Interlineado */}
            <div>
              <p className="text-xs font-display font-semibold text-ink-secondary mb-2">
                Interlineado
              </p>
              <div className="flex gap-2">
                {(["normal", "relaxed", "loose"] as LineHeight[]).map((lh) => (
                  <OptionButton
                    key={lh}
                    active={settings.lineHeight === lh}
                    onClick={() => update("lineHeight", lh)}
                    className="flex-1"
                  >
                    {lh === "normal"  && "Normal"}
                    {lh === "relaxed" && "Relajado"}
                    {lh === "loose"   && "Amplio"}
                  </OptionButton>
                ))}
              </div>
            </div>

            {/* Ancho */}
            <div>
              <p className="text-xs font-display font-semibold text-ink-secondary mb-2">
                Ancho de lectura
              </p>
              <div className="flex gap-2">
                {(["narrow", "normal", "wide"] as ContentWidth[]).map((w) => (
                  <OptionButton
                    key={w}
                    active={settings.contentWidth === w}
                    onClick={() => update("contentWidth", w)}
                    className="flex-1"
                  >
                    {w === "narrow" && "Estrecho"}
                    {w === "normal" && "Normal"}
                    {w === "wide"   && "Ancho"}
                  </OptionButton>
                ))}
              </div>
            </div>

            {/* Alto contraste */}
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs font-display font-semibold text-ink-secondary">
                Alto contraste
              </p>
              <button
                role="switch"
                aria-checked={settings.highContrast}
                onClick={() => update("highContrast", !settings.highContrast)}
                className={[
                  "relative w-11 h-6 rounded-full border transition-all duration-200",
                  settings.highContrast
                    ? "bg-accent border-accent"
                    : "bg-surface-raised border-surface-border",
                ].join(" ")}
              >
                <span
                  className={[
                    "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200",
                    settings.highContrast ? "translate-x-5" : "translate-x-0",
                  ].join(" ")}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}