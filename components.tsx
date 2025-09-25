import React from 'react';
import type { Row } from './types';
import { nowHHMM, proximoLuegoDe, nombreResumen } from './utils';

// Component: Chip
export const Chip: React.FC<{ children: React.ReactNode; title?: string }> = ({ children, title }) => (
  <span title={title} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-700 border border-neutral-600 text-neutral-300">
    {children}
  </span>
);

// Component: Card
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`rounded-2xl shadow-sm border border-neutral-700 bg-neutral-800 ${className || ""}`}>{children}</div>
);

// Component: SectionTitle
export const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-xl font-bold tracking-tight text-neutral-50">{children}</h2>
);

// Component: Header
interface HeaderProps {
    time: string;
    setTime: (time: string) => void;
    earliest?: string;
    latest?: string;
    rangeMins: number;
    setRangeMins: (mins: number) => void;
    needle: string;
    setNeedle: (needle: string) => void;
    entradas: string[];
    selectedEntrada: string;
    setSelectedEntrada: (entrada: string) => void;
    athletesAndTeams: string[];
    selectedAthlete: string;
    setSelectedAthlete: (athlete: string) => void;
    onRefresh: () => void;
}
export const Header: React.FC<HeaderProps> = ({ time, setTime, earliest, latest, rangeMins, setRangeMins, needle, setNeedle, entradas, selectedEntrada, setSelectedEntrada, athletesAndTeams, selectedAthlete, setSelectedAthlete, onRefresh }) => {
  const isAthleteSelected = !!selectedAthlete;
  
  return (
    <header className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur border-b border-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 px-3 rounded-xl bg-yellow-400 text-black grid place-items-center font-bold text-lg">
              TABA
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight text-neutral-100">¿Quién compite ahora?</h1>
              <p className="text-sm text-neutral-400">Horarios de la competencia Mbarete 2025</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="time"
              className="px-3 py-2 rounded-xl border border-neutral-600 bg-neutral-800 text-neutral-100 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              value={time}
              min={earliest}
              max={latest}
              onChange={(e) => setTime(e.target.value)}
              style={{ colorScheme: 'dark' }}
              disabled={isAthleteSelected}
              title={isAthleteSelected ? "Deshabilitado al filtrar por atleta" : "Seleccionar hora"}
            />
            <button
              onClick={() => setTime(nowHHMM())}
              className="px-4 py-2 rounded-xl border-none text-sm font-bold bg-yellow-400 text-black hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 focus:ring-offset-neutral-900 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-yellow-400"
              disabled={isAthleteSelected}
              title={isAthleteSelected ? "Deshabilitado al filtrar por atleta" : "Ir a la hora actual"}
            >
              Ahora
            </button>
            <select
              className="px-3 py-2 rounded-xl border border-neutral-600 bg-neutral-800 text-neutral-100 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
              value={rangeMins}
              onChange={(e) => setRangeMins(Number(e.target.value))}
              title={isAthleteSelected ? "Deshabilitado al filtrar por atleta" : "Rango alrededor de la hora seleccionada"}
              disabled={isAthleteSelected}
            >
              {[0, 5, 10, 15, 20, 30].map((n) => (
                <option key={n} value={n}>
                  ±{n} min
                </option>
              ))}
            </select>
            <select
              className="px-3 py-2 rounded-xl border border-neutral-600 bg-neutral-800 text-neutral-100 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition appearance-none"
              value={selectedEntrada}
              onChange={(e) => setSelectedEntrada(e.target.value)}
              title="Filtrar por entrada"
            >
              <option value="">Todas las Entradas</option>
              {entradas.map((e) => (
                <option key={e} value={e}>
                  Entrada {e}
                </option>
              ))}
            </select>
            <select
              className="px-3 py-2 rounded-xl border border-neutral-600 bg-neutral-800 text-neutral-100 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition appearance-none"
              value={selectedAthlete}
              onChange={(e) => setSelectedAthlete(e.target.value)}
              title="Filtrar por atleta o equipo"
            >
              <option value="">Atleta / Equipo</option>
              {athletesAndTeams.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <div className="relative">
                <input
                  placeholder="Buscar atleta, categoría, dupla..."
                  className="px-3 py-2 rounded-xl border border-neutral-600 bg-neutral-800 text-neutral-100 placeholder:text-neutral-500 w-56 sm:w-64 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition pl-9"
                  value={needle}
                  onChange={(e) => setNeedle(e.target.value)}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <button
              onClick={onRefresh}
              className="p-2.5 rounded-xl border border-neutral-600 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 focus:ring-offset-neutral-900 transition"
              title="Refrescar filtros y ver ahora"
              aria-label="Refrescar filtros y ver ahora"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.4 6.4a9 9 0 1 1-11.41 2.39M15 2v5h-5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Component: CompetitionCard
interface CompetitionCardProps { row: Row; }
export const CompetitionCard: React.FC<CompetitionCardProps> = ({ row: r }) => {
  const title = r.companero ? `${r.atleta} y ${r.companero}` : r.atleta;

  return (
    <div className="rounded-2xl border border-neutral-700 p-3 bg-neutral-800 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/5 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="text-base font-bold font-mono text-yellow-400">{r.hora}</div>
        <div className="flex gap-1">
          {r.wod && <Chip>WOD {r.wod}</Chip>}
          {r.heat && <Chip>Heat {r.heat}</Chip>}
        </div>
      </div>
      <div className="mt-2">
        <div className="text-lg font-bold text-neutral-100">{title}</div>
        {r.dupla && (
          <div className="text-sm text-neutral-400">
            <span className="italic">{r.dupla}</span>
          </div>
        )}
        {r.categoria && (
          <div className="mt-2">
            <Chip>{r.categoria}</Chip>
          </div>
        )}
      </div>
    </div>
  );
};


// Component: NoResults
interface NoResultsProps { time: string; rows: Row[]; }
export const NoResults: React.FC<NoResultsProps> = ({ time, rows }) => {
  const renderNextCompetitor = () => {
    if (!time) return null;
    const nextCompetitor = proximoLuegoDe(rows, time);

    if (nextCompetitor) {
      return (
        <p className="font-medium text-neutral-300">
          El próximo en competir es{' '}
          <span className="font-semibold text-yellow-400">{nombreResumen(nextCompetitor)}</span> a las{' '}
          <span className="font-mono">{nextCompetitor.hora}</span>.
        </p>
      );
    }
    return <p className="font-medium text-neutral-300">No hay más heats programados por hoy.</p>;
  };
  
  return (
    <div className="text-center py-10 px-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h3 className="mt-2 text-lg font-medium text-neutral-100">Sin resultados</h3>
      <p className="mt-1 text-sm text-neutral-400">No se encontraron competidores con los filtros actuales.</p>
      <div className="mt-4 text-sm">{renderNextCompetitor()}</div>
    </div>
  );
};

// Component: AdminPanel
interface AdminPanelProps { csv: string; setCsv: (value: string) => void; onApply: () => void; }
export const AdminPanel: React.FC<AdminPanelProps> = ({ csv, setCsv, onApply }) => {
  return (
    <Card className="p-4 sm:p-6">
      <SectionTitle>Administración</SectionTitle>
      <p className="text-sm text-neutral-400 mt-1">
        Pega o edita el CSV del día. Al aplicar se actualiza la vista pública.
      </p>
      <textarea
        className="mt-3 w-full h-64 rounded-xl border border-neutral-600 bg-neutral-900 text-neutral-200 p-3 font-mono text-xs focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
        value={csv}
        onChange={(e) => setCsv(e.target.value)}
        spellCheck="false"
      />
      <div className="mt-3 flex gap-2">
        <button
          className="px-4 py-2 rounded-xl border-none text-sm font-semibold bg-yellow-400 text-black hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 focus:ring-offset-neutral-800 transition"
          onClick={onApply}
        >
          Aplicar CSV
        </button>
        <a className="px-4 py-2 rounded-xl border border-neutral-600 text-sm font-semibold bg-neutral-800 text-neutral-200 hover:bg-neutral-700 transition" href={window.location.pathname}>
          Salir de admin
        </a>
      </div>
      <p className="mt-3 text-xs text-neutral-500">
        Tip: también podés pasar el CSV por URL usando <code>?csv=encodeURIComponent(csv)</code>.
      </p>
    </Card>
  );
};