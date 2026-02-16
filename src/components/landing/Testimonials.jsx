import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sara',
      role: 'sde',
      company: 'Design Studio',
      image: null,
      rating: 5,
      text: 'This AI invoice generator has completely transformed how I manage my freelance work. I can create professional invoices in seconds just by pasting client emails. Game changer!',
      initials: 'SJ',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Hari',
      role: 'Small Business Owner',
      company: 'Tech Solutions Inc',
      image: null,
      rating: 5,
      text: 'The AI-powered payment reminders are brilliant. I no longer have to manually chase unpaid invoices. My cash flow has improved significantly since using this platform.',
      initials: 'MC',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Prasad',
      role: 'Consultant',
      company: 'ER Consulting',
      image: null,
      rating: 5,
      text: 'Love the dashboard insights! Being able to see my revenue trends and outstanding payments at a glance helps me make better business decisions. Highly recommend!',
      initials: 'ER',
      gradient: 'from-pink-500 to-pink-600'
    },
    {
      name: 'David ',
      role: 'Photographer',
      company: 'Park Photography',
      image: null,
      rating: 5,
      text: 'Simple, fast, and professional. I can create branded invoices that match my business identity. The PDF export feature is perfect for my workflow.',
      initials: 'DP',
      gradient: 'from-green-500 to-green-600'
    },
    {
      name: 'Jessica ',
      role: 'Marketing Agency Owner',
      company: 'Taylor Marketing',
      image: null,
      rating: 5,
      text: 'Managing invoices for multiple clients was a nightmare before. Now with AI automation and cloud storage, everything is organized and accessible. Worth every penny!',
      initials: 'JT',
      gradient: 'from-indigo-500 to-indigo-600'
    },
    {
      name: 'Robert ',
      role: 'Web Developer',
      company: 'Williams Dev',
      image: null,
      rating: 5,
      text: 'As a developer, I appreciate clean, intuitive interfaces. This tool nails it. Fast, responsive, and the AI features actually work as advertised. Impressed!',
      initials: 'RW',
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">Testimonials</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Loved by
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {' '}Thousands{' '}
            </span>
            of Users
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our users have to say about their experience
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-10 h-10 text-blue-200" />
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* User Info */}
              <div className="flex items-center space-x-4">
                {testimonial.image ? (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${testimonial.gradient} flex items-center justify-center`}>
                    <span className="text-white font-semibold text-sm">
                      {testimonial.initials}
                    </span>
                  </div>
                )}
                
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                  </div>
                  <div className="text-xs text-gray-400">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">4.9/5</div>
            <div className="text-gray-600">Average Rating</div>
            <div className="flex items-center justify-center mt-2 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">5K+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">10K+</div>
            <div className="text-gray-600">Invoices Created</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
