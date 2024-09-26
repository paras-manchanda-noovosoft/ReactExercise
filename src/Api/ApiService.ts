export class ApiService {

    async fetch(url: string, options: RequestInit,body?:any) {
        try {
            const response = await fetch(url, options);
            return await response.json();
        } catch (error) {
            console.error("Error during fetch:", error);
            throw error;
        }
    }

    async get(endpoint: string) {
        return this.fetch(`${endpoint}`, {method: 'GET'});
    }


    async post(endpoint: string, data: any) {
        return this.fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    async put(endpoint: string, data: any) {
        return this.fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

}