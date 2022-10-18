import { API_BASE_URL } from "./config";

export async function getPersons() {
    const response = await fetch(`${API_BASE_URL}`);
    if (response.status !== 200) {
        throw new Error(`Fetching tasks failed, status ${response.status}`);
    }
    return await response.json();
}

export async function findPerson(id) {
    const response = await fetch(`${API_BASE_URL}/?term=${id}`);
    if (response.status !== 200) {
        throw new Error(`Fetching tasks failed, status ${response.status}`);
    }
    return await response.json();
}