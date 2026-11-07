/**
 * Public-site colour theme. Dark is the default for everyone, including visitors
 * whose OS prefers light; only an explicit toggle changes it.
 *
 * Stored in localStorage rather than a cookie: pages are CDN-cached, and a
 * theme cookie would force `Vary: Cookie` on them. The bootstrap script below
 * applies the choice before first paint instead.
 */
export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "wl-theme";
export const DEFAULT_THEME: Theme = "dark";

/** Browser UI colour per theme. Keep in sync with --color-black in app/styles/theme.css. */
export const THEME_COLORS: Record<Theme, string> = {
  dark: "#000000",
  light: "#F8FAFC",
};

export function parseTheme(value: unknown): Theme {
  return value === "light" || value === "dark" ? value : DEFAULT_THEME;
}

/** Inline in <head>, after the theme-color meta, so there is no flash of the wrong theme. */
export const themeBootstrapScript = `(function(){var t="${DEFAULT_THEME}";try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");if(s==="light"||s==="dark")t=s}catch(e){}document.documentElement.dataset.theme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",t==="light"?"${THEME_COLORS.light}":"${THEME_COLORS.dark}")})();`;

export function readTheme(): Theme {
  return parseTheme(document.documentElement.dataset.theme);
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.classList.add("wl-theme-switching");
    window.setTimeout(() => root.classList.remove("wl-theme-switching"), 300);
  }
  root.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[theme]);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private mode or blocked storage: the theme still applies for this page view.
  }
}
