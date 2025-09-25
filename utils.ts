import type { Row } from './types';

// ===== Constants =====

export const CSV_EJEMPLO = `entrada,heat,hora,atleta,compañero,categoria,dupla,wod
1,1,07:00,TANIA,DAHI,BEGINNER DUPLA FEM,TEAM 6700,2
1,2,07:20,NADIA,SOL,BEGINNER DUPLA FEM,WONDER WODMAN,2
1,3,07:40,DAISY,BELEN,BEGINNER DUPLA FEM,TEAM D&B,2
1,4,08:20,TAMARA,ARRUA,ADV FEM,LAS DISTINTAS,3
1,5,08:40,GUSTAVO,PAREDES,SCALED MASTER MASC,PADRES DEL WOD,3
1,6,09:00,ELIAS,RAMIREZ,SCALED MASTER MASC,PADRES DEL WOD,3
1,7,09:40,ANTO,DALMA,SCALED DUPLA FEM,LAS DISTINTAS,3
1,8,10:40,FREDDY,WALTER,SCALED DUPLA MASC,PADRES DEL WOD,3
1,9,11:20,ANDREA,JUNIOR,SCALED DUPLA MIXTA,LA SEÑO Y EL NENE,3
1,10,11:40,CYNTHIA,MIGUEL,SCALED DUPLA MIXTA,LA DOBLE R,3
1,11,12:40,MARIO,ALVAREZ,ADV MASC,,3
1,12,11:48,LAURA,RONALD,SCALED DUPLA MIXTA,TEAM LR,3
1,13,11:48,MAR,ABDO,SCALED DUPLA MIXTA,MAD QUEENS,3
1,14,13:20,ROBERT,MURRAY,RX MASC,,3
1,15,13:36,MARTIN,RIVAS,RX MASC,,3
1,16,13:52,ADRIAN,AZCONA,RX MASC,,3
2,1,10:00,TANIA,DAHI,BEGINNER DUPLA FEM,TEAM 6700,1
2,2,10:20,NADIA,SOL,BEGINNER DUPLA FEM,WONDER WODMAN,1
2,3,10:40,DAISY,BELEN,BEGINNER DUPLA FEM,TEAM D&B,1
2,4,11:20,ANTO,DALMA,SCALED DUPLA FEM,LAS DISTINTAS,1
2,5,13:20,TAMARA,ARRUA,ADV FEM,LAS DISTINTAS,2
2,6,13:36,FREDDY,WALTER,SCALED DUPLA MASC,PADRES DEL WOD,2
2,7,13:52,ROBERT,MURRAY,RX MASC,,2
2,8,14:08,MARTIN,RIVAS,RX MASC,,2
2,9,14:24,ANDREA,JUNIOR,SCALED DUPLA MIXTA,LA SEÑO Y EL NENE,2
2,10,14:40,CYNTHIA,MIGUEL,SCALED DUPLA MIXTA,LA DOBLE R,2
2,11,14:56,GUSTAVO,PAREDES,SCALED MASTER MASC,PADRES DEL WOD,2
2,12,15:12,ELIAS,RAMIREZ,SCALED MASTER MASC,PADRES DEL WOD,2
2,13,15:28,ADRIAN,AZCONA,RX MASC,,2
2,14,15:24,LAURA,RONALD,SCALED DUPLA MIXTA,TEAM LR,2
2,15,15:44,MAR,ABDO,SCALED DUPLA MIXTA,MAD QUEENS,2
2,16,16:24,MARIO,ALVAREZ,ADV MASC,,2
3,1,15:00,TANIA,DAHI,BEGINNER DUPLA FEM,TEAM 6700,3
3,2,15:20,NADIA,SOL,BEGINNER DUPLA FEM,WONDER WODMAN,3
3,3,15:40,DAISY,BELEN,BEGINNER DUPLA FEM,TEAM D&B,3
3,4,16:00,ANTO,DALMA,SCALED DUPLA FEM,LAS DISTINTAS,3
3,5,16:20,FREDDY,WALTER,SCALED DUPLA MASC,PADRES DEL WOD,3
3,6,16:40,ANDREA,JUNIOR,SCALED DUPLA MIXTA,LA SEÑO Y EL NENE,3
3,7,17:00,CYNTHIA,MIGUEL,SCALED DUPLA MIXTA,LA DOBLE R,3
3,8,17:20,GUSTAVO,PAREDES,SCALED MASTER MASC,PADRES DEL WOD,3
3,9,17:40,ELIAS,RAMIREZ,SCALED MASTER MASC,PADRES DEL WOD,3
3,10,18:00,ROBERT,MURRAY,RX MASC,,3
3,11,18:20,MARTIN,RIVAS,RX MASC,,3
3,12,18:40,LAURA,RONALD,SCALED DUPLA MIXTA,TEAM LR,3
3,13,19:00,MAR,ABDO,SCALED DUPLA MIXTA,MAD QUEENS,3
3,14,19:20,ADRIAN,AZCONA,RX MASC,,3
3,15,20:00,TAMARA,ARRUA,ADV FEM,LAS DISTINTAS,3
3,16,20:20,MARIO,ALVAREZ,ADV MASC,,3`;


// ===== Helpers =====

export const toMinutes = (hhmm: string): number => {
  const m = /^\s*(\d{1,2}):(\d{2})\s*$/.exec(hhmm || "");
  if (!m) return NaN;
  const h = parseInt(m[1], 10);
  const mi = parseInt(m[2], 10);
  return h * 60 + mi;
};

export const parseCSV = (csv: string): Row[] => {
  const lines = csv.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return [];
  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, ""));
  const idx = (name: string) => headers.indexOf(name);
  const rows: Row[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.trim());
    if (cols.length === 0 || cols.every(c => c === '')) continue;
    rows.push({
      entrada: cols[idx("entrada")] || "",
      heat: cols[idx("heat")] || "",
      hora: cols[idx("hora")] || "",
      atleta: cols[idx("atleta")] || "",
      companero: cols[idx("compañero")] || cols[idx("companero")] || "",
      categoria: cols[idx("categoria")] || "",
      dupla: cols[idx("dupla")] || cols[idx("nombre dupla")] || "",
      wod: cols[idx("wod")] || "",
    });
  }
  return rows.filter((r) => r.hora).sort((a, b) => toMinutes(a.hora) - toMinutes(b.hora));
};


export const nombreResumen = (r: Row | null): string => {
  if (!r) return "";

  // Determinar si es una categoría de duplas
  const isDupla = r.categoria?.toUpperCase().includes('DUPLA');

  if (isDupla) {
    // Para duplas, unir nombres con "y"
    return r.companero ? `${r.atleta} y ${r.companero}` : r.atleta;
  } else {
    // Para atletas individuales, el CSV usa 'atleta' para nombre y 'companero' para apellido.
    // Unirlos con un espacio.
    return r.companero ? `${r.atleta} ${r.companero}` : r.atleta;
  }
};

export const proximoLuegoDe = (rows: Row[], hhmm: string): Row | null => {
  const t = toMinutes(hhmm);
  if (isNaN(t)) return null;
  for (const r of rows) {
    if (toMinutes(r.hora) >= t) return r;
  }
  return null;
};

export const nowHHMM = (): string => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};