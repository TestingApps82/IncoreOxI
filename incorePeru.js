// ==========================================================================
// INCORE PERÚ - LÓGICA DE CONTROL, DATA OFICIAL Y RENDERIZADO INTERACTIVO
// ==========================================================================

// 1. INCORE GENERAL (AÑOS 2021 A 2026)
// Formato: Año/Region/Puntaje separado por "|" y ordenado de mayor a menor
const RAW_INCORE_GENERAL = [
  // 2026
  "2026/Lima*/7.5|2026/Moquegua/7.5|2026/Arequipa/7.0|2026/Tacna/6.9|2026/Ica/6.6|2026/Lima Provincias/6.0|2026/Cusco/5.9|2026/La Libertad/5.7|2026/Lambayeque/5.6|2026/Junín/5.6|2026/Áncash/5.5|2026/Perú/5.5|2026/Apurímac/5.4|2026/Madre de Dios/5.3|2026/Pasco/5.3|2026/Ayacucho/5.3|2026/Tumbes/5.2|2026/Piura/5.0|2026/San Martín/4.9|2026/Huancavelica/4.8|2026/Cajamarca/4.7|2026/Puno/4.6|2026/Amazonas/4.5|2026/Huánuco/4.4|2026/Ucayali/4.1|2026/Loreto/3.6",
  // 2025
  "2025/Moquegua/7.4|2025/Lima*/7.3|2025/Arequipa/6.9|2025/Tacna/6.6|2025/Ica/6.4|2025/Lima Provincias/6.0|2025/Cusco/5.8|2025/La Libertad/5.6|2025/Lambayeque/5.4|2025/Áncash/5.4|2025/Perú/5.3|2025/Junín/5.3|2025/Apurímac/5.1|2025/Tumbes/5.1|2025/Pasco/5.0|2025/Madre de Dios/4.9|2025/Piura/4.9|2025/Ayacucho/4.9|2025/Huancavelica/4.8|2025/San Martín/4.8|2025/Cajamarca/4.4|2025/Huánuco/4.3|2025/Amazonas/4.3|2025/Puno/4.3|2025/Ucayali/4.0|2025/Loreto/3.4",
  // 2024
  "2024/Moquegua/7.3|2024/Lima*/7.1|2024/Arequipa/6.7|2024/Tacna/6.4|2024/Ica/6.3|2024/Lima Provincias/5.7|2024/Cusco/5.6|2024/La Libertad/5.3|2024/Áncash/5.3|2024/Lambayeque/5.2|2024/Perú/5.0|2024/Apurímac/5.0|2024/Junín/5.0|2024/Tumbes/4.9|2024/Madre de Dios/4.7|2024/Ayacucho/4.6|2024/Piura/4.6|2024/Pasco/4.6|2024/San Martín/4.4|2024/Huancavelica/4.3|2024/Cajamarca/4.2|2024/Puno/4.1|2024/Huánuco/4.0|2024/Amazonas/4.0|2024/Ucayali/3.7|2024/Loreto/3.0",
  // 2023
  "2023/Moquegua/7.2|2023/Lima*/6.8|2023/Arequipa/6.6|2023/Tacna/6.4|2023/Ica/6.0|2023/Lima Provincias/5.5|2023/Cusco/5.2|2023/Tumbes/5.1|2023/La Libertad/5.0|2023/Lambayeque/5.0|2023/Áncash/5.0|2023/Apurímac/4.8|2023/Perú/4.8|2023/Junín/4.8|2023/Piura/4.4|2023/Ayacucho/4.4|2023/Pasco/4.3|2023/Madre de Dios/4.3|2023/San Martín/4.1|2023/Puno/3.9|2023/Huancavelica/3.9|2023/Cajamarca/3.8|2023/Amazonas/3.7|2023/Huánuco/3.6|2023/Ucayali/3.3|2023/Loreto/2.7",
  // 2022
  "2022/Lima*/6.9|2022/Moquegua/6.9|2022/Arequipa/6.5|2022/Tacna/6.1|2022/Ica/5.9|2022/Lima Provincias/5.3|2022/La Libertad/5.1|2022/Cusco/5.1|2022/Tumbes/4.9|2022/Lambayeque/4.9|2022/Áncash/4.9|2022/Perú/4.8|2022/Apurímac/4.7|2022/Junín/4.7|2022/Piura/4.5|2022/Madre de Dios/4.5|2022/Ayacucho/4.3|2022/Cajamarca/4.2|2022/Pasco/4.2|2022/San Martín/4.2|2022/Amazonas/4.1|2022/Puno/4.0|2022/Huancavelica/4.0|2022/Huánuco/3.9|2022/Ucayali/3.4|2022/Loreto/2.8",
  // 2021
  "2021/Lima*/6.7|2021/Moquegua/6.6|2021/Arequipa/6.2|2021/Tacna/6.1|2021/Ica/5.9|2021/Lima Provincias/5.0|2021/Lambayeque/5.0|2021/La Libertad/4.9|2021/Áncash/4.7|2021/Cusco/4.7|2021/Perú/4.6|2021/Apurímac/4.6|2021/Tumbes/4.5|2021/Junín/4.4|2021/Piura/4.4|2021/Ayacucho/4.2|2021/Madre de Dios/4.2|2021/Huancavelica/4.0|2021/Amazonas/4.0|2021/Huánuco/3.9|2021/San Martín/3.9|2021/Puno/3.9|2021/Cajamarca/3.8|2021/Pasco/3.7|2021/Ucayali/3.5|2021/Loreto/2.8"
].join("|");

// 2. CONFIGURACIÓN DE LOS 6 PILARES
const PILLARS_CONFIG = [
  { id: "entorno-economico", name: "Entorno Económico", icon: "/img/pilar_economico.svg" },
  { id: "infraestructura", name: "Infraestructura", icon: "/img/pilar_infraestructura.svg" },
  { id: "educacion", name: "Educación", icon: "/img/pilar_educacion.svg" },
  { id: "salud", name: "Salud", icon: "/img/pilar_salud.svg" },
  { id: "laboral", name: "Laboral", icon: "/img/pilar_empleo.svg" },
  { id: "instituciones", name: "Instituciones", icon: "/img/pilar_instituciones.svg" }
];

