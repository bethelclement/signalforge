import { describe, it, expect } from 'vitest';
import { POST } from './route';

const VALID_CATEGORIES = [
  'Clear PET Bottles (High Salvage)',
  'Mixed Colored PET Bottles',
  'Aluminum Beverage Cans',
  'Tin/Scrap Metal Containers',
  'Corrugated Cardboard (Baled)',
  'HDPE Plastics (Detergent/Milk)',
  'LDPE Plastics (Pure Water Sachets)',
  'Polypropylene (Food Packs)',
  'Glass Bottles (Clear/Flint)',
  'E-Waste (Small Electronics)',
  'Lead-Acid Car Batteries',
  'Construction Debris',
  'General Non-Recyclable',
];

const VALID_VOLUMES = [
  'Small (1-2 bags)',
  'Medium (3-5 bags)',
  'Large (Industrial Batch)',
  'Industrial (Truckload)',
];

function makeRequest(body: Record<string, unknown>) {
  return new Request('http://localhost:3000/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/analyze', () => {
  describe('fallback mode (no Gemini key)', () => {
    it('returns complete analysis object', async () => {
      const res = await POST(makeRequest({
        imageBase64: 'data:image/jpeg;base64,/9j/4AAQSkZJRg=='
      }));
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toHaveProperty('category');
      expect(data).toHaveProperty('volume');
      expect(data).toHaveProperty('estimatedCost');
      expect(data).toHaveProperty('confidence_score');
      expect(data).toHaveProperty('description');
      expect(data).toHaveProperty('source');
    });

    it('returns NEURAL_DETERMINISTIC_MATRIX_FALLBACK source', async () => {
      const res = await POST(makeRequest({
        imageBase64: 'data:image/jpeg;base64,/9j/4AAQSkZJRg=='
      }));
      const data = await res.json();
      expect(data.source).toBe('NEURAL_DETERMINISTIC_MATRIX_FALLBACK');
    });

    it('returns valid category from known taxonomy', async () => {
      const res = await POST(makeRequest({
        imageBase64: 'data:image/jpeg;base64,/9j/4AAQSkZJRg=='
      }));
      const data = await res.json();
      expect(VALID_CATEGORIES).toContain(data.category);
    });

    it('returns valid volume string', async () => {
      const res = await POST(makeRequest({
        imageBase64: 'data:image/jpeg;base64,/9j/4AAQSkZJRg=='
      }));
      const data = await res.json();
      expect(VALID_VOLUMES).toContain(data.volume);
    });

    it('returns cost within expected Lagos pricing range', async () => {
      const res = await POST(makeRequest({
        imageBase64: 'data:image/jpeg;base64,/9j/4AAQSkZJRg=='
      }));
      const data = await res.json();
      expect(data.estimatedCost).toBeGreaterThanOrEqual(1500);
      expect(data.estimatedCost).toBeLessThanOrEqual(15000);
    });

    it('returns confidence score between 0.92 and 1.0', async () => {
      const res = await POST(makeRequest({
        imageBase64: 'data:image/jpeg;base64,/9j/4AAQSkZJRg=='
      }));
      const data = await res.json();
      expect(data.confidence_score).toBeGreaterThanOrEqual(0.92);
      expect(data.confidence_score).toBeLessThanOrEqual(1.0);
    });

    it('returns non-empty description', async () => {
      const res = await POST(makeRequest({
        imageBase64: 'data:image/jpeg;base64,/9j/4AAQSkZJRg=='
      }));
      const data = await res.json();
      expect(data.description.length).toBeGreaterThan(10);
    });
  });

  describe('input handling', () => {
    it('strips data URI prefix from base64', async () => {
      const res = await POST(makeRequest({
        imageBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg=='
      }));
      expect(res.status).toBe(200);
    });

    it('handles raw base64 without data URI prefix', async () => {
      const res = await POST(makeRequest({
        imageBase64: '/9j/4AAQSkZJRgABAQAAAQABAAD'
      }));
      expect(res.status).toBe(200);
    });

    it('returns fallback when no image data provided', async () => {
      const res = await POST(makeRequest({}));
      const data = await res.json();
      expect(res.status).toBe(200);
      expect(data.source).toBe('NEURAL_DETERMINISTIC_MATRIX_FALLBACK');
    });
  });
});
