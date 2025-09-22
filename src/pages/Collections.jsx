import React, { useState } from 'react';

const Collections = () => {
  const [activeTab, setActiveTab] = useState('all');

  const collections = [
    {
      id: 1,
      name: 'Project Alpha',
      paperCount: 5,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMDS6HnaMwJLOVmVAsQXZ2G4zuPZ3s1k85tjhGQeyI6nKTug5ZTY17taN7ALe2WhoAZaj-XNDdGJCh9vFMrXwoOSpRTBFAYrasXFxF6x_gDxqOrDef-S9EagimbLfCXshi2uzPYu-nEF3ODQxS_1S6onrSk7qSc2DezerhD_1OqIo-xFyXr6MRxyn4tY9COx6OmZmrzHwBp99pgEWLy2xIkpxq7MscMoAeuwGi7vcbzmFu27K9Ras_KmDBPcq8yy1dfFfaUyGl0n19'
    },
    {
      id: 2,
      name: 'Campaign Beta',
      paperCount: 12,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpUjSarT5viCjLXzbzCs-oIBwrf_RWrgb4lQBlEeHbshkkPepjKc6LBYNZ60NVAn0BPsiZkYKupbbvJC9quw0TwInhsbJE7rUU6jTSXf42FwpPJoqpjZfDZwEGh1EBYBV-m_ThuhB_Qo3M3fw57puKXmuW_x_PhT2V1PYMP3PtUtP-vPX7zzpAh_hQUclzYsGOHp-zSmB9KqB-QUl29z900ph7FONmo0bi54w_NfaV24drB-K0EHA97hvpLpHilG8l5nev62JuRc2E'
    },
    {
      id: 3,
      name: 'Research Initiative Gamma',
      paperCount: 8,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARFwiHhnpQI88pqLWzCNTcmTbQ03_At8yh6ju_Nvm0zTd41kgVm0MO4JEz7V-OU9eSIEk_fmAzZQ9Aht3EzJiCfc3-NT6HBRDqKIQI-4Vhd4ojYXYXCIQ-G0dzdRzZI7P48xaauo6CvYEL6ziPKwEzhUS84Wky5n6Br6KzT2W1XphGqn5LEELfjLKscx1meLK1fkx0ttppLauaz-0itxvUxUaPPvzC8c6I3nS8pEjQT8A9C7EJenPgvfFNN8FEnFUTLclmF3lbsctI'
    },
    {
      id: 4,
      name: 'Innovation Hub Delta',
      paperCount: 3,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsxs4jVgMY-CcljEPOhr0m7t7YXhuuta2yJziDmk8dZUfDUGp8y6NLzz3htMIFoC-LXPUqk6Eh6xY6izE_K9EZmYBUfbzURscgFE6DIjVa0LGGssYJCCCS-sPgeCJ_OqUrrRCX2u9XTRPPPfX3escSI6HOFd8oFUjNCb_y3E1Gk0siqBiYN3ex-2jLvptShWTYJ_Pmtm9SG3uD1xAL8-xqeD4-U2CsbyRlSoMj1nl_uETTRYEOlKHTmFOEpcqctowpz0nWfV8RPENa'
    }
  ];

  const papers = [
    {
      id: 1,
      title: 'Paper 1: The Impact of AI on Healthcare',
      category: 'AI in Medicine',
      intervention: 'Machine Learning',
      outcome: 'Improved Diagnostics',
      industrySegment: 'Healthcare'
    },
    {
      id: 2,
      title: 'Paper 2: Renewable Energy Adoption...',
      category: 'Sustainability',
      intervention: 'Solar Panels',
      outcome: 'Reduced Carbon Emissions',
      industrySegment: 'Energy'
    },
    {
      id: 3,
      title: 'Paper 3: The Role of Blockchain in Finance',
      category: 'FinTech',
      intervention: 'Decentralized Finance',
      outcome: 'Enhanced Security',
      industrySegment: 'Finance'
    },
    {
      id: 4,
      title: 'Paper 4: E-commerce Trends in the Retail Sector',
      category: 'Retail',
      intervention: 'Online Shopping',
      outcome: 'Increased Sales',
      industrySegment: 'Retail'
    },
    {
      id: 5,
      title: 'Paper 5: Cybersecurity Challenges...',
      category: 'IT Security',
      intervention: 'VPNs',
      outcome: 'Data Protection',
      industrySegment: 'Technology'
    }
  ];

  return (
    <main className="flex-grow w-full px-4 sm:px-6 lg:px-14 py-8">
      <div className="mx-auto max-w-[1360px]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-white">Collections</h1>
          <button className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90">
            <span className="material-symbols-outlined">add</span>
            <span>New Collection</span>
          </button>
        </div>

        <div className="mt-6">
          <nav aria-label="Tabs" className="flex gap-3">
            <button
              onClick={() => setActiveTab('all')}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors border ${
                activeTab === 'all'
                  ? 'bg-primary text-black border-primary'
                  : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-base">folder</span>
              All Collections
            </button>
            <button
              onClick={() => setActiveTab('shared')}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors border ${
                activeTab === 'shared'
                  ? 'bg-primary text-black border-primary'
                  : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-base">group</span>
              Shared with me
            </button>
          </nav>
        </div>

        <section className="mt-8">
          <h2 className="text-2xl font-bold tracking-tight text-white">My Collections</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {collections.map((collection) => (
              <div key={collection.id} className="group relative flex flex-col overflow-hidden rounded-lg bg-panel border border-white/10 shadow-sm transition-all hover:shadow-lg">
                <img 
                  alt={collection.name} 
                  className="h-48 w-full object-cover" 
                  src={collection.image}
                />
                <div className="flex-1 p-4">
                  <h3 className="font-semibold text-white">{collection.name}</h3>
                  <p className="text-sm text-white/60">{collection.paperCount} papers</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-white">Project Alpha</h2>
          <div className="mt-4 flex flex-col gap-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/60">search</span>
              <input 
                className="h-12 w-full rounded-lg border border-white/10 bg-panel pl-10 pr-4 text-white placeholder:text-white/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
                placeholder="Search papers" 
                type="search"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="rounded bg-primary/20 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/30">Category</button>
              <button className="rounded bg-primary/20 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/30">Intervention</button>
              <button className="rounded bg-primary/20 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/30">Outcome</button>
              <button className="rounded bg-primary/20 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/30">Industry Segment</button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-white/10 bg-panel">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60" scope="col">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60" scope="col">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60" scope="col">Intervention</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60" scope="col">Outcome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60" scope="col">Industry Segment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {papers.map((paper) => (
                    <tr key={paper.id} className="hover:bg-white/5">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">{paper.title}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-white/70">
                        <span className="inline-flex items-center rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">{paper.category}</span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-white/70">
                        <span className="inline-flex items-center rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">{paper.intervention}</span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-white/70">
                        <span className="inline-flex items-center rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">{paper.outcome}</span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-white/70">
                        <span className="inline-flex items-center rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">{paper.industrySegment}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-2 flex flex-wrap justify-start gap-4">
              <button className="rounded-lg bg-white/10 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/20">
                Move to...
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90">
                <span className="material-symbols-outlined text-base">smart_toy</span>
                <span>Chat with Collection</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Collections;
