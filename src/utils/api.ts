const BASE_URL = "/api";

export function getWorkspaceId(): string {
    return localStorage.getItem('discovery_workspace_id') || import.meta.env.VITE_WORKSPACE_ID || "workspace-default";
}

export interface ApiError {
    error: string;
    code: string;
    status: number;
    details?: Record<string, unknown>;
    timestamp?: string;
}

export class APIException extends Error {
    constructor(
        public status: number,
        public code: string,
        message: string,
        public details?: Record<string, unknown>
    ) {
        super(message);
        this.name = "APIException";
    }
}

async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    let token = localStorage.getItem("discovery_token");
    const headers = new Headers(options.headers || {});
    
    // Use demo token if no token exists (fallback for demo mode)
    if (!token) {
        token = "demo-token-" + (localStorage.getItem("discovery_user") || "anonymous");
    }
    
    headers.set("Authorization", `Bearer ${token}`);
    
    if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            // Handle 401/403 errors gracefully in demo mode
            if ((response.status === 401 || response.status === 403) && token?.startsWith("demo-token-")) {
                console.warn(`[Demo Mode] Handling ${response.status} error gracefully`, endpoint);
                // Return empty/mock data for demo mode instead of throwing
                return {} as T;
            }
            
            let errorData: ApiError;
            try {
                errorData = await response.json();
            } catch {
                errorData = {
                    error: `HTTP ${response.status}`,
                    code: "HTTP_ERROR",
                    status: response.status,
                };
            }
            throw new APIException(
                response.status,
                errorData.code || "HTTP_ERROR",
                errorData.error || `HTTP error! Status: ${response.status}`,
                errorData.details
            );
        }

        return response.json() as Promise<T>;
    } catch (error) {
        if (error instanceof APIException) throw error;
        throw new APIException(500, "NETWORK_ERROR", error instanceof Error ? error.message : "Network error occurred");
    }
}

