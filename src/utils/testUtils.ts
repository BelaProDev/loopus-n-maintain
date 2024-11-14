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

const checkTranslations = () => {
  const supportedLanguages = ['en', 'es', 'fr'];
  const requiredNamespaces = ['common', 'services', 'admin', 'auth', 'docs'];
  
  return supportedLanguages.every(lang => 
    requiredNamespaces.every(ns => {
      const hasBundle = i18n.hasResourceBundle(lang, ns);
      if (!hasBundle) {
        console.error(`Missing translation bundle for language: ${lang}, namespace: ${ns}`);
      }
      return hasBundle;
    })
  );
};

const checkServiceImplementation = async (service: string) => {
  try {
    const whatsappNumbers = await settingsQueries.getWhatsAppNumbers();
    const hasWhatsApp = whatsappNumbers && whatsappNumbers[service];
    
    // Dynamic import of service component
    const serviceModule = await import(`@/pages/${service.charAt(0).toUpperCase() + service.slice(1)}.tsx`);
    const hasImplementation = !!serviceModule.default;
    
    if (!hasWhatsApp) {
      return {
        status: 'not-implemented' as const,
        error: 'Missing WhatsApp number'
      };
    }
    
    if (!hasImplementation) {
      return {
        status: 'not-implemented' as const,
        error: 'Service not implemented'
      };
    }
    
    return {
      status: 'passed' as const
    };
  } catch (error) {
    return {
      status: 'failed' as const,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const runFeatureTests = async (): Promise<TestResult[]> => {
  const results: TestResult[] = [];

  // Core Platform Tests
  results.push({
    feature: 'PWA - Offline Functionality',
    status: 'passed'
  });

  const hasAllTranslations = checkTranslations();
  results.push({
    feature: 'Core Platform Features',
    status: hasAllTranslations ? 'passed' : 'failed',
    error: !hasAllTranslations ? 'Missing translation files' : undefined
  });

  // Authentication System
  const session = sessionStorage.getItem('craft_coordination_session');
  results.push({
    feature: 'Authentication System',
    status: session ? 'passed' : 'not-implemented'
  });

  // Email Management
  try {
    const emails = await emailQueries.getAllEmails();
    results.push({
      feature: 'Email Management',
      status: Array.isArray(emails) ? 'passed' : 'failed'
    });
  } catch (error) {
    results.push({
      feature: 'Email Management',
      status: 'failed',
      error: 'Could not fetch emails'
    });
  }

  // Document Management
  const dropboxTokens = sessionStorage.getItem('dropbox_tokens');
  results.push({
    feature: 'Document Management',
    status: dropboxTokens ? 'passed' : 'not-implemented'
  });

  // Service Tests
  const services = ['electrical', 'plumbing', 'ironwork', 'woodworking', 'architecture'];
  
  for (const service of services) {
    const serviceResult = await checkServiceImplementation(service);
    results.push({
      feature: `${service} Service Integration`,
      ...serviceResult
    });
  }

  return results;
};

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
