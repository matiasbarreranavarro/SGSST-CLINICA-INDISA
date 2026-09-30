import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, PieChart, Pie, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";
import {
  Search, ShieldCheck, ChevronRight, ChevronDown, CircleCheck, CircleDashed, HelpCircle, X, FileText, BookOpen, Tag, Link2, LayoutGrid, Table2, Milestone, ArrowUpDown, ListChecks, TrendingUp, TrendingDown, Printer, AlertTriangle, Users, Clock, Gauge, XCircle,
} from "lucide-react";

/* ---------------------------------------------------------------
   DATA — Clínica Indisa SGSST, estado real acumulado en el chat
   Cada documento incluye:
     c  = código
     t  = título
     e  = estado (Completado / Pendiente)
     r  = resumen (qué hace el documento)
     b  = base normativa principal
--------------------------------------------------------------- */

const LOGO_B64 = "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";

const NIVELES = [
  {
    id: 1,
    nombre: "Marco Estratégico",
    prefijo: "Nivel 1",
    color: "#0E3379",
    docs: [
      { c: "MN-SST-01", t: "Manual del Sistema de Gestión SST", e: "Completado",
        r: "Documento marco que describe el SGSST completo según las cláusulas 4 a 10 de ISO 45001, referenciando los 16 procedimientos y la arquitectura documental de 4 niveles.",
        b: "ISO 45001:2018 (Cap. 4) / D.S. N°44 Art. 22" },
      { c: "PO-SST-01", t: "Política de Seguridad y Salud en el Trabajo", e: "Completado",
        r: "Declaración formal de los compromisos irrenunciables de la clínica en materia de SST, firmada por Gerencia. Pendiente incorporar mención explícita a Ley Karin y perspectiva de género.",
        b: "ISO 45001:2018 (5.2) / D.S. N°44 Art. 21" },
      { c: "OB-SST-01", t: "Tablero de Objetivos e Indicadores de SST", e: "Completado",
        r: "Objetivos SMART con fórmula de cálculo, indicador, frecuencia y responsable. Pendiente actualizar con la línea base real 2025 (accidentabilidad 1,4%, TRIR 2,78).",
        b: "ISO 45001:2018 (6.2) / D.S. N°44 Art. 73" },
      { c: "CT-SST-01", t: "Análisis de Contexto de la Organización", e: "Completado",
        r: "FODA/PESTEL construido con datos reales de la Memoria Anual 2025: perfil institucional, indicadores oficiales de seguridad, dotación y alcance propuesto del SGSST.",
        b: "ISO 45001:2018 (4.1)" },
    ],
  },
  {
    id: 2,
    nombre: "Procedimientos de Gestión",
    prefijo: "Nivel 2",
    color: "#0E64C4",
    docs: [
      { c: "PR-SST-01", t: "Identificación de Peligros y Evaluación de Riesgos (MIPER)", e: "Completado",
        r: "Metodología GEMA+VEP para identificar peligros y evaluar riesgos por puesto de trabajo, con enfoque de género obligatorio.", b: "ISO 45001 (6.1.2) / Guía ISP V.3 / D.S. N°44 Art. 7" },
      { c: "PR-SST-02", t: "Identificación y Cumplimiento de Requisitos Legales", e: "Completado",
        r: "Define cómo se identifican, actualizan semestralmente y evalúan los requisitos legales aplicables a la clínica (RG-SST-08).", b: "ISO 45001 (6.1.3, 9.1.2) / D.S. N°44 Art. 4" },
      { c: "PR-SST-03", t: "Consulta, Participación y Comunicaciones (CPHS)", e: "Completado",
        r: "Regula la elección, funcionamiento y participación del Comité Paritario, más los mecanismos de consulta directa a trabajadores.", b: "ISO 45001 (5.4, 7.4) / D.S. N°44 Título III" },
      { c: "PR-SST-04", t: "Preparación y Respuesta ante Emergencias", e: "Completado",
        r: "Articula el actuar ante riesgo grave e inminente, simulacros y coordinación con PT-075.", b: "ISO 45001 (8.2) / D.S. N°44 Art. 18-19" },
      { c: "PR-SST-05", t: "Investigación de Incidentes, Accidentes y EE.PP.", e: "Completado",
        r: "Metodología de Árbol de Causas/5 Porqués para investigar accidentes, incorporando análisis con enfoque de género.", b: "ISO 45001 (10.2) / D.S. N°44 Art. 71" },
      { c: "PR-SST-06", t: "Control de Contratistas y Subcontratistas", e: "Completado",
        r: "Precalificación, coordinación de riesgos de interfaz e inducción de empresas contratistas antes de ingresar a faenas.", b: "ISO 45001 (8.1.4.2) / Ley 20.123 / D.S. N°76" },
      { c: "PR-SST-07", t: "Control de Información Documentada", e: "Completado",
        r: "Define la codificación oficial del sistema (MN/PO/OB/CT/PR/DO/PT-MIN/RG) y las reglas de control de versiones.", b: "ISO 45001 (7.5)" },
      { c: "PR-SST-08", t: "Auditoría Interna y Revisión por la Alta Dirección", e: "Completado",
        r: "Metodología de auditoría interna y de la Revisión Gerencial anual, con sus entradas y salidas según la norma.", b: "ISO 45001 (9.2, 9.3) / D.S. N°44 Art. 14" },
      { c: "PR-SST-09", t: "Gestión del Cambio", e: "Completado",
        r: "5 etapas para evaluar riesgos nuevos antes de introducir cambios (equipos, procesos, turnos, sustancias).", b: "ISO 45001 (8.1.3)" },
      { c: "PR-SST-10", t: "Gestión de Compras y Adquisiciones en SST", e: "Completado",
        r: "Exige Hoja de Datos de Seguridad (HDS) y evaluación DPR antes de adquirir insumos o sustancias químicas.", b: "ISO 45001 (8.1.4.1) / NCh 2245" },
      { c: "PR-SST-11", t: "Gestión de No Conformidades y Acciones Correctivas", e: "Completado",
        r: "Ciclo de detección, causa raíz (5 Porqués/Ishikawa), acción correctiva y verificación de eficacia.", b: "ISO 45001 (10.2)" },
      { c: "PR-SST-12", t: "Vigilancia de la Salud Ocupacional", e: "Completado",
        r: "Programa de exámenes ocupacionales según exposición, resguardando confidencialidad de datos sensibles.", b: "ISO 45001 (9.1.1) / Ley 16.744" },
      { c: "PR-SST-13", t: "Capacitación, Inducción y Evaluación de Competencias", e: "Completado",
        r: "Regula inducción, programa anual de capacitación y verificación de comprensión (mínimo 75% de aprobación).", b: "ISO 45001 (7.2) / D.S. N°44 Art. 15-16" },
      { c: "PR-SST-14", t: "Gestión, Uso y Recambio de EPP", e: "Completado",
        r: "Entrega, inspección periódica y reposición de EPP, con enfoque de género en el tallaje.", b: "ISO 45001 (8.1.2) / D.S. N°594" },
      { c: "PR-SST-15", t: "Trabajo Seguro en Máquinas, Equipos y Herramientas", e: "Completado",
        r: "Procedimiento LOTO de bloqueo y etiquetado en 5 pasos para intervención segura de equipos.", b: "ISO 45001 (8.1.2) / D.S. N°44 Art. 10" },
      { c: "PR-SST-16", t: "Prevención, Investigación y Sanción del Acoso Laboral (Ley Karin)", e: "Completado",
        r: "Metodología completa de denuncia, resguardo, investigación (30 días hábiles) y sanción del acoso y violencia laboral.", b: "Ley N°21.643 / Código del Trabajo Art. 211-A a 211-E" },
    ],
  },
  {
    id: 3,
    nombre: "Documentos Operativos",
    prefijo: "Nivel 3",
    color: "#1189FA",
    docs: [
      { c: "DO-SST-01", t: "Reglamento Interno de Orden, Higiene y Seguridad (RIOHS)", e: "Completado",
        r: "Reglamento legal de 163 páginas, incluye Título XII (Ley Karin) y Anexo 1 de Protocolos MINSAL.", b: "Código del Trabajo / Ley Karin / D.S. N°44" },
      { c: "DO-SST-02", t: "Programa de Trabajo Preventivo Anual", e: "Completado",
        r: "Cronograma anual de actividades preventivas en 4 ejes, con fecha, responsable y registro asociado.", b: "D.S. N°44 Art. 8" },
      { c: "DO-SST-03", t: "Mapas de Riesgos Institucionales", e: "Completado",
        r: "Mapas por área con metodología rigurosa, incorporando ajustes de accesibilidad (Braille, audio).", b: "D.S. N°44 Art. 62" },
      { c: "DO-SST-04", t: "Plan de Difusión e Implementación del SGSST", e: "Completado",
        r: "6 fases para pasar de documentación a práctica real: sensibilización, capacitación en cascada, difusión, instalación de registros, verificación y auditoría piloto.", b: "ISO 45001 (5.1, 5.4, 7.3)" },
      { c: "PT-075", t: "Plan de Emergencia y Evacuación Providencia", e: "Completado",
        r: "Plan institucional de 32 páginas, vigente hasta 2029, con planimetría y protocolos por tipo de emergencia — solo cubre la sede Providencia.", b: "ISO 45001 (8.2) / Exigencia SEREMI" },
      { c: "PT-MIN-01", t: "Vigilancia de Riesgos Psicosociales (CEAL-SM)", e: "Completado",
        r: "Aplicación del cuestionario CEAL-SM en 5 dimensiones, con reevaluación según nivel de riesgo (1 a 3 años).", b: "Protocolo MINSAL/SUSESO" },
      { c: "PT-MIN-02", t: "Vigilancia de Radiaciones Ionizantes", e: "Completado",
        r: "Clasificación de trabajadores (Categoría A/B), límites de dosis, dosimetría personal y rol del Oficial de Protección Radiológica.", b: "D.S. N°3 y N°133 MINSAL" },
      { c: "PT-MIN-03", t: "Manejo de Citostáticos y Agentes Biológicos (REAS)", e: "Completado",
        r: "EPP y controles para preparación/administración de citostáticos, gestión de derrames y disposición de REAS.", b: "D.S. N°6 (2009) MINSAL" },
      { c: "PT-MIN-04", t: "TMERT y Manejo Manual de Carga (MMC)", e: "Completado",
        r: "Límites legales de carga (25kg H / 20kg M), metodología de evaluación y controles para movilización de pacientes.", b: "Ley N°20.949 / Guía Técnica MINSAL" },
    ],
  },
  {
    id: 4,
    nombre: "Registros del Sistema",
    prefijo: "Nivel 4",
    color: "#009DDD",
    docs: [
      { c: "RG-SST-04", t: "Registro de Entrega del Reglamento Interno de Orden, Higiene y Seguridad (RIOHS)", e: "Completado", r: "Evidencia de que cada trabajador recibió una copia física o digital del RIOHS (DO-SST-01) al momento de su ingreso, con firma de recepción.", b: "Artículos 153 al 157 Código del Trabajo / D.S. N°44" },
      { c: "RG-SST-01", t: "Matriz MIPER", e: "Completado", r: "Archivo real y en uso activo, con más de 1.000 tareas/procesos catalogados — el activo más maduro del sistema.", b: "Evidencia de aplicación Guía ISP V.3" },
      { c: "RG-SST-02", t: "Análisis y Permiso de Trabajo Seguro (APTS)", e: "Completado", r: "Plantilla para autorizar tareas de alto riesgo en terreno, con verificación LOTO y factores humanos/género.", b: "Control operacional" },
      { c: "RG-SST-03", t: "Asistencia a Capacitaciones e Inducciones", e: "Completado", r: "Registro de asistencia con campo de sexo para desagregación estadística.", b: "Evidencia legal IRL" },
      { c: "RG-SST-05", t: "Entrega y Reposición de EPP", e: "Completado", r: "Registro de entrega inicial de EPP, cita Art. 53 D.S. 594.", b: "D.S. N°594 Art. 53" },
      { c: "RG-SST-06", t: "Cuadro Estadístico de Accidentabilidad Mensual", e: "Completado", r: "Seguimiento mensual de indicadores de siniestralidad, con desagregación por sexo.", b: "D.S. N°44 Art. 73" },
      { c: "RG-SST-07", t: "Lista Maestra de Control de Documentos", e: "Completado", r: "El documento maestro de control que rige la numeración y estado de todo el SGSST — este mismo dashboard se construye a partir de él.", b: "Control documental" },
      { c: "RG-SST-08", t: "Matriz de Requisitos Legales", e: "Completado", r: "Consolida toda la normativa aplicable con evidencia de cumplimiento y estado (Cumple/Brecha).", b: "ISO 45001 (6.1.3)" },
      { c: "RG-SST-09", t: "Pautas y Evaluaciones de Verificación de Comprensión", e: "Completado", r: "Reformateado en dos partes: 09-A (cuestionario base) y 09-B (planilla de seguimiento acumulativo).", b: "D.S. N°44 Art. 21" },
      { c: "RG-SST-10", t: "Matriz de No Conformidades y Acciones Correctivas", e: "Completado", r: "Registro central donde convergen los hallazgos de auditorías, inspecciones e investigaciones.", b: "ISO 45001 (10.2)" },
      { c: "RG-SST-11", t: "Acta de Elección y Constitución del CPHS", e: "Completado", r: "Formaliza la votación y constitución del Comité Paritario, con registro ante la DT.", b: "D.S. N°44 Art. 23-36" },
      { c: "RG-SST-12", t: "Acta de Reunión Mensual del CPHS", e: "Completado", r: "Acta estándar con checklist de temas obligatorios y acuerdos con responsable y plazo.", b: "D.S. N°44 Art. 37, 39" },
      { c: "RG-SST-13", t: "Programa de Trabajo Anual del CPHS", e: "Completado", r: "Cronograma trimestral de actividades del Comité, indicador directo del Objetivo N°3 de OB-SST-01.", b: "D.S. N°44 Art. 47" },
      { c: "RG-SST-14", t: "Evaluación Técnica de Simulacros Anuales", e: "Completado", r: "Registra tiempos de detección, alarma y evacuación vs. la meta de PT-075, por punto de encuentro.", b: "D.S. N°44 Art. 18" },
      { c: "RG-SST-15", t: "Inspección Mensual de Sistemas y Emergencias", e: "Completado", r: "Checklist en 5 bloques: extintores, red húmeda, vías de evacuación, detección/alarma y puntos de encuentro.", b: "D.S. N°594 Art. 44-46" },
      { c: "RG-SST-16", t: "Notificaciones a la DT por Riesgo Inminente", e: "Completado", r: "Respaldo de cada suspensión de faenas y su notificación formal a la Dirección del Trabajo.", b: "D.S. N°44 Art. 18-19" },
      { c: "RG-SST-17", t: "Investigación de Accidentes e Incidentes", e: "Completado", r: "Informe completo por caso: causas inmediatas/básicas, enfoque de género y gestión de DIAT.", b: "Ley 16.744 Art. 76" },
      { c: "RG-SST-18", t: "Libro de Siniestralidad (Acumulado Anual)", e: "Completado", r: "Cierre anual oficial de los 12 meses, firmado por Gerencia — distinto del seguimiento mensual (RG-SST-06).", b: "D.S. N°44 Art. 73" },
      { c: "RG-SST-19", t: "Inventario de Máquinas, Equipos y Herramientas", e: "Completado", r: "Catastro de equipos con estado, mantención y si requieren procedimiento LOTO.", b: "D.S. N°44 Art. 10" },
      { c: "RG-SST-20", t: "Inspección Pre-uso de Herramientas", e: "Completado", r: "Checklist diario de verificación antes de usar cualquier herramienta manual o eléctrica.", b: "Control preventivo diario" },
      { c: "RG-SST-21", t: "Permiso de Bloqueo de Energías Peligrosas (LOTO)", e: "Completado", r: "Autoriza formalmente la intervención de equipos, verificando cada paso del procedimiento LOTO.", b: "D.S. N°44 Art. 10" },
      { c: "RG-SST-22", t: "Acreditación Documental de Contratistas", e: "Completado", r: "Filtro documental previo al ingreso: F30-1, tasa de accidentabilidad, RIOHS propio, cotizaciones al día.", b: "Ley 16.744 Art. 66 bis / D.S. N°76" },
      { c: "RG-SST-23", t: "Auditoría Mensual de Desempeño SST (Contratistas)", e: "Completado", r: "Evalúa en terreno a contratistas con 6 criterios ponderados, exigiendo un estándar mínimo de 85%.", b: "PR-SST-06" },
      { c: "RG-SST-24", t: "Coordinación de Actividades Preventivas", e: "Completado", r: "Acta de reunión de riesgos de interfaz entre la clínica y cada contratista antes del inicio de obra.", b: "Ley 16.744 Art. 66 bis" },
      { c: "RG-SST-25", t: "Evaluación de Compras Críticas en SST", e: "Completado", r: "Visto bueno del DPR antes del ingreso de insumos químicos o equipos críticos.", b: "ISO 45001 (8.1.4.1)" },
      { c: "RG-SST-26", t: "Solicitud y Evaluación de Gestión del Cambio", e: "Completado", r: "Formulario operativo asociado a PR-SST-09, de vigencia permanente por cada cambio evaluado.", b: "ISO 45001 (8.1.3)" },
      { c: "RG-SST-27", t: "Nómina de Expuestos a Programas de Vigilancia", e: "Completado", r: "Nómina de trabajadores expuestos incorporados a los programas de vigilancia epidemiológica MINSAL.", b: "Protocolos MINSAL" },
      { c: "RG-SST-28", t: "Citaciones y Cobertura de Exámenes Ocupacionales", e: "Completado", r: "Registro de citaciones, asistencia y cobertura de exámenes de vigilancia médica ocupacional.", b: "PR-SST-12" },
      { c: "RG-SST-29", t: "Programa y Plan de Auditoría Interna", e: "Completado", r: "Programación anual de auditorías más el informe de hallazgos por auditoría ejecutada.", b: "ISO 45001 (9.2)" },
      { c: "RG-SST-30", t: "Informe de Auditoría Interna", e: "Completado", r: "Síntesis ejecutiva post-auditoría: fortalezas, hallazgos por clasificación y conclusión general.", b: "ISO 45001 (9.2)" },
      { c: "RG-SST-31", t: "Acta de Revisión por la Alta Dirección", e: "Completado", r: "Estructurada según las entradas/salidas exigidas por la cláusula 9.3: desempeño, recursos y decisiones.", b: "ISO 45001 (9.3)" },
      { c: "RG-SST-32", t: "Acta de Constitución del Comité de Aplicación (CdA)", e: "Completado", r: "Constituye el órgano interno Ley Karin: integrantes, funciones y vigencia.", b: "Ley N°21.643" },
      { c: "RG-SST-33", t: "Asistencia a Sesiones y Capacitaciones del CdA", e: "Completado", r: "Bitácora de sesiones ordinarias y de difusión del protocolo Ley Karin.", b: "Ley N°21.643" },
      { c: "RG-SST-34", t: "Informe de Resultados CEAL-SM", e: "Completado", r: "Resultados por dimensión y área, sin identificar individualmente a los respondientes.", b: "Protocolo MINSAL/SUSESO" },
      { c: "RG-SST-35", t: "Plan de Acción de Riesgos Psicosociales", e: "Completado", r: "Medidas de acción por área para los hallazgos de riesgo alto/medio de RG-SST-34.", b: "PR-SST-12" },
      { c: "RG-SST-36", t: "Control, Entrega y Recepción de Dosímetros", e: "Completado", r: "Trazabilidad de entrega, período de uso y lectura de dosímetros por trabajador expuesto.", b: "D.S. N°3 MINSAL" },
      { c: "RG-SST-37", t: "Historial Dosimétrico Individual", e: "Completado", r: "Consolidado mensual y anual de dosis por trabajador, comparado con el límite legal (20 mSv/año).", b: "D.S. N°3 MINSAL" },
      { c: "RG-SST-38", t: "Integridad de EPP Plomados", e: "Completado", r: "Prueba radioscópica anual de delantales y protectores plomados usados en radiología.", b: "D.S. N°3 MINSAL" },
      { c: "RG-SST-39", t: "Conformación y Capacitación Brigada de Emergencia", e: "Completado", r: "Nómina de brigadistas por rol y su historial de capacitación/recertificación.", b: "D.S. N°594 Título III" },
      { c: "RG-SST-40", t: "Inspección Periódica y Reposición de EPP", e: "Completado", r: "Seguimiento del estado del EPP en uso, complementa a la entrega inicial (RG-SST-05).", b: "D.S. N°594 Art. 53" },
      { c: "RG-SST-41", t: "Inducción y Control de Acceso de Contratistas", e: "Completado", r: "Registro individual por trabajador contratista, condiciona su acceso a instalaciones.", b: "Ley 16.744 Art. 66 bis" },
      { c: "RG-SST-42", t: "Programa Anual de Capacitación", e: "Completado", r: "Cronograma trimestral de los 10 cursos SST del año, con relator y estado de ejecución.", b: "ISO 45001 (7.2)" },
      { c: "RG-SST-43", t: "Evaluación de Eficacia de la Capacitación", e: "Completado", r: "Verifica 30-90 días después si la capacitación cambió el desempeño real en terreno.", b: "ISO 45001 (7.2, 7.3)" },
      { c: "RG-SST-44", t: "Denuncias e Investigación Ley Karin", e: "Completado", r: "Documento confidencial de acceso restringido para el proceso de denuncia e investigación.", b: "Ley N°21.643" },
      { c: "RG-SST-45", t: "Consulta y Participación de los Trabajadores", e: "Completado", r: "Traza consultas directas a trabajadores más allá de las reuniones formales del CPHS.", b: "D.S. N°44 Art. 21" },
      { c: "RG-SST-46", t: "Matriz de Partes Interesadas", e: "Completado", r: "10 partes interesadas con su expectativa y cómo se aborda en el SGSST.", b: "ISO 45001 (4.2)" },
      { c: "RG-SST-47", t: "Comunicaciones Internas y Externas", e: "Completado", r: "Bitácora de comunicaciones SST relevantes, incluyendo notificaciones obligatorias a DT/SEREMI.", b: "ISO 45001 (7.4)" },
      { c: "RG-SST-48", t: "Seguimiento de Reincorporación Laboral", e: "Completado", r: "Da seguimiento a trabajadores con restricciones médicas hasta su alta sin restricciones.", b: "Ley 16.744 Art. 4" },
      { c: "RG-SST-49", t: "Inspección de Equipos de Protección Colectiva", e: "Completado", r: "Verifica resguardos de máquina, barandas y señalética — protección colectiva antes que EPP individual.", b: "D.S. N°594 Art. 4" },
      { c: "RG-SST-50", t: "Seguimiento de Objetivos y Metas (Consolidado)", e: "Completado", r: "Insumo directo de la Revisión Gerencial: seguimiento trimestral de todos los objetivos de OB-SST-01.", b: "ISO 45001 (6.2, 9.1)" },
      { c: "RG-SST-51", t: "Matriz de Riesgos y Oportunidades Estratégicos", e: "Completado", r: "Riesgos/oportunidades a nivel de sistema (no de puesto de trabajo): rotación de personal clave, crecimiento de Maipú, certificación ISO como diferenciador.", b: "ISO 45001 (6.1.1)" },
      { c: "RG-SST-52", t: "Programa Trienal de Auditoría Interna", e: "Completado", r: "Mapa de cobertura a 3 años que asegura auditar todas las cláusulas de ISO 45001 en el ciclo.", b: "ISO 45001 (9.2)" },
    ],
  },
];

