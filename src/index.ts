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

export const API_URL = 'https://api.example.com/data';

export async function fetchData(
  config: AppConfig = getConfig()
): Promise<unknown> {
  if (!config.apiKey) {
    console.warn('API_KEY no está configurada; se omite la consulta.');
    return undefined;
  }

  try {
    // La API key viaja en un header y no en la URL: las query strings quedan
    // registradas en logs de servidores, proxies e historial.
    const response = await fetch(API_URL, {
      headers: { 'x-api-key': config.apiKey },
    });
    const data: unknown = await response.json();
    // No se registran la respuesta ni el error: son datos externos sin sanitizar.
    console.info('Consulta a la API completada.');
    return data;
  } catch {
    console.error('Error al consultar la API.');
    return undefined;
  }
}

// Solo se ejecuta al correr "node dist/index.js", no al importar la librería.
if (require.main === module) {
  void fetchData();
}
