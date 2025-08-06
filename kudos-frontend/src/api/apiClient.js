// /Users/jonchun/Workspace/kudos/kudos-frontend/src/api/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3001/api',
});

// We use an interceptor to dynamically add the Authorization header to every request.
// This is much cleaner than adding it manually in every component.
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('kudos-token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;