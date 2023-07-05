'use strict';

/**
 * Module dependencies.
 */

var userpilotNodeScript,
  Userpilot = {},
  initializedUserpilot = 0;

/**
 * Initialize.
 *
 * http://help.userpilot.com/
 *
 * @api public
 */

Userpilot.initialize = function (appToken, data) {
  if (appToken) {
    !initializedUserpilot && this.load(appToken, data);
    initializedUserpilot = 1;
  }
};

/**
 * Loaded?
 *
 * @api private
 * @return {boolean}
 */

Userpilot.loaded = function () {
  return typeof window.userpilot !== 'undefined';
};

/**
 * Load the Userpilot library.
 *
 * @override
 * @api private
 * @param {Function} callback
 */

function load(url, nonce) {
  userpilotNodeScript = document.createElement('script');
  userpilotNodeScript.setAttribute('src', url);

  if (nonce) {
    userpilotNodeScript.setAttribute('nonce', nonce);
  }

  document.getElementsByTagName('head')[0].appendChild(userpilotNodeScript);
}

Userpilot.load = function (token, settings) {
  if (typeof window === 'undefined') return;
  if (!settings) {
    settings = {};
  }
  settings.version = settings.version || 'v0';
  settings.endpoint = settings.endpoint || 'api.userpilot.io/socket/';
  settings.token = token;
  window.userpilotSettings = settings;

  load('//js.userpilot.io/sdk/latest.js', settings.nonce);
};

/**
 * reload.
 *
 * https://docs.userpilot.com/article/59-installation-guide-for-single-page-applications-spas
 *
 */

Userpilot.reload = function (url) {
  if (window.userpilot) {
    window.userpilot.reload(url);
  } else if (typeof userpilotNodeScript !== 'undefined') {
    userpilotNodeScript.addEventListener('load', function () {
      if (window.userpilot) {
        window.userpilot.reload(url);
      }
    });
  }
};

/**
 * suppress.
 *
 * Prevents Userpilot from loading content
 *
 */

Userpilot.suppress = function () {
  if (window.userpilot) {
    window.userpilot.suppress();
  } else if (typeof userpilotNodeScript !== 'undefined') {
    userpilotNodeScript.addEventListener('load', function () {
      if (window.userpilot) {
        window.userpilot.suppress();
      }
    });
  }
};

/**
 * Identify.
 *
 * https://docs.userpilot.com/article/23-identify-users-track-custom-events
 *
 */

Userpilot.identify = function (userId, identify) {
  if (identify) {
    if (identify.createdAt) {
      identify.created_at = identify.createdAt;
      delete identify.createdAt;
    }
  }
  if (window.userpilot) {
    window.userpilot.identify(userId, identify);
  } else if (typeof userpilotNodeScript !== 'undefined') {
    userpilotNodeScript.addEventListener('load', function () {
      if (window.userpilot) {
        window.userpilot.identify(userId, identify);
      }
    });
  }
};

/**
 * Anonymous.
 *
 * https://docs.userpilot.com/article/48-trigger-an-experience-anonymously
 *
 */

Userpilot.anonymous = function () {
  if (window.userpilot) {
    window.userpilot.anonymous();
  } else if (typeof userpilotNodeScript !== 'undefined') {
    userpilotNodeScript.addEventListener('load', function () {
      if (window.userpilot) {
        window.userpilot.anonymous();
      }
    });
  }
};

/**
 * Trigger.
 *
 * https://docs.userpilot.com/article/50-trigger-an-experience-manually-through-a-script
 *
 */

Userpilot.trigger = function (token) {
  if (window.userpilot) {
    window.userpilot.trigger(token);
  } else if (typeof userpilotNodeScript !== 'undefined') {
    userpilotNodeScript.addEventListener('load', function () {
      if (window.userpilot) {
        window.userpilot.trigger(token);
      }
    });
  }
};

/**
 * On.
 *
 * https://docs.userpilot.com/article/61-javascript-api
 *
 */

Userpilot.on = function (event, callback) {
  if (window.userpilot) {
    window.userpilot.on(event, callback);
  } else if (typeof userpilotNodeScript !== 'undefined') {
    userpilotNodeScript.addEventListener('load', function () {
      if (window.userpilot) {
        window.userpilot.on(event, callback);
      }
    });
  }
};

/**
 * Off.
 *
 * https://docs.userpilot.com/article/61-javascript-api
 *
 */

Userpilot.off = function (event) {
  if (window.userpilot) {
    window.userpilot.off(event);
  } else if (typeof userpilotNodeScript !== 'undefined') {
    userpilotNodeScript.addEventListener('load', function () {
      if (window.userpilot) {
        window.userpilot.off(event);
      }
    });
  }
};

/**
 * Once.
 *
 * https://docs.userpilot.com/article/61-javascript-api
 *
 */

Userpilot.once = function (event, callback) {
  if (window.userpilot) {
    window.userpilot.once(event, callback);
  } else if (typeof userpilotNodeScript !== 'undefined') {
    userpilotNodeScript.addEventListener('load', function () {
      if (window.userpilot) {
        window.userpilot.once(event, callback);
      }
    });
  }
};

/**
 * Track.
 *
 * https://docs.userpilot.com/article/23-identify-users-track-custom-events
 *
 */

Userpilot.track = function (event, meta) {
  if (window.userpilot) {
    window.userpilot.track(event, meta);
  } else if (typeof userpilotNodeScript !== 'undefined') {
    userpilotNodeScript.addEventListener('load', function () {
      if (window.userpilot) {
        window.userpilot.track(event, meta);
      }
    });
  }
};

Userpilot.next = function () {
  if (window.userpilot) {
    window.userpilot.next();
  } else if (typeof userpilotNodeScript !== 'undefined') {
    userpilotNodeScript.addEventListener('load', function () {
      if (window.userpilot) {
        window.userpilot.next();
      }
    });
  }
};

Userpilot.end = function (type) {
  if (window.userpilot) {
    window.userpilot.end(type);
  } else if (typeof userpilotNodeScript !== 'undefined') {
    userpilotNodeScript.addEventListener('load', function () {
      if (window.userpilot) {
        window.userpilot.end(type);
      }
    });
  }
};
/**
 * Reset.
 *
 * https://docs.userpilot.com/article/67-reset-experiences-seen-for-a-user
 *
 **/
Userpilot.reset = function () {
  if (window.userpilot) {
    window.userpilot.reset();
  } else if (typeof userpilotNodeScript !== 'undefined') {
    userpilotNodeScript.addEventListener('load', function () {
      if (window.userpilot) {
        window.userpilot.reset();
      }
    });
  }
};
/**
 *
 * Clean.
 *
 * Clear cached data from Userpilot
 *
 **/

Userpilot.clean = function () {
  if (window.userpilot) {
    window.userpilot.clean();
  } else if (typeof userpilotNodeScript !== 'undefined') {
    userpilotNodeScript.addEventListener('load', function () {
      if (window.userpilot) {
        window.userpilot.clean();
      }
    });
  }
};

/**
 *
 * Destroy.
 *
 * Completely remove Userpilot data/patterns from the page
 *
 **/

Userpilot.destroy = function () {
  if (window.userpilot) {
    window.userpilot.destroy();
  } else if (typeof userpilotNodeScript !== 'undefined') {
    userpilotNodeScript.addEventListener('load', function () {
      if (window.userpilot) {
        window.userpilot.destroy();
      }
    });
  }
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports.Userpilot = Userpilot;
} else {
  window.Userpilot = Userpilot;
}
