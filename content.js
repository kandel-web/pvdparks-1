/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║  CONTENT FILE — Providence Parks Digital Field Walk             ║
  ║                                                                ║
  ║  All editable text, image paths, labels, colors, map data,     ║
  ║  and chapter content live here. Edit this file to update the   ║
  ║  presentation — no need to touch index.html or script.js.      ║
  ╚══════════════════════════════════════════════════════════════════╝
*/

window.SITE_CONTENT = {

  // ═══════════════════════════════════════════════════════════════
  //  PAGE & HEADER
  // ═══════════════════════════════════════════════════════════════
  page: {
    documentTitle: "Strategic Plan Implementation",
    noScriptMessage: "This presentation requires JavaScript to run locally."
  },

  header: {
    brandKicker: "Master Plan Updates",
    brandTitle: "Digital Field Walk",
    logoAlt: "Providence Parks logo",
    controls: {
      textEdit: "Text Edit Mode",
      exportJson: "Export JSON",
      presenter: "Presenter Mode",
      printLayout: "Print Layout"
    }
  },

  // ═══════════════════════════════════════════════════════════════
  //  LANDING SCREEN
  // ═══════════════════════════════════════════════════════════════
  landing: {
    title: "Roger Williams Park",
    subtitle: "Master Plan Process",
    logoAlt: "Providence Parks logo",

    // Logo paths (used on landing and floating map button)
    landingLogoPath: "assets/prov-parks-logo-white-vert.png",
    floatingLogoPath: "assets/prov-parks-logo-white-vert.png",
    floatingMapBtnAriaLabel: "Return to chapter map",

    // Horizontal row layout positions for the 8 landing map icons
    nodeLayout: [
      { x: 7,    y: 38, labelSide: "right" },
      { x: 19.5, y: 38, labelSide: "right" },
      { x: 32,   y: 38, labelSide: "right" },
      { x: 44.5, y: 38, labelSide: "right" },
      { x: 57,   y: 38, labelSide: "right" },
      { x: 69.5, y: 38, labelSide: "right" },
      { x: 82,   y: 38, labelSide: "right" },
      { x: 94.5, y: 38, labelSide: "right" }
    ],

    // Material icon name per chapter id
    iconByChapterId: {
      "title":                        "park",
      "strategic-plan-overview":      "dashboard",
      "capital-improvements-overview": "construction",
      "historic-buildings":           "account_balance",
      "zoning-system":                "grass",
      "planting-zones":               "local_florist",
      "stormwater-management-areas":  "water_drop",
      "programming":                  "groups_2",
      "social-media-presence":        "mobile_camera",
      "next-steps":                   "partner_exchange"
    },

    // Bubble background colors
    nodePalette: [
      "#B8A7C8",  // lavender
      "#E8BE8A",  // warm sand
      "#D2A7A1",  // blush clay
      "#7F8A6A",  // olive
      "#9BC9C4",  // soft teal
      "#76BF86",  // leaf green
      "#5B8B7A",  // deep teal-green
      "#EBAA63",  // brand amber
      "#8F9DB2"   // slate blue
    ],
    defaultPaletteColor: "#98C8C1",

    // Map chapter id → palette index
    paletteIndexByChapterId: {
      "strategic-plan-overview":       0,
      "capital-improvements-overview": 1,
      "historic-buildings":            2,
      "zoning-system":                 3,
      "planting-zones":                4,
      "stormwater-management-areas":   5,
      "programming":                   6,
      "social-media-presence":         7,
      "next-steps":                    8
    },

    // The ordered list of items shown on the landing map
    navItems: [
      { chapterId: "strategic-plan-overview",       label: "Strategic Plan Overview" },
      { chapterId: "capital-improvements-overview",  label: "Capital Improvements" },
      { chapterId: "historic-buildings",             label: "Upcoming Projects" },
      { chapterId: "zoning-system",                  label: "Turf Management" },
      { chapterId: "planting-zones",                 label: "Planting" },
      { chapterId: "programming",                    label: "Programming" },
      { chapterId: "social-media-presence",          label: "Social Media Presence" },
      { chapterId: "next-steps",                     label: "Opportunities for Collaboration" }
    ],

    // Multi-line label breaks for each landing bubble
    bubbleLineBreaks: {
      "strategic-plan-overview":       ["Strategic", "Plan", "Overview"],
      "capital-improvements-overview": ["Capital", "Improvements"],
      "historic-buildings":            ["Upcoming", "Projects"],
      "zoning-system":                 ["Turf", "Management"],
      "stormwater-management-areas":   ["Stormwater", "Management"],
      "programming":                   ["Programming"],
      "social-media-presence":         ["Social Media", "Presence"],
      "next-steps":                    ["Opportunities", "for", "Collaboration"]
    }
  },

  // ═══════════════════════════════════════════════════════════════
  //  FOOTER / NAVIGATION BAR
  // ═══════════════════════════════════════════════════════════════
  footer: {
    prevButton:            "Previous",
    mapButton:             "Park Map",
    nextButton:            "Next",
    landingCounterText:    "Park Map",
    landingChapterSuffix:  "chapter icons"
  },

  // ═══════════════════════════════════════════════════════════════
  //  MAP SETTINGS (Leaflet)
  // ═══════════════════════════════════════════════════════════════
  maps: {
    // Upcoming Projects (Historic Buildings) map
    historicCenter: [41.7845, -71.4140],
    historicZoom: 15,

    // Turf Management map
    turfCenter: [41.7845, -71.4140],
    turfZoom: 16,

    // ── Street tile style ──────────────────────────────────────
    // Change this value to switch the street map appearance.
    // Options: "esri-natgeo", "esri-street", "esri-topo",
    //          "carto-voyager", "carto-positron", "carto-dark",
    //          "stadia-smooth", "stadia-bright",
    //          "openstreetmap"
    streetStyle: "esri-natgeo",

    streetProviders: {
      // ── Esri (no API key, no Referer needed, works from file://) ──
      "esri-natgeo": {
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
        attribution: "&copy; Esri, National Geographic, DeLorme, HERE, UNEP-WCMC",
        maxZoom: 16
      },
      "esri-street": {
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
        attribution: "&copy; Esri, HERE, Garmin, USGS, EPA",
        maxZoom: 19
      },
      "esri-topo": {
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        attribution: "&copy; Esri, HERE, Garmin, FAO, NOAA, USGS, EPA",
        maxZoom: 19
      },

      // ── CARTO (no API key, no Referer needed, works from file://) ──
      "carto-voyager": {
        url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 20
      },
      "carto-positron": {
        url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 20
      },
      "carto-dark": {
        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 20
      },

      // ── Stadia (free tier, no Referer needed) ──
      "stadia-smooth": {
        url: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 20
      },
      "stadia-bright": {
        url: "https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png",
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 20
      },

      // ── OpenStreetMap (requires Referer — use a local server) ──
      "openstreetmap": {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
      }
    },

    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "&copy; Esri, Maxar, Earthstar Geographics",
      maxZoom: 19
    },

    viewToggleLabels: {
      streets: "Map",
      satellite: "Satellite"
    },

    historicMarkerHtml: '<div class="marker-pin"><span class="material-symbols-outlined">location_on</span></div>',
    historicMarkerSize: [52, 52],
    historicMarkerAnchor: [26, 26],
    historicPopupAnchor: [0, -26],

    turfMarkerHtml: '<div class="turf-marker-pin"><span class="material-symbols-outlined">grass</span></div>',
    turfMarkerSize: [44, 44],
    turfMarkerAnchor: [22, 22],
    turfPopupAnchor: [0, -22]
  },

  // ═══════════════════════════════════════════════════════════════
  //  MODAL / DETAIL UI LABELS
  // ═══════════════════════════════════════════════════════════════
  ui: {
    backToMap:              "Back to Map",
    closeModal:             "Close modal",
    proposedImprovements:   "Proposed Projects",
    implementationNotes:    "Implementation Notes",
    noImprovementsListed:   "No improvements listed.",
    noNotesAvailable:       "No notes available.",
    turfOverviewTitle:      "Overview",
    noDetailsAvailable:     "No details available.",
    buildingPhotoPlaceholder: "Building Photo Placeholder",
    areaPhotoPlaceholder:   "Area Photo Placeholder",
    placementModeLabel:     "Placement Mode",
    copyXyLabel:            "Copy XY",
    copiedLabel:            "Copied",
    copyFailedLabel:        "Copy failed",
    resetViewLabel:         "Reset View",
    imagePlaceholderTitle:  "Image Placeholder",
    imagePlaceholderText:   "Add a planting image or diagram here.",
    visualPlaceholderTitle: "Visual Placeholder",
    visualPlaceholderDefault: "Replace this area with a local image or map by editing content.json.",
    exportDownloadedLabel:  "Downloaded",
    yearBuiltLabel:         "Year Built",
    archStyleLabel:         "Architectural Style",

    // Map panel defaults (when no chapter-specific copy is set)
    mapPanelDefaults: {
      ariaLabel:     "Map details panel",
      eyebrow:       "Zone Details",
      emptyTitle:    "Select a zone",
      emptyHowTo:    "Use layer toggles to filter zones, then click a zone on the map to open details in this panel.",
      emptyEditing:  "Zone descriptions and shapes are stored in content.json for easy updates."
    },

    // Map toolbar fallback help text
    mapHelpFallback: "Map wow moment: clean layer toggles and a right-side detail panel for stable boardroom presentation use."
  },

  // ═══════════════════════════════════════════════════════════════
  //  ERROR SCREEN
  // ═══════════════════════════════════════════════════════════════
  errors: {
    loadHeadline: "Presentation could not load",
    loadTitle: "Error",
    contentNotFound: "Content data not found.",
    filePathHint: "Make sure this folder is opened locally and content data exists beside index.html.",
    fetchHint: "Some browsers restrict fetch() on file://. If needed, use a local static server.",
    loadIssueTitle: "Load Issue",
    loadIssueText: "Check local file paths and browser security settings."
  },

  // ═══════════════════════════════════════════════════════════════
  //  PRESENTATION OVERRIDES
  //  (Injected on top of the base chapter data at runtime)
  // ═══════════════════════════════════════════════════════════════
  overrides: {

    // ── Strategic Plan Overview: three priority cards ──
    priorities: [
      {
        title: "Maximize Our Parks\u2019 Value",
        color: "#485330",
        intro: "Maximize the value of the investments we have made in our parks by transitioning from new construction to ongoing excellence, ensuring that our parks continue to feel fresh and valuable overtime.",
        items: [
          "Plan for the lifecycle of park assets and amenities with holistic, proactive strategies for long-term sustainability.",
          "Highlight the value of past investments through visible, high-quality upkeep that excites and engages the community.",
          "Build on our foundation with upgrades and programming that adapts to evolving community needs and increases impact."
        ]
      },
      {
        title: "Share Our Story",
        color: "#62AA63",
        intro: "Foster a deep sense of ownership and pride by building a compelling narrative around the parks' importance to the community and their role in enhancing public wellbeing.",
        items: [
          "Inspire community pride by celebrating natural assets, park investments, and venues while welcoming visitors from near and far.",
          "Create consistent, unified messaging to showcase how parks serve as community anchors and contributors to well-being.",
          "Evaluate and demonstrate impact using meaningful data to highlight outcomes to the public, policymakers, and funders."
        ]
      },
      {
        title: "Build a Generative Future",
        color: "#98C8C1",
        intro: "Cultivate strategic partnerships, diversify revenue streams, and plan proactively to ensure long-term sustainability and continuing meaningful impact.",
        items: [
          "Plan for long-term sustainability by diversifying budgets for park upgrades and ensuring financial nimbleness.",
          "Collaborate effectively to amplify resources and support iconic projects while laying groundwork for future initiatives.",
          "Expand revenue through diverse sources that align with the department\u2019s mission."
        ]
      }
    ],

    // ── Capital Improvements: project list and visual override ──
    capitalProjects: {
      title: "Projects",
      subtitle: "$3 million",
      items: [
        "Road Striping in Roger Williams Park \u2013 $150,000",
        "RWP Casino Beam Replacement \u2013 $85,000",
        "RWP Stormwater Retrofits \u2013 $67,000",
        "RWP Cunliff Boardwalk \u2013 $2,265,000",
        "Interior Renovations at the Museum of Natural History \u2013 $73,000",
        "Installation of Fitness Equipment in RWP - $40,000",
        "Carousel Roof and Painting - $200,000*",
        "Irrigation at the Botanical Center - $40,000**",
        "Museum Plaster - $40,000**",
        "Boathouse Ceiling Repairs- $40,000**"
      ],
      footnotes: [
        "* Funded through the RIZS",
        "** In-house repair"
      ]
    },
    capitalVisual: {
      type: "image",
      src: "assets/rwp-bandstand-lake.jpg",
      alt: "Roger Williams Park Bandstand reflected in lake",
      fit: "cover"
    },

    // ── Historic Buildings: zone images (local + remote fallbacks) ──
    buildingImages: {
      "historic-temple-to-music": { local: "assets/AdobeStock_98209591.jpeg" },
      "historic-casino": {
        local: "assets/rwp-casino-exterior.jpg",
        remote: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Casino_at_Roger_Williams_Park.jpg/1280px-Casino_at_Roger_Williams_Park.jpg"
      },
      "historic-museum": {
        local: "assets/rwp-museum-exterior.jpg",
        remote: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Museum_of_Natural_History_and_Planetarium_in_Roger_Williams_Park.jpg/1280px-Museum_of_Natural_History_and_Planetarium_in_Roger_Williams_Park.jpg"
      },
      "historic-playground": { local: "assets/playground.jpeg" },
      "historic-gateway-garage": { local: "assets/gateway-garage.jpeg" },
      "historic-bandstand": { local: "assets/AdobeStock_529557285.jpeg" },
      "historic-boathouse": {
        local: "assets/rwp-boathouse-exterior.jpg",
        remote: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Dalrymple_Boat_House_Prov.jpg"
      },
      "historic-mashapaug-pond": { local: "assets/mashapaug.jpg" }
    },

    // ── Turf Management: zone images (local + remote fallbacks) ──
    turfImages: {
      "turf-no-mow-point": {
        local: "assets/turf-no-mow.jpg",
        remote: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Warm_sunshine_illuminates_the_tall_grass_surrounding_one_of_the_duck_ponds._%2813059783044%29.jpg/960px-Warm_sunshine_illuminates_the_tall_grass_surrounding_one_of_the_duck_ponds._%2813059783044%29.jpg"
      },
      "turf-low-mow-point": {
        local: "assets/turf-low-mow.jpg",
        remote: "https://upload.wikimedia.org/wikipedia/commons/3/38/Alexandra_Palace_Park%2C_path_through_long_grass_-_geograph.org.uk_-_823105.jpg"
      },
      "turf-lawn-point": {
        local: "assets/turf-lawn.jpg",
        remote: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/084_Green_grass_lawn_background%2C_green_mowed_grass_free_photo.jpg/1280px-084_Green_grass_lawn_background%2C_green_mowed_grass_free_photo.jpg"
      }
    },

    // ── Planting: column images ──
    plantingImages: [
      {
        src: "assets/rwp-casino-fountain.jpg",
        alt: "Roger Williams Park Casino with fountain and seasonal plantings in the foreground"
      },
      {
        src: "assets/rwp-casino-exterior.jpg",
        alt: "Formal ornamental plantings at the Roger Williams Park Casino (Colonial Revival, 1896)"
      },
      {
        src: "https://static.wixstatic.com/media/813f05_cbeaf6015c234f039ea77375fe3bacf5~mv2.jpeg/v1/fill/w_1200,h_900,fp_0.55_0.59,q_90,enc_auto,quality_auto/813f05_cbeaf6015c234f039ea77375fe3bacf5~mv2.jpeg",
        alt: "Bioretention rain garden with native plants at Roger Williams Park \u2014 Stormwater Innovation Center"
      }
    ],

    // ── Next Steps: override to collaboration framing ──
    nextSteps: {
      navLabel: "Opportunities for Collaboration",
      headline: "Opportunities for Collaboration",
      layoutMode: "hero-image",
      heroImage: {
        src: "assets/brain.jpg",
        alt: "Brainstorm illustration with thought bubbles for collaboration opportunities"
      }
    },

    // ── Programming chapter (injected before Next Steps) ──
    programmingChapter: {
      id: "programming",
      navLabel: "Programming",
      headline: "Programming",
      layoutMode: "program-cards",
      cards: [
        {
          title: "Gateway",
          icon: "door_front",
          image: "assets/IMG_0358.jpeg",
          bullets: []
        },
        {
          title: "Museum of Natural History",
          icon: "museum",
          image: "assets/Constant_Contact_Banner_Museum.jpg",
          bullets: [
            "39,785 visitors",
            "Halloween Night at the Museum and Concert Under the Stars",
            "Observe the Moon and Family Fun Science Days",
            "Walking tours, educational activities, and Betsey Williams Cottage tours",
            "Planetarium: Skating through the Cosmos and Observe the Night",
            "Science field trip programs"
          ]
        },
        {
          title: "Botanical Center",
          icon: "local_florist",
          image: "assets/botanical_1.png",
          bullets: [
            "All Aboard the Holidays train exhibit and Fairy Garden Days",
            "Musical performances, family crafts, art exhibits, and interactive activities",
            "Story Time Wee Wednesdays and Community Garden Learning Series",
            "Books and Banter, Hike and Builds, Holiday Wreath Workshops",
            "Gnome-vember, Bonsai workshops, Pastel Art, All Abilities program"
          ]
        },
        {
          title: "Urban Wildlife Partnership",
          icon: "nature",
          image: "assets/urban_2.png",
          bullets: [
            "Monthly free bird walks",
            "Teacher Institute"
          ]
        },
        {
          title: "Stormwater Innovation Center",
          icon: "water_drop",
          image: "assets/stormwater_1.png",
          bullets: [
            "Stormwater Expo and Rainharvest Festival",
            "Training and Stormwater Retrofits",
            "Fish & Geese Surveys and Monitoring",
            "Biopods"
          ]
        },
        {
          title: "Roger Williams Park",
          icon: "groups_2",
          image: "assets/prog_1.png",
          bullets: [
            "Earth April Series",
            "Edward Ely Performing Arts Series \u2014 48+ performances across 15+ parks",
            "Free fitness programming at 20+ locations",
            "Holiday Tree Lighting and Wicked Walks on the Van Leesten Bridge",
            "Halloween Bash at the RWP Gateway"
          ]
        }
      ],
      bullets: [],
      keyPointsTheme: "leaf"
    },

    // ── Social Media Presence chapter (injected before Next Steps) ──
    socialMediaChapter: {
      id: "social-media-presence",
      navLabel: "Social Media Presence",
      headline: "Social Media Presence",
      bullets: [],
      facebookEmbed: {
        pageUrl: "https://www.facebook.com/PVDParks",
        pageName: "PVDParks"
      },
      newsletterEmbed: {
        url: "https://www.rwpconservancy.org/march-news-2026/",
        label: "Newsletter"
      },
      visual: {
        type: "instagram-embed",
        handle: "pvdparks"
      },
      keyPointsTheme: "teal"
    }
  },

  // ═══════════════════════════════════════════════════════════════
  //  PRESENTATION DATA
  //  (the base chapter content — previously embedded as JSON)
  // ═══════════════════════════════════════════════════════════════
  presentationData: {
    meta: {
      title: "Strategic Plan Implementation",
      subtitle: "Providence Parks Board Digital Field Walk",
      logoPath: "assets/providence-parks-logo.png",
      brand: {
        colors: {
          forest: "#485330",
          leaf: "#62AA63",
          teal: "#98C8C1",
          earth: "#8A7C6A",
          mist: "#F5F6F2",
          ink: "#2F3526",
          mutedText: "#656566"
        },
        fontFamily: "Proxima Nova, Avenir Next, Segoe UI, Helvetica Neue, Arial, sans-serif"
      },
      editingNotes: [
        "Update chapter text in the chapters array below.",
        "To replace a visual placeholder, set visual.type to 'image' and point visual.src to a local file path in this project folder.",
        "Chapter 5 includes an interactive map module. Edit the layer labels and zones in chapters[4].map.zones.",
        "Optional map zoom: add zone.zoom = { \"scale\": 2.2, \"center\": [xPercent, yPercent] } to control zoom for selected zones/buildings."
      ]
    },
    chapters: [
      {
        id: "title",
        navLabel: "Title",
        headline: "Strategic Planning and Management of Roger Williams Park",
        bullets: [
          "Advancing our Master Plan through stewardship, reliability, and innovation",
          "Aligning maintenance operations, capital improvements, and sustainability",
          "Protecting historic assets while modernizing systems",
          "Building a generative future for Providence\u2019s parks"
        ],
        visual: {
          type: "image",
          label: "Hero Visual Placeholder",
          caption: "Replace with an aerial image or signature park photo for the opening chapter.",
          src: "assets/strategic-plan-cover.png",
          alt: "Providence Parks Strategic Plan cover"
        },
        keyPointsTheme: "leaf"
      },
      {
        id: "strategic-plan-overview",
        navLabel: "Strategic Plan Overview",
        headline: "From Vision to Implementation",
        bullets: [
          "Maximize the value of past investments through ongoing excellence",
          "Share our story through visible, high-quality upkeep",
          "Build a generative future through proactive lifecycle planning",
          "Embed stewardship, belonging, innovation, care, and reliability into daily operations"
        ],
        visual: {
          type: "image",
          label: "Strategic Framework Visual",
          caption: "",
          src: "assets/strategic-plan-ethos-left-column-clean-v4.png",
          alt: "Strategic Plan ethos left-column graphic",
          fit: "contain"
        },
        keyPointsTheme: "teal"
      },
      {
        id: "capital-improvements-overview",
        navLabel: "Capital Improvements Overview",
        headline: "Investing in Longevity and Performance",
        visual: {
          type: "image",
          label: "Capital Improvements Map/Phasing",
          caption: "Insert project phasing map, repair priority diagram, or infrastructure photo.",
          src: "assets/btga-proposal-cover.png",
          alt: "BTGA repair support proposal cover"
        },
        keyPointsTheme: "earth"
      },
      {
        id: "historic-buildings",
        navLabel: "Upcoming Projects",
        headline: "Preserving Icons. Modernizing Responsibly.",
        bullets: [
          "Targeted repairs at the Casino, Temple to Music, Museum, Bandstand, and Boathouse",
          "Structural, ventilation, roofing, plaster, and drainage upgrades",
          "Coordination with State Historic review processes",
          "Alignment with the City\u2019s decarbonization roadmap, including HVAC modernization, electrification, solar integration, and window upgrades to reduce emissions and energy use intensity"
        ],
        visual: {
          type: "map",
          label: "Historic Buildings Interactive Map",
          caption: "Click a historic building location to view the building name and proposed improvement types."
        },
        keyPointsTheme: "forest",
        map: {
          baseImage: "assets/park-overall-page1.png",
          baseImageNote: "Rendered from Park Overall.pdf page 1. Adjust point coordinates below as needed.",
          layers: [
            { id: "historic", label: "Upcoming Projects", color: "#8A7C6A", active: true }
          ],
          zones: [
            {
              id: "historic-temple-to-music",
              name: "Temple to Music",
              layer: "historic",
              shape: "point",
              point: [38.38, 80.76],
              latLng: [41.78068, -71.41351],
              zoom: { scale: 3.2, center: [38.38, 80.76] },
              details: {
                "Building Name": "Temple to Music",
                "Type of Improvement": "Ventilation and plaster repair/replacement, and bollard installation"
              }
            },
            {
              id: "historic-casino",
              name: "Casino",
              layer: "historic",
              shape: "point",
              point: [23.96, 45.96],
              latLng: [41.78393, -71.41701],
              zoom: { scale: 3.0, center: [23.96, 45.96] },
              details: {
                "Building Name": "Casino",
                "Type of Improvement": "Repair of beam and roof edge, and deck repairs"
              }
            },
            {
              id: "historic-mashapaug-pond",
              name: "Mashapaug Pond",
              layer: "historic",
              shape: "point",
              point: [32.50, 28.75],
              latLng: [41.790863, -71.431513],
              zoom: { scale: 3.0, center: [32.50, 28.75] },
              details: {
                "Location": "Mashapaug Pond",
                "Type of Improvement": "Create a cohesive, long-term vision that restores ecological function and expands recreational and educational opportunities by intentionally linking water quality improvements, public programming, and physical connections along Mashapaug Pond."
              }
            },
            {
              id: "historic-museum",
              name: "Museum of Natural History",
              layer: "historic",
              shape: "point",
              point: [40.25, 24.54],
              latLng: [41.78680, -71.41323],
              zoom: { scale: 2.8, center: [40.25, 24.54] },
              details: {
                "Building Name": "Museum of Natural History",
                "Year Built": "1896",
                "Architectural Style": "Richardsonian Romanesque",
                "Type of Improvement": "Upgrading gutter designs to address roof drainage",
                "Implementation Notes": "Gutter redesign will resolve chronic drainage issues causing water infiltration. Upgrades will be compatible with the Richardsonian Romanesque detailing. Scope includes downspout routing to reduce foundation moisture.",
                "Description": "The Museum of Natural History and Planetarium, established in 1896, is the only public museum in Providence. It houses natural history collections and Rhode Island\u2019s only public planetarium."
              }
            },
            {
              id: "historic-bandstand",
              name: "Bandstand",
              layer: "historic",
              shape: "point",
              point: [25.33, 52.96],
              latLng: [41.78324, -71.41667],
              zoom: { scale: 3.3, center: [25.33, 52.96] },
              details: {
                "Building Name": "Bandstand",
                "Year Built": "Early 1900s",
                "Architectural Style": "Victorian open-air pavilion",
                "Type of Improvement": "Concrete repair at drum wall",
                "Implementation Notes": "Drum wall deterioration requires patching and stabilization to maintain structural integrity. Repair materials will be matched to the original concrete mix for visual consistency. Work can be completed outside of peak event season.",
                "Description": "The Bandstand is a Victorian-era open-air performance structure used for community gatherings and seasonal concerts within the park."
              }
            },
            {
              id: "historic-playground",
              name: "Playground",
              layer: "historic",
              shape: "point",
              point: [33.5, 62.0],
              latLng: [41.782674, -71.415401],
              zoom: { scale: 3.0, center: [33.5, 62.0] },
              details: {
                "Location": "Playground",
                "Type of Improvement": "Playground renovations"
              }
            },
            {
              id: "historic-gateway-garage",
              name: "Gateway Garage",
              layer: "historic",
              shape: "point",
              point: [58.0, 10.0],
              latLng: [41.793181, -71.408744],
              zoom: { scale: 3.0, center: [58.0, 10.0] },
              details: {
                "Location": "Gateway Garage",
                "Type of Improvement": "Garage renovations and HVAC insulation"
              }
            },
            {
              id: "historic-boathouse",
              name: "Boathouse",
              layer: "historic",
              shape: "point",
              point: [44.09, 42.39],
              latLng: [41.78446, -71.41245],
              zoom: { scale: 2.8, center: [44.09, 42.39] },
              details: {
                "Building Name": "Boathouse",
                "Year Built": "Early 1900s",
                "Architectural Style": "Waterfront pavilion structure",
                "Type of Improvement": "Roof repairs",
                "Implementation Notes": "Roof repairs will address weather-related deterioration due to the waterfront exposure. Scope includes shingle replacement, flashing repair, and assessment of underlying decking. Resilience-focused materials will be prioritized given the lakeside location.",
                "Description": "The Boathouse sits at the water\u2019s edge and has historically served as a recreational launch point and gathering space. Its waterfront position demands resilience-focused maintenance."
              }
            }
          ],
          ariaLabel: "Interactive historic buildings map",
          helpText: "Click a location on the map to view the proposed improvements",
          panel: {
            ariaLabel: "Building details panel",
            eyebrow: "",
            emptyTitle: "",
            emptyHowTo: "",
            emptyEditing: ""
          },
          enablePlacementMode: false
        }
      },
      {
        id: "zoning-system",
        navLabel: "Turf Management",
        headline: "Turf Management",
        bullets: [
          "Applying differentiated maintenance intensity based on use and visibility",
          "Prioritizing high-use and high-visibility areas while reducing inputs elsewhere",
          "Integrating mowing, planting, and stormwater strategies park-wide",
          "Moving from reactive maintenance to planned management"
        ],
        visual: {
          type: "map",
          label: "Turf Management Map",
          caption: "Click a mowing area point to view the area type."
        },
        map: {
          baseImage: "assets/park-overall-mow-page1.png",
          baseImageNote: "Rendered from Park OverallMow.pdf page 1.",
          ariaLabel: "Interactive turf management map",
          helpText: "Click a location on the map to view the mowing area type",
          enablePlacementMode: false,
          panel: {
            ariaLabel: "Turf management details panel",
            eyebrow: "",
            emptyTitle: "",
            emptyHowTo: "",
            emptyEditing: ""
          },
          layers: [
            { id: "no-mow", label: "No Mow",  color: "#2F7D4A", active: true },
            { id: "low-mow", label: "Low Mow", color: "#88B04B", active: true },
            { id: "lawn",    label: "Lawn",     color: "#E9F5B5", active: true }
          ],
          zones: [
            {
              id: "turf-no-mow-point",
              name: "No Mow",
              layer: "no-mow",
              shape: "point",
              point: [55.2, 67.6],
              latLng: [41.78253, -71.41650],
              details: {
                "Mowing Area Type": "No Mow",
                "Headline": "Habitat and Hydrology First",
                "Key Point 1": "Limited mowing in environmentally sensitive areas",
                "Key Point 2": "Provides for improved biodiversity and habitat",
                "Key Point 3": "Support for stormwater absorption near ponds and water bodies"
              }
            },
            {
              id: "turf-low-mow-point",
              name: "Low Mow",
              layer: "low-mow",
              shape: "point",
              point: [49.8, 54.3],
              latLng: [41.78261, -71.41332],
              details: {
                "Mowing Area Type": "Low Mow",
                "Headline": "Managed Transition Zones",
                "Key Point 1": "Mowed as needed rather than on intensive schedules based on seasonal growth cycles",
                "Key Point 2": "Balance of appearance, access, and habitat value"
              }
            },
            {
              id: "turf-lawn-point",
              name: "Lawn",
              layer: "lawn",
              shape: "point",
              point: [43.6, 39.4],
              latLng: [41.78435, -71.41737],
              details: {
                "Mowing Area Type": "Lawn",
                "Headline": "High-Use Areas Maintained for Performance and Safety",
                "Key Point 1": "Routine maintenance schedules tied to use intensity",
                "Key Point 2": "Scheduling coordinated around public access and events"
              }
            }
          ]
        },
        keyPointsTheme: "leaf"
      },
      {
        id: "planting-zones",
        navLabel: "Planting",
        headline: "Planting",
        bullets: [
          "Natives and Naturalized",
          "Ornamentals",
          "Stormwater Management"
        ],
        visual: {
          type: "image",
          label: "Planting Zone Strategy Graphic",
          caption: "Insert palette board, planting typologies, or GIS planting inventory view.",
          src: "assets/rwp-casino-fountain.jpg",
          alt: "Roger Williams Park Casino exterior with fountain and colorful plantings in foreground"
        },
        keyPointsTheme: "leaf"
      },
      {
        id: "native-and-naturalized",
        navLabel: "Native and Naturalized",
        navDepth: 1,
        navGroup: "Planting",
        headline: "Native and Naturalized",
        bullets: [
          "Requires little to no irrigation",
          "Buffer plantings provide habitat diversity",
          "Supports pollinators and stormwater retention"
        ],
        visual: {
          type: "placeholder",
          label: "Native and Naturalized Planting Placeholder",
          caption: "Replace with planting palette, plan diagram, or site examples for native and naturalized areas."
        },
        keyPointsTheme: "teal"
      },
      {
        id: "ornamentals",
        navLabel: "Ornamentals",
        navDepth: 1,
        navGroup: "Planting",
        headline: "Formal",
        bullets: [
          "Entrances and gateways are ideal locations for formal plantings and ornamental features.",
          "Symmetrical plantings and defined pathways enhance the architectural character of historic buildings like the Casino and Museum."
        ],
        visual: {
          type: "placeholder",
          label: "Ornamental Planting Placeholder",
          caption: "Replace with ornamental planting plans, precedent images, or seasonal display strategy."
        },
        keyPointsTheme: "earth"
      },
      {
        id: "stormwater-management-areas",
        navLabel: "Stormwater Management Areas",
        headline: "Landscape as Infrastructure",
        bullets: [
          "Collaboration with the Stormwater Innovation Center",
          "Integrating planting zones with hydrologic performance",
          "Reducing runoff while improving ecological function",
          "Supporting long-term resilience and reduced maintenance inputs"
        ],
        visual: {
          type: "image",
          label: "Stormwater Performance Diagram",
          caption: "Replace with hydrology map, bioswale section, or runoff performance visual.",
          src: "assets/city-priorities-cover.png",
          alt: "City priorities briefing cover (stormwater placeholder)"
        },
        keyPointsTheme: "teal",
        sidebarLabel: "Programming"
      },
      {
        id: "next-steps",
        navLabel: "Next Steps",
        headline: "From Framework to Implementation",
        bullets: [
          "Collaboration with the Stormwater Innovation Center",
          "Integrating planting zones with hydrologic performance",
          "Reducing runoff while improving ecological function",
          "Supporting long-term resilience and reduced maintenance inputs"
        ],
        visual: {
          type: "image",
          label: "Implementation Roadmap",
          caption: "Insert timeline, accountability framework, or milestone dashboard.",
          src: "assets/annual-report-cover.png",
          alt: "Providence Parks annual report cover (next steps placeholder)"
        },
        keyPointsTheme: "earth"
      }
    ]
  }
};