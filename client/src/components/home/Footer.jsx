import React from 'react'
import { Globe, Linkedin, Twitter, Youtube } from 'lucide-react'

const Footer = () => {
  return (
    // <footer className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-white border-t border-emerald-100">
    <footer className="bg-gradient-to-r from-white via-green-200/60 to  white ">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">resume</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block items-end" />
              <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">ai</span>
            </div>
          </div>

          {/* center links */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-8">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#home" className="hover:text-gray-900">Home</a></li>
                <li><a href="#support" className="hover:text-gray-900">Support</a></li>
                <li><a href="#pricing" className="hover:text-gray-900">Pricing</a></li>
                <li><a href="#affiliate" className="hover:text-gray-900">Affiliate</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#company" className="hover:text-gray-900">Company</a></li>
                <li><a href="#blogs" className="hover:text-gray-900">Blogs</a></li>
                <li><a href="#community" className="hover:text-gray-900">Community</a></li>
                <li className="flex items-center gap-3">
                  <a href="#careers" className="hover:text-gray-900">Careers</a>
                  <span className="ml-1 inline-flex items-center bg-emerald-500 text-white text-xs font-medium px-2 py-1 rounded-full">We're hiring!</span>
                </li>
                <li><a href="#about" className="hover:text-gray-900">About</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#privacy" className="hover:text-gray-900">Privacy</a></li>
                <li><a href="#terms" className="hover:text-gray-900">Terms</a></li>
              </ul>
            </div>
          </div>

          {/* right: tagline + social */}
          <div className="w-full lg:w-64 text-left lg:text-right">
            <p className="text-sm text-gray-600 mb-4">
              Empowering job seekers worldwide to create stunning resumes and land their dream careers.
            </p>

            <div className="flex items-center justify-start lg:justify-end gap-3 mb-4">
              <a href="#" aria-label="Website" className="p-2 rounded-full hover:bg-emerald-100 transition">
                <Globe className="w-5 h-5 text-emerald-600" />
              </a>
              <a href="#" aria-label="LinkedIn" className="p-2 rounded-full hover:bg-emerald-100 transition">
                <Linkedin className="w-5 h-5 text-emerald-600" />
              </a>
              <a href="#" aria-label="Twitter" className="p-2 rounded-full hover:bg-emerald-100 transition">
                <Twitter className="w-5 h-5 text-emerald-600" />
              </a>
              <a href="#" aria-label="YouTube" className="p-2 rounded-full hover:bg-emerald-100 transition">
                <Youtube className="w-5 h-5 text-emerald-600" />
              </a>
            </div>

            <div className="text-sm text-gray-500">© {new Date().getFullYear()} Resume Builder</div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer