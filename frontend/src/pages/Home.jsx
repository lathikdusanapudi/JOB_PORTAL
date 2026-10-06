import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Search, MapPin, Briefcase, Users,
  TrendingUp, Shield, Star, CheckCircle, Building2,
  Zap, Globe, Award
} from 'lucide-react';
import SearchBar from '../components/SearchBar';
import JobCard from '../components/JobCard';
import { featuredCompanies } from '../services/mockData';
import { getJobs } from './api';

const stats = [
  { label: 'Active Jobs', value: '24,000+', icon: Briefcase },
  { label: 'Companies Hiring', value: '3,500+', icon: Building2 },
  { label: 'Job Seekers', value: '1.2M+', icon: Users },
  { label: 'Placements', value: '98,000+', icon: Award },
];

const features = [
  {
    icon: Zap,
    color: 'bg-amber-100 text-amber-600',
    title: 'Smart Job Matching',
    desc: 'AI-powered recommendations that match your skills and experience to the best opportunities.',
  },
  {
    icon: Shield,
    color: 'bg-emerald-100 text-emerald-600',
    title: 'Verified Companies',
    desc: 'Every company on TalentBridge is verified, so you can apply with confidence.',
  },
  {
    icon: Globe,
    color: 'bg-blue-100 text-blue-600',
    title: 'Remote Opportunities',
    desc: 'Discover remote-friendly jobs from companies across India and globally.',
  },
  {
    icon: TrendingUp,
    color: 'bg-purple-100 text-purple-600',
    title: 'Career Insights',
    desc: 'Get salary insights, industry trends, and career advice to grow your career.',
  },
];

const popularSearches = ['React Developer', 'Product Manager', 'Data Scientist', 'UI/UX Designer', 'DevOps Engineer', 'Marketing Manager'];

export default function Home() {
  const [featuredJobs, setFeaturedJobs] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getJobs({ page_size: 6 });
        setFeaturedJobs(data.results || []);
      } catch (err) {
        console.error("Failed to fetch featured jobs:", err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="hero-gradient py-20 lg:py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 animate-fade-up">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-slow" />
              <span className="text-white/90 text-sm font-medium">2,400+ new jobs added this week</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight font-display animate-fade-up delay-100">
              Find Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-emerald-300">
                Dream Career
              </span>
              in India
            </h1>

            <p className="mt-5 text-lg text-white/70 max-w-xl mx-auto animate-fade-up delay-200 font-body">
              Connect with top companies. Discover opportunities that match your skills. Build the career you deserve.
            </p>

            {/* Search */}
            <div className="mt-8 animate-fade-up delay-300 flex justify-center">
              <SearchBar large />
            </div>

            {/* Popular Searches */}
            <div className="mt-5 flex flex-wrap justify-center gap-2 animate-fade-up delay-400">
              <span className="text-white/50 text-sm">Popular:</span>
              {popularSearches.map((term) => (
                <Link
                  key={term}
                  to={`/jobs?title=${encodeURIComponent(term)}`}
                  className="text-sm text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full px-3 py-1 transition-all duration-200"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Icon size={18} className="text-primary-500" />
                  <span className="text-2xl md:text-3xl font-bold text-gray-900 font-display">{value}</span>
                </div>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Jobs ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title">Featured Jobs</h2>
              <p className="section-subtitle">Hand-picked opportunities from top companies</p>
            </div>
            <Link
              to="/jobs"
              className="hidden sm:flex items-center gap-1.5 text-primary-600 hover:text-primary-800 font-semibold font-display text-sm"
            >
              View All Jobs <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link to="/jobs" className="btn-outline text-sm">
              View All Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* ── Top Companies ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-title">Top Hiring Companies</h2>
            <p className="section-subtitle">Join thousands of professionals already hired</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {featuredCompanies.map(({ name, color }) => (
              <div
                key={name}
                className="card p-5 flex flex-col items-center justify-center gap-3 hover:scale-105 transition-transform duration-200 cursor-pointer"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{name[0]}</span>
                </div>
                <span className="text-sm font-semibold text-gray-700 text-center font-display">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose TalentBridge?</h2>
            <p className="section-subtitle">We make job hunting simple, fast, and effective</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="card p-6">
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 font-display">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">
            Ready to Take the Next Step?
          </h2>
          <p className="text-white/80 text-lg mb-8 font-body">
            Join over 1.2 million professionals who found their dream job through TalentBridge.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="bg-white text-primary-700 hover:bg-primary-50 font-semibold py-3 px-8 rounded-xl transition-all duration-200 font-display">
              Create Free Account
            </Link>
            <Link to="/jobs" className="border-2 border-white/40 text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-xl transition-all duration-200 font-display">
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