const INDICADORES = [
  { nombre: "Tasa Accidentabilidad", meta: 1.5, real: 1.4, unidad: "%", mejorEsMenor: true },
  { nombre: "Tasa Fatalidad", meta: 0, real: 0, unidad: "/100k", mejorEsMenor: true },
  { nombre: "Enf. Profesionales", meta: 2.2, real: 0.42, unidad: "%", mejorEsMenor: true },
  { nombre: "Días Perdidos Prom.", meta: 15, real: 11, unidad: "días", mejorEsMenor: true },
];

const INDICADORES_TENDENCIA = [
  { nombre: "TRIR", y2024: 0.96, y2025: 2.78, mejorEsMenor: true },
  { nombre: "DART", y2024: 3.27, y2025: 1.22, mejorEsMenor: true },
];

const FASES = [
  {
    n: 1, nombre: "Cierre de Contenido", estado: "Completado", pct: 100,
    responsable: "Depto. Prevención de Riesgos + Consultor SGSST", duracion: "6 semanas",
    pasos: [
      { t: "Diagnóstico riguroso de la carpeta SG-SST-CLINICA INDISA en Drive", e: "Completado" },
      { t: "Desarrollo de los 37 registros correlativos de Nivel 4", e: "Completado" },
      { t: "Realineación de numeración según RG-SST-07 oficial", e: "Completado" },
      { t: "Desarrollo de las 4 brechas estructurales sin dependencias (PR-SST-16, RG-SST-51, RG-SST-52, DO-SST-04)", e: "Completado" },
      { t: "Análisis de Contexto (CT-SST-01) con datos reales de la Memoria Anual 2025", e: "Completado" },
      { t: "Desarrollo de los 4 protocolos PT-MIN", e: "Completado" },
    ],
  },
  {
    n: 2, nombre: "Brechas Estructurales", estado: "En curso", pct: 50,
    responsable: "Depto. Prevención de Riesgos / Gerencia de Personas", duracion: "2-3 semanas",
    pasos: [
      { t: "Matriz de Roles y Responsabilidades SST — a la espera del organigrama", e: "Pendiente" },
      { t: "Plan de Emergencia Maipú", e: "Descartado" },
      { t: "Actualizar OB-SST-01 con línea base real 2025", e: "Pendiente" },
    ],
  },
  {
    n: 3, nombre: "Validación de Coherencia", estado: "Pendiente", pct: 0,
    responsable: "Depto. Prevención de Riesgos", duracion: "1 semana",
    pasos: [
      { t: "Verificar que cada PR-SST cite el código RG-SST correcto tras el renombrado", e: "Pendiente" },
      { t: "Revisión cruzada de MN-SST-01 con los documentos nuevos (CT-SST-01, RG-SST-51, PR-SST-16)", e: "Pendiente" },
      { t: "Verificación de formato: firmas, fechas y versión reemplazadas por datos reales", e: "Pendiente" },
    ],
  },
  {
    n: 4, nombre: "Aprobación Gerencial", estado: "Pendiente", pct: 0,
    responsable: "Gerencia General / Dirección Médica", duracion: "2 semanas",
    pasos: [
      { t: "Presentación del sistema completo a Gerencia General y Dirección Médica", e: "Pendiente" },
      { t: "Corrección de firma de PO-SST-01 (co-firma de la máxima autoridad)", e: "Pendiente" },
      { t: "Aprobación formal de recursos para implementación", e: "Pendiente" },
    ],
  },
  {
    n: 5, nombre: "Implementación en Terreno", estado: "Pendiente", pct: 0,
    responsable: "Depto. Prevención de Riesgos + Jefaturas de Área", duracion: "12 semanas",
    pasos: [
      { t: "Sensibilización gerencial (DO-SST-04, Fase 1)", e: "Pendiente" },
      { t: "Capacitación en cascada a jefaturas (DO-SST-04, Fase 2)", e: "Pendiente" },
      { t: "Difusión general al personal e instalación de registros Nivel 4 (Fases 3-4)", e: "Pendiente" },
      { t: "Verificación de comprensión y auditoría piloto en 3 áreas (Fases 5-6)", e: "Pendiente" },
    ],
  },
  {
    n: 6, nombre: "Primer Ciclo de Auditoría", estado: "Pendiente", pct: 0,
    responsable: "Depto. Prevención de Riesgos + Auditor Interno", duracion: "8 semanas",
    pasos: [
      { t: "Ejecutar el primer Programa Anual de Auditoría (RG-SST-29) según RG-SST-52", e: "Pendiente" },
      { t: "Emitir el primer Informe de Auditoría Interna (RG-SST-30)", e: "Pendiente" },
      { t: "Primera Revisión por la Dirección (RG-SST-31) usando CT-SST-01 y RG-SST-51", e: "Pendiente" },
    ],
  },
  {
    n: 7, nombre: "Certificación ISO 45001", estado: "Pendiente", pct: 0,
    responsable: "Gerencia General + Organismo Certificador", duracion: "16-24 semanas",
    pasos: [
      { t: "Auditoría de brecha (gap analysis) pre-certificación", e: "Pendiente" },
      { t: "Selección del organismo certificador", e: "Pendiente" },
      { t: "Auditoría de certificación Etapa 1 (documental) y Etapa 2 (terreno)", e: "Pendiente" },
    ],
  },
];

