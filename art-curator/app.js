const CATEGORY_IDEAS = [
  'Colored stuff',
  'Black and white stuff',
  'Stuff I did when I was sick',
  'Stuff I did for others',
  'Random stuff',
  'Cat',
  'Apartment'
];

const CATEGORY_RENAMES = {
  'Random stuff I drew when I was a kid': 'Random stuff'
};

const grid = document.getElementById('art-grid');
const cardTemplate = document.getElementById('art-card-template');
const progressCount = document.getElementById('progress-count');
const starCount = document.getElementById('star-count');
const saveStatus = document.getElementById('save-status');
const saveButton = document.getElementById('save-button');
const exportButton = document.getElementById('export-button');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const emptyState = document.getElementById('empty-state');
const imageDialog = document.getElementById('image-dialog');
const dialogImage = document.getElementById('dialog-image');
const dialogFilename = document.getElementById('dialog-filename');

let items = [];
let annotations = {};
let saveTimer = 0;
let saveInFlight = false;
let pendingSave = false;

function getRecord(id) {
  return {
    name: '',
    category: '',
    note: '',
    featured: false,
    eyeLevel: false,
    ...(annotations[id] || {})
  };
}

function setSaveStatus(text, isError = false) {
  saveStatus.textContent = text;
  saveStatus.classList.toggle('error', isError);
}

function refreshCounts() {
  const described = items.filter((item) => {
    const record = getRecord(item.id);
    return Boolean(record.name.trim() || record.category.trim() || record.note.trim());
  }).length;
  const starred = items.filter((item) => getRecord(item.id).featured).length;
  const eyeLevel = items.filter((item) => getRecord(item.id).eyeLevel).length;
  progressCount.textContent = `${described} of ${items.length} described`;
  starCount.textContent = `${starred} highlighted · ${eyeLevel} marked for eye level`;
}

function syncPriorityButtons() {
  grid.querySelectorAll('.art-card').forEach((card) => {
    const record = getRecord(card.dataset.id);
    const featured = Boolean(record.featured);
    const eyeLevel = Boolean(record.eyeLevel);
    const featureToggle = card.querySelector('.feature-toggle');
    const eyeToggle = card.querySelector('.eye-toggle');
    featureToggle.setAttribute('aria-pressed', String(featured));
    featureToggle.querySelector('.star').textContent = featured ? '★' : '☆';
    eyeToggle.setAttribute('aria-pressed', String(eyeLevel));
    eyeToggle.querySelector('.eye-mark').textContent = eyeLevel ? '●' : '○';
    card.classList.toggle('featured', featured);
    card.classList.toggle('eye-level', eyeLevel);
  });
}

function refreshCategoryFilter() {
  const selected = categoryFilter.value;
  const categories = [...new Set([
    ...CATEGORY_IDEAS,
    ...Object.values(annotations).map((record) => record.category?.trim()).filter(Boolean)
  ])].sort((a, b) => a.localeCompare(b));

  [...categoryFilter.querySelectorAll('option[data-dynamic]')].forEach((option) => option.remove());
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = `category:${category}`;
    option.textContent = category;
    option.dataset.dynamic = 'true';
    categoryFilter.appendChild(option);
  });
  if ([...categoryFilter.options].some((option) => option.value === selected)) categoryFilter.value = selected;
}

function applyFilters() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const filter = categoryFilter.value;
  let visible = 0;

  grid.querySelectorAll('.art-card').forEach((card) => {
    const record = getRecord(card.dataset.id);
    const item = items.find((candidate) => candidate.id === card.dataset.id);
    const haystack = [item.originalFilename, record.name, record.category, record.note].join(' ').toLocaleLowerCase();
    const matchesSearch = !query || haystack.includes(query);
    let matchesCategory = true;

    if (filter === 'unassigned') matchesCategory = !record.category.trim();
    if (filter === 'starred') matchesCategory = Boolean(record.featured);
    if (filter === 'eye-level') matchesCategory = Boolean(record.eyeLevel);
    if (filter.startsWith('category:')) {
      matchesCategory = record.category.trim().toLocaleLowerCase() === filter.slice(9).toLocaleLowerCase();
    }

    const show = matchesSearch && matchesCategory;
    card.hidden = !show;
    if (show) visible += 1;
  });

  emptyState.hidden = visible !== 0;
}

