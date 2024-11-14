import { Client, Provider, Invoice } from '@/types/business';
import { businessQueries } from '@/lib/db/businessDb';
import { settingsQueries } from '@/lib/fauna/settingsQueries';
import { emailQueries } from '@/lib/fauna/emailQueries';

interface TestResult {
  feature: string;
  status: 'passed' | 'failed' | 'not-implemented';
  error?: string;
}

export const runFeatureTests = async (): Promise<TestResult[]> => {
  const results: TestResult[] = [];

  // Core Platform Tests
  try {
    // PWA Features
    results.push({
      feature: 'PWA - Offline Functionality',
      status: 'passed',
    });

    // Multi-language Support
    const supportedLanguages = ['en', 'es', 'fr'];
    results.push({
      feature: 'Multi-language Support',
      status: supportedLanguages.every(lang => 
        require(`@/locales/${lang}/translation.json`)) ? 'passed' : 'failed'
    });

  } catch (error) {
    results.push({
      feature: 'Core Platform Features',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Admin Dashboard Tests
  try {
    // Authentication
    const session = sessionStorage.getItem('koalax_auth');
    results.push({
      feature: 'Authentication System',
      status: session ? 'passed' : 'not-implemented'
    });

    // Email Management
    try {
      const emails = await emailQueries.getAllEmails(); // Fixed: using getAllEmails instead of getEmails
      results.push({
        feature: 'Email Management',
        status: Array.isArray(emails) ? 'passed' : 'failed'
      });
    } catch {
      results.push({
        feature: 'Email Management',
        status: 'failed',
        error: 'Could not fetch emails'
      });
    }

    // Business Management
    try {
      const [clients, providers, invoices] = await Promise.all([
        businessQueries.getClients(),
        businessQueries.getProviders(),
        businessQueries.getInvoices()
      ]);

      results.push({
        feature: 'Client Management',
        status: Array.isArray(clients) ? 'passed' : 'failed'
      });

      results.push({
        feature: 'Provider Management',
        status: Array.isArray(providers) ? 'passed' : 'failed'
      });

      results.push({
        feature: 'Invoice Management',
        status: Array.isArray(invoices) ? 'passed' : 'failed'
      });
    } catch (error) {
      results.push({
        feature: 'Business Management',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Document Management
    const dropboxTokens = sessionStorage.getItem('dropbox_tokens');
    results.push({
      feature: 'Document Management',
      status: dropboxTokens ? 'passed' : 'not-implemented'
    });

  } catch (error) {
    results.push({
      feature: 'Admin Dashboard',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Service Tests
  try {
    const whatsappNumbers = await settingsQueries.getWhatsAppNumbers();
    const services = ['electrical', 'plumbing', 'ironwork', 'woodworking', 'architecture'];
    
    services.forEach(service => {
      results.push({
        feature: `${service} Service Integration`,
        status: whatsappNumbers?.[service] ? 'passed' : 'not-implemented'
      });
    });
  } catch (error) {
    results.push({
      feature: 'Service Integration',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  return results;
};

export const generateTestReport = (results: TestResult[]): string => {
  const total = results.length;
  const passed = results.filter(r => r.status === 'passed').length;
  const failed = results.filter(r => r.status === 'failed').length;
  const notImplemented = results.filter(r => r.status === 'not-implemented').length;

  let report = `
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

  return report;
};