'use client';

interface SubscriptionErrorProps {
  billingUrl?: string;
  onClose: () => void;
}

export default function SubscriptionError({ billingUrl, onClose }: SubscriptionErrorProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md mx-4 shadow-2xl">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            OpenAI Subscription Required
          </h3>
          
          {/* Message */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            Your OpenAI subscription has expired or exceeded quota limits. 
            This app requires active OpenAI credits for AI-powered content analysis.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <a
              href={billingUrl || 'https://platform.openai.com/account/billing'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Check Billing & Upgrade
            </a>
            
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
            >
              Close
            </button>
          </div>
          
          {/* Help Text */}
          <div className="mt-6 text-sm text-gray-500">
            <p className="mb-2"><strong>Quick Steps:</strong></p>
            <ol className="text-left list-decimal list-inside space-y-1">
              <li>Visit your OpenAI billing page</li>
              <li>Add a payment method if needed</li>
              <li>Purchase credits or upgrade your plan</li>
              <li>Return and try your analysis again</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
