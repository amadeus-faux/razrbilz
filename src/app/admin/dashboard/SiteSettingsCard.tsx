"use client";

import { useCallback, useEffect, useState } from "react";
import { Settings2, Check, AlertCircle, RotateCcw, Save } from "lucide-react";

interface SettingInfo {
  key: string;
  label: string;
  help: string;
  maxChars: number;
  defaultValue: string;
  value: string | null;
  effectiveValue: string;
  isDefault: boolean;
  updatedAt: string | null;
}

/** Sama dengan normalizeSettingValue() di src/lib/site-settings.ts (server-only). */
function normalize(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export default function SiteSettingsCard() {
  const [settings, setSettings] = useState<SettingInfo[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const applySettings = useCallback((next: SettingInfo[]) => {
    setSettings(next);
    setDrafts(Object.fromEntries(next.map((s) => [s.key, s.value ?? ""])));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/site-settings");
        const data = await res.json();
        if (!cancelled && data.success && Array.isArray(data.settings)) {
          applySettings(data.settings);
        }
      } catch (err) {
        console.error("Error fetching site settings:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [applySettings]);

  const handleSave = async (key: string, value: string) => {
    try {
      setSavingKey(key);
      setMessage(null);
      const res = await fetch("/api/admin/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.settings)) {
        applySettings(data.settings);
        setMessage({
          text: value.trim() ? "Pengaturan tersimpan." : "Dikembalikan ke nilai default.",
          type: "success",
        });
      } else {
        setMessage({ text: data.error || "Gagal menyimpan pengaturan", type: "error" });
      }
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : "Koneksi gagal", type: "error" });
    } finally {
      setSavingKey(null);
    }
  };

  const metaDescription = settings.find((s) => s.key === "homeMetaDescription");
  const anyCustom = settings.some((s) => !s.isDefault);

  return (
    <div className="bg-[#141311] border border-[#242320] rounded-2xl p-6 mb-8 transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#242320]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1d1b18] border border-[#2e2c28] flex items-center justify-center text-[#d4af37]">
            <Settings2 size={18} strokeWidth={1.8} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[#f4f2ee]">Pengaturan Situs</h2>
              {settings.length > 0 && (
                <span
                  className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded-full border ${
                    anyCustom
                      ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                      : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  }`}
                >
                  {anyCustom ? "Nilai Kustom" : "Default Bawaan"}
                </span>
              )}
            </div>
            <p className="text-xs text-[#8c8680] mt-0.5">
              Teks tampilan publik yang bisa diubah tanpa deploy ulang. Kosongkan untuk kembali ke default.
            </p>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2 border ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
              : "bg-rose-500/10 text-rose-300 border-rose-500/20"
          }`}
        >
          {message.type === "success" ? <Check size={14} /> : <AlertCircle size={14} />}
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <p className="mt-5 text-xs text-[#8c8680]">Memuat pengaturan...</p>
      ) : (
        <div className="mt-5 space-y-5">
          {settings.map((setting) => {
            const draft = drafts[setting.key] ?? "";
            const normalized = normalize(draft);
            const remaining = setting.maxChars - normalized.length;
            const tooLong = remaining < 0;
            const dirty = normalized !== (setting.value ?? "");

            return (
              <div key={setting.key} className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <label
                      htmlFor={setting.key}
                      className="text-[11px] font-medium text-[#dedad3] block"
                    >
                      {setting.label}
                    </label>
                    <p className="text-[11px] text-[#8c8680] mt-0.5">{setting.help}</p>
                  </div>
                  {!setting.isDefault && setting.updatedAt && (
                    <span className="shrink-0 text-[10px] text-[#8c8680] font-mono">
                      diubah{" "}
                      {new Date(setting.updatedAt).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>

                <textarea
                  id={setting.key}
                  rows={2}
                  value={draft}
                  onChange={(e) => setDrafts((prev) => ({ ...prev, [setting.key]: e.target.value }))}
                  placeholder={setting.defaultValue}
                  className="w-full bg-[#12110f] border border-[#2c2a26] focus:border-amber-500/60 rounded-xl px-3 py-2 text-sm text-[#f4f2ee] outline-none resize-none transition-colors"
                />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span
                    className={`text-[11px] font-mono ${
                      tooLong
                        ? "text-rose-400"
                        : remaining < 20
                          ? "text-amber-400"
                          : "text-[#8c8680]"
                    }`}
                  >
                    {normalized.length}/{setting.maxChars} · sisa {remaining}
                  </span>

                  <div className="flex items-center gap-2">
                    {!setting.isDefault && (
                      <button
                        onClick={() => {
                          setDrafts((prev) => ({ ...prev, [setting.key]: "" }));
                          handleSave(setting.key, "");
                        }}
                        disabled={savingKey !== null}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#1d1b18] hover:bg-[#252320] border border-[#2e2c28] text-xs text-[#8c8680] transition-colors disabled:opacity-50"
                      >
                        <RotateCcw size={12} />
                        <span>Ke Default</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleSave(setting.key, draft)}
                      disabled={savingKey !== null || tooLong || !dirty}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save size={12} />
                      <span>{savingKey === setting.key ? "Menyimpan..." : "Simpan"}</span>
                    </button>
                  </div>
                </div>

                {tooLong && (
                  <p className="text-[10px] text-rose-400">
                    Pangkas {Math.abs(remaining)} karakter sebelum menyimpan.
                  </p>
                )}

                {setting.key === "homeMetaDescription" && (
                  <div className="pt-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#8c8680] block mb-2">
                      Pratinjau hasil pencarian Google
                    </span>
                    <div className="rounded-xl bg-white p-4 max-w-xl">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#141311] flex items-center justify-center text-[#d4af37] text-[11px] font-bold shrink-0">
                          R
                        </div>
                        <div className="leading-tight">
                          <div className="text-[14px] text-[#1f1f1f] font-medium">razrbilz.id</div>
                          <div className="text-[12px] text-[#4d5156]">https://razrbilz.id</div>
                        </div>
                      </div>
                      <div className="mt-2 text-[18px] leading-snug text-[#1a0dab]">RAZRBILZ</div>
                      <p className="mt-1 text-[14px] leading-snug text-[#4d5156]">
                        {normalized || (
                          <span className="italic text-[#80868b]">{setting.defaultValue}</span>
                        )}
                      </p>
                      {!normalized && (
                        <p className="mt-2 text-[11px] text-[#80868b]">
                          Masih memakai teks default.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {metaDescription && (
            <p className="text-[10px] text-[#8c8680] border-t border-[#242320] pt-3">
              Simpan, lalu buka razrbilz.id dan periksa tag{" "}
              <span className="font-mono text-[#dedad3]">&lt;meta name=&quot;description&quot;&gt;</span>.
              Google memperbarui snippet sendiri dalam hitungan jam sampai hari.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
