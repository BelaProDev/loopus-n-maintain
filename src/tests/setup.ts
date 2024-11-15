import '@testing-library/jest-dom';
import { server } from './mocks/server';
import { expect, afterAll, afterEach, beforeAll } from 'vitest';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());