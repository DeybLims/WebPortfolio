"use client";

import * as React from "react";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { javascriptLanguage } from "@codemirror/lang-javascript";
import {
  bracketMatching,
  indentOnInput,
  indentUnit,
  syntaxHighlighting,
  HighlightStyle,
} from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import {
  EditorView,
  drawSelection,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
} from "@codemirror/view";
import { tags } from "@lezer/highlight";

const playgroundHighlight = HighlightStyle.define([
  { tag: [tags.keyword, tags.modifier, tags.operatorKeyword], color: "var(--syn-keyword)" },
  { tag: [tags.string, tags.regexp], color: "var(--syn-string)" },
  { tag: [tags.comment, tags.lineComment, tags.blockComment], color: "var(--syn-comment)" },
  { tag: [tags.number, tags.bool, tags.null], color: "var(--syn-type)" },
  {
    tag: [tags.function(tags.variableName), tags.function(tags.definition(tags.variableName))],
    color: "var(--syn-function)",
  },
  { tag: [tags.variableName, tags.propertyName], color: "var(--syn-var)" },
]);

const mono =
  'var(--font-plex-mono), ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace';

const playgroundTheme = EditorView.theme(
  {
    "&": {
      height: "100%",
      backgroundColor: "transparent",
      color: "var(--code-fg)",
    },
    "&.cm-focused": {
      outline: "2px solid var(--syn-keyword)",
      outlineOffset: "-2px",
    },
    ".cm-scroller, .cm-content, .cm-line, .cm-gutters": {
      fontFamily: mono,
      fontSize: "14px",
      lineHeight: "22.4px",
      letterSpacing: "0px",
      fontWeight: "400",
      fontVariantLigatures: "none",
      fontFeatureSettings: '"liga" 0, "calt" 0',
      tabSize: "2",
      whiteSpace: "pre",
    },
    ".cm-scroller": {
      fontSize: "14px",
    },
    ".cm-content": {
      padding: "16px 0 20px",
      caretColor: "var(--code-fg)",
      whiteSpace: "pre",
    },
    ".cm-line": {
      padding: "0 16px",
      whiteSpace: "pre",
    },
    ".cm-gutters": {
      backgroundColor: "var(--code-elevated)",
      color: "var(--code-dim)",
      border: "none",
      borderRight: "1px solid var(--code-line)",
      whiteSpace: "pre",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "transparent",
      color: "var(--code-fg)",
    },
    ".cm-activeLine": {
      backgroundColor: "color-mix(in oklab, var(--code-fg) 7%, transparent)",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
      backgroundColor: "color-mix(in oklab, var(--syn-keyword) 38%, transparent)",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "var(--code-fg)",
      borderLeftWidth: "2px",
    },
    ".cm-tooltip": {
      backgroundColor: "var(--code-surface)",
      color: "var(--code-fg)",
      border: "1px solid var(--code-line)",
    },
    "@media (max-width: 799px)": {
      ".cm-scroller, .cm-content, .cm-line, .cm-gutters": {
        fontSize: "16px",
        lineHeight: "25.6px",
      },
    },
  },
  { dark: true },
);

export function IdeEditor({
  code,
  filename,
  onChange,
  onRun,
}: {
  code: string;
  filename: string;
  onChange: (code: string) => void;
  onRun: () => void;
}) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const viewRef = React.useRef<EditorView | null>(null);
  const onChangeRef = React.useRef(onChange);
  const onRunRef = React.useRef(onRun);
  const initialCode = React.useRef(code);

  React.useEffect(() => {
    onChangeRef.current = onChange;
    onRunRef.current = onRun;
  });

  React.useEffect(() => {
    const parent = hostRef.current;
    if (!parent) return;

    const view = new EditorView({
      parent,
      state: EditorState.create({
        doc: initialCode.current,
        extensions: [
          lineNumbers(),
          highlightActiveLine(),
          highlightActiveLineGutter(),
          drawSelection(),
          history(),
          indentOnInput(),
          bracketMatching(),
          closeBrackets(),
          javascriptLanguage.extension,
          syntaxHighlighting(playgroundHighlight),
          playgroundTheme,
          indentUnit.of("  "),
          EditorState.tabSize.of(2),
          EditorView.contentAttributes.of({
            "aria-label": `Editor, ${filename}`,
            spellcheck: "false",
            autocapitalize: "off",
          }),
          keymap.of([
            {
              key: "Mod-Enter",
              run: () => {
                onRunRef.current();
                return true;
              },
            },
            indentWithTab,
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...historyKeymap,
          ]),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) onChangeRef.current(update.state.doc.toString());
          }),
        ],
      }),
    });

    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [filename]);

  React.useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current === code) return;
    view.dispatch({
      changes: { from: 0, to: current.length, insert: code },
      selection: { anchor: Math.min(view.state.selection.main.anchor, code.length) },
    });
  }, [code]);

  return <div ref={hostRef} className="ide-cm" />;
}