const CAPITULOS = [
  { n: 4, nombre: "Contexto de la Organización" },
  { n: 5, nombre: "Liderazgo y Participación" },
  { n: 6, nombre: "Planificación" },
  { n: 7, nombre: "Apoyo" },
  { n: 8, nombre: "Operación" },
  { n: 9, nombre: "Evaluación del Desempeño" },
  { n: 10, nombre: "Mejora" },
];

const CLAUSULAS = [
  { clausula: "4.1", cap: 4, titulo: "Contexto de la organización", docs: ["CT-SST-01"] },
  { clausula: "4.2", cap: 4, titulo: "Partes interesadas y sus requisitos", docs: ["RG-SST-46", "CT-SST-01"] },
  { clausula: "5.1", cap: 5, titulo: "Liderazgo y compromiso", docs: ["MN-SST-01", "DO-SST-04"] },
  { clausula: "5.2", cap: 5, titulo: "Política de SST", docs: ["PO-SST-01"] },
  { clausula: "5.3", cap: 5, titulo: "Roles, responsabilidades y autoridades", docs: [], brecha: "A la espera del organigrama institucional" },
  { clausula: "5.4", cap: 5, titulo: "Consulta y participación de los trabajadores", docs: ["PR-SST-03", "RG-SST-45", "RG-SST-11", "RG-SST-12", "RG-SST-13"] },
  { clausula: "6.1.1", cap: 6, titulo: "Riesgos y oportunidades del sistema", docs: ["RG-SST-51"] },
  { clausula: "6.1.2", cap: 6, titulo: "Identificación de peligros y evaluación de riesgos", docs: ["PR-SST-01", "RG-SST-01"] },
  { clausula: "6.1.3", cap: 6, titulo: "Requisitos legales y otros requisitos", docs: ["PR-SST-02", "RG-SST-08"] },
  { clausula: "6.2", cap: 6, titulo: "Objetivos de SST y planificación", docs: ["OB-SST-01", "RG-SST-50"] },
  { clausula: "7.2", cap: 7, titulo: "Competencia", docs: ["PR-SST-13", "RG-SST-42", "RG-SST-03"] },
  { clausula: "7.3", cap: 7, titulo: "Toma de conciencia", docs: ["DO-SST-04", "RG-SST-43"] },
  { clausula: "7.4", cap: 7, titulo: "Comunicación interna y externa", docs: ["RG-SST-47"] },
  { clausula: "7.5", cap: 7, titulo: "Información documentada", docs: ["PR-SST-07", "RG-SST-07"] },
  { clausula: "8.1.2", cap: 8, titulo: "Eliminación de peligros y reducción de riesgos (EPP)", docs: ["PR-SST-14", "PR-SST-15", "RG-SST-40", "RG-SST-21"] },
  { clausula: "8.1.3", cap: 8, titulo: "Gestión del cambio", docs: ["PR-SST-09", "RG-SST-26"] },
  { clausula: "8.1.4", cap: 8, titulo: "Contratación externa, compras y contratistas", docs: ["PR-SST-06", "PR-SST-10", "RG-SST-22", "RG-SST-25"] },
  { clausula: "8.2", cap: 8, titulo: "Preparación y respuesta ante emergencias", docs: ["PR-SST-04", "PT-075", "RG-SST-14", "RG-SST-39"] },
  { clausula: "9.1.1", cap: 9, titulo: "Seguimiento, medición y análisis del desempeño", docs: ["PR-SST-12", "RG-SST-06", "RG-SST-18"] },
  { clausula: "9.1.2", cap: 9, titulo: "Evaluación del cumplimiento legal", docs: ["PR-SST-02", "RG-SST-08"] },
  { clausula: "9.2", cap: 9, titulo: "Auditoría interna", docs: ["PR-SST-08", "RG-SST-29", "RG-SST-30", "RG-SST-52"] },
  { clausula: "9.3", cap: 9, titulo: "Revisión por la dirección", docs: ["RG-SST-31"] },
  { clausula: "10.2", cap: 10, titulo: "Incidente, no conformidad y acción correctiva", docs: ["PR-SST-05", "PR-SST-11", "RG-SST-10", "RG-SST-17"] },
];

