import { describe, it, expect } from 'vitest'
import { onRequestGet } from '.'
import getContext from '@/test/getContext'

describe('GET /api/templates', () => {
  it('returns list of templates even for unuathorized users', async () => {
    const request = new Request('x:')
    const response = await onRequestGet(getContext(request))

    expect(response.status).toBe(200)
    const json = await response.json()
    expect(json).toEqual([
      {
        id: 'tp_1',
        createdAt: expect.any(String),
        name: 'Test Template',
        previewShape: 'SQUARE',
      },
      {
        createdAt: expect.any(String),
        id: 'tp_2',
        name: 'Another Template',
        previewShape: 'RECTANGLE',
      },
      {
        createdAt: expect.any(String),
        id: 'tp_3',
        name: 'Yet Another Template',
        previewShape: 'CIRCLE',
      },
    ])
  })
})
