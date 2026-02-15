/**
 * Ink Wash Page Transition
 * Premium artistic transition effect for 44BYRON STUDIO
 * Authentic organic ink diffusion effect
 */

(function () {
  'use strict';

  // Create transition overlay with canvas
  const createTransitionOverlay = () => {
    const overlay = document.createElement('div');
    overlay.id = 'ink-wash-overlay';
    overlay.innerHTML = `
      <div class="ink-layer ink-layer-1"></div>
      <div class="ink-layer ink-layer-2"></div>
      <div class="ink-layer ink-layer-3"></div>
      <div class="ink-fade"></div>
    `;

    document.body.appendChild(overlay);
    return overlay;
  };

  // Add CSS styles for organic ink wash
  const addStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      #ink-wash-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        pointer-events: none;
        opacity: 0;
      }

      #ink-wash-overlay.active {
        opacity: 1;
        pointer-events: all;
      }

      .ink-layer {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: radial-gradient(
          circle at 40% 40%,
          rgba(0, 0, 0, 0.95) 0%,
          rgba(0, 0, 0, 0.85) 30%,
          rgba(0, 0, 0, 0.6) 60%,
          rgba(0, 0, 0, 0.3) 80%,
          rgba(0, 0, 0, 0) 100%
        );
        transform: translate(-50%, -50%) scale(0);
        opacity: 0;
      }

      #ink-wash-overlay.active .ink-layer-1 {
        animation: inkSpread 1.4s cubic-bezier(0.23, 1, 0.32, 1) forwards;
      }

      #ink-wash-overlay.active .ink-layer-2 {
        animation: inkSpread 1.4s cubic-bezier(0.23, 1, 0.32, 1) 0.15s forwards;
        background: radial-gradient(
          circle at 60% 50%,
          rgba(0, 0, 0, 0.9) 0%,
          rgba(0, 0, 0, 0.7) 40%,
          rgba(0, 0, 0, 0.4) 70%,
          rgba(0, 0, 0, 0) 100%
        );
      }

      #ink-wash-overlay.active .ink-layer-3 {
        animation: inkSpread 1.4s cubic-bezier(0.23, 1, 0.32, 1) 0.3s forwards;
        background: radial-gradient(
          circle at 50% 60%,
          rgba(0, 0, 0, 0.85) 0%,
          rgba(0, 0, 0, 0.6) 50%,
          rgba(0, 0, 0, 0.2) 80%,
          rgba(0, 0, 0, 0) 100%
        );
      }

      .ink-fade {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000000;
        opacity: 0;
      }

      #ink-wash-overlay.active .ink-fade {
        animation: fadeIn 0.6s ease-out 0.8s forwards;
      }

      @keyframes inkSpread {
        0% {
          transform: translate(-50%, -50%) scale(0);
          opacity: 0;
        }
        10% {
          opacity: 0.8;
        }
        100% {
          transform: translate(-50%, -50%) scale(250);
          opacity: 1;
        }
      }

      @keyframes fadeIn {
        to {
          opacity: 1;
        }
      }

      /* Prevent scroll during transition */
      body.transitioning {
        overflow: hidden;
      }

      /* Fade out on arrival */
      #ink-wash-overlay.fade-out {
        animation: overlayFadeOut 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
      }

      @keyframes overlayFadeOut {
        to {
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  };

  // Initialize transition
  const initTransition = () => {
    addStyles();
    const overlay = createTransitionOverlay();

    // Intercept gallery links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href*="/gallery"]');

      if (link && !link.hasAttribute('data-no-transition')) {
        e.preventDefault();
        const targetUrl = link.href;

        // Start transition
        document.body.classList.add('transitioning');
        overlay.classList.add('active');

        // Navigate after animation
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 1400);
      }
    });

    // Fade out on page load (if coming from transition)
    if (sessionStorage.getItem('inkWashTransition') === 'true') {
      overlay.classList.add('active');
      document.body.classList.add('transitioning');

      setTimeout(() => {
        overlay.classList.add('fade-out');
        document.body.classList.remove('transitioning');
        sessionStorage.removeItem('inkWashTransition');

        setTimeout(() => {
          overlay.remove();
        }, 800);
      }, 100);
    }
  };

  // Set flag before navigation
  window.addEventListener('beforeunload', () => {
    if (document.querySelector('#ink-wash-overlay.active')) {
      sessionStorage.setItem('inkWashTransition', 'true');
    }
  });

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTransition);
  } else {
    initTransition();
  }
})();
