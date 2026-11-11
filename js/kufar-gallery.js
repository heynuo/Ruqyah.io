(() => {
  'use strict';

  const DATABASE_NAME = 'ruqyah-kufar-gallery';
  const STORE_NAME = 'photos';
  const MAX_FILE_SIZE = 20 * 1024 * 1024;
  const picker = document.getElementById('photo-picker');
  const dropzone = document.getElementById('photo-dropzone');
  const grid = document.getElementById('photo-grid');
  const emptyMessage = document.getElementById('gallery-empty');
  const count = document.getElementById('photo-count');
  const status = document.getElementById('upload-status');
  const previewDialog = document.getElementById('photo-preview-dialog');
  const previewImage = document.getElementById('photo-preview-image');
  const previewCaption = document.getElementById('photo-preview-caption');
  const previewClose = document.getElementById('photo-preview-close');
  let database;
  let activePreviewUrl = null;
  const imageUrls = new Set();

  if (!picker || !dropzone || !grid || !emptyMessage || !count || !status) return;

  function setStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle('text-danger', isError);
    status.classList.toggle('text-on-surface-variant', !isError);
  }

  function openDatabase() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error('This browser does not support local photo storage.'));
        return;
      }

      const request = window.indexedDB.open(DATABASE_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Could not open photo storage.'));
      request.onblocked = () => reject(new Error('Photo storage is busy. Close another Kufar tab and try again.'));
    });
  }

  function getPhotos() {
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readonly');
      const request = transaction.objectStore(STORE_NAME).getAll();
      request.onsuccess = () => resolve(request.result.sort((a, b) => b.addedAt - a.addedAt));
      request.onerror = () => reject(request.error || new Error('Could not read saved photos.'));
      transaction.onabort = () => reject(transaction.error || new Error('Could not read saved photos.'));
    });
  }

  function savePhoto(photo) {
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).add(photo);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error('Could not save this photo.'));
      transaction.onabort = () => reject(transaction.error || new Error('Could not save this photo.'));
    });
  }

  function deletePhoto(id) {
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).delete(id);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error('Could not remove this photo.'));
      transaction.onabort = () => reject(transaction.error || new Error('Could not remove this photo.'));
    });
  }

  function openPreview(photo) {
    if (!previewDialog || !previewImage || !previewCaption || typeof previewDialog.showModal !== 'function') {
      setStatus('Photo preview is not available in this browser.', true);
      return;
    }

    if (activePreviewUrl) URL.revokeObjectURL(activePreviewUrl);
    activePreviewUrl = URL.createObjectURL(photo.blob);
    previewImage.src = activePreviewUrl;
    previewImage.alt = photo.caption;
    previewCaption.textContent = photo.caption;
    previewDialog.showModal();
  }

  function makeCaption(fileName) {
    return fileName.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim() || 'Photo';
  }

  function createPhotoCard(photo) {
    const card = document.createElement('article');
    card.className = 'overflow-hidden rounded-xl border border-border-subtle bg-surface shadow-sm';
    card.setAttribute('role', 'listitem');

    const figure = document.createElement('figure');
    figure.className = 'm-0';
    const imageFrame = document.createElement('div');
    imageFrame.className = 'aspect-[4/3] w-full bg-surface-container';
    const image = document.createElement('img');
    const imageUrl = URL.createObjectURL(photo.blob);
    imageUrls.add(imageUrl);
    image.src = imageUrl;
    image.alt = photo.caption;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.className = 'block h-full w-full object-contain';
    imageFrame.append(image);

    const caption = document.createElement('figcaption');
    caption.className = 'break-words px-4 pt-3 font-ui-interactive text-sm font-semibold text-on-surface';
    caption.textContent = photo.caption;
    figure.append(imageFrame, caption);

    const footer = document.createElement('div');
    footer.className = 'flex items-center justify-between gap-3 px-4 pb-4 pt-2';
    const date = document.createElement('span');
    date.className = 'font-code-mono text-[11px] text-on-surface-variant';
    date.textContent = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(photo.addedAt);

    const actions = document.createElement('div');
    actions.className = 'flex items-center gap-2';
    const previewButton = document.createElement('button');
    previewButton.className = 'inline-flex min-h-9 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary';
    previewButton.type = 'button';
    previewButton.textContent = 'Preview';
    previewButton.setAttribute('aria-label', `Preview ${photo.caption}`);
    previewButton.addEventListener('click', () => openPreview(photo));

    const removeButton = document.createElement('button');
    removeButton.className = 'inline-flex min-h-9 items-center rounded-lg px-2.5 py-1.5 text-xs font-semibold text-danger hover:bg-error-container/40 focus:outline-none focus:ring-2 focus:ring-danger';
    removeButton.type = 'button';
    removeButton.textContent = 'Remove';
    removeButton.setAttribute('aria-label', `Remove ${photo.caption}`);
    removeButton.addEventListener('click', async () => {
      removeButton.disabled = true;
      try {
        await deletePhoto(photo.id);
        await renderPhotos();
        setStatus(`${photo.caption} removed from this browser's gallery.`);
      } catch (_) {
        removeButton.disabled = false;
        setStatus('This photo could not be removed. Please try again.', true);
      }
    });

    actions.append(previewButton, removeButton);
    footer.append(date, actions);
    card.append(figure, footer);
    return card;
  }

  async function renderPhotos() {
    const photos = await getPhotos();
    imageUrls.forEach((url) => URL.revokeObjectURL(url));
    imageUrls.clear();
    grid.replaceChildren(...photos.map(createPhotoCard));
    grid.hidden = photos.length === 0;
    grid.classList.toggle('grid', photos.length > 0);
    grid.classList.toggle('hidden', photos.length === 0);
    emptyMessage.hidden = photos.length > 0;
    count.textContent = `${photos.length} ${photos.length === 1 ? 'photo' : 'photos'}`;
  }

  async function addFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    if (!database) {
      setStatus('Photo storage is still starting. Please try again in a moment.', true);
      return;
    }

    let added = 0;
    let skipped = 0;
    let tooLarge = 0;
    setStatus('Adding photos…');

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        skipped += 1;
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        tooLarge += 1;
        continue;
      }

      try {
        await savePhoto({
          id: window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          caption: makeCaption(file.name),
          blob: file,
          addedAt: Date.now()
        });
        added += 1;
      } catch (_) {
        await renderPhotos().catch(() => {});
        setStatus('The browser could not save more photos. Free some device storage or choose smaller images.', true);
        return;
      }
    }

    try {
      await renderPhotos();
    } catch (_) {
      setStatus('Your photos may be saved, but the gallery could not refresh. Reload this page to try again.', true);
      return;
    }

    const messages = [];
    if (added) messages.push(`${added} ${added === 1 ? 'photo' : 'photos'} added.`);
    if (skipped) messages.push(`${skipped} unsupported ${skipped === 1 ? 'file was' : 'files were'} skipped.`);
    if (tooLarge) messages.push(`${tooLarge} ${tooLarge === 1 ? 'image is' : 'images are'} over the 20 MB per-photo limit.`);
    setStatus(messages.join(' ') || 'No supported photos were selected.', added === 0);
  }

  picker.addEventListener('change', () => {
    addFiles(picker.files);
    picker.value = '';
  });

  dropzone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropzone.classList.add('border-primary', 'bg-surface-container-low');
  });
  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('border-primary', 'bg-surface-container-low');
  });
  dropzone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropzone.classList.remove('border-primary', 'bg-surface-container-low');
    addFiles(event.dataTransfer?.files);
  });
  window.addEventListener('pagehide', () => {
    imageUrls.forEach((url) => URL.revokeObjectURL(url));
    imageUrls.clear();
    if (activePreviewUrl) URL.revokeObjectURL(activePreviewUrl);
    activePreviewUrl = null;
  });

  previewClose?.addEventListener('click', () => previewDialog.close());
  previewDialog?.addEventListener('click', (event) => {
    if (event.target === previewDialog) previewDialog.close();
  });
  previewDialog?.addEventListener('close', () => {
    if (activePreviewUrl) URL.revokeObjectURL(activePreviewUrl);
    activePreviewUrl = null;
    previewImage?.removeAttribute('src');
    previewImage?.setAttribute('alt', '');
    if (previewCaption) previewCaption.textContent = '';
  });

  async function initialize() {
    picker.disabled = true;
    setStatus('Preparing photo storage…');
    try {
      database = await openDatabase();
      database.onversionchange = () => database.close();
      await renderPhotos();
      picker.disabled = false;
      setStatus('');
    } catch (error) {
      setStatus(error.message || 'Photo storage is not available in this browser.', true);
    }
  }

  initialize();
})();
