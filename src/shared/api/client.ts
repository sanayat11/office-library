export const API_URL = (import.meta.env.VITE_API_URL || '/api/v1')
    .replace(/\/$/, '')
    .replace(/^http:/, 'https:');

const getHeaders = (): HeadersInit => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

const constructUrl = (endpoint: string, params: Record<string, any> = {}): string => {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    let urlString = `${API_URL}${cleanEndpoint}`;
    let url: URL;
    try {
        url = new URL(urlString);
    } catch (e) {
        url = new URL(urlString, window.location.origin);
    }

    Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
            url.searchParams.append(key, String(params[key]));
        }
    });

    return url.toString();
};

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (response.status === 401) {
        console.error("Authentication Error: 401 Unauthorized");
        localStorage.removeItem('token');
        if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
        }
        throw new Error('Unauthorized');
    }

    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    if (!response.ok) {
        let errorMessage = response.statusText;
        if (isJson) {
            try {
                const errorData = await response.json();
                console.error("API Error Response:", errorData);
                errorMessage = (errorData && errorData.detail)
                    ? (Array.isArray(errorData.detail) ? errorData.detail[0].msg : errorData.detail)
                    : response.statusText;
            } catch (e) {
                console.error("Error parsing API error response", e);
            }
        } else {
            const text = await response.text();
            console.error("API Error (Non-JSON):", response.status, text);
        }
        throw new Error(errorMessage);
    }

    if (isJson) {
        return await response.json() as T;
    }

    return null as T;
};

export const api = {
    get: async <T>(endpoint: string, params: Record<string, any> = {}): Promise<T> => {
        const response = await fetch(constructUrl(endpoint, params), {
            method: 'GET',
            headers: getHeaders(),
        });
        return handleResponse<T>(response);
    },

    post: async <T>(endpoint: string, body: any, params: Record<string, any> = {}): Promise<T> => {
        const headers = getHeaders() as Record<string, string>;
        let finalBody = body;

        if (body instanceof URLSearchParams) {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
        } else if (body instanceof FormData) {
            delete headers['Content-Type']; // Let browser set boundary
        } else if (body && typeof body === 'object') {
            finalBody = JSON.stringify(body);
        }

        const response = await fetch(constructUrl(endpoint, params), {
            method: 'POST',
            headers: headers,
            body: finalBody,
        });
        return handleResponse<T>(response);
    },

    put: async <T>(endpoint: string, body: any, params: Record<string, any> = {}): Promise<T> => {
        const headers = getHeaders() as Record<string, string>;
        let finalBody = body;

        if (body instanceof FormData) {
            delete headers['Content-Type'];
        } else if (body && typeof body === 'object') {
            finalBody = JSON.stringify(body);
        }

        const response = await fetch(constructUrl(endpoint, params), {
            method: 'PUT',
            headers: headers,
            body: finalBody,
        });
        return handleResponse<T>(response);
    },

    patch: async <T>(endpoint: string, body: any, params: Record<string, any> = {}): Promise<T> => {
        const headers = getHeaders() as Record<string, string>;
        let finalBody = body;

        if (body instanceof FormData) {
            delete headers['Content-Type'];
        } else if (body && typeof body === 'object') {
            finalBody = JSON.stringify(body);
        }

        const response = await fetch(constructUrl(endpoint, params), {
            method: 'PATCH',
            headers: headers,
            body: finalBody,
        });
        return handleResponse<T>(response);
    },

    delete: async <T>(endpoint: string, params: Record<string, any> = {}): Promise<T> => {
        const response = await fetch(constructUrl(endpoint, params), {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse<T>(response);
    }
};
