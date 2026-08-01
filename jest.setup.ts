import '@testing-library/jest-dom';

const mockFetchResponse = () => ({
  ok: true,
  status: 200,
  statusText: 'OK',
  json: async () => ({}),
  text: async () => '{}',
});

if (typeof globalThis.fetch === 'undefined') {
  globalThis.fetch = jest.fn(() => Promise.resolve(mockFetchResponse())) as unknown as typeof fetch;
}

if (typeof globalThis.Response === 'undefined') {
  class MockResponse {
    ok: boolean;
    status: number;
    statusText: string;
    body: string;

    constructor(body?: BodyInit | null, init?: ResponseInit) {
      this.body = body ? String(body) : '';
      this.ok = (init?.status ?? 200) >= 200 && (init?.status ?? 200) < 300;
      this.status = init?.status ?? 200;
      this.statusText = init?.statusText ?? 'OK';
    }

    async json() {
      return JSON.parse(this.body || '{}');
    }

    async text() {
      return this.body;
    }
  }

  globalThis.Response = MockResponse as unknown as typeof Response;
}

if (typeof globalThis.Request === 'undefined') {
  class MockRequest {
    constructor(public input: string | URL | Request, public init?: RequestInit) {}
  }

  globalThis.Request = MockRequest as unknown as typeof Request;
}

if (typeof globalThis.Headers === 'undefined') {
  class MockHeaders {
    constructor(init?: HeadersInit) {}
  }

  globalThis.Headers = MockHeaders as unknown as typeof Headers;
}
