/**
 * Viniyoga API Client
 * Stub for Phase 2 backend integration.
 * Currently all data is managed client-side via AppContext + localStorage.
 */

const getApiUrl = () => {
  return process.env.REACT_APP_API_URL || '';
};

export const warmUpBackend = async () => {
  try {
    const url = getApiUrl();
    if (url) {
      await fetch(`${url}/`, { method: 'GET' });
    }
  } catch (e) {
    console.warn('Backend not available, running in offline mode');
  }
};

export default getApiUrl;
