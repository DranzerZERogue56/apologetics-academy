// ── Router ──────────────────────────────────────────────────────────────────
function navigateTo(page, id) {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  switch (page) {
    case 'home':       renderHome(); break;
    case 'courses':    renderCourses(); break;
    case 'course':     renderCourse(id); break;
    case 'lesson':     renderLesson(id.courseId, id.lessonIdx); break;
    case 'thinkers':   renderThinkers(); break;
    case 'thinker':    renderThinker(id); break;
    case 'books':      renderBooks(); break;
    case 'book':       renderBook(id); break;
    case 'free-library': renderFreeLibrary(); break;
    case 'bible':      renderBible(); break;
    case 'about':      renderAbout(); break;
    default:           renderHome();
  }
}

function setContent(html) {
  document.getElementById('app').innerHTML = html;
  syncBibleDark();
}

// ── Home ────────────────────────────────────────────────────────────────────
function renderHome() {
  setContent(`
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>Apologetics Academy</h1>
        <p class="hero-sub">Learn to give a reason for the hope that is in you.</p>
        <p class="hero-verse">"But in your hearts revere Christ as Lord. Always be prepared to give an answer to everyone who asks you to give the reason for the hope that you have." - 1 Peter 3:15</p>
        <button class="btn-primary" onclick="navigateTo('courses')">Explore Courses</button>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">What Is Apologetics?</h2>
      <div class="intro-text">
        <p>Christian apologetics is the intellectual discipline of defending the truth of the Christian faith through reason, evidence, and argument. From the Greek <em>apologia</em> (a reasoned defense), it has been practiced since the earliest days of the Church.</p>
        <p>Throughout history, great minds have developed distinct methods of making the case for Christianity. This academy will guide you through the major schools of apologetic thought, learning from the thinkers who shaped each tradition.</p>
      </div>
    </section>

    <section class="section bg-alt">
      <h2 class="section-title">Choose Your Path</h2>
      <div class="course-grid">
        ${COURSES.map(c => `
          <div class="course-card" style="border-top: 4px solid ${c.color}" onclick="navigateTo('course','${c.id}')">
            <div class="course-card-icon">${c.icon}</div>
            <h3>${c.title}</h3>
            <p class="course-card-sub">${c.subtitle}</p>
            <p class="course-card-count">${c.thinkerIds.length} thinkers &middot; ${c.lessons.length} lessons</p>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Featured Thinkers</h2>
      <div class="thinker-row">
        ${['aquinas','augustine','lewis','pascal','plantinga','lennox','keller','montgomery','menuge','bahnsen'].map(id => {
          const t = THINKERS[id];
          return `
            <div class="thinker-chip" onclick="navigateTo('thinker','${id}')">
              <div class="thinker-chip-avatar">${t.name.charAt(0)}</div>
              <div>
                <strong>${t.name}</strong>
                <span>${t.years}</span>
              </div>
            </div>`;
        }).join('')}
      </div>
    </section>
  `);
}

// ── Courses list ────────────────────────────────────────────────────────────
function renderCourses() {
  setContent(`
    <section class="section page-top">
      <h1 class="page-title">Courses</h1>
      <p class="page-desc">Each course follows a distinct apologetic method. Choose one to explore its lessons and the thinkers who shaped it.</p>
      <div class="course-list">
        ${COURSES.map(c => `
          <div class="course-list-item" onclick="navigateTo('course','${c.id}')">
            <div class="course-list-icon" style="background:${c.color}">${c.icon}</div>
            <div class="course-list-body">
              <h2>${c.title}</h2>
              <p class="course-list-sub">${c.subtitle}</p>
              <p>${c.description.substring(0, 180)}...</p>
              <div class="course-list-meta">
                <span>${c.lessons.length} lessons</span>
                <span>${c.thinkerIds.length} thinkers</span>
              </div>
            </div>
            <div class="course-list-arrow">&rarr;</div>
          </div>
        `).join('')}
      </div>
    </section>
  `);
}

// ── Single course ───────────────────────────────────────────────────────────
function renderCourse(courseId) {
  const c = COURSES.find(x => x.id === courseId);
  if (!c) return renderCourses();
  setContent(`
    <section class="course-hero" style="background:${c.color}">
      <div class="course-hero-inner">
        <div class="course-hero-icon">${c.icon}</div>
        <h1>${c.title}</h1>
        <p>${c.subtitle}</p>
      </div>
    </section>

    <section class="section">
      <div class="course-detail-grid">
        <div class="course-detail-main">
          <h2>Overview</h2>
          <p>${c.description}</p>
          <div class="method-box">
            <h3>Method</h3>
            <p>${c.method}</p>
          </div>

          ${renderCourseLessons(c)}
        </div>

        <aside class="course-detail-side">
          <h3>Key Thinkers</h3>
          <div class="side-thinkers">
            ${c.thinkerIds.map(id => {
              const t = THINKERS[id];
              return `
                <div class="side-thinker" onclick="showThinkerPanel('${id}', '${c.id}')">
                  <div class="side-thinker-avatar">${t.name.charAt(0)}</div>
                  <div>
                    <strong>${t.name}</strong><br>
                    <small>${t.years}</small>
                  </div>
                </div>`;
            }).join('')}
          </div>
        </aside>
      </div>
    </section>

    <div class="back-link">
      <a href="#" onclick="navigateTo('courses')">&larr; All Courses</a>
    </div>
  `);
}

const UNIT_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

function renderCourseLessons(c) {
  const lessonCard = (l, i) => `
    <div class="lesson-card" onclick="navigateTo('lesson',{courseId:'${c.id}',lessonIdx:${i}})">
      <div class="lesson-num">${i + 1}</div>
      <div class="lesson-card-body">
        <h3>${l.title}</h3>
        <p>${l.description.substring(0, 120)}...</p>
        <span class="lesson-thinker-tag" style="background:${c.color}20;color:${c.color}">
          ${THINKERS[l.thinker].name}
        </span>
      </div>
      <div class="lesson-arrow">&rarr;</div>
    </div>`;

  if (!c.units) {
    return `<h2>Lessons</h2>
      <div class="lesson-list">${c.lessons.map(lessonCard).join('')}</div>`;
  }

  return `<h2>Curriculum</h2>
    ${c.units.map((u, ui) => `
      <div class="course-unit">
        <div class="course-unit-head">
          <span class="course-unit-label" style="background:${c.color}">Unit ${UNIT_NUMERALS[ui] || ui + 1}</span>
          <h3>${u.title}</h3>
        </div>
        <div class="course-unit-ideas">
          <span class="course-unit-ideas-label">Core ideas</span>
          <ul>${u.coreIdeas.map(idea => `<li>${idea}</li>`).join('')}</ul>
        </div>
        <div class="lesson-list">${u.lessonIdxs.map(i => lessonCard(c.lessons[i], i)).join('')}</div>
      </div>
    `).join('')}`;
}

// ── Single lesson ───────────────────────────────────────────────────────────
function renderLesson(courseId, lessonIdx) {
  const c = COURSES.find(x => x.id === courseId);
  if (!c) return renderCourses();
  const l = c.lessons[lessonIdx];
  const t = THINKERS[l.thinker];

  const prevLesson = lessonIdx > 0 ? lessonIdx - 1 : null;
  const nextLesson = lessonIdx < c.lessons.length - 1 ? lessonIdx + 1 : null;

  // Find related books for this lesson's thinker
  const lessonBooks = typeof BOOKS !== 'undefined' ? BOOKS.filter(b => b.thinkerId === l.thinker) : [];

  setContent(`
    <section class="section page-top">
      <div class="breadcrumb">
        <a href="#" onclick="navigateTo('courses')">Courses</a> &rsaquo;
        <a href="#" onclick="navigateTo('course','${c.id}')">${c.title}</a> &rsaquo;
        <span>Lesson ${lessonIdx + 1}</span>
      </div>

      <div class="lesson-detail">
        <div class="lesson-detail-header" style="border-left: 4px solid ${c.color}">
          <span class="lesson-badge" style="background:${c.color}">Lesson ${lessonIdx + 1}</span>
          <h1>${l.title}</h1>
          <p class="lesson-desc">${l.description}</p>
        </div>

        <div class="lesson-thinker-box" onclick="showThinkerPanel('${l.thinker}', '${c.id}')">
          <div class="lesson-thinker-avatar" style="background:${c.color}">${t.name.charAt(0)}</div>
          <div>
            <h3>Featured Thinker: ${t.name}</h3>
            <p>${t.years}</p>
            <p>${t.bio.substring(0, 150)}...</p>
          </div>
        </div>

        ${l.keyQuote ? `
          <blockquote class="lesson-quote" style="border-left-color:${c.color}">
            <p>"${l.keyQuote}"</p>
            <cite>- ${l.quoteSource}</cite>
          </blockquote>
        ` : ''}

        ${l.topics && l.topics.length ? `
          <h2>Topics Covered</h2>
          <div class="topic-list">
            ${l.topics.map((topic, i) => `
              <div class="topic-item">
                <div class="topic-num">${i + 1}</div>
                <p>${topic}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <h2>Core Ideas</h2>
        <div class="ideas-grid">
          ${t.keyIdeas.map(idea => `
            <div class="idea-card">
              <p>${idea}</p>
            </div>
          `).join('')}
        </div>

        ${l.learningObjectives && l.learningObjectives.length ? `
          <h2>Learning Objectives</h2>
          <div class="lesson-context-box" style="border-left-color:${c.color}">
            <ul class="objectives-list">
              ${l.learningObjectives.map(o => `<li>${o}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${l.exposition ? `
          <h2>Core Teaching</h2>
          <div class="lesson-exposition">
            ${(Array.isArray(l.exposition) ? l.exposition : [l.exposition]).map(para => `<p>${para}</p>`).join('')}
          </div>
        ` : ''}

        ${l.scripture && l.scripture.length ? `
          <h2>Scripture & Exegesis</h2>
          <div class="reading-list">
            ${l.scripture.map(s => `
              <div class="reading-item">
                <div class="reading-icon">&#x271D;</div>
                <div>
                  <strong>${s.reference}</strong>
                  <p><em>"${s.text}"</em></p>
                  <p>${s.exegesis}</p>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${l.workedExample ? `
          <h2>Worked Example</h2>
          <div class="lesson-context-box" style="border-left-color:${c.color}">
            <p>${l.workedExample}</p>
          </div>
        ` : ''}

        ${l.historicalContext ? `
          <h2>Historical Context</h2>
          <div class="lesson-context-box" style="border-left-color:${c.color}">
            <p>${l.historicalContext}</p>
          </div>
        ` : ''}

        ${l.commonObjections && l.commonObjections.length ? `
          <h2>Common Objections & Responses</h2>
          <div class="objections-list">
            ${l.commonObjections.map(obj => `
              <details class="objection-item">
                <summary><strong>Objection:</strong> ${obj.objection}</summary>
                <div class="objection-response">
                  <strong>Response:</strong> ${obj.response}
                </div>
              </details>
            `).join('')}
          </div>
        ` : ''}

        ${l.discussionQuestions && l.discussionQuestions.length ? `
          <h2>Discussion Questions</h2>
          <div class="discussion-questions">
            ${l.discussionQuestions.map((q, i) => `
              <div class="dq-item">
                <span class="dq-num">${i + 1}</span>
                <p>${q}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${l.quiz && l.quiz.length ? `
          <h2>Self-Check Quiz</h2>
          <div class="objections-list">
            ${l.quiz.map((q, i) => `
              <details class="objection-item">
                <summary><strong>Q${i + 1}.</strong> ${q.question}</summary>
                <div class="objection-response">
                  <strong>Answer:</strong> ${q.answer}
                </div>
              </details>
            `).join('')}
          </div>
        ` : ''}

        ${l.readingList && l.readingList.length ? `
          <h2>Reading Assignments</h2>
          <div class="reading-list">
            ${l.readingList.map(r => {
              const norm = s => (s || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
              const match = BOOKS.find(b => norm(b.title) === norm(r.title));
              const body = r.detail || [r.author ? `<em>${r.author}</em>` : '', r.note || ''].filter(Boolean).join(' - ');
              if (match) {
                return `
                  <div class="reading-item reading-item-link" onclick="navigateTo('book','${match.id}')" role="link" tabindex="0">
                    <div class="reading-icon">&#x1F4D6;</div>
                    <div>
                      <strong>${r.title}</strong> <span class="reading-badge">In Library &rsaquo;</span>
                      <p>${body}</p>
                    </div>
                  </div>
                `;
              }
              const query = encodeURIComponent(`${r.title} ${r.author || ''}`.trim());
              const url = `https://www.google.com/search?tbm=bks&q=${query}`;
              return `
                <a class="reading-item reading-item-link" href="${url}" target="_blank" rel="noopener">
                  <div class="reading-icon">&#x1F4D6;</div>
                  <div>
                    <strong>${r.title}</strong> <span class="reading-badge reading-badge-ext">Find a copy &#x2197;</span>
                    <p>${body}</p>
                  </div>
                </a>
              `;
            }).join('')}
          </div>
        ` : ''}

        ${lessonBooks.length ? `
          <h2>Books for Further Study</h2>
          <div class="lesson-books-row">
            ${lessonBooks.slice(0, 4).map(b => `
              <div class="lesson-book-card" onclick="navigateTo('book','${b.id}')">
                <div class="lesson-book-cover">
                  ${b.cover ? `<img src="${b.cover}" alt="${b.title}" onerror="this.parentElement.innerHTML='<span>${b.title.charAt(0)}</span>'" />` : `<span>${b.title.charAt(0)}</span>`}
                </div>
                <strong>${b.title}</strong>
                <small>${b.year}</small>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div class="lesson-nav">
          ${prevLesson !== null
            ? `<button class="btn-secondary" onclick="navigateTo('lesson',{courseId:'${c.id}',lessonIdx:${prevLesson}})">&larr; Previous Lesson</button>`
            : `<span></span>`}
          ${nextLesson !== null
            ? `<button class="btn-primary" onclick="navigateTo('lesson',{courseId:'${c.id}',lessonIdx:${nextLesson}})">Next Lesson &rarr;</button>`
            : `<button class="btn-primary" onclick="navigateTo('course','${c.id}')">Back to Course</button>`}
        </div>
      </div>
    </section>
  `);
}

// ── Thinkers list ───────────────────────────────────────────────────────────
function renderThinkers() {
  const ids = Object.keys(THINKERS);
  setContent(`
    <section class="section page-top">
      <h1 class="page-title">Thinkers</h1>
      <p class="page-desc">The philosophers, theologians, and apologists whose work forms the backbone of this academy.</p>
      <div class="thinker-grid">
        ${ids.map(id => {
          const t = THINKERS[id];
          const courses = COURSES.filter(c => c.thinkerIds.includes(id));
          return `
            <div class="thinker-card" onclick="navigateTo('thinker','${id}')">
              <div class="thinker-card-avatar">${t.name.charAt(0)}</div>
              <h3>${t.name}</h3>
              <p class="thinker-card-years">${t.years}</p>
              <p class="thinker-card-bio">${t.bio.substring(0, 100)}...</p>
              <div class="thinker-card-tags">
                ${courses.map(c => `<span class="tag" style="background:${c.color}20;color:${c.color}">${c.title.replace(' Apologetics','').replace(' & Jurisprudential','')}</span>`).join('')}
              </div>
            </div>`;
        }).join('')}
      </div>
    </section>
  `);
}

// ── Single thinker ──────────────────────────────────────────────────────────
function renderThinker(thinkerId) {
  const t = THINKERS[thinkerId];
  if (!t) return renderThinkers();
  const courses = COURSES.filter(c => c.thinkerIds.includes(thinkerId));
  const lessons = [];
  COURSES.forEach(c => {
    c.lessons.forEach((l, i) => {
      if (l.thinker === thinkerId) lessons.push({ course: c, lesson: l, idx: i });
    });
  });

  setContent(`
    <section class="section page-top">
      <div class="breadcrumb">
        <a href="#" onclick="navigateTo('thinkers')">Thinkers</a> &rsaquo;
        <span>${t.name}</span>
      </div>

      <div class="thinker-profile">
        <div class="thinker-profile-header">
          <div class="thinker-profile-avatar">${t.name.charAt(0)}</div>
          <div>
            <h1>${t.name}</h1>
            <p class="thinker-profile-years">${t.years}</p>
          </div>
        </div>

        <p class="thinker-profile-bio">${t.bio}</p>

        <div class="thinker-detail-grid">
          <div>
            <h2>Key Works</h2>
            <ul class="works-list">
              ${t.keyWorks.map(w => `<li>${w}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h2>Core Ideas</h2>
            <div class="ideas-grid compact">
              ${t.keyIdeas.map(idea => `
                <div class="idea-card">
                  <p>${idea}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <h2>Appears In</h2>
        <div class="appears-in">
          ${courses.map(c => `
            <div class="appears-in-course" onclick="navigateTo('course','${c.id}')" style="border-left:4px solid ${c.color}">
              <span class="course-hero-icon-sm">${c.icon}</span>
              <div>
                <strong>${c.title}</strong>
                <p>${c.subtitle}</p>
              </div>
            </div>
          `).join('')}
        </div>

        ${lessons.length ? `
          <h2>Featured Lessons</h2>
          <div class="lesson-list">
            ${lessons.map(({ course: c, lesson: l, idx }) => `
              <div class="lesson-card" onclick="navigateTo('lesson',{courseId:'${c.id}',lessonIdx:${idx}})">
                <div class="lesson-num" style="background:${c.color}">${idx + 1}</div>
                <div class="lesson-card-body">
                  <h3>${l.title}</h3>
                  <p>${l.description.substring(0, 100)}...</p>
                  <span class="lesson-thinker-tag" style="background:${c.color}20;color:${c.color}">${c.title}</span>
                </div>
                <div class="lesson-arrow">&rarr;</div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </section>
  `);
}

// ── Books list ──────────────────────────────────────────────────────────────
function renderBooks() {
  const categories = [...new Set(BOOKS.map(b => b.category))].sort();
  const sortedBooks = [...BOOKS].sort((a, b) => a.title.localeCompare(b.title));

  setContent(`
    <section class="section page-top">
      <h1 class="page-title">Books</h1>
      <p class="page-desc">Essential reading in Christian apologetics - from ancient classics to modern masterworks. Each book links to where you can find it online.</p>

      <div class="free-library-banner" onclick="navigateTo('free-library')">
        <span class="free-library-banner-icon">&#x1F4D6;</span>
        <div>
          <strong>Free Library</strong>
          <p>${BOOKS.filter(b => b.freePdf).length} public-domain works available to read free, right now - legally, in full.</p>
        </div>
        <span class="free-library-banner-arrow">&rarr;</span>
      </div>

      <div class="book-filters">
        <button class="book-filter active" onclick="filterBooks('all', this)">All</button>
        ${categories.map(cat => `<button class="book-filter" onclick="filterBooks('${cat.replace(/'/g, "\\'")}', this)">${cat}</button>`).join('')}
      </div>

      <div class="book-grid" id="bookGrid">
        ${sortedBooks.map(b => {
          const t = THINKERS[b.thinkerId];
          return `
            <div class="book-card" data-category="${b.category}" onclick="navigateTo('book','${b.id}')">
              <div class="book-card-cover">
                ${b.cover ? `<img src="${b.cover}" alt="${b.title}" onerror="this.parentElement.innerHTML='<div class=\\'book-card-placeholder\\'>${b.title.charAt(0)}</div>'" />` : `<div class="book-card-placeholder">${b.title.charAt(0)}</div>`}
              </div>
              <div class="book-card-body">
                <h3>${b.title}</h3>
                <p class="book-card-author">${b.author}</p>
                <p class="book-card-year">${b.year}</p>
                <span class="book-card-cat">${b.category}</span>
                ${b.freePdf ? `<span class="book-card-free">&#x1F4D6; Free PDF</span>` : ''}
              </div>
            </div>`;
        }).join('')}
      </div>
    </section>
  `);
}

function filterBooks(category, btn) {
  document.querySelectorAll('.book-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.book-card').forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// ── Free Library ────────────────────────────────────────────────────────────
function renderFreeLibrary() {
  const free = [...BOOKS.filter(b => b.freePdf)].sort((a, b) => a.year - b.year);
  const sourceCounts = {};
  free.forEach(b => { sourceCounts[b.freePdf.source] = (sourceCounts[b.freePdf.source] || 0) + 1; });

  setContent(`
    <section class="section page-top">
      <div class="breadcrumb">
        <a href="#" onclick="navigateTo('books')">Books</a> &rsaquo;
        <span>Free Library</span>
      </div>

      <h1 class="page-title">Free Library</h1>
      <p class="page-desc">
        ${free.length} works on this reading list have entered the public domain and can be read, downloaded, and
        shared free of charge, in full, with no login and no catch. Every link below points to a legitimate
        source - Project Gutenberg, the Christian Classics Ethereal Library, or the Internet Archive - never a
        scraper or piracy site. Nothing here is under copyright; nothing here needed permission to post.
      </p>

      <div class="free-library-sources">
        ${Object.entries(sourceCounts).map(([src, n]) => `<span class="free-library-source-chip">${src} <b>${n}</b></span>`).join('')}
      </div>

      <div class="free-library-list">
        ${free.map(b => {
          const t = THINKERS[b.thinkerId];
          return `
            <a class="free-library-item" href="${b.freePdf.url}" target="_blank" rel="noopener">
              <div class="free-library-item-cover">
                ${b.cover ? `<img src="${b.cover}" alt="${b.title}" onerror="this.parentElement.innerHTML='<div class=\\'book-card-placeholder\\'>${b.title.charAt(0)}</div>'" />` : `<div class="book-card-placeholder">${b.title.charAt(0)}</div>`}
              </div>
              <div class="free-library-item-body">
                <h3>${b.title}</h3>
                <p class="book-card-author">${b.author}${t ? ` &middot; ${t.years}` : ''} &middot; ${b.year < 0 ? Math.abs(b.year) + ' BC' : b.year}</p>
                <p class="free-library-item-note">${b.freePdf.note || ''}</p>
                <span class="free-library-item-source">${b.freePdf.source}</span>
              </div>
              <span class="free-pdf-box-arrow">&#x2197;</span>
            </a>
          `;
        }).join('')}
      </div>
    </section>
  `);
}

// ── Single book ─────────────────────────────────────────────────────────────
function renderBook(bookId) {
  const b = BOOKS.find(x => x.id === bookId);
  if (!b) return renderBooks();
  const t = THINKERS[b.thinkerId];
  const searchQuery = encodeURIComponent(`${b.title} ${b.author}`);
  const isbnClean = b.isbn.replace(/-/g, '');

  // Other books by same thinker
  const relatedBooks = BOOKS.filter(x => x.thinkerId === b.thinkerId && x.id !== b.id);

  // Courses this thinker appears in
  const courses = COURSES.filter(c => c.thinkerIds.includes(b.thinkerId));

  setContent(`
    <section class="section page-top">
      <div class="breadcrumb">
        <a href="#" onclick="navigateTo('books')">Books</a> &rsaquo;
        <span>${b.title}</span>
      </div>

      <div class="book-detail">
        <div class="book-detail-header">
          <div class="book-detail-cover">
            ${b.cover ? `<img src="${b.cover}" alt="${b.title}" onerror="this.parentElement.innerHTML='<div class=\\'book-detail-placeholder\\'>${b.title.charAt(0)}</div>'" />` : `<div class="book-detail-placeholder">${b.title.charAt(0)}</div>`}
          </div>
          <div class="book-detail-info">
            <h1>${b.title}</h1>
            <p class="book-detail-author" onclick="navigateTo('thinker','${b.thinkerId}')">${b.author} (${t.years})</p>
            <p class="book-detail-year">First published: ${b.year}</p>
            <span class="book-card-cat">${b.category}</span>
            <p class="book-detail-desc">${b.description}</p>

            ${b.freePdf ? `
              <a class="free-pdf-box" href="${b.freePdf.url}" target="_blank" rel="noopener">
                <span class="free-pdf-box-icon">&#x1F4D6;</span>
                <div>
                  <strong>Read free, in full - it's public domain</strong>
                  <p>Hosted by ${b.freePdf.source}. ${b.freePdf.note || ''}</p>
                </div>
                <span class="free-pdf-box-arrow">&#x2197;</span>
              </a>
            ` : ''}

            <div class="book-links">
              <h3>Find This Book</h3>
              <div class="book-links-grid">
                <a href="https://www.amazon.com/s?k=${searchQuery}" target="_blank" rel="noopener" class="book-link">
                  <span class="book-link-icon">&#x1F4E6;</span>
                  <span>Amazon</span>
                </a>
                <a href="https://www.christianbook.com/page/search?search_term=${searchQuery}" target="_blank" rel="noopener" class="book-link">
                  <span class="book-link-icon">&#x271E;</span>
                  <span>Christianbook</span>
                </a>
                <a href="https://openlibrary.org/isbn/${isbnClean}" target="_blank" rel="noopener" class="book-link">
                  <span class="book-link-icon">&#x1F4D6;</span>
                  <span>Open Library</span>
                </a>
                <a href="https://www.worldcat.org/search?q=isbn:${isbnClean}" target="_blank" rel="noopener" class="book-link">
                  <span class="book-link-icon">&#x1F3DB;</span>
                  <span>WorldCat (Libraries)</span>
                </a>
                <a href="https://www.google.com/search?tbm=bks&q=${searchQuery}" target="_blank" rel="noopener" class="book-link">
                  <span class="book-link-icon">&#x1F50D;</span>
                  <span>Google Books</span>
                </a>
                <a href="https://www.thriftbooks.com/browse/?b.search=${searchQuery}" target="_blank" rel="noopener" class="book-link">
                  <span class="book-link-icon">&#x1F4B0;</span>
                  <span>ThriftBooks</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="book-detail-sidebar">
          <div class="book-about-author" onclick="navigateTo('thinker','${b.thinkerId}')">
            <div class="side-thinker-avatar">${t.name.charAt(0)}</div>
            <div>
              <strong>About the Author</strong><br>
              <p>${t.bio.substring(0, 180)}...</p>
            </div>
          </div>

          ${relatedBooks.length ? `
            <h3>More by ${t.name}</h3>
            <div class="related-books">
              ${relatedBooks.map(rb => `
                <div class="related-book" onclick="navigateTo('book','${rb.id}')">
                  <strong>${rb.title}</strong>
                  <span>${rb.year}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${courses.length ? `
            <h3>Related Courses</h3>
            <div class="appears-in">
              ${courses.map(c => `
                <div class="appears-in-course" onclick="navigateTo('course','${c.id}')" style="border-left:4px solid ${c.color}">
                  <span class="course-hero-icon-sm">${c.icon}</span>
                  <div>
                    <strong>${c.title}</strong>
                    <p>${c.subtitle}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    </section>
  `);
}

// ── About ───────────────────────────────────────────────────────────────────
function renderAbout() {
  setContent(`
    <section class="section page-top">
      <h1 class="page-title">About</h1>
      <div class="about-content">
        <p>Apologetics Academy is a learning platform dedicated to equipping Christians with the intellectual tools to defend and commend their faith. We believe that faith and reason are not enemies but allies - and that the great tradition of Christian thought, stretching from Aristotle and Aquinas through the Reformers to the present day, provides a rich and rigorous foundation for belief.</p>

        <h2>Our Approach</h2>
        <p>We organize our curriculum around the major <strong>schools of apologetic method</strong>:</p>
        <ul>
          <li><strong>Classical Apologetics</strong> - philosophical proofs from first principles</li>
          <li><strong>Evidential Apologetics</strong> - historical and empirical evidence</li>
          <li><strong>Presuppositional Apologetics</strong> - worldview analysis and transcendental argument</li>
          <li><strong>Cumulative Case</strong> - converging lines of evidence and literary imagination</li>
          <li><strong>Legal-Jurisprudential Apologetics</strong> - courtroom-grade reasoning and human rights</li>
          <li><strong>Science & Faith</strong> - why science points beyond itself to a Creator</li>
          <li><strong>Cultural & Existential Apologetics</strong> - engaging the whole person through culture, story, and desire</li>
          <li><strong>Patristic & Medieval Foundations</strong> - the ancient roots of Christian thought</li>
        </ul>
        <p>Within each school, you'll learn from the <strong>key thinkers</strong> who developed and championed that approach. Each lesson focuses on a specific thinker's contribution, guiding you through their arguments, key works, and core ideas.</p>

        <h2>How to Use This Site</h2>
        <ol>
          <li>Browse the <strong>Courses</strong> page to find an apologetic method that interests you.</li>
          <li>Within each course, follow the <strong>lessons</strong> in order - they build on one another.</li>
          <li>Visit the <strong>Thinkers</strong> page to explore individual philosophers and theologians.</li>
          <li>Each lesson includes recommended <strong>key works</strong> for deeper study.</li>
        </ol>

        <blockquote>
          "The heart cannot rejoice in what the mind rejects." - John Warwick Montgomery
        </blockquote>
      </div>
    </section>
  `);
}

// ── Thinker Panel (inline overlay within courses/lessons) ───────────────────
function showThinkerPanel(thinkerId, courseId) {
  // Prevent the click from bubbling to parent navigations
  if (event) event.stopPropagation();

  const t = THINKERS[thinkerId];
  if (!t) return;

  // Remove any existing panel
  closeThinkerPanel();

  const course = courseId ? COURSES.find(x => x.id === courseId) : null;
  const color = course ? course.color : 'var(--accent)';

  // Lessons this thinker features in (within current course)
  const thinkerLessons = [];
  if (course) {
    course.lessons.forEach((l, i) => {
      if (l.thinker === thinkerId) thinkerLessons.push({ lesson: l, idx: i });
    });
  }

  // Books by this thinker
  const thinkerBooks = typeof BOOKS !== 'undefined' ? BOOKS.filter(b => b.thinkerId === thinkerId) : [];

  const overlay = document.createElement('div');
  overlay.className = 'thinker-panel-overlay';
  overlay.onclick = (e) => { if (e.target === overlay) closeThinkerPanel(); };

  overlay.innerHTML = `
    <div class="thinker-panel">
      <button class="thinker-panel-close" onclick="closeThinkerPanel()">&times;</button>

      <div class="thinker-panel-header">
        <div class="thinker-panel-avatar" style="background:${color}">${t.name.charAt(0)}</div>
        <div>
          <h2>${t.name}</h2>
          <p class="thinker-panel-years">${t.years}</p>
        </div>
      </div>

      <p class="thinker-panel-bio">${t.bio}</p>

      <div class="thinker-panel-section">
        <h3>Core Ideas</h3>
        <div class="thinker-panel-ideas">
          ${t.keyIdeas.map(idea => `<div class="thinker-panel-idea" style="border-left-color:${color}"><p>${idea}</p></div>`).join('')}
        </div>
      </div>

      <div class="thinker-panel-section">
        <h3>Key Works</h3>
        <ul class="works-list">
          ${t.keyWorks.map(w => `<li>${w}</li>`).join('')}
        </ul>
      </div>

      ${thinkerLessons.length ? `
        <div class="thinker-panel-section">
          <h3>Lessons in This Course</h3>
          <div class="thinker-panel-lessons">
            ${thinkerLessons.map(({ lesson: l, idx }) => `
              <div class="thinker-panel-lesson" onclick="closeThinkerPanel(); navigateTo('lesson',{courseId:'${courseId}',lessonIdx:${idx}})">
                <div class="lesson-num" style="background:${color}">${idx + 1}</div>
                <div>
                  <strong>${l.title}</strong>
                  <p>${l.description.substring(0, 80)}...</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${thinkerBooks.length ? `
        <div class="thinker-panel-section">
          <h3>Books</h3>
          <div class="thinker-panel-books">
            ${thinkerBooks.slice(0, 5).map(b => `
              <div class="thinker-panel-book" onclick="closeThinkerPanel(); navigateTo('book','${b.id}')">
                <strong>${b.title}</strong>
                <span>${b.year}</span>
              </div>
            `).join('')}
            ${thinkerBooks.length > 5 ? `<p class="thinker-panel-more">${thinkerBooks.length - 5} more on the Books page</p>` : ''}
          </div>
        </div>
      ` : ''}

      <div class="thinker-panel-footer">
        <a href="#" class="btn-secondary" onclick="closeThinkerPanel(); navigateTo('thinker','${thinkerId}')">View Full Profile &rarr;</a>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  // Trigger animation on next frame
  requestAnimationFrame(() => overlay.classList.add('open'));

  // Close on Escape key
  overlay._keyHandler = (e) => { if (e.key === 'Escape') closeThinkerPanel(); };
  document.addEventListener('keydown', overlay._keyHandler);
}

function closeThinkerPanel() {
  const overlay = document.querySelector('.thinker-panel-overlay');
  if (!overlay) return;
  if (overlay._keyHandler) document.removeEventListener('keydown', overlay._keyHandler);
  overlay.classList.remove('open');
  setTimeout(() => overlay.remove(), 250);
}

// ── Bible ───────────────────────────────────────────────────────────────────
const BIBLE_TRANSLATIONS = {
  kjv: { id: 'kjv', label: 'KJV (King James Version)', note: '' },
  niv: { id: 'web', label: 'NIV (New International Version)', note: 'NIV is copyright-protected; displaying the World English Bible (modern English) as a free stand-in.' },
  esv: { id: 'web', label: 'ESV (English Standard Version)', note: 'ESV is copyright-protected; displaying the World English Bible (modern English) as a free stand-in.' }
};
let BIBLE_STATE = { translation: 'kjv', thinker: 'all', currentBook: null, currentChapter: null };

function parseBibleReference(q) {
  const s = q.trim();
  const sorted = [...BIBLE_BOOKS].sort((a, b) => b.name.length - a.name.length);
  for (const book of sorted) {
    const re = new RegExp('^' + book.name.replace(/\s+/g, '\\s+') + '\\s*(\\d+)?', 'i');
    const m = s.match(re);
    if (m) return { book: book.name, chapter: m[1] ? parseInt(m[1], 10) : 1 };
  }
  return null;
}

// Discrete color buckets - 7 levels
const HEATMAP_BUCKETS = [
  { min:  0, max: 10, color: '#f5efe1', label: '0-10' },
  { min: 11, max: 25, color: '#ecd9a0', label: '11-25' },
  { min: 26, max: 40, color: '#e0bf5f', label: '26-40' },
  { min: 41, max: 55, color: '#c9a227', label: '41-55' },
  { min: 56, max: 70, color: '#9d7d1d', label: '56-70' },
  { min: 71, max: 85, color: '#6e5613', label: '71-85' },
  { min: 86, max: 100, color: '#3f3008', label: '86-100' }
];
function bucketColor(v) {
  for (const b of HEATMAP_BUCKETS) if (v >= b.min && v <= b.max) return b.color;
  return HEATMAP_BUCKETS[0].color;
}

// Per-apologist citation weights (0-100, relative within each thinker).
// Hand-authored from each figure's actual corpus emphasis - e.g. Habermas'
// minimal-facts case lives in 1 Cor 15, Sproul's Holiness of God in Isaiah 6,
// Lennox wrote whole books on Genesis (Seven Days) and Daniel (Against the
// Flow), Keller on Jonah, Kreeft on Ecclesiastes/Job/Song of Solomon.
// Books not listed fall to a faint baseline. Aristotle (null) predates the
// biblical canon and cited no Scripture.
const APOLOGIST_EMPHASIS = {
  aristotle:  null,
  aquinas:    { 'John': 88, 'Romans': 85, 'Psalms': 78, 'Matthew': 72, 'Exodus': 70, 'Hebrews': 68, '1 Corinthians': 62, 'Isaiah': 60, 'Job': 55, 'Genesis': 52, 'Luke': 40, 'Ephesians': 35, 'Galatians': 32, '2 Corinthians': 30, 'Acts': 30, 'Proverbs': 28, 'Colossians': 28, 'Deuteronomy': 25, '1 Timothy': 25 },
  augustine:  { 'Psalms': 95, 'John': 90, 'Genesis': 85, 'Romans': 80, 'Matthew': 60, '1 Corinthians': 55, '1 John': 50, 'Galatians': 45, 'Luke': 35, 'Exodus': 35, 'Isaiah': 30, 'Ephesians': 30, 'Acts': 25, '2 Corinthians': 25 },
  anselm:     { 'Psalms': 85, 'Romans': 55, 'John': 50, 'Hebrews': 45, 'Matthew': 40, 'Isaiah': 35, 'Genesis': 25, '1 Corinthians': 25 },
  grotius:    { 'Matthew': 75, 'John': 70, 'Luke': 65, 'Acts': 60, 'Mark': 55, '1 Corinthians': 50, 'Romans': 45, 'Isaiah': 30, 'Genesis': 25, 'Psalms': 20, 'Daniel': 20 },
  pascal:     { 'Isaiah': 88, 'Matthew': 62, 'Psalms': 60, 'Daniel': 58, 'John': 55, 'Romans': 45, 'Ecclesiastes': 45, 'Genesis': 40, '1 Corinthians': 40, 'Luke': 30, 'Exodus': 25 },
  paley:      { 'Acts': 70, 'Matthew': 65, 'Luke': 60, 'John': 58, 'Mark': 50, '1 Corinthians': 45, 'Romans': 40, 'Psalms': 30, 'Genesis': 25 },
  greenleaf:  { 'Matthew': 85, 'John': 84, 'Luke': 82, 'Mark': 80, 'Acts': 55, '1 Corinthians': 30, 'Romans': 15 },
  chesterton: { 'Job': 80, 'Matthew': 65, 'John': 50, 'Luke': 48, 'Genesis': 45, 'Psalms': 35, 'Ecclesiastes': 30, 'Mark': 25, 'Isaiah': 20 },
  lewis:      { 'Psalms': 88, 'Matthew': 70, 'John': 65, 'Romans': 55, 'Genesis': 50, '1 Corinthians': 48, 'Luke': 45, 'Job': 35, 'Mark': 30, 'Ecclesiastes': 30, 'Isaiah': 30, 'Hebrews': 28, 'Revelation': 25, '2 Corinthians': 20 },
  vantil:     { 'Romans': 92, 'Genesis': 75, 'John': 70, '1 Corinthians': 65, 'Proverbs': 55, 'Colossians': 50, 'Psalms': 45, 'Isaiah': 35, 'Acts': 30, 'Ephesians': 30, 'Matthew': 25 },
  schaeffer:  { 'Genesis': 90, 'Romans': 75, 'John': 60, 'Ecclesiastes': 55, 'Jeremiah': 45, 'Isaiah': 40, 'Psalms': 35, '1 Corinthians': 35, 'Lamentations': 30, 'Matthew': 30, 'Acts': 28, 'Colossians': 25, 'Job': 20 },
  montgomery: { 'Luke': 80, 'Acts': 75, 'John': 72, '1 Corinthians': 70, 'Matthew': 68, 'Mark': 60, 'Romans': 35, 'Galatians': 30, '2 Peter': 25, 'Isaiah': 20 },
  geisler:    { 'Romans': 80, 'John': 75, 'Genesis': 65, 'Matthew': 62, '1 Corinthians': 60, 'Acts': 55, 'Luke': 48, 'Isaiah': 42, 'Psalms': 40, '2 Peter': 40, 'Daniel': 38, 'Hebrews': 35, '2 Timothy': 30, 'Exodus': 28 },
  sproul:     { 'Isaiah': 92, 'Romans': 85, 'John': 62, 'Genesis': 60, 'Ephesians': 55, 'Psalms': 45, 'Matthew': 40, 'Exodus': 40, 'Hebrews': 38, '1 Corinthians': 35, 'Galatians': 30 },
  frame:      { 'Deuteronomy': 78, 'Romans': 72, 'Exodus': 60, 'John': 58, 'Psalms': 55, 'Isaiah': 45, 'Genesis': 42, '1 Corinthians': 38, 'Matthew': 35, 'Proverbs': 30, 'Colossians': 25 },
  bahnsen:    { 'Romans': 88, 'Proverbs': 72, 'Deuteronomy': 68, 'Matthew': 55, '1 Corinthians': 52, 'Exodus': 50, 'Psalms': 48, 'Colossians': 45, 'Leviticus': 40, 'John': 38, 'Genesis': 35, 'Acts': 30, 'Isaiah': 25 },
  plantinga:  { 'Romans': 60, 'Psalms': 30, 'John': 25, 'Genesis': 22, '1 Corinthians': 20, 'Matthew': 18, 'Isaiah': 12 },
  habermas:   { '1 Corinthians': 97, 'Luke': 70, 'Acts': 68, 'John': 65, 'Matthew': 62, 'Mark': 60, 'Galatians': 58, 'Romans': 40, 'Isaiah': 20, 'Psalms': 15, 'Daniel': 10 },
  craig:      { '1 Corinthians': 80, 'Genesis': 70, 'John': 68, 'Luke': 65, 'Mark': 60, 'Matthew': 58, 'Acts': 55, 'Romans': 50, 'Isaiah': 30, 'Psalms': 28, 'Hebrews': 25, 'Daniel': 22, 'Colossians': 20 },
  mcdowell:   { 'Isaiah': 80, 'Matthew': 78, 'John': 72, 'Luke': 68, 'Psalms': 65, '1 Corinthians': 60, 'Daniel': 60, 'Acts': 58, 'Mark': 55, 'Zechariah': 45, 'Micah': 40, 'Romans': 35, 'Genesis': 30, '2 Peter': 20 },
  moreland:   { 'Romans': 65, 'John': 60, '1 Corinthians': 55, 'Matthew': 50, 'Acts': 48, 'Genesis': 45, 'Colossians': 40, 'Luke': 35, 'Hebrews': 30, 'Psalms': 28, '2 Corinthians': 25 },
  keller:     { 'Genesis': 78, 'Luke': 75, 'Jonah': 72, 'Romans': 70, 'John': 65, 'Job': 58, 'Isaiah': 55, 'Psalms': 50, 'Ecclesiastes': 48, 'Matthew': 45, 'Galatians': 45, '1 Corinthians': 42, 'Proverbs': 40, 'Exodus': 30 },
  strobel:    { 'Matthew': 72, 'John': 70, 'Luke': 68, 'Mark': 65, '1 Corinthians': 62, 'Acts': 60, 'Isaiah': 40, 'Romans': 35, 'Psalms': 30, 'Genesis': 28, 'Daniel': 25 },
  wallace:    { 'Mark': 85, 'Matthew': 82, 'Luke': 80, 'John': 78, 'Acts': 65, '1 Corinthians': 45, '2 Peter': 40, '1 Peter': 35, 'Romans': 25, 'Genesis': 20 },
  mcgrath:    { 'John': 70, 'Romans': 65, 'Genesis': 60, 'Psalms': 45, 'Matthew': 42, '1 Corinthians': 40, 'Isaiah': 35, 'Luke': 32, 'Ephesians': 30, 'Job': 25, 'Acts': 25 },
  lennox:     { 'Genesis': 90, 'John': 82, 'Daniel': 75, 'Romans': 55, 'Matthew': 45, '1 Corinthians': 42, 'Psalms': 40, 'Acts': 38, 'Luke': 35, 'Isaiah': 30, 'Proverbs': 25, 'Ecclesiastes': 20 },
  kreeft:     { 'Ecclesiastes': 75, 'Job': 72, 'Matthew': 68, 'Song of Solomon': 65, 'John': 62, 'Psalms': 55, 'Romans': 50, '1 Corinthians': 45, 'Genesis': 40, 'Luke': 38, 'Isaiah': 30, 'Revelation': 28, 'Hebrews': 25 },
  feser:      { 'Romans': 50, 'Exodus': 45, 'John': 40, 'Matthew': 30, 'Psalms': 25, 'Genesis': 22, '1 Corinthians': 20, 'Hebrews': 18 },
  menuge:     { 'Romans': 60, 'John': 55, 'Genesis': 50, '1 Corinthians': 45, 'Matthew': 38, 'Psalms': 32, 'Acts': 28, 'Colossians': 25 },
  groothuis:  { 'Romans': 68, 'John': 62, '1 Corinthians': 55, 'Matthew': 52, 'Genesis': 48, 'Acts': 45, 'Ecclesiastes': 40, 'Psalms': 38, 'Isaiah': 32, 'Luke': 30, 'Proverbs': 25, 'Daniel': 20 },
  turek:      { 'Romans': 62, 'John': 60, 'Genesis': 58, 'Matthew': 52, '1 Corinthians': 48, 'Acts': 42, 'Luke': 40, 'Psalms': 30, 'Isaiah': 28, 'Daniel': 22, '2 Peter': 20 },
  horn:       { 'Matthew': 75, '1 Corinthians': 62, 'John': 58, 'Acts': 55, 'Romans': 48, 'James': 45, 'Luke': 42, 'Galatians': 35, 'Hebrews': 30, '2 Peter': 30, '2 Thessalonians': 25, 'Genesis': 25, 'Psalms': 22 }
};

function getBookUsage(thinkerId, book) {
  if (thinkerId === 'all') return book.usage;
  if (!(thinkerId in APOLOGIST_EMPHASIS)) return Math.round(book.usage * 0.4);
  const weights = APOLOGIST_EMPHASIS[thinkerId];
  if (!weights) return 0;
  if (book.name in weights) return weights[book.name];
  return Math.min(8, Math.round(book.usage * 0.08));
}

function renderBible() {
  setContent(`
    <section class="bible-page">
      <div class="bible-header">
        <h1>The Bible</h1>
        <p class="section-subtitle">Read, search, and study the Scriptures alongside the thinkers who interpret them.</p>
      </div>

      <div class="bible-controls">
        <div class="bible-translation-row">
          <label for="bible-trans">Translation:</label>
          <select id="bible-trans" onchange="bibleSetTranslation(this.value)">
            <option value="kjv" ${BIBLE_STATE.translation==='kjv'?'selected':''}>KJV</option>
            <option value="niv" ${BIBLE_STATE.translation==='niv'?'selected':''}>NIV</option>
            <option value="esv" ${BIBLE_STATE.translation==='esv'?'selected':''}>ESV</option>
          </select>
          <span id="bible-trans-note" class="bible-note">${BIBLE_TRANSLATIONS[BIBLE_STATE.translation].note}</span>
        </div>

        <div class="bible-search-row">
          <input id="bible-search" type="text" placeholder="Search a reference - e.g. John 3:16, Romans 8, Psalm 23:1-6" onkeydown="if(event.key==='Enter')bibleLookup()">
          <button class="btn-primary" onclick="bibleLookup()">Look Up</button>
        </div>

        <details class="bible-advanced">
          <summary>Advanced Search - find a verse when you only remember part of it</summary>
          <div class="bible-adv-body">
            <div class="bible-adv-grid">
              <label>Words / phrase I remember
                <input id="adv-phrase" type="text" placeholder="e.g. all things work together">
              </label>
              <label>Testament
                <select id="adv-testament">
                  <option value="">Any</option>
                  <option value="OT">Old Testament</option>
                  <option value="NT">New Testament</option>
                </select>
              </label>
              <label>Book (optional)
                <select id="adv-book">
                  <option value="">Any</option>
                  ${BIBLE_BOOKS.map(b=>`<option value="${b.name}">${b.name}</option>`).join('')}
                </select>
              </label>
              <label>Match mode
                <select id="adv-mode">
                  <option value="fuzzy">Fuzzy (any of these words)</option>
                  <option value="phrase">Exact phrase</option>
                  <option value="all">All words (any order)</option>
                </select>
              </label>
            </div>
            <button class="btn-primary" onclick="bibleAdvancedSearch()">Search Scripture</button>
            <p class="bible-note">Fuzzy search pulls an entire chapter first, then ranks verses that best match your remembered fragment.</p>
          </div>
        </details>
      </div>

      <div class="bible-heatmap-layout">
        <div class="bible-heatmap-wrap">
          <div class="bible-heatmap-header">
            <h2>Apologist Citation Heatmap</h2>
            <p class="hm-caption" id="hm-caption">Relative frequency with which each book of the Bible is cited across major apologetics works. Click an apologist on the right to filter.</p>
          </div>
          <div id="bible-heatmap-body">${renderBibleHeatmap('all')}</div>
        </div>
        <aside class="apologist-panel">
          <div class="apologist-panel-head">
            <h3>Apologists</h3>
            <button class="apologist-all-btn" onclick="bibleSelectThinker('all')">Show All</button>
          </div>
          <div class="apologist-list">
            ${renderApologistList()}
          </div>
        </aside>
      </div>

      <div id="bible-results" class="bible-results">
        <div class="bible-placeholder">
          <p>Try: <a href="#" onclick="bibleQuick('John 3:16')">John 3:16</a> · <a href="#" onclick="bibleQuick('Romans 8')">Romans 8</a> · <a href="#" onclick="bibleQuick('Psalm 23')">Psalm 23</a> · <a href="#" onclick="bibleQuick('Isaiah 53')">Isaiah 53</a></p>
        </div>
      </div>
    </section>
  `);
}

function renderBibleHeatmap(thinkerId) {
  const ot = BIBLE_BOOKS.filter(b=>b.testament==='OT');
  const nt = BIBLE_BOOKS.filter(b=>b.testament==='NT');
  const cell = b => {
    const v = getBookUsage(thinkerId, b);
    const bg = bucketColor(v);
    const textColor = v >= 56 ? '#fff' : '#2a2a2a';
    const subColor = v >= 56 ? 'rgba(255,255,255,0.8)' : '#555';
    return `<div class="hm-cell" data-book="${b.name}" style="background:${bg};color:${textColor}" title="${b.name} - citation weight ${v}/100" onclick="bibleQuick('${b.name} 1')">
      <span class="hm-abbr">${b.abbr}</span>
      <span class="hm-val" style="color:${subColor}">${v}</span>
    </div>`;
  };
  const legend = HEATMAP_BUCKETS.map(bk =>
    `<div class="hm-legend-chip"><span class="hm-legend-swatch" style="background:${bk.color}"></span>${bk.label}</div>`
  ).join('');
  return `
    <div class="hm-legend">${legend}</div>
    <div class="hm-row-label">Old Testament</div>
    <div class="hm-grid">${ot.map(cell).join('')}</div>
    <div class="hm-row-label">New Testament</div>
    <div class="hm-grid">${nt.map(cell).join('')}</div>
  `;
}

function renderApologistList() {
  const ids = Object.keys(APOLOGIST_EMPHASIS).filter(id => THINKERS[id]);
  const sorted = ids.sort((a,b) => THINKERS[a].name.localeCompare(THINKERS[b].name));
  return sorted.map(id => `
    <button class="apologist-chip" data-id="${id}" onclick="bibleSelectThinker('${id}')">
      <span class="apologist-chip-name">${THINKERS[id].name}</span>
      <span class="apologist-chip-years">${THINKERS[id].years}</span>
    </button>
  `).join('');
}

function bibleSelectThinker(thinkerId) {
  BIBLE_STATE.thinker = thinkerId;
  const body = document.getElementById('bible-heatmap-body');
  if (body) body.innerHTML = renderBibleHeatmap(thinkerId);
  const cap = document.getElementById('hm-caption');
  if (cap) {
    if (thinkerId === 'all') {
      cap.textContent = 'Relative frequency with which each book of the Bible is cited across major apologetics works. Click an apologist on the right to filter.';
    } else if (!APOLOGIST_EMPHASIS[thinkerId]) {
      cap.textContent = `${THINKERS[thinkerId].name} predates the biblical canon and cited no Scripture; he is included for his philosophical influence on later apologists.`;
    } else {
      cap.textContent = `Showing the biblical books most referenced by ${THINKERS[thinkerId].name} across their books and papers.`;
    }
  }
  document.querySelectorAll('.apologist-chip').forEach(el => {
    el.classList.toggle('active', el.dataset.id === thinkerId);
  });
}

function bibleSetTranslation(val) {
  BIBLE_STATE.translation = val;
  const note = document.getElementById('bible-trans-note');
  if (note) note.textContent = BIBLE_TRANSLATIONS[val].note;
}

function bibleRefSuggest(input) {
  const wrap = input.parentElement;
  const box = wrap && wrap.querySelector('.bible-current-ref-suggest');
  if (!box) return;
  const raw = (input.value || '').trim();
  const bookPart = raw.replace(/\s+\d.*$/, '').toLowerCase();
  if (!bookPart) { box.hidden = true; box.innerHTML = ''; return; }
  const matches = BIBLE_BOOKS.filter(b => b.name.toLowerCase().startsWith(bookPart)).slice(0, 8);
  if (!matches.length) { box.hidden = true; box.innerHTML = ''; return; }
  box.innerHTML = matches.map(b =>
    `<div class="bible-current-ref-item" onmousedown="event.preventDefault();bibleRefPick('${b.name}')">${escapeHtml(b.name)}</div>`
  ).join('');
  box.hidden = false;
}
function bibleRefPick(name) {
  bibleRefHide();
  bibleQuick(`${name} 1`);
}
function bibleRefSubmit(raw) {
  const val = (raw || '').trim();
  if (!val) return;
  const hasNumber = /\d/.test(val);
  const match = BIBLE_BOOKS.find(b => b.name.toLowerCase() === val.toLowerCase());
  if (match && !hasNumber) { bibleQuick(`${match.name} 1`); return; }
  const prefix = BIBLE_BOOKS.find(b => b.name.toLowerCase().startsWith(val.toLowerCase()));
  if (prefix && !hasNumber) { bibleQuick(`${prefix.name} 1`); return; }
  bibleQuick(val);
}
function bibleRefHide() {
  document.querySelectorAll('.bible-current-ref-suggest').forEach(el => { el.hidden = true; el.innerHTML = ''; });
}

function bibleQuick(ref) {
  const input = document.getElementById('bible-search');
  if (input) input.value = ref;
  bibleLookup();
}

function bibleGoChapter(delta) {
  if (!BIBLE_STATE.currentBook) return;
  const idx = BIBLE_BOOKS.findIndex(b => b.name === BIBLE_STATE.currentBook);
  if (idx < 0) return;
  let book = BIBLE_BOOKS[idx];
  let ch = BIBLE_STATE.currentChapter + delta;
  if (ch < 1) {
    if (idx === 0) return;
    book = BIBLE_BOOKS[idx - 1];
    ch = book.chapters;
  } else if (ch > book.chapters) {
    if (idx === BIBLE_BOOKS.length - 1) return;
    book = BIBLE_BOOKS[idx + 1];
    ch = 1;
  }
  bibleQuick(`${book.name} ${ch}`);
}

async function bibleLookup() {
  const q = (document.getElementById('bible-search').value || '').trim();
  if (!q) return;
  const results = document.getElementById('bible-results');
  results.innerHTML = `<div class="bible-loading">Loading ${escapeHtml(q)}…</div>`;
  const trans = BIBLE_TRANSLATIONS[BIBLE_STATE.translation];

  const parsed = parseBibleReference(q);
  if (parsed) {
    BIBLE_STATE.currentBook = parsed.book;
    BIBLE_STATE.currentChapter = parsed.chapter;
    document.querySelectorAll('.hm-cell').forEach(el => {
      el.classList.toggle('hm-cell-active', el.dataset.book === parsed.book);
    });
  } else {
    BIBLE_STATE.currentBook = null;
    BIBLE_STATE.currentChapter = null;
    document.querySelectorAll('.hm-cell').forEach(el => el.classList.remove('hm-cell-active'));
  }

  try {
    const url = `https://bible-api.com/${encodeURIComponent(q)}?translation=${trans.id}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Not found');
    const data = await res.json();
    results.innerHTML = renderBiblePassage(data, q);
  } catch (e) {
    results.innerHTML = `<div class="bible-error">Could not find "<strong>${escapeHtml(q)}</strong>". Try a reference like <em>John 3:16</em> or <em>Romans 8:28</em>.</div>`;
  }
  results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderBiblePassage(data, q) {
  const trans = BIBLE_TRANSLATIONS[BIBLE_STATE.translation];
  const verses = (data.verses || []).map(v => {
    const text = v.text.trim();
    const ref = `${BIBLE_STATE.currentBook || (data.reference || '').split(' ').slice(0,-1).join(' ')} ${v.chapter}:${v.verse}`.trim();
    const payload = encodeURIComponent(JSON.stringify({ ref, text }));
    return `
    <div class="bible-verse" data-verse-payload="${payload}">
      <span class="bible-vnum" onclick="copyVerse(this)" title="Click to copy verse">${v.chapter}:${v.verse}</span>
      <span class="bible-vtext">${escapeHtml(text)}</span>
    </div>`;
  }).join('');

  let prevDisabled = true, nextDisabled = true;
  let prevLabel = '', nextLabel = '';
  if (BIBLE_STATE.currentBook) {
    const idx = BIBLE_BOOKS.findIndex(b => b.name === BIBLE_STATE.currentBook);
    const book = BIBLE_BOOKS[idx];
    const ch = BIBLE_STATE.currentChapter;
    if (ch > 1) { prevDisabled = false; prevLabel = `${book.name} ${ch - 1}`; }
    else if (idx > 0) { prevDisabled = false; prevLabel = `${BIBLE_BOOKS[idx-1].name} ${BIBLE_BOOKS[idx-1].chapters}`; }
    if (ch < book.chapters) { nextDisabled = false; nextLabel = `${book.name} ${ch + 1}`; }
    else if (idx < BIBLE_BOOKS.length - 1) { nextDisabled = false; nextLabel = `${BIBLE_BOOKS[idx+1].name} 1`; }
  }

  return `
    <div class="bible-passage-container">
      <button class="bible-nav-btn bible-nav-prev" ${prevDisabled ? 'disabled' : ''} onclick="bibleGoChapter(-1)" title="${prevLabel ? 'Previous: ' + escapeHtml(prevLabel) : 'No previous chapter'}" aria-label="Previous chapter">
        <span class="bible-nav-arrow">&#x2039;</span>
        <span class="bible-nav-label">Prev</span>
      </button>
      <div class="bible-passage">
        <div class="bible-current-ref-wrap">
          <input type="text" class="bible-current-ref" value="${escapeHtml((BIBLE_STATE.currentBook || '') + (BIBLE_STATE.currentChapter ? ' ' + BIBLE_STATE.currentChapter : ''))}" aria-label="Current book and chapter - edit and press Enter to jump" placeholder="e.g. John 3" autocomplete="off" oninput="bibleRefSuggest(this)" onkeydown="if(event.key==='Enter'){event.preventDefault();bibleRefHide();bibleRefSubmit(this.value);}" onblur="setTimeout(bibleRefHide, 150)" onfocus="bibleRefSuggest(this)" />
          <div class="bible-current-ref-suggest" hidden></div>
        </div>
        <div class="bible-passage-head">
          <h3>${escapeHtml(data.reference || q)}</h3>
          <span class="bible-trans-badge">${trans.label}</span>
        </div>
        ${verses || `<p>${escapeHtml(data.text || '')}</p>`}
      </div>
      <button class="bible-nav-btn bible-nav-next" ${nextDisabled ? 'disabled' : ''} onclick="bibleGoChapter(1)" title="${nextLabel ? 'Next: ' + escapeHtml(nextLabel) : 'No next chapter'}" aria-label="Next chapter">
        <span class="bible-nav-arrow">&#x203A;</span>
        <span class="bible-nav-label">Next</span>
      </button>
    </div>
  `;
}

async function bibleAdvancedSearch() {
  const phrase = (document.getElementById('adv-phrase').value || '').trim();
  const testament = document.getElementById('adv-testament').value;
  const bookFilter = document.getElementById('adv-book').value;
  const mode = document.getElementById('adv-mode').value;
  if (!phrase) return;
  const results = document.getElementById('bible-results');
  const trans = BIBLE_TRANSLATIONS[BIBLE_STATE.translation];

  let pool = BIBLE_BOOKS;
  if (testament) pool = pool.filter(b=>b.testament===testament);
  if (bookFilter) pool = pool.filter(b=>b.name===bookFilter);
  pool = [...pool].sort((a,b)=>b.usage-a.usage).slice(0, bookFilter ? pool.length : 8);

  results.innerHTML = `<div class="bible-loading">Searching ${pool.length} book(s) for "<em>${escapeHtml(phrase)}</em>"… this may take a few seconds.</div>`;

  const chapterTargets = [];
  pool.forEach(b => {
    const maxCh = bookFilter ? b.chapters : Math.min(b.chapters, 5);
    for (let c=1; c<=maxCh; c++) chapterTargets.push({book:b.name, chapter:c});
  });

  const matches = [];
  const words = phrase.toLowerCase().split(/\s+/).filter(Boolean);
  const batchSize = 6;
  for (let i=0; i<chapterTargets.length; i+=batchSize) {
    const batch = chapterTargets.slice(i, i+batchSize);
    const datas = await Promise.all(batch.map(async t => {
      try {
        const r = await fetch(`https://bible-api.com/${encodeURIComponent(t.book+' '+t.chapter)}?translation=${trans.id}`);
        if (!r.ok) return null;
        return { t, data: await r.json() };
      } catch { return null; }
    }));
    datas.forEach(entry => {
      if (!entry || !entry.data.verses) return;
      entry.data.verses.forEach(v => {
        const text = v.text.toLowerCase();
        let score = 0;
        if (mode === 'phrase') {
          if (text.includes(phrase.toLowerCase())) score = 100;
        } else if (mode === 'all') {
          if (words.every(w => text.includes(w))) score = 80 + words.length;
        } else {
          score = words.reduce((s,w)=> s + (text.includes(w) ? 1 : 0), 0);
        }
        if (score > 0) matches.push({ ref:`${entry.t.book} ${v.chapter}:${v.verse}`, text:v.text.trim(), score });
      });
    });
    if (matches.length > 40) break;
  }

  matches.sort((a,b)=>b.score-a.score);
  const top = matches.slice(0, 30);
  if (!top.length) {
    results.innerHTML = `<div class="bible-error">No verses matched "<strong>${escapeHtml(phrase)}</strong>". Try fewer or different words, or widen the scope.</div>`;
    return;
  }
  results.innerHTML = `
    <div class="bible-passage">
      <div class="bible-passage-head">
        <h3>${top.length} match${top.length===1?'':'es'} for "${escapeHtml(phrase)}"</h3>
        <span class="bible-trans-badge">${trans.label}</span>
      </div>
      ${top.map(m=>`
        <div class="bible-verse bible-verse-match" onclick="bibleQuick('${m.ref}')">
          <span class="bible-vnum">${m.ref}</span>
          <span class="bible-vtext">${escapeHtml(m.text)}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ── Site-wide Dark Mode ─────────────────────────────────────────────────────
let SITE_DARK = localStorage.getItem('siteDark') === '1';

function syncBibleDark() {
  document.querySelectorAll('.bible-page').forEach(p => p.classList.toggle('bible-dark', SITE_DARK));
}

function applySiteDark() {
  document.body.classList.toggle('site-dark', SITE_DARK);
  syncBibleDark();
  const btn = document.getElementById('site-dark-btn');
  if (btn) {
    const icon = btn.querySelector('.site-dark-icon');
    const label = btn.querySelector('.site-dark-label');
    if (icon) icon.innerHTML = SITE_DARK ? '&#x2600;' : '&#x1F319;';
    if (label) label.textContent = SITE_DARK ? 'Light Mode' : 'Dark Mode';
  }
}

function toggleSiteDark() {
  SITE_DARK = !SITE_DARK;
  localStorage.setItem('siteDark', SITE_DARK ? '1' : '0');
  applySiteDark();
}

// ── Verse click-to-copy ────────────────────────────────────────────────────
function copyVerse(numEl) {
  const verseRow = numEl.closest('.bible-verse');
  if (!verseRow) return;
  let payload;
  try { payload = JSON.parse(decodeURIComponent(verseRow.dataset.versePayload || '')); }
  catch { payload = null; }
  if (!payload) return;

  // Toggle highlight immediately - independent of clipboard success
  verseRow.classList.toggle('verse-highlight');
  showCopiedToast(payload.ref);

  const toCopy = `${payload.ref} - "${payload.text}"`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(toCopy).catch(() => fallbackCopy(toCopy));
  } else {
    fallbackCopy(toCopy);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed'; ta.style.top = '-1000px';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch {}
  document.body.removeChild(ta);
}

function showCopiedToast(ref) {
  let toast = document.querySelector('.bible-copied-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'bible-copied-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = `Copied ${ref}`;
  requestAnimationFrame(() => toast.classList.add('show'));
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => toast.classList.remove('show'), 1500);
}

// ── Init ────────────────────────────────────────────────────────────────────
applySiteDark();
navigateTo('home');
