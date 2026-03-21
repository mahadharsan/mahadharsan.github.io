(function () {
  "use strict";

  var STORAGE_KEY = "resume-builder-v1";

  /** Last field the user typed in (Bold button steals focus from it on click). */
  var lastEditableField = null;

  var SECTIONS = ["experience", "publications", "projects", "education"];

  var SECTION_META_KEYS = [
    "summary",
    "experience",
    "publications",
    "projects",
    "education",
  ];

  var SECTION_LABELS = {
    experience: "Experience",
    publications: "Publications",
    projects: "Projects",
    education: "Education",
  };

  var FONT_STACK = {
    times: '"Times New Roman", Times, "Liberation Serif", serif',
    arial: 'Arial, Helvetica, "Liberation Sans", sans-serif',
  };

  function defaultLayout() {
    return {
      marginTop: 0.6,
      marginRight: 0.75,
      marginBottom: 0.6,
      marginLeft: 0.75,
      fontFamily: "times",
      fontSizeNamePt: 14,
      fontSizeContactsPt: 10.5,
      fontSizeSectionHeadingPt: 11,
      fontSizeEntryHeadingPt: 11,
      fontSizeBulletPt: 11,
      sectionTitleTextToRuleGapEm: 0.15,
      sectionTitleGapEm: 0.45,
      blockHeaderGapEm: 0.2,
      bulletGapEm: 0.2,
      sectionGapEm: 0.85,
      entryGapEm: 0.65,
    };
  }

  function defaultSectionMeta() {
    return {
      summary: { showHeading: false, showLine: true, title: "" },
      experience: { showHeading: true, showLine: true, title: "" },
      publications: { showHeading: true, showLine: true, title: "" },
      projects: { showHeading: true, showLine: true, title: "" },
      education: { showHeading: true, showLine: true, title: "" },
    };
  }

  function mergeSectionMeta(raw) {
    var d = defaultSectionMeta();
    if (!raw || typeof raw !== "object") return d;
    var keys = Object.keys(d);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (!raw[k] || typeof raw[k] !== "object") continue;
      d[k] = {
        showHeading:
          typeof raw[k].showHeading === "boolean"
            ? raw[k].showHeading
            : d[k].showHeading,
        showLine:
          typeof raw[k].showLine === "boolean"
            ? raw[k].showLine
            : d[k].showLine,
        title: typeof raw[k].title === "string" ? raw[k].title : d[k].title,
      };
    }
    return d;
  }

  function mergeLayoutDefaults(raw) {
    var d = defaultLayout();
    if (!raw || typeof raw !== "object") return d;
    function n(key, fallback) {
      var v = raw[key];
      if (typeof v !== "number" || isNaN(v)) return fallback;
      return v;
    }
    var legacyPt = n("fontSizePt", d.fontSizeBulletPt);
    var baseFromLegacy = n("fontSizePt", n("fontSizeBulletPt", d.fontSizeBulletPt));
    return {
      marginTop: n("marginTop", d.marginTop),
      marginRight: n("marginRight", d.marginRight),
      marginBottom: n("marginBottom", d.marginBottom),
      marginLeft: n("marginLeft", d.marginLeft),
      fontFamily: raw.fontFamily === "arial" ? "arial" : "times",
      fontSizeNamePt: n("fontSizeNamePt", baseFromLegacy * (14 / 11)),
      fontSizeContactsPt: n("fontSizeContactsPt", baseFromLegacy * (10.5 / 11)),
      fontSizeSectionHeadingPt: n(
        "fontSizeSectionHeadingPt",
        n("fontSizePt", d.fontSizeSectionHeadingPt)
      ),
      fontSizeEntryHeadingPt: n(
        "fontSizeEntryHeadingPt",
        n("fontSizePt", d.fontSizeEntryHeadingPt)
      ),
      fontSizeBulletPt: n("fontSizeBulletPt", legacyPt),
      sectionTitleTextToRuleGapEm: n(
        "sectionTitleTextToRuleGapEm",
        d.sectionTitleTextToRuleGapEm
      ),
      sectionTitleGapEm: n("sectionTitleGapEm", d.sectionTitleGapEm),
      blockHeaderGapEm: n("blockHeaderGapEm", d.blockHeaderGapEm),
      bulletGapEm: n("bulletGapEm", d.bulletGapEm),
      sectionGapEm: n("sectionGapEm", d.sectionGapEm),
      entryGapEm: n("entryGapEm", d.entryGapEm),
    };
  }

  function defaultState() {
    return {
      name: "",
      contacts: "",
      summary: "",
      include: {
        summary: true,
        experience: true,
        publications: true,
        projects: true,
        education: true,
      },
      sectionMeta: defaultSectionMeta(),
      layout: defaultLayout(),
      experience: [],
      publications: [],
      projects: [],
      education: [],
    };
  }

  function trim(s) {
    return (s || "").trim();
  }

  /** Split into non-empty lines; do not trim — preserves intentional spaces. */
  function bulletsToLines(text) {
    return (text || "").split(/\r?\n/).filter(function (line) {
      return line.length > 0;
    });
  }

  function usesDatedEntry(sectionKey) {
    return sectionKey === "experience" || sectionKey === "education";
  }

  function entryIsEmpty(entry, sectionKey) {
    var h = trim(entry.header || "");
    var b = trim(entry.bullets || "");
    var d = trim(entry.date || "");
    if (usesDatedEntry(sectionKey)) {
      return !h && !b && !d;
    }
    return !h && !b;
  }

  function sectionHasContent(key, state) {
    var list = state[key];
    if (!Array.isArray(list) || list.length === 0) return false;
    return list.some(function (e) {
      return !entryIsEmpty(e, key);
    });
  }

  function shouldRenderSection(key, state) {
    if (!state.include[key]) return false;
    return sectionHasContent(key, state);
  }

  function shouldRenderSummary(state) {
    if (state.include && state.include.summary === false) return false;
    return trim(state.summary) !== "";
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderBoldOnly(s) {
    var chunks = String(s).split("**");
    var out = "";
    for (var i = 0; i < chunks.length; i++) {
      var seg = escapeHtml(chunks[i]);
      if (i % 2 === 1) out += "<strong>" + seg + "</strong>";
      else out += seg;
    }
    return out;
  }

  function sanitizeLinkUrl(url) {
    url = trim(url);
    if (!url) return null;
    var lower = url.toLowerCase();
    if (
      lower.indexOf("javascript:") === 0 ||
      lower.indexOf("data:") === 0 ||
      lower.indexOf("vbscript:") === 0
    ) {
      return null;
    }
    if (
      lower.indexOf("http://") === 0 ||
      lower.indexOf("https://") === 0
    ) {
      return url;
    }
    if (lower.indexOf("mailto:") === 0 || lower.indexOf("tel:") === 0) {
      return url;
    }
    if (url.indexOf("://") === -1 && /^[\w.-]+\.[a-z]{2,}/i.test(url)) {
      return "https://" + url;
    }
    return null;
  }

  /** **bold** and [label](url) links (http, https, mailto, tel, or bare domain). */
  function renderInlineMarkdown(s) {
    var str = String(s);
    var re = /\[([^\]]*)\]\(([^)]+)\)/g;
    var out = "";
    var last = 0;
    var m;
    while ((m = re.exec(str)) !== null) {
      out += renderBoldOnly(str.slice(last, m.index));
      var href = sanitizeLinkUrl(m[2]);
      if (href) {
        var extra = "";
        if (/^https?:\/\//i.test(href)) {
          extra = ' target="_blank" rel="noopener noreferrer"';
        }
        out +=
          '<a href="' +
          escapeHtml(href) +
          '" class="resume-inline-link"' +
          extra +
          ">" +
          renderBoldOnly(m[1]) +
          "</a>";
      } else {
        out += escapeHtml(m[0]);
      }
      last = re.lastIndex;
    }
    out += renderBoldOnly(str.slice(last));
    return out;
  }

  function summaryToHtml(text) {
    var raw = text || "";
    var blocks = raw.split(/\n\s*\n/).filter(function (b) {
      return b.length > 0;
    });
    if (blocks.length === 0) return "";
    return blocks
      .map(function (block) {
        var inner = block
          .split(/\r?\n/)
          .map(function (line) {
            return renderInlineMarkdown(line);
          })
          .join("<br>");
        return "<p>" + inner + "</p>";
      })
      .join("");
  }

  function contactsToHtml(text) {
    return String(text)
      .split(/\r?\n/)
      .map(function (line) {
        return renderInlineMarkdown(line);
      })
      .join("<br>");
  }

  function getSectionHeadingText(key, state) {
    var meta = mergeSectionMeta(state.sectionMeta)[key];
    if (!meta || !meta.showHeading) return null;
    var t = trim(meta.title);
    if (key === "summary") {
      return t || "Summary";
    }
    return t || SECTION_LABELS[key];
  }

  function sectionHeadingShowsLine(key, state) {
    if (!getSectionHeadingText(key, state)) return false;
    var meta = mergeSectionMeta(state.sectionMeta)[key];
    return !!(meta && meta.showLine);
  }

  function renderSectionTitleHtml(key, state) {
    var text = getSectionHeadingText(key, state);
    if (!text) return "";
    var line = sectionHeadingShowsLine(key, state);
    var cls = "resume-section-title";
    if (!line) cls += " resume-section-title--no-line";
    return '<h2 class="' + cls + '">' + renderInlineMarkdown(text) + "</h2>";
  }

  function renderEntryBlock(key, entry) {
    var h = trim(entry.header || "");
    var dt = trim(entry.date || "");
    var lines = bulletsToLines(entry.bullets || "");
    var useDateRow = usesDatedEntry(key);

    var parts = [];
    parts.push('<div class="resume-block">');

    if (useDateRow) {
      if (h || dt) {
        parts.push('<div class="resume-block-head-row">');
        parts.push(
          "<p class=\"resume-block-header\">" +
            (h ? renderInlineMarkdown(h) : "&nbsp;") +
            "</p>"
        );
        parts.push(
          "<p class=\"resume-block-date\">" +
            (dt ? renderInlineMarkdown(dt) : "&nbsp;") +
            "</p>"
        );
        parts.push("</div>");
      }
    } else if (h) {
      parts.push(
        '<p class="resume-block-header resume-block-header--solo">' +
          renderInlineMarkdown(h) +
          "</p>"
      );
    }

    if (lines.length > 0) {
      if (key === "education") {
        parts.push('<div class="resume-edu-body">');
        lines.forEach(function (line) {
          parts.push(
            '<p class="resume-edu-line">' + renderInlineMarkdown(line) + "</p>"
          );
        });
        parts.push("</div>");
      } else {
        parts.push('<ul class="resume-block-list">');
        lines.forEach(function (line) {
          parts.push("<li>" + renderInlineMarkdown(line) + "</li>");
        });
        parts.push("</ul>");
      }
    }

    parts.push("</div>");
    return parts.join("");
  }

  function applyResumeLayout(layout) {
    var el = document.getElementById("resume-preview");
    if (!el) return;
    var L = mergeLayoutDefaults(layout);
    var fontKey = L.fontFamily === "arial" ? "arial" : "times";
    var stack = FONT_STACK[fontKey] || FONT_STACK.times;

    el.style.setProperty("--m-top", L.marginTop + "in");
    el.style.setProperty("--m-right", L.marginRight + "in");
    el.style.setProperty("--m-bottom", L.marginBottom + "in");
    el.style.setProperty("--m-left", L.marginLeft + "in");
    el.style.setProperty("--resume-font-family", stack);
    el.style.setProperty("--resume-body-size", L.fontSizeBulletPt + "pt");
    el.style.setProperty("--resume-name-size", L.fontSizeNamePt + "pt");
    el.style.setProperty("--resume-contacts-size", L.fontSizeContactsPt + "pt");
    el.style.setProperty(
      "--resume-section-heading-size",
      L.fontSizeSectionHeadingPt + "pt"
    );
    el.style.setProperty(
      "--resume-entry-subheading-size",
      L.fontSizeEntryHeadingPt + "pt"
    );
    el.style.setProperty("--resume-bullet-size", L.fontSizeBulletPt + "pt");
    el.style.setProperty(
      "--section-title-text-to-rule-gap",
      L.sectionTitleTextToRuleGapEm + "em"
    );
    el.style.setProperty("--section-title-gap", L.sectionTitleGapEm + "em");
    el.style.setProperty("--block-header-gap", L.blockHeaderGapEm + "em");
    el.style.setProperty("--bullet-gap", L.bulletGapEm + "em");
    el.style.setProperty("--section-gap", L.sectionGapEm + "em");
    el.style.setProperty("--entry-gap", L.entryGapEm + "em");
  }

  function renderResumePreview(state) {
    var root = document.getElementById("resume-preview");
    if (!root) return;

    var parts = [];

    var name = trim(state.name);
    var contacts = trim(state.contacts);

    if (name) {
      parts.push('<h1 class="resume-name">' + renderInlineMarkdown(name) + "</h1>");
    }
    if (contacts) {
      parts.push(
        '<p class="resume-contacts">' + contactsToHtml(contacts) + "</p>"
      );
    }

    if (shouldRenderSummary(state)) {
      parts.push('<section class="resume-section">');
      parts.push(renderSectionTitleHtml("summary", state));
      parts.push(
        '<div class="resume-summary-body">' +
          summaryToHtml(state.summary) +
          "</div>"
      );
      parts.push("</section>");
    }

    SECTIONS.forEach(function (key) {
      if (!shouldRenderSection(key, state)) return;

      parts.push('<section class="resume-section">');
      parts.push(renderSectionTitleHtml(key, state));

      state[key].forEach(function (entry) {
        if (entryIsEmpty(entry, key)) return;
        parts.push(renderEntryBlock(key, entry));
      });

      parts.push("</section>");
    });

    if (parts.length === 0) {
      root.innerHTML =
        '<p class="resume-empty-hint">Add your name and content in the panel on the left. Empty sections stay hidden in the final resume.</p>';
      applyResumeLayout(state.layout);
      return;
    }

    root.innerHTML = parts.join("");
    applyResumeLayout(state.layout);
  }

  function getEntryElements(sectionKey) {
    var id = "entries-" + sectionKey;
    var container = document.getElementById(id);
    if (!container) return [];
    return Array.prototype.slice.call(
      container.querySelectorAll(".entry-card")
    );
  }

  function readEntryFromCard(card) {
    var headerInput = card.querySelector(".input-header");
    var bulletsInput = card.querySelector(".input-bullets");
    var dateInput = card.querySelector(".input-date");
    return {
      header: headerInput ? headerInput.value : "",
      date: dateInput ? dateInput.value : "",
      bullets: bulletsInput ? bulletsInput.value : "",
    };
  }

  function readSectionMetaFromDOM() {
    var defaults = defaultSectionMeta();
    var out = {};
    SECTION_META_KEYS.forEach(function (k) {
      var sh = document.getElementById("meta-" + k + "-show-heading");
      var sl = document.getElementById("meta-" + k + "-show-line");
      var tit = document.getElementById("meta-" + k + "-title");
      out[k] = {
        showHeading: sh ? sh.checked : defaults[k].showHeading,
        showLine: sl ? sl.checked : defaults[k].showLine,
        title: tit ? tit.value : "",
      };
    });
    return out;
  }

  function applySectionMetaToEditor(sectionMeta) {
    var m = mergeSectionMeta(sectionMeta);
    SECTION_META_KEYS.forEach(function (k) {
      var sh = document.getElementById("meta-" + k + "-show-heading");
      var sl = document.getElementById("meta-" + k + "-show-line");
      var tit = document.getElementById("meta-" + k + "-title");
      if (sh) sh.checked = m[k].showHeading;
      if (sl) sl.checked = m[k].showLine;
      if (tit) tit.value = m[k].title;
    });
  }

  function readLayoutFromDOM() {
    var d = defaultLayout();
    function num(id, fallback) {
      var el = document.getElementById(id);
      if (!el) return fallback;
      var v = parseFloat(el.value);
      return isNaN(v) ? fallback : v;
    }
    var fontEl = document.getElementById("layout-font-family");
    var fam = fontEl && fontEl.value === "arial" ? "arial" : "times";
    return {
      marginTop: num("layout-margin-top", d.marginTop),
      marginRight: num("layout-margin-right", d.marginRight),
      marginBottom: num("layout-margin-bottom", d.marginBottom),
      marginLeft: num("layout-margin-left", d.marginLeft),
      fontFamily: fam,
      fontSizeNamePt: num("layout-font-size-name", d.fontSizeNamePt),
      fontSizeContactsPt: num(
        "layout-font-size-contacts",
        d.fontSizeContactsPt
      ),
      fontSizeSectionHeadingPt: num(
        "layout-font-size-section",
        d.fontSizeSectionHeadingPt
      ),
      fontSizeEntryHeadingPt: num(
        "layout-font-size-entry",
        d.fontSizeEntryHeadingPt
      ),
      fontSizeBulletPt: num("layout-font-size-bullet", d.fontSizeBulletPt),
      sectionTitleTextToRuleGapEm: num(
        "layout-section-title-text-to-rule-gap",
        d.sectionTitleTextToRuleGapEm
      ),
      sectionTitleGapEm: num("layout-section-title-gap", d.sectionTitleGapEm),
      blockHeaderGapEm: num("layout-block-header-gap", d.blockHeaderGapEm),
      bulletGapEm: num("layout-bullet-gap", d.bulletGapEm),
      sectionGapEm: num("layout-section-gap", d.sectionGapEm),
      entryGapEm: num("layout-entry-gap", d.entryGapEm),
    };
  }

  function readStateFromDOM() {
    var nameEl = document.getElementById("input-name");
    var contactsEl = document.getElementById("input-contacts");
    var state = defaultState();

    state.name = nameEl ? nameEl.value : "";
    state.contacts = contactsEl ? contactsEl.value : "";

    var summaryEl = document.getElementById("input-summary");
    var summaryToggle = document.getElementById("toggle-summary");
    state.summary = summaryEl ? summaryEl.value : "";
    if (summaryToggle) {
      state.include.summary = summaryToggle.checked;
    }

    state.sectionMeta = readSectionMetaFromDOM();
    state.layout = readLayoutFromDOM();

    SECTIONS.forEach(function (key) {
      var toggle = document.getElementById("toggle-" + key);
      state.include[key] = toggle ? toggle.checked : true;
      state[key] = getEntryElements(key).map(readEntryFromCard);
    });

    return state;
  }

  function setIncludeToggles(state) {
    var summaryToggle = document.getElementById("toggle-summary");
    if (
      summaryToggle &&
      state.include &&
      typeof state.include.summary === "boolean"
    ) {
      summaryToggle.checked = state.include.summary;
    }
    SECTIONS.forEach(function (key) {
      var toggle = document.getElementById("toggle-" + key);
      if (toggle && state.include && key in state.include) {
        toggle.checked = !!state.include[key];
      }
    });
  }

  function clearEntriesContainers() {
    SECTIONS.forEach(function (key) {
      var container = document.getElementById("entries-" + key);
      if (container) container.innerHTML = "";
    });
  }

  function createEntryCard(sectionKey, entry) {
    var tplId = "tpl-entry";
    if (sectionKey === "education") tplId = "tpl-entry-edu";
    else if (sectionKey === "experience") tplId = "tpl-entry-dated";
    var tpl = document.getElementById(tplId);
    if (!tpl) return null;
    var frag = tpl.content.cloneNode(true);
    var node = frag.querySelector(".entry-card");
    if (!node) return null;
    node.dataset.section = sectionKey;

    var headerInput = node.querySelector(".input-header");
    var bulletsInput = node.querySelector(".input-bullets");
    var dateInput = node.querySelector(".input-date");
    if (headerInput && entry) headerInput.value = entry.header || "";
    if (bulletsInput && entry) bulletsInput.value = entry.bullets || "";
    if (dateInput && entry) dateInput.value = entry.date || "";

    return node;
  }

  function applyLayoutToEditor(layout) {
    var L = mergeLayoutDefaults(layout);
    function setVal(id, val) {
      var el = document.getElementById(id);
      if (el) el.value = String(val);
    }
    setVal("layout-margin-top", L.marginTop);
    setVal("layout-margin-right", L.marginRight);
    setVal("layout-margin-bottom", L.marginBottom);
    setVal("layout-margin-left", L.marginLeft);
    setVal("layout-font-size-name", L.fontSizeNamePt);
    setVal("layout-font-size-contacts", L.fontSizeContactsPt);
    setVal("layout-font-size-section", L.fontSizeSectionHeadingPt);
    setVal("layout-font-size-entry", L.fontSizeEntryHeadingPt);
    setVal("layout-font-size-bullet", L.fontSizeBulletPt);
    setVal(
      "layout-section-title-text-to-rule-gap",
      L.sectionTitleTextToRuleGapEm
    );
    setVal("layout-section-title-gap", L.sectionTitleGapEm);
    setVal("layout-block-header-gap", L.blockHeaderGapEm);
    setVal("layout-bullet-gap", L.bulletGapEm);
    setVal("layout-section-gap", L.sectionGapEm);
    setVal("layout-entry-gap", L.entryGapEm);
    var fontEl = document.getElementById("layout-font-family");
    if (fontEl) fontEl.value = L.fontFamily === "arial" ? "arial" : "times";
  }

  function applyStateToEditor(state) {
    var nameEl = document.getElementById("input-name");
    var contactsEl = document.getElementById("input-contacts");
    if (nameEl) nameEl.value = state.name || "";
    if (contactsEl) contactsEl.value = state.contacts || "";

    var summaryEl = document.getElementById("input-summary");
    if (summaryEl) summaryEl.value = typeof state.summary === "string" ? state.summary : "";

    applySectionMetaToEditor(state.sectionMeta);
    applyLayoutToEditor(state.layout);
    setIncludeToggles(state);
    clearEntriesContainers();

    SECTIONS.forEach(function (key) {
      var list = Array.isArray(state[key]) ? state[key] : [];
      var container = document.getElementById("entries-" + key);
      if (!container) return;
      if (list.length === 0) return;

      list.forEach(function (entry) {
        var card = createEntryCard(key, entry);
        if (card) container.appendChild(card);
      });
    });
  }

  function addEntry(sectionKey, focus) {
    var container = document.getElementById("entries-" + sectionKey);
    if (!container) return;
    var card = createEntryCard(sectionKey, {
      header: "",
      date: "",
      bullets: "",
    });
    if (!card) return;
    container.appendChild(card);
    if (focus) {
      var input = card.querySelector(".input-header");
      if (input) input.focus();
    }
    sync();
  }

  function removeEntry(card) {
    var parent = card.parentNode;
    if (parent) parent.removeChild(card);
    sync();
  }

  var saveTimer;
  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(readStateFromDOM()));
      } catch (e) {
        /* ignore quota */
      }
    }, 300);
  }

  function sync() {
    var state = readStateFromDOM();
    renderResumePreview(state);
    scheduleSave();
  }

  function loadFromStorage() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function mergeLoadedState(raw) {
    var base = defaultState();
    if (!raw || typeof raw !== "object") return base;

    base.name = typeof raw.name === "string" ? raw.name : "";
    base.contacts = typeof raw.contacts === "string" ? raw.contacts : "";
    base.summary = typeof raw.summary === "string" ? raw.summary : "";
    base.sectionMeta = mergeSectionMeta(raw.sectionMeta);
    base.layout = mergeLayoutDefaults(raw.layout);

    if (raw.include && typeof raw.include === "object") {
      if (typeof raw.include.summary === "boolean") {
        base.include.summary = raw.include.summary;
      }
      SECTIONS.forEach(function (key) {
        if (typeof raw.include[key] === "boolean") {
          base.include[key] = raw.include[key];
        }
      });
    }

    SECTIONS.forEach(function (key) {
      if (!Array.isArray(raw[key])) return;
      base[key] = raw[key]
        .filter(function (e) {
          return e && typeof e === "object";
        })
        .map(function (e) {
          return {
            header: typeof e.header === "string" ? e.header : "",
            date: typeof e.date === "string" ? e.date : "",
            bullets: typeof e.bullets === "string" ? e.bullets : "",
          };
        });
    });

    return base;
  }

  function exportJson() {
    var state = readStateFromDOM();
    var blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "resume-data.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function importJson(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var parsed = JSON.parse(reader.result);
        var state = mergeLoadedState(parsed);
        applyStateToEditor(state);
        sync();
      } catch (e) {
        alert("Could not read JSON file.");
      }
    };
    reader.readAsText(file, "UTF-8");
  }

  function onDelegatedInput(e) {
    var t = e.target;
    if (
      t &&
      (t.id === "input-name" ||
        t.id === "input-contacts" ||
        t.id === "input-summary" ||
        (t.id && t.id.indexOf("layout-") === 0) ||
        (t.id && /^meta-/.test(t.id)) ||
        t.classList.contains("input-header") ||
        t.classList.contains("input-date") ||
        t.classList.contains("input-bullets"))
    ) {
      sync();
    }
  }

  function onDelegatedChange(e) {
    var t = e.target;
    if (t && t.id && t.id.indexOf("toggle-") === 0) {
      sync();
      return;
    }
    if (t && t.id === "layout-font-family") {
      sync();
      return;
    }
    if (t && t.id && /^meta-/.test(t.id)) {
      sync();
    }
  }

  function isTextEditableField(el) {
    if (!el) return false;
    if (el.tagName === "TEXTAREA") return true;
    if (el.tagName !== "INPUT") return false;
    var type = (el.type || "").toLowerCase();
    return (
      type === "text" ||
      type === "search" ||
      type === "email" ||
      type === "tel" ||
      type === "url" ||
      type === ""
    );
  }

  function wrapBoldSelection() {
    var el = document.activeElement;
    if (!isTextEditableField(el)) {
      el = lastEditableField;
    }
    if (!el || !isTextEditableField(el)) {
      return;
    }
    var ta = el;
    if (typeof ta.selectionStart !== "number") return;
    var start = ta.selectionStart;
    var end = ta.selectionEnd;
    var v = ta.value;
    var sel = v.substring(start, end);
    var insert = sel.length ? sel : "bold";
    var wrapped = "**" + insert + "**";
    ta.value = v.substring(0, start) + wrapped + v.substring(end);
    var newStart = start + 2;
    var newEnd = newStart + insert.length;
    ta.focus();
    ta.setSelectionRange(newStart, newEnd);
    lastEditableField = ta;
    sync();
  }

  function guessUrlFromSelection(text) {
    var t = trim(text);
    if (!t) return "";
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) {
      return "mailto:" + t;
    }
    if (/^https?:\/\//i.test(t)) {
      return t;
    }
    if (/^[\w.-]+\.[a-z]{2,}/i.test(t)) {
      return "https://" + t.replace(/^\/+/, "");
    }
    return "";
  }

  function wrapLinkSelection() {
    var el = document.activeElement;
    if (!isTextEditableField(el)) {
      el = lastEditableField;
    }
    if (!el || !isTextEditableField(el)) {
      return;
    }
    var ta = el;
    if (typeof ta.selectionStart !== "number") return;
    var start = ta.selectionStart;
    var end = ta.selectionEnd;
    var v = ta.value;
    var sel = v.substring(start, end);
    if (!sel.length) {
      alert(
        "Select the text you want to turn into a link (for example the email or website address)."
      );
      return;
    }
    var suggested = guessUrlFromSelection(sel);
    var url = window.prompt(
      "Paste or edit the full URL (https://…, mailto:…, or tel:…):",
      suggested || "https://"
    );
    if (url === null) return;
    url = trim(url);
    if (!url) return;
    var wrapped = "[" + sel + "](" + url + ")";
    ta.value = v.substring(0, start) + wrapped + v.substring(end);
    var newPos = start + wrapped.length;
    ta.focus();
    ta.setSelectionRange(newPos, newPos);
    lastEditableField = ta;
    sync();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var loaded = loadFromStorage();
    if (loaded) {
      applyStateToEditor(mergeLoadedState(loaded));
    }

    sync();

    document.addEventListener("input", onDelegatedInput, true);
    document.addEventListener("change", onDelegatedChange, true);

    document.addEventListener(
      "focusin",
      function (e) {
        var t = e.target;
        if (isTextEditableField(t)) {
          lastEditableField = t;
        }
      },
      true
    );

    document.querySelector(".layout").addEventListener("click", function (e) {
      var addBtn = e.target.closest("[data-add]");
      if (addBtn) {
        var section = addBtn.getAttribute("data-add");
        if (section) addEntry(section, true);
        return;
      }
      var removeBtn = e.target.closest("[data-remove]");
      if (removeBtn) {
        var card = removeBtn.closest(".entry-card");
        if (card) removeEntry(card);
      }
    });

    var btnExport = document.getElementById("btn-export-json");
    if (btnExport) btnExport.addEventListener("click", exportJson);

    var inputImport = document.getElementById("input-import-json");
    if (inputImport) {
      inputImport.addEventListener("change", function () {
        var f = inputImport.files && inputImport.files[0];
        if (f) importJson(f);
        inputImport.value = "";
      });
    }

    var btnPrint = document.getElementById("btn-print");
    if (btnPrint) {
      btnPrint.addEventListener("click", function () {
        window.print();
      });
    }

    var btnBold = document.getElementById("btn-wrap-bold");
    if (btnBold) {
      btnBold.addEventListener("mousedown", function (e) {
        e.preventDefault();
      });
      btnBold.addEventListener("click", function (e) {
        e.preventDefault();
        wrapBoldSelection();
      });
    }

    var btnLink = document.getElementById("btn-wrap-link");
    if (btnLink) {
      btnLink.addEventListener("mousedown", function (e) {
        e.preventDefault();
      });
      btnLink.addEventListener("click", function (e) {
        e.preventDefault();
        wrapLinkSelection();
      });
    }
  });
})();
