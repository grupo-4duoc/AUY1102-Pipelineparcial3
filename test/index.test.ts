import { fetchData, getConfig } from '../src';

describe('index', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  describe('getConfig', () => {
    it('should read the credentials from environment variables', () => {
      const config = getConfig({ API_KEY: 'key-test', GITHUB_TOKEN: 'tok-test' });

      expect(config).toEqual({ apiKey: 'key-test', githubToken: 'tok-test' });
    });

    it('should return undefined values when the variables are not set', () => {
      expect(getConfig({})).toEqual({ apiKey: undefined, githubToken: undefined });
    });

    it('should use process.env by default', () => {
      process.env.API_KEY = 'env-key';

      expect(getConfig().apiKey).toBe('env-key');

      delete process.env.API_KEY;
    });
  });

  describe('fetchData', () => {
    it('should not call the API when API_KEY is not set', async () => {
      const fetchMock = jest.fn();
      global.fetch = fetchMock;
      jest.spyOn(console, 'warn').mockImplementation(() => undefined);

      const result = await fetchData({});

      expect(result).toBeUndefined();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('should call the API with the encoded key and return the data', async () => {
      const data = { ok: true };
      const fetchMock = jest.fn().mockResolvedValue({ json: () => Promise.resolve(data) });
      global.fetch = fetchMock;
      jest.spyOn(console, 'log').mockImplementation(() => undefined);

      const result = await fetchData({ apiKey: 'a b&c' });

      expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/data?api_key=a%20b%26c');
      expect(result).toEqual(data);
    });

    it('should return undefined and log the error when the request fails', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('sin red'));
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

      const result = await fetchData({ apiKey: 'key' });

      expect(result).toBeUndefined();
      expect(errorSpy).toHaveBeenCalled();
    });

    it('should use the configuration from the environment by default', async () => {
      const fetchMock = jest.fn();
      global.fetch = fetchMock;
      jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      delete process.env.API_KEY;

      await fetchData();

      expect(fetchMock).not.toHaveBeenCalled();
    });
  });
});
