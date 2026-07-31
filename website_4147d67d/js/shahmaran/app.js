/**
 * Shahmaran page – talks to Supabase (same source of truth as admin and mobile).
 * Set window.SUPABASE_URL and window.SUPABASE_ANON_KEY in config.js or leave unset to show placeholder.
 */

(function () {
	var SUPABASE_URL = window.SUPABASE_URL || '';
	var SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';

	var topicsEl = document.getElementById('shahmaran-topics');
	var placeholderEl = document.getElementById('shahmaran-placeholder');
	var topicViewEl = document.getElementById('shahmaran-topic-view');
	var stepsContainer = document.getElementById('shahmaran-steps-container');
	var prevBtn = document.getElementById('shahmaran-prev');
	var nextBtn = document.getElementById('shahmaran-next');
	var counterEl = document.getElementById('shahmaran-step-counter');

	var currentTopic = null;
	var currentSteps = [];
	var currentStepIndex = 0;
	var supabase = null;

	if (SUPABASE_URL && SUPABASE_ANON_KEY && typeof window.supabase !== 'undefined') {
		supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
	}

	function showTopics() {
		topicViewEl.hidden = true;
		topicsEl.hidden = false;
		if (placeholderEl) placeholderEl.hidden = !!currentTopic;
	}

	function loadTopics() {
		if (!supabase) {
			if (placeholderEl) {
				var hasKeys = SUPABASE_URL && SUPABASE_ANON_KEY;
				var hasLib = typeof window.supabase !== 'undefined';
				if (!hasKeys)
					placeholderEl.textContent = 'Set SUPABASE_URL and SUPABASE_ANON_KEY in js/shahmaran/config.js to load topics.';
				else if (!hasLib)
					placeholderEl.textContent = 'Supabase script didn’t load. Open this page from a web server (e.g. http://localhost) instead of file://.';
				else
					placeholderEl.textContent = 'Could not connect to Supabase. Check the browser console for errors.';
			}
			return;
		}
		placeholderEl.textContent = 'Loading…';
		supabase
			.from('topics')
			.select('id, slug, order_index')
			.order('order_index')
			.then(function (res) {
				if (res.error) {
					placeholderEl.textContent = 'Error: ' + res.error.message;
					return;
				}
				var topics = res.data || [];
				placeholderEl.hidden = topics.length > 0;
				topicsEl.querySelectorAll('.shahmaran-topic-card').forEach(function (n) { n.remove(); });
				topics.forEach(function (t) {
					var a = document.createElement('a');
					a.href = '#';
					a.className = 'shahmaran-topic-card';
					a.textContent = t.slug;
					a.dataset.topicId = t.id;
					a.addEventListener('click', function (e) {
						e.preventDefault();
						openTopic(t.id, t.slug);
					});
					topicsEl.appendChild(a);
				});
			});
	}

	function openTopic(topicId, slug) {
		currentTopic = { id: topicId, slug: slug };
		currentStepIndex = 0;
		if (!supabase) return;
		supabase
			.from('steps')
			.select('id, order_index')
			.eq('topic_id', topicId)
			.order('order_index')
			.then(function (res) {
				currentSteps = (res.data || []).map(function (s) { return s.id; });
				topicsEl.hidden = true;
				topicViewEl.hidden = false;
				renderStep();
			});
	}

	function renderStep() {
		if (!currentSteps.length) {
			stepsContainer.innerHTML = '<p>No steps yet.</p>';
			counterEl.textContent = '';
			return;
		}
		var stepId = currentSteps[currentStepIndex];
		supabase
			.from('step_translations')
			.select('title, body')
			.eq('step_id', stepId)
			.eq('locale', 'en')
			.single()
			.then(function (res) {
				var d = res.data || {};
				stepsContainer.innerHTML = '<div class="shahmaran-step-card"><h3>' + (d.title || '') + '</h3><div>' + (d.body || '') + '</div></div>';
				counterEl.textContent = (currentStepIndex + 1) + ' / ' + currentSteps.length;
				prevBtn.disabled = currentStepIndex <= 0;
				nextBtn.disabled = currentStepIndex >= currentSteps.length - 1;
			});
	}

	if (prevBtn) prevBtn.addEventListener('click', function () {
		if (currentStepIndex > 0) {
			currentStepIndex--;
			renderStep();
		}
	});
	if (nextBtn) nextBtn.addEventListener('click', function () {
		if (currentStepIndex < currentSteps.length - 1) {
			currentStepIndex++;
			renderStep();
		}
	});

	loadTopics();
})();
