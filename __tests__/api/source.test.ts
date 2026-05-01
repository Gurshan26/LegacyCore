import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { GET } from '@/app/api/source/route';

describe('GET /api/source', () => {
  it('returns source for valid program', async () => {
    const request = new NextRequest('http://localhost/api/source?program=tax');
    const response = await GET(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.filename).toBe('tax.cbl');
    expect(body.source).toContain('PROGRAM-ID');
  });

  it('returns 400 for invalid program', async () => {
    const request = new NextRequest('http://localhost/api/source?program=unknown');
    const response = await GET(request);
    expect(response.status).toBe(400);
  });
});
