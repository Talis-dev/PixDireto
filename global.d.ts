// Tipos globais para módulos Expo

declare module "expo-file-system/legacy" {
  export const cacheDirectory: string | null;
  export const documentDirectory: string | null;

  export function readAsStringAsync(
    fileUri: string,
    options?: { encoding?: "utf8" | "base64" }
  ): Promise<string>;

  export function writeAsStringAsync(
    fileUri: string,
    contents: string,
    options?: { encoding?: "utf8" | "base64" }
  ): Promise<void>;

  export function deleteAsync(
    fileUri: string,
    options?: { idempotent?: boolean }
  ): Promise<void>;

  export function getInfoAsync(
    fileUri: string,
    options?: { md5?: boolean; size?: boolean }
  ): Promise<{
    exists: boolean;
    uri: string;
    size?: number;
    md5?: string;
    modificationTime?: number;
    isDirectory?: boolean;
  }>;

  export function makeDirectoryAsync(
    fileUri: string,
    options?: { intermediates?: boolean }
  ): Promise<void>;

  export function readDirectoryAsync(fileUri: string): Promise<string[]>;

  export function downloadAsync(
    uri: string,
    fileUri: string,
    options?: object
  ): Promise<{
    uri: string;
    status: number;
    headers: Record<string, string>;
    md5?: string;
  }>;
}