const HITOS = [
  { fecha: "Hito 1", titulo: "Diagnóstico inicial", detalle: "Revisión rigurosa de la carpeta en Drive; hallazgo crítico: PT-MIN declarados \"Completado\" en la Lista Maestra pero ausentes como archivos reales." },
  { fecha: "Hito 2", titulo: "Desarrollo acelerado de Nivel 4", detalle: "37 registros desarrollados por exigibilidad legal: requisitos legales, emergencias, investigación de accidentes, EPP, contratistas, capacitación, auditoría." },
  { fecha: "Hito 3", titulo: "Hallazgo de desalineación", detalle: "El usuario detecta que la numeración usada no coincidía con los títulos oficiales ya predefinidos en RG-SST-07. Se construye tabla de mapeo de realineación." },
  { fecha: "Hito 4", titulo: "Cierre de brechas estructurales", detalle: "Desarrollo de PR-SST-16 (Ley Karin), RG-SST-51 (riesgos estratégicos), RG-SST-52 (auditoría trienal) y DO-SST-04 (plan de difusión)." },
  { fecha: "Hito 5", titulo: "Contexto con datos reales", detalle: "Se incorpora la Memoria Anual 2025 de Clínica Indisa: FODA, PESTEL e indicadores oficiales de seguridad laboral (CT-SST-01)." },
  { fecha: "Hito 6", titulo: "Protocolos PT-MIN", detalle: "Desarrollo de los 4 protocolos de vigilancia MINSAL: Psicosocial, Radiaciones, Citostáticos y TMERT — cierre del último contenido genuinamente pendiente." },
  { fecha: "Hito 7", titulo: "Sistema 100% completo", detalle: "81 de 81 documentos de la Lista Maestra confirmados como Completado, incluyendo RG-SST-04." },
  { fecha: "Hito 8", titulo: "Dashboard interactivo", detalle: "Visualización dinámica del SGSST completo, con identidad visual de Clínica Indisa." },
];

/* ---------------------------------------------------------------
   HELPERS
--------------------------------------------------------------- */

function levelStats(nivel) {
  const total = nivel.docs.length;
  const done = nivel.docs.filter((d) => d.e === "Completado").length;
  return { total, done, pct: Math.round((done / total) * 100) };
}

const TAG_RULES = [
  { label: "ISO 45001", test: /ISO\s*45001/i },
  { label: "D.S. N°44", test: /D\.S\.?\s*N?°?\s*44\b/i },
  { label: "D.S. N°594", test: /D\.S\.?\s*N?°?\s*594\b/i },
  { label: "Ley Karin", test: /21[.,]?643|Ley Karin/i },
  { label: "MINSAL", test: /MINSAL/i },
  { label: "Ley 16.744", test: /16[.,]?744/i },
  { label: "Contratistas (D.S. 76)", test: /D\.S\.?\s*N?°?\s*76\b|20[.,]?123/i },
  { label: "Radiaciones (D.S. 3)", test: /D\.S\.?\s*N?°?\s*3\b|D\.S\.?\s*N?°?\s*133\b/i },
  { label: "TMERT (Ley 20.949)", test: /20[.,]?949/i },
];

function getTags(doc) {
  const text = `${doc.b || ""} ${doc.r || ""}`;
  return TAG_RULES.filter((rule) => rule.test.test(text)).map((rule) => rule.label);
}

const CODE_REGEX = /\b(?:RG-SST-\d+(?:-[AB])?|PR-SST-\d+|DO-SST-\d+|PT-MIN-\d+|PT-075|MN-SST-01|PO-SST-01|OB-SST-01|CT-SST-01)\b/g;

function getRelated(doc) {
  const text = `${doc.r || ""} ${doc.b || ""}`;
  const found = text.match(CODE_REGEX) || [];
  return [...new Set(found)].filter((code) => code !== doc.c);
}

const ALL_DOCS = NIVELES.flatMap((n) =>
  n.docs.map((d) => ({ ...d, nivel: n.id, nombreNivel: n.prefijo, color: n.color, tags: getTags(d), related: getRelated(d) }))
);
const DOCS_BY_CODE = Object.fromEntries(ALL_DOCS.map((d) => [d.c, d]));
const TOTAL_DOCS = ALL_DOCS.length;
const TOTAL_DONE = ALL_DOCS.filter((d) => d.e === "Completado").length;
const ALL_TAGS = [...new Set(ALL_DOCS.flatMap((d) => d.tags))].sort();

/* ---------------------------------------------------------------
   COMPONENT
--------------------------------------------------------------- */

