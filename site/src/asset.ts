declare const __ASSETS__: Record<string, string>

export const asset = (path: string): string => __ASSETS__[path] ?? path
