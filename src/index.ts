export * from './value-object';

export interface AppConfig {
  apiKey?: string;
  githubToken?: string;
}

// Las credenciales se leen desde variables de entorno (nunca hardcodeadas).
export function getConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return {
    apiKey: env.API_KEY,
    githubToken: env.GITHUB_TOKEN,
  };
}

export async function fetchData(
  config: AppConfig = getConfig()
): Promise<unknown> {
  if (!config.apiKey) {
    console.warn('API_KEY no está configurada; se omite la consulta.');
    return undefined;
  }

  try {
    const url = `https://api.example.com/data?api_key=${encodeURIComponent(
      config.apiKey
    )}`;
    const response = await fetch(url);
    const data: unknown = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error:', error);
    return undefined;
  }
}

// Solo se ejecuta al correr "node dist/index.js", no al importar la librería.
if (require.main === module) {
  void fetchData();
}
