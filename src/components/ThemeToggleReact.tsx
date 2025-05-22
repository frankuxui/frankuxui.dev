import React from "react";

export default function ThemeToGlleReact() {
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">("system");

  const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

  const setAndStoreTheme = (mode: "light" | "dark" | "system") => {
    setTheme(mode);
    window.theme?.setTheme?.(mode); // ✅ Guarda en localStorage usando tu sistema global
  };

  const handleTheme = () => {
    const next = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
    setAndStoreTheme(next);
  };

  // ✅ Leer desde localStorage y aplicar al montar
  React.useEffect(() => {
    const savedTheme = window.theme?.getTheme?.() || window.theme?.getDefaultTheme?.() || "system";
    setTheme(savedTheme);
  }, []);

  // 🔁 Responder a cambios del sistema si está en modo "system"

  React.useEffect(() => {
    if (theme === "system") {
      const handleSystemThemeChange = () => {
        const systemTheme = window.theme?.getSystemTheme?.() || "light";
        setAndStoreTheme(systemTheme);
      };

      // Escuchar cambios del sistema
      window.addEventListener("themechange", handleSystemThemeChange);

      // Cleanup al desmontar
      return () => {
        window.removeEventListener("themechange", handleSystemThemeChange);
      };
    }
  }, [theme]);

  return (
    <button
      aria-label="Switch theme"
      type="button"
      className="group rounded-full w-12 h-12 inline-flex items-center justify-center overflow-hidden backdrop-blur-md hover:bg-foreground/5 focus:bg-foreground/10"
      onClick={handleTheme}
    >
      <span aria-hidden="true" className="sr-only">
        Switch theme
      </span>
      <div className="relative h-8 w-8">
        <div
          className={cn(
            "inline-flex items-center justify-center absolute inset-0 transform transition-transform duration-700 motion-reduce:duration-[0s]",
            theme === "dark" ? "rotate-0" : "rotate-90",
          )}
          style={{ transition: "all 0.3s", transformOrigin: "50% 100px" }}
        >
          <span className="material-symbols-rounded material-symbols-lg material-symbols-weight-300">dark_mode</span>
        </div>
        <div
          className={cn(
            "inline-flex items-center justify-center absolute inset-0 transform transition-transform duration-700 motion-reduce:duration-[0s]",
            theme === "light" ? "rotate-0" : "-rotate-90",
          )}
          style={{ transition: "all 0.3s", transformOrigin: "50% 100px" }}
        >
          <span className="material-symbols-rounded material-symbols-lg material-symbols-weight-300">light_mode</span>
        </div>
        <div
          className={cn(
            "inline-flex items-center justify-center absolute inset-0 transform transition-transform duration-700 motion-reduce:duration-[0s]",
            theme === "system" ? "top-0" : "top-24",
          )}
          style={{ transition: "all 0.3s", transformOrigin: "50% 100px" }}
        >
          <span className="material-symbols-rounded material-symbols-lg material-symbols-weight-300">computer</span>
        </div>
      </div>
    </button>
  );
}
