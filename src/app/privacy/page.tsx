import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-slate-900 p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-slate-500 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2 className="text-xl font-bold mb-2">1. Introduction</h2>
          <p>Welcome to LinkEarner. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">2. Data We Collect</h2>
          <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-700">
            <li><strong>Technical Data:</strong> Includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li><strong>Usage Data:</strong> Includes information about how you use our website, products, and services.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">3. Cookies and Advertising</h2>
          <p>We use third-party advertising companies (Google AdSense) to serve ads when you visit our Web site. These companies may use aggregated information (not including your name, address, email address or telephone number) about your visits to this and other Web sites in order to provide advertisements about goods and services of interest to you.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">4. Contact Us</h2>
          <p>If you have any questions about this privacy policy, please contact us.</p>
        </section>
      </div>
    </div>
  );
}