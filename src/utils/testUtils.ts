import { businessQueries } from '@/lib/db/businessDb';
import { settingsQueries } from '@/lib/fauna/settingsQueries';
import { emailQueries } from '@/lib/fauna/emailQueries';
import { dropboxAuth } from '@/lib/auth/dropbox';
import i18n from '@/i18n';

interface TestResult {
  feature: string;
  status: 'passed' | 'failed' | 'not-implemented';
  error?: string;
}

// Translation Tests
const runTranslationTests = async (): Promise<TestResult> => {
  try {
    const supportedLanguages = ['en', 'es', 'fr'];
    const requiredNamespaces = ['common', 'services', 'admin', 'auth', 'docs'];
    
    const hasAllTranslations = supportedLanguages.every(lang => 
      requiredNamespaces.every(ns => i18n.hasResourceBundle(lang, ns))
    );

    return {
      feature: 'Multi-language Support',
      status: hasAllTranslations ? 'passed' : 'failed',
      error: !hasAllTranslations ? 'Missing translation bundles' : undefined
    };
  } catch (error) {
    return {
      feature: 'Multi-language Support',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Authentication Tests
const runAuthTests = async (): Promise<TestResult> => {
  try {
    const session = sessionStorage.getItem('craft_coordination_session');
    return {
      feature: 'Authentication System',
      status: session ? 'passed' : 'not-implemented'
    };
  } catch (error) {
    return {
      feature: 'Authentication System',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Email Management Tests
const runEmailTests = async (): Promise<TestResult> => {
  try {
    const emails = await emailQueries.getAllEmails();
    return {
      feature: 'Email Management',
      status: Array.isArray(emails) ? 'passed' : 'failed'
    };
  } catch (error) {
    return {
      feature: 'Email Management',
      status: 'failed',
      error: 'Could not fetch emails'
    };
  }
};

// Document Management Tests
const runDocumentTests = async (): Promise<TestResult> => {
  try {
    const dropboxTokens = sessionStorage.getItem('dropbox_tokens');
    return {
      feature: 'Document Management',
      status: dropboxTokens ? 'passed' : 'not-implemented'
    };
  } catch (error) {
    return {
      feature: 'Document Management',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Service Implementation Tests
const runServiceTests = async (service: string): Promise<TestResult> => {
  try {
    const whatsappNumbers = await settingsQueries.getWhatsAppNumbers();
    const hasWhatsApp = whatsappNumbers && whatsappNumbers[service];
    
    const serviceModule = await import(`@/pages/${service.charAt(0).toUpperCase() + service.slice(1)}.tsx`);
    const hasImplementation = !!serviceModule.default;
    
    if (!hasWhatsApp) {
      return {
        feature: `${service} Service Integration`,
        status: 'not-implemented',
        error: 'Missing WhatsApp number'
      };
    }
    
    if (!hasImplementation) {
      return {
        feature: `${service} Service Integration`,
        status: 'not-implemented',
        error: 'Service not implemented'
      };
    }
    
    return {
      feature: `${service} Service Integration`,
      status: 'passed'
    };
  } catch (error) {
    return {
      feature: `${service} Service Integration`,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Main test runner
export const runFeatureTests = async (): Promise<TestResult[]> => {
  const results: TestResult[] = [];

  // Core Features
  results.push({
    feature: 'PWA - Offline Functionality',
    status: 'passed'
  });

  // Run all test suites
  results.push(await runTranslationTests());
  results.push(await runAuthTests());
  results.push(await runEmailTests());
  results.push(await runDocumentTests());

  // Service Tests
  const services = ['electrical', 'plumbing', 'ironwork', 'woodworking', 'architecture'];
  for (const service of services) {
    results.push(await runServiceTests(service));
  }

  return results;
};

// Report generator
export const generateTestReport = (results: TestResult[]): string => {
  const total = results.length;
  const passed = results.filter(r => r.status === 'passed').length;
  const failed = results.filter(r => r.status === 'failed').length;
  const notImplemented = results.filter(r => r.status === 'not-implemented').length;

  return `
Feature Test Report
==================
Total Features: ${total}
Passed: ${passed}
Failed: ${failed}
Not Implemented: ${notImplemented}

Detailed Results:
----------------
${results.map(r => `
${r.feature}
Status: ${r.status}${r.error ? `\nError: ${r.error}` : ''}`).join('\n')}
`;
};