// 3. PILARES: DATOS OFICIALES POR PILAR Y AÑO (2021 A 2026)
// Formato: Año/Region/Pilar/Puntaje separado por "|"
const RAW_PILLARS_DATA = [
  // ================= PILAR 1: ENTORNO ECONÓMICO =================
  // 2026
  "2026/Moquegua/Entorno Económico/8.4|2026/Lima*/Entorno Económico/7.8|2026/Ica/Entorno Económico/7.7|2026/Arequipa/Entorno Económico/7.0|2026/La Libertad/Entorno Económico/6.2|2026/Lambayeque/Entorno Económico/6.1|2026/Junín/Entorno Económico/5.9|2026/Lima Provincias/Entorno Económico/5.8|2026/Pasco/Entorno Económico/5.7|2026/Áncash/Entorno Económico/5.7|2026/Tacna/Entorno Económico/5.7|2026/Piura/Entorno Económico/5.6|2026/Cusco/Entorno Económico/5.4|2026/Perú/Entorno Económico/5.2|2026/Apurímac/Entorno Económico/4.6|2026/Tumbes/Entorno Económico/4.4|2026/Puno/Entorno Económico/4.4|2026/Ayacucho/Entorno Económico/4.3|2026/Cajamarca/Entorno Económico/4.2|2026/Madre de Dios/Entorno Económico/3.9|2026/Ucayali/Entorno Económico/3.9|2026/Amazonas/Entorno Económico/3.8|2026/San Martín/Entorno Económico/3.8|2026/Huánuco/Entorno Económico/3.7|2026/Loreto/Entorno Económico/3.6|2026/Huancavelica/Entorno Económico/3.2",
  // 2025
  "2025/Lima*/Entorno Económico/7.7|2025/Moquegua/Entorno Económico/7.5|2025/Ica/Entorno Económico/7.1|2025/Arequipa/Entorno Económico/6.6|2025/La Libertad/Entorno Económico/5.6|2025/Lima Provincias/Entorno Económico/5.6|2025/Lambayeque/Entorno Económico/5.5|2025/Áncash/Entorno Económico/5.1|2025/Tacna/Entorno Económico/5.1|2025/Cusco/Entorno Económico/4.9|2025/Junín/Entorno Económico/4.9|2025/Piura/Entorno Económico/4.9|2025/Pasco/Entorno Económico/4.9|2025/Perú/Entorno Económico/4.7|2025/Tumbes/Entorno Económico/4.2|2025/Apurímac/Entorno Económico/3.9|2025/Puno/Entorno Económico/3.8|2025/Cajamarca/Entorno Económico/3.5|2025/San Martín/Entorno Económico/3.4|2025/Amazonas/Entorno Económico/3.4|2025/Ayacucho/Entorno Económico/3.4|2025/Ucayali/Entorno Económico/3.3|2025/Madre de Dios/Entorno Económico/3.3|2025/Huánuco/Entorno Económico/3.2|2025/Loreto/Entorno Económico/2.9|2025/Huancavelica/Entorno Económico/2.9",
  // 2024
  "2024/Moquegua/Entorno Económico/7.3|2024/Lima*/Entorno Económico/7.0|2024/Ica/Entorno Económico/6.6|2024/Arequipa/Entorno Económico/5.9|2024/Lambayeque/Entorno Económico/5.1|2024/La Libertad/Entorno Económico/5.0|2024/Lima Provincias/Entorno Económico/4.8|2024/Tacna/Entorno Económico/4.6|2024/Piura/Entorno Económico/4.6|2024/Áncash/Entorno Económico/4.5|2024/Cusco/Entorno Económico/4.5|2024/Junín/Entorno Económico/4.3|2024/Perú/Entorno Económico/4.1|2024/Pasco/Entorno Económico/3.9|2024/Apurímac/Entorno Económico/3.7|2024/Tumbes/Entorno Económico/3.6|2024/Ayacucho/Entorno Económico/3.2|2024/Puno/Entorno Económico/3.0|2024/Cajamarca/Entorno Económico/3.0|2024/Madre de Dios/Entorno Económico/2.9|2024/Amazonas/Entorno Económico/2.8|2024/San Martín/Entorno Económico/2.8|2024/Ucayali/Entorno Económico/2.6|2024/Huánuco/Entorno Económico/2.5|2024/Loreto/Entorno Económico/2.4|2024/Huancavelica/Entorno Económico/2.2",
  // 2023
  "2023/Lima*/Entorno Económico/6.4|2023/Moquegua/Entorno Económico/6.3|2023/Ica/Entorno Económico/6.0|2023/Arequipa/Entorno Económico/5.8|2023/Tacna/Entorno Económico/5.1|2023/La Libertad/Entorno Económico/4.8|2023/Lambayeque/Entorno Económico/4.7|2023/Piura/Entorno Económico/4.5|2023/Áncash/Entorno Económico/4.4|2023/Lima Provincias/Entorno Económico/4.3|2023/Cusco/Entorno Económico/4.3|2023/Junín/Entorno Económico/4.1|2023/Perú/Entorno Económico/3.8|2023/Tumbes/Entorno Económico/3.7|2023/Pasco/Entorno Económico/3.7|2023/Apurímac/Entorno Económico/3.3|2023/Madre de Dios/Entorno Económico/2.9|2023/Puno/Entorno Económico/2.8|2023/Ayacucho/Entorno Económico/2.7|2023/Amazonas/Entorno Económico/2.6|2023/Cajamarca/Entorno Económico/2.6|2023/San Martín/Entorno Económico/2.5|2023/Loreto/Entorno Económico/2.4|2023/Ucayali/Entorno Económico/2.4|2023/Huánuco/Entorno Económico/2.0|2023/Huancavelica/Entorno Económico/1.6",
  // 2022
  "2022/Lima*/Entorno Económico/6.0|2022/Moquegua/Entorno Económico/5.8|2022/Ica/Entorno Económico/5.7|2022/Arequipa/Entorno Económico/5.3|2022/La Libertad/Entorno Económico/4.5|2022/Tacna/Entorno Económico/4.4|2022/Lambayeque/Entorno Económico/4.3|2022/Áncash/Entorno Económico/4.3|2022/Piura/Entorno Económico/4.2|2022/Cusco/Entorno Económico/4.0|2022/Junín/Entorno Económico/3.5|2022/Lima Provincias/Entorno Económico/3.5|2022/Perú/Entorno Económico/3.5|2022/Apurímac/Entorno Económico/3.2|2022/Tumbes/Entorno Económico/3.1|2022/Pasco/Entorno Económico/2.9|2022/Madre de Dios/Entorno Económico/2.8|2022/Puno/Entorno Económico/2.7|2022/Ayacucho/Entorno Económico/2.6|2022/Cajamarca/Entorno Económico/2.6|2022/Amazonas/Entorno Económico/2.4|2022/San Martín/Entorno Económico/2.4|2022/Loreto/Entorno Económico/2.1|2022/Ucayali/Entorno Económico/2.0|2022/Huánuco/Entorno Económico/1.8|2022/Huancavelica/Entorno Económico/1.2",
  // 2021
  "2021/Lima*/Entorno Económico/5.8|2021/Ica/Entorno Económico/5.7|2021/Moquegua/Entorno Económico/5.3|2021/Arequipa/Entorno Económico/4.9|2021/Lambayeque/Entorno Económico/4.1|2021/La Libertad/Entorno Económico/4.0|2021/Tacna/Entorno Económico/3.9|2021/Piura/Entorno Económico/3.9|2021/Áncash/Entorno Económico/3.5|2021/Lima Provincias/Entorno Económico/3.2|2021/Perú/Entorno Económico/3.1|2021/Junín/Entorno Económico/2.9|2021/Cusco/Entorno Económico/2.9|2021/Apurímac/Entorno Económico/2.7|2021/Tumbes/Entorno Económico/2.7|2021/Cajamarca/Entorno Económico/2.2|2021/Madre de Dios/Entorno Económico/2.2|2021/Ucayali/Entorno Económico/2.2|2021/Ayacucho/Entorno Económico/2.1|2021/Puno/Entorno Económico/2.1|2021/Amazonas/Entorno Económico/2.1|2021/Loreto/Entorno Económico/2.1|2021/San Martín/Entorno Económico/2.0|2021/Pasco/Entorno Económico/1.9|2021/Huánuco/Entorno Económico/1.7|2021/Huancavelica/Entorno Económico/0.9",

  // ================= PILAR 2: INFRAESTRUCTURA =================
  // 2026
  "2026/Lima*/Infraestructura/8.7|2026/Tacna/Infraestructura/8.0|2026/Madre de Dios/Infraestructura/7.8|2026/Arequipa/Infraestructura/7.7|2026/Cusco/Infraestructura/7.3|2026/Moquegua/Infraestructura/7.0|2026/Ayacucho/Infraestructura/6.3|2026/Lima Provincias/Infraestructura/6.1|2026/Perú/Infraestructura/6.0|2026/San Martín/Infraestructura/5.9|2026/Tumbes/Infraestructura/5.8|2026/Áncash/Infraestructura/5.8|2026/Ica/Infraestructura/5.8|2026/La Libertad/Infraestructura/5.7|2026/Junín/Infraestructura/5.7|2026/Lambayeque/Infraestructura/5.6|2026/Cajamarca/Infraestructura/5.5|2026/Amazonas/Infraestructura/5.5|2026/Apurímac/Infraestructura/5.4|2026/Huancavelica/Infraestructura/5.3|2026/Huánuco/Infraestructura/5.2|2026/Pasco/Infraestructura/5.2|2026/Ucayali/Infraestructura/5.1|2026/Piura/Infraestructura/4.8|2026/Loreto/Infraestructura/4.3|2026/Puno/Infraestructura/4.0",
  // 2025
  "2025/Lima*/Infraestructura/8.3|2025/Arequipa/Infraestructura/7.4|2025/Tacna/Infraestructura/7.4|2025/Cusco/Infraestructura/7.1|2025/Moquegua/Infraestructura/7.0|2025/Madre de Dios/Infraestructura/7.0|2025/Lima Provincias/Infraestructura/5.9|2025/San Martín/Infraestructura/5.8|2025/Ica/Infraestructura/5.8|2025/Perú/Infraestructura/5.7|2025/Ayacucho/Infraestructura/5.7|2025/Áncash/Infraestructura/5.6|2025/Lambayeque/Infraestructura/5.5|2025/Tumbes/Infraestructura/5.5|2025/La Libertad/Infraestructura/5.5|2025/Junín/Infraestructura/5.4|2025/Cajamarca/Infraestructura/5.3|2025/Apurímac/Infraestructura/5.1|2025/Amazonas/Infraestructura/5.1|2025/Huancavelica/Infraestructura/5.0|2025/Pasco/Infraestructura/4.8|2025/Huánuco/Infraestructura/4.8|2025/Ucayali/Infraestructura/4.7|2025/Piura/Infraestructura/4.7|2025/Loreto/Infraestructura/4.0|2025/Puno/Infraestructura/4.0",
  // 2024
  "2024/Lima*/Infraestructura/8.2|2024/Tacna/Infraestructura/7.5|2024/Arequipa/Infraestructura/7.2|2024/Moquegua/Infraestructura/6.9|2024/Madre de Dios/Infraestructura/6.8|2024/Cusco/Infraestructura/6.6|2024/Lima Provincias/Infraestructura/5.8|2024/San Martín/Infraestructura/5.6|2024/Áncash/Infraestructura/5.6|2024/Ayacucho/Infraestructura/5.5|2024/Perú/Infraestructura/5.5|2024/Lambayeque/Infraestructura/5.4|2024/Ica/Infraestructura/5.4|2024/Tumbes/Infraestructura/5.3|2024/Junín/Infraestructura/5.2|2024/La Libertad/Infraestructura/5.1|2024/Cajamarca/Infraestructura/5.0|2024/Apurímac/Infraestructura/5.0|2024/Huánuco/Infraestructura/4.7|2024/Amazonas/Infraestructura/4.7|2024/Huancavelica/Infraestructura/4.7|2024/Ucayali/Infraestructura/4.5|2024/Piura/Infraestructura/4.5|2024/Pasco/Infraestructura/4.2|2024/Puno/Infraestructura/3.8|2024/Loreto/Infraestructura/3.5",
  // 2023
  "2023/Lima*/Infraestructura/8.0|2023/Arequipa/Infraestructura/7.3|2023/Tacna/Infraestructura/7.2|2023/Moquegua/Infraestructura/7.0|2023/Cusco/Infraestructura/6.2|2023/Madre de Dios/Infraestructura/6.0|2023/Lima Provincias/Infraestructura/5.9|2023/Lambayeque/Infraestructura/5.6|2023/Áncash/Infraestructura/5.3|2023/Ayacucho/Infraestructura/5.2|2023/La Libertad/Infraestructura/5.2|2023/Tumbes/Infraestructura/5.2|2023/Perú/Infraestructura/5.2|2023/Ica/Infraestructura/5.1|2023/Junín/Infraestructura/4.9|2023/San Martín/Infraestructura/4.9|2023/Apurímac/Infraestructura/4.6|2023/Cajamarca/Infraestructura/4.3|2023/Huancavelica/Infraestructura/4.3|2023/Amazonas/Infraestructura/4.2|2023/Huánuco/Infraestructura/4.2|2023/Piura/Infraestructura/4.2|2023/Ucayali/Infraestructura/3.9|2023/Pasco/Infraestructura/3.9|2023/Puno/Infraestructura/3.4|2023/Loreto/Infraestructura/3.0",
  // 2022
  "2022/Lima*/Infraestructura/7.9|2022/Arequipa/Infraestructura/7.2|2022/Moquegua/Infraestructura/6.7|2022/Tacna/Infraestructura/6.6|2022/Lima Provincias/Infraestructura/5.8|2022/Madre de Dios/Infraestructura/5.7|2022/Cusco/Infraestructura/5.5|2022/Tumbes/Infraestructura/5.4|2022/Lambayeque/Infraestructura/5.3|2022/Áncash/Infraestructura/5.1|2022/La Libertad/Infraestructura/5.1|2022/Perú/Infraestructura/5.0|2022/Ica/Infraestructura/5.0|2022/Ayacucho/Infraestructura/5.0|2022/San Martín/Infraestructura/4.9|2022/Junín/Infraestructura/4.7|2022/Apurímac/Infraestructura/4.6|2022/Cajamarca/Infraestructura/4.4|2022/Piura/Infraestructura/4.3|2022/Huánuco/Infraestructura/4.2|2022/Huancavelica/Infraestructura/4.2|2022/Ucayali/Infraestructura/4.1|2022/Pasco/Infraestructura/4.1|2022/Amazonas/Infraestructura/3.9|2022/Puno/Infraestructura/3.2|2022/Loreto/Infraestructura/2.7",
  // 2021
  "2021/Lima*/Infraestructura/8.0|2021/Arequipa/Infraestructura/7.3|2021/Moquegua/Infraestructura/6.8|2021/Tacna/Infraestructura/6.8|2021/Lima Provincias/Infraestructura/5.6|2021/Cusco/Infraestructura/5.5|2021/Madre de Dios/Infraestructura/5.3|2021/Áncash/Infraestructura/5.3|2021/Lambayeque/Infraestructura/5.2|2021/La Libertad/Infraestructura/5.1|2021/Perú/Infraestructura/5.0|2021/San Martín/Infraestructura/4.8|2021/Ayacucho/Infraestructura/4.8|2021/Apurímac/Infraestructura/4.8|2021/Ica/Infraestructura/4.8|2021/Junín/Infraestructura/4.8|2021/Tumbes/Infraestructura/4.8|2021/Cajamarca/Infraestructura/4.5|2021/Piura/Infraestructura/4.3|2021/Huánuco/Infraestructura/4.3|2021/Huancavelica/Infraestructura/4.2|2021/Ucayali/Infraestructura/4.0|2021/Amazonas/Infraestructura/3.9|2021/Pasco/Infraestructura/3.8|2021/Puno/Infraestructura/3.6|2021/Loreto/Infraestructura/2.6",

  // ================= PILAR 3: EDUCACIÓN =================
  // 2026
  "2026/Lima*/Educación/8.4|2026/Tacna/Educación/8.4|2026/Moquegua/Educación/8.1|2026/Arequipa/Educación/8.0|2026/Ica/Educación/7.6|2026/Lima Provincias/Educación/6.9|2026/Cusco/Educación/6.6|2026/Lambayeque/Educación/6.4|2026/Áncash/Educación/6.2|2026/Ayacucho/Educación/6.1|2026/Apurímac/Educación/6.1|2026/Tumbes/Educación/6.1|2026/Huancavelica/Educación/5.7|2026/La Libertad/Educación/5.7|2026/Perú/Educación/5.7|2026/Junín/Educación/5.7|2026/Puno/Educación/5.5|2026/Piura/Educación/5.3|2026/Pasco/Educación/4.5|2026/San Martín/Educación/4.5|2026/Madre de Dios/Educación/4.5|2026/Huánuco/Educación/4.4|2026/Cajamarca/Educación/4.4|2026/Amazonas/Educación/4.2|2026/Ucayali/Educación/2.2|2026/Loreto/Educación/1.2",
  // 2025
  "2025/Lima*/Educación/8.6|2025/Moquegua/Educación/8.2|2025/Tacna/Educación/8.2|2025/Arequipa/Educación/8.1|2025/Ica/Educación/7.7|2025/Lima Provincias/Educación/6.8|2025/Cusco/Educación/6.6|2025/Lambayeque/Educación/6.5|2025/Tumbes/Educación/6.3|2025/Ayacucho/Educación/6.2|2025/Apurímac/Educación/6.1|2025/La Libertad/Educación/5.9|2025/Áncash/Educación/5.9|2025/Junín/Educación/5.8|2025/Perú/Educación/5.7|2025/Puno/Educación/5.4|2025/Huancavelica/Educación/5.4|2025/Piura/Educación/5.2|2025/San Martín/Educación/4.5|2025/Pasco/Educación/4.5|2025/Huánuco/Educación/4.5|2025/Cajamarca/Educación/4.3|2025/Madre de Dios/Educación/4.1|2025/Amazonas/Educación/3.9|2025/Ucayali/Educación/2.3|2025/Loreto/Educación/1.6",
  // 2024
  "2024/Lima*/Educación/8.3|2024/Tacna/Educación/8.1|2024/Arequipa/Educación/7.8|2024/Moquegua/Educación/7.5|2024/Ica/Educación/7.3|2024/Lima Provincias/Educación/6.4|2024/Tumbes/Educación/6.1|2024/Cusco/Educación/5.8|2024/Lambayeque/Educación/5.8|2024/Áncash/Educación/5.5|2024/La Libertad/Educación/5.4|2024/Apurímac/Educación/5.3|2024/Perú/Educación/5.2|2024/Ayacucho/Educación/5.1|2024/Junín/Educación/5.0|2024/Piura/Educación/4.9|2024/Puno/Educación/4.9|2024/Huancavelica/Educación/4.8|2024/Pasco/Educación/4.4|2024/Huánuco/Educación/4.1|2024/Madre de Dios/Educación/3.9|2024/Cajamarca/Educación/3.8|2024/San Martín/Educación/3.8|2024/Amazonas/Educación/3.1|2024/Ucayali/Educación/2.1|2024/Loreto/Educación/1.1",
  // 2023
  "2023/Lima*/Educación/8.1|2023/Moquegua/Educación/7.9|2023/Arequipa/Educación/7.8|2023/Tacna/Educación/7.8|2023/Ica/Educación/7.0|2023/Lima Provincias/Educación/6.2|2023/Tumbes/Educación/6.1|2023/Cusco/Educación/5.7|2023/Lambayeque/Educación/5.6|2023/La Libertad/Educación/5.4|2023/Apurímac/Educación/5.3|2023/Junín/Educación/5.3|2023/Áncash/Educación/5.2|2023/Ayacucho/Educación/5.2|2023/Perú/Educación/5.1|2023/Huancavelica/Educación/4.9|2023/Piura/Educación/4.8|2023/Puno/Educación/4.8|2023/Pasco/Educación/4.0|2023/Huánuco/Educación/3.8|2023/San Martín/Educación/3.6|2023/Cajamarca/Educación/3.6|2023/Madre de Dios/Educación/3.4|2023/Amazonas/Educación/3.2|2023/Ucayali/Educación/2.1|2023/Loreto/Educación/1.0",
  // 2022
  "2022/Lima*/Educación/8.3|2022/Tacna/Educación/8.1|2022/Arequipa/Educación/7.9|2022/Moquegua/Educación/7.5|2022/Ica/Educación/7.5|2022/Lima Provincias/Educación/6.2|2022/Tumbes/Educación/6.2|2022/Cusco/Educación/6.0|2022/Lambayeque/Educación/5.7|2022/Áncash/Educación/5.6|2022/Apurímac/Educación/5.6|2022/Puno/Educación/5.5|2022/La Libertad/Educación/5.5|2022/Perú/Educación/5.4|2022/Piura/Educación/5.2|2022/Ayacucho/Educación/5.2|2022/Junín/Educación/5.2|2022/Huancavelica/Educación/4.9|2022/San Martín/Educación/4.5|2022/Pasco/Educación/4.4|2022/Huánuco/Educación/4.3|2022/Cajamarca/Educación/4.3|2022/Madre de Dios/Educación/4.1|2022/Amazonas/Educación/3.7|2022/Ucayali/Educación/1.9|2022/Loreto/Educación/0.7",
  // 2021
  "2021/Lima*/Educación/8.7|2021/Tacna/Educación/8.5|2021/Ica/Educación/8.1|2021/Arequipa/Educación/8.1|2021/Moquegua/Educación/7.5|2021/Lima Provincias/Educación/6.6|2021/Lambayeque/Educación/6.4|2021/Tumbes/Educación/6.3|2021/Cusco/Educación/6.0|2021/La Libertad/Educación/6.0|2021/Apurímac/Educación/5.9|2021/Áncash/Educación/5.6|2021/Puno/Educación/5.6|2021/Perú/Educación/5.6|2021/Junín/Educación/5.5|2021/Piura/Educación/5.5|2021/Ayacucho/Educación/5.4|2021/Huancavelica/Educación/4.9|2021/Pasco/Educación/4.7|2021/Huánuco/Educación/4.5|2021/Cajamarca/Educación/4.4|2021/Madre de Dios/Educación/4.3|2021/San Martín/Educación/4.3|2021/Amazonas/Educación/3.8|2021/Ucayali/Educación/1.8|2021/Loreto/Educación/0.7",

  // ================= PILAR 4: SALUD =================
  // 2026
  "2026/Moquegua/Salud/8.5|2026/Lima*/Salud/8.3|2026/Tacna/Salud/7.9|2026/Lima Provincias/Salud/7.2|2026/Ica/Salud/7.1|2026/Arequipa/Salud/6.9|2026/Pasco/Salud/6.9|2026/La Libertad/Salud/6.8|2026/Apurímac/Salud/6.7|2026/Tumbes/Salud/6.5|2026/Junín/Salud/6.4|2026/Cusco/Salud/6.4|2026/Perú/Salud/6.3|2026/Lambayeque/Salud/6.3|2026/Huancavelica/Salud/6.2|2026/Ayacucho/Salud/6.1|2026/San Martín/Salud/6.0|2026/Áncash/Salud/6.0|2026/Piura/Salud/5.9|2026/Cajamarca/Salud/5.8|2026/Madre de Dios/Salud/5.6|2026/Huánuco/Salud/5.5|2026/Puno/Salud/5.5|2026/Ucayali/Salud/5.1|2026/Amazonas/Salud/4.7|2026/Loreto/Salud/3.9",
  // 2025
  "2025/Moquegua/Salud/8.5|2025/Lima*/Salud/7.9|2025/Tacna/Salud/7.5|2025/Lima Provincias/Salud/7.2|2025/Arequipa/Salud/7.2|2025/Apurímac/Salud/7.0|2025/Pasco/Salud/6.7|2025/La Libertad/Salud/6.7|2025/Huancavelica/Salud/6.4|2025/Ica/Salud/6.3|2025/Cusco/Salud/6.3|2025/Lambayeque/Salud/6.2|2025/Perú/Salud/6.1|2025/Ayacucho/Salud/6.1|2025/Tumbes/Salud/6.0|2025/Áncash/Salud/6.0|2025/Junín/Salud/6.0|2025/Piura/Salud/5.9|2025/Huánuco/Salud/5.9|2025/San Martín/Salud/5.7|2025/Madre de Dios/Salud/5.3|2025/Puno/Salud/5.2|2025/Cajamarca/Salud/4.9|2025/Ucayali/Salud/4.8|2025/Amazonas/Salud/4.3|2025/Loreto/Salud/3.4",
  // 2024
  "2024/Moquegua/Salud/8.3|2024/Lima*/Salud/7.6|2024/Tacna/Salud/7.6|2024/Arequipa/Salud/7.1|2024/Lima Provincias/Salud/7.0|2024/Ica/Salud/6.8|2024/Apurímac/Salud/6.7|2024/Cusco/Salud/6.7|2024/La Libertad/Salud/6.4|2024/Junín/Salud/6.2|2024/Lambayeque/Salud/6.0|2024/Áncash/Salud/6.0|2024/Perú/Salud/5.9|2024/Pasco/Salud/5.9|2024/Ayacucho/Salud/5.9|2024/Tumbes/Salud/5.8|2024/Cajamarca/Salud/5.5|2024/San Martín/Salud/5.4|2024/Huancavelica/Salud/5.4|2024/Piura/Salud/5.4|2024/Huánuco/Salud/5.3|2024/Puno/Salud/5.3|2024/Madre de Dios/Salud/4.9|2024/Amazonas/Salud/4.2|2024/Ucayali/Salud/3.8|2024/Loreto/Salud/2.9",
  // 2023
  "2023/Moquegua/Salud/8.3|2023/Tacna/Salud/7.5|2023/Lima*/Salud/7.5|2023/Arequipa/Salud/6.8|2023/Lima Provincias/Salud/6.8|2023/Ica/Salud/6.5|2023/Apurímac/Salud/6.5|2023/La Libertad/Salud/6.3|2023/Tumbes/Salud/6.2|2023/Cusco/Salud/5.9|2023/Lambayeque/Salud/5.7|2023/Junín/Salud/5.6|2023/Perú/Salud/5.6|2023/Áncash/Salud/5.5|2023/Ayacucho/Salud/5.5|2023/Pasco/Salud/5.1|2023/Puno/Salud/5.0|2023/Cajamarca/Salud/5.0|2023/Piura/Salud/4.9|2023/San Martín/Salud/4.7|2023/Huánuco/Salud/4.5|2023/Madre de Dios/Salud/4.4|2023/Huancavelica/Salud/4.3|2023/Amazonas/Salud/3.8|2023/Ucayali/Salud/3.5|2023/Loreto/Salud/3.2",
  // 2022
  "2022/Moquegua/Salud/8.1|2022/Tacna/Salud/7.9|2022/Lima*/Salud/7.5|2022/Arequipa/Salud/7.1|2022/Lima Provincias/Salud/6.9|2022/Ica/Salud/6.6|2022/Apurímac/Salud/6.4|2022/Cusco/Salud/6.3|2022/Tumbes/Salud/6.2|2022/Huancavelica/Salud/6.2|2022/Junín/Salud/6.2|2022/La Libertad/Salud/6.1|2022/Pasco/Salud/6.1|2022/Perú/Salud/5.9|2022/Ayacucho/Salud/5.9|2022/Lambayeque/Salud/5.6|2022/Cajamarca/Salud/5.5|2022/Huánuco/Salud/5.4|2022/Piura/Salud/5.4|2022/Áncash/Salud/5.4|2022/Puno/Salud/5.2|2022/San Martín/Salud/5.2|2022/Madre de Dios/Salud/5.0|2022/Amazonas/Salud/4.7|2022/Ucayali/Salud/4.0|2022/Loreto/Salud/3.4",
  // 2021
  "2021/Moquegua/Salud/7.5|2021/Lima*/Salud/7.2|2021/Tacna/Salud/7.2|2021/Arequipa/Salud/6.5|2021/Lima Provincias/Salud/6.5|2021/Ica/Salud/6.0|2021/La Libertad/Salud/5.8|2021/Huancavelica/Salud/5.7|2021/Cusco/Salud/5.7|2021/Apurímac/Salud/5.6|2021/Áncash/Salud/5.6|2021/Ayacucho/Salud/5.5|2021/Tumbes/Salud/5.5|2021/Perú/Salud/5.4|2021/Lambayeque/Salud/5.4|2021/Junín/Salud/5.3|2021/Puno/Salud/5.2|2021/Pasco/Salud/5.1|2021/Huánuco/Salud/4.9|2021/Piura/Salud/4.8|2021/Amazonas/Salud/4.7|2021/San Martín/Salud/4.4|2021/Madre de Dios/Salud/4.0|2021/Ucayali/Salud/4.0|2021/Cajamarca/Salud/4.0|2021/Loreto/Salud/3.2",

  // ================= PILAR 5: LABORAL =================
  // 2026
  "2026/Moquegua/Laboral/7.4|2026/Arequipa/Laboral/6.9|2026/Lima*/Laboral/6.8|2026/Ica/Laboral/6.4|2026/Tacna/Laboral/5.6|2026/Madre de Dios/Laboral/5.5|2026/Apurímac/Laboral/5.5|2026/Junín/Laboral/5.4|2026/La Libertad/Laboral/5.3|2026/Lima Provincias/Laboral/5.2|2026/Cusco/Laboral/5.0|2026/Perú/Laboral/5.0|2026/Ayacucho/Laboral/4.9|2026/Áncash/Laboral/4.8|2026/Pasco/Laboral/4.8|2026/Huancavelica/Laboral/4.6|2026/Puno/Laboral/4.4|2026/Amazonas/Laboral/4.4|2026/Lambayeque/Laboral/4.4|2026/San Martín/Laboral/4.2|2026/Loreto/Laboral/4.2|2026/Piura/Laboral/4.0|2026/Ucayali/Laboral/3.9|2026/Tumbes/Laboral/3.8|2026/Cajamarca/Laboral/3.8|2026/Huánuco/Laboral/3.8",
  // 2025
  "2025/Arequipa/Laboral/6.8|2025/Moquegua/Laboral/6.7|2025/Ica/Laboral/6.4|2025/Lima*/Laboral/6.4|2025/Cusco/Laboral/5.4|2025/Junín/Laboral/5.2|2025/Madre de Dios/Laboral/5.1|2025/La Libertad/Laboral/5.1|2025/Lima Provincias/Laboral/5.0|2025/Tacna/Laboral/5.0|2025/Huancavelica/Laboral/4.9|2025/Áncash/Laboral/4.9|2025/Perú/Laboral/4.7|2025/Apurímac/Laboral/4.7|2025/Pasco/Laboral/4.6|2025/Amazonas/Laboral/4.4|2025/San Martín/Laboral/4.2|2025/Ayacucho/Laboral/4.0|2025/Lambayeque/Laboral/4.0|2025/Loreto/Laboral/3.9|2025/Tumbes/Laboral/3.9|2025/Ucayali/Laboral/3.7|2025/Cajamarca/Laboral/3.7|2025/Piura/Laboral/3.7|2025/Puno/Laboral/3.6|2025/Huánuco/Laboral/3.4",
  // 2024
  "2024/Moquegua/Laboral/7.3|2024/Lima*/Laboral/6.3|2024/Arequipa/Laboral/6.3|2024/Ica/Laboral/6.3|2024/Apurímac/Laboral/5.6|2024/Junín/Laboral/5.1|2024/Lima Provincias/Laboral/4.9|2024/Tacna/Laboral/4.8|2024/Cusco/Laboral/4.8|2024/Huancavelica/Laboral/4.7|2024/Áncash/Laboral/4.7|2024/Madre de Dios/Laboral/4.7|2024/Perú/Laboral/4.6|2024/Amazonas/Laboral/4.6|2024/La Libertad/Laboral/4.6|2024/Pasco/Laboral/4.6|2024/Lambayeque/Laboral/4.3|2024/Ayacucho/Laboral/4.0|2024/Ucayali/Laboral/3.9|2024/San Martín/Laboral/3.9|2024/Puno/Laboral/3.7|2024/Piura/Laboral/3.6|2024/Tumbes/Laboral/3.4|2024/Cajamarca/Laboral/3.4|2024/Loreto/Laboral/3.4|2024/Huánuco/Laboral/3.2",
  // 2023
  "2023/Moquegua/Laboral/6.7|2023/Arequipa/Laboral/6.4|2023/Lima*/Laboral/5.9|2023/Ica/Laboral/5.7|2023/Apurímac/Laboral/5.4|2023/Tacna/Laboral/5.2|2023/Lima Provincias/Laboral/5.1|2023/Junín/Laboral/4.8|2023/Áncash/Laboral/4.6|2023/Pasco/Laboral/4.6|2023/Madre de Dios/Laboral/4.5|2023/Perú/Laboral/4.4|2023/Cusco/Laboral/4.4|2023/Tumbes/Laboral/4.2|2023/La Libertad/Laboral/4.2|2023/Amazonas/Laboral/4.2|2023/Huancavelica/Laboral/4.1|2023/Ayacucho/Laboral/4.0|2023/Lambayeque/Laboral/3.8|2023/San Martín/Laboral/3.8|2023/Puno/Laboral/3.5|2023/Ucayali/Laboral/3.5|2023/Huánuco/Laboral/3.3|2023/Piura/Laboral/3.1|2023/Cajamarca/Laboral/3.0|2023/Loreto/Laboral/2.9",
  // 2022
  "2022/Moquegua/Laboral/6.5|2022/Lima*/Laboral/5.9|2022/Arequipa/Laboral/5.6|2022/Ica/Laboral/5.3|2022/La Libertad/Laboral/4.8|2022/Madre de Dios/Laboral/4.8|2022/Amazonas/Laboral/4.6|2022/Apurímac/Laboral/4.5|2022/Lima Provincias/Laboral/4.4|2022/Cusco/Laboral/4.4|2022/Áncash/Laboral/4.3|2022/Perú/Laboral/4.1|2022/Junín/Laboral/4.1|2022/Tacna/Laboral/3.9|2022/Lambayeque/Laboral/3.7|2022/Cajamarca/Laboral/3.6|2022/Ayacucho/Laboral/3.6|2022/Puno/Laboral/3.6|2022/Huancavelica/Laboral/3.6|2022/Loreto/Laboral/3.4|2022/Huánuco/Laboral/3.3|2022/Pasco/Laboral/3.3|2022/Ucayali/Laboral/3.2|2022/San Martín/Laboral/3.2|2022/Tumbes/Laboral/3.1|2022/Piura/Laboral/2.7",
  // 2021
  "2021/Moquegua/Laboral/6.2|2021/Lima*/Laboral/5.7|2021/Arequipa/Laboral/5.6|2021/Tacna/Laboral/5.4|2021/Ica/Laboral/5.4|2021/Apurímac/Laboral/4.9|2021/Huancavelica/Laboral/4.8|2021/Amazonas/Laboral/4.4|2021/Madre de Dios/Laboral/4.3|2021/Junín/Laboral/4.1|2021/Perú/Laboral/4.1|2021/Cusco/Laboral/4.0|2021/La Libertad/Laboral/3.9|2021/Lambayeque/Laboral/3.9|2021/Áncash/Laboral/3.9|2021/Huánuco/Laboral/3.8|2021/Loreto/Laboral/3.7|2021/Ayacucho/Laboral/3.7|2021/Lima Provincias/Laboral/3.6|2021/Ucayali/Laboral/3.6|2021/Puno/Laboral/3.4|2021/Pasco/Laboral/3.2|2021/Cajamarca/Laboral/2.9|2021/Tumbes/Laboral/2.7|2021/Piura/Laboral/2.7|2021/San Martín/Laboral/2.6",

  // ================= PILAR 6: INSTITUCIONES =================
  // 2026
  "2026/Tacna/Instituciones/5.9|2026/Moquegua/Instituciones/5.6|2026/Lima*/Instituciones/5.3|2026/Arequipa/Instituciones/5.2|2026/Lambayeque/Instituciones/5.0|2026/San Martín/Instituciones/5.0|2026/Ica/Instituciones/4.8|2026/Lima Provincias/Instituciones/4.8|2026/Cusco/Instituciones/4.7|2026/Piura/Instituciones/4.6|2026/Pasco/Instituciones/4.6|2026/Perú/Instituciones/4.6|2026/Áncash/Instituciones/4.5|2026/Madre de Dios/Instituciones/4.5|2026/Ucayali/Instituciones/4.5|2026/La Libertad/Instituciones/4.4|2026/Tumbes/Instituciones/4.4|2026/Loreto/Instituciones/4.4|2026/Cajamarca/Instituciones/4.4|2026/Junín/Instituciones/4.4|2026/Amazonas/Instituciones/4.3|2026/Huancavelica/Instituciones/4.0|2026/Huánuco/Instituciones/4.0|2026/Apurímac/Instituciones/3.9|2026/Ayacucho/Instituciones/3.8|2026/Puno/Instituciones/3.6",
  // 2025
  "2025/Tacna/Instituciones/6.3|2025/Moquegua/Instituciones/6.2|2025/Lima Provincias/Instituciones/5.5|2025/Arequipa/Instituciones/5.4|2025/Lima*/Instituciones/5.3|2025/Áncash/Instituciones/5.0|2025/Piura/Instituciones/5.0|2025/Lambayeque/Instituciones/5.0|2025/San Martín/Instituciones/4.9|2025/Ucayali/Instituciones/4.9|2025/Ica/Instituciones/4.8|2025/Loreto/Instituciones/4.8|2025/Perú/Instituciones/4.8|2025/Tumbes/Instituciones/4.7|2025/Cajamarca/Instituciones/4.7|2025/Cusco/Instituciones/4.7|2025/La Libertad/Instituciones/4.7|2025/Amazonas/Instituciones/4.7|2025/Madre de Dios/Instituciones/4.6|2025/Pasco/Instituciones/4.5|2025/Junín/Instituciones/4.3|2025/Huancavelica/Instituciones/4.2|2025/Huánuco/Instituciones/4.1|2025/Apurímac/Instituciones/3.9|2025/Ayacucho/Instituciones/3.8|2025/Puno/Instituciones/3.6",
  // 2024
  "2024/Moquegua/Instituciones/6.8|2024/Tacna/Instituciones/5.8|2024/Arequipa/Instituciones/5.6|2024/Ica/Instituciones/5.3|2024/Áncash/Instituciones/5.2|2024/Ucayali/Instituciones/5.2|2024/Lima Provincias/Instituciones/5.2|2024/Cusco/Instituciones/5.1|2024/La Libertad/Instituciones/5.1|2024/Lima*/Instituciones/5.0|2024/Tumbes/Instituciones/4.9|2024/Perú/Instituciones/4.9|2024/Lambayeque/Instituciones/4.9|2024/Loreto/Instituciones/4.9|2024/San Martín/Instituciones/4.8|2024/Cajamarca/Instituciones/4.8|2024/Piura/Instituciones/4.7|2024/Madre de Dios/Instituciones/4.6|2024/Pasco/Instituciones/4.6|2024/Amazonas/Instituciones/4.5|2024/Huánuco/Instituciones/4.4|2024/Huancavelica/Instituciones/4.3|2024/Junín/Instituciones/4.2|2024/Ayacucho/Instituciones/4.2|2024/Puno/Instituciones/4.0|2024/Apurímac/Instituciones/3.9",
  // 2023
  "2023/Moquegua/Instituciones/6.9|2023/Ica/Instituciones/5.8|2023/Tacna/Instituciones/5.7|2023/Arequipa/Instituciones/5.4|2023/Tumbes/Instituciones/5.1|2023/Lima*/Instituciones/5.1|2023/Lima Provincias/Instituciones/5.0|2023/Piura/Instituciones/4.9|2023/San Martín/Instituciones/4.8|2023/Lambayeque/Instituciones/4.8|2023/Perú/Instituciones/4.6|2023/Cusco/Instituciones/4.6|2023/Áncash/Instituciones/4.6|2023/Ucayali/Instituciones/4.5|2023/La Libertad/Instituciones/4.5|2023/Amazonas/Instituciones/4.4|2023/Pasco/Instituciones/4.4|2023/Madre de Dios/Instituciones/4.4|2023/Cajamarca/Instituciones/4.2|2023/Huánuco/Instituciones/4.1|2023/Junín/Instituciones/4.1|2023/Huancavelica/Instituciones/4.0|2023/Apurímac/Instituciones/3.9|2023/Loreto/Instituciones/3.9|2023/Puno/Instituciones/3.7|2023/Ayacucho/Instituciones/3.5",
  // 2022
  "2022/Moquegua/Instituciones/6.6|2022/Tacna/Instituciones/5.9|2022/Arequipa/Instituciones/5.8|2022/Lima*/Instituciones/5.7|2022/Tumbes/Instituciones/5.7|2022/Ica/Instituciones/5.6|2022/Ucayali/Instituciones/5.4|2022/Piura/Instituciones/5.3|2022/Lima Provincias/Instituciones/5.2|2022/Amazonas/Instituciones/5.2|2022/Cajamarca/Instituciones/4.9|2022/Perú/Instituciones/4.9|2022/San Martín/Instituciones/4.8|2022/Lambayeque/Instituciones/4.8|2022/La Libertad/Instituciones/4.8|2022/Áncash/Instituciones/4.7|2022/Madre de Dios/Instituciones/4.7|2022/Cusco/Instituciones/4.7|2022/Pasco/Instituciones/4.4|2022/Junín/Instituciones/4.3|2022/Huánuco/Instituciones/4.2|2022/Apurímac/Instituciones/4.2|2022/Loreto/Instituciones/4.1|2022/Puno/Instituciones/3.8|2022/Huancavelica/Instituciones/3.8|2022/Ayacucho/Instituciones/3.8",
  // 2021
  "2021/Moquegua/Instituciones/6.0|2021/Ica/Instituciones/5.5|2021/Ucayali/Instituciones/5.4|2021/Tumbes/Instituciones/5.3|2021/Arequipa/Instituciones/5.2|2021/San Martín/Instituciones/5.1|2021/Piura/Instituciones/5.1|2021/Madre de Dios/Instituciones/5.1|2021/Lambayeque/Instituciones/4.9|2021/Amazonas/Instituciones/4.9|2021/La Libertad/Instituciones/4.8|2021/Tacna/Instituciones/4.8|2021/Lima*/Instituciones/4.8|2021/Cajamarca/Instituciones/4.7|2021/Perú/Instituciones/4.6|2021/Lima Provincias/Instituciones/4.6|2021/Áncash/Instituciones/4.5|2021/Loreto/Instituciones/4.4|2021/Huánuco/Instituciones/4.3|2021/Cusco/Instituciones/4.0|2021/Junín/Instituciones/3.9|2021/Ayacucho/Instituciones/3.8|2021/Huancavelica/Instituciones/3.6|2021/Apurímac/Instituciones/3.5|2021/Pasco/Instituciones/3.4|2021/Puno/Instituciones/3.3"
].join("|");

