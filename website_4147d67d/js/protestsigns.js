(function () {
	// Visit & download counts: use permanent server counter if COUNTER_SCRIPT_URL is set
	var STORAGE_KEY_VISITS = 'cp_visits';
	var STORAGE_KEY_DOWNLOADS = 'cp_downloads';
	function getVisits() { return parseInt(localStorage.getItem(STORAGE_KEY_VISITS) || '0', 10); }
	function getDownloads() { return parseInt(localStorage.getItem(STORAGE_KEY_DOWNLOADS) || '0', 10); }
	function setVisits(n) { localStorage.setItem(STORAGE_KEY_VISITS, String(n)); updateCounts(); }
	function setDownloads(n) { localStorage.setItem(STORAGE_KEY_DOWNLOADS, String(n)); updateCounts(); }
	function displayCounts(visits, downloads) {
		try {
			var v = document.getElementById('visit-count');
			var d = document.getElementById('download-count');
			var vStr = visits != null && visits !== '' ? String(visits) : '—';
			var dStr = downloads != null && downloads !== '' ? String(downloads) : '—';
			if (v) v.textContent = vStr;
			if (d) d.textContent = dStr;
		} catch (e) {}
	}
	function updateCounts() {
		displayCounts(getVisits(), getDownloads());
	}
	// Optional: permanent counter via Google Apps Script (see scripts/counter-google-apps-script.md)
	var COUNTER_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzySBolYBKqaUiRSJpPsWFd2OXzk1IY23ax4u3qFi4MUCJUYA7LaTN3WoOR44wB5oZ4VA/exec';
	var SESSION_VISIT_COUNTED = 'cp_visit_counted_session';

	function useCounter() { return COUNTER_SCRIPT_URL && COUNTER_SCRIPT_URL.indexOf('http') === 0; }

	var counterResponded = false;

	function counterFallback() {
		try {
			if (!counterResponded) displayCounts('—', '—');
		} catch (e) {}
	}

	function applyCounterResponse(data) {
		if (data && typeof data.visits === 'number' && typeof data.downloads === 'number') {
			counterResponded = true;
			displayCounts(data.visits, data.downloads);
			try { sessionStorage.setItem('cp_counts_cache', JSON.stringify({ v: data.visits, d: data.downloads })); } catch (e) {}
		}
	}

	// Use fetch so we never execute response as script (no crash on 429/HTML). Falls back to local if CORS or error.
	function requestCounter(action, done) {
		if (!useCounter()) return;
		var url = COUNTER_SCRIPT_URL + (COUNTER_SCRIPT_URL.indexOf('?') >= 0 ? '&' : '?') + 'action=' + encodeURIComponent(action);
		fetch(url, { method: 'GET', mode: 'cors' })
			.then(function (res) {
				if (!res.ok) throw new Error('Counter error');
				return res.json();
			})
			.then(function (data) {
				try { applyCounterResponse(data); } catch (e) { counterFallback(); }
				try { if (done) done(); } catch (e) {}
			})
			.catch(function () {
				counterFallback();
				try { if (done) done(); } catch (e) {}
			});
	}

	if (useCounter()) {
		try {
			if (!sessionStorage.getItem(SESSION_VISIT_COUNTED)) {
				sessionStorage.setItem(SESSION_VISIT_COUNTED, '1');
				requestCounter('visit');
			} else {
				var cached = sessionStorage.getItem('cp_counts_cache');
				if (cached) {
					try {
						var o = JSON.parse(cached);
						if (typeof o.v === 'number' && typeof o.d === 'number') {
							displayCounts(o.v, o.d);
							counterResponded = true;
						}
					} catch (e) {}
				}
				if (!counterResponded) {
					displayCounts('—', '—');
					requestCounter('get');
				}
			}
		} catch (e) {
			counterFallback();
		}
		setTimeout(function () {
			try {
				if (!counterResponded) {
					try { setVisits(getVisits() + 1); } catch (e) {} // keep local count for later
					displayCounts('—', '—');
				}
			} catch (e) {}
		}, 4000);
	} else {
		try {
			setVisits(getVisits() + 1);
		} catch (e) {}
	}
	// Ensure counts show after DOM is ready (footer never empty)
	function showCounts() {
		try {
			if (useCounter()) {
				displayCounts('—', '—');
			} else {
				updateCounts();
			}
		} catch (e) {
			displayCounts('—', '—');
		}
	}
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', showCounts);
	} else {
		setTimeout(showCounts, 0);
	}

	// Google Doc (via Apps Script): paste your deployed script’s Web App URL here.
	// Submissions will be appended to your doc. See scripts/feedback-to-google-doc.md for setup.
	var FEEDBACK_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwa3TPxZGwtiwddjQ5VCx9pYm9NDPogauwq3-6JabgyBOS1dZT6MpOvmlwH4b1apOiW/exec';

	var dialog = document.getElementById('feedback-dialog');
	var openBtn = document.getElementById('open-feedback-dialog');
	var cancelBtn = document.getElementById('feedback-dialog-cancel');
	var form = document.getElementById('feedback-form');
	var formWrap = document.getElementById('feedback-dialog-form');
	var successWrap = document.getElementById('feedback-dialog-success');
	var closeSuccessBtn = document.getElementById('feedback-dialog-close-success');

	function showForm() {
		if (formWrap) formWrap.hidden = false;
		if (successWrap) successWrap.hidden = true;
	}
	function showSuccess() {
		if (formWrap) formWrap.hidden = true;
		if (successWrap) successWrap.hidden = false;
	}

	if (openBtn && dialog) {
		openBtn.addEventListener('click', function () {
			showForm();
			if (form) form.reset();
			dialog.showModal();
		});
	}
	if (cancelBtn && dialog) {
		cancelBtn.addEventListener('click', function () { dialog.close(); });
	}
	if (closeSuccessBtn && dialog) {
		closeSuccessBtn.addEventListener('click', function () { dialog.close(); });
	}
	if (dialog) {
		dialog.addEventListener('click', function (e) {
			if (e.target === dialog) dialog.close();
		});
	}
	if (form && dialog) {
		form.addEventListener('submit', function (e) {
			e.preventDefault();
			var textarea = form.querySelector('textarea[name="feedback"]');
			var feedback = textarea ? textarea.value.trim() : '';
			var submitBtn = form.querySelector('button[type="submit"]');
			if (submitBtn) {
				submitBtn.disabled = true;
				submitBtn.textContent = 'Sending…';
			}
			function done() {
				showSuccess();
				if (submitBtn) {
					submitBtn.disabled = false;
					submitBtn.textContent = 'Submit';
				}
				setTimeout(function () {
					dialog.close();
					showForm();
				}, 2500);
			}
			function fail() {
				if (submitBtn) {
					submitBtn.disabled = false;
					submitBtn.textContent = 'Submit';
				}
				alert('Something went wrong. Please try again.');
			}
			if (FEEDBACK_SCRIPT_URL && feedback) {
				var f = document.createElement('form');
				f.method = 'GET';
				f.action = FEEDBACK_SCRIPT_URL;
				f.target = 'feedback-sender-frame';
				f.style.display = 'none';
				var input = document.createElement('input');
				input.name = 'feedback';
				input.value = feedback;
				input.type = 'hidden';
				f.appendChild(input);
				document.body.appendChild(f);
				f.submit();
				setTimeout(function () {
					if (f.parentNode) document.body.removeChild(f);
				}, 1000);
				done();
			} else {
				done();
			}
		});
	}

	// Image modal – click sign card image to view larger
	var imageModal = document.getElementById('image-modal');
	var imageModalImg = imageModal && imageModal.querySelector('.image-modal-img');
	var imageModalClose = imageModal && imageModal.querySelector('.image-modal-close');
	function openImageModal(src, alt) {
		if (!imageModal || !imageModalImg) return;
		imageModalImg.src = src || '';
		imageModalImg.alt = alt || '';
		imageModal.hidden = false;
		document.body.style.overflow = 'hidden';
	}
	function closeImageModal() {
		if (!imageModal) return;
		imageModal.hidden = true;
		document.body.style.overflow = '';
	}
	if (imageModalClose) imageModalClose.addEventListener('click', closeImageModal);
	if (imageModal) {
		imageModal.addEventListener('click', function (e) {
			if (e.target === imageModal) closeImageModal();
		});
	}
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && imageModal && !imageModal.hidden) closeImageModal();
	});

	// Category from first letter of filename: F=flags, I=images, P=farsi, E=english
	function getCategoryFromFilename(filename) {
		var first = (filename || '').charAt(0).toUpperCase();
		if (first === 'F') return 'flags';
		if (first === 'I') return 'images';
		if (first === 'P') return 'farsi';
		if (first === 'E') return 'english';
		return 'other';
	}

	function applyFilter(filterValue) {
		var cards = document.querySelectorAll('.sign-card');
		cards.forEach(function (card) {
			var cat = card.getAttribute('data-category') || '';
			var show = filterValue === 'all' || cat === filterValue;
			card.toggleAttribute('data-filter-hidden', !show);
		});
		var buttons = document.querySelectorAll('.signs-filter');
		buttons.forEach(function (btn) {
			btn.classList.toggle('active', (btn.getAttribute('data-filter') || '') === filterValue);
		});
	}

	var grid = document.getElementById('signs-grid');
	var filtersEl = document.getElementById('signs-filters');

	var filtersWrapper = document.getElementById('signs-filters-wrapper');

	function reserveSpaceForStickyFilters() {
		var el = filtersWrapper || filtersEl;
		if (!el) return;
		var h = el.offsetHeight;
		if (h > 0) {
			document.documentElement.style.setProperty('--sticky-filters-height', h + 'px');
		}
	}

	if (filtersWrapper || filtersEl) {
		reserveSpaceForStickyFilters();
		setTimeout(reserveSpaceForStickyFilters, 100);
		window.addEventListener('resize', reserveSpaceForStickyFilters);
		var observeEl = filtersWrapper || filtersEl;
		if (observeEl && typeof ResizeObserver !== 'undefined') {
			var ro = new ResizeObserver(reserveSpaceForStickyFilters);
			ro.observe(observeEl);
		}
		filtersEl.addEventListener('click', function (e) {
			var btn = e.target.closest('.signs-filter');
			if (!btn) return;
			var filter = btn.getAttribute('data-filter') || 'all';
			applyFilter(filter);
		});
	}
	// Multiselect for PDF: track selected image srcs, update bar
	var pdfBar = document.getElementById('pdf-selection-bar');
	var pdfCountEl = document.getElementById('pdf-selection-count');
	var pdfDownloadBtn = document.getElementById('pdf-download-btn');
	var pdfClearBtn = document.getElementById('pdf-clear-btn');
	var selectedForPdf = new Set();

	function updatePdfSelectionBar() {
		var n = selectedForPdf.size;
		if (pdfCountEl) pdfCountEl.textContent = n;
		if (pdfBar) {
			pdfBar.hidden = n === 0;
		}
		if (pdfDownloadBtn) pdfDownloadBtn.disabled = n === 0;
		requestAnimationFrame(reserveSpaceForStickyFilters);
	}

	function setCardSelected(card, selected) {
		if (!card) return;
		var src = card.getAttribute('data-src');
		if (!src) return;
		if (selected) {
			selectedForPdf.add(src);
			card.classList.add('sign-card-selected');
		} else {
			selectedForPdf.delete(src);
			card.classList.remove('sign-card-selected');
		}
		var cb = card.querySelector('.sign-card-select-input');
		if (cb) cb.checked = selected;
		updatePdfSelectionBar();
	}

	if (grid) {
		grid.addEventListener('click', function (e) {
			if (e.target.closest('.sign-card-select-wrap')) return;
			var img = e.target.closest('.sign-card img');
			if (!img || !img.src) return;
			e.preventDefault();
			openImageModal(img.src, img.alt || '');
		});
	}

	// Uses window.SIGN_IMAGES from sign-images-data.js. Build when DOM ready; retry once if data not yet loaded.
	function buildSignsGrid() {
		var list = window.SIGN_IMAGES || [];
		if (list.length === 0) return false;
		var imgDir = 'img/';
		list.forEach(function (filename) {
			var name = filename.replace(/\.[^.]*$/, '');
			var ext = (filename.split('.').pop() || '').toUpperCase(); // kept for dynamic label later
			var src = imgDir + filename;
			var category = getCategoryFromFilename(filename);

			var article = document.createElement('article');
			article.className = 'sign-card';
			article.setAttribute('data-category', category);
			article.setAttribute('data-src', src);

			var selectWrap = document.createElement('label');
			selectWrap.className = 'sign-card-select-wrap';
			selectWrap.title = 'Select for PDF';
			var cb = document.createElement('input');
			cb.type = 'checkbox';
			cb.className = 'sign-card-select-input';
			cb.setAttribute('aria-label', 'Select for PDF');
			selectWrap.appendChild(cb);
			article.appendChild(selectWrap);

			var img = document.createElement('img');
			img.loading = 'lazy';
			img.src = src;
			img.alt = name;

			var h4 = document.createElement('h4');
			h4.textContent = name;

			var actions = document.createElement('div');
			actions.className = 'sign-card-actions';

			var pdfBtn = document.createElement('button');
			pdfBtn.type = 'button';
			pdfBtn.className = 'btn-download btn-download-pdf';
			pdfBtn.textContent = 'PDF';
			pdfBtn.setAttribute('data-src', src);
			pdfBtn.setAttribute('data-filename', name);

			var a = document.createElement('a');
			a.href = src;
			a.download = filename;
			a.className = 'btn-download btn-download-img';
			a.textContent = 'PNG';

			cb.addEventListener('change', function () {
				setCardSelected(article, cb.checked);
			});

			actions.appendChild(pdfBtn);
			actions.appendChild(a);
			article.appendChild(img);
			article.appendChild(h4);
			article.appendChild(actions);
			grid.appendChild(article);
		});
		reserveSpaceForStickyFilters();
		return true;
	}

	function runBuildSignsGrid() {
		if (!grid) return;
		if (!buildSignsGrid()) {
			if (!grid._buildRetried) {
				grid._buildRetried = true;
				setTimeout(runBuildSignsGrid, 80);
			}
		}
	}
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', runBuildSignsGrid);
	} else {
		runBuildSignsGrid();
	}

	if (pdfClearBtn) {
		pdfClearBtn.addEventListener('click', function () {
			selectedForPdf.clear();
			document.querySelectorAll('.sign-card-selected').forEach(function (card) {
				card.classList.remove('sign-card-selected');
				var cb = card.querySelector('.sign-card-select-input');
				if (cb) cb.checked = false;
			});
			updatePdfSelectionBar();
		});
	}

	// Download selected images as one PDF (Tabloid 11x17, one image per page)
	function loadImageAsData(src) {
		return new Promise(function (resolve, reject) {
			var img = new Image();
			img.crossOrigin = 'anonymous';
			img.onload = function () {
				var w = img.naturalWidth;
				var h = img.naturalHeight;
				var canvas = document.createElement('canvas');
				canvas.width = w;
				canvas.height = h;
				var ctx = canvas.getContext('2d');
				ctx.drawImage(img, 0, 0);
				try {
					var dataUrl = canvas.toDataURL('image/png');
					resolve({ dataUrl: dataUrl, width: w, height: h });
				} catch (err) {
					reject(err);
				}
			};
			img.onerror = function () { reject(new Error('Failed to load image')); };
			img.src = src;
		});
	}

	function downloadSelectedAsPdf() {
		var srcs = [];
		if (grid) {
			[].forEach.call(grid.querySelectorAll('.sign-card'), function (card) {
				var src = card.getAttribute('data-src');
				if (src && selectedForPdf.has(src)) srcs.push(src);
			});
		}
		if (srcs.length === 0) return;
		var btn = pdfDownloadBtn;
		if (btn) { btn.disabled = true; btn.textContent = 'Preparing…'; }
		Promise.all(srcs.map(loadImageAsData)).then(function (images) {
			var jsPDF = window.jspdf && window.jspdf.jsPDF ? window.jspdf.jsPDF : window.jsPDF;
			if (!jsPDF) {
				alert('PDF library not loaded. Please refresh the page.');
				if (btn) { btn.disabled = false; btn.textContent = 'Download as PDF'; }
				return;
			}
			var MARGIN = 8;
			function isLandscape(im) { return im.width >= im.height; }
			var firstLandscape = isLandscape(images[0]);
			var doc = new jsPDF({
				orientation: firstLandscape ? 'landscape' : 'portrait',
				unit: 'pt',
				format: 'tabloid'
			});
			var pageWidth = doc.internal.pageSize.getWidth();
			var pageHeight = doc.internal.pageSize.getHeight();
			images.forEach(function (im, i) {
				var landscape = isLandscape(im);
				if (i > 0) {
					doc.addPage('tabloid', landscape ? 'landscape' : 'portrait');
					pageWidth = doc.internal.pageSize.getWidth();
					pageHeight = doc.internal.pageSize.getHeight();
				}
				var fitW = Math.max(0, pageWidth - 2 * MARGIN);
				var fitH = Math.max(0, pageHeight - 2 * MARGIN);
				var scale = Math.min(fitW / im.width, fitH / im.height);
				if (!isFinite(scale) || scale <= 0) scale = 1;
				var w = Math.min(im.width * scale, fitW);
				var h = Math.min(im.height * scale, fitH);
				var x = MARGIN + (fitW - w) / 2;
				var y = MARGIN + (fitH - h) / 2;
				x = Math.max(MARGIN, Math.min(x, pageWidth - MARGIN - w));
				y = Math.max(MARGIN, Math.min(y, pageHeight - MARGIN - h));
				doc.addImage(im.dataUrl, 'PNG', x, y, w, h);
			});
			doc.save('curious-paisley-signs.pdf');
			if (useCounter()) {
				requestCounter('download');
			} else {
				setDownloads(getDownloads() + 1);
			}
			if (btn) { btn.disabled = false; btn.textContent = 'Download as PDF'; }
		}).catch(function (err) {
			alert('Could not create PDF. If images are on another domain, try downloading them individually.');
			if (btn) { btn.disabled = false; btn.textContent = 'Download as PDF'; }
		});
	}

	if (pdfDownloadBtn) pdfDownloadBtn.addEventListener('click', downloadSelectedAsPdf);

	// Single-image PDF: one sign as one Tabloid page
	function downloadOneAsPdf(src, filename) {
		if (!src) return;
		var jsPDF = window.jspdf && window.jspdf.jsPDF ? window.jspdf.jsPDF : window.jsPDF;
		if (!jsPDF) {
			alert('PDF library not loaded. Please refresh the page.');
			return;
		}
		loadImageAsData(src).then(function (im) {
			var MARGIN = 8;
			var landscape = im.width >= im.height;
			var doc = new jsPDF({
				orientation: landscape ? 'landscape' : 'portrait',
				unit: 'pt',
				format: 'tabloid'
			});
			var pageWidth = doc.internal.pageSize.getWidth();
			var pageHeight = doc.internal.pageSize.getHeight();
			var fitW = Math.max(0, pageWidth - 2 * MARGIN);
			var fitH = Math.max(0, pageHeight - 2 * MARGIN);
			var scale = Math.min(fitW / im.width, fitH / im.height);
			if (!isFinite(scale) || scale <= 0) scale = 1;
			var w = Math.min(im.width * scale, fitW);
			var h = Math.min(im.height * scale, fitH);
			var x = Math.max(MARGIN, Math.min(MARGIN + (fitW - w) / 2, pageWidth - MARGIN - w));
			var y = Math.max(MARGIN, Math.min(MARGIN + (fitH - h) / 2, pageHeight - MARGIN - h));
			doc.addImage(im.dataUrl, 'PNG', x, y, w, h);
			doc.save((filename || 'sign') + '.pdf');
			if (useCounter()) requestCounter('download');
			else setDownloads(getDownloads() + 1);
		}).catch(function () {
			alert('Could not create PDF. Try downloading the image instead.');
		});
	}

	document.addEventListener('click', function (e) {
		var pdfBtn = e.target.closest('button.btn-download-pdf');
		if (pdfBtn) {
			var src = pdfBtn.getAttribute('data-src');
			var filename = pdfBtn.getAttribute('data-filename') || 'sign';
			downloadOneAsPdf(src, filename);
			return;
		}
		var link = e.target.closest('a.btn-download');
		if (!link || !link.href) return;
		e.preventDefault();
		if (useCounter()) {
			requestCounter('download');
		} else {
			setDownloads(getDownloads() + 1);
		}
		var href = link.getAttribute('href') || link.href || '';
		var filename = href.split('/').pop() || 'download';
		var url = href.indexOf('://') === -1 ? href : link.href;
		fetch(url).then(function (res) {
			if (!res.ok) throw new Error('Fetch failed');
			return res.blob();
		}).then(function (blob) {
			var blobUrl = URL.createObjectURL(blob);
			var a = document.createElement('a');
			a.href = blobUrl;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(blobUrl);
		}).catch(function () {
			// Fetch failed (e.g. file:// or CORS). Don’t open new tab – show hint.
			alert('Download couldn’t start. Right-click the button and choose “Save link as” to download.');
		});
	});
})();
