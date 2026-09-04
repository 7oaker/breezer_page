import type { APIRoute } from 'astro';
import { feed } from '../../i18n/feed';

export const GET: APIRoute = () => feed('de');
