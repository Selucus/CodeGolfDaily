"use client";

import { useEffect, useRef, useCallback } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { Language } from "../lib/types";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
  readOnly?: boolean;
  onRun?: () => void;
}

export default function CodeEditor({
  value,
  onChange,
  language,
  readOnly = false,
  onRun,
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const onRunRef = useRef(onRun);
  onChangeRef.current = onChange;
  onRunRef.current = onRun;

  const createState = useCallback(
    (doc: string) => {
      return EditorState.create({
        doc,
        extensions: [
          basicSetup,
          language === "javascript" ? javascript() : python(),
          oneDark,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChangeRef.current(update.state.doc.toString());
            }
          }),
          keymap.of([
            {
              key: "Ctrl-Enter",
              mac: "Cmd-Enter",
              run: () => {
                onRunRef.current?.();
                return true;
              },
            },
          ]),
          EditorView.theme({
            "&": { height: "250px", fontSize: "14px" },
            ".cm-scroller": { overflow: "auto" },
          }),
          ...(readOnly ? [EditorState.readOnly.of(true), EditorView.editable.of(false)] : []),
        ],
      });
    },
    [language, readOnly]
  );

  useEffect(() => {
    if (!editorRef.current) return;

    const view = new EditorView({
      state: createState(value),
      parent: editorRef.current,
    });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // Only recreate on language change, not value change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, createState]);

  return <div ref={editorRef} className="rounded-lg overflow-hidden border border-zinc-700" />;
}
