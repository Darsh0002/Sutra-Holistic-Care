import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { generalFAQ } from "../data/faqData";

const FAQ = ({
  data = generalFAQ,
  title = "Frequently Asked Questions",
  subtitle = "GOT QUESTIONS?",
  sectionId = "faq",
}) => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id={sectionId} className="py-20 bg-white relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-primary-dark font-sans uppercase">
            {subtitle}
          </span>
          <h2 className="mt-3 font-serif text-4xl font-extrabold tracking-tight text-text-dark sm:text-5xl">
            {title}
          </h2>
        </div>

        {/* Accordions */}
        <div className="space-y-4 text-left">
          {data.map((faq, index) => {
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
                      isOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Animated content expansion */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="p-6 text-sm text-text-light leading-relaxed bg-white border-t border-primary/10">
                      {faq.answer}
                    </p>
                  </div>
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
