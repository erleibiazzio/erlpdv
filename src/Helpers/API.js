class API {
    constructor() {
        this.url = null;
        this.response;
        this.headers = {}
    }

    async POST(data) {
        try {
            const response = await fetch(this.url, {
                method: 'POST',
                headers: this.getHeaders(data),
                body: this.parseData(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response;
        } catch (e) {
            // Retorne um objeto de erro personalizado ou lance um erro
            return { status: 0, statusText: 'erro inesperado', error: e };
        }
    }

    async PATCH(data) {
        return this.request('PATCH', data);
    }

    async GET(data) {
        return this.request('GET', data);
    }

    async PUT(data) {
        return this.request('PUT', data);
    }

    async DELETE(data) {
        return this.request('DELETE', data);
    }

    async request(method, data) {
        try {
            const response = await fetch(this.url, {
                method: method,
                headers: this.getHeaders(data),
                body: this.parseData(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response;
        } catch (e) {
            // Retorne um objeto de erro personalizado ou lance um erro
            return { status: 0, statusText: 'erro inesperado', error: e };
        }
    }

    setHeaders(data) {
        Object.keys(data).forEach((element) => {
            this.headers[element] = data[element]
        })
    }

    getHeaders(data) {
        if (data instanceof FormData) {
            return {};
        } else {
            this.headers['Content-Type'] = 'application/json';
            return this.headers;
        }
    }

    parseData(data) {
        if (data instanceof FormData) {
            return data;
        } else {
            return JSON.stringify(data);
        }
    }

    setUrl(url) {
        this.url = url;
    }

    createUrl(group, action = null, args = {}) {
        let baseurl = process.env.VUE_APP_URL_BASE;
        var queryStr = "";
        if (Object.keys(args).length != 0) {
            queryStr = "?" + new URLSearchParams(args).toString();
        }
        this.url = action ? baseurl + "/" + group + "/" + action : baseurl + "/" + group;
        if (args) {
            this.url = this.url + queryStr;
        }
        return this.url;
    }
}

export default API;