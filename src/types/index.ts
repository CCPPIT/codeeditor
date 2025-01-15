import  monaco  from "monaco-editor"
import { Id } from "../../convex/_generated/dataModel";


export interface Theme{
    id:string;
    label:string;
    color:string;
}
export interface Language {
    id: string;
    label: string;
    logoPath: string;
    monacoLanguage: string;
    defaultCode: string;
    pistonRuntime: LanguageRuntime;
  }
export interface LanguageRuntime{
    language:string;
    version:string
}
export interface ExecuteCodeResponse{
    compile?:{
        output:string

    };
    run?:{
        output:string;
        stderr:string
    }
}
export interface ExecutionResult{
    code:string;
    output:string;
    error:string|null;
}
export interface CodeEditorState{
    theme:string;
    setTheme:(theme:string)=>void
    language:string;
    setLanguage:(language:string)=>void
    output:string;
    editor: monaco.editor.IStandaloneCodeEditor | null
    setEditor:(editor:monaco.editor.IStandaloneCodeEditor)=>void;
    getCode:()=>string;
    isRunning:boolean;
    error:string|null;
    executionResult:ExecutionResult|null;
    fontSize:number;
    setFontSize:(fontSize:number)=>void;
    runCode:()=>Promise<void>

}
export interface Snippet {
    _id: Id<"snippets">;
    _creationTime: number;
    userId: string;
    language: string;
    code: string;
    title: string;
    userName: string;
  }