import { NextRequest, NextResponse } from 'next/server';
import {Timestamp } from 'firebase-admin/firestore';
import { getAdminAuth, getAdminDb } from '../../../lib/firebase-admin';
import { getRedis } from '../../../lib/redis';

export const dynamic = 'force-dynamic';

interface DonorRecord {
  fullName: string;
  bloodType: string;
  phone: string;
  email: string;
  city: string;
  preferredDate: string;
  message: string;
  status: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

async function getUser(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) return null;

  try {
    return await getAdminAuth().verifyIdToken(authorization.slice(7));
  } catch {
    return null;
  }
}

function cacheKey(email: string) {
  return `donations:${email.toLowerCase()}`;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let body: Partial<DonorRecord>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
    const bloodType = typeof body.bloodType === 'string' ? body.bloodType.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const city = typeof body.city === 'string' ? body.city.trim() : '';
    const preferredDate = typeof body.preferredDate === 'string' ? body.preferredDate.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!fullName || !bloodType || !phone || !city) {
      return NextResponse.json({ error: 'Missing required donor fields' }, { status: 400 });
    }

    const donorRecord: DonorRecord = {
      fullName,
      bloodType,
      phone,
      email: user.email,
      city,
      preferredDate,
      message,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await getAdminDb().collection('donors').add(donorRecord);
    return NextResponse.json({ id: docRef.id });
  } catch (error) {
    console.error('Failed to create donor registration', error);
    return NextResponse.json({ error: 'Firebase service unavailable' }, { status: 503 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const key = cacheKey(user.email);
    try {
      const redis = await getRedis();
      if (redis) {
        const cached = await redis.get(key);
        if (cached) return NextResponse.json(JSON.parse(cached), { headers: { 'X-Cache': 'HIT' } });
      }
    } catch (error) {
      console.warn('Redis read skipped:', error);
    }

    const snapshot = await getAdminDb().collection('donors').where('email', '==', user.email).get();
    const donations = snapshot.docs
      .map((document) => ({ id: document.id, ...(document.data() as DonorRecord) }))
      .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));

    const payload = donations.map((donation) => ({
      ...donation,
      createdAt: donation.createdAt?.toDate?.().toISOString() ?? null,
    }));

    try {
      const redis = await getRedis();
      if (redis) {
        await redis.setEx(key, 60, JSON.stringify(payload));
      }
    } catch (error) {
      console.warn('Redis write skipped:', error);
    }

    return NextResponse.json(payload, { headers: { 'X-Cache': 'MISS' } });
  } catch (error) {
    console.error('Failed to read donor registrations', error);
    return NextResponse.json({ error: 'Firebase service unavailable' }, { status: 503 });
  }
}