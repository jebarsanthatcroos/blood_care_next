jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number; headers?: Record<string, string> }) => ({
      status: init?.status ?? 200,
      headers: init?.headers ?? {},
      json: async () => body,
    }),
  },
}));

import { GET, POST } from './route';

const verifyIdToken = jest.fn();
const getCollection = jest.fn();
const where = jest.fn();
const get = jest.fn();
const add = jest.fn();
const getRedis = jest.fn();

const createMockRequest = (headers?: Record<string, string>) => {
  const request = {
    headers: {
      get: (name: string) => headers?.[name] ?? headers?.[name.toLowerCase()] ?? null,
    },
  };

  return request as never;
};

jest.mock('@/lib/firebase-admin', () => ({
  getAdminAuth: () => ({ verifyIdToken }),
  getAdminDb: () => ({ collection: getCollection }),
}));

jest.mock('@/lib/redis', () => ({
  getRedis: () => getRedis(),
}));

describe('donations API route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getCollection.mockReturnValue({ add, where });
    where.mockReturnValue({ get });
    getRedis.mockResolvedValue({
      get: jest.fn().mockResolvedValue(null),
      setEx: jest.fn().mockResolvedValue(undefined),
    });
  });

  it('returns 401 when no bearer token is provided', async () => {
    const request = createMockRequest();

    const response = await GET(request);

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body).toEqual({ error: 'Unauthorized' });
  });

  it('returns donation data for an authenticated user', async () => {
    verifyIdToken.mockResolvedValue({ email: 'jebarsanthatcroosgmail.com' });
    get.mockResolvedValue({
      docs: [
        {
          id: '1',
          data: () => ({
            fullName: 'Jebarsanthatcroos',
            bloodType: 'O+',
            phone: '123',
            email: 'jebarsanthatcroosgmail.com',
            city: 'mannar',
            preferredDate: '2026-08-16',
            message: 'Happy to help',
            status: 'approved',
            createdAt: { toMillis: () => 100, toDate: () => new Date('2026-07-31') },
          }),
        },
      ],
    });

    const request = createMockRequest({ authorization: 'Bearer test-token' });

    const response = await GET(request);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body[0]).toMatchObject({ fullName: 'Jebarsanthatcroos', bloodType: 'O+' });
    expect(body[0].createdAt).toBe('2026-07-31T00:00:00.000Z');
  });

  it('creates a donor record for an authenticated user', async () => {
    verifyIdToken.mockResolvedValue({ email: 'test@example.com', uid: 'user-1' });
    add.mockResolvedValue({ id: 'new-donor-id' });

    const request = {
      headers: {
        get: (name: string) => (name.toLowerCase() === 'authorization' ? 'Bearer test-token' : null),
      },
      json: async () => ({
        fullName: 'Jebarsan Thatcroos',
        bloodType: 'O+',
        phone: '0771234567',
        city: 'Colombo',
        preferredDate: '2026-08-16',
        message: 'Ready to help',
      }),
    } as never;

    const response = await POST(request);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({ id: 'new-donor-id' });
    expect(add).toHaveBeenCalledWith(expect.objectContaining({
      fullName: 'Jebarsan Thatcroos',
      email: 'test@example.com',
      status: 'pending',
    }));
  });
});
