/**
 * MSAL Configuration for Azure AD Authentication
 *
 * These values will be injected at build time via window.AZURE_CONFIG
 * or can be set as environment variables during development
 */

import type { Configuration, PopupRequest } from '@azure/msal-browser';

// Extend Window interface for TypeScript
declare global {
  interface Window {
    AZURE_CONFIG?: {
      clientId: string;
      tenantId: string;
      functionUrl: string;
    };
  }
}

// Get configuration from window object (injected in production build)
// or environment variables (for local development)
const getConfig = () => {
  if (typeof window !== 'undefined' && window.AZURE_CONFIG) {
    return window.AZURE_CONFIG;
  }

  return {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || 'REPLACE_WITH_CLIENT_ID',
    tenantId: import.meta.env.VITE_AZURE_TENANT_ID || 'REPLACE_WITH_TENANT_ID',
    functionUrl: import.meta.env.VITE_AZURE_FUNCTION_URL || 'http://localhost:7071'
  };
};

const config = getConfig();

// Debug: Log configuration (remove in production)
console.log('MSAL Config:', {
  clientId: config.clientId,
  tenantId: config.tenantId,
  functionUrl: config.functionUrl,
  isConfigured: config.clientId !== 'REPLACE_WITH_CLIENT_ID'
});

/**
 * MSAL Configuration
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: config.clientId,
    authority: `https://login.microsoftonline.com/${config.tenantId}`,
    redirectUri: typeof window !== 'undefined' ? window.location.origin : '',
    postLogoutRedirectUri: typeof window !== 'undefined' ? window.location.origin : '',
  },
  cache: {
    cacheLocation: 'localStorage'
  }
};

/**
 * Scopes for login request
 */
export const loginRequest: PopupRequest = {
  scopes: ['User.Read'],
  prompt: 'select_account'
};

/**
 * Azure Function API configuration
 */
export const apiConfig = {
  functionUrl: config.functionUrl,
  endpoints: {
    fetchAndAnalyze: '/api/fetch-and-analyze'
  }
};

/**
 * Helper to check if MSAL is properly configured
 */
export const isMsalConfigured = (): boolean => {
  return (
    config.clientId !== 'REPLACE_WITH_CLIENT_ID' &&
    config.tenantId !== 'REPLACE_WITH_TENANT_ID'
  );
};
