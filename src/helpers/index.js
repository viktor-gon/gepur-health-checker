const axios = require('axios');

export const checkUrl = (url, options) => {
    const headers = {};

    if (options.headers) {
        Object.assign(headers, options.headers);
    }
    
    return axios.get(url, {maxRedirects: 0, headers});
}
