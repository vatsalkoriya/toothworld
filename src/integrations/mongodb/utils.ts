// Real MongoDB utilities calling the backend API
export class ObjectId {
    private id: string;
    constructor(id?: string) {
        this.id = id || ""; // Backend will handle ID generation if empty
    }
    toString() { return this.id; }
}

const API_BASE = "/api";

async function readJsonOrError(response: Response, action: string) {
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
        const text = await response.text();
        const snippet = text.replace(/\s+/g, " ").slice(0, 200);
        return {
            data: null,
            error: `${action} failed: non-JSON response (${response.status}). ${snippet || "No response body."}`
        };
    }

    try {
        const json = await response.json();
        if (!response.ok) {
            return {
                data: null,
                error: json?.error || `${action} failed with status ${response.status}`
            };
        }
        return json;
    } catch (error) {
        return {
            data: null,
            error: `${action} failed: invalid JSON response`
        };
    }
}

export async function insertOne(collectionName: string, document: any) {
    try {
        const response = await fetch(`${API_BASE}/${collectionName}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operation: 'insertOne', document })
        });
        return await readJsonOrError(response, `Insert into ${collectionName}`);
    } catch (error) {
        console.error(`Error inserting into ${collectionName}:`, error);
        return { data: null, error: error instanceof Error ? error.message : 'Insert failed' };
    }
}

export async function findOne(collectionName: string, filter: any) {
    try {
        const response = await fetch(`${API_BASE}/${collectionName}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operation: 'findOne', filter })
        });
        return await readJsonOrError(response, `Find in ${collectionName}`);
    } catch (error) {
        console.error(`Error finding in ${collectionName}:`, error);
        return { data: null, error: error instanceof Error ? error.message : 'Find failed' };
    }
}

export async function findMany(collectionName: string, filter: any = {}, options: any = {}) {
    try {
        const query = new URLSearchParams({
            filter: JSON.stringify(filter),
            sort: JSON.stringify(options.sort || {}),
            limit: (options.limit || 0).toString()
        });
        const response = await fetch(`${API_BASE}/${collectionName}?${query}`);
        return await readJsonOrError(response, `Find many in ${collectionName}`);
    } catch (error) {
        console.error(`Error finding many in ${collectionName}:`, error);
        return { data: [], error: error instanceof Error ? error.message : 'Find failed' };
    }
}

export async function updateOne(collectionName: string, filter: any, update: any) {
    try {
        const response = await fetch(`${API_BASE}/${collectionName}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filter, update })
        });
        return await readJsonOrError(response, `Update in ${collectionName}`);
    } catch (error) {
        console.error(`Error updating in ${collectionName}:`, error);
        return { data: null, error: error instanceof Error ? error.message : 'Update failed' };
    }
}

export async function deleteOne(collectionName: string, filter: any) {
    try {
        const response = await fetch(`${API_BASE}/${collectionName}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filter })
        });
        return await readJsonOrError(response, `Delete from ${collectionName}`);
    } catch (error) {
        console.error(`Error deleting from ${collectionName}:`, error);
        return { data: null, error: error instanceof Error ? error.message : 'Delete failed' };
    }
}

export function objectIdToString(obj: any): any {
    if (!obj) return obj;
    if (obj._id) return { ...obj, id: obj._id.toString() };
    return obj;
}

export function stringToObjectId(id: string): any {
    // Pass filter as an object with _id, backend will convert it for Mongoose
    return { _id: id };
}
