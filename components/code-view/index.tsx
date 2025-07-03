import "./code-theme.css";

import Prism from "prismjs";
import { useEffect } from "react";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import MonacoEditor from "@monaco-editor/react";


interface Props {
  code: string;
  lang: string;
}

export const CodeView = ({ code, lang }: Props) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <pre className="p-2 bg-transparent border-none rounded-none m-0 text-xs">
      <code className={`language-${lang}`}>{code}</code>
    </pre>
  );
};


interface Props {
  code: string;
  lang: string;
  onChange?: (value: string | undefined) => void; // Optional, for editing
  readOnly?: boolean;
}

export const MonacoCodeView = ({ code, lang, onChange, readOnly = true }: Props) => (
  <MonacoEditor
    height="100%"
    defaultLanguage={lang}
    defaultValue={code}
    theme="solarized-dark"
    options={{
      readOnly,
      minimap: { enabled: false },
      fontSize: 12,
      scrollBeyondLastLine: false,
      wordWrap: "on",
    }}
    onChange={onChange}
  />
);