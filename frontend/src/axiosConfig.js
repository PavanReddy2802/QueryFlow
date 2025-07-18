// src/axiosConfig.js
import axios from 'axios';
import axiosRetry from 'axios-retry';

// Apply retry logic to all axios requests
axiosRetry(axios, {
  retries: 3,                                // try up to 3 times
  retryDelay: axiosRetry.exponentialDelay,   // increasing backoff delay
  retryCondition: (error) => {
    // retry on network errors or idempotent request errors (GET, HEAD, OPTIONS)
    return axiosRetry.isNetworkOrIdempotentRequestError(error);
  },
});

export default axios;
