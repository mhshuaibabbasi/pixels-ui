
const isLocal = false; // Set this to true for local development

export const WEB_URL = 'https://pixels-server-io0i.onrender.com/pixels/';
export const LOCAL = 'http://localhost:3002/pixels/';

export const BASE_URL = isLocal ? LOCAL : WEB_URL;