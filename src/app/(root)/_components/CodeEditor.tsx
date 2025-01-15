import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';

interface EditorProps {
    language: string;
    theme: string;
    onChange: (value: string) => void;
    height?: string;
    fontSize?: number;
    onMount:(editor:monaco.editor.IStandaloneCodeEditor)=>void
    beforeMount:()=>void
}

const CodeEditor= ({ language, theme, onChange, height = "600px", fontSize = 14 }:EditorProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const editorRef = useRef<any>(null);
    const [editor, setEditor] = useState(null);

    useEffect(() => {
        // إنشاء المحرر
        editorRef.current = monaco.editor.create(document.getElementById('editor-container')!, {
            value: '',
            language,
            theme,
            
            minimap: { enabled: true },
            fontSize,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            renderWhitespace: "selection",
            fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
            fontLigatures: true,
            cursorBlinking: "smooth",
            smoothScrolling: true,
            contextmenu: true,
            renderLineHighlight: "all",
            lineHeight: 1.6,
            letterSpacing: 0.5,
            roundedSelection: true,
            scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
            },
        });

        setEditor(editorRef.current);

        // التعامل مع تغيير القيمة
        editorRef.current.onDidChangeModelContent(() => {
            const value = editorRef.current.getValue();
            onChange(value);
        });

        // التنظيف عند إزالة المكون
        return () => {
            editorRef.current.dispose();
        };
    }, [language, theme, onChange, fontSize]);

    useEffect(() => {
        if (editor) {
            monaco.editor.setTheme(theme);
        }
    }, [theme, editor]);

    return <div id="editor-container" style={{ height }} />;
};

export default CodeEditor;