export default function SGSSTDashboard() {
  const [tab, setTab] = useState("resumen");
  const [nivelActivo, setNivelActivo] = useState(null);
  const [query, setQuery] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [legalFiltro, setLegalFiltro] = useState(null);
  const [selected, setSelected] = useState(null);
  const [sortKey, setSortKey] = useState("c");
  const [sortDir, setSortDir] = useState("asc");
  const [faseExpandida, setFaseExpandida] = useState(1);
  const [capColapsados, setCapColapsados] = useState({});
  const [copiedCode, setCopiedCode] = useState(false);
  const [donutVista, setDonutVista] = useState("nivel");
  const [vistaTabla, setVistaTabla] = useState("compacta");
  const [cumplimientoQuery, setCumplimientoQuery] = useState("");
  const [soloBrechas, setSoloBrechas] = useState(false);
  const [roadmapResponsable, setRoadmapResponsable] = useState("Todos");
  const searchRef = React.useRef(null);

  function toggleCapitulo(n) {
    setCapColapsados((prev) => ({ ...prev, [n]: !prev[n] }));
  }

  function exportCSV() {
    const header = "Codigo,Titulo,Nivel,Estado,Base Normativa\n";
    const rows = filtered.map((d) => `"${d.c}","${d.t.replace(/"/g, '""')}","${d.nombreNivel}","${d.e}","${(d.b || "").replace(/"/g, '""')}"`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sgsst-indisa-documentos.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyCode(code) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 1500);
      });
    }
  }

  React.useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "/" && document.activeElement !== searchRef.current) {
        e.preventDefault();
        setTab("documentos");
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filtered = useMemo(() => {
    let list = nivelActivo ? ALL_DOCS.filter((d) => d.nivel === nivelActivo) : ALL_DOCS;
    if (estadoFiltro !== "Todos") list = list.filter((d) => d.e === estadoFiltro);
    if (legalFiltro) list = list.filter((d) => d.tags.includes(legalFiltro));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((d) => d.c.toLowerCase().includes(q) || d.t.toLowerCase().includes(q));
    }
    const sorted = [...list].sort((a, b) => {
      const av = String(a[sortKey]).toLowerCase();
      const bv = String(b[sortKey]).toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [nivelActivo, query, estadoFiltro, legalFiltro, sortKey, sortDir]);

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const activeFilterCount = [nivelActivo, estadoFiltro !== "Todos" ? estadoFiltro : null, legalFiltro, query.trim() || null].filter(Boolean).length;

  function clearAllFilters() {
    setNivelActivo(null);
    setEstadoFiltro("Todos");
    setLegalFiltro(null);
    setQuery("");
  }

  const nivelDonutData = NIVELES.map((n) => ({ name: n.prefijo, value: n.docs.length, color: n.color }));
  const estadoDonutColors = { "ISO 45001": "#0E3379", "D.S. N°44": "#0E64C4", "D.S. N°594": "#1189FA", "Ley Karin": "#009DDD", "MINSAL": "#5FD4FF", "Ley 16.744": "#1B6E52", "Contratistas (D.S. 76)": "#B5541F", "Radiaciones (D.S. 3)": "#8A3E12", "TMERT (Ley 20.949)": "#3D5A80" };
  const legalDonutData = ALL_TAGS.map((tag) => ({ name: tag, value: ALL_DOCS.filter((d) => d.tags.includes(tag)).length, color: estadoDonutColors[tag] || "#8A948F" }));

  function jumpToSearch(q) {
    setQuery(q);
    setTab("documentos");
  }

  const overallPct = Math.round((TOTAL_DONE / TOTAL_DOCS) * 100);
  const [displayPct, setDisplayPct] = useState(0);

  React.useEffect(() => {
    let frame;
    const start = performance.now();
    const duration = 900;
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setDisplayPct(Math.round(overallPct * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [overallPct]);

  return (
    <div className="min-h-screen w-full relative" style={{ background: "#F5F7F5", fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
        .text-10 { font-size: 10px; line-height: 1.3; }
        .text-11 { font-size: 11px; line-height: 1.4; }
        .max-h-420 { max-height: 420px; }
        .max-h-260 { max-height: 260px; }
        .timeline-rail { left: 7px; }
        .pyramid-btn:hover { transform: scale(1.008); }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-in { animation: slideIn 0.2s ease-out; }
        @media print {
          body { background: #fff !important; }
          .print\\:hidden { display: none !important; }
          header { background: #0E3379 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      {/* HEADER */}
      <header className="border-b" style={{ borderColor: "#DCE3DF", background: "linear-gradient(120deg, #0A2E63 0%, #0E3379 45%, #0E64C4 100%)" }}>
        <div className="max-w-7xl mx-auto px-8 py-7 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <img
              src={`data:image/png;base64,${LOGO_B64}`}
              alt="Logo Clínica Indisa"
              className="rounded-md shadow-lg"
              style={{ width: 64, height: 64, objectFit: "cover" }}
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={18} color="#5FD4FF" />
                <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#5FD4FF" }}>
                  Sistema de Gestión SST
                </span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl" style={{ color: "#FFFFFF" }}>
                Clínica Indisa
              </h1>
              <p className="text-sm mt-1" style={{ color: "#AFD3F5" }}>
                ISO 45001:2018 · D.S. N°44 · Providencia &amp; Maipú
              </p>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <div className="font-display text-5xl" style={{ color: "#5FD4FF" }}>
              {displayPct}%
            </div>
            <div className="text-xs font-mono mt-1" style={{ color: "#AFD3F5" }}>
              {TOTAL_DONE} / {TOTAL_DOCS} documentos completados
            </div>
          </div>
        </div>
      </header>

      {/* TAB NAV */}
      <div className="border-b sticky top-0 z-30 print:hidden" style={{ borderColor: "#DCE3DF", background: "#F5F7F5" }}>
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        <div className="flex gap-1">
          {[
            { id: "resumen", label: "Resumen", icon: LayoutGrid },
            { id: "documentos", label: "Documentos", icon: Table2 },
            { id: "cumplimiento", label: "Cumplimiento ISO 45001", icon: ListChecks },
            { id: "roadmap", label: "Hoja de Ruta", icon: Milestone },
          ].map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors"
                style={{
                  borderColor: active ? "#009DDD" : "transparent",
                  color: active ? "#0E64C4" : "#5B726C",
                }}
              >
                <Icon size={15} /> {t.label}
              </button>
            );
          })}
        </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors hover:bg-white"
            style={{ borderColor: "#DCE3DF", color: "#3D5A80" }}
            title="Exportar resumen ejecutivo a PDF"
          >
            <Printer size={13} /> Exportar PDF
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-8 py-10 space-y-12">
      {tab === "resumen" && (<>
        {/* KPI STRIP */}
        <section>
          <h2 className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#3D5A80" }}>
            Indicadores de Seguridad Laboral — Memoria Anual 2025
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {INDICADORES.map((ind) => {
              const cumple = ind.mejorEsMenor ? ind.real <= ind.meta : ind.real >= ind.meta;
              return (
                <div key={ind.nombre} className="rounded-lg p-5 bg-white border" style={{ borderColor: "#DCE3DF" }}>
                  <div className="text-xs font-medium mb-3" style={{ color: "#5B726C" }}>{ind.nombre}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-3xl" style={{ color: cumple ? "#1B6E52" : "#B5541F" }}>
                      {ind.real}
                    </span>
                    <span className="text-xs" style={{ color: "#8A948F" }}>{ind.unidad}</span>
                  </div>
                  <div className="text-xs mt-2 flex items-center gap-1" style={{ color: cumple ? "#1B6E52" : "#B5541F" }}>
                    {cumple ? <CircleCheck size={13} /> : <CircleDashed size={13} />}
                    meta {ind.meta}{ind.unidad}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* TREND */}
        <section>
          <h2 className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#3D5A80" }}>
            Comparativo Interanual 2024 → 2025
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INDICADORES_TENDENCIA.map((ind) => {
              const delta = ind.y2025 - ind.y2024;
              const mejora = ind.mejorEsMenor ? delta < 0 : delta > 0;
              const pctChange = ((delta / ind.y2024) * 100).toFixed(0);
              return (
                <div key={ind.nombre} className="rounded-lg p-5 bg-white border flex items-center justify-between" style={{ borderColor: "#DCE3DF" }}>
                  <div>
                    <div className="text-xs font-medium mb-2" style={{ color: "#5B726C" }}>{ind.nombre}</div>
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-sm" style={{ color: "#8A948F" }}>{ind.y2024} <span className="text-10">2024</span></span>
                      <ChevronRight size={13} color="#C7D2CD" />
                      <span className="font-display text-2xl" style={{ color: "#10262B" }}>{ind.y2025} <span className="text-xs font-sans" style={{ color: "#8A948F" }}>2025</span></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full" style={{ background: mejora ? "#E4F2EC" : "#FCEEE3", color: mejora ? "#1B6E52" : "#B5541F" }}>
                    {delta > 0 ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                    {delta > 0 ? "+" : ""}{pctChange}%
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs mt-3" style={{ color: "#8A948F" }}>
            El aumento del TRIR se explica por la mejora en el sistema de reporte de incidentes implementada en 2025 (mayor captura, no necesariamente mayor riesgo real) — ver CT-SST-01.
          </p>
        </section>

        {/* CHART */}
        <section>
          <h2 className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#3D5A80" }}>
            Meta vs. Resultado Real 2025
          </h2>
          <div className="rounded-lg p-6 bg-white border" style={{ borderColor: "#DCE3DF" }}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={INDICADORES} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAEFEC" vertical={false} />
                <XAxis dataKey="nombre" tick={{ fontSize: 11, fill: "#5B726C" }} />
                <YAxis tick={{ fontSize: 11, fill: "#5B726C" }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #DCE3DF", fontSize: 12 }} />
                <Bar dataKey="meta" name="Meta" fill="#C7D2CD" radius={[4, 4, 0, 0]} />
                <Bar dataKey="real" name="Resultado Real" radius={[4, 4, 0, 0]}>
                  {INDICADORES.map((ind, i) => (
                    <Cell key={i} fill={(ind.mejorEsMenor ? ind.real <= ind.meta : ind.real >= ind.meta) ? "#1B6E52" : "#B5541F"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* QUICK SEARCH */}
        <section>
          <div className="rounded-lg p-4 bg-white border flex items-center gap-3" style={{ borderColor: "#DCE3DF" }}>
            <Search size={16} color="#8A948F" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && query.trim()) jumpToSearch(query); }}
              placeholder="Buscar cualquier documento por código o título y presiona Enter…"
              className="flex-1 text-sm outline-none bg-transparent"
            />
            {query.trim() && (
              <button onClick={() => jumpToSearch(query)} className="text-xs px-3 py-1.5 rounded-full text-white" style={{ background: "#009DDD" }}>
                Ir a Documentos
              </button>
            )}
          </div>
        </section>

        {/* NIVEL / LEGAL DONUT */}
        <section>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-mono text-xs tracking-widest uppercase" style={{ color: "#3D5A80" }}>
              {donutVista === "nivel" ? "Distribución de Documentos por Nivel" : "Distribución por Marco Legal Aplicable"}
            </h2>
            <div className="flex rounded-full border overflow-hidden text-xs" style={{ borderColor: "#DCE3DF" }}>
              <button
                onClick={() => setDonutVista("nivel")}
                className="px-3 py-1 transition-colors"
                style={{ background: donutVista === "nivel" ? "#009DDD" : "#FFFFFF", color: donutVista === "nivel" ? "#FFFFFF" : "#5B726C" }}
              >
                Por Nivel
              </button>
              <button
                onClick={() => setDonutVista("legal")}
                className="px-3 py-1 transition-colors"
                style={{ background: donutVista === "legal" ? "#009DDD" : "#FFFFFF", color: donutVista === "legal" ? "#FFFFFF" : "#5B726C" }}
              >
                Por Marco Legal
              </button>
            </div>
          </div>
          <div className="rounded-lg p-6 bg-white border grid grid-cols-1 md:grid-cols-2 gap-4 items-center" style={{ borderColor: "#DCE3DF" }}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={donutVista === "nivel" ? nivelDonutData : legalDonutData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {(donutVista === "nivel" ? nivelDonutData : legalDonutData).map((n, i) => (
                    <Cell key={i} fill={n.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #DCE3DF", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            {donutVista === "nivel" ? (
              <div className="space-y-2">
                {NIVELES.map((n) => {
                  const stats = levelStats(n);
                  return (
                    <button
                      key={n.id}
                      onClick={() => { setNivelActivo(n.id); setTab("documentos"); }}
                      className="w-full flex items-center justify-between text-sm rounded-md px-2 py-1.5 -mx-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: n.color }} />
                        <span style={{ color: "#33413D" }}>{n.prefijo} — {n.nombre}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs" style={{ color: "#8A948F" }}>{stats.total} docs</span>
                        <ChevronRight size={13} color="#C7D2CD" />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2 max-h-260 overflow-y-auto">
                {legalDonutData.map((tag) => (
                  <button
                    key={tag.name}
                    onClick={() => { setLegalFiltro(tag.name); setTab("documentos"); }}
                    className="w-full flex items-center justify-between text-sm rounded-md px-2 py-1.5 -mx-2 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: tag.color }} />
                      <span style={{ color: "#33413D" }}>{tag.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs" style={{ color: "#8A948F" }}>{tag.value} docs</span>
                      <ChevronRight size={13} color="#C7D2CD" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>


        {/* STATUS BANNERS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => { clearAllFilters(); setTab("documentos"); }}
            className="text-left rounded-lg p-5 border flex items-start gap-3 hover:brightness-95 transition-all"
            style={{ background: "#E4F2EC", borderColor: "#BFE3D1" }}
          >
            <CircleCheck size={20} color="#1B6E52" className="mt-0.5 shrink-0" />
            <div>
              <div className="text-sm font-semibold mb-1" style={{ color: "#14563F" }}>Contenido documental</div>
              <p className="text-sm" style={{ color: "#14563F" }}>
                {TOTAL_DONE}/{TOTAL_DOCS} documentos completados según Lista Maestra (RG-SST-07) — 100% del contenido cerrado.
              </p>
            </div>
          </button>

          <button
            onClick={() => { setTab("cumplimiento"); }}
            className="text-left rounded-lg p-5 border flex items-start gap-3 hover:brightness-95 transition-all"
            style={{ background: "#FCEEE3", borderColor: "#F0D3B8" }}
          >
            <HelpCircle size={20} color="#B5541F" className="mt-0.5 shrink-0" />
            <div>
              <div className="text-sm font-semibold mb-1" style={{ color: "#8A3E12" }}>Pendiente de gestión</div>
              <p className="text-sm" style={{ color: "#8A3E12" }}>
                Matriz de Roles y Responsabilidades SST — a la espera del organigrama institucional actualizado. Ver cláusula 5.3 →
              </p>
            </div>
          </button>

          <button
            onClick={() => { const d = DOCS_BY_CODE["PT-075"]; if (d) { setSelected(d); setTab("documentos"); } }}
            className="text-left rounded-lg p-5 border flex items-start gap-3 hover:brightness-95 transition-all"
            style={{ background: "#EAF6FD", borderColor: "#BEE1F5" }}
          >
            <Tag size={20} color="#0E64C4" className="mt-0.5 shrink-0" />
            <div>
              <div className="text-sm font-semibold mb-1" style={{ color: "#0A4A87" }}>Decisión de alcance</div>
              <p className="text-sm" style={{ color: "#0A4A87" }}>
                Plan de Emergencia sede Maipú descartado — el SGSST se enfoca exclusivamente en la sede Providencia.
              </p>
            </div>
          </button>
        </section>
      </>)}

      {tab === "documentos" && (<>
        {/* MARCO LEGAL */}
        <section>
          <h2 className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#3D5A80" }}>
            Marco Legal Aplicable — Clic para filtrar la tabla
          </h2>
          <div className="rounded-lg p-5 bg-white border flex flex-wrap gap-2" style={{ borderColor: "#DCE3DF" }}>
            {ALL_TAGS.map((tag) => {
              const count = ALL_DOCS.filter((d) => d.tags.includes(tag)).length;
              const active = legalFiltro === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setLegalFiltro(active ? null : tag)}
                  className="text-xs px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1.5"
                  style={{
                    borderColor: active ? "#009DDD" : "#DCE3DF",
                    background: active ? "#009DDD" : "#F5F7F5",
                    color: active ? "#FFFFFF" : "#33413D",
                  }}
                >
                  {tag}
                  <span
                    className="text-10 font-mono px-1.5 rounded-full"
                    style={{ background: active ? "rgba(255,255,255,0.25)" : "#DCE3DF", color: active ? "#FFFFFF" : "#5B726C" }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
            {legalFiltro && (
              <button
                onClick={() => setLegalFiltro(null)}
                className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1"
                style={{ color: "#B5541F" }}
              >
                <X size={12} /> Limpiar
              </button>
            )}
          </div>
        </section>

        {/* PYRAMID */}
        <section>
          <h2 className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#3D5A80" }}>
            Pirámide Documental — Clic para filtrar
          </h2>
          <div className="flex flex-col items-center gap-1.5 mb-8">
            {NIVELES.map((n, i) => {
              const stats = levelStats(n);
              const widthPct = 40 + i * 20;
              const active = nivelActivo === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => setNivelActivo(active ? null : n.id)}
                  style={{
                    width: `${widthPct}%`,
                    background: active ? n.color : `${n.color}CC`,
                    outline: active ? `3px solid ${n.color}` : "none",
                    outlineOffset: "2px",
                  }}
                  className="pyramid-btn rounded-md py-4 px-4 text-left transition-all duration-200 hover:brightness-110 focus:outline-none"
                >
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <div className="text-10 font-mono tracking-widest uppercase opacity-80">{n.prefijo}</div>
                      <div className="font-display text-lg">{n.nombre}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-2xl">{stats.pct}%</div>
                      <div className="text-11 opacity-80">{stats.done}/{stats.total}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* SEARCH + TABLE */}
          <div className="rounded-lg bg-white border overflow-hidden" style={{ borderColor: "#DCE3DF" }}>
            <div className="flex flex-col sm:flex-row gap-3 p-4 border-b" style={{ borderColor: "#DCE3DF" }}>
              <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-md border" style={{ borderColor: "#DCE3DF" }}>
                <Search size={15} color="#8A948F" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por código o título..."
                  className="w-full text-sm outline-none bg-transparent"
                />
                <kbd className="hidden sm:inline-block text-10 font-mono px-1.5 py-0.5 rounded border" style={{ borderColor: "#DCE3DF", color: "#8A948F" }}>/</kbd>
              </div>
              <select
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
                className="text-sm px-3 py-2 rounded-md border outline-none"
                style={{ borderColor: "#DCE3DF", color: "#33413D" }}
              >
                <option>Todos</option>
                <option>Completado</option>
                <option>Pendiente</option>
              </select>
              {nivelActivo && (
                <button
                  onClick={() => setNivelActivo(null)}
                  className="text-sm px-3 py-2 rounded-md border flex items-center gap-1"
                  style={{ borderColor: "#DCE3DF", color: "#3D5A80" }}
                >
                  Quitar filtro de nivel <ChevronRight size={14} />
                </button>
              )}
              <button
                onClick={exportCSV}
                className="text-sm px-3 py-2 rounded-md border flex items-center gap-1.5 hover:bg-white transition-colors"
                style={{ borderColor: "#DCE3DF", color: "#3D5A80" }}
                title="Exportar la vista filtrada a CSV"
              >
                <FileText size={14} /> Exportar CSV
              </button>
              <button
                onClick={() => setVistaTabla(vistaTabla === "compacta" ? "detallada" : "compacta")}
                className="text-sm px-3 py-2 rounded-md border flex items-center gap-1.5 hover:bg-white transition-colors"
                style={{ borderColor: "#DCE3DF", color: "#3D5A80" }}
                title="Alternar entre vista compacta y detallada"
              >
                <Table2 size={14} /> {vistaTabla === "compacta" ? "Vista detallada" : "Vista compacta"}
              </button>
            </div>

            {activeFilterCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 text-xs border-b flex-wrap" style={{ borderColor: "#EEF1EF", background: "#FAFBFA" }}>
                <span style={{ color: "#8A948F" }}>Mostrando {filtered.length} de {TOTAL_DOCS} ·</span>
                {nivelActivo && <span className="px-2 py-0.5 rounded-full" style={{ background: "#EAF6FD", color: "#0E64C4" }}>{NIVELES.find((n) => n.id === nivelActivo)?.prefijo}</span>}
                {estadoFiltro !== "Todos" && <span className="px-2 py-0.5 rounded-full" style={{ background: "#EAF6FD", color: "#0E64C4" }}>{estadoFiltro}</span>}
                {legalFiltro && <span className="px-2 py-0.5 rounded-full" style={{ background: "#EAF6FD", color: "#0E64C4" }}>{legalFiltro}</span>}
                {query.trim() && <span className="px-2 py-0.5 rounded-full" style={{ background: "#EAF6FD", color: "#0E64C4" }}>"{query}"</span>}
                <button onClick={clearAllFilters} className="ml-auto flex items-center gap-1" style={{ color: "#B5541F" }}>
                  <X size={11} /> Limpiar todo
                </button>
              </div>
            )}

            <div className="max-h-420 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-sm" style={{ color: "#8A948F" }}>
                  No hay documentos que coincidan con la búsqueda.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="sticky top-0" style={{ background: "#F5F7F5" }}>
                    <tr className="text-left" style={{ color: "#5B726C" }}>
                      {[
                        { key: "c", label: "Código" },
                        { key: "t", label: "Título" },
                        { key: "nombreNivel", label: "Nivel" },
                        { key: "e", label: "Estado" },
                      ].map((col) => (
                        <th key={col.key} className="px-4 py-2 font-medium cursor-pointer select-none" onClick={() => toggleSort(col.key)}>
                          <span className="inline-flex items-center gap-1">
                            {col.label}
                            <ArrowUpDown size={11} color={sortKey === col.key ? "#0E64C4" : "#C7D2CD"} />
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((d) => (
                      <React.Fragment key={d.c}>
                      <tr
                        onClick={() => setSelected(d)}
                        className="border-t cursor-pointer transition-colors"
                        style={{ borderColor: "#EEF1EF" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F7F5")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td className="px-4 py-2.5 font-mono text-xs" style={{ color: d.color }}>{d.c}</td>
                        <td className="px-4 py-2.5" style={{ color: "#33413D" }}>{d.t}</td>
                        <td className="px-4 py-2.5 text-xs" style={{ color: "#8A948F" }}>{d.nombreNivel}</td>
                        <td className="px-4 py-2.5">
                          <span
                            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                            style={{
                              background: d.e === "Completado" ? "#E4F2EC" : "#FCEEE3",
                              color: d.e === "Completado" ? "#1B6E52" : "#B5541F",
                            }}
                          >
                            {d.e === "Completado" ? <CircleCheck size={11} /> : <CircleDashed size={11} />}
                            {d.e}
                          </span>
                        </td>
                      </tr>
                      {vistaTabla === "detallada" && (
                        <tr className="border-t" style={{ borderColor: "#EEF1EF", background: "#FAFBFA" }}>
                          <td></td>
                          <td colSpan={3} className="px-4 py-2 text-xs" style={{ color: "#5B726C" }}>
                            {d.r}
                            {d.tags.length > 0 && (
                              <span className="ml-2 inline-flex flex-wrap gap-1 align-middle">
                                {d.tags.map((tag) => (
                                  <span key={tag} className="text-10 px-1.5 py-0.5 rounded-full" style={{ background: "#EAF6FD", color: "#0E64C4" }}>{tag}</span>
                                ))}
                              </span>
                            )}
                          </td>
                        </tr>
                      )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="px-4 py-2.5 text-xs border-t flex items-center gap-1.5" style={{ borderColor: "#EEF1EF", color: "#8A948F" }}>
              <FileText size={12} /> Clic en cualquier fila para ver el resumen del documento
            </div>
          </div>
        </section>
      </>)}

      {tab === "cumplimiento" && (<>
        {/* MATURITY INDEX */}
        <section>
          <h2 className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#3D5A80" }}>
            Índice de Madurez del Sistema — ISO 45001:2018
          </h2>
          <div className="rounded-lg bg-white border p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center" style={{ borderColor: "#DCE3DF" }}>
            <div className="text-center md:border-r" style={{ borderColor: "#EEF1EF" }}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Gauge size={18} color="#009DDD" />
                <span className="font-mono text-xs uppercase tracking-wider" style={{ color: "#8A948F" }}>Madurez Global</span>
              </div>
              <div className="font-display text-5xl" style={{ color: "#10262B" }}>
                {Math.round((CLAUSULAS.filter((c) => c.docs.length > 0).length / CLAUSULAS.length) * 100)}%
              </div>
              <div className="text-xs mt-1" style={{ color: "#1B6E52" }}>Nivel: Avanzado</div>
              <div className="text-xs mt-2" style={{ color: "#8A948F" }}>
                {CLAUSULAS.filter((c) => c.docs.length > 0).length}/{CLAUSULAS.length} cláusulas con cobertura documental
              </div>
            </div>
            <div className="md:col-span-2">
              <ResponsiveContainer width="100%" height={230}>
                <RadarChart data={CAPITULOS.map((cap) => {
                  const clausulasCap = CLAUSULAS.filter((c) => c.cap === cap.n);
                  const cubiertas = clausulasCap.filter((c) => c.docs.length > 0).length;
                  return { capitulo: `Cap. ${cap.n}`, cobertura: Math.round((cubiertas / clausulasCap.length) * 100) };
                })}>
                  <PolarGrid stroke="#DCE3DF" />
                  <PolarAngleAxis dataKey="capitulo" tick={{ fontSize: 11, fill: "#5B726C" }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "#C7D2CD" }} />
                  <Radar dataKey="cobertura" stroke="#009DDD" fill="#009DDD" fillOpacity={0.35} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #DCE3DF", fontSize: 12 }} formatter={(v) => `${v}%`} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <p className="text-xs mt-3" style={{ color: "#8A948F" }}>
            Único punto bajo de madurez: Capítulo 5 (Liderazgo), por la cláusula 5.3 — Matriz de Roles y Responsabilidades, a la espera del organigrama institucional.
          </p>
        </section>

        {/* ISO COMPLIANCE MATRIX — GROUPED BY CHAPTER */}
        <section>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-mono text-xs tracking-widest uppercase" style={{ color: "#3D5A80" }}>
              Matriz de Cumplimiento Detallada — por Capítulo
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ borderColor: "#DCE3DF" }}>
                <Search size={12} color="#8A948F" />
                <input
                  value={cumplimientoQuery}
                  onChange={(e) => setCumplimientoQuery(e.target.value)}
                  placeholder="Buscar cláusula o código..."
                  className="text-xs outline-none bg-transparent w-40"
                />
              </div>
              <button
                onClick={() => setSoloBrechas(!soloBrechas)}
                className="text-xs px-3 py-1.5 rounded-full border flex items-center gap-1.5 transition-colors"
                style={{ borderColor: soloBrechas ? "#B5541F" : "#DCE3DF", background: soloBrechas ? "#FCEEE3" : "#FFFFFF", color: soloBrechas ? "#8A3E12" : "#5B726C" }}
              >
                <AlertTriangle size={12} /> Solo brechas
              </button>
            </div>
          </div>
          <div className="space-y-5">
            {CAPITULOS.map((cap) => {
              const q = cumplimientoQuery.trim().toLowerCase();
              let clausulasCap = CLAUSULAS.filter((c) => c.cap === cap.n);
              if (soloBrechas) clausulasCap = clausulasCap.filter((c) => c.docs.length === 0);
              if (q) clausulasCap = clausulasCap.filter((c) => c.clausula.toLowerCase().includes(q) || c.titulo.toLowerCase().includes(q) || c.docs.some((code) => code.toLowerCase().includes(q)));
              if (clausulasCap.length === 0) return null;
              const cubiertas = clausulasCap.filter((c) => c.docs.length > 0).length;
              const pctCap = Math.round((cubiertas / clausulasCap.length) * 100);
              const colapsado = !!capColapsados[cap.n];
              return (
                <div key={cap.n} className="rounded-lg bg-white border overflow-hidden" style={{ borderColor: "#DCE3DF" }}>
                  <button
                    onClick={() => toggleCapitulo(cap.n)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:brightness-95 transition-all"
                    style={{ background: "#0E33790D" }}
                  >
                    <div className="flex items-center gap-2">
                      <ChevronDown size={14} color="#5B726C" style={{ transform: colapsado ? "rotate(-90deg)" : "none", transition: "transform 0.2s" }} />
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md" style={{ background: "#0E3379", color: "#FFFFFF" }}>
                        Cap. {cap.n}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: "#10262B" }}>{cap.nombre}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 rounded-full hidden sm:block" style={{ background: "#EEF1EF" }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${pctCap}%`, background: pctCap === 100 ? "#1B6E52" : "#009DDD" }} />
                      </div>
                      <span className="font-mono text-xs" style={{ color: "#5B726C" }}>{cubiertas}/{clausulasCap.length}</span>
                    </div>
                  </button>
                  {!colapsado && (
                  <div className="divide-y" style={{ borderColor: "#EEF1EF" }}>
                    {clausulasCap.map((cl) => {
                      const cubierta = cl.docs.length > 0;
                      return (
                        <div key={cl.clausula} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex items-center gap-3 sm:w-64 shrink-0">
                            <span
                              className="font-mono text-xs font-semibold px-2 py-1 rounded-md"
                              style={{ background: cubierta ? "#EAF6FD" : "#FCEEE3", color: cubierta ? "#0E64C4" : "#B5541F" }}
                            >
                              {cl.clausula}
                            </span>
                            <span className="text-sm font-medium" style={{ color: "#33413D" }}>{cl.titulo}</span>
                          </div>
                          <div className="flex-1 flex flex-wrap gap-1.5 items-center">
                            {cubierta ? (
                              cl.docs.map((code) => {
                                const target = DOCS_BY_CODE[code];
                                return (
                                  <button
                                    key={code}
                                    onClick={() => target && setSelected(target)}
                                    className="font-mono text-xs px-2 py-1 rounded-md border hover:brightness-95"
                                    style={{ borderColor: target ? target.color : "#DCE3DF", color: target ? target.color : "#8A948F" }}
                                  >
                                    {code}
                                  </button>
                                );
                              })
                            ) : (
                              <span className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-md" style={{ background: "#FCEEE3", color: "#8A3E12" }}>
                                <AlertTriangle size={12} /> {cl.brecha || "Sin cobertura documental"}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs mt-3" style={{ color: "#8A948F" }}>
            Esta matriz es el insumo directo del Programa Trienal de Auditoría Interna (RG-SST-52), que garantiza que las 23 cláusulas se auditen en un ciclo de 3 años. Clic en el encabezado de cada capítulo para colapsarlo.
          </p>
        </section>
      </>)}

      {tab === "roadmap" && (<>
        {/* TIMELINE */}
        <section>
          <h2 className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#3D5A80" }}>
            Línea de Tiempo del Proyecto
          </h2>
          <div className="rounded-lg bg-white border p-6" style={{ borderColor: "#DCE3DF" }}>
            <div className="relative pl-6">
              <div className="absolute timeline-rail top-1 bottom-1 w-0.5" style={{ background: "#DCE3DF" }} />
              <div className="space-y-6">
                {HITOS.map((h, i) => (
                  <div key={i} className="relative">
                    <div
                      className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full border-2"
                      style={{ background: "#FFFFFF", borderColor: "#009DDD" }}
                    />
                    <div className="text-10 font-mono uppercase tracking-widest mb-0.5" style={{ color: "#0E64C4" }}>
                      {h.fecha}
                    </div>
                    <div className="text-sm font-semibold mb-1" style={{ color: "#10262B" }}>{h.titulo}</div>
                    <div className="text-sm leading-relaxed" style={{ color: "#5B726C" }}>{h.detalle}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ROADMAP */}
        <section>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-mono text-xs tracking-widest uppercase" style={{ color: "#3D5A80" }}>
              Hoja de Ruta — 7 Fases · Clic para ver el detalle
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={roadmapResponsable}
                onChange={(e) => setRoadmapResponsable(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-full border outline-none"
                style={{ borderColor: "#DCE3DF", color: "#33413D" }}
              >
                <option>Todos</option>
                {[...new Set(FASES.map((f) => f.responsable))].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
              <div className="text-xs font-mono" style={{ color: "#8A948F" }}>
                {FASES.reduce((acc, f) => acc + f.pasos.filter((p) => p.e === "Completado").length, 0)}/{FASES.reduce((acc, f) => acc + f.pasos.length, 0)} pasos completados · ~49-53 semanas
              </div>
            </div>
          </div>

          {/* GANTT STRIP */}
          <div className="rounded-lg bg-white border p-5 mb-4" style={{ borderColor: "#DCE3DF" }}>
            <div className="flex w-full h-3 rounded-full overflow-hidden mb-3" style={{ background: "#EEF1EF" }}>
              {FASES.map((f) => {
                const weight = f.n === 5 ? 12 : f.n === 6 ? 8 : f.n === 7 ? 20 : f.n === 1 ? 6 : 2;
                const bg = f.estado === "Completado" ? "#1B6E52" : f.estado === "En curso" ? "#009DDD" : "#C7D2CD";
                return (
                  <button
                    key={f.n}
                    onClick={() => setFaseExpandida(f.n)}
                    title={`Fase ${f.n} — ${f.nombre}`}
                    style={{ flex: weight, background: bg, borderRight: "1px solid #fff" }}
                    className="hover:brightness-110 transition-all"
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-10 font-mono mb-3" style={{ color: "#8A948F" }}>
              <span>Fase 1</span>
              <span>Fase 7 · Certificación</span>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              {[
                { label: "Completado", color: "#1B6E52" },
                { label: "En curso", color: "#009DDD" },
                { label: "Pendiente", color: "#C7D2CD" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 text-xs" style={{ color: "#5B726C" }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-4">
            {FASES.map((f) => {
              const abierta = faseExpandida === f.n;
              const doneSteps = f.pasos.filter((p) => p.e === "Completado" || p.e === "Descartado").length;
              const atenuada = roadmapResponsable !== "Todos" && f.responsable !== roadmapResponsable;
              return (
                <button
                  key={f.n}
                  onClick={() => setFaseExpandida(abierta ? null : f.n)}
                  className="text-left rounded-lg bg-white border p-4 transition-shadow hover:shadow-md"
                  style={{ borderColor: abierta ? "#009DDD" : "#DCE3DF", outline: abierta ? "2px solid #009DDD" : "none", outlineOffset: "1px", opacity: atenuada ? 0.35 : 1 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-10 font-mono uppercase tracking-wider" style={{ color: "#8A948F" }}>
                      Fase {f.n}
                    </div>
                    <ChevronDown size={13} color="#8A948F" style={{ transform: abierta ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                  </div>
                  <div className="text-sm font-medium mb-2 leading-tight" style={{ color: "#33413D", minHeight: "34px" }}>
                    {f.nombre}
                  </div>
                  <div className="text-11 mb-2 flex items-center gap-1" style={{ color: "#8A948F" }}>
                    <Clock size={11} /> {f.duracion}
                  </div>
                  <div className="h-1.5 rounded-full mb-2" style={{ background: "#EEF1EF" }}>
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${f.pct}%`, background: f.pct === 100 ? "#1B6E52" : f.pct > 0 ? "#009DDD" : "#DCE3DF" }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: f.estado === "Completado" ? "#1B6E52" : f.estado === "En curso" ? "#009DDD" : "#8A948F" }}>
                      {f.estado}
                    </span>
                    <span className="text-10 font-mono" style={{ color: "#C7D2CD" }}>{doneSteps}/{f.pasos.length}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {faseExpandida && (
            <div className="rounded-lg bg-white border p-6" style={{ borderColor: "#DCE3DF" }}>
              {(() => {
                const fase = FASES.find((f) => f.n === faseExpandida);
                return (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b" style={{ borderColor: "#EEF1EF" }}>
                      <div>
                        <div className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: "#8A948F" }}>Fase {fase.n}</div>
                        <div className="text-lg font-display" style={{ color: "#10262B" }}>{fase.nombre}</div>
                      </div>
                      <div className="flex gap-4 text-xs">
                        <div className="flex items-center gap-1.5" style={{ color: "#5B726C" }}>
                          <Users size={13} /> {fase.responsable}
                        </div>
                        <div className="flex items-center gap-1.5" style={{ color: "#5B726C" }}>
                          <Clock size={13} /> {fase.duracion}
                        </div>
                      </div>
                    </div>
                    <ul className="space-y-2.5">
                      {fase.pasos.map((p, i) => {
                        const Icon = p.e === "Completado" ? CircleCheck : p.e === "Descartado" ? XCircle : CircleDashed;
                        const color = p.e === "Completado" ? "#1B6E52" : p.e === "Descartado" ? "#8A948F" : "#B5541F";
                        return (
                          <li key={i} className="flex items-start gap-2.5 text-sm">
                            <Icon size={15} color={color} className="mt-0.5 shrink-0" />
                            <span style={{ color: p.e === "Descartado" ? "#8A948F" : "#33413D", textDecoration: p.e === "Descartado" ? "line-through" : "none" }}>
                              {p.t}
                            </span>
                            <span className="ml-auto text-10 font-mono px-1.5 py-0.5 rounded-full shrink-0" style={{ background: `${color}1A`, color }}>
                              {p.e}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                );
              })()}
            </div>
          )}
        </section>
      </>)}
      </main>

      <footer className="border-t py-6 text-center text-xs font-mono" style={{ borderColor: "#DCE3DF", color: "#8A948F" }}>
        Documento controlado — Sistema de Gestión SST Clínica Indisa
      </footer>

      {/* DETAIL PANEL (slide-over) */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
          <div className="absolute inset-0" style={{ background: "rgba(15,42,41,0.45)" }} onClick={() => setSelected(null)} />
          <div className="animate-slide-in relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col">
            <div className="p-6 border-b flex items-start justify-between" style={{ borderColor: "#EEF1EF" }}>
              <div>
                <div className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: selected.color }}>
                  {selected.nombreNivel}
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-mono text-base font-semibold" style={{ color: "#10262B" }}>{selected.c}</div>
                  <button
                    onClick={() => copyCode(selected.c)}
                    className="text-10 font-mono px-1.5 py-0.5 rounded border hover:bg-gray-50 transition-colors"
                    style={{ borderColor: "#DCE3DF", color: copiedCode ? "#1B6E52" : "#8A948F" }}
                    title="Copiar código"
                  >
                    {copiedCode ? "Copiado ✓" : "Copiar"}
                  </button>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-md hover:bg-gray-100">
                <X size={18} color="#5B726C" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              <div>
                <h3 className="font-display text-xl leading-snug" style={{ color: "#10262B" }}>{selected.t}</h3>
                <span
                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mt-3"
                  style={{
                    background: selected.e === "Completado" ? "#E4F2EC" : "#FCEEE3",
                    color: selected.e === "Completado" ? "#1B6E52" : "#B5541F",
                  }}
                >
                  {selected.e === "Completado" ? <CircleCheck size={11} /> : <CircleDashed size={11} />}
                  {selected.e}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider mb-2" style={{ color: "#8A948F" }}>
                  <FileText size={13} /> Resumen
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#33413D" }}>{selected.r}</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider mb-2" style={{ color: "#8A948F" }}>
                  <BookOpen size={13} /> Base Normativa
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#33413D" }}>{selected.b}</p>
              </div>

              {selected.tags.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider mb-2" style={{ color: "#8A948F" }}>
                    <Tag size={13} /> Marco Legal
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#EAF6FD", color: "#0E64C4" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selected.related.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider mb-2" style={{ color: "#8A948F" }}>
                    <Link2 size={13} /> Documentos Relacionados
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.related.map((code) => {
                      const target = DOCS_BY_CODE[code];
                      return (
                        <button
                          key={code}
                          onClick={() => target && setSelected(target)}
                          disabled={!target}
                          className="font-mono text-xs px-2 py-1 rounded-md border transition-colors hover:brightness-95"
                          style={{
                            borderColor: target ? target.color : "#DCE3DF",
                            color: target ? target.color : "#8A948F",
                            background: "#FFFFFF",
                            cursor: target ? "pointer" : "default",
                          }}
                        >
                          {code}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t text-xs font-mono text-center" style={{ borderColor: "#EEF1EF", color: "#8A948F" }}>
              Sistema de Gestión SST · Clínica Indisa
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
