/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Sparkles, Heart, Search, Calendar, Dice5, FolderPlus } from 'lucide-react';
import { DateCategory, DateItem, SortOption, StatusFilter, CoupleProfile, TimeCapsule, DateChallenge } from './types/date';
import {
  loadStoredDates,
  saveStoredDates,
  loadStoredProfile,
  saveStoredProfile,
  loadStoredCapsules,
  saveStoredCapsules,
  loadStoredChallenges,
  saveStoredChallenges,
  resetToSampleData,
} from './utils/storage';
import { Header } from './components/Header';
import { MetricsBar } from './components/MetricsBar';
import { FiltersBar } from './components/FiltersBar';
import { DateCard } from './components/DateCard';
import { DateModal } from './components/DateModal';
import { RandomDateModal } from './components/RandomDateModal';
import { MemoryModal } from './components/MemoryModal';
import { MemoriesWall } from './components/MemoriesWall';
import { CoupleSettingsModal } from './components/CoupleSettingsModal';
import { PhotoLightbox } from './components/PhotoLightbox';
import { AIInspireModal } from './components/AIInspireModal';
import { ChallengesModal } from './components/ChallengesModal';
import { BadgesModal } from './components/BadgesModal';
import { TimeCapsuleModal } from './components/TimeCapsuleModal';
import { CoupleSyncModal } from './components/CoupleSyncModal';
import { SweetDateWrappedModal } from './components/SweetDateWrappedModal';
import { MemoriesMapModal } from './components/MemoriesMapModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { triggerRomanticConfetti } from './utils/confetti';
import { SleepingChicksLogo } from './components/SleepingChicksLogo';

