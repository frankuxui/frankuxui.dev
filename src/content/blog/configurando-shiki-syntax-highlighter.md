---
slug: "configurando-shiki-syntax-highlighter"
title: "Configurando Shiki Syntax Highlighter."
subtitle: "Resaltando la sintaxis de código en un blog con Next.js y MDX."
description: "Configurando y creando un componente para resaltar la sintaxis de código en un blog utilizando Shiki y Next.js con serverside rendering."
date: "2026-04-26"
tags:
  - "react"
  - "nextjs"
  - "shiki"
  - "mdx"
cover:
  src: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=768&h=512&auto=format&fit=crop&crop=center&fm=webp&q=90"
  author: "https://unsplash.com/es/@francesco_ungaro"
  authorName: "Francesco Ungaro"
  alt: "Imagen de unsplash de Francesco Ungaro"
---

## Introducción

Esta guía explica cómo configurar **Shiki** como resaltador de sintaxis en un blog desarrollado con **Next.js** y **MDX**, incluyendo la creación de un componente reutilizable y altamente personalizable.

## 📦 Instalación de dependencias

Instalación de la dependencia principal:

```bash
npm install -D shiki
```

## Creando un server component de resaltado de sintaxis

Vamos a crear un componente que se encargue de resaltar la sintaxis de bloques de código. Este componente usará `codeToHtml` de Shiki para convertir el código en HTML resaltado.

```tsx showLineNumbers{1,2} caption="Example JavaScript Code"
import { cn } from "@/lib/utils";
import React from "react";
import type { BundledLanguage, BundledTheme } from "shiki";
import { addClassToHast, codeToHtml } from "shiki";
import CopyClipboard from "./copyClipboard";

interface Props {
  children: string;
  lang: BundledLanguage;
  theme?: BundledTheme;
  enabledNumbers?: boolean;
  classNames?: {
    root?: string;
    content?: string;
    pre?: string;
    code?: string;
    lineNumber?: string;
    lineHighlight?: string;
  };
}

export default async function MarkdownSyntaxHighlighterSSR(props: Props) {
  const getHighlight = async () => {
    const out = await codeToHtml(props.children, {
      lang: props.lang,
      theme: props.theme || "vitesse-dark",
      cssVariablePrefix: "shikiji",
      transformers: [
        {
          code(node) {
            if (props.enabledNumbers) {
              addClassToHast(node, cn("enabledLineNumbers", props.classNames?.code));
            }
            addClassToHast(node, cn("block min-w-full w-fit overflow-auto", props.classNames?.code));
          },
          line(hast, line) {
            addClassToHast(hast, cn("shikiji-line-number text-sm", props.classNames?.lineNumber));
            if ([1, 3, 4].includes(line)) {
              addClassToHast(hast, cn("shikiji-line-highlight", props.classNames?.lineHighlight));
            }
          },
          span(hast, line, col, lineElement) {
            addClassToHast(hast, cn("shikiji-line-highlight-span"));
            if (lineElement) {
              addClassToHast(lineElement, cn("shikiji-line-highlight-span"));
            }
          },
          pre(hast) {
            addClassToHast(hast, cn("shikiji-pre leading-6 min-w-full rounded-2xl p-6 overflow-auto", props.classNames?.pre));
          },
        },
      ],
    });
    return out;
  };

  const highlight = await getHighlight();

  if (!highlight) {
    return null;
  }
  return (
    <div className={cn("relative", props.classNames?.root)}>
      <div dangerouslySetInnerHTML={{ __html: highlight }} className={cn("w-full relative", props.classNames?.content)} />
      <CopyClipboard code={props.children} />
    </div>
  );
}
```

### Este componente:

- Usa `codeToHtml` para transformar el código en HTML resaltado.
- Permite personalizar clases para elementos individuales como `pre`, `line`, `span`, etc.
- Soporta temas personalizados como `vitesse-dark`.

## Componente para copiar al portapapeles

Mejoramos la experiencia del usuario añadiendo un botón para copiar el código al portapapeles. Este componente se puede integrar fácilmente en el resaltador de sintaxis.

```tsx showLineNumbers{1,2} caption="Example JavaScript Code"
"use client";

import { useCopyToClipboard } from "@/app/hooks/useCopyToClipboard";
import React from "react";

export default function CopyClipboard({ code }: { code: string }) {
  const [, copy] = useCopyToClipboard();
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await copy(code);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 500);
    } catch (error) {
      console.error("Copy failed", error);
    }
  };

  return (
    <button
      className="absolute right-4 top-4 z-10 w-10 h-10 cursor-pointer rounded-full inline-flex items-center justify-center motion-safe:transition-colors motion-safe:duration-200 bg-black/80 hover:bg-black/90 text-white dark:bg-white/5 dark:hover:bg-white/10"
      onClick={handleCopy}
    >
      {isCopied ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 12l5 5L20 7" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
            <path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2H9z" />
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          </g>
        </svg>
      )}
    </button>
  );
}
```

## Hook para copiar al portapapeles

Este hook se encarga de copiar el texto al portapapeles. Puedes usarlo en cualquier parte de tu aplicación.

```tsx showLineNumbers{1,2} caption="Example JavaScript Code"
"use client";
import { useCallback, useState } from "react";

type CopiedValue = string | null;

type CopyFn = (_text: string) => Promise<boolean>;

export function useCopyToClipboard(): [CopiedValue, CopyFn] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  const copy: CopyFn = useCallback(async (text) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      console.warn("Copy failed", error);
      setCopiedText(null);
      return false;
    }
  }, []);

  return [copiedText, copy];
}
```

## Integración con MDX

Integramos el componente anterior en el contexto de MDX para reemplazar el elemento `<pre>` por nuestro resaltador personalizado:

```tsx showLineNumbers{1,2} caption="Example JavaScript Code"
import type { MDXComponents } from "mdx/types";
import MarkdownSyntaxHighlighter from "./markdown-syntax-highlighter";

export const useMDXComponents: MDXComponents = {
  // Otros componentes personalizados...

  pre: (props) => {
    const code = props.children.props.children as string;
    const lang = props.children.props.className.replace("language-", "") as "js" | "ts" | "tsx" | "jsx" | "html" | "css" | "scss" | "json";

    const theme = "vitesse-dark";

    return (
      <MarkdownSyntaxHighlighterSSR lang={lang} theme="vitesse-dark" enabledNumbers={true}>
        {[code.trim()].join("\n")}
      </MarkdownSyntaxHighlighterSSR>
    );
  },
};
```

> Este patrón permite interceptar bloques de código renderizados por MDX y aplicarles el resaltado con Shiki automáticamente.

## Personalización de estilos

Puedes pasar clases personalizadas a través de la prop `classNames`, lo cual te permite adaptar el diseño del resaltador a tu sistema de estilos o temas oscuros/claros.

### Ejemplo:

```tsx showLineNumbers{1,2} caption="Example JavaScript Code"

type classNames = {
  root?: string
  content?: string
  pre?: string
  code?: string
  lineNumber?: string
  lineHighlight?: string
}

classNames={{
  root: 'relative',
  pre: 'bg-zinc-900 p-6 rounded-xl',
  lineNumber: 'text-sm text-zinc-500',
  lineHighlight: 'bg-zinc-800',
  code: 'font-mono',
}}
```

## Conclusión

Con esta configuración, puedes resaltar la sintaxis de bloques de código en tu blog de Next.js utilizando Shiki. La personalización de estilos y la integración con MDX hacen que sea fácil adaptarlo a tus necesidades específicas. ¡Feliz codificación!