/**
 * PARSER DE DATOS: Transforma los strings separados por "|" en objetos limpios
 */
function parseIncoreString(rawString) {
  if (!rawString) return [];
  return rawString.split("|").map(item => {
    const parts = item.trim().split("/");
    if (parts.length === 3) {
      return {
        year: parseInt(parts[0], 10),
        region: parts[1],
        score: parseFloat(parts[2]),
        pilar: null
      };
    } else if (parts.length === 4) {
      return {
        year: parseInt(parts[0], 10),
        region: parts[1],
        pilar: parts[2],
        score: parseFloat(parts[3])
      };
    }
    return null;
  }).filter(Boolean);
}

// ==========================================================================
// PALETA Y COLORES COHERENTES (COMPARTIDOS ENTRE BARRAS Y PUNTOS)
// ==========================================================================
function getRegionColorInfo(rank, isPeru) {
  if (isPeru) {
    return {
      fill: "#ef4444",
      stroke: "#dc2626",
      gradient: "linear-gradient(90deg, #dc2626 0%, #ef4444 100%)",
      glow: "rgba(239, 68, 68, 0.45)"
    };
  }
  if (rank <= 5) {
    return {
      fill: "#2563eb",
      stroke: "#1d4ed8",
      gradient: "linear-gradient(90deg, #1d4ed8 0%, #3b82f6 100%)",
      glow: "rgba(37, 99, 235, 0.45)"
    };
  } else if (rank <= 11) {
    return {
      fill: "#0284c7",
      stroke: "#0369a1",
      gradient: "linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)",
      glow: "rgba(2, 132, 199, 0.45)"
    };
  } else if (rank <= 17) {
    return {
      fill: "#ea580c",
      stroke: "#c2410c",
      gradient: "linear-gradient(90deg, #ea580c 0%, #fb923c 100%)",
      glow: "rgba(234, 88, 12, 0.45)"
    };
  } else if (rank <= 22) {
    return {
      fill: "#dc2626",
      stroke: "#b91c1c",
      gradient: "linear-gradient(90deg, #dc2626 0%, #f87171 100%)",
      glow: "rgba(220, 38, 38, 0.45)"
    };
  } else {
    return {
      fill: "#991b1b",
      stroke: "#7f1d1d",
      gradient: "linear-gradient(90deg, #991b1b 0%, #dc2626 100%)",
      glow: "rgba(153, 27, 27, 0.45)"
    };
  }
}