export default function App() {
  // State
  const [dates, setDates] = useState<DateItem[]>(() => loadStoredDates());
  const [profile, setProfile] = useState<CoupleProfile>(() => loadStoredProfile());
  const [capsules, setCapsules] = useState<TimeCapsule[]>(() => loadStoredCapsules());
  const [challenges, setChallenges] = useState<DateChallenge[]>(() => loadStoredChallenges());
  const [activeTab, setActiveTab] = useState<'dates' | 'memories'>('dates');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState<DateCategory | 'all'>('all');
  const [sortOption, setSortOption] = useState<SortOption>('date_asc');

  // Modals
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [editingDate, setEditingDate] = useState<DateItem | null>(null);
  const [isRandomizerOpen, setIsRandomizerOpen] = useState(false);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [memoryDate, setMemoryDate] = useState<DateItem | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<{ url: string; title: string } | null>(null);

  // New Feature Modals
  const [isAIInspireOpen, setIsAIInspireOpen] = useState(false);
  const [isChallengesOpen, setIsChallengesOpen] = useState(false);
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);
  const [isCapsulesOpen, setIsCapsulesOpen] = useState(false);
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [isWrappedOpen, setIsWrappedOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    saveStoredDates(dates);
  }, [dates]);

  useEffect(() => {
    saveStoredProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveStoredCapsules(capsules);
  }, [capsules]);

  useEffect(() => {
    saveStoredChallenges(challenges);
  }, [challenges]);

  // Counts
  const counts = useMemo(() => {
    const all = dates.length;
    const pending = dates.filter((d) => d.status === 'pending').length;
    const completed = dates.filter((d) => d.status === 'completed').length;
    return { all, pending, completed };
  }, [dates]);

  // Filtered and Sorted Dates
  const filteredDates = useMemo(() => {
    let list = [...dates];

    // Status filter
    if (statusFilter !== 'all') {
      list = list.filter((d) => d.status === statusFilter);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((d) => d.category === selectedCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          (d.notes && d.notes.toLowerCase().includes(q)) ||
          (d.location && d.location.toLowerCase().includes(q)) ||
          (d.dressCode && d.dressCode.toLowerCase().includes(q))
      );
    }

    // Sorting
    list.sort((a, b) => {
      if (sortOption === 'date_asc') {
        const timeA = a.dateTime ? new Date(a.dateTime).getTime() : Infinity;
        const timeB = b.dateTime ? new Date(b.dateTime).getTime() : Infinity;
        return timeA - timeB;
      }
      if (sortOption === 'date_desc') {
        const timeA = a.dateTime ? new Date(a.dateTime).getTime() : -Infinity;
        const timeB = b.dateTime ? new Date(b.dateTime).getTime() : -Infinity;
        return timeB - timeA;
      }
      if (sortOption === 'budget_asc') {
        return (Number(a.budget) || 0) - (Number(b.budget) || 0);
      }
      if (sortOption === 'budget_desc') {
        return (Number(b.budget) || 0) - (Number(a.budget) || 0);
      }
      if (sortOption === 'created_desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    return list;
  }, [dates, statusFilter, selectedCategory, searchQuery, sortOption]);

  const pendingDatesList = useMemo(() => {
    return dates.filter((d) => d.status === 'pending');
  }, [dates]);

  const completedDatesList = useMemo(() => {
    return dates.filter((d) => d.status === 'completed');
  }, [dates]);

  // Actions
  const handleSaveDate = (data: Partial<DateItem>) => {
    if (editingDate) {
      // Update
      setDates((prev) =>
        prev.map((item) =>
          item.id === editingDate.id
            ? ({
                ...item,
                ...data,
                updatedAt: new Date().toISOString(),
              } as DateItem)
            : item
        )
      );
    } else {
      // Create new
      const newDate: DateItem = {
        id: `sd-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: data.title || 'Nueva Cita',
        category: data.category || 'comida',
        dateTime: data.dateTime || new Date().toISOString().slice(0, 16),
        budget: Number(data.budget) || 0,
        location: data.location,
        dressCode: data.dressCode,
        externalLink: data.externalLink,
        notes: data.notes,
        status: data.status || 'pending',
        memory: data.memory,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDates((prev) => [newDate, ...prev]);
    }
  };

  const handleToggleStatus = (id: string) => {
    setDates((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStatus = item.status === 'pending' ? 'completed' : 'pending';
          return {
            ...item,
            status: newStatus,
            memory:
              newStatus === 'completed' && !item.memory
                ? {
                    completedAt: new Date().toISOString(),
                    rating: 5,
                    note: '¡Un momento inolvidable juntos!',
                  }
                : item.memory,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );
  };

  const handleDeleteDate = (id: string) => {
    setDates((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveMemory = (
    dateId: string,
    memoryData: NonNullable<DateItem['memory']>,
    markCompleted: boolean
  ) => {
    setDates((prev) =>
      prev.map((item) => {
        if (item.id === dateId) {
          return {
            ...item,
            status: markCompleted ? 'completed' : item.status,
            memory: memoryData,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );
  };

  const handleResetData = () => {
    const { dates: sampleDates, profile: sampleProfile } = resetToSampleData();
    setDates(sampleDates);
    setProfile(sampleProfile);
    triggerRomanticConfetti();
  };

  const handleImportData = (importedDates: DateItem[], importedProfile?: CoupleProfile) => {
    if (Array.isArray(importedDates)) {
      setDates(importedDates);
    }
    if (importedProfile) {
      setProfile(importedProfile);
    }
    triggerRomanticConfetti();
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col selection:bg-[#a2dbfc]/30 selection:text-white">
      
      {/* Background Subtle Romantic Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#a2dbfc]/5 blur-3xl" />
        <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-[#a2dbfc]/5 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-[#a2dbfc]/5 blur-3xl" />
      </div>

      {/* Header */}
      <Header
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewDate={() => {
          setEditingDate(null);
          setIsDateModalOpen(true);
        }}
        onOpenRandomizer={() => setIsRandomizerOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAIInspire={() => setIsAIInspireOpen(true)}
        onOpenChallenges={() => setIsChallengesOpen(true)}
        onOpenBadges={() => setIsBadgesOpen(true)}
        onOpenCapsules={() => setIsCapsulesOpen(true)}
        onOpenSync={() => setIsSyncOpen(true)}
        onOpenWrapped={() => setIsWrappedOpen(true)}
        pendingCount={counts.pending}
        completedCount={counts.completed}
        dates={dates}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Metric Summary Cards */}
        <MetricsBar dates={dates} currency={profile.currency} />

        {/* View Switch: Plans vs Memories */}
        {activeTab === 'dates' ? (
          <div>
            {/* Filter and Search Bar */}
            <FiltersBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortOption={sortOption}
              setSortOption={setSortOption}
              counts={counts}
            />

            {/* List of Date Cards */}
            {filteredDates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredDates.map((item) => (
                  <DateCard
                    key={item.id}
                    dateItem={item}
                    currency={profile.currency}
                    onToggleStatus={handleToggleStatus}
                    onEdit={(itemToEdit) => {
                      setEditingDate(itemToEdit);
                      setIsDateModalOpen(true);
                    }}
                    onDelete={handleDeleteDate}
                    onOpenMemory={(itemToMemory) => {
                      setMemoryDate(itemToMemory);
                      setIsMemoryModalOpen(true);
                    }}
                    onViewPhoto={(url, title) => setLightboxPhoto({ url, title })}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-[#0c1527] rounded-3xl p-8 sm:p-12 border border-slate-800 text-center shadow-lg text-slate-100">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#080e1c] text-[#a2dbfc] border border-slate-800 flex items-center justify-center mb-4 shadow-inner">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  No se encontraron planes con estos filtros
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
                  Prueba cambiando la búsqueda, seleccionando otra categoría o borrando los filtros activos.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setSelectedCategory('all');
                    }}
                    className="px-4 py-2 text-xs font-bold text-[#a2dbfc] bg-[#a2dbfc]/10 hover:bg-[#a2dbfc]/20 border border-[#a2dbfc]/30 rounded-xl backdrop-blur-xs transition-colors cursor-pointer"
                  >
                    Restablecer filtros
                  </button>
                  <button
                    onClick={() => {
                      setEditingDate(null);
                      setIsDateModalOpen(true);
                    }}
                    className="px-4 py-2 text-xs font-black text-[#061428] bg-[#a2dbfc]/90 hover:bg-[#a2dbfc] border border-[#a2dbfc]/60 rounded-xl backdrop-blur-xs shadow-md shadow-[#a2dbfc]/20 transition-all cursor-pointer"
                  >
                    + Crear nueva cita
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Memories Wall Tab */
          <MemoriesWall
            completedDates={completedDatesList}
            onOpenMemory={(item) => {
              setMemoryDate(item);
              setIsMemoryModalOpen(true);
            }}
            onViewPhoto={(url, title) => setLightboxPhoto({ url, title })}
            onOpenNewDate={() => {
              setEditingDate(null);
              setIsDateModalOpen(true);
            }}
            onOpenMap={() => setIsMapOpen(true)}
          />
        )}
      </main>

      {/* Floating Action Button on Mobile with baby blue */}
      <div className="sm:hidden fixed bottom-5 right-5 z-20">
        <button
          onClick={() => {
            setEditingDate(null);
            setIsDateModalOpen(true);
          }}
          className="w-14 h-14 rounded-full bg-[#a2dbfc]/90 hover:bg-[#a2dbfc] text-[#061428] shadow-xl shadow-[#a2dbfc]/25 flex items-center justify-center active:scale-95 transition-transform cursor-pointer font-black border border-[#a2dbfc]/60 backdrop-blur-xs"
          aria-label="Nueva cita"
        >
          <Plus className="w-7 h-7 stroke-[3]" />
        </button>
      </div>

      {/* Romantic Footer */}
      <footer className="mt-12 py-6 border-t border-slate-800/80 bg-[#060a14]/90 backdrop-blur-xs text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SleepingChicksLogo className="w-8 h-6" />
            <span className="font-lettering text-2xl text-[#a2dbfc] font-bold">
              Sweet Date
            </span>
            <span>· Hecho para enamorarse un poquito más cada día</span>
          </div>
          <div className="flex items-center gap-3">
            <PWAInstallButton />
            <span className="text-slate-300">
              {profile.partner1} ❤️ {profile.partner2}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <button
              onClick={handleResetData}
              className="text-[#a2dbfc] hover:underline font-bold cursor-pointer text-[11px]"
            >
              Cargar planes de ejemplo
            </button>
          </div>
        </div>
      </footer>

      {/* Core Modals */}
      <DateModal
        isOpen={isDateModalOpen}
        onClose={() => {
          setIsDateModalOpen(false);
          setEditingDate(null);
        }}
        onSave={handleSaveDate}
        initialData={editingDate}
        currency={profile.currency}
      />

      <RandomDateModal
        isOpen={isRandomizerOpen}
        onClose={() => setIsRandomizerOpen(false)}
        pendingDates={pendingDatesList}
        currency={profile.currency}
        onSelectDate={(item) => {
          setEditingDate(item);
          setIsDateModalOpen(true);
        }}
      />

      <MemoryModal
        isOpen={isMemoryModalOpen}
        onClose={() => {
          setIsMemoryModalOpen(false);
          setMemoryDate(null);
        }}
        dateItem={memoryDate}
        onSaveMemory={handleSaveMemory}
      />

      <CoupleSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onSaveProfile={setProfile}
        dates={dates}
        onImportData={handleImportData}
        onResetData={handleResetData}
      />

      <PhotoLightbox
        photo={lightboxPhoto}
        onClose={() => setLightboxPhoto(null)}
      />

      {/* Feature Modals */}
      <AIInspireModal
        isOpen={isAIInspireOpen}
        onClose={() => setIsAIInspireOpen(false)}
        currency={profile.currency}
        partner1={profile.partner1}
        partner2={profile.partner2}
        onAddDate={handleSaveDate}
      />

      <ChallengesModal
        isOpen={isChallengesOpen}
        onClose={() => setIsChallengesOpen(false)}
        challenges={challenges}
        onUpdateChallenges={setChallenges}
        currency={profile.currency}
        onAddDate={handleSaveDate}
      />

      <BadgesModal
        isOpen={isBadgesOpen}
        onClose={() => setIsBadgesOpen(false)}
        dates={dates}
        profile={profile}
        challenges={challenges}
      />

      <TimeCapsuleModal
        isOpen={isCapsulesOpen}
        onClose={() => setIsCapsulesOpen(false)}
        capsules={capsules}
        onSaveCapsules={setCapsules}
        profile={profile}
      />

      <CoupleSyncModal
        isOpen={isSyncOpen}
        onClose={() => setIsSyncOpen(false)}
        profile={profile}
        onSaveProfile={setProfile}
        dates={dates}
        onSaveDates={setDates}
        capsules={capsules}
        onSaveCapsules={setCapsules}
        challenges={challenges}
        onSaveChallenges={setChallenges}
      />

      <SweetDateWrappedModal
        isOpen={isWrappedOpen}
        onClose={() => setIsWrappedOpen(false)}
        dates={dates}
        profile={profile}
      />

      <MemoriesMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        dates={dates}
        onViewPhoto={(url, title) => setLightboxPhoto({ url, title })}
      />

    </div>
  );
}
