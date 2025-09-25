import React, { useMemo, useState, useEffect } from "react";
import type { Row } from './types';
import { CSV_EJEMPLO, parseCSV, toMinutes, nowHHMM } from './utils';
import { AdminPanel, CompetitionCard, Card, SectionTitle, NoResults, Header } from './components';

export default function App() {
  const [rows, setRows] = useState<Row[]>([]);
  const [csv, setCsv] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const [time, setTime] = useState<string>("");
  const [rangeMins, setRangeMins] = useState<number>(10);
  const [needle, setNeedle] = useState<string>("");
  const [selectedEntrada, setSelectedEntrada] = useState<string>("");
  const [selectedAthlete, setSelectedAthlete] = useState<string>("");

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    setIsAdmin(sp.get("admin") === "1");
    const urlCsv = sp.get("csv");
    const initialCSV = urlCsv ? decodeURIComponent(urlCsv) : CSV_EJEMPLO;
    setCsv(initialCSV);
    setRows(parseCSV(initialCSV));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    if (selectedAthlete) {
      setTime('');
    }
  }, [selectedAthlete]);

  const handleApplyCsv = () => {
    try {
      const parsedRows = parseCSV(csv);
      if (parsedRows.length === 0 && csv.trim() !== '') {
          alert("CSV analizado, pero no se encontraron filas válidas. Revisa el formato.");
      } else {
          alert("Datos actualizados correctamente.");
      }
      setRows(parsedRows);
    } catch(e) {
      console.error("CSV parsing error:", e);
      alert("Error: El formato del CSV es inválido.");
    }
  };

  const handleRefresh = () => {
    setTime(nowHHMM());
    setRangeMins(10);
    setNeedle('');
    setSelectedEntrada('');
    setSelectedAthlete('');
  };

  const earliest = useMemo(() => rows[0]?.hora || "", [rows]);
  const latest = useMemo(() => rows.length > 0 ? rows[rows.length - 1]?.hora : "", [rows]);

  const entradas = useMemo(() => {
    const entradaSet = new Set<string>();
    rows.forEach(r => {
        if (r.entrada) {
            entradaSet.add(r.entrada);
        }
    });
    return Array.from(entradaSet).sort((a, b) => Number(a) - Number(b));
  }, [rows]);

  const athletesAndTeams = useMemo(() => {
    const names = new Set<string>();
    rows.forEach(r => {
        if (r.atleta) names.add(r.atleta);
        if (r.companero) names.add(r.companero);
        if (r.dupla) names.add(r.dupla);
    });
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [rows]);

  const filtered = useMemo(() => {
    let list = rows;
    
    if (selectedEntrada) {
      list = list.filter((r) => r.entrada === selectedEntrada);
    }

    if (needle.trim()) {
      const q = needle.trim().toLowerCase();
      list = list.filter((r) =>
        [r.atleta, r.companero, r.categoria, r.dupla, r.entrada, r.heat, r.wod]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    if (selectedAthlete) {
      list = list.filter((r) =>
        r.atleta === selectedAthlete ||
        r.companero === selectedAthlete ||
        r.dupla === selectedAthlete
      );
    } else if (time) {
      const t = toMinutes(time);
      if (!isNaN(t)) {
        list = list.filter((r) => {
          const rowTime = toMinutes(r.hora);
          return !isNaN(rowTime) && Math.abs(rowTime - t) <= rangeMins;
        });
      }
    }
    return list;
  }, [rows, time, rangeMins, needle, selectedEntrada, selectedAthlete]);
  
  const grouped = useMemo(() => {
    const map = new Map<string, Row[]>();
    filtered.forEach((r) => {
      const key = r.entrada || "?";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    });
    map.forEach((arr) => arr.sort((a, b) => toMinutes(a.hora) - toMinutes(b.hora)));
    return Array.from(map.entries()).sort((a, b) => Number(a[0]) - Number(b[0]));
  }, [filtered]);

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100">
      <Header 
        time={time} 
        setTime={setTime}
        earliest={earliest}
        latest={latest}
        rangeMins={rangeMins}
        setRangeMins={setRangeMins}
        needle={needle}
        setNeedle={setNeedle}
        entradas={entradas}
        selectedEntrada={selectedEntrada}
        setSelectedEntrada={setSelectedEntrada}
        athletesAndTeams={athletesAndTeams}
        selectedAthlete={selectedAthlete}
        setSelectedAthlete={setSelectedAthlete}
        onRefresh={handleRefresh}
      />
      
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 grid gap-6">
        <Card className="p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <SectionTitle>
              {selectedAthlete ? (
                <>
                  Heats de <span className="text-yellow-400">{selectedAthlete}</span> ({filtered.length})
                </>
              ) : time ? (
                <>
                  Resultados para las <span className="font-mono text-yellow-400">{time}</span> (±{rangeMins} min)
                </>
              ) : (
                <>Todos los Heats ({filtered.length})</>
              )}
            </SectionTitle>
            <div className="text-sm text-neutral-400 font-mono">
              {earliest || "--:--"} → {latest || "--:--"}
            </div>
          </div>

          {grouped.length === 0 ? (
            <NoResults time={time} rows={rows} />
          ) : (
            <div className="space-y-6">
              {grouped.map(([entrada, arr]) => (
                <div key={entrada}>
                  <div className="flex items-center gap-3 mb-3 border-b pb-2 border-neutral-700">
                    <h3 className="text-lg font-semibold text-neutral-100">Entrada {entrada}</h3>
                    <span className="text-sm font-medium text-neutral-400">{arr.length} heats</span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {arr.map((r, idx) => (
                      <CompetitionCard key={`${entrada}-${r.hora}-${r.atleta}-${idx}`} row={r} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {isAdmin && <AdminPanel csv={csv} setCsv={setCsv} onApply={handleApplyCsv} />}
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:p-8 py-6 text-center text-sm text-neutral-500">
        Hecho por Juan Viveros para la comunidad de TABA.
      </footer>
    </div>
  );
}