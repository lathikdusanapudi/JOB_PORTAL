import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Twitter, Linkedin, Github, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Briefcase size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold font-display text-white">
                Talent<span className="text-primary-400">Bridge</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Connecting India's top talent with the best companies. Find your dream job or hire exceptional people.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <SocialLink href="#"><Twitter size={16} /></SocialLink>
              <SocialLink href="#"><Linkedin size={16} /></SocialLink>
              <SocialLink href="#"><Github size={16} /></SocialLink>
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h4 className="font-semibold text-white mb-4 font-display">For Job Seekers</h4>
            <ul className="space-y-2.5">
              {['Browse Jobs', 'Create Profile', 'Upload Resume', 'Job Alerts', 'Career Advice'].map((item) => (
                <li key={item}>
                  <Link to="/jobs" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="font-semibold text-white mb-4 font-display">For Employers</h4>
            <ul className="space-y-2.5">
              {['Post a Job', 'Search Resumes', 'Recruitment Solutions', 'Pricing Plans', 'Success Stories'].map((item) => (
                <li key={item}>
                  <Link to="/register" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 font-display">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <MapPin size={14} className="text-primary-400 mt-0.5 flex-shrink-0" />
                <span>91 Springboard, Koramangala, Bangalore 560034</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <Mail size={14} className="text-primary-400 flex-shrink-0" />
                <span>hello@talentbridge.in</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <Phone size={14} className="text-primary-400 flex-shrink-0" />
                <span>+91 80 4567 8900</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-700 my-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2025 TalentBridge. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <Link key={item} to="#" className="text-sm text-gray-500 hover:text-primary-400 transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

const SocialLink = ({ href, children }) => (
  <a
    href={href}
    className="w-8 h-8 bg-gray-700 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
  >
    {children}
  </a>
);
