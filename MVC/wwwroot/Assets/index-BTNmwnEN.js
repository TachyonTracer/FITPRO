(function () {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const i of document.querySelectorAll('link[rel="modulepreload"]')) r(i);
  new MutationObserver((i) => {
    for (const o of i)
      if (o.type === "childList")
        for (const l of o.addedNodes)
          l.tagName === "LINK" && l.rel === "modulepreload" && r(l);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(i) {
    const o = {};
    return (
      i.integrity && (o.integrity = i.integrity),
      i.referrerPolicy && (o.referrerPolicy = i.referrerPolicy),
      i.crossOrigin === "use-credentials"
        ? (o.credentials = "include")
        : i.crossOrigin === "anonymous"
        ? (o.credentials = "omit")
        : (o.credentials = "same-origin"),
      o
    );
  }
  function r(i) {
    if (i.ep) return;
    i.ep = !0;
    const o = n(i);
    fetch(i.href, o);
  }
})();
function W1(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default")
    ? t.default
    : t;
}
var I0 = { exports: {} },
  Ou = {},
  b0 = { exports: {} },
  Z = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Os = Symbol.for("react.element"),
  Y1 = Symbol.for("react.portal"),
  X1 = Symbol.for("react.fragment"),
  Q1 = Symbol.for("react.strict_mode"),
  G1 = Symbol.for("react.profiler"),
  K1 = Symbol.for("react.provider"),
  q1 = Symbol.for("react.context"),
  J1 = Symbol.for("react.forward_ref"),
  Z1 = Symbol.for("react.suspense"),
  ey = Symbol.for("react.memo"),
  ty = Symbol.for("react.lazy"),
  Ap = Symbol.iterator;
function ny(t) {
  return t === null || typeof t != "object"
    ? null
    : ((t = (Ap && t[Ap]) || t["@@iterator"]),
      typeof t == "function" ? t : null);
}
var $0 = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {},
  },
  B0 = Object.assign,
  U0 = {};
function rl(t, e, n) {
  (this.props = t),
    (this.context = e),
    (this.refs = U0),
    (this.updater = n || $0);
}
rl.prototype.isReactComponent = {};
rl.prototype.setState = function (t, e) {
  if (typeof t != "object" && typeof t != "function" && t != null)
    throw Error(
      "setState(...): takes an object of state variables to update or a function which returns an object of state variables."
    );
  this.updater.enqueueSetState(this, t, e, "setState");
};
rl.prototype.forceUpdate = function (t) {
  this.updater.enqueueForceUpdate(this, t, "forceUpdate");
};
function V0() {}
V0.prototype = rl.prototype;
function cd(t, e, n) {
  (this.props = t),
    (this.context = e),
    (this.refs = U0),
    (this.updater = n || $0);
}
var fd = (cd.prototype = new V0());
fd.constructor = cd;
B0(fd, rl.prototype);
fd.isPureReactComponent = !0;
var Ip = Array.isArray,
  H0 = Object.prototype.hasOwnProperty,
  dd = { current: null },
  W0 = { key: !0, ref: !0, __self: !0, __source: !0 };
function Y0(t, e, n) {
  var r,
    i = {},
    o = null,
    l = null;
  if (e != null)
    for (r in (e.ref !== void 0 && (l = e.ref),
    e.key !== void 0 && (o = "" + e.key),
    e))
      H0.call(e, r) && !W0.hasOwnProperty(r) && (i[r] = e[r]);
  var s = arguments.length - 2;
  if (s === 1) i.children = n;
  else if (1 < s) {
    for (var a = Array(s), u = 0; u < s; u++) a[u] = arguments[u + 2];
    i.children = a;
  }
  if (t && t.defaultProps)
    for (r in ((s = t.defaultProps), s)) i[r] === void 0 && (i[r] = s[r]);
  return {
    $$typeof: Os,
    type: t,
    key: o,
    ref: l,
    props: i,
    _owner: dd.current,
  };
}
function ry(t, e) {
  return {
    $$typeof: Os,
    type: t.type,
    key: e,
    ref: t.ref,
    props: t.props,
    _owner: t._owner,
  };
}
function pd(t) {
  return typeof t == "object" && t !== null && t.$$typeof === Os;
}
function iy(t) {
  var e = { "=": "=0", ":": "=2" };
  return (
    "$" +
    t.replace(/[=:]/g, function (n) {
      return e[n];
    })
  );
}
var bp = /\/+/g;
function Zu(t, e) {
  return typeof t == "object" && t !== null && t.key != null
    ? iy("" + t.key)
    : e.toString(36);
}
function Sa(t, e, n, r, i) {
  var o = typeof t;
  (o === "undefined" || o === "boolean") && (t = null);
  var l = !1;
  if (t === null) l = !0;
  else
    switch (o) {
      case "string":
      case "number":
        l = !0;
        break;
      case "object":
        switch (t.$$typeof) {
          case Os:
          case Y1:
            l = !0;
        }
    }
  if (l)
    return (
      (l = t),
      (i = i(l)),
      (t = r === "" ? "." + Zu(l, 0) : r),
      Ip(i)
        ? ((n = ""),
          t != null && (n = t.replace(bp, "$&/") + "/"),
          Sa(i, e, n, "", function (u) {
            return u;
          }))
        : i != null &&
          (pd(i) &&
            (i = ry(
              i,
              n +
                (!i.key || (l && l.key === i.key)
                  ? ""
                  : ("" + i.key).replace(bp, "$&/") + "/") +
                t
            )),
          e.push(i)),
      1
    );
  if (((l = 0), (r = r === "" ? "." : r + ":"), Ip(t)))
    for (var s = 0; s < t.length; s++) {
      o = t[s];
      var a = r + Zu(o, s);
      l += Sa(o, e, n, a, i);
    }
  else if (((a = ny(t)), typeof a == "function"))
    for (t = a.call(t), s = 0; !(o = t.next()).done; )
      (o = o.value), (a = r + Zu(o, s++)), (l += Sa(o, e, n, a, i));
  else if (o === "object")
    throw (
      ((e = String(t)),
      Error(
        "Objects are not valid as a React child (found: " +
          (e === "[object Object]"
            ? "object with keys {" + Object.keys(t).join(", ") + "}"
            : e) +
          "). If you meant to render a collection of children, use an array instead."
      ))
    );
  return l;
}
function Vs(t, e, n) {
  if (t == null) return t;
  var r = [],
    i = 0;
  return (
    Sa(t, r, "", "", function (o) {
      return e.call(n, o, i++);
    }),
    r
  );
}
function oy(t) {
  if (t._status === -1) {
    var e = t._result;
    (e = e()),
      e.then(
        function (n) {
          (t._status === 0 || t._status === -1) &&
            ((t._status = 1), (t._result = n));
        },
        function (n) {
          (t._status === 0 || t._status === -1) &&
            ((t._status = 2), (t._result = n));
        }
      ),
      t._status === -1 && ((t._status = 0), (t._result = e));
  }
  if (t._status === 1) return t._result.default;
  throw t._result;
}
var At = { current: null },
  ka = { transition: null },
  ly = {
    ReactCurrentDispatcher: At,
    ReactCurrentBatchConfig: ka,
    ReactCurrentOwner: dd,
  };
function X0() {
  throw Error("act(...) is not supported in production builds of React.");
}
Z.Children = {
  map: Vs,
  forEach: function (t, e, n) {
    Vs(
      t,
      function () {
        e.apply(this, arguments);
      },
      n
    );
  },
  count: function (t) {
    var e = 0;
    return (
      Vs(t, function () {
        e++;
      }),
      e
    );
  },
  toArray: function (t) {
    return (
      Vs(t, function (e) {
        return e;
      }) || []
    );
  },
  only: function (t) {
    if (!pd(t))
      throw Error(
        "React.Children.only expected to receive a single React element child."
      );
    return t;
  },
};
Z.Component = rl;
Z.Fragment = X1;
Z.Profiler = G1;
Z.PureComponent = cd;
Z.StrictMode = Q1;
Z.Suspense = Z1;
Z.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ly;
Z.act = X0;
Z.cloneElement = function (t, e, n) {
  if (t == null)
    throw Error(
      "React.cloneElement(...): The argument must be a React element, but you passed " +
        t +
        "."
    );
  var r = B0({}, t.props),
    i = t.key,
    o = t.ref,
    l = t._owner;
  if (e != null) {
    if (
      (e.ref !== void 0 && ((o = e.ref), (l = dd.current)),
      e.key !== void 0 && (i = "" + e.key),
      t.type && t.type.defaultProps)
    )
      var s = t.type.defaultProps;
    for (a in e)
      H0.call(e, a) &&
        !W0.hasOwnProperty(a) &&
        (r[a] = e[a] === void 0 && s !== void 0 ? s[a] : e[a]);
  }
  var a = arguments.length - 2;
  if (a === 1) r.children = n;
  else if (1 < a) {
    s = Array(a);
    for (var u = 0; u < a; u++) s[u] = arguments[u + 2];
    r.children = s;
  }
  return { $$typeof: Os, type: t.type, key: i, ref: o, props: r, _owner: l };
};
Z.createContext = function (t) {
  return (
    (t = {
      $$typeof: q1,
      _currentValue: t,
      _currentValue2: t,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null,
    }),
    (t.Provider = { $$typeof: K1, _context: t }),
    (t.Consumer = t)
  );
};
Z.createElement = Y0;
Z.createFactory = function (t) {
  var e = Y0.bind(null, t);
  return (e.type = t), e;
};
Z.createRef = function () {
  return { current: null };
};
Z.forwardRef = function (t) {
  return { $$typeof: J1, render: t };
};
Z.isValidElement = pd;
Z.lazy = function (t) {
  return { $$typeof: ty, _payload: { _status: -1, _result: t }, _init: oy };
};
Z.memo = function (t, e) {
  return { $$typeof: ey, type: t, compare: e === void 0 ? null : e };
};
Z.startTransition = function (t) {
  var e = ka.transition;
  ka.transition = {};
  try {
    t();
  } finally {
    ka.transition = e;
  }
};
Z.unstable_act = X0;
Z.useCallback = function (t, e) {
  return At.current.useCallback(t, e);
};
Z.useContext = function (t) {
  return At.current.useContext(t);
};
Z.useDebugValue = function () {};
Z.useDeferredValue = function (t) {
  return At.current.useDeferredValue(t);
};
Z.useEffect = function (t, e) {
  return At.current.useEffect(t, e);
};
Z.useId = function () {
  return At.current.useId();
};
Z.useImperativeHandle = function (t, e, n) {
  return At.current.useImperativeHandle(t, e, n);
};
Z.useInsertionEffect = function (t, e) {
  return At.current.useInsertionEffect(t, e);
};
Z.useLayoutEffect = function (t, e) {
  return At.current.useLayoutEffect(t, e);
};
Z.useMemo = function (t, e) {
  return At.current.useMemo(t, e);
};
Z.useReducer = function (t, e, n) {
  return At.current.useReducer(t, e, n);
};
Z.useRef = function (t) {
  return At.current.useRef(t);
};
Z.useState = function (t) {
  return At.current.useState(t);
};
Z.useSyncExternalStore = function (t, e, n) {
  return At.current.useSyncExternalStore(t, e, n);
};
Z.useTransition = function () {
  return At.current.useTransition();
};
Z.version = "18.3.1";
b0.exports = Z;
var P = b0.exports;
const Di = W1(P);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var sy = P,
  ay = Symbol.for("react.element"),
  uy = Symbol.for("react.fragment"),
  cy = Object.prototype.hasOwnProperty,
  fy = sy.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  dy = { key: !0, ref: !0, __self: !0, __source: !0 };
function Q0(t, e, n) {
  var r,
    i = {},
    o = null,
    l = null;
  n !== void 0 && (o = "" + n),
    e.key !== void 0 && (o = "" + e.key),
    e.ref !== void 0 && (l = e.ref);
  for (r in e) cy.call(e, r) && !dy.hasOwnProperty(r) && (i[r] = e[r]);
  if (t && t.defaultProps)
    for (r in ((e = t.defaultProps), e)) i[r] === void 0 && (i[r] = e[r]);
  return {
    $$typeof: ay,
    type: t,
    key: o,
    ref: l,
    props: i,
    _owner: fy.current,
  };
}
Ou.Fragment = uy;
Ou.jsx = Q0;
Ou.jsxs = Q0;
I0.exports = Ou;
var w = I0.exports,
  G0 = { exports: {} },
  pn = {},
  K0 = { exports: {} },
  q0 = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ (function (t) {
  function e(M, j) {
    var S = M.length;
    M.push(j);
    e: for (; 0 < S; ) {
      var U = (S - 1) >>> 1,
        oe = M[U];
      if (0 < i(oe, j)) (M[U] = j), (M[S] = oe), (S = U);
      else break e;
    }
  }
  function n(M) {
    return M.length === 0 ? null : M[0];
  }
  function r(M) {
    if (M.length === 0) return null;
    var j = M[0],
      S = M.pop();
    if (S !== j) {
      M[0] = S;
      e: for (var U = 0, oe = M.length, ft = oe >>> 1; U < ft; ) {
        var ue = 2 * (U + 1) - 1,
          De = M[ue],
          Se = ue + 1,
          me = M[Se];
        if (0 > i(De, S))
          Se < oe && 0 > i(me, De)
            ? ((M[U] = me), (M[Se] = S), (U = Se))
            : ((M[U] = De), (M[ue] = S), (U = ue));
        else if (Se < oe && 0 > i(me, S)) (M[U] = me), (M[Se] = S), (U = Se);
        else break e;
      }
    }
    return j;
  }
  function i(M, j) {
    var S = M.sortIndex - j.sortIndex;
    return S !== 0 ? S : M.id - j.id;
  }
  if (typeof performance == "object" && typeof performance.now == "function") {
    var o = performance;
    t.unstable_now = function () {
      return o.now();
    };
  } else {
    var l = Date,
      s = l.now();
    t.unstable_now = function () {
      return l.now() - s;
    };
  }
  var a = [],
    u = [],
    c = 1,
    f = null,
    d = 3,
    p = !1,
    v = !1,
    m = !1,
    x = typeof setTimeout == "function" ? setTimeout : null,
    g = typeof clearTimeout == "function" ? clearTimeout : null,
    h = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" &&
    navigator.scheduling !== void 0 &&
    navigator.scheduling.isInputPending !== void 0 &&
    navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function y(M) {
    for (var j = n(u); j !== null; ) {
      if (j.callback === null) r(u);
      else if (j.startTime <= M)
        r(u), (j.sortIndex = j.expirationTime), e(a, j);
      else break;
      j = n(u);
    }
  }
  function _(M) {
    if (((m = !1), y(M), !v))
      if (n(a) !== null) (v = !0), Q(k);
      else {
        var j = n(u);
        j !== null && $(_, j.startTime - M);
      }
  }
  function k(M, j) {
    (v = !1), m && ((m = !1), g(T), (T = -1)), (p = !0);
    var S = d;
    try {
      for (
        y(j), f = n(a);
        f !== null && (!(f.expirationTime > j) || (M && !I()));

      ) {
        var U = f.callback;
        if (typeof U == "function") {
          (f.callback = null), (d = f.priorityLevel);
          var oe = U(f.expirationTime <= j);
          (j = t.unstable_now()),
            typeof oe == "function" ? (f.callback = oe) : f === n(a) && r(a),
            y(j);
        } else r(a);
        f = n(a);
      }
      if (f !== null) var ft = !0;
      else {
        var ue = n(u);
        ue !== null && $(_, ue.startTime - j), (ft = !1);
      }
      return ft;
    } finally {
      (f = null), (d = S), (p = !1);
    }
  }
  var E = !1,
    C = null,
    T = -1,
    N = 5,
    R = -1;
  function I() {
    return !(t.unstable_now() - R < N);
  }
  function z() {
    if (C !== null) {
      var M = t.unstable_now();
      R = M;
      var j = !0;
      try {
        j = C(!0, M);
      } finally {
        j ? H() : ((E = !1), (C = null));
      }
    } else E = !1;
  }
  var H;
  if (typeof h == "function")
    H = function () {
      h(z);
    };
  else if (typeof MessageChannel < "u") {
    var X = new MessageChannel(),
      ee = X.port2;
    (X.port1.onmessage = z),
      (H = function () {
        ee.postMessage(null);
      });
  } else
    H = function () {
      x(z, 0);
    };
  function Q(M) {
    (C = M), E || ((E = !0), H());
  }
  function $(M, j) {
    T = x(function () {
      M(t.unstable_now());
    }, j);
  }
  (t.unstable_IdlePriority = 5),
    (t.unstable_ImmediatePriority = 1),
    (t.unstable_LowPriority = 4),
    (t.unstable_NormalPriority = 3),
    (t.unstable_Profiling = null),
    (t.unstable_UserBlockingPriority = 2),
    (t.unstable_cancelCallback = function (M) {
      M.callback = null;
    }),
    (t.unstable_continueExecution = function () {
      v || p || ((v = !0), Q(k));
    }),
    (t.unstable_forceFrameRate = function (M) {
      0 > M || 125 < M
        ? console.error(
            "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
          )
        : (N = 0 < M ? Math.floor(1e3 / M) : 5);
    }),
    (t.unstable_getCurrentPriorityLevel = function () {
      return d;
    }),
    (t.unstable_getFirstCallbackNode = function () {
      return n(a);
    }),
    (t.unstable_next = function (M) {
      switch (d) {
        case 1:
        case 2:
        case 3:
          var j = 3;
          break;
        default:
          j = d;
      }
      var S = d;
      d = j;
      try {
        return M();
      } finally {
        d = S;
      }
    }),
    (t.unstable_pauseExecution = function () {}),
    (t.unstable_requestPaint = function () {}),
    (t.unstable_runWithPriority = function (M, j) {
      switch (M) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          M = 3;
      }
      var S = d;
      d = M;
      try {
        return j();
      } finally {
        d = S;
      }
    }),
    (t.unstable_scheduleCallback = function (M, j, S) {
      var U = t.unstable_now();
      switch (
        (typeof S == "object" && S !== null
          ? ((S = S.delay), (S = typeof S == "number" && 0 < S ? U + S : U))
          : (S = U),
        M)
      ) {
        case 1:
          var oe = -1;
          break;
        case 2:
          oe = 250;
          break;
        case 5:
          oe = 1073741823;
          break;
        case 4:
          oe = 1e4;
          break;
        default:
          oe = 5e3;
      }
      return (
        (oe = S + oe),
        (M = {
          id: c++,
          callback: j,
          priorityLevel: M,
          startTime: S,
          expirationTime: oe,
          sortIndex: -1,
        }),
        S > U
          ? ((M.sortIndex = S),
            e(u, M),
            n(a) === null &&
              M === n(u) &&
              (m ? (g(T), (T = -1)) : (m = !0), $(_, S - U)))
          : ((M.sortIndex = oe), e(a, M), v || p || ((v = !0), Q(k))),
        M
      );
    }),
    (t.unstable_shouldYield = I),
    (t.unstable_wrapCallback = function (M) {
      var j = d;
      return function () {
        var S = d;
        d = j;
        try {
          return M.apply(this, arguments);
        } finally {
          d = S;
        }
      };
    });
})(q0);
K0.exports = q0;
var py = K0.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var hy = P,
  fn = py;
function L(t) {
  for (
    var e = "https://reactjs.org/docs/error-decoder.html?invariant=" + t, n = 1;
    n < arguments.length;
    n++
  )
    e += "&args[]=" + encodeURIComponent(arguments[n]);
  return (
    "Minified React error #" +
    t +
    "; visit " +
    e +
    " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
  );
}
var J0 = new Set(),
  rs = {};
function eo(t, e) {
  Ho(t, e), Ho(t + "Capture", e);
}
function Ho(t, e) {
  for (rs[t] = e, t = 0; t < e.length; t++) J0.add(e[t]);
}
var Sr = !(
    typeof window > "u" ||
    typeof window.document > "u" ||
    typeof window.document.createElement > "u"
  ),
  Hc = Object.prototype.hasOwnProperty,
  my =
    /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
  $p = {},
  Bp = {};
function gy(t) {
  return Hc.call(Bp, t)
    ? !0
    : Hc.call($p, t)
    ? !1
    : my.test(t)
    ? (Bp[t] = !0)
    : (($p[t] = !0), !1);
}
function vy(t, e, n, r) {
  if (n !== null && n.type === 0) return !1;
  switch (typeof e) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      return r
        ? !1
        : n !== null
        ? !n.acceptsBooleans
        : ((t = t.toLowerCase().slice(0, 5)), t !== "data-" && t !== "aria-");
    default:
      return !1;
  }
}
function yy(t, e, n, r) {
  if (e === null || typeof e > "u" || vy(t, e, n, r)) return !0;
  if (r) return !1;
  if (n !== null)
    switch (n.type) {
      case 3:
        return !e;
      case 4:
        return e === !1;
      case 5:
        return isNaN(e);
      case 6:
        return isNaN(e) || 1 > e;
    }
  return !1;
}
function It(t, e, n, r, i, o, l) {
  (this.acceptsBooleans = e === 2 || e === 3 || e === 4),
    (this.attributeName = r),
    (this.attributeNamespace = i),
    (this.mustUseProperty = n),
    (this.propertyName = t),
    (this.type = e),
    (this.sanitizeURL = o),
    (this.removeEmptyString = l);
}
var ct = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
  .split(" ")
  .forEach(function (t) {
    ct[t] = new It(t, 0, !1, t, null, !1, !1);
  });
[
  ["acceptCharset", "accept-charset"],
  ["className", "class"],
  ["htmlFor", "for"],
  ["httpEquiv", "http-equiv"],
].forEach(function (t) {
  var e = t[0];
  ct[e] = new It(e, 1, !1, t[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function (t) {
  ct[t] = new It(t, 2, !1, t.toLowerCase(), null, !1, !1);
});
[
  "autoReverse",
  "externalResourcesRequired",
  "focusable",
  "preserveAlpha",
].forEach(function (t) {
  ct[t] = new It(t, 2, !1, t, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
  .split(" ")
  .forEach(function (t) {
    ct[t] = new It(t, 3, !1, t.toLowerCase(), null, !1, !1);
  });
["checked", "multiple", "muted", "selected"].forEach(function (t) {
  ct[t] = new It(t, 3, !0, t, null, !1, !1);
});
["capture", "download"].forEach(function (t) {
  ct[t] = new It(t, 4, !1, t, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function (t) {
  ct[t] = new It(t, 6, !1, t, null, !1, !1);
});
["rowSpan", "start"].forEach(function (t) {
  ct[t] = new It(t, 5, !1, t.toLowerCase(), null, !1, !1);
});
var hd = /[\-:]([a-z])/g;
function md(t) {
  return t[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
  .split(" ")
  .forEach(function (t) {
    var e = t.replace(hd, md);
    ct[e] = new It(e, 1, !1, t, null, !1, !1);
  });
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
  .split(" ")
  .forEach(function (t) {
    var e = t.replace(hd, md);
    ct[e] = new It(e, 1, !1, t, "http://www.w3.org/1999/xlink", !1, !1);
  });
["xml:base", "xml:lang", "xml:space"].forEach(function (t) {
  var e = t.replace(hd, md);
  ct[e] = new It(e, 1, !1, t, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function (t) {
  ct[t] = new It(t, 1, !1, t.toLowerCase(), null, !1, !1);
});
ct.xlinkHref = new It(
  "xlinkHref",
  1,
  !1,
  "xlink:href",
  "http://www.w3.org/1999/xlink",
  !0,
  !1
);
["src", "href", "action", "formAction"].forEach(function (t) {
  ct[t] = new It(t, 1, !1, t.toLowerCase(), null, !0, !0);
});
function gd(t, e, n, r) {
  var i = ct.hasOwnProperty(e) ? ct[e] : null;
  (i !== null
    ? i.type !== 0
    : r ||
      !(2 < e.length) ||
      (e[0] !== "o" && e[0] !== "O") ||
      (e[1] !== "n" && e[1] !== "N")) &&
    (yy(e, n, i, r) && (n = null),
    r || i === null
      ? gy(e) && (n === null ? t.removeAttribute(e) : t.setAttribute(e, "" + n))
      : i.mustUseProperty
      ? (t[i.propertyName] = n === null ? (i.type === 3 ? !1 : "") : n)
      : ((e = i.attributeName),
        (r = i.attributeNamespace),
        n === null
          ? t.removeAttribute(e)
          : ((i = i.type),
            (n = i === 3 || (i === 4 && n === !0) ? "" : "" + n),
            r ? t.setAttributeNS(r, e, n) : t.setAttribute(e, n))));
}
var Rr = hy.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  Hs = Symbol.for("react.element"),
  vo = Symbol.for("react.portal"),
  yo = Symbol.for("react.fragment"),
  vd = Symbol.for("react.strict_mode"),
  Wc = Symbol.for("react.profiler"),
  Z0 = Symbol.for("react.provider"),
  em = Symbol.for("react.context"),
  yd = Symbol.for("react.forward_ref"),
  Yc = Symbol.for("react.suspense"),
  Xc = Symbol.for("react.suspense_list"),
  _d = Symbol.for("react.memo"),
  br = Symbol.for("react.lazy"),
  tm = Symbol.for("react.offscreen"),
  Up = Symbol.iterator;
function pl(t) {
  return t === null || typeof t != "object"
    ? null
    : ((t = (Up && t[Up]) || t["@@iterator"]),
      typeof t == "function" ? t : null);
}
var Oe = Object.assign,
  ec;
function El(t) {
  if (ec === void 0)
    try {
      throw Error();
    } catch (n) {
      var e = n.stack.trim().match(/\n( *(at )?)/);
      ec = (e && e[1]) || "";
    }
  return (
    `
` +
    ec +
    t
  );
}
var tc = !1;
function nc(t, e) {
  if (!t || tc) return "";
  tc = !0;
  var n = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (e)
      if (
        ((e = function () {
          throw Error();
        }),
        Object.defineProperty(e.prototype, "props", {
          set: function () {
            throw Error();
          },
        }),
        typeof Reflect == "object" && Reflect.construct)
      ) {
        try {
          Reflect.construct(e, []);
        } catch (u) {
          var r = u;
        }
        Reflect.construct(t, [], e);
      } else {
        try {
          e.call();
        } catch (u) {
          r = u;
        }
        t.call(e.prototype);
      }
    else {
      try {
        throw Error();
      } catch (u) {
        r = u;
      }
      t();
    }
  } catch (u) {
    if (u && r && typeof u.stack == "string") {
      for (
        var i = u.stack.split(`
`),
          o = r.stack.split(`
`),
          l = i.length - 1,
          s = o.length - 1;
        1 <= l && 0 <= s && i[l] !== o[s];

      )
        s--;
      for (; 1 <= l && 0 <= s; l--, s--)
        if (i[l] !== o[s]) {
          if (l !== 1 || s !== 1)
            do
              if ((l--, s--, 0 > s || i[l] !== o[s])) {
                var a =
                  `
` + i[l].replace(" at new ", " at ");
                return (
                  t.displayName &&
                    a.includes("<anonymous>") &&
                    (a = a.replace("<anonymous>", t.displayName)),
                  a
                );
              }
            while (1 <= l && 0 <= s);
          break;
        }
    }
  } finally {
    (tc = !1), (Error.prepareStackTrace = n);
  }
  return (t = t ? t.displayName || t.name : "") ? El(t) : "";
}
function _y(t) {
  switch (t.tag) {
    case 5:
      return El(t.type);
    case 16:
      return El("Lazy");
    case 13:
      return El("Suspense");
    case 19:
      return El("SuspenseList");
    case 0:
    case 2:
    case 15:
      return (t = nc(t.type, !1)), t;
    case 11:
      return (t = nc(t.type.render, !1)), t;
    case 1:
      return (t = nc(t.type, !0)), t;
    default:
      return "";
  }
}
function Qc(t) {
  if (t == null) return null;
  if (typeof t == "function") return t.displayName || t.name || null;
  if (typeof t == "string") return t;
  switch (t) {
    case yo:
      return "Fragment";
    case vo:
      return "Portal";
    case Wc:
      return "Profiler";
    case vd:
      return "StrictMode";
    case Yc:
      return "Suspense";
    case Xc:
      return "SuspenseList";
  }
  if (typeof t == "object")
    switch (t.$$typeof) {
      case em:
        return (t.displayName || "Context") + ".Consumer";
      case Z0:
        return (t._context.displayName || "Context") + ".Provider";
      case yd:
        var e = t.render;
        return (
          (t = t.displayName),
          t ||
            ((t = e.displayName || e.name || ""),
            (t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef")),
          t
        );
      case _d:
        return (
          (e = t.displayName || null), e !== null ? e : Qc(t.type) || "Memo"
        );
      case br:
        (e = t._payload), (t = t._init);
        try {
          return Qc(t(e));
        } catch {}
    }
  return null;
}
function xy(t) {
  var e = t.type;
  switch (t.tag) {
    case 24:
      return "Cache";
    case 9:
      return (e.displayName || "Context") + ".Consumer";
    case 10:
      return (e._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return (
        (t = e.render),
        (t = t.displayName || t.name || ""),
        e.displayName || (t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef")
      );
    case 7:
      return "Fragment";
    case 5:
      return e;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Qc(e);
    case 8:
      return e === vd ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof e == "function") return e.displayName || e.name || null;
      if (typeof e == "string") return e;
  }
  return null;
}
function si(t) {
  switch (typeof t) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return t;
    case "object":
      return t;
    default:
      return "";
  }
}
function nm(t) {
  var e = t.type;
  return (
    (t = t.nodeName) &&
    t.toLowerCase() === "input" &&
    (e === "checkbox" || e === "radio")
  );
}
function wy(t) {
  var e = nm(t) ? "checked" : "value",
    n = Object.getOwnPropertyDescriptor(t.constructor.prototype, e),
    r = "" + t[e];
  if (
    !t.hasOwnProperty(e) &&
    typeof n < "u" &&
    typeof n.get == "function" &&
    typeof n.set == "function"
  ) {
    var i = n.get,
      o = n.set;
    return (
      Object.defineProperty(t, e, {
        configurable: !0,
        get: function () {
          return i.call(this);
        },
        set: function (l) {
          (r = "" + l), o.call(this, l);
        },
      }),
      Object.defineProperty(t, e, { enumerable: n.enumerable }),
      {
        getValue: function () {
          return r;
        },
        setValue: function (l) {
          r = "" + l;
        },
        stopTracking: function () {
          (t._valueTracker = null), delete t[e];
        },
      }
    );
  }
}
function Ws(t) {
  t._valueTracker || (t._valueTracker = wy(t));
}
function rm(t) {
  if (!t) return !1;
  var e = t._valueTracker;
  if (!e) return !0;
  var n = e.getValue(),
    r = "";
  return (
    t && (r = nm(t) ? (t.checked ? "true" : "false") : t.value),
    (t = r),
    t !== n ? (e.setValue(t), !0) : !1
  );
}
function Wa(t) {
  if (((t = t || (typeof document < "u" ? document : void 0)), typeof t > "u"))
    return null;
  try {
    return t.activeElement || t.body;
  } catch {
    return t.body;
  }
}
function Gc(t, e) {
  var n = e.checked;
  return Oe({}, e, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: n ?? t._wrapperState.initialChecked,
  });
}
function Vp(t, e) {
  var n = e.defaultValue == null ? "" : e.defaultValue,
    r = e.checked != null ? e.checked : e.defaultChecked;
  (n = si(e.value != null ? e.value : n)),
    (t._wrapperState = {
      initialChecked: r,
      initialValue: n,
      controlled:
        e.type === "checkbox" || e.type === "radio"
          ? e.checked != null
          : e.value != null,
    });
}
function im(t, e) {
  (e = e.checked), e != null && gd(t, "checked", e, !1);
}
function Kc(t, e) {
  im(t, e);
  var n = si(e.value),
    r = e.type;
  if (n != null)
    r === "number"
      ? ((n === 0 && t.value === "") || t.value != n) && (t.value = "" + n)
      : t.value !== "" + n && (t.value = "" + n);
  else if (r === "submit" || r === "reset") {
    t.removeAttribute("value");
    return;
  }
  e.hasOwnProperty("value")
    ? qc(t, e.type, n)
    : e.hasOwnProperty("defaultValue") && qc(t, e.type, si(e.defaultValue)),
    e.checked == null &&
      e.defaultChecked != null &&
      (t.defaultChecked = !!e.defaultChecked);
}
function Hp(t, e, n) {
  if (e.hasOwnProperty("value") || e.hasOwnProperty("defaultValue")) {
    var r = e.type;
    if (
      !(
        (r !== "submit" && r !== "reset") ||
        (e.value !== void 0 && e.value !== null)
      )
    )
      return;
    (e = "" + t._wrapperState.initialValue),
      n || e === t.value || (t.value = e),
      (t.defaultValue = e);
  }
  (n = t.name),
    n !== "" && (t.name = ""),
    (t.defaultChecked = !!t._wrapperState.initialChecked),
    n !== "" && (t.name = n);
}
function qc(t, e, n) {
  (e !== "number" || Wa(t.ownerDocument) !== t) &&
    (n == null
      ? (t.defaultValue = "" + t._wrapperState.initialValue)
      : t.defaultValue !== "" + n && (t.defaultValue = "" + n));
}
var Pl = Array.isArray;
function Lo(t, e, n, r) {
  if (((t = t.options), e)) {
    e = {};
    for (var i = 0; i < n.length; i++) e["$" + n[i]] = !0;
    for (n = 0; n < t.length; n++)
      (i = e.hasOwnProperty("$" + t[n].value)),
        t[n].selected !== i && (t[n].selected = i),
        i && r && (t[n].defaultSelected = !0);
  } else {
    for (n = "" + si(n), e = null, i = 0; i < t.length; i++) {
      if (t[i].value === n) {
        (t[i].selected = !0), r && (t[i].defaultSelected = !0);
        return;
      }
      e !== null || t[i].disabled || (e = t[i]);
    }
    e !== null && (e.selected = !0);
  }
}
function Jc(t, e) {
  if (e.dangerouslySetInnerHTML != null) throw Error(L(91));
  return Oe({}, e, {
    value: void 0,
    defaultValue: void 0,
    children: "" + t._wrapperState.initialValue,
  });
}
function Wp(t, e) {
  var n = e.value;
  if (n == null) {
    if (((n = e.children), (e = e.defaultValue), n != null)) {
      if (e != null) throw Error(L(92));
      if (Pl(n)) {
        if (1 < n.length) throw Error(L(93));
        n = n[0];
      }
      e = n;
    }
    e == null && (e = ""), (n = e);
  }
  t._wrapperState = { initialValue: si(n) };
}
function om(t, e) {
  var n = si(e.value),
    r = si(e.defaultValue);
  n != null &&
    ((n = "" + n),
    n !== t.value && (t.value = n),
    e.defaultValue == null && t.defaultValue !== n && (t.defaultValue = n)),
    r != null && (t.defaultValue = "" + r);
}
function Yp(t) {
  var e = t.textContent;
  e === t._wrapperState.initialValue && e !== "" && e !== null && (t.value = e);
}
function lm(t) {
  switch (t) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function Zc(t, e) {
  return t == null || t === "http://www.w3.org/1999/xhtml"
    ? lm(e)
    : t === "http://www.w3.org/2000/svg" && e === "foreignObject"
    ? "http://www.w3.org/1999/xhtml"
    : t;
}
var Ys,
  sm = (function (t) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction
      ? function (e, n, r, i) {
          MSApp.execUnsafeLocalFunction(function () {
            return t(e, n, r, i);
          });
        }
      : t;
  })(function (t, e) {
    if (t.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in t)
      t.innerHTML = e;
    else {
      for (
        Ys = Ys || document.createElement("div"),
          Ys.innerHTML = "<svg>" + e.valueOf().toString() + "</svg>",
          e = Ys.firstChild;
        t.firstChild;

      )
        t.removeChild(t.firstChild);
      for (; e.firstChild; ) t.appendChild(e.firstChild);
    }
  });
function is(t, e) {
  if (e) {
    var n = t.firstChild;
    if (n && n === t.lastChild && n.nodeType === 3) {
      n.nodeValue = e;
      return;
    }
  }
  t.textContent = e;
}
var Fl = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0,
  },
  Sy = ["Webkit", "ms", "Moz", "O"];
Object.keys(Fl).forEach(function (t) {
  Sy.forEach(function (e) {
    (e = e + t.charAt(0).toUpperCase() + t.substring(1)), (Fl[e] = Fl[t]);
  });
});
function am(t, e, n) {
  return e == null || typeof e == "boolean" || e === ""
    ? ""
    : n || typeof e != "number" || e === 0 || (Fl.hasOwnProperty(t) && Fl[t])
    ? ("" + e).trim()
    : e + "px";
}
function um(t, e) {
  t = t.style;
  for (var n in e)
    if (e.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0,
        i = am(n, e[n], r);
      n === "float" && (n = "cssFloat"), r ? t.setProperty(n, i) : (t[n] = i);
    }
}
var ky = Oe(
  { menuitem: !0 },
  {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0,
  }
);
function ef(t, e) {
  if (e) {
    if (ky[t] && (e.children != null || e.dangerouslySetInnerHTML != null))
      throw Error(L(137, t));
    if (e.dangerouslySetInnerHTML != null) {
      if (e.children != null) throw Error(L(60));
      if (
        typeof e.dangerouslySetInnerHTML != "object" ||
        !("__html" in e.dangerouslySetInnerHTML)
      )
        throw Error(L(61));
    }
    if (e.style != null && typeof e.style != "object") throw Error(L(62));
  }
}
function tf(t, e) {
  if (t.indexOf("-") === -1) return typeof e.is == "string";
  switch (t) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
var nf = null;
function xd(t) {
  return (
    (t = t.target || t.srcElement || window),
    t.correspondingUseElement && (t = t.correspondingUseElement),
    t.nodeType === 3 ? t.parentNode : t
  );
}
var rf = null,
  zo = null,
  Do = null;
function Xp(t) {
  if ((t = zs(t))) {
    if (typeof rf != "function") throw Error(L(280));
    var e = t.stateNode;
    e && ((e = ju(e)), rf(t.stateNode, t.type, e));
  }
}
function cm(t) {
  zo ? (Do ? Do.push(t) : (Do = [t])) : (zo = t);
}
function fm() {
  if (zo) {
    var t = zo,
      e = Do;
    if (((Do = zo = null), Xp(t), e)) for (t = 0; t < e.length; t++) Xp(e[t]);
  }
}
function dm(t, e) {
  return t(e);
}
function pm() {}
var rc = !1;
function hm(t, e, n) {
  if (rc) return t(e, n);
  rc = !0;
  try {
    return dm(t, e, n);
  } finally {
    (rc = !1), (zo !== null || Do !== null) && (pm(), fm());
  }
}
function os(t, e) {
  var n = t.stateNode;
  if (n === null) return null;
  var r = ju(n);
  if (r === null) return null;
  n = r[e];
  e: switch (e) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (r = !r.disabled) ||
        ((t = t.type),
        (r = !(
          t === "button" ||
          t === "input" ||
          t === "select" ||
          t === "textarea"
        ))),
        (t = !r);
      break e;
    default:
      t = !1;
  }
  if (t) return null;
  if (n && typeof n != "function") throw Error(L(231, e, typeof n));
  return n;
}
var of = !1;
if (Sr)
  try {
    var hl = {};
    Object.defineProperty(hl, "passive", {
      get: function () {
        of = !0;
      },
    }),
      window.addEventListener("test", hl, hl),
      window.removeEventListener("test", hl, hl);
  } catch {
    of = !1;
  }
function Cy(t, e, n, r, i, o, l, s, a) {
  var u = Array.prototype.slice.call(arguments, 3);
  try {
    e.apply(n, u);
  } catch (c) {
    this.onError(c);
  }
}
var Al = !1,
  Ya = null,
  Xa = !1,
  lf = null,
  Ey = {
    onError: function (t) {
      (Al = !0), (Ya = t);
    },
  };
function Py(t, e, n, r, i, o, l, s, a) {
  (Al = !1), (Ya = null), Cy.apply(Ey, arguments);
}
function Ty(t, e, n, r, i, o, l, s, a) {
  if ((Py.apply(this, arguments), Al)) {
    if (Al) {
      var u = Ya;
      (Al = !1), (Ya = null);
    } else throw Error(L(198));
    Xa || ((Xa = !0), (lf = u));
  }
}
function to(t) {
  var e = t,
    n = t;
  if (t.alternate) for (; e.return; ) e = e.return;
  else {
    t = e;
    do (e = t), e.flags & 4098 && (n = e.return), (t = e.return);
    while (t);
  }
  return e.tag === 3 ? n : null;
}
function mm(t) {
  if (t.tag === 13) {
    var e = t.memoizedState;
    if (
      (e === null && ((t = t.alternate), t !== null && (e = t.memoizedState)),
      e !== null)
    )
      return e.dehydrated;
  }
  return null;
}
function Qp(t) {
  if (to(t) !== t) throw Error(L(188));
}
function Ny(t) {
  var e = t.alternate;
  if (!e) {
    if (((e = to(t)), e === null)) throw Error(L(188));
    return e !== t ? null : t;
  }
  for (var n = t, r = e; ; ) {
    var i = n.return;
    if (i === null) break;
    var o = i.alternate;
    if (o === null) {
      if (((r = i.return), r !== null)) {
        n = r;
        continue;
      }
      break;
    }
    if (i.child === o.child) {
      for (o = i.child; o; ) {
        if (o === n) return Qp(i), t;
        if (o === r) return Qp(i), e;
        o = o.sibling;
      }
      throw Error(L(188));
    }
    if (n.return !== r.return) (n = i), (r = o);
    else {
      for (var l = !1, s = i.child; s; ) {
        if (s === n) {
          (l = !0), (n = i), (r = o);
          break;
        }
        if (s === r) {
          (l = !0), (r = i), (n = o);
          break;
        }
        s = s.sibling;
      }
      if (!l) {
        for (s = o.child; s; ) {
          if (s === n) {
            (l = !0), (n = o), (r = i);
            break;
          }
          if (s === r) {
            (l = !0), (r = o), (n = i);
            break;
          }
          s = s.sibling;
        }
        if (!l) throw Error(L(189));
      }
    }
    if (n.alternate !== r) throw Error(L(190));
  }
  if (n.tag !== 3) throw Error(L(188));
  return n.stateNode.current === n ? t : e;
}
function gm(t) {
  return (t = Ny(t)), t !== null ? vm(t) : null;
}
function vm(t) {
  if (t.tag === 5 || t.tag === 6) return t;
  for (t = t.child; t !== null; ) {
    var e = vm(t);
    if (e !== null) return e;
    t = t.sibling;
  }
  return null;
}
var ym = fn.unstable_scheduleCallback,
  Gp = fn.unstable_cancelCallback,
  Ry = fn.unstable_shouldYield,
  Oy = fn.unstable_requestPaint,
  be = fn.unstable_now,
  My = fn.unstable_getCurrentPriorityLevel,
  wd = fn.unstable_ImmediatePriority,
  _m = fn.unstable_UserBlockingPriority,
  Qa = fn.unstable_NormalPriority,
  Ly = fn.unstable_LowPriority,
  xm = fn.unstable_IdlePriority,
  Mu = null,
  tr = null;
function zy(t) {
  if (tr && typeof tr.onCommitFiberRoot == "function")
    try {
      tr.onCommitFiberRoot(Mu, t, void 0, (t.current.flags & 128) === 128);
    } catch {}
}
var Bn = Math.clz32 ? Math.clz32 : Fy,
  Dy = Math.log,
  jy = Math.LN2;
function Fy(t) {
  return (t >>>= 0), t === 0 ? 32 : (31 - ((Dy(t) / jy) | 0)) | 0;
}
var Xs = 64,
  Qs = 4194304;
function Tl(t) {
  switch (t & -t) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return t & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return t;
  }
}
function Ga(t, e) {
  var n = t.pendingLanes;
  if (n === 0) return 0;
  var r = 0,
    i = t.suspendedLanes,
    o = t.pingedLanes,
    l = n & 268435455;
  if (l !== 0) {
    var s = l & ~i;
    s !== 0 ? (r = Tl(s)) : ((o &= l), o !== 0 && (r = Tl(o)));
  } else (l = n & ~i), l !== 0 ? (r = Tl(l)) : o !== 0 && (r = Tl(o));
  if (r === 0) return 0;
  if (
    e !== 0 &&
    e !== r &&
    !(e & i) &&
    ((i = r & -r), (o = e & -e), i >= o || (i === 16 && (o & 4194240) !== 0))
  )
    return e;
  if ((r & 4 && (r |= n & 16), (e = t.entangledLanes), e !== 0))
    for (t = t.entanglements, e &= r; 0 < e; )
      (n = 31 - Bn(e)), (i = 1 << n), (r |= t[n]), (e &= ~i);
  return r;
}
function Ay(t, e) {
  switch (t) {
    case 1:
    case 2:
    case 4:
      return e + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function Iy(t, e) {
  for (
    var n = t.suspendedLanes,
      r = t.pingedLanes,
      i = t.expirationTimes,
      o = t.pendingLanes;
    0 < o;

  ) {
    var l = 31 - Bn(o),
      s = 1 << l,
      a = i[l];
    a === -1
      ? (!(s & n) || s & r) && (i[l] = Ay(s, e))
      : a <= e && (t.expiredLanes |= s),
      (o &= ~s);
  }
}
function sf(t) {
  return (
    (t = t.pendingLanes & -1073741825),
    t !== 0 ? t : t & 1073741824 ? 1073741824 : 0
  );
}
function wm() {
  var t = Xs;
  return (Xs <<= 1), !(Xs & 4194240) && (Xs = 64), t;
}
function ic(t) {
  for (var e = [], n = 0; 31 > n; n++) e.push(t);
  return e;
}
function Ms(t, e, n) {
  (t.pendingLanes |= e),
    e !== 536870912 && ((t.suspendedLanes = 0), (t.pingedLanes = 0)),
    (t = t.eventTimes),
    (e = 31 - Bn(e)),
    (t[e] = n);
}
function by(t, e) {
  var n = t.pendingLanes & ~e;
  (t.pendingLanes = e),
    (t.suspendedLanes = 0),
    (t.pingedLanes = 0),
    (t.expiredLanes &= e),
    (t.mutableReadLanes &= e),
    (t.entangledLanes &= e),
    (e = t.entanglements);
  var r = t.eventTimes;
  for (t = t.expirationTimes; 0 < n; ) {
    var i = 31 - Bn(n),
      o = 1 << i;
    (e[i] = 0), (r[i] = -1), (t[i] = -1), (n &= ~o);
  }
}
function Sd(t, e) {
  var n = (t.entangledLanes |= e);
  for (t = t.entanglements; n; ) {
    var r = 31 - Bn(n),
      i = 1 << r;
    (i & e) | (t[r] & e) && (t[r] |= e), (n &= ~i);
  }
}
var ce = 0;
function Sm(t) {
  return (t &= -t), 1 < t ? (4 < t ? (t & 268435455 ? 16 : 536870912) : 4) : 1;
}
var km,
  kd,
  Cm,
  Em,
  Pm,
  af = !1,
  Gs = [],
  Kr = null,
  qr = null,
  Jr = null,
  ls = new Map(),
  ss = new Map(),
  Br = [],
  $y =
    "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
      " "
    );
function Kp(t, e) {
  switch (t) {
    case "focusin":
    case "focusout":
      Kr = null;
      break;
    case "dragenter":
    case "dragleave":
      qr = null;
      break;
    case "mouseover":
    case "mouseout":
      Jr = null;
      break;
    case "pointerover":
    case "pointerout":
      ls.delete(e.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      ss.delete(e.pointerId);
  }
}
function ml(t, e, n, r, i, o) {
  return t === null || t.nativeEvent !== o
    ? ((t = {
        blockedOn: e,
        domEventName: n,
        eventSystemFlags: r,
        nativeEvent: o,
        targetContainers: [i],
      }),
      e !== null && ((e = zs(e)), e !== null && kd(e)),
      t)
    : ((t.eventSystemFlags |= r),
      (e = t.targetContainers),
      i !== null && e.indexOf(i) === -1 && e.push(i),
      t);
}
function By(t, e, n, r, i) {
  switch (e) {
    case "focusin":
      return (Kr = ml(Kr, t, e, n, r, i)), !0;
    case "dragenter":
      return (qr = ml(qr, t, e, n, r, i)), !0;
    case "mouseover":
      return (Jr = ml(Jr, t, e, n, r, i)), !0;
    case "pointerover":
      var o = i.pointerId;
      return ls.set(o, ml(ls.get(o) || null, t, e, n, r, i)), !0;
    case "gotpointercapture":
      return (
        (o = i.pointerId), ss.set(o, ml(ss.get(o) || null, t, e, n, r, i)), !0
      );
  }
  return !1;
}
function Tm(t) {
  var e = Ri(t.target);
  if (e !== null) {
    var n = to(e);
    if (n !== null) {
      if (((e = n.tag), e === 13)) {
        if (((e = mm(n)), e !== null)) {
          (t.blockedOn = e),
            Pm(t.priority, function () {
              Cm(n);
            });
          return;
        }
      } else if (e === 3 && n.stateNode.current.memoizedState.isDehydrated) {
        t.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
        return;
      }
    }
  }
  t.blockedOn = null;
}
function Ca(t) {
  if (t.blockedOn !== null) return !1;
  for (var e = t.targetContainers; 0 < e.length; ) {
    var n = uf(t.domEventName, t.eventSystemFlags, e[0], t.nativeEvent);
    if (n === null) {
      n = t.nativeEvent;
      var r = new n.constructor(n.type, n);
      (nf = r), n.target.dispatchEvent(r), (nf = null);
    } else return (e = zs(n)), e !== null && kd(e), (t.blockedOn = n), !1;
    e.shift();
  }
  return !0;
}
function qp(t, e, n) {
  Ca(t) && n.delete(e);
}
function Uy() {
  (af = !1),
    Kr !== null && Ca(Kr) && (Kr = null),
    qr !== null && Ca(qr) && (qr = null),
    Jr !== null && Ca(Jr) && (Jr = null),
    ls.forEach(qp),
    ss.forEach(qp);
}
function gl(t, e) {
  t.blockedOn === e &&
    ((t.blockedOn = null),
    af ||
      ((af = !0),
      fn.unstable_scheduleCallback(fn.unstable_NormalPriority, Uy)));
}
function as(t) {
  function e(i) {
    return gl(i, t);
  }
  if (0 < Gs.length) {
    gl(Gs[0], t);
    for (var n = 1; n < Gs.length; n++) {
      var r = Gs[n];
      r.blockedOn === t && (r.blockedOn = null);
    }
  }
  for (
    Kr !== null && gl(Kr, t),
      qr !== null && gl(qr, t),
      Jr !== null && gl(Jr, t),
      ls.forEach(e),
      ss.forEach(e),
      n = 0;
    n < Br.length;
    n++
  )
    (r = Br[n]), r.blockedOn === t && (r.blockedOn = null);
  for (; 0 < Br.length && ((n = Br[0]), n.blockedOn === null); )
    Tm(n), n.blockedOn === null && Br.shift();
}
var jo = Rr.ReactCurrentBatchConfig,
  Ka = !0;
function Vy(t, e, n, r) {
  var i = ce,
    o = jo.transition;
  jo.transition = null;
  try {
    (ce = 1), Cd(t, e, n, r);
  } finally {
    (ce = i), (jo.transition = o);
  }
}
function Hy(t, e, n, r) {
  var i = ce,
    o = jo.transition;
  jo.transition = null;
  try {
    (ce = 4), Cd(t, e, n, r);
  } finally {
    (ce = i), (jo.transition = o);
  }
}
function Cd(t, e, n, r) {
  if (Ka) {
    var i = uf(t, e, n, r);
    if (i === null) hc(t, e, r, qa, n), Kp(t, r);
    else if (By(i, t, e, n, r)) r.stopPropagation();
    else if ((Kp(t, r), e & 4 && -1 < $y.indexOf(t))) {
      for (; i !== null; ) {
        var o = zs(i);
        if (
          (o !== null && km(o),
          (o = uf(t, e, n, r)),
          o === null && hc(t, e, r, qa, n),
          o === i)
        )
          break;
        i = o;
      }
      i !== null && r.stopPropagation();
    } else hc(t, e, r, null, n);
  }
}
var qa = null;
function uf(t, e, n, r) {
  if (((qa = null), (t = xd(r)), (t = Ri(t)), t !== null))
    if (((e = to(t)), e === null)) t = null;
    else if (((n = e.tag), n === 13)) {
      if (((t = mm(e)), t !== null)) return t;
      t = null;
    } else if (n === 3) {
      if (e.stateNode.current.memoizedState.isDehydrated)
        return e.tag === 3 ? e.stateNode.containerInfo : null;
      t = null;
    } else e !== t && (t = null);
  return (qa = t), null;
}
function Nm(t) {
  switch (t) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (My()) {
        case wd:
          return 1;
        case _m:
          return 4;
        case Qa:
        case Ly:
          return 16;
        case xm:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var Vr = null,
  Ed = null,
  Ea = null;
function Rm() {
  if (Ea) return Ea;
  var t,
    e = Ed,
    n = e.length,
    r,
    i = "value" in Vr ? Vr.value : Vr.textContent,
    o = i.length;
  for (t = 0; t < n && e[t] === i[t]; t++);
  var l = n - t;
  for (r = 1; r <= l && e[n - r] === i[o - r]; r++);
  return (Ea = i.slice(t, 1 < r ? 1 - r : void 0));
}
function Pa(t) {
  var e = t.keyCode;
  return (
    "charCode" in t
      ? ((t = t.charCode), t === 0 && e === 13 && (t = 13))
      : (t = e),
    t === 10 && (t = 13),
    32 <= t || t === 13 ? t : 0
  );
}
function Ks() {
  return !0;
}
function Jp() {
  return !1;
}
function hn(t) {
  function e(n, r, i, o, l) {
    (this._reactName = n),
      (this._targetInst = i),
      (this.type = r),
      (this.nativeEvent = o),
      (this.target = l),
      (this.currentTarget = null);
    for (var s in t)
      t.hasOwnProperty(s) && ((n = t[s]), (this[s] = n ? n(o) : o[s]));
    return (
      (this.isDefaultPrevented = (
        o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1
      )
        ? Ks
        : Jp),
      (this.isPropagationStopped = Jp),
      this
    );
  }
  return (
    Oe(e.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n &&
          (n.preventDefault
            ? n.preventDefault()
            : typeof n.returnValue != "unknown" && (n.returnValue = !1),
          (this.isDefaultPrevented = Ks));
      },
      stopPropagation: function () {
        var n = this.nativeEvent;
        n &&
          (n.stopPropagation
            ? n.stopPropagation()
            : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
          (this.isPropagationStopped = Ks));
      },
      persist: function () {},
      isPersistent: Ks,
    }),
    e
  );
}
var il = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (t) {
      return t.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0,
  },
  Pd = hn(il),
  Ls = Oe({}, il, { view: 0, detail: 0 }),
  Wy = hn(Ls),
  oc,
  lc,
  vl,
  Lu = Oe({}, Ls, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: Td,
    button: 0,
    buttons: 0,
    relatedTarget: function (t) {
      return t.relatedTarget === void 0
        ? t.fromElement === t.srcElement
          ? t.toElement
          : t.fromElement
        : t.relatedTarget;
    },
    movementX: function (t) {
      return "movementX" in t
        ? t.movementX
        : (t !== vl &&
            (vl && t.type === "mousemove"
              ? ((oc = t.screenX - vl.screenX), (lc = t.screenY - vl.screenY))
              : (lc = oc = 0),
            (vl = t)),
          oc);
    },
    movementY: function (t) {
      return "movementY" in t ? t.movementY : lc;
    },
  }),
  Zp = hn(Lu),
  Yy = Oe({}, Lu, { dataTransfer: 0 }),
  Xy = hn(Yy),
  Qy = Oe({}, Ls, { relatedTarget: 0 }),
  sc = hn(Qy),
  Gy = Oe({}, il, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  Ky = hn(Gy),
  qy = Oe({}, il, {
    clipboardData: function (t) {
      return "clipboardData" in t ? t.clipboardData : window.clipboardData;
    },
  }),
  Jy = hn(qy),
  Zy = Oe({}, il, { data: 0 }),
  eh = hn(Zy),
  e_ = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified",
  },
  t_ = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta",
  },
  n_ = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey",
  };
function r_(t) {
  var e = this.nativeEvent;
  return e.getModifierState ? e.getModifierState(t) : (t = n_[t]) ? !!e[t] : !1;
}
function Td() {
  return r_;
}
var i_ = Oe({}, Ls, {
    key: function (t) {
      if (t.key) {
        var e = e_[t.key] || t.key;
        if (e !== "Unidentified") return e;
      }
      return t.type === "keypress"
        ? ((t = Pa(t)), t === 13 ? "Enter" : String.fromCharCode(t))
        : t.type === "keydown" || t.type === "keyup"
        ? t_[t.keyCode] || "Unidentified"
        : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Td,
    charCode: function (t) {
      return t.type === "keypress" ? Pa(t) : 0;
    },
    keyCode: function (t) {
      return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    },
    which: function (t) {
      return t.type === "keypress"
        ? Pa(t)
        : t.type === "keydown" || t.type === "keyup"
        ? t.keyCode
        : 0;
    },
  }),
  o_ = hn(i_),
  l_ = Oe({}, Lu, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0,
  }),
  th = hn(l_),
  s_ = Oe({}, Ls, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Td,
  }),
  a_ = hn(s_),
  u_ = Oe({}, il, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  c_ = hn(u_),
  f_ = Oe({}, Lu, {
    deltaX: function (t) {
      return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
    },
    deltaY: function (t) {
      return "deltaY" in t
        ? t.deltaY
        : "wheelDeltaY" in t
        ? -t.wheelDeltaY
        : "wheelDelta" in t
        ? -t.wheelDelta
        : 0;
    },
    deltaZ: 0,
    deltaMode: 0,
  }),
  d_ = hn(f_),
  p_ = [9, 13, 27, 32],
  Nd = Sr && "CompositionEvent" in window,
  Il = null;
Sr && "documentMode" in document && (Il = document.documentMode);
var h_ = Sr && "TextEvent" in window && !Il,
  Om = Sr && (!Nd || (Il && 8 < Il && 11 >= Il)),
  nh = " ",
  rh = !1;
function Mm(t, e) {
  switch (t) {
    case "keyup":
      return p_.indexOf(e.keyCode) !== -1;
    case "keydown":
      return e.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return !0;
    default:
      return !1;
  }
}
function Lm(t) {
  return (t = t.detail), typeof t == "object" && "data" in t ? t.data : null;
}
var _o = !1;
function m_(t, e) {
  switch (t) {
    case "compositionend":
      return Lm(e);
    case "keypress":
      return e.which !== 32 ? null : ((rh = !0), nh);
    case "textInput":
      return (t = e.data), t === nh && rh ? null : t;
    default:
      return null;
  }
}
function g_(t, e) {
  if (_o)
    return t === "compositionend" || (!Nd && Mm(t, e))
      ? ((t = Rm()), (Ea = Ed = Vr = null), (_o = !1), t)
      : null;
  switch (t) {
    case "paste":
      return null;
    case "keypress":
      if (!(e.ctrlKey || e.altKey || e.metaKey) || (e.ctrlKey && e.altKey)) {
        if (e.char && 1 < e.char.length) return e.char;
        if (e.which) return String.fromCharCode(e.which);
      }
      return null;
    case "compositionend":
      return Om && e.locale !== "ko" ? null : e.data;
    default:
      return null;
  }
}
var v_ = {
  color: !0,
  date: !0,
  datetime: !0,
  "datetime-local": !0,
  email: !0,
  month: !0,
  number: !0,
  password: !0,
  range: !0,
  search: !0,
  tel: !0,
  text: !0,
  time: !0,
  url: !0,
  week: !0,
};
function ih(t) {
  var e = t && t.nodeName && t.nodeName.toLowerCase();
  return e === "input" ? !!v_[t.type] : e === "textarea";
}
function zm(t, e, n, r) {
  cm(r),
    (e = Ja(e, "onChange")),
    0 < e.length &&
      ((n = new Pd("onChange", "change", null, n, r)),
      t.push({ event: n, listeners: e }));
}
var bl = null,
  us = null;
function y_(t) {
  Hm(t, 0);
}
function zu(t) {
  var e = So(t);
  if (rm(e)) return t;
}
function __(t, e) {
  if (t === "change") return e;
}
var Dm = !1;
if (Sr) {
  var ac;
  if (Sr) {
    var uc = "oninput" in document;
    if (!uc) {
      var oh = document.createElement("div");
      oh.setAttribute("oninput", "return;"),
        (uc = typeof oh.oninput == "function");
    }
    ac = uc;
  } else ac = !1;
  Dm = ac && (!document.documentMode || 9 < document.documentMode);
}
function lh() {
  bl && (bl.detachEvent("onpropertychange", jm), (us = bl = null));
}
function jm(t) {
  if (t.propertyName === "value" && zu(us)) {
    var e = [];
    zm(e, us, t, xd(t)), hm(y_, e);
  }
}
function x_(t, e, n) {
  t === "focusin"
    ? (lh(), (bl = e), (us = n), bl.attachEvent("onpropertychange", jm))
    : t === "focusout" && lh();
}
function w_(t) {
  if (t === "selectionchange" || t === "keyup" || t === "keydown")
    return zu(us);
}
function S_(t, e) {
  if (t === "click") return zu(e);
}
function k_(t, e) {
  if (t === "input" || t === "change") return zu(e);
}
function C_(t, e) {
  return (t === e && (t !== 0 || 1 / t === 1 / e)) || (t !== t && e !== e);
}
var Vn = typeof Object.is == "function" ? Object.is : C_;
function cs(t, e) {
  if (Vn(t, e)) return !0;
  if (typeof t != "object" || t === null || typeof e != "object" || e === null)
    return !1;
  var n = Object.keys(t),
    r = Object.keys(e);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var i = n[r];
    if (!Hc.call(e, i) || !Vn(t[i], e[i])) return !1;
  }
  return !0;
}
function sh(t) {
  for (; t && t.firstChild; ) t = t.firstChild;
  return t;
}
function ah(t, e) {
  var n = sh(t);
  t = 0;
  for (var r; n; ) {
    if (n.nodeType === 3) {
      if (((r = t + n.textContent.length), t <= e && r >= e))
        return { node: n, offset: e - t };
      t = r;
    }
    e: {
      for (; n; ) {
        if (n.nextSibling) {
          n = n.nextSibling;
          break e;
        }
        n = n.parentNode;
      }
      n = void 0;
    }
    n = sh(n);
  }
}
function Fm(t, e) {
  return t && e
    ? t === e
      ? !0
      : t && t.nodeType === 3
      ? !1
      : e && e.nodeType === 3
      ? Fm(t, e.parentNode)
      : "contains" in t
      ? t.contains(e)
      : t.compareDocumentPosition
      ? !!(t.compareDocumentPosition(e) & 16)
      : !1
    : !1;
}
function Am() {
  for (var t = window, e = Wa(); e instanceof t.HTMLIFrameElement; ) {
    try {
      var n = typeof e.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) t = e.contentWindow;
    else break;
    e = Wa(t.document);
  }
  return e;
}
function Rd(t) {
  var e = t && t.nodeName && t.nodeName.toLowerCase();
  return (
    e &&
    ((e === "input" &&
      (t.type === "text" ||
        t.type === "search" ||
        t.type === "tel" ||
        t.type === "url" ||
        t.type === "password")) ||
      e === "textarea" ||
      t.contentEditable === "true")
  );
}
function E_(t) {
  var e = Am(),
    n = t.focusedElem,
    r = t.selectionRange;
  if (
    e !== n &&
    n &&
    n.ownerDocument &&
    Fm(n.ownerDocument.documentElement, n)
  ) {
    if (r !== null && Rd(n)) {
      if (
        ((e = r.start),
        (t = r.end),
        t === void 0 && (t = e),
        "selectionStart" in n)
      )
        (n.selectionStart = e), (n.selectionEnd = Math.min(t, n.value.length));
      else if (
        ((t = ((e = n.ownerDocument || document) && e.defaultView) || window),
        t.getSelection)
      ) {
        t = t.getSelection();
        var i = n.textContent.length,
          o = Math.min(r.start, i);
        (r = r.end === void 0 ? o : Math.min(r.end, i)),
          !t.extend && o > r && ((i = r), (r = o), (o = i)),
          (i = ah(n, o));
        var l = ah(n, r);
        i &&
          l &&
          (t.rangeCount !== 1 ||
            t.anchorNode !== i.node ||
            t.anchorOffset !== i.offset ||
            t.focusNode !== l.node ||
            t.focusOffset !== l.offset) &&
          ((e = e.createRange()),
          e.setStart(i.node, i.offset),
          t.removeAllRanges(),
          o > r
            ? (t.addRange(e), t.extend(l.node, l.offset))
            : (e.setEnd(l.node, l.offset), t.addRange(e)));
      }
    }
    for (e = [], t = n; (t = t.parentNode); )
      t.nodeType === 1 &&
        e.push({ element: t, left: t.scrollLeft, top: t.scrollTop });
    for (typeof n.focus == "function" && n.focus(), n = 0; n < e.length; n++)
      (t = e[n]),
        (t.element.scrollLeft = t.left),
        (t.element.scrollTop = t.top);
  }
}
var P_ = Sr && "documentMode" in document && 11 >= document.documentMode,
  xo = null,
  cf = null,
  $l = null,
  ff = !1;
function uh(t, e, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  ff ||
    xo == null ||
    xo !== Wa(r) ||
    ((r = xo),
    "selectionStart" in r && Rd(r)
      ? (r = { start: r.selectionStart, end: r.selectionEnd })
      : ((r = (
          (r.ownerDocument && r.ownerDocument.defaultView) ||
          window
        ).getSelection()),
        (r = {
          anchorNode: r.anchorNode,
          anchorOffset: r.anchorOffset,
          focusNode: r.focusNode,
          focusOffset: r.focusOffset,
        })),
    ($l && cs($l, r)) ||
      (($l = r),
      (r = Ja(cf, "onSelect")),
      0 < r.length &&
        ((e = new Pd("onSelect", "select", null, e, n)),
        t.push({ event: e, listeners: r }),
        (e.target = xo))));
}
function qs(t, e) {
  var n = {};
  return (
    (n[t.toLowerCase()] = e.toLowerCase()),
    (n["Webkit" + t] = "webkit" + e),
    (n["Moz" + t] = "moz" + e),
    n
  );
}
var wo = {
    animationend: qs("Animation", "AnimationEnd"),
    animationiteration: qs("Animation", "AnimationIteration"),
    animationstart: qs("Animation", "AnimationStart"),
    transitionend: qs("Transition", "TransitionEnd"),
  },
  cc = {},
  Im = {};
Sr &&
  ((Im = document.createElement("div").style),
  "AnimationEvent" in window ||
    (delete wo.animationend.animation,
    delete wo.animationiteration.animation,
    delete wo.animationstart.animation),
  "TransitionEvent" in window || delete wo.transitionend.transition);
function Du(t) {
  if (cc[t]) return cc[t];
  if (!wo[t]) return t;
  var e = wo[t],
    n;
  for (n in e) if (e.hasOwnProperty(n) && n in Im) return (cc[t] = e[n]);
  return t;
}
var bm = Du("animationend"),
  $m = Du("animationiteration"),
  Bm = Du("animationstart"),
  Um = Du("transitionend"),
  Vm = new Map(),
  ch =
    "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
      " "
    );
function pi(t, e) {
  Vm.set(t, e), eo(e, [t]);
}
for (var fc = 0; fc < ch.length; fc++) {
  var dc = ch[fc],
    T_ = dc.toLowerCase(),
    N_ = dc[0].toUpperCase() + dc.slice(1);
  pi(T_, "on" + N_);
}
pi(bm, "onAnimationEnd");
pi($m, "onAnimationIteration");
pi(Bm, "onAnimationStart");
pi("dblclick", "onDoubleClick");
pi("focusin", "onFocus");
pi("focusout", "onBlur");
pi(Um, "onTransitionEnd");
Ho("onMouseEnter", ["mouseout", "mouseover"]);
Ho("onMouseLeave", ["mouseout", "mouseover"]);
Ho("onPointerEnter", ["pointerout", "pointerover"]);
Ho("onPointerLeave", ["pointerout", "pointerover"]);
eo(
  "onChange",
  "change click focusin focusout input keydown keyup selectionchange".split(" ")
);
eo(
  "onSelect",
  "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
    " "
  )
);
eo("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
eo(
  "onCompositionEnd",
  "compositionend focusout keydown keypress keyup mousedown".split(" ")
);
eo(
  "onCompositionStart",
  "compositionstart focusout keydown keypress keyup mousedown".split(" ")
);
eo(
  "onCompositionUpdate",
  "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
);
var Nl =
    "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
      " "
    ),
  R_ = new Set("cancel close invalid load scroll toggle".split(" ").concat(Nl));
function fh(t, e, n) {
  var r = t.type || "unknown-event";
  (t.currentTarget = n), Ty(r, e, void 0, t), (t.currentTarget = null);
}
function Hm(t, e) {
  e = (e & 4) !== 0;
  for (var n = 0; n < t.length; n++) {
    var r = t[n],
      i = r.event;
    r = r.listeners;
    e: {
      var o = void 0;
      if (e)
        for (var l = r.length - 1; 0 <= l; l--) {
          var s = r[l],
            a = s.instance,
            u = s.currentTarget;
          if (((s = s.listener), a !== o && i.isPropagationStopped())) break e;
          fh(i, s, u), (o = a);
        }
      else
        for (l = 0; l < r.length; l++) {
          if (
            ((s = r[l]),
            (a = s.instance),
            (u = s.currentTarget),
            (s = s.listener),
            a !== o && i.isPropagationStopped())
          )
            break e;
          fh(i, s, u), (o = a);
        }
    }
  }
  if (Xa) throw ((t = lf), (Xa = !1), (lf = null), t);
}
function ge(t, e) {
  var n = e[gf];
  n === void 0 && (n = e[gf] = new Set());
  var r = t + "__bubble";
  n.has(r) || (Wm(e, t, 2, !1), n.add(r));
}
function pc(t, e, n) {
  var r = 0;
  e && (r |= 4), Wm(n, t, r, e);
}
var Js = "_reactListening" + Math.random().toString(36).slice(2);
function fs(t) {
  if (!t[Js]) {
    (t[Js] = !0),
      J0.forEach(function (n) {
        n !== "selectionchange" && (R_.has(n) || pc(n, !1, t), pc(n, !0, t));
      });
    var e = t.nodeType === 9 ? t : t.ownerDocument;
    e === null || e[Js] || ((e[Js] = !0), pc("selectionchange", !1, e));
  }
}
function Wm(t, e, n, r) {
  switch (Nm(e)) {
    case 1:
      var i = Vy;
      break;
    case 4:
      i = Hy;
      break;
    default:
      i = Cd;
  }
  (n = i.bind(null, e, n, t)),
    (i = void 0),
    !of ||
      (e !== "touchstart" && e !== "touchmove" && e !== "wheel") ||
      (i = !0),
    r
      ? i !== void 0
        ? t.addEventListener(e, n, { capture: !0, passive: i })
        : t.addEventListener(e, n, !0)
      : i !== void 0
      ? t.addEventListener(e, n, { passive: i })
      : t.addEventListener(e, n, !1);
}
function hc(t, e, n, r, i) {
  var o = r;
  if (!(e & 1) && !(e & 2) && r !== null)
    e: for (;;) {
      if (r === null) return;
      var l = r.tag;
      if (l === 3 || l === 4) {
        var s = r.stateNode.containerInfo;
        if (s === i || (s.nodeType === 8 && s.parentNode === i)) break;
        if (l === 4)
          for (l = r.return; l !== null; ) {
            var a = l.tag;
            if (
              (a === 3 || a === 4) &&
              ((a = l.stateNode.containerInfo),
              a === i || (a.nodeType === 8 && a.parentNode === i))
            )
              return;
            l = l.return;
          }
        for (; s !== null; ) {
          if (((l = Ri(s)), l === null)) return;
          if (((a = l.tag), a === 5 || a === 6)) {
            r = o = l;
            continue e;
          }
          s = s.parentNode;
        }
      }
      r = r.return;
    }
  hm(function () {
    var u = o,
      c = xd(n),
      f = [];
    e: {
      var d = Vm.get(t);
      if (d !== void 0) {
        var p = Pd,
          v = t;
        switch (t) {
          case "keypress":
            if (Pa(n) === 0) break e;
          case "keydown":
          case "keyup":
            p = o_;
            break;
          case "focusin":
            (v = "focus"), (p = sc);
            break;
          case "focusout":
            (v = "blur"), (p = sc);
            break;
          case "beforeblur":
          case "afterblur":
            p = sc;
            break;
          case "click":
            if (n.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            p = Zp;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            p = Xy;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            p = a_;
            break;
          case bm:
          case $m:
          case Bm:
            p = Ky;
            break;
          case Um:
            p = c_;
            break;
          case "scroll":
            p = Wy;
            break;
          case "wheel":
            p = d_;
            break;
          case "copy":
          case "cut":
          case "paste":
            p = Jy;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            p = th;
        }
        var m = (e & 4) !== 0,
          x = !m && t === "scroll",
          g = m ? (d !== null ? d + "Capture" : null) : d;
        m = [];
        for (var h = u, y; h !== null; ) {
          y = h;
          var _ = y.stateNode;
          if (
            (y.tag === 5 &&
              _ !== null &&
              ((y = _),
              g !== null && ((_ = os(h, g)), _ != null && m.push(ds(h, _, y)))),
            x)
          )
            break;
          h = h.return;
        }
        0 < m.length &&
          ((d = new p(d, v, null, n, c)), f.push({ event: d, listeners: m }));
      }
    }
    if (!(e & 7)) {
      e: {
        if (
          ((d = t === "mouseover" || t === "pointerover"),
          (p = t === "mouseout" || t === "pointerout"),
          d &&
            n !== nf &&
            (v = n.relatedTarget || n.fromElement) &&
            (Ri(v) || v[kr]))
        )
          break e;
        if (
          (p || d) &&
          ((d =
            c.window === c
              ? c
              : (d = c.ownerDocument)
              ? d.defaultView || d.parentWindow
              : window),
          p
            ? ((v = n.relatedTarget || n.toElement),
              (p = u),
              (v = v ? Ri(v) : null),
              v !== null &&
                ((x = to(v)), v !== x || (v.tag !== 5 && v.tag !== 6)) &&
                (v = null))
            : ((p = null), (v = u)),
          p !== v)
        ) {
          if (
            ((m = Zp),
            (_ = "onMouseLeave"),
            (g = "onMouseEnter"),
            (h = "mouse"),
            (t === "pointerout" || t === "pointerover") &&
              ((m = th),
              (_ = "onPointerLeave"),
              (g = "onPointerEnter"),
              (h = "pointer")),
            (x = p == null ? d : So(p)),
            (y = v == null ? d : So(v)),
            (d = new m(_, h + "leave", p, n, c)),
            (d.target = x),
            (d.relatedTarget = y),
            (_ = null),
            Ri(c) === u &&
              ((m = new m(g, h + "enter", v, n, c)),
              (m.target = y),
              (m.relatedTarget = x),
              (_ = m)),
            (x = _),
            p && v)
          )
            t: {
              for (m = p, g = v, h = 0, y = m; y; y = uo(y)) h++;
              for (y = 0, _ = g; _; _ = uo(_)) y++;
              for (; 0 < h - y; ) (m = uo(m)), h--;
              for (; 0 < y - h; ) (g = uo(g)), y--;
              for (; h--; ) {
                if (m === g || (g !== null && m === g.alternate)) break t;
                (m = uo(m)), (g = uo(g));
              }
              m = null;
            }
          else m = null;
          p !== null && dh(f, d, p, m, !1),
            v !== null && x !== null && dh(f, x, v, m, !0);
        }
      }
      e: {
        if (
          ((d = u ? So(u) : window),
          (p = d.nodeName && d.nodeName.toLowerCase()),
          p === "select" || (p === "input" && d.type === "file"))
        )
          var k = __;
        else if (ih(d))
          if (Dm) k = k_;
          else {
            k = w_;
            var E = x_;
          }
        else
          (p = d.nodeName) &&
            p.toLowerCase() === "input" &&
            (d.type === "checkbox" || d.type === "radio") &&
            (k = S_);
        if (k && (k = k(t, u))) {
          zm(f, k, n, c);
          break e;
        }
        E && E(t, d, u),
          t === "focusout" &&
            (E = d._wrapperState) &&
            E.controlled &&
            d.type === "number" &&
            qc(d, "number", d.value);
      }
      switch (((E = u ? So(u) : window), t)) {
        case "focusin":
          (ih(E) || E.contentEditable === "true") &&
            ((xo = E), (cf = u), ($l = null));
          break;
        case "focusout":
          $l = cf = xo = null;
          break;
        case "mousedown":
          ff = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          (ff = !1), uh(f, n, c);
          break;
        case "selectionchange":
          if (P_) break;
        case "keydown":
        case "keyup":
          uh(f, n, c);
      }
      var C;
      if (Nd)
        e: {
          switch (t) {
            case "compositionstart":
              var T = "onCompositionStart";
              break e;
            case "compositionend":
              T = "onCompositionEnd";
              break e;
            case "compositionupdate":
              T = "onCompositionUpdate";
              break e;
          }
          T = void 0;
        }
      else
        _o
          ? Mm(t, n) && (T = "onCompositionEnd")
          : t === "keydown" && n.keyCode === 229 && (T = "onCompositionStart");
      T &&
        (Om &&
          n.locale !== "ko" &&
          (_o || T !== "onCompositionStart"
            ? T === "onCompositionEnd" && _o && (C = Rm())
            : ((Vr = c),
              (Ed = "value" in Vr ? Vr.value : Vr.textContent),
              (_o = !0))),
        (E = Ja(u, T)),
        0 < E.length &&
          ((T = new eh(T, t, null, n, c)),
          f.push({ event: T, listeners: E }),
          C ? (T.data = C) : ((C = Lm(n)), C !== null && (T.data = C)))),
        (C = h_ ? m_(t, n) : g_(t, n)) &&
          ((u = Ja(u, "onBeforeInput")),
          0 < u.length &&
            ((c = new eh("onBeforeInput", "beforeinput", null, n, c)),
            f.push({ event: c, listeners: u }),
            (c.data = C)));
    }
    Hm(f, e);
  });
}
function ds(t, e, n) {
  return { instance: t, listener: e, currentTarget: n };
}
function Ja(t, e) {
  for (var n = e + "Capture", r = []; t !== null; ) {
    var i = t,
      o = i.stateNode;
    i.tag === 5 &&
      o !== null &&
      ((i = o),
      (o = os(t, n)),
      o != null && r.unshift(ds(t, o, i)),
      (o = os(t, e)),
      o != null && r.push(ds(t, o, i))),
      (t = t.return);
  }
  return r;
}
function uo(t) {
  if (t === null) return null;
  do t = t.return;
  while (t && t.tag !== 5);
  return t || null;
}
function dh(t, e, n, r, i) {
  for (var o = e._reactName, l = []; n !== null && n !== r; ) {
    var s = n,
      a = s.alternate,
      u = s.stateNode;
    if (a !== null && a === r) break;
    s.tag === 5 &&
      u !== null &&
      ((s = u),
      i
        ? ((a = os(n, o)), a != null && l.unshift(ds(n, a, s)))
        : i || ((a = os(n, o)), a != null && l.push(ds(n, a, s)))),
      (n = n.return);
  }
  l.length !== 0 && t.push({ event: e, listeners: l });
}
var O_ = /\r\n?/g,
  M_ = /\u0000|\uFFFD/g;
function ph(t) {
  return (typeof t == "string" ? t : "" + t)
    .replace(
      O_,
      `
`
    )
    .replace(M_, "");
}
function Zs(t, e, n) {
  if (((e = ph(e)), ph(t) !== e && n)) throw Error(L(425));
}
function Za() {}
var df = null,
  pf = null;
function hf(t, e) {
  return (
    t === "textarea" ||
    t === "noscript" ||
    typeof e.children == "string" ||
    typeof e.children == "number" ||
    (typeof e.dangerouslySetInnerHTML == "object" &&
      e.dangerouslySetInnerHTML !== null &&
      e.dangerouslySetInnerHTML.__html != null)
  );
}
var mf = typeof setTimeout == "function" ? setTimeout : void 0,
  L_ = typeof clearTimeout == "function" ? clearTimeout : void 0,
  hh = typeof Promise == "function" ? Promise : void 0,
  z_ =
    typeof queueMicrotask == "function"
      ? queueMicrotask
      : typeof hh < "u"
      ? function (t) {
          return hh.resolve(null).then(t).catch(D_);
        }
      : mf;
function D_(t) {
  setTimeout(function () {
    throw t;
  });
}
function mc(t, e) {
  var n = e,
    r = 0;
  do {
    var i = n.nextSibling;
    if ((t.removeChild(n), i && i.nodeType === 8))
      if (((n = i.data), n === "/$")) {
        if (r === 0) {
          t.removeChild(i), as(e);
          return;
        }
        r--;
      } else (n !== "$" && n !== "$?" && n !== "$!") || r++;
    n = i;
  } while (n);
  as(e);
}
function Zr(t) {
  for (; t != null; t = t.nextSibling) {
    var e = t.nodeType;
    if (e === 1 || e === 3) break;
    if (e === 8) {
      if (((e = t.data), e === "$" || e === "$!" || e === "$?")) break;
      if (e === "/$") return null;
    }
  }
  return t;
}
function mh(t) {
  t = t.previousSibling;
  for (var e = 0; t; ) {
    if (t.nodeType === 8) {
      var n = t.data;
      if (n === "$" || n === "$!" || n === "$?") {
        if (e === 0) return t;
        e--;
      } else n === "/$" && e++;
    }
    t = t.previousSibling;
  }
  return null;
}
var ol = Math.random().toString(36).slice(2),
  qn = "__reactFiber$" + ol,
  ps = "__reactProps$" + ol,
  kr = "__reactContainer$" + ol,
  gf = "__reactEvents$" + ol,
  j_ = "__reactListeners$" + ol,
  F_ = "__reactHandles$" + ol;
function Ri(t) {
  var e = t[qn];
  if (e) return e;
  for (var n = t.parentNode; n; ) {
    if ((e = n[kr] || n[qn])) {
      if (
        ((n = e.alternate),
        e.child !== null || (n !== null && n.child !== null))
      )
        for (t = mh(t); t !== null; ) {
          if ((n = t[qn])) return n;
          t = mh(t);
        }
      return e;
    }
    (t = n), (n = t.parentNode);
  }
  return null;
}
function zs(t) {
  return (
    (t = t[qn] || t[kr]),
    !t || (t.tag !== 5 && t.tag !== 6 && t.tag !== 13 && t.tag !== 3) ? null : t
  );
}
function So(t) {
  if (t.tag === 5 || t.tag === 6) return t.stateNode;
  throw Error(L(33));
}
function ju(t) {
  return t[ps] || null;
}
var vf = [],
  ko = -1;
function hi(t) {
  return { current: t };
}
function ye(t) {
  0 > ko || ((t.current = vf[ko]), (vf[ko] = null), ko--);
}
function he(t, e) {
  ko++, (vf[ko] = t.current), (t.current = e);
}
var ai = {},
  Ct = hi(ai),
  Vt = hi(!1),
  Hi = ai;
function Wo(t, e) {
  var n = t.type.contextTypes;
  if (!n) return ai;
  var r = t.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === e)
    return r.__reactInternalMemoizedMaskedChildContext;
  var i = {},
    o;
  for (o in n) i[o] = e[o];
  return (
    r &&
      ((t = t.stateNode),
      (t.__reactInternalMemoizedUnmaskedChildContext = e),
      (t.__reactInternalMemoizedMaskedChildContext = i)),
    i
  );
}
function Ht(t) {
  return (t = t.childContextTypes), t != null;
}
function eu() {
  ye(Vt), ye(Ct);
}
function gh(t, e, n) {
  if (Ct.current !== ai) throw Error(L(168));
  he(Ct, e), he(Vt, n);
}
function Ym(t, e, n) {
  var r = t.stateNode;
  if (((e = e.childContextTypes), typeof r.getChildContext != "function"))
    return n;
  r = r.getChildContext();
  for (var i in r) if (!(i in e)) throw Error(L(108, xy(t) || "Unknown", i));
  return Oe({}, n, r);
}
function tu(t) {
  return (
    (t =
      ((t = t.stateNode) && t.__reactInternalMemoizedMergedChildContext) || ai),
    (Hi = Ct.current),
    he(Ct, t),
    he(Vt, Vt.current),
    !0
  );
}
function vh(t, e, n) {
  var r = t.stateNode;
  if (!r) throw Error(L(169));
  n
    ? ((t = Ym(t, e, Hi)),
      (r.__reactInternalMemoizedMergedChildContext = t),
      ye(Vt),
      ye(Ct),
      he(Ct, t))
    : ye(Vt),
    he(Vt, n);
}
var pr = null,
  Fu = !1,
  gc = !1;
function Xm(t) {
  pr === null ? (pr = [t]) : pr.push(t);
}
function A_(t) {
  (Fu = !0), Xm(t);
}
function mi() {
  if (!gc && pr !== null) {
    gc = !0;
    var t = 0,
      e = ce;
    try {
      var n = pr;
      for (ce = 1; t < n.length; t++) {
        var r = n[t];
        do r = r(!0);
        while (r !== null);
      }
      (pr = null), (Fu = !1);
    } catch (i) {
      throw (pr !== null && (pr = pr.slice(t + 1)), ym(wd, mi), i);
    } finally {
      (ce = e), (gc = !1);
    }
  }
  return null;
}
var Co = [],
  Eo = 0,
  nu = null,
  ru = 0,
  vn = [],
  yn = 0,
  Wi = null,
  gr = 1,
  vr = "";
function Ci(t, e) {
  (Co[Eo++] = ru), (Co[Eo++] = nu), (nu = t), (ru = e);
}
function Qm(t, e, n) {
  (vn[yn++] = gr), (vn[yn++] = vr), (vn[yn++] = Wi), (Wi = t);
  var r = gr;
  t = vr;
  var i = 32 - Bn(r) - 1;
  (r &= ~(1 << i)), (n += 1);
  var o = 32 - Bn(e) + i;
  if (30 < o) {
    var l = i - (i % 5);
    (o = (r & ((1 << l) - 1)).toString(32)),
      (r >>= l),
      (i -= l),
      (gr = (1 << (32 - Bn(e) + i)) | (n << i) | r),
      (vr = o + t);
  } else (gr = (1 << o) | (n << i) | r), (vr = t);
}
function Od(t) {
  t.return !== null && (Ci(t, 1), Qm(t, 1, 0));
}
function Md(t) {
  for (; t === nu; )
    (nu = Co[--Eo]), (Co[Eo] = null), (ru = Co[--Eo]), (Co[Eo] = null);
  for (; t === Wi; )
    (Wi = vn[--yn]),
      (vn[yn] = null),
      (vr = vn[--yn]),
      (vn[yn] = null),
      (gr = vn[--yn]),
      (vn[yn] = null);
}
var un = null,
  sn = null,
  xe = !1,
  bn = null;
function Gm(t, e) {
  var n = wn(5, null, null, 0);
  (n.elementType = "DELETED"),
    (n.stateNode = e),
    (n.return = t),
    (e = t.deletions),
    e === null ? ((t.deletions = [n]), (t.flags |= 16)) : e.push(n);
}
function yh(t, e) {
  switch (t.tag) {
    case 5:
      var n = t.type;
      return (
        (e =
          e.nodeType !== 1 || n.toLowerCase() !== e.nodeName.toLowerCase()
            ? null
            : e),
        e !== null
          ? ((t.stateNode = e), (un = t), (sn = Zr(e.firstChild)), !0)
          : !1
      );
    case 6:
      return (
        (e = t.pendingProps === "" || e.nodeType !== 3 ? null : e),
        e !== null ? ((t.stateNode = e), (un = t), (sn = null), !0) : !1
      );
    case 13:
      return (
        (e = e.nodeType !== 8 ? null : e),
        e !== null
          ? ((n = Wi !== null ? { id: gr, overflow: vr } : null),
            (t.memoizedState = {
              dehydrated: e,
              treeContext: n,
              retryLane: 1073741824,
            }),
            (n = wn(18, null, null, 0)),
            (n.stateNode = e),
            (n.return = t),
            (t.child = n),
            (un = t),
            (sn = null),
            !0)
          : !1
      );
    default:
      return !1;
  }
}
function yf(t) {
  return (t.mode & 1) !== 0 && (t.flags & 128) === 0;
}
function _f(t) {
  if (xe) {
    var e = sn;
    if (e) {
      var n = e;
      if (!yh(t, e)) {
        if (yf(t)) throw Error(L(418));
        e = Zr(n.nextSibling);
        var r = un;
        e && yh(t, e)
          ? Gm(r, n)
          : ((t.flags = (t.flags & -4097) | 2), (xe = !1), (un = t));
      }
    } else {
      if (yf(t)) throw Error(L(418));
      (t.flags = (t.flags & -4097) | 2), (xe = !1), (un = t);
    }
  }
}
function _h(t) {
  for (t = t.return; t !== null && t.tag !== 5 && t.tag !== 3 && t.tag !== 13; )
    t = t.return;
  un = t;
}
function ea(t) {
  if (t !== un) return !1;
  if (!xe) return _h(t), (xe = !0), !1;
  var e;
  if (
    ((e = t.tag !== 3) &&
      !(e = t.tag !== 5) &&
      ((e = t.type),
      (e = e !== "head" && e !== "body" && !hf(t.type, t.memoizedProps))),
    e && (e = sn))
  ) {
    if (yf(t)) throw (Km(), Error(L(418)));
    for (; e; ) Gm(t, e), (e = Zr(e.nextSibling));
  }
  if ((_h(t), t.tag === 13)) {
    if (((t = t.memoizedState), (t = t !== null ? t.dehydrated : null), !t))
      throw Error(L(317));
    e: {
      for (t = t.nextSibling, e = 0; t; ) {
        if (t.nodeType === 8) {
          var n = t.data;
          if (n === "/$") {
            if (e === 0) {
              sn = Zr(t.nextSibling);
              break e;
            }
            e--;
          } else (n !== "$" && n !== "$!" && n !== "$?") || e++;
        }
        t = t.nextSibling;
      }
      sn = null;
    }
  } else sn = un ? Zr(t.stateNode.nextSibling) : null;
  return !0;
}
function Km() {
  for (var t = sn; t; ) t = Zr(t.nextSibling);
}
function Yo() {
  (sn = un = null), (xe = !1);
}
function Ld(t) {
  bn === null ? (bn = [t]) : bn.push(t);
}
var I_ = Rr.ReactCurrentBatchConfig;
function yl(t, e, n) {
  if (
    ((t = n.ref), t !== null && typeof t != "function" && typeof t != "object")
  ) {
    if (n._owner) {
      if (((n = n._owner), n)) {
        if (n.tag !== 1) throw Error(L(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(L(147, t));
      var i = r,
        o = "" + t;
      return e !== null &&
        e.ref !== null &&
        typeof e.ref == "function" &&
        e.ref._stringRef === o
        ? e.ref
        : ((e = function (l) {
            var s = i.refs;
            l === null ? delete s[o] : (s[o] = l);
          }),
          (e._stringRef = o),
          e);
    }
    if (typeof t != "string") throw Error(L(284));
    if (!n._owner) throw Error(L(290, t));
  }
  return t;
}
function ta(t, e) {
  throw (
    ((t = Object.prototype.toString.call(e)),
    Error(
      L(
        31,
        t === "[object Object]"
          ? "object with keys {" + Object.keys(e).join(", ") + "}"
          : t
      )
    ))
  );
}
function xh(t) {
  var e = t._init;
  return e(t._payload);
}
function qm(t) {
  function e(g, h) {
    if (t) {
      var y = g.deletions;
      y === null ? ((g.deletions = [h]), (g.flags |= 16)) : y.push(h);
    }
  }
  function n(g, h) {
    if (!t) return null;
    for (; h !== null; ) e(g, h), (h = h.sibling);
    return null;
  }
  function r(g, h) {
    for (g = new Map(); h !== null; )
      h.key !== null ? g.set(h.key, h) : g.set(h.index, h), (h = h.sibling);
    return g;
  }
  function i(g, h) {
    return (g = ri(g, h)), (g.index = 0), (g.sibling = null), g;
  }
  function o(g, h, y) {
    return (
      (g.index = y),
      t
        ? ((y = g.alternate),
          y !== null
            ? ((y = y.index), y < h ? ((g.flags |= 2), h) : y)
            : ((g.flags |= 2), h))
        : ((g.flags |= 1048576), h)
    );
  }
  function l(g) {
    return t && g.alternate === null && (g.flags |= 2), g;
  }
  function s(g, h, y, _) {
    return h === null || h.tag !== 6
      ? ((h = kc(y, g.mode, _)), (h.return = g), h)
      : ((h = i(h, y)), (h.return = g), h);
  }
  function a(g, h, y, _) {
    var k = y.type;
    return k === yo
      ? c(g, h, y.props.children, _, y.key)
      : h !== null &&
        (h.elementType === k ||
          (typeof k == "object" &&
            k !== null &&
            k.$$typeof === br &&
            xh(k) === h.type))
      ? ((_ = i(h, y.props)), (_.ref = yl(g, h, y)), (_.return = g), _)
      : ((_ = za(y.type, y.key, y.props, null, g.mode, _)),
        (_.ref = yl(g, h, y)),
        (_.return = g),
        _);
  }
  function u(g, h, y, _) {
    return h === null ||
      h.tag !== 4 ||
      h.stateNode.containerInfo !== y.containerInfo ||
      h.stateNode.implementation !== y.implementation
      ? ((h = Cc(y, g.mode, _)), (h.return = g), h)
      : ((h = i(h, y.children || [])), (h.return = g), h);
  }
  function c(g, h, y, _, k) {
    return h === null || h.tag !== 7
      ? ((h = Fi(y, g.mode, _, k)), (h.return = g), h)
      : ((h = i(h, y)), (h.return = g), h);
  }
  function f(g, h, y) {
    if ((typeof h == "string" && h !== "") || typeof h == "number")
      return (h = kc("" + h, g.mode, y)), (h.return = g), h;
    if (typeof h == "object" && h !== null) {
      switch (h.$$typeof) {
        case Hs:
          return (
            (y = za(h.type, h.key, h.props, null, g.mode, y)),
            (y.ref = yl(g, null, h)),
            (y.return = g),
            y
          );
        case vo:
          return (h = Cc(h, g.mode, y)), (h.return = g), h;
        case br:
          var _ = h._init;
          return f(g, _(h._payload), y);
      }
      if (Pl(h) || pl(h))
        return (h = Fi(h, g.mode, y, null)), (h.return = g), h;
      ta(g, h);
    }
    return null;
  }
  function d(g, h, y, _) {
    var k = h !== null ? h.key : null;
    if ((typeof y == "string" && y !== "") || typeof y == "number")
      return k !== null ? null : s(g, h, "" + y, _);
    if (typeof y == "object" && y !== null) {
      switch (y.$$typeof) {
        case Hs:
          return y.key === k ? a(g, h, y, _) : null;
        case vo:
          return y.key === k ? u(g, h, y, _) : null;
        case br:
          return (k = y._init), d(g, h, k(y._payload), _);
      }
      if (Pl(y) || pl(y)) return k !== null ? null : c(g, h, y, _, null);
      ta(g, y);
    }
    return null;
  }
  function p(g, h, y, _, k) {
    if ((typeof _ == "string" && _ !== "") || typeof _ == "number")
      return (g = g.get(y) || null), s(h, g, "" + _, k);
    if (typeof _ == "object" && _ !== null) {
      switch (_.$$typeof) {
        case Hs:
          return (g = g.get(_.key === null ? y : _.key) || null), a(h, g, _, k);
        case vo:
          return (g = g.get(_.key === null ? y : _.key) || null), u(h, g, _, k);
        case br:
          var E = _._init;
          return p(g, h, y, E(_._payload), k);
      }
      if (Pl(_) || pl(_)) return (g = g.get(y) || null), c(h, g, _, k, null);
      ta(h, _);
    }
    return null;
  }
  function v(g, h, y, _) {
    for (
      var k = null, E = null, C = h, T = (h = 0), N = null;
      C !== null && T < y.length;
      T++
    ) {
      C.index > T ? ((N = C), (C = null)) : (N = C.sibling);
      var R = d(g, C, y[T], _);
      if (R === null) {
        C === null && (C = N);
        break;
      }
      t && C && R.alternate === null && e(g, C),
        (h = o(R, h, T)),
        E === null ? (k = R) : (E.sibling = R),
        (E = R),
        (C = N);
    }
    if (T === y.length) return n(g, C), xe && Ci(g, T), k;
    if (C === null) {
      for (; T < y.length; T++)
        (C = f(g, y[T], _)),
          C !== null &&
            ((h = o(C, h, T)), E === null ? (k = C) : (E.sibling = C), (E = C));
      return xe && Ci(g, T), k;
    }
    for (C = r(g, C); T < y.length; T++)
      (N = p(C, g, T, y[T], _)),
        N !== null &&
          (t && N.alternate !== null && C.delete(N.key === null ? T : N.key),
          (h = o(N, h, T)),
          E === null ? (k = N) : (E.sibling = N),
          (E = N));
    return (
      t &&
        C.forEach(function (I) {
          return e(g, I);
        }),
      xe && Ci(g, T),
      k
    );
  }
  function m(g, h, y, _) {
    var k = pl(y);
    if (typeof k != "function") throw Error(L(150));
    if (((y = k.call(y)), y == null)) throw Error(L(151));
    for (
      var E = (k = null), C = h, T = (h = 0), N = null, R = y.next();
      C !== null && !R.done;
      T++, R = y.next()
    ) {
      C.index > T ? ((N = C), (C = null)) : (N = C.sibling);
      var I = d(g, C, R.value, _);
      if (I === null) {
        C === null && (C = N);
        break;
      }
      t && C && I.alternate === null && e(g, C),
        (h = o(I, h, T)),
        E === null ? (k = I) : (E.sibling = I),
        (E = I),
        (C = N);
    }
    if (R.done) return n(g, C), xe && Ci(g, T), k;
    if (C === null) {
      for (; !R.done; T++, R = y.next())
        (R = f(g, R.value, _)),
          R !== null &&
            ((h = o(R, h, T)), E === null ? (k = R) : (E.sibling = R), (E = R));
      return xe && Ci(g, T), k;
    }
    for (C = r(g, C); !R.done; T++, R = y.next())
      (R = p(C, g, T, R.value, _)),
        R !== null &&
          (t && R.alternate !== null && C.delete(R.key === null ? T : R.key),
          (h = o(R, h, T)),
          E === null ? (k = R) : (E.sibling = R),
          (E = R));
    return (
      t &&
        C.forEach(function (z) {
          return e(g, z);
        }),
      xe && Ci(g, T),
      k
    );
  }
  function x(g, h, y, _) {
    if (
      (typeof y == "object" &&
        y !== null &&
        y.type === yo &&
        y.key === null &&
        (y = y.props.children),
      typeof y == "object" && y !== null)
    ) {
      switch (y.$$typeof) {
        case Hs:
          e: {
            for (var k = y.key, E = h; E !== null; ) {
              if (E.key === k) {
                if (((k = y.type), k === yo)) {
                  if (E.tag === 7) {
                    n(g, E.sibling),
                      (h = i(E, y.props.children)),
                      (h.return = g),
                      (g = h);
                    break e;
                  }
                } else if (
                  E.elementType === k ||
                  (typeof k == "object" &&
                    k !== null &&
                    k.$$typeof === br &&
                    xh(k) === E.type)
                ) {
                  n(g, E.sibling),
                    (h = i(E, y.props)),
                    (h.ref = yl(g, E, y)),
                    (h.return = g),
                    (g = h);
                  break e;
                }
                n(g, E);
                break;
              } else e(g, E);
              E = E.sibling;
            }
            y.type === yo
              ? ((h = Fi(y.props.children, g.mode, _, y.key)),
                (h.return = g),
                (g = h))
              : ((_ = za(y.type, y.key, y.props, null, g.mode, _)),
                (_.ref = yl(g, h, y)),
                (_.return = g),
                (g = _));
          }
          return l(g);
        case vo:
          e: {
            for (E = y.key; h !== null; ) {
              if (h.key === E)
                if (
                  h.tag === 4 &&
                  h.stateNode.containerInfo === y.containerInfo &&
                  h.stateNode.implementation === y.implementation
                ) {
                  n(g, h.sibling),
                    (h = i(h, y.children || [])),
                    (h.return = g),
                    (g = h);
                  break e;
                } else {
                  n(g, h);
                  break;
                }
              else e(g, h);
              h = h.sibling;
            }
            (h = Cc(y, g.mode, _)), (h.return = g), (g = h);
          }
          return l(g);
        case br:
          return (E = y._init), x(g, h, E(y._payload), _);
      }
      if (Pl(y)) return v(g, h, y, _);
      if (pl(y)) return m(g, h, y, _);
      ta(g, y);
    }
    return (typeof y == "string" && y !== "") || typeof y == "number"
      ? ((y = "" + y),
        h !== null && h.tag === 6
          ? (n(g, h.sibling), (h = i(h, y)), (h.return = g), (g = h))
          : (n(g, h), (h = kc(y, g.mode, _)), (h.return = g), (g = h)),
        l(g))
      : n(g, h);
  }
  return x;
}
var Xo = qm(!0),
  Jm = qm(!1),
  iu = hi(null),
  ou = null,
  Po = null,
  zd = null;
function Dd() {
  zd = Po = ou = null;
}
function jd(t) {
  var e = iu.current;
  ye(iu), (t._currentValue = e);
}
function xf(t, e, n) {
  for (; t !== null; ) {
    var r = t.alternate;
    if (
      ((t.childLanes & e) !== e
        ? ((t.childLanes |= e), r !== null && (r.childLanes |= e))
        : r !== null && (r.childLanes & e) !== e && (r.childLanes |= e),
      t === n)
    )
      break;
    t = t.return;
  }
}
function Fo(t, e) {
  (ou = t),
    (zd = Po = null),
    (t = t.dependencies),
    t !== null &&
      t.firstContext !== null &&
      (t.lanes & e && (Ut = !0), (t.firstContext = null));
}
function Pn(t) {
  var e = t._currentValue;
  if (zd !== t)
    if (((t = { context: t, memoizedValue: e, next: null }), Po === null)) {
      if (ou === null) throw Error(L(308));
      (Po = t), (ou.dependencies = { lanes: 0, firstContext: t });
    } else Po = Po.next = t;
  return e;
}
var Oi = null;
function Fd(t) {
  Oi === null ? (Oi = [t]) : Oi.push(t);
}
function Zm(t, e, n, r) {
  var i = e.interleaved;
  return (
    i === null ? ((n.next = n), Fd(e)) : ((n.next = i.next), (i.next = n)),
    (e.interleaved = n),
    Cr(t, r)
  );
}
function Cr(t, e) {
  t.lanes |= e;
  var n = t.alternate;
  for (n !== null && (n.lanes |= e), n = t, t = t.return; t !== null; )
    (t.childLanes |= e),
      (n = t.alternate),
      n !== null && (n.childLanes |= e),
      (n = t),
      (t = t.return);
  return n.tag === 3 ? n.stateNode : null;
}
var $r = !1;
function Ad(t) {
  t.updateQueue = {
    baseState: t.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null, interleaved: null, lanes: 0 },
    effects: null,
  };
}
function eg(t, e) {
  (t = t.updateQueue),
    e.updateQueue === t &&
      (e.updateQueue = {
        baseState: t.baseState,
        firstBaseUpdate: t.firstBaseUpdate,
        lastBaseUpdate: t.lastBaseUpdate,
        shared: t.shared,
        effects: t.effects,
      });
}
function _r(t, e) {
  return {
    eventTime: t,
    lane: e,
    tag: 0,
    payload: null,
    callback: null,
    next: null,
  };
}
function ei(t, e, n) {
  var r = t.updateQueue;
  if (r === null) return null;
  if (((r = r.shared), le & 2)) {
    var i = r.pending;
    return (
      i === null ? (e.next = e) : ((e.next = i.next), (i.next = e)),
      (r.pending = e),
      Cr(t, n)
    );
  }
  return (
    (i = r.interleaved),
    i === null ? ((e.next = e), Fd(r)) : ((e.next = i.next), (i.next = e)),
    (r.interleaved = e),
    Cr(t, n)
  );
}
function Ta(t, e, n) {
  if (
    ((e = e.updateQueue), e !== null && ((e = e.shared), (n & 4194240) !== 0))
  ) {
    var r = e.lanes;
    (r &= t.pendingLanes), (n |= r), (e.lanes = n), Sd(t, n);
  }
}
function wh(t, e) {
  var n = t.updateQueue,
    r = t.alternate;
  if (r !== null && ((r = r.updateQueue), n === r)) {
    var i = null,
      o = null;
    if (((n = n.firstBaseUpdate), n !== null)) {
      do {
        var l = {
          eventTime: n.eventTime,
          lane: n.lane,
          tag: n.tag,
          payload: n.payload,
          callback: n.callback,
          next: null,
        };
        o === null ? (i = o = l) : (o = o.next = l), (n = n.next);
      } while (n !== null);
      o === null ? (i = o = e) : (o = o.next = e);
    } else i = o = e;
    (n = {
      baseState: r.baseState,
      firstBaseUpdate: i,
      lastBaseUpdate: o,
      shared: r.shared,
      effects: r.effects,
    }),
      (t.updateQueue = n);
    return;
  }
  (t = n.lastBaseUpdate),
    t === null ? (n.firstBaseUpdate = e) : (t.next = e),
    (n.lastBaseUpdate = e);
}
function lu(t, e, n, r) {
  var i = t.updateQueue;
  $r = !1;
  var o = i.firstBaseUpdate,
    l = i.lastBaseUpdate,
    s = i.shared.pending;
  if (s !== null) {
    i.shared.pending = null;
    var a = s,
      u = a.next;
    (a.next = null), l === null ? (o = u) : (l.next = u), (l = a);
    var c = t.alternate;
    c !== null &&
      ((c = c.updateQueue),
      (s = c.lastBaseUpdate),
      s !== l &&
        (s === null ? (c.firstBaseUpdate = u) : (s.next = u),
        (c.lastBaseUpdate = a)));
  }
  if (o !== null) {
    var f = i.baseState;
    (l = 0), (c = u = a = null), (s = o);
    do {
      var d = s.lane,
        p = s.eventTime;
      if ((r & d) === d) {
        c !== null &&
          (c = c.next =
            {
              eventTime: p,
              lane: 0,
              tag: s.tag,
              payload: s.payload,
              callback: s.callback,
              next: null,
            });
        e: {
          var v = t,
            m = s;
          switch (((d = e), (p = n), m.tag)) {
            case 1:
              if (((v = m.payload), typeof v == "function")) {
                f = v.call(p, f, d);
                break e;
              }
              f = v;
              break e;
            case 3:
              v.flags = (v.flags & -65537) | 128;
            case 0:
              if (
                ((v = m.payload),
                (d = typeof v == "function" ? v.call(p, f, d) : v),
                d == null)
              )
                break e;
              f = Oe({}, f, d);
              break e;
            case 2:
              $r = !0;
          }
        }
        s.callback !== null &&
          s.lane !== 0 &&
          ((t.flags |= 64),
          (d = i.effects),
          d === null ? (i.effects = [s]) : d.push(s));
      } else
        (p = {
          eventTime: p,
          lane: d,
          tag: s.tag,
          payload: s.payload,
          callback: s.callback,
          next: null,
        }),
          c === null ? ((u = c = p), (a = f)) : (c = c.next = p),
          (l |= d);
      if (((s = s.next), s === null)) {
        if (((s = i.shared.pending), s === null)) break;
        (d = s),
          (s = d.next),
          (d.next = null),
          (i.lastBaseUpdate = d),
          (i.shared.pending = null);
      }
    } while (!0);
    if (
      (c === null && (a = f),
      (i.baseState = a),
      (i.firstBaseUpdate = u),
      (i.lastBaseUpdate = c),
      (e = i.shared.interleaved),
      e !== null)
    ) {
      i = e;
      do (l |= i.lane), (i = i.next);
      while (i !== e);
    } else o === null && (i.shared.lanes = 0);
    (Xi |= l), (t.lanes = l), (t.memoizedState = f);
  }
}
function Sh(t, e, n) {
  if (((t = e.effects), (e.effects = null), t !== null))
    for (e = 0; e < t.length; e++) {
      var r = t[e],
        i = r.callback;
      if (i !== null) {
        if (((r.callback = null), (r = n), typeof i != "function"))
          throw Error(L(191, i));
        i.call(r);
      }
    }
}
var Ds = {},
  nr = hi(Ds),
  hs = hi(Ds),
  ms = hi(Ds);
function Mi(t) {
  if (t === Ds) throw Error(L(174));
  return t;
}
function Id(t, e) {
  switch ((he(ms, e), he(hs, t), he(nr, Ds), (t = e.nodeType), t)) {
    case 9:
    case 11:
      e = (e = e.documentElement) ? e.namespaceURI : Zc(null, "");
      break;
    default:
      (t = t === 8 ? e.parentNode : e),
        (e = t.namespaceURI || null),
        (t = t.tagName),
        (e = Zc(e, t));
  }
  ye(nr), he(nr, e);
}
function Qo() {
  ye(nr), ye(hs), ye(ms);
}
function tg(t) {
  Mi(ms.current);
  var e = Mi(nr.current),
    n = Zc(e, t.type);
  e !== n && (he(hs, t), he(nr, n));
}
function bd(t) {
  hs.current === t && (ye(nr), ye(hs));
}
var Ee = hi(0);
function su(t) {
  for (var e = t; e !== null; ) {
    if (e.tag === 13) {
      var n = e.memoizedState;
      if (
        n !== null &&
        ((n = n.dehydrated), n === null || n.data === "$?" || n.data === "$!")
      )
        return e;
    } else if (e.tag === 19 && e.memoizedProps.revealOrder !== void 0) {
      if (e.flags & 128) return e;
    } else if (e.child !== null) {
      (e.child.return = e), (e = e.child);
      continue;
    }
    if (e === t) break;
    for (; e.sibling === null; ) {
      if (e.return === null || e.return === t) return null;
      e = e.return;
    }
    (e.sibling.return = e.return), (e = e.sibling);
  }
  return null;
}
var vc = [];
function $d() {
  for (var t = 0; t < vc.length; t++)
    vc[t]._workInProgressVersionPrimary = null;
  vc.length = 0;
}
var Na = Rr.ReactCurrentDispatcher,
  yc = Rr.ReactCurrentBatchConfig,
  Yi = 0,
  Ne = null,
  Qe = null,
  tt = null,
  au = !1,
  Bl = !1,
  gs = 0,
  b_ = 0;
function gt() {
  throw Error(L(321));
}
function Bd(t, e) {
  if (e === null) return !1;
  for (var n = 0; n < e.length && n < t.length; n++)
    if (!Vn(t[n], e[n])) return !1;
  return !0;
}
function Ud(t, e, n, r, i, o) {
  if (
    ((Yi = o),
    (Ne = e),
    (e.memoizedState = null),
    (e.updateQueue = null),
    (e.lanes = 0),
    (Na.current = t === null || t.memoizedState === null ? V_ : H_),
    (t = n(r, i)),
    Bl)
  ) {
    o = 0;
    do {
      if (((Bl = !1), (gs = 0), 25 <= o)) throw Error(L(301));
      (o += 1),
        (tt = Qe = null),
        (e.updateQueue = null),
        (Na.current = W_),
        (t = n(r, i));
    } while (Bl);
  }
  if (
    ((Na.current = uu),
    (e = Qe !== null && Qe.next !== null),
    (Yi = 0),
    (tt = Qe = Ne = null),
    (au = !1),
    e)
  )
    throw Error(L(300));
  return t;
}
function Vd() {
  var t = gs !== 0;
  return (gs = 0), t;
}
function Qn() {
  var t = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };
  return tt === null ? (Ne.memoizedState = tt = t) : (tt = tt.next = t), tt;
}
function Tn() {
  if (Qe === null) {
    var t = Ne.alternate;
    t = t !== null ? t.memoizedState : null;
  } else t = Qe.next;
  var e = tt === null ? Ne.memoizedState : tt.next;
  if (e !== null) (tt = e), (Qe = t);
  else {
    if (t === null) throw Error(L(310));
    (Qe = t),
      (t = {
        memoizedState: Qe.memoizedState,
        baseState: Qe.baseState,
        baseQueue: Qe.baseQueue,
        queue: Qe.queue,
        next: null,
      }),
      tt === null ? (Ne.memoizedState = tt = t) : (tt = tt.next = t);
  }
  return tt;
}
function vs(t, e) {
  return typeof e == "function" ? e(t) : e;
}
function _c(t) {
  var e = Tn(),
    n = e.queue;
  if (n === null) throw Error(L(311));
  n.lastRenderedReducer = t;
  var r = Qe,
    i = r.baseQueue,
    o = n.pending;
  if (o !== null) {
    if (i !== null) {
      var l = i.next;
      (i.next = o.next), (o.next = l);
    }
    (r.baseQueue = i = o), (n.pending = null);
  }
  if (i !== null) {
    (o = i.next), (r = r.baseState);
    var s = (l = null),
      a = null,
      u = o;
    do {
      var c = u.lane;
      if ((Yi & c) === c)
        a !== null &&
          (a = a.next =
            {
              lane: 0,
              action: u.action,
              hasEagerState: u.hasEagerState,
              eagerState: u.eagerState,
              next: null,
            }),
          (r = u.hasEagerState ? u.eagerState : t(r, u.action));
      else {
        var f = {
          lane: c,
          action: u.action,
          hasEagerState: u.hasEagerState,
          eagerState: u.eagerState,
          next: null,
        };
        a === null ? ((s = a = f), (l = r)) : (a = a.next = f),
          (Ne.lanes |= c),
          (Xi |= c);
      }
      u = u.next;
    } while (u !== null && u !== o);
    a === null ? (l = r) : (a.next = s),
      Vn(r, e.memoizedState) || (Ut = !0),
      (e.memoizedState = r),
      (e.baseState = l),
      (e.baseQueue = a),
      (n.lastRenderedState = r);
  }
  if (((t = n.interleaved), t !== null)) {
    i = t;
    do (o = i.lane), (Ne.lanes |= o), (Xi |= o), (i = i.next);
    while (i !== t);
  } else i === null && (n.lanes = 0);
  return [e.memoizedState, n.dispatch];
}
function xc(t) {
  var e = Tn(),
    n = e.queue;
  if (n === null) throw Error(L(311));
  n.lastRenderedReducer = t;
  var r = n.dispatch,
    i = n.pending,
    o = e.memoizedState;
  if (i !== null) {
    n.pending = null;
    var l = (i = i.next);
    do (o = t(o, l.action)), (l = l.next);
    while (l !== i);
    Vn(o, e.memoizedState) || (Ut = !0),
      (e.memoizedState = o),
      e.baseQueue === null && (e.baseState = o),
      (n.lastRenderedState = o);
  }
  return [o, r];
}
function ng() {}
function rg(t, e) {
  var n = Ne,
    r = Tn(),
    i = e(),
    o = !Vn(r.memoizedState, i);
  if (
    (o && ((r.memoizedState = i), (Ut = !0)),
    (r = r.queue),
    Hd(lg.bind(null, n, r, t), [t]),
    r.getSnapshot !== e || o || (tt !== null && tt.memoizedState.tag & 1))
  ) {
    if (
      ((n.flags |= 2048),
      ys(9, og.bind(null, n, r, i, e), void 0, null),
      rt === null)
    )
      throw Error(L(349));
    Yi & 30 || ig(n, e, i);
  }
  return i;
}
function ig(t, e, n) {
  (t.flags |= 16384),
    (t = { getSnapshot: e, value: n }),
    (e = Ne.updateQueue),
    e === null
      ? ((e = { lastEffect: null, stores: null }),
        (Ne.updateQueue = e),
        (e.stores = [t]))
      : ((n = e.stores), n === null ? (e.stores = [t]) : n.push(t));
}
function og(t, e, n, r) {
  (e.value = n), (e.getSnapshot = r), sg(e) && ag(t);
}
function lg(t, e, n) {
  return n(function () {
    sg(e) && ag(t);
  });
}
function sg(t) {
  var e = t.getSnapshot;
  t = t.value;
  try {
    var n = e();
    return !Vn(t, n);
  } catch {
    return !0;
  }
}
function ag(t) {
  var e = Cr(t, 1);
  e !== null && Un(e, t, 1, -1);
}
function kh(t) {
  var e = Qn();
  return (
    typeof t == "function" && (t = t()),
    (e.memoizedState = e.baseState = t),
    (t = {
      pending: null,
      interleaved: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: vs,
      lastRenderedState: t,
    }),
    (e.queue = t),
    (t = t.dispatch = U_.bind(null, Ne, t)),
    [e.memoizedState, t]
  );
}
function ys(t, e, n, r) {
  return (
    (t = { tag: t, create: e, destroy: n, deps: r, next: null }),
    (e = Ne.updateQueue),
    e === null
      ? ((e = { lastEffect: null, stores: null }),
        (Ne.updateQueue = e),
        (e.lastEffect = t.next = t))
      : ((n = e.lastEffect),
        n === null
          ? (e.lastEffect = t.next = t)
          : ((r = n.next), (n.next = t), (t.next = r), (e.lastEffect = t))),
    t
  );
}
function ug() {
  return Tn().memoizedState;
}
function Ra(t, e, n, r) {
  var i = Qn();
  (Ne.flags |= t),
    (i.memoizedState = ys(1 | e, n, void 0, r === void 0 ? null : r));
}
function Au(t, e, n, r) {
  var i = Tn();
  r = r === void 0 ? null : r;
  var o = void 0;
  if (Qe !== null) {
    var l = Qe.memoizedState;
    if (((o = l.destroy), r !== null && Bd(r, l.deps))) {
      i.memoizedState = ys(e, n, o, r);
      return;
    }
  }
  (Ne.flags |= t), (i.memoizedState = ys(1 | e, n, o, r));
}
function Ch(t, e) {
  return Ra(8390656, 8, t, e);
}
function Hd(t, e) {
  return Au(2048, 8, t, e);
}
function cg(t, e) {
  return Au(4, 2, t, e);
}
function fg(t, e) {
  return Au(4, 4, t, e);
}
function dg(t, e) {
  if (typeof e == "function")
    return (
      (t = t()),
      e(t),
      function () {
        e(null);
      }
    );
  if (e != null)
    return (
      (t = t()),
      (e.current = t),
      function () {
        e.current = null;
      }
    );
}
function pg(t, e, n) {
  return (
    (n = n != null ? n.concat([t]) : null), Au(4, 4, dg.bind(null, e, t), n)
  );
}
function Wd() {}
function hg(t, e) {
  var n = Tn();
  e = e === void 0 ? null : e;
  var r = n.memoizedState;
  return r !== null && e !== null && Bd(e, r[1])
    ? r[0]
    : ((n.memoizedState = [t, e]), t);
}
function mg(t, e) {
  var n = Tn();
  e = e === void 0 ? null : e;
  var r = n.memoizedState;
  return r !== null && e !== null && Bd(e, r[1])
    ? r[0]
    : ((t = t()), (n.memoizedState = [t, e]), t);
}
function gg(t, e, n) {
  return Yi & 21
    ? (Vn(n, e) || ((n = wm()), (Ne.lanes |= n), (Xi |= n), (t.baseState = !0)),
      e)
    : (t.baseState && ((t.baseState = !1), (Ut = !0)), (t.memoizedState = n));
}
function $_(t, e) {
  var n = ce;
  (ce = n !== 0 && 4 > n ? n : 4), t(!0);
  var r = yc.transition;
  yc.transition = {};
  try {
    t(!1), e();
  } finally {
    (ce = n), (yc.transition = r);
  }
}
function vg() {
  return Tn().memoizedState;
}
function B_(t, e, n) {
  var r = ni(t);
  if (
    ((n = {
      lane: r,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
    yg(t))
  )
    _g(e, n);
  else if (((n = Zm(t, e, n, r)), n !== null)) {
    var i = Ft();
    Un(n, t, r, i), xg(n, e, r);
  }
}
function U_(t, e, n) {
  var r = ni(t),
    i = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (yg(t)) _g(e, i);
  else {
    var o = t.alternate;
    if (
      t.lanes === 0 &&
      (o === null || o.lanes === 0) &&
      ((o = e.lastRenderedReducer), o !== null)
    )
      try {
        var l = e.lastRenderedState,
          s = o(l, n);
        if (((i.hasEagerState = !0), (i.eagerState = s), Vn(s, l))) {
          var a = e.interleaved;
          a === null
            ? ((i.next = i), Fd(e))
            : ((i.next = a.next), (a.next = i)),
            (e.interleaved = i);
          return;
        }
      } catch {
      } finally {
      }
    (n = Zm(t, e, i, r)),
      n !== null && ((i = Ft()), Un(n, t, r, i), xg(n, e, r));
  }
}
function yg(t) {
  var e = t.alternate;
  return t === Ne || (e !== null && e === Ne);
}
function _g(t, e) {
  Bl = au = !0;
  var n = t.pending;
  n === null ? (e.next = e) : ((e.next = n.next), (n.next = e)),
    (t.pending = e);
}
function xg(t, e, n) {
  if (n & 4194240) {
    var r = e.lanes;
    (r &= t.pendingLanes), (n |= r), (e.lanes = n), Sd(t, n);
  }
}
var uu = {
    readContext: Pn,
    useCallback: gt,
    useContext: gt,
    useEffect: gt,
    useImperativeHandle: gt,
    useInsertionEffect: gt,
    useLayoutEffect: gt,
    useMemo: gt,
    useReducer: gt,
    useRef: gt,
    useState: gt,
    useDebugValue: gt,
    useDeferredValue: gt,
    useTransition: gt,
    useMutableSource: gt,
    useSyncExternalStore: gt,
    useId: gt,
    unstable_isNewReconciler: !1,
  },
  V_ = {
    readContext: Pn,
    useCallback: function (t, e) {
      return (Qn().memoizedState = [t, e === void 0 ? null : e]), t;
    },
    useContext: Pn,
    useEffect: Ch,
    useImperativeHandle: function (t, e, n) {
      return (
        (n = n != null ? n.concat([t]) : null),
        Ra(4194308, 4, dg.bind(null, e, t), n)
      );
    },
    useLayoutEffect: function (t, e) {
      return Ra(4194308, 4, t, e);
    },
    useInsertionEffect: function (t, e) {
      return Ra(4, 2, t, e);
    },
    useMemo: function (t, e) {
      var n = Qn();
      return (
        (e = e === void 0 ? null : e), (t = t()), (n.memoizedState = [t, e]), t
      );
    },
    useReducer: function (t, e, n) {
      var r = Qn();
      return (
        (e = n !== void 0 ? n(e) : e),
        (r.memoizedState = r.baseState = e),
        (t = {
          pending: null,
          interleaved: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: t,
          lastRenderedState: e,
        }),
        (r.queue = t),
        (t = t.dispatch = B_.bind(null, Ne, t)),
        [r.memoizedState, t]
      );
    },
    useRef: function (t) {
      var e = Qn();
      return (t = { current: t }), (e.memoizedState = t);
    },
    useState: kh,
    useDebugValue: Wd,
    useDeferredValue: function (t) {
      return (Qn().memoizedState = t);
    },
    useTransition: function () {
      var t = kh(!1),
        e = t[0];
      return (t = $_.bind(null, t[1])), (Qn().memoizedState = t), [e, t];
    },
    useMutableSource: function () {},
    useSyncExternalStore: function (t, e, n) {
      var r = Ne,
        i = Qn();
      if (xe) {
        if (n === void 0) throw Error(L(407));
        n = n();
      } else {
        if (((n = e()), rt === null)) throw Error(L(349));
        Yi & 30 || ig(r, e, n);
      }
      i.memoizedState = n;
      var o = { value: n, getSnapshot: e };
      return (
        (i.queue = o),
        Ch(lg.bind(null, r, o, t), [t]),
        (r.flags |= 2048),
        ys(9, og.bind(null, r, o, n, e), void 0, null),
        n
      );
    },
    useId: function () {
      var t = Qn(),
        e = rt.identifierPrefix;
      if (xe) {
        var n = vr,
          r = gr;
        (n = (r & ~(1 << (32 - Bn(r) - 1))).toString(32) + n),
          (e = ":" + e + "R" + n),
          (n = gs++),
          0 < n && (e += "H" + n.toString(32)),
          (e += ":");
      } else (n = b_++), (e = ":" + e + "r" + n.toString(32) + ":");
      return (t.memoizedState = e);
    },
    unstable_isNewReconciler: !1,
  },
  H_ = {
    readContext: Pn,
    useCallback: hg,
    useContext: Pn,
    useEffect: Hd,
    useImperativeHandle: pg,
    useInsertionEffect: cg,
    useLayoutEffect: fg,
    useMemo: mg,
    useReducer: _c,
    useRef: ug,
    useState: function () {
      return _c(vs);
    },
    useDebugValue: Wd,
    useDeferredValue: function (t) {
      var e = Tn();
      return gg(e, Qe.memoizedState, t);
    },
    useTransition: function () {
      var t = _c(vs)[0],
        e = Tn().memoizedState;
      return [t, e];
    },
    useMutableSource: ng,
    useSyncExternalStore: rg,
    useId: vg,
    unstable_isNewReconciler: !1,
  },
  W_ = {
    readContext: Pn,
    useCallback: hg,
    useContext: Pn,
    useEffect: Hd,
    useImperativeHandle: pg,
    useInsertionEffect: cg,
    useLayoutEffect: fg,
    useMemo: mg,
    useReducer: xc,
    useRef: ug,
    useState: function () {
      return xc(vs);
    },
    useDebugValue: Wd,
    useDeferredValue: function (t) {
      var e = Tn();
      return Qe === null ? (e.memoizedState = t) : gg(e, Qe.memoizedState, t);
    },
    useTransition: function () {
      var t = xc(vs)[0],
        e = Tn().memoizedState;
      return [t, e];
    },
    useMutableSource: ng,
    useSyncExternalStore: rg,
    useId: vg,
    unstable_isNewReconciler: !1,
  };
function An(t, e) {
  if (t && t.defaultProps) {
    (e = Oe({}, e)), (t = t.defaultProps);
    for (var n in t) e[n] === void 0 && (e[n] = t[n]);
    return e;
  }
  return e;
}
function wf(t, e, n, r) {
  (e = t.memoizedState),
    (n = n(r, e)),
    (n = n == null ? e : Oe({}, e, n)),
    (t.memoizedState = n),
    t.lanes === 0 && (t.updateQueue.baseState = n);
}
var Iu = {
  isMounted: function (t) {
    return (t = t._reactInternals) ? to(t) === t : !1;
  },
  enqueueSetState: function (t, e, n) {
    t = t._reactInternals;
    var r = Ft(),
      i = ni(t),
      o = _r(r, i);
    (o.payload = e),
      n != null && (o.callback = n),
      (e = ei(t, o, i)),
      e !== null && (Un(e, t, i, r), Ta(e, t, i));
  },
  enqueueReplaceState: function (t, e, n) {
    t = t._reactInternals;
    var r = Ft(),
      i = ni(t),
      o = _r(r, i);
    (o.tag = 1),
      (o.payload = e),
      n != null && (o.callback = n),
      (e = ei(t, o, i)),
      e !== null && (Un(e, t, i, r), Ta(e, t, i));
  },
  enqueueForceUpdate: function (t, e) {
    t = t._reactInternals;
    var n = Ft(),
      r = ni(t),
      i = _r(n, r);
    (i.tag = 2),
      e != null && (i.callback = e),
      (e = ei(t, i, r)),
      e !== null && (Un(e, t, r, n), Ta(e, t, r));
  },
};
function Eh(t, e, n, r, i, o, l) {
  return (
    (t = t.stateNode),
    typeof t.shouldComponentUpdate == "function"
      ? t.shouldComponentUpdate(r, o, l)
      : e.prototype && e.prototype.isPureReactComponent
      ? !cs(n, r) || !cs(i, o)
      : !0
  );
}
function wg(t, e, n) {
  var r = !1,
    i = ai,
    o = e.contextType;
  return (
    typeof o == "object" && o !== null
      ? (o = Pn(o))
      : ((i = Ht(e) ? Hi : Ct.current),
        (r = e.contextTypes),
        (o = (r = r != null) ? Wo(t, i) : ai)),
    (e = new e(n, o)),
    (t.memoizedState = e.state !== null && e.state !== void 0 ? e.state : null),
    (e.updater = Iu),
    (t.stateNode = e),
    (e._reactInternals = t),
    r &&
      ((t = t.stateNode),
      (t.__reactInternalMemoizedUnmaskedChildContext = i),
      (t.__reactInternalMemoizedMaskedChildContext = o)),
    e
  );
}
function Ph(t, e, n, r) {
  (t = e.state),
    typeof e.componentWillReceiveProps == "function" &&
      e.componentWillReceiveProps(n, r),
    typeof e.UNSAFE_componentWillReceiveProps == "function" &&
      e.UNSAFE_componentWillReceiveProps(n, r),
    e.state !== t && Iu.enqueueReplaceState(e, e.state, null);
}
function Sf(t, e, n, r) {
  var i = t.stateNode;
  (i.props = n), (i.state = t.memoizedState), (i.refs = {}), Ad(t);
  var o = e.contextType;
  typeof o == "object" && o !== null
    ? (i.context = Pn(o))
    : ((o = Ht(e) ? Hi : Ct.current), (i.context = Wo(t, o))),
    (i.state = t.memoizedState),
    (o = e.getDerivedStateFromProps),
    typeof o == "function" && (wf(t, e, o, n), (i.state = t.memoizedState)),
    typeof e.getDerivedStateFromProps == "function" ||
      typeof i.getSnapshotBeforeUpdate == "function" ||
      (typeof i.UNSAFE_componentWillMount != "function" &&
        typeof i.componentWillMount != "function") ||
      ((e = i.state),
      typeof i.componentWillMount == "function" && i.componentWillMount(),
      typeof i.UNSAFE_componentWillMount == "function" &&
        i.UNSAFE_componentWillMount(),
      e !== i.state && Iu.enqueueReplaceState(i, i.state, null),
      lu(t, n, i, r),
      (i.state = t.memoizedState)),
    typeof i.componentDidMount == "function" && (t.flags |= 4194308);
}
function Go(t, e) {
  try {
    var n = "",
      r = e;
    do (n += _y(r)), (r = r.return);
    while (r);
    var i = n;
  } catch (o) {
    i =
      `
Error generating stack: ` +
      o.message +
      `
` +
      o.stack;
  }
  return { value: t, source: e, stack: i, digest: null };
}
function wc(t, e, n) {
  return { value: t, source: null, stack: n ?? null, digest: e ?? null };
}
function kf(t, e) {
  try {
    console.error(e.value);
  } catch (n) {
    setTimeout(function () {
      throw n;
    });
  }
}
var Y_ = typeof WeakMap == "function" ? WeakMap : Map;
function Sg(t, e, n) {
  (n = _r(-1, n)), (n.tag = 3), (n.payload = { element: null });
  var r = e.value;
  return (
    (n.callback = function () {
      fu || ((fu = !0), (zf = r)), kf(t, e);
    }),
    n
  );
}
function kg(t, e, n) {
  (n = _r(-1, n)), (n.tag = 3);
  var r = t.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var i = e.value;
    (n.payload = function () {
      return r(i);
    }),
      (n.callback = function () {
        kf(t, e);
      });
  }
  var o = t.stateNode;
  return (
    o !== null &&
      typeof o.componentDidCatch == "function" &&
      (n.callback = function () {
        kf(t, e),
          typeof r != "function" &&
            (ti === null ? (ti = new Set([this])) : ti.add(this));
        var l = e.stack;
        this.componentDidCatch(e.value, {
          componentStack: l !== null ? l : "",
        });
      }),
    n
  );
}
function Th(t, e, n) {
  var r = t.pingCache;
  if (r === null) {
    r = t.pingCache = new Y_();
    var i = new Set();
    r.set(e, i);
  } else (i = r.get(e)), i === void 0 && ((i = new Set()), r.set(e, i));
  i.has(n) || (i.add(n), (t = lx.bind(null, t, e, n)), e.then(t, t));
}
function Nh(t) {
  do {
    var e;
    if (
      ((e = t.tag === 13) &&
        ((e = t.memoizedState), (e = e !== null ? e.dehydrated !== null : !0)),
      e)
    )
      return t;
    t = t.return;
  } while (t !== null);
  return null;
}
function Rh(t, e, n, r, i) {
  return t.mode & 1
    ? ((t.flags |= 65536), (t.lanes = i), t)
    : (t === e
        ? (t.flags |= 65536)
        : ((t.flags |= 128),
          (n.flags |= 131072),
          (n.flags &= -52805),
          n.tag === 1 &&
            (n.alternate === null
              ? (n.tag = 17)
              : ((e = _r(-1, 1)), (e.tag = 2), ei(n, e, 1))),
          (n.lanes |= 1)),
      t);
}
var X_ = Rr.ReactCurrentOwner,
  Ut = !1;
function Ot(t, e, n, r) {
  e.child = t === null ? Jm(e, null, n, r) : Xo(e, t.child, n, r);
}
function Oh(t, e, n, r, i) {
  n = n.render;
  var o = e.ref;
  return (
    Fo(e, i),
    (r = Ud(t, e, n, r, o, i)),
    (n = Vd()),
    t !== null && !Ut
      ? ((e.updateQueue = t.updateQueue),
        (e.flags &= -2053),
        (t.lanes &= ~i),
        Er(t, e, i))
      : (xe && n && Od(e), (e.flags |= 1), Ot(t, e, r, i), e.child)
  );
}
function Mh(t, e, n, r, i) {
  if (t === null) {
    var o = n.type;
    return typeof o == "function" &&
      !Zd(o) &&
      o.defaultProps === void 0 &&
      n.compare === null &&
      n.defaultProps === void 0
      ? ((e.tag = 15), (e.type = o), Cg(t, e, o, r, i))
      : ((t = za(n.type, null, r, e, e.mode, i)),
        (t.ref = e.ref),
        (t.return = e),
        (e.child = t));
  }
  if (((o = t.child), !(t.lanes & i))) {
    var l = o.memoizedProps;
    if (
      ((n = n.compare), (n = n !== null ? n : cs), n(l, r) && t.ref === e.ref)
    )
      return Er(t, e, i);
  }
  return (
    (e.flags |= 1),
    (t = ri(o, r)),
    (t.ref = e.ref),
    (t.return = e),
    (e.child = t)
  );
}
function Cg(t, e, n, r, i) {
  if (t !== null) {
    var o = t.memoizedProps;
    if (cs(o, r) && t.ref === e.ref)
      if (((Ut = !1), (e.pendingProps = r = o), (t.lanes & i) !== 0))
        t.flags & 131072 && (Ut = !0);
      else return (e.lanes = t.lanes), Er(t, e, i);
  }
  return Cf(t, e, n, r, i);
}
function Eg(t, e, n) {
  var r = e.pendingProps,
    i = r.children,
    o = t !== null ? t.memoizedState : null;
  if (r.mode === "hidden")
    if (!(e.mode & 1))
      (e.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        he(No, tn),
        (tn |= n);
    else {
      if (!(n & 1073741824))
        return (
          (t = o !== null ? o.baseLanes | n : n),
          (e.lanes = e.childLanes = 1073741824),
          (e.memoizedState = {
            baseLanes: t,
            cachePool: null,
            transitions: null,
          }),
          (e.updateQueue = null),
          he(No, tn),
          (tn |= t),
          null
        );
      (e.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        (r = o !== null ? o.baseLanes : n),
        he(No, tn),
        (tn |= r);
    }
  else
    o !== null ? ((r = o.baseLanes | n), (e.memoizedState = null)) : (r = n),
      he(No, tn),
      (tn |= r);
  return Ot(t, e, i, n), e.child;
}
function Pg(t, e) {
  var n = e.ref;
  ((t === null && n !== null) || (t !== null && t.ref !== n)) &&
    ((e.flags |= 512), (e.flags |= 2097152));
}
function Cf(t, e, n, r, i) {
  var o = Ht(n) ? Hi : Ct.current;
  return (
    (o = Wo(e, o)),
    Fo(e, i),
    (n = Ud(t, e, n, r, o, i)),
    (r = Vd()),
    t !== null && !Ut
      ? ((e.updateQueue = t.updateQueue),
        (e.flags &= -2053),
        (t.lanes &= ~i),
        Er(t, e, i))
      : (xe && r && Od(e), (e.flags |= 1), Ot(t, e, n, i), e.child)
  );
}
function Lh(t, e, n, r, i) {
  if (Ht(n)) {
    var o = !0;
    tu(e);
  } else o = !1;
  if ((Fo(e, i), e.stateNode === null))
    Oa(t, e), wg(e, n, r), Sf(e, n, r, i), (r = !0);
  else if (t === null) {
    var l = e.stateNode,
      s = e.memoizedProps;
    l.props = s;
    var a = l.context,
      u = n.contextType;
    typeof u == "object" && u !== null
      ? (u = Pn(u))
      : ((u = Ht(n) ? Hi : Ct.current), (u = Wo(e, u)));
    var c = n.getDerivedStateFromProps,
      f =
        typeof c == "function" ||
        typeof l.getSnapshotBeforeUpdate == "function";
    f ||
      (typeof l.UNSAFE_componentWillReceiveProps != "function" &&
        typeof l.componentWillReceiveProps != "function") ||
      ((s !== r || a !== u) && Ph(e, l, r, u)),
      ($r = !1);
    var d = e.memoizedState;
    (l.state = d),
      lu(e, r, l, i),
      (a = e.memoizedState),
      s !== r || d !== a || Vt.current || $r
        ? (typeof c == "function" && (wf(e, n, c, r), (a = e.memoizedState)),
          (s = $r || Eh(e, n, s, r, d, a, u))
            ? (f ||
                (typeof l.UNSAFE_componentWillMount != "function" &&
                  typeof l.componentWillMount != "function") ||
                (typeof l.componentWillMount == "function" &&
                  l.componentWillMount(),
                typeof l.UNSAFE_componentWillMount == "function" &&
                  l.UNSAFE_componentWillMount()),
              typeof l.componentDidMount == "function" && (e.flags |= 4194308))
            : (typeof l.componentDidMount == "function" && (e.flags |= 4194308),
              (e.memoizedProps = r),
              (e.memoizedState = a)),
          (l.props = r),
          (l.state = a),
          (l.context = u),
          (r = s))
        : (typeof l.componentDidMount == "function" && (e.flags |= 4194308),
          (r = !1));
  } else {
    (l = e.stateNode),
      eg(t, e),
      (s = e.memoizedProps),
      (u = e.type === e.elementType ? s : An(e.type, s)),
      (l.props = u),
      (f = e.pendingProps),
      (d = l.context),
      (a = n.contextType),
      typeof a == "object" && a !== null
        ? (a = Pn(a))
        : ((a = Ht(n) ? Hi : Ct.current), (a = Wo(e, a)));
    var p = n.getDerivedStateFromProps;
    (c =
      typeof p == "function" ||
      typeof l.getSnapshotBeforeUpdate == "function") ||
      (typeof l.UNSAFE_componentWillReceiveProps != "function" &&
        typeof l.componentWillReceiveProps != "function") ||
      ((s !== f || d !== a) && Ph(e, l, r, a)),
      ($r = !1),
      (d = e.memoizedState),
      (l.state = d),
      lu(e, r, l, i);
    var v = e.memoizedState;
    s !== f || d !== v || Vt.current || $r
      ? (typeof p == "function" && (wf(e, n, p, r), (v = e.memoizedState)),
        (u = $r || Eh(e, n, u, r, d, v, a) || !1)
          ? (c ||
              (typeof l.UNSAFE_componentWillUpdate != "function" &&
                typeof l.componentWillUpdate != "function") ||
              (typeof l.componentWillUpdate == "function" &&
                l.componentWillUpdate(r, v, a),
              typeof l.UNSAFE_componentWillUpdate == "function" &&
                l.UNSAFE_componentWillUpdate(r, v, a)),
            typeof l.componentDidUpdate == "function" && (e.flags |= 4),
            typeof l.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024))
          : (typeof l.componentDidUpdate != "function" ||
              (s === t.memoizedProps && d === t.memoizedState) ||
              (e.flags |= 4),
            typeof l.getSnapshotBeforeUpdate != "function" ||
              (s === t.memoizedProps && d === t.memoizedState) ||
              (e.flags |= 1024),
            (e.memoizedProps = r),
            (e.memoizedState = v)),
        (l.props = r),
        (l.state = v),
        (l.context = a),
        (r = u))
      : (typeof l.componentDidUpdate != "function" ||
          (s === t.memoizedProps && d === t.memoizedState) ||
          (e.flags |= 4),
        typeof l.getSnapshotBeforeUpdate != "function" ||
          (s === t.memoizedProps && d === t.memoizedState) ||
          (e.flags |= 1024),
        (r = !1));
  }
  return Ef(t, e, n, r, o, i);
}
function Ef(t, e, n, r, i, o) {
  Pg(t, e);
  var l = (e.flags & 128) !== 0;
  if (!r && !l) return i && vh(e, n, !1), Er(t, e, o);
  (r = e.stateNode), (X_.current = e);
  var s =
    l && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return (
    (e.flags |= 1),
    t !== null && l
      ? ((e.child = Xo(e, t.child, null, o)), (e.child = Xo(e, null, s, o)))
      : Ot(t, e, s, o),
    (e.memoizedState = r.state),
    i && vh(e, n, !0),
    e.child
  );
}
function Tg(t) {
  var e = t.stateNode;
  e.pendingContext
    ? gh(t, e.pendingContext, e.pendingContext !== e.context)
    : e.context && gh(t, e.context, !1),
    Id(t, e.containerInfo);
}
function zh(t, e, n, r, i) {
  return Yo(), Ld(i), (e.flags |= 256), Ot(t, e, n, r), e.child;
}
var Pf = { dehydrated: null, treeContext: null, retryLane: 0 };
function Tf(t) {
  return { baseLanes: t, cachePool: null, transitions: null };
}
function Ng(t, e, n) {
  var r = e.pendingProps,
    i = Ee.current,
    o = !1,
    l = (e.flags & 128) !== 0,
    s;
  if (
    ((s = l) ||
      (s = t !== null && t.memoizedState === null ? !1 : (i & 2) !== 0),
    s
      ? ((o = !0), (e.flags &= -129))
      : (t === null || t.memoizedState !== null) && (i |= 1),
    he(Ee, i & 1),
    t === null)
  )
    return (
      _f(e),
      (t = e.memoizedState),
      t !== null && ((t = t.dehydrated), t !== null)
        ? (e.mode & 1
            ? t.data === "$!"
              ? (e.lanes = 8)
              : (e.lanes = 1073741824)
            : (e.lanes = 1),
          null)
        : ((l = r.children),
          (t = r.fallback),
          o
            ? ((r = e.mode),
              (o = e.child),
              (l = { mode: "hidden", children: l }),
              !(r & 1) && o !== null
                ? ((o.childLanes = 0), (o.pendingProps = l))
                : (o = Bu(l, r, 0, null)),
              (t = Fi(t, r, n, null)),
              (o.return = e),
              (t.return = e),
              (o.sibling = t),
              (e.child = o),
              (e.child.memoizedState = Tf(n)),
              (e.memoizedState = Pf),
              t)
            : Yd(e, l))
    );
  if (((i = t.memoizedState), i !== null && ((s = i.dehydrated), s !== null)))
    return Q_(t, e, l, r, s, i, n);
  if (o) {
    (o = r.fallback), (l = e.mode), (i = t.child), (s = i.sibling);
    var a = { mode: "hidden", children: r.children };
    return (
      !(l & 1) && e.child !== i
        ? ((r = e.child),
          (r.childLanes = 0),
          (r.pendingProps = a),
          (e.deletions = null))
        : ((r = ri(i, a)), (r.subtreeFlags = i.subtreeFlags & 14680064)),
      s !== null ? (o = ri(s, o)) : ((o = Fi(o, l, n, null)), (o.flags |= 2)),
      (o.return = e),
      (r.return = e),
      (r.sibling = o),
      (e.child = r),
      (r = o),
      (o = e.child),
      (l = t.child.memoizedState),
      (l =
        l === null
          ? Tf(n)
          : {
              baseLanes: l.baseLanes | n,
              cachePool: null,
              transitions: l.transitions,
            }),
      (o.memoizedState = l),
      (o.childLanes = t.childLanes & ~n),
      (e.memoizedState = Pf),
      r
    );
  }
  return (
    (o = t.child),
    (t = o.sibling),
    (r = ri(o, { mode: "visible", children: r.children })),
    !(e.mode & 1) && (r.lanes = n),
    (r.return = e),
    (r.sibling = null),
    t !== null &&
      ((n = e.deletions),
      n === null ? ((e.deletions = [t]), (e.flags |= 16)) : n.push(t)),
    (e.child = r),
    (e.memoizedState = null),
    r
  );
}
function Yd(t, e) {
  return (
    (e = Bu({ mode: "visible", children: e }, t.mode, 0, null)),
    (e.return = t),
    (t.child = e)
  );
}
function na(t, e, n, r) {
  return (
    r !== null && Ld(r),
    Xo(e, t.child, null, n),
    (t = Yd(e, e.pendingProps.children)),
    (t.flags |= 2),
    (e.memoizedState = null),
    t
  );
}
function Q_(t, e, n, r, i, o, l) {
  if (n)
    return e.flags & 256
      ? ((e.flags &= -257), (r = wc(Error(L(422)))), na(t, e, l, r))
      : e.memoizedState !== null
      ? ((e.child = t.child), (e.flags |= 128), null)
      : ((o = r.fallback),
        (i = e.mode),
        (r = Bu({ mode: "visible", children: r.children }, i, 0, null)),
        (o = Fi(o, i, l, null)),
        (o.flags |= 2),
        (r.return = e),
        (o.return = e),
        (r.sibling = o),
        (e.child = r),
        e.mode & 1 && Xo(e, t.child, null, l),
        (e.child.memoizedState = Tf(l)),
        (e.memoizedState = Pf),
        o);
  if (!(e.mode & 1)) return na(t, e, l, null);
  if (i.data === "$!") {
    if (((r = i.nextSibling && i.nextSibling.dataset), r)) var s = r.dgst;
    return (r = s), (o = Error(L(419))), (r = wc(o, r, void 0)), na(t, e, l, r);
  }
  if (((s = (l & t.childLanes) !== 0), Ut || s)) {
    if (((r = rt), r !== null)) {
      switch (l & -l) {
        case 4:
          i = 2;
          break;
        case 16:
          i = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          i = 32;
          break;
        case 536870912:
          i = 268435456;
          break;
        default:
          i = 0;
      }
      (i = i & (r.suspendedLanes | l) ? 0 : i),
        i !== 0 &&
          i !== o.retryLane &&
          ((o.retryLane = i), Cr(t, i), Un(r, t, i, -1));
    }
    return Jd(), (r = wc(Error(L(421)))), na(t, e, l, r);
  }
  return i.data === "$?"
    ? ((e.flags |= 128),
      (e.child = t.child),
      (e = sx.bind(null, t)),
      (i._reactRetry = e),
      null)
    : ((t = o.treeContext),
      (sn = Zr(i.nextSibling)),
      (un = e),
      (xe = !0),
      (bn = null),
      t !== null &&
        ((vn[yn++] = gr),
        (vn[yn++] = vr),
        (vn[yn++] = Wi),
        (gr = t.id),
        (vr = t.overflow),
        (Wi = e)),
      (e = Yd(e, r.children)),
      (e.flags |= 4096),
      e);
}
function Dh(t, e, n) {
  t.lanes |= e;
  var r = t.alternate;
  r !== null && (r.lanes |= e), xf(t.return, e, n);
}
function Sc(t, e, n, r, i) {
  var o = t.memoizedState;
  o === null
    ? (t.memoizedState = {
        isBackwards: e,
        rendering: null,
        renderingStartTime: 0,
        last: r,
        tail: n,
        tailMode: i,
      })
    : ((o.isBackwards = e),
      (o.rendering = null),
      (o.renderingStartTime = 0),
      (o.last = r),
      (o.tail = n),
      (o.tailMode = i));
}
function Rg(t, e, n) {
  var r = e.pendingProps,
    i = r.revealOrder,
    o = r.tail;
  if ((Ot(t, e, r.children, n), (r = Ee.current), r & 2))
    (r = (r & 1) | 2), (e.flags |= 128);
  else {
    if (t !== null && t.flags & 128)
      e: for (t = e.child; t !== null; ) {
        if (t.tag === 13) t.memoizedState !== null && Dh(t, n, e);
        else if (t.tag === 19) Dh(t, n, e);
        else if (t.child !== null) {
          (t.child.return = t), (t = t.child);
          continue;
        }
        if (t === e) break e;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) break e;
          t = t.return;
        }
        (t.sibling.return = t.return), (t = t.sibling);
      }
    r &= 1;
  }
  if ((he(Ee, r), !(e.mode & 1))) e.memoizedState = null;
  else
    switch (i) {
      case "forwards":
        for (n = e.child, i = null; n !== null; )
          (t = n.alternate),
            t !== null && su(t) === null && (i = n),
            (n = n.sibling);
        (n = i),
          n === null
            ? ((i = e.child), (e.child = null))
            : ((i = n.sibling), (n.sibling = null)),
          Sc(e, !1, i, n, o);
        break;
      case "backwards":
        for (n = null, i = e.child, e.child = null; i !== null; ) {
          if (((t = i.alternate), t !== null && su(t) === null)) {
            e.child = i;
            break;
          }
          (t = i.sibling), (i.sibling = n), (n = i), (i = t);
        }
        Sc(e, !0, n, null, o);
        break;
      case "together":
        Sc(e, !1, null, null, void 0);
        break;
      default:
        e.memoizedState = null;
    }
  return e.child;
}
function Oa(t, e) {
  !(e.mode & 1) &&
    t !== null &&
    ((t.alternate = null), (e.alternate = null), (e.flags |= 2));
}
function Er(t, e, n) {
  if (
    (t !== null && (e.dependencies = t.dependencies),
    (Xi |= e.lanes),
    !(n & e.childLanes))
  )
    return null;
  if (t !== null && e.child !== t.child) throw Error(L(153));
  if (e.child !== null) {
    for (
      t = e.child, n = ri(t, t.pendingProps), e.child = n, n.return = e;
      t.sibling !== null;

    )
      (t = t.sibling), (n = n.sibling = ri(t, t.pendingProps)), (n.return = e);
    n.sibling = null;
  }
  return e.child;
}
function G_(t, e, n) {
  switch (e.tag) {
    case 3:
      Tg(e), Yo();
      break;
    case 5:
      tg(e);
      break;
    case 1:
      Ht(e.type) && tu(e);
      break;
    case 4:
      Id(e, e.stateNode.containerInfo);
      break;
    case 10:
      var r = e.type._context,
        i = e.memoizedProps.value;
      he(iu, r._currentValue), (r._currentValue = i);
      break;
    case 13:
      if (((r = e.memoizedState), r !== null))
        return r.dehydrated !== null
          ? (he(Ee, Ee.current & 1), (e.flags |= 128), null)
          : n & e.child.childLanes
          ? Ng(t, e, n)
          : (he(Ee, Ee.current & 1),
            (t = Er(t, e, n)),
            t !== null ? t.sibling : null);
      he(Ee, Ee.current & 1);
      break;
    case 19:
      if (((r = (n & e.childLanes) !== 0), t.flags & 128)) {
        if (r) return Rg(t, e, n);
        e.flags |= 128;
      }
      if (
        ((i = e.memoizedState),
        i !== null &&
          ((i.rendering = null), (i.tail = null), (i.lastEffect = null)),
        he(Ee, Ee.current),
        r)
      )
        break;
      return null;
    case 22:
    case 23:
      return (e.lanes = 0), Eg(t, e, n);
  }
  return Er(t, e, n);
}
var Og, Nf, Mg, Lg;
Og = function (t, e) {
  for (var n = e.child; n !== null; ) {
    if (n.tag === 5 || n.tag === 6) t.appendChild(n.stateNode);
    else if (n.tag !== 4 && n.child !== null) {
      (n.child.return = n), (n = n.child);
      continue;
    }
    if (n === e) break;
    for (; n.sibling === null; ) {
      if (n.return === null || n.return === e) return;
      n = n.return;
    }
    (n.sibling.return = n.return), (n = n.sibling);
  }
};
Nf = function () {};
Mg = function (t, e, n, r) {
  var i = t.memoizedProps;
  if (i !== r) {
    (t = e.stateNode), Mi(nr.current);
    var o = null;
    switch (n) {
      case "input":
        (i = Gc(t, i)), (r = Gc(t, r)), (o = []);
        break;
      case "select":
        (i = Oe({}, i, { value: void 0 })),
          (r = Oe({}, r, { value: void 0 })),
          (o = []);
        break;
      case "textarea":
        (i = Jc(t, i)), (r = Jc(t, r)), (o = []);
        break;
      default:
        typeof i.onClick != "function" &&
          typeof r.onClick == "function" &&
          (t.onclick = Za);
    }
    ef(n, r);
    var l;
    n = null;
    for (u in i)
      if (!r.hasOwnProperty(u) && i.hasOwnProperty(u) && i[u] != null)
        if (u === "style") {
          var s = i[u];
          for (l in s) s.hasOwnProperty(l) && (n || (n = {}), (n[l] = ""));
        } else
          u !== "dangerouslySetInnerHTML" &&
            u !== "children" &&
            u !== "suppressContentEditableWarning" &&
            u !== "suppressHydrationWarning" &&
            u !== "autoFocus" &&
            (rs.hasOwnProperty(u)
              ? o || (o = [])
              : (o = o || []).push(u, null));
    for (u in r) {
      var a = r[u];
      if (
        ((s = i != null ? i[u] : void 0),
        r.hasOwnProperty(u) && a !== s && (a != null || s != null))
      )
        if (u === "style")
          if (s) {
            for (l in s)
              !s.hasOwnProperty(l) ||
                (a && a.hasOwnProperty(l)) ||
                (n || (n = {}), (n[l] = ""));
            for (l in a)
              a.hasOwnProperty(l) &&
                s[l] !== a[l] &&
                (n || (n = {}), (n[l] = a[l]));
          } else n || (o || (o = []), o.push(u, n)), (n = a);
        else
          u === "dangerouslySetInnerHTML"
            ? ((a = a ? a.__html : void 0),
              (s = s ? s.__html : void 0),
              a != null && s !== a && (o = o || []).push(u, a))
            : u === "children"
            ? (typeof a != "string" && typeof a != "number") ||
              (o = o || []).push(u, "" + a)
            : u !== "suppressContentEditableWarning" &&
              u !== "suppressHydrationWarning" &&
              (rs.hasOwnProperty(u)
                ? (a != null && u === "onScroll" && ge("scroll", t),
                  o || s === a || (o = []))
                : (o = o || []).push(u, a));
    }
    n && (o = o || []).push("style", n);
    var u = o;
    (e.updateQueue = u) && (e.flags |= 4);
  }
};
Lg = function (t, e, n, r) {
  n !== r && (e.flags |= 4);
};
function _l(t, e) {
  if (!xe)
    switch (t.tailMode) {
      case "hidden":
        e = t.tail;
        for (var n = null; e !== null; )
          e.alternate !== null && (n = e), (e = e.sibling);
        n === null ? (t.tail = null) : (n.sibling = null);
        break;
      case "collapsed":
        n = t.tail;
        for (var r = null; n !== null; )
          n.alternate !== null && (r = n), (n = n.sibling);
        r === null
          ? e || t.tail === null
            ? (t.tail = null)
            : (t.tail.sibling = null)
          : (r.sibling = null);
    }
}
function vt(t) {
  var e = t.alternate !== null && t.alternate.child === t.child,
    n = 0,
    r = 0;
  if (e)
    for (var i = t.child; i !== null; )
      (n |= i.lanes | i.childLanes),
        (r |= i.subtreeFlags & 14680064),
        (r |= i.flags & 14680064),
        (i.return = t),
        (i = i.sibling);
  else
    for (i = t.child; i !== null; )
      (n |= i.lanes | i.childLanes),
        (r |= i.subtreeFlags),
        (r |= i.flags),
        (i.return = t),
        (i = i.sibling);
  return (t.subtreeFlags |= r), (t.childLanes = n), e;
}
function K_(t, e, n) {
  var r = e.pendingProps;
  switch ((Md(e), e.tag)) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return vt(e), null;
    case 1:
      return Ht(e.type) && eu(), vt(e), null;
    case 3:
      return (
        (r = e.stateNode),
        Qo(),
        ye(Vt),
        ye(Ct),
        $d(),
        r.pendingContext &&
          ((r.context = r.pendingContext), (r.pendingContext = null)),
        (t === null || t.child === null) &&
          (ea(e)
            ? (e.flags |= 4)
            : t === null ||
              (t.memoizedState.isDehydrated && !(e.flags & 256)) ||
              ((e.flags |= 1024), bn !== null && (Ff(bn), (bn = null)))),
        Nf(t, e),
        vt(e),
        null
      );
    case 5:
      bd(e);
      var i = Mi(ms.current);
      if (((n = e.type), t !== null && e.stateNode != null))
        Mg(t, e, n, r, i),
          t.ref !== e.ref && ((e.flags |= 512), (e.flags |= 2097152));
      else {
        if (!r) {
          if (e.stateNode === null) throw Error(L(166));
          return vt(e), null;
        }
        if (((t = Mi(nr.current)), ea(e))) {
          (r = e.stateNode), (n = e.type);
          var o = e.memoizedProps;
          switch (((r[qn] = e), (r[ps] = o), (t = (e.mode & 1) !== 0), n)) {
            case "dialog":
              ge("cancel", r), ge("close", r);
              break;
            case "iframe":
            case "object":
            case "embed":
              ge("load", r);
              break;
            case "video":
            case "audio":
              for (i = 0; i < Nl.length; i++) ge(Nl[i], r);
              break;
            case "source":
              ge("error", r);
              break;
            case "img":
            case "image":
            case "link":
              ge("error", r), ge("load", r);
              break;
            case "details":
              ge("toggle", r);
              break;
            case "input":
              Vp(r, o), ge("invalid", r);
              break;
            case "select":
              (r._wrapperState = { wasMultiple: !!o.multiple }),
                ge("invalid", r);
              break;
            case "textarea":
              Wp(r, o), ge("invalid", r);
          }
          ef(n, o), (i = null);
          for (var l in o)
            if (o.hasOwnProperty(l)) {
              var s = o[l];
              l === "children"
                ? typeof s == "string"
                  ? r.textContent !== s &&
                    (o.suppressHydrationWarning !== !0 &&
                      Zs(r.textContent, s, t),
                    (i = ["children", s]))
                  : typeof s == "number" &&
                    r.textContent !== "" + s &&
                    (o.suppressHydrationWarning !== !0 &&
                      Zs(r.textContent, s, t),
                    (i = ["children", "" + s]))
                : rs.hasOwnProperty(l) &&
                  s != null &&
                  l === "onScroll" &&
                  ge("scroll", r);
            }
          switch (n) {
            case "input":
              Ws(r), Hp(r, o, !0);
              break;
            case "textarea":
              Ws(r), Yp(r);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof o.onClick == "function" && (r.onclick = Za);
          }
          (r = i), (e.updateQueue = r), r !== null && (e.flags |= 4);
        } else {
          (l = i.nodeType === 9 ? i : i.ownerDocument),
            t === "http://www.w3.org/1999/xhtml" && (t = lm(n)),
            t === "http://www.w3.org/1999/xhtml"
              ? n === "script"
                ? ((t = l.createElement("div")),
                  (t.innerHTML = "<script></script>"),
                  (t = t.removeChild(t.firstChild)))
                : typeof r.is == "string"
                ? (t = l.createElement(n, { is: r.is }))
                : ((t = l.createElement(n)),
                  n === "select" &&
                    ((l = t),
                    r.multiple
                      ? (l.multiple = !0)
                      : r.size && (l.size = r.size)))
              : (t = l.createElementNS(t, n)),
            (t[qn] = e),
            (t[ps] = r),
            Og(t, e, !1, !1),
            (e.stateNode = t);
          e: {
            switch (((l = tf(n, r)), n)) {
              case "dialog":
                ge("cancel", t), ge("close", t), (i = r);
                break;
              case "iframe":
              case "object":
              case "embed":
                ge("load", t), (i = r);
                break;
              case "video":
              case "audio":
                for (i = 0; i < Nl.length; i++) ge(Nl[i], t);
                i = r;
                break;
              case "source":
                ge("error", t), (i = r);
                break;
              case "img":
              case "image":
              case "link":
                ge("error", t), ge("load", t), (i = r);
                break;
              case "details":
                ge("toggle", t), (i = r);
                break;
              case "input":
                Vp(t, r), (i = Gc(t, r)), ge("invalid", t);
                break;
              case "option":
                i = r;
                break;
              case "select":
                (t._wrapperState = { wasMultiple: !!r.multiple }),
                  (i = Oe({}, r, { value: void 0 })),
                  ge("invalid", t);
                break;
              case "textarea":
                Wp(t, r), (i = Jc(t, r)), ge("invalid", t);
                break;
              default:
                i = r;
            }
            ef(n, i), (s = i);
            for (o in s)
              if (s.hasOwnProperty(o)) {
                var a = s[o];
                o === "style"
                  ? um(t, a)
                  : o === "dangerouslySetInnerHTML"
                  ? ((a = a ? a.__html : void 0), a != null && sm(t, a))
                  : o === "children"
                  ? typeof a == "string"
                    ? (n !== "textarea" || a !== "") && is(t, a)
                    : typeof a == "number" && is(t, "" + a)
                  : o !== "suppressContentEditableWarning" &&
                    o !== "suppressHydrationWarning" &&
                    o !== "autoFocus" &&
                    (rs.hasOwnProperty(o)
                      ? a != null && o === "onScroll" && ge("scroll", t)
                      : a != null && gd(t, o, a, l));
              }
            switch (n) {
              case "input":
                Ws(t), Hp(t, r, !1);
                break;
              case "textarea":
                Ws(t), Yp(t);
                break;
              case "option":
                r.value != null && t.setAttribute("value", "" + si(r.value));
                break;
              case "select":
                (t.multiple = !!r.multiple),
                  (o = r.value),
                  o != null
                    ? Lo(t, !!r.multiple, o, !1)
                    : r.defaultValue != null &&
                      Lo(t, !!r.multiple, r.defaultValue, !0);
                break;
              default:
                typeof i.onClick == "function" && (t.onclick = Za);
            }
            switch (n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                r = !!r.autoFocus;
                break e;
              case "img":
                r = !0;
                break e;
              default:
                r = !1;
            }
          }
          r && (e.flags |= 4);
        }
        e.ref !== null && ((e.flags |= 512), (e.flags |= 2097152));
      }
      return vt(e), null;
    case 6:
      if (t && e.stateNode != null) Lg(t, e, t.memoizedProps, r);
      else {
        if (typeof r != "string" && e.stateNode === null) throw Error(L(166));
        if (((n = Mi(ms.current)), Mi(nr.current), ea(e))) {
          if (
            ((r = e.stateNode),
            (n = e.memoizedProps),
            (r[qn] = e),
            (o = r.nodeValue !== n) && ((t = un), t !== null))
          )
            switch (t.tag) {
              case 3:
                Zs(r.nodeValue, n, (t.mode & 1) !== 0);
                break;
              case 5:
                t.memoizedProps.suppressHydrationWarning !== !0 &&
                  Zs(r.nodeValue, n, (t.mode & 1) !== 0);
            }
          o && (e.flags |= 4);
        } else
          (r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r)),
            (r[qn] = e),
            (e.stateNode = r);
      }
      return vt(e), null;
    case 13:
      if (
        (ye(Ee),
        (r = e.memoizedState),
        t === null ||
          (t.memoizedState !== null && t.memoizedState.dehydrated !== null))
      ) {
        if (xe && sn !== null && e.mode & 1 && !(e.flags & 128))
          Km(), Yo(), (e.flags |= 98560), (o = !1);
        else if (((o = ea(e)), r !== null && r.dehydrated !== null)) {
          if (t === null) {
            if (!o) throw Error(L(318));
            if (
              ((o = e.memoizedState),
              (o = o !== null ? o.dehydrated : null),
              !o)
            )
              throw Error(L(317));
            o[qn] = e;
          } else
            Yo(), !(e.flags & 128) && (e.memoizedState = null), (e.flags |= 4);
          vt(e), (o = !1);
        } else bn !== null && (Ff(bn), (bn = null)), (o = !0);
        if (!o) return e.flags & 65536 ? e : null;
      }
      return e.flags & 128
        ? ((e.lanes = n), e)
        : ((r = r !== null),
          r !== (t !== null && t.memoizedState !== null) &&
            r &&
            ((e.child.flags |= 8192),
            e.mode & 1 &&
              (t === null || Ee.current & 1 ? Ke === 0 && (Ke = 3) : Jd())),
          e.updateQueue !== null && (e.flags |= 4),
          vt(e),
          null);
    case 4:
      return (
        Qo(), Nf(t, e), t === null && fs(e.stateNode.containerInfo), vt(e), null
      );
    case 10:
      return jd(e.type._context), vt(e), null;
    case 17:
      return Ht(e.type) && eu(), vt(e), null;
    case 19:
      if ((ye(Ee), (o = e.memoizedState), o === null)) return vt(e), null;
      if (((r = (e.flags & 128) !== 0), (l = o.rendering), l === null))
        if (r) _l(o, !1);
        else {
          if (Ke !== 0 || (t !== null && t.flags & 128))
            for (t = e.child; t !== null; ) {
              if (((l = su(t)), l !== null)) {
                for (
                  e.flags |= 128,
                    _l(o, !1),
                    r = l.updateQueue,
                    r !== null && ((e.updateQueue = r), (e.flags |= 4)),
                    e.subtreeFlags = 0,
                    r = n,
                    n = e.child;
                  n !== null;

                )
                  (o = n),
                    (t = r),
                    (o.flags &= 14680066),
                    (l = o.alternate),
                    l === null
                      ? ((o.childLanes = 0),
                        (o.lanes = t),
                        (o.child = null),
                        (o.subtreeFlags = 0),
                        (o.memoizedProps = null),
                        (o.memoizedState = null),
                        (o.updateQueue = null),
                        (o.dependencies = null),
                        (o.stateNode = null))
                      : ((o.childLanes = l.childLanes),
                        (o.lanes = l.lanes),
                        (o.child = l.child),
                        (o.subtreeFlags = 0),
                        (o.deletions = null),
                        (o.memoizedProps = l.memoizedProps),
                        (o.memoizedState = l.memoizedState),
                        (o.updateQueue = l.updateQueue),
                        (o.type = l.type),
                        (t = l.dependencies),
                        (o.dependencies =
                          t === null
                            ? null
                            : {
                                lanes: t.lanes,
                                firstContext: t.firstContext,
                              })),
                    (n = n.sibling);
                return he(Ee, (Ee.current & 1) | 2), e.child;
              }
              t = t.sibling;
            }
          o.tail !== null &&
            be() > Ko &&
            ((e.flags |= 128), (r = !0), _l(o, !1), (e.lanes = 4194304));
        }
      else {
        if (!r)
          if (((t = su(l)), t !== null)) {
            if (
              ((e.flags |= 128),
              (r = !0),
              (n = t.updateQueue),
              n !== null && ((e.updateQueue = n), (e.flags |= 4)),
              _l(o, !0),
              o.tail === null && o.tailMode === "hidden" && !l.alternate && !xe)
            )
              return vt(e), null;
          } else
            2 * be() - o.renderingStartTime > Ko &&
              n !== 1073741824 &&
              ((e.flags |= 128), (r = !0), _l(o, !1), (e.lanes = 4194304));
        o.isBackwards
          ? ((l.sibling = e.child), (e.child = l))
          : ((n = o.last),
            n !== null ? (n.sibling = l) : (e.child = l),
            (o.last = l));
      }
      return o.tail !== null
        ? ((e = o.tail),
          (o.rendering = e),
          (o.tail = e.sibling),
          (o.renderingStartTime = be()),
          (e.sibling = null),
          (n = Ee.current),
          he(Ee, r ? (n & 1) | 2 : n & 1),
          e)
        : (vt(e), null);
    case 22:
    case 23:
      return (
        qd(),
        (r = e.memoizedState !== null),
        t !== null && (t.memoizedState !== null) !== r && (e.flags |= 8192),
        r && e.mode & 1
          ? tn & 1073741824 && (vt(e), e.subtreeFlags & 6 && (e.flags |= 8192))
          : vt(e),
        null
      );
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(L(156, e.tag));
}
function q_(t, e) {
  switch ((Md(e), e.tag)) {
    case 1:
      return (
        Ht(e.type) && eu(),
        (t = e.flags),
        t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null
      );
    case 3:
      return (
        Qo(),
        ye(Vt),
        ye(Ct),
        $d(),
        (t = e.flags),
        t & 65536 && !(t & 128) ? ((e.flags = (t & -65537) | 128), e) : null
      );
    case 5:
      return bd(e), null;
    case 13:
      if (
        (ye(Ee), (t = e.memoizedState), t !== null && t.dehydrated !== null)
      ) {
        if (e.alternate === null) throw Error(L(340));
        Yo();
      }
      return (
        (t = e.flags), t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null
      );
    case 19:
      return ye(Ee), null;
    case 4:
      return Qo(), null;
    case 10:
      return jd(e.type._context), null;
    case 22:
    case 23:
      return qd(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var ra = !1,
  xt = !1,
  J_ = typeof WeakSet == "function" ? WeakSet : Set,
  F = null;
function To(t, e) {
  var n = t.ref;
  if (n !== null)
    if (typeof n == "function")
      try {
        n(null);
      } catch (r) {
        Le(t, e, r);
      }
    else n.current = null;
}
function Rf(t, e, n) {
  try {
    n();
  } catch (r) {
    Le(t, e, r);
  }
}
var jh = !1;
function Z_(t, e) {
  if (((df = Ka), (t = Am()), Rd(t))) {
    if ("selectionStart" in t)
      var n = { start: t.selectionStart, end: t.selectionEnd };
    else
      e: {
        n = ((n = t.ownerDocument) && n.defaultView) || window;
        var r = n.getSelection && n.getSelection();
        if (r && r.rangeCount !== 0) {
          n = r.anchorNode;
          var i = r.anchorOffset,
            o = r.focusNode;
          r = r.focusOffset;
          try {
            n.nodeType, o.nodeType;
          } catch {
            n = null;
            break e;
          }
          var l = 0,
            s = -1,
            a = -1,
            u = 0,
            c = 0,
            f = t,
            d = null;
          t: for (;;) {
            for (
              var p;
              f !== n || (i !== 0 && f.nodeType !== 3) || (s = l + i),
                f !== o || (r !== 0 && f.nodeType !== 3) || (a = l + r),
                f.nodeType === 3 && (l += f.nodeValue.length),
                (p = f.firstChild) !== null;

            )
              (d = f), (f = p);
            for (;;) {
              if (f === t) break t;
              if (
                (d === n && ++u === i && (s = l),
                d === o && ++c === r && (a = l),
                (p = f.nextSibling) !== null)
              )
                break;
              (f = d), (d = f.parentNode);
            }
            f = p;
          }
          n = s === -1 || a === -1 ? null : { start: s, end: a };
        } else n = null;
      }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (pf = { focusedElem: t, selectionRange: n }, Ka = !1, F = e; F !== null; )
    if (((e = F), (t = e.child), (e.subtreeFlags & 1028) !== 0 && t !== null))
      (t.return = e), (F = t);
    else
      for (; F !== null; ) {
        e = F;
        try {
          var v = e.alternate;
          if (e.flags & 1024)
            switch (e.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (v !== null) {
                  var m = v.memoizedProps,
                    x = v.memoizedState,
                    g = e.stateNode,
                    h = g.getSnapshotBeforeUpdate(
                      e.elementType === e.type ? m : An(e.type, m),
                      x
                    );
                  g.__reactInternalSnapshotBeforeUpdate = h;
                }
                break;
              case 3:
                var y = e.stateNode.containerInfo;
                y.nodeType === 1
                  ? (y.textContent = "")
                  : y.nodeType === 9 &&
                    y.documentElement &&
                    y.removeChild(y.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(L(163));
            }
        } catch (_) {
          Le(e, e.return, _);
        }
        if (((t = e.sibling), t !== null)) {
          (t.return = e.return), (F = t);
          break;
        }
        F = e.return;
      }
  return (v = jh), (jh = !1), v;
}
function Ul(t, e, n) {
  var r = e.updateQueue;
  if (((r = r !== null ? r.lastEffect : null), r !== null)) {
    var i = (r = r.next);
    do {
      if ((i.tag & t) === t) {
        var o = i.destroy;
        (i.destroy = void 0), o !== void 0 && Rf(e, n, o);
      }
      i = i.next;
    } while (i !== r);
  }
}
function bu(t, e) {
  if (
    ((e = e.updateQueue), (e = e !== null ? e.lastEffect : null), e !== null)
  ) {
    var n = (e = e.next);
    do {
      if ((n.tag & t) === t) {
        var r = n.create;
        n.destroy = r();
      }
      n = n.next;
    } while (n !== e);
  }
}
function Of(t) {
  var e = t.ref;
  if (e !== null) {
    var n = t.stateNode;
    switch (t.tag) {
      case 5:
        t = n;
        break;
      default:
        t = n;
    }
    typeof e == "function" ? e(t) : (e.current = t);
  }
}
function zg(t) {
  var e = t.alternate;
  e !== null && ((t.alternate = null), zg(e)),
    (t.child = null),
    (t.deletions = null),
    (t.sibling = null),
    t.tag === 5 &&
      ((e = t.stateNode),
      e !== null &&
        (delete e[qn], delete e[ps], delete e[gf], delete e[j_], delete e[F_])),
    (t.stateNode = null),
    (t.return = null),
    (t.dependencies = null),
    (t.memoizedProps = null),
    (t.memoizedState = null),
    (t.pendingProps = null),
    (t.stateNode = null),
    (t.updateQueue = null);
}
function Dg(t) {
  return t.tag === 5 || t.tag === 3 || t.tag === 4;
}
function Fh(t) {
  e: for (;;) {
    for (; t.sibling === null; ) {
      if (t.return === null || Dg(t.return)) return null;
      t = t.return;
    }
    for (
      t.sibling.return = t.return, t = t.sibling;
      t.tag !== 5 && t.tag !== 6 && t.tag !== 18;

    ) {
      if (t.flags & 2 || t.child === null || t.tag === 4) continue e;
      (t.child.return = t), (t = t.child);
    }
    if (!(t.flags & 2)) return t.stateNode;
  }
}
function Mf(t, e, n) {
  var r = t.tag;
  if (r === 5 || r === 6)
    (t = t.stateNode),
      e
        ? n.nodeType === 8
          ? n.parentNode.insertBefore(t, e)
          : n.insertBefore(t, e)
        : (n.nodeType === 8
            ? ((e = n.parentNode), e.insertBefore(t, n))
            : ((e = n), e.appendChild(t)),
          (n = n._reactRootContainer),
          n != null || e.onclick !== null || (e.onclick = Za));
  else if (r !== 4 && ((t = t.child), t !== null))
    for (Mf(t, e, n), t = t.sibling; t !== null; ) Mf(t, e, n), (t = t.sibling);
}
function Lf(t, e, n) {
  var r = t.tag;
  if (r === 5 || r === 6)
    (t = t.stateNode), e ? n.insertBefore(t, e) : n.appendChild(t);
  else if (r !== 4 && ((t = t.child), t !== null))
    for (Lf(t, e, n), t = t.sibling; t !== null; ) Lf(t, e, n), (t = t.sibling);
}
var st = null,
  In = !1;
function Ar(t, e, n) {
  for (n = n.child; n !== null; ) jg(t, e, n), (n = n.sibling);
}
function jg(t, e, n) {
  if (tr && typeof tr.onCommitFiberUnmount == "function")
    try {
      tr.onCommitFiberUnmount(Mu, n);
    } catch {}
  switch (n.tag) {
    case 5:
      xt || To(n, e);
    case 6:
      var r = st,
        i = In;
      (st = null),
        Ar(t, e, n),
        (st = r),
        (In = i),
        st !== null &&
          (In
            ? ((t = st),
              (n = n.stateNode),
              t.nodeType === 8 ? t.parentNode.removeChild(n) : t.removeChild(n))
            : st.removeChild(n.stateNode));
      break;
    case 18:
      st !== null &&
        (In
          ? ((t = st),
            (n = n.stateNode),
            t.nodeType === 8
              ? mc(t.parentNode, n)
              : t.nodeType === 1 && mc(t, n),
            as(t))
          : mc(st, n.stateNode));
      break;
    case 4:
      (r = st),
        (i = In),
        (st = n.stateNode.containerInfo),
        (In = !0),
        Ar(t, e, n),
        (st = r),
        (In = i);
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (
        !xt &&
        ((r = n.updateQueue), r !== null && ((r = r.lastEffect), r !== null))
      ) {
        i = r = r.next;
        do {
          var o = i,
            l = o.destroy;
          (o = o.tag),
            l !== void 0 && (o & 2 || o & 4) && Rf(n, e, l),
            (i = i.next);
        } while (i !== r);
      }
      Ar(t, e, n);
      break;
    case 1:
      if (
        !xt &&
        (To(n, e),
        (r = n.stateNode),
        typeof r.componentWillUnmount == "function")
      )
        try {
          (r.props = n.memoizedProps),
            (r.state = n.memoizedState),
            r.componentWillUnmount();
        } catch (s) {
          Le(n, e, s);
        }
      Ar(t, e, n);
      break;
    case 21:
      Ar(t, e, n);
      break;
    case 22:
      n.mode & 1
        ? ((xt = (r = xt) || n.memoizedState !== null), Ar(t, e, n), (xt = r))
        : Ar(t, e, n);
      break;
    default:
      Ar(t, e, n);
  }
}
function Ah(t) {
  var e = t.updateQueue;
  if (e !== null) {
    t.updateQueue = null;
    var n = t.stateNode;
    n === null && (n = t.stateNode = new J_()),
      e.forEach(function (r) {
        var i = ax.bind(null, t, r);
        n.has(r) || (n.add(r), r.then(i, i));
      });
  }
}
function jn(t, e) {
  var n = e.deletions;
  if (n !== null)
    for (var r = 0; r < n.length; r++) {
      var i = n[r];
      try {
        var o = t,
          l = e,
          s = l;
        e: for (; s !== null; ) {
          switch (s.tag) {
            case 5:
              (st = s.stateNode), (In = !1);
              break e;
            case 3:
              (st = s.stateNode.containerInfo), (In = !0);
              break e;
            case 4:
              (st = s.stateNode.containerInfo), (In = !0);
              break e;
          }
          s = s.return;
        }
        if (st === null) throw Error(L(160));
        jg(o, l, i), (st = null), (In = !1);
        var a = i.alternate;
        a !== null && (a.return = null), (i.return = null);
      } catch (u) {
        Le(i, e, u);
      }
    }
  if (e.subtreeFlags & 12854)
    for (e = e.child; e !== null; ) Fg(e, t), (e = e.sibling);
}
function Fg(t, e) {
  var n = t.alternate,
    r = t.flags;
  switch (t.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if ((jn(e, t), Xn(t), r & 4)) {
        try {
          Ul(3, t, t.return), bu(3, t);
        } catch (m) {
          Le(t, t.return, m);
        }
        try {
          Ul(5, t, t.return);
        } catch (m) {
          Le(t, t.return, m);
        }
      }
      break;
    case 1:
      jn(e, t), Xn(t), r & 512 && n !== null && To(n, n.return);
      break;
    case 5:
      if (
        (jn(e, t),
        Xn(t),
        r & 512 && n !== null && To(n, n.return),
        t.flags & 32)
      ) {
        var i = t.stateNode;
        try {
          is(i, "");
        } catch (m) {
          Le(t, t.return, m);
        }
      }
      if (r & 4 && ((i = t.stateNode), i != null)) {
        var o = t.memoizedProps,
          l = n !== null ? n.memoizedProps : o,
          s = t.type,
          a = t.updateQueue;
        if (((t.updateQueue = null), a !== null))
          try {
            s === "input" && o.type === "radio" && o.name != null && im(i, o),
              tf(s, l);
            var u = tf(s, o);
            for (l = 0; l < a.length; l += 2) {
              var c = a[l],
                f = a[l + 1];
              c === "style"
                ? um(i, f)
                : c === "dangerouslySetInnerHTML"
                ? sm(i, f)
                : c === "children"
                ? is(i, f)
                : gd(i, c, f, u);
            }
            switch (s) {
              case "input":
                Kc(i, o);
                break;
              case "textarea":
                om(i, o);
                break;
              case "select":
                var d = i._wrapperState.wasMultiple;
                i._wrapperState.wasMultiple = !!o.multiple;
                var p = o.value;
                p != null
                  ? Lo(i, !!o.multiple, p, !1)
                  : d !== !!o.multiple &&
                    (o.defaultValue != null
                      ? Lo(i, !!o.multiple, o.defaultValue, !0)
                      : Lo(i, !!o.multiple, o.multiple ? [] : "", !1));
            }
            i[ps] = o;
          } catch (m) {
            Le(t, t.return, m);
          }
      }
      break;
    case 6:
      if ((jn(e, t), Xn(t), r & 4)) {
        if (t.stateNode === null) throw Error(L(162));
        (i = t.stateNode), (o = t.memoizedProps);
        try {
          i.nodeValue = o;
        } catch (m) {
          Le(t, t.return, m);
        }
      }
      break;
    case 3:
      if (
        (jn(e, t), Xn(t), r & 4 && n !== null && n.memoizedState.isDehydrated)
      )
        try {
          as(e.containerInfo);
        } catch (m) {
          Le(t, t.return, m);
        }
      break;
    case 4:
      jn(e, t), Xn(t);
      break;
    case 13:
      jn(e, t),
        Xn(t),
        (i = t.child),
        i.flags & 8192 &&
          ((o = i.memoizedState !== null),
          (i.stateNode.isHidden = o),
          !o ||
            (i.alternate !== null && i.alternate.memoizedState !== null) ||
            (Gd = be())),
        r & 4 && Ah(t);
      break;
    case 22:
      if (
        ((c = n !== null && n.memoizedState !== null),
        t.mode & 1 ? ((xt = (u = xt) || c), jn(e, t), (xt = u)) : jn(e, t),
        Xn(t),
        r & 8192)
      ) {
        if (
          ((u = t.memoizedState !== null),
          (t.stateNode.isHidden = u) && !c && t.mode & 1)
        )
          for (F = t, c = t.child; c !== null; ) {
            for (f = F = c; F !== null; ) {
              switch (((d = F), (p = d.child), d.tag)) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Ul(4, d, d.return);
                  break;
                case 1:
                  To(d, d.return);
                  var v = d.stateNode;
                  if (typeof v.componentWillUnmount == "function") {
                    (r = d), (n = d.return);
                    try {
                      (e = r),
                        (v.props = e.memoizedProps),
                        (v.state = e.memoizedState),
                        v.componentWillUnmount();
                    } catch (m) {
                      Le(r, n, m);
                    }
                  }
                  break;
                case 5:
                  To(d, d.return);
                  break;
                case 22:
                  if (d.memoizedState !== null) {
                    bh(f);
                    continue;
                  }
              }
              p !== null ? ((p.return = d), (F = p)) : bh(f);
            }
            c = c.sibling;
          }
        e: for (c = null, f = t; ; ) {
          if (f.tag === 5) {
            if (c === null) {
              c = f;
              try {
                (i = f.stateNode),
                  u
                    ? ((o = i.style),
                      typeof o.setProperty == "function"
                        ? o.setProperty("display", "none", "important")
                        : (o.display = "none"))
                    : ((s = f.stateNode),
                      (a = f.memoizedProps.style),
                      (l =
                        a != null && a.hasOwnProperty("display")
                          ? a.display
                          : null),
                      (s.style.display = am("display", l)));
              } catch (m) {
                Le(t, t.return, m);
              }
            }
          } else if (f.tag === 6) {
            if (c === null)
              try {
                f.stateNode.nodeValue = u ? "" : f.memoizedProps;
              } catch (m) {
                Le(t, t.return, m);
              }
          } else if (
            ((f.tag !== 22 && f.tag !== 23) ||
              f.memoizedState === null ||
              f === t) &&
            f.child !== null
          ) {
            (f.child.return = f), (f = f.child);
            continue;
          }
          if (f === t) break e;
          for (; f.sibling === null; ) {
            if (f.return === null || f.return === t) break e;
            c === f && (c = null), (f = f.return);
          }
          c === f && (c = null), (f.sibling.return = f.return), (f = f.sibling);
        }
      }
      break;
    case 19:
      jn(e, t), Xn(t), r & 4 && Ah(t);
      break;
    case 21:
      break;
    default:
      jn(e, t), Xn(t);
  }
}
function Xn(t) {
  var e = t.flags;
  if (e & 2) {
    try {
      e: {
        for (var n = t.return; n !== null; ) {
          if (Dg(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(L(160));
      }
      switch (r.tag) {
        case 5:
          var i = r.stateNode;
          r.flags & 32 && (is(i, ""), (r.flags &= -33));
          var o = Fh(t);
          Lf(t, o, i);
          break;
        case 3:
        case 4:
          var l = r.stateNode.containerInfo,
            s = Fh(t);
          Mf(t, s, l);
          break;
        default:
          throw Error(L(161));
      }
    } catch (a) {
      Le(t, t.return, a);
    }
    t.flags &= -3;
  }
  e & 4096 && (t.flags &= -4097);
}
function ex(t, e, n) {
  (F = t), Ag(t);
}
function Ag(t, e, n) {
  for (var r = (t.mode & 1) !== 0; F !== null; ) {
    var i = F,
      o = i.child;
    if (i.tag === 22 && r) {
      var l = i.memoizedState !== null || ra;
      if (!l) {
        var s = i.alternate,
          a = (s !== null && s.memoizedState !== null) || xt;
        s = ra;
        var u = xt;
        if (((ra = l), (xt = a) && !u))
          for (F = i; F !== null; )
            (l = F),
              (a = l.child),
              l.tag === 22 && l.memoizedState !== null
                ? $h(i)
                : a !== null
                ? ((a.return = l), (F = a))
                : $h(i);
        for (; o !== null; ) (F = o), Ag(o), (o = o.sibling);
        (F = i), (ra = s), (xt = u);
      }
      Ih(t);
    } else
      i.subtreeFlags & 8772 && o !== null ? ((o.return = i), (F = o)) : Ih(t);
  }
}
function Ih(t) {
  for (; F !== null; ) {
    var e = F;
    if (e.flags & 8772) {
      var n = e.alternate;
      try {
        if (e.flags & 8772)
          switch (e.tag) {
            case 0:
            case 11:
            case 15:
              xt || bu(5, e);
              break;
            case 1:
              var r = e.stateNode;
              if (e.flags & 4 && !xt)
                if (n === null) r.componentDidMount();
                else {
                  var i =
                    e.elementType === e.type
                      ? n.memoizedProps
                      : An(e.type, n.memoizedProps);
                  r.componentDidUpdate(
                    i,
                    n.memoizedState,
                    r.__reactInternalSnapshotBeforeUpdate
                  );
                }
              var o = e.updateQueue;
              o !== null && Sh(e, o, r);
              break;
            case 3:
              var l = e.updateQueue;
              if (l !== null) {
                if (((n = null), e.child !== null))
                  switch (e.child.tag) {
                    case 5:
                      n = e.child.stateNode;
                      break;
                    case 1:
                      n = e.child.stateNode;
                  }
                Sh(e, l, n);
              }
              break;
            case 5:
              var s = e.stateNode;
              if (n === null && e.flags & 4) {
                n = s;
                var a = e.memoizedProps;
                switch (e.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    a.autoFocus && n.focus();
                    break;
                  case "img":
                    a.src && (n.src = a.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (e.memoizedState === null) {
                var u = e.alternate;
                if (u !== null) {
                  var c = u.memoizedState;
                  if (c !== null) {
                    var f = c.dehydrated;
                    f !== null && as(f);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(L(163));
          }
        xt || (e.flags & 512 && Of(e));
      } catch (d) {
        Le(e, e.return, d);
      }
    }
    if (e === t) {
      F = null;
      break;
    }
    if (((n = e.sibling), n !== null)) {
      (n.return = e.return), (F = n);
      break;
    }
    F = e.return;
  }
}
function bh(t) {
  for (; F !== null; ) {
    var e = F;
    if (e === t) {
      F = null;
      break;
    }
    var n = e.sibling;
    if (n !== null) {
      (n.return = e.return), (F = n);
      break;
    }
    F = e.return;
  }
}
function $h(t) {
  for (; F !== null; ) {
    var e = F;
    try {
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          var n = e.return;
          try {
            bu(4, e);
          } catch (a) {
            Le(e, n, a);
          }
          break;
        case 1:
          var r = e.stateNode;
          if (typeof r.componentDidMount == "function") {
            var i = e.return;
            try {
              r.componentDidMount();
            } catch (a) {
              Le(e, i, a);
            }
          }
          var o = e.return;
          try {
            Of(e);
          } catch (a) {
            Le(e, o, a);
          }
          break;
        case 5:
          var l = e.return;
          try {
            Of(e);
          } catch (a) {
            Le(e, l, a);
          }
      }
    } catch (a) {
      Le(e, e.return, a);
    }
    if (e === t) {
      F = null;
      break;
    }
    var s = e.sibling;
    if (s !== null) {
      (s.return = e.return), (F = s);
      break;
    }
    F = e.return;
  }
}
var tx = Math.ceil,
  cu = Rr.ReactCurrentDispatcher,
  Xd = Rr.ReactCurrentOwner,
  Cn = Rr.ReactCurrentBatchConfig,
  le = 0,
  rt = null,
  We = null,
  ut = 0,
  tn = 0,
  No = hi(0),
  Ke = 0,
  _s = null,
  Xi = 0,
  $u = 0,
  Qd = 0,
  Vl = null,
  Bt = null,
  Gd = 0,
  Ko = 1 / 0,
  fr = null,
  fu = !1,
  zf = null,
  ti = null,
  ia = !1,
  Hr = null,
  du = 0,
  Hl = 0,
  Df = null,
  Ma = -1,
  La = 0;
function Ft() {
  return le & 6 ? be() : Ma !== -1 ? Ma : (Ma = be());
}
function ni(t) {
  return t.mode & 1
    ? le & 2 && ut !== 0
      ? ut & -ut
      : I_.transition !== null
      ? (La === 0 && (La = wm()), La)
      : ((t = ce),
        t !== 0 || ((t = window.event), (t = t === void 0 ? 16 : Nm(t.type))),
        t)
    : 1;
}
function Un(t, e, n, r) {
  if (50 < Hl) throw ((Hl = 0), (Df = null), Error(L(185)));
  Ms(t, n, r),
    (!(le & 2) || t !== rt) &&
      (t === rt && (!(le & 2) && ($u |= n), Ke === 4 && Ur(t, ut)),
      Wt(t, r),
      n === 1 && le === 0 && !(e.mode & 1) && ((Ko = be() + 500), Fu && mi()));
}
function Wt(t, e) {
  var n = t.callbackNode;
  Iy(t, e);
  var r = Ga(t, t === rt ? ut : 0);
  if (r === 0)
    n !== null && Gp(n), (t.callbackNode = null), (t.callbackPriority = 0);
  else if (((e = r & -r), t.callbackPriority !== e)) {
    if ((n != null && Gp(n), e === 1))
      t.tag === 0 ? A_(Bh.bind(null, t)) : Xm(Bh.bind(null, t)),
        z_(function () {
          !(le & 6) && mi();
        }),
        (n = null);
    else {
      switch (Sm(r)) {
        case 1:
          n = wd;
          break;
        case 4:
          n = _m;
          break;
        case 16:
          n = Qa;
          break;
        case 536870912:
          n = xm;
          break;
        default:
          n = Qa;
      }
      n = Wg(n, Ig.bind(null, t));
    }
    (t.callbackPriority = e), (t.callbackNode = n);
  }
}
function Ig(t, e) {
  if (((Ma = -1), (La = 0), le & 6)) throw Error(L(327));
  var n = t.callbackNode;
  if (Ao() && t.callbackNode !== n) return null;
  var r = Ga(t, t === rt ? ut : 0);
  if (r === 0) return null;
  if (r & 30 || r & t.expiredLanes || e) e = pu(t, r);
  else {
    e = r;
    var i = le;
    le |= 2;
    var o = $g();
    (rt !== t || ut !== e) && ((fr = null), (Ko = be() + 500), ji(t, e));
    do
      try {
        ix();
        break;
      } catch (s) {
        bg(t, s);
      }
    while (!0);
    Dd(),
      (cu.current = o),
      (le = i),
      We !== null ? (e = 0) : ((rt = null), (ut = 0), (e = Ke));
  }
  if (e !== 0) {
    if (
      (e === 2 && ((i = sf(t)), i !== 0 && ((r = i), (e = jf(t, i)))), e === 1)
    )
      throw ((n = _s), ji(t, 0), Ur(t, r), Wt(t, be()), n);
    if (e === 6) Ur(t, r);
    else {
      if (
        ((i = t.current.alternate),
        !(r & 30) &&
          !nx(i) &&
          ((e = pu(t, r)),
          e === 2 && ((o = sf(t)), o !== 0 && ((r = o), (e = jf(t, o)))),
          e === 1))
      )
        throw ((n = _s), ji(t, 0), Ur(t, r), Wt(t, be()), n);
      switch (((t.finishedWork = i), (t.finishedLanes = r), e)) {
        case 0:
        case 1:
          throw Error(L(345));
        case 2:
          Ei(t, Bt, fr);
          break;
        case 3:
          if (
            (Ur(t, r), (r & 130023424) === r && ((e = Gd + 500 - be()), 10 < e))
          ) {
            if (Ga(t, 0) !== 0) break;
            if (((i = t.suspendedLanes), (i & r) !== r)) {
              Ft(), (t.pingedLanes |= t.suspendedLanes & i);
              break;
            }
            t.timeoutHandle = mf(Ei.bind(null, t, Bt, fr), e);
            break;
          }
          Ei(t, Bt, fr);
          break;
        case 4:
          if ((Ur(t, r), (r & 4194240) === r)) break;
          for (e = t.eventTimes, i = -1; 0 < r; ) {
            var l = 31 - Bn(r);
            (o = 1 << l), (l = e[l]), l > i && (i = l), (r &= ~o);
          }
          if (
            ((r = i),
            (r = be() - r),
            (r =
              (120 > r
                ? 120
                : 480 > r
                ? 480
                : 1080 > r
                ? 1080
                : 1920 > r
                ? 1920
                : 3e3 > r
                ? 3e3
                : 4320 > r
                ? 4320
                : 1960 * tx(r / 1960)) - r),
            10 < r)
          ) {
            t.timeoutHandle = mf(Ei.bind(null, t, Bt, fr), r);
            break;
          }
          Ei(t, Bt, fr);
          break;
        case 5:
          Ei(t, Bt, fr);
          break;
        default:
          throw Error(L(329));
      }
    }
  }
  return Wt(t, be()), t.callbackNode === n ? Ig.bind(null, t) : null;
}
function jf(t, e) {
  var n = Vl;
  return (
    t.current.memoizedState.isDehydrated && (ji(t, e).flags |= 256),
    (t = pu(t, e)),
    t !== 2 && ((e = Bt), (Bt = n), e !== null && Ff(e)),
    t
  );
}
function Ff(t) {
  Bt === null ? (Bt = t) : Bt.push.apply(Bt, t);
}
function nx(t) {
  for (var e = t; ; ) {
    if (e.flags & 16384) {
      var n = e.updateQueue;
      if (n !== null && ((n = n.stores), n !== null))
        for (var r = 0; r < n.length; r++) {
          var i = n[r],
            o = i.getSnapshot;
          i = i.value;
          try {
            if (!Vn(o(), i)) return !1;
          } catch {
            return !1;
          }
        }
    }
    if (((n = e.child), e.subtreeFlags & 16384 && n !== null))
      (n.return = e), (e = n);
    else {
      if (e === t) break;
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) return !0;
        e = e.return;
      }
      (e.sibling.return = e.return), (e = e.sibling);
    }
  }
  return !0;
}
function Ur(t, e) {
  for (
    e &= ~Qd,
      e &= ~$u,
      t.suspendedLanes |= e,
      t.pingedLanes &= ~e,
      t = t.expirationTimes;
    0 < e;

  ) {
    var n = 31 - Bn(e),
      r = 1 << n;
    (t[n] = -1), (e &= ~r);
  }
}
function Bh(t) {
  if (le & 6) throw Error(L(327));
  Ao();
  var e = Ga(t, 0);
  if (!(e & 1)) return Wt(t, be()), null;
  var n = pu(t, e);
  if (t.tag !== 0 && n === 2) {
    var r = sf(t);
    r !== 0 && ((e = r), (n = jf(t, r)));
  }
  if (n === 1) throw ((n = _s), ji(t, 0), Ur(t, e), Wt(t, be()), n);
  if (n === 6) throw Error(L(345));
  return (
    (t.finishedWork = t.current.alternate),
    (t.finishedLanes = e),
    Ei(t, Bt, fr),
    Wt(t, be()),
    null
  );
}
function Kd(t, e) {
  var n = le;
  le |= 1;
  try {
    return t(e);
  } finally {
    (le = n), le === 0 && ((Ko = be() + 500), Fu && mi());
  }
}
function Qi(t) {
  Hr !== null && Hr.tag === 0 && !(le & 6) && Ao();
  var e = le;
  le |= 1;
  var n = Cn.transition,
    r = ce;
  try {
    if (((Cn.transition = null), (ce = 1), t)) return t();
  } finally {
    (ce = r), (Cn.transition = n), (le = e), !(le & 6) && mi();
  }
}
function qd() {
  (tn = No.current), ye(No);
}
function ji(t, e) {
  (t.finishedWork = null), (t.finishedLanes = 0);
  var n = t.timeoutHandle;
  if ((n !== -1 && ((t.timeoutHandle = -1), L_(n)), We !== null))
    for (n = We.return; n !== null; ) {
      var r = n;
      switch ((Md(r), r.tag)) {
        case 1:
          (r = r.type.childContextTypes), r != null && eu();
          break;
        case 3:
          Qo(), ye(Vt), ye(Ct), $d();
          break;
        case 5:
          bd(r);
          break;
        case 4:
          Qo();
          break;
        case 13:
          ye(Ee);
          break;
        case 19:
          ye(Ee);
          break;
        case 10:
          jd(r.type._context);
          break;
        case 22:
        case 23:
          qd();
      }
      n = n.return;
    }
  if (
    ((rt = t),
    (We = t = ri(t.current, null)),
    (ut = tn = e),
    (Ke = 0),
    (_s = null),
    (Qd = $u = Xi = 0),
    (Bt = Vl = null),
    Oi !== null)
  ) {
    for (e = 0; e < Oi.length; e++)
      if (((n = Oi[e]), (r = n.interleaved), r !== null)) {
        n.interleaved = null;
        var i = r.next,
          o = n.pending;
        if (o !== null) {
          var l = o.next;
          (o.next = i), (r.next = l);
        }
        n.pending = r;
      }
    Oi = null;
  }
  return t;
}
function bg(t, e) {
  do {
    var n = We;
    try {
      if ((Dd(), (Na.current = uu), au)) {
        for (var r = Ne.memoizedState; r !== null; ) {
          var i = r.queue;
          i !== null && (i.pending = null), (r = r.next);
        }
        au = !1;
      }
      if (
        ((Yi = 0),
        (tt = Qe = Ne = null),
        (Bl = !1),
        (gs = 0),
        (Xd.current = null),
        n === null || n.return === null)
      ) {
        (Ke = 1), (_s = e), (We = null);
        break;
      }
      e: {
        var o = t,
          l = n.return,
          s = n,
          a = e;
        if (
          ((e = ut),
          (s.flags |= 32768),
          a !== null && typeof a == "object" && typeof a.then == "function")
        ) {
          var u = a,
            c = s,
            f = c.tag;
          if (!(c.mode & 1) && (f === 0 || f === 11 || f === 15)) {
            var d = c.alternate;
            d
              ? ((c.updateQueue = d.updateQueue),
                (c.memoizedState = d.memoizedState),
                (c.lanes = d.lanes))
              : ((c.updateQueue = null), (c.memoizedState = null));
          }
          var p = Nh(l);
          if (p !== null) {
            (p.flags &= -257),
              Rh(p, l, s, o, e),
              p.mode & 1 && Th(o, u, e),
              (e = p),
              (a = u);
            var v = e.updateQueue;
            if (v === null) {
              var m = new Set();
              m.add(a), (e.updateQueue = m);
            } else v.add(a);
            break e;
          } else {
            if (!(e & 1)) {
              Th(o, u, e), Jd();
              break e;
            }
            a = Error(L(426));
          }
        } else if (xe && s.mode & 1) {
          var x = Nh(l);
          if (x !== null) {
            !(x.flags & 65536) && (x.flags |= 256),
              Rh(x, l, s, o, e),
              Ld(Go(a, s));
            break e;
          }
        }
        (o = a = Go(a, s)),
          Ke !== 4 && (Ke = 2),
          Vl === null ? (Vl = [o]) : Vl.push(o),
          (o = l);
        do {
          switch (o.tag) {
            case 3:
              (o.flags |= 65536), (e &= -e), (o.lanes |= e);
              var g = Sg(o, a, e);
              wh(o, g);
              break e;
            case 1:
              s = a;
              var h = o.type,
                y = o.stateNode;
              if (
                !(o.flags & 128) &&
                (typeof h.getDerivedStateFromError == "function" ||
                  (y !== null &&
                    typeof y.componentDidCatch == "function" &&
                    (ti === null || !ti.has(y))))
              ) {
                (o.flags |= 65536), (e &= -e), (o.lanes |= e);
                var _ = kg(o, s, e);
                wh(o, _);
                break e;
              }
          }
          o = o.return;
        } while (o !== null);
      }
      Ug(n);
    } catch (k) {
      (e = k), We === n && n !== null && (We = n = n.return);
      continue;
    }
    break;
  } while (!0);
}
function $g() {
  var t = cu.current;
  return (cu.current = uu), t === null ? uu : t;
}
function Jd() {
  (Ke === 0 || Ke === 3 || Ke === 2) && (Ke = 4),
    rt === null || (!(Xi & 268435455) && !($u & 268435455)) || Ur(rt, ut);
}
function pu(t, e) {
  var n = le;
  le |= 2;
  var r = $g();
  (rt !== t || ut !== e) && ((fr = null), ji(t, e));
  do
    try {
      rx();
      break;
    } catch (i) {
      bg(t, i);
    }
  while (!0);
  if ((Dd(), (le = n), (cu.current = r), We !== null)) throw Error(L(261));
  return (rt = null), (ut = 0), Ke;
}
function rx() {
  for (; We !== null; ) Bg(We);
}
function ix() {
  for (; We !== null && !Ry(); ) Bg(We);
}
function Bg(t) {
  var e = Hg(t.alternate, t, tn);
  (t.memoizedProps = t.pendingProps),
    e === null ? Ug(t) : (We = e),
    (Xd.current = null);
}
function Ug(t) {
  var e = t;
  do {
    var n = e.alternate;
    if (((t = e.return), e.flags & 32768)) {
      if (((n = q_(n, e)), n !== null)) {
        (n.flags &= 32767), (We = n);
        return;
      }
      if (t !== null)
        (t.flags |= 32768), (t.subtreeFlags = 0), (t.deletions = null);
      else {
        (Ke = 6), (We = null);
        return;
      }
    } else if (((n = K_(n, e, tn)), n !== null)) {
      We = n;
      return;
    }
    if (((e = e.sibling), e !== null)) {
      We = e;
      return;
    }
    We = e = t;
  } while (e !== null);
  Ke === 0 && (Ke = 5);
}
function Ei(t, e, n) {
  var r = ce,
    i = Cn.transition;
  try {
    (Cn.transition = null), (ce = 1), ox(t, e, n, r);
  } finally {
    (Cn.transition = i), (ce = r);
  }
  return null;
}
function ox(t, e, n, r) {
  do Ao();
  while (Hr !== null);
  if (le & 6) throw Error(L(327));
  n = t.finishedWork;
  var i = t.finishedLanes;
  if (n === null) return null;
  if (((t.finishedWork = null), (t.finishedLanes = 0), n === t.current))
    throw Error(L(177));
  (t.callbackNode = null), (t.callbackPriority = 0);
  var o = n.lanes | n.childLanes;
  if (
    (by(t, o),
    t === rt && ((We = rt = null), (ut = 0)),
    (!(n.subtreeFlags & 2064) && !(n.flags & 2064)) ||
      ia ||
      ((ia = !0),
      Wg(Qa, function () {
        return Ao(), null;
      })),
    (o = (n.flags & 15990) !== 0),
    n.subtreeFlags & 15990 || o)
  ) {
    (o = Cn.transition), (Cn.transition = null);
    var l = ce;
    ce = 1;
    var s = le;
    (le |= 4),
      (Xd.current = null),
      Z_(t, n),
      Fg(n, t),
      E_(pf),
      (Ka = !!df),
      (pf = df = null),
      (t.current = n),
      ex(n),
      Oy(),
      (le = s),
      (ce = l),
      (Cn.transition = o);
  } else t.current = n;
  if (
    (ia && ((ia = !1), (Hr = t), (du = i)),
    (o = t.pendingLanes),
    o === 0 && (ti = null),
    zy(n.stateNode),
    Wt(t, be()),
    e !== null)
  )
    for (r = t.onRecoverableError, n = 0; n < e.length; n++)
      (i = e[n]), r(i.value, { componentStack: i.stack, digest: i.digest });
  if (fu) throw ((fu = !1), (t = zf), (zf = null), t);
  return (
    du & 1 && t.tag !== 0 && Ao(),
    (o = t.pendingLanes),
    o & 1 ? (t === Df ? Hl++ : ((Hl = 0), (Df = t))) : (Hl = 0),
    mi(),
    null
  );
}
function Ao() {
  if (Hr !== null) {
    var t = Sm(du),
      e = Cn.transition,
      n = ce;
    try {
      if (((Cn.transition = null), (ce = 16 > t ? 16 : t), Hr === null))
        var r = !1;
      else {
        if (((t = Hr), (Hr = null), (du = 0), le & 6)) throw Error(L(331));
        var i = le;
        for (le |= 4, F = t.current; F !== null; ) {
          var o = F,
            l = o.child;
          if (F.flags & 16) {
            var s = o.deletions;
            if (s !== null) {
              for (var a = 0; a < s.length; a++) {
                var u = s[a];
                for (F = u; F !== null; ) {
                  var c = F;
                  switch (c.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Ul(8, c, o);
                  }
                  var f = c.child;
                  if (f !== null) (f.return = c), (F = f);
                  else
                    for (; F !== null; ) {
                      c = F;
                      var d = c.sibling,
                        p = c.return;
                      if ((zg(c), c === u)) {
                        F = null;
                        break;
                      }
                      if (d !== null) {
                        (d.return = p), (F = d);
                        break;
                      }
                      F = p;
                    }
                }
              }
              var v = o.alternate;
              if (v !== null) {
                var m = v.child;
                if (m !== null) {
                  v.child = null;
                  do {
                    var x = m.sibling;
                    (m.sibling = null), (m = x);
                  } while (m !== null);
                }
              }
              F = o;
            }
          }
          if (o.subtreeFlags & 2064 && l !== null) (l.return = o), (F = l);
          else
            e: for (; F !== null; ) {
              if (((o = F), o.flags & 2048))
                switch (o.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Ul(9, o, o.return);
                }
              var g = o.sibling;
              if (g !== null) {
                (g.return = o.return), (F = g);
                break e;
              }
              F = o.return;
            }
        }
        var h = t.current;
        for (F = h; F !== null; ) {
          l = F;
          var y = l.child;
          if (l.subtreeFlags & 2064 && y !== null) (y.return = l), (F = y);
          else
            e: for (l = h; F !== null; ) {
              if (((s = F), s.flags & 2048))
                try {
                  switch (s.tag) {
                    case 0:
                    case 11:
                    case 15:
                      bu(9, s);
                  }
                } catch (k) {
                  Le(s, s.return, k);
                }
              if (s === l) {
                F = null;
                break e;
              }
              var _ = s.sibling;
              if (_ !== null) {
                (_.return = s.return), (F = _);
                break e;
              }
              F = s.return;
            }
        }
        if (
          ((le = i), mi(), tr && typeof tr.onPostCommitFiberRoot == "function")
        )
          try {
            tr.onPostCommitFiberRoot(Mu, t);
          } catch {}
        r = !0;
      }
      return r;
    } finally {
      (ce = n), (Cn.transition = e);
    }
  }
  return !1;
}
function Uh(t, e, n) {
  (e = Go(n, e)),
    (e = Sg(t, e, 1)),
    (t = ei(t, e, 1)),
    (e = Ft()),
    t !== null && (Ms(t, 1, e), Wt(t, e));
}
function Le(t, e, n) {
  if (t.tag === 3) Uh(t, t, n);
  else
    for (; e !== null; ) {
      if (e.tag === 3) {
        Uh(e, t, n);
        break;
      } else if (e.tag === 1) {
        var r = e.stateNode;
        if (
          typeof e.type.getDerivedStateFromError == "function" ||
          (typeof r.componentDidCatch == "function" &&
            (ti === null || !ti.has(r)))
        ) {
          (t = Go(n, t)),
            (t = kg(e, t, 1)),
            (e = ei(e, t, 1)),
            (t = Ft()),
            e !== null && (Ms(e, 1, t), Wt(e, t));
          break;
        }
      }
      e = e.return;
    }
}
function lx(t, e, n) {
  var r = t.pingCache;
  r !== null && r.delete(e),
    (e = Ft()),
    (t.pingedLanes |= t.suspendedLanes & n),
    rt === t &&
      (ut & n) === n &&
      (Ke === 4 || (Ke === 3 && (ut & 130023424) === ut && 500 > be() - Gd)
        ? ji(t, 0)
        : (Qd |= n)),
    Wt(t, e);
}
function Vg(t, e) {
  e === 0 &&
    (t.mode & 1
      ? ((e = Qs), (Qs <<= 1), !(Qs & 130023424) && (Qs = 4194304))
      : (e = 1));
  var n = Ft();
  (t = Cr(t, e)), t !== null && (Ms(t, e, n), Wt(t, n));
}
function sx(t) {
  var e = t.memoizedState,
    n = 0;
  e !== null && (n = e.retryLane), Vg(t, n);
}
function ax(t, e) {
  var n = 0;
  switch (t.tag) {
    case 13:
      var r = t.stateNode,
        i = t.memoizedState;
      i !== null && (n = i.retryLane);
      break;
    case 19:
      r = t.stateNode;
      break;
    default:
      throw Error(L(314));
  }
  r !== null && r.delete(e), Vg(t, n);
}
var Hg;
Hg = function (t, e, n) {
  if (t !== null)
    if (t.memoizedProps !== e.pendingProps || Vt.current) Ut = !0;
    else {
      if (!(t.lanes & n) && !(e.flags & 128)) return (Ut = !1), G_(t, e, n);
      Ut = !!(t.flags & 131072);
    }
  else (Ut = !1), xe && e.flags & 1048576 && Qm(e, ru, e.index);
  switch (((e.lanes = 0), e.tag)) {
    case 2:
      var r = e.type;
      Oa(t, e), (t = e.pendingProps);
      var i = Wo(e, Ct.current);
      Fo(e, n), (i = Ud(null, e, r, t, i, n));
      var o = Vd();
      return (
        (e.flags |= 1),
        typeof i == "object" &&
        i !== null &&
        typeof i.render == "function" &&
        i.$$typeof === void 0
          ? ((e.tag = 1),
            (e.memoizedState = null),
            (e.updateQueue = null),
            Ht(r) ? ((o = !0), tu(e)) : (o = !1),
            (e.memoizedState =
              i.state !== null && i.state !== void 0 ? i.state : null),
            Ad(e),
            (i.updater = Iu),
            (e.stateNode = i),
            (i._reactInternals = e),
            Sf(e, r, t, n),
            (e = Ef(null, e, r, !0, o, n)))
          : ((e.tag = 0), xe && o && Od(e), Ot(null, e, i, n), (e = e.child)),
        e
      );
    case 16:
      r = e.elementType;
      e: {
        switch (
          (Oa(t, e),
          (t = e.pendingProps),
          (i = r._init),
          (r = i(r._payload)),
          (e.type = r),
          (i = e.tag = cx(r)),
          (t = An(r, t)),
          i)
        ) {
          case 0:
            e = Cf(null, e, r, t, n);
            break e;
          case 1:
            e = Lh(null, e, r, t, n);
            break e;
          case 11:
            e = Oh(null, e, r, t, n);
            break e;
          case 14:
            e = Mh(null, e, r, An(r.type, t), n);
            break e;
        }
        throw Error(L(306, r, ""));
      }
      return e;
    case 0:
      return (
        (r = e.type),
        (i = e.pendingProps),
        (i = e.elementType === r ? i : An(r, i)),
        Cf(t, e, r, i, n)
      );
    case 1:
      return (
        (r = e.type),
        (i = e.pendingProps),
        (i = e.elementType === r ? i : An(r, i)),
        Lh(t, e, r, i, n)
      );
    case 3:
      e: {
        if ((Tg(e), t === null)) throw Error(L(387));
        (r = e.pendingProps),
          (o = e.memoizedState),
          (i = o.element),
          eg(t, e),
          lu(e, r, null, n);
        var l = e.memoizedState;
        if (((r = l.element), o.isDehydrated))
          if (
            ((o = {
              element: r,
              isDehydrated: !1,
              cache: l.cache,
              pendingSuspenseBoundaries: l.pendingSuspenseBoundaries,
              transitions: l.transitions,
            }),
            (e.updateQueue.baseState = o),
            (e.memoizedState = o),
            e.flags & 256)
          ) {
            (i = Go(Error(L(423)), e)), (e = zh(t, e, r, n, i));
            break e;
          } else if (r !== i) {
            (i = Go(Error(L(424)), e)), (e = zh(t, e, r, n, i));
            break e;
          } else
            for (
              sn = Zr(e.stateNode.containerInfo.firstChild),
                un = e,
                xe = !0,
                bn = null,
                n = Jm(e, null, r, n),
                e.child = n;
              n;

            )
              (n.flags = (n.flags & -3) | 4096), (n = n.sibling);
        else {
          if ((Yo(), r === i)) {
            e = Er(t, e, n);
            break e;
          }
          Ot(t, e, r, n);
        }
        e = e.child;
      }
      return e;
    case 5:
      return (
        tg(e),
        t === null && _f(e),
        (r = e.type),
        (i = e.pendingProps),
        (o = t !== null ? t.memoizedProps : null),
        (l = i.children),
        hf(r, i) ? (l = null) : o !== null && hf(r, o) && (e.flags |= 32),
        Pg(t, e),
        Ot(t, e, l, n),
        e.child
      );
    case 6:
      return t === null && _f(e), null;
    case 13:
      return Ng(t, e, n);
    case 4:
      return (
        Id(e, e.stateNode.containerInfo),
        (r = e.pendingProps),
        t === null ? (e.child = Xo(e, null, r, n)) : Ot(t, e, r, n),
        e.child
      );
    case 11:
      return (
        (r = e.type),
        (i = e.pendingProps),
        (i = e.elementType === r ? i : An(r, i)),
        Oh(t, e, r, i, n)
      );
    case 7:
      return Ot(t, e, e.pendingProps, n), e.child;
    case 8:
      return Ot(t, e, e.pendingProps.children, n), e.child;
    case 12:
      return Ot(t, e, e.pendingProps.children, n), e.child;
    case 10:
      e: {
        if (
          ((r = e.type._context),
          (i = e.pendingProps),
          (o = e.memoizedProps),
          (l = i.value),
          he(iu, r._currentValue),
          (r._currentValue = l),
          o !== null)
        )
          if (Vn(o.value, l)) {
            if (o.children === i.children && !Vt.current) {
              e = Er(t, e, n);
              break e;
            }
          } else
            for (o = e.child, o !== null && (o.return = e); o !== null; ) {
              var s = o.dependencies;
              if (s !== null) {
                l = o.child;
                for (var a = s.firstContext; a !== null; ) {
                  if (a.context === r) {
                    if (o.tag === 1) {
                      (a = _r(-1, n & -n)), (a.tag = 2);
                      var u = o.updateQueue;
                      if (u !== null) {
                        u = u.shared;
                        var c = u.pending;
                        c === null
                          ? (a.next = a)
                          : ((a.next = c.next), (c.next = a)),
                          (u.pending = a);
                      }
                    }
                    (o.lanes |= n),
                      (a = o.alternate),
                      a !== null && (a.lanes |= n),
                      xf(o.return, n, e),
                      (s.lanes |= n);
                    break;
                  }
                  a = a.next;
                }
              } else if (o.tag === 10) l = o.type === e.type ? null : o.child;
              else if (o.tag === 18) {
                if (((l = o.return), l === null)) throw Error(L(341));
                (l.lanes |= n),
                  (s = l.alternate),
                  s !== null && (s.lanes |= n),
                  xf(l, n, e),
                  (l = o.sibling);
              } else l = o.child;
              if (l !== null) l.return = o;
              else
                for (l = o; l !== null; ) {
                  if (l === e) {
                    l = null;
                    break;
                  }
                  if (((o = l.sibling), o !== null)) {
                    (o.return = l.return), (l = o);
                    break;
                  }
                  l = l.return;
                }
              o = l;
            }
        Ot(t, e, i.children, n), (e = e.child);
      }
      return e;
    case 9:
      return (
        (i = e.type),
        (r = e.pendingProps.children),
        Fo(e, n),
        (i = Pn(i)),
        (r = r(i)),
        (e.flags |= 1),
        Ot(t, e, r, n),
        e.child
      );
    case 14:
      return (
        (r = e.type),
        (i = An(r, e.pendingProps)),
        (i = An(r.type, i)),
        Mh(t, e, r, i, n)
      );
    case 15:
      return Cg(t, e, e.type, e.pendingProps, n);
    case 17:
      return (
        (r = e.type),
        (i = e.pendingProps),
        (i = e.elementType === r ? i : An(r, i)),
        Oa(t, e),
        (e.tag = 1),
        Ht(r) ? ((t = !0), tu(e)) : (t = !1),
        Fo(e, n),
        wg(e, r, i),
        Sf(e, r, i, n),
        Ef(null, e, r, !0, t, n)
      );
    case 19:
      return Rg(t, e, n);
    case 22:
      return Eg(t, e, n);
  }
  throw Error(L(156, e.tag));
};
function Wg(t, e) {
  return ym(t, e);
}
function ux(t, e, n, r) {
  (this.tag = t),
    (this.key = n),
    (this.sibling =
      this.child =
      this.return =
      this.stateNode =
      this.type =
      this.elementType =
        null),
    (this.index = 0),
    (this.ref = null),
    (this.pendingProps = e),
    (this.dependencies =
      this.memoizedState =
      this.updateQueue =
      this.memoizedProps =
        null),
    (this.mode = r),
    (this.subtreeFlags = this.flags = 0),
    (this.deletions = null),
    (this.childLanes = this.lanes = 0),
    (this.alternate = null);
}
function wn(t, e, n, r) {
  return new ux(t, e, n, r);
}
function Zd(t) {
  return (t = t.prototype), !(!t || !t.isReactComponent);
}
function cx(t) {
  if (typeof t == "function") return Zd(t) ? 1 : 0;
  if (t != null) {
    if (((t = t.$$typeof), t === yd)) return 11;
    if (t === _d) return 14;
  }
  return 2;
}
function ri(t, e) {
  var n = t.alternate;
  return (
    n === null
      ? ((n = wn(t.tag, e, t.key, t.mode)),
        (n.elementType = t.elementType),
        (n.type = t.type),
        (n.stateNode = t.stateNode),
        (n.alternate = t),
        (t.alternate = n))
      : ((n.pendingProps = e),
        (n.type = t.type),
        (n.flags = 0),
        (n.subtreeFlags = 0),
        (n.deletions = null)),
    (n.flags = t.flags & 14680064),
    (n.childLanes = t.childLanes),
    (n.lanes = t.lanes),
    (n.child = t.child),
    (n.memoizedProps = t.memoizedProps),
    (n.memoizedState = t.memoizedState),
    (n.updateQueue = t.updateQueue),
    (e = t.dependencies),
    (n.dependencies =
      e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }),
    (n.sibling = t.sibling),
    (n.index = t.index),
    (n.ref = t.ref),
    n
  );
}
function za(t, e, n, r, i, o) {
  var l = 2;
  if (((r = t), typeof t == "function")) Zd(t) && (l = 1);
  else if (typeof t == "string") l = 5;
  else
    e: switch (t) {
      case yo:
        return Fi(n.children, i, o, e);
      case vd:
        (l = 8), (i |= 8);
        break;
      case Wc:
        return (
          (t = wn(12, n, e, i | 2)), (t.elementType = Wc), (t.lanes = o), t
        );
      case Yc:
        return (t = wn(13, n, e, i)), (t.elementType = Yc), (t.lanes = o), t;
      case Xc:
        return (t = wn(19, n, e, i)), (t.elementType = Xc), (t.lanes = o), t;
      case tm:
        return Bu(n, i, o, e);
      default:
        if (typeof t == "object" && t !== null)
          switch (t.$$typeof) {
            case Z0:
              l = 10;
              break e;
            case em:
              l = 9;
              break e;
            case yd:
              l = 11;
              break e;
            case _d:
              l = 14;
              break e;
            case br:
              (l = 16), (r = null);
              break e;
          }
        throw Error(L(130, t == null ? t : typeof t, ""));
    }
  return (
    (e = wn(l, n, e, i)), (e.elementType = t), (e.type = r), (e.lanes = o), e
  );
}
function Fi(t, e, n, r) {
  return (t = wn(7, t, r, e)), (t.lanes = n), t;
}
function Bu(t, e, n, r) {
  return (
    (t = wn(22, t, r, e)),
    (t.elementType = tm),
    (t.lanes = n),
    (t.stateNode = { isHidden: !1 }),
    t
  );
}
function kc(t, e, n) {
  return (t = wn(6, t, null, e)), (t.lanes = n), t;
}
function Cc(t, e, n) {
  return (
    (e = wn(4, t.children !== null ? t.children : [], t.key, e)),
    (e.lanes = n),
    (e.stateNode = {
      containerInfo: t.containerInfo,
      pendingChildren: null,
      implementation: t.implementation,
    }),
    e
  );
}
function fx(t, e, n, r, i) {
  (this.tag = e),
    (this.containerInfo = t),
    (this.finishedWork =
      this.pingCache =
      this.current =
      this.pendingChildren =
        null),
    (this.timeoutHandle = -1),
    (this.callbackNode = this.pendingContext = this.context = null),
    (this.callbackPriority = 0),
    (this.eventTimes = ic(0)),
    (this.expirationTimes = ic(-1)),
    (this.entangledLanes =
      this.finishedLanes =
      this.mutableReadLanes =
      this.expiredLanes =
      this.pingedLanes =
      this.suspendedLanes =
      this.pendingLanes =
        0),
    (this.entanglements = ic(0)),
    (this.identifierPrefix = r),
    (this.onRecoverableError = i),
    (this.mutableSourceEagerHydrationData = null);
}
function ep(t, e, n, r, i, o, l, s, a) {
  return (
    (t = new fx(t, e, n, s, a)),
    e === 1 ? ((e = 1), o === !0 && (e |= 8)) : (e = 0),
    (o = wn(3, null, null, e)),
    (t.current = o),
    (o.stateNode = t),
    (o.memoizedState = {
      element: r,
      isDehydrated: n,
      cache: null,
      transitions: null,
      pendingSuspenseBoundaries: null,
    }),
    Ad(o),
    t
  );
}
function dx(t, e, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: vo,
    key: r == null ? null : "" + r,
    children: t,
    containerInfo: e,
    implementation: n,
  };
}
function Yg(t) {
  if (!t) return ai;
  t = t._reactInternals;
  e: {
    if (to(t) !== t || t.tag !== 1) throw Error(L(170));
    var e = t;
    do {
      switch (e.tag) {
        case 3:
          e = e.stateNode.context;
          break e;
        case 1:
          if (Ht(e.type)) {
            e = e.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      e = e.return;
    } while (e !== null);
    throw Error(L(171));
  }
  if (t.tag === 1) {
    var n = t.type;
    if (Ht(n)) return Ym(t, n, e);
  }
  return e;
}
function Xg(t, e, n, r, i, o, l, s, a) {
  return (
    (t = ep(n, r, !0, t, i, o, l, s, a)),
    (t.context = Yg(null)),
    (n = t.current),
    (r = Ft()),
    (i = ni(n)),
    (o = _r(r, i)),
    (o.callback = e ?? null),
    ei(n, o, i),
    (t.current.lanes = i),
    Ms(t, i, r),
    Wt(t, r),
    t
  );
}
function Uu(t, e, n, r) {
  var i = e.current,
    o = Ft(),
    l = ni(i);
  return (
    (n = Yg(n)),
    e.context === null ? (e.context = n) : (e.pendingContext = n),
    (e = _r(o, l)),
    (e.payload = { element: t }),
    (r = r === void 0 ? null : r),
    r !== null && (e.callback = r),
    (t = ei(i, e, l)),
    t !== null && (Un(t, i, l, o), Ta(t, i, l)),
    l
  );
}
function hu(t) {
  if (((t = t.current), !t.child)) return null;
  switch (t.child.tag) {
    case 5:
      return t.child.stateNode;
    default:
      return t.child.stateNode;
  }
}
function Vh(t, e) {
  if (((t = t.memoizedState), t !== null && t.dehydrated !== null)) {
    var n = t.retryLane;
    t.retryLane = n !== 0 && n < e ? n : e;
  }
}
function tp(t, e) {
  Vh(t, e), (t = t.alternate) && Vh(t, e);
}
function px() {
  return null;
}
var Qg =
  typeof reportError == "function"
    ? reportError
    : function (t) {
        console.error(t);
      };
function np(t) {
  this._internalRoot = t;
}
Vu.prototype.render = np.prototype.render = function (t) {
  var e = this._internalRoot;
  if (e === null) throw Error(L(409));
  Uu(t, e, null, null);
};
Vu.prototype.unmount = np.prototype.unmount = function () {
  var t = this._internalRoot;
  if (t !== null) {
    this._internalRoot = null;
    var e = t.containerInfo;
    Qi(function () {
      Uu(null, t, null, null);
    }),
      (e[kr] = null);
  }
};
function Vu(t) {
  this._internalRoot = t;
}
Vu.prototype.unstable_scheduleHydration = function (t) {
  if (t) {
    var e = Em();
    t = { blockedOn: null, target: t, priority: e };
    for (var n = 0; n < Br.length && e !== 0 && e < Br[n].priority; n++);
    Br.splice(n, 0, t), n === 0 && Tm(t);
  }
};
function rp(t) {
  return !(!t || (t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11));
}
function Hu(t) {
  return !(
    !t ||
    (t.nodeType !== 1 &&
      t.nodeType !== 9 &&
      t.nodeType !== 11 &&
      (t.nodeType !== 8 || t.nodeValue !== " react-mount-point-unstable "))
  );
}
function Hh() {}
function hx(t, e, n, r, i) {
  if (i) {
    if (typeof r == "function") {
      var o = r;
      r = function () {
        var u = hu(l);
        o.call(u);
      };
    }
    var l = Xg(e, r, t, 0, null, !1, !1, "", Hh);
    return (
      (t._reactRootContainer = l),
      (t[kr] = l.current),
      fs(t.nodeType === 8 ? t.parentNode : t),
      Qi(),
      l
    );
  }
  for (; (i = t.lastChild); ) t.removeChild(i);
  if (typeof r == "function") {
    var s = r;
    r = function () {
      var u = hu(a);
      s.call(u);
    };
  }
  var a = ep(t, 0, !1, null, null, !1, !1, "", Hh);
  return (
    (t._reactRootContainer = a),
    (t[kr] = a.current),
    fs(t.nodeType === 8 ? t.parentNode : t),
    Qi(function () {
      Uu(e, a, n, r);
    }),
    a
  );
}
function Wu(t, e, n, r, i) {
  var o = n._reactRootContainer;
  if (o) {
    var l = o;
    if (typeof i == "function") {
      var s = i;
      i = function () {
        var a = hu(l);
        s.call(a);
      };
    }
    Uu(e, l, t, i);
  } else l = hx(n, e, t, i, r);
  return hu(l);
}
km = function (t) {
  switch (t.tag) {
    case 3:
      var e = t.stateNode;
      if (e.current.memoizedState.isDehydrated) {
        var n = Tl(e.pendingLanes);
        n !== 0 &&
          (Sd(e, n | 1), Wt(e, be()), !(le & 6) && ((Ko = be() + 500), mi()));
      }
      break;
    case 13:
      Qi(function () {
        var r = Cr(t, 1);
        if (r !== null) {
          var i = Ft();
          Un(r, t, 1, i);
        }
      }),
        tp(t, 1);
  }
};
kd = function (t) {
  if (t.tag === 13) {
    var e = Cr(t, 134217728);
    if (e !== null) {
      var n = Ft();
      Un(e, t, 134217728, n);
    }
    tp(t, 134217728);
  }
};
Cm = function (t) {
  if (t.tag === 13) {
    var e = ni(t),
      n = Cr(t, e);
    if (n !== null) {
      var r = Ft();
      Un(n, t, e, r);
    }
    tp(t, e);
  }
};
Em = function () {
  return ce;
};
Pm = function (t, e) {
  var n = ce;
  try {
    return (ce = t), e();
  } finally {
    ce = n;
  }
};
rf = function (t, e, n) {
  switch (e) {
    case "input":
      if ((Kc(t, n), (e = n.name), n.type === "radio" && e != null)) {
        for (n = t; n.parentNode; ) n = n.parentNode;
        for (
          n = n.querySelectorAll(
            "input[name=" + JSON.stringify("" + e) + '][type="radio"]'
          ),
            e = 0;
          e < n.length;
          e++
        ) {
          var r = n[e];
          if (r !== t && r.form === t.form) {
            var i = ju(r);
            if (!i) throw Error(L(90));
            rm(r), Kc(r, i);
          }
        }
      }
      break;
    case "textarea":
      om(t, n);
      break;
    case "select":
      (e = n.value), e != null && Lo(t, !!n.multiple, e, !1);
  }
};
dm = Kd;
pm = Qi;
var mx = { usingClientEntryPoint: !1, Events: [zs, So, ju, cm, fm, Kd] },
  xl = {
    findFiberByHostInstance: Ri,
    bundleType: 0,
    version: "18.3.1",
    rendererPackageName: "react-dom",
  },
  gx = {
    bundleType: xl.bundleType,
    version: xl.version,
    rendererPackageName: xl.rendererPackageName,
    rendererConfig: xl.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: Rr.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (t) {
      return (t = gm(t)), t === null ? null : t.stateNode;
    },
    findFiberByHostInstance: xl.findFiberByHostInstance || px,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: "18.3.1-next-f1338f8080-20240426",
  };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var oa = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!oa.isDisabled && oa.supportsFiber)
    try {
      (Mu = oa.inject(gx)), (tr = oa);
    } catch {}
}
pn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = mx;
pn.createPortal = function (t, e) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!rp(e)) throw Error(L(200));
  return dx(t, e, null, n);
};
pn.createRoot = function (t, e) {
  if (!rp(t)) throw Error(L(299));
  var n = !1,
    r = "",
    i = Qg;
  return (
    e != null &&
      (e.unstable_strictMode === !0 && (n = !0),
      e.identifierPrefix !== void 0 && (r = e.identifierPrefix),
      e.onRecoverableError !== void 0 && (i = e.onRecoverableError)),
    (e = ep(t, 1, !1, null, null, n, !1, r, i)),
    (t[kr] = e.current),
    fs(t.nodeType === 8 ? t.parentNode : t),
    new np(e)
  );
};
pn.findDOMNode = function (t) {
  if (t == null) return null;
  if (t.nodeType === 1) return t;
  var e = t._reactInternals;
  if (e === void 0)
    throw typeof t.render == "function"
      ? Error(L(188))
      : ((t = Object.keys(t).join(",")), Error(L(268, t)));
  return (t = gm(e)), (t = t === null ? null : t.stateNode), t;
};
pn.flushSync = function (t) {
  return Qi(t);
};
pn.hydrate = function (t, e, n) {
  if (!Hu(e)) throw Error(L(200));
  return Wu(null, t, e, !0, n);
};
pn.hydrateRoot = function (t, e, n) {
  if (!rp(t)) throw Error(L(405));
  var r = (n != null && n.hydratedSources) || null,
    i = !1,
    o = "",
    l = Qg;
  if (
    (n != null &&
      (n.unstable_strictMode === !0 && (i = !0),
      n.identifierPrefix !== void 0 && (o = n.identifierPrefix),
      n.onRecoverableError !== void 0 && (l = n.onRecoverableError)),
    (e = Xg(e, null, t, 1, n ?? null, i, !1, o, l)),
    (t[kr] = e.current),
    fs(t),
    r)
  )
    for (t = 0; t < r.length; t++)
      (n = r[t]),
        (i = n._getVersion),
        (i = i(n._source)),
        e.mutableSourceEagerHydrationData == null
          ? (e.mutableSourceEagerHydrationData = [n, i])
          : e.mutableSourceEagerHydrationData.push(n, i);
  return new Vu(e);
};
pn.render = function (t, e, n) {
  if (!Hu(e)) throw Error(L(200));
  return Wu(null, t, e, !1, n);
};
pn.unmountComponentAtNode = function (t) {
  if (!Hu(t)) throw Error(L(40));
  return t._reactRootContainer
    ? (Qi(function () {
        Wu(null, null, t, !1, function () {
          (t._reactRootContainer = null), (t[kr] = null);
        });
      }),
      !0)
    : !1;
};
pn.unstable_batchedUpdates = Kd;
pn.unstable_renderSubtreeIntoContainer = function (t, e, n, r) {
  if (!Hu(n)) throw Error(L(200));
  if (t == null || t._reactInternals === void 0) throw Error(L(38));
  return Wu(t, e, n, !1, r);
};
pn.version = "18.3.1-next-f1338f8080-20240426";
function Gg() {
  if (
    !(
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
    )
  )
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Gg);
    } catch (t) {
      console.error(t);
    }
}
Gg(), (G0.exports = pn);
var vx = G0.exports,
  Kg,
  Wh = vx;
(Kg = Wh.createRoot), Wh.hydrateRoot;
var ip = {};
Object.defineProperty(ip, "__esModule", { value: !0 });
ip.parse = Cx;
ip.serialize = Ex;
const yx = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/,
  _x = /^[\u0021-\u003A\u003C-\u007E]*$/,
  xx =
    /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i,
  wx = /^[\u0020-\u003A\u003D-\u007E]*$/,
  Sx = Object.prototype.toString,
  kx = (() => {
    const t = function () {};
    return (t.prototype = Object.create(null)), t;
  })();
function Cx(t, e) {
  const n = new kx(),
    r = t.length;
  if (r < 2) return n;
  const i = (e == null ? void 0 : e.decode) || Px;
  let o = 0;
  do {
    const l = t.indexOf("=", o);
    if (l === -1) break;
    const s = t.indexOf(";", o),
      a = s === -1 ? r : s;
    if (l > a) {
      o = t.lastIndexOf(";", l - 1) + 1;
      continue;
    }
    const u = Yh(t, o, l),
      c = Xh(t, l, u),
      f = t.slice(u, c);
    if (n[f] === void 0) {
      let d = Yh(t, l + 1, a),
        p = Xh(t, a, d);
      const v = i(t.slice(d, p));
      n[f] = v;
    }
    o = a + 1;
  } while (o < r);
  return n;
}
function Yh(t, e, n) {
  do {
    const r = t.charCodeAt(e);
    if (r !== 32 && r !== 9) return e;
  } while (++e < n);
  return n;
}
function Xh(t, e, n) {
  for (; e > n; ) {
    const r = t.charCodeAt(--e);
    if (r !== 32 && r !== 9) return e + 1;
  }
  return n;
}
function Ex(t, e, n) {
  const r = (n == null ? void 0 : n.encode) || encodeURIComponent;
  if (!yx.test(t)) throw new TypeError(`argument name is invalid: ${t}`);
  const i = r(e);
  if (!_x.test(i)) throw new TypeError(`argument val is invalid: ${e}`);
  let o = t + "=" + i;
  if (!n) return o;
  if (n.maxAge !== void 0) {
    if (!Number.isInteger(n.maxAge))
      throw new TypeError(`option maxAge is invalid: ${n.maxAge}`);
    o += "; Max-Age=" + n.maxAge;
  }
  if (n.domain) {
    if (!xx.test(n.domain))
      throw new TypeError(`option domain is invalid: ${n.domain}`);
    o += "; Domain=" + n.domain;
  }
  if (n.path) {
    if (!wx.test(n.path))
      throw new TypeError(`option path is invalid: ${n.path}`);
    o += "; Path=" + n.path;
  }
  if (n.expires) {
    if (!Tx(n.expires) || !Number.isFinite(n.expires.valueOf()))
      throw new TypeError(`option expires is invalid: ${n.expires}`);
    o += "; Expires=" + n.expires.toUTCString();
  }
  if (
    (n.httpOnly && (o += "; HttpOnly"),
    n.secure && (o += "; Secure"),
    n.partitioned && (o += "; Partitioned"),
    n.priority)
  )
    switch (typeof n.priority == "string" ? n.priority.toLowerCase() : void 0) {
      case "low":
        o += "; Priority=Low";
        break;
      case "medium":
        o += "; Priority=Medium";
        break;
      case "high":
        o += "; Priority=High";
        break;
      default:
        throw new TypeError(`option priority is invalid: ${n.priority}`);
    }
  if (n.sameSite)
    switch (
      typeof n.sameSite == "string" ? n.sameSite.toLowerCase() : n.sameSite
    ) {
      case !0:
      case "strict":
        o += "; SameSite=Strict";
        break;
      case "lax":
        o += "; SameSite=Lax";
        break;
      case "none":
        o += "; SameSite=None";
        break;
      default:
        throw new TypeError(`option sameSite is invalid: ${n.sameSite}`);
    }
  return o;
}
function Px(t) {
  if (t.indexOf("%") === -1) return t;
  try {
    return decodeURIComponent(t);
  } catch {
    return t;
  }
}
function Tx(t) {
  return Sx.call(t) === "[object Date]";
}
/**
 * react-router v7.4.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ var Qh = "popstate";
function Nx(t = {}) {
  function e(r, i) {
    let { pathname: o, search: l, hash: s } = r.location;
    return Af(
      "",
      { pathname: o, search: l, hash: s },
      (i.state && i.state.usr) || null,
      (i.state && i.state.key) || "default"
    );
  }
  function n(r, i) {
    return typeof i == "string" ? i : xs(i);
  }
  return Ox(e, n, null, t);
}
function Re(t, e) {
  if (t === !1 || t === null || typeof t > "u") throw new Error(e);
}
function or(t, e) {
  if (!t) {
    typeof console < "u" && console.warn(e);
    try {
      throw new Error(e);
    } catch {}
  }
}
function Rx() {
  return Math.random().toString(36).substring(2, 10);
}
function Gh(t, e) {
  return { usr: t.state, key: t.key, idx: e };
}
function Af(t, e, n = null, r) {
  return {
    pathname: typeof t == "string" ? t : t.pathname,
    search: "",
    hash: "",
    ...(typeof e == "string" ? ll(e) : e),
    state: n,
    key: (e && e.key) || r || Rx(),
  };
}
function xs({ pathname: t = "/", search: e = "", hash: n = "" }) {
  return (
    e && e !== "?" && (t += e.charAt(0) === "?" ? e : "?" + e),
    n && n !== "#" && (t += n.charAt(0) === "#" ? n : "#" + n),
    t
  );
}
function ll(t) {
  let e = {};
  if (t) {
    let n = t.indexOf("#");
    n >= 0 && ((e.hash = t.substring(n)), (t = t.substring(0, n)));
    let r = t.indexOf("?");
    r >= 0 && ((e.search = t.substring(r)), (t = t.substring(0, r))),
      t && (e.pathname = t);
  }
  return e;
}
function Ox(t, e, n, r = {}) {
  let { window: i = document.defaultView, v5Compat: o = !1 } = r,
    l = i.history,
    s = "POP",
    a = null,
    u = c();
  u == null && ((u = 0), l.replaceState({ ...l.state, idx: u }, ""));
  function c() {
    return (l.state || { idx: null }).idx;
  }
  function f() {
    s = "POP";
    let x = c(),
      g = x == null ? null : x - u;
    (u = x), a && a({ action: s, location: m.location, delta: g });
  }
  function d(x, g) {
    s = "PUSH";
    let h = Af(m.location, x, g);
    u = c() + 1;
    let y = Gh(h, u),
      _ = m.createHref(h);
    try {
      l.pushState(y, "", _);
    } catch (k) {
      if (k instanceof DOMException && k.name === "DataCloneError") throw k;
      i.location.assign(_);
    }
    o && a && a({ action: s, location: m.location, delta: 1 });
  }
  function p(x, g) {
    s = "REPLACE";
    let h = Af(m.location, x, g);
    u = c();
    let y = Gh(h, u),
      _ = m.createHref(h);
    l.replaceState(y, "", _),
      o && a && a({ action: s, location: m.location, delta: 0 });
  }
  function v(x) {
    let g = i.location.origin !== "null" ? i.location.origin : i.location.href,
      h = typeof x == "string" ? x : xs(x);
    return (
      (h = h.replace(/ $/, "%20")),
      Re(
        g,
        `No window.location.(origin|href) available to create URL for href: ${h}`
      ),
      new URL(h, g)
    );
  }
  let m = {
    get action() {
      return s;
    },
    get location() {
      return t(i, l);
    },
    listen(x) {
      if (a) throw new Error("A history only accepts one active listener");
      return (
        i.addEventListener(Qh, f),
        (a = x),
        () => {
          i.removeEventListener(Qh, f), (a = null);
        }
      );
    },
    createHref(x) {
      return e(i, x);
    },
    createURL: v,
    encodeLocation(x) {
      let g = v(x);
      return { pathname: g.pathname, search: g.search, hash: g.hash };
    },
    push: d,
    replace: p,
    go(x) {
      return l.go(x);
    },
  };
  return m;
}
function qg(t, e, n = "/") {
  return Mx(t, e, n, !1);
}
function Mx(t, e, n, r) {
  let i = typeof e == "string" ? ll(e) : e,
    o = Pr(i.pathname || "/", n);
  if (o == null) return null;
  let l = Jg(t);
  Lx(l);
  let s = null;
  for (let a = 0; s == null && a < l.length; ++a) {
    let u = Vx(o);
    s = Bx(l[a], u, r);
  }
  return s;
}
function Jg(t, e = [], n = [], r = "") {
  let i = (o, l, s) => {
    let a = {
      relativePath: s === void 0 ? o.path || "" : s,
      caseSensitive: o.caseSensitive === !0,
      childrenIndex: l,
      route: o,
    };
    a.relativePath.startsWith("/") &&
      (Re(
        a.relativePath.startsWith(r),
        `Absolute route path "${a.relativePath}" nested under path "${r}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      ),
      (a.relativePath = a.relativePath.slice(r.length)));
    let u = xr([r, a.relativePath]),
      c = n.concat(a);
    o.children &&
      o.children.length > 0 &&
      (Re(
        o.index !== !0,
        `Index routes must not have child routes. Please remove all child routes from route path "${u}".`
      ),
      Jg(o.children, e, c, u)),
      !(o.path == null && !o.index) &&
        e.push({ path: u, score: bx(u, o.index), routesMeta: c });
  };
  return (
    t.forEach((o, l) => {
      var s;
      if (o.path === "" || !((s = o.path) != null && s.includes("?"))) i(o, l);
      else for (let a of Zg(o.path)) i(o, l, a);
    }),
    e
  );
}
function Zg(t) {
  let e = t.split("/");
  if (e.length === 0) return [];
  let [n, ...r] = e,
    i = n.endsWith("?"),
    o = n.replace(/\?$/, "");
  if (r.length === 0) return i ? [o, ""] : [o];
  let l = Zg(r.join("/")),
    s = [];
  return (
    s.push(...l.map((a) => (a === "" ? o : [o, a].join("/")))),
    i && s.push(...l),
    s.map((a) => (t.startsWith("/") && a === "" ? "/" : a))
  );
}
function Lx(t) {
  t.sort((e, n) =>
    e.score !== n.score
      ? n.score - e.score
      : $x(
          e.routesMeta.map((r) => r.childrenIndex),
          n.routesMeta.map((r) => r.childrenIndex)
        )
  );
}
var zx = /^:[\w-]+$/,
  Dx = 3,
  jx = 2,
  Fx = 1,
  Ax = 10,
  Ix = -2,
  Kh = (t) => t === "*";
function bx(t, e) {
  let n = t.split("/"),
    r = n.length;
  return (
    n.some(Kh) && (r += Ix),
    e && (r += jx),
    n
      .filter((i) => !Kh(i))
      .reduce((i, o) => i + (zx.test(o) ? Dx : o === "" ? Fx : Ax), r)
  );
}
function $x(t, e) {
  return t.length === e.length && t.slice(0, -1).every((r, i) => r === e[i])
    ? t[t.length - 1] - e[e.length - 1]
    : 0;
}
function Bx(t, e, n = !1) {
  let { routesMeta: r } = t,
    i = {},
    o = "/",
    l = [];
  for (let s = 0; s < r.length; ++s) {
    let a = r[s],
      u = s === r.length - 1,
      c = o === "/" ? e : e.slice(o.length) || "/",
      f = mu(
        { path: a.relativePath, caseSensitive: a.caseSensitive, end: u },
        c
      ),
      d = a.route;
    if (
      (!f &&
        u &&
        n &&
        !r[r.length - 1].route.index &&
        (f = mu(
          { path: a.relativePath, caseSensitive: a.caseSensitive, end: !1 },
          c
        )),
      !f)
    )
      return null;
    Object.assign(i, f.params),
      l.push({
        params: i,
        pathname: xr([o, f.pathname]),
        pathnameBase: Xx(xr([o, f.pathnameBase])),
        route: d,
      }),
      f.pathnameBase !== "/" && (o = xr([o, f.pathnameBase]));
  }
  return l;
}
function mu(t, e) {
  typeof t == "string" && (t = { path: t, caseSensitive: !1, end: !0 });
  let [n, r] = Ux(t.path, t.caseSensitive, t.end),
    i = e.match(n);
  if (!i) return null;
  let o = i[0],
    l = o.replace(/(.)\/+$/, "$1"),
    s = i.slice(1);
  return {
    params: r.reduce((u, { paramName: c, isOptional: f }, d) => {
      if (c === "*") {
        let v = s[d] || "";
        l = o.slice(0, o.length - v.length).replace(/(.)\/+$/, "$1");
      }
      const p = s[d];
      return (
        f && !p ? (u[c] = void 0) : (u[c] = (p || "").replace(/%2F/g, "/")), u
      );
    }, {}),
    pathname: o,
    pathnameBase: l,
    pattern: t,
  };
}
function Ux(t, e = !1, n = !0) {
  or(
    t === "*" || !t.endsWith("*") || t.endsWith("/*"),
    `Route path "${t}" will be treated as if it were "${t.replace(
      /\*$/,
      "/*"
    )}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${t.replace(
      /\*$/,
      "/*"
    )}".`
  );
  let r = [],
    i =
      "^" +
      t
        .replace(/\/*\*?$/, "")
        .replace(/^\/*/, "/")
        .replace(/[\\.*+^${}|()[\]]/g, "\\$&")
        .replace(
          /\/:([\w-]+)(\?)?/g,
          (l, s, a) => (
            r.push({ paramName: s, isOptional: a != null }),
            a ? "/?([^\\/]+)?" : "/([^\\/]+)"
          )
        );
  return (
    t.endsWith("*")
      ? (r.push({ paramName: "*" }),
        (i += t === "*" || t === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$"))
      : n
      ? (i += "\\/*$")
      : t !== "" && t !== "/" && (i += "(?:(?=\\/|$))"),
    [new RegExp(i, e ? void 0 : "i"), r]
  );
}
function Vx(t) {
  try {
    return t
      .split("/")
      .map((e) => decodeURIComponent(e).replace(/\//g, "%2F"))
      .join("/");
  } catch (e) {
    return (
      or(
        !1,
        `The URL path "${t}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${e}).`
      ),
      t
    );
  }
}
function Pr(t, e) {
  if (e === "/") return t;
  if (!t.toLowerCase().startsWith(e.toLowerCase())) return null;
  let n = e.endsWith("/") ? e.length - 1 : e.length,
    r = t.charAt(n);
  return r && r !== "/" ? null : t.slice(n) || "/";
}
function Hx(t, e = "/") {
  let {
    pathname: n,
    search: r = "",
    hash: i = "",
  } = typeof t == "string" ? ll(t) : t;
  return {
    pathname: n ? (n.startsWith("/") ? n : Wx(n, e)) : e,
    search: Qx(r),
    hash: Gx(i),
  };
}
function Wx(t, e) {
  let n = e.replace(/\/+$/, "").split("/");
  return (
    t.split("/").forEach((i) => {
      i === ".." ? n.length > 1 && n.pop() : i !== "." && n.push(i);
    }),
    n.length > 1 ? n.join("/") : "/"
  );
}
function Ec(t, e, n, r) {
  return `Cannot include a '${t}' character in a manually specified \`to.${e}\` field [${JSON.stringify(
    r
  )}].  Please separate it out to the \`to.${n}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function Yx(t) {
  return t.filter(
    (e, n) => n === 0 || (e.route.path && e.route.path.length > 0)
  );
}
function ev(t) {
  let e = Yx(t);
  return e.map((n, r) => (r === e.length - 1 ? n.pathname : n.pathnameBase));
}
function tv(t, e, n, r = !1) {
  let i;
  typeof t == "string"
    ? (i = ll(t))
    : ((i = { ...t }),
      Re(
        !i.pathname || !i.pathname.includes("?"),
        Ec("?", "pathname", "search", i)
      ),
      Re(
        !i.pathname || !i.pathname.includes("#"),
        Ec("#", "pathname", "hash", i)
      ),
      Re(!i.search || !i.search.includes("#"), Ec("#", "search", "hash", i)));
  let o = t === "" || i.pathname === "",
    l = o ? "/" : i.pathname,
    s;
  if (l == null) s = n;
  else {
    let f = e.length - 1;
    if (!r && l.startsWith("..")) {
      let d = l.split("/");
      for (; d[0] === ".."; ) d.shift(), (f -= 1);
      i.pathname = d.join("/");
    }
    s = f >= 0 ? e[f] : "/";
  }
  let a = Hx(i, s),
    u = l && l !== "/" && l.endsWith("/"),
    c = (o || l === ".") && n.endsWith("/");
  return !a.pathname.endsWith("/") && (u || c) && (a.pathname += "/"), a;
}
var xr = (t) => t.join("/").replace(/\/\/+/g, "/"),
  Xx = (t) => t.replace(/\/+$/, "").replace(/^\/*/, "/"),
  Qx = (t) => (!t || t === "?" ? "" : t.startsWith("?") ? t : "?" + t),
  Gx = (t) => (!t || t === "#" ? "" : t.startsWith("#") ? t : "#" + t);
function Kx(t) {
  return (
    t != null &&
    typeof t.status == "number" &&
    typeof t.statusText == "string" &&
    typeof t.internal == "boolean" &&
    "data" in t
  );
}
var nv = ["POST", "PUT", "PATCH", "DELETE"];
new Set(nv);
var qx = ["GET", ...nv];
new Set(qx);
var sl = P.createContext(null);
sl.displayName = "DataRouter";
var Yu = P.createContext(null);
Yu.displayName = "DataRouterState";
var rv = P.createContext({ isTransitioning: !1 });
rv.displayName = "ViewTransition";
var Jx = P.createContext(new Map());
Jx.displayName = "Fetchers";
var Zx = P.createContext(null);
Zx.displayName = "Await";
var sr = P.createContext(null);
sr.displayName = "Navigation";
var js = P.createContext(null);
js.displayName = "Location";
var Or = P.createContext({ outlet: null, matches: [], isDataRoute: !1 });
Or.displayName = "Route";
var op = P.createContext(null);
op.displayName = "RouteError";
function ew(t, { relative: e } = {}) {
  Re(
    Fs(),
    "useHref() may be used only in the context of a <Router> component."
  );
  let { basename: n, navigator: r } = P.useContext(sr),
    { hash: i, pathname: o, search: l } = As(t, { relative: e }),
    s = o;
  return (
    n !== "/" && (s = o === "/" ? n : xr([n, o])),
    r.createHref({ pathname: s, search: l, hash: i })
  );
}
function Fs() {
  return P.useContext(js) != null;
}
function no() {
  return (
    Re(
      Fs(),
      "useLocation() may be used only in the context of a <Router> component."
    ),
    P.useContext(js).location
  );
}
var iv =
  "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function ov(t) {
  P.useContext(sr).static || P.useLayoutEffect(t);
}
function lv() {
  let { isDataRoute: t } = P.useContext(Or);
  return t ? pw() : tw();
}
function tw() {
  Re(
    Fs(),
    "useNavigate() may be used only in the context of a <Router> component."
  );
  let t = P.useContext(sl),
    { basename: e, navigator: n } = P.useContext(sr),
    { matches: r } = P.useContext(Or),
    { pathname: i } = no(),
    o = JSON.stringify(ev(r)),
    l = P.useRef(!1);
  return (
    ov(() => {
      l.current = !0;
    }),
    P.useCallback(
      (a, u = {}) => {
        if ((or(l.current, iv), !l.current)) return;
        if (typeof a == "number") {
          n.go(a);
          return;
        }
        let c = tv(a, JSON.parse(o), i, u.relative === "path");
        t == null &&
          e !== "/" &&
          (c.pathname = c.pathname === "/" ? e : xr([e, c.pathname])),
          (u.replace ? n.replace : n.push)(c, u.state, u);
      },
      [e, n, o, i, t]
    )
  );
}
P.createContext(null);
function As(t, { relative: e } = {}) {
  let { matches: n } = P.useContext(Or),
    { pathname: r } = no(),
    i = JSON.stringify(ev(n));
  return P.useMemo(() => tv(t, JSON.parse(i), r, e === "path"), [t, i, r, e]);
}
function nw(t, e) {
  return sv(t, e);
}
function sv(t, e, n, r) {
  var h;
  Re(
    Fs(),
    "useRoutes() may be used only in the context of a <Router> component."
  );
  let { navigator: i, static: o } = P.useContext(sr),
    { matches: l } = P.useContext(Or),
    s = l[l.length - 1],
    a = s ? s.params : {},
    u = s ? s.pathname : "/",
    c = s ? s.pathnameBase : "/",
    f = s && s.route;
  {
    let y = (f && f.path) || "";
    av(
      u,
      !f || y.endsWith("*") || y.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${u}" (under <Route path="${y}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${y}"> to <Route path="${
        y === "/" ? "*" : `${y}/*`
      }">.`
    );
  }
  let d = no(),
    p;
  if (e) {
    let y = typeof e == "string" ? ll(e) : e;
    Re(
      c === "/" || ((h = y.pathname) == null ? void 0 : h.startsWith(c)),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${c}" but pathname "${y.pathname}" was given in the \`location\` prop.`
    ),
      (p = y);
  } else p = d;
  let v = p.pathname || "/",
    m = v;
  if (c !== "/") {
    let y = c.replace(/^\//, "").split("/");
    m = "/" + v.replace(/^\//, "").split("/").slice(y.length).join("/");
  }
  let x =
    !o && n && n.matches && n.matches.length > 0
      ? n.matches
      : qg(t, { pathname: m });
  or(
    f || x != null,
    `No routes matched location "${p.pathname}${p.search}${p.hash}" `
  ),
    or(
      x == null ||
        x[x.length - 1].route.element !== void 0 ||
        x[x.length - 1].route.Component !== void 0 ||
        x[x.length - 1].route.lazy !== void 0,
      `Matched leaf route at location "${p.pathname}${p.search}${p.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
    );
  let g = sw(
    x &&
      x.map((y) =>
        Object.assign({}, y, {
          params: Object.assign({}, a, y.params),
          pathname: xr([
            c,
            i.encodeLocation
              ? i.encodeLocation(y.pathname).pathname
              : y.pathname,
          ]),
          pathnameBase:
            y.pathnameBase === "/"
              ? c
              : xr([
                  c,
                  i.encodeLocation
                    ? i.encodeLocation(y.pathnameBase).pathname
                    : y.pathnameBase,
                ]),
        })
      ),
    l,
    n,
    r
  );
  return e && g
    ? P.createElement(
        js.Provider,
        {
          value: {
            location: {
              pathname: "/",
              search: "",
              hash: "",
              state: null,
              key: "default",
              ...p,
            },
            navigationType: "POP",
          },
        },
        g
      )
    : g;
}
function rw() {
  let t = dw(),
    e = Kx(t)
      ? `${t.status} ${t.statusText}`
      : t instanceof Error
      ? t.message
      : JSON.stringify(t),
    n = t instanceof Error ? t.stack : null,
    r = "rgba(200,200,200, 0.5)",
    i = { padding: "0.5rem", backgroundColor: r },
    o = { padding: "2px 4px", backgroundColor: r },
    l = null;
  return (
    console.error("Error handled by React Router default ErrorBoundary:", t),
    (l = P.createElement(
      P.Fragment,
      null,
      P.createElement("p", null, "💿 Hey developer 👋"),
      P.createElement(
        "p",
        null,
        "You can provide a way better UX than this when your app throws errors by providing your own ",
        P.createElement("code", { style: o }, "ErrorBoundary"),
        " or",
        " ",
        P.createElement("code", { style: o }, "errorElement"),
        " prop on your route."
      )
    )),
    P.createElement(
      P.Fragment,
      null,
      P.createElement("h2", null, "Unexpected Application Error!"),
      P.createElement("h3", { style: { fontStyle: "italic" } }, e),
      n ? P.createElement("pre", { style: i }, n) : null,
      l
    )
  );
}
var iw = P.createElement(rw, null),
  ow = class extends P.Component {
    constructor(t) {
      super(t),
        (this.state = {
          location: t.location,
          revalidation: t.revalidation,
          error: t.error,
        });
    }
    static getDerivedStateFromError(t) {
      return { error: t };
    }
    static getDerivedStateFromProps(t, e) {
      return e.location !== t.location ||
        (e.revalidation !== "idle" && t.revalidation === "idle")
        ? { error: t.error, location: t.location, revalidation: t.revalidation }
        : {
            error: t.error !== void 0 ? t.error : e.error,
            location: e.location,
            revalidation: t.revalidation || e.revalidation,
          };
    }
    componentDidCatch(t, e) {
      console.error(
        "React Router caught the following error during render",
        t,
        e
      );
    }
    render() {
      return this.state.error !== void 0
        ? P.createElement(
            Or.Provider,
            { value: this.props.routeContext },
            P.createElement(op.Provider, {
              value: this.state.error,
              children: this.props.component,
            })
          )
        : this.props.children;
    }
  };
function lw({ routeContext: t, match: e, children: n }) {
  let r = P.useContext(sl);
  return (
    r &&
      r.static &&
      r.staticContext &&
      (e.route.errorElement || e.route.ErrorBoundary) &&
      (r.staticContext._deepestRenderedBoundaryId = e.route.id),
    P.createElement(Or.Provider, { value: t }, n)
  );
}
function sw(t, e = [], n = null, r = null) {
  if (t == null) {
    if (!n) return null;
    if (n.errors) t = n.matches;
    else if (e.length === 0 && !n.initialized && n.matches.length > 0)
      t = n.matches;
    else return null;
  }
  let i = t,
    o = n == null ? void 0 : n.errors;
  if (o != null) {
    let a = i.findIndex(
      (u) => u.route.id && (o == null ? void 0 : o[u.route.id]) !== void 0
    );
    Re(
      a >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(
        o
      ).join(",")}`
    ),
      (i = i.slice(0, Math.min(i.length, a + 1)));
  }
  let l = !1,
    s = -1;
  if (n)
    for (let a = 0; a < i.length; a++) {
      let u = i[a];
      if (
        ((u.route.HydrateFallback || u.route.hydrateFallbackElement) && (s = a),
        u.route.id)
      ) {
        let { loaderData: c, errors: f } = n,
          d =
            u.route.loader &&
            !c.hasOwnProperty(u.route.id) &&
            (!f || f[u.route.id] === void 0);
        if (u.route.lazy || d) {
          (l = !0), s >= 0 ? (i = i.slice(0, s + 1)) : (i = [i[0]]);
          break;
        }
      }
    }
  return i.reduceRight((a, u, c) => {
    let f,
      d = !1,
      p = null,
      v = null;
    n &&
      ((f = o && u.route.id ? o[u.route.id] : void 0),
      (p = u.route.errorElement || iw),
      l &&
        (s < 0 && c === 0
          ? (av(
              "route-fallback",
              !1,
              "No `HydrateFallback` element provided to render during initial hydration"
            ),
            (d = !0),
            (v = null))
          : s === c &&
            ((d = !0), (v = u.route.hydrateFallbackElement || null))));
    let m = e.concat(i.slice(0, c + 1)),
      x = () => {
        let g;
        return (
          f
            ? (g = p)
            : d
            ? (g = v)
            : u.route.Component
            ? (g = P.createElement(u.route.Component, null))
            : u.route.element
            ? (g = u.route.element)
            : (g = a),
          P.createElement(lw, {
            match: u,
            routeContext: { outlet: a, matches: m, isDataRoute: n != null },
            children: g,
          })
        );
      };
    return n && (u.route.ErrorBoundary || u.route.errorElement || c === 0)
      ? P.createElement(ow, {
          location: n.location,
          revalidation: n.revalidation,
          component: p,
          error: f,
          children: x(),
          routeContext: { outlet: null, matches: m, isDataRoute: !0 },
        })
      : x();
  }, null);
}
function lp(t) {
  return `${t} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function aw(t) {
  let e = P.useContext(sl);
  return Re(e, lp(t)), e;
}
function uw(t) {
  let e = P.useContext(Yu);
  return Re(e, lp(t)), e;
}
function cw(t) {
  let e = P.useContext(Or);
  return Re(e, lp(t)), e;
}
function sp(t) {
  let e = cw(t),
    n = e.matches[e.matches.length - 1];
  return (
    Re(
      n.route.id,
      `${t} can only be used on routes that contain a unique "id"`
    ),
    n.route.id
  );
}
function fw() {
  return sp("useRouteId");
}
function dw() {
  var r;
  let t = P.useContext(op),
    e = uw("useRouteError"),
    n = sp("useRouteError");
  return t !== void 0 ? t : (r = e.errors) == null ? void 0 : r[n];
}
function pw() {
  let { router: t } = aw("useNavigate"),
    e = sp("useNavigate"),
    n = P.useRef(!1);
  return (
    ov(() => {
      n.current = !0;
    }),
    P.useCallback(
      async (i, o = {}) => {
        or(n.current, iv),
          n.current &&
            (typeof i == "number"
              ? t.navigate(i)
              : await t.navigate(i, { fromRouteId: e, ...o }));
      },
      [t, e]
    )
  );
}
var qh = {};
function av(t, e, n) {
  !e && !qh[t] && ((qh[t] = !0), or(!1, n));
}
P.memo(hw);
function hw({ routes: t, future: e, state: n }) {
  return sv(t, void 0, n, e);
}
function uv(t) {
  Re(
    !1,
    "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>."
  );
}
function mw({
  basename: t = "/",
  children: e = null,
  location: n,
  navigationType: r = "POP",
  navigator: i,
  static: o = !1,
}) {
  Re(
    !Fs(),
    "You cannot render a <Router> inside another <Router>. You should never have more than one in your app."
  );
  let l = t.replace(/^\/*/, "/"),
    s = P.useMemo(
      () => ({ basename: l, navigator: i, static: o, future: {} }),
      [l, i, o]
    );
  typeof n == "string" && (n = ll(n));
  let {
      pathname: a = "/",
      search: u = "",
      hash: c = "",
      state: f = null,
      key: d = "default",
    } = n,
    p = P.useMemo(() => {
      let v = Pr(a, l);
      return v == null
        ? null
        : {
            location: { pathname: v, search: u, hash: c, state: f, key: d },
            navigationType: r,
          };
    }, [l, a, u, c, f, d, r]);
  return (
    or(
      p != null,
      `<Router basename="${l}"> is not able to match the URL "${a}${u}${c}" because it does not start with the basename, so the <Router> won't render anything.`
    ),
    p == null
      ? null
      : P.createElement(
          sr.Provider,
          { value: s },
          P.createElement(js.Provider, { children: e, value: p })
        )
  );
}
function gw({ children: t, location: e }) {
  return nw(If(t), e);
}
function If(t, e = []) {
  let n = [];
  return (
    P.Children.forEach(t, (r, i) => {
      if (!P.isValidElement(r)) return;
      let o = [...e, i];
      if (r.type === P.Fragment) {
        n.push.apply(n, If(r.props.children, o));
        return;
      }
      Re(
        r.type === uv,
        `[${
          typeof r.type == "string" ? r.type : r.type.name
        }] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
      ),
        Re(
          !r.props.index || !r.props.children,
          "An index route cannot have child routes."
        );
      let l = {
        id: r.props.id || o.join("-"),
        caseSensitive: r.props.caseSensitive,
        element: r.props.element,
        Component: r.props.Component,
        index: r.props.index,
        path: r.props.path,
        loader: r.props.loader,
        action: r.props.action,
        hydrateFallbackElement: r.props.hydrateFallbackElement,
        HydrateFallback: r.props.HydrateFallback,
        errorElement: r.props.errorElement,
        ErrorBoundary: r.props.ErrorBoundary,
        hasErrorBoundary:
          r.props.hasErrorBoundary === !0 ||
          r.props.ErrorBoundary != null ||
          r.props.errorElement != null,
        shouldRevalidate: r.props.shouldRevalidate,
        handle: r.props.handle,
        lazy: r.props.lazy,
      };
      r.props.children && (l.children = If(r.props.children, o)), n.push(l);
    }),
    n
  );
}
var Da = "get",
  ja = "application/x-www-form-urlencoded";
function Xu(t) {
  return t != null && typeof t.tagName == "string";
}
function vw(t) {
  return Xu(t) && t.tagName.toLowerCase() === "button";
}
function yw(t) {
  return Xu(t) && t.tagName.toLowerCase() === "form";
}
function _w(t) {
  return Xu(t) && t.tagName.toLowerCase() === "input";
}
function xw(t) {
  return !!(t.metaKey || t.altKey || t.ctrlKey || t.shiftKey);
}
function ww(t, e) {
  return t.button === 0 && (!e || e === "_self") && !xw(t);
}
var la = null;
function Sw() {
  if (la === null)
    try {
      new FormData(document.createElement("form"), 0), (la = !1);
    } catch {
      la = !0;
    }
  return la;
}
var kw = new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain",
]);
function Pc(t) {
  return t != null && !kw.has(t)
    ? (or(
        !1,
        `"${t}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${ja}"`
      ),
      null)
    : t;
}
function Cw(t, e) {
  let n, r, i, o, l;
  if (yw(t)) {
    let s = t.getAttribute("action");
    (r = s ? Pr(s, e) : null),
      (n = t.getAttribute("method") || Da),
      (i = Pc(t.getAttribute("enctype")) || ja),
      (o = new FormData(t));
  } else if (vw(t) || (_w(t) && (t.type === "submit" || t.type === "image"))) {
    let s = t.form;
    if (s == null)
      throw new Error(
        'Cannot submit a <button> or <input type="submit"> without a <form>'
      );
    let a = t.getAttribute("formaction") || s.getAttribute("action");
    if (
      ((r = a ? Pr(a, e) : null),
      (n = t.getAttribute("formmethod") || s.getAttribute("method") || Da),
      (i =
        Pc(t.getAttribute("formenctype")) ||
        Pc(s.getAttribute("enctype")) ||
        ja),
      (o = new FormData(s, t)),
      !Sw())
    ) {
      let { name: u, type: c, value: f } = t;
      if (c === "image") {
        let d = u ? `${u}.` : "";
        o.append(`${d}x`, "0"), o.append(`${d}y`, "0");
      } else u && o.append(u, f);
    }
  } else {
    if (Xu(t))
      throw new Error(
        'Cannot submit element that is not <form>, <button>, or <input type="submit|image">'
      );
    (n = Da), (r = null), (i = ja), (l = t);
  }
  return (
    o && i === "text/plain" && ((l = o), (o = void 0)),
    { action: r, method: n.toLowerCase(), encType: i, formData: o, body: l }
  );
}
function ap(t, e) {
  if (t === !1 || t === null || typeof t > "u") throw new Error(e);
}
async function Ew(t, e) {
  if (t.id in e) return e[t.id];
  try {
    let n = await import(t.module);
    return (e[t.id] = n), n;
  } catch (n) {
    return (
      console.error(
        `Error loading route module \`${t.module}\`, reloading page...`
      ),
      console.error(n),
      window.__reactRouterContext && window.__reactRouterContext.isSpaMode,
      window.location.reload(),
      new Promise(() => {})
    );
  }
}
function Pw(t) {
  return t == null
    ? !1
    : t.href == null
    ? t.rel === "preload" &&
      typeof t.imageSrcSet == "string" &&
      typeof t.imageSizes == "string"
    : typeof t.rel == "string" && typeof t.href == "string";
}
async function Tw(t, e, n) {
  let r = await Promise.all(
    t.map(async (i) => {
      let o = e.routes[i.route.id];
      if (o) {
        let l = await Ew(o, n);
        return l.links ? l.links() : [];
      }
      return [];
    })
  );
  return Mw(
    r
      .flat(1)
      .filter(Pw)
      .filter((i) => i.rel === "stylesheet" || i.rel === "preload")
      .map((i) =>
        i.rel === "stylesheet"
          ? { ...i, rel: "prefetch", as: "style" }
          : { ...i, rel: "prefetch" }
      )
  );
}
function Jh(t, e, n, r, i, o) {
  let l = (a, u) => (n[u] ? a.route.id !== n[u].route.id : !0),
    s = (a, u) => {
      var c;
      return (
        n[u].pathname !== a.pathname ||
        (((c = n[u].route.path) == null ? void 0 : c.endsWith("*")) &&
          n[u].params["*"] !== a.params["*"])
      );
    };
  return o === "assets"
    ? e.filter((a, u) => l(a, u) || s(a, u))
    : o === "data"
    ? e.filter((a, u) => {
        var f;
        let c = r.routes[a.route.id];
        if (!c || !c.hasLoader) return !1;
        if (l(a, u) || s(a, u)) return !0;
        if (a.route.shouldRevalidate) {
          let d = a.route.shouldRevalidate({
            currentUrl: new URL(i.pathname + i.search + i.hash, window.origin),
            currentParams: ((f = n[0]) == null ? void 0 : f.params) || {},
            nextUrl: new URL(t, window.origin),
            nextParams: a.params,
            defaultShouldRevalidate: !0,
          });
          if (typeof d == "boolean") return d;
        }
        return !0;
      })
    : [];
}
function Nw(t, e, { includeHydrateFallback: n } = {}) {
  return Rw(
    t
      .map((r) => {
        let i = e.routes[r.route.id];
        if (!i) return [];
        let o = [i.module];
        return (
          i.clientActionModule && (o = o.concat(i.clientActionModule)),
          i.clientLoaderModule && (o = o.concat(i.clientLoaderModule)),
          n &&
            i.hydrateFallbackModule &&
            (o = o.concat(i.hydrateFallbackModule)),
          i.imports && (o = o.concat(i.imports)),
          o
        );
      })
      .flat(1)
  );
}
function Rw(t) {
  return [...new Set(t)];
}
function Ow(t) {
  let e = {},
    n = Object.keys(t).sort();
  for (let r of n) e[r] = t[r];
  return e;
}
function Mw(t, e) {
  let n = new Set();
  return (
    new Set(e),
    t.reduce((r, i) => {
      let o = JSON.stringify(Ow(i));
      return n.has(o) || (n.add(o), r.push({ key: o, link: i })), r;
    }, [])
  );
}
function Lw(t, e) {
  let n =
    typeof t == "string"
      ? new URL(
          t,
          typeof window > "u" ? "server://singlefetch/" : window.location.origin
        )
      : t;
  return (
    n.pathname === "/"
      ? (n.pathname = "_root.data")
      : e && Pr(n.pathname, e) === "/"
      ? (n.pathname = `${e.replace(/\/$/, "")}/_root.data`)
      : (n.pathname = `${n.pathname.replace(/\/$/, "")}.data`),
    n
  );
}
function cv() {
  let t = P.useContext(sl);
  return (
    ap(
      t,
      "You must render this element inside a <DataRouterContext.Provider> element"
    ),
    t
  );
}
function zw() {
  let t = P.useContext(Yu);
  return (
    ap(
      t,
      "You must render this element inside a <DataRouterStateContext.Provider> element"
    ),
    t
  );
}
var up = P.createContext(void 0);
up.displayName = "FrameworkContext";
function fv() {
  let t = P.useContext(up);
  return (
    ap(t, "You must render this element inside a <HydratedRouter> element"), t
  );
}
function Dw(t, e) {
  let n = P.useContext(up),
    [r, i] = P.useState(!1),
    [o, l] = P.useState(!1),
    {
      onFocus: s,
      onBlur: a,
      onMouseEnter: u,
      onMouseLeave: c,
      onTouchStart: f,
    } = e,
    d = P.useRef(null);
  P.useEffect(() => {
    if ((t === "render" && l(!0), t === "viewport")) {
      let m = (g) => {
          g.forEach((h) => {
            l(h.isIntersecting);
          });
        },
        x = new IntersectionObserver(m, { threshold: 0.5 });
      return (
        d.current && x.observe(d.current),
        () => {
          x.disconnect();
        }
      );
    }
  }, [t]),
    P.useEffect(() => {
      if (r) {
        let m = setTimeout(() => {
          l(!0);
        }, 100);
        return () => {
          clearTimeout(m);
        };
      }
    }, [r]);
  let p = () => {
      i(!0);
    },
    v = () => {
      i(!1), l(!1);
    };
  return n
    ? t !== "intent"
      ? [o, d, {}]
      : [
          o,
          d,
          {
            onFocus: wl(s, p),
            onBlur: wl(a, v),
            onMouseEnter: wl(u, p),
            onMouseLeave: wl(c, v),
            onTouchStart: wl(f, p),
          },
        ]
    : [!1, d, {}];
}
function wl(t, e) {
  return (n) => {
    t && t(n), n.defaultPrevented || e(n);
  };
}
function jw({ page: t, ...e }) {
  let { router: n } = cv(),
    r = P.useMemo(() => qg(n.routes, t, n.basename), [n.routes, t, n.basename]);
  return r ? P.createElement(Aw, { page: t, matches: r, ...e }) : null;
}
function Fw(t) {
  let { manifest: e, routeModules: n } = fv(),
    [r, i] = P.useState([]);
  return (
    P.useEffect(() => {
      let o = !1;
      return (
        Tw(t, e, n).then((l) => {
          o || i(l);
        }),
        () => {
          o = !0;
        }
      );
    }, [t, e, n]),
    r
  );
}
function Aw({ page: t, matches: e, ...n }) {
  let r = no(),
    { manifest: i, routeModules: o } = fv(),
    { basename: l } = cv(),
    { loaderData: s, matches: a } = zw(),
    u = P.useMemo(() => Jh(t, e, a, i, r, "data"), [t, e, a, i, r]),
    c = P.useMemo(() => Jh(t, e, a, i, r, "assets"), [t, e, a, i, r]),
    f = P.useMemo(() => {
      if (t === r.pathname + r.search + r.hash) return [];
      let v = new Set(),
        m = !1;
      if (
        (e.forEach((g) => {
          var y;
          let h = i.routes[g.route.id];
          !h ||
            !h.hasLoader ||
            ((!u.some((_) => _.route.id === g.route.id) &&
              g.route.id in s &&
              (y = o[g.route.id]) != null &&
              y.shouldRevalidate) ||
            h.hasClientLoader
              ? (m = !0)
              : v.add(g.route.id));
        }),
        v.size === 0)
      )
        return [];
      let x = Lw(t, l);
      return (
        m &&
          v.size > 0 &&
          x.searchParams.set(
            "_routes",
            e
              .filter((g) => v.has(g.route.id))
              .map((g) => g.route.id)
              .join(",")
          ),
        [x.pathname + x.search]
      );
    }, [l, s, r, i, u, e, t, o]),
    d = P.useMemo(() => Nw(c, i), [c, i]),
    p = Fw(c);
  return P.createElement(
    P.Fragment,
    null,
    f.map((v) =>
      P.createElement("link", {
        key: v,
        rel: "prefetch",
        as: "fetch",
        href: v,
        ...n,
      })
    ),
    d.map((v) =>
      P.createElement("link", { key: v, rel: "modulepreload", href: v, ...n })
    ),
    p.map(({ key: v, link: m }) => P.createElement("link", { key: v, ...m }))
  );
}
function Iw(...t) {
  return (e) => {
    t.forEach((n) => {
      typeof n == "function" ? n(e) : n != null && (n.current = e);
    });
  };
}
var dv =
  typeof window < "u" &&
  typeof window.document < "u" &&
  typeof window.document.createElement < "u";
try {
  dv && (window.__reactRouterVersion = "7.4.1");
} catch {}
function bw({ basename: t, children: e, window: n }) {
  let r = P.useRef();
  r.current == null && (r.current = Nx({ window: n, v5Compat: !0 }));
  let i = r.current,
    [o, l] = P.useState({ action: i.action, location: i.location }),
    s = P.useCallback(
      (a) => {
        P.startTransition(() => l(a));
      },
      [l]
    );
  return (
    P.useLayoutEffect(() => i.listen(s), [i, s]),
    P.createElement(mw, {
      basename: t,
      children: e,
      location: o.location,
      navigationType: o.action,
      navigator: i,
    })
  );
}
var pv = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  hv = P.forwardRef(function (
    {
      onClick: e,
      discover: n = "render",
      prefetch: r = "none",
      relative: i,
      reloadDocument: o,
      replace: l,
      state: s,
      target: a,
      to: u,
      preventScrollReset: c,
      viewTransition: f,
      ...d
    },
    p
  ) {
    let { basename: v } = P.useContext(sr),
      m = typeof u == "string" && pv.test(u),
      x,
      g = !1;
    if (typeof u == "string" && m && ((x = u), dv))
      try {
        let N = new URL(window.location.href),
          R = u.startsWith("//") ? new URL(N.protocol + u) : new URL(u),
          I = Pr(R.pathname, v);
        R.origin === N.origin && I != null
          ? (u = I + R.search + R.hash)
          : (g = !0);
      } catch {
        or(
          !1,
          `<Link to="${u}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`
        );
      }
    let h = ew(u, { relative: i }),
      [y, _, k] = Dw(r, d),
      E = Vw(u, {
        replace: l,
        state: s,
        target: a,
        preventScrollReset: c,
        relative: i,
        viewTransition: f,
      });
    function C(N) {
      e && e(N), N.defaultPrevented || E(N);
    }
    let T = P.createElement("a", {
      ...d,
      ...k,
      href: x || h,
      onClick: g || o ? e : C,
      ref: Iw(p, _),
      target: a,
      "data-discover": !m && n === "render" ? "true" : void 0,
    });
    return y && !m
      ? P.createElement(P.Fragment, null, T, P.createElement(jw, { page: h }))
      : T;
  });
hv.displayName = "Link";
var $w = P.forwardRef(function (
  {
    "aria-current": e = "page",
    caseSensitive: n = !1,
    className: r = "",
    end: i = !1,
    style: o,
    to: l,
    viewTransition: s,
    children: a,
    ...u
  },
  c
) {
  let f = As(l, { relative: u.relative }),
    d = no(),
    p = P.useContext(Yu),
    { navigator: v, basename: m } = P.useContext(sr),
    x = p != null && Qw(f) && s === !0,
    g = v.encodeLocation ? v.encodeLocation(f).pathname : f.pathname,
    h = d.pathname,
    y =
      p && p.navigation && p.navigation.location
        ? p.navigation.location.pathname
        : null;
  n ||
    ((h = h.toLowerCase()),
    (y = y ? y.toLowerCase() : null),
    (g = g.toLowerCase())),
    y && m && (y = Pr(y, m) || y);
  const _ = g !== "/" && g.endsWith("/") ? g.length - 1 : g.length;
  let k = h === g || (!i && h.startsWith(g) && h.charAt(_) === "/"),
    E =
      y != null &&
      (y === g || (!i && y.startsWith(g) && y.charAt(g.length) === "/")),
    C = { isActive: k, isPending: E, isTransitioning: x },
    T = k ? e : void 0,
    N;
  typeof r == "function"
    ? (N = r(C))
    : (N = [
        r,
        k ? "active" : null,
        E ? "pending" : null,
        x ? "transitioning" : null,
      ]
        .filter(Boolean)
        .join(" "));
  let R = typeof o == "function" ? o(C) : o;
  return P.createElement(
    hv,
    {
      ...u,
      "aria-current": T,
      className: N,
      ref: c,
      style: R,
      to: l,
      viewTransition: s,
    },
    typeof a == "function" ? a(C) : a
  );
});
$w.displayName = "NavLink";
var Bw = P.forwardRef(
  (
    {
      discover: t = "render",
      fetcherKey: e,
      navigate: n,
      reloadDocument: r,
      replace: i,
      state: o,
      method: l = Da,
      action: s,
      onSubmit: a,
      relative: u,
      preventScrollReset: c,
      viewTransition: f,
      ...d
    },
    p
  ) => {
    let v = Yw(),
      m = Xw(s, { relative: u }),
      x = l.toLowerCase() === "get" ? "get" : "post",
      g = typeof s == "string" && pv.test(s),
      h = (y) => {
        if ((a && a(y), y.defaultPrevented)) return;
        y.preventDefault();
        let _ = y.nativeEvent.submitter,
          k = (_ == null ? void 0 : _.getAttribute("formmethod")) || l;
        v(_ || y.currentTarget, {
          fetcherKey: e,
          method: k,
          navigate: n,
          replace: i,
          state: o,
          relative: u,
          preventScrollReset: c,
          viewTransition: f,
        });
      };
    return P.createElement("form", {
      ref: p,
      method: x,
      action: m,
      onSubmit: r ? a : h,
      ...d,
      "data-discover": !g && t === "render" ? "true" : void 0,
    });
  }
);
Bw.displayName = "Form";
function Uw(t) {
  return `${t} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function mv(t) {
  let e = P.useContext(sl);
  return Re(e, Uw(t)), e;
}
function Vw(
  t,
  {
    target: e,
    replace: n,
    state: r,
    preventScrollReset: i,
    relative: o,
    viewTransition: l,
  } = {}
) {
  let s = lv(),
    a = no(),
    u = As(t, { relative: o });
  return P.useCallback(
    (c) => {
      if (ww(c, e)) {
        c.preventDefault();
        let f = n !== void 0 ? n : xs(a) === xs(u);
        s(t, {
          replace: f,
          state: r,
          preventScrollReset: i,
          relative: o,
          viewTransition: l,
        });
      }
    },
    [a, s, u, n, r, e, t, i, o, l]
  );
}
var Hw = 0,
  Ww = () => `__${String(++Hw)}__`;
function Yw() {
  let { router: t } = mv("useSubmit"),
    { basename: e } = P.useContext(sr),
    n = fw();
  return P.useCallback(
    async (r, i = {}) => {
      let { action: o, method: l, encType: s, formData: a, body: u } = Cw(r, e);
      if (i.navigate === !1) {
        let c = i.fetcherKey || Ww();
        await t.fetch(c, n, i.action || o, {
          preventScrollReset: i.preventScrollReset,
          formData: a,
          body: u,
          formMethod: i.method || l,
          formEncType: i.encType || s,
          flushSync: i.flushSync,
        });
      } else
        await t.navigate(i.action || o, {
          preventScrollReset: i.preventScrollReset,
          formData: a,
          body: u,
          formMethod: i.method || l,
          formEncType: i.encType || s,
          replace: i.replace,
          state: i.state,
          fromRouteId: n,
          flushSync: i.flushSync,
          viewTransition: i.viewTransition,
        });
    },
    [t, e, n]
  );
}
function Xw(t, { relative: e } = {}) {
  let { basename: n } = P.useContext(sr),
    r = P.useContext(Or);
  Re(r, "useFormAction must be used inside a RouteContext");
  let [i] = r.matches.slice(-1),
    o = { ...As(t || ".", { relative: e }) },
    l = no();
  if (t == null) {
    o.search = l.search;
    let s = new URLSearchParams(o.search),
      a = s.getAll("index");
    if (a.some((c) => c === "")) {
      s.delete("index"),
        a.filter((f) => f).forEach((f) => s.append("index", f));
      let c = s.toString();
      o.search = c ? `?${c}` : "";
    }
  }
  return (
    (!t || t === ".") &&
      i.route.index &&
      (o.search = o.search ? o.search.replace(/^\?/, "?index&") : "?index"),
    n !== "/" && (o.pathname = o.pathname === "/" ? n : xr([n, o.pathname])),
    xs(o)
  );
}
function Qw(t, e = {}) {
  let n = P.useContext(rv);
  Re(
    n != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?"
  );
  let { basename: r } = mv("useViewTransitionState"),
    i = As(t, { relative: e.relative });
  if (!n.isTransitioning) return !1;
  let o = Pr(n.currentLocation.pathname, r) || n.currentLocation.pathname,
    l = Pr(n.nextLocation.pathname, r) || n.nextLocation.pathname;
  return mu(i.pathname, l) != null || mu(i.pathname, o) != null;
}
new TextEncoder();
function dr(t) {
  if (t === void 0)
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  return t;
}
function gv(t, e) {
  (t.prototype = Object.create(e.prototype)),
    (t.prototype.constructor = t),
    (t.__proto__ = e);
}
/*!
 * GSAP 3.12.5
 * https://gsap.com
 *
 * @license Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */ var cn = {
    autoSleep: 120,
    force3D: "auto",
    nullTargetWarn: 1,
    units: { lineHeight: "" },
  },
  qo = { duration: 0.5, overwrite: !1, delay: 0 },
  cp,
  St,
  we,
  Sn = 1e8,
  pe = 1 / Sn,
  bf = Math.PI * 2,
  Gw = bf / 4,
  Kw = 0,
  vv = Math.sqrt,
  qw = Math.cos,
  Jw = Math.sin,
  it = function (e) {
    return typeof e == "string";
  },
  ze = function (e) {
    return typeof e == "function";
  },
  Tr = function (e) {
    return typeof e == "number";
  },
  fp = function (e) {
    return typeof e > "u";
  },
  lr = function (e) {
    return typeof e == "object";
  },
  Yt = function (e) {
    return e !== !1;
  },
  dp = function () {
    return typeof window < "u";
  },
  sa = function (e) {
    return ze(e) || it(e);
  },
  yv =
    (typeof ArrayBuffer == "function" && ArrayBuffer.isView) || function () {},
  kt = Array.isArray,
  $f = /(?:-?\.?\d|\.)+/gi,
  _v = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,
  Ro = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g,
  Tc = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,
  xv = /[+-]=-?[.\d]+/,
  wv = /[^,'"\[\]\s]+/gi,
  Zw = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,
  Pe,
  Gn,
  Bf,
  pp,
  dn = {},
  gu = {},
  Sv,
  kv = function (e) {
    return (gu = Gi(e, dn)) && Kt;
  },
  hp = function (e, n) {
    return console.warn(
      "Invalid property",
      e,
      "set to",
      n,
      "Missing plugin? gsap.registerPlugin()"
    );
  },
  ws = function (e, n) {
    return !n && console.warn(e);
  },
  Cv = function (e, n) {
    return (e && (dn[e] = n) && gu && (gu[e] = n)) || dn;
  },
  Ss = function () {
    return 0;
  },
  e2 = { suppressEvents: !0, isStart: !0, kill: !1 },
  Fa = { suppressEvents: !0, kill: !1 },
  t2 = { suppressEvents: !0 },
  mp = {},
  ii = [],
  Uf = {},
  Ev,
  rn = {},
  Nc = {},
  Zh = 30,
  Aa = [],
  gp = "",
  vp = function (e) {
    var n = e[0],
      r,
      i;
    if ((lr(n) || ze(n) || (e = [e]), !(r = (n._gsap || {}).harness))) {
      for (i = Aa.length; i-- && !Aa[i].targetTest(n); );
      r = Aa[i];
    }
    for (i = e.length; i--; )
      (e[i] && (e[i]._gsap || (e[i]._gsap = new Gv(e[i], r)))) ||
        e.splice(i, 1);
    return e;
  },
  Ai = function (e) {
    return e._gsap || vp(kn(e))[0]._gsap;
  },
  Pv = function (e, n, r) {
    return (r = e[n]) && ze(r)
      ? e[n]()
      : (fp(r) && e.getAttribute && e.getAttribute(n)) || r;
  },
  Xt = function (e, n) {
    return (e = e.split(",")).forEach(n) || e;
  },
  Ie = function (e) {
    return Math.round(e * 1e5) / 1e5 || 0;
  },
  nt = function (e) {
    return Math.round(e * 1e7) / 1e7 || 0;
  },
  Io = function (e, n) {
    var r = n.charAt(0),
      i = parseFloat(n.substr(2));
    return (
      (e = parseFloat(e)),
      r === "+" ? e + i : r === "-" ? e - i : r === "*" ? e * i : e / i
    );
  },
  n2 = function (e, n) {
    for (var r = n.length, i = 0; e.indexOf(n[i]) < 0 && ++i < r; );
    return i < r;
  },
  vu = function () {
    var e = ii.length,
      n = ii.slice(0),
      r,
      i;
    for (Uf = {}, ii.length = 0, r = 0; r < e; r++)
      (i = n[r]),
        i && i._lazy && (i.render(i._lazy[0], i._lazy[1], !0)._lazy = 0);
  },
  Tv = function (e, n, r, i) {
    ii.length && !St && vu(),
      e.render(n, r, St && n < 0 && (e._initted || e._startAt)),
      ii.length && !St && vu();
  },
  Nv = function (e) {
    var n = parseFloat(e);
    return (n || n === 0) && (e + "").match(wv).length < 2
      ? n
      : it(e)
      ? e.trim()
      : e;
  },
  Rv = function (e) {
    return e;
  },
  Nn = function (e, n) {
    for (var r in n) r in e || (e[r] = n[r]);
    return e;
  },
  r2 = function (e) {
    return function (n, r) {
      for (var i in r)
        i in n || (i === "duration" && e) || i === "ease" || (n[i] = r[i]);
    };
  },
  Gi = function (e, n) {
    for (var r in n) e[r] = n[r];
    return e;
  },
  e0 = function t(e, n) {
    for (var r in n)
      r !== "__proto__" &&
        r !== "constructor" &&
        r !== "prototype" &&
        (e[r] = lr(n[r]) ? t(e[r] || (e[r] = {}), n[r]) : n[r]);
    return e;
  },
  yu = function (e, n) {
    var r = {},
      i;
    for (i in e) i in n || (r[i] = e[i]);
    return r;
  },
  Wl = function (e) {
    var n = e.parent || Pe,
      r = e.keyframes ? r2(kt(e.keyframes)) : Nn;
    if (Yt(e.inherit))
      for (; n; ) r(e, n.vars.defaults), (n = n.parent || n._dp);
    return e;
  },
  i2 = function (e, n) {
    for (var r = e.length, i = r === n.length; i && r-- && e[r] === n[r]; );
    return r < 0;
  },
  Ov = function (e, n, r, i, o) {
    var l = e[i],
      s;
    if (o) for (s = n[o]; l && l[o] > s; ) l = l._prev;
    return (
      l ? ((n._next = l._next), (l._next = n)) : ((n._next = e[r]), (e[r] = n)),
      n._next ? (n._next._prev = n) : (e[i] = n),
      (n._prev = l),
      (n.parent = n._dp = e),
      n
    );
  },
  Qu = function (e, n, r, i) {
    r === void 0 && (r = "_first"), i === void 0 && (i = "_last");
    var o = n._prev,
      l = n._next;
    o ? (o._next = l) : e[r] === n && (e[r] = l),
      l ? (l._prev = o) : e[i] === n && (e[i] = o),
      (n._next = n._prev = n.parent = null);
  },
  ui = function (e, n) {
    e.parent &&
      (!n || e.parent.autoRemoveChildren) &&
      e.parent.remove &&
      e.parent.remove(e),
      (e._act = 0);
  },
  Ii = function (e, n) {
    if (e && (!n || n._end > e._dur || n._start < 0))
      for (var r = e; r; ) (r._dirty = 1), (r = r.parent);
    return e;
  },
  o2 = function (e) {
    for (var n = e.parent; n && n.parent; )
      (n._dirty = 1), n.totalDuration(), (n = n.parent);
    return e;
  },
  Vf = function (e, n, r, i) {
    return (
      e._startAt &&
      (St
        ? e._startAt.revert(Fa)
        : (e.vars.immediateRender && !e.vars.autoRevert) ||
          e._startAt.render(n, !0, i))
    );
  },
  l2 = function t(e) {
    return !e || (e._ts && t(e.parent));
  },
  t0 = function (e) {
    return e._repeat ? Jo(e._tTime, (e = e.duration() + e._rDelay)) * e : 0;
  },
  Jo = function (e, n) {
    var r = Math.floor((e /= n));
    return e && r === e ? r - 1 : r;
  },
  _u = function (e, n) {
    return (
      (e - n._start) * n._ts +
      (n._ts >= 0 ? 0 : n._dirty ? n.totalDuration() : n._tDur)
    );
  },
  Gu = function (e) {
    return (e._end = nt(
      e._start + (e._tDur / Math.abs(e._ts || e._rts || pe) || 0)
    ));
  },
  Ku = function (e, n) {
    var r = e._dp;
    return (
      r &&
        r.smoothChildTiming &&
        e._ts &&
        ((e._start = nt(
          r._time -
            (e._ts > 0
              ? n / e._ts
              : ((e._dirty ? e.totalDuration() : e._tDur) - n) / -e._ts)
        )),
        Gu(e),
        r._dirty || Ii(r, e)),
      e
    );
  },
  Mv = function (e, n) {
    var r;
    if (
      ((n._time ||
        (!n._dur && n._initted) ||
        (n._start < e._time && (n._dur || !n.add))) &&
        ((r = _u(e.rawTime(), n)),
        (!n._dur || Is(0, n.totalDuration(), r) - n._tTime > pe) &&
          n.render(r, !0)),
      Ii(e, n)._dp && e._initted && e._time >= e._dur && e._ts)
    ) {
      if (e._dur < e.duration())
        for (r = e; r._dp; )
          r.rawTime() >= 0 && r.totalTime(r._tTime), (r = r._dp);
      e._zTime = -pe;
    }
  },
  Jn = function (e, n, r, i) {
    return (
      n.parent && ui(n),
      (n._start = nt(
        (Tr(r) ? r : r || e !== Pe ? gn(e, r, n) : e._time) + n._delay
      )),
      (n._end = nt(
        n._start + (n.totalDuration() / Math.abs(n.timeScale()) || 0)
      )),
      Ov(e, n, "_first", "_last", e._sort ? "_start" : 0),
      Hf(n) || (e._recent = n),
      i || Mv(e, n),
      e._ts < 0 && Ku(e, e._tTime),
      e
    );
  },
  Lv = function (e, n) {
    return (
      (dn.ScrollTrigger || hp("scrollTrigger", n)) &&
      dn.ScrollTrigger.create(n, e)
    );
  },
  zv = function (e, n, r, i, o) {
    if ((_p(e, n, o), !e._initted)) return 1;
    if (
      !r &&
      e._pt &&
      !St &&
      ((e._dur && e.vars.lazy !== !1) || (!e._dur && e.vars.lazy)) &&
      Ev !== on.frame
    )
      return ii.push(e), (e._lazy = [o, i]), 1;
  },
  s2 = function t(e) {
    var n = e.parent;
    return n && n._ts && n._initted && !n._lock && (n.rawTime() < 0 || t(n));
  },
  Hf = function (e) {
    var n = e.data;
    return n === "isFromStart" || n === "isStart";
  },
  a2 = function (e, n, r, i) {
    var o = e.ratio,
      l =
        n < 0 ||
        (!n &&
          ((!e._start && s2(e) && !(!e._initted && Hf(e))) ||
            ((e._ts < 0 || e._dp._ts < 0) && !Hf(e))))
          ? 0
          : 1,
      s = e._rDelay,
      a = 0,
      u,
      c,
      f;
    if (
      (s &&
        e._repeat &&
        ((a = Is(0, e._tDur, n)),
        (c = Jo(a, s)),
        e._yoyo && c & 1 && (l = 1 - l),
        c !== Jo(e._tTime, s) &&
          ((o = 1 - l), e.vars.repeatRefresh && e._initted && e.invalidate())),
      l !== o || St || i || e._zTime === pe || (!n && e._zTime))
    ) {
      if (!e._initted && zv(e, n, i, r, a)) return;
      for (
        f = e._zTime,
          e._zTime = n || (r ? pe : 0),
          r || (r = n && !f),
          e.ratio = l,
          e._from && (l = 1 - l),
          e._time = 0,
          e._tTime = a,
          u = e._pt;
        u;

      )
        u.r(l, u.d), (u = u._next);
      n < 0 && Vf(e, n, r, !0),
        e._onUpdate && !r && an(e, "onUpdate"),
        a && e._repeat && !r && e.parent && an(e, "onRepeat"),
        (n >= e._tDur || n < 0) &&
          e.ratio === l &&
          (l && ui(e, 1),
          !r &&
            !St &&
            (an(e, l ? "onComplete" : "onReverseComplete", !0),
            e._prom && e._prom()));
    } else e._zTime || (e._zTime = n);
  },
  u2 = function (e, n, r) {
    var i;
    if (r > n)
      for (i = e._first; i && i._start <= r; ) {
        if (i.data === "isPause" && i._start > n) return i;
        i = i._next;
      }
    else
      for (i = e._last; i && i._start >= r; ) {
        if (i.data === "isPause" && i._start < n) return i;
        i = i._prev;
      }
  },
  Zo = function (e, n, r, i) {
    var o = e._repeat,
      l = nt(n) || 0,
      s = e._tTime / e._tDur;
    return (
      s && !i && (e._time *= l / e._dur),
      (e._dur = l),
      (e._tDur = o ? (o < 0 ? 1e10 : nt(l * (o + 1) + e._rDelay * o)) : l),
      s > 0 && !i && Ku(e, (e._tTime = e._tDur * s)),
      e.parent && Gu(e),
      r || Ii(e.parent, e),
      e
    );
  },
  n0 = function (e) {
    return e instanceof zt ? Ii(e) : Zo(e, e._dur);
  },
  c2 = { _start: 0, endTime: Ss, totalDuration: Ss },
  gn = function t(e, n, r) {
    var i = e.labels,
      o = e._recent || c2,
      l = e.duration() >= Sn ? o.endTime(!1) : e._dur,
      s,
      a,
      u;
    return it(n) && (isNaN(n) || n in i)
      ? ((a = n.charAt(0)),
        (u = n.substr(-1) === "%"),
        (s = n.indexOf("=")),
        a === "<" || a === ">"
          ? (s >= 0 && (n = n.replace(/=/, "")),
            (a === "<" ? o._start : o.endTime(o._repeat >= 0)) +
              (parseFloat(n.substr(1)) || 0) *
                (u ? (s < 0 ? o : r).totalDuration() / 100 : 1))
          : s < 0
          ? (n in i || (i[n] = l), i[n])
          : ((a = parseFloat(n.charAt(s - 1) + n.substr(s + 1))),
            u && r && (a = (a / 100) * (kt(r) ? r[0] : r).totalDuration()),
            s > 1 ? t(e, n.substr(0, s - 1), r) + a : l + a))
      : n == null
      ? l
      : +n;
  },
  Yl = function (e, n, r) {
    var i = Tr(n[1]),
      o = (i ? 2 : 1) + (e < 2 ? 0 : 1),
      l = n[o],
      s,
      a;
    if ((i && (l.duration = n[1]), (l.parent = r), e)) {
      for (s = l, a = r; a && !("immediateRender" in s); )
        (s = a.vars.defaults || {}), (a = Yt(a.vars.inherit) && a.parent);
      (l.immediateRender = Yt(s.immediateRender)),
        e < 2 ? (l.runBackwards = 1) : (l.startAt = n[o - 1]);
    }
    return new He(n[0], l, n[o + 1]);
  },
  gi = function (e, n) {
    return e || e === 0 ? n(e) : n;
  },
  Is = function (e, n, r) {
    return r < e ? e : r > n ? n : r;
  },
  wt = function (e, n) {
    return !it(e) || !(n = Zw.exec(e)) ? "" : n[1];
  },
  f2 = function (e, n, r) {
    return gi(r, function (i) {
      return Is(e, n, i);
    });
  },
  Wf = [].slice,
  Dv = function (e, n) {
    return (
      e &&
      lr(e) &&
      "length" in e &&
      ((!n && !e.length) || (e.length - 1 in e && lr(e[0]))) &&
      !e.nodeType &&
      e !== Gn
    );
  },
  d2 = function (e, n, r) {
    return (
      r === void 0 && (r = []),
      e.forEach(function (i) {
        var o;
        return (it(i) && !n) || Dv(i, 1)
          ? (o = r).push.apply(o, kn(i))
          : r.push(i);
      }) || r
    );
  },
  kn = function (e, n, r) {
    return we && !n && we.selector
      ? we.selector(e)
      : it(e) && !r && (Bf || !el())
      ? Wf.call((n || pp).querySelectorAll(e), 0)
      : kt(e)
      ? d2(e, r)
      : Dv(e)
      ? Wf.call(e, 0)
      : e
      ? [e]
      : [];
  },
  Yf = function (e) {
    return (
      (e = kn(e)[0] || ws("Invalid scope") || {}),
      function (n) {
        var r = e.current || e.nativeElement || e;
        return kn(
          n,
          r.querySelectorAll
            ? r
            : r === e
            ? ws("Invalid scope") || pp.createElement("div")
            : e
        );
      }
    );
  },
  jv = function (e) {
    return e.sort(function () {
      return 0.5 - Math.random();
    });
  },
  Fv = function (e) {
    if (ze(e)) return e;
    var n = lr(e) ? e : { each: e },
      r = bi(n.ease),
      i = n.from || 0,
      o = parseFloat(n.base) || 0,
      l = {},
      s = i > 0 && i < 1,
      a = isNaN(i) || s,
      u = n.axis,
      c = i,
      f = i;
    return (
      it(i)
        ? (c = f = { center: 0.5, edges: 0.5, end: 1 }[i] || 0)
        : !s && a && ((c = i[0]), (f = i[1])),
      function (d, p, v) {
        var m = (v || n).length,
          x = l[m],
          g,
          h,
          y,
          _,
          k,
          E,
          C,
          T,
          N;
        if (!x) {
          if (((N = n.grid === "auto" ? 0 : (n.grid || [1, Sn])[1]), !N)) {
            for (
              C = -Sn;
              C < (C = v[N++].getBoundingClientRect().left) && N < m;

            );
            N < m && N--;
          }
          for (
            x = l[m] = [],
              g = a ? Math.min(N, m) * c - 0.5 : i % N,
              h = N === Sn ? 0 : a ? (m * f) / N - 0.5 : (i / N) | 0,
              C = 0,
              T = Sn,
              E = 0;
            E < m;
            E++
          )
            (y = (E % N) - g),
              (_ = h - ((E / N) | 0)),
              (x[E] = k = u ? Math.abs(u === "y" ? _ : y) : vv(y * y + _ * _)),
              k > C && (C = k),
              k < T && (T = k);
          i === "random" && jv(x),
            (x.max = C - T),
            (x.min = T),
            (x.v = m =
              (parseFloat(n.amount) ||
                parseFloat(n.each) *
                  (N > m
                    ? m - 1
                    : u
                    ? u === "y"
                      ? m / N
                      : N
                    : Math.max(N, m / N)) ||
                0) * (i === "edges" ? -1 : 1)),
            (x.b = m < 0 ? o - m : o),
            (x.u = wt(n.amount || n.each) || 0),
            (r = r && m < 0 ? Yv(r) : r);
        }
        return (
          (m = (x[d] - x.min) / x.max || 0),
          nt(x.b + (r ? r(m) : m) * x.v) + x.u
        );
      }
    );
  },
  Xf = function (e) {
    var n = Math.pow(10, ((e + "").split(".")[1] || "").length);
    return function (r) {
      var i = nt(Math.round(parseFloat(r) / e) * e * n);
      return (i - (i % 1)) / n + (Tr(r) ? 0 : wt(r));
    };
  },
  Av = function (e, n) {
    var r = kt(e),
      i,
      o;
    return (
      !r &&
        lr(e) &&
        ((i = r = e.radius || Sn),
        e.values
          ? ((e = kn(e.values)), (o = !Tr(e[0])) && (i *= i))
          : (e = Xf(e.increment))),
      gi(
        n,
        r
          ? ze(e)
            ? function (l) {
                return (o = e(l)), Math.abs(o - l) <= i ? o : l;
              }
            : function (l) {
                for (
                  var s = parseFloat(o ? l.x : l),
                    a = parseFloat(o ? l.y : 0),
                    u = Sn,
                    c = 0,
                    f = e.length,
                    d,
                    p;
                  f--;

                )
                  o
                    ? ((d = e[f].x - s), (p = e[f].y - a), (d = d * d + p * p))
                    : (d = Math.abs(e[f] - s)),
                    d < u && ((u = d), (c = f));
                return (
                  (c = !i || u <= i ? e[c] : l),
                  o || c === l || Tr(l) ? c : c + wt(l)
                );
              }
          : Xf(e)
      )
    );
  },
  Iv = function (e, n, r, i) {
    return gi(kt(e) ? !n : r === !0 ? !!(r = 0) : !i, function () {
      return kt(e)
        ? e[~~(Math.random() * e.length)]
        : (r = r || 1e-5) &&
            (i = r < 1 ? Math.pow(10, (r + "").length - 2) : 1) &&
            Math.floor(
              Math.round((e - r / 2 + Math.random() * (n - e + r * 0.99)) / r) *
                r *
                i
            ) / i;
    });
  },
  p2 = function () {
    for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++)
      n[r] = arguments[r];
    return function (i) {
      return n.reduce(function (o, l) {
        return l(o);
      }, i);
    };
  },
  h2 = function (e, n) {
    return function (r) {
      return e(parseFloat(r)) + (n || wt(r));
    };
  },
  m2 = function (e, n, r) {
    return $v(e, n, 0, 1, r);
  },
  bv = function (e, n, r) {
    return gi(r, function (i) {
      return e[~~n(i)];
    });
  },
  g2 = function t(e, n, r) {
    var i = n - e;
    return kt(e)
      ? bv(e, t(0, e.length), n)
      : gi(r, function (o) {
          return ((i + ((o - e) % i)) % i) + e;
        });
  },
  v2 = function t(e, n, r) {
    var i = n - e,
      o = i * 2;
    return kt(e)
      ? bv(e, t(0, e.length - 1), n)
      : gi(r, function (l) {
          return (l = (o + ((l - e) % o)) % o || 0), e + (l > i ? o - l : l);
        });
  },
  ks = function (e) {
    for (var n = 0, r = "", i, o, l, s; ~(i = e.indexOf("random(", n)); )
      (l = e.indexOf(")", i)),
        (s = e.charAt(i + 7) === "["),
        (o = e.substr(i + 7, l - i - 7).match(s ? wv : $f)),
        (r +=
          e.substr(n, i - n) + Iv(s ? o : +o[0], s ? 0 : +o[1], +o[2] || 1e-5)),
        (n = l + 1);
    return r + e.substr(n, e.length - n);
  },
  $v = function (e, n, r, i, o) {
    var l = n - e,
      s = i - r;
    return gi(o, function (a) {
      return r + (((a - e) / l) * s || 0);
    });
  },
  y2 = function t(e, n, r, i) {
    var o = isNaN(e + n)
      ? 0
      : function (p) {
          return (1 - p) * e + p * n;
        };
    if (!o) {
      var l = it(e),
        s = {},
        a,
        u,
        c,
        f,
        d;
      if ((r === !0 && (i = 1) && (r = null), l))
        (e = { p: e }), (n = { p: n });
      else if (kt(e) && !kt(n)) {
        for (c = [], f = e.length, d = f - 2, u = 1; u < f; u++)
          c.push(t(e[u - 1], e[u]));
        f--,
          (o = function (v) {
            v *= f;
            var m = Math.min(d, ~~v);
            return c[m](v - m);
          }),
          (r = n);
      } else i || (e = Gi(kt(e) ? [] : {}, e));
      if (!c) {
        for (a in n) yp.call(s, e, a, "get", n[a]);
        o = function (v) {
          return Sp(v, s) || (l ? e.p : e);
        };
      }
    }
    return gi(r, o);
  },
  r0 = function (e, n, r) {
    var i = e.labels,
      o = Sn,
      l,
      s,
      a;
    for (l in i)
      (s = i[l] - n),
        s < 0 == !!r && s && o > (s = Math.abs(s)) && ((a = l), (o = s));
    return a;
  },
  an = function (e, n, r) {
    var i = e.vars,
      o = i[n],
      l = we,
      s = e._ctx,
      a,
      u,
      c;
    if (o)
      return (
        (a = i[n + "Params"]),
        (u = i.callbackScope || e),
        r && ii.length && vu(),
        s && (we = s),
        (c = a ? o.apply(u, a) : o.call(u)),
        (we = l),
        c
      );
  },
  Rl = function (e) {
    return (
      ui(e),
      e.scrollTrigger && e.scrollTrigger.kill(!!St),
      e.progress() < 1 && an(e, "onInterrupt"),
      e
    );
  },
  Oo,
  Bv = [],
  Uv = function (e) {
    if (e)
      if (((e = (!e.name && e.default) || e), dp() || e.headless)) {
        var n = e.name,
          r = ze(e),
          i =
            n && !r && e.init
              ? function () {
                  this._props = [];
                }
              : e,
          o = {
            init: Ss,
            render: Sp,
            add: yp,
            kill: D2,
            modifier: z2,
            rawVars: 0,
          },
          l = {
            targetTest: 0,
            get: 0,
            getSetter: wp,
            aliases: {},
            register: 0,
          };
        if ((el(), e !== i)) {
          if (rn[n]) return;
          Nn(i, Nn(yu(e, o), l)),
            Gi(i.prototype, Gi(o, yu(e, l))),
            (rn[(i.prop = n)] = i),
            e.targetTest && (Aa.push(i), (mp[n] = 1)),
            (n =
              (n === "css" ? "CSS" : n.charAt(0).toUpperCase() + n.substr(1)) +
              "Plugin");
        }
        Cv(n, i), e.register && e.register(Kt, i, Qt);
      } else Bv.push(e);
  },
  de = 255,
  Ol = {
    aqua: [0, de, de],
    lime: [0, de, 0],
    silver: [192, 192, 192],
    black: [0, 0, 0],
    maroon: [128, 0, 0],
    teal: [0, 128, 128],
    blue: [0, 0, de],
    navy: [0, 0, 128],
    white: [de, de, de],
    olive: [128, 128, 0],
    yellow: [de, de, 0],
    orange: [de, 165, 0],
    gray: [128, 128, 128],
    purple: [128, 0, 128],
    green: [0, 128, 0],
    red: [de, 0, 0],
    pink: [de, 192, 203],
    cyan: [0, de, de],
    transparent: [de, de, de, 0],
  },
  Rc = function (e, n, r) {
    return (
      (e += e < 0 ? 1 : e > 1 ? -1 : 0),
      ((e * 6 < 1
        ? n + (r - n) * e * 6
        : e < 0.5
        ? r
        : e * 3 < 2
        ? n + (r - n) * (2 / 3 - e) * 6
        : n) *
        de +
        0.5) |
        0
    );
  },
  Vv = function (e, n, r) {
    var i = e ? (Tr(e) ? [e >> 16, (e >> 8) & de, e & de] : 0) : Ol.black,
      o,
      l,
      s,
      a,
      u,
      c,
      f,
      d,
      p,
      v;
    if (!i) {
      if ((e.substr(-1) === "," && (e = e.substr(0, e.length - 1)), Ol[e]))
        i = Ol[e];
      else if (e.charAt(0) === "#") {
        if (
          (e.length < 6 &&
            ((o = e.charAt(1)),
            (l = e.charAt(2)),
            (s = e.charAt(3)),
            (e =
              "#" +
              o +
              o +
              l +
              l +
              s +
              s +
              (e.length === 5 ? e.charAt(4) + e.charAt(4) : ""))),
          e.length === 9)
        )
          return (
            (i = parseInt(e.substr(1, 6), 16)),
            [i >> 16, (i >> 8) & de, i & de, parseInt(e.substr(7), 16) / 255]
          );
        (e = parseInt(e.substr(1), 16)), (i = [e >> 16, (e >> 8) & de, e & de]);
      } else if (e.substr(0, 3) === "hsl") {
        if (((i = v = e.match($f)), !n))
          (a = (+i[0] % 360) / 360),
            (u = +i[1] / 100),
            (c = +i[2] / 100),
            (l = c <= 0.5 ? c * (u + 1) : c + u - c * u),
            (o = c * 2 - l),
            i.length > 3 && (i[3] *= 1),
            (i[0] = Rc(a + 1 / 3, o, l)),
            (i[1] = Rc(a, o, l)),
            (i[2] = Rc(a - 1 / 3, o, l));
        else if (~e.indexOf("="))
          return (i = e.match(_v)), r && i.length < 4 && (i[3] = 1), i;
      } else i = e.match($f) || Ol.transparent;
      i = i.map(Number);
    }
    return (
      n &&
        !v &&
        ((o = i[0] / de),
        (l = i[1] / de),
        (s = i[2] / de),
        (f = Math.max(o, l, s)),
        (d = Math.min(o, l, s)),
        (c = (f + d) / 2),
        f === d
          ? (a = u = 0)
          : ((p = f - d),
            (u = c > 0.5 ? p / (2 - f - d) : p / (f + d)),
            (a =
              f === o
                ? (l - s) / p + (l < s ? 6 : 0)
                : f === l
                ? (s - o) / p + 2
                : (o - l) / p + 4),
            (a *= 60)),
        (i[0] = ~~(a + 0.5)),
        (i[1] = ~~(u * 100 + 0.5)),
        (i[2] = ~~(c * 100 + 0.5))),
      r && i.length < 4 && (i[3] = 1),
      i
    );
  },
  Hv = function (e) {
    var n = [],
      r = [],
      i = -1;
    return (
      e.split(oi).forEach(function (o) {
        var l = o.match(Ro) || [];
        n.push.apply(n, l), r.push((i += l.length + 1));
      }),
      (n.c = r),
      n
    );
  },
  i0 = function (e, n, r) {
    var i = "",
      o = (e + i).match(oi),
      l = n ? "hsla(" : "rgba(",
      s = 0,
      a,
      u,
      c,
      f;
    if (!o) return e;
    if (
      ((o = o.map(function (d) {
        return (
          (d = Vv(d, n, 1)) &&
          l +
            (n ? d[0] + "," + d[1] + "%," + d[2] + "%," + d[3] : d.join(",")) +
            ")"
        );
      })),
      r && ((c = Hv(e)), (a = r.c), a.join(i) !== c.c.join(i)))
    )
      for (u = e.replace(oi, "1").split(Ro), f = u.length - 1; s < f; s++)
        i +=
          u[s] +
          (~a.indexOf(s)
            ? o.shift() || l + "0,0,0,0)"
            : (c.length ? c : o.length ? o : r).shift());
    if (!u)
      for (u = e.split(oi), f = u.length - 1; s < f; s++) i += u[s] + o[s];
    return i + u[f];
  },
  oi = (function () {
    var t =
        "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",
      e;
    for (e in Ol) t += "|" + e + "\\b";
    return new RegExp(t + ")", "gi");
  })(),
  _2 = /hsl[a]?\(/,
  Wv = function (e) {
    var n = e.join(" "),
      r;
    if (((oi.lastIndex = 0), oi.test(n)))
      return (
        (r = _2.test(n)),
        (e[1] = i0(e[1], r)),
        (e[0] = i0(e[0], r, Hv(e[1]))),
        !0
      );
  },
  Cs,
  on = (function () {
    var t = Date.now,
      e = 500,
      n = 33,
      r = t(),
      i = r,
      o = 1e3 / 240,
      l = o,
      s = [],
      a,
      u,
      c,
      f,
      d,
      p,
      v = function m(x) {
        var g = t() - i,
          h = x === !0,
          y,
          _,
          k,
          E;
        if (
          ((g > e || g < 0) && (r += g - n),
          (i += g),
          (k = i - r),
          (y = k - l),
          (y > 0 || h) &&
            ((E = ++f.frame),
            (d = k - f.time * 1e3),
            (f.time = k = k / 1e3),
            (l += y + (y >= o ? 4 : o - y)),
            (_ = 1)),
          h || (a = u(m)),
          _)
        )
          for (p = 0; p < s.length; p++) s[p](k, d, E, x);
      };
    return (
      (f = {
        time: 0,
        frame: 0,
        tick: function () {
          v(!0);
        },
        deltaRatio: function (x) {
          return d / (1e3 / (x || 60));
        },
        wake: function () {
          Sv &&
            (!Bf &&
              dp() &&
              ((Gn = Bf = window),
              (pp = Gn.document || {}),
              (dn.gsap = Kt),
              (Gn.gsapVersions || (Gn.gsapVersions = [])).push(Kt.version),
              kv(gu || Gn.GreenSockGlobals || (!Gn.gsap && Gn) || {}),
              Bv.forEach(Uv)),
            (c = typeof requestAnimationFrame < "u" && requestAnimationFrame),
            a && f.sleep(),
            (u =
              c ||
              function (x) {
                return setTimeout(x, (l - f.time * 1e3 + 1) | 0);
              }),
            (Cs = 1),
            v(2));
        },
        sleep: function () {
          (c ? cancelAnimationFrame : clearTimeout)(a), (Cs = 0), (u = Ss);
        },
        lagSmoothing: function (x, g) {
          (e = x || 1 / 0), (n = Math.min(g || 33, e));
        },
        fps: function (x) {
          (o = 1e3 / (x || 240)), (l = f.time * 1e3 + o);
        },
        add: function (x, g, h) {
          var y = g
            ? function (_, k, E, C) {
                x(_, k, E, C), f.remove(y);
              }
            : x;
          return f.remove(x), s[h ? "unshift" : "push"](y), el(), y;
        },
        remove: function (x, g) {
          ~(g = s.indexOf(x)) && s.splice(g, 1) && p >= g && p--;
        },
        _listeners: s,
      }),
      f
    );
  })(),
  el = function () {
    return !Cs && on.wake();
  },
  ie = {},
  x2 = /^[\d.\-M][\d.\-,\s]/,
  w2 = /["']/g,
  S2 = function (e) {
    for (
      var n = {},
        r = e.substr(1, e.length - 3).split(":"),
        i = r[0],
        o = 1,
        l = r.length,
        s,
        a,
        u;
      o < l;
      o++
    )
      (a = r[o]),
        (s = o !== l - 1 ? a.lastIndexOf(",") : a.length),
        (u = a.substr(0, s)),
        (n[i] = isNaN(u) ? u.replace(w2, "").trim() : +u),
        (i = a.substr(s + 1).trim());
    return n;
  },
  k2 = function (e) {
    var n = e.indexOf("(") + 1,
      r = e.indexOf(")"),
      i = e.indexOf("(", n);
    return e.substring(n, ~i && i < r ? e.indexOf(")", r + 1) : r);
  },
  C2 = function (e) {
    var n = (e + "").split("("),
      r = ie[n[0]];
    return r && n.length > 1 && r.config
      ? r.config.apply(
          null,
          ~e.indexOf("{") ? [S2(n[1])] : k2(e).split(",").map(Nv)
        )
      : ie._CE && x2.test(e)
      ? ie._CE("", e)
      : r;
  },
  Yv = function (e) {
    return function (n) {
      return 1 - e(1 - n);
    };
  },
  Xv = function t(e, n) {
    for (var r = e._first, i; r; )
      r instanceof zt
        ? t(r, n)
        : r.vars.yoyoEase &&
          (!r._yoyo || !r._repeat) &&
          r._yoyo !== n &&
          (r.timeline
            ? t(r.timeline, n)
            : ((i = r._ease),
              (r._ease = r._yEase),
              (r._yEase = i),
              (r._yoyo = n))),
        (r = r._next);
  },
  bi = function (e, n) {
    return (e && (ze(e) ? e : ie[e] || C2(e))) || n;
  },
  ro = function (e, n, r, i) {
    r === void 0 &&
      (r = function (a) {
        return 1 - n(1 - a);
      }),
      i === void 0 &&
        (i = function (a) {
          return a < 0.5 ? n(a * 2) / 2 : 1 - n((1 - a) * 2) / 2;
        });
    var o = { easeIn: n, easeOut: r, easeInOut: i },
      l;
    return (
      Xt(e, function (s) {
        (ie[s] = dn[s] = o), (ie[(l = s.toLowerCase())] = r);
        for (var a in o)
          ie[
            l + (a === "easeIn" ? ".in" : a === "easeOut" ? ".out" : ".inOut")
          ] = ie[s + "." + a] = o[a];
      }),
      o
    );
  },
  Qv = function (e) {
    return function (n) {
      return n < 0.5 ? (1 - e(1 - n * 2)) / 2 : 0.5 + e((n - 0.5) * 2) / 2;
    };
  },
  Oc = function t(e, n, r) {
    var i = n >= 1 ? n : 1,
      o = (r || (e ? 0.3 : 0.45)) / (n < 1 ? n : 1),
      l = (o / bf) * (Math.asin(1 / i) || 0),
      s = function (c) {
        return c === 1 ? 1 : i * Math.pow(2, -10 * c) * Jw((c - l) * o) + 1;
      },
      a =
        e === "out"
          ? s
          : e === "in"
          ? function (u) {
              return 1 - s(1 - u);
            }
          : Qv(s);
    return (
      (o = bf / o),
      (a.config = function (u, c) {
        return t(e, u, c);
      }),
      a
    );
  },
  Mc = function t(e, n) {
    n === void 0 && (n = 1.70158);
    var r = function (l) {
        return l ? --l * l * ((n + 1) * l + n) + 1 : 0;
      },
      i =
        e === "out"
          ? r
          : e === "in"
          ? function (o) {
              return 1 - r(1 - o);
            }
          : Qv(r);
    return (
      (i.config = function (o) {
        return t(e, o);
      }),
      i
    );
  };
Xt("Linear,Quad,Cubic,Quart,Quint,Strong", function (t, e) {
  var n = e < 5 ? e + 1 : e;
  ro(
    t + ",Power" + (n - 1),
    e
      ? function (r) {
          return Math.pow(r, n);
        }
      : function (r) {
          return r;
        },
    function (r) {
      return 1 - Math.pow(1 - r, n);
    },
    function (r) {
      return r < 0.5
        ? Math.pow(r * 2, n) / 2
        : 1 - Math.pow((1 - r) * 2, n) / 2;
    }
  );
});
ie.Linear.easeNone = ie.none = ie.Linear.easeIn;
ro("Elastic", Oc("in"), Oc("out"), Oc());
(function (t, e) {
  var n = 1 / e,
    r = 2 * n,
    i = 2.5 * n,
    o = function (s) {
      return s < n
        ? t * s * s
        : s < r
        ? t * Math.pow(s - 1.5 / e, 2) + 0.75
        : s < i
        ? t * (s -= 2.25 / e) * s + 0.9375
        : t * Math.pow(s - 2.625 / e, 2) + 0.984375;
    };
  ro(
    "Bounce",
    function (l) {
      return 1 - o(1 - l);
    },
    o
  );
})(7.5625, 2.75);
ro("Expo", function (t) {
  return t ? Math.pow(2, 10 * (t - 1)) : 0;
});
ro("Circ", function (t) {
  return -(vv(1 - t * t) - 1);
});
ro("Sine", function (t) {
  return t === 1 ? 1 : -qw(t * Gw) + 1;
});
ro("Back", Mc("in"), Mc("out"), Mc());
ie.SteppedEase =
  ie.steps =
  dn.SteppedEase =
    {
      config: function (e, n) {
        e === void 0 && (e = 1);
        var r = 1 / e,
          i = e + (n ? 0 : 1),
          o = n ? 1 : 0,
          l = 1 - pe;
        return function (s) {
          return (((i * Is(0, l, s)) | 0) + o) * r;
        };
      },
    };
qo.ease = ie["quad.out"];
Xt(
  "onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",
  function (t) {
    return (gp += t + "," + t + "Params,");
  }
);
var Gv = function (e, n) {
    (this.id = Kw++),
      (e._gsap = this),
      (this.target = e),
      (this.harness = n),
      (this.get = n ? n.get : Pv),
      (this.set = n ? n.getSetter : wp);
  },
  Es = (function () {
    function t(n) {
      (this.vars = n),
        (this._delay = +n.delay || 0),
        (this._repeat = n.repeat === 1 / 0 ? -2 : n.repeat || 0) &&
          ((this._rDelay = n.repeatDelay || 0),
          (this._yoyo = !!n.yoyo || !!n.yoyoEase)),
        (this._ts = 1),
        Zo(this, +n.duration, 1, 1),
        (this.data = n.data),
        we && ((this._ctx = we), we.data.push(this)),
        Cs || on.wake();
    }
    var e = t.prototype;
    return (
      (e.delay = function (r) {
        return r || r === 0
          ? (this.parent &&
              this.parent.smoothChildTiming &&
              this.startTime(this._start + r - this._delay),
            (this._delay = r),
            this)
          : this._delay;
      }),
      (e.duration = function (r) {
        return arguments.length
          ? this.totalDuration(
              this._repeat > 0 ? r + (r + this._rDelay) * this._repeat : r
            )
          : this.totalDuration() && this._dur;
      }),
      (e.totalDuration = function (r) {
        return arguments.length
          ? ((this._dirty = 0),
            Zo(
              this,
              this._repeat < 0
                ? r
                : (r - this._repeat * this._rDelay) / (this._repeat + 1)
            ))
          : this._tDur;
      }),
      (e.totalTime = function (r, i) {
        if ((el(), !arguments.length)) return this._tTime;
        var o = this._dp;
        if (o && o.smoothChildTiming && this._ts) {
          for (Ku(this, r), !o._dp || o.parent || Mv(o, this); o && o.parent; )
            o.parent._time !==
              o._start +
                (o._ts >= 0
                  ? o._tTime / o._ts
                  : (o.totalDuration() - o._tTime) / -o._ts) &&
              o.totalTime(o._tTime, !0),
              (o = o.parent);
          !this.parent &&
            this._dp.autoRemoveChildren &&
            ((this._ts > 0 && r < this._tDur) ||
              (this._ts < 0 && r > 0) ||
              (!this._tDur && !r)) &&
            Jn(this._dp, this, this._start - this._delay);
        }
        return (
          (this._tTime !== r ||
            (!this._dur && !i) ||
            (this._initted && Math.abs(this._zTime) === pe) ||
            (!r && !this._initted && (this.add || this._ptLookup))) &&
            (this._ts || (this._pTime = r), Tv(this, r, i)),
          this
        );
      }),
      (e.time = function (r, i) {
        return arguments.length
          ? this.totalTime(
              Math.min(this.totalDuration(), r + t0(this)) %
                (this._dur + this._rDelay) || (r ? this._dur : 0),
              i
            )
          : this._time;
      }),
      (e.totalProgress = function (r, i) {
        return arguments.length
          ? this.totalTime(this.totalDuration() * r, i)
          : this.totalDuration()
          ? Math.min(1, this._tTime / this._tDur)
          : this.rawTime() > 0
          ? 1
          : 0;
      }),
      (e.progress = function (r, i) {
        return arguments.length
          ? this.totalTime(
              this.duration() *
                (this._yoyo && !(this.iteration() & 1) ? 1 - r : r) +
                t0(this),
              i
            )
          : this.duration()
          ? Math.min(1, this._time / this._dur)
          : this.rawTime() > 0
          ? 1
          : 0;
      }),
      (e.iteration = function (r, i) {
        var o = this.duration() + this._rDelay;
        return arguments.length
          ? this.totalTime(this._time + (r - 1) * o, i)
          : this._repeat
          ? Jo(this._tTime, o) + 1
          : 1;
      }),
      (e.timeScale = function (r, i) {
        if (!arguments.length) return this._rts === -pe ? 0 : this._rts;
        if (this._rts === r) return this;
        var o =
          this.parent && this._ts ? _u(this.parent._time, this) : this._tTime;
        return (
          (this._rts = +r || 0),
          (this._ts = this._ps || r === -pe ? 0 : this._rts),
          this.totalTime(Is(-Math.abs(this._delay), this._tDur, o), i !== !1),
          Gu(this),
          o2(this)
        );
      }),
      (e.paused = function (r) {
        return arguments.length
          ? (this._ps !== r &&
              ((this._ps = r),
              r
                ? ((this._pTime =
                    this._tTime || Math.max(-this._delay, this.rawTime())),
                  (this._ts = this._act = 0))
                : (el(),
                  (this._ts = this._rts),
                  this.totalTime(
                    this.parent && !this.parent.smoothChildTiming
                      ? this.rawTime()
                      : this._tTime || this._pTime,
                    this.progress() === 1 &&
                      Math.abs(this._zTime) !== pe &&
                      (this._tTime -= pe)
                  ))),
            this)
          : this._ps;
      }),
      (e.startTime = function (r) {
        if (arguments.length) {
          this._start = r;
          var i = this.parent || this._dp;
          return (
            i && (i._sort || !this.parent) && Jn(i, this, r - this._delay), this
          );
        }
        return this._start;
      }),
      (e.endTime = function (r) {
        return (
          this._start +
          (Yt(r) ? this.totalDuration() : this.duration()) /
            Math.abs(this._ts || 1)
        );
      }),
      (e.rawTime = function (r) {
        var i = this.parent || this._dp;
        return i
          ? r &&
            (!this._ts ||
              (this._repeat && this._time && this.totalProgress() < 1))
            ? this._tTime % (this._dur + this._rDelay)
            : this._ts
            ? _u(i.rawTime(r), this)
            : this._tTime
          : this._tTime;
      }),
      (e.revert = function (r) {
        r === void 0 && (r = t2);
        var i = St;
        return (
          (St = r),
          (this._initted || this._startAt) &&
            (this.timeline && this.timeline.revert(r),
            this.totalTime(-0.01, r.suppressEvents)),
          this.data !== "nested" && r.kill !== !1 && this.kill(),
          (St = i),
          this
        );
      }),
      (e.globalTime = function (r) {
        for (var i = this, o = arguments.length ? r : i.rawTime(); i; )
          (o = i._start + o / (Math.abs(i._ts) || 1)), (i = i._dp);
        return !this.parent && this._sat ? this._sat.globalTime(r) : o;
      }),
      (e.repeat = function (r) {
        return arguments.length
          ? ((this._repeat = r === 1 / 0 ? -2 : r), n0(this))
          : this._repeat === -2
          ? 1 / 0
          : this._repeat;
      }),
      (e.repeatDelay = function (r) {
        if (arguments.length) {
          var i = this._time;
          return (this._rDelay = r), n0(this), i ? this.time(i) : this;
        }
        return this._rDelay;
      }),
      (e.yoyo = function (r) {
        return arguments.length ? ((this._yoyo = r), this) : this._yoyo;
      }),
      (e.seek = function (r, i) {
        return this.totalTime(gn(this, r), Yt(i));
      }),
      (e.restart = function (r, i) {
        return this.play().totalTime(r ? -this._delay : 0, Yt(i));
      }),
      (e.play = function (r, i) {
        return r != null && this.seek(r, i), this.reversed(!1).paused(!1);
      }),
      (e.reverse = function (r, i) {
        return (
          r != null && this.seek(r || this.totalDuration(), i),
          this.reversed(!0).paused(!1)
        );
      }),
      (e.pause = function (r, i) {
        return r != null && this.seek(r, i), this.paused(!0);
      }),
      (e.resume = function () {
        return this.paused(!1);
      }),
      (e.reversed = function (r) {
        return arguments.length
          ? (!!r !== this.reversed() &&
              this.timeScale(-this._rts || (r ? -pe : 0)),
            this)
          : this._rts < 0;
      }),
      (e.invalidate = function () {
        return (this._initted = this._act = 0), (this._zTime = -pe), this;
      }),
      (e.isActive = function () {
        var r = this.parent || this._dp,
          i = this._start,
          o;
        return !!(
          !r ||
          (this._ts &&
            this._initted &&
            r.isActive() &&
            (o = r.rawTime(!0)) >= i &&
            o < this.endTime(!0) - pe)
        );
      }),
      (e.eventCallback = function (r, i, o) {
        var l = this.vars;
        return arguments.length > 1
          ? (i
              ? ((l[r] = i),
                o && (l[r + "Params"] = o),
                r === "onUpdate" && (this._onUpdate = i))
              : delete l[r],
            this)
          : l[r];
      }),
      (e.then = function (r) {
        var i = this;
        return new Promise(function (o) {
          var l = ze(r) ? r : Rv,
            s = function () {
              var u = i.then;
              (i.then = null),
                ze(l) && (l = l(i)) && (l.then || l === i) && (i.then = u),
                o(l),
                (i.then = u);
            };
          (i._initted && i.totalProgress() === 1 && i._ts >= 0) ||
          (!i._tTime && i._ts < 0)
            ? s()
            : (i._prom = s);
        });
      }),
      (e.kill = function () {
        Rl(this);
      }),
      t
    );
  })();
Nn(Es.prototype, {
  _time: 0,
  _start: 0,
  _end: 0,
  _tTime: 0,
  _tDur: 0,
  _dirty: 0,
  _repeat: 0,
  _yoyo: !1,
  parent: null,
  _initted: !1,
  _rDelay: 0,
  _ts: 1,
  _dp: 0,
  ratio: 0,
  _zTime: -pe,
  _prom: 0,
  _ps: !1,
  _rts: 1,
});
var zt = (function (t) {
  gv(e, t);
  function e(r, i) {
    var o;
    return (
      r === void 0 && (r = {}),
      (o = t.call(this, r) || this),
      (o.labels = {}),
      (o.smoothChildTiming = !!r.smoothChildTiming),
      (o.autoRemoveChildren = !!r.autoRemoveChildren),
      (o._sort = Yt(r.sortChildren)),
      Pe && Jn(r.parent || Pe, dr(o), i),
      r.reversed && o.reverse(),
      r.paused && o.paused(!0),
      r.scrollTrigger && Lv(dr(o), r.scrollTrigger),
      o
    );
  }
  var n = e.prototype;
  return (
    (n.to = function (i, o, l) {
      return Yl(0, arguments, this), this;
    }),
    (n.from = function (i, o, l) {
      return Yl(1, arguments, this), this;
    }),
    (n.fromTo = function (i, o, l, s) {
      return Yl(2, arguments, this), this;
    }),
    (n.set = function (i, o, l) {
      return (
        (o.duration = 0),
        (o.parent = this),
        Wl(o).repeatDelay || (o.repeat = 0),
        (o.immediateRender = !!o.immediateRender),
        new He(i, o, gn(this, l), 1),
        this
      );
    }),
    (n.call = function (i, o, l) {
      return Jn(this, He.delayedCall(0, i, o), l);
    }),
    (n.staggerTo = function (i, o, l, s, a, u, c) {
      return (
        (l.duration = o),
        (l.stagger = l.stagger || s),
        (l.onComplete = u),
        (l.onCompleteParams = c),
        (l.parent = this),
        new He(i, l, gn(this, a)),
        this
      );
    }),
    (n.staggerFrom = function (i, o, l, s, a, u, c) {
      return (
        (l.runBackwards = 1),
        (Wl(l).immediateRender = Yt(l.immediateRender)),
        this.staggerTo(i, o, l, s, a, u, c)
      );
    }),
    (n.staggerFromTo = function (i, o, l, s, a, u, c, f) {
      return (
        (s.startAt = l),
        (Wl(s).immediateRender = Yt(s.immediateRender)),
        this.staggerTo(i, o, s, a, u, c, f)
      );
    }),
    (n.render = function (i, o, l) {
      var s = this._time,
        a = this._dirty ? this.totalDuration() : this._tDur,
        u = this._dur,
        c = i <= 0 ? 0 : nt(i),
        f = this._zTime < 0 != i < 0 && (this._initted || !u),
        d,
        p,
        v,
        m,
        x,
        g,
        h,
        y,
        _,
        k,
        E,
        C;
      if (
        (this !== Pe && c > a && i >= 0 && (c = a), c !== this._tTime || l || f)
      ) {
        if (
          (s !== this._time &&
            u &&
            ((c += this._time - s), (i += this._time - s)),
          (d = c),
          (_ = this._start),
          (y = this._ts),
          (g = !y),
          f && (u || (s = this._zTime), (i || !o) && (this._zTime = i)),
          this._repeat)
        ) {
          if (
            ((E = this._yoyo),
            (x = u + this._rDelay),
            this._repeat < -1 && i < 0)
          )
            return this.totalTime(x * 100 + i, o, l);
          if (
            ((d = nt(c % x)),
            c === a
              ? ((m = this._repeat), (d = u))
              : ((m = ~~(c / x)),
                m && m === c / x && ((d = u), m--),
                d > u && (d = u)),
            (k = Jo(this._tTime, x)),
            !s &&
              this._tTime &&
              k !== m &&
              this._tTime - k * x - this._dur <= 0 &&
              (k = m),
            E && m & 1 && ((d = u - d), (C = 1)),
            m !== k && !this._lock)
          ) {
            var T = E && k & 1,
              N = T === (E && m & 1);
            if (
              (m < k && (T = !T),
              (s = T ? 0 : c % u ? u : c),
              (this._lock = 1),
              (this.render(s || (C ? 0 : nt(m * x)), o, !u)._lock = 0),
              (this._tTime = c),
              !o && this.parent && an(this, "onRepeat"),
              this.vars.repeatRefresh && !C && (this.invalidate()._lock = 1),
              (s && s !== this._time) ||
                g !== !this._ts ||
                (this.vars.onRepeat && !this.parent && !this._act))
            )
              return this;
            if (
              ((u = this._dur),
              (a = this._tDur),
              N &&
                ((this._lock = 2),
                (s = T ? u : -1e-4),
                this.render(s, !0),
                this.vars.repeatRefresh && !C && this.invalidate()),
              (this._lock = 0),
              !this._ts && !g)
            )
              return this;
            Xv(this, C);
          }
        }
        if (
          (this._hasPause &&
            !this._forcing &&
            this._lock < 2 &&
            ((h = u2(this, nt(s), nt(d))), h && (c -= d - (d = h._start))),
          (this._tTime = c),
          (this._time = d),
          (this._act = !y),
          this._initted ||
            ((this._onUpdate = this.vars.onUpdate),
            (this._initted = 1),
            (this._zTime = i),
            (s = 0)),
          !s && d && !o && !m && (an(this, "onStart"), this._tTime !== c))
        )
          return this;
        if (d >= s && i >= 0)
          for (p = this._first; p; ) {
            if (
              ((v = p._next), (p._act || d >= p._start) && p._ts && h !== p)
            ) {
              if (p.parent !== this) return this.render(i, o, l);
              if (
                (p.render(
                  p._ts > 0
                    ? (d - p._start) * p._ts
                    : (p._dirty ? p.totalDuration() : p._tDur) +
                        (d - p._start) * p._ts,
                  o,
                  l
                ),
                d !== this._time || (!this._ts && !g))
              ) {
                (h = 0), v && (c += this._zTime = -pe);
                break;
              }
            }
            p = v;
          }
        else {
          p = this._last;
          for (var R = i < 0 ? i : d; p; ) {
            if (((v = p._prev), (p._act || R <= p._end) && p._ts && h !== p)) {
              if (p.parent !== this) return this.render(i, o, l);
              if (
                (p.render(
                  p._ts > 0
                    ? (R - p._start) * p._ts
                    : (p._dirty ? p.totalDuration() : p._tDur) +
                        (R - p._start) * p._ts,
                  o,
                  l || (St && (p._initted || p._startAt))
                ),
                d !== this._time || (!this._ts && !g))
              ) {
                (h = 0), v && (c += this._zTime = R ? -pe : pe);
                break;
              }
            }
            p = v;
          }
        }
        if (
          h &&
          !o &&
          (this.pause(),
          (h.render(d >= s ? 0 : -pe)._zTime = d >= s ? 1 : -1),
          this._ts)
        )
          return (this._start = _), Gu(this), this.render(i, o, l);
        this._onUpdate && !o && an(this, "onUpdate", !0),
          ((c === a && this._tTime >= this.totalDuration()) || (!c && s)) &&
            (_ === this._start || Math.abs(y) !== Math.abs(this._ts)) &&
            (this._lock ||
              ((i || !u) &&
                ((c === a && this._ts > 0) || (!c && this._ts < 0)) &&
                ui(this, 1),
              !o &&
                !(i < 0 && !s) &&
                (c || s || !a) &&
                (an(
                  this,
                  c === a && i >= 0 ? "onComplete" : "onReverseComplete",
                  !0
                ),
                this._prom &&
                  !(c < a && this.timeScale() > 0) &&
                  this._prom())));
      }
      return this;
    }),
    (n.add = function (i, o) {
      var l = this;
      if ((Tr(o) || (o = gn(this, o, i)), !(i instanceof Es))) {
        if (kt(i))
          return (
            i.forEach(function (s) {
              return l.add(s, o);
            }),
            this
          );
        if (it(i)) return this.addLabel(i, o);
        if (ze(i)) i = He.delayedCall(0, i);
        else return this;
      }
      return this !== i ? Jn(this, i, o) : this;
    }),
    (n.getChildren = function (i, o, l, s) {
      i === void 0 && (i = !0),
        o === void 0 && (o = !0),
        l === void 0 && (l = !0),
        s === void 0 && (s = -Sn);
      for (var a = [], u = this._first; u; )
        u._start >= s &&
          (u instanceof He
            ? o && a.push(u)
            : (l && a.push(u), i && a.push.apply(a, u.getChildren(!0, o, l)))),
          (u = u._next);
      return a;
    }),
    (n.getById = function (i) {
      for (var o = this.getChildren(1, 1, 1), l = o.length; l--; )
        if (o[l].vars.id === i) return o[l];
    }),
    (n.remove = function (i) {
      return it(i)
        ? this.removeLabel(i)
        : ze(i)
        ? this.killTweensOf(i)
        : (Qu(this, i),
          i === this._recent && (this._recent = this._last),
          Ii(this));
    }),
    (n.totalTime = function (i, o) {
      return arguments.length
        ? ((this._forcing = 1),
          !this._dp &&
            this._ts &&
            (this._start = nt(
              on.time -
                (this._ts > 0
                  ? i / this._ts
                  : (this.totalDuration() - i) / -this._ts)
            )),
          t.prototype.totalTime.call(this, i, o),
          (this._forcing = 0),
          this)
        : this._tTime;
    }),
    (n.addLabel = function (i, o) {
      return (this.labels[i] = gn(this, o)), this;
    }),
    (n.removeLabel = function (i) {
      return delete this.labels[i], this;
    }),
    (n.addPause = function (i, o, l) {
      var s = He.delayedCall(0, o || Ss, l);
      return (
        (s.data = "isPause"), (this._hasPause = 1), Jn(this, s, gn(this, i))
      );
    }),
    (n.removePause = function (i) {
      var o = this._first;
      for (i = gn(this, i); o; )
        o._start === i && o.data === "isPause" && ui(o), (o = o._next);
    }),
    (n.killTweensOf = function (i, o, l) {
      for (var s = this.getTweensOf(i, l), a = s.length; a--; )
        Wr !== s[a] && s[a].kill(i, o);
      return this;
    }),
    (n.getTweensOf = function (i, o) {
      for (var l = [], s = kn(i), a = this._first, u = Tr(o), c; a; )
        a instanceof He
          ? n2(a._targets, s) &&
            (u
              ? (!Wr || (a._initted && a._ts)) &&
                a.globalTime(0) <= o &&
                a.globalTime(a.totalDuration()) > o
              : !o || a.isActive()) &&
            l.push(a)
          : (c = a.getTweensOf(s, o)).length && l.push.apply(l, c),
          (a = a._next);
      return l;
    }),
    (n.tweenTo = function (i, o) {
      o = o || {};
      var l = this,
        s = gn(l, i),
        a = o,
        u = a.startAt,
        c = a.onStart,
        f = a.onStartParams,
        d = a.immediateRender,
        p,
        v = He.to(
          l,
          Nn(
            {
              ease: o.ease || "none",
              lazy: !1,
              immediateRender: !1,
              time: s,
              overwrite: "auto",
              duration:
                o.duration ||
                Math.abs(
                  (s - (u && "time" in u ? u.time : l._time)) / l.timeScale()
                ) ||
                pe,
              onStart: function () {
                if ((l.pause(), !p)) {
                  var x =
                    o.duration ||
                    Math.abs(
                      (s - (u && "time" in u ? u.time : l._time)) /
                        l.timeScale()
                    );
                  v._dur !== x && Zo(v, x, 0, 1).render(v._time, !0, !0),
                    (p = 1);
                }
                c && c.apply(v, f || []);
              },
            },
            o
          )
        );
      return d ? v.render(0) : v;
    }),
    (n.tweenFromTo = function (i, o, l) {
      return this.tweenTo(o, Nn({ startAt: { time: gn(this, i) } }, l));
    }),
    (n.recent = function () {
      return this._recent;
    }),
    (n.nextLabel = function (i) {
      return i === void 0 && (i = this._time), r0(this, gn(this, i));
    }),
    (n.previousLabel = function (i) {
      return i === void 0 && (i = this._time), r0(this, gn(this, i), 1);
    }),
    (n.currentLabel = function (i) {
      return arguments.length
        ? this.seek(i, !0)
        : this.previousLabel(this._time + pe);
    }),
    (n.shiftChildren = function (i, o, l) {
      l === void 0 && (l = 0);
      for (var s = this._first, a = this.labels, u; s; )
        s._start >= l && ((s._start += i), (s._end += i)), (s = s._next);
      if (o) for (u in a) a[u] >= l && (a[u] += i);
      return Ii(this);
    }),
    (n.invalidate = function (i) {
      var o = this._first;
      for (this._lock = 0; o; ) o.invalidate(i), (o = o._next);
      return t.prototype.invalidate.call(this, i);
    }),
    (n.clear = function (i) {
      i === void 0 && (i = !0);
      for (var o = this._first, l; o; ) (l = o._next), this.remove(o), (o = l);
      return (
        this._dp && (this._time = this._tTime = this._pTime = 0),
        i && (this.labels = {}),
        Ii(this)
      );
    }),
    (n.totalDuration = function (i) {
      var o = 0,
        l = this,
        s = l._last,
        a = Sn,
        u,
        c,
        f;
      if (arguments.length)
        return l.timeScale(
          (l._repeat < 0 ? l.duration() : l.totalDuration()) /
            (l.reversed() ? -i : i)
        );
      if (l._dirty) {
        for (f = l.parent; s; )
          (u = s._prev),
            s._dirty && s.totalDuration(),
            (c = s._start),
            c > a && l._sort && s._ts && !l._lock
              ? ((l._lock = 1), (Jn(l, s, c - s._delay, 1)._lock = 0))
              : (a = c),
            c < 0 &&
              s._ts &&
              ((o -= c),
              ((!f && !l._dp) || (f && f.smoothChildTiming)) &&
                ((l._start += c / l._ts), (l._time -= c), (l._tTime -= c)),
              l.shiftChildren(-c, !1, -1 / 0),
              (a = 0)),
            s._end > o && s._ts && (o = s._end),
            (s = u);
        Zo(l, l === Pe && l._time > o ? l._time : o, 1, 1), (l._dirty = 0);
      }
      return l._tDur;
    }),
    (e.updateRoot = function (i) {
      if ((Pe._ts && (Tv(Pe, _u(i, Pe)), (Ev = on.frame)), on.frame >= Zh)) {
        Zh += cn.autoSleep || 120;
        var o = Pe._first;
        if ((!o || !o._ts) && cn.autoSleep && on._listeners.length < 2) {
          for (; o && !o._ts; ) o = o._next;
          o || on.sleep();
        }
      }
    }),
    e
  );
})(Es);
Nn(zt.prototype, { _lock: 0, _hasPause: 0, _forcing: 0 });
var E2 = function (e, n, r, i, o, l, s) {
    var a = new Qt(this._pt, e, n, 0, 1, t1, null, o),
      u = 0,
      c = 0,
      f,
      d,
      p,
      v,
      m,
      x,
      g,
      h;
    for (
      a.b = r,
        a.e = i,
        r += "",
        i += "",
        (g = ~i.indexOf("random(")) && (i = ks(i)),
        l && ((h = [r, i]), l(h, e, n), (r = h[0]), (i = h[1])),
        d = r.match(Tc) || [];
      (f = Tc.exec(i));

    )
      (v = f[0]),
        (m = i.substring(u, f.index)),
        p ? (p = (p + 1) % 5) : m.substr(-5) === "rgba(" && (p = 1),
        v !== d[c++] &&
          ((x = parseFloat(d[c - 1]) || 0),
          (a._pt = {
            _next: a._pt,
            p: m || c === 1 ? m : ",",
            s: x,
            c: v.charAt(1) === "=" ? Io(x, v) - x : parseFloat(v) - x,
            m: p && p < 4 ? Math.round : 0,
          }),
          (u = Tc.lastIndex));
    return (
      (a.c = u < i.length ? i.substring(u, i.length) : ""),
      (a.fp = s),
      (xv.test(i) || g) && (a.e = 0),
      (this._pt = a),
      a
    );
  },
  yp = function (e, n, r, i, o, l, s, a, u, c) {
    ze(i) && (i = i(o || 0, e, l));
    var f = e[n],
      d =
        r !== "get"
          ? r
          : ze(f)
          ? u
            ? e[
                n.indexOf("set") || !ze(e["get" + n.substr(3)])
                  ? n
                  : "get" + n.substr(3)
              ](u)
            : e[n]()
          : f,
      p = ze(f) ? (u ? O2 : Zv) : xp,
      v;
    if (
      (it(i) &&
        (~i.indexOf("random(") && (i = ks(i)),
        i.charAt(1) === "=" &&
          ((v = Io(d, i) + (wt(d) || 0)), (v || v === 0) && (i = v))),
      !c || d !== i || Qf)
    )
      return !isNaN(d * i) && i !== ""
        ? ((v = new Qt(
            this._pt,
            e,
            n,
            +d || 0,
            i - (d || 0),
            typeof f == "boolean" ? L2 : e1,
            0,
            p
          )),
          u && (v.fp = u),
          s && v.modifier(s, this, e),
          (this._pt = v))
        : (!f && !(n in e) && hp(n, i),
          E2.call(this, e, n, d, i, p, a || cn.stringFilter, u));
  },
  P2 = function (e, n, r, i, o) {
    if (
      (ze(e) && (e = Xl(e, o, n, r, i)),
      !lr(e) || (e.style && e.nodeType) || kt(e) || yv(e))
    )
      return it(e) ? Xl(e, o, n, r, i) : e;
    var l = {},
      s;
    for (s in e) l[s] = Xl(e[s], o, n, r, i);
    return l;
  },
  Kv = function (e, n, r, i, o, l) {
    var s, a, u, c;
    if (
      rn[e] &&
      (s = new rn[e]()).init(
        o,
        s.rawVars ? n[e] : P2(n[e], i, o, l, r),
        r,
        i,
        l
      ) !== !1 &&
      ((r._pt = a = new Qt(r._pt, o, e, 0, 1, s.render, s, 0, s.priority)),
      r !== Oo)
    )
      for (u = r._ptLookup[r._targets.indexOf(o)], c = s._props.length; c--; )
        u[s._props[c]] = a;
    return s;
  },
  Wr,
  Qf,
  _p = function t(e, n, r) {
    var i = e.vars,
      o = i.ease,
      l = i.startAt,
      s = i.immediateRender,
      a = i.lazy,
      u = i.onUpdate,
      c = i.runBackwards,
      f = i.yoyoEase,
      d = i.keyframes,
      p = i.autoRevert,
      v = e._dur,
      m = e._startAt,
      x = e._targets,
      g = e.parent,
      h = g && g.data === "nested" ? g.vars.targets : x,
      y = e._overwrite === "auto" && !cp,
      _ = e.timeline,
      k,
      E,
      C,
      T,
      N,
      R,
      I,
      z,
      H,
      X,
      ee,
      Q,
      $;
    if (
      (_ && (!d || !o) && (o = "none"),
      (e._ease = bi(o, qo.ease)),
      (e._yEase = f ? Yv(bi(f === !0 ? o : f, qo.ease)) : 0),
      f &&
        e._yoyo &&
        !e._repeat &&
        ((f = e._yEase), (e._yEase = e._ease), (e._ease = f)),
      (e._from = !_ && !!i.runBackwards),
      !_ || (d && !i.stagger))
    ) {
      if (
        ((z = x[0] ? Ai(x[0]).harness : 0),
        (Q = z && i[z.prop]),
        (k = yu(i, mp)),
        m &&
          (m._zTime < 0 && m.progress(1),
          n < 0 && c && s && !p ? m.render(-1, !0) : m.revert(c && v ? Fa : e2),
          (m._lazy = 0)),
        l)
      ) {
        if (
          (ui(
            (e._startAt = He.set(
              x,
              Nn(
                {
                  data: "isStart",
                  overwrite: !1,
                  parent: g,
                  immediateRender: !0,
                  lazy: !m && Yt(a),
                  startAt: null,
                  delay: 0,
                  onUpdate:
                    u &&
                    function () {
                      return an(e, "onUpdate");
                    },
                  stagger: 0,
                },
                l
              )
            ))
          ),
          (e._startAt._dp = 0),
          (e._startAt._sat = e),
          n < 0 && (St || (!s && !p)) && e._startAt.revert(Fa),
          s && v && n <= 0 && r <= 0)
        ) {
          n && (e._zTime = n);
          return;
        }
      } else if (c && v && !m) {
        if (
          (n && (s = !1),
          (C = Nn(
            {
              overwrite: !1,
              data: "isFromStart",
              lazy: s && !m && Yt(a),
              immediateRender: s,
              stagger: 0,
              parent: g,
            },
            k
          )),
          Q && (C[z.prop] = Q),
          ui((e._startAt = He.set(x, C))),
          (e._startAt._dp = 0),
          (e._startAt._sat = e),
          n < 0 && (St ? e._startAt.revert(Fa) : e._startAt.render(-1, !0)),
          (e._zTime = n),
          !s)
        )
          t(e._startAt, pe, pe);
        else if (!n) return;
      }
      for (
        e._pt = e._ptCache = 0, a = (v && Yt(a)) || (a && !v), E = 0;
        E < x.length;
        E++
      ) {
        if (
          ((N = x[E]),
          (I = N._gsap || vp(x)[E]._gsap),
          (e._ptLookup[E] = X = {}),
          Uf[I.id] && ii.length && vu(),
          (ee = h === x ? E : h.indexOf(N)),
          z &&
            (H = new z()).init(N, Q || k, e, ee, h) !== !1 &&
            ((e._pt = T =
              new Qt(e._pt, N, H.name, 0, 1, H.render, H, 0, H.priority)),
            H._props.forEach(function (M) {
              X[M] = T;
            }),
            H.priority && (R = 1)),
          !z || Q)
        )
          for (C in k)
            rn[C] && (H = Kv(C, k, e, ee, N, h))
              ? H.priority && (R = 1)
              : (X[C] = T =
                  yp.call(e, N, C, "get", k[C], ee, h, 0, i.stringFilter));
        e._op && e._op[E] && e.kill(N, e._op[E]),
          y &&
            e._pt &&
            ((Wr = e),
            Pe.killTweensOf(N, X, e.globalTime(n)),
            ($ = !e.parent),
            (Wr = 0)),
          e._pt && a && (Uf[I.id] = 1);
      }
      R && n1(e), e._onInit && e._onInit(e);
    }
    (e._onUpdate = u),
      (e._initted = (!e._op || e._pt) && !$),
      d && n <= 0 && _.render(Sn, !0, !0);
  },
  T2 = function (e, n, r, i, o, l, s, a) {
    var u = ((e._pt && e._ptCache) || (e._ptCache = {}))[n],
      c,
      f,
      d,
      p;
    if (!u)
      for (
        u = e._ptCache[n] = [], d = e._ptLookup, p = e._targets.length;
        p--;

      ) {
        if (((c = d[p][n]), c && c.d && c.d._pt))
          for (c = c.d._pt; c && c.p !== n && c.fp !== n; ) c = c._next;
        if (!c)
          return (
            (Qf = 1),
            (e.vars[n] = "+=0"),
            _p(e, s),
            (Qf = 0),
            a ? ws(n + " not eligible for reset") : 1
          );
        u.push(c);
      }
    for (p = u.length; p--; )
      (f = u[p]),
        (c = f._pt || f),
        (c.s = (i || i === 0) && !o ? i : c.s + (i || 0) + l * c.c),
        (c.c = r - c.s),
        f.e && (f.e = Ie(r) + wt(f.e)),
        f.b && (f.b = c.s + wt(f.b));
  },
  N2 = function (e, n) {
    var r = e[0] ? Ai(e[0]).harness : 0,
      i = r && r.aliases,
      o,
      l,
      s,
      a;
    if (!i) return n;
    o = Gi({}, n);
    for (l in i)
      if (l in o) for (a = i[l].split(","), s = a.length; s--; ) o[a[s]] = o[l];
    return o;
  },
  R2 = function (e, n, r, i) {
    var o = n.ease || i || "power1.inOut",
      l,
      s;
    if (kt(n))
      (s = r[e] || (r[e] = [])),
        n.forEach(function (a, u) {
          return s.push({ t: (u / (n.length - 1)) * 100, v: a, e: o });
        });
    else
      for (l in n)
        (s = r[l] || (r[l] = [])),
          l === "ease" || s.push({ t: parseFloat(e), v: n[l], e: o });
  },
  Xl = function (e, n, r, i, o) {
    return ze(e)
      ? e.call(n, r, i, o)
      : it(e) && ~e.indexOf("random(")
      ? ks(e)
      : e;
  },
  qv = gp + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert",
  Jv = {};
Xt(qv + ",id,stagger,delay,duration,paused,scrollTrigger", function (t) {
  return (Jv[t] = 1);
});
var He = (function (t) {
  gv(e, t);
  function e(r, i, o, l) {
    var s;
    typeof i == "number" && ((o.duration = i), (i = o), (o = null)),
      (s = t.call(this, l ? i : Wl(i)) || this);
    var a = s.vars,
      u = a.duration,
      c = a.delay,
      f = a.immediateRender,
      d = a.stagger,
      p = a.overwrite,
      v = a.keyframes,
      m = a.defaults,
      x = a.scrollTrigger,
      g = a.yoyoEase,
      h = i.parent || Pe,
      y = (kt(r) || yv(r) ? Tr(r[0]) : "length" in i) ? [r] : kn(r),
      _,
      k,
      E,
      C,
      T,
      N,
      R,
      I;
    if (
      ((s._targets = y.length
        ? vp(y)
        : ws(
            "GSAP target " + r + " not found. https://gsap.com",
            !cn.nullTargetWarn
          ) || []),
      (s._ptLookup = []),
      (s._overwrite = p),
      v || d || sa(u) || sa(c))
    ) {
      if (
        ((i = s.vars),
        (_ = s.timeline =
          new zt({
            data: "nested",
            defaults: m || {},
            targets: h && h.data === "nested" ? h.vars.targets : y,
          })),
        _.kill(),
        (_.parent = _._dp = dr(s)),
        (_._start = 0),
        d || sa(u) || sa(c))
      ) {
        if (((C = y.length), (R = d && Fv(d)), lr(d)))
          for (T in d) ~qv.indexOf(T) && (I || (I = {}), (I[T] = d[T]));
        for (k = 0; k < C; k++)
          (E = yu(i, Jv)),
            (E.stagger = 0),
            g && (E.yoyoEase = g),
            I && Gi(E, I),
            (N = y[k]),
            (E.duration = +Xl(u, dr(s), k, N, y)),
            (E.delay = (+Xl(c, dr(s), k, N, y) || 0) - s._delay),
            !d &&
              C === 1 &&
              E.delay &&
              ((s._delay = c = E.delay), (s._start += c), (E.delay = 0)),
            _.to(N, E, R ? R(k, N, y) : 0),
            (_._ease = ie.none);
        _.duration() ? (u = c = 0) : (s.timeline = 0);
      } else if (v) {
        Wl(Nn(_.vars.defaults, { ease: "none" })),
          (_._ease = bi(v.ease || i.ease || "none"));
        var z = 0,
          H,
          X,
          ee;
        if (kt(v))
          v.forEach(function (Q) {
            return _.to(y, Q, ">");
          }),
            _.duration();
        else {
          E = {};
          for (T in v)
            T === "ease" || T === "easeEach" || R2(T, v[T], E, v.easeEach);
          for (T in E)
            for (
              H = E[T].sort(function (Q, $) {
                return Q.t - $.t;
              }),
                z = 0,
                k = 0;
              k < H.length;
              k++
            )
              (X = H[k]),
                (ee = {
                  ease: X.e,
                  duration: ((X.t - (k ? H[k - 1].t : 0)) / 100) * u,
                }),
                (ee[T] = X.v),
                _.to(y, ee, z),
                (z += ee.duration);
          _.duration() < u && _.to({}, { duration: u - _.duration() });
        }
      }
      u || s.duration((u = _.duration()));
    } else s.timeline = 0;
    return (
      p === !0 && !cp && ((Wr = dr(s)), Pe.killTweensOf(y), (Wr = 0)),
      Jn(h, dr(s), o),
      i.reversed && s.reverse(),
      i.paused && s.paused(!0),
      (f ||
        (!u &&
          !v &&
          s._start === nt(h._time) &&
          Yt(f) &&
          l2(dr(s)) &&
          h.data !== "nested")) &&
        ((s._tTime = -pe), s.render(Math.max(0, -c) || 0)),
      x && Lv(dr(s), x),
      s
    );
  }
  var n = e.prototype;
  return (
    (n.render = function (i, o, l) {
      var s = this._time,
        a = this._tDur,
        u = this._dur,
        c = i < 0,
        f = i > a - pe && !c ? a : i < pe ? 0 : i,
        d,
        p,
        v,
        m,
        x,
        g,
        h,
        y,
        _;
      if (!u) a2(this, i, o, l);
      else if (
        f !== this._tTime ||
        !i ||
        l ||
        (!this._initted && this._tTime) ||
        (this._startAt && this._zTime < 0 !== c)
      ) {
        if (((d = f), (y = this.timeline), this._repeat)) {
          if (((m = u + this._rDelay), this._repeat < -1 && c))
            return this.totalTime(m * 100 + i, o, l);
          if (
            ((d = nt(f % m)),
            f === a
              ? ((v = this._repeat), (d = u))
              : ((v = ~~(f / m)),
                v && v === nt(f / m) && ((d = u), v--),
                d > u && (d = u)),
            (g = this._yoyo && v & 1),
            g && ((_ = this._yEase), (d = u - d)),
            (x = Jo(this._tTime, m)),
            d === s && !l && this._initted && v === x)
          )
            return (this._tTime = f), this;
          v !== x &&
            (y && this._yEase && Xv(y, g),
            this.vars.repeatRefresh &&
              !g &&
              !this._lock &&
              this._time !== m &&
              this._initted &&
              ((this._lock = l = 1),
              (this.render(nt(m * v), !0).invalidate()._lock = 0)));
        }
        if (!this._initted) {
          if (zv(this, c ? i : d, l, o, f)) return (this._tTime = 0), this;
          if (s !== this._time && !(l && this.vars.repeatRefresh && v !== x))
            return this;
          if (u !== this._dur) return this.render(i, o, l);
        }
        if (
          ((this._tTime = f),
          (this._time = d),
          !this._act && this._ts && ((this._act = 1), (this._lazy = 0)),
          (this.ratio = h = (_ || this._ease)(d / u)),
          this._from && (this.ratio = h = 1 - h),
          d && !s && !o && !v && (an(this, "onStart"), this._tTime !== f))
        )
          return this;
        for (p = this._pt; p; ) p.r(h, p.d), (p = p._next);
        (y && y.render(i < 0 ? i : y._dur * y._ease(d / this._dur), o, l)) ||
          (this._startAt && (this._zTime = i)),
          this._onUpdate &&
            !o &&
            (c && Vf(this, i, o, l), an(this, "onUpdate")),
          this._repeat &&
            v !== x &&
            this.vars.onRepeat &&
            !o &&
            this.parent &&
            an(this, "onRepeat"),
          (f === this._tDur || !f) &&
            this._tTime === f &&
            (c && !this._onUpdate && Vf(this, i, !0, !0),
            (i || !u) &&
              ((f === this._tDur && this._ts > 0) || (!f && this._ts < 0)) &&
              ui(this, 1),
            !o &&
              !(c && !s) &&
              (f || s || g) &&
              (an(this, f === a ? "onComplete" : "onReverseComplete", !0),
              this._prom && !(f < a && this.timeScale() > 0) && this._prom()));
      }
      return this;
    }),
    (n.targets = function () {
      return this._targets;
    }),
    (n.invalidate = function (i) {
      return (
        (!i || !this.vars.runBackwards) && (this._startAt = 0),
        (this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0),
        (this._ptLookup = []),
        this.timeline && this.timeline.invalidate(i),
        t.prototype.invalidate.call(this, i)
      );
    }),
    (n.resetTo = function (i, o, l, s, a) {
      Cs || on.wake(), this._ts || this.play();
      var u = Math.min(this._dur, (this._dp._time - this._start) * this._ts),
        c;
      return (
        this._initted || _p(this, u),
        (c = this._ease(u / this._dur)),
        T2(this, i, o, l, s, c, u, a)
          ? this.resetTo(i, o, l, s, 1)
          : (Ku(this, 0),
            this.parent ||
              Ov(
                this._dp,
                this,
                "_first",
                "_last",
                this._dp._sort ? "_start" : 0
              ),
            this.render(0))
      );
    }),
    (n.kill = function (i, o) {
      if ((o === void 0 && (o = "all"), !i && (!o || o === "all")))
        return (this._lazy = this._pt = 0), this.parent ? Rl(this) : this;
      if (this.timeline) {
        var l = this.timeline.totalDuration();
        return (
          this.timeline.killTweensOf(i, o, Wr && Wr.vars.overwrite !== !0)
            ._first || Rl(this),
          this.parent &&
            l !== this.timeline.totalDuration() &&
            Zo(this, (this._dur * this.timeline._tDur) / l, 0, 1),
          this
        );
      }
      var s = this._targets,
        a = i ? kn(i) : s,
        u = this._ptLookup,
        c = this._pt,
        f,
        d,
        p,
        v,
        m,
        x,
        g;
      if ((!o || o === "all") && i2(s, a))
        return o === "all" && (this._pt = 0), Rl(this);
      for (
        f = this._op = this._op || [],
          o !== "all" &&
            (it(o) &&
              ((m = {}),
              Xt(o, function (h) {
                return (m[h] = 1);
              }),
              (o = m)),
            (o = N2(s, o))),
          g = s.length;
        g--;

      )
        if (~a.indexOf(s[g])) {
          (d = u[g]),
            o === "all"
              ? ((f[g] = o), (v = d), (p = {}))
              : ((p = f[g] = f[g] || {}), (v = o));
          for (m in v)
            (x = d && d[m]),
              x &&
                ((!("kill" in x.d) || x.d.kill(m) === !0) && Qu(this, x, "_pt"),
                delete d[m]),
              p !== "all" && (p[m] = 1);
        }
      return this._initted && !this._pt && c && Rl(this), this;
    }),
    (e.to = function (i, o) {
      return new e(i, o, arguments[2]);
    }),
    (e.from = function (i, o) {
      return Yl(1, arguments);
    }),
    (e.delayedCall = function (i, o, l, s) {
      return new e(o, 0, {
        immediateRender: !1,
        lazy: !1,
        overwrite: !1,
        delay: i,
        onComplete: o,
        onReverseComplete: o,
        onCompleteParams: l,
        onReverseCompleteParams: l,
        callbackScope: s,
      });
    }),
    (e.fromTo = function (i, o, l) {
      return Yl(2, arguments);
    }),
    (e.set = function (i, o) {
      return (o.duration = 0), o.repeatDelay || (o.repeat = 0), new e(i, o);
    }),
    (e.killTweensOf = function (i, o, l) {
      return Pe.killTweensOf(i, o, l);
    }),
    e
  );
})(Es);
Nn(He.prototype, { _targets: [], _lazy: 0, _startAt: 0, _op: 0, _onInit: 0 });
Xt("staggerTo,staggerFrom,staggerFromTo", function (t) {
  He[t] = function () {
    var e = new zt(),
      n = Wf.call(arguments, 0);
    return n.splice(t === "staggerFromTo" ? 5 : 4, 0, 0), e[t].apply(e, n);
  };
});
var xp = function (e, n, r) {
    return (e[n] = r);
  },
  Zv = function (e, n, r) {
    return e[n](r);
  },
  O2 = function (e, n, r, i) {
    return e[n](i.fp, r);
  },
  M2 = function (e, n, r) {
    return e.setAttribute(n, r);
  },
  wp = function (e, n) {
    return ze(e[n]) ? Zv : fp(e[n]) && e.setAttribute ? M2 : xp;
  },
  e1 = function (e, n) {
    return n.set(n.t, n.p, Math.round((n.s + n.c * e) * 1e6) / 1e6, n);
  },
  L2 = function (e, n) {
    return n.set(n.t, n.p, !!(n.s + n.c * e), n);
  },
  t1 = function (e, n) {
    var r = n._pt,
      i = "";
    if (!e && n.b) i = n.b;
    else if (e === 1 && n.e) i = n.e;
    else {
      for (; r; )
        (i =
          r.p +
          (r.m ? r.m(r.s + r.c * e) : Math.round((r.s + r.c * e) * 1e4) / 1e4) +
          i),
          (r = r._next);
      i += n.c;
    }
    n.set(n.t, n.p, i, n);
  },
  Sp = function (e, n) {
    for (var r = n._pt; r; ) r.r(e, r.d), (r = r._next);
  },
  z2 = function (e, n, r, i) {
    for (var o = this._pt, l; o; )
      (l = o._next), o.p === i && o.modifier(e, n, r), (o = l);
  },
  D2 = function (e) {
    for (var n = this._pt, r, i; n; )
      (i = n._next),
        (n.p === e && !n.op) || n.op === e
          ? Qu(this, n, "_pt")
          : n.dep || (r = 1),
        (n = i);
    return !r;
  },
  j2 = function (e, n, r, i) {
    i.mSet(e, n, i.m.call(i.tween, r, i.mt), i);
  },
  n1 = function (e) {
    for (var n = e._pt, r, i, o, l; n; ) {
      for (r = n._next, i = o; i && i.pr > n.pr; ) i = i._next;
      (n._prev = i ? i._prev : l) ? (n._prev._next = n) : (o = n),
        (n._next = i) ? (i._prev = n) : (l = n),
        (n = r);
    }
    e._pt = o;
  },
  Qt = (function () {
    function t(n, r, i, o, l, s, a, u, c) {
      (this.t = r),
        (this.s = o),
        (this.c = l),
        (this.p = i),
        (this.r = s || e1),
        (this.d = a || this),
        (this.set = u || xp),
        (this.pr = c || 0),
        (this._next = n),
        n && (n._prev = this);
    }
    var e = t.prototype;
    return (
      (e.modifier = function (r, i, o) {
        (this.mSet = this.mSet || this.set),
          (this.set = j2),
          (this.m = r),
          (this.mt = o),
          (this.tween = i);
      }),
      t
    );
  })();
Xt(
  gp +
    "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger",
  function (t) {
    return (mp[t] = 1);
  }
);
dn.TweenMax = dn.TweenLite = He;
dn.TimelineLite = dn.TimelineMax = zt;
Pe = new zt({
  sortChildren: !1,
  defaults: qo,
  autoRemoveChildren: !0,
  id: "root",
  smoothChildTiming: !0,
});
cn.stringFilter = Wv;
var $i = [],
  Ia = {},
  F2 = [],
  o0 = 0,
  A2 = 0,
  Lc = function (e) {
    return (Ia[e] || F2).map(function (n) {
      return n();
    });
  },
  Gf = function () {
    var e = Date.now(),
      n = [];
    e - o0 > 2 &&
      (Lc("matchMediaInit"),
      $i.forEach(function (r) {
        var i = r.queries,
          o = r.conditions,
          l,
          s,
          a,
          u;
        for (s in i)
          (l = Gn.matchMedia(i[s]).matches),
            l && (a = 1),
            l !== o[s] && ((o[s] = l), (u = 1));
        u && (r.revert(), a && n.push(r));
      }),
      Lc("matchMediaRevert"),
      n.forEach(function (r) {
        return r.onMatch(r, function (i) {
          return r.add(null, i);
        });
      }),
      (o0 = e),
      Lc("matchMedia"));
  },
  r1 = (function () {
    function t(n, r) {
      (this.selector = r && Yf(r)),
        (this.data = []),
        (this._r = []),
        (this.isReverted = !1),
        (this.id = A2++),
        n && this.add(n);
    }
    var e = t.prototype;
    return (
      (e.add = function (r, i, o) {
        ze(r) && ((o = i), (i = r), (r = ze));
        var l = this,
          s = function () {
            var u = we,
              c = l.selector,
              f;
            return (
              u && u !== l && u.data.push(l),
              o && (l.selector = Yf(o)),
              (we = l),
              (f = i.apply(l, arguments)),
              ze(f) && l._r.push(f),
              (we = u),
              (l.selector = c),
              (l.isReverted = !1),
              f
            );
          };
        return (
          (l.last = s),
          r === ze
            ? s(l, function (a) {
                return l.add(null, a);
              })
            : r
            ? (l[r] = s)
            : s
        );
      }),
      (e.ignore = function (r) {
        var i = we;
        (we = null), r(this), (we = i);
      }),
      (e.getTweens = function () {
        var r = [];
        return (
          this.data.forEach(function (i) {
            return i instanceof t
              ? r.push.apply(r, i.getTweens())
              : i instanceof He &&
                  !(i.parent && i.parent.data === "nested") &&
                  r.push(i);
          }),
          r
        );
      }),
      (e.clear = function () {
        this._r.length = this.data.length = 0;
      }),
      (e.kill = function (r, i) {
        var o = this;
        if (
          (r
            ? (function () {
                for (var s = o.getTweens(), a = o.data.length, u; a--; )
                  (u = o.data[a]),
                    u.data === "isFlip" &&
                      (u.revert(),
                      u.getChildren(!0, !0, !1).forEach(function (c) {
                        return s.splice(s.indexOf(c), 1);
                      }));
                for (
                  s
                    .map(function (c) {
                      return {
                        g:
                          c._dur ||
                          c._delay ||
                          (c._sat && !c._sat.vars.immediateRender)
                            ? c.globalTime(0)
                            : -1 / 0,
                        t: c,
                      };
                    })
                    .sort(function (c, f) {
                      return f.g - c.g || -1 / 0;
                    })
                    .forEach(function (c) {
                      return c.t.revert(r);
                    }),
                    a = o.data.length;
                  a--;

                )
                  (u = o.data[a]),
                    u instanceof zt
                      ? u.data !== "nested" &&
                        (u.scrollTrigger && u.scrollTrigger.revert(), u.kill())
                      : !(u instanceof He) && u.revert && u.revert(r);
                o._r.forEach(function (c) {
                  return c(r, o);
                }),
                  (o.isReverted = !0);
              })()
            : this.data.forEach(function (s) {
                return s.kill && s.kill();
              }),
          this.clear(),
          i)
        )
          for (var l = $i.length; l--; )
            $i[l].id === this.id && $i.splice(l, 1);
      }),
      (e.revert = function (r) {
        this.kill(r || {});
      }),
      t
    );
  })(),
  I2 = (function () {
    function t(n) {
      (this.contexts = []), (this.scope = n), we && we.data.push(this);
    }
    var e = t.prototype;
    return (
      (e.add = function (r, i, o) {
        lr(r) || (r = { matches: r });
        var l = new r1(0, o || this.scope),
          s = (l.conditions = {}),
          a,
          u,
          c;
        we && !l.selector && (l.selector = we.selector),
          this.contexts.push(l),
          (i = l.add("onMatch", i)),
          (l.queries = r);
        for (u in r)
          u === "all"
            ? (c = 1)
            : ((a = Gn.matchMedia(r[u])),
              a &&
                ($i.indexOf(l) < 0 && $i.push(l),
                (s[u] = a.matches) && (c = 1),
                a.addListener
                  ? a.addListener(Gf)
                  : a.addEventListener("change", Gf)));
        return (
          c &&
            i(l, function (f) {
              return l.add(null, f);
            }),
          this
        );
      }),
      (e.revert = function (r) {
        this.kill(r || {});
      }),
      (e.kill = function (r) {
        this.contexts.forEach(function (i) {
          return i.kill(r, !0);
        });
      }),
      t
    );
  })(),
  xu = {
    registerPlugin: function () {
      for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++)
        n[r] = arguments[r];
      n.forEach(function (i) {
        return Uv(i);
      });
    },
    timeline: function (e) {
      return new zt(e);
    },
    getTweensOf: function (e, n) {
      return Pe.getTweensOf(e, n);
    },
    getProperty: function (e, n, r, i) {
      it(e) && (e = kn(e)[0]);
      var o = Ai(e || {}).get,
        l = r ? Rv : Nv;
      return (
        r === "native" && (r = ""),
        e &&
          (n
            ? l(((rn[n] && rn[n].get) || o)(e, n, r, i))
            : function (s, a, u) {
                return l(((rn[s] && rn[s].get) || o)(e, s, a, u));
              })
      );
    },
    quickSetter: function (e, n, r) {
      if (((e = kn(e)), e.length > 1)) {
        var i = e.map(function (c) {
            return Kt.quickSetter(c, n, r);
          }),
          o = i.length;
        return function (c) {
          for (var f = o; f--; ) i[f](c);
        };
      }
      e = e[0] || {};
      var l = rn[n],
        s = Ai(e),
        a = (s.harness && (s.harness.aliases || {})[n]) || n,
        u = l
          ? function (c) {
              var f = new l();
              (Oo._pt = 0),
                f.init(e, r ? c + r : c, Oo, 0, [e]),
                f.render(1, f),
                Oo._pt && Sp(1, Oo);
            }
          : s.set(e, a);
      return l
        ? u
        : function (c) {
            return u(e, a, r ? c + r : c, s, 1);
          };
    },
    quickTo: function (e, n, r) {
      var i,
        o = Kt.to(
          e,
          Gi(((i = {}), (i[n] = "+=0.1"), (i.paused = !0), i), r || {})
        ),
        l = function (a, u, c) {
          return o.resetTo(n, a, u, c);
        };
      return (l.tween = o), l;
    },
    isTweening: function (e) {
      return Pe.getTweensOf(e, !0).length > 0;
    },
    defaults: function (e) {
      return e && e.ease && (e.ease = bi(e.ease, qo.ease)), e0(qo, e || {});
    },
    config: function (e) {
      return e0(cn, e || {});
    },
    registerEffect: function (e) {
      var n = e.name,
        r = e.effect,
        i = e.plugins,
        o = e.defaults,
        l = e.extendTimeline;
      (i || "").split(",").forEach(function (s) {
        return (
          s && !rn[s] && !dn[s] && ws(n + " effect requires " + s + " plugin.")
        );
      }),
        (Nc[n] = function (s, a, u) {
          return r(kn(s), Nn(a || {}, o), u);
        }),
        l &&
          (zt.prototype[n] = function (s, a, u) {
            return this.add(Nc[n](s, lr(a) ? a : (u = a) && {}, this), u);
          });
    },
    registerEase: function (e, n) {
      ie[e] = bi(n);
    },
    parseEase: function (e, n) {
      return arguments.length ? bi(e, n) : ie;
    },
    getById: function (e) {
      return Pe.getById(e);
    },
    exportRoot: function (e, n) {
      e === void 0 && (e = {});
      var r = new zt(e),
        i,
        o;
      for (
        r.smoothChildTiming = Yt(e.smoothChildTiming),
          Pe.remove(r),
          r._dp = 0,
          r._time = r._tTime = Pe._time,
          i = Pe._first;
        i;

      )
        (o = i._next),
          (n ||
            !(
              !i._dur &&
              i instanceof He &&
              i.vars.onComplete === i._targets[0]
            )) &&
            Jn(r, i, i._start - i._delay),
          (i = o);
      return Jn(Pe, r, 0), r;
    },
    context: function (e, n) {
      return e ? new r1(e, n) : we;
    },
    matchMedia: function (e) {
      return new I2(e);
    },
    matchMediaRefresh: function () {
      return (
        $i.forEach(function (e) {
          var n = e.conditions,
            r,
            i;
          for (i in n) n[i] && ((n[i] = !1), (r = 1));
          r && e.revert();
        }) || Gf()
      );
    },
    addEventListener: function (e, n) {
      var r = Ia[e] || (Ia[e] = []);
      ~r.indexOf(n) || r.push(n);
    },
    removeEventListener: function (e, n) {
      var r = Ia[e],
        i = r && r.indexOf(n);
      i >= 0 && r.splice(i, 1);
    },
    utils: {
      wrap: g2,
      wrapYoyo: v2,
      distribute: Fv,
      random: Iv,
      snap: Av,
      normalize: m2,
      getUnit: wt,
      clamp: f2,
      splitColor: Vv,
      toArray: kn,
      selector: Yf,
      mapRange: $v,
      pipe: p2,
      unitize: h2,
      interpolate: y2,
      shuffle: jv,
    },
    install: kv,
    effects: Nc,
    ticker: on,
    updateRoot: zt.updateRoot,
    plugins: rn,
    globalTimeline: Pe,
    core: {
      PropTween: Qt,
      globals: Cv,
      Tween: He,
      Timeline: zt,
      Animation: Es,
      getCache: Ai,
      _removeLinkedListItem: Qu,
      reverting: function () {
        return St;
      },
      context: function (e) {
        return e && we && (we.data.push(e), (e._ctx = we)), we;
      },
      suppressOverwrites: function (e) {
        return (cp = e);
      },
    },
  };
Xt("to,from,fromTo,delayedCall,set,killTweensOf", function (t) {
  return (xu[t] = He[t]);
});
on.add(zt.updateRoot);
Oo = xu.to({}, { duration: 0 });
var b2 = function (e, n) {
    for (var r = e._pt; r && r.p !== n && r.op !== n && r.fp !== n; )
      r = r._next;
    return r;
  },
  $2 = function (e, n) {
    var r = e._targets,
      i,
      o,
      l;
    for (i in n)
      for (o = r.length; o--; )
        (l = e._ptLookup[o][i]),
          l &&
            (l = l.d) &&
            (l._pt && (l = b2(l, i)),
            l && l.modifier && l.modifier(n[i], e, r[o], i));
  },
  zc = function (e, n) {
    return {
      name: e,
      rawVars: 1,
      init: function (i, o, l) {
        l._onInit = function (s) {
          var a, u;
          if (
            (it(o) &&
              ((a = {}),
              Xt(o, function (c) {
                return (a[c] = 1);
              }),
              (o = a)),
            n)
          ) {
            a = {};
            for (u in o) a[u] = n(o[u]);
            o = a;
          }
          $2(s, o);
        };
      },
    };
  },
  Kt =
    xu.registerPlugin(
      {
        name: "attr",
        init: function (e, n, r, i, o) {
          var l, s, a;
          this.tween = r;
          for (l in n)
            (a = e.getAttribute(l) || ""),
              (s = this.add(
                e,
                "setAttribute",
                (a || 0) + "",
                n[l],
                i,
                o,
                0,
                0,
                l
              )),
              (s.op = l),
              (s.b = a),
              this._props.push(l);
        },
        render: function (e, n) {
          for (var r = n._pt; r; )
            St ? r.set(r.t, r.p, r.b, r) : r.r(e, r.d), (r = r._next);
        },
      },
      {
        name: "endArray",
        init: function (e, n) {
          for (var r = n.length; r--; )
            this.add(e, r, e[r] || 0, n[r], 0, 0, 0, 0, 0, 1);
        },
      },
      zc("roundProps", Xf),
      zc("modifiers"),
      zc("snap", Av)
    ) || xu;
He.version = zt.version = Kt.version = "3.12.5";
Sv = 1;
dp() && el();
ie.Power0;
ie.Power1;
ie.Power2;
ie.Power3;
ie.Power4;
ie.Linear;
ie.Quad;
ie.Cubic;
ie.Quart;
ie.Quint;
ie.Strong;
ie.Elastic;
ie.Back;
ie.SteppedEase;
ie.Bounce;
ie.Sine;
ie.Expo;
ie.Circ;
/*!
 * CSSPlugin 3.12.5
 * https://gsap.com
 *
 * Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */ var l0,
  Yr,
  bo,
  kp,
  Li,
  s0,
  Cp,
  B2 = function () {
    return typeof window < "u";
  },
  Nr = {},
  Pi = 180 / Math.PI,
  $o = Math.PI / 180,
  co = Math.atan2,
  a0 = 1e8,
  Ep = /([A-Z])/g,
  U2 = /(left|right|width|margin|padding|x)/i,
  V2 = /[\s,\(]\S/,
  Zn = {
    autoAlpha: "opacity,visibility",
    scale: "scaleX,scaleY",
    alpha: "opacity",
  },
  Kf = function (e, n) {
    return n.set(n.t, n.p, Math.round((n.s + n.c * e) * 1e4) / 1e4 + n.u, n);
  },
  H2 = function (e, n) {
    return n.set(
      n.t,
      n.p,
      e === 1 ? n.e : Math.round((n.s + n.c * e) * 1e4) / 1e4 + n.u,
      n
    );
  },
  W2 = function (e, n) {
    return n.set(
      n.t,
      n.p,
      e ? Math.round((n.s + n.c * e) * 1e4) / 1e4 + n.u : n.b,
      n
    );
  },
  Y2 = function (e, n) {
    var r = n.s + n.c * e;
    n.set(n.t, n.p, ~~(r + (r < 0 ? -0.5 : 0.5)) + n.u, n);
  },
  i1 = function (e, n) {
    return n.set(n.t, n.p, e ? n.e : n.b, n);
  },
  o1 = function (e, n) {
    return n.set(n.t, n.p, e !== 1 ? n.b : n.e, n);
  },
  X2 = function (e, n, r) {
    return (e.style[n] = r);
  },
  Q2 = function (e, n, r) {
    return e.style.setProperty(n, r);
  },
  G2 = function (e, n, r) {
    return (e._gsap[n] = r);
  },
  K2 = function (e, n, r) {
    return (e._gsap.scaleX = e._gsap.scaleY = r);
  },
  q2 = function (e, n, r, i, o) {
    var l = e._gsap;
    (l.scaleX = l.scaleY = r), l.renderTransform(o, l);
  },
  J2 = function (e, n, r, i, o) {
    var l = e._gsap;
    (l[n] = r), l.renderTransform(o, l);
  },
  Te = "transform",
  Gt = Te + "Origin",
  Z2 = function t(e, n) {
    var r = this,
      i = this.target,
      o = i.style,
      l = i._gsap;
    if (e in Nr && o) {
      if (((this.tfm = this.tfm || {}), e !== "transform"))
        (e = Zn[e] || e),
          ~e.indexOf(",")
            ? e.split(",").forEach(function (s) {
                return (r.tfm[s] = hr(i, s));
              })
            : (this.tfm[e] = l.x ? l[e] : hr(i, e)),
          e === Gt && (this.tfm.zOrigin = l.zOrigin);
      else
        return Zn.transform.split(",").forEach(function (s) {
          return t.call(r, s, n);
        });
      if (this.props.indexOf(Te) >= 0) return;
      l.svg &&
        ((this.svgo = i.getAttribute("data-svg-origin")),
        this.props.push(Gt, n, "")),
        (e = Te);
    }
    (o || n) && this.props.push(e, n, o[e]);
  },
  l1 = function (e) {
    e.translate &&
      (e.removeProperty("translate"),
      e.removeProperty("scale"),
      e.removeProperty("rotate"));
  },
  eS = function () {
    var e = this.props,
      n = this.target,
      r = n.style,
      i = n._gsap,
      o,
      l;
    for (o = 0; o < e.length; o += 3)
      e[o + 1]
        ? (n[e[o]] = e[o + 2])
        : e[o + 2]
        ? (r[e[o]] = e[o + 2])
        : r.removeProperty(
            e[o].substr(0, 2) === "--"
              ? e[o]
              : e[o].replace(Ep, "-$1").toLowerCase()
          );
    if (this.tfm) {
      for (l in this.tfm) i[l] = this.tfm[l];
      i.svg &&
        (i.renderTransform(),
        n.setAttribute("data-svg-origin", this.svgo || "")),
        (o = Cp()),
        (!o || !o.isStart) &&
          !r[Te] &&
          (l1(r),
          i.zOrigin &&
            r[Gt] &&
            ((r[Gt] += " " + i.zOrigin + "px"),
            (i.zOrigin = 0),
            i.renderTransform()),
          (i.uncache = 1));
    }
  },
  s1 = function (e, n) {
    var r = { target: e, props: [], revert: eS, save: Z2 };
    return (
      e._gsap || Kt.core.getCache(e),
      n &&
        n.split(",").forEach(function (i) {
          return r.save(i);
        }),
      r
    );
  },
  a1,
  qf = function (e, n) {
    var r = Yr.createElementNS
      ? Yr.createElementNS(
          (n || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"),
          e
        )
      : Yr.createElement(e);
    return r && r.style ? r : Yr.createElement(e);
  },
  rr = function t(e, n, r) {
    var i = getComputedStyle(e);
    return (
      i[n] ||
      i.getPropertyValue(n.replace(Ep, "-$1").toLowerCase()) ||
      i.getPropertyValue(n) ||
      (!r && t(e, tl(n) || n, 1)) ||
      ""
    );
  },
  u0 = "O,Moz,ms,Ms,Webkit".split(","),
  tl = function (e, n, r) {
    var i = n || Li,
      o = i.style,
      l = 5;
    if (e in o && !r) return e;
    for (
      e = e.charAt(0).toUpperCase() + e.substr(1);
      l-- && !(u0[l] + e in o);

    );
    return l < 0 ? null : (l === 3 ? "ms" : l >= 0 ? u0[l] : "") + e;
  },
  Jf = function () {
    B2() &&
      window.document &&
      ((l0 = window),
      (Yr = l0.document),
      (bo = Yr.documentElement),
      (Li = qf("div") || { style: {} }),
      qf("div"),
      (Te = tl(Te)),
      (Gt = Te + "Origin"),
      (Li.style.cssText =
        "border-width:0;line-height:0;position:absolute;padding:0"),
      (a1 = !!tl("perspective")),
      (Cp = Kt.core.reverting),
      (kp = 1));
  },
  Dc = function t(e) {
    var n = qf(
        "svg",
        (this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns")) ||
          "http://www.w3.org/2000/svg"
      ),
      r = this.parentNode,
      i = this.nextSibling,
      o = this.style.cssText,
      l;
    if (
      (bo.appendChild(n),
      n.appendChild(this),
      (this.style.display = "block"),
      e)
    )
      try {
        (l = this.getBBox()),
          (this._gsapBBox = this.getBBox),
          (this.getBBox = t);
      } catch {}
    else this._gsapBBox && (l = this._gsapBBox());
    return (
      r && (i ? r.insertBefore(this, i) : r.appendChild(this)),
      bo.removeChild(n),
      (this.style.cssText = o),
      l
    );
  },
  c0 = function (e, n) {
    for (var r = n.length; r--; )
      if (e.hasAttribute(n[r])) return e.getAttribute(n[r]);
  },
  u1 = function (e) {
    var n;
    try {
      n = e.getBBox();
    } catch {
      n = Dc.call(e, !0);
    }
    return (
      (n && (n.width || n.height)) || e.getBBox === Dc || (n = Dc.call(e, !0)),
      n && !n.width && !n.x && !n.y
        ? {
            x: +c0(e, ["x", "cx", "x1"]) || 0,
            y: +c0(e, ["y", "cy", "y1"]) || 0,
            width: 0,
            height: 0,
          }
        : n
    );
  },
  c1 = function (e) {
    return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && u1(e));
  },
  Ki = function (e, n) {
    if (n) {
      var r = e.style,
        i;
      n in Nr && n !== Gt && (n = Te),
        r.removeProperty
          ? ((i = n.substr(0, 2)),
            (i === "ms" || n.substr(0, 6) === "webkit") && (n = "-" + n),
            r.removeProperty(
              i === "--" ? n : n.replace(Ep, "-$1").toLowerCase()
            ))
          : r.removeAttribute(n);
    }
  },
  Xr = function (e, n, r, i, o, l) {
    var s = new Qt(e._pt, n, r, 0, 1, l ? o1 : i1);
    return (e._pt = s), (s.b = i), (s.e = o), e._props.push(r), s;
  },
  f0 = { deg: 1, rad: 1, turn: 1 },
  tS = { grid: 1, flex: 1 },
  ci = function t(e, n, r, i) {
    var o = parseFloat(r) || 0,
      l = (r + "").trim().substr((o + "").length) || "px",
      s = Li.style,
      a = U2.test(n),
      u = e.tagName.toLowerCase() === "svg",
      c = (u ? "client" : "offset") + (a ? "Width" : "Height"),
      f = 100,
      d = i === "px",
      p = i === "%",
      v,
      m,
      x,
      g;
    if (i === l || !o || f0[i] || f0[l]) return o;
    if (
      (l !== "px" && !d && (o = t(e, n, r, "px")),
      (g = e.getCTM && c1(e)),
      (p || l === "%") && (Nr[n] || ~n.indexOf("adius")))
    )
      return (
        (v = g ? e.getBBox()[a ? "width" : "height"] : e[c]),
        Ie(p ? (o / v) * f : (o / 100) * v)
      );
    if (
      ((s[a ? "width" : "height"] = f + (d ? l : i)),
      (m =
        ~n.indexOf("adius") || (i === "em" && e.appendChild && !u)
          ? e
          : e.parentNode),
      g && (m = (e.ownerSVGElement || {}).parentNode),
      (!m || m === Yr || !m.appendChild) && (m = Yr.body),
      (x = m._gsap),
      x && p && x.width && a && x.time === on.time && !x.uncache)
    )
      return Ie((o / x.width) * f);
    if (p && (n === "height" || n === "width")) {
      var h = e.style[n];
      (e.style[n] = f + i), (v = e[c]), h ? (e.style[n] = h) : Ki(e, n);
    } else
      (p || l === "%") &&
        !tS[rr(m, "display")] &&
        (s.position = rr(e, "position")),
        m === e && (s.position = "static"),
        m.appendChild(Li),
        (v = Li[c]),
        m.removeChild(Li),
        (s.position = "absolute");
    return (
      a && p && ((x = Ai(m)), (x.time = on.time), (x.width = m[c])),
      Ie(d ? (v * o) / f : v && o ? (f / v) * o : 0)
    );
  },
  hr = function (e, n, r, i) {
    var o;
    return (
      kp || Jf(),
      n in Zn &&
        n !== "transform" &&
        ((n = Zn[n]), ~n.indexOf(",") && (n = n.split(",")[0])),
      Nr[n] && n !== "transform"
        ? ((o = Ts(e, i)),
          (o =
            n !== "transformOrigin"
              ? o[n]
              : o.svg
              ? o.origin
              : Su(rr(e, Gt)) + " " + o.zOrigin + "px"))
        : ((o = e.style[n]),
          (!o || o === "auto" || i || ~(o + "").indexOf("calc(")) &&
            (o =
              (wu[n] && wu[n](e, n, r)) ||
              rr(e, n) ||
              Pv(e, n) ||
              (n === "opacity" ? 1 : 0))),
      r && !~(o + "").trim().indexOf(" ") ? ci(e, n, o, r) + r : o
    );
  },
  nS = function (e, n, r, i) {
    if (!r || r === "none") {
      var o = tl(n, e, 1),
        l = o && rr(e, o, 1);
      l && l !== r
        ? ((n = o), (r = l))
        : n === "borderColor" && (r = rr(e, "borderTopColor"));
    }
    var s = new Qt(this._pt, e.style, n, 0, 1, t1),
      a = 0,
      u = 0,
      c,
      f,
      d,
      p,
      v,
      m,
      x,
      g,
      h,
      y,
      _,
      k;
    if (
      ((s.b = r),
      (s.e = i),
      (r += ""),
      (i += ""),
      i === "auto" &&
        ((m = e.style[n]),
        (e.style[n] = i),
        (i = rr(e, n) || i),
        m ? (e.style[n] = m) : Ki(e, n)),
      (c = [r, i]),
      Wv(c),
      (r = c[0]),
      (i = c[1]),
      (d = r.match(Ro) || []),
      (k = i.match(Ro) || []),
      k.length)
    ) {
      for (; (f = Ro.exec(i)); )
        (x = f[0]),
          (h = i.substring(a, f.index)),
          v
            ? (v = (v + 1) % 5)
            : (h.substr(-5) === "rgba(" || h.substr(-5) === "hsla(") && (v = 1),
          x !== (m = d[u++] || "") &&
            ((p = parseFloat(m) || 0),
            (_ = m.substr((p + "").length)),
            x.charAt(1) === "=" && (x = Io(p, x) + _),
            (g = parseFloat(x)),
            (y = x.substr((g + "").length)),
            (a = Ro.lastIndex - y.length),
            y ||
              ((y = y || cn.units[n] || _),
              a === i.length && ((i += y), (s.e += y))),
            _ !== y && (p = ci(e, n, m, y) || 0),
            (s._pt = {
              _next: s._pt,
              p: h || u === 1 ? h : ",",
              s: p,
              c: g - p,
              m: (v && v < 4) || n === "zIndex" ? Math.round : 0,
            }));
      s.c = a < i.length ? i.substring(a, i.length) : "";
    } else s.r = n === "display" && i === "none" ? o1 : i1;
    return xv.test(i) && (s.e = 0), (this._pt = s), s;
  },
  d0 = { top: "0%", bottom: "100%", left: "0%", right: "100%", center: "50%" },
  rS = function (e) {
    var n = e.split(" "),
      r = n[0],
      i = n[1] || "50%";
    return (
      (r === "top" || r === "bottom" || i === "left" || i === "right") &&
        ((e = r), (r = i), (i = e)),
      (n[0] = d0[r] || r),
      (n[1] = d0[i] || i),
      n.join(" ")
    );
  },
  iS = function (e, n) {
    if (n.tween && n.tween._time === n.tween._dur) {
      var r = n.t,
        i = r.style,
        o = n.u,
        l = r._gsap,
        s,
        a,
        u;
      if (o === "all" || o === !0) (i.cssText = ""), (a = 1);
      else
        for (o = o.split(","), u = o.length; --u > -1; )
          (s = o[u]),
            Nr[s] && ((a = 1), (s = s === "transformOrigin" ? Gt : Te)),
            Ki(r, s);
      a &&
        (Ki(r, Te),
        l &&
          (l.svg && r.removeAttribute("transform"),
          Ts(r, 1),
          (l.uncache = 1),
          l1(i)));
    }
  },
  wu = {
    clearProps: function (e, n, r, i, o) {
      if (o.data !== "isFromStart") {
        var l = (e._pt = new Qt(e._pt, n, r, 0, 0, iS));
        return (l.u = i), (l.pr = -10), (l.tween = o), e._props.push(r), 1;
      }
    },
  },
  Ps = [1, 0, 0, 1, 0, 0],
  f1 = {},
  d1 = function (e) {
    return e === "matrix(1, 0, 0, 1, 0, 0)" || e === "none" || !e;
  },
  p0 = function (e) {
    var n = rr(e, Te);
    return d1(n) ? Ps : n.substr(7).match(_v).map(Ie);
  },
  Pp = function (e, n) {
    var r = e._gsap || Ai(e),
      i = e.style,
      o = p0(e),
      l,
      s,
      a,
      u;
    return r.svg && e.getAttribute("transform")
      ? ((a = e.transform.baseVal.consolidate().matrix),
        (o = [a.a, a.b, a.c, a.d, a.e, a.f]),
        o.join(",") === "1,0,0,1,0,0" ? Ps : o)
      : (o === Ps &&
          !e.offsetParent &&
          e !== bo &&
          !r.svg &&
          ((a = i.display),
          (i.display = "block"),
          (l = e.parentNode),
          (!l || !e.offsetParent) &&
            ((u = 1), (s = e.nextElementSibling), bo.appendChild(e)),
          (o = p0(e)),
          a ? (i.display = a) : Ki(e, "display"),
          u &&
            (s
              ? l.insertBefore(e, s)
              : l
              ? l.appendChild(e)
              : bo.removeChild(e))),
        n && o.length > 6 ? [o[0], o[1], o[4], o[5], o[12], o[13]] : o);
  },
  Zf = function (e, n, r, i, o, l) {
    var s = e._gsap,
      a = o || Pp(e, !0),
      u = s.xOrigin || 0,
      c = s.yOrigin || 0,
      f = s.xOffset || 0,
      d = s.yOffset || 0,
      p = a[0],
      v = a[1],
      m = a[2],
      x = a[3],
      g = a[4],
      h = a[5],
      y = n.split(" "),
      _ = parseFloat(y[0]) || 0,
      k = parseFloat(y[1]) || 0,
      E,
      C,
      T,
      N;
    r
      ? a !== Ps &&
        (C = p * x - v * m) &&
        ((T = _ * (x / C) + k * (-m / C) + (m * h - x * g) / C),
        (N = _ * (-v / C) + k * (p / C) - (p * h - v * g) / C),
        (_ = T),
        (k = N))
      : ((E = u1(e)),
        (_ = E.x + (~y[0].indexOf("%") ? (_ / 100) * E.width : _)),
        (k = E.y + (~(y[1] || y[0]).indexOf("%") ? (k / 100) * E.height : k))),
      i || (i !== !1 && s.smooth)
        ? ((g = _ - u),
          (h = k - c),
          (s.xOffset = f + (g * p + h * m) - g),
          (s.yOffset = d + (g * v + h * x) - h))
        : (s.xOffset = s.yOffset = 0),
      (s.xOrigin = _),
      (s.yOrigin = k),
      (s.smooth = !!i),
      (s.origin = n),
      (s.originIsAbsolute = !!r),
      (e.style[Gt] = "0px 0px"),
      l &&
        (Xr(l, s, "xOrigin", u, _),
        Xr(l, s, "yOrigin", c, k),
        Xr(l, s, "xOffset", f, s.xOffset),
        Xr(l, s, "yOffset", d, s.yOffset)),
      e.setAttribute("data-svg-origin", _ + " " + k);
  },
  Ts = function (e, n) {
    var r = e._gsap || new Gv(e);
    if ("x" in r && !n && !r.uncache) return r;
    var i = e.style,
      o = r.scaleX < 0,
      l = "px",
      s = "deg",
      a = getComputedStyle(e),
      u = rr(e, Gt) || "0",
      c,
      f,
      d,
      p,
      v,
      m,
      x,
      g,
      h,
      y,
      _,
      k,
      E,
      C,
      T,
      N,
      R,
      I,
      z,
      H,
      X,
      ee,
      Q,
      $,
      M,
      j,
      S,
      U,
      oe,
      ft,
      ue,
      De;
    return (
      (c = f = d = m = x = g = h = y = _ = 0),
      (p = v = 1),
      (r.svg = !!(e.getCTM && c1(e))),
      a.translate &&
        ((a.translate !== "none" ||
          a.scale !== "none" ||
          a.rotate !== "none") &&
          (i[Te] =
            (a.translate !== "none"
              ? "translate3d(" +
                (a.translate + " 0 0").split(" ").slice(0, 3).join(", ") +
                ") "
              : "") +
            (a.rotate !== "none" ? "rotate(" + a.rotate + ") " : "") +
            (a.scale !== "none"
              ? "scale(" + a.scale.split(" ").join(",") + ") "
              : "") +
            (a[Te] !== "none" ? a[Te] : "")),
        (i.scale = i.rotate = i.translate = "none")),
      (C = Pp(e, r.svg)),
      r.svg &&
        (r.uncache
          ? ((M = e.getBBox()),
            (u = r.xOrigin - M.x + "px " + (r.yOrigin - M.y) + "px"),
            ($ = ""))
          : ($ = !n && e.getAttribute("data-svg-origin")),
        Zf(e, $ || u, !!$ || r.originIsAbsolute, r.smooth !== !1, C)),
      (k = r.xOrigin || 0),
      (E = r.yOrigin || 0),
      C !== Ps &&
        ((I = C[0]),
        (z = C[1]),
        (H = C[2]),
        (X = C[3]),
        (c = ee = C[4]),
        (f = Q = C[5]),
        C.length === 6
          ? ((p = Math.sqrt(I * I + z * z)),
            (v = Math.sqrt(X * X + H * H)),
            (m = I || z ? co(z, I) * Pi : 0),
            (h = H || X ? co(H, X) * Pi + m : 0),
            h && (v *= Math.abs(Math.cos(h * $o))),
            r.svg && ((c -= k - (k * I + E * H)), (f -= E - (k * z + E * X))))
          : ((De = C[6]),
            (ft = C[7]),
            (S = C[8]),
            (U = C[9]),
            (oe = C[10]),
            (ue = C[11]),
            (c = C[12]),
            (f = C[13]),
            (d = C[14]),
            (T = co(De, oe)),
            (x = T * Pi),
            T &&
              ((N = Math.cos(-T)),
              (R = Math.sin(-T)),
              ($ = ee * N + S * R),
              (M = Q * N + U * R),
              (j = De * N + oe * R),
              (S = ee * -R + S * N),
              (U = Q * -R + U * N),
              (oe = De * -R + oe * N),
              (ue = ft * -R + ue * N),
              (ee = $),
              (Q = M),
              (De = j)),
            (T = co(-H, oe)),
            (g = T * Pi),
            T &&
              ((N = Math.cos(-T)),
              (R = Math.sin(-T)),
              ($ = I * N - S * R),
              (M = z * N - U * R),
              (j = H * N - oe * R),
              (ue = X * R + ue * N),
              (I = $),
              (z = M),
              (H = j)),
            (T = co(z, I)),
            (m = T * Pi),
            T &&
              ((N = Math.cos(T)),
              (R = Math.sin(T)),
              ($ = I * N + z * R),
              (M = ee * N + Q * R),
              (z = z * N - I * R),
              (Q = Q * N - ee * R),
              (I = $),
              (ee = M)),
            x &&
              Math.abs(x) + Math.abs(m) > 359.9 &&
              ((x = m = 0), (g = 180 - g)),
            (p = Ie(Math.sqrt(I * I + z * z + H * H))),
            (v = Ie(Math.sqrt(Q * Q + De * De))),
            (T = co(ee, Q)),
            (h = Math.abs(T) > 2e-4 ? T * Pi : 0),
            (_ = ue ? 1 / (ue < 0 ? -ue : ue) : 0)),
        r.svg &&
          (($ = e.getAttribute("transform")),
          (r.forceCSS = e.setAttribute("transform", "") || !d1(rr(e, Te))),
          $ && e.setAttribute("transform", $))),
      Math.abs(h) > 90 &&
        Math.abs(h) < 270 &&
        (o
          ? ((p *= -1), (h += m <= 0 ? 180 : -180), (m += m <= 0 ? 180 : -180))
          : ((v *= -1), (h += h <= 0 ? 180 : -180))),
      (n = n || r.uncache),
      (r.x =
        c -
        ((r.xPercent =
          c &&
          ((!n && r.xPercent) ||
            (Math.round(e.offsetWidth / 2) === Math.round(-c) ? -50 : 0)))
          ? (e.offsetWidth * r.xPercent) / 100
          : 0) +
        l),
      (r.y =
        f -
        ((r.yPercent =
          f &&
          ((!n && r.yPercent) ||
            (Math.round(e.offsetHeight / 2) === Math.round(-f) ? -50 : 0)))
          ? (e.offsetHeight * r.yPercent) / 100
          : 0) +
        l),
      (r.z = d + l),
      (r.scaleX = Ie(p)),
      (r.scaleY = Ie(v)),
      (r.rotation = Ie(m) + s),
      (r.rotationX = Ie(x) + s),
      (r.rotationY = Ie(g) + s),
      (r.skewX = h + s),
      (r.skewY = y + s),
      (r.transformPerspective = _ + l),
      (r.zOrigin = parseFloat(u.split(" ")[2]) || (!n && r.zOrigin) || 0) &&
        (i[Gt] = Su(u)),
      (r.xOffset = r.yOffset = 0),
      (r.force3D = cn.force3D),
      (r.renderTransform = r.svg ? lS : a1 ? p1 : oS),
      (r.uncache = 0),
      r
    );
  },
  Su = function (e) {
    return (e = e.split(" "))[0] + " " + e[1];
  },
  jc = function (e, n, r) {
    var i = wt(n);
    return Ie(parseFloat(n) + parseFloat(ci(e, "x", r + "px", i))) + i;
  },
  oS = function (e, n) {
    (n.z = "0px"),
      (n.rotationY = n.rotationX = "0deg"),
      (n.force3D = 0),
      p1(e, n);
  },
  Si = "0deg",
  Sl = "0px",
  ki = ") ",
  p1 = function (e, n) {
    var r = n || this,
      i = r.xPercent,
      o = r.yPercent,
      l = r.x,
      s = r.y,
      a = r.z,
      u = r.rotation,
      c = r.rotationY,
      f = r.rotationX,
      d = r.skewX,
      p = r.skewY,
      v = r.scaleX,
      m = r.scaleY,
      x = r.transformPerspective,
      g = r.force3D,
      h = r.target,
      y = r.zOrigin,
      _ = "",
      k = (g === "auto" && e && e !== 1) || g === !0;
    if (y && (f !== Si || c !== Si)) {
      var E = parseFloat(c) * $o,
        C = Math.sin(E),
        T = Math.cos(E),
        N;
      (E = parseFloat(f) * $o),
        (N = Math.cos(E)),
        (l = jc(h, l, C * N * -y)),
        (s = jc(h, s, -Math.sin(E) * -y)),
        (a = jc(h, a, T * N * -y + y));
    }
    x !== Sl && (_ += "perspective(" + x + ki),
      (i || o) && (_ += "translate(" + i + "%, " + o + "%) "),
      (k || l !== Sl || s !== Sl || a !== Sl) &&
        (_ +=
          a !== Sl || k
            ? "translate3d(" + l + ", " + s + ", " + a + ") "
            : "translate(" + l + ", " + s + ki),
      u !== Si && (_ += "rotate(" + u + ki),
      c !== Si && (_ += "rotateY(" + c + ki),
      f !== Si && (_ += "rotateX(" + f + ki),
      (d !== Si || p !== Si) && (_ += "skew(" + d + ", " + p + ki),
      (v !== 1 || m !== 1) && (_ += "scale(" + v + ", " + m + ki),
      (h.style[Te] = _ || "translate(0, 0)");
  },
  lS = function (e, n) {
    var r = n || this,
      i = r.xPercent,
      o = r.yPercent,
      l = r.x,
      s = r.y,
      a = r.rotation,
      u = r.skewX,
      c = r.skewY,
      f = r.scaleX,
      d = r.scaleY,
      p = r.target,
      v = r.xOrigin,
      m = r.yOrigin,
      x = r.xOffset,
      g = r.yOffset,
      h = r.forceCSS,
      y = parseFloat(l),
      _ = parseFloat(s),
      k,
      E,
      C,
      T,
      N;
    (a = parseFloat(a)),
      (u = parseFloat(u)),
      (c = parseFloat(c)),
      c && ((c = parseFloat(c)), (u += c), (a += c)),
      a || u
        ? ((a *= $o),
          (u *= $o),
          (k = Math.cos(a) * f),
          (E = Math.sin(a) * f),
          (C = Math.sin(a - u) * -d),
          (T = Math.cos(a - u) * d),
          u &&
            ((c *= $o),
            (N = Math.tan(u - c)),
            (N = Math.sqrt(1 + N * N)),
            (C *= N),
            (T *= N),
            c &&
              ((N = Math.tan(c)),
              (N = Math.sqrt(1 + N * N)),
              (k *= N),
              (E *= N))),
          (k = Ie(k)),
          (E = Ie(E)),
          (C = Ie(C)),
          (T = Ie(T)))
        : ((k = f), (T = d), (E = C = 0)),
      ((y && !~(l + "").indexOf("px")) || (_ && !~(s + "").indexOf("px"))) &&
        ((y = ci(p, "x", l, "px")), (_ = ci(p, "y", s, "px"))),
      (v || m || x || g) &&
        ((y = Ie(y + v - (v * k + m * C) + x)),
        (_ = Ie(_ + m - (v * E + m * T) + g))),
      (i || o) &&
        ((N = p.getBBox()),
        (y = Ie(y + (i / 100) * N.width)),
        (_ = Ie(_ + (o / 100) * N.height))),
      (N =
        "matrix(" + k + "," + E + "," + C + "," + T + "," + y + "," + _ + ")"),
      p.setAttribute("transform", N),
      h && (p.style[Te] = N);
  },
  sS = function (e, n, r, i, o) {
    var l = 360,
      s = it(o),
      a = parseFloat(o) * (s && ~o.indexOf("rad") ? Pi : 1),
      u = a - i,
      c = i + u + "deg",
      f,
      d;
    return (
      s &&
        ((f = o.split("_")[1]),
        f === "short" && ((u %= l), u !== u % (l / 2) && (u += u < 0 ? l : -l)),
        f === "cw" && u < 0
          ? (u = ((u + l * a0) % l) - ~~(u / l) * l)
          : f === "ccw" && u > 0 && (u = ((u - l * a0) % l) - ~~(u / l) * l)),
      (e._pt = d = new Qt(e._pt, n, r, i, u, H2)),
      (d.e = c),
      (d.u = "deg"),
      e._props.push(r),
      d
    );
  },
  h0 = function (e, n) {
    for (var r in n) e[r] = n[r];
    return e;
  },
  aS = function (e, n, r) {
    var i = h0({}, r._gsap),
      o = "perspective,force3D,transformOrigin,svgOrigin",
      l = r.style,
      s,
      a,
      u,
      c,
      f,
      d,
      p,
      v;
    i.svg
      ? ((u = r.getAttribute("transform")),
        r.setAttribute("transform", ""),
        (l[Te] = n),
        (s = Ts(r, 1)),
        Ki(r, Te),
        r.setAttribute("transform", u))
      : ((u = getComputedStyle(r)[Te]),
        (l[Te] = n),
        (s = Ts(r, 1)),
        (l[Te] = u));
    for (a in Nr)
      (u = i[a]),
        (c = s[a]),
        u !== c &&
          o.indexOf(a) < 0 &&
          ((p = wt(u)),
          (v = wt(c)),
          (f = p !== v ? ci(r, a, u, v) : parseFloat(u)),
          (d = parseFloat(c)),
          (e._pt = new Qt(e._pt, s, a, f, d - f, Kf)),
          (e._pt.u = v || 0),
          e._props.push(a));
    h0(s, i);
  };
Xt("padding,margin,Width,Radius", function (t, e) {
  var n = "Top",
    r = "Right",
    i = "Bottom",
    o = "Left",
    l = (e < 3 ? [n, r, i, o] : [n + o, n + r, i + r, i + o]).map(function (s) {
      return e < 2 ? t + s : "border" + s + t;
    });
  wu[e > 1 ? "border" + t : t] = function (s, a, u, c, f) {
    var d, p;
    if (arguments.length < 4)
      return (
        (d = l.map(function (v) {
          return hr(s, v, u);
        })),
        (p = d.join(" ")),
        p.split(d[0]).length === 5 ? d[0] : p
      );
    (d = (c + "").split(" ")),
      (p = {}),
      l.forEach(function (v, m) {
        return (p[v] = d[m] = d[m] || d[((m - 1) / 2) | 0]);
      }),
      s.init(a, p, f);
  };
});
var h1 = {
  name: "css",
  register: Jf,
  targetTest: function (e) {
    return e.style && e.nodeType;
  },
  init: function (e, n, r, i, o) {
    var l = this._props,
      s = e.style,
      a = r.vars.startAt,
      u,
      c,
      f,
      d,
      p,
      v,
      m,
      x,
      g,
      h,
      y,
      _,
      k,
      E,
      C,
      T;
    kp || Jf(),
      (this.styles = this.styles || s1(e)),
      (T = this.styles.props),
      (this.tween = r);
    for (m in n)
      if (m !== "autoRound" && ((c = n[m]), !(rn[m] && Kv(m, n, r, i, e, o)))) {
        if (
          ((p = typeof c),
          (v = wu[m]),
          p === "function" && ((c = c.call(r, i, e, o)), (p = typeof c)),
          p === "string" && ~c.indexOf("random(") && (c = ks(c)),
          v)
        )
          v(this, e, m, c, r) && (C = 1);
        else if (m.substr(0, 2) === "--")
          (u = (getComputedStyle(e).getPropertyValue(m) + "").trim()),
            (c += ""),
            (oi.lastIndex = 0),
            oi.test(u) || ((x = wt(u)), (g = wt(c))),
            g ? x !== g && (u = ci(e, m, u, g) + g) : x && (c += x),
            this.add(s, "setProperty", u, c, i, o, 0, 0, m),
            l.push(m),
            T.push(m, 0, s[m]);
        else if (p !== "undefined") {
          if (
            (a && m in a
              ? ((u = typeof a[m] == "function" ? a[m].call(r, i, e, o) : a[m]),
                it(u) && ~u.indexOf("random(") && (u = ks(u)),
                wt(u + "") ||
                  u === "auto" ||
                  (u += cn.units[m] || wt(hr(e, m)) || ""),
                (u + "").charAt(1) === "=" && (u = hr(e, m)))
              : (u = hr(e, m)),
            (d = parseFloat(u)),
            (h = p === "string" && c.charAt(1) === "=" && c.substr(0, 2)),
            h && (c = c.substr(2)),
            (f = parseFloat(c)),
            m in Zn &&
              (m === "autoAlpha" &&
                (d === 1 && hr(e, "visibility") === "hidden" && f && (d = 0),
                T.push("visibility", 0, s.visibility),
                Xr(
                  this,
                  s,
                  "visibility",
                  d ? "inherit" : "hidden",
                  f ? "inherit" : "hidden",
                  !f
                )),
              m !== "scale" &&
                m !== "transform" &&
                ((m = Zn[m]), ~m.indexOf(",") && (m = m.split(",")[0]))),
            (y = m in Nr),
            y)
          ) {
            if (
              (this.styles.save(m),
              _ ||
                ((k = e._gsap),
                (k.renderTransform && !n.parseTransform) ||
                  Ts(e, n.parseTransform),
                (E = n.smoothOrigin !== !1 && k.smooth),
                (_ = this._pt =
                  new Qt(this._pt, s, Te, 0, 1, k.renderTransform, k, 0, -1)),
                (_.dep = 1)),
              m === "scale")
            )
              (this._pt = new Qt(
                this._pt,
                k,
                "scaleY",
                k.scaleY,
                (h ? Io(k.scaleY, h + f) : f) - k.scaleY || 0,
                Kf
              )),
                (this._pt.u = 0),
                l.push("scaleY", m),
                (m += "X");
            else if (m === "transformOrigin") {
              T.push(Gt, 0, s[Gt]),
                (c = rS(c)),
                k.svg
                  ? Zf(e, c, 0, E, 0, this)
                  : ((g = parseFloat(c.split(" ")[2]) || 0),
                    g !== k.zOrigin && Xr(this, k, "zOrigin", k.zOrigin, g),
                    Xr(this, s, m, Su(u), Su(c)));
              continue;
            } else if (m === "svgOrigin") {
              Zf(e, c, 1, E, 0, this);
              continue;
            } else if (m in f1) {
              sS(this, k, m, d, h ? Io(d, h + c) : c);
              continue;
            } else if (m === "smoothOrigin") {
              Xr(this, k, "smooth", k.smooth, c);
              continue;
            } else if (m === "force3D") {
              k[m] = c;
              continue;
            } else if (m === "transform") {
              aS(this, c, e);
              continue;
            }
          } else m in s || (m = tl(m) || m);
          if (y || ((f || f === 0) && (d || d === 0) && !V2.test(c) && m in s))
            (x = (u + "").substr((d + "").length)),
              f || (f = 0),
              (g = wt(c) || (m in cn.units ? cn.units[m] : x)),
              x !== g && (d = ci(e, m, u, g)),
              (this._pt = new Qt(
                this._pt,
                y ? k : s,
                m,
                d,
                (h ? Io(d, h + f) : f) - d,
                !y && (g === "px" || m === "zIndex") && n.autoRound !== !1
                  ? Y2
                  : Kf
              )),
              (this._pt.u = g || 0),
              x !== g && g !== "%" && ((this._pt.b = u), (this._pt.r = W2));
          else if (m in s) nS.call(this, e, m, u, h ? h + c : c);
          else if (m in e) this.add(e, m, u || e[m], h ? h + c : c, i, o);
          else if (m !== "parseTransform") {
            hp(m, c);
            continue;
          }
          y || (m in s ? T.push(m, 0, s[m]) : T.push(m, 1, u || e[m])),
            l.push(m);
        }
      }
    C && n1(this);
  },
  render: function (e, n) {
    if (n.tween._time || !Cp())
      for (var r = n._pt; r; ) r.r(e, r.d), (r = r._next);
    else n.styles.revert();
  },
  get: hr,
  aliases: Zn,
  getSetter: function (e, n, r) {
    var i = Zn[n];
    return (
      i && i.indexOf(",") < 0 && (n = i),
      n in Nr && n !== Gt && (e._gsap.x || hr(e, "x"))
        ? r && s0 === r
          ? n === "scale"
            ? K2
            : G2
          : (s0 = r || {}) && (n === "scale" ? q2 : J2)
        : e.style && !fp(e.style[n])
        ? X2
        : ~n.indexOf("-")
        ? Q2
        : wp(e, n)
    );
  },
  core: { _removeProperty: Ki, _getMatrix: Pp },
};
Kt.utils.checkPrefix = tl;
Kt.core.getStyleSaver = s1;
(function (t, e, n, r) {
  var i = Xt(t + "," + e + "," + n, function (o) {
    Nr[o] = 1;
  });
  Xt(e, function (o) {
    (cn.units[o] = "deg"), (f1[o] = 1);
  }),
    (Zn[i[13]] = t + "," + e),
    Xt(r, function (o) {
      var l = o.split(":");
      Zn[l[1]] = i[l[0]];
    });
})(
  "x,y,z,scale,scaleX,scaleY,xPercent,yPercent",
  "rotation,rotationX,rotationY,skewX,skewY",
  "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective",
  "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY"
);
Xt(
  "x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",
  function (t) {
    cn.units[t] = "px";
  }
);
Kt.registerPlugin(h1);
var re = Kt.registerPlugin(h1) || Kt;
re.core.Tween;
/*!
 * @gsap/react 2.1.1
 * https://gsap.com
 *
 * Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */ let m0 = typeof window < "u" ? P.useLayoutEffect : P.useEffect,
  g0 = (t) => t && !Array.isArray(t) && typeof t == "object",
  aa = [],
  uS = {},
  m1 = re;
const fi = (t, e = aa) => {
  let n = uS;
  g0(t)
    ? ((n = t), (t = null), (e = "dependencies" in n ? n.dependencies : aa))
    : g0(e) && ((n = e), (e = "dependencies" in n ? n.dependencies : aa)),
    t &&
      typeof t != "function" &&
      console.warn("First parameter must be a function or config object");
  const { scope: r, revertOnUpdate: i } = n,
    o = P.useRef(!1),
    l = P.useRef(m1.context(() => {}, r)),
    s = P.useRef((u) => l.current.add(null, u)),
    a = e && e.length && !i;
  return (
    m0(() => {
      if ((t && l.current.add(t, r), !a || !o.current))
        return () => l.current.revert();
    }, e),
    a && m0(() => ((o.current = !0), () => l.current.revert()), aa),
    { context: l.current, contextSafe: s.current }
  );
};
fi.register = (t) => {
  m1 = t;
};
fi.headless = !0;
function cS(t, e) {
  for (var n = 0; n < e.length; n++) {
    var r = e[n];
    (r.enumerable = r.enumerable || !1),
      (r.configurable = !0),
      "value" in r && (r.writable = !0),
      Object.defineProperty(t, r.key, r);
  }
}
function fS(t, e, n) {
  return e && cS(t.prototype, e), t;
}
/*!
 * Observer 3.12.5
 * https://gsap.com
 *
 * @license Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */ var at,
  ba,
  ln,
  Qr,
  Gr,
  Bo,
  g1,
  Ti,
  Ql,
  v1,
  yr,
  Fn,
  y1,
  _1 = function () {
    return (
      at ||
      (typeof window < "u" && (at = window.gsap) && at.registerPlugin && at)
    );
  },
  x1 = 1,
  Mo = [],
  J = [],
  ir = [],
  Gl = Date.now,
  ed = function (e, n) {
    return n;
  },
  dS = function () {
    var e = Ql.core,
      n = e.bridge || {},
      r = e._scrollers,
      i = e._proxies;
    r.push.apply(r, J),
      i.push.apply(i, ir),
      (J = r),
      (ir = i),
      (ed = function (l, s) {
        return n[l](s);
      });
  },
  li = function (e, n) {
    return ~ir.indexOf(e) && ir[ir.indexOf(e) + 1][n];
  },
  Kl = function (e) {
    return !!~v1.indexOf(e);
  },
  Nt = function (e, n, r, i, o) {
    return e.addEventListener(n, r, { passive: i !== !1, capture: !!o });
  },
  Tt = function (e, n, r, i) {
    return e.removeEventListener(n, r, !!i);
  },
  ua = "scrollLeft",
  ca = "scrollTop",
  td = function () {
    return (yr && yr.isPressed) || J.cache++;
  },
  ku = function (e, n) {
    var r = function i(o) {
      if (o || o === 0) {
        x1 && (ln.history.scrollRestoration = "manual");
        var l = yr && yr.isPressed;
        (o = i.v = Math.round(o) || (yr && yr.iOS ? 1 : 0)),
          e(o),
          (i.cacheID = J.cache),
          l && ed("ss", o);
      } else
        (n || J.cache !== i.cacheID || ed("ref")) &&
          ((i.cacheID = J.cache), (i.v = e()));
      return i.v + i.offset;
    };
    return (r.offset = 0), e && r;
  },
  Dt = {
    s: ua,
    p: "left",
    p2: "Left",
    os: "right",
    os2: "Right",
    d: "width",
    d2: "Width",
    a: "x",
    sc: ku(function (t) {
      return arguments.length
        ? ln.scrollTo(t, Ge.sc())
        : ln.pageXOffset || Qr[ua] || Gr[ua] || Bo[ua] || 0;
    }),
  },
  Ge = {
    s: ca,
    p: "top",
    p2: "Top",
    os: "bottom",
    os2: "Bottom",
    d: "height",
    d2: "Height",
    a: "y",
    op: Dt,
    sc: ku(function (t) {
      return arguments.length
        ? ln.scrollTo(Dt.sc(), t)
        : ln.pageYOffset || Qr[ca] || Gr[ca] || Bo[ca] || 0;
    }),
  },
  $t = function (e, n) {
    return (
      ((n && n._ctx && n._ctx.selector) || at.utils.toArray)(e)[0] ||
      (typeof e == "string" && at.config().nullTargetWarn !== !1
        ? console.warn("Element not found:", e)
        : null)
    );
  },
  di = function (e, n) {
    var r = n.s,
      i = n.sc;
    Kl(e) && (e = Qr.scrollingElement || Gr);
    var o = J.indexOf(e),
      l = i === Ge.sc ? 1 : 2;
    !~o && (o = J.push(e) - 1), J[o + l] || Nt(e, "scroll", td);
    var s = J[o + l],
      a =
        s ||
        (J[o + l] =
          ku(li(e, r), !0) ||
          (Kl(e)
            ? i
            : ku(function (u) {
                return arguments.length ? (e[r] = u) : e[r];
              })));
    return (
      (a.target = e),
      s || (a.smooth = at.getProperty(e, "scrollBehavior") === "smooth"),
      a
    );
  },
  nd = function (e, n, r) {
    var i = e,
      o = e,
      l = Gl(),
      s = l,
      a = n || 50,
      u = Math.max(500, a * 3),
      c = function (v, m) {
        var x = Gl();
        m || x - l > a
          ? ((o = i), (i = v), (s = l), (l = x))
          : r
          ? (i += v)
          : (i = o + ((v - o) / (x - s)) * (l - s));
      },
      f = function () {
        (o = i = r ? 0 : i), (s = l = 0);
      },
      d = function (v) {
        var m = s,
          x = o,
          g = Gl();
        return (
          (v || v === 0) && v !== i && c(v),
          l === s || g - s > u
            ? 0
            : ((i + (r ? x : -x)) / ((r ? g : l) - m)) * 1e3
        );
      };
    return { update: c, reset: f, getVelocity: d };
  },
  kl = function (e, n) {
    return (
      n && !e._gsapAllow && e.preventDefault(),
      e.changedTouches ? e.changedTouches[0] : e
    );
  },
  v0 = function (e) {
    var n = Math.max.apply(Math, e),
      r = Math.min.apply(Math, e);
    return Math.abs(n) >= Math.abs(r) ? n : r;
  },
  w1 = function () {
    (Ql = at.core.globals().ScrollTrigger), Ql && Ql.core && dS();
  },
  S1 = function (e) {
    return (
      (at = e || _1()),
      !ba &&
        at &&
        typeof document < "u" &&
        document.body &&
        ((ln = window),
        (Qr = document),
        (Gr = Qr.documentElement),
        (Bo = Qr.body),
        (v1 = [ln, Qr, Gr, Bo]),
        at.utils.clamp,
        (y1 = at.core.context || function () {}),
        (Ti = "onpointerenter" in Bo ? "pointer" : "mouse"),
        (g1 = $e.isTouch =
          ln.matchMedia &&
          ln.matchMedia("(hover: none), (pointer: coarse)").matches
            ? 1
            : "ontouchstart" in ln ||
              navigator.maxTouchPoints > 0 ||
              navigator.msMaxTouchPoints > 0
            ? 2
            : 0),
        (Fn = $e.eventTypes =
          (
            "ontouchstart" in Gr
              ? "touchstart,touchmove,touchcancel,touchend"
              : "onpointerdown" in Gr
              ? "pointerdown,pointermove,pointercancel,pointerup"
              : "mousedown,mousemove,mouseup,mouseup"
          ).split(",")),
        setTimeout(function () {
          return (x1 = 0);
        }, 500),
        w1(),
        (ba = 1)),
      ba
    );
  };
Dt.op = Ge;
J.cache = 0;
var $e = (function () {
  function t(n) {
    this.init(n);
  }
  var e = t.prototype;
  return (
    (e.init = function (r) {
      ba || S1(at) || console.warn("Please gsap.registerPlugin(Observer)"),
        Ql || w1();
      var i = r.tolerance,
        o = r.dragMinimum,
        l = r.type,
        s = r.target,
        a = r.lineHeight,
        u = r.debounce,
        c = r.preventDefault,
        f = r.onStop,
        d = r.onStopDelay,
        p = r.ignore,
        v = r.wheelSpeed,
        m = r.event,
        x = r.onDragStart,
        g = r.onDragEnd,
        h = r.onDrag,
        y = r.onPress,
        _ = r.onRelease,
        k = r.onRight,
        E = r.onLeft,
        C = r.onUp,
        T = r.onDown,
        N = r.onChangeX,
        R = r.onChangeY,
        I = r.onChange,
        z = r.onToggleX,
        H = r.onToggleY,
        X = r.onHover,
        ee = r.onHoverEnd,
        Q = r.onMove,
        $ = r.ignoreCheck,
        M = r.isNormalizer,
        j = r.onGestureStart,
        S = r.onGestureEnd,
        U = r.onWheel,
        oe = r.onEnable,
        ft = r.onDisable,
        ue = r.onClick,
        De = r.scrollSpeed,
        Se = r.capture,
        me = r.allowClicks,
        Et = r.lockAxis,
        dt = r.onLockAxis;
      (this.target = s = $t(s) || Gr),
        (this.vars = r),
        p && (p = at.utils.toArray(p)),
        (i = i || 1e-9),
        (o = o || 0),
        (v = v || 1),
        (De = De || 1),
        (l = l || "wheel,touch,pointer"),
        (u = u !== !1),
        a || (a = parseFloat(ln.getComputedStyle(Bo).lineHeight) || 22);
      var Mr,
        Pt,
        Rn,
        se,
        je,
        bt,
        qt,
        O = this,
        Jt = 0,
        ar = 0,
        Lr = r.passive || !c,
        Be = di(s, Dt),
        zr = di(s, Ge),
        vi = Be(),
        oo = zr(),
        qe =
          ~l.indexOf("touch") &&
          !~l.indexOf("pointer") &&
          Fn[0] === "pointerdown",
        Dr = Kl(s),
        Fe = s.ownerDocument || Qr,
        On = [0, 0, 0],
        mn = [0, 0, 0],
        ur = 0,
        al = function () {
          return (ur = Gl());
        },
        Ue = function (B, ae) {
          return (
            ((O.event = B) && p && ~p.indexOf(B.target)) ||
            (ae && qe && B.pointerType !== "touch") ||
            ($ && $(B, ae))
          );
        },
        $s = function () {
          O._vx.reset(), O._vy.reset(), Pt.pause(), f && f(O);
        },
        jr = function () {
          var B = (O.deltaX = v0(On)),
            ae = (O.deltaY = v0(mn)),
            D = Math.abs(B) >= i,
            Y = Math.abs(ae) >= i;
          I && (D || Y) && I(O, B, ae, On, mn),
            D &&
              (k && O.deltaX > 0 && k(O),
              E && O.deltaX < 0 && E(O),
              N && N(O),
              z && O.deltaX < 0 != Jt < 0 && z(O),
              (Jt = O.deltaX),
              (On[0] = On[1] = On[2] = 0)),
            Y &&
              (T && O.deltaY > 0 && T(O),
              C && O.deltaY < 0 && C(O),
              R && R(O),
              H && O.deltaY < 0 != ar < 0 && H(O),
              (ar = O.deltaY),
              (mn[0] = mn[1] = mn[2] = 0)),
            (se || Rn) && (Q && Q(O), Rn && (h(O), (Rn = !1)), (se = !1)),
            bt && !(bt = !1) && dt && dt(O),
            je && (U(O), (je = !1)),
            (Mr = 0);
        },
        lo = function (B, ae, D) {
          (On[D] += B),
            (mn[D] += ae),
            O._vx.update(B),
            O._vy.update(ae),
            u ? Mr || (Mr = requestAnimationFrame(jr)) : jr();
        },
        so = function (B, ae) {
          Et &&
            !qt &&
            ((O.axis = qt = Math.abs(B) > Math.abs(ae) ? "x" : "y"), (bt = !0)),
            qt !== "y" && ((On[2] += B), O._vx.update(B, !0)),
            qt !== "x" && ((mn[2] += ae), O._vy.update(ae, !0)),
            u ? Mr || (Mr = requestAnimationFrame(jr)) : jr();
        },
        Fr = function (B) {
          if (!Ue(B, 1)) {
            B = kl(B, c);
            var ae = B.clientX,
              D = B.clientY,
              Y = ae - O.x,
              b = D - O.y,
              V = O.isDragging;
            (O.x = ae),
              (O.y = D),
              (V ||
                Math.abs(O.startX - ae) >= o ||
                Math.abs(O.startY - D) >= o) &&
                (h && (Rn = !0),
                V || (O.isDragging = !0),
                so(Y, b),
                V || (x && x(O)));
          }
        },
        yi = (O.onPress = function (W) {
          Ue(W, 1) ||
            (W && W.button) ||
            ((O.axis = qt = null),
            Pt.pause(),
            (O.isPressed = !0),
            (W = kl(W)),
            (Jt = ar = 0),
            (O.startX = O.x = W.clientX),
            (O.startY = O.y = W.clientY),
            O._vx.reset(),
            O._vy.reset(),
            Nt(M ? s : Fe, Fn[1], Fr, Lr, !0),
            (O.deltaX = O.deltaY = 0),
            y && y(O));
        }),
        q = (O.onRelease = function (W) {
          if (!Ue(W, 1)) {
            Tt(M ? s : Fe, Fn[1], Fr, !0);
            var B = !isNaN(O.y - O.startY),
              ae = O.isDragging,
              D =
                ae &&
                (Math.abs(O.x - O.startX) > 3 || Math.abs(O.y - O.startY) > 3),
              Y = kl(W);
            !D &&
              B &&
              (O._vx.reset(),
              O._vy.reset(),
              c &&
                me &&
                at.delayedCall(0.08, function () {
                  if (Gl() - ur > 300 && !W.defaultPrevented) {
                    if (W.target.click) W.target.click();
                    else if (Fe.createEvent) {
                      var b = Fe.createEvent("MouseEvents");
                      b.initMouseEvent(
                        "click",
                        !0,
                        !0,
                        ln,
                        1,
                        Y.screenX,
                        Y.screenY,
                        Y.clientX,
                        Y.clientY,
                        !1,
                        !1,
                        !1,
                        !1,
                        0,
                        null
                      ),
                        W.target.dispatchEvent(b);
                    }
                  }
                })),
              (O.isDragging = O.isGesturing = O.isPressed = !1),
              f && ae && !M && Pt.restart(!0),
              g && ae && g(O),
              _ && _(O, D);
          }
        }),
        _i = function (B) {
          return (
            B.touches &&
            B.touches.length > 1 &&
            (O.isGesturing = !0) &&
            j(B, O.isDragging)
          );
        },
        Mn = function () {
          return (O.isGesturing = !1) || S(O);
        },
        Ln = function (B) {
          if (!Ue(B)) {
            var ae = Be(),
              D = zr();
            lo((ae - vi) * De, (D - oo) * De, 1),
              (vi = ae),
              (oo = D),
              f && Pt.restart(!0);
          }
        },
        zn = function (B) {
          if (!Ue(B)) {
            (B = kl(B, c)), U && (je = !0);
            var ae =
              (B.deltaMode === 1 ? a : B.deltaMode === 2 ? ln.innerHeight : 1) *
              v;
            lo(B.deltaX * ae, B.deltaY * ae, 0), f && !M && Pt.restart(!0);
          }
        },
        xi = function (B) {
          if (!Ue(B)) {
            var ae = B.clientX,
              D = B.clientY,
              Y = ae - O.x,
              b = D - O.y;
            (O.x = ae),
              (O.y = D),
              (se = !0),
              f && Pt.restart(!0),
              (Y || b) && so(Y, b);
          }
        },
        ao = function (B) {
          (O.event = B), X(O);
        },
        cr = function (B) {
          (O.event = B), ee(O);
        },
        ul = function (B) {
          return Ue(B) || (kl(B, c) && ue(O));
        };
      (Pt = O._dc = at.delayedCall(d || 0.25, $s).pause()),
        (O.deltaX = O.deltaY = 0),
        (O._vx = nd(0, 50, !0)),
        (O._vy = nd(0, 50, !0)),
        (O.scrollX = Be),
        (O.scrollY = zr),
        (O.isDragging = O.isGesturing = O.isPressed = !1),
        y1(this),
        (O.enable = function (W) {
          return (
            O.isEnabled ||
              (Nt(Dr ? Fe : s, "scroll", td),
              l.indexOf("scroll") >= 0 && Nt(Dr ? Fe : s, "scroll", Ln, Lr, Se),
              l.indexOf("wheel") >= 0 && Nt(s, "wheel", zn, Lr, Se),
              ((l.indexOf("touch") >= 0 && g1) || l.indexOf("pointer") >= 0) &&
                (Nt(s, Fn[0], yi, Lr, Se),
                Nt(Fe, Fn[2], q),
                Nt(Fe, Fn[3], q),
                me && Nt(s, "click", al, !0, !0),
                ue && Nt(s, "click", ul),
                j && Nt(Fe, "gesturestart", _i),
                S && Nt(Fe, "gestureend", Mn),
                X && Nt(s, Ti + "enter", ao),
                ee && Nt(s, Ti + "leave", cr),
                Q && Nt(s, Ti + "move", xi)),
              (O.isEnabled = !0),
              W && W.type && yi(W),
              oe && oe(O)),
            O
          );
        }),
        (O.disable = function () {
          O.isEnabled &&
            (Mo.filter(function (W) {
              return W !== O && Kl(W.target);
            }).length || Tt(Dr ? Fe : s, "scroll", td),
            O.isPressed &&
              (O._vx.reset(), O._vy.reset(), Tt(M ? s : Fe, Fn[1], Fr, !0)),
            Tt(Dr ? Fe : s, "scroll", Ln, Se),
            Tt(s, "wheel", zn, Se),
            Tt(s, Fn[0], yi, Se),
            Tt(Fe, Fn[2], q),
            Tt(Fe, Fn[3], q),
            Tt(s, "click", al, !0),
            Tt(s, "click", ul),
            Tt(Fe, "gesturestart", _i),
            Tt(Fe, "gestureend", Mn),
            Tt(s, Ti + "enter", ao),
            Tt(s, Ti + "leave", cr),
            Tt(s, Ti + "move", xi),
            (O.isEnabled = O.isPressed = O.isDragging = !1),
            ft && ft(O));
        }),
        (O.kill = O.revert =
          function () {
            O.disable();
            var W = Mo.indexOf(O);
            W >= 0 && Mo.splice(W, 1), yr === O && (yr = 0);
          }),
        Mo.push(O),
        M && Kl(s) && (yr = O),
        O.enable(m);
    }),
    fS(t, [
      {
        key: "velocityX",
        get: function () {
          return this._vx.getVelocity();
        },
      },
      {
        key: "velocityY",
        get: function () {
          return this._vy.getVelocity();
        },
      },
    ]),
    t
  );
})();
$e.version = "3.12.5";
$e.create = function (t) {
  return new $e(t);
};
$e.register = S1;
$e.getAll = function () {
  return Mo.slice();
};
$e.getById = function (t) {
  return Mo.filter(function (e) {
    return e.vars.id === t;
  })[0];
};
_1() && at.registerPlugin($e);
/*!
 * ScrollTrigger 3.12.5
 * https://gsap.com
 *
 * @license Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */ var A,
  mo,
  ne,
  Ce,
  $n,
  ve,
  k1,
  Cu,
  Ns,
  ql,
  Ml,
  fa,
  yt,
  qu,
  rd,
  Mt,
  y0,
  _0,
  go,
  C1,
  Fc,
  E1,
  Rt,
  id,
  P1,
  T1,
  Ir,
  od,
  Tp,
  Uo,
  Np,
  Eu,
  ld,
  Ac,
  da = 1,
  _t = Date.now,
  Ic = _t(),
  En = 0,
  Ll = 0,
  x0 = function (e, n, r) {
    var i = nn(e) && (e.substr(0, 6) === "clamp(" || e.indexOf("max") > -1);
    return (r["_" + n + "Clamp"] = i), i ? e.substr(6, e.length - 7) : e;
  },
  w0 = function (e, n) {
    return n && (!nn(e) || e.substr(0, 6) !== "clamp(")
      ? "clamp(" + e + ")"
      : e;
  },
  pS = function t() {
    return Ll && requestAnimationFrame(t);
  },
  S0 = function () {
    return (qu = 1);
  },
  k0 = function () {
    return (qu = 0);
  },
  Kn = function (e) {
    return e;
  },
  zl = function (e) {
    return Math.round(e * 1e5) / 1e5 || 0;
  },
  N1 = function () {
    return typeof window < "u";
  },
  R1 = function () {
    return A || (N1() && (A = window.gsap) && A.registerPlugin && A);
  },
  qi = function (e) {
    return !!~k1.indexOf(e);
  },
  O1 = function (e) {
    return (
      (e === "Height" ? Np : ne["inner" + e]) ||
      $n["client" + e] ||
      ve["client" + e]
    );
  },
  M1 = function (e) {
    return (
      li(e, "getBoundingClientRect") ||
      (qi(e)
        ? function () {
            return (Ha.width = ne.innerWidth), (Ha.height = Np), Ha;
          }
        : function () {
            return mr(e);
          })
    );
  },
  hS = function (e, n, r) {
    var i = r.d,
      o = r.d2,
      l = r.a;
    return (l = li(e, "getBoundingClientRect"))
      ? function () {
          return l()[i];
        }
      : function () {
          return (n ? O1(o) : e["client" + o]) || 0;
        };
  },
  mS = function (e, n) {
    return !n || ~ir.indexOf(e)
      ? M1(e)
      : function () {
          return Ha;
        };
  },
  er = function (e, n) {
    var r = n.s,
      i = n.d2,
      o = n.d,
      l = n.a;
    return Math.max(
      0,
      (r = "scroll" + i) && (l = li(e, r))
        ? l() - M1(e)()[o]
        : qi(e)
        ? ($n[r] || ve[r]) - O1(i)
        : e[r] - e["offset" + i]
    );
  },
  pa = function (e, n) {
    for (var r = 0; r < go.length; r += 3)
      (!n || ~n.indexOf(go[r + 1])) && e(go[r], go[r + 1], go[r + 2]);
  },
  nn = function (e) {
    return typeof e == "string";
  },
  jt = function (e) {
    return typeof e == "function";
  },
  Dl = function (e) {
    return typeof e == "number";
  },
  Ni = function (e) {
    return typeof e == "object";
  },
  Cl = function (e, n, r) {
    return e && e.progress(n ? 0 : 1) && r && e.pause();
  },
  bc = function (e, n) {
    if (e.enabled) {
      var r = e._ctx
        ? e._ctx.add(function () {
            return n(e);
          })
        : n(e);
      r && r.totalTime && (e.callbackAnimation = r);
    }
  },
  fo = Math.abs,
  L1 = "left",
  z1 = "top",
  Rp = "right",
  Op = "bottom",
  Bi = "width",
  Ui = "height",
  Jl = "Right",
  Zl = "Left",
  es = "Top",
  ts = "Bottom",
  Ve = "padding",
  _n = "margin",
  nl = "Width",
  Mp = "Height",
  Xe = "px",
  xn = function (e) {
    return ne.getComputedStyle(e);
  },
  gS = function (e) {
    var n = xn(e).position;
    e.style.position = n === "absolute" || n === "fixed" ? n : "relative";
  },
  C0 = function (e, n) {
    for (var r in n) r in e || (e[r] = n[r]);
    return e;
  },
  mr = function (e, n) {
    var r =
        n &&
        xn(e)[rd] !== "matrix(1, 0, 0, 1, 0, 0)" &&
        A.to(e, {
          x: 0,
          y: 0,
          xPercent: 0,
          yPercent: 0,
          rotation: 0,
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          skewX: 0,
          skewY: 0,
        }).progress(1),
      i = e.getBoundingClientRect();
    return r && r.progress(0).kill(), i;
  },
  Pu = function (e, n) {
    var r = n.d2;
    return e["offset" + r] || e["client" + r] || 0;
  },
  D1 = function (e) {
    var n = [],
      r = e.labels,
      i = e.duration(),
      o;
    for (o in r) n.push(r[o] / i);
    return n;
  },
  vS = function (e) {
    return function (n) {
      return A.utils.snap(D1(e), n);
    };
  },
  Lp = function (e) {
    var n = A.utils.snap(e),
      r =
        Array.isArray(e) &&
        e.slice(0).sort(function (i, o) {
          return i - o;
        });
    return r
      ? function (i, o, l) {
          l === void 0 && (l = 0.001);
          var s;
          if (!o) return n(i);
          if (o > 0) {
            for (i -= l, s = 0; s < r.length; s++) if (r[s] >= i) return r[s];
            return r[s - 1];
          } else for (s = r.length, i += l; s--; ) if (r[s] <= i) return r[s];
          return r[0];
        }
      : function (i, o, l) {
          l === void 0 && (l = 0.001);
          var s = n(i);
          return !o || Math.abs(s - i) < l || s - i < 0 == o < 0
            ? s
            : n(o < 0 ? i - e : i + e);
        };
  },
  yS = function (e) {
    return function (n, r) {
      return Lp(D1(e))(n, r.direction);
    };
  },
  ha = function (e, n, r, i) {
    return r.split(",").forEach(function (o) {
      return e(n, o, i);
    });
  },
  et = function (e, n, r, i, o) {
    return e.addEventListener(n, r, { passive: !i, capture: !!o });
  },
  Ze = function (e, n, r, i) {
    return e.removeEventListener(n, r, !!i);
  },
  ma = function (e, n, r) {
    (r = r && r.wheelHandler), r && (e(n, "wheel", r), e(n, "touchmove", r));
  },
  E0 = {
    startColor: "green",
    endColor: "red",
    indent: 0,
    fontSize: "16px",
    fontWeight: "normal",
  },
  ga = { toggleActions: "play", anticipatePin: 0 },
  Tu = { top: 0, left: 0, center: 0.5, bottom: 1, right: 1 },
  $a = function (e, n) {
    if (nn(e)) {
      var r = e.indexOf("="),
        i = ~r ? +(e.charAt(r - 1) + 1) * parseFloat(e.substr(r + 1)) : 0;
      ~r && (e.indexOf("%") > r && (i *= n / 100), (e = e.substr(0, r - 1))),
        (e =
          i +
          (e in Tu
            ? Tu[e] * n
            : ~e.indexOf("%")
            ? (parseFloat(e) * n) / 100
            : parseFloat(e) || 0));
    }
    return e;
  },
  va = function (e, n, r, i, o, l, s, a) {
    var u = o.startColor,
      c = o.endColor,
      f = o.fontSize,
      d = o.indent,
      p = o.fontWeight,
      v = Ce.createElement("div"),
      m = qi(r) || li(r, "pinType") === "fixed",
      x = e.indexOf("scroller") !== -1,
      g = m ? ve : r,
      h = e.indexOf("start") !== -1,
      y = h ? u : c,
      _ =
        "border-color:" +
        y +
        ";font-size:" +
        f +
        ";color:" +
        y +
        ";font-weight:" +
        p +
        ";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";
    return (
      (_ += "position:" + ((x || a) && m ? "fixed;" : "absolute;")),
      (x || a || !m) &&
        (_ += (i === Ge ? Rp : Op) + ":" + (l + parseFloat(d)) + "px;"),
      s &&
        (_ +=
          "box-sizing:border-box;text-align:left;width:" +
          s.offsetWidth +
          "px;"),
      (v._isStart = h),
      v.setAttribute("class", "gsap-marker-" + e + (n ? " marker-" + n : "")),
      (v.style.cssText = _),
      (v.innerText = n || n === 0 ? e + "-" + n : e),
      g.children[0] ? g.insertBefore(v, g.children[0]) : g.appendChild(v),
      (v._offset = v["offset" + i.op.d2]),
      Ba(v, 0, i, h),
      v
    );
  },
  Ba = function (e, n, r, i) {
    var o = { display: "block" },
      l = r[i ? "os2" : "p2"],
      s = r[i ? "p2" : "os2"];
    (e._isFlipped = i),
      (o[r.a + "Percent"] = i ? -100 : 0),
      (o[r.a] = i ? "1px" : 0),
      (o["border" + l + nl] = 1),
      (o["border" + s + nl] = 0),
      (o[r.p] = n + "px"),
      A.set(e, o);
  },
  K = [],
  sd = {},
  Rs,
  P0 = function () {
    return _t() - En > 34 && (Rs || (Rs = requestAnimationFrame(wr)));
  },
  po = function () {
    (!Rt || !Rt.isPressed || Rt.startX > ve.clientWidth) &&
      (J.cache++,
      Rt ? Rs || (Rs = requestAnimationFrame(wr)) : wr(),
      En || Zi("scrollStart"),
      (En = _t()));
  },
  $c = function () {
    (T1 = ne.innerWidth), (P1 = ne.innerHeight);
  },
  jl = function () {
    J.cache++,
      !yt &&
        !E1 &&
        !Ce.fullscreenElement &&
        !Ce.webkitFullscreenElement &&
        (!id ||
          T1 !== ne.innerWidth ||
          Math.abs(ne.innerHeight - P1) > ne.innerHeight * 0.25) &&
        Cu.restart(!0);
  },
  Ji = {},
  _S = [],
  j1 = function t() {
    return Ze(G, "scrollEnd", t) || zi(!0);
  },
  Zi = function (e) {
    return (
      (Ji[e] &&
        Ji[e].map(function (n) {
          return n();
        })) ||
      _S
    );
  },
  en = [],
  F1 = function (e) {
    for (var n = 0; n < en.length; n += 5)
      (!e || (en[n + 4] && en[n + 4].query === e)) &&
        ((en[n].style.cssText = en[n + 1]),
        en[n].getBBox && en[n].setAttribute("transform", en[n + 2] || ""),
        (en[n + 3].uncache = 1));
  },
  zp = function (e, n) {
    var r;
    for (Mt = 0; Mt < K.length; Mt++)
      (r = K[Mt]),
        r && (!n || r._ctx === n) && (e ? r.kill(1) : r.revert(!0, !0));
    (Eu = !0), n && F1(n), n || Zi("revert");
  },
  A1 = function (e, n) {
    J.cache++,
      (n || !Lt) &&
        J.forEach(function (r) {
          return jt(r) && r.cacheID++ && (r.rec = 0);
        }),
      nn(e) && (ne.history.scrollRestoration = Tp = e);
  },
  Lt,
  Vi = 0,
  T0,
  xS = function () {
    if (T0 !== Vi) {
      var e = (T0 = Vi);
      requestAnimationFrame(function () {
        return e === Vi && zi(!0);
      });
    }
  },
  I1 = function () {
    ve.appendChild(Uo),
      (Np = (!Rt && Uo.offsetHeight) || ne.innerHeight),
      ve.removeChild(Uo);
  },
  N0 = function (e) {
    return Ns(
      ".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end"
    ).forEach(function (n) {
      return (n.style.display = e ? "none" : "block");
    });
  },
  zi = function (e, n) {
    if (En && !e && !Eu) {
      et(G, "scrollEnd", j1);
      return;
    }
    I1(),
      (Lt = G.isRefreshing = !0),
      J.forEach(function (i) {
        return jt(i) && ++i.cacheID && (i.rec = i());
      });
    var r = Zi("refreshInit");
    C1 && G.sort(),
      n || zp(),
      J.forEach(function (i) {
        jt(i) && (i.smooth && (i.target.style.scrollBehavior = "auto"), i(0));
      }),
      K.slice(0).forEach(function (i) {
        return i.refresh();
      }),
      (Eu = !1),
      K.forEach(function (i) {
        if (i._subPinOffset && i.pin) {
          var o = i.vars.horizontal ? "offsetWidth" : "offsetHeight",
            l = i.pin[o];
          i.revert(!0, 1), i.adjustPinSpacing(i.pin[o] - l), i.refresh();
        }
      }),
      (ld = 1),
      N0(!0),
      K.forEach(function (i) {
        var o = er(i.scroller, i._dir),
          l = i.vars.end === "max" || (i._endClamp && i.end > o),
          s = i._startClamp && i.start >= o;
        (l || s) &&
          i.setPositions(
            s ? o - 1 : i.start,
            l ? Math.max(s ? o : i.start + 1, o) : i.end,
            !0
          );
      }),
      N0(!1),
      (ld = 0),
      r.forEach(function (i) {
        return i && i.render && i.render(-1);
      }),
      J.forEach(function (i) {
        jt(i) &&
          (i.smooth &&
            requestAnimationFrame(function () {
              return (i.target.style.scrollBehavior = "smooth");
            }),
          i.rec && i(i.rec));
      }),
      A1(Tp, 1),
      Cu.pause(),
      Vi++,
      (Lt = 2),
      wr(2),
      K.forEach(function (i) {
        return jt(i.vars.onRefresh) && i.vars.onRefresh(i);
      }),
      (Lt = G.isRefreshing = !1),
      Zi("refresh");
  },
  ad = 0,
  Ua = 1,
  ns,
  wr = function (e) {
    if (e === 2 || (!Lt && !Eu)) {
      (G.isUpdating = !0), ns && ns.update(0);
      var n = K.length,
        r = _t(),
        i = r - Ic >= 50,
        o = n && K[0].scroll();
      if (
        ((Ua = ad > o ? -1 : 1),
        Lt || (ad = o),
        i &&
          (En && !qu && r - En > 200 && ((En = 0), Zi("scrollEnd")),
          (Ml = Ic),
          (Ic = r)),
        Ua < 0)
      ) {
        for (Mt = n; Mt-- > 0; ) K[Mt] && K[Mt].update(0, i);
        Ua = 1;
      } else for (Mt = 0; Mt < n; Mt++) K[Mt] && K[Mt].update(0, i);
      G.isUpdating = !1;
    }
    Rs = 0;
  },
  ud = [
    L1,
    z1,
    Op,
    Rp,
    _n + ts,
    _n + Jl,
    _n + es,
    _n + Zl,
    "display",
    "flexShrink",
    "float",
    "zIndex",
    "gridColumnStart",
    "gridColumnEnd",
    "gridRowStart",
    "gridRowEnd",
    "gridArea",
    "justifySelf",
    "alignSelf",
    "placeSelf",
    "order",
  ],
  Va = ud.concat([
    Bi,
    Ui,
    "boxSizing",
    "max" + nl,
    "max" + Mp,
    "position",
    _n,
    Ve,
    Ve + es,
    Ve + Jl,
    Ve + ts,
    Ve + Zl,
  ]),
  wS = function (e, n, r) {
    Vo(r);
    var i = e._gsap;
    if (i.spacerIsNative) Vo(i.spacerState);
    else if (e._gsap.swappedIn) {
      var o = n.parentNode;
      o && (o.insertBefore(e, n), o.removeChild(n));
    }
    e._gsap.swappedIn = !1;
  },
  Bc = function (e, n, r, i) {
    if (!e._gsap.swappedIn) {
      for (var o = ud.length, l = n.style, s = e.style, a; o--; )
        (a = ud[o]), (l[a] = r[a]);
      (l.position = r.position === "absolute" ? "absolute" : "relative"),
        r.display === "inline" && (l.display = "inline-block"),
        (s[Op] = s[Rp] = "auto"),
        (l.flexBasis = r.flexBasis || "auto"),
        (l.overflow = "visible"),
        (l.boxSizing = "border-box"),
        (l[Bi] = Pu(e, Dt) + Xe),
        (l[Ui] = Pu(e, Ge) + Xe),
        (l[Ve] = s[_n] = s[z1] = s[L1] = "0"),
        Vo(i),
        (s[Bi] = s["max" + nl] = r[Bi]),
        (s[Ui] = s["max" + Mp] = r[Ui]),
        (s[Ve] = r[Ve]),
        e.parentNode !== n &&
          (e.parentNode.insertBefore(n, e), n.appendChild(e)),
        (e._gsap.swappedIn = !0);
    }
  },
  SS = /([A-Z])/g,
  Vo = function (e) {
    if (e) {
      var n = e.t.style,
        r = e.length,
        i = 0,
        o,
        l;
      for ((e.t._gsap || A.core.getCache(e.t)).uncache = 1; i < r; i += 2)
        (l = e[i + 1]),
          (o = e[i]),
          l
            ? (n[o] = l)
            : n[o] && n.removeProperty(o.replace(SS, "-$1").toLowerCase());
    }
  },
  ya = function (e) {
    for (var n = Va.length, r = e.style, i = [], o = 0; o < n; o++)
      i.push(Va[o], r[Va[o]]);
    return (i.t = e), i;
  },
  kS = function (e, n, r) {
    for (var i = [], o = e.length, l = r ? 8 : 0, s; l < o; l += 2)
      (s = e[l]), i.push(s, s in n ? n[s] : e[l + 1]);
    return (i.t = e.t), i;
  },
  Ha = { left: 0, top: 0 },
  R0 = function (e, n, r, i, o, l, s, a, u, c, f, d, p, v) {
    jt(e) && (e = e(a)),
      nn(e) &&
        e.substr(0, 3) === "max" &&
        (e = d + (e.charAt(4) === "=" ? $a("0" + e.substr(3), r) : 0));
    var m = p ? p.time() : 0,
      x,
      g,
      h;
    if ((p && p.seek(0), isNaN(e) || (e = +e), Dl(e)))
      p &&
        (e = A.utils.mapRange(
          p.scrollTrigger.start,
          p.scrollTrigger.end,
          0,
          d,
          e
        )),
        s && Ba(s, r, i, !0);
    else {
      jt(n) && (n = n(a));
      var y = (e || "0").split(" "),
        _,
        k,
        E,
        C;
      (h = $t(n, a) || ve),
        (_ = mr(h) || {}),
        (!_ || (!_.left && !_.top)) &&
          xn(h).display === "none" &&
          ((C = h.style.display),
          (h.style.display = "block"),
          (_ = mr(h)),
          C ? (h.style.display = C) : h.style.removeProperty("display")),
        (k = $a(y[0], _[i.d])),
        (E = $a(y[1] || "0", r)),
        (e = _[i.p] - u[i.p] - c + k + o - E),
        s && Ba(s, E, i, r - E < 20 || (s._isStart && E > 20)),
        (r -= r - E);
    }
    if ((v && ((a[v] = e || -0.001), e < 0 && (e = 0)), l)) {
      var T = e + r,
        N = l._isStart;
      (x = "scroll" + i.d2),
        Ba(
          l,
          T,
          i,
          (N && T > 20) ||
            (!N && (f ? Math.max(ve[x], $n[x]) : l.parentNode[x]) <= T + 1)
        ),
        f &&
          ((u = mr(s)),
          f && (l.style[i.op.p] = u[i.op.p] - i.op.m - l._offset + Xe));
    }
    return (
      p &&
        h &&
        ((x = mr(h)),
        p.seek(d),
        (g = mr(h)),
        (p._caScrollDist = x[i.p] - g[i.p]),
        (e = (e / p._caScrollDist) * d)),
      p && p.seek(m),
      p ? e : Math.round(e)
    );
  },
  CS = /(webkit|moz|length|cssText|inset)/i,
  O0 = function (e, n, r, i) {
    if (e.parentNode !== n) {
      var o = e.style,
        l,
        s;
      if (n === ve) {
        (e._stOrig = o.cssText), (s = xn(e));
        for (l in s)
          !+l &&
            !CS.test(l) &&
            s[l] &&
            typeof o[l] == "string" &&
            l !== "0" &&
            (o[l] = s[l]);
        (o.top = r), (o.left = i);
      } else o.cssText = e._stOrig;
      (A.core.getCache(e).uncache = 1), n.appendChild(e);
    }
  },
  b1 = function (e, n, r) {
    var i = n,
      o = i;
    return function (l) {
      var s = Math.round(e());
      return (
        s !== i &&
          s !== o &&
          Math.abs(s - i) > 3 &&
          Math.abs(s - o) > 3 &&
          ((l = s), r && r()),
        (o = i),
        (i = l),
        l
      );
    };
  },
  _a = function (e, n, r) {
    var i = {};
    (i[n.p] = "+=" + r), A.set(e, i);
  },
  M0 = function (e, n) {
    var r = di(e, n),
      i = "_scroll" + n.p2,
      o = function l(s, a, u, c, f) {
        var d = l.tween,
          p = a.onComplete,
          v = {};
        u = u || r();
        var m = b1(r, u, function () {
          d.kill(), (l.tween = 0);
        });
        return (
          (f = (c && f) || 0),
          (c = c || s - u),
          d && d.kill(),
          (a[i] = s),
          (a.inherit = !1),
          (a.modifiers = v),
          (v[i] = function () {
            return m(u + c * d.ratio + f * d.ratio * d.ratio);
          }),
          (a.onUpdate = function () {
            J.cache++, l.tween && wr();
          }),
          (a.onComplete = function () {
            (l.tween = 0), p && p.call(d);
          }),
          (d = l.tween = A.to(e, a)),
          d
        );
      };
    return (
      (e[i] = r),
      (r.wheelHandler = function () {
        return o.tween && o.tween.kill() && (o.tween = 0);
      }),
      et(e, "wheel", r.wheelHandler),
      G.isTouch && et(e, "touchmove", r.wheelHandler),
      o
    );
  },
  G = (function () {
    function t(n, r) {
      mo ||
        t.register(A) ||
        console.warn("Please gsap.registerPlugin(ScrollTrigger)"),
        od(this),
        this.init(n, r);
    }
    var e = t.prototype;
    return (
      (e.init = function (r, i) {
        if (
          ((this.progress = this.start = 0),
          this.vars && this.kill(!0, !0),
          !Ll)
        ) {
          this.update = this.refresh = this.kill = Kn;
          return;
        }
        r = C0(nn(r) || Dl(r) || r.nodeType ? { trigger: r } : r, ga);
        var o = r,
          l = o.onUpdate,
          s = o.toggleClass,
          a = o.id,
          u = o.onToggle,
          c = o.onRefresh,
          f = o.scrub,
          d = o.trigger,
          p = o.pin,
          v = o.pinSpacing,
          m = o.invalidateOnRefresh,
          x = o.anticipatePin,
          g = o.onScrubComplete,
          h = o.onSnapComplete,
          y = o.once,
          _ = o.snap,
          k = o.pinReparent,
          E = o.pinSpacer,
          C = o.containerAnimation,
          T = o.fastScrollEnd,
          N = o.preventOverlaps,
          R =
            r.horizontal || (r.containerAnimation && r.horizontal !== !1)
              ? Dt
              : Ge,
          I = !f && f !== 0,
          z = $t(r.scroller || ne),
          H = A.core.getCache(z),
          X = qi(z),
          ee =
            ("pinType" in r
              ? r.pinType
              : li(z, "pinType") || (X && "fixed")) === "fixed",
          Q = [r.onEnter, r.onLeave, r.onEnterBack, r.onLeaveBack],
          $ = I && r.toggleActions.split(" "),
          M = "markers" in r ? r.markers : ga.markers,
          j = X ? 0 : parseFloat(xn(z)["border" + R.p2 + nl]) || 0,
          S = this,
          U =
            r.onRefreshInit &&
            function () {
              return r.onRefreshInit(S);
            },
          oe = hS(z, X, R),
          ft = mS(z, X),
          ue = 0,
          De = 0,
          Se = 0,
          me = di(z, R),
          Et,
          dt,
          Mr,
          Pt,
          Rn,
          se,
          je,
          bt,
          qt,
          O,
          Jt,
          ar,
          Lr,
          Be,
          zr,
          vi,
          oo,
          qe,
          Dr,
          Fe,
          On,
          mn,
          ur,
          al,
          Ue,
          $s,
          jr,
          lo,
          so,
          Fr,
          yi,
          q,
          _i,
          Mn,
          Ln,
          zn,
          xi,
          ao,
          cr;
        if (
          ((S._startClamp = S._endClamp = !1),
          (S._dir = R),
          (x *= 45),
          (S.scroller = z),
          (S.scroll = C ? C.time.bind(C) : me),
          (Pt = me()),
          (S.vars = r),
          (i = i || r.animation),
          "refreshPriority" in r &&
            ((C1 = 1), r.refreshPriority === -9999 && (ns = S)),
          (H.tweenScroll = H.tweenScroll || {
            top: M0(z, Ge),
            left: M0(z, Dt),
          }),
          (S.tweenTo = Et = H.tweenScroll[R.p]),
          (S.scrubDuration = function (D) {
            (_i = Dl(D) && D),
              _i
                ? q
                  ? q.duration(D)
                  : (q = A.to(i, {
                      ease: "expo",
                      totalProgress: "+=0",
                      inherit: !1,
                      duration: _i,
                      paused: !0,
                      onComplete: function () {
                        return g && g(S);
                      },
                    }))
                : (q && q.progress(1).kill(), (q = 0));
          }),
          i &&
            ((i.vars.lazy = !1),
            (i._initted && !S.isReverted) ||
              (i.vars.immediateRender !== !1 &&
                r.immediateRender !== !1 &&
                i.duration() &&
                i.render(0, !0, !0)),
            (S.animation = i.pause()),
            (i.scrollTrigger = S),
            S.scrubDuration(f),
            (Fr = 0),
            a || (a = i.vars.id)),
          _ &&
            ((!Ni(_) || _.push) && (_ = { snapTo: _ }),
            "scrollBehavior" in ve.style &&
              A.set(X ? [ve, $n] : z, { scrollBehavior: "auto" }),
            J.forEach(function (D) {
              return (
                jt(D) &&
                D.target === (X ? Ce.scrollingElement || $n : z) &&
                (D.smooth = !1)
              );
            }),
            (Mr = jt(_.snapTo)
              ? _.snapTo
              : _.snapTo === "labels"
              ? vS(i)
              : _.snapTo === "labelsDirectional"
              ? yS(i)
              : _.directional !== !1
              ? function (D, Y) {
                  return Lp(_.snapTo)(D, _t() - De < 500 ? 0 : Y.direction);
                }
              : A.utils.snap(_.snapTo)),
            (Mn = _.duration || { min: 0.1, max: 2 }),
            (Mn = Ni(Mn) ? ql(Mn.min, Mn.max) : ql(Mn, Mn)),
            (Ln = A.delayedCall(_.delay || _i / 2 || 0.1, function () {
              var D = me(),
                Y = _t() - De < 500,
                b = Et.tween;
              if (
                (Y || Math.abs(S.getVelocity()) < 10) &&
                !b &&
                !qu &&
                ue !== D
              ) {
                var V = (D - se) / Be,
                  Je = i && !I ? i.totalProgress() : V,
                  te = Y ? 0 : ((Je - yi) / (_t() - Ml)) * 1e3 || 0,
                  Ae = A.utils.clamp(-V, 1 - V, (fo(te / 2) * te) / 0.185),
                  pt = V + (_.inertia === !1 ? 0 : Ae),
                  Me,
                  _e,
                  fe = _,
                  Dn = fe.onStart,
                  ke = fe.onInterrupt,
                  Zt = fe.onComplete;
                if (
                  ((Me = Mr(pt, S)),
                  Dl(Me) || (Me = pt),
                  (_e = Math.round(se + Me * Be)),
                  D <= je && D >= se && _e !== D)
                ) {
                  if (b && !b._initted && b.data <= fo(_e - D)) return;
                  _.inertia === !1 && (Ae = Me - V),
                    Et(
                      _e,
                      {
                        duration: Mn(
                          fo(
                            (Math.max(fo(pt - Je), fo(Me - Je)) * 0.185) /
                              te /
                              0.05 || 0
                          )
                        ),
                        ease: _.ease || "power3",
                        data: fo(_e - D),
                        onInterrupt: function () {
                          return Ln.restart(!0) && ke && ke(S);
                        },
                        onComplete: function () {
                          S.update(),
                            (ue = me()),
                            i &&
                              (q
                                ? q.resetTo(
                                    "totalProgress",
                                    Me,
                                    i._tTime / i._tDur
                                  )
                                : i.progress(Me)),
                            (Fr = yi =
                              i && !I ? i.totalProgress() : S.progress),
                            h && h(S),
                            Zt && Zt(S);
                        },
                      },
                      D,
                      Ae * Be,
                      _e - D - Ae * Be
                    ),
                    Dn && Dn(S, Et.tween);
                }
              } else S.isActive && ue !== D && Ln.restart(!0);
            }).pause())),
          a && (sd[a] = S),
          (d = S.trigger = $t(d || (p !== !0 && p))),
          (cr = d && d._gsap && d._gsap.stRevert),
          cr && (cr = cr(S)),
          (p = p === !0 ? d : $t(p)),
          nn(s) && (s = { targets: d, className: s }),
          p &&
            (v === !1 ||
              v === _n ||
              (v =
                !v &&
                p.parentNode &&
                p.parentNode.style &&
                xn(p.parentNode).display === "flex"
                  ? !1
                  : Ve),
            (S.pin = p),
            (dt = A.core.getCache(p)),
            dt.spacer
              ? (zr = dt.pinState)
              : (E &&
                  ((E = $t(E)),
                  E && !E.nodeType && (E = E.current || E.nativeElement),
                  (dt.spacerIsNative = !!E),
                  E && (dt.spacerState = ya(E))),
                (dt.spacer = qe = E || Ce.createElement("div")),
                qe.classList.add("pin-spacer"),
                a && qe.classList.add("pin-spacer-" + a),
                (dt.pinState = zr = ya(p))),
            r.force3D !== !1 && A.set(p, { force3D: !0 }),
            (S.spacer = qe = dt.spacer),
            (so = xn(p)),
            (al = so[v + R.os2]),
            (Fe = A.getProperty(p)),
            (On = A.quickSetter(p, R.a, Xe)),
            Bc(p, qe, so),
            (oo = ya(p))),
          M)
        ) {
          (ar = Ni(M) ? C0(M, E0) : E0),
            (O = va("scroller-start", a, z, R, ar, 0)),
            (Jt = va("scroller-end", a, z, R, ar, 0, O)),
            (Dr = O["offset" + R.op.d2]);
          var ul = $t(li(z, "content") || z);
          (bt = this.markerStart = va("start", a, ul, R, ar, Dr, 0, C)),
            (qt = this.markerEnd = va("end", a, ul, R, ar, Dr, 0, C)),
            C && (ao = A.quickSetter([bt, qt], R.a, Xe)),
            !ee &&
              !(ir.length && li(z, "fixedMarkers") === !0) &&
              (gS(X ? ve : z),
              A.set([O, Jt], { force3D: !0 }),
              ($s = A.quickSetter(O, R.a, Xe)),
              (lo = A.quickSetter(Jt, R.a, Xe)));
        }
        if (C) {
          var W = C.vars.onUpdate,
            B = C.vars.onUpdateParams;
          C.eventCallback("onUpdate", function () {
            S.update(0, 0, 1), W && W.apply(C, B || []);
          });
        }
        if (
          ((S.previous = function () {
            return K[K.indexOf(S) - 1];
          }),
          (S.next = function () {
            return K[K.indexOf(S) + 1];
          }),
          (S.revert = function (D, Y) {
            if (!Y) return S.kill(!0);
            var b = D !== !1 || !S.enabled,
              V = yt;
            b !== S.isReverted &&
              (b &&
                ((zn = Math.max(me(), S.scroll.rec || 0)),
                (Se = S.progress),
                (xi = i && i.progress())),
              bt &&
                [bt, qt, O, Jt].forEach(function (Je) {
                  return (Je.style.display = b ? "none" : "block");
                }),
              b && ((yt = S), S.update(b)),
              p &&
                (!k || !S.isActive) &&
                (b ? wS(p, qe, zr) : Bc(p, qe, xn(p), Ue)),
              b || S.update(b),
              (yt = V),
              (S.isReverted = b));
          }),
          (S.refresh = function (D, Y, b, V) {
            if (!((yt || !S.enabled) && !Y)) {
              if (p && D && En) {
                et(t, "scrollEnd", j1);
                return;
              }
              !Lt && U && U(S),
                (yt = S),
                Et.tween && !b && (Et.tween.kill(), (Et.tween = 0)),
                q && q.pause(),
                m && i && i.revert({ kill: !1 }).invalidate(),
                S.isReverted || S.revert(!0, !0),
                (S._subPinOffset = !1);
              var Je = oe(),
                te = ft(),
                Ae = C ? C.duration() : er(z, R),
                pt = Be <= 0.01,
                Me = 0,
                _e = V || 0,
                fe = Ni(b) ? b.end : r.end,
                Dn = r.endTrigger || d,
                ke = Ni(b)
                  ? b.start
                  : r.start || (r.start === 0 || !d ? 0 : p ? "0 0" : "0 100%"),
                Zt = (S.pinnedContainer =
                  r.pinnedContainer && $t(r.pinnedContainer, S)),
                Hn = (d && Math.max(0, K.indexOf(S))) || 0,
                ot = Hn,
                lt,
                ht,
                wi,
                Bs,
                mt,
                Ye,
                Wn,
                Ju,
                Fp,
                cl,
                Yn,
                fl,
                Us;
              for (
                M &&
                Ni(b) &&
                ((fl = A.getProperty(O, R.p)), (Us = A.getProperty(Jt, R.p)));
                ot--;

              )
                (Ye = K[ot]),
                  Ye.end || Ye.refresh(0, 1) || (yt = S),
                  (Wn = Ye.pin),
                  Wn &&
                    (Wn === d || Wn === p || Wn === Zt) &&
                    !Ye.isReverted &&
                    (cl || (cl = []), cl.unshift(Ye), Ye.revert(!0, !0)),
                  Ye !== K[ot] && (Hn--, ot--);
              for (
                jt(ke) && (ke = ke(S)),
                  ke = x0(ke, "start", S),
                  se =
                    R0(
                      ke,
                      d,
                      Je,
                      R,
                      me(),
                      bt,
                      O,
                      S,
                      te,
                      j,
                      ee,
                      Ae,
                      C,
                      S._startClamp && "_startClamp"
                    ) || (p ? -0.001 : 0),
                  jt(fe) && (fe = fe(S)),
                  nn(fe) &&
                    !fe.indexOf("+=") &&
                    (~fe.indexOf(" ")
                      ? (fe = (nn(ke) ? ke.split(" ")[0] : "") + fe)
                      : ((Me = $a(fe.substr(2), Je)),
                        (fe = nn(ke)
                          ? ke
                          : (C
                              ? A.utils.mapRange(
                                  0,
                                  C.duration(),
                                  C.scrollTrigger.start,
                                  C.scrollTrigger.end,
                                  se
                                )
                              : se) + Me),
                        (Dn = d))),
                  fe = x0(fe, "end", S),
                  je =
                    Math.max(
                      se,
                      R0(
                        fe || (Dn ? "100% 0" : Ae),
                        Dn,
                        Je,
                        R,
                        me() + Me,
                        qt,
                        Jt,
                        S,
                        te,
                        j,
                        ee,
                        Ae,
                        C,
                        S._endClamp && "_endClamp"
                      )
                    ) || -0.001,
                  Me = 0,
                  ot = Hn;
                ot--;

              )
                (Ye = K[ot]),
                  (Wn = Ye.pin),
                  Wn &&
                    Ye.start - Ye._pinPush <= se &&
                    !C &&
                    Ye.end > 0 &&
                    ((lt =
                      Ye.end -
                      (S._startClamp ? Math.max(0, Ye.start) : Ye.start)),
                    ((Wn === d && Ye.start - Ye._pinPush < se) || Wn === Zt) &&
                      isNaN(ke) &&
                      (Me += lt * (1 - Ye.progress)),
                    Wn === p && (_e += lt));
              if (
                ((se += Me),
                (je += Me),
                S._startClamp && (S._startClamp += Me),
                S._endClamp &&
                  !Lt &&
                  ((S._endClamp = je || -0.001), (je = Math.min(je, er(z, R)))),
                (Be = je - se || ((se -= 0.01) && 0.001)),
                pt && (Se = A.utils.clamp(0, 1, A.utils.normalize(se, je, zn))),
                (S._pinPush = _e),
                bt &&
                  Me &&
                  ((lt = {}),
                  (lt[R.a] = "+=" + Me),
                  Zt && (lt[R.p] = "-=" + me()),
                  A.set([bt, qt], lt)),
                p && !(ld && S.end >= er(z, R)))
              )
                (lt = xn(p)),
                  (Bs = R === Ge),
                  (wi = me()),
                  (mn = parseFloat(Fe(R.a)) + _e),
                  !Ae &&
                    je > 1 &&
                    ((Yn = (X ? Ce.scrollingElement || $n : z).style),
                    (Yn = {
                      style: Yn,
                      value: Yn["overflow" + R.a.toUpperCase()],
                    }),
                    X &&
                      xn(ve)["overflow" + R.a.toUpperCase()] !== "scroll" &&
                      (Yn.style["overflow" + R.a.toUpperCase()] = "scroll")),
                  Bc(p, qe, lt),
                  (oo = ya(p)),
                  (ht = mr(p, !0)),
                  (Ju = ee && di(z, Bs ? Dt : Ge)()),
                  v
                    ? ((Ue = [v + R.os2, Be + _e + Xe]),
                      (Ue.t = qe),
                      (ot = v === Ve ? Pu(p, R) + Be + _e : 0),
                      ot &&
                        (Ue.push(R.d, ot + Xe),
                        qe.style.flexBasis !== "auto" &&
                          (qe.style.flexBasis = ot + Xe)),
                      Vo(Ue),
                      Zt &&
                        K.forEach(function (dl) {
                          dl.pin === Zt &&
                            dl.vars.pinSpacing !== !1 &&
                            (dl._subPinOffset = !0);
                        }),
                      ee && me(zn))
                    : ((ot = Pu(p, R)),
                      ot &&
                        qe.style.flexBasis !== "auto" &&
                        (qe.style.flexBasis = ot + Xe)),
                  ee &&
                    ((mt = {
                      top: ht.top + (Bs ? wi - se : Ju) + Xe,
                      left: ht.left + (Bs ? Ju : wi - se) + Xe,
                      boxSizing: "border-box",
                      position: "fixed",
                    }),
                    (mt[Bi] = mt["max" + nl] = Math.ceil(ht.width) + Xe),
                    (mt[Ui] = mt["max" + Mp] = Math.ceil(ht.height) + Xe),
                    (mt[_n] =
                      mt[_n + es] =
                      mt[_n + Jl] =
                      mt[_n + ts] =
                      mt[_n + Zl] =
                        "0"),
                    (mt[Ve] = lt[Ve]),
                    (mt[Ve + es] = lt[Ve + es]),
                    (mt[Ve + Jl] = lt[Ve + Jl]),
                    (mt[Ve + ts] = lt[Ve + ts]),
                    (mt[Ve + Zl] = lt[Ve + Zl]),
                    (vi = kS(zr, mt, k)),
                    Lt && me(0)),
                  i
                    ? ((Fp = i._initted),
                      Fc(1),
                      i.render(i.duration(), !0, !0),
                      (ur = Fe(R.a) - mn + Be + _e),
                      (jr = Math.abs(Be - ur) > 1),
                      ee && jr && vi.splice(vi.length - 2, 2),
                      i.render(0, !0, !0),
                      Fp || i.invalidate(!0),
                      i.parent || i.totalTime(i.totalTime()),
                      Fc(0))
                    : (ur = Be),
                  Yn &&
                    (Yn.value
                      ? (Yn.style["overflow" + R.a.toUpperCase()] = Yn.value)
                      : Yn.style.removeProperty("overflow-" + R.a));
              else if (d && me() && !C)
                for (ht = d.parentNode; ht && ht !== ve; )
                  ht._pinOffset &&
                    ((se -= ht._pinOffset), (je -= ht._pinOffset)),
                    (ht = ht.parentNode);
              cl &&
                cl.forEach(function (dl) {
                  return dl.revert(!1, !0);
                }),
                (S.start = se),
                (S.end = je),
                (Pt = Rn = Lt ? zn : me()),
                !C && !Lt && (Pt < zn && me(zn), (S.scroll.rec = 0)),
                S.revert(!1, !0),
                (De = _t()),
                Ln && ((ue = -1), Ln.restart(!0)),
                (yt = 0),
                i &&
                  I &&
                  (i._initted || xi) &&
                  i.progress() !== xi &&
                  i.progress(xi || 0, !0).render(i.time(), !0, !0),
                (pt || Se !== S.progress || C || m) &&
                  (i &&
                    !I &&
                    i.totalProgress(
                      C && se < -0.001 && !Se
                        ? A.utils.normalize(se, je, 0)
                        : Se,
                      !0
                    ),
                  (S.progress = pt || (Pt - se) / Be === Se ? 0 : Se)),
                p && v && (qe._pinOffset = Math.round(S.progress * ur)),
                q && q.invalidate(),
                isNaN(fl) ||
                  ((fl -= A.getProperty(O, R.p)),
                  (Us -= A.getProperty(Jt, R.p)),
                  _a(O, R, fl),
                  _a(bt, R, fl - (V || 0)),
                  _a(Jt, R, Us),
                  _a(qt, R, Us - (V || 0))),
                pt && !Lt && S.update(),
                c && !Lt && !Lr && ((Lr = !0), c(S), (Lr = !1));
            }
          }),
          (S.getVelocity = function () {
            return ((me() - Rn) / (_t() - Ml)) * 1e3 || 0;
          }),
          (S.endAnimation = function () {
            Cl(S.callbackAnimation),
              i &&
                (q
                  ? q.progress(1)
                  : i.paused()
                  ? I || Cl(i, S.direction < 0, 1)
                  : Cl(i, i.reversed()));
          }),
          (S.labelToScroll = function (D) {
            return (
              (i &&
                i.labels &&
                (se || S.refresh() || se) +
                  (i.labels[D] / i.duration()) * Be) ||
              0
            );
          }),
          (S.getTrailing = function (D) {
            var Y = K.indexOf(S),
              b = S.direction > 0 ? K.slice(0, Y).reverse() : K.slice(Y + 1);
            return (
              nn(D)
                ? b.filter(function (V) {
                    return V.vars.preventOverlaps === D;
                  })
                : b
            ).filter(function (V) {
              return S.direction > 0 ? V.end <= se : V.start >= je;
            });
          }),
          (S.update = function (D, Y, b) {
            if (!(C && !b && !D)) {
              var V = Lt === !0 ? zn : S.scroll(),
                Je = D ? 0 : (V - se) / Be,
                te = Je < 0 ? 0 : Je > 1 ? 1 : Je || 0,
                Ae = S.progress,
                pt,
                Me,
                _e,
                fe,
                Dn,
                ke,
                Zt,
                Hn;
              if (
                (Y &&
                  ((Rn = Pt),
                  (Pt = C ? me() : V),
                  _ && ((yi = Fr), (Fr = i && !I ? i.totalProgress() : te))),
                x &&
                  p &&
                  !yt &&
                  !da &&
                  En &&
                  (!te && se < V + ((V - Rn) / (_t() - Ml)) * x
                    ? (te = 1e-4)
                    : te === 1 &&
                      je > V + ((V - Rn) / (_t() - Ml)) * x &&
                      (te = 0.9999)),
                te !== Ae && S.enabled)
              ) {
                if (
                  ((pt = S.isActive = !!te && te < 1),
                  (Me = !!Ae && Ae < 1),
                  (ke = pt !== Me),
                  (Dn = ke || !!te != !!Ae),
                  (S.direction = te > Ae ? 1 : -1),
                  (S.progress = te),
                  Dn &&
                    !yt &&
                    ((_e = te && !Ae ? 0 : te === 1 ? 1 : Ae === 1 ? 2 : 3),
                    I &&
                      ((fe =
                        (!ke && $[_e + 1] !== "none" && $[_e + 1]) || $[_e]),
                      (Hn =
                        i &&
                        (fe === "complete" || fe === "reset" || fe in i)))),
                  N &&
                    (ke || Hn) &&
                    (Hn || f || !i) &&
                    (jt(N)
                      ? N(S)
                      : S.getTrailing(N).forEach(function (wi) {
                          return wi.endAnimation();
                        })),
                  I ||
                    (q && !yt && !da
                      ? (q._dp._time - q._start !== q._time &&
                          q.render(q._dp._time - q._start),
                        q.resetTo
                          ? q.resetTo("totalProgress", te, i._tTime / i._tDur)
                          : ((q.vars.totalProgress = te),
                            q.invalidate().restart()))
                      : i && i.totalProgress(te, !!(yt && (De || D)))),
                  p)
                ) {
                  if ((D && v && (qe.style[v + R.os2] = al), !ee))
                    On(zl(mn + ur * te));
                  else if (Dn) {
                    if (
                      ((Zt = !D && te > Ae && je + 1 > V && V + 1 >= er(z, R)),
                      k)
                    )
                      if (!D && (pt || Zt)) {
                        var ot = mr(p, !0),
                          lt = V - se;
                        O0(
                          p,
                          ve,
                          ot.top + (R === Ge ? lt : 0) + Xe,
                          ot.left + (R === Ge ? 0 : lt) + Xe
                        );
                      } else O0(p, qe);
                    Vo(pt || Zt ? vi : oo),
                      (jr && te < 1 && pt) ||
                        On(mn + (te === 1 && !Zt ? ur : 0));
                  }
                }
                _ && !Et.tween && !yt && !da && Ln.restart(!0),
                  s &&
                    (ke || (y && te && (te < 1 || !Ac))) &&
                    Ns(s.targets).forEach(function (wi) {
                      return wi.classList[pt || y ? "add" : "remove"](
                        s.className
                      );
                    }),
                  l && !I && !D && l(S),
                  Dn && !yt
                    ? (I &&
                        (Hn &&
                          (fe === "complete"
                            ? i.pause().totalProgress(1)
                            : fe === "reset"
                            ? i.restart(!0).pause()
                            : fe === "restart"
                            ? i.restart(!0)
                            : i[fe]()),
                        l && l(S)),
                      (ke || !Ac) &&
                        (u && ke && bc(S, u),
                        Q[_e] && bc(S, Q[_e]),
                        y && (te === 1 ? S.kill(!1, 1) : (Q[_e] = 0)),
                        ke || ((_e = te === 1 ? 1 : 3), Q[_e] && bc(S, Q[_e]))),
                      T &&
                        !pt &&
                        Math.abs(S.getVelocity()) > (Dl(T) ? T : 2500) &&
                        (Cl(S.callbackAnimation),
                        q
                          ? q.progress(1)
                          : Cl(i, fe === "reverse" ? 1 : !te, 1)))
                    : I && l && !yt && l(S);
              }
              if (lo) {
                var ht = C ? (V / C.duration()) * (C._caScrollDist || 0) : V;
                $s(ht + (O._isFlipped ? 1 : 0)), lo(ht);
              }
              ao && ao((-V / C.duration()) * (C._caScrollDist || 0));
            }
          }),
          (S.enable = function (D, Y) {
            S.enabled ||
              ((S.enabled = !0),
              et(z, "resize", jl),
              X || et(z, "scroll", po),
              U && et(t, "refreshInit", U),
              D !== !1 && ((S.progress = Se = 0), (Pt = Rn = ue = me())),
              Y !== !1 && S.refresh());
          }),
          (S.getTween = function (D) {
            return D && Et ? Et.tween : q;
          }),
          (S.setPositions = function (D, Y, b, V) {
            if (C) {
              var Je = C.scrollTrigger,
                te = C.duration(),
                Ae = Je.end - Je.start;
              (D = Je.start + (Ae * D) / te), (Y = Je.start + (Ae * Y) / te);
            }
            S.refresh(
              !1,
              !1,
              {
                start: w0(D, b && !!S._startClamp),
                end: w0(Y, b && !!S._endClamp),
              },
              V
            ),
              S.update();
          }),
          (S.adjustPinSpacing = function (D) {
            if (Ue && D) {
              var Y = Ue.indexOf(R.d) + 1;
              (Ue[Y] = parseFloat(Ue[Y]) + D + Xe),
                (Ue[1] = parseFloat(Ue[1]) + D + Xe),
                Vo(Ue);
            }
          }),
          (S.disable = function (D, Y) {
            if (
              S.enabled &&
              (D !== !1 && S.revert(!0, !0),
              (S.enabled = S.isActive = !1),
              Y || (q && q.pause()),
              (zn = 0),
              dt && (dt.uncache = 1),
              U && Ze(t, "refreshInit", U),
              Ln && (Ln.pause(), Et.tween && Et.tween.kill() && (Et.tween = 0)),
              !X)
            ) {
              for (var b = K.length; b--; )
                if (K[b].scroller === z && K[b] !== S) return;
              Ze(z, "resize", jl), X || Ze(z, "scroll", po);
            }
          }),
          (S.kill = function (D, Y) {
            S.disable(D, Y), q && !Y && q.kill(), a && delete sd[a];
            var b = K.indexOf(S);
            b >= 0 && K.splice(b, 1),
              b === Mt && Ua > 0 && Mt--,
              (b = 0),
              K.forEach(function (V) {
                return V.scroller === S.scroller && (b = 1);
              }),
              b || Lt || (S.scroll.rec = 0),
              i &&
                ((i.scrollTrigger = null),
                D && i.revert({ kill: !1 }),
                Y || i.kill()),
              bt &&
                [bt, qt, O, Jt].forEach(function (V) {
                  return V.parentNode && V.parentNode.removeChild(V);
                }),
              ns === S && (ns = 0),
              p &&
                (dt && (dt.uncache = 1),
                (b = 0),
                K.forEach(function (V) {
                  return V.pin === p && b++;
                }),
                b || (dt.spacer = 0)),
              r.onKill && r.onKill(S);
          }),
          K.push(S),
          S.enable(!1, !1),
          cr && cr(S),
          i && i.add && !Be)
        ) {
          var ae = S.update;
          (S.update = function () {
            (S.update = ae), se || je || S.refresh();
          }),
            A.delayedCall(0.01, S.update),
            (Be = 0.01),
            (se = je = 0);
        } else S.refresh();
        p && xS();
      }),
      (t.register = function (r) {
        return (
          mo ||
            ((A = r || R1()), N1() && window.document && t.enable(), (mo = Ll)),
          mo
        );
      }),
      (t.defaults = function (r) {
        if (r) for (var i in r) ga[i] = r[i];
        return ga;
      }),
      (t.disable = function (r, i) {
        (Ll = 0),
          K.forEach(function (l) {
            return l[i ? "kill" : "disable"](r);
          }),
          Ze(ne, "wheel", po),
          Ze(Ce, "scroll", po),
          clearInterval(fa),
          Ze(Ce, "touchcancel", Kn),
          Ze(ve, "touchstart", Kn),
          ha(Ze, Ce, "pointerdown,touchstart,mousedown", S0),
          ha(Ze, Ce, "pointerup,touchend,mouseup", k0),
          Cu.kill(),
          pa(Ze);
        for (var o = 0; o < J.length; o += 3)
          ma(Ze, J[o], J[o + 1]), ma(Ze, J[o], J[o + 2]);
      }),
      (t.enable = function () {
        if (
          ((ne = window),
          (Ce = document),
          ($n = Ce.documentElement),
          (ve = Ce.body),
          A &&
            ((Ns = A.utils.toArray),
            (ql = A.utils.clamp),
            (od = A.core.context || Kn),
            (Fc = A.core.suppressOverwrites || Kn),
            (Tp = ne.history.scrollRestoration || "auto"),
            (ad = ne.pageYOffset),
            A.core.globals("ScrollTrigger", t),
            ve))
        ) {
          (Ll = 1),
            (Uo = document.createElement("div")),
            (Uo.style.height = "100vh"),
            (Uo.style.position = "absolute"),
            I1(),
            pS(),
            $e.register(A),
            (t.isTouch = $e.isTouch),
            (Ir =
              $e.isTouch &&
              /(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent)),
            (id = $e.isTouch === 1),
            et(ne, "wheel", po),
            (k1 = [ne, Ce, $n, ve]),
            A.matchMedia
              ? ((t.matchMedia = function (a) {
                  var u = A.matchMedia(),
                    c;
                  for (c in a) u.add(c, a[c]);
                  return u;
                }),
                A.addEventListener("matchMediaInit", function () {
                  return zp();
                }),
                A.addEventListener("matchMediaRevert", function () {
                  return F1();
                }),
                A.addEventListener("matchMedia", function () {
                  zi(0, 1), Zi("matchMedia");
                }),
                A.matchMedia("(orientation: portrait)", function () {
                  return $c(), $c;
                }))
              : console.warn("Requires GSAP 3.11.0 or later"),
            $c(),
            et(Ce, "scroll", po);
          var r = ve.style,
            i = r.borderTopStyle,
            o = A.core.Animation.prototype,
            l,
            s;
          for (
            o.revert ||
              Object.defineProperty(o, "revert", {
                value: function () {
                  return this.time(-0.01, !0);
                },
              }),
              r.borderTopStyle = "solid",
              l = mr(ve),
              Ge.m = Math.round(l.top + Ge.sc()) || 0,
              Dt.m = Math.round(l.left + Dt.sc()) || 0,
              i ? (r.borderTopStyle = i) : r.removeProperty("border-top-style"),
              fa = setInterval(P0, 250),
              A.delayedCall(0.5, function () {
                return (da = 0);
              }),
              et(Ce, "touchcancel", Kn),
              et(ve, "touchstart", Kn),
              ha(et, Ce, "pointerdown,touchstart,mousedown", S0),
              ha(et, Ce, "pointerup,touchend,mouseup", k0),
              rd = A.utils.checkPrefix("transform"),
              Va.push(rd),
              mo = _t(),
              Cu = A.delayedCall(0.2, zi).pause(),
              go = [
                Ce,
                "visibilitychange",
                function () {
                  var a = ne.innerWidth,
                    u = ne.innerHeight;
                  Ce.hidden
                    ? ((y0 = a), (_0 = u))
                    : (y0 !== a || _0 !== u) && jl();
                },
                Ce,
                "DOMContentLoaded",
                zi,
                ne,
                "load",
                zi,
                ne,
                "resize",
                jl,
              ],
              pa(et),
              K.forEach(function (a) {
                return a.enable(0, 1);
              }),
              s = 0;
            s < J.length;
            s += 3
          )
            ma(Ze, J[s], J[s + 1]), ma(Ze, J[s], J[s + 2]);
        }
      }),
      (t.config = function (r) {
        "limitCallbacks" in r && (Ac = !!r.limitCallbacks);
        var i = r.syncInterval;
        (i && clearInterval(fa)) || ((fa = i) && setInterval(P0, i)),
          "ignoreMobileResize" in r &&
            (id = t.isTouch === 1 && r.ignoreMobileResize),
          "autoRefreshEvents" in r &&
            (pa(Ze) || pa(et, r.autoRefreshEvents || "none"),
            (E1 = (r.autoRefreshEvents + "").indexOf("resize") === -1));
      }),
      (t.scrollerProxy = function (r, i) {
        var o = $t(r),
          l = J.indexOf(o),
          s = qi(o);
        ~l && J.splice(l, s ? 6 : 2),
          i && (s ? ir.unshift(ne, i, ve, i, $n, i) : ir.unshift(o, i));
      }),
      (t.clearMatchMedia = function (r) {
        K.forEach(function (i) {
          return i._ctx && i._ctx.query === r && i._ctx.kill(!0, !0);
        });
      }),
      (t.isInViewport = function (r, i, o) {
        var l = (nn(r) ? $t(r) : r).getBoundingClientRect(),
          s = l[o ? Bi : Ui] * i || 0;
        return o
          ? l.right - s > 0 && l.left + s < ne.innerWidth
          : l.bottom - s > 0 && l.top + s < ne.innerHeight;
      }),
      (t.positionInViewport = function (r, i, o) {
        nn(r) && (r = $t(r));
        var l = r.getBoundingClientRect(),
          s = l[o ? Bi : Ui],
          a =
            i == null
              ? s / 2
              : i in Tu
              ? Tu[i] * s
              : ~i.indexOf("%")
              ? (parseFloat(i) * s) / 100
              : parseFloat(i) || 0;
        return o ? (l.left + a) / ne.innerWidth : (l.top + a) / ne.innerHeight;
      }),
      (t.killAll = function (r) {
        if (
          (K.slice(0).forEach(function (o) {
            return o.vars.id !== "ScrollSmoother" && o.kill();
          }),
          r !== !0)
        ) {
          var i = Ji.killAll || [];
          (Ji = {}),
            i.forEach(function (o) {
              return o();
            });
        }
      }),
      t
    );
  })();
G.version = "3.12.5";
G.saveStyles = function (t) {
  return t
    ? Ns(t).forEach(function (e) {
        if (e && e.style) {
          var n = en.indexOf(e);
          n >= 0 && en.splice(n, 5),
            en.push(
              e,
              e.style.cssText,
              e.getBBox && e.getAttribute("transform"),
              A.core.getCache(e),
              od()
            );
        }
      })
    : en;
};
G.revert = function (t, e) {
  return zp(!t, e);
};
G.create = function (t, e) {
  return new G(t, e);
};
G.refresh = function (t) {
  return t ? jl() : (mo || G.register()) && zi(!0);
};
G.update = function (t) {
  return ++J.cache && wr(t === !0 ? 2 : 0);
};
G.clearScrollMemory = A1;
G.maxScroll = function (t, e) {
  return er(t, e ? Dt : Ge);
};
G.getScrollFunc = function (t, e) {
  return di($t(t), e ? Dt : Ge);
};
G.getById = function (t) {
  return sd[t];
};
G.getAll = function () {
  return K.filter(function (t) {
    return t.vars.id !== "ScrollSmoother";
  });
};
G.isScrolling = function () {
  return !!En;
};
G.snapDirectional = Lp;
G.addEventListener = function (t, e) {
  var n = Ji[t] || (Ji[t] = []);
  ~n.indexOf(e) || n.push(e);
};
G.removeEventListener = function (t, e) {
  var n = Ji[t],
    r = n && n.indexOf(e);
  r >= 0 && n.splice(r, 1);
};
G.batch = function (t, e) {
  var n = [],
    r = {},
    i = e.interval || 0.016,
    o = e.batchMax || 1e9,
    l = function (u, c) {
      var f = [],
        d = [],
        p = A.delayedCall(i, function () {
          c(f, d), (f = []), (d = []);
        }).pause();
      return function (v) {
        f.length || p.restart(!0),
          f.push(v.trigger),
          d.push(v),
          o <= f.length && p.progress(1);
      };
    },
    s;
  for (s in e)
    r[s] =
      s.substr(0, 2) === "on" && jt(e[s]) && s !== "onRefreshInit"
        ? l(s, e[s])
        : e[s];
  return (
    jt(o) &&
      ((o = o()),
      et(G, "refresh", function () {
        return (o = e.batchMax());
      })),
    Ns(t).forEach(function (a) {
      var u = {};
      for (s in r) u[s] = r[s];
      (u.trigger = a), n.push(G.create(u));
    }),
    n
  );
};
var L0 = function (e, n, r, i) {
    return (
      n > i ? e(i) : n < 0 && e(0),
      r > i ? (i - n) / (r - n) : r < 0 ? n / (n - r) : 1
    );
  },
  Uc = function t(e, n) {
    n === !0
      ? e.style.removeProperty("touch-action")
      : (e.style.touchAction =
          n === !0
            ? "auto"
            : n
            ? "pan-" + n + ($e.isTouch ? " pinch-zoom" : "")
            : "none"),
      e === $n && t(ve, n);
  },
  xa = { auto: 1, scroll: 1 },
  ES = function (e) {
    var n = e.event,
      r = e.target,
      i = e.axis,
      o = (n.changedTouches ? n.changedTouches[0] : n).target,
      l = o._gsap || A.core.getCache(o),
      s = _t(),
      a;
    if (!l._isScrollT || s - l._isScrollT > 2e3) {
      for (
        ;
        o &&
        o !== ve &&
        ((o.scrollHeight <= o.clientHeight && o.scrollWidth <= o.clientWidth) ||
          !(xa[(a = xn(o)).overflowY] || xa[a.overflowX]));

      )
        o = o.parentNode;
      (l._isScroll =
        o &&
        o !== r &&
        !qi(o) &&
        (xa[(a = xn(o)).overflowY] || xa[a.overflowX])),
        (l._isScrollT = s);
    }
    (l._isScroll || i === "x") && (n.stopPropagation(), (n._gsapAllow = !0));
  },
  $1 = function (e, n, r, i) {
    return $e.create({
      target: e,
      capture: !0,
      debounce: !1,
      lockAxis: !0,
      type: n,
      onWheel: (i = i && ES),
      onPress: i,
      onDrag: i,
      onScroll: i,
      onEnable: function () {
        return r && et(Ce, $e.eventTypes[0], D0, !1, !0);
      },
      onDisable: function () {
        return Ze(Ce, $e.eventTypes[0], D0, !0);
      },
    });
  },
  PS = /(input|label|select|textarea)/i,
  z0,
  D0 = function (e) {
    var n = PS.test(e.target.tagName);
    (n || z0) && ((e._gsapAllow = !0), (z0 = n));
  },
  TS = function (e) {
    Ni(e) || (e = {}),
      (e.preventDefault = e.isNormalizer = e.allowClicks = !0),
      e.type || (e.type = "wheel,touch"),
      (e.debounce = !!e.debounce),
      (e.id = e.id || "normalizer");
    var n = e,
      r = n.normalizeScrollX,
      i = n.momentum,
      o = n.allowNestedScroll,
      l = n.onRelease,
      s,
      a,
      u = $t(e.target) || $n,
      c = A.core.globals().ScrollSmoother,
      f = c && c.get(),
      d =
        Ir &&
        ((e.content && $t(e.content)) ||
          (f && e.content !== !1 && !f.smooth() && f.content())),
      p = di(u, Ge),
      v = di(u, Dt),
      m = 1,
      x =
        ($e.isTouch && ne.visualViewport
          ? ne.visualViewport.scale * ne.visualViewport.width
          : ne.outerWidth) / ne.innerWidth,
      g = 0,
      h = jt(i)
        ? function () {
            return i(s);
          }
        : function () {
            return i || 2.8;
          },
      y,
      _,
      k = $1(u, e.type, !0, o),
      E = function () {
        return (_ = !1);
      },
      C = Kn,
      T = Kn,
      N = function () {
        (a = er(u, Ge)),
          (T = ql(Ir ? 1 : 0, a)),
          r && (C = ql(0, er(u, Dt))),
          (y = Vi);
      },
      R = function () {
        (d._gsap.y = zl(parseFloat(d._gsap.y) + p.offset) + "px"),
          (d.style.transform =
            "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " +
            parseFloat(d._gsap.y) +
            ", 0, 1)"),
          (p.offset = p.cacheID = 0);
      },
      I = function () {
        if (_) {
          requestAnimationFrame(E);
          var M = zl(s.deltaY / 2),
            j = T(p.v - M);
          if (d && j !== p.v + p.offset) {
            p.offset = j - p.v;
            var S = zl((parseFloat(d && d._gsap.y) || 0) - p.offset);
            (d.style.transform =
              "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " +
              S +
              ", 0, 1)"),
              (d._gsap.y = S + "px"),
              (p.cacheID = J.cache),
              wr();
          }
          return !0;
        }
        p.offset && R(), (_ = !0);
      },
      z,
      H,
      X,
      ee,
      Q = function () {
        N(),
          z.isActive() &&
            z.vars.scrollY > a &&
            (p() > a ? z.progress(1) && p(a) : z.resetTo("scrollY", a));
      };
    return (
      d && A.set(d, { y: "+=0" }),
      (e.ignoreCheck = function ($) {
        return (
          (Ir && $.type === "touchmove" && I()) ||
          (m > 1.05 && $.type !== "touchstart") ||
          s.isGesturing ||
          ($.touches && $.touches.length > 1)
        );
      }),
      (e.onPress = function () {
        _ = !1;
        var $ = m;
        (m = zl(((ne.visualViewport && ne.visualViewport.scale) || 1) / x)),
          z.pause(),
          $ !== m && Uc(u, m > 1.01 ? !0 : r ? !1 : "x"),
          (H = v()),
          (X = p()),
          N(),
          (y = Vi);
      }),
      (e.onRelease = e.onGestureStart =
        function ($, M) {
          if ((p.offset && R(), !M)) ee.restart(!0);
          else {
            J.cache++;
            var j = h(),
              S,
              U;
            r &&
              ((S = v()),
              (U = S + (j * 0.05 * -$.velocityX) / 0.227),
              (j *= L0(v, S, U, er(u, Dt))),
              (z.vars.scrollX = C(U))),
              (S = p()),
              (U = S + (j * 0.05 * -$.velocityY) / 0.227),
              (j *= L0(p, S, U, er(u, Ge))),
              (z.vars.scrollY = T(U)),
              z.invalidate().duration(j).play(0.01),
              ((Ir && z.vars.scrollY >= a) || S >= a - 1) &&
                A.to({}, { onUpdate: Q, duration: j });
          }
          l && l($);
        }),
      (e.onWheel = function () {
        z._ts && z.pause(), _t() - g > 1e3 && ((y = 0), (g = _t()));
      }),
      (e.onChange = function ($, M, j, S, U) {
        if (
          (Vi !== y && N(),
          M && r && v(C(S[2] === M ? H + ($.startX - $.x) : v() + M - S[1])),
          j)
        ) {
          p.offset && R();
          var oe = U[2] === j,
            ft = oe ? X + $.startY - $.y : p() + j - U[1],
            ue = T(ft);
          oe && ft !== ue && (X += ue - ft), p(ue);
        }
        (j || M) && wr();
      }),
      (e.onEnable = function () {
        Uc(u, r ? !1 : "x"),
          G.addEventListener("refresh", Q),
          et(ne, "resize", Q),
          p.smooth &&
            ((p.target.style.scrollBehavior = "auto"),
            (p.smooth = v.smooth = !1)),
          k.enable();
      }),
      (e.onDisable = function () {
        Uc(u, !0),
          Ze(ne, "resize", Q),
          G.removeEventListener("refresh", Q),
          k.kill();
      }),
      (e.lockAxis = e.lockAxis !== !1),
      (s = new $e(e)),
      (s.iOS = Ir),
      Ir && !p() && p(1),
      Ir && A.ticker.add(Kn),
      (ee = s._dc),
      (z = A.to(s, {
        ease: "power4",
        paused: !0,
        inherit: !1,
        scrollX: r ? "+=0.1" : "+=0",
        scrollY: "+=0.1",
        modifiers: {
          scrollY: b1(p, p(), function () {
            return z.pause();
          }),
        },
        onUpdate: wr,
        onComplete: ee.vars.onComplete,
      })),
      s
    );
  };
G.sort = function (t) {
  return K.sort(
    t ||
      function (e, n) {
        return (
          (e.vars.refreshPriority || 0) * -1e6 +
          e.start -
          (n.start + (n.vars.refreshPriority || 0) * -1e6)
        );
      }
  );
};
G.observe = function (t) {
  return new $e(t);
};
G.normalizeScroll = function (t) {
  if (typeof t > "u") return Rt;
  if (t === !0 && Rt) return Rt.enable();
  if (t === !1) {
    Rt && Rt.kill(), (Rt = t);
    return;
  }
  var e = t instanceof $e ? t : TS(t);
  return Rt && Rt.target === e.target && Rt.kill(), qi(e.target) && (Rt = e), e;
};
G.core = {
  _getVelocityProp: nd,
  _inputObserver: $1,
  _scrollers: J,
  _proxies: ir,
  bridge: {
    ss: function () {
      En || Zi("scrollStart"), (En = _t());
    },
    ref: function () {
      return yt;
    },
  },
};
R1() && A.registerPlugin(G);
function B1(t) {
  var e,
    n,
    r = "";
  if (typeof t == "string" || typeof t == "number") r += t;
  else if (typeof t == "object")
    if (Array.isArray(t)) {
      var i = t.length;
      for (e = 0; e < i; e++)
        t[e] && (n = B1(t[e])) && (r && (r += " "), (r += n));
    } else for (n in t) t[n] && (r && (r += " "), (r += n));
  return r;
}
function U1() {
  for (var t, e, n = 0, r = "", i = arguments.length; n < i; n++)
    (t = arguments[n]) && (e = B1(t)) && (r && (r += " "), (r += e));
  return r;
}
re.registerPlugin(G);
const Dp = ({ title: t, containerClass: e }) => {
    const n = P.useRef(null);
    return (
      P.useEffect(() => {
        const r = re.context(() => {
          re.timeline({
            scrollTrigger: {
              trigger: n.current,
              start: "100 bottom",
              end: "center bottom",
              toggleActions: "play none none reverse",
            },
          }).to(
            ".animated-word",
            {
              opacity: 1,
              transform: "translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg)",
              ease: "power2.inOut",
              stagger: 0.02,
            },
            0
          );
        }, n);
        return () => r.revert();
      }, []),
      w.jsx("div", {
        ref: n,
        className: U1("animated-title", e),
        children: t
          .split("<br />")
          .map((r, i) =>
            w.jsx(
              "div",
              {
                className:
                  "flex-center max-w-full flex-wrap gap-2 px-10 md:gap-3",
                children: r
                  .split(" ")
                  .map((o, l) =>
                    w.jsx(
                      "span",
                      {
                        className: "animated-word",
                        dangerouslySetInnerHTML: { __html: o },
                      },
                      l
                    )
                  ),
              },
              i
            )
          ),
      })
    );
  },
  bs = ({
    title: t,
    leftIcon: e,
    rightIcon: n,
    containerClass: r,
    onClick: i,
    id: o,
  }) =>
    w.jsxs("button", {
      id: o,
      onClick: i,
      className: `rounded-full px-4 py-2 ${r}`,
      children: [
        e,
        w.jsx("span", { className: "font-semibold", children: t }),
        n,
      ],
    });
re.registerPlugin(G);
const NS = () => {
  const t = P.useRef(null),
    e = P.useRef(null),
    n = P.useRef(null);
  return (
    fi(() => {
      re
        .timeline({
          scrollTrigger: {
            trigger: "#clip",
            start: "center center",
            end: "+=800 center",
            scrub: 0.5,
            pin: !0,
            pinSpacing: !0,
            onEnter: () => {
              re.to(".community-stats", { opacity: 0, y: 30, duration: 0.4 }),
                re.to(".image-text-overlay", {
                  opacity: 1,
                  scale: 1,
                  duration: 0.6,
                  delay: 0.3,
                });
            },
            onLeaveBack: () => {
              re.to(".community-stats", { opacity: 1, y: 0, duration: 0.4 }),
                re.to(".image-text-overlay", {
                  opacity: 0,
                  scale: 0.9,
                  duration: 0.3,
                });
            },
          },
        })
        .to(".mask-clip-path", {
          width: "100vw",
          height: "100vh",
          borderRadius: 0,
          duration: 1.5,
          ease: "power2.inOut",
        }),
        re.to(".about-subtext", {
          scrollTrigger: {
            trigger: ".about-subtext",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.3,
          },
          y: -50,
          opacity: 1,
        }),
        n.current &&
          n.current.querySelectorAll(".stat-number").forEach((o) => {
            const l = parseInt(o.getAttribute("data-value"));
            re.to(o, {
              scrollTrigger: {
                trigger: n.current,
                start: "top bottom-=100",
                toggleActions: "play none none reverse",
              },
              innerText: l,
              duration: 2,
              snap: { innerText: 1 },
              ease: "power2.inOut",
            });
          }),
        re.from(".quote-text", {
          scrollTrigger: {
            trigger: ".quote-text",
            start: "top bottom",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          y: 20,
          stagger: 0.2,
          duration: 0.8,
          ease: "power2.out",
        });
    }, []),
    w.jsxs("div", {
      id: "community",
      ref: t,
      className: "min-h-screen w-screen bg-white",
      children: [
        w.jsxs("div", {
          className:
            "relative mb-8 mt-36 flex flex-col items-center gap-5 px-4",
          children: [
            w.jsx("div", {
              className: "overflow-hidden",
              children: w.jsx("p", {
                className:
                  "font-general text-sm uppercase tracking-wider md:text-[10px]",
                "aria-label": "Welcome to FitPro",
                children: "Welcome to FitPro",
              }),
            }),
            w.jsx(Dp, {
              title:
                "Disc<b>o</b>ver the world's <br /> largest Fitness Comm<b>un</b>ity",
              containerClass: "mt-5 !text-black text-center",
            }),
            w.jsxs("div", {
              className: "about-subtext max-w-xl text-center opacity-80",
              children: [
                w.jsx("p", {
                  className: "mb-2 text-lg font-medium",
                  children:
                    "Welcome to an amazing community of fitness enthusiasts.",
                }),
                w.jsx("p", {
                  className: "text-gray-600",
                  children:
                    "Join thousands who are transforming their lives through shared goals, expert guidance, and mutual support. At FitPro, we believe fitness is better together.",
                }),
              ],
            }),
            w.jsx("div", {
              ref: n,
              className:
                "community-stats mt-12 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-3",
              children: [
                { value: 5e3, label: "Members", icon: "👥" },
                { value: 350, label: "Daily Workouts", icon: "💪" },
                { value: 120, label: "Expert Trainers", icon: "🏆" },
              ].map((r, i) =>
                w.jsxs(
                  "div",
                  {
                    className: "flex flex-col items-center",
                    children: [
                      w.jsx("div", {
                        className: "mb-2 text-3xl",
                        children: r.icon,
                      }),
                      w.jsxs("div", {
                        className: "flex items-end",
                        children: [
                          w.jsx("span", {
                            className:
                              "stat-number text-4xl font-bold text-blue-600",
                            "data-value": r.value,
                            children: "0",
                          }),
                          w.jsx("span", {
                            className: "text-lg",
                            children: "+",
                          }),
                        ],
                      }),
                      w.jsx("p", {
                        className: "text-sm text-gray-500",
                        children: r.label,
                      }),
                    ],
                  },
                  i
                )
              ),
            }),
          ],
        }),
        w.jsx("div", {
          className: "h-dvh w-screen",
          id: "clip",
          ref: e,
          children: w.jsxs("div", {
            className:
              "mask-clip-path about-image relative mx-auto h-72 w-72 overflow-hidden rounded-xl md:h-96 md:w-96",
            children: [
              w.jsx("img", {
                src: "img/about.webp",
                alt: "Fitness Community Background",
                className: "absolute left-0 top-0 size-full object-cover",
              }),
              w.jsx("div", {
                className:
                  "image-text-overlay absolute inset-0 flex flex-col items-center justify-center opacity-0 scale-90 transition-all duration-500",
                children: w.jsxs("div", {
                  className: "px-8 py-6 text-center",
                  children: [
                    w.jsxs("div", {
                      className: "mb-8 space-y-2",
                      children: [
                        w.jsx("p", {
                          className:
                            "quote-text text-2xl font-bold text-white drop-shadow-lg",
                          children: "#FitProCommunity",
                        }),
                        w.jsxs("p", {
                          className:
                            "quote-text text-xl italic text-white drop-shadow-lg",
                          children: [
                            '"Together We Sweat,',
                            w.jsx("br", {}),
                            'Together We Thrive"',
                          ],
                        }),
                      ],
                    }),
                    w.jsx("div", {
                      className: "mt-4 flex justify-center",
                      children: w.jsx("div", {
                        className:
                          "rounded-md bg-black/30 px-4 py-2 backdrop-blur-sm",
                        children: w.jsx("p", {
                          className: "text-sm font-medium text-white",
                          children: "@fitpro_official",
                        }),
                      }),
                    }),
                  ],
                }),
              }),
              w.jsxs("div", {
                className:
                  "absolute left-0 top-0 size-full opacity-0 transition-opacity duration-500 ease-in-out",
                children: [
                  w.jsxs("div", {
                    className:
                      "absolute bottom-0 left-0 right-0 flex flex-col items-center bg-gradient-to-t from-black to-transparent p-8 text-white",
                    children: [
                      w.jsx("h3", {
                        className: "mb-4 text-2xl font-bold",
                        children: "Join Our Community Today",
                      }),
                      w.jsx("p", {
                        className: "mb-6 text-center",
                        children:
                          "Connect with like-minded individuals on your fitness journey. Share goals, celebrate victories, and overcome challenges together.",
                      }),
                      w.jsx(bs, {
                        label: "Join Now",
                        onClick: () => console.log("Join button clicked"),
                        className:
                          "bg-blue-500 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-600",
                      }),
                    ],
                  }),
                  w.jsxs("div", {
                    className:
                      "absolute right-4 top-4 flex items-center rounded-full bg-white/10 px-4 py-2 backdrop-blur-md",
                    children: [
                      w.jsx("div", {
                        className: "mr-2 flex -space-x-2",
                        children: [1, 2, 3].map((r) =>
                          w.jsx(
                            "div",
                            {
                              className:
                                "h-8 w-8 overflow-hidden rounded-full border-2 border-white",
                              children: w.jsx("div", {
                                className: `h-full w-full bg-blue-${
                                  r * 100 + 200
                                }`,
                              }),
                            },
                            r
                          )
                        ),
                      }),
                      w.jsx("span", {
                        className: "text-sm font-medium text-white",
                        children: "+1.2k online",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        }),
        w.jsx("script", {
          children: `
          document.addEventListener('DOMContentLoaded', function() {
            const clipPath = document.querySelector('.mask-clip-path');
            const innerContent = clipPath.querySelector('div');
            
            const observer = new IntersectionObserver(entries => {
              entries.forEach(entry => {
                if (entry.isIntersecting && clipPath.offsetWidth > 500) {
                  innerContent.style.opacity = '1';
                } else {
                  innerContent.style.opacity = '0';
                }
              });
            }, { threshold: 0.7 });
            
            observer.observe(clipPath);
          });
        `,
        }),
      ],
    })
  );
};
var V1 = {
    color: void 0,
    size: void 0,
    className: void 0,
    style: void 0,
    attr: void 0,
  },
  j0 = Di.createContext && Di.createContext(V1),
  RS = ["attr", "size", "title"];
function OS(t, e) {
  if (t == null) return {};
  var n = MS(t, e),
    r,
    i;
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    for (i = 0; i < o.length; i++)
      (r = o[i]),
        !(e.indexOf(r) >= 0) &&
          Object.prototype.propertyIsEnumerable.call(t, r) &&
          (n[r] = t[r]);
  }
  return n;
}
function MS(t, e) {
  if (t == null) return {};
  var n = {};
  for (var r in t)
    if (Object.prototype.hasOwnProperty.call(t, r)) {
      if (e.indexOf(r) >= 0) continue;
      n[r] = t[r];
    }
  return n;
}
function Nu() {
  return (
    (Nu = Object.assign
      ? Object.assign.bind()
      : function (t) {
          for (var e = 1; e < arguments.length; e++) {
            var n = arguments[e];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
          }
          return t;
        }),
    Nu.apply(this, arguments)
  );
}
function F0(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    e &&
      (r = r.filter(function (i) {
        return Object.getOwnPropertyDescriptor(t, i).enumerable;
      })),
      n.push.apply(n, r);
  }
  return n;
}
function Ru(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2
      ? F0(Object(n), !0).forEach(function (r) {
          LS(t, r, n[r]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n))
      : F0(Object(n)).forEach(function (r) {
          Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(n, r));
        });
  }
  return t;
}
function LS(t, e, n) {
  return (
    (e = zS(e)),
    e in t
      ? Object.defineProperty(t, e, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (t[e] = n),
    t
  );
}
function zS(t) {
  var e = DS(t, "string");
  return typeof e == "symbol" ? e : e + "";
}
function DS(t, e) {
  if (typeof t != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e || "default");
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function H1(t) {
  return (
    t &&
    t.map((e, n) =>
      Di.createElement(e.tag, Ru({ key: n }, e.attr), H1(e.child))
    )
  );
}
function io(t) {
  return (e) =>
    Di.createElement(jS, Nu({ attr: Ru({}, t.attr) }, e), H1(t.child));
}
function jS(t) {
  var e = (n) => {
    var { attr: r, size: i, title: o } = t,
      l = OS(t, RS),
      s = i || n.size || "1em",
      a;
    return (
      n.className && (a = n.className),
      t.className && (a = (a ? a + " " : "") + t.className),
      Di.createElement(
        "svg",
        Nu(
          { stroke: "currentColor", fill: "currentColor", strokeWidth: "0" },
          n.attr,
          r,
          l,
          {
            className: a,
            style: Ru(Ru({ color: t.color || n.color }, n.style), t.style),
            height: s,
            width: s,
            xmlns: "http://www.w3.org/2000/svg",
          }
        ),
        o && Di.createElement("title", null, o),
        t.children
      )
    );
  };
  return j0 !== void 0
    ? Di.createElement(j0.Consumer, null, (n) => e(n))
    : e(V1);
}
function jp(t) {
  return io({
    tag: "svg",
    attr: { version: "1.2", baseProfile: "tiny", viewBox: "0 0 24 24" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M10.368 19.102c.349 1.049 1.011 1.086 1.478.086l5.309-11.375c.467-1.002.034-1.434-.967-.967l-11.376 5.308c-1.001.467-.963 1.129.085 1.479l4.103 1.367 1.368 4.102z",
        },
        child: [],
      },
    ],
  })(t);
}
const FS = ({ children: t }) => {
  const [e, n] = P.useState(!1),
    r = P.useRef(null),
    i = P.useRef(null),
    o = ({ clientX: l, clientY: s, currentTarget: a }) => {
      const u = a.getBoundingClientRect(),
        c = l - (u.left + u.width / 2),
        f = s - (u.top + u.height / 2);
      e &&
        (re.to(r.current, {
          x: c,
          y: f,
          rotationY: c / 2,
          rotationX: -f / 2,
          transformPerspective: 500,
          duration: 1,
          ease: "power1.out",
        }),
        re.to(i.current, { x: -c, y: -f, duration: 1, ease: "power1.out" }));
    };
  return (
    P.useEffect(() => {
      e ||
        (re.to(r.current, {
          x: 0,
          y: 0,
          rotationY: 0,
          rotationX: 0,
          duration: 1,
          ease: "power1.out",
        }),
        re.to(i.current, { x: 0, y: 0, duration: 1, ease: "power1.out" }));
    }, [e]),
    w.jsx("section", {
      ref: r,
      onMouseMove: o,
      onMouseEnter: () => n(!0),
      onMouseLeave: () => n(!1),
      className: "absolute z-50 size-full overflow-hidden rounded-lg",
      style: { perspective: "500px" },
      children: w.jsx("div", {
        ref: i,
        className: "origin-center rounded-lg",
        style: { transformStyle: "preserve-3d" },
        children: t,
      }),
    })
  );
};
re.registerPlugin(G);
const AS = () => {
  const [t, e] = P.useState(1),
    [n, r] = P.useState(!1),
    [i, o] = P.useState(!0),
    [l, s] = P.useState(0),
    a = 4,
    u = P.useRef(null);
  lv();
  const c = () => {
      window.location.href = "/auth/register";
    },
    f = () => {
      s((v) => v + 1);
    };
  P.useEffect(() => {
    l === a - 1 && o(!1);
  }, [l]);
  const d = () => {
    r(!0), e((v) => (v % a) + 1);
  };
  fi(
    () => {
      n &&
        (re.set("#next-video", { visibility: "visible" }),
        re.to("#next-video", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1,
          ease: "power1.inOut",
          onStart: () => u.current.play(),
        }),
        re.from("#current-video", {
          transformOrigin: "center center",
          scale: 0,
          duration: 1.5,
          ease: "power1.inOut",
        }));
    },
    { dependencies: [t], revertOnUpdate: !0 }
  ),
    fi(() => {
      re.set("#video-frame", {
        clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
        borderRadius: "0% 0% 40% 10%",
      }),
        re.from("#video-frame", {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          borderRadius: "0% 0% 0% 0%",
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: "#video-frame",
            start: "center center",
            end: "bottom center",
            scrub: !0,
          },
        });
    });
  const p = (v) => `videos/hero-${v}.mp4`;
  return w.jsxs("div", {
    id: "home",
    className:
      "relative h-dvh w-screen overflow-x-hidden bg-gradient-to-b from-yellow-950 ",
    children: [
      i &&
        w.jsx("div", {
          className:
            "flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-black",
          children: w.jsxs("div", {
            className: "three-body",
            children: [
              w.jsx("div", { className: "three-body__dot" }),
              w.jsx("div", { className: "three-body__dot" }),
              w.jsx("div", { className: "three-body__dot" }),
            ],
          }),
        }),
      w.jsxs("div", {
        id: "video-frame",
        className:
          "relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-yellow-900/40 backdrop-blur-md",
        children: [
          w.jsxs("div", {
            children: [
              w.jsx("div", {
                className:
                  "mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg",
                children: w.jsx(FS, {
                  children: w.jsx("div", {
                    onClick: d,
                    className:
                      "origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100",
                    children: w.jsx("video", {
                      ref: u,
                      src: p((t % a) + 1),
                      loop: !0,
                      muted: !0,
                      id: "current-video",
                      className:
                        "size-64 origin-center scale-150 object-cover object-center",
                      onLoadedData: f,
                    }),
                  }),
                }),
              }),
              w.jsx("video", {
                ref: u,
                src: p(t),
                loop: !0,
                muted: !0,
                id: "next-video",
                className:
                  "absolute-center invisible absolute z-20 size-64 object-cover object-center",
                onLoadedData: f,
              }),
              w.jsx("video", {
                src: p(t === a - 1 ? 1 : t),
                autoPlay: !0,
                loop: !0,
                muted: !0,
                className:
                  "absolute left-0 top-0 size-full object-cover object-center brightness-75 contrast-125 saturate-150",
                onLoadedData: f,
              }),
            ],
          }),
          w.jsx("div", {
            className:
              "absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-30",
          }),
          w.jsx("div", {
            className:
              "absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/50 z-30 pointer-events-none",
          }),
          w.jsx("div", {
            className:
              "absolute inset-0 z-25 opacity-10 bg-[url('/textures/noise.png')] mix-blend-overlay pointer-events-none",
          }),
          w.jsxs("h1", {
            className:
              "special-font hero-heading absolute bottom-5 right-5 z-40 text-yellow-500 animate-pulse drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]",
            children: ["F", w.jsx("b", { children: "I" }), "TNESS"],
          }),
          w.jsx("div", {
            className: "absolute left-0 top-0 z-40 size-full",
            children: w.jsx("div", {
              className: "mt-32 px-8 sm:px-12",
              children: w.jsxs("div", {
                className: "space-y-8 max-w-2xl",
                children: [
                  w.jsxs("h1", {
                    className:
                      "special-font hero-heading text-white transform transition-all duration-700 hover:scale-105 drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]",
                    children: [
                      "REDFI",
                      w.jsx("b", {
                        className: "text-yellow-500",
                        children: "N",
                      }),
                      "E",
                    ],
                  }),
                  w.jsxs("div", {
                    className: "space-y-6",
                    children: [
                      w.jsxs("p", {
                        className:
                          "special-font text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-wider font-bold text-white opacity-90 transform transition-all duration-500 hover:translate-x-2",
                        children: [
                          "Success is Earned,",
                          w.jsx("br", {}),
                          "Not ",
                          w.jsx("b", {
                            className:
                              "text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]",
                            children: "G",
                          }),
                          "iven",
                        ],
                      }),
                      w.jsxs("p", {
                        className:
                          "special-font text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-wider font-bold text-white opacity-90 transform transition-all duration-500 hover:translate-x-2",
                        children: [
                          "Unleash the Inner",
                          w.jsx("br", {}),
                          w.jsx("b", {
                            className:
                              "text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]",
                            children: "B",
                          }),
                          "east",
                        ],
                      }),
                    ],
                  }),
                  w.jsx("div", {
                    className: "pt-6",
                    children: w.jsx(bs, {
                      id: "Sign-up",
                      title: "Join The Hunt",
                      leftIcon: w.jsx(jp, {}),
                      containerClass: "bg-yellow-300 flex-center gap-1",
                      onClick: c,
                    }),
                  }),
                ],
              }),
            }),
          }),
        ],
      }),
      w.jsxs("div", {
        className: "absolute inset-0 pointer-events-none",
        children: [
          w.jsx("div", {
            className:
              "absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-yellow-500/10 to-transparent mix-blend-screen",
          }),
          w.jsx("div", {
            className:
              "absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-yellow-500/15 to-transparent mix-blend-screen",
          }),
          w.jsx("div", {
            className: "particle-container absolute inset-0 z-5",
          }),
        ],
      }),
      w.jsxs("h1", {
        className:
          "special-font hero-heading absolute bottom-8 right-8 text-black/50 animate-pulse",
        children: [
          "F",
          w.jsx("b", { className: "text-yellow-500/50", children: "I" }),
          "TNESS",
        ],
      }),
    ],
  });
};
function IS(t) {
  for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
  t && t.addEventListener && t.addEventListener.apply(t, e);
}
function bS(t) {
  for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
  t && t.removeEventListener && t.removeEventListener.apply(t, e);
}
var A0 = typeof window < "u",
  $S = function (t) {
    P.useEffect(t, []);
  },
  BS = function (t) {
    var e = P.useRef(t);
    (e.current = t),
      $S(function () {
        return function () {
          return e.current();
        };
      });
  },
  US = function (t) {
    var e = P.useRef(0),
      n = P.useState(t),
      r = n[0],
      i = n[1],
      o = P.useCallback(function (l) {
        cancelAnimationFrame(e.current),
          (e.current = requestAnimationFrame(function () {
            i(l);
          }));
      }, []);
    return (
      BS(function () {
        cancelAnimationFrame(e.current);
      }),
      [r, o]
    );
  },
  VS = function () {
    var t = US(function () {
        return {
          x: A0 ? window.pageXOffset : 0,
          y: A0 ? window.pageYOffset : 0,
        };
      }),
      e = t[0],
      n = t[1];
    return (
      P.useEffect(function () {
        var r = function () {
          n(function (i) {
            var o = window.pageXOffset,
              l = window.pageYOffset;
            return i.x !== o || i.y !== l ? { x: o, y: l } : i;
          });
        };
        return (
          r(),
          IS(window, "scroll", r, { capture: !1, passive: !0 }),
          function () {
            bS(window, "scroll", r);
          }
        );
      }, []),
      e
    );
  };
const HS = [
    { label: "Home", id: "home" },
    { label: "Community", id: "community" },
    { label: "Our Offerings ", id: "offerings" },
    { label: "Story", id: "story" },
    { label: "Contact", id: "contact" },
  ],
  WS = () => {
    const [t, e] = P.useState(!1),
      [n, r] = P.useState(!1),
      [i, o] = P.useState(!1),
      l = P.useRef(null),
      s = P.useRef(null),
      { y: a } = VS(),
      [u, c] = P.useState(!0),
      [f, d] = P.useState(0),
      p = async () => {
        try {
          t ? (l.current.pause(), e(!1)) : (await l.current.play(), e(!0)),
            r(!n);
        } catch (v) {
          console.error("Audio playback failed:", v);
        }
      };
    return (
      P.useEffect(() => {
        const v = async () => {
          if (!i) {
            o(!0);
            try {
              await l.current.play(), e(!0), r(!0);
            } catch (m) {
              console.error("Auto-play failed:", m);
            }
          }
        };
        return (
          document.addEventListener("click", v, { once: !0 }),
          () => document.removeEventListener("click", v)
        );
      }, [i]),
      P.useEffect(() => {
        const v = l.current;
        return (
          v.load(),
          (v.volume = 0.5),
          () => {
            v.pause();
          }
        );
      }, []),
      P.useEffect(() => {
        a === 0
          ? (c(!0), s.current.classList.remove("floating-nav"))
          : a > f
          ? (c(!1), s.current.classList.add("floating-nav"))
          : a < f && (c(!0), s.current.classList.add("floating-nav")),
          d(a);
      }, [a, f]),
      P.useEffect(() => {
        re.to(s.current, {
          y: u ? 0 : -100,
          opacity: u ? 1 : 0,
          duration: 0.2,
        });
      }, [u]),
      w.jsx("div", {
        ref: s,
        className:
          "fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6",
        role: "navigation",
        "aria-label": "Main Navigation",
        children: w.jsx("header", {
          className: "absolute top-1/2 w-full -translate-y-1/2",
          children: w.jsxs("nav", {
            className: "flex size-full items-center justify-between p-4",
            children: [
              w.jsxs("div", {
                className: "flex items-center gap-10",
                children: [
                  w.jsx("a", {
                    href: "/",
                    "aria-label": "Home",
                    children: w.jsx("img", {
                      src: "/img/logo.png",
                      alt: "FitPro Logo",
                      className: "w-[200px]",
                    }),
                  }),
                  w.jsx(bs, {
                    id: "product-button",
                    title: "Products",
                    rightIcon: w.jsx(jp, {}),
                    containerClass:
                      "bg-blue-50 md:flex hidden items-center justify-center gap-1",
                  }),
                ],
              }),
              w.jsxs("div", {
                className: "flex h-full items-center",
                children: [
                  w.jsxs("div", {
                    className: "hidden md:block",
                    children: [
                      HS.map((v, m) =>
                        w.jsx(
                          "a",
                          {
                            href: `#${v.id}`,
                            className: "nav-hover-btn",
                            "aria-label": `Navigate to ${v.label}`,
                            children: v.label,
                          },
                          m
                        )
                      ),
                      w.jsx("a", {
                        href: "/auth/login",
                        className: "nav-hover-btn",
                        "aria-label": "Login",
                        children: "Login",
                      }),
                    ],
                  }),
                  w.jsxs("button", {
                    onClick: p,
                    className: "ml-10 flex items-center space-x-0.5",
                    title: t ? "Pause Audio" : "Play Audio",
                    "aria-pressed": t,
                    "aria-label": t
                      ? "Pause background audio"
                      : "Play background audio",
                    children: [
                      w.jsx("audio", {
                        ref: l,
                        className: "hidden",
                        src: "/audio/loop.mp3",
                        loop: !0,
                        preload: "auto",
                      }),
                      [1, 2, 3, 4].map((v) =>
                        w.jsx(
                          "div",
                          {
                            className: U1("indicator-line", { active: n }),
                            style: { animationDelay: `${v * 0.1}s` },
                          },
                          v
                        )
                      ),
                    ],
                  }),
                ],
              }),
            ],
          }),
        }),
      })
    );
  };
function YS(t) {
  return io({
    tag: "svg",
    attr: { viewBox: "0 0 448 512" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M350.85 129c25.97 4.67 47.27 18.67 63.92 42 14.65 20.67 24.64 46.67 29.96 78 4.67 28.67 4.32 57.33-1 86-7.99 47.33-23.97 87-47.94 119-28.64 38.67-64.59 58-107.87 58-10.66 0-22.3-3.33-34.96-10-8.66-5.33-18.31-8-28.97-8s-20.3 2.67-28.97 8c-12.66 6.67-24.3 10-34.96 10-43.28 0-79.23-19.33-107.87-58-23.97-32-39.95-71.67-47.94-119-5.32-28.67-5.67-57.33-1-86 5.32-31.33 15.31-57.33 29.96-78 16.65-23.33 37.95-37.33 63.92-42 15.98-2.67 37.95-.33 65.92 7 23.97 6.67 44.28 14.67 60.93 24 16.65-9.33 36.96-17.33 60.93-24 27.98-7.33 49.96-9.67 65.94-7zm-54.94-41c-9.32 8.67-21.65 15-36.96 19-10.66 3.33-22.3 5-34.96 5l-14.98-1c-1.33-9.33-1.33-20 0-32 2.67-24 10.32-42.33 22.97-55 9.32-8.67 21.65-15 36.96-19 10.66-3.33 22.3-5 34.96-5l14.98 1 1 15c0 12.67-1.67 24.33-4.99 35-3.99 15.33-10.31 27.67-18.98 37z",
        },
        child: [],
      },
    ],
  })(t);
}
function XS(t) {
  return io({
    tag: "svg",
    attr: { viewBox: "0 0 640 512" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M104 96H56c-13.3 0-24 10.7-24 24v104H8c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h24v104c0 13.3 10.7 24 24 24h48c13.3 0 24-10.7 24-24V120c0-13.3-10.7-24-24-24zm528 128h-24V120c0-13.3-10.7-24-24-24h-48c-13.3 0-24 10.7-24 24v272c0 13.3 10.7 24 24 24h48c13.3 0 24-10.7 24-24V288h24c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM456 32h-48c-13.3 0-24 10.7-24 24v168H256V56c0-13.3-10.7-24-24-24h-48c-13.3 0-24 10.7-24 24v400c0 13.3 10.7 24 24 24h48c13.3 0 24-10.7 24-24V288h128v168c0 13.3 10.7 24 24 24h48c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24z",
        },
        child: [],
      },
    ],
  })(t);
}
function QS(t) {
  return io({
    tag: "svg",
    attr: { viewBox: "0 0 512 512" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M320.2 243.8l-49.7 99.4c-6 12.1-23.4 11.7-28.9-.6l-56.9-126.3-30 71.7H60.6l182.5 186.5c7.1 7.3 18.6 7.3 25.7 0L451.4 288H342.3l-22.1-44.2zM473.7 73.9l-2.4-2.5c-51.5-52.6-135.8-52.6-187.4 0L256 100l-27.9-28.5c-51.5-52.7-135.9-52.7-187.4 0l-2.4 2.4C-10.4 123.7-12.5 203 31 256h102.4l35.9-86.2c5.4-12.9 23.6-13.2 29.4-.4l58.2 129.3 49-97.9c5.9-11.8 22.7-11.8 28.6 0l27.6 55.2H481c43.5-53 41.4-132.3-7.3-182.1z",
        },
        child: [],
      },
    ],
  })(t);
}
function GS(t) {
  return io({
    tag: "svg",
    attr: { viewBox: "0 0 416 512" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M272 96c26.51 0 48-21.49 48-48S298.51 0 272 0s-48 21.49-48 48 21.49 48 48 48zM113.69 317.47l-14.8 34.52H32c-17.67 0-32 14.33-32 32s14.33 32 32 32h77.45c19.25 0 36.58-11.44 44.11-29.09l8.79-20.52-10.67-6.3c-17.32-10.23-30.06-25.37-37.99-42.61zM384 223.99h-44.03l-26.06-53.25c-12.5-25.55-35.45-44.23-61.78-50.94l-71.08-21.14c-28.3-6.8-57.77-.55-80.84 17.14l-39.67 30.41c-14.03 10.75-16.69 30.83-5.92 44.86s30.84 16.66 44.86 5.92l39.69-30.41c7.67-5.89 17.44-8 25.27-6.14l14.7 4.37-37.46 87.39c-12.62 29.48-1.31 64.01 26.3 80.31l84.98 50.17-27.47 87.73c-5.28 16.86 4.11 34.81 20.97 40.09 3.19 1 6.41 1.48 9.58 1.48 13.61 0 26.23-8.77 30.52-22.45l31.64-101.06c5.91-20.77-2.89-43.08-21.64-54.39l-61.24-36.14 31.31-78.28 20.27 41.43c8 16.34 24.92 26.89 43.11 26.89H384c17.67 0 32-14.33 32-32s-14.33-31.99-32-31.99z",
        },
        child: [],
      },
    ],
  })(t);
}
function KS(t) {
  return io({
    tag: "svg",
    attr: { viewBox: "0 0 24 24" },
    child: [
      { tag: "path", attr: { fill: "none", d: "M0 0h24v24H0z" }, child: [] },
      {
        tag: "path",
        attr: {
          d: "M20.57 14.86 22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z",
        },
        child: [],
      },
    ],
  })(t);
}
function qS(t) {
  return io({
    tag: "svg",
    attr: { viewBox: "0 0 24 24" },
    child: [
      { tag: "path", attr: { fill: "none", d: "M0 0h24v24H0z" }, child: [] },
      {
        tag: "path",
        attr: {
          d: "m19.8 2-8.2 6.7-1.21-1.04 3.6-2.08L9.41 1 8 2.41l2.74 2.74L5 8.46l-1.19 4.29L6.27 17 8 16l-2.03-3.52.35-1.3L9.5 13l.5 9h2l.5-10L21 3.4z",
        },
        child: [],
      },
      { tag: "circle", attr: { cx: "5", cy: "5", r: "2" }, child: [] },
    ],
  })(t);
}
re.registerPlugin(G);
const ho = ({ children: t, className: e = "", index: n }) => {
    const [r, i] = P.useState(""),
      o = P.useRef(null);
    fi(
      () => {
        o.current &&
          re.from(o.current, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: o.current,
              start: "top bottom-=100",
              end: "top center",
              toggleActions: "play none none reverse",
            },
            delay: n * 0.1,
          });
      },
      { scope: o, dependencies: [n] }
    );
    const l = (a) => {
        if (!o.current) return;
        const {
            left: u,
            top: c,
            width: f,
            height: d,
          } = o.current.getBoundingClientRect(),
          p = (a.clientX - u) / f,
          m = ((a.clientY - c) / d - 0.5) * 5,
          x = (p - 0.5) * -5,
          g = `perspective(700px) rotateX(${m}deg) rotateY(${x}deg) scale3d(.95, .95, .95)`;
        i(g);
      },
      s = () => {
        re.to(o.current, {
          transform:
            "perspective(700px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => i(""),
        });
      };
    return w.jsx("div", {
      ref: o,
      className: `transition-transform duration-300 ${e}`,
      onMouseMove: l,
      onMouseLeave: s,
      style: { transform: r },
      children: t,
    });
  },
  wa = ({ src: t, title: e, description: n, isComingSoon: r, icon: i }) => {
    const [o, l] = P.useState({ x: 0, y: 0 }),
      [s, a] = P.useState(0),
      u = P.useRef(null),
      c = P.useRef(null);
    fi(
      () => {
        if (c.current) {
          const v = c.current.querySelectorAll(".animate-in");
          re.fromTo(
            v,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out",
              delay: 0.2,
            }
          );
        }
      },
      { scope: c }
    );
    const f = (v) => {
        if (!u.current) return;
        const m = u.current.getBoundingClientRect();
        l({ x: v.clientX - m.left, y: v.clientY - m.top });
      },
      d = () => {
        re.to(u.current, { scale: 1.05, duration: 0.3, ease: "power1.out" }),
          a(1);
      },
      p = () => {
        re.to(u.current, { scale: 1, duration: 0.3, ease: "power1.out" }), a(0);
      };
    return w.jsxs("div", {
      id: "offerings",
      className: "relative size-full overflow-hidden rounded-xl group",
      children: [
        w.jsx("video", {
          src: t,
          loop: !0,
          muted: !0,
          autoPlay: !0,
          className:
            "absolute left-0 top-0 size-full object-cover object-center brightness-90 transition-transform duration-500 group-hover:scale-105",
        }),
        w.jsx("div", {
          className:
            "absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30",
        }),
        w.jsxs("div", {
          ref: c,
          className:
            "relative z-10 flex size-full flex-col justify-between p-6 text-white",
          children: [
            w.jsxs("div", {
              className: "flex items-center gap-3",
              children: [
                i &&
                  w.jsx(i, {
                    className: "text-yellow-400 text-2xl animate-in",
                  }),
                w.jsx("h1", {
                  className:
                    "bento-title font-bold text-2xl md:text-3xl tracking-wide animate-in",
                  children: e,
                }),
              ],
            }),
            n &&
              w.jsx("p", {
                className:
                  "mt-3 max-w-64 text-sm md:text-base text-gray-200 animate-in",
                children: n,
              }),
            r &&
              w.jsxs("div", {
                ref: u,
                onMouseMove: f,
                onMouseEnter: d,
                onMouseLeave: p,
                className:
                  "relative flex w-fit cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-yellow-500 px-5 py-2 text-xs uppercase text-black font-bold tracking-wider mt-4 animate-in shadow-lg shadow-yellow-500/20",
                children: [
                  w.jsx("div", {
                    className:
                      "pointer-events-none absolute -inset-px transition duration-300",
                    style: {
                      opacity: s,
                      background: `radial-gradient(100px circle at ${o.x}px ${o.y}px, #fbbf2488, #00000026)`,
                    },
                  }),
                  w.jsx(jp, { className: "relative z-20" }),
                  w.jsx("p", {
                    className: "relative z-20",
                    children: "join waitlist",
                  }),
                ],
              }),
          ],
        }),
      ],
    });
  },
  JS = () => {
    const t = P.useRef(null);
    return (
      fi(
        () => {
          re
            .timeline({
              scrollTrigger: {
                trigger: t.current,
                start: "top 80%",
                end: "top 30%",
                toggleActions: "play none none reverse",
              },
            })
            .from(".section-title", {
              opacity: 0,
              y: 30,
              duration: 0.8,
              ease: "power2.out",
            })
            .from(
              ".section-subtitle",
              { opacity: 0, y: 20, duration: 0.8, ease: "power2.out" },
              "-=0.6"
            )
            .from(
              ".section-description",
              { opacity: 0, y: 20, duration: 0.8, ease: "power2.out" },
              "-=0.6"
            ),
            re.fromTo(
              ".final-cta",
              { opacity: 0, scale: 0.95 },
              {
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: "back.out(1.7)",
                scrollTrigger: {
                  trigger: ".final-cta",
                  start: "top 70%",
                  toggleActions: "play none none reverse",
                },
              }
            );
        },
        { scope: t }
      ),
      w.jsx("section", {
        ref: t,
        className: "bg-gradient-to-b from-blue-950 to-black pb-32",
        children: w.jsxs("div", {
          className: "container mx-auto px-4 md:px-10",
          children: [
            w.jsxs("div", {
              className: "px-5 py-28",
              children: [
                w.jsx("p", {
                  className:
                    "section-subtitle text-sm uppercase tracking-widest text-yellow-400 mb-3",
                  children: "Premium Fitness Programs",
                }),
                w.jsxs("h2", {
                  className:
                    "section-title text-4xl md:text-5xl font-bold text-white mb-6",
                  children: [
                    "ELEVATE YOUR ",
                    w.jsx("span", {
                      className: "text-yellow-400",
                      children: "FITNESS",
                    }),
                    " JOURNEY",
                  ],
                }),
                w.jsx("p", {
                  className:
                    "section-description max-w-2xl text-lg text-gray-300 opacity-90",
                  children:
                    "Take your training to the next level with our specialized fitness programs designed to transform your body, strengthen your mind, and connect you with world-class trainers and a supportive community.",
                }),
              ],
            }),
            w.jsx(ho, {
              index: 0,
              className:
                "relative mb-7 h-96 w-full overflow-hidden rounded-xl border border-gray-800 md:h-[65vh]",
              children: w.jsx(wa, {
                src: "videos/feature-1.mp4",
                title: w.jsxs(w.Fragment, {
                  children: ["ELITE", w.jsx("b", { children: "STRENGTH" })],
                }),
                description:
                  "Our signature strength training program combines scientific principles with personalized coaching to help you build muscle, increase power, and transform your physique.",
                isComingSoon: !0,
                icon: XS,
              }),
            }),
            w.jsxs("div", {
              className: "grid h-auto w-full grid-cols-1 md:grid-cols-2 gap-7",
              children: [
                w.jsx(ho, {
                  index: 1,
                  className:
                    "h-80 md:h-96 overflow-hidden rounded-xl border border-gray-800 hover:shadow-xl hover:shadow-blue-900/10 transition-shadow duration-300",
                  children: w.jsx(wa, {
                    src: "videos/feature-2.mp4",
                    title: w.jsxs(w.Fragment, {
                      children: ["MASTER", w.jsx("b", { children: "CLASS" })],
                    }),
                    description:
                      "Train with our elite team of world-class fitness instructors through immersive virtual sessions.",
                    isComingSoon: !0,
                    icon: KS,
                  }),
                }),
                w.jsx(ho, {
                  index: 2,
                  className:
                    "h-80 md:h-96 overflow-hidden rounded-xl border border-gray-800 hover:shadow-xl hover:shadow-blue-900/10 transition-shadow duration-300",
                  children: w.jsx(wa, {
                    src: "videos/feature-3.mp4",
                    title: w.jsxs(w.Fragment, {
                      children: ["CARDIO", w.jsx("b", { children: "CORE" })],
                    }),
                    description:
                      "A high-intensity cardio program designed to burn fat, improve endurance, and strengthen your core for peak performance.",
                    isComingSoon: !0,
                    icon: QS,
                  }),
                }),
                w.jsx(ho, {
                  index: 3,
                  className:
                    "h-80 md:h-96 overflow-hidden rounded-xl border border-gray-800 hover:shadow-xl hover:shadow-blue-900/10 transition-shadow duration-300",
                  children: w.jsx(wa, {
                    src: "videos/feature-4.mp4",
                    title: w.jsxs(w.Fragment, {
                      children: ["FLEX", w.jsx("b", { children: "MOBILITY" })],
                    }),
                    description:
                      "Enhance your flexibility, recover faster, and prevent injuries with our comprehensive mobility program.",
                    isComingSoon: !0,
                    icon: qS,
                  }),
                }),
                w.jsx(ho, {
                  index: 4,
                  className:
                    "h-80 md:h-96 overflow-hidden rounded-xl border border-gray-800 hover:shadow-xl hover:shadow-yellow-500/10 transition-shadow duration-300",
                  children: w.jsxs("div", {
                    className:
                      "flex size-full flex-col justify-between bg-gradient-to-br from-yellow-500 to-yellow-600 p-6",
                    children: [
                      w.jsxs("div", {
                        children: [
                          w.jsxs("h1", {
                            className:
                              "bento-title font-bold text-2xl md:text-3xl text-black max-w-64 animate-in",
                            children: [
                              "NUTRI",
                              w.jsx("b", { children: "PLAN" }),
                            ],
                          }),
                          w.jsx("p", {
                            className:
                              "mt-3 text-sm md:text-base text-black/80 animate-in",
                            children:
                              "Personalized nutrition plans designed to complement your fitness goals and maximize your results.",
                          }),
                        ],
                      }),
                      w.jsxs("div", {
                        className: "flex justify-between items-end",
                        children: [
                          w.jsxs("div", {
                            className:
                              "flex w-fit cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-black px-5 py-2 text-xs uppercase text-yellow-400 font-bold tracking-wider mt-4 animate-in hover:scale-105 transition-transform duration-300",
                            children: [
                              w.jsx(YS, {}),
                              w.jsx("p", { children: "coming soon" }),
                            ],
                          }),
                          w.jsx(GS, {
                            className: "text-4xl text-black/80 animate-in",
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
                w.jsxs(ho, {
                  index: 5,
                  className:
                    "final-cta col-span-1 md:col-span-2 h-72 overflow-hidden rounded-xl border border-gray-800 hover:shadow-xl hover:shadow-blue-900/10 transition-shadow duration-300",
                  children: [
                    w.jsx("video", {
                      src: "videos/feature-5.mp4",
                      loop: !0,
                      muted: !0,
                      autoPlay: !0,
                      className: "size-full object-cover object-center",
                    }),
                    w.jsx("div", {
                      className:
                        "absolute inset-0 bg-black/30 flex items-center justify-center",
                      children: w.jsxs("div", {
                        className: "text-center",
                        children: [
                          w.jsxs("h2", {
                            className:
                              "text-4xl md:text-5xl font-bold text-white mb-4 animate-in",
                            children: [
                              "UNLOCK YOUR ",
                              w.jsx("span", {
                                className: "text-yellow-400",
                                children: "POTENTIAL",
                              }),
                            ],
                          }),
                          w.jsx("button", {
                            className:
                              "bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-10 rounded-full uppercase tracking-wider transition transform hover:-translate-y-1 hover:shadow-lg animate-in",
                            children: "Join Today",
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      })
    );
  },
  ZS = () => {
    const t = P.useRef(null),
      e = (r) => {
        const { clientX: i, clientY: o } = r,
          l = t.current;
        if (!l) return;
        const s = l.getBoundingClientRect(),
          a = i - s.left,
          u = o - s.top,
          c = s.width / 2,
          f = s.height / 2,
          d = ((u - f) / f) * -10,
          p = ((a - c) / c) * 10;
        re.to(l, {
          duration: 0.3,
          rotateX: d,
          rotateY: p,
          transformPerspective: 500,
          ease: "power1.inOut",
        });
      },
      n = () => {
        const r = t.current;
        r &&
          re.to(r, {
            duration: 0.3,
            rotateX: 0,
            rotateY: 0,
            ease: "power1.inOut",
          });
      };
    return w.jsx("div", {
      id: "story",
      className:
        "min-h-dvh w-screen bg-gradient-to-b from-black via-gray-900 to-black text-blue-50",
      children: w.jsxs("div", {
        className: "flex size-full flex-col items-center py-10 pb-24",
        children: [
          w.jsx("p", {
            className:
              "font-general text-sm uppercase tracking-widest md:text-[10px]",
            children: "The Multiversal IP World",
          }),
          w.jsxs("div", {
            className: "relative size-full",
            children: [
              w.jsx(Dp, {
                title: "The St<b>o</b>ry to <br /> a Healthy Li<b>fe</b>",
                containerClass:
                  "mt-5 pointer-events-none mix-blend-difference relative z-10 text-center",
              }),
              w.jsx("div", {
                className: "story-img-container relative",
                children: w.jsx("div", {
                  className: "story-img-mask",
                  children: w.jsx("div", {
                    className: "story-img-content",
                    children: w.jsx("img", {
                      ref: t,
                      onMouseMove: e,
                      onMouseLeave: n,
                      onMouseUp: n,
                      onMouseEnter: n,
                      src: "/img/entrance.webp",
                      alt: "Entrance to a Healthy Life",
                      className:
                        "object-contain rounded-lg shadow-lg transition-transform duration-300 ease-in-out",
                    }),
                  }),
                }),
              }),
              w.jsx("svg", {
                className: "invisible absolute size-0",
                xmlns: "http://www.w3.org/2000/svg",
                children: w.jsx("defs", {
                  children: w.jsxs("filter", {
                    id: "flt_tag",
                    children: [
                      w.jsx("feGaussianBlur", {
                        in: "SourceGraphic",
                        stdDeviation: "8",
                        result: "blur",
                      }),
                      w.jsx("feColorMatrix", {
                        in: "blur",
                        mode: "matrix",
                        values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9",
                        result: "flt_tag",
                      }),
                      w.jsx("feComposite", {
                        in: "SourceGraphic",
                        in2: "flt_tag",
                        operator: "atop",
                      }),
                    ],
                  }),
                }),
              }),
            ],
          }),
          w.jsx("div", {
            className:
              "-mt-80 flex w-full justify-center md:-mt-64 md:me-44 md:justify-end",
            children: w.jsxs("div", {
              className:
                "flex h-full w-fit flex-col items-center md:items-start",
              children: [
                w.jsx("p", {
                  className:
                    "absolute bottom-20 right-22 text-white text-4xl font-bold bg-black bg-opacity-75 px-4 py-2 rounded-lg shadow-md transform translate-x-1/2",
                  children: "#Kinjal Patel",
                }),
                w.jsx("p", {
                  className:
                    "mt-3 max-w-sm text-center font-circular-web text-violet-50 md:text-start leading-relaxed",
                  children:
                    "Discover your inner strength and embark on a transformative journey toward becoming healthier, stronger, and more confident with every step you take.",
                }),
                w.jsx(bs, {
                  label: "Start Your Journey",
                  onClick: () => console.log("Button Clicked"),
                  className:
                    "mt-5 bg-violet-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-violet-700 transition-all",
                }),
              ],
            }),
          }),
        ],
      }),
    });
  },
  Vc = ({ src: t, clipClass: e }) =>
    w.jsx("div", { className: e, children: w.jsx("img", { src: t }) }),
  ek = () =>
    w.jsx("div", {
      id: "contact",
      className: "my-20 min-h-96 w-screen  px-10",
      children: w.jsxs("div", {
        className:
          "relative rounded-lg bg-black py-24 text-blue-50 sm:overflow-hidden",
        children: [
          w.jsxs("div", {
            className:
              "absolute -left-20 top-0 hidden h-full w-72 overflow-hidden sm:block lg:left-20 lg:w-96",
            children: [
              w.jsx(Vc, {
                src: "/img/contact-1.webp",
                clipClass: "contact-clip-path-1",
              }),
              w.jsx(Vc, {
                src: "/img/contact-2.webp",
                clipClass:
                  "contact-clip-path-2 lg:translate-y-40 translate-y-60",
              }),
            ],
          }),
          w.jsx("div", {
            className:
              "absolute -top-40 left-20 w-60 sm:top-1/2 md:left-auto md:right-10 lg:top-20 lg:w-80",
            children: w.jsx(Vc, {
              src: "/img/swordman.webp",
              clipClass: "sword-man-clip-path md:scale-125",
            }),
          }),
          w.jsxs("div", {
            className: "flex flex-col items-center text-center",
            children: [
              w.jsx("p", {
                className: "mb-10 font-general text-[10px] uppercase",
                children: "Join FitnessPro Community",
              }),
              w.jsx(Dp, {
                title:
                  "let's b<b>u</b>ild the <br /> new era of <br /> F<b>i</b>TNESS T<b>o</b>gether.",
                className:
                  "special-font !md:text-[6.2rem] w-full font-zentry !text-5xl !font-black !leading-[.9]",
              }),
              w.jsx(bs, {
                title: "contact us",
                containerClass: "mt-10 cursor-pointer",
              }),
            ],
          }),
        ],
      }),
    }),
  tk = () =>
    w.jsxs(w.Fragment, {
      children: [
        w.jsx(AS, {}),
        w.jsx(NS, {}),
        w.jsx(JS, {}),
        w.jsx(ZS, {}),
        w.jsx(ek, {}),
      ],
    }),
  nk = () =>
    w.jsxs("main", {
      className: "relative min-h-screen w-screen overflow-x-hidden",
      children: [
        w.jsx(WS, {}),
        w.jsx(gw, {
          children: w.jsx(uv, { path: "/", element: w.jsx(tk, {}) }),
        }),
      ],
    });
Kg(document.getElementById("root")).render(
  w.jsx(P.StrictMode, { children: w.jsx(bw, { children: w.jsx(nk, {}) }) })
);
document.getElementById("product-button").onclick=window.location.href=`{window.location.protocol}//${window.location.hostname}:3001`