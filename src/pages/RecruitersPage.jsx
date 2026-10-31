import React from 'react';
import { Building, Award, Users, DollarSign, MapPin, CheckCircle, ExternalLink, Briefcase } from 'lucide-react';

export default function RecruitersPage({ dataset, filteredStudents, onSelectStudent }) {
  const corporatePartners = [
    {
      name: 'Country Edu Pvt Ltd',
      type: 'EdTech / Management Consulting',
      package: '₹10.00 LPA',
      hires: 7,
      departments: ['CSE', 'BBA', 'MBA'],
      category: 'Super Dream',
      description: 'Major corporate recruitment partner hiring technology specialists and business analysts across departments.'
    },
    {
      name: 'KMK Venture',
      type: 'Venture Capital & Finance',
      package: '₹10.20 LPA',
      hires: 1,
      departments: ['MBA'],
      category: 'Super Dream',
      description: 'Offered the current highest compensation package of the cohort for financial management.'
    },
    {
      name: 'Eleation Services',
      type: 'Core Mechanical / CAE Simulation',
      package: '₹9.00 LPA',
      hires: 1,
      departments: ['ME'],
      category: 'Super Dream',
      description: 'Premier engineering analysis firm offering advanced automotive and mechanical design roles.'
    },
    {
      name: 'Rajasthan Shubham Solar',
      type: 'Renewable Energy & Solar Infra',
      package: '₹7.00 LPA',
      hires: 2,
      departments: ['MBA'],
      category: 'Dream Tier',
      description: 'Strategic green-energy developer recruiting for technical operations and market development.'
    },
    {
      name: 'Naviotech Solutions',
      type: 'Software & Cloud Engineering',
      package: '₹4.00 - ₹6.00 LPA',
      hires: 3,
      departments: ['MBA', 'BBA'],
      category: 'Dream Tier',
      description: 'Enterprise IT solutions firm recruiting for digital solutions engineering and operations.'
    },
    {
      name: 'Cyntexa Labs',
      type: 'Salesforce & Cloud Solutions',
      package: '₹5.00 LPA',
      hires: 2,
      departments: ['CSE'],
      category: 'Dream Tier',
      description: 'Global Salesforce crest partner recruiting software developers and cloud architects.'
    },
    {
      name: 'I.EVO Solutions',
      type: 'Civil & Infra Tech',
      package: '₹4.50 LPA',
      hires: 3,
      departments: ['CE'],
      category: 'Core Engineering',
      description: 'Infra-tech and structural engineering consultancy hiring graduate engineers.'
    },
    {
      name: 'Kreativan Technologies',
      type: 'Software & Web Development',
      package: '₹4.00 LPA',
      hires: 4,
      departments: ['CSE', 'BCA', 'MBA'],
      category: 'Core Engineering',
      description: 'Technology solutions firm hiring across engineering, computer applications and management.'
    },
    {
      name: 'BNM Business Solution LLP',
      type: 'Corporate Strategy & BFSI',
      package: '₹10.00 LPA',
      hires: 6,
      departments: ['BBA', 'MBA'],
      category: 'Super Dream',
      description: 'Management consultancy recruiting financial analysts and corporate associates.'
    },
    {
      name: 'SK Khetan Group',
      type: 'Mining & Infrastructure',
      package: '₹3.00 LPA',
      hires: 1,
      departments: ['MN'],
      category: 'Core Mining',
      description: 'Mines survey and natural resource exploration company hiring mining engineers.'
    },
    {
      name: 'Tempsens Instruments',
      type: 'Precision Thermal Engineering',
      package: '₹2.76 LPA',
      hires: 1,
      departments: ['MBA', 'ECE'],
      category: 'Core Manufacturing',
      description: 'International manufacturer of temperature measuring instruments and control systems.'
    },
    {
      name: 'CNK Khandewala & Associates',
      type: 'Audit & Advisory',
      package: '₹2.50 LPA',
      hires: 1,
      departments: ['BBA'],
      category: 'Finance / Audit',
      description: 'Chartered accounting and financial consultancy firm recruiting finance associates.'
    }
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-500" />
            Corporate Recruiter & Industry Partner Insights
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Hiring patterns, compensation tiers, and campus drive performance.
          </p>
        </div>

        <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-lg">
          25+ Active Corporate Alliances
        </span>
      </div>

      {/* Corporate Partner Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {corporatePartners.map((corp) => (
          <div 
            key={corp.name} 
            className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#202024] shadow-sm flex flex-col justify-between powerbi-card"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {corp.name}
                  </h3>
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
                    {corp.type}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  corp.category === 'Super Dream'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : corp.category === 'Dream Tier'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300'
                }`}>
                  {corp.category}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-zinc-300 line-clamp-2 my-2.5">
                {corp.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">CTC Package</span>
                <span className="font-black text-amber-600 dark:text-amber-400 text-sm">
                  {corp.package}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Recruited</span>
                <span className="font-extrabold text-slate-800 dark:text-white">
                  {corp.hires} Hires ({corp.departments.join(', ')})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
