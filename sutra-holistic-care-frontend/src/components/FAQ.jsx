import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: 'Is Sleep Sutra safe to use?',
      answer: 'Yes, absolutely. Sleep Sutra is formulated using 100% natural, premium, wild-harvested herbs (like cardamom, ashwagandha, tagara root, and organic oats). It contains zero synthetic chemicals, heavy metals, or preservatives. It is completely safe and non-toxic for daily consumption.'
    },
    {
      question: 'Are there any side effects?',
      answer: 'None whatsoever. Unlike modern sedatives or over-the-counter sleep aids, Sleep Sutra does not disrupt your liver metabolism, leave you feeling groggy or fatigued in the morning, or cause brain fog. It works naturally in harmony with your body\'s circadian rhythm.'
    },
    {
      question: 'How long should I use it?',
      answer: 'For mild sleep disruptions, we recommend daily use for 2 to 3 weeks. For chronic insomnia or deeply ingrained lifestyle imbalances, a continuous course of 2 to 3 months helps fully rebuild the sleep cycle. You can safely consume it as long as needed to reset your natural rhythm.'
    },
    {
      question: 'Who should avoid using it?',
      answer: 'While Sleep Sutra is gentle and natural, pregnant women, nursing mothers, and children under the age of 12 should always seek specific guidance from Dr. Keval Dankhara before beginning. If you are taking high-dose psychiatric medications, please schedule a consultation first.'
    },
    {
      question: 'Will I become dependent on it?',
      answer: 'No. Sleep Sutra is specifically designed to nourish and heal the nervous system, helping the body trigger its own melatonin release naturally. It does not force sedation, which prevents dependency. You can discontinue use at any point once your healthy sleep patterns are restored.'
    }
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-primary-dark font-sans uppercase">
            GOT QUESTIONS?
          </span>
          <h2 className="mt-3 font-serif text-4xl font-extrabold tracking-tight text-text-dark sm:text-5xl">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordions */}
        <div className="space-y-4 text-left">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={faq.question}
                className="rounded-2xl border border-primary/10 bg-bg-cream/30 overflow-hidden transition-all duration-300 hover:border-primary/25"
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex items-center justify-between p-6 text-left transition-colors focus:outline-hidden"
                >
                  <span className="font-serif font-extrabold text-base sm:text-lg text-text-dark pr-4 flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-primary-dark shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`h-5 w-5 text-primary-dark shrink-0 transition-transform duration-300 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`} 
                  />
                </button>

                {/* Animated content expansion */}
                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-60 border-t border-primary/10 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                  } overflow-hidden`}
                >
                  <p className="p-6 text-sm text-text-light leading-relaxed bg-white">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FAQ;
