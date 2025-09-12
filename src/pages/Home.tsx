import { Link } from 'react-router-dom'
import { 
  SparklesIcon, 
  DocumentDuplicateIcon, 
  PaintBrushIcon,
  ChartBarIcon,
  DevicePhoneMobileIcon,
  CloudArrowUpIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

export default function Home() {
  const features = [
    {
      icon: DocumentDuplicateIcon,
      title: '130+ Professional Templates',
      description: 'Choose from a vast library of professionally designed templates for every occasion and industry.'
    },
    {
      icon: PaintBrushIcon,
      title: 'Drag & Drop Editor',
      description: 'Intuitive editor with rich formatting options, image editing, and interactive elements.'
    },
    {
      icon: SparklesIcon,
      title: 'AI Content Assistant',
      description: 'Generate compelling newsletter copy, subject lines, and content with AI-powered assistance.'
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'Mobile Responsive',
      description: 'All templates automatically adapt to desktop, tablet, and mobile devices perfectly.'
    },
    {
      icon: ChartBarIcon,
      title: 'Analytics & Insights',
      description: 'Track performance with detailed analytics on open rates, clicks, and engagement.'
    },
    {
      icon: CloudArrowUpIcon,
      title: 'Easy Distribution',
      description: 'Export to HTML, PDF, or images. Integrate with major email service providers.'
    }
  ]

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Access to basic templates',
        'Limited AI generations (10/month)',
        'Basic export options',
        'Email support'
      ],
      cta: 'Get Started Free',
      popular: false
    },
    {
      name: 'Premium',
      price: '$19',
      period: 'per month',
      features: [
        'Full template library (130+)',
        'Unlimited AI assistance',
        'Advanced analytics',
        'Brand kit management',
        'Priority support',
        'All export formats'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Team',
      price: '$49',
      period: 'per month',
      features: [
        'Everything in Premium',
        'Team collaboration',
        'Shared brand assets',
        'User management',
        'Advanced permissions',
        'Dedicated support'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Newsletter Creator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Create Stunning
            <span className="text-blue-600"> Newsletters</span>
            <br />in Minutes
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Design professional email newsletters with our intuitive drag-and-drop editor, 
            AI-powered content assistance, and 130+ beautiful templates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Start Creating Free
            </Link>
            <Link
              to="/templates"
              className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold border border-gray-300 transition-colors"
            >
              Browse Templates
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to create amazing newsletters
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From design to distribution, we've got you covered with powerful tools and features.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="mx-auto h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose the perfect plan for you
            </h2>
            <p className="text-xl text-gray-600">
              Start free and upgrade as you grow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-2xl shadow-lg p-8 relative ${
                plan.popular ? 'ring-2 ring-blue-600 scale-105' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  to="/signup"
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors block text-center ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to create your first newsletter?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of creators who trust Newsletter Creator for their email marketing.
          </p>
          <Link
            to="/signup"
            className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-block"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter Creator</h3>
              <p className="text-gray-400">
                Create stunning newsletters with ease using our powerful design tools and AI assistance.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Editor</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Newsletter Creator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}