async function saveAnnotations() {
  if (saveInFlight) {
    pendingSave = true;
    return;
  }

  saveInFlight = true;
  pendingSave = false;
  setSaveStatus('Saving…');
  localStorage.setItem('art-curator-annotations', JSON.stringify(annotations));

  try {
    const response = await fetch('/api/annotations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(annotations)
    });
    if (!response.ok) throw new Error(`Save failed (${response.status})`);
    const now = new Date();
    setSaveStatus(`Saved ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
  } catch (error) {
    setSaveStatus('Saved in this browser only', true);
  } finally {
    saveInFlight = false;
    if (pendingSave) saveAnnotations();
  }
}

function scheduleSave() {
  window.clearTimeout(saveTimer);
  setSaveStatus('Unsaved changes');
  saveTimer = window.setTimeout(saveAnnotations, 450);
}

function updateRecord(item, card) {
  const name = card.querySelector('.name-input').value.trim();
  const category = card.querySelector('.category-input').value.trim();
  const note = card.querySelector('.note-input').value.trim();
  const featured = card.querySelector('.feature-toggle').getAttribute('aria-pressed') === 'true';
  const eyeLevel = card.querySelector('.eye-toggle').getAttribute('aria-pressed') === 'true';
  annotations[item.id] = {
    name,
    category,
    note,
    featured: Boolean(featured && category),
    eyeLevel: Boolean(eyeLevel && category)
  };
  syncPriorityButtons();
  refreshCounts();
  refreshCategoryFilter();
  applyFilters();
  scheduleSave();
}

function renderCards() {
  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const record = getRecord(item.id);
    const card = cardTemplate.content.firstElementChild.cloneNode(true);
    card.dataset.id = item.id;
    card.classList.toggle('featured', Boolean(record.featured));
    card.classList.toggle('eye-level', Boolean(record.eyeLevel));

    const image = card.querySelector('.art-image');
    image.src = item.preview;
    image.alt = record.name ? record.name : `Artwork preview: ${item.originalFilename}`;
    card.querySelector('.source-type').textContent = item.sourceType;
    card.querySelector('.item-number').textContent = `${item.index} / ${items.length}`;
    card.querySelector('.original-filename').textContent = item.originalFilename;
    card.querySelector('.original-filename').title = item.originalFilename;

    const featureToggle = card.querySelector('.feature-toggle');
    featureToggle.setAttribute('aria-pressed', String(Boolean(record.featured)));
    featureToggle.querySelector('.star').textContent = record.featured ? '★' : '☆';
    const eyeToggle = card.querySelector('.eye-toggle');
    eyeToggle.setAttribute('aria-pressed', String(Boolean(record.eyeLevel)));
    eyeToggle.querySelector('.eye-mark').textContent = record.eyeLevel ? '●' : '○';

    const nameInput = card.querySelector('.name-input');
    const categoryInput = card.querySelector('.category-input');
    const noteInput = card.querySelector('.note-input');
    nameInput.value = record.name || '';
    categoryInput.value = record.category || '';
    noteInput.value = record.note || '';

    [nameInput, categoryInput, noteInput].forEach((field) => {
      field.addEventListener('input', () => updateRecord(item, card));
    });

    featureToggle.addEventListener('click', () => {
      const featured = featureToggle.getAttribute('aria-pressed') !== 'true';
      if (featured && !categoryInput.value.trim()) {
        setSaveStatus('Choose a category before selecting its key artwork', true);
        categoryInput.focus();
        return;
      }
      featureToggle.setAttribute('aria-pressed', String(featured));
      featureToggle.querySelector('.star').textContent = featured ? '★' : '☆';
      updateRecord(item, card);
    });

    eyeToggle.addEventListener('click', () => {
      const eyeLevel = eyeToggle.getAttribute('aria-pressed') !== 'true';
      if (eyeLevel && !categoryInput.value.trim()) {
        setSaveStatus('Choose a category before marking eye-level placement', true);
        categoryInput.focus();
        return;
      }
      eyeToggle.setAttribute('aria-pressed', String(eyeLevel));
      eyeToggle.querySelector('.eye-mark').textContent = eyeLevel ? '●' : '○';
      updateRecord(item, card);
    });

    card.querySelector('.image-button').addEventListener('click', () => {
      dialogImage.src = item.preview;
      dialogImage.alt = record.name || item.originalFilename;
      dialogFilename.textContent = item.originalFilename;
      imageDialog.showModal();
    });

    fragment.appendChild(card);
  });

  grid.replaceChildren(fragment);
}

function exportAnnotations() {
  const exportData = {
    exportedAt: new Date().toISOString(),
    categories: [...new Set(Object.values(annotations).map((record) => record.category).filter(Boolean))].sort(),
    works: items.map((item) => ({
      ...item,
      ...getRecord(item.id)
    }))
  };
  const blob = new Blob([`${JSON.stringify(exportData, null, 2)}\n`], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'art-room-curation.json';
  link.click();
  URL.revokeObjectURL(url);
}

async function loadAnnotations() {
  try {
    const response = await fetch('/api/annotations', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Load failed (${response.status})`);
    return await response.json();
  } catch (error) {
    try {
      return JSON.parse(localStorage.getItem('art-curator-annotations') || '{}');
    } catch (parseError) {
      return {};
    }
  }
}

async function initialize() {
  try {
    const [manifestResponse, savedAnnotations] = await Promise.all([
      fetch('./manifest.json', { cache: 'no-store' }),
      loadAnnotations()
    ]);
    if (!manifestResponse.ok) throw new Error('Artwork manifest could not be loaded.');
    const manifest = await manifestResponse.json();
    items = manifest.items;
    annotations = savedAnnotations || {};
    Object.values(annotations).forEach((record) => {
      if (CATEGORY_RENAMES[record.category]) record.category = CATEGORY_RENAMES[record.category];
    });
    renderCards();
    refreshCounts();
    refreshCategoryFilter();
    applyFilters();
    setSaveStatus('All changes auto-save');
  } catch (error) {
    setSaveStatus('Could not load artwork', true);
    emptyState.hidden = false;
    emptyState.textContent = error.message;
  }
}

saveButton.addEventListener('click', saveAnnotations);
exportButton.addEventListener('click', exportAnnotations);
searchInput.addEventListener('input', applyFilters);
categoryFilter.addEventListener('change', applyFilters);

document.querySelectorAll('[data-filter-category]').forEach((button) => {
  button.addEventListener('click', () => {
    const value = `category:${button.dataset.filterCategory}`;
    if (![...categoryFilter.options].some((option) => option.value === value)) refreshCategoryFilter();
    categoryFilter.value = value;
    applyFilters();
  });
});

imageDialog.addEventListener('close', () => {
  dialogImage.removeAttribute('src');
});

initialize();
