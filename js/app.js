document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const deck = document.getElementById("deck");
  const coverPage = document.getElementById("coverPage");
  const aspectEditors = document.getElementById("aspectEditors");
  const aspectPreview = document.getElementById("aspectPreview");

  const fields = [
    ["reportTitle", "previewReportTitle"],
    ["reportDate", "previewReportDate"],
    ["reportNumber", "previewReportNumber"],
    ["processes", "previewProcesses"],
    ["directors", "previewDirectors"],
    ["objective", "previewObjective"],
    ["scope", "previewScope"],
    ["elaboradoPor", "previewElaboradoPor"],
    ["visitsTitle", "previewVisitsTitle"],
    ["visits", "previewVisits"],
    ["visitsSub", "previewVisitsSub"],   
    ["amountTitle", "previewAmountTitle"],
    ["amount", "previewAmount"],
    ["amountSub", "previewAmountSub"],  
    ["noveltyTitle", "previewNoveltyTitle"],
    ["novelty", "previewNovelty"],
    ["intermediateTitleInput", "previewIntermediateTitle"]
  ];

  let aspects = [
    { title: "Cumplimiento documental" },
    { title: "Gestión operativa" },
    { title: "Control financiero" },
    { title: "Riesgos y novedades" }
  ];

  const samples = {
    reportTitle: "Informe Auditoria Operativa",
    reportDate: "28 de agosto de 2026",
    reportNumber: "No. INFORME: OP-2026-020",
    processes: "Comercial,\nAdministrativo,\nJuridico,\nGestión Humana,\nCumplimiento\nTIC",
    directors: "Camilo Rodríguez, Paola Villamizar, Francisco Melendéz, Janeth Martínez, Katty Martínez, Maira Echeverry, Luis Osorio.",
    objective: "Presentar los resultados semanales de la evaluación realizada, resaltando avances, novedades y asuntos que requieren gestión directiva.",
    scope: "La revisión comprende las visitas, soportes, procesos y novedades identificadas durante la semana reportada.",
    elaboradoPor: "Elaborado por: Nombre Apellido",
    visitsTitle: "Visitas realizadas",
    visits: "8",
    visitsSub: "visitas en distintas zonas",
    amountTitle: "Monto evaluado",
    amount: "$ 1.250",
    amountSub: "millones de pesos",
    noveltyTitle: "Detalle de la novedad",
    novelty: "Se evidenció oportunidad de mejora en la consistencia de los soportes y en la documentación de cierres parciales.",
    intermediateTitleInput: "Novedades de efectivo. R. Alto. P-Comercial",
    alertTitle: "NOVEDAD IDENTIFICADA",
    alertSubtitle: "Sobrante por",
    alertAmount: "$11.599.470",
    userRole: "ASESORA DE COMISIÓN",
    userName: "MARIA SUESCUN",
    userId: "CC 12345678"
  };

  function setReportVar(name, value) {
    deck.style.setProperty(name, value);
    document.querySelectorAll(".page").forEach(page => page.style.setProperty(name, value));
  }

  function hexToRgb(hex) {
    hex = (hex || "#000000").replace("#", "");
    if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
    const num = parseInt(hex, 16) || 0;
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }

  function mixWithTransparent(hex, percent) {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r},${g},${b},${(percent / 100).toFixed(3)})`;
  }

  function mixWithWhite(hex, percent) {
    const { r, g, b } = hexToRgb(hex);
    const p = percent / 100;
    const m = v => Math.round(v * p + 255 * (1 - p));
    return `rgb(${m(r)},${m(g)},${m(b)})`;
  }

  function mixTwoColors(hexA, percent, hexB) {
    const a = hexToRgb(hexA), b = hexToRgb(hexB);
    const p = percent / 100;
    const m = (x, y) => Math.round(x * p + y * (1 - p));
    return `rgb(${m(a.r, b.r)},${m(a.g, b.g)},${m(a.b, b.b)})`;
  }

  function updateMixedColors() {
    const accent = document.getElementById("accent").value;
    const soft = document.getElementById("soft").value;
    const kpiNumberBg = document.getElementById("kpiNumberBg").value;
    const muted = "#637083";
    const pageEl = document.querySelector(".page");
    const pageInk = pageEl ? (getComputedStyle(pageEl).getPropertyValue("--page-ink").trim() || "#111827") : "#111827";
    const pageBg = (pageEl ? getComputedStyle(pageEl).getPropertyValue("--page-bg").trim() : "") || "#f8fafc";

    setReportVar("--mix-accent-18-transparent", mixWithTransparent(accent, 18));
    setReportVar("--mix-accent-16-transparent", mixWithTransparent(accent, 16));
    setReportVar("--mix-accent-34-transparent", mixWithTransparent(accent, 34));
    setReportVar("--mix-pagebg-92-white", mixWithWhite(pageBg, 92));
    setReportVar("--mix-pageink-78-muted", mixTwoColors(pageInk, 78, muted));
    setReportVar("--mix-pageink-72-muted", mixTwoColors(pageInk, 72, muted));
    setReportVar("--mix-pageink-55-transparent", mixWithTransparent(pageInk, 55));
    setReportVar("--mix-soft-34-white", mixWithWhite(soft, 34));
    setReportVar("--mix-soft-36-white", mixWithWhite(soft, 36));
    setReportVar("--mix-soft-38-white", mixWithWhite(soft, 38));
    setReportVar("--mix-soft-45-white", mixWithWhite(soft, 45));
    setReportVar("--mix-soft-48-white", mixWithWhite(soft, 48));
    setReportVar("--mix-soft-72-white", mixWithWhite(soft, 72));
    setReportVar("--mix-soft-80-white", mixWithWhite(soft, 80));
    setReportVar("--mix-kpinum-82-white", mixWithWhite(kpiNumberBg, 82));
  }

  function value(id) {
    const el = document.getElementById(id);
    return el ? (el.value.trim() || "Pendiente por completar") : "";
  }

  function syncField(inputId, previewId) {
    const previewEl = document.getElementById(previewId);
    if (!previewEl) return;
    
    const val = document.getElementById(inputId)?.value || "";

    if (inputId === "directors") {
      previewEl.innerHTML = "";

      const names = val.split(/\n|,/).map(l => l.trim()).filter(l => l.length > 0);

      if (names.length === 0) {
        previewEl.textContent = "Pendiente por completar";
        return;
      }

      // Todos los nombres van en un solo párrafo, separados por comas,
      // y el texto se ajusta (wrap) dentro de la tarjeta en vez de apilarse.
      const p = document.createElement("p");
      p.textContent = names.join(", ");
      previewEl.appendChild(p);
    } else {
      previewEl.textContent = val.trim() || "Pendiente por completar";
    }
  }

  function syncAll() {
    fields.forEach(([inputId, previewId]) => syncField(inputId, previewId));
    renderAspects();
  }

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[char]));
  }

  function renderAspectEditors() {
    aspectEditors.innerHTML = "";
    aspects.forEach((aspect, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "aspect-editor";
      wrapper.innerHTML = `
        <div class="field"><label>Aspecto ${index + 1}</label><input value="${escapeHtml(aspect.title)}" data-aspect-title="${index}"></div>
        <div class="aspect-actions"><button class="btn btn-danger" type="button" data-remove-aspect="${index}">Eliminar</button></div>
      `;
      aspectEditors.appendChild(wrapper);
    });
  }

  function renderAspects() {
    aspectPreview.innerHTML = "";
    aspects.forEach(aspect => {
      const card = document.createElement("div");
      const title = document.createElement("h3");
      card.className = "aspect-card";
      title.textContent = aspect.title.trim() || "Aspecto pendiente";
      card.append(title);
      aspectPreview.appendChild(card);
    });
  }

  // --- Event Listeners ---
  fields.forEach(([inputId, previewId]) => {
    const el = document.getElementById(inputId);
    if(el) el.addEventListener("input", () => syncField(inputId, previewId));
  });

  document.getElementById("accent").addEventListener("input", event => { setReportVar("--accent", event.target.value); updateMixedColors(); });
  document.getElementById("soft").addEventListener("input", event => { setReportVar("--soft", event.target.value); updateMixedColors(); });  
  document.getElementById("kpiNumberBg").addEventListener("input", event => { setReportVar("--kpi-number-bg", event.target.value); updateMixedColors(); });
  document.getElementById("kpiTitleColor").addEventListener("input", event => setReportVar("--kpi-title", event.target.value));

  // --- Tarjeta de aspecto: fondo/texto sólidos ---
  document.getElementById("aspectCardBg").addEventListener("input", event => setReportVar("--aspect-bg", event.target.value));
  document.getElementById("aspectCardText").addEventListener("input", event => setReportVar("--aspect-text", event.target.value));

  // --- Títulos, párrafos y span ---
  const titleScaleInput = document.getElementById("titleScale");
  const titleScaleValue = document.getElementById("titleScaleValue");
  titleScaleInput.addEventListener("input", event => {
    setReportVar("--title-scale", event.target.value);
    titleScaleValue.textContent = Math.round(event.target.value * 100) + "%";
  });

  document.getElementById("paragraphColor").addEventListener("input", event => setReportVar("--paragraph-color", event.target.value));
  document.getElementById("paragraphSize").addEventListener("input", event => setReportVar("--paragraph-size", event.target.value + "px"));
  document.getElementById("spanColor").addEventListener("input", event => setReportVar("--span-color", event.target.value));
  document.getElementById("spanSize").addEventListener("input", event => setReportVar("--span-size", event.target.value + "px"));

  // --- Color de borde general ---
  document.getElementById("lineColor").addEventListener("input", event => setReportVar("--line", event.target.value));

  document.getElementById("metaColor").addEventListener("input", event => setReportVar("--meta-color", event.target.value));
  document.getElementById("metaSize").addEventListener("input", event => setReportVar("--meta-size", event.target.value + "px"));

  // --- Estilo de tablas ---
  document.getElementById("tableHeaderBg").addEventListener("input", event => setReportVar("--table-header-bg", event.target.value));
  document.getElementById("tableHeaderText").addEventListener("input", event => setReportVar("--table-header-text", event.target.value));
  document.getElementById("tableCellBg").addEventListener("input", event => setReportVar("--table-cell-bg", event.target.value));
  document.getElementById("tableCellText").addEventListener("input", event => setReportVar("--table-cell-text", event.target.value));
  document.getElementById("tableFontSize").addEventListener("input", event => setReportVar("--table-font-size", event.target.value + "px"));

document.getElementById("fontChoice").addEventListener("change", event => {
  const selectedFont = event.target.value;
  // Aplica la fuente a la variable global y de forma directa al contenedor y páginas
  setReportVar("--report-font", selectedFont);
  document.querySelectorAll(".page, .deck, .app").forEach(el => {
    el.style.fontFamily = selectedFont;
  });
});

  aspectEditors.addEventListener("input", event => {
    const titleIndex = event.target.dataset.aspectTitle;
    if (titleIndex !== undefined) aspects[Number(titleIndex)].title = event.target.value;
    renderAspects();
  });

  aspectEditors.addEventListener("click", event => {
    const index = event.target.dataset.removeAspect;
    if (index === undefined) return;
    aspects.splice(Number(index), 1);
    renderAspectEditors();
    renderAspects();
  });

  document.getElementById("sample").addEventListener("click", () => {
    Object.entries(samples).forEach(([id, text]) => {
      const el = document.getElementById(id);
      if(el) el.value = text;
    });
    aspects = [
      { title: "Cumplimiento documental" },
      { title: "Gestión operativa" },
      { title: "Control financiero" },
      { title: "Riesgos y novedades" }
    ];
    renderAspectEditors();
    syncAll();
  });

  // --- PDF GENERATION ---
  document.getElementById("print").addEventListener("click", async () => {
    syncAll();

    const button = document.getElementById("print");
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = "Generando PDF...";

    try {
      if (typeof html2canvas === "undefined" || !window.jspdf) {
        throw new Error("No se pudieron cargar las librerías de PDF.");
      }

      if (document.fonts && document.fonts.ready) {
        try { await document.fonts.ready; } catch (e) {}
      }

      const images = [...document.images];
      await Promise.all(images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        });
      }));

      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

      const { jsPDF } = window.jspdf;
      const pages = [...document.querySelectorAll(".page")].filter(page => {
        const style = window.getComputedStyle(page);
        return style.display !== "none";
      });

      const pdfWidth = 297;
      const pdfHeight = 210;

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
        compress: true
      });

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];

        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: null,
          logging: false,
          imageTimeout: 15000,
          width: 1122,
          height: 794
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.98);

        if (i > 0) pdf.addPage("a4", "landscape");

        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      }

      const title = (document.getElementById("reportTitle").value || "Informe ejecutivo semanal")
        .trim()
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, " ")
        .replace(/\s+/g, " ")
        .slice(0, 90);

      pdf.save(title + ".pdf");
    } catch (error) {
      console.error(error);
      alert("No fue posible generar el PDF.\n\n" + error.message);
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  });

const bgImageSelect = document.getElementById("pageBackgroundImage");
  if (bgImageSelect) {
    bgImageSelect.addEventListener("change", event => {
      currentCustomBg = null;
      const imagePath = event.target.value;
      // Excluimos la portada: su fondo se controla por separado (coverBackgroundImage)
      const pages = document.querySelectorAll(".page:not(#coverPage)");
      
      pages.forEach(page => {
        if (imagePath) {
          page.style.backgroundImage = `url('${imagePath}')`;
          page.style.backgroundSize = 'cover'; 
          page.style.backgroundPosition = 'center';
          page.style.backgroundRepeat = 'no-repeat';
        } else {
          page.style.backgroundImage = 'none'; 
        }
      });
    });
  }

  // 1. Variable global para recordar la imagen subida
  let currentCustomBg = null;

  // 2. Nueva función que sí procesa el archivo de imagen
  function applyCustomBackground(file) {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      currentCustomBg = ev.target.result; // Se guarda en Base64
      // Excluimos la portada: su fondo se controla por separado (coverBackgroundImage / coverBgImageUpload)
      const pages = document.querySelectorAll(".page:not(#coverPage)");
      pages.forEach(page => {
        page.style.backgroundImage = `url('${currentCustomBg}')`;
        page.style.backgroundSize = 'cover';
        page.style.backgroundPosition = 'center';
        page.style.backgroundRepeat = 'no-repeat';
      });
      
      
      const bgImageSelect = document.getElementById("pageBackgroundImage");
      if (bgImageSelect) {
        bgImageSelect.value = ""; 
      }
    };
    reader.readAsDataURL(file);
  }

  // 3. Conectamos la función con tu botón HTML usando el ID correcto
  const bgImageUpload = document.getElementById("bgImageUpload");
  if (bgImageUpload) {
    bgImageUpload.addEventListener("change", (event) => {
      applyCustomBackground(event.target.files[0]);
    });
  }

  // ===== Imagen / Diseño de la Portada (Página 1) =====
  // Ahora se elige desde un menú desplegable con diseños ya cargados en el servidor
  // (carpeta media/), en lugar de subir un archivo desde el equipo.

  // ===== Logo de la empresa (esquina superior derecha de la portada) =====
  const companyLogoUpload = document.getElementById("companyLogoUpload");
  const previewCompanyLogo = document.getElementById("previewCompanyLogo");
  if (companyLogoUpload && previewCompanyLogo) {
    companyLogoUpload.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        previewCompanyLogo.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  const coverImageSelect = document.getElementById("coverImageSelect");
  const previewCoverImage = document.getElementById("previewCoverImage");
  if (coverImageSelect && previewCoverImage) {
    coverImageSelect.addEventListener("change", event => {
      const imagePath = event.target.value;
      if (imagePath) {
        previewCoverImage.style.backgroundImage = `url('${imagePath}')`;
        previewCoverImage.style.display = "";
        coverPage.classList.add("has-cover-image");
      } else {
        previewCoverImage.style.backgroundImage = "none";
        previewCoverImage.style.display = "none";
        coverPage.classList.remove("has-cover-image");
      }
    });
  }

  // ===== Colores y Fondo exclusivos de la Portada =====
  const coverTitleColorInput = document.getElementById("coverTitleColor");
  if (coverTitleColorInput) {
    coverTitleColorInput.addEventListener("input", event => {
      setReportVar("--cover-title-color", event.target.value);
    });
  }

  const coverParagraphColorInput = document.getElementById("coverParagraphColor");
  if (coverParagraphColorInput) {
    coverParagraphColorInput.addEventListener("input", event => {
      setReportVar("--cover-paragraph-color", event.target.value);
    });
  }

  const coverObjectiveColorInput = document.getElementById("coverObjectiveColor");
  if (coverObjectiveColorInput) {
    coverObjectiveColorInput.addEventListener("input", event => {
      setReportVar("--cover-objective-color", event.target.value);
    });
  }

  const coverBgColorInput = document.getElementById("coverBgColor");
  if (coverBgColorInput) {
    coverBgColorInput.addEventListener("input", event => {
      setReportVar("--cover-bg-color", event.target.value);
    });
  }

  const coverBgColor2Input = document.getElementById("coverBgColor2");
  if (coverBgColor2Input) {
    coverBgColor2Input.addEventListener("input", event => {
      setReportVar("--cover-bg-color-2", event.target.value);
    });
  }

  const coverWaveStyleSelect = document.getElementById("coverWaveStyle");
  if (coverWaveStyleSelect) {
    coverWaveStyleSelect.addEventListener("change", event => {
      coverPage.classList.remove("wave-soft", "wave-strong", "wave-double", "diagonal");
      coverPage.classList.add(event.target.value);
    });
  }

  updateMixedColors();
  renderAspectEditors();
  syncAll();

  // --- LÓGICA DE ALERT BANNERS DINÁMICOS (Página 2) ---
  let alertsData = [
    {
      alertTitle: "NOVEDAD IDENTIFICADA",
      alertSubtitle: "Sobrante por",
      alertAmount: "$11.599.470",
      alertNote: "",
      userRole: "ASESORA DE COMISIÓN",
      userName: "MARIA  SUESCUN",
      userId: "CC 1234567"
    }
  ];

  const alertsSidebarGrid = document.getElementById("alertsSidebarGrid");
  const alertsPreviewContainer = document.getElementById("alertsPreviewContainer");

  function renderAlertsData() {
    if (!alertsSidebarGrid) return;
    alertsSidebarGrid.innerHTML = "";
    
    alertsData.forEach((alert, index) => {
      const editor = document.createElement("div");
      editor.className = "evidence-row-editor";
      editor.style.border = "1px solid #d1d5db";
      editor.style.padding = "10px";
      editor.style.borderRadius = "6px";
      
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Eliminar Alerta";
      removeBtn.className = "remove-btn";
      removeBtn.style.marginBottom = "10px";
      removeBtn.onclick = () => { alertsData.splice(index, 1); renderAlertsData(); };

      // Helper para crear inputs rápidamente
      const createField = (labelTxt, key) => {
         const wrap = document.createElement("div"); wrap.className = "field";
         wrap.innerHTML = `<label>${labelTxt}</label>`;
         const inp = document.createElement("input");
         inp.value = alert[key];
         inp.oninput = (e) => { alert[key] = e.target.value; renderAlertsPreview(); };
         wrap.appendChild(inp);
         return wrap;
      };

      const split1 = document.createElement("div"); split1.className = "split";
      split1.append(createField("Título", "alertTitle"), createField("Subtítulo", "alertSubtitle"));
      
      const fAmount = createField("Monto", "alertAmount");

      const fNote = document.createElement("div");
      fNote.className = "field";
      fNote.innerHTML = `<label>Observación (opcional)</label>`;
      const noteInput = document.createElement("textarea");
      noteInput.rows = 2;
      noteInput.style.width = "100%";
      noteInput.style.boxSizing = "border-box";
      noteInput.style.resize = "vertical";
      noteInput.value = alert.alertNote || "";
      noteInput.oninput = (e) => { alert.alertNote = e.target.value; renderAlertsPreview(); };
      fNote.appendChild(noteInput);

      const split2 = document.createElement("div"); split2.className = "split";
      split2.append(createField("Cargo", "userRole"), createField("Nombre", "userName"));
      
      const fId = createField("Documento", "userId");

      editor.append(removeBtn, split1, fAmount, fNote, split2, fId);
      alertsSidebarGrid.appendChild(editor);
    });

    //  Ocultar el botón si ya hay 2 alertas
    const addBtn = document.getElementById("addAlertBtn");
    if (addBtn) {
      if (alertsData.length >= 3) {
        addBtn.style.display = "none";
      } else {
        addBtn.style.display = "block";
      }
    }

    renderAlertsPreview();
  }

  const addAlertBtn = document.getElementById("addAlertBtn");
  if(addAlertBtn) {
    addAlertBtn.addEventListener("click", () => {
      if (alertsData.length < 3) {
        alertsData.push({ 
          alertTitle: "NUEVA ALERTA", 
          alertSubtitle: "Motivo", 
          alertAmount: "$0", 
          alertNote: "",
          userRole: "CARGO", 
          userName: "NOMBRE", 
          userId: "CC" 
        });
        renderAlertsData();
      }
    });
  }

  function renderAlertsPreview() {
    if (!alertsPreviewContainer) return;
    alertsPreviewContainer.innerHTML = "";
    alertsData.forEach(alert => {
      const bannerHtml = `
        <div class="alert-banner">
          <div class="alert-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="#a81c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div class="alert-details">
            <h4 class="alert-title">${alert.alertTitle}</h4>
            <p class="alert-subtitle">${alert.alertSubtitle}</p>
            <strong class="alert-amount">${alert.alertAmount}</strong>
            ${alert.alertNote ? `<p class="alert-observacion">${alert.alertNote}</p>` : ''}
          </div>
          <div class="alert-divider"></div>
          <div class="alert-user">
            <div class="user-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="#00205b" stroke-width="1.5">
                <circle cx="12" cy="12" r="11" fill="#fff"></circle>
                <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#00205b"></path>
              </svg>
            </div>
            <div class="user-info">
              <h4 class="user-role">${alert.userRole}</h4>
              <strong class="user-name">${alert.userName}</strong>
              <p class="user-id">${alert.userId}</p>
            </div>
          </div>
        </div>
      `;
      alertsPreviewContainer.insertAdjacentHTML('beforeend', bannerHtml);
    });
  }

  renderAlertsData();

  // --- LÓGICA DE BANNERS DINÁMICOS (Página 3) ---
  let bannerData = [
    {
      puntoNum: "8570", puntoName: "LAS DELICIAS COMUNEROS",
      userRole: "ASESORA DE COMISIÓN", userName: "ANDREA CASTELLANOS", userId: "CC 12345678",
      faltanteNum: "67", faltanteType: "RASPAS", valor: "$155.000"
    }
  ];

  // --- LÓGICA DE LA PÁGINA 3 (INCLUIR/EXCLUIR PÁGINA COMPLETA, OPCIONAL) ---
  let page3Data = {
    enabled: true,
    title: "Faltantes Tangibles"
  };

  const page3Toggle = document.getElementById("page3Toggle");
  const page3HeaderTitleInput = document.getElementById("page3HeaderTitleInput");
  const page3ControlsWrap = document.getElementById("page3ControlsWrap");
  const page3Preview = document.getElementById("page3Preview");
  const page3HeaderTitlePreview = document.getElementById("page3HeaderTitlePreview");

  function renderPage3() {
    if (page3Preview) {
      page3Preview.style.display = page3Data.enabled ? "" : "none";
    }
    if (page3ControlsWrap) {
      page3ControlsWrap.style.display = page3Data.enabled ? "" : "none";
    }
    if (page3HeaderTitlePreview) {
      page3HeaderTitlePreview.textContent = page3Data.title;
    }
  }

  if (page3Toggle) {
    page3Toggle.checked = page3Data.enabled;
    page3Toggle.addEventListener("change", (e) => {
      page3Data.enabled = e.target.checked;
      renderPage3();
    });
  }

  if (page3HeaderTitleInput) {
    page3HeaderTitleInput.value = page3Data.title;
    page3HeaderTitleInput.addEventListener("input", (e) => {
      page3Data.title = e.target.value;
      renderPage3();
    });
  }

  renderPage3();

  const bannerSidebarGrid = document.getElementById("bannerSidebarGrid");
  const bannerPreviewContainer = document.getElementById("bannerPreviewContainer");

  function renderBannerData() {
    bannerSidebarGrid.innerHTML = "";
    bannerData.forEach((row, index) => {
      const editor = document.createElement("div");
      editor.className = "evidence-row-editor";
      editor.style.border = "1px solid #d1d5db";
      editor.style.padding = "10px";
      editor.style.borderRadius = "6px";
      
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Eliminar Banner";
      removeBtn.className = "remove-btn";
      removeBtn.style.marginBottom = "10px";
      removeBtn.onclick = () => { bannerData.splice(index, 1); renderBannerData(); };

      // Helper para crear inputs rápidamente
      const createField = (labelTxt, key) => {
         const wrap = document.createElement("div"); wrap.className = "field";
         wrap.innerHTML = `<label>${labelTxt}</label>`;
         const inp = document.createElement("input");
         inp.value = row[key];
         inp.oninput = (e) => { row[key] = e.target.value; renderBannerPreview(); };
         wrap.appendChild(inp);
         return wrap;
      };

      const split1 = document.createElement("div"); split1.className = "split";
      split1.append(createField("Punto (Num)", "puntoNum"), createField("Punto (Nombre)", "puntoName"));
      
      const fCargo = createField("Cargo", "userRole");

      const split2 = document.createElement("div"); split2.className = "split";
      split2.append(createField("Nombre", "userName"), createField("Documento", "userId"));

      const split3 = document.createElement("div"); split3.className = "split";
      split3.append(createField("Faltante (Num)", "faltanteNum"), createField("Faltante (Tipo)", "faltanteType"));

      const fValor = createField("Valor Total", "valor");

      editor.append(removeBtn, split1, fCargo, split2, split3, fValor);
      bannerSidebarGrid.appendChild(editor);
    });
    renderBannerPreview();
  }

  function renderBannerPreview() {
    bannerPreviewContainer.innerHTML = "";
    bannerData.forEach(row => {
      const bannerHtml = `
        <div class="banner-cuatro">
          <div class="b4-seccion">
            <div class="b4-icono" style="color: #003380;">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>
            </div>
            <div class="b4-textos">
              <span class="b4-label">PUNTO</span>
              <strong class="b4-val b4-dark">${row.puntoNum}</strong>
              <span class="b4-sub">${row.puntoName}</span>
            </div>
          </div>
          <div class="b4-divisor"></div>
          <div class="b4-seccion">
            <div class="b4-icono" style="color: #003380;">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <div class="b4-textos">
              <span class="b4-label">${row.userRole}</span>
              <strong class="b4-val b4-dark" style="font-size: 15px;">${row.userName}</strong>
              <span class="b4-sub" style="font-weight: normal;">${row.userId}</span>
            </div>
          </div>
          <div class="b4-divisor"></div>
          <div class="b4-seccion">
            <div class="b4-icono" style="color: #a81c1c;">
              <svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M8 6h8M8 10h8M8 14h4" stroke="#fff" stroke-width="2"/></svg>
            </div>
            <div class="b4-textos">
              <span class="b4-label">FALTANTE FÍSICO</span>
              <strong class="b4-val" style="color: #a81c1c; font-size: 32px;">${row.faltanteNum}</strong>
              <span class="b4-sub">${row.faltanteType}</span>
            </div>
          </div>
          <div class="b4-divisor"></div>
          <div class="b4-seccion">
            <div class="b4-icono" style="color: #1b5e20;">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 5H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 12H3V7h18v10zm-9-1.5c-2.21 0-4-1.57-4-3.5s1.79-3.5 4-3.5 4 1.57 4 3.5-1.79 3.5-4 3.5zm0-5c-1.1 0-2 .67-2 1.5s.9 1.5 2 1.5 2-.67 2-1.5-.9-1.5-2-1.5z"/></svg>
            </div>
            <div class="b4-textos">
              <span class="b4-label">VALOR TOTAL</span>
              <strong class="b4-val" style="color: #1b5e20; font-size: 26px;">${row.valor}</strong>
            </div>
          </div>
        </div>
      `;
      bannerPreviewContainer.insertAdjacentHTML('beforeend', bannerHtml);
    });
  }

  document.getElementById("addBannerBtn").addEventListener("click", () => {
    bannerData.push({ puntoNum: "0", puntoName: "NUEVO", userRole: "CARGO", userName: "NOMBRE", userId: "CC", faltanteNum: "0", faltanteType: "TIPO", valor: "$0" });
    renderBannerData();
  });

  renderBannerData();

  // --- LÓGICA DE PÁGINAS DINÁMICAS (MÚLTIPLES TABLAS) ---
  let dynamicPagesData = [
    {
      id: "page_0",
      title: "Aspectos Normativos",
      enabled: true,
      tables: [
        {
          title: "PUNTOS SIN AVISO",
          columns: ["Código PDV", "Nombre de PDV", "Zona"],
          rows: [["12345", "CENTRO PRINCIPAL", "CENTRO"]]
        }
      ]
    }
  ];

  const dynSidebarContainer = document.getElementById("dynamicPagesSidebarContainer");
  const dynDeckContainer = document.getElementById("dynamicPagesDeckContainer");

  function renderDynamicPages() {
    renderDynSidebar();
    renderDynPreview();
  }

function renderDynSidebar() {
    if (!dynSidebarContainer) return;
    dynSidebarContainer.innerHTML = "";

    dynamicPagesData.forEach((page, pageIndex) => {
      // 1. Contenedor principal de la página (Línea roja lateral)
      const pageWrapper = document.createElement("div");
      pageWrapper.style.paddingLeft = "15px";
      pageWrapper.style.marginBottom = "30px";

      // 2. Encabezado de la página (Título rojo y botón eliminar)
      const pageHeader = document.createElement("div");
      pageHeader.style.display = "flex";
      pageHeader.style.justifyContent = "space-between";
      pageHeader.style.alignItems = "center";
      pageHeader.style.marginBottom = "15px";

      const titleH3 = document.createElement("h3");
      titleH3.textContent = `Tablas`; 
      titleH3.style.color = "#471de1";
      titleH3.style.fontSize = "14px";
      titleH3.style.fontWeight = "bold";
      titleH3.style.margin = "0";

      const delPageBtn = document.createElement("button");
      delPageBtn.textContent = "Eliminar Página";
      delPageBtn.style.background = "#fee2e2";
      delPageBtn.style.color = "#e91717";
      delPageBtn.style.border = "none";
      delPageBtn.style.padding = "4px 8px";
      delPageBtn.style.borderRadius = "4px";
      delPageBtn.style.fontSize = "12px";
      delPageBtn.style.cursor = "pointer";
      delPageBtn.onclick = () => { dynamicPagesData.splice(pageIndex, 1); renderDynamicPages(); };

      pageHeader.append(titleH3, delPageBtn);
      pageWrapper.appendChild(pageHeader);

      // --- Checkbox para incluir/ocultar esta página en el informe (sin borrar sus datos) ---
      if (page.enabled === undefined) page.enabled = true;

      const pageToggleWrap = document.createElement("div");
      pageToggleWrap.style.display = "flex";
      pageToggleWrap.style.alignItems = "center";
      pageToggleWrap.style.gap = "10px";
      pageToggleWrap.style.marginBottom = "15px";
      pageToggleWrap.style.paddingBottom = "12px";
      pageToggleWrap.style.borderBottom = "1px dashed rgba(71, 29, 225, 0.3)";

      const pageToggleCheckbox = document.createElement("input");
      pageToggleCheckbox.type = "checkbox";
      pageToggleCheckbox.checked = page.enabled;
      pageToggleCheckbox.style.width = "20px";
      pageToggleCheckbox.style.height = "20px";
      pageToggleCheckbox.id = "dynPageToggle_" + page.id;

      const pageToggleLabel = document.createElement("label");
      pageToggleLabel.textContent = "Incluir esta página en el informe";
      pageToggleLabel.htmlFor = pageToggleCheckbox.id;
      pageToggleLabel.style.margin = "0";
      pageToggleLabel.style.cursor = "pointer";
      pageToggleLabel.style.fontSize = "13px";
      pageToggleLabel.style.fontWeight = "bold";
      pageToggleLabel.style.color = "#334155";

      pageToggleCheckbox.onchange = (e) => {
        page.enabled = e.target.checked;
        pageBodyWrap.style.display = page.enabled ? "" : "none";
        renderDynPreview();
      };

      pageToggleWrap.append(pageToggleCheckbox, pageToggleLabel);
      pageWrapper.appendChild(pageToggleWrap);

      // Contenedor de todos los controles de esta página (se oculta si la página está desactivada)
      const pageBodyWrap = document.createElement("div");
      pageBodyWrap.style.display = page.enabled ? "" : "none";

      // --- Input para el título de la página (Header) ---
      const pageTitleWrap = document.createElement("div");
      pageTitleWrap.style.marginBottom = "15px";
      
      const pageTitleLabel = document.createElement("label");
      pageTitleLabel.textContent = "Título de la Página (Header)";
      pageTitleLabel.style.fontSize = "13px";
      pageTitleLabel.style.color = "#334155";
      pageTitleLabel.style.fontWeight = "bold";
      pageTitleLabel.style.display = "block";
      pageTitleLabel.style.marginBottom = "5px";
      
      const pageTitleInput = document.createElement("input");
      pageTitleInput.value = page.title || "Aspectos Normativos";
      pageTitleInput.style.width = "100%";
      pageTitleInput.style.padding = "10px";
      pageTitleInput.style.border = "1px solid #cbd5e1";
      pageTitleInput.style.borderRadius = "6px";
      pageTitleInput.style.boxSizing = "border-box";
      
      // Al escribir, actualiza el objeto y refresca la vista previa
      pageTitleInput.oninput = (e) => { 
        page.title = e.target.value; 
        renderDynPreview(); 
      };
      
      pageTitleWrap.append(pageTitleLabel, pageTitleInput);
      pageBodyWrap.appendChild(pageTitleWrap);

      // 3. Botón estilo "+ Agregar Nueva Evidencia"
      const addTableBtn = document.createElement("button");
      addTableBtn.textContent = "+ Agregar Nueva Tabla";
      addTableBtn.style.width = "100%";
      addTableBtn.style.padding = "12px";
      addTableBtn.style.background = "#f1f5f9";
      addTableBtn.style.color = "#0f172a";
      addTableBtn.style.border = "none";
      addTableBtn.style.borderRadius = "6px";
      addTableBtn.style.fontWeight = "bold";
      addTableBtn.style.marginBottom = "20px";
      addTableBtn.style.cursor = "pointer";
      addTableBtn.onclick = () => {
        page.tables.push({ title: "NUEVA TABLA", columns: ["Col 1", "Col 2"], rows: [["", ""]] });
        renderDynamicPages();
      };
      pageBodyWrap.appendChild(addTableBtn);

      // 4. Tarjetas individuales de cada tabla (Las tarjetas blancas limpias)
      page.tables.forEach((table, tableIndex) => {
        const tableCard = document.createElement("div");
        tableCard.style.background = "white";
        tableCard.style.border = "1px solid #e2e8f0";
        tableCard.style.borderRadius = "8px";
        tableCard.style.padding = "15px";
        tableCard.style.marginBottom = "15px";

        // Fila: Etiqueta del título y botón eliminar
        const headerRow = document.createElement("div");
        headerRow.style.display = "flex";
        headerRow.style.justifyContent = "space-between";
        headerRow.style.alignItems = "center";
        headerRow.style.marginBottom = "8px";

        const titleLabel = document.createElement("label");
        titleLabel.textContent = "Título de la Tabla";
        titleLabel.style.fontSize = "13px";
        titleLabel.style.color = "#334155";
        titleLabel.style.fontWeight = "bold";

        const delTableBtn = document.createElement("button");
        delTableBtn.textContent = "Eliminar";
        delTableBtn.style.background = "#fee2e2";
        delTableBtn.style.color = "#ef4444";
        delTableBtn.style.border = "none";
        delTableBtn.style.padding = "4px 8px";
        delTableBtn.style.borderRadius = "4px";
        delTableBtn.style.fontSize = "11px";
        delTableBtn.style.cursor = "pointer";
        delTableBtn.onclick = () => { page.tables.splice(tableIndex, 1); renderDynamicPages(); };

        headerRow.append(titleLabel, delTableBtn);
        tableCard.appendChild(headerRow);

        // Input del título
        const titleInput = document.createElement("input");
        titleInput.value = table.title;
        titleInput.style.width = "100%";
        titleInput.style.padding = "10px";
        titleInput.style.border = "1px solid #cbd5e1";
        titleInput.style.borderRadius = "6px";
        titleInput.style.marginBottom = "15px";
        titleInput.style.boxSizing = "border-box";
        titleInput.style.fontSize = "14px";
        titleInput.oninput = (e) => { table.title = e.target.value; renderDynPreview(); };
        tableCard.appendChild(titleInput);

        // Zona para pegar una tabla copiada desde Excel: al pegar, la tabla
        // (columnas y filas) se reconstruye automáticamente sola.
        const pasteZone = document.createElement("textarea");
        pasteZone.value = "";
        pasteZone.placeholder = "Pega aquí una tabla copiada desde Excel (Ctrl+V)\nLa primera fila se usa como encabezados.";
        pasteZone.rows = 2;
        pasteZone.style.width = "100%";
        pasteZone.style.padding = "10px";
        pasteZone.style.border = "1px dashed #94a3b8";
        pasteZone.style.borderRadius = "6px";
        pasteZone.style.marginBottom = "15px";
        pasteZone.style.boxSizing = "border-box";
        pasteZone.style.fontSize = "12px";
        pasteZone.style.color = "#64748b";
        pasteZone.style.resize = "vertical";
        pasteZone.onpaste = (e) => {
          e.preventDefault();
          const text = (e.clipboardData || window.clipboardData).getData("text");
          if (!text || !text.trim()) return;

          // Excel separa columnas con TAB y filas con salto de línea
          const lines = text.replace(/\r/g, "").split("\n").filter(l => l.length > 0);
          if (lines.length === 0) return;

          const parsedRows = lines.map(line => line.split("\t"));
          const newColumns = parsedRows[0];
          const colCount = newColumns.length;
          const newRows = parsedRows.slice(1).map(r => {
            const row = r.slice(0, colCount);
            while (row.length < colCount) row.push("");
            return row;
          });
          if (newRows.length === 0) newRows.push(new Array(colCount).fill(""));

          table.columns = newColumns;
          table.rows = newRows;

          pasteZone.value = "";
          renderDynamicPages();
        };
        tableCard.appendChild(pasteZone);

        // Etiqueta para la cuadrícula
        const gridLabel = document.createElement("label");
        gridLabel.textContent = "Datos de la Tabla";
        gridLabel.style.fontSize = "13px";
        gridLabel.style.color = "#334155";
        gridLabel.style.fontWeight = "bold";
        gridLabel.style.display = "block";
        gridLabel.style.marginBottom = "10px";
        tableCard.appendChild(gridLabel);

        // Cuadrícula de inputs
        const grid = document.createElement("div");
        grid.style.display = "grid";
        grid.style.gap = "6px";
        grid.style.gridTemplateColumns = `repeat(${table.columns.length}, 1fr)`;
        
        const baseInputStyle = `width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; box-sizing: border-box; outline: none;`;

        // Inputs de cabeceras de tabla
        table.columns.forEach((col, colIdx) => {
          const colInput = document.createElement("input");
          colInput.value = col;
          colInput.style.cssText = baseInputStyle + " background: #f8fafc; font-weight: bold; color: #0f172a;";
          colInput.oninput = (e) => { table.columns[colIdx] = e.target.value; renderDynPreview(); };
          grid.appendChild(colInput);
        });

        // Inputs de celdas
        table.rows.forEach((row, rowIdx) => {
          row.forEach((cell, colIdx) => {
            const cellInput = document.createElement("input");
            cellInput.value = cell;
            cellInput.style.cssText = baseInputStyle;
            cellInput.oninput = (e) => { table.rows[rowIdx][colIdx] = e.target.value; renderDynPreview(); };
            grid.appendChild(cellInput);
          });
        });

        tableCard.appendChild(grid);
        pageBodyWrap.appendChild(tableCard);
      });

      pageWrapper.appendChild(pageBodyWrap);
      dynSidebarContainer.appendChild(pageWrapper);
    });
  }

  function renderDynPreview() {
    if (!dynDeckContainer) return;
    dynDeckContainer.innerHTML = "";
    
    // Icono genérico en SVG para el título de las tablas
    const defaultIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;

    dynamicPagesData.forEach(page => {
      // Si la página está desactivada, no se incluye en el informe
      if (page.enabled === false) return;

      // Crear una nueva hoja (.page)
      const pageDiv = document.createElement("div");
      pageDiv.className = "page";

      // --- Crear el header visual en la hoja de papel ---
      const pageHeaderEl = document.createElement("header");
      pageHeaderEl.className = "section-head";
      
      const pageHeaderDiv = document.createElement("div");
      const pageHeaderTitle = document.createElement("h2");
      pageHeaderTitle.className = "section-title";
      pageHeaderTitle.textContent = page.title || "Aspectos Normativos";
      
      pageHeaderDiv.appendChild(pageHeaderTitle);
      pageHeaderEl.appendChild(pageHeaderDiv);
      pageDiv.appendChild(pageHeaderEl);
      
      const gridContainer = document.createElement("div");
      gridContainer.className = "grid-page-container";

      page.tables.forEach(table => {
        const card = document.createElement("div");
        card.className = "dynamic-table-card";
        
        // Cabecera de la tarjeta
        const header = document.createElement("div");
        header.className = "dynamic-table-header";
        header.innerHTML = `${defaultIcon} <span>${table.title}</span>`;
        
        // Tabla HTML
        const tableEl = document.createElement("table");
        tableEl.className = "dynamic-table";
        
        // Thead
        const thead = document.createElement("thead");
        const theadTr = document.createElement("tr");
        table.columns.forEach(col => {
          const th = document.createElement("th");
          th.textContent = col;
          theadTr.appendChild(th);
        });
        thead.appendChild(theadTr);
        
        // Tbody
        const tbody = document.createElement("tbody");
        table.rows.forEach(row => {
          const tr = document.createElement("tr");
          row.forEach(cell => {
            const td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });

        tableEl.appendChild(thead);
        tableEl.appendChild(tbody);
        card.appendChild(header);
        card.appendChild(tableEl);
        gridContainer.appendChild(card);
      });

      pageDiv.appendChild(gridContainer);
      dynDeckContainer.appendChild(pageDiv);
    });
    

    const bgImageSelect = document.getElementById("pageBackgroundImage");
    
    if (currentCustomBg) {
      // Prioriza la imagen que el usuario acaba de subir
      dynDeckContainer.querySelectorAll(".page").forEach(p => {
         p.style.backgroundImage = `url('${currentCustomBg}')`;
         p.style.backgroundSize = 'cover';
         p.style.backgroundPosition = 'center';
         p.style.backgroundRepeat = 'no-repeat';
      });
    } else if (bgImageSelect && bgImageSelect.value) {
      // Si no ha subido ninguna, usa la del menú desplegable
      dynDeckContainer.querySelectorAll(".page").forEach(p => {
         p.style.backgroundImage = `url('${bgImageSelect.value}')`;
         p.style.backgroundSize = 'cover';
         p.style.backgroundPosition = 'center';
         p.style.backgroundRepeat = 'no-repeat';
      });
    }
  }

  const addDynamicPageBtn = document.getElementById("addDynamicPageBtn");
  if(addDynamicPageBtn) {
    addDynamicPageBtn.addEventListener("click", () => {
      dynamicPagesData.push({
        id: "page_" + Date.now(),
        title: "Nueva Página de Tablas",
        enabled: true,
        tables: []
      });
      renderDynamicPages();
    });
  }

  renderDynamicPages();


// --- LÓGICA DE LAS PESTAÑAS (TABS) EN LA SIDEBAR ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const stageEl = document.querySelector('.stage');

  // Relación entre cada pestaña de la sidebar y la página correspondiente en la vista previa
  const tabToPreviewMap = {
    'sec-pag1': 'coverPage',
    'sec-pag2': 'page2Preview',
    'sec-pag3': 'page3Preview',
    'sec-pag4': 'dynamicEvidencesDeckContainer',
    'sec-pag5': 'dynamicPagesDeckContainer',
    'sec-pag6': 'page6DeckContainer',
    'sec-pag7': 'page7DeckContainer'
  };

  function scrollPreviewToTab(targetId) {
    const previewId = tabToPreviewMap[targetId];

    // Pestaña "Estilos": llevamos la vista al inicio (portada)
    if (!previewId) {
      if (stageEl) stageEl.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const previewEl = document.getElementById(previewId);
    if (previewEl) {
      previewEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // 1. Quitar la clase 'active' de todos los botones y ocultar secciones
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active-tab'));
      
      // 2. Activar el botón clicado y mostrar su sección correspondiente
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      document.getElementById(targetId).classList.add('active-tab');

      // 3. Llevar la vista previa directamente a la página correspondiente
      scrollPreviewToTab(targetId);
    });
  });

  // --- LÓGICA DE PÁGINAS DE EVIDENCIA DINÁMICAS (Página 4) ---
  let dynamicEvidencePages = [
    {
      id: "ev_page_" + Date.now(),
      title: "MANEJO INADECUADO DE ACTIVOS FIJOS. R. MEDIO. P ADMINISTRATIVO",
      evidences: [
        { title: "Sobrante de caja", desc: "Se evidencia billete de 50.000 adicional fuera de la gaveta principal.", imgUrls: [] }
      ]
    }
  ];

  const evSidebarContainer = document.getElementById("dynamicEvidencesSidebarContainer");
  const evDeckContainer = document.getElementById("dynamicEvidencesDeckContainer");

  function renderDynamicEvidences() {
    renderDynEvSidebar();
    renderDynEvPreview();
  }

  function renderDynEvSidebar() {
    if (!evSidebarContainer) return;
    evSidebarContainer.innerHTML = "";

    dynamicEvidencePages.forEach((page, pageIndex) => {
      // Contenedor principal de la página en la sidebar
      const pageWrapper = document.createElement("div");
      pageWrapper.style.paddingLeft = "10px";
      pageWrapper.style.marginBottom = "30px";
      pageWrapper.style.borderLeft = "3px solid #ef4444";

      // Encabezado de la página (Título y botón eliminar hoja)
      const pageHeader = document.createElement("div");
      pageHeader.style.display = "flex";
      pageHeader.style.justifyContent = "space-between";
      pageHeader.style.alignItems = "center";
      pageHeader.style.marginBottom = "15px";

      const titleH3 = document.createElement("h3");
      titleH3.textContent = `Hoja de Evidencia ${pageIndex + 1}`;
      titleH3.style.color = "#ef4444";
      titleH3.style.fontSize = "14px";
      titleH3.style.margin = "0";

      const delPageBtn = document.createElement("button");
      delPageBtn.textContent = "Eliminar Hoja";
      delPageBtn.className = "remove-btn";
      delPageBtn.onclick = () => { dynamicEvidencePages.splice(pageIndex, 1); renderDynamicEvidences(); };

      pageHeader.append(titleH3, delPageBtn);
      pageWrapper.appendChild(pageHeader);

      // Input para el Título de la página
      const titleWrap = document.createElement("div");
      titleWrap.className = "field";
      titleWrap.innerHTML = `<label>Título de la Página</label>`;
      const titleInput = document.createElement("input");
      titleInput.value = page.title;
      titleInput.oninput = (e) => { page.title = e.target.value; renderDynEvPreview(); };
      titleWrap.appendChild(titleInput);
      pageWrapper.appendChild(titleWrap);

      // Botón para agregar una fila de evidencia dentro de esta hoja
      const addEvBtn = document.createElement("button");
      addEvBtn.textContent = "+ Agregar Evidencia";
      addEvBtn.className = "btn btn-secondary";
      addEvBtn.style.width = "100%";
      addEvBtn.style.marginBottom = "15px";
      addEvBtn.onclick = () => {
        page.evidences.push({ title: "Nuevo hallazgo", desc: "", imgUrls: [] });
        renderDynamicEvidences();
      };
      pageWrapper.appendChild(addEvBtn);

      // Mini-formularios de cada fila de evidencia
      page.evidences.forEach((ev, evIndex) => {
        const editor = document.createElement("div");
        editor.className = "evidence-row-editor";
        editor.style.background = "white";
        editor.style.padding = "10px";
        editor.style.borderRadius = "6px";
        editor.style.marginBottom = "10px";
        editor.style.border = "1px solid #e2e8f0";

        // Botón eliminar evidencia específica
        const evHeader = document.createElement("div");
        evHeader.style.display = "flex";
        evHeader.style.justifyContent = "flex-end";
        evHeader.style.marginBottom = "5px";
        const delEvBtn = document.createElement("button");
        delEvBtn.textContent = "Eliminar Fila";
        delEvBtn.className = "remove-btn";
        delEvBtn.style.padding = "4px 8px";
        delEvBtn.onclick = () => { page.evidences.splice(evIndex, 1); renderDynamicEvidences(); };
        evHeader.appendChild(delEvBtn);
        editor.appendChild(evHeader);

        // Input Punto de Venta
        const field1 = document.createElement("div"); field1.className = "field";
        field1.innerHTML = `<label>Punto de Venta</label>`;
        const input1 = document.createElement("input");
        input1.value = ev.title;
        input1.oninput = (e) => { ev.title = e.target.value; renderDynEvPreview(); };
        field1.appendChild(input1);

        // Input Novedad
        const field2 = document.createElement("div"); field2.className = "field";
        field2.innerHTML = `<label>Novedad</label>`;
        const input2 = document.createElement("textarea");
        input2.value = ev.desc;
        input2.style.minHeight = "60px";
        input2.oninput = (e) => { ev.desc = e.target.value; renderDynEvPreview(); };
        field2.appendChild(input2);

        // Input Imágenes
        const field3 = document.createElement("div"); field3.className = "field";
        field3.innerHTML = `<label>Cargar Imagen(es)</label>`;
        const input3 = document.createElement("input");
        input3.type = "file";
        input3.accept = "image/*";
        input3.multiple = true;
        input3.onchange = (e) => {
          const files = Array.from(e.target.files);
          if (files.length > 0) {
            ev.imgUrls = [];
            let loaded = 0;
            files.forEach(file => {
              const reader = new FileReader();
              reader.onload = (event) => {
                ev.imgUrls.push(event.target.result);
                loaded++;
                if (loaded === files.length) renderDynEvPreview();
              };
              reader.readAsDataURL(file);
            });
          }
        };
        field3.appendChild(input3);

        editor.append(field1, field2, field3);
        pageWrapper.appendChild(editor);
      });

      evSidebarContainer.appendChild(pageWrapper);
    });
  }

  function renderDynEvPreview() {
    if (!evDeckContainer) return;
    evDeckContainer.innerHTML = "";

    dynamicEvidencePages.forEach(page => {
      // Crear nueva hoja .page
      const pageArticle = document.createElement("article");
      pageArticle.className = "page dynamic-ev-page";

      // Crear el Header
      const header = document.createElement("header");
      header.className = "section-head";
      const divTitle = document.createElement("div");
      const h2 = document.createElement("h2");
      h2.className = "section-title";
      h2.style.textAlign = "center";
      h2.textContent = page.title;
      divTitle.appendChild(h2);
      header.appendChild(divTitle);
      pageArticle.appendChild(header);

      // Crear la Tabla
      const table = document.createElement("table");
      table.className = "report-table";
      table.style.tableLayout = "fixed";
      table.style.width = "100%";

      const thead = document.createElement("thead");
      thead.innerHTML = `
        <tr>
           <th style="width: 25%;">Punto de Venta</th>
           <th style="width: 35%;">Novedad</th>
           <th style="width: 40%; text-align: center;">Evidencia Fotográfica</th>
        </tr>
      `;
      table.appendChild(thead);

      const tbody = document.createElement("tbody");
      page.evidences.forEach(ev => {
        const tr = document.createElement("tr");

        const td1 = document.createElement("td");
        td1.textContent = ev.title;

        const td2 = document.createElement("td");
        td2.textContent = ev.desc;

        const td3 = document.createElement("td");
        td3.style.verticalAlign = "middle";

        if (ev.imgUrls && ev.imgUrls.length > 0) {
          const photoContainer = document.createElement("div");
          photoContainer.className = "evidence-photo-container";
          ev.imgUrls.forEach(url => {
            const img = document.createElement("img");
            img.src = url;
            img.className = "evidence-img-preview";
            photoContainer.appendChild(img);
          });
          td3.appendChild(photoContainer);
        } else {
          td3.innerHTML = `<div style="text-align: center; color: #94a3b8; font-style: italic; padding: 20px;">Sin imagen cargada</div>`;
        }

        tr.append(td1, td2, td3);
        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      pageArticle.appendChild(table);
      evDeckContainer.appendChild(pageArticle);
    });

    // Re-aplicar el fondo seleccionado a las nuevas hojas creadas
    const bgImageSelect = document.getElementById("pageBackgroundImage");
    if (currentCustomBg) {
      evDeckContainer.querySelectorAll(".page").forEach(p => {
         p.style.backgroundImage = `url('${currentCustomBg}')`;
         p.style.backgroundSize = 'cover';
         p.style.backgroundPosition = 'center';
         p.style.backgroundRepeat = 'no-repeat';
      });
    } else if (bgImageSelect && bgImageSelect.value) {
      evDeckContainer.querySelectorAll(".page").forEach(p => {
         p.style.backgroundImage = `url('${bgImageSelect.value}')`;
         p.style.backgroundSize = 'cover';
         p.style.backgroundPosition = 'center';
         p.style.backgroundRepeat = 'no-repeat';
      });
    }
  }

  // Listener para agregar una página completamente nueva
  const addDynEvBtn = document.getElementById("addDynamicEvidencePageBtn");
  if (addDynEvBtn) {
    addDynEvBtn.addEventListener("click", () => {
      dynamicEvidencePages.push({
        id: "ev_page_" + Date.now(),
        title: "NUEVO TÍTULO DE EVIDENCIA",
        evidences: [] // Inicia sin filas de evidencia
      });
      renderDynamicEvidences();
    });
  }

  renderDynamicEvidences();

  // --- LÓGICA DE LA PÁGINA 6 (TABLA LIBRE OPCIONAL) ---
  let page6Data = {
    enabled: false,
    title: "TITULO",
    columns: ["Columna 1", "Columna 2"], // Nombres de las columnas
    rows: [
      ["Dato 1", "Dato 2"] // Valores de las filas (cada fila es un arreglo)
    ]
  };

  const p6SidebarContainer = document.getElementById("page6SidebarContainer");
  const p6DeckContainer = document.getElementById("page6DeckContainer");

  function renderPage6() {
    renderPage6Sidebar();
    renderPage6Preview();
  }

  function renderPage6Sidebar() {
    if (!p6SidebarContainer) return;
    p6SidebarContainer.innerHTML = "";

    // 1. Checkbox para activar/desactivar la página
    const toggleWrap = document.createElement("div");
    toggleWrap.className = "field";
    toggleWrap.style.display = "flex";
    toggleWrap.style.alignItems = "center";
    toggleWrap.style.gap = "10px";
    toggleWrap.style.marginBottom = "20px";
    
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = page6Data.enabled;
    checkbox.style.width = "20px";
    checkbox.style.height = "20px";
    checkbox.onchange = (e) => {
      page6Data.enabled = e.target.checked;
      renderPage6();
    };
    
    const labelToggle = document.createElement("label");
    labelToggle.textContent = "Incluir Página 6 en el informe";
    labelToggle.style.margin = "0";
    labelToggle.style.cursor = "pointer";
    labelToggle.onclick = () => checkbox.click();

    toggleWrap.append(checkbox, labelToggle);
    p6SidebarContainer.appendChild(toggleWrap);

    // Si no está habilitada, no dibujamos el resto de los controles
    if (!page6Data.enabled) return;

    // 2. Input para el Título
    const titleWrap = document.createElement("div");
    titleWrap.className = "field";
    titleWrap.innerHTML = `<label>Título de la Página</label>`;
    const titleInput = document.createElement("input");
    titleInput.value = page6Data.title;
    titleInput.oninput = (e) => { page6Data.title = e.target.value; renderPage6Preview(); };
    titleWrap.appendChild(titleInput);
    p6SidebarContainer.appendChild(titleWrap);

    // 3. SECCIÓN COLUMNAS
    const colSection = document.createElement("div");
    colSection.style.background = "#f8fafc";
    colSection.style.padding = "10px";
    colSection.style.borderRadius = "6px";
    colSection.style.marginBottom = "15px";
    colSection.style.border = "1px solid #e2e8f0";
    
    const colTitle = document.createElement("h4");
    colTitle.textContent = "Configurar Columnas";
    colTitle.style.marginTop = "0";
    colTitle.style.color = "#10b981";
    colSection.appendChild(colTitle);

    page6Data.columns.forEach((colName, colIndex) => {
      const colRow = document.createElement("div");
      colRow.style.display = "flex";
      colRow.style.gap = "5px";
      colRow.style.marginBottom = "5px";
      
      const colInput = document.createElement("input");
      colInput.value = colName;
      colInput.placeholder = `Nombre columna ${colIndex + 1}`;
      colInput.oninput = (e) => { page6Data.columns[colIndex] = e.target.value; renderPage6Preview(); };
      
      const delColBtn = document.createElement("button");
      delColBtn.textContent = "X";
      delColBtn.className = "remove-btn";
      delColBtn.style.padding = "0 10px";
      delColBtn.title = "Eliminar Columna";
      delColBtn.onclick = () => {
        page6Data.columns.splice(colIndex, 1);
        page6Data.rows.forEach(r => r.splice(colIndex, 1)); // Quitar ese dato de todas las filas
        renderPage6();
      };

      colRow.append(colInput, delColBtn);
      colSection.appendChild(colRow);
    });

    const addColBtn = document.createElement("button");
    addColBtn.textContent = "+ Agregar Columna";
    addColBtn.className = "btn";
    addColBtn.style.background = "#d1fae5";
    addColBtn.style.color = "#10b981";
    addColBtn.style.border = "1px solid #10b981";
    addColBtn.style.width = "100%";
    addColBtn.onclick = () => {
      page6Data.columns.push(`Columna ${page6Data.columns.length + 1}`);
      page6Data.rows.forEach(r => r.push("")); 
      renderPage6();
    };
    colSection.appendChild(addColBtn);
    p6SidebarContainer.appendChild(colSection);

    // 4. SECCIÓN FILAS (DATOS)
    const rowSection = document.createElement("div");
    rowSection.style.background = "#f8fafc";
    rowSection.style.padding = "10px";
    rowSection.style.borderRadius = "6px";
    rowSection.style.border = "1px solid #e2e8f0";
    
    const rowTitle = document.createElement("h4");
    rowTitle.textContent = "Datos de las Filas";
    rowTitle.style.marginTop = "0";
    rowTitle.style.color = "#10b981";
    rowSection.appendChild(rowTitle);

    page6Data.rows.forEach((rowArray, rowIndex) => {
      const rowBox = document.createElement("div");
      rowBox.style.border = "1px solid #cbd5e1";
      rowBox.style.padding = "8px";
      rowBox.style.marginBottom = "10px";
      rowBox.style.borderRadius = "4px";
      rowBox.style.background = "white";

      const rowHead = document.createElement("div");
      rowHead.style.display = "flex";
      rowHead.style.justifyContent = "space-between";
      rowHead.style.marginBottom = "8px";
      rowHead.innerHTML = `<strong>Fila ${rowIndex + 1}</strong>`;
      
      const delRowBtn = document.createElement("button");
      delRowBtn.textContent = "Eliminar Fila";
      delRowBtn.className = "remove-btn";
      delRowBtn.style.padding = "2px 6px";
      delRowBtn.onclick = () => {
        page6Data.rows.splice(rowIndex, 1);
        renderPage6();
      };
      rowHead.appendChild(delRowBtn);
      rowBox.appendChild(rowHead);

      // Crear un input por cada columna para esta fila
      page6Data.columns.forEach((colName, colIndex) => {
        const field = document.createElement("div");
        field.className = "field";
        field.style.marginBottom = "5px";
        field.innerHTML = `<label style="font-size: 11px;">${colName}</label>`;
        
        const cellInput = document.createElement("input");
        cellInput.value = rowArray[colIndex] || "";
        cellInput.oninput = (e) => { 
          page6Data.rows[rowIndex][colIndex] = e.target.value; 
          renderPage6Preview(); 
        };
        
        field.appendChild(cellInput);
        rowBox.appendChild(field);
      });

      rowSection.appendChild(rowBox);
    });

    const addRowBtn = document.createElement("button");
    addRowBtn.textContent = "+ Agregar Fila";
    addRowBtn.className = "btn";
    addRowBtn.style.background = "#d1fae5";
    addRowBtn.style.color = "#10b981";
    addRowBtn.style.border = "1px solid #10b981";
    addRowBtn.style.width = "100%";
    addRowBtn.onclick = () => {
      // Crea una fila nueva con tantos espacios vacíos como columnas existan
      page6Data.rows.push(new Array(page6Data.columns.length).fill(""));
      renderPage6();
    };
    rowSection.appendChild(addRowBtn);

    p6SidebarContainer.appendChild(rowSection);
  }

  function renderPage6Preview() {
    if (!p6DeckContainer) return;
    p6DeckContainer.innerHTML = "";

    if (!page6Data.enabled) return; // Si está desactivada, el contenedor se queda vacío

    // Crear la hoja de la página 6
    const pageArticle = document.createElement("article");
    pageArticle.className = "page page6-dynamic";

    // Header y Título
    const header = document.createElement("header");
    header.className = "section-head";
    const divTitle = document.createElement("div");
    const h2 = document.createElement("h2");
    h2.className = "section-title";
    h2.style.textAlign = "center";
    h2.textContent = page6Data.title;
    divTitle.appendChild(h2);
    header.appendChild(divTitle);
    pageArticle.appendChild(header);

    // Contenedor de la tabla (por si hay muchas columnas y necesita scroll horizontal temporal)
    const tableContainer = document.createElement("div");
    tableContainer.style.width = "100%";
    tableContainer.style.overflowX = "auto";

    // Crear la Tabla Gigante
    const table = document.createElement("table");
    table.className = "report-table";
    table.style.width = "100%";

    // Cabeceras (<thead>)
    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    page6Data.columns.forEach(colName => {
      const th = document.createElement("th");
      th.textContent = colName;
      trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    table.appendChild(thead);

    // Cuerpo (<tbody>)
    const tbody = document.createElement("tbody");
    page6Data.rows.forEach(rowArray => {
      const tr = document.createElement("tr");

      page6Data.columns.forEach((_, colIndex) => {
        const td = document.createElement("td");
        td.textContent = rowArray[colIndex] || "";
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    tableContainer.appendChild(table);
    pageArticle.appendChild(tableContainer);
    p6DeckContainer.appendChild(pageArticle);

    // Re-aplicar el fondo seleccionado
    const bgImageSelect = document.getElementById("pageBackgroundImage");
    if (typeof currentCustomBg !== 'undefined' && currentCustomBg) {
       pageArticle.style.backgroundImage = `url('${currentCustomBg}')`;
       pageArticle.style.backgroundSize = 'cover';
       pageArticle.style.backgroundPosition = 'center';
       pageArticle.style.backgroundRepeat = 'no-repeat';
    } else if (bgImageSelect && bgImageSelect.value) {
       pageArticle.style.backgroundImage = `url('${bgImageSelect.value}')`;
       pageArticle.style.backgroundSize = 'cover';
       pageArticle.style.backgroundPosition = 'center';
       pageArticle.style.backgroundRepeat = 'no-repeat';
    }
  }

  renderPage6();

  // --- LÓGICA DE LA PÁGINA 7 (RECOMENDACIONES - ESTILO MEMPHIS, OPCIONAL) ---
  let page7Data = {
    enabled: false,
    title: "Recomendaciones",
    items: [
      { title: "Fortalecer controles", text: "Implementar revisiones periódicas que aseguren el cumplimiento de los procedimientos establecidos en cada proceso evaluado." },
      { title: "Actualizar documentación", text: "Mantener actualizados y disponibles los carnet" }
    ]
  };

  const p7SidebarContainer = document.getElementById("page7SidebarContainer");
  const p7DeckContainer = document.getElementById("page7DeckContainer");

  function renderPage7() {
    renderPage7Sidebar();
    renderPage7Preview();
  }

  function renderPage7Sidebar() {
    if (!p7SidebarContainer) return;
    p7SidebarContainer.innerHTML = "";

    // 1. Checkbox para activar/desactivar la página
    const toggleWrap = document.createElement("div");
    toggleWrap.className = "field";
    toggleWrap.style.display = "flex";
    toggleWrap.style.alignItems = "center";
    toggleWrap.style.gap = "10px";
    toggleWrap.style.marginBottom = "20px";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = page7Data.enabled;
    checkbox.style.width = "20px";
    checkbox.style.height = "20px";
    checkbox.onchange = (e) => {
      page7Data.enabled = e.target.checked;
      renderPage7();
    };

    const labelToggle = document.createElement("label");
    labelToggle.textContent = "Incluir Página de Recomendaciones en el informe";
    labelToggle.style.margin = "0";
    labelToggle.style.cursor = "pointer";
    labelToggle.onclick = () => checkbox.click();

    toggleWrap.append(checkbox, labelToggle);
    p7SidebarContainer.appendChild(toggleWrap);

    // Si no está habilitada, no dibujamos el resto de los controles
    if (!page7Data.enabled) return;

    // 2. Input para el Título de la página
    const titleWrap = document.createElement("div");
    titleWrap.className = "field";
    titleWrap.innerHTML = `<label>Título de la Página</label>`;
    const titleInput = document.createElement("input");
    titleInput.value = page7Data.title;
    titleInput.oninput = (e) => { page7Data.title = e.target.value; renderPage7Preview(); };
    titleWrap.appendChild(titleInput);
    p7SidebarContainer.appendChild(titleWrap);

    // 3. SECCIÓN DE RECOMENDACIONES
    const listSection = document.createElement("div");
    listSection.style.marginTop = "10px";

    const listTitle = document.createElement("h4");
    listTitle.textContent = "Recomendaciones";
    listTitle.style.marginTop = "0";
    listTitle.style.color = "#f97316";
    listSection.appendChild(listTitle);

    page7Data.items.forEach((item, itemIndex) => {
      const itemBox = document.createElement("div");
      itemBox.style.border = "1px solid #fed7aa";
      itemBox.style.background = "#fff7ed";
      itemBox.style.padding = "10px";
      itemBox.style.marginBottom = "12px";
      itemBox.style.borderRadius = "8px";

      const itemHead = document.createElement("div");
      itemHead.style.display = "flex";
      itemHead.style.justifyContent = "space-between";
      itemHead.style.alignItems = "center";
      itemHead.style.marginBottom = "8px";
      itemHead.innerHTML = `<strong>Recomendación ${itemIndex + 1}</strong>`;

      const delItemBtn = document.createElement("button");
      delItemBtn.textContent = "Eliminar";
      delItemBtn.className = "remove-btn";
      delItemBtn.style.padding = "2px 8px";
      delItemBtn.onclick = () => {
        page7Data.items.splice(itemIndex, 1);
        renderPage7();
      };
      itemHead.appendChild(delItemBtn);
      itemBox.appendChild(itemHead);

      const titleField = document.createElement("div");
      titleField.className = "field";
      titleField.style.marginBottom = "6px";
      titleField.innerHTML = `<label style="font-size: 11px;">Título</label>`;
      const titleItemInput = document.createElement("input");
      titleItemInput.value = item.title;
      titleItemInput.oninput = (e) => { item.title = e.target.value; renderPage7Preview(); };
      titleField.appendChild(titleItemInput);
      itemBox.appendChild(titleField);

      const textField = document.createElement("div");
      textField.className = "field";
      textField.innerHTML = `<label style="font-size: 11px;">Descripción</label>`;
      const textItemInput = document.createElement("textarea");
      textItemInput.value = item.text;
      textItemInput.oninput = (e) => { item.text = e.target.value; renderPage7Preview(); };
      textField.appendChild(textItemInput);
      itemBox.appendChild(textField);

      listSection.appendChild(itemBox);
    });

    const addItemBtn = document.createElement("button");
    addItemBtn.textContent = "+ Agregar Recomendación";
    addItemBtn.className = "btn";
    addItemBtn.style.background = "#ffedd5";
    addItemBtn.style.color = "#f97316";
    addItemBtn.style.border = "1px solid #f97316";
    addItemBtn.style.width = "100%";
    addItemBtn.type = "button";
    addItemBtn.onclick = () => {
      page7Data.items.push({ title: "Nueva recomendación", text: "Describe aquí la recomendación." });
      renderPage7();
    };
    listSection.appendChild(addItemBtn);

    p7SidebarContainer.appendChild(listSection);
  }

  function renderPage7Preview() {
    if (!p7DeckContainer) return;
    p7DeckContainer.innerHTML = "";

    if (!page7Data.enabled) return; // Si está desactivada, el contenedor se queda vacío

    // Crear la hoja de la página 7
    const pageArticle = document.createElement("article");
    pageArticle.className = "page page7-dynamic";

    // Formas decorativas estilo Memphis (usan las variables de color del sitio)
    const shapes = document.createElement("div");
    shapes.className = "memphis-shapes";
    shapes.innerHTML = `
      <div class="m-shape m-circle-fill shape-1"></div>
      <div class="m-shape m-circle-outline shape-2"></div>
      <div class="m-shape m-square shape-3"></div>
      <div class="m-shape m-triangle shape-4"></div>
      <div class="m-shape m-circle-fill shape-5"></div>
      <div class="m-shape m-bar shape-6"></div>
      <div class="m-shape m-circle-outline shape-7"></div>
      <div class="m-shape m-triangle shape-8"></div>
      <div class="m-shape m-zigzag shape-9" style="bottom: 24px; right: 40px;"></div>
    `;
    pageArticle.appendChild(shapes);

    // Contenido (por encima de las formas decorativas)
    const content = document.createElement("div");
    content.className = "memphis-content";

    // Header y Título
    const header = document.createElement("header");
    header.className = "section-head";
    const divTitle = document.createElement("div");
    const h2 = document.createElement("h2");
    h2.className = "section-title";
    h2.textContent = page7Data.title;
    divTitle.appendChild(h2);
    header.appendChild(divTitle);
    content.appendChild(header);

    if (page7Data.items.length === 0) {
      const empty = document.createElement("p");
      empty.className = "memphis-empty-state";
      empty.textContent = "Agrega recomendaciones desde el panel lateral para mostrarlas aquí.";
      content.appendChild(empty);
    } else {
      const grid = document.createElement("div");
      grid.className = "memphis-recs-grid";

      page7Data.items.forEach((item, itemIndex) => {
        const card = document.createElement("div");
        card.className = "memphis-rec-card";

        const badge = document.createElement("div");
        badge.className = "memphis-rec-badge";
        badge.textContent = itemIndex + 1;
        card.appendChild(badge);

        const cardTitle = document.createElement("h3");
        cardTitle.className = "memphis-rec-title";
        cardTitle.textContent = item.title;
        card.appendChild(cardTitle);

        const cardText = document.createElement("p");
        cardText.className = "memphis-rec-text";
        cardText.textContent = item.text;
        card.appendChild(cardText);

        grid.appendChild(card);
      });

      content.appendChild(grid);
    }

    pageArticle.appendChild(content);
    p7DeckContainer.appendChild(pageArticle);

    // Re-aplicar el fondo seleccionado (igual que en el resto de páginas)
    const bgImageSelect = document.getElementById("pageBackgroundImage");
    if (typeof currentCustomBg !== 'undefined' && currentCustomBg) {
      pageArticle.style.backgroundImage = `url('${currentCustomBg}')`;
      pageArticle.style.backgroundSize = 'cover';
      pageArticle.style.backgroundPosition = 'center';
      pageArticle.style.backgroundRepeat = 'no-repeat';
    } else if (bgImageSelect && bgImageSelect.value) {
      pageArticle.style.backgroundImage = `url('${bgImageSelect.value}')`;
      pageArticle.style.backgroundSize = 'cover';
      pageArticle.style.backgroundPosition = 'center';
      pageArticle.style.backgroundRepeat = 'no-repeat';
    }
  }

  renderPage7();

});