export const api = {
    // Authentication (Firebase token exchange)
    auth: {
        login: async (idToken: string, userData: { email: string | null; name: string | null; avatar: string | null }) => {
            console.log("[STEP 4.1] api.auth.login: Calling POST /api/auth/login");
            try {
                const result = await apiRequest<any>("/auth/login", {
                    method: "POST",
                    body: JSON.stringify({ id_token: idToken, ...userData }),
                });
                console.log("[STEP 4.2] api.auth.login: Response received", { hasToken: !!result?.token, hasWorkspaceId: !!result?.workspace_id });
                return result;
            } catch (error) {
                console.error("[STEP 4 ERROR] api.auth.login: Error occurred", error);
                // Only fall back to mock data when the backend is unreachable
                if (error instanceof APIException && error.code === "NETWORK_ERROR") {
                    console.warn("[Fallback] Backend unreachable, using local session");
                    return {
                        token: idToken,
                        user: {
                            id: "local-" + (userData.email?.split("@")[0] || "user"),
                            email: userData.email,
                            name: userData.name || userData.email?.split("@")[0],
                            avatar: userData.avatar || "",
                        },
                        workspace_id: localStorage.getItem('discovery_workspace_id') || "workspace-default",
                    };
                }
                // Re-throw actual HTTP errors (401, 500, etc.)
                throw error;
            }
        },
        register: (idToken: string, userData: { email: string | null; name: string | null }) =>
            apiRequest<any>("/auth/register", {
                method: "POST",
                body: JSON.stringify({ id_token: idToken, ...userData }),
            }),
        me: () => apiRequest<any>("/auth/me"),
        logout: () => apiRequest<any>("/auth/logout", { method: "POST" }),
    },

    // Metadata (notifications, activity, context, etc.)
    metadata: {
        notifications: () => apiRequest<any[]>(`/workspaces/${getWorkspaceId()}/notifications`),
        activity: () => apiRequest<any[]>(`/workspaces/${getWorkspaceId()}/activity`),
        contextMemories: () => apiRequest<any[]>(`/workspaces/${getWorkspaceId()}/context-memories`),
        promptTemplates: () => apiRequest<any[]>(`/workspaces/${getWorkspaceId()}/prompt-templates`),
        fileConnectors: () => apiRequest<any[]>(`/workspaces/${getWorkspaceId()}/file-connectors`),
        exportCards: () => apiRequest<any[]>(`/workspaces/${getWorkspaceId()}/metadata/export-cards`),
    },

    // Health & Status
    health: () => apiRequest<any>("/health", { method: "GET" }),
    ready: () => apiRequest<any>("/health/ready", { method: "GET" }),

    // Dashboard
    dashboard: {
        kpis: () => apiRequest<any[]>(`/workspaces/${getWorkspaceId()}/dashboard/kpis`),
        painPoints: () => apiRequest<any[]>(`/workspaces/${getWorkspaceId()}/dashboard/pain-points`),
        recommendations: () => apiRequest<any[]>(`/workspaces/${getWorkspaceId()}/dashboard/recommendations`),
        sentiment: () => apiRequest<any>(`/workspaces/${getWorkspaceId()}/dashboard/sentiment`),
        feedbackTrend: (dateRange?: string) => 
            apiRequest<any>(`/workspaces/${getWorkspaceId()}/dashboard/feedback-trend${dateRange ? `?range=${dateRange}` : ""}`),
    },

    // Upload & Files
    files: {
        upload: (file: File, onProgress?: (pct: number) => void) => {
            return new Promise<any>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open("POST", `${BASE_URL}/workspaces/${getWorkspaceId()}/files/upload`);
                
                const token = localStorage.getItem("discovery_token");
                if (token) {
                    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
                }
                
                if (xhr.upload && onProgress) {
                    xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const percentComplete = Math.round((event.loaded / event.total) * 100);
                            onProgress(percentComplete);
                        }
                    };
                }
                
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            resolve(JSON.parse(xhr.responseText));
                        } catch {
                            resolve({ id: Math.random().toString(36).substring(2, 9), name: file.name, size: `${(file.size / 1024).toFixed(0)} KB`, type: file.name.split('.').pop() });
                        }
                    } else {
                        reject(new Error(`Upload failed with status ${xhr.status}`));
                    }
                };
                
                xhr.onerror = () => {
                    reject(new Error("Network error occurred during upload"));
                };
                
                const formData = new FormData();
                formData.append("file", file);
                xhr.send(formData);
            });
        },
        list: () => apiRequest<any[]>(`/workspaces/${getWorkspaceId()}/files`),
        get: (fileId: string) => apiRequest<any>(`/workspaces/${getWorkspaceId()}/files/${fileId}`),
        delete: (fileId: string) => apiRequest<any>(`/workspaces/${getWorkspaceId()}/files/${fileId}`, { method: "DELETE" }),
    },

    // Search
    search: {
        query: (q: string, filters?: Record<string, any>) =>
            apiRequest<any>(`/workspaces/${getWorkspaceId()}/search`, {
                method: "POST",
                body: JSON.stringify({ query: q, ...filters }),
            }),
        documents: (q: string) =>
            apiRequest<any>(`/workspaces/${getWorkspaceId()}/search/documents`, {
                method: "POST",
                body: JSON.stringify({ query: q }),
            }),
    },

    // Analytics & Insights
    analytics: {
        insights: () => apiRequest<any>(`/workspaces/${getWorkspaceId()}/analytics/insights`),
        trends: (metric: string, days?: number) =>
            apiRequest<any>(`/workspaces/${getWorkspaceId()}/analytics/trends/${metric}${days ? `?days=${days}` : ""}`),
    },

    // AI Copilot
    copilot: {
        chat: (message: string, conversationId?: string) =>
            apiRequest<any>(`/workspaces/${getWorkspaceId()}/copilot/chat`, {
                method: "POST",
                body: JSON.stringify({ text: message }),
            }),
        stream: (message: string, conversationId?: string) =>
            fetch(`${BASE_URL}/workspaces/${getWorkspaceId()}/copilot/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("discovery_token") || ""}`,
                },
                body: JSON.stringify({ text: message }),
            }),
        history: (conversationId?: string) =>
            apiRequest<any>(`/workspaces/${getWorkspaceId()}/copilot/history${conversationId ? `?conversation_id=${conversationId}` : ""}`),
    },

    // Reports & Export
    reports: {
        generate: (format: "pdf" | "pptx" | "csv", filters?: Record<string, any>) =>
            apiRequest<any>(`/workspaces/${getWorkspaceId()}/reports/generate`, {
                method: "POST",
                body: JSON.stringify({ format, ...filters }),
            }),
        list: () => apiRequest<any[]>(`/workspaces/${getWorkspaceId()}/reports`),
        download: (reportId: string) =>
            fetch(`${BASE_URL}/workspaces/${getWorkspaceId()}/reports/${reportId}/download`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("discovery_token") || ""}` },
            }),
    },

    // Projects
    projects: {
        list: () => apiRequest<any[]>(`/workspaces/${getWorkspaceId()}/projects`),
        get: (projectId: string) => apiRequest<any>(`/workspaces/${getWorkspaceId()}/projects/${projectId}`),
        create: (data: Record<string, any>) =>
            apiRequest<any>(`/workspaces/${getWorkspaceId()}/projects`, {
                method: "POST",
                body: JSON.stringify(data),
            }),
        update: (projectId: string, data: Record<string, any>) =>
            apiRequest<any>(`/workspaces/${getWorkspaceId()}/projects/${projectId}`, {
                method: "PUT",
                body: JSON.stringify(data),
            }),
    },

    // Data Sources & Integrations
    datasources: {
        list: () => apiRequest<any[]>(`/workspaces/${getWorkspaceId()}/datasources`),
        get: (dsId: string) => apiRequest<any>(`/workspaces/${getWorkspaceId()}/datasources/${dsId}`),
        sync: (dsId: string) =>
            apiRequest<any>(`/workspaces/${getWorkspaceId()}/datasources/${dsId}/sync`, { method: "POST" }),
        connect: (serviceType: string, config: Record<string, any>) =>
            apiRequest<any>(`/workspaces/${getWorkspaceId()}/datasources/connect`, {
                method: "POST",
                body: JSON.stringify({ service_type: serviceType, config }),
            }),
    },

    // Settings
    settings: {
        get: () => apiRequest<any>(`/workspaces/${getWorkspaceId()}/settings`),
        update: (data: Record<string, any>) =>
            apiRequest<any>(`/workspaces/${getWorkspaceId()}/settings`, {
                method: "PUT",
                body: JSON.stringify(data),
            }),
    },

    // Workspaces
    workspaces: {
        list: () => apiRequest<any[]>("/workspaces"),
        get: (wsId: string) => apiRequest<any>(`/workspaces/${wsId}`),
        create: (data: Record<string, any>) =>
            apiRequest<any>("/workspaces", {
                method: "POST",
                body: JSON.stringify(data),
            }),
    },
};
