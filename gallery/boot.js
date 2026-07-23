const params = new URLSearchParams(window.location.search);
const requestedMode = params.get('gallery');
const captureMode = params.has('gallery-capture');
const mobileByAgent = navigator.userAgentData?.mobile === true
  || /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent)
  || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const guidedByDevice = window.__PUTI_GUIDED_BY_DEVICE__ ?? mobileByAgent;
const useGuidedTour = !captureMode
  && requestedMode !== 'full'
  && (requestedMode === 'guided' || guidedByDevice);

function showBootError(error) {
  console.error(error);
  const loadingTitle = document.getElementById('loading-title');
  const loadingStatus = document.getElementById('loading-status');
  if (loadingTitle) loadingTitle.textContent = 'The gallery could not open';
  if (loadingStatus) loadingStatus.textContent = 'Please reload and try again.';
  const guidedLoading = document.querySelector('.mobile-tour .tour-loading');
  if (!guidedLoading) return;
  guidedLoading.hidden = false;
  guidedLoading.querySelector('.tour-loading-mark')?.setAttribute('hidden', '');
  const copy = guidedLoading.querySelector('p');
  if (copy) copy.textContent = 'The guided gallery could not open. Reload or continue to the résumé.';
  const loadingActions = guidedLoading.querySelector('.tour-loading-actions');
  if (loadingActions) loadingActions.hidden = true;
  if (guidedLoading.querySelector('.tour-boot-error-actions')) return;
  const actions = document.createElement('div');
  actions.className = 'tour-boot-error-actions';
  const reloadButton = document.createElement('button');
  reloadButton.type = 'button';
  reloadButton.className = 'tour-loading-primary';
  reloadButton.textContent = 'Reload';
  reloadButton.addEventListener('click', () => window.location.reload());
  actions.append(reloadButton);
  if (!guidedLoading.querySelector('.tour-fallback-link')) {
    const resumeLink = document.createElement('a');
    resumeLink.className = 'tour-loading-secondary';
    resumeLink.href = '../resume/';
    resumeLink.textContent = 'View résumé';
    actions.append(resumeLink);
  }
  guidedLoading.append(actions);
  reloadButton.focus();
}

if (useGuidedTour) {
  document.documentElement.classList.add('guided-gallery');
  import('./mobile/main.js?v=20260723-resume-update3').catch(showBootError);
} else {
  window.__PUTI_FORCE_FULL_3D__ = requestedMode === 'full' || captureMode;
  import('./gallery.js?v=20260723-resume-update3').catch(showBootError);
}
