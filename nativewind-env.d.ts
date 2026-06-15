/// <reference types="nativewind/types" />

// Declaração para permitir a importação de arquivos .css sem erros do TypeScript
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}
