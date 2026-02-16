import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How does the AI invoice generation work?',
      answer: 'Simply paste any text containing invoice details (like a client email or notes) into our AI generator. Our Google Gemini AI will automatically extract relevant information like client name, items, quantities, and prices to create a professional invoice instantly.'
    },
    {
      question: 'Is my data secure and private?',
      answer: 'Absolutely! We use industry-standard encryption to protect your data. All invoices and business information are securely stored in the cloud with regular backups. We never share your data with third parties.'
    },
    {
      question: 'Can I customize invoice templates with my branding?',
      answer: 'Yes! You can add your company logo, customize colors, and include your business information. All invoices will reflect your brand identity and look professional.'
    },
    {
      question: 'How do AI payment reminders work?',
      answer: 'For any unpaid invoice, you can click "Generate Reminder" and our AI will create a friendly, professional reminder email. You can review it before sending to your client. It\'s personalized based on the invoice details and payment terms.'
    },
    {
      question: 'Can I export invoices as PDF?',
      answer: 'Yes! Every invoice can be downloaded as a professionally formatted PDF with one click. You can also print directly from your browser. Perfect for keeping offline records or emailing to clients.'
    },
    {
      question: 'What are AI Financial Insights?',
      answer: 'Our AI analyzes your invoicing data to provide smart insights like revenue trends, outstanding payment amounts, top clients, and recommendations for improving cash flow. It\'s like having a financial advisor built into your dashboard.'
    },
    {
      question: 'Is there a limit on how many invoices I can create?',
      answer: 'Our free plan allows you to create up to 10 invoices per month. For unlimited invoices and advanced features like AI insights and custom branding, check out our Pro and Business plans.'
    },
    {
      question: 'Can I access my invoices from mobile devices?',
      answer: 'Absolutely! Our platform is fully responsive and works seamlessly on smartphones, tablets, and desktop computers. Manage your invoices on the go from anywhere.'
    },
    {
      question: 'Do I need to install any software?',
      answer: 'No installation required! AI Invoice Generator is a web-based application. Simply sign up and start creating invoices immediately from your browser. Works on all modern browsers.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. All payments are processed securely through Stripe, and you can cancel your subscription anytime.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm font-medium">FAQ</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {' '}Questions
            </span>
          </h2>
          
          <p className="text-xl text-gray-600">
            Everything you need to know about AI Invoice Generator
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors duration-200"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
              >
                <span className="text-lg font-semibold text-gray-900 pr-8 group-hover:text-blue-600 transition-colors duration-200">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-gray-500 flex-shrink-0 transform transition-transform duration-300 group-hover:text-blue-600 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6">
                  <div className="h-px bg-gray-200 mb-4"></div>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <div className="mt-16 text-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <button
            onClick={() => window.location.href = 'mailto:support@aiinvoice.com'}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transform hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
          >
            <HelpCircle className="w-5 h-5" />
            <span>Contact Support</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
