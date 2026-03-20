/*
  Providence Parks Digital Field Walk Presentation
  ------------------------------------------------
  Non-technical editing notes:
  - ALL text, images, labels, colors, and chapter data live in content.js.
  - Edit content.js to update the presentation — no need to touch this file or index.html.
  - To replace a placeholder visual, set chapter.visual.type = "image" and add chapter.visual.src.
  - For the map chapters, edit content.js -> presentationData.chapters -> map.layers and map.zones.
*/

(() => {
  const C = window.SITE_CONTENT;
  const state = {
    content: null,
    currentChapterIndex: 0,
    viewMode: 'landing',
    presenterMode: false,
    printMode: false,
    textEditMode: false,
    selectedZoneByChapterId: {},
    assetVersion: Date.now()
  };

  const el = {
    app: document.getElementById('app'),
    brandLogo: document.getElementById('brandLogo'),
    presentationTitle: document.getElementById('presentationTitle'),
    chapterList: document.getElementById('chapterList'),
    landingScreen: document.getElementById('landingScreen'),
    landingMap: document.getElementById('landingMap'),
    landingBrandLogo: document.getElementById('landingBrandLogo'),
    floatingMapBtn: document.getElementById('floatingMapBtn'),
    floatingMapLogo: document.getElementById('floatingMapLogo'),
    slideContainer: document.getElementById('slideContainer'),
    chapterCounter: document.getElementById('chapterCounter'),
    chapterName: document.getElementById('chapterName'),
    prevBtn: document.getElementById('prevBtn'),
    mapHomeBtn: document.getElementById('mapHomeBtn'),
    nextBtn: document.getElementById('nextBtn'),
    textEditToggle: document.getElementById('textEditToggle'),
    exportJsonBtn: document.getElementById('exportJsonBtn'),
    presenterToggle: document.getElementById('presenterToggle'),
    printToggle: document.getElementById('printToggle')
  };

  const landingNodeLayout = C.landing.nodeLayout;

  const landingIconByChapterId = C.landing.iconByChapterId;

  const landingNodePalette = C.landing.nodePalette;

  const landingPaletteIndexByChapterId = C.landing.paletteIndexByChapterId;

  function getLandingPaletteColorForChapterId(chapterId) {
    const paletteIndex = landingPaletteIndexByChapterId[chapterId];
    if (Number.isInteger(paletteIndex)) {
      return landingNodePalette[paletteIndex % landingNodePalette.length];
    }
    return C.landing.defaultPaletteColor;
  }

  function getLandingNavItems() {
    const chapters = state.content?.chapters || [];
    const chapterById = new Map(chapters.map((chapter, sourceIndex) => [chapter.id, { chapter, sourceIndex }]));

    return C.landing.navItems.map((item, orderIndex) => {
      const entry = chapterById.get(item.chapterId);
      if (!entry) return null;
      return {
        ...item,
        orderIndex,
        chapter: entry.chapter,
        sourceIndex: entry.sourceIndex
      };
    }).filter(Boolean);
  }

  function formatLandingBubbleLabelHtml(chapterId, fallbackLabel) {
    const lineMap = C.landing.bubbleLineBreaks;
    const lines = lineMap[chapterId];
    if (!Array.isArray(lines) || !lines.length) {
      return escapeHtml(String(fallbackLabel || ''));
    }
    return lines.map((line) => escapeHtml(line)).join('<br>');
  }

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    try {
      hydrateStaticDom();
      state.content = await loadPresentationContent();
      applyPresentationOverrides();
      applyBrandFromContent();
      renderShell();
      bindEvents();
      showLanding({ animate: false });
    } catch (error) {
      renderError(error);
    }
  }

  function hydrateStaticDom() {
    // Page title (will be overridden by brand once content loads)
    document.title = C.page.documentTitle;

    // Header
    if (el.brandLogo) el.brandLogo.alt = C.header.logoAlt;
    const kickerEl = document.getElementById('brandKicker');
    if (kickerEl) kickerEl.textContent = C.header.brandKicker;
    if (el.presentationTitle) el.presentationTitle.textContent = C.header.brandTitle;

    // Header control buttons
    if (el.textEditToggle) el.textEditToggle.textContent = C.header.controls.textEdit;
    if (el.exportJsonBtn) el.exportJsonBtn.textContent = C.header.controls.exportJson;
    if (el.presenterToggle) el.presenterToggle.textContent = C.header.controls.presenter;
    if (el.printToggle) el.printToggle.textContent = C.header.controls.printLayout;

    // Landing screen
    const landingTitle = document.getElementById('landingTitle');
    const landingSubtitle = document.getElementById('landingSubtitle');
    const landingLogo = document.getElementById('landingBrandLogo');
    if (landingTitle) landingTitle.textContent = C.landing.title;
    if (landingSubtitle) landingSubtitle.textContent = C.landing.subtitle;
    if (landingLogo) landingLogo.alt = C.landing.logoAlt;

    // Floating map button
    if (el.floatingMapBtn) el.floatingMapBtn.setAttribute('aria-label', C.landing.floatingMapBtnAriaLabel);

    // Footer nav buttons
    if (el.prevBtn) el.prevBtn.textContent = C.footer.prevButton;
    if (el.mapHomeBtn) el.mapHomeBtn.textContent = C.footer.mapButton;
    if (el.nextBtn) el.nextBtn.textContent = C.footer.nextButton;

    // Noscript message
    const noScriptEl = document.querySelector('.no-script');
    if (noScriptEl) noScriptEl.textContent = C.page.noScriptMessage;
  }

  async function loadPresentationContent() {
    const data = C.presentationData;
    if (!data || !data.chapters) {
      throw new Error(C.errors.contentNotFound);
    }
    return JSON.parse(JSON.stringify(data));
  }

  function applyBrandFromContent() {
    const meta = state.content?.meta || {};
    const brand = meta.brand || {};
    const colors = brand.colors || {};
    const root = document.documentElement;

    // Brand colors sampled from the Providence Parks Strategic Plan PDF cover.
    if (colors.forest) root.style.setProperty('--color-forest', colors.forest);
    if (colors.leaf) root.style.setProperty('--color-leaf', colors.leaf);
    if (colors.teal) root.style.setProperty('--color-teal', colors.teal);
    if (colors.earth) root.style.setProperty('--color-earth', colors.earth);
    if (colors.mist) root.style.setProperty('--color-mist', colors.mist);
    if (colors.ink) root.style.setProperty('--color-ink', colors.ink);
    if (colors.mutedText) root.style.setProperty('--color-muted', colors.mutedText);
    if (brand.fontFamily) root.style.setProperty('--app-font', brand.fontFamily);

    if (meta.title) {
      document.title = meta.title;
      if (el.presentationTitle) {
        el.presentationTitle.textContent = meta.title;
      }
    }

    if (meta.logoPath) {
      if (el.brandLogo) {
        el.brandLogo.src = cacheBustUrl(meta.logoPath);
        el.brandLogo.hidden = false;
      }
      if (el.landingBrandLogo) {
        const landingLogoPath = meta.landingLogoPath || C.landing.landingLogoPath;
        el.landingBrandLogo.src = cacheBustUrl(landingLogoPath);
        el.landingBrandLogo.hidden = false;
      }
      if (el.floatingMapLogo) {
        const floatingLogoPath = meta.floatingLogoPath || C.landing.floatingLogoPath;
        el.floatingMapLogo.src = cacheBustUrl(floatingLogoPath);
        el.floatingMapLogo.hidden = false;
      }
    }
  }

  function applyPresentationOverrides() {
    const chapters = state.content?.chapters;
    if (!Array.isArray(chapters) || chapters.length < 2) return;

    const titleChapter = chapters.find((chapter) => chapter?.id === 'title');
    const strategicChapter = chapters.find((chapter) => chapter?.id === 'strategic-plan-overview');
    if (!titleChapter || !strategicChapter) return;

    const titleText = [];
    if (typeof titleChapter.headline === 'string' && titleChapter.headline.trim()) {
      titleText.push(titleChapter.headline.trim());
    }
    if (Array.isArray(titleChapter.bullets)) {
      titleChapter.bullets.forEach((bullet) => {
        if (typeof bullet === 'string' && bullet.trim()) {
          titleText.push(bullet.trim());
        }
      });
    }
    if (!titleText.length) return;

    const strategicBullets = Array.isArray(strategicChapter.bullets) ? strategicChapter.bullets : [];
    const mergedBullets = [...titleText, ...strategicBullets];
    strategicChapter.bullets = Array.from(new Set(mergedBullets));

    // Strategic Plan Overview: three priority cards from the 2025 Annual Report (p4).
    strategicChapter.layoutMode = 'priority-cards';
    strategicChapter.priorities = C.overrides.priorities;

    // Capital Improvements Overview: update with 2025 Annual Report p24 summary.
    const capitalChapter = chapters.find((chapter) => chapter?.id === 'capital-improvements-overview');
    if (capitalChapter) {
   
      capitalChapter.projectList = C.overrides.capitalProjects;
      capitalChapter.visual = JSON.parse(JSON.stringify(C.overrides.capitalVisual));
    }

    // Historic Buildings: add images to zone data for the modal.
    const historicChapter = chapters.find((ch) => ch?.id === 'historic-buildings');
    if (historicChapter && Array.isArray(historicChapter.map?.zones)) {
      const buildingImages = C.overrides.buildingImages;

      // Try local path first; fall back to remote URL.
      function resolveBuildingImage(entry) {
        if (!entry) return '';
        if (typeof entry === 'string') return entry;
        // Test if local file exists by creating a test image
        return entry.local || entry.remote || '';
      }

      historicChapter.map.zones.forEach((zone) => {
        const entry = buildingImages[zone.id];
        if (entry) {
          if (entry.remote && entry.local) {
            // Prefer local; fall back to remote on error
            zone.image = entry.local;
            zone.imageFallback = entry.remote;
          } else {
            zone.image = entry.local || entry.remote || '';
          }
        }
      });
    }

    // Turf Management (Zoning System): add images to zone data for the modal.
    const turfChapter = chapters.find((ch) => ch?.id === 'zoning-system');
    if (turfChapter && Array.isArray(turfChapter.map?.zones)) {
      const turfImages = C.overrides.turfImages;

      turfChapter.map.zones.forEach((zone) => {
        const entry = turfImages[zone.id];
        if (entry) {
          if (entry.remote && entry.local) {
            zone.image = entry.local;
            zone.imageFallback = entry.remote;
          } else {
            zone.image = entry.local || entry.remote || '';
          }
        }
      });
    }

    // Inject planting images for the three planting-zone columns.
    const plantingChapter = chapters.find((chapter) => chapter?.id === 'planting-zones');
    if (plantingChapter && !plantingChapter.plantingImages) {
      plantingChapter.plantingImages = C.overrides.plantingImages;
    }

    // Rename final chapter for the new collaboration framing.
    const nextStepsChapter = chapters.find((chapter) => chapter?.id === 'next-steps');
    if (nextStepsChapter) {
      nextStepsChapter.navLabel = C.overrides.nextSteps.navLabel;
      nextStepsChapter.headline = C.overrides.nextSteps.headline;
      nextStepsChapter.layoutMode = C.overrides.nextSteps.layoutMode;
      nextStepsChapter.heroImage = C.overrides.nextSteps.heroImage;
    }

    // Insert Programming and Social Media Presence chapters before the final chapter.
    let nextStepsIndex = chapters.findIndex((chapter) => chapter?.id === 'next-steps');
    if (nextStepsIndex === -1) return;

    if (!chapters.some((chapter) => chapter?.id === 'programming')) {
      chapters.splice(nextStepsIndex, 0, JSON.parse(JSON.stringify(C.overrides.programmingChapter)));
      nextStepsIndex += 1;
    }

    if (!chapters.some((chapter) => chapter?.id === 'social-media-presence')) {
      chapters.splice(nextStepsIndex, 0, JSON.parse(JSON.stringify(C.overrides.socialMediaChapter)));
    }
  }

  function applyKeyPointsTheme(slide, chapter) {
    const themeName = chapter?.keyPointsTheme;
    const colors = state.content?.meta?.brand?.colors || {};
    const themeColor = colors[themeName] || colors.teal || '#98C8C1';
    slide.style.setProperty('--keypoints-tint', hexToRgba(themeColor, 0.26));
  }

  function renderShell() {
    renderAllSlides();
    renderLandingScreen();
    applyTextEditModeToDom();
    updateFooterStatus();
    updateNavButtons();
  }

  function renderLandingScreen() {
    if (!el.landingMap) return;
    const items = getLandingNavItems();
    el.landingMap.innerHTML = '';

    items.forEach((item, index) => {
      const { chapter, sourceIndex, chapterId, label: explicitLabel, icon: explicitIcon } = item;
      const layout = landingNodeLayout[index] || { x: 50, y: 50, labelSide: 'right' };
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'landing-map__node';
      if (Number.isInteger(sourceIndex)) {
        btn.dataset.index = String(sourceIndex);
      } else {
        btn.dataset.index = 'programming';
      }
      btn.style.setProperty('--x', `${layout.x}%`);
      btn.style.setProperty('--y', `${layout.y}%`);
      btn.style.setProperty('--node-bg', getLandingPaletteColorForChapterId(chapterId));
      const buttonLabel = explicitLabel || chapter?.navLabel || chapter?.headline || `Chapter ${index + 1}`;
      btn.setAttribute('aria-label', `Open chapter ${sourceIndex + 1}: ${buttonLabel}`);

      const icon = document.createElement('span');
      icon.className = 'landing-map__icon material-symbols-outlined';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = explicitIcon || landingIconByChapterId[chapterId] || 'place';

      const label = document.createElement('span');
      label.className = `landing-map__label${layout.labelSide === 'left' ? ' landing-map__label--left' : ''}`;
      label.innerHTML = formatLandingBubbleLabelHtml(chapterId, buttonLabel);

      btn.append(icon, label);
      btn.addEventListener('click', () => goToChapter(sourceIndex));
      el.landingMap.appendChild(btn);
    });

    syncLandingMapActiveState();
  }

  function renderChapterRail() {
    const chapters = state.content.chapters || [];
    el.chapterList.innerHTML = '';
    let topLevelNumber = 0;

    chapters.forEach((chapter, index) => {
      if (chapter.navHidden === true) {
        return;
      }
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chapter-item-btn';
      if (Number(chapter.navDepth || 0) > 0) {
        btn.classList.add('chapter-item-btn--subchapter');
      }
      btn.dataset.index = String(index);
      const isSubchapter = Number(chapter.navDepth || 0) > 0;
      if (!isSubchapter) {
        topLevelNumber += 1;
      }
      const indexMarkup = isSubchapter
        ? '<span class="chapter-item-index chapter-item-index--bullet" aria-hidden="true">•</span>'
        : `<span class="chapter-item-index">${String(topLevelNumber).padStart(2, '0')}</span>`;
      const sidebarLabel = chapter.sidebarLabel || chapter.navLabel || chapter.headline || `Chapter ${index + 1}`;
      btn.innerHTML = `
        ${indexMarkup}
        <span class="chapter-item-label">${escapeHtml(sidebarLabel)}</span>
      `;
      btn.addEventListener('click', () => goToChapter(index));
      li.appendChild(btn);
      el.chapterList.appendChild(li);

      if (Array.isArray(chapter.sidebarBullets) && chapter.sidebarBullets.length) {
        chapter.sidebarBullets.forEach((bullet) => {
          const subLi = document.createElement('li');
          subLi.className = 'chapter-list-static-row';
          subLi.innerHTML = `
            <div class="chapter-item-static chapter-item-static--subchapter" aria-hidden="true">
              <span class="chapter-item-index chapter-item-index--bullet">•</span>
              <span class="chapter-item-label">${escapeHtml(String(bullet))}</span>
            </div>
          `;
          el.chapterList.appendChild(subLi);
        });
      }
    });
  }

  function renderAllSlides() {
    const chapters = state.content.chapters || [];
    el.slideContainer.innerHTML = '';

    chapters.forEach((chapter, index) => {
      const slide = document.createElement('article');
      slide.className = 'slide';
      slide.dataset.chapterId = chapter.id || `chapter-${index + 1}`;
      slide.dataset.index = String(index);
      applyKeyPointsTheme(slide, chapter);
      slide.setAttribute('aria-label', `${chapter.navLabel || chapter.headline || 'Chapter'} (${index + 1} of ${chapters.length})`);

      const isMapChapter = chapter.visual?.type === 'map' && chapter.map;
      const isHistoricMapChapter = isMapChapter && chapter.id === 'historic-buildings';
      const isTurfManagementMapChapter = isMapChapter && chapter.id === 'zoning-system';
      const isFocusMapChapter = isHistoricMapChapter || isTurfManagementMapChapter;
      const isPlantingColumnsChapter = chapter.id === 'planting-zones';
      const isPriorityCardsChapter = chapter.layoutMode === 'priority-cards' && Array.isArray(chapter.priorities);
      const isProgramCardsChapter = chapter.layoutMode === 'program-cards' && Array.isArray(chapter.cards);
      const isHeroImageChapter = chapter.layoutMode === 'hero-image' && chapter.heroImage;
      const isSocialMediaChapter = chapter.id === 'social-media-presence' && chapter.newsletterEmbed;
      const bodyClasses = [
        'slide__body',
        (isPlantingColumnsChapter || isPriorityCardsChapter || isProgramCardsChapter || isHeroImageChapter) ? 'slide__body--planting-columns' : '',
        isMapChapter ? 'slide__body--map' : '',
        isFocusMapChapter ? 'slide__body--historic-focus' : '',
        (!isFocusMapChapter && isTurfManagementMapChapter) ? 'slide__body--map-left' : '',
        isHeroImageChapter ? 'slide__body--hero-image' : '',
        isSocialMediaChapter ? 'slide__body--social-media' : ''
      ].filter(Boolean).join(' ');
      let bodyRight;
      if (isHeroImageChapter) {
        bodyRight = `<div class="hero-image-wrap"><img src="${escapeAttr(cacheBustUrl(chapter.heroImage.src))}" alt="${escapeAttr(chapter.heroImage.alt || '')}" class="hero-image-wrap__img" /></div>`;
      } else if (isPriorityCardsChapter) {
        bodyRight = renderPriorityCardsHtml(chapter);
      } else if (isProgramCardsChapter) {
        bodyRight = renderProgramCardsHtml(chapter);
      } else if (isPlantingColumnsChapter) {
        bodyRight = renderPlantingColumnsHtml(chapter, index);
      } else if (isMapChapter) {
        bodyRight = renderMapModuleHtml(chapter);
      } else {
        bodyRight = renderVisualCardHtml(chapter, index);
      }
      const projectFootnotesHtml = chapter.projectList && Array.isArray(chapter.projectList.footnotes) && chapter.projectList.footnotes.length ? `
            <ul class="slide__project-footnotes">
              ${chapter.projectList.footnotes.map((fn) => `<li>${escapeHtml(fn)}</li>`).join('')}
            </ul>` : '';
      const projectListHtml = chapter.projectList ? `
            <div class="slide__project-list">
              <h3>${escapeHtml(chapter.projectList.title || 'Projects')}</h3>
              ${chapter.projectList.subtitle ? `<span class="slide__project-list-subtitle">${escapeHtml(chapter.projectList.subtitle)}</span>` : ''}
              <ul class="slide__bullets">
                ${(chapter.projectList.items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
              </ul>
            </div>
      ` : '';
      let bodyLeft;
      if (chapter.facebookEmbed) {
        const fbPage = chapter.facebookEmbed.pageUrl || '';
        const fbName = chapter.facebookEmbed.pageName || 'Facebook';
        const encodedUrl = encodeURIComponent(fbPage);
        bodyLeft = `
          <section class="visual-card facebook-embed-card" aria-label="Facebook feed">
            <div class="facebook-embed-header">
              <svg class="facebook-embed-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <a href="${escapeAttr(fbPage)}" target="_blank" rel="noopener noreferrer">@${escapeHtml(fbName)}</a>
            </div>
            <div class="facebook-embed-frame">
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=${encodedUrl}&tabs=timeline&width=500&height=800&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false"
                scrolling="yes"
                frameborder="0"
                allowfullscreen="true"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="Facebook feed for ${escapeAttr(fbName)}"
              ></iframe>
            </div>
          </section>
        `;
      } else {
        bodyLeft = `
          <section class="slide__bullets-panel" aria-label="Key points">
            
            
            ${projectListHtml}
            ${projectFootnotesHtml}
            ${(chapter.visual?.caption || '') ? `<p
              class="slide__chapter-caption"
              data-editable="true"
              data-edit-chapter-index="${index}"
              data-edit-path="visual.caption"
            >${escapeHtml(chapter.visual?.caption || '')}</p>` : ''}
          </section>
        `;
      }
      let newsletterHtml = '';
      if (chapter.newsletterEmbed) {
        const nlUrl = chapter.newsletterEmbed.url || '';
        const nlLabel = chapter.newsletterEmbed.label || 'Newsletter';
        newsletterHtml = `
          <section class="visual-card newsletter-embed-card" aria-label="${escapeAttr(nlLabel)}">
            <div class="newsletter-embed-header">
              <span class="material-symbols-outlined newsletter-embed-icon">newspaper</span>
              <a href="${escapeAttr(nlUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(nlLabel)}</a>
            </div>
            <div class="newsletter-embed-frame">
              <iframe
                src="${escapeAttr(nlUrl)}"
                frameborder="0"
                scrolling="yes"
                loading="lazy"
                title="${escapeAttr(nlLabel)}"
              ></iframe>
            </div>
          </section>
        `;
      }
      const bodyMarkup = (isFocusMapChapter || isPlantingColumnsChapter || isPriorityCardsChapter || isProgramCardsChapter || isHeroImageChapter) ? `${bodyRight}` : `${bodyLeft}${newsletterHtml}${bodyRight}`;
      const chapterIcon = landingIconByChapterId[chapter.id] || 'article';
      const chapterName = chapter.navLabel || chapter.id || chapter.headline || 'Presentation';
      const chapterHeaderIconColor = getLandingPaletteColorForChapterId(chapter.id);
      slide.innerHTML = `
        <div class="slide__header">
          <div class="slide__chapter-row">
            <span class="slide__chapter-row-icon material-symbols-outlined" aria-hidden="true" style="--chapter-icon-color:${escapeAttr(chapterHeaderIconColor)};">${escapeHtml(chapterIcon)}</span>
            <span class="slide__chapter-row-name">${escapeHtml(chapterName)}</span>
          </div>
        </div>
        <div class="${bodyClasses}">
          ${bodyMarkup}
        </div>
      `;

      el.slideContainer.appendChild(slide);

      if (isMapChapter) {
        hydrateMapModule(slide, chapter);
      }
    });
  }

  function renderVisualCardHtml(chapter, chapterIndex) {
    const visual = chapter.visual || {};
    const caption = escapeHtml(visual.caption || '');

    if (visual.type === 'project-list') {
      return renderProjectListVisualHtml(visual);
    }

    if (visual.type === 'instagram-embed' && visual.handle) {
      return `
        <section class="visual-card instagram-embed-card" aria-label="Instagram feed">
          <div class="instagram-embed-header">
            <svg class="instagram-embed-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            <a href="https://www.instagram.com/${escapeAttr(visual.handle)}/" target="_blank" rel="noopener noreferrer">@${escapeHtml(visual.handle)}</a>
          </div>
          <div class="instagram-embed-frame">
            <iframe
              src="https://www.instagram.com/${escapeAttr(visual.handle)}/embed/?cr=1&v=14&wp=540"
              frameborder="0"
              scrolling="yes"
              allowtransparency="true"
              loading="lazy"
              style="overflow-y: scroll;"
              title="Instagram feed for @${escapeAttr(visual.handle)}"
            ></iframe>
          </div>
        </section>
      `;
    }

    if (visual.type === 'image' && visual.src) {
      const fitMode = visual.fit === 'contain' ? 'contain' : 'cover';
      return `
        <section class="visual-card" aria-label="Chapter visual">
          <div class="visual-frame">
            <img src="${escapeAttr(cacheBustUrl(visual.src))}" alt="${escapeAttr(visual.alt || visual.label || 'Chapter visual')}" style="object-fit:${fitMode};" />
          </div>
          <p
            class="visual-caption"
            data-editable="true"
            data-edit-chapter-index="${chapterIndex}"
            data-edit-path="visual.caption"
          >${caption}</p>
        </section>
      `;
    }

    return `
      <section class="visual-card" aria-label="Visual placeholder">
        <div class="visual-frame visual-frame--placeholder">
          <div class="visual-placeholder-content">
            <h4>${escapeHtml(visual.label || C.ui.visualPlaceholderTitle)}</h4>
            <p>${caption || C.ui.visualPlaceholderDefault}</p>
          </div>
        </div>
        <p
          class="visual-caption"
          data-editable="true"
          data-edit-chapter-index="${chapterIndex}"
          data-edit-path="visual.caption"
        >${caption}</p>
      </section>
    `;
  }

  function renderProjectListVisualHtml(visual) {
    const sections = visual.sections || [];
    const img = visual.image || null;
    let html = '<section class="visual-card project-list-card" aria-label="Project lists">';
    html += '<div class="project-list-wrap">';
    sections.forEach((sec) => {
      html += '<div class="project-list-section">';
      html += `<h4 class="project-list-section__title">${escapeHtml(sec.title)}</h4>`;
      if (sec.subtitle) {
        html += `<span class="project-list-section__subtitle">${escapeHtml(sec.subtitle)}</span>`;
      }
      html += '<ul class="project-list-section__items">';
      (sec.items || []).forEach((item) => {
        html += `<li>${escapeHtml(item)}</li>`;
      });
      html += '</ul></div>';
    });
    html += '</div>';
    if (img && img.src) {
      html += `<div class="project-list-image"><img src="${escapeAttr(cacheBustUrl(img.src))}" alt="${escapeAttr(img.alt || '')}" /></div>`;
    }
    html += '</section>';
    return html;
  }

  function renderPlantingColumnsHtml(chapter, chapterIndex) {
    const labels = (chapter.bullets || []).slice(0, 3);
    const images = chapter.plantingImages || [];
    const allChapters = state.content?.chapters || [];
    const nativeChapter = allChapters.find((ch) => ch.id === 'native-and-naturalized');
    const ornamentalsChapter = allChapters.find((ch) => ch.id === 'ornamentals');
    const stormwaterChapter = allChapters.find((ch) => ch.id === 'stormwater-management-areas');
    const columnBullets = [
      nativeChapter?.bullets || [],
      ornamentalsChapter?.bullets || [],
      stormwaterChapter?.bullets || []
    ];
    return `
      <section class="planting-columns" aria-label="Planting categories">
        ${labels.map((label, bulletIndex) => {
          const bullets = columnBullets[bulletIndex] || [];
          const extraNotes = bullets.length
            ? `
              <ul class="planting-column-card__notes">
                ${bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}
              </ul>
            `
            : '';
          const imgData = images[bulletIndex];
          const imageHtml = imgData && imgData.src
            ? `<div class="planting-column-card__image visual-frame" aria-label="${escapeAttr(label)} photo">
                <img src="${escapeAttr(imgData.src)}" alt="${escapeAttr(imgData.alt || label)}" class="planting-column-card__img" />
               </div>`
            : `<div class="planting-column-card__image visual-frame visual-frame--placeholder" aria-label="${escapeAttr(label)} image placeholder">
                <div class="visual-placeholder-content">
                  <h4>${escapeHtml(C.ui.imagePlaceholderTitle)}</h4>
                  <p>${escapeHtml(C.ui.imagePlaceholderText)}</p>
                </div>
               </div>`;
          return `
          <article class="planting-column-card">
            ${imageHtml}
            <p
              class="planting-column-card__label"
              data-editable="true"
              data-edit-chapter-index="${chapterIndex}"
              data-edit-path="bullets.${bulletIndex}"
            >${escapeHtml(label)}</p>
            ${extraNotes}
          </article>
        `;
        }).join('')}
      </section>
    `;
  }

  function renderPriorityCardsHtml(chapter) {
    const priorities = chapter.priorities || [];
    return `
      <section class="priority-cards" aria-label="Strategic priorities">
        ${priorities.map((priority, idx) => {
          const cardColor = priority.color || '#485330';
          return `
          <article class="priority-card" style="--priority-accent:${escapeAttr(cardColor)};">
            <div class="priority-card__header">
              <span class="priority-card__number">Priority ${idx + 1}</span>
              <h4 class="priority-card__title">${escapeHtml(priority.title)}</h4>
            </div>
            <p class="priority-card__intro">${escapeHtml(priority.intro)}</p>
            <ul class="priority-card__items">
              ${(priority.items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
            </ul>
          </article>
        `;
        }).join('')}
      </section>
    `;
  }



function renderProgramCardsHtml(chapter) {
  const cards = chapter.cards || [];
  return `
    <div class="program-cards">
      ${cards.map(card => `
        <article class="program-card">
          ${card.image ? `<div class="program-card__image"><img src="${escapeAttr(cacheBustUrl(card.image))}" alt="${escapeAttr(card.title)}" /></div>` : ''}
          <div class="program-card__label">
            <h4 class="program-card__title">${escapeHtml(card.title)}</h4>
          </div>
        </article>
      `).join('')}
    </div>`;
}


  function renderMapModuleHtml(chapter) {
    const map = chapter.map || {};
    const layers = map.layers || [];
    const panelCopy = getMapPanelCopy(chapter);
    const ariaLabel = map.ariaLabel || 'Interactive map';
    const isHistoricBuildings = chapter.id === 'historic-buildings';
    const isTurfManagement = chapter.id === 'zoning-system';
    const isFocusMap = chapter.id === 'historic-buildings' || chapter.id === 'zoning-system';
    const showPlacementTools = !isHistoricBuildings && chapter.id === 'historic-buildings' && map.enablePlacementMode === true;
    const showLayerToggles = !isTurfManagement && !isHistoricBuildings;
    const pointZones = (map.zones || []).filter((z) => z.shape === 'point');
    const showEmptyInstructionList = Boolean(panelCopy.emptyHowTo || panelCopy.emptyEditing);
    const showEmptyPanelHeading = Boolean(panelCopy.eyebrow || panelCopy.emptyTitle);
    const collapseEmptyPanel = isFocusMap && !showEmptyPanelHeading && !showEmptyInstructionList;

    /* ── Historic Buildings: Leaflet interactive map ── */
    if (isHistoricBuildings) {
      return `
        <section class="map-card map-card--gmap" aria-label="${escapeAttr(ariaLabel)}">
          <div class="map-toolbar" role="group" aria-label="Map view controls">
            <div class="gmap-view-toggle" data-gmap-view-toggle>
              <button type="button" class="gmap-view-btn is-active" data-gmap-view="streets" aria-pressed="true">${escapeHtml(C.maps.viewToggleLabels.streets)}</button>
              <button type="button" class="gmap-view-btn" data-gmap-view="satellite" aria-pressed="false">${escapeHtml(C.maps.viewToggleLabels.satellite)}</button>
            </div>
            <span class="map-toolbar-spacer" aria-hidden="true"></span>
          </div>

          <div class="gmap-container" data-gmap-container>
            <div id="leaflet-historic-map" data-leaflet-map style="width:100%;height:100%;"></div>
          </div>

          <!-- Detail page overlay (hidden by default) -->
          <div class="building-detail-page is-hidden" data-building-detail-page>
            <div class="building-detail-page__header">
              <button type="button" class="building-detail-page__back" data-building-back aria-label="${escapeAttr(C.ui.backToMap)}">
                <span class="material-symbols-outlined">arrow_back</span>
                <span>${escapeHtml(C.ui.backToMap)}</span>
              </button>
            </div>
            <div class="building-detail-page__content" data-building-detail-content></div>
          </div>
        </section>
      `;
    }

    /* ── Turf Management: Leaflet interactive map (no pins) ── */
    if (isTurfManagement) {
      return `
        <section class="map-card map-card--gmap" aria-label="${escapeAttr(ariaLabel)}">
          <div class="map-toolbar" role="group" aria-label="Map view controls">
            <div class="gmap-view-toggle" data-gmap-view-toggle>
              <button type="button" class="gmap-view-btn is-active" data-gmap-view="streets" aria-pressed="true">${escapeHtml(C.maps.viewToggleLabels.streets)}</button>
              <button type="button" class="gmap-view-btn" data-gmap-view="satellite" aria-pressed="false">${escapeHtml(C.maps.viewToggleLabels.satellite)}</button>
            </div>
            <span class="map-toolbar-spacer" aria-hidden="true"></span>
          </div>

          <div class="gmap-container" data-gmap-container>
            <div id="leaflet-turf-map" data-leaflet-map style="width:100%;height:100%;"></div>
          </div>
        </section>
      `;
    }

    return `
      <section class="map-card" aria-label="${escapeAttr(ariaLabel)}">
        <div class="map-toolbar" role="group" aria-label="Map layers">
          ${showLayerToggles ? layers.map((layer) => `
            <button type="button" class="layer-toggle ${layer.active === false ? '' : 'is-active'}" data-layer-id="${escapeAttr(layer.id)}" aria-pressed="${layer.active === false ? 'false' : 'true'}">
              <span class="layer-toggle__swatch" style="background:${escapeAttr(layer.color || '#999')}"></span>
              <span>${escapeHtml(layer.label || layer.id)}</span>
            </button>
          `).join('') : ''}
          ${showPlacementTools ? `
            <div class="placement-tools" data-placement-tools>
              <button type="button" class="placement-toggle" data-placement-toggle aria-pressed="false">${escapeHtml(C.ui.placementModeLabel)}</button>
              <label class="placement-target-label">
                <span>Target</span>
                <select class="placement-target" data-placement-target>
                  ${pointZones.map((zone) => `<option value="${escapeAttr(zone.id)}">${escapeHtml(zone.name || zone.id)}</option>`).join('')}
                </select>
              </label>
              <button type="button" class="placement-copy" data-placement-copy>${escapeHtml(C.ui.copyXyLabel)}</button>
              <span class="placement-readout" data-placement-readout>XY: --, --</span>
            </div>
          ` : ''}
          <span class="map-toolbar-spacer" aria-hidden="true"></span>
          <button type="button" class="map-reset-btn" data-map-reset>${escapeHtml(C.ui.resetViewLabel)}</button>
        </div>

        <div class="map-layout">
          <div class="map-stage" aria-label="Zoning map canvas">
            <div class="map-stage__viewport" data-map-viewport>
              <div class="map-stage__base ${map.baseImage ? 'has-image' : ''}">
                ${map.baseImage ? `<img src="${escapeAttr(cacheBustUrl(map.baseImage))}" alt="Aerial base map placeholder" />` : ''}
              </div>
              <div class="map-stage__overlay" data-map-overlay></div>
            </div>
          </div>

          <aside class="map-detail-panel is-empty ${collapseEmptyPanel ? 'is-collapsed map-detail-panel--focus' : ''}" data-detail-panel aria-label="${escapeAttr(panelCopy.ariaLabel)}">
            ${panelCopy.eyebrow ? `<p class="map-detail-panel__eyebrow">${escapeHtml(panelCopy.eyebrow)}</p>` : ''}
            ${panelCopy.emptyTitle ? `<h3 class="map-detail-panel__title">${escapeHtml(panelCopy.emptyTitle)}</h3>` : ''}
            ${showEmptyInstructionList ? `
              <ul class="detail-list">
                ${panelCopy.emptyHowTo ? `
                  <li>
                    <span class="detail-label">How to use</span>
                    <span class="detail-value">${escapeHtml(panelCopy.emptyHowTo)}</span>
                  </li>
                ` : ''}
                ${panelCopy.emptyEditing ? `
                  <li>
                    <span class="detail-label">Editing</span>
                    <span class="detail-value">${escapeHtml(panelCopy.emptyEditing)}</span>
                  </li>
                ` : ''}
              </ul>
            ` : ''}
          </aside>
        </div>

        <p class="map-help">${escapeHtml(map.helpText || C.ui.mapHelpFallback)}</p>
      </section>
    `;
  }

  function getStreetTileConfig() {
    const style = C.maps.streetStyle || 'openstreetmap';
    return C.maps.streetProviders[style] || C.maps.streetProviders['openstreetmap'];
  }

  function hydrateGoogleMap(slide, chapter) {
    const mapData = chapter.map || {};
    const mapEl = slide.querySelector('[data-leaflet-map]');
    const viewBtns = slide.querySelectorAll('[data-gmap-view]');
    const detailPage = slide.querySelector('[data-building-detail-page]');
    const detailContent = slide.querySelector('[data-building-detail-content]');
    const backBtn = slide.querySelector('[data-building-back]');
    const mapContainer = slide.querySelector('[data-gmap-container]');
    const toolbar = slide.querySelector('.map-toolbar');
    if (!mapEl || typeof L === 'undefined') return;

    /* ── Tile layers ── */
    const streetTile = getStreetTileConfig();
    const streetLayer = L.tileLayer(streetTile.url, {
      attribution: streetTile.attribution,
      maxZoom: streetTile.maxZoom
    });
    const satelliteLayer = L.tileLayer(C.maps.satellite.url, {
      attribution: C.maps.satellite.attribution,
      maxZoom: C.maps.satellite.maxZoom
    });

    /* ── Initialize map ── */
    const leafletMap = L.map(mapEl, {
      center: C.maps.historicCenter,
      zoom: C.maps.historicZoom,
      layers: [streetLayer],
      zoomControl: true,
      scrollWheelZoom: true
    });

    /* ── View toggle ── */
    let currentLayer = 'streets';
    viewBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.gmapView;
        if (view === currentLayer) return;
        viewBtns.forEach((b) => {
          const active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });
        if (view === 'satellite') {
          leafletMap.removeLayer(streetLayer);
          leafletMap.addLayer(satelliteLayer);
        } else {
          leafletMap.removeLayer(satelliteLayer);
          leafletMap.addLayer(streetLayer);
        }
        currentLayer = view;
      });
    });

    /* ── Custom marker icon ── */
    const buildingIcon = L.divIcon({
      className: 'leaflet-building-marker',
      html: C.maps.historicMarkerHtml,
      iconSize: C.maps.historicMarkerSize,
      iconAnchor: C.maps.historicMarkerAnchor,
      popupAnchor: C.maps.historicPopupAnchor
    });

    /* ── Add markers ── */
    const zones = (mapData.zones || []).filter((z) => z.shape === 'point' && z.latLng);
    zones.forEach((zone) => {
      const marker = L.marker(zone.latLng, { icon: buildingIcon, title: zone.name })
        .addTo(leafletMap);

      /* Tooltip on hover */
      marker.bindTooltip(escapeHtml(zone.name), {
        direction: 'top',
        offset: [0, -30],
        className: 'leaflet-building-tooltip'
      });

      /* Click → open modal */
      marker.on('click', () => {
        openBuildingModal(zone);
      });
    });

    /* ── Detail page logic ── */
    function openBuildingDetail(zone) {
      if (!detailPage || !detailContent) return;
      const d = zone.details || {};
      const description = d['Description'] || '';
      const yearBuilt = d['Year Built'] || '';
      const archStyle = d['Architectural Style'] || '';
      const improvement = d['Type of Improvement'] || '';
      const notes = d['Implementation Notes'] || '';

      detailContent.innerHTML = `
        <div class="building-detail-card">
          <h2 class="building-detail-card__title">${escapeHtml(zone.name || zone.id)}</h2>
          ${description ? `<p class="building-detail-card__description">${escapeHtml(description)}</p>` : ''}
          <div class="building-detail-card__meta">
            ${yearBuilt ? `
              <div class="building-detail-card__meta-item">
                <span class="material-symbols-outlined">calendar_month</span>
                <div>
                  <span class="detail-label">${escapeHtml(C.ui.yearBuiltLabel)}</span>
                  <span class="detail-value">${escapeHtml(yearBuilt)}</span>
                </div>
              </div>
            ` : ''}
            ${archStyle ? `
              <div class="building-detail-card__meta-item">
                <span class="material-symbols-outlined">apartment</span>
                <div>
                  <span class="detail-label">${escapeHtml(C.ui.archStyleLabel)}</span>
                  <span class="detail-value">${escapeHtml(archStyle)}</span>
                </div>
              </div>
            ` : ''}
          </div>
          <div class="building-detail-card__section">
            <h3>
              <span class="material-symbols-outlined">construction</span>
              ${escapeHtml(C.ui.proposedImprovements)}
            </h3>
            ${improvement ? `<p>${escapeHtml(improvement)}</p>` : `<p>${escapeHtml(C.ui.noImprovementsListed)}</p>`}
          </div>
          <div class="building-detail-card__section">
            <h3>
              <span class="material-symbols-outlined">sticky_note_2</span>
              ${escapeHtml(C.ui.implementationNotes)}
            </h3>
            ${notes ? `<p>${escapeHtml(notes)}</p>` : `<p>${escapeHtml(C.ui.noNotesAvailable)}</p>`}
          </div>
        </div>
      `;

      mapContainer.classList.add('is-hidden');
      toolbar.classList.add('is-hidden');
      detailPage.classList.remove('is-hidden');
    }

    function closeBuildingDetail() {
      if (!detailPage) return;
      detailPage.classList.add('is-hidden');
      mapContainer.classList.remove('is-hidden');
      toolbar.classList.remove('is-hidden');
      /* Leaflet needs a resize nudge after being hidden */
      window.setTimeout(() => leafletMap.invalidateSize(), 50);
    }

    backBtn?.addEventListener('click', closeBuildingDetail);

    /* Fix map size after slide becomes visible */
    const observer = new MutationObserver(() => {
      if (slide.classList.contains('is-visible') && mapEl.offsetHeight > 0) {
        leafletMap.invalidateSize();
      }
    });
    observer.observe(slide, { attributes: true, attributeFilter: ['class'] });
    window.setTimeout(() => leafletMap.invalidateSize(), 300);
    window.setTimeout(() => leafletMap.invalidateSize(), 600);
  }

  function hydrateTurfMap(slide, chapter) {
    const mapData = chapter.map || {};
    const mapEl = slide.querySelector('[data-leaflet-map]');
    const viewBtns = slide.querySelectorAll('[data-gmap-view]');
    if (!mapEl || typeof L === 'undefined') return;

    /* ── Tile layers ── */
    const streetTile = getStreetTileConfig();
    const streetLayer = L.tileLayer(streetTile.url, {
      attribution: streetTile.attribution,
      maxZoom: streetTile.maxZoom
    });
    const satelliteLayer = L.tileLayer(C.maps.satellite.url, {
      attribution: C.maps.satellite.attribution,
      maxZoom: C.maps.satellite.maxZoom
    });

    /* ── Initialize map ── */
    const leafletMap = L.map(mapEl, {
      center: C.maps.turfCenter,
      zoom: C.maps.turfZoom,
      layers: [streetLayer],
      zoomControl: true,
      scrollWheelZoom: true
    });

    /* ── View toggle ── */
    let currentLayer = 'streets';
    viewBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.gmapView;
        if (view === currentLayer) return;
        viewBtns.forEach((b) => {
          const active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });
        if (view === 'satellite') {
          leafletMap.removeLayer(streetLayer);
          leafletMap.addLayer(satelliteLayer);
        } else {
          leafletMap.removeLayer(satelliteLayer);
          leafletMap.addLayer(streetLayer);
        }
        currentLayer = view;
      });
    });

    /* ── Layer color lookup ── */
    const layerColors = {};
    (mapData.layers || []).forEach((l) => { layerColors[l.id] = l.color || '#62AA63'; });

    /* ── Add turf zone markers ── */
    const zones = (mapData.zones || []).filter((z) => z.shape === 'point' && z.latLng);
    zones.forEach((zone) => {
      const color = layerColors[zone.layer] || '#62AA63';
      const turfIcon = L.divIcon({
        className: 'leaflet-turf-marker',
        html: C.maps.turfMarkerHtml,
        iconSize: C.maps.turfMarkerSize,
        iconAnchor: C.maps.turfMarkerAnchor,
        popupAnchor: C.maps.turfPopupAnchor
      });

      const marker = L.marker(zone.latLng, { icon: turfIcon, title: zone.name })
        .addTo(leafletMap);

      /* Tooltip on hover */
      marker.bindTooltip(escapeHtml(zone.name), {
        direction: 'top',
        offset: [0, -26],
        className: 'leaflet-turf-tooltip'
      });

      /* Open turf modal on click */
      marker.on('click', () => {
        openTurfModal(zone);
      });
    });

    /* Fix map size after slide becomes visible */
    const observer = new MutationObserver(() => {
      if (slide.classList.contains('is-visible') && mapEl.offsetHeight > 0) {
        leafletMap.invalidateSize();
      }
    });
    observer.observe(slide, { attributes: true, attributeFilter: ['class'] });
    window.setTimeout(() => leafletMap.invalidateSize(), 300);
    window.setTimeout(() => leafletMap.invalidateSize(), 600);
  }

  function hydrateMapModule(slide, chapter) {
    /* ── Historic Buildings: Leaflet hydration ── */
    if (chapter.id === 'historic-buildings') {
      hydrateGoogleMap(slide, chapter);
      return;
    }
    /* ── Turf Management: Leaflet hydration (no pins) ── */
    if (chapter.id === 'zoning-system') {
      hydrateTurfMap(slide, chapter);
      return;
    }

    const map = chapter.map || {};
    const overlay = slide.querySelector('[data-map-overlay]');
    const viewport = slide.querySelector('[data-map-viewport]');
    const panel = slide.querySelector('[data-detail-panel]');
    const layerButtons = slide.querySelectorAll('.layer-toggle');
    const resetBtn = slide.querySelector('[data-map-reset]');
    const zoomInBtn = slide.querySelector('[data-map-zoom-in]');
    const zoomOutBtn = slide.querySelector('[data-map-zoom-out]');
    const stage = slide.querySelector('.map-stage');
    const placementToggle = slide.querySelector('[data-placement-toggle]');
    const placementTarget = slide.querySelector('[data-placement-target]');
    const placementCopy = slide.querySelector('[data-placement-copy]');
    const placementReadout = slide.querySelector('[data-placement-readout]');
    if (!overlay || !panel || !viewport) return;
    const placementState = {
      enabled: false,
      targetId: placementTarget?.value || ''
    };
    const panState = {
      active: false,
      pointerId: null,
      startClientX: 0,
      startClientY: 0,
      startCenter: [50, 50]
    };

    const layersById = new Map((map.layers || []).map((layer) => [layer.id, { ...layer, visible: layer.active !== false }]));

    (map.zones || []).forEach((zone) => {
      const layer = layersById.get(zone.layer);
      const color = layer?.color || '#888888';
      const zoneEl = document.createElement('button');
      zoneEl.type = 'button';
      zoneEl.className = `zone-shape ${zone.shape === 'point' ? 'zone-point' : 'zone-polygon'}`;
      zoneEl.dataset.zoneId = zone.id;
      zoneEl.dataset.layerId = zone.layer;
      zoneEl.setAttribute('aria-label', `${zone.name || zone.id} (${zone.layer})`);
      zoneEl.style.setProperty('--zone-fill', hexToRgba(color, zone.shape === 'point' ? 0.96 : 0.34));
      zoneEl.style.setProperty('--zone-stroke', color);

      positionZoneElement(zoneEl, zone);

      zoneEl.addEventListener('click', (event) => {
        if (placementState.enabled) {
          event.preventDefault();
          event.stopPropagation();
          if (placementTarget) placementTarget.value = zone.id;
          placementState.targetId = zone.id;
          updatePlacementReadout(chapter, placementState.targetId, placementReadout);
          return;
        }
        selectZone(chapter.id, zone.id, slide, chapter);
      });
      overlay.appendChild(zoneEl);
    });

    layerButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const layerId = btn.dataset.layerId;
        if (!layerId || !layersById.has(layerId)) return;
        const layer = layersById.get(layerId);
        layer.visible = !layer.visible;
        layersById.set(layerId, layer);
        btn.classList.toggle('is-active', layer.visible);
        btn.setAttribute('aria-pressed', String(layer.visible));
        refreshZoneVisibility(slide, layersById, chapter);
      });
    });

    resetBtn?.addEventListener('click', () => {
      delete slide.__mapView;
      clearZoneSelection(chapter.id, slide);
    });
    zoomInBtn?.addEventListener('click', () => stepMapZoom(slide, 1.18));
    zoomOutBtn?.addEventListener('click', () => stepMapZoom(slide, 1 / 1.18));

    if (placementToggle && stage) {
      placementToggle.addEventListener('click', () => {
        placementState.enabled = !placementState.enabled;
        placementToggle.classList.toggle('is-active', placementState.enabled);
        placementToggle.setAttribute('aria-pressed', String(placementState.enabled));
        stage.classList.toggle('is-placement-mode', placementState.enabled);
        if (placementState.enabled) {
          applyMapViewportTransform(slide, null);
        }
      });
    }

    placementTarget?.addEventListener('change', () => {
      placementState.targetId = placementTarget.value;
      updatePlacementReadout(chapter, placementState.targetId, placementReadout);
    });

    placementCopy?.addEventListener('click', async () => {
      const targetZone = (chapter.map?.zones || []).find((z) => z.id === placementState.targetId);
      if (!targetZone || !Array.isArray(targetZone.point)) return;
      const text = `${targetZone.name}: ${targetZone.point[0]}, ${targetZone.point[1]}`;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          placementCopy.textContent = C.ui.copiedLabel;
          window.setTimeout(() => { placementCopy.textContent = C.ui.copyXyLabel; }, 900);
        }
      } catch (_) {
        placementCopy.textContent = C.ui.copyFailedLabel;
        window.setTimeout(() => { placementCopy.textContent = C.ui.copyXyLabel; }, 1000);
      }
    });

    stage?.addEventListener('click', (event) => {
      if (!placementState.enabled) return;
      if (event.target.closest('.zone-shape')) return;
      const targetId = placementState.targetId;
      const targetZone = (chapter.map?.zones || []).find((z) => z.id === targetId && z.shape === 'point');
      if (!targetZone) return;
      const point = getMapPercentFromClick(event, slide);
      if (!point) return;
      targetZone.point = [round2(point[0]), round2(point[1])];
      targetZone.zoom = targetZone.zoom || {};
      targetZone.zoom.center = [targetZone.point[0], targetZone.point[1]];
      const targetEl = slide.querySelector(`.zone-shape[data-zone-id="${cssEscape(targetId)}"]`);
      if (targetEl) positionZoneElement(targetEl, targetZone);
      updatePlacementReadout(chapter, targetId, placementReadout);
      selectZone(chapter.id, targetId, slide, chapter);
      applyMapViewportTransform(slide, null);
    });

    if ((chapter.id === 'historic-buildings' || chapter.id === 'zoning-system') && stage) {
      stage.classList.add('is-draggable');
      stage.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) return;
        if (event.target.closest('.zone-shape')) return;
        panState.active = true;
        panState.pointerId = event.pointerId;
        panState.startClientX = event.clientX;
        panState.startClientY = event.clientY;
        const currentView = slide.__mapView || { scale: 1, center: [50, 50] };
        panState.startCenter = Array.isArray(currentView.center) ? [...currentView.center] : [50, 50];
        stage.classList.add('is-panning');
        stage.setPointerCapture?.(event.pointerId);
      });

      stage.addEventListener('pointermove', (event) => {
        if (!panState.active || panState.pointerId !== event.pointerId) return;
        const currentView = slide.__mapView || { scale: 1, center: panState.startCenter };
        const scale = clamp(Number(currentView.scale) || 1, 1, 6);
        if (scale <= 1) return;
        const rect = stage.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const dxPct = ((event.clientX - panState.startClientX) / rect.width) * 100;
        const dyPct = ((event.clientY - panState.startClientY) / rect.height) * 100;
        const nextCenter = [
          panState.startCenter[0] - (dxPct / scale),
          panState.startCenter[1] - (dyPct / scale)
        ];
        applyMapView(slide, { scale, center: nextCenter });
      });

      const endPan = (event) => {
        if (!panState.active) return;
        if (event && panState.pointerId !== null && event.pointerId !== panState.pointerId) return;
        panState.active = false;
        panState.pointerId = null;
        stage.classList.remove('is-panning');
      };
      stage.addEventListener('pointerup', endPan);
      stage.addEventListener('pointercancel', endPan);
      stage.addEventListener('lostpointercapture', endPan);

      stage.addEventListener('wheel', (event) => {
        event.preventDefault();
        const anchorMapPct = getMapPercentFromClient(event.clientX, event.clientY, slide);
        const stageScreenPct = getStageScreenPercent(event.clientX, event.clientY, stage);
        const current = slide.__mapView || { scale: 1, center: [50, 50] };
        const factor = event.deltaY < 0 ? 1.12 : (1 / 1.12);
        const nextScale = clamp((current.scale || 1) * factor, 1, 6);

        if (!anchorMapPct || !stageScreenPct) {
          applyMapView(slide, { scale: nextScale, center: current.center || [50, 50] });
          return;
        }

        const [mapX, mapY] = anchorMapPct;
        const [screenX, screenY] = stageScreenPct;
        const nextCenter = [
          mapX - ((screenX - 50) / nextScale),
          mapY - ((screenY - 50) / nextScale)
        ];
        applyMapView(slide, { scale: nextScale, center: nextCenter });
      }, { passive: false });
    }

    if (chapter.id === 'historic-buildings' && !slide.__mapView) {
      slide.__mapView = { scale: 0.8, center: [50, 50] };
    }

    refreshZoneVisibility(slide, layersById, chapter);
    applyMapViewportTransform(slide, null);
    updatePlacementReadout(chapter, placementState.targetId, placementReadout);

    const persistedZone = state.selectedZoneByChapterId[chapter.id];
    if (persistedZone) {
      selectZone(chapter.id, persistedZone, slide, chapter, { preserveIfMissing: true });
    }
  }

  function refreshZoneVisibility(slide, layersById, chapter) {
    slide.querySelectorAll('.zone-shape').forEach((zoneEl) => {
      const layerId = zoneEl.dataset.layerId;
      const visible = layersById.get(layerId)?.visible !== false;
      zoneEl.hidden = !visible;

      // If a selected zone is hidden, clear the panel state for clarity.
      const selectedId = state.selectedZoneByChapterId[chapter.id];
      if (!visible && selectedId && zoneEl.dataset.zoneId === selectedId) {
        clearZoneSelection(chapter.id, slide);
      }
    });
  }

  function selectZone(chapterId, zoneId, slide, chapter, options = {}) {
    const zone = (chapter.map?.zones || []).find((item) => item.id === zoneId);
    if (!zone) {
      if (!options.preserveIfMissing) clearZoneSelection(chapterId, slide);
      return;
    }

    const zoneEl = slide.querySelector(`.zone-shape[data-zone-id="${cssEscape(zoneId)}"]`);
    if (!zoneEl || zoneEl.hidden) {
      if (!options.preserveIfMissing) clearZoneSelection(chapterId, slide);
      return;
    }

    state.selectedZoneByChapterId[chapterId] = zoneId;
    slide.querySelectorAll('.zone-shape').forEach((elZone) => {
      elZone.classList.toggle('is-selected', elZone.dataset.zoneId === zoneId);
    });

    // Historic buildings: open a modal instead of the side panel.
    if (chapterId === 'historic-buildings') {
      openBuildingModal(zone);
      return;
    }

    // Turf management: open a modal instead of the side panel.
    if (chapterId === 'zoning-system') {
      openTurfModal(zone);
      return;
    }

    const panel = slide.querySelector('[data-detail-panel]');
    if (!panel) return;
    if (chapterId !== 'historic-buildings' && chapterId !== 'zoning-system') {
      applyMapViewportTransform(slide, zone);
    }
    setFocusMapPanelOpenState(slide, true);

    let detailEntries = Object.entries(zone.details || {});
    panel.classList.remove('is-empty');
    panel.classList.remove('is-collapsed');
    const panelCopy = getMapPanelCopy(chapter);
    const detailMediaHtml = renderDetailMedia(chapterId, zone);
    panel.innerHTML = `
      ${panelCopy.eyebrow ? `<p class="map-detail-panel__eyebrow">${escapeHtml(panelCopy.eyebrow)}</p>` : ''}
      <h3 class="map-detail-panel__title">${escapeHtml(zone.name || 'Selected Zone')}</h3>
      ${detailMediaHtml}
      <ul class="detail-list">
        ${detailEntries.map(([label, value]) => `
          <li>
            <span class="detail-label">${escapeHtml(label)}</span>
            <span class="detail-value">${escapeHtml(String(value))}</span>
          </li>
        `).join('')}
      </ul>
    `;
  }

  /* ── Historic Buildings Modal ── */
  function openBuildingModal(zone) {
    closeBuildingModal();
    const d = zone.details || {};
    const improvement = d['Type of Improvement'] || d['Improvements'] || '';
    const imageSrc = zone.image || '';
    const fallbackSrc = zone.imageFallback || '';

    const overlay = document.createElement('div');
    overlay.className = 'building-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', zone.name || 'Building details');

    overlay.innerHTML = `
      <div class="building-modal">
        <button class="building-modal__close" aria-label="${escapeAttr(C.ui.closeModal)}">
          <span class="material-symbols-outlined">close</span>
        </button>
        <div class="building-modal__header">
          <h2 class="building-modal__name">${escapeHtml(zone.name || zone.id)}</h2>
        </div>
        ${imageSrc ? `
        <div class="building-modal__image">
          <img src="${escapeAttr(cacheBustUrl(imageSrc))}"
               ${fallbackSrc ? `onerror="this.onerror=null;this.src='${escapeAttr(fallbackSrc)}';"` : ''}
               alt="${escapeAttr(zone.name || 'Building photo')}" />
        </div>
        ` : ''}
        <div class="building-modal__body">
          <div class="building-modal__section">
            <h3 class="building-modal__section-title">
              <span class="material-symbols-outlined">construction</span>
              ${escapeHtml(C.ui.proposedImprovements)}
            </h3>
            <p class="building-modal__section-text">${improvement ? escapeHtml(improvement) : escapeHtml(C.ui.noImprovementsListed)}</p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Force reflow then add visible class for animation
    overlay.offsetHeight;
    overlay.classList.add('is-visible');

    // Close handlers
    overlay.querySelector('.building-modal__close').addEventListener('click', closeBuildingModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeBuildingModal();
    });
    document.addEventListener('keydown', handleModalEscape);
  }

  function closeBuildingModal() {
    document.removeEventListener('keydown', handleModalEscape);
    const overlay = document.querySelector('.building-modal-overlay');
    if (!overlay) return;
    overlay.classList.remove('is-visible');
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
    // Fallback removal if transition doesn't fire
    setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 400);
  }

  function handleModalEscape(e) {
    if (e.key === 'Escape') closeBuildingModal();
  }

  // ── Turf Management Modal ─────────────────────────────────────────
  function openTurfModal(zone) {
    closeBuildingModal();                     // reuse the same close logic
    const d = zone.details || {};
    const areaType = d['Mowing Area Type'] || zone.name || zone.id;
    const imageSrc = zone.image || '';
    const fallbackSrc = zone.imageFallback || '';

    // Collect all Key Point N values in order
    const keyPoints = [];
    let i = 1;
    while (d['Key Point ' + i]) {
      keyPoints.push(d['Key Point ' + i]);
      i++;
    }

    const overlay = document.createElement('div');
    overlay.className = 'building-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', areaType + ' details');

    overlay.innerHTML = `
      <div class="building-modal">
        <button class="building-modal__close" aria-label="${escapeAttr(C.ui.closeModal)}">
          <span class="material-symbols-outlined">close</span>
        </button>
        <div class="building-modal__header">
          <h2 class="building-modal__name">${escapeHtml(areaType)}</h2>
        </div>
        ${imageSrc ? `
        <div class="building-modal__image">
          <img src="${escapeAttr(cacheBustUrl(imageSrc))}"
               ${fallbackSrc ? `onerror="this.onerror=null;this.src='${escapeAttr(fallbackSrc)}';"` : ''}
               alt="${escapeAttr(areaType + ' area')}" />
        </div>
        ` : ''}
        <div class="building-modal__body">
          <div class="building-modal__section">
            <h3 class="building-modal__section-title">
              <span class="material-symbols-outlined">grass</span>
              ${escapeHtml(C.ui.turfOverviewTitle)}
            </h3>
            ${keyPoints.length > 0
              ? `<ul class="building-modal__bullets">${keyPoints.map(kp => `<li>${escapeHtml(kp)}</li>`).join('')}</ul>`
              : `<p class="building-modal__section-text">${escapeHtml(C.ui.noDetailsAvailable)}</p>`
            }
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    overlay.offsetHeight;
    overlay.classList.add('is-visible');

    overlay.querySelector('.building-modal__close').addEventListener('click', closeBuildingModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeBuildingModal();
    });
    document.addEventListener('keydown', handleModalEscape);
  }

  function clearZoneSelection(chapterId, slide) {
    const chapter = (state.content?.chapters || []).find((item) => item.id === chapterId);
    const panelCopy = getMapPanelCopy(chapter || {});
    const shouldCollapse = (chapterId === 'historic-buildings' || chapterId === 'zoning-system') && !panelCopy.eyebrow && !panelCopy.emptyTitle && !panelCopy.emptyHowTo && !panelCopy.emptyEditing;
    delete state.selectedZoneByChapterId[chapterId];
    slide.querySelectorAll('.zone-shape').forEach((zoneEl) => zoneEl.classList.remove('is-selected'));
    const panel = slide.querySelector('[data-detail-panel]');
    if (!panel) return;
    applyMapViewportTransform(slide, null);
    panel.classList.add('is-empty');
    panel.classList.toggle('is-collapsed', shouldCollapse);
    setFocusMapPanelOpenState(slide, false);
    if (shouldCollapse) {
      panel.innerHTML = '';
      return;
    }
    const showEmptyInstructionList = Boolean(panelCopy.emptyHowTo || panelCopy.emptyEditing);
    panel.innerHTML = `
      ${panelCopy.eyebrow ? `<p class="map-detail-panel__eyebrow">${escapeHtml(panelCopy.eyebrow)}</p>` : ''}
      <h3 class="map-detail-panel__title">${escapeHtml(panelCopy.emptyTitle)}</h3>
      ${showEmptyInstructionList ? `
        <ul class="detail-list">
          ${panelCopy.emptyHowTo ? `
            <li>
              <span class="detail-label">How to use</span>
              <span class="detail-value">${escapeHtml(panelCopy.emptyHowTo)}</span>
            </li>
          ` : ''}
          ${panelCopy.emptyEditing ? `
            <li>
              <span class="detail-label">Editing</span>
              <span class="detail-value">${escapeHtml(panelCopy.emptyEditing)}</span>
            </li>
          ` : ''}
        </ul>
      ` : ''}
    `;
  }

  function getMapPanelCopy(chapter) {
    const mapPanel = chapter?.map?.panel || {};
    const defaults = C.ui.mapPanelDefaults;
    return {
      ariaLabel: mapPanel.ariaLabel || defaults.ariaLabel,
      eyebrow: Object.prototype.hasOwnProperty.call(mapPanel, 'eyebrow') ? String(mapPanel.eyebrow || '') : defaults.eyebrow,
      emptyTitle: mapPanel.emptyTitle || defaults.emptyTitle,
      emptyHowTo: mapPanel.emptyHowTo || defaults.emptyHowTo,
      emptyEditing: mapPanel.emptyEditing || defaults.emptyEditing
    };
  }

  function applyTextEditModeToDom() {
    el.slideContainer.querySelectorAll('[data-editable="true"]').forEach((node) => {
      const isEditing = state.textEditMode;
      node.setAttribute('contenteditable', isEditing ? 'plaintext-only' : 'false');
      node.setAttribute('spellcheck', isEditing ? 'true' : 'false');
      node.classList.toggle('is-text-editable', isEditing);
      if (isEditing) {
        node.setAttribute('tabindex', '0');
      } else {
        node.removeAttribute('tabindex');
      }
    });
  }

  function handleEditableElementChange(target) {
    if (!state.textEditMode) return;
    const chapterIndex = Number(target.dataset.editChapterIndex);
    const path = target.dataset.editPath || '';
    if (!Number.isInteger(chapterIndex) || chapterIndex < 0 || !path) return;
    const value = normalizeEditableText(target.textContent || '');
    setChapterContentValue(chapterIndex, path, value);
    syncEditableMirrors(chapterIndex, path, value, target);
  }

  function normalizeEditableText(value) {
    return String(value)
      .replace(/\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function setChapterContentValue(chapterIndex, path, value) {
    const chapter = state.content?.chapters?.[chapterIndex];
    if (!chapter) return;
    const segments = path.split('.');
    let ref = chapter;
    for (let i = 0; i < segments.length - 1; i += 1) {
      const seg = segments[i];
      const nextSeg = segments[i + 1];
      if (Array.isArray(ref)) {
        const idx = Number(seg);
        if (!Number.isInteger(idx) || idx < 0) return;
        if (ref[idx] == null) {
          ref[idx] = /^\d+$/.test(nextSeg) ? [] : {};
        }
        ref = ref[idx];
      } else {
        if (ref[seg] == null) {
          ref[seg] = /^\d+$/.test(nextSeg) ? [] : {};
        }
        ref = ref[seg];
      }
    }
    const last = segments[segments.length - 1];
    if (Array.isArray(ref)) {
      const idx = Number(last);
      if (!Number.isInteger(idx) || idx < 0) return;
      ref[idx] = value;
    } else {
      ref[last] = value;
    }
  }

  function syncEditableMirrors(chapterIndex, path, value, sourceEl) {
    const chapter = state.content?.chapters?.[chapterIndex];
    if (!chapter) return;
    const selector = `[data-editable="true"][data-edit-chapter-index="${chapterIndex}"][data-edit-path="${cssEscape(path)}"]`;
    el.slideContainer.querySelectorAll(selector).forEach((node) => {
      if (node === sourceEl) return;
      node.textContent = value;
    });
    if (path === 'headline' && state.currentChapterIndex === chapterIndex) {
      // Footer chapter name uses navLabel, so no update needed here.
    }
  }

  function exportContentJson() {
    if (!state.content) return;
    const json = `${JSON.stringify(state.content, null, 2)}\n`;
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    if (el.exportJsonBtn) {
      const original = el.exportJsonBtn.textContent;
      el.exportJsonBtn.textContent = C.ui.exportDownloadedLabel;
      window.setTimeout(() => {
        el.exportJsonBtn.textContent = original || C.header.controls.exportJson;
      }, 1000);
    }
  }

  function bindEvents() {
    el.prevBtn.addEventListener('click', () => goToChapter(state.currentChapterIndex - 1));
    el.nextBtn.addEventListener('click', () => goToChapter(state.currentChapterIndex + 1));
    el.mapHomeBtn?.addEventListener('click', () => showLanding());
    el.floatingMapBtn?.addEventListener('click', () => showLanding());
    el.textEditToggle?.addEventListener('click', () => {
      state.textEditMode = !state.textEditMode;
      el.textEditToggle.setAttribute('aria-pressed', String(state.textEditMode));
      document.body.classList.toggle('text-edit-mode', state.textEditMode);
      applyTextEditModeToDom();
    });
    el.exportJsonBtn?.addEventListener('click', () => exportContentJson());

    el.presenterToggle.addEventListener('click', () => {
      state.presenterMode = !state.presenterMode;
      document.body.classList.toggle('presenter-mode', state.presenterMode);
      el.presenterToggle.setAttribute('aria-pressed', String(state.presenterMode));
    });

    el.printToggle.addEventListener('click', () => {
      state.printMode = !state.printMode;
      document.body.classList.toggle('print-layout', state.printMode);
      el.printToggle.setAttribute('aria-pressed', String(state.printMode));
      if (state.printMode && state.viewMode === 'landing') {
        goToChapter(state.currentChapterIndex, { animate: false });
      }
      updateNavButtons();
    });

    document.addEventListener('keydown', (event) => {
      if (event.defaultPrevented) return;
      const target = event.target;
      const tag = target && target.tagName ? target.tagName.toLowerCase() : '';
      const isTypingContext = tag === 'input' || tag === 'textarea' || tag === 'select' || (target && target.isContentEditable);
      if (isTypingContext) return;

      if (event.key === 'ArrowRight' || event.key === 'PageDown') {
        event.preventDefault();
        if (state.viewMode === 'landing') {
          goToChapter(0);
        } else {
          goToChapter(state.currentChapterIndex + 1);
        }
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        if (state.viewMode === 'landing') return;
        goToChapter(state.currentChapterIndex - 1);
      } else if (event.key.toLowerCase() === 'p') {
        event.preventDefault();
        el.presenterToggle.click();
      } else if (event.key.toLowerCase() === 'm') {
        event.preventDefault();
        showLanding();
      }
    });

    el.slideContainer.addEventListener('input', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.matches('[data-editable=\"true\"]')) return;
      handleEditableElementChange(target);
    });

    el.slideContainer.addEventListener('blur', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.matches('[data-editable=\"true\"]')) return;
      handleEditableElementChange(target);
    }, true);
  }

  function goToChapter(index, options = {}) {
    const chapters = state.content?.chapters || [];
    if (!chapters.length) return;

    const nextIndex = clamp(index, 0, chapters.length - 1);
    state.currentChapterIndex = nextIndex;
    state.viewMode = 'chapter';
    el.app?.classList.remove('show-landing');

    const slides = Array.from(el.slideContainer.querySelectorAll('.slide'));
    slides.forEach((slide, slideIndex) => {
      const visible = state.printMode || slideIndex === nextIndex;
      slide.classList.toggle('is-visible', visible);
      slide.setAttribute('aria-hidden', String(!visible));
    });

    syncLandingMapActiveState();

    updateFooterStatus();
    updateNavButtons();

    if (options.animate === false) return;
  }

  function updateFooterStatus() {
    const chapters = state.content?.chapters || [];
    const chapter = chapters[state.currentChapterIndex];
    if (state.viewMode === 'landing' && !state.printMode) {
      el.chapterCounter.textContent = C.footer.landingCounterText;
      el.chapterName.textContent = `${chapters.length} ${C.footer.landingChapterSuffix}`;
      return;
    }
    el.chapterCounter.textContent = `${state.currentChapterIndex + 1} / ${chapters.length}`;
    el.chapterName.textContent = chapter?.navLabel || chapter?.headline || '';
  }

  function updateNavButtons() {
    const chapters = state.content?.chapters || [];
    const atStart = state.currentChapterIndex <= 0;
    const atEnd = state.currentChapterIndex >= chapters.length - 1;
    const disabledForPrint = state.printMode;
    const onLanding = state.viewMode === 'landing' && !state.printMode;

    el.prevBtn.disabled = disabledForPrint || onLanding || atStart;
    el.nextBtn.disabled = disabledForPrint || onLanding || atEnd;
    if (el.mapHomeBtn) {
      el.mapHomeBtn.disabled = disabledForPrint || onLanding;
    }
  }

  function showLanding(options = {}) {
    if (state.printMode) return;
    state.viewMode = 'landing';
    el.app?.classList.add('show-landing');

    const slides = Array.from(el.slideContainer.querySelectorAll('.slide'));
    slides.forEach((slide) => {
      slide.classList.remove('is-visible');
      slide.setAttribute('aria-hidden', 'true');
    });

    syncLandingMapActiveState();
    updateFooterStatus();
    updateNavButtons();

    if (options.animate === false) return;
  }

  function syncLandingMapActiveState() {
    if (!el.landingMap) return;
    el.landingMap.querySelectorAll('.landing-map__node').forEach((btn) => {
      const btnIndex = Number(btn.dataset.index);
      const active = state.viewMode === 'chapter' && btnIndex === state.currentChapterIndex;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-current', active ? 'true' : 'false');
    });
  }

  function renderError(error) {
    el.slideContainer.innerHTML = `
      <div class="slide is-visible">
        <div class="slide__header">
          <h2 class="slide__headline">${escapeHtml(C.errors.loadHeadline)}</h2>
        </div>
        <div class="slide__body">
          <section class="slide__bullets-panel">
            <h3>${escapeHtml(C.errors.loadTitle)}</h3>
            <ul class="slide__bullets">
              <li>${escapeHtml(error?.message || String(error))}</li>
              <li>${escapeHtml(C.errors.filePathHint)}</li>
              <li>${escapeHtml(C.errors.fetchHint)}</li>
            </ul>
          </section>
          <section class="visual-card"><div class="visual-frame visual-frame--placeholder"><div class="visual-placeholder-content"><h4>${escapeHtml(C.errors.loadIssueTitle)}</h4><p>${escapeHtml(C.errors.loadIssueText)}</p></div></div></section>
        </div>
      </div>
    `;
  }

  function polygonBounds(points) {
    const xs = points.map((p) => p[0]);
    const ys = points.map((p) => p[1]);
    return {
      minX: Math.min(...xs),
      minY: Math.min(...ys),
      maxX: Math.max(...xs),
      maxY: Math.max(...ys)
    };
  }

  function setFocusMapPanelOpenState(slide, isOpen) {
    if (!slide?.dataset) return;
    if (!['historic-buildings', 'zoning-system'].includes(slide.dataset.chapterId)) return;
    const mapCard = slide.querySelector('.map-card');
    if (!mapCard) return;
    mapCard.classList.toggle('has-open-panel', Boolean(isOpen));
  }

  function renderDetailMedia(chapterId, zone) {
    const supportedChapters = ['historic-buildings', 'zoning-system'];
    if (!supportedChapters.includes(chapterId)) return '';
    const media = zone?.media || {};
    if (media.src) {
      return `
        <div class="detail-media">
          <img src="${escapeAttr(cacheBustUrl(media.src))}" alt="${escapeAttr(media.alt || `${zone?.name || 'Building'} photo`)}" class="detail-media__img" />
        </div>
      `;
    }
    return `
      <div class="detail-media detail-media--placeholder" aria-label="Building photo placeholder">
        <div class="detail-media__placeholder-label">${chapterId === 'zoning-system' ? C.ui.areaPhotoPlaceholder : C.ui.buildingPhotoPlaceholder}</div>
      </div>
    `;
  }

  function positionZoneElement(zoneEl, zone) {
    if (!zoneEl || !zone) return;
    if (zone.shape === 'point' && Array.isArray(zone.point)) {
      const [x, y] = zone.point;
      zoneEl.style.left = `calc(${x}% - 9px)`;
      zoneEl.style.top = `calc(${y}% - 9px)`;
      zoneEl.style.width = '';
      zoneEl.style.height = '';
      return;
    }

    if (zone.shape === 'polygon' && Array.isArray(zone.points)) {
      const bounds = polygonBounds(zone.points);
      zoneEl.style.left = `${bounds.minX}%`;
      zoneEl.style.top = `${bounds.minY}%`;
      zoneEl.style.width = `${Math.max(bounds.maxX - bounds.minX, 2)}%`;
      zoneEl.style.height = `${Math.max(bounds.maxY - bounds.minY, 2)}%`;
      const localPoints = zone.points
        .map(([x, y]) => `${((x - bounds.minX) / (bounds.maxX - bounds.minX || 1)) * 100}% ${((y - bounds.minY) / (bounds.maxY - bounds.minY || 1)) * 100}%`)
        .join(', ');
      zoneEl.style.setProperty('--polygon-points', localPoints);
    }
  }

  function getMapPercentFromClick(event, slide) {
    return getMapPercentFromClient(event.clientX, event.clientY, slide);
  }

  function getMapPercentFromClient(clientX, clientY, slide) {
    const stage = slide.querySelector('.map-stage');
    const viewport = slide.querySelector('[data-map-viewport]');
    if (!stage || !viewport) return null;
    const stageRect = stage.getBoundingClientRect();
    if (!stageRect.width || !stageRect.height) return null;
    const xPx = clientX - stageRect.left;
    const yPx = clientY - stageRect.top;

    const transformString = window.getComputedStyle(viewport).transform;
    const matrix = transformString && transformString !== 'none' ? new DOMMatrix(transformString) : new DOMMatrix();
    const inv = matrix.inverse();
    const mapPoint = new DOMPoint(xPx, yPx).matrixTransform(inv);

    const xPct = clamp((mapPoint.x / stageRect.width) * 100, 0, 100);
    const yPct = clamp((mapPoint.y / stageRect.height) * 100, 0, 100);
    return [xPct, yPct];
  }

  function getStageScreenPercent(clientX, clientY, stage) {
    if (!stage) return null;
    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    return [
      clamp(((clientX - rect.left) / rect.width) * 100, 0, 100),
      clamp(((clientY - rect.top) / rect.height) * 100, 0, 100)
    ];
  }

  function updatePlacementReadout(chapter, targetId, readoutEl) {
    if (!readoutEl) return;
    const zone = (chapter?.map?.zones || []).find((z) => z.id === targetId);
    if (!zone || !Array.isArray(zone.point)) {
      readoutEl.textContent = 'XY: --, --';
      return;
    }
    readoutEl.textContent = `XY: ${round2(zone.point[0])}, ${round2(zone.point[1])}`;
  }

  function round2(value) {
    return Math.round(Number(value) * 100) / 100;
  }

  function applyMapViewportTransform(slide, zone) {
    const viewport = slide.querySelector('[data-map-viewport]');
    if (!viewport) return;
    if (!zone) {
      const existing = slide.__mapView;
      if (existing && Number.isFinite(existing.scale) && Array.isArray(existing.center)) {
        applyMapView(slide, existing);
        return;
      }
      applyMapView(slide, { scale: 1, center: [50, 50] });
      return;
    }

    const zoom = deriveZoneZoom(zone);
    if (!zoom) {
      applyMapView(slide, { scale: 1, center: [50, 50] });
      return;
    }
    applyMapView(slide, zoom);
  }

  function applyMapView(slide, view) {
    const viewport = slide.querySelector('[data-map-viewport]');
    if (!viewport) return;
    const minScale = ['historic-buildings', 'zoning-system'].includes(slide?.dataset?.chapterId || '') ? 0.8 : 1;
    const scale = clamp(Number(view?.scale) || 1, minScale, 6);
    const center = Array.isArray(view?.center) ? [clamp(Number(view.center[0]) || 50, 0, 100), clamp(Number(view.center[1]) || 50, 0, 100)] : [50, 50];
    const [cx, cy] = center;
    const tx = 50 - (cx * scale);
    const ty = 50 - (cy * scale);
    viewport.style.transform = `translate(${tx}%, ${ty}%) scale(${scale})`;
    slide.__mapView = { scale, center };
  }

  function stepMapZoom(slide, factor) {
    const current = slide.__mapView || { scale: 1, center: [50, 50] };
    const nextScale = clamp((current.scale || 1) * factor, 1, 6);
    applyMapView(slide, { scale: nextScale, center: current.center || [50, 50] });
  }

  function deriveZoneZoom(zone) {
    if (zone?.zoom && Array.isArray(zone.zoom.center) && Number.isFinite(zone.zoom.scale)) {
      return {
        scale: clamp(zone.zoom.scale, 1, 4),
        center: [clamp(zone.zoom.center[0], 0, 100), clamp(zone.zoom.center[1], 0, 100)]
      };
    }

    if (zone.shape === 'point' && Array.isArray(zone.point)) {
      return { scale: 2.2, center: [zone.point[0], zone.point[1]] };
    }

    if (zone.shape === 'polygon' && Array.isArray(zone.points) && zone.points.length) {
      const bounds = polygonBounds(zone.points);
      const width = Math.max(bounds.maxX - bounds.minX, 6);
      const height = Math.max(bounds.maxY - bounds.minY, 6);
      const scale = clamp(Math.min(62 / width, 62 / height), 1.2, 3);
      const center = [(bounds.minX + bounds.maxX) / 2, (bounds.minY + bounds.maxY) / 2];
      return { scale, center };
    }

    return null;
  }

  function hexToRgba(hex, alpha) {
    const normalized = (hex || '').replace('#', '').trim();
    if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return `rgba(120,120,120,${alpha})`;
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === 'function') {
      return window.CSS.escape(value);
    }
    return String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
  }

  function cacheBustUrl(url) {
    const value = String(url || '');
    const joiner = value.includes('?') ? '&' : '?';
    return `${value}${joiner}v=${state.assetVersion}`;
  }
})();