// ==========================================================================
// ESTILO 1: GRÁFICO DE BARRAS HORIZONTALES
// ==========================================================================
function renderBarChart(containerId, title, dataRows, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { icon = null, maxScore = 10.0 } = options;

  // Ordenar de mayor a menor según puntaje
  const sorted = [...dataRows].sort((a, b) => b.score - a.score);

  // Calcular ranking correlativo (excluyendo el promedio nacional de Perú)
  let rankCounter = 1;
  const ranked = sorted.map(row => {
    const isPeru = row.region.trim().toLowerCase() === "perú" || row.region.trim().toLowerCase() === "peru";
    const rank = isPeru ? null : rankCounter++;
    return { ...row, rank, isPeru };
  });

  const totalRealRegions = ranked.filter(r => !r.isPeru).length;
  let headerIconHtml = icon ? `<img src="${icon}" alt="" class="chart-header-icon" />` : '';

  let html = `
    <div class="chart-heading">
      <div class="chart-heading-title">
        ${headerIconHtml}
        <span>${title}</span>
      </div>
    </div>
    <div class="chart-rows-list">
  `;

  ranked.forEach(item => {
    const isSM = item.region.toLowerCase().includes("san martín") || item.region.toLowerCase().includes("san martin");
    const isFirst = item.rank === 1;
    const isLast = item.rank === totalRealRegions;
    const isPeru = item.isPeru;

    let opacityClass = "bar-standard";
    if (isSM) {
      opacityClass = "bar-san-martin";
    } else if (isFirst) {
      opacityClass = "bar-rank-first";
    } else if (isLast) {
      opacityClass = "bar-rank-last";
    } else if (isPeru) {
      opacityClass = "bar-peru-avg";
    }

    const colorInfo = getRegionColorInfo(item.rank, isPeru);
    const barColorStyle = isPeru ? "" : `background: ${colorInfo.gradient};`;
    const widthPct = Math.min(100, Math.max(14, (item.score / maxScore) * 100));

    const labelText = isPeru 
      ? "Perú" 
      : isSM 
      ? `★ ${item.region} (${item.rank})` 
      : `${item.region} (${item.rank})`;

    html += `
      <div class="bar-row ${isSM ? 'is-sm' : ''} ${isPeru ? 'is-peru' : ''}">
        <span class="region-label" title="${labelText}">${labelText}</span>
        <div class="bar-track">
          <div 
            class="bar-fill ${opacityClass}" 
            style="width: ${widthPct.toFixed(1)}%; ${barColorStyle}"
          >
            ${item.score.toFixed(1)}
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
}

// ==========================================================================
// ESTILO 2: EJE VERTICAL CON PUNTOS Y ETIQUETAS ALTERNADAS (IMAGE.PNG)
// - Puntos en el eje central coloreados según la escala de barras
// - Etiquetas alternadas: 1° Izquierda, 2° Derecha, 3° Izquierda, etc.
// - Formato: "Tacna (2): 8.1"
// - Anti-solapamiento inteligente para máxima legibilidad
// ==========================================================================

/**
 * Algoritmo de relajación para evitar colisión de textos verticales del mismo lado
 */
function relaxLabels(items, minY, maxY, minGap = 19) {
  if (items.length <= 1) return;

  // Ordenar según su posición Y original
  items.sort((a, b) => a.rawY - b.rawY);
  items.forEach(it => { it.targetY = it.rawY; });

  for (let iter = 0; iter < 15; iter++) {
    // Pase hacia abajo (empujar colisiones)
    for (let i = 1; i < items.length; i++) {
      const prev = items[i - 1];
      const curr = items[i];
      if (curr.targetY < prev.targetY + minGap) {
        curr.targetY = prev.targetY + minGap;
      }
    }

    // Ajustar si se desborda por abajo
    const last = items[items.length - 1];
    if (last.targetY > maxY) {
      const overflow = last.targetY - maxY;
      for (let i = items.length - 1; i >= 0; i--) {
        items[i].targetY -= overflow;
      }
    }

    // Pase hacia arriba
    for (let i = items.length - 2; i >= 0; i--) {
      const next = items[i + 1];
      const curr = items[i];
      if (curr.targetY > next.targetY - minGap) {
        curr.targetY = next.targetY - minGap;
      }
    }

    // Ajustar si se desborda por arriba
    const first = items[0];
    if (first.targetY < minY) {
      const underflow = minY - first.targetY;
      for (let i = 0; i < items.length; i++) {
        items[i].targetY += underflow;
      }
    }
  }
}

/**
 * Renderiza el gráfico estilo Eje Vertical (Puntos y etiquetas alternadas)
 */
function renderVerticalAxisChart(containerId, title, dataRows, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { icon = null } = options;

  // Ordenar de mayor a menor puntaje
  const sorted = [...dataRows].sort((a, b) => b.score - a.score);

  // Calcular ranking correlativo
  let rankCounter = 1;
  const ranked = sorted.map((row, idx) => {
    const isPeru = row.region.trim().toLowerCase() === "perú" || row.region.trim().toLowerCase() === "peru";
    const rank = isPeru ? null : rankCounter++;
    const isSM = row.region.toLowerCase().includes("san martín") || row.region.toLowerCase().includes("san martin");
    const colorInfo = getRegionColorInfo(rank, isPeru);
    return {
      ...row,
      rank,
      isPeru,
      isSM,
      colorInfo,
      orderIndex: idx
    };
  });

  // Dimensiones dinámicas adaptadas al contenedor para no desperdiciar espacio vertical
  const containerRect = container.getBoundingClientRect();
  const stageEl = document.getElementById('charts-stage');
  const stageHeight = (stageEl && stageEl.clientHeight > 100) 
    ? stageEl.clientHeight 
    : ((window.innerHeight - 56) * 0.95);

  const padLeft = 14;
  const padRight = 14;
  const padTop = 10;
  const padBottom = 10;
  const headingHeight = 36;

  const rawWidth = (container.clientWidth || containerRect.width) - (padLeft + padRight);
  const rawHeight = (container.clientHeight || containerRect.height) - (headingHeight + padTop + padBottom);

  const isSolo = container.classList.contains('chart-card-solo');
  const fallbackWidth = isSolo ? Math.min(520, window.innerWidth * 0.92) : 410;

  const availWidth = Math.max(260, rawWidth > 50 ? rawWidth : fallbackWidth);
  const availHeight = Math.max(380, rawHeight > 50 ? rawHeight : (stageHeight - (headingHeight + padTop + padBottom)));

  // Relación de aspecto virtual SVG idéntica al contenedor real
  const svgWidth = 430;
  const svgHeight = Math.max(500, Math.round(svgWidth * (availHeight / availWidth)));

  // Margen superior e inferior mínimo para que la marca 10.0 esté inmediatamente
  // debajo del título y la marca 0.0 inmediatamente encima del borde inferior
  const topMargin = 20;
  const bottomMargin = svgHeight - 20;
  const plotHeight = bottomMargin - topMargin;
  const cx = Math.round(svgWidth / 2); // Centro del eje vertical
  const maxScale = 10.0;
  const minScale = 0.0;

  // Alternar posiciones: 
  // 1° a la izquierda, 2° a la derecha, 3° a la izquierda, etc.
  const itemsWithPos = ranked.map(item => {
    const side = (item.orderIndex % 2 === 0) ? 'left' : 'right';
    const rawY = topMargin + ((maxScale - item.score) / (maxScale - minScale)) * plotHeight;
    return {
      ...item,
      side,
      rawY,
      targetY: rawY
    };
  });

  const leftItems = itemsWithPos.filter(d => d.side === 'left');
  const rightItems = itemsWithPos.filter(d => d.side === 'right');

  // Relajar etiquetas para evitar solapamientos visuales según el alto del gráfico
  const minGap = Math.max(16, Math.min(22, plotHeight / 34));
  relaxLabels(leftItems, topMargin + 3, bottomMargin - 3, minGap);
  relaxLabels(rightItems, topMargin + 3, bottomMargin - 3, minGap);

  let headerIconHtml = icon ? `<img src="${icon}" alt="" class="chart-header-icon" />` : '';

  // Grilla horizontal y escala numérica 0.0 a 10.0
  let gridLinesSvg = '';
  for (let t = 10; t >= 0; t--) {
    const ty = topMargin + ((maxScale - t) / (maxScale - minScale)) * plotHeight;
    gridLinesSvg += `
      <line x1="38" y1="${ty.toFixed(1)}" x2="${(svgWidth - 14).toFixed(1)}" y2="${ty.toFixed(1)}" class="v-grid-line" />
      <text x="32" y="${(ty + 3.8).toFixed(1)}" class="v-tick-text">${t.toFixed(1)}</text>
    `;
  }

  // Elementos interactivos (puntos, líneas y etiquetas)
  const allPlotted = [...leftItems, ...rightItems];
  let plottedElementsSvg = '';

  allPlotted.forEach(item => {
    const isLeft = item.side === 'left';
    const dotX = cx;
    const dotY = item.rawY;
    const labelY = item.targetY;
    
    const labelAnchorX = isLeft ? (cx - 20) : (cx + 20);
    const textAnchor = isLeft ? 'end' : 'start';

    // Línea conectora líder (leader line)
    let pathD = '';
    const diffY = Math.abs(labelY - dotY);
    if (diffY > 1.5) {
      const elbowX = isLeft ? (cx - 12) : (cx + 12);
      pathD = `M ${isLeft ? cx - 5 : cx + 5} ${dotY.toFixed(1)} L ${elbowX} ${labelY.toFixed(1)} L ${isLeft ? labelAnchorX + 2 : labelAnchorX - 2} ${labelY.toFixed(1)}`;
    } else {
      pathD = `M ${isLeft ? cx - 5 : cx + 5} ${dotY.toFixed(1)} L ${isLeft ? labelAnchorX + 2 : labelAnchorX - 2} ${dotY.toFixed(1)}`;
    }

    // Formato exacto de la etiqueta solicitado: "Tacna (2): 8.1"
    const labelMainText = item.isPeru 
      ? "Perú" 
      : `${item.isSM ? '★ ' : ''}${item.region}`;
    
    const labelStatText = item.isPeru 
      ? `: ${item.score.toFixed(1)}` 
      : ` (${item.rank}): ${item.score.toFixed(1)}`;

    const tooltipInfo = item.isPeru
      ? `Promedio Nacional Perú: ${item.score.toFixed(1)}`
      : `${item.region} (Puesto #${item.rank}) — Puntaje: ${item.score.toFixed(1)}`;

    plottedElementsSvg += `
      <g class="v-row-group ${item.isSM ? 'is-sm' : ''} ${item.isPeru ? 'is-peru' : ''}" 
         data-tooltip="${tooltipInfo}">
        <!-- Línea conectora hacia la etiqueta -->
        <path d="${pathD}" class="v-leader-line" stroke="${item.colorInfo.fill}" />

        <!-- Círculo / Punto con el color correspondiente a las barras -->
        ${item.isSM ? `
          <circle cx="${dotX}" cy="${dotY.toFixed(1)}" r="9.5" fill="none" stroke="${item.colorInfo.fill}" stroke-width="2" opacity="0.65" class="v-sm-pulse" />
        ` : ''}
        <circle 
          cx="${dotX}" 
          cy="${dotY.toFixed(1)}" 
          r="${item.isSM ? 6.5 : 5.2}" 
          fill="${item.colorInfo.fill}" 
          stroke="${item.isSM ? '#ffffff' : item.colorInfo.stroke}" 
          stroke-width="${item.isSM ? 2 : 1.4}" 
          class="v-dot ${item.isSM ? 'v-dot-sm' : ''}"
        />

        <!-- Etiqueta con formato: Tacna (2): 8.1 -->
        <text x="${labelAnchorX}" y="${(labelY + 3.6).toFixed(1)}" text-anchor="${textAnchor}" class="v-label-text">
          <tspan class="v-label-region">${labelMainText}</tspan>
          <tspan class="v-label-stat" fill="${item.colorInfo.fill}">${labelStatText}</tspan>
        </text>
      </g>
    `;
  });

  const html = `
    <div class="chart-heading">
      <div class="chart-heading-title">
        ${headerIconHtml}
        <span>${title}</span>
      </div>
    </div>
    <div class="vertical-axis-container">
      <div class="v-tooltip" id="tooltip-${containerId}"></div>
      <svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="vertical-axis-svg" preserveAspectRatio="xMidYMid meet">
        <!-- Grilla y escala Y -->
        <g class="v-grid-group">
          ${gridLinesSvg}
        </g>

        <!-- Eje vertical central -->
        <line x1="${cx}" y1="${(topMargin - 6).toFixed(1)}" x2="${cx}" y2="${(bottomMargin + 6).toFixed(1)}" class="v-axis-line" />

        <!-- Elementos ploteados (puntos y etiquetas) -->
        <g class="v-plotted-group">
          ${plottedElementsSvg}
        </g>
      </svg>
    </div>
  `;

  container.innerHTML = html;

  // Interacción de tooltips
  attachVerticalChartTooltips(container, `tooltip-${containerId}`);
}

/**
 * Conecta los tooltips interactivos para cada elemento del eje vertical
 */
function attachVerticalChartTooltips(container, tooltipId) {
  const tooltip = container.querySelector(`#${tooltipId}`);
  if (!tooltip) return;

  container.querySelectorAll('.v-row-group').forEach(group => {
    group.addEventListener('mouseenter', () => {
      const text = group.getAttribute('data-tooltip');
      if (!text) return;
      tooltip.textContent = text;
      tooltip.classList.add('visible');

      const dot = group.querySelector('.v-dot');
      if (dot) {
        const rect = dot.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        tooltip.style.left = `${rect.left - containerRect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - containerRect.top}px`;
      }
    });

    group.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
  });
}

// ==========================================================================
// RENDERIZADOR MAESTRO SEGÚN EL ESTILO SELECCIONADO
// ==========================================================================

let currentChartStyle = localStorage.getItem('incore_chart_style') || 'bars'; // 'bars' | 'vertical'

function renderChart(containerId, title, dataRows, options = {}) {
  if (currentChartStyle === 'vertical') {
    renderVerticalAxisChart(containerId, title, dataRows, options);
  } else {
    renderBarChart(containerId, title, dataRows, options);
  }
}

// ==========================================================================
// CONTROL DE VISTAS (UNA SOLA FILA DE GRÁFICOS A 95% DEL ALTO DE LA VISTA)
// ==========================================================================

let currentView = 'solo-2026';

/**
 * Renderiza la fila de gráficos correspondiente a la selección del usuario
 */
function renderCurrentView(viewKey) {
  currentView = viewKey;
  const stage = document.getElementById('charts-stage');
  const viewport = document.getElementById('viewport');
  if (!stage) return;

  stage.innerHTML = '';

  // Actualizar clase activa en los botones de navegación
  document.querySelectorAll('#view-selector-nav .nav-btn').forEach(btn => {
    if (btn.getAttribute('data-view') === viewKey) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const generalData = parseIncoreString(RAW_INCORE_GENERAL);
  const pillarsData = parseIncoreString(RAW_PILLARS_DATA);
  const years = [2021, 2022, 2023, 2024, 2025, 2026];

  if (viewKey === 'solo-2026') {
    // 1. SOLO 2026: Una sola columna al centro, ocupa el 95% de altura
    stage.className = 'single-row-stage stage-single-focus';
    
    const cardId = 'chart-card-solo-2026';
    const chartWrapper = document.createElement('div');
    chartWrapper.className = 'chart-wrapper chart-card-solo';
    chartWrapper.id = cardId;
    stage.appendChild(chartWrapper);

    const yearRows = generalData.filter(d => d.year === 2026);
    renderChart(cardId, 'INCORE 2026', yearRows, { maxScore: 8.5 });

    if (viewport) {
      viewport.scrollTo({ left: 0, behavior: 'smooth' });
    }
  } else if (viewKey === 'incore-general') {
    // 2. INCORE GENERAL MULTIANUAL: Una fila de gráficos (2021 al 2026)
    stage.className = 'single-row-stage stage-multi-row';

    years.forEach(year => {
      const cardId = `chart-incore-${year}`;
      const chartWrapper = document.createElement('div');
      chartWrapper.className = 'chart-wrapper chart-card-multi';
      chartWrapper.id = cardId;
      stage.appendChild(chartWrapper);

      const yearRows = generalData.filter(d => d.year === year);
      renderChart(cardId, `INCORE ${year}`, yearRows, { maxScore: 8.5 });
    });

    if (viewport) {
      setTimeout(() => {
        viewport.scrollTo({ left: viewport.scrollWidth, behavior: 'smooth' });
      }, 60);
    }
  } else if (viewKey.startsWith('pilar-')) {
    // 3. PILAR SELECCIONADO: Una sola fila de gráficos (2021 al 2026)
    stage.className = 'single-row-stage stage-multi-row';
    const pilarId = viewKey.replace('pilar-', '');
    const pilarConfig = PILLARS_CONFIG.find(p => p.id === pilarId);
    if (!pilarConfig) return;

    years.forEach(year => {
      const cardId = `chart-${pilarId}-${year}`;
      const chartWrapper = document.createElement('div');
      chartWrapper.className = 'chart-wrapper chart-card-multi';
      chartWrapper.id = cardId;
      stage.appendChild(chartWrapper);

      const pRows = pillarsData.filter(d => d.year === year && d.pilar.toLowerCase() === pilarConfig.name.toLowerCase());
      renderChart(cardId, `${pilarConfig.name} (${year})`, pRows, {
        icon: pilarConfig.icon,
        maxScore: 9.5
      });
    });

    if (viewport) {
      setTimeout(() => {
        viewport.scrollTo({ left: viewport.scrollWidth, behavior: 'smooth' });
      }, 60);
    }
  }
}

/**
 * Conexión de eventos del selector de estilo (Barras vs Eje Vertical)
 */
function initStyleSelector() {
  const container = document.getElementById('style-toggle-container');
  if (!container) return;

  updateStyleButtonsUI(currentChartStyle);

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-style-pill');
    if (!btn) return;
    const style = btn.getAttribute('data-style');
    if (style && style !== currentChartStyle) {
      currentChartStyle = style;
      localStorage.setItem('incore_chart_style', style);
      updateStyleButtonsUI(style);
      renderCurrentView(currentView);
    }
  });
}

function updateStyleButtonsUI(style) {
  document.querySelectorAll('.btn-style-pill').forEach(btn => {
    if (btn.getAttribute('data-style') === style) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

/**
 * Conexión de eventos del selector superior y atajos
 */
function initViewSelector() {
  const nav = document.getElementById('view-selector-nav');
  if (nav) {
    nav.addEventListener('click', (e) => {
      const btn = e.target.closest('.nav-btn');
      if (!btn) return;
      const viewKey = btn.getAttribute('data-view');
      if (viewKey) {
        renderCurrentView(viewKey);
      }
    });
  }

  // Desplazamiento horizontal con la rueda del ratón
  const viewport = document.getElementById('viewport');
  if (viewport) {
    viewport.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0 && viewport.scrollWidth > viewport.clientWidth) {
        e.preventDefault();
        viewport.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  }

  // Atajos de teclado: flechas izquierda / derecha para explorar la fila horizontal
  window.addEventListener('keydown', (e) => {
    const vp = document.getElementById('viewport');
    if (!vp) return;
    if (e.key === 'ArrowRight') {
      vp.scrollBy({ left: 360, behavior: 'smooth' });
    } else if (e.key === 'ArrowLeft') {
      vp.scrollBy({ left: -360, behavior: 'smooth' });
    }
  });
}

// ==========================================================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initStyleSelector();
  initViewSelector();
  renderCurrentView('solo-2026');
});

/**
 * Conmutador de Modo Claro / Modo Oscuro permanente y sincronizado
 */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (!themeBtn) return;

  const savedTheme = localStorage.getItem('incore_theme') || 'dark';

  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    updateThemeButtonText(themeBtn, true);
  } else {
    document.body.classList.remove('dark');
    updateThemeButtonText(themeBtn, false);
  }

  themeBtn.addEventListener('click', () => {
    const isDarkNow = document.body.classList.toggle('dark');
    const newTheme = isDarkNow ? 'dark' : 'light';
    localStorage.setItem('incore_theme', newTheme);
    updateThemeButtonText(themeBtn, isDarkNow);
  });
}

function updateThemeButtonText(button, isDark) {
  if (isDark) {
    button.innerHTML = '✴︎ <span>Modo Claro</span>';
  } else {
    button.innerHTML = '⏺︎ <span>Modo Oscuro</span>';
  }
}

// Reajustar gráficos con debounce al cambiar tamaño de la ventana
let windowResizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(windowResizeTimer);
  windowResizeTimer = setTimeout(() => {
    if (typeof renderCurrentView === 'function' && currentView) {
      renderCurrentView(currentView);
    }
  }, 120);
});
