(() => {
  "use strict";
  var e = {
      706: (e) => {
        var t,
          r = (function () {
            function e(e, t) {
              if ("function" != typeof e)
                throw new TypeError(
                  "DataLoader must be constructed with a function which accepts Array<key> and returns Promise<Array<value>>, but got: " +
                    e +
                    "."
                );
              (this._batchLoadFn = e),
                (this._maxBatchSize = (function (e) {
                  if (!(!e || !1 !== e.batch)) return 1;
                  var t = e && e.maxBatchSize;
                  if (void 0 === t) return 1 / 0;
                  if ("number" != typeof t || t < 1)
                    throw new TypeError(
                      "maxBatchSize must be a positive number: " + t
                    );
                  return t;
                })(t)),
                (this._batchScheduleFn = (function (e) {
                  var t = e && e.batchScheduleFn;
                  if (void 0 === t) return a;
                  if ("function" != typeof t)
                    throw new TypeError(
                      "batchScheduleFn must be a function: " + t
                    );
                  return t;
                })(t)),
                (this._cacheKeyFn = (function (e) {
                  var t = e && e.cacheKeyFn;
                  if (void 0 === t)
                    return function (e) {
                      return e;
                    };
                  if ("function" != typeof t)
                    throw new TypeError("cacheKeyFn must be a function: " + t);
                  return t;
                })(t)),
                (this._cacheMap = (function (e) {
                  if (!(!e || !1 !== e.cache)) return null;
                  var t = e && e.cacheMap;
                  if (void 0 === t) return new Map();
                  if (null !== t) {
                    var r = ["get", "set", "delete", "clear"].filter(function (
                      e
                    ) {
                      return t && "function" != typeof t[e];
                    });
                    if (0 !== r.length)
                      throw new TypeError(
                        "Custom cacheMap missing methods: " + r.join(", ")
                      );
                  }
                  return t;
                })(t)),
                (this._batch = null);
            }
            var t = e.prototype;
            return (
              (t.load = function (e) {
                if (null == e)
                  throw new TypeError(
                    "The loader.load() function must be called with a value, but got: " +
                      String(e) +
                      "."
                  );
                var t = (function (e) {
                    var t = e._batch;
                    if (
                      null !== t &&
                      !t.hasDispatched &&
                      t.keys.length < e._maxBatchSize &&
                      (!t.cacheHits || t.cacheHits.length < e._maxBatchSize)
                    )
                      return t;
                    var r = { hasDispatched: !1, keys: [], callbacks: [] };
                    return (
                      (e._batch = r),
                      e._batchScheduleFn(function () {
                        !(function (e, t) {
                          if (((t.hasDispatched = !0), 0 !== t.keys.length)) {
                            var r = e._batchLoadFn(t.keys);
                            if (!r || "function" != typeof r.then)
                              return s(
                                e,
                                t,
                                new TypeError(
                                  "DataLoader must be constructed with a function which accepts Array<key> and returns Promise<Array<value>>, but the function did not return a Promise: " +
                                    String(r) +
                                    "."
                                )
                              );
                            r.then(function (e) {
                              if (!n(e))
                                throw new TypeError(
                                  "DataLoader must be constructed with a function which accepts Array<key> and returns Promise<Array<value>>, but the function did not return a Promise of an Array: " +
                                    String(e) +
                                    "."
                                );
                              if (e.length !== t.keys.length)
                                throw new TypeError(
                                  "DataLoader must be constructed with a function which accepts Array<key> and returns Promise<Array<value>>, but the function did not return a Promise of an Array of the same length as the Array of keys.\n\nKeys:\n" +
                                    String(t.keys) +
                                    "\n\nValues:\n" +
                                    String(e)
                                );
                              i(t);
                              for (var r = 0; r < t.callbacks.length; r++) {
                                var a = e[r];
                                a instanceof Error
                                  ? t.callbacks[r].reject(a)
                                  : t.callbacks[r].resolve(a);
                              }
                            }).catch(function (r) {
                              s(e, t, r);
                            });
                          } else i(t);
                        })(e, r);
                      }),
                      r
                    );
                  })(this),
                  r = this._cacheMap,
                  a = this._cacheKeyFn(e);
                if (r) {
                  var o = r.get(a);
                  if (o) {
                    var c = t.cacheHits || (t.cacheHits = []);
                    return new Promise(function (e) {
                      c.push(function () {
                        e(o);
                      });
                    });
                  }
                }
                t.keys.push(e);
                var l = new Promise(function (e, r) {
                  t.callbacks.push({ resolve: e, reject: r });
                });
                return r && r.set(a, l), l;
              }),
              (t.loadMany = function (e) {
                if (!n(e))
                  throw new TypeError(
                    "The loader.loadMany() function must be called with Array<key> but got: " +
                      e +
                      "."
                  );
                for (var t = [], r = 0; r < e.length; r++)
                  t.push(
                    this.load(e[r]).catch(function (e) {
                      return e;
                    })
                  );
                return Promise.all(t);
              }),
              (t.clear = function (e) {
                var t = this._cacheMap;
                if (t) {
                  var r = this._cacheKeyFn(e);
                  t.delete(r);
                }
                return this;
              }),
              (t.clearAll = function () {
                var e = this._cacheMap;
                return e && e.clear(), this;
              }),
              (t.prime = function (e, t) {
                var r = this._cacheMap;
                if (r) {
                  var a,
                    s = this._cacheKeyFn(e);
                  void 0 === r.get(s) &&
                    (t instanceof Error
                      ? (a = Promise.reject(t)).catch(function () {})
                      : (a = Promise.resolve(t)),
                    r.set(s, a));
                }
                return this;
              }),
              e
            );
          })(),
          a =
            "object" == typeof process && "function" == typeof process.nextTick
              ? function (e) {
                  t || (t = Promise.resolve()),
                    t.then(function () {
                      process.nextTick(e);
                    });
                }
              : "function" == typeof setImmediate
              ? function (e) {
                  setImmediate(e);
                }
              : function (e) {
                  setTimeout(e);
                };
        function s(e, t, r) {
          i(t);
          for (var a = 0; a < t.keys.length; a++)
            e.clear(t.keys[a]), t.callbacks[a].reject(r);
        }
        function i(e) {
          if (e.cacheHits)
            for (var t = 0; t < e.cacheHits.length; t++) e.cacheHits[t]();
        }
        function n(e) {
          return (
            "object" == typeof e &&
            null !== e &&
            "number" == typeof e.length &&
            (0 === e.length ||
              (e.length > 0 &&
                Object.prototype.hasOwnProperty.call(e, e.length - 1)))
          );
        }
        e.exports = r;
      },
    },
    t = {};
  function r(a) {
    var s = t[a];
    if (void 0 !== s) return s.exports;
    var i = (t[a] = { exports: {} });
    return e[a](i, i.exports, r), i.exports;
  }
  (r.n = (e) => {
    var t = e && e.__esModule ? () => e.default : () => e;
    return r.d(t, { a: t }), t;
  }),
    (r.d = (e, t) => {
      for (var a in t)
        r.o(t, a) &&
          !r.o(e, a) &&
          Object.defineProperty(e, a, { enumerable: !0, get: t[a] });
    }),
    (r.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
    (r.r = (e) => {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    });
  var a = {};
  (() => {
    r.r(a),
      r.d(a, {
        API_BLOCK_NAMESPACE: () => C,
        CART_STORE_KEY: () => Wt,
        CHECKOUT_STORE_KEY: () => Ca,
        COLLECTIONS_STORE_KEY: () => Xa,
        EMPTY_CART_COUPONS: () => I,
        EMPTY_CART_CROSS_SELLS: () => O,
        EMPTY_CART_ERRORS: () => N,
        EMPTY_CART_FEES: () => M,
        EMPTY_CART_ITEMS: () => D,
        EMPTY_CART_ITEM_ERRORS: () => k,
        EMPTY_EXTENSIONS: () => U,
        EMPTY_PAYMENT_METHODS: () => L,
        EMPTY_PAYMENT_REQUIREMENTS: () => Y,
        EMPTY_SHIPPING_RATES: () => x,
        EMPTY_TAX_LINES: () => j,
        PAYMENT_STORE_KEY: () => ti,
        QUERY_STATE_STORE_KEY: () => ui,
        SCHEMA_STORE_KEY: () => fi,
        STORE_NOTICES_STORE_KEY: () => Ii,
        VALIDATION_STORE_KEY: () => Ki,
        getErrorDetails: () => Nt,
        hasInState: () => Ma,
        processErrorResponse: () => Yt,
        updateState: () => za,
      });
    var e = {};
    r.r(e),
      r.d(e, {
        getCartData: () => B,
        getCartErrors: () => Q,
        getCartItem: () => re,
        getCartMeta: () => X,
        getCartTotals: () => K,
        getCouponBeingApplied: () => J,
        getCouponBeingRemoved: () => te,
        getCustomerData: () => F,
        getHasCalculatedShipping: () => z,
        getItemsPendingDelete: () => ce,
        getItemsPendingQuantityUpdate: () => oe,
        getNeedsShipping: () => G,
        getShippingRates: () => $,
        isApplyingCoupon: () => W,
        isCartDataStale: () => Z,
        isCustomerDataUpdating: () => ie,
        isItemPendingDelete: () => se,
        isItemPendingQuantity: () => ae,
        isRemovingCoupon: () => ee,
        isShippingRateBeingSelected: () => ne,
      });
    var t = {};
    r.r(t),
      r.d(t, {
        addItemToCart: () => pt,
        applyCoupon: () => dt,
        applyExtensionCartUpdate: () => lt,
        changeCartItemQuantity: () => mt,
        itemIsPendingDelete: () => it,
        itemIsPendingQuantity: () => st,
        receiveApplyingCoupon: () => tt,
        receiveCart: () => Qe,
        receiveCartContents: () => et,
        receiveCartItem: () => at,
        receiveError: () => We,
        receiveRemovingCoupon: () => rt,
        removeCoupon: () => ut,
        removeItemFromCart: () => _t,
        selectShippingRate: () => ht,
        setBillingAddress: () => yt,
        setCartData: () => Ze,
        setErrorData: () => Je,
        setIsCartDataStale: () => nt,
        setShippingAddress: () => Et,
        shippingRatesBeingSelected: () => ct,
        updateCustomerData: () => gt,
        updatingCustomerData: () => ot,
      });
    var s = {};
    r.r(s), r.d(s, { getCartData: () => St, getCartTotals: () => ft });
    var i = {};
    r.r(i),
      r.d(i, {
        getCheckoutStatus: () => Cr,
        getCustomerId: () => vr,
        getExtensionData: () => Rr,
        getOrderId: () => Tr,
        getOrderNotes: () => Ar,
        getRedirectUrl: () => Pr,
        getShouldCreateAccount: () => wr,
        getUseShippingAsBilling: () => br,
        hasError: () => Ir,
        hasOrder: () => Dr,
        isAfterProcessing: () => Nr,
        isBeforeProcessing: () => kr,
        isCalculating: () => Lr,
        isComplete: () => Or,
        isIdle: () => Mr,
        isProcessing: () => xr,
        prefersCollection: () => Yr,
      });
    var n = {};
    r.r(n),
      r.d(n, {
        __internalDecrementCalculating: () => _a,
        __internalEmitAfterProcessingEvents: () => sa,
        __internalEmitValidateEvent: () => aa,
        __internalIncrementCalculating: () => pa,
        __internalProcessCheckoutResponse: () => ra,
        __internalSetAfterProcessing: () => ca,
        __internalSetBeforeProcessing: () => na,
        __internalSetComplete: () => la,
        __internalSetCustomerId: () => ma,
        __internalSetExtensionData: () => Sa,
        __internalSetHasError: () => ua,
        __internalSetIdle: () => ia,
        __internalSetOrderNotes: () => Ea,
        __internalSetProcessing: () => oa,
        __internalSetRedirectUrl: () => da,
        __internalSetShouldCreateAccount: () => ya,
        __internalSetUseShippingAsBilling: () => ha,
        setPrefersCollection: () => ga,
      });
    var o = {};
    r.r(o),
      r.d(o, {
        getCollection: () => Na,
        getCollectionError: () => xa,
        getCollectionHeader: () => La,
        getCollectionLastModified: () => Ya,
      });
    var c = {};
    r.r(c),
      r.d(c, {
        receiveCollection: () => Ha,
        receiveCollectionError: () => Va,
        receiveLastModified: () => qa,
      });
    var l = {};
    r.r(l), r.d(l, { getCollection: () => Fa, getCollectionHeader: () => $a });
    var d = {};
    r.r(d),
      r.d(d, {
        __internalEmitPaymentProcessingEvent: () => us,
        __internalRemoveAvailableExpressPaymentMethod: () => Rs,
        __internalRemoveAvailablePaymentMethod: () => bs,
        __internalSetActivePaymentMethod: () => fs,
        __internalSetAvailableExpressPaymentMethods: () => Ps,
        __internalSetAvailablePaymentMethods: () => As,
        __internalSetExpressPaymentError: () => ds,
        __internalSetExpressPaymentMethodsInitialized: () => gs,
        __internalSetExpressPaymentStarted: () => _s,
        __internalSetPaymentError: () => hs,
        __internalSetPaymentIdle: () => ps,
        __internalSetPaymentMethodData: () => vs,
        __internalSetPaymentMethodsInitialized: () => Es,
        __internalSetPaymentProcessing: () => ms,
        __internalSetPaymentReady: () => ys,
        __internalSetPaymentResult: () => Ts,
        __internalSetShouldSavePaymentMethod: () => Ss,
        __internalUpdateAvailablePaymentMethods: () => ws,
      });
    var u = {};
    r.r(u),
      r.d(u, {
        expressPaymentMethodsInitialized: () => Ks,
        getActivePaymentMethod: () => Hs,
        getActiveSavedPaymentMethods: () => Gs,
        getActiveSavedToken: () => js,
        getAvailableExpressPaymentMethods: () => qs,
        getAvailablePaymentMethods: () => Vs,
        getCurrentStatus: () => Xs,
        getIncompatiblePaymentMethods: () => Fs,
        getPaymentMethodData: () => Bs,
        getPaymentResult: () => Ws,
        getSavedPaymentMethods: () => $s,
        getShouldSavePaymentMethod: () => Qs,
        getState: () => Zs,
        hasPaymentError: () => Ls,
        isExpressPaymentMethodActive: () => Us,
        isExpressPaymentStarted: () => Ms,
        isPaymentFailed: () => Ys,
        isPaymentIdle: () => Ds,
        isPaymentPristine: () => Is,
        isPaymentProcessing: () => ks,
        isPaymentReady: () => Ns,
        isPaymentStarted: () => Os,
        isPaymentSuccess: () => xs,
        paymentMethodsInitialized: () => zs,
      });
    var p = {};
    r.r(p),
      r.d(p, {
        getValueForQueryContext: () => ii,
        getValueForQueryKey: () => si,
      });
    var _ = {};
    r.r(_),
      r.d(_, { setQueryValue: () => ci, setValueForQueryContext: () => li });
    var m = {};
    r.r(m), r.d(m, { getRoute: () => pi, getRoutes: () => _i });
    var h = {};
    r.r(h), r.d(h, { receiveRoutes: () => hi });
    var y = {};
    r.r(y), r.d(y, { getRoute: () => yi, getRoutes: () => Ei });
    var E = {};
    r.r(E),
      r.d(E, { registerContainer: () => Ti, unregisterContainer: () => Ai });
    var g = {};
    r.r(g), r.d(g, { getRegisteredContainers: () => Pi });
    var S = {};
    r.r(S),
      r.d(S, {
        clearAllValidationErrors: () => Ui,
        clearValidationError: () => ji,
        clearValidationErrors: () => Yi,
        hideValidationError: () => Hi,
        setValidationErrors: () => Li,
        showAllValidationErrors: () => qi,
        showValidationError: () => Vi,
      });
    var f = {};
    r.r(f),
      r.d(f, {
        getValidationError: () => Bi,
        getValidationErrorId: () => Fi,
        hasValidationErrors: () => $i,
      });
    const v = window.wp.notices,
      T = window.wp.data,
      A = window.wp.dataControls,
      P = window.wp.i18n,
      b = "wc/store/cart",
      R = {
        code: "cart_api_error",
        message: (0, P.__)(
          "Unable to get cart data from the API.",
          "woocommerce"
        ),
        data: { status: 500 },
      },
      w = window.wc.wcSettings,
      C = "wc/blocks",
      I = [],
      D = [],
      O = [],
      M = [],
      k = [],
      N = [],
      x = [],
      L = [],
      Y = [],
      U = {},
      j = [],
      H = {};
    Object.keys(w.defaultFields).forEach((e) => {
      H[e] = "";
    }),
      delete H.email;
    const V = {};
    Object.keys(w.defaultFields).forEach((e) => {
      V[e] = "";
    });
    const q = {
        cartItemsPendingQuantity: [],
        cartItemsPendingDelete: [],
        cartData: {
          coupons: I,
          shippingRates: x,
          shippingAddress: H,
          billingAddress: V,
          items: D,
          itemsCount: 0,
          itemsWeight: 0,
          crossSells: O,
          needsShipping: !0,
          needsPayment: !1,
          hasCalculatedShipping: !0,
          fees: M,
          totals: {
            currency_code: "",
            currency_symbol: "",
            currency_minor_unit: 2,
            currency_decimal_separator: ".",
            currency_thousand_separator: ",",
            currency_prefix: "",
            currency_suffix: "",
            total_items: "0",
            total_items_tax: "0",
            total_fees: "0",
            total_fees_tax: "0",
            total_discount: "0",
            total_discount_tax: "0",
            total_shipping: "0",
            total_shipping_tax: "0",
            total_price: "0",
            total_tax: "0",
            tax_lines: j,
          },
          errors: k,
          paymentMethods: L,
          paymentRequirements: Y,
          extensions: U,
        },
        metaData: {
          updatingCustomerData: !1,
          updatingSelectedRate: !1,
          applyingCoupon: "",
          removingCoupon: "",
          isCartDataStale: !1,
        },
        errors: N,
      },
      B = (e) => e.cartData,
      F = (e) => ({
        shippingAddress: e.cartData.shippingAddress,
        billingAddress: e.cartData.billingAddress,
      }),
      $ = (e) => e.cartData.shippingRates,
      G = (e) => e.cartData.needsShipping,
      z = (e) => e.cartData.hasCalculatedShipping,
      K = (e) => e.cartData.totals || q.cartData.totals,
      X = (e) => e.metaData || q.metaData,
      Q = (e) => e.errors,
      W = (e) => !!e.metaData.applyingCoupon,
      Z = (e) => e.metaData.isCartDataStale,
      J = (e) => e.metaData.applyingCoupon || "",
      ee = (e) => !!e.metaData.removingCoupon,
      te = (e) => e.metaData.removingCoupon || "",
      re = (e, t) => e.cartData.items.find((e) => e.key === t),
      ae = (e, t) => e.cartItemsPendingQuantity.includes(t),
      se = (e, t) => e.cartItemsPendingDelete.includes(t),
      ie = (e) => !!e.metaData.updatingCustomerData,
      ne = (e) => !!e.metaData.updatingSelectedRate,
      oe = (e) => e.cartItemsPendingQuantity,
      ce = (e) => e.cartItemsPendingDelete;
    var le = function () {
      return (
        (le =
          Object.assign ||
          function (e) {
            for (var t, r = 1, a = arguments.length; r < a; r++)
              for (var s in (t = arguments[r]))
                Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
            return e;
          }),
        le.apply(this, arguments)
      );
    };
    function de(e) {
      return e.toLowerCase();
    }
    Object.create,
      Object.create,
      "function" == typeof SuppressedError && SuppressedError;
    var ue = [/([a-z0-9])([A-Z])/g, /([A-Z])([A-Z][a-z])/g],
      pe = /[^A-Z0-9]+/gi;
    function _e(e, t, r) {
      return t instanceof RegExp
        ? e.replace(t, r)
        : t.reduce(function (e, t) {
            return e.replace(t, r);
          }, e);
    }
    function me(e, t) {
      var r = e.charAt(0),
        a = e.substr(1).toLowerCase();
      return t > 0 && r >= "0" && r <= "9"
        ? "_" + r + a
        : "" + r.toUpperCase() + a;
    }
    function he(e, t) {
      return 0 === t ? e.toLowerCase() : me(e, t);
    }
    const ye = (e) =>
        ((e, t) =>
          Object.entries(e).reduce(
            (e, [r, a]) => ({ ...e, [t(0, r)]: a }),
            {}
          ))(e, (e, t) => {
          return (
            void 0 === r && (r = {}),
            (function (e, t) {
              return (
                void 0 === t && (t = {}),
                (function (e, t) {
                  void 0 === t && (t = {});
                  for (
                    var r = t.splitRegexp,
                      a = void 0 === r ? ue : r,
                      s = t.stripRegexp,
                      i = void 0 === s ? pe : s,
                      n = t.transform,
                      o = void 0 === n ? de : n,
                      c = t.delimiter,
                      l = void 0 === c ? " " : c,
                      d = _e(_e(e, a, "$1\0$2"), i, "\0"),
                      u = 0,
                      p = d.length;
                    "\0" === d.charAt(u);

                  )
                    u++;
                  for (; "\0" === d.charAt(p - 1); ) p--;
                  return d.slice(u, p).split("\0").map(o).join(l);
                })(e, le({ delimiter: "", transform: me }, t))
              );
            })(t, le({ transform: he }, r))
          );
          var r;
        }),
      Ee = window.CustomEvent || null,
      ge = (
        e,
        { bubbles: t = !1, cancelable: r = !1, element: a, detail: s = {} }
      ) => {
        if (!Ee) return;
        a || (a = document.body);
        const i = new Ee(e, { bubbles: t, cancelable: r, detail: s });
        a.dispatchEvent(i);
      },
      Se = "SET_CART_DATA",
      fe = "SET_ERROR_DATA",
      ve = "APPLYING_COUPON",
      Te = "REMOVING_COUPON",
      Ae = "RECEIVE_CART_ITEM",
      Pe = "ITEM_PENDING_QUANTITY",
      be = "SET_IS_CART_DATA_STALE",
      Re = "RECEIVE_REMOVED_ITEM",
      we = "UPDATING_CUSTOMER_DATA",
      Ce = "SET_BILLING_ADDRESS",
      Ie = "SET_SHIPPING_ADDRESS",
      De = "UPDATING_SELECTED_SHIPPING_RATE",
      Oe = window.wp.apiFetch;
    var Me = r.n(Oe),
      ke = r(706),
      Ne = r.n(ke);
    const xe = {},
      Le = {
        code: "invalid_json",
        message: (0, P.__)(
          "The response is not a valid JSON response.",
          "woocommerce"
        ),
      },
      Ye = (e) => {
        Me().setNonce && "function" == typeof Me().setNonce
          ? Me().setNonce(e)
          : console.error(
              'The monkey patched function on APIFetch, "setNonce", is not present, likely another plugin or some other code has removed this augmentation'
            );
      },
      Ue = new (Ne())(
        (e) =>
          Me()({
            path: "/wc/store/v1/batch",
            method: "POST",
            data: {
              requests: e.map((e) => ({
                ...e,
                body: null == e ? void 0 : e.data,
              })),
            },
          }).then(
            (t) => (
              (function (e) {
                if (
                  "object" != typeof e ||
                  null === e ||
                  !e.hasOwnProperty("responses")
                )
                  throw new Error("Response not valid");
              })(t),
              e.map((e, r) => t.responses[r] || xe)
            )
          ),
        {
          batchScheduleFn: (e) => setTimeout(e, 300),
          cache: !1,
          maxBatchSize: 25,
        }
      ),
      je = (e) => ({ type: "API_FETCH_WITH_HEADERS", options: e }),
      He = (e) =>
        new Promise((t, r) => {
          e.method && "GET" !== e.method
            ? (async (e) => await Ue.load(e))(e)
                .then((e) => {
                  throw (
                    ((function (e) {
                      if (
                        "object" != typeof e ||
                        null === e ||
                        !("body" in e) ||
                        !("headers" in e)
                      )
                        throw new Error("Response not valid");
                    })(e),
                    e.status >= 200 &&
                      e.status < 300 &&
                      (t({ response: e.body, headers: e.headers }),
                      Ye(e.headers)),
                    e)
                  );
                })
                .catch((e) => {
                  e.headers && Ye(e.headers), e.body ? r(e.body) : r(e);
                })
            : Me()({ ...e, parse: !1 })
                .then((e) => {
                  e.json()
                    .then((r) => {
                      t({ response: r, headers: e.headers }), Ye(e.headers);
                    })
                    .catch(() => {
                      r(Le);
                    });
                })
                .catch((e) => {
                  Ye(e.headers),
                    "function" == typeof e.json
                      ? e
                          .json()
                          .then((e) => {
                            r(e);
                          })
                          .catch(() => {
                            r(Le);
                          })
                      : r(e.message);
                });
        }),
      Ve = (e) => He(e),
      qe = { API_FETCH_WITH_HEADERS: ({ options: e }) => He(e) },
      Be = (e) =>
        !((e) => null === e)(e) &&
        e instanceof Object &&
        e.constructor === Object;
    function Fe(e, t) {
      return Be(e) && t in e;
    }
    const $e = (e) => Be(e) && Fe(e, "code") && Fe(e, "message"),
      Ge = (e) =>
        e.quantity >= e.quantity_limits.minimum &&
        e.quantity <= e.quantity_limits.maximum &&
        e.quantity % e.quantity_limits.multiple_of == 0,
      ze = (0, P.__)(
        "Something went wrong. Please contact us to get assistance.",
        "woocommerce"
      ),
      Ke = (e, t, r) => {
        const a = null == r ? void 0 : r.context;
        (0, T.select)("wc/store/payment").isExpressPaymentMethodActive() ||
          void 0 === a ||
          (0, T.dispatch)("core/notices").createNotice(e, t, {
            isDismissible: !0,
            ...r,
            context: a,
          });
      },
      Xe = window.wp.htmlEntities,
      Qe =
        (e) =>
        ({ dispatch: t, select: r }) => {
          const a = ye(e),
            s = r.getCartData();
          ((e = null, t = null) => {
            t &&
              t.forEach((e) => {
                (0, T.dispatch)("core/notices").removeNotice(e.code, "wc/cart");
              }),
              null !== e &&
                e.forEach((e) => {
                  $e(e) &&
                    Ke("error", (0, Xe.decodeEntities)(e.message), {
                      id: e.code,
                      context: "wc/cart",
                      isDismissible: !1,
                    });
                });
          })(a.errors, s.errors),
            (({
              oldCart: e,
              newCart: t,
              cartItemsPendingQuantity: r = [],
              cartItemsPendingDelete: a = [],
            }) => {
              (0, T.select)(b).hasFinishedResolution("getCartData") &&
                (((e, t, r) => {
                  e.items.forEach((e) => {
                    r.includes(e.key) ||
                      t.items.find((t) => t && t.key === e.key) ||
                      (0, T.dispatch)("core/notices").createInfoNotice(
                        (0, P.sprintf)(
                          /* translators: %s is the name of the item. */ /* translators: %s is the name of the item. */
                          (0, P.__)(
                            '"%s" was removed from your cart.',
                            "woocommerce"
                          ),
                          e.name
                        ),
                        {
                          context: "wc/cart",
                          speak: !0,
                          type: "snackbar",
                          id: `${e.key}-removed`,
                        }
                      );
                  });
                })(e, t, a),
                ((e, t) => {
                  t.items.forEach((t) => {
                    const r = e.items.find((e) => e && e.key === t.key),
                      a = 0 === e.items.length;
                    if (!r && !a) return;
                    if (Ge(t)) return;
                    const s = t.quantity > t.quantity_limits.maximum,
                      i = t.quantity < t.quantity_limits.minimum,
                      n = t.quantity % t.quantity_limits.multiple_of != 0;
                    (s || i || n) &&
                      (n
                        ? (0, T.dispatch)("core/notices").createInfoNotice(
                            (0, P.sprintf)(
                              /* translators: %1$s is the name of the item, %2$d is the quantity of the item. %3$d is a number that the quantity must be a multiple of. */ /* translators: %1$s is the name of the item, %2$d is the quantity of the item. %3$d is a number that the quantity must be a multiple of. */
                              (0, P.__)(
                                'The quantity of "%1$s" was changed to %2$d. You must purchase this product in groups of %3$d.',
                                "woocommerce"
                              ),
                              t.name,
                              Math.floor(
                                t.quantity / t.quantity_limits.multiple_of
                              ) * t.quantity_limits.multiple_of,
                              t.quantity_limits.multiple_of
                            ),
                            {
                              context: "wc/cart",
                              speak: !0,
                              type: "snackbar",
                              id: `${t.key}-quantity-update`,
                            }
                          )
                        : i
                        ? (0, T.dispatch)("core/notices").createInfoNotice(
                            (0, P.sprintf)(
                              /* translators: %1$s is the name of the item, %2$d is the quantity of the item. */ /* translators: %1$s is the name of the item, %2$d is the quantity of the item. */
                              (0, P.__)(
                                'The quantity of "%1$s" was increased to %2$d. This is the minimum required quantity.',
                                "woocommerce"
                              ),
                              t.name,
                              t.quantity_limits.minimum
                            ),
                            {
                              context: "wc/cart",
                              speak: !0,
                              type: "snackbar",
                              id: `${t.key}-quantity-update`,
                            }
                          )
                        : (0, T.dispatch)("core/notices").createInfoNotice(
                            (0, P.sprintf)(
                              /* translators: %1$s is the name of the item, %2$d is the quantity of the item. */ /* translators: %1$s is the name of the item, %2$d is the quantity of the item. */
                              (0, P.__)(
                                'The quantity of "%1$s" was decreased to %2$d. This is the maximum allowed quantity.',
                                "woocommerce"
                              ),
                              t.name,
                              t.quantity_limits.maximum
                            ),
                            {
                              context: "wc/cart",
                              speak: !0,
                              type: "snackbar",
                              id: `${t.key}-quantity-update`,
                            }
                          ));
                  });
                })(e, t),
                ((e, t, r) => {
                  t.items.forEach((t) => {
                    if (r.includes(t.key)) return;
                    const a = e.items.find((e) => e && e.key === t.key);
                    return a && t.key === a.key
                      ? (t.quantity !== a.quantity &&
                          Ge(t) &&
                          (0, T.dispatch)("core/notices").createInfoNotice(
                            (0, P.sprintf)(
                              /* translators: %1$s is the name of the item, %2$d is the quantity of the item. */ /* translators: %1$s is the name of the item, %2$d is the quantity of the item. */
                              (0, P.__)(
                                'The quantity of "%1$s" was changed to %2$d.',
                                "woocommerce"
                              ),
                              t.name,
                              t.quantity
                            ),
                            {
                              context: "wc/cart",
                              speak: !0,
                              type: "snackbar",
                              id: `${t.key}-quantity-update`,
                            }
                          ),
                        t)
                      : void 0;
                  });
                })(e, t, r));
            })({
              oldCart: s,
              newCart: a,
              cartItemsPendingQuantity: r.getItemsPendingQuantityUpdate(),
              cartItemsPendingDelete: r.getItemsPendingDelete(),
            }),
            t.setCartData(a);
        },
      We =
        (e = null) =>
        ({ dispatch: t }) => {
          var r, a;
          $e(e) &&
            (t.setErrorData(e),
            null !== (r = e.data) &&
              void 0 !== r &&
              r.cart &&
              t.receiveCart(
                null == e || null === (a = e.data) || void 0 === a
                  ? void 0
                  : a.cart
              ));
        },
      Ze = (e) => ({ type: Se, response: e }),
      Je = (e) => ({ type: fe, error: e }),
      et = (e) => {
        const t = ye(e),
          { shippingAddress: r, billingAddress: a, ...s } = t;
        return { type: Se, response: s };
      },
      tt = (e) => ({ type: ve, couponCode: e }),
      rt = (e) => ({ type: Te, couponCode: e }),
      at = (e = null) => ({ type: Ae, cartItem: e }),
      st = (e, t = !0) => ({ type: Pe, cartItemKey: e, isPendingQuantity: t }),
      it = (e, t = !0) => ({ type: Re, cartItemKey: e, isPendingDelete: t }),
      nt = (e = !0) => ({ type: be, isCartDataStale: e }),
      ot = (e) => ({ type: we, isResolving: e }),
      ct = (e) => ({ type: De, isResolving: e }),
      lt =
        (e) =>
        async ({ dispatch: t }) => {
          try {
            const { response: r } = await Ve({
              path: "/wc/store/v1/cart/extensions",
              method: "POST",
              data: { namespace: e.namespace, data: e.data },
              cache: "no-store",
            });
            return t.receiveCart(r), r;
          } catch (e) {
            return t.receiveError(e), Promise.reject(e);
          }
        },
      dt =
        (e) =>
        async ({ dispatch: t }) => {
          try {
            t.receiveApplyingCoupon(e);
            const { response: r } = await Ve({
              path: "/wc/store/v1/cart/apply-coupon",
              method: "POST",
              data: { code: e },
              cache: "no-store",
            });
            return t.receiveCart(r), r;
          } catch (e) {
            return t.receiveError(e), Promise.reject(e);
          } finally {
            t.receiveApplyingCoupon("");
          }
        },
      ut =
        (e) =>
        async ({ dispatch: t }) => {
          try {
            t.receiveRemovingCoupon(e);
            const { response: r } = await Ve({
              path: "/wc/store/v1/cart/remove-coupon",
              method: "POST",
              data: { code: e },
              cache: "no-store",
            });
            return t.receiveCart(r), r;
          } catch (e) {
            return t.receiveError(e), Promise.reject(e);
          } finally {
            t.receiveRemovingCoupon("");
          }
        },
      pt =
        (e, t = 1) =>
        async ({ dispatch: r }) => {
          try {
            ge("wc-blocks_adding_to_cart", { bubbles: !0, cancelable: !0 });
            const { response: a } = await Ve({
              path: "/wc/store/v1/cart/add-item",
              method: "POST",
              data: { id: e, quantity: t },
              cache: "no-store",
            });
            return (
              r.receiveCart(a),
              (({ preserveCartData: e = !1 }) => {
                ge("wc-blocks_added_to_cart", {
                  bubbles: !0,
                  cancelable: !0,
                  detail: { preserveCartData: e },
                });
              })({ preserveCartData: !0 }),
              a
            );
          } catch (e) {
            return r.receiveError(e), Promise.reject(e);
          }
        },
      _t =
        (e) =>
        async ({ dispatch: t }) => {
          try {
            t.itemIsPendingDelete(e);
            const { response: r } = await Ve({
              path: "/wc/store/v1/cart/remove-item",
              data: { key: e },
              method: "POST",
              cache: "no-store",
            });
            return t.receiveCart(r), r;
          } catch (e) {
            return t.receiveError(e), Promise.reject(e);
          } finally {
            t.itemIsPendingDelete(e, !1);
          }
        },
      mt =
        (e, t) =>
        async ({ dispatch: r, select: a }) => {
          const s = a.getCartItem(e);
          if ((null == s ? void 0 : s.quantity) !== t)
            try {
              r.itemIsPendingQuantity(e);
              const { response: a } = await Ve({
                path: "/wc/store/v1/cart/update-item",
                method: "POST",
                data: { key: e, quantity: t },
                cache: "no-store",
              });
              return r.receiveCart(a), a;
            } catch (e) {
              return r.receiveError(e), Promise.reject(e);
            } finally {
              r.itemIsPendingQuantity(e, !1);
            }
        },
      ht =
        (e, t = null) =>
        async ({ dispatch: r, select: a }) => {
          var s;
          const i =
            null ===
              (s = a.getShippingRates().find((e) => e.package_id === t)) ||
            void 0 === s
              ? void 0
              : s.shipping_rates.find((e) => !0 === e.selected);
          if ((null == i ? void 0 : i.rate_id) !== e)
            try {
              r.shippingRatesBeingSelected(!0);
              const { response: a } = await Ve({
                  path: "/wc/store/v1/cart/select-shipping-rate",
                  method: "POST",
                  data: { package_id: t, rate_id: e },
                  cache: "no-store",
                }),
                { shipping_address: s, billing_address: i, ...n } = a;
              return r.receiveCart(n), a;
            } catch (e) {
              return r.receiveError(e), Promise.reject(e);
            } finally {
              r.shippingRatesBeingSelected(!1);
            }
        },
      yt = (e) => ({ type: Ce, billingAddress: e }),
      Et = (e) => ({ type: Ie, shippingAddress: e }),
      gt =
        (e, t = !0) =>
        async ({ dispatch: r }) => {
          try {
            r.updatingCustomerData(!0);
            const { response: a } = await Ve({
              path: "/wc/store/v1/cart/update-customer",
              method: "POST",
              data: e,
              cache: "no-store",
            });
            return t ? r.receiveCartContents(a) : r.receiveCart(a), a;
          } catch (e) {
            return r.receiveError(e), Promise.reject(e);
          } finally {
            r.updatingCustomerData(!1);
          }
        },
      St =
        () =>
        async ({ dispatch: e }) => {
          const t = await Me()({
              path: "/wc/store/v1/cart",
              method: "GET",
              cache: "no-store",
            }),
            { receiveCart: r, receiveError: a } = e;
          t ? r(t) : a(R);
        },
      ft =
        () =>
        async ({ resolveSelect: e }) => {
          await e.getCartData();
        },
      vt = (e = [], t) =>
        t.type === Ae
          ? e.map((e) => {
              var r;
              return e.key ===
                (null === (r = t.cartItem) || void 0 === r ? void 0 : r.key)
                ? t.cartItem
                : e;
            })
          : e,
      Tt = (e, t) =>
        t.reduce((t, r) => (e && e.hasOwnProperty(r) && (t[r] = e[r]), t), {}),
      At = (e, t, r) => {
        let a,
          s = null;
        const i = (...i) => {
          (s = i),
            a && clearTimeout(a),
            (a = setTimeout(() => {
              (a = null), !r && s && e(...s);
            }, t)),
            r && !a && e(...i);
        };
        return (
          (i.flush = () => {
            a && s && (e(...s), clearTimeout(a), (a = null));
          }),
          i
        );
      },
      Pt = window.wp.isShallowEqual;
    var bt = r.n(Pt);
    const Rt = (e, t) =>
      e[t]
        ? Array.from(e[t].values()).sort((e, t) => e.priority - t.priority)
        : [];
    let wt = (function (e) {
        return (
          (e.SUCCESS = "success"), (e.FAIL = "failure"), (e.ERROR = "error"), e
        );
      })({}),
      Ct = (function (e) {
        return (
          (e.CART = "wc/cart"),
          (e.CHECKOUT = "wc/checkout"),
          (e.PAYMENTS = "wc/checkout/payments"),
          (e.EXPRESS_PAYMENTS = "wc/checkout/express-payments"),
          (e.CONTACT_INFORMATION = "wc/checkout/contact-information"),
          (e.SHIPPING_ADDRESS = "wc/checkout/shipping-address"),
          (e.BILLING_ADDRESS = "wc/checkout/billing-address"),
          (e.SHIPPING_METHODS = "wc/checkout/shipping-methods"),
          (e.CHECKOUT_ACTIONS = "wc/checkout/checkout-actions"),
          e
        );
      })({});
    const It = (e, t) => Be(e) && "type" in e && e.type === t,
      Dt = (e) => It(e, wt.SUCCESS),
      Ot = (e) => It(e, wt.ERROR),
      Mt = (e) => It(e, wt.FAIL),
      kt = (e) => !Be(e) || void 0 === e.retry || !0 === e.retry,
      Nt = (e) => {
        const t = Fe(e.data, "details") ? Object.entries(e.data.details) : null;
        return t
          ? t.reduce(
              (e, [t, { code: r, message: a, additional_errors: s = [] }]) => [
                ...e,
                {
                  param: t,
                  id: `${t}_${r}`,
                  code: r,
                  message: (0, Xe.decodeEntities)(a),
                },
                ...(Array.isArray(s)
                  ? s.flatMap((e) =>
                      Fe(e, "code") && Fe(e, "message")
                        ? [
                            {
                              param: t,
                              id: `${t}_${e.code}`,
                              code: e.code,
                              message: (0, Xe.decodeEntities)(e.message),
                            },
                          ]
                        : []
                    )
                  : []),
              ],
              []
            )
          : [];
      },
      xt = (e) => {
        switch (e) {
          case "woocommerce_rest_missing_email_address":
          case "woocommerce_rest_invalid_email_address":
            return Ct.CONTACT_INFORMATION;
          default:
            return Ct.CART;
        }
      },
      Lt = (e) => {
        switch (e) {
          case "invalid_email":
            return Ct.CONTACT_INFORMATION;
          case "billing_address":
            return Ct.BILLING_ADDRESS;
          case "shipping_address":
            return Ct.SHIPPING_ADDRESS;
          default:
            return;
        }
      },
      Yt = (e, t) => {
        if (!$e(e)) return;
        if ("rest_invalid_param" === e.code)
          return ((e, t) => {
            Nt(e).forEach(({ code: e, message: r, id: a, param: s }) => {
              Ke("error", r, { id: a, context: t || Lt(s) || xt(e) });
            });
          })(e, t);
        let r = (0, Xe.decodeEntities)(e.message) || ze;
        "invalid_json" === e.code && (r = ze),
          Ke("error", r, { id: e.code, context: t || xt(e.code) });
      },
      Ut = window.wp.url,
      jt = "wc/store/validation",
      Ht = (e, t) =>
        "string" != typeof t
          ? t
          : "email" === e
          ? (0, Ut.isEmail)(t)
            ? t.trim()
            : ""
          : "postcode" === e
          ? t.replace(" ", "").toUpperCase()
          : t.trim(),
      Vt = (e, t) => Object.keys(e).filter((r) => Ht(r, e[r]) !== Ht(r, t[r])),
      qt = {
        customerDataIsInitialized: !1,
        doingPush: !1,
        customerData: { billingAddress: {}, shippingAddress: {} },
        dirtyProps: { billingAddress: [], shippingAddress: [] },
      },
      Bt = () => {
        if (qt.doingPush) return;
        if (
          ((qt.doingPush = !0),
          (() => {
            const e = (0, T.select)(b).getCustomerData();
            (qt.dirtyProps.billingAddress = [
              ...qt.dirtyProps.billingAddress,
              ...Vt(qt.customerData.billingAddress, e.billingAddress),
            ]),
              (qt.dirtyProps.shippingAddress = [
                ...qt.dirtyProps.shippingAddress,
                ...Vt(qt.customerData.shippingAddress, e.shippingAddress),
              ]),
              (qt.customerData = e);
          })(),
          !(
            qt.dirtyProps.billingAddress.length > 0 ||
            qt.dirtyProps.shippingAddress.length > 0
          ))
        )
          return void (qt.doingPush = !1);
        if (
          !((e) => {
            const t = (0, T.select)(jt);
            return (
              0 ===
              [
                ...e.billingAddress.filter(
                  (e) => void 0 !== t.getValidationError("billing_" + e)
                ),
                ...e.shippingAddress.filter(
                  (e) => void 0 !== t.getValidationError("shipping_" + e)
                ),
              ].filter(Boolean).length
            );
          })(qt.dirtyProps)
        )
          return void (qt.doingPush = !1);
        const e = {};
        qt.dirtyProps.billingAddress.length &&
          (e.billing_address = Tt(
            qt.customerData.billingAddress,
            qt.dirtyProps.billingAddress
          )),
          qt.dirtyProps.shippingAddress.length &&
            (e.shipping_address = Tt(
              qt.customerData.shippingAddress,
              qt.dirtyProps.shippingAddress
            )),
          (0, T.dispatch)(b)
            .updateCustomerData(e)
            .then(() => {
              (qt.dirtyProps.billingAddress = []),
                (qt.dirtyProps.shippingAddress = []),
                (qt.doingPush = !1),
                (() => {
                  const e = (0, T.select)(
                      "wc/store/store-notices"
                    ).getRegisteredContainers(),
                    { removeNotice: t } = (0, T.dispatch)("core/notices"),
                    { getNotices: r } = (0, T.select)("core/notices");
                  e.forEach((e) => {
                    r(e).forEach((r) => {
                      t(r.id, e);
                    });
                  });
                })();
            })
            .catch((e) => {
              (qt.doingPush = !1), Yt(e);
            });
      },
      Ft = At(() => {
        qt.doingPush ? Ft() : Bt();
      }, 1500),
      $t = "wc/store/payment";
    let Gt = (function (e) {
      return (
        (e.IDLE = "idle"),
        (e.EXPRESS_STARTED = "express_started"),
        (e.PROCESSING = "processing"),
        (e.READY = "ready"),
        (e.ERROR = "has_error"),
        e
      );
    })({});
    const zt = async () =>
        !!(0, T.select)(b).hasFinishedResolution("getCartData") &&
        (await (0, T.dispatch)($t).__internalUpdateAvailablePaymentMethods(),
        !0),
      Kt = At(zt, 1e3),
      Xt = (0, T.registerStore)(b, {
        reducer: (e = q, t) => {
          switch (t.type) {
            case fe:
              t.error && (e = { ...e, errors: [t.error] });
              break;
            case Se:
              t.response &&
                (e = {
                  ...e,
                  errors: N,
                  cartData: { ...e.cartData, ...t.response },
                });
              break;
            case ve:
              (t.couponCode || "" === t.couponCode) &&
                (e = {
                  ...e,
                  metaData: { ...e.metaData, applyingCoupon: t.couponCode },
                });
              break;
            case Ce:
              e = {
                ...e,
                cartData: {
                  ...e.cartData,
                  billingAddress: {
                    ...e.cartData.billingAddress,
                    ...t.billingAddress,
                  },
                },
              };
              break;
            case Ie:
              e = {
                ...e,
                cartData: {
                  ...e.cartData,
                  shippingAddress: {
                    ...e.cartData.shippingAddress,
                    ...t.shippingAddress,
                  },
                },
              };
              break;
            case Te:
              (t.couponCode || "" === t.couponCode) &&
                (e = {
                  ...e,
                  metaData: { ...e.metaData, removingCoupon: t.couponCode },
                });
              break;
            case Pe:
              const r = e.cartItemsPendingQuantity.filter(
                (e) => e !== t.cartItemKey
              );
              t.isPendingQuantity && t.cartItemKey && r.push(t.cartItemKey),
                (e = { ...e, cartItemsPendingQuantity: r });
              break;
            case Re:
              const a = e.cartItemsPendingDelete.filter(
                (e) => e !== t.cartItemKey
              );
              t.isPendingDelete && t.cartItemKey && a.push(t.cartItemKey),
                (e = { ...e, cartItemsPendingDelete: a });
              break;
            case Ae:
              e = {
                ...e,
                errors: N,
                cartData: { ...e.cartData, items: vt(e.cartData.items, t) },
              };
              break;
            case we:
              e = {
                ...e,
                metaData: {
                  ...e.metaData,
                  updatingCustomerData: !!t.isResolving,
                },
              };
              break;
            case De:
              e = {
                ...e,
                metaData: {
                  ...e.metaData,
                  updatingSelectedRate: !!t.isResolving,
                },
              };
              break;
            case be:
              e = {
                ...e,
                metaData: { ...e.metaData, isCartDataStale: t.isCartDataStale },
              };
          }
          return e;
        },
        actions: t,
        controls: A.controls,
        selectors: e,
        resolvers: s,
        __experimentalUseThunks: !0,
      });
    Xt.subscribe((e = !0) => {
      if ((0, T.select)(b).hasFinishedResolution("getCartData"))
        return qt.customerDataIsInitialized
          ? void (
              bt()(qt.customerData, (0, T.select)(b).getCustomerData()) ||
              (e ? Ft() : Bt())
            )
          : ((qt.customerData = (0, T.select)(b).getCustomerData()),
            void (qt.customerDataIsInitialized = !0));
    }),
      document.body.addEventListener("focusout", (e) => {
        e.target &&
          e.target instanceof Element &&
          "input" === e.target.tagName.toLowerCase() &&
          Ft.flush();
      });
    const Qt = Xt.subscribe(async () => {
        (await zt()) && (Qt(), Xt.subscribe(Kt));
      }),
      Wt = b,
      Zt = "wc/store/checkout";
    let Jt = (function (e) {
      return (
        (e.IDLE = "idle"),
        (e.COMPLETE = "complete"),
        (e.BEFORE_PROCESSING = "before_processing"),
        (e.PROCESSING = "processing"),
        (e.AFTER_PROCESSING = "after_processing"),
        e
      );
    })({});
    const er = {
      order_id: 0,
      customer_id: 0,
      billing_address: {},
      shipping_address: {},
      ...((0, w.getSetting)("checkoutData", {}) || {}),
    };
    var tr, rr, ar, sr, ir, nr, or, cr, lr, dr;
    const ur = (0, w.getSetting)("wcBlocksConfig", {
        buildPhase: 1,
        pluginUrl: "",
        productCount: 0,
        defaultAvatar: "",
        restApiRoutes: {},
        wordCountType: "words",
      }),
      pr = ur.pluginUrl + "assets/images/",
      _r =
        (ur.pluginUrl,
        ur.buildPhase,
        null === (tr = w.STORE_PAGES.shop) || void 0 === tr || tr.permalink,
        null === (rr = w.STORE_PAGES.checkout) || void 0 === rr || rr.id,
        null === (ar = w.STORE_PAGES.checkout) || void 0 === ar || ar.permalink,
        null === (sr = w.STORE_PAGES.privacy) || void 0 === sr || sr.permalink,
        null === (ir = w.STORE_PAGES.privacy) || void 0 === ir || ir.title,
        null === (nr = w.STORE_PAGES.terms) || void 0 === nr || nr.permalink,
        null === (or = w.STORE_PAGES.terms) || void 0 === or || or.title,
        null === (cr = w.STORE_PAGES.cart) || void 0 === cr || cr.id,
        null === (lr = w.STORE_PAGES.cart) || void 0 === lr || lr.permalink,
        null !== (dr = w.STORE_PAGES.myaccount) && void 0 !== dr && dr.permalink
          ? w.STORE_PAGES.myaccount.permalink
          : (0, w.getSetting)("wpLoginUrl", "/wp-login.php"),
        (0, w.getSetting)("localPickupEnabled", !1)),
      mr = (0, w.getSetting)("countries", {}),
      hr = (0, w.getSetting)("countryData", {}),
      yr =
        (Object.fromEntries(
          Object.keys(hr)
            .filter((e) => !0 === hr[e].allowBilling)
            .map((e) => [e, mr[e] || ""])
        ),
        Object.fromEntries(
          Object.keys(hr)
            .filter((e) => !0 === hr[e].allowBilling)
            .map((e) => [e, hr[e].states || []])
        ),
        Object.fromEntries(
          Object.keys(hr)
            .filter((e) => !0 === hr[e].allowShipping)
            .map((e) => [e, mr[e] || ""])
        ),
        Object.fromEntries(
          Object.keys(hr)
            .filter((e) => !0 === hr[e].allowShipping)
            .map((e) => [e, hr[e].states || []])
        ),
        Object.fromEntries(
          Object.keys(hr).map((e) => [e, hr[e].locale || []])
        )),
      Er = {
        address: [
          "first_name",
          "last_name",
          "company",
          "address_1",
          "address_2",
          "city",
          "postcode",
          "country",
          "state",
          "phone",
        ],
        contact: ["email"],
        additional: [],
      },
      gr = (0, w.getSetting)("addressFieldsLocations", Er).address,
      Sr =
        ((0, w.getSetting)("addressFieldsLocations", Er).contact,
        (0, w.getSetting)("addressFieldsLocations", Er).additional,
        (0, w.getSetting)("collectableMethodIds", [])),
      fr = (e) => "string" == typeof e,
      vr = (e) => e.customerId,
      Tr = (e) => e.orderId,
      Ar = (e) => e.orderNotes,
      Pr = (e) => e.redirectUrl,
      br = (e) => e.useShippingAsBilling,
      Rr = (e) => e.extensionData,
      wr = (e) => e.shouldCreateAccount,
      Cr = (e) => e.status,
      Ir = (e) => e.hasError,
      Dr = (e) => !!e.orderId,
      Or = (e) => e.status === Jt.COMPLETE,
      Mr = (e) => e.status === Jt.IDLE,
      kr = (e) => e.status === Jt.BEFORE_PROCESSING,
      Nr = (e) => e.status === Jt.AFTER_PROCESSING,
      xr = (e) => e.status === Jt.PROCESSING,
      Lr = (e) => e.calculatingCount > 0,
      Yr = (e) => {
        if (void 0 === e.prefersCollection) {
          const e = (0, T.select)(b).getShippingRates();
          if (!e || !e.length) return !1;
          const r = e[0].shipping_rates.find((e) => e.selected);
          if (Fe(r, "method_id") && fr(r.method_id))
            return (
              (t = null == r ? void 0 : r.method_id),
              !!_r &&
                (Array.isArray(t)
                  ? !!t.find((e) => Sr.includes(e))
                  : Sr.includes(t))
            );
        }
        var t;
        return e.prefersCollection;
      },
      Ur = "SET_IDLE",
      jr = "SET_REDIRECT_URL",
      Hr = "SET_CHECKOUT_COMPLETE",
      Vr = "SET_BEFORE_PROCESSING",
      qr = "SET_AFTER_PROCESSING",
      Br = "SET_CHECKOUT_IS_PROCESSING",
      Fr = "SET_CHECKOUT_HAS_ERROR",
      $r = "SET_CHECKOUT_CUSTOMER_ID",
      Gr = "SET_CHECKOUT_ORDER_NOTES",
      zr = "INCREMENT_CALCULATING",
      Kr = "DECREMENT_CALCULATING",
      Xr = "SET_USE_SHIPPING_AS_BILLING",
      Qr = "SET_SHOULD_CREATE_ACCOUNT",
      Wr = "SET_PREFERS_COLLECTION",
      Zr = "SET_EXTENSION_DATA",
      Jr = (e) => Be(e) && Fe(e, "type"),
      ea = async (e, t, r) => {
        const a = [],
          s = Rt(e, t);
        for (const e of s)
          try {
            const t = await Promise.resolve(e.callback(r));
            if (!Jr(t)) continue;
            if (!t.hasOwnProperty("type"))
              throw new Error(
                "Returned objects from event emitter observers must return an object with a type property"
              );
            if (Ot(t) || Mt(t)) return a.push(t), a;
            a.push(t);
          } catch (e) {
            return console.error(e), a.push({ type: wt.ERROR }), a;
          }
        return a;
      },
      ta = (window.wp.element, "checkout_success"),
      ra =
        (e) =>
        ({ dispatch: t }) => {
          const r = ((e) => {
            const t = {
              message: "",
              paymentStatus: "not set",
              redirectUrl: "",
              paymentDetails: {},
            };
            return (
              "payment_result" in e &&
                ((t.paymentStatus = e.payment_result.payment_status),
                (t.redirectUrl = e.payment_result.redirect_url),
                e.payment_result.hasOwnProperty("payment_details") &&
                  Array.isArray(e.payment_result.payment_details) &&
                  e.payment_result.payment_details.forEach(
                    ({ key: e, value: r }) => {
                      t.paymentDetails[e] = (0, Xe.decodeEntities)(r);
                    }
                  )),
              "message" in e && (t.message = (0, Xe.decodeEntities)(e.message)),
              !t.message &&
                "data" in e &&
                "status" in e.data &&
                e.data.status > 299 &&
                (t.message = (0, P.__)(
                  "Something went wrong. Please contact us to get assistance.",
                  "woocommerce"
                )),
              t
            );
          })(e);
          t.__internalSetRedirectUrl(
            (null == r ? void 0 : r.redirectUrl) || ""
          ),
            (0, T.dispatch)($t).__internalSetPaymentResult(r),
            t.__internalSetAfterProcessing();
        },
      aa =
        ({ observers: e, setValidationErrors: t }) =>
        ({ dispatch: r, registry: a }) => {
          const { createErrorNotice: s } = a.dispatch(v.store);
          ((e, t) => {
            const r = (0, T.select)("core/notices").getNotices(t),
              { removeNotice: a } = (0, T.dispatch)("core/notices");
            r.filter((e) => "error" === e.status).forEach((e) => a(e.id, t));
          })(),
            (async (e, t, r) => {
              const a = Rt(e, t),
                s = [];
              for (const e of a)
                try {
                  const t = await Promise.resolve(e.callback(r));
                  "object" == typeof t && s.push(t);
                } catch (e) {
                  console.error(e);
                }
              return !s.length || s;
            })(e, "checkout_validation", {}).then((e) => {
              !0 !== e
                ? (Array.isArray(e) &&
                    e.forEach(
                      ({
                        errorMessage: e,
                        validationErrors: r,
                        context: a = "wc/checkout",
                      }) => {
                        s(e, { context: a }), t(r);
                      }
                    ),
                  r.__internalSetIdle(),
                  r.__internalSetHasError())
                : r.__internalSetProcessing();
            });
        },
      sa =
        ({ observers: e, notices: t }) =>
        ({ select: r, dispatch: a, registry: s }) => {
          const { createErrorNotice: i } = s.dispatch(v.store),
            n = {
              redirectUrl: r.getRedirectUrl(),
              orderId: r.getOrderId(),
              customerId: r.getCustomerId(),
              orderNotes: r.getOrderNotes(),
              processingResponse: (0, T.select)($t).getPaymentResult(),
            };
          r.hasError()
            ? ea(e, "checkout_fail", n).then((e) => {
                (({
                  observerResponses: e,
                  notices: t,
                  dispatch: r,
                  createErrorNotice: a,
                  data: s,
                }) => {
                  const i = (({
                    observerResponses: e,
                    createErrorNotice: t,
                  }) => {
                    let r = null;
                    return (
                      e.forEach((e) => {
                        if ((Ot(e) || Mt(e)) && e.message && fr(e.message)) {
                          const a =
                            e.messageContext && fr(e.messageContext)
                              ? { context: e.messageContext }
                              : void 0;
                          (r = e), t(e.message, a);
                        }
                      }),
                      r
                    );
                  })({ observerResponses: e, createErrorNotice: a });
                  if (null !== i)
                    kt(i) ? r.__internalSetIdle() : r.__internalSetComplete(i);
                  else {
                    var n;
                    t.checkoutNotices.some((e) => "error" === e.status) ||
                      t.expressPaymentNotices.some(
                        (e) => "error" === e.status
                      ) ||
                      t.paymentNotices.some((e) => "error" === e.status) ||
                      a(
                        (null === (n = s.processingResponse) || void 0 === n
                          ? void 0
                          : n.message) ||
                          (0, P.__)(
                            "Something went wrong. Please contact us to get assistance.",
                            "woocommerce"
                          ),
                        { id: "checkout", context: "wc/checkout" }
                      ),
                      r.__internalSetIdle();
                  }
                })({
                  observerResponses: e,
                  notices: t,
                  dispatch: a,
                  createErrorNotice: i,
                  data: n,
                });
              })
            : ea(e, ta, n).then((e) => {
                (({
                  observerResponses: e,
                  dispatch: t,
                  createErrorNotice: r,
                }) => {
                  let a = null,
                    s = null;
                  if (
                    (e.forEach((e) => {
                      Dt(e) && (a = e), (Ot(e) || Mt(e)) && (s = e);
                    }),
                    a && !s)
                  )
                    t.__internalSetComplete(a);
                  else if (Be(s)) {
                    if (s.message && fr(s.message)) {
                      const e =
                        s.messageContext && fr(s.messageContext)
                          ? { context: s.messageContext }
                          : void 0;
                      r(s.message, e);
                    }
                    kt(s)
                      ? t.__internalSetHasError(!0)
                      : t.__internalSetComplete(s);
                  } else t.__internalSetComplete();
                })({ observerResponses: e, dispatch: a, createErrorNotice: i });
              });
        },
      ia = () => ({ type: Ur }),
      na = () => ({ type: Vr }),
      oa = () => ({ type: Br }),
      ca = () => ({ type: qr }),
      la = (e = {}) => ({ type: Hr, data: e }),
      da = (e) => ({ type: jr, redirectUrl: e }),
      ua = (e = !0) => ({ type: Fr, hasError: e }),
      pa = () => ({ type: zr }),
      _a = () => ({ type: Kr }),
      ma = (e) => ({ type: $r, customerId: e }),
      ha = (e) => ({ type: Xr, useShippingAsBilling: e }),
      ya = (e) => ({ type: Qr, shouldCreateAccount: e }),
      Ea = (e) => ({ type: Gr, orderNotes: e }),
      ga = (e) => ({ type: Wr, prefersCollection: e }),
      Sa = (e, t, r = !1) => ({
        type: Zr,
        extensionData: t,
        namespace: e,
        replace: r,
      }),
      fa = (e) => {
        const t = {};
        return (
          void 0 !== e.label && (t.label = e.label),
          void 0 !== e.required && (t.required = e.required),
          void 0 !== e.hidden && (t.hidden = e.hidden),
          void 0 === e.label ||
            e.optionalLabel ||
            (t.optionalLabel = (0, P.sprintf)(
              /* translators: %s Field label. */ /* translators: %s Field label. */
              (0, P.__)("%s (optional)", "woocommerce"),
              e.label
            )),
          e.priority &&
            ("number" == typeof e.priority && (t.index = e.priority),
            fr(e.priority) && (t.index = parseInt(e.priority, 10))),
          e.hidden && (t.required = !1),
          t
        );
      },
      va = Object.entries(yr)
        .map(([e, t]) => [
          e,
          Object.entries(t)
            .map(([e, t]) => [e, fa(t)])
            .reduce((e, [t, r]) => ((e[t] = r), e), {}),
        ])
        .reduce((e, [t, r]) => ((e[t] = r), e), {}),
      Ta = (e) => {
        const t = ((e, t, r = "") => {
            const a = r && void 0 !== va[r] ? va[r] : {};
            return e
              .map((e) => ({
                key: e,
                ...(w.defaultFields[e] || {}),
                ...(a[e] || {}),
                ...(t[e] || {}),
              }))
              .sort((e, t) => e.index - t.index);
          })(gr, {}, e.country),
          r = Object.assign({}, e);
        return (
          t.forEach(({ key: t = "", hidden: a = !1 }) => {
            a && ((e, t) => e in t)(t, e) && (r[t] = "");
          }),
          r
        );
      },
      Aa = {
        redirectUrl: "",
        status: Jt.PRISTINE,
        hasError: !1,
        orderId: er.order_id,
        customerId: er.customer_id,
        calculatingCount: 0,
        orderNotes: "",
        useShippingAsBilling:
          ((Pa = er.billing_address),
          (ba = er.shipping_address),
          gr.every((e) => Pa[e] === ba[e])),
        shouldCreateAccount: !1,
        prefersCollection: void 0,
        extensionData: {},
      };
    var Pa, ba;
    const Ra = {
        reducer: (e = Aa, t) => {
          var r;
          let a = e;
          switch (t.type) {
            case Ur:
              a = e.status !== Jt.IDLE ? { ...e, status: Jt.IDLE } : e;
              break;
            case jr:
              a =
                void 0 !== t.redirectUrl && t.redirectUrl !== e.redirectUrl
                  ? { ...e, redirectUrl: t.redirectUrl }
                  : e;
              break;
            case Hr:
              a = {
                ...e,
                status: Jt.COMPLETE,
                redirectUrl:
                  "string" ==
                  typeof (null === (r = t.data) || void 0 === r
                    ? void 0
                    : r.redirectUrl)
                    ? t.data.redirectUrl
                    : e.redirectUrl,
              };
              break;
            case Br:
              a = { ...e, status: Jt.PROCESSING, hasError: !1 };
              break;
            case Vr:
              a = { ...e, status: Jt.BEFORE_PROCESSING, hasError: !1 };
              break;
            case qr:
              a = { ...e, status: Jt.AFTER_PROCESSING };
              break;
            case Fr:
              a = {
                ...e,
                hasError: t.hasError,
                status:
                  e.status === Jt.PROCESSING ||
                  e.status === Jt.BEFORE_PROCESSING
                    ? Jt.IDLE
                    : e.status,
              };
              break;
            case zr:
              a = { ...e, calculatingCount: e.calculatingCount + 1 };
              break;
            case Kr:
              a = {
                ...e,
                calculatingCount: Math.max(0, e.calculatingCount - 1),
              };
              break;
            case $r:
              void 0 !== t.customerId &&
                (a = { ...e, customerId: t.customerId });
              break;
            case Xr:
              void 0 !== t.useShippingAsBilling &&
                t.useShippingAsBilling !== e.useShippingAsBilling &&
                (a = { ...e, useShippingAsBilling: t.useShippingAsBilling });
              break;
            case Qr:
              void 0 !== t.shouldCreateAccount &&
                t.shouldCreateAccount !== e.shouldCreateAccount &&
                (a = { ...e, shouldCreateAccount: t.shouldCreateAccount });
              break;
            case Wr:
              void 0 !== t.prefersCollection &&
                t.prefersCollection !== e.prefersCollection &&
                (a = { ...e, prefersCollection: t.prefersCollection });
              break;
            case Gr:
              void 0 !== t.orderNotes &&
                e.orderNotes !== t.orderNotes &&
                (a = { ...e, orderNotes: t.orderNotes });
              break;
            case Zr:
              void 0 !== t.extensionData &&
                void 0 !== t.namespace &&
                (a = {
                  ...e,
                  extensionData: {
                    ...e.extensionData,
                    [t.namespace]: t.replace
                      ? t.extensionData
                      : { ...e.extensionData[t.namespace], ...t.extensionData },
                  },
                });
          }
          return a;
        },
        selectors: i,
        actions: n,
        __experimentalUseThunks: !0,
      },
      wa = (0, T.createReduxStore)(Zt, Ra);
    (0, T.register)(wa);
    const Ca = Zt,
      Ia = "wc/store/collections",
      Da = [],
      Oa = (e, t) =>
        !!t &&
        !!t.reduce(
          (e, t) => ("object" == typeof e && null !== e ? e[t] : void 0),
          e
        );
    function Ma(e, t) {
      return Oa(e, t);
    }
    const ka = ({
        state: e,
        namespace: t,
        resourceName: r,
        query: a,
        ids: s,
        type: i = "items",
        fallback: n = Da,
      }) =>
        Ma(e, [
          t,
          r,
          (s = JSON.stringify(s)),
          (a = null !== a ? (0, Ut.addQueryArgs)("", a) : ""),
          i,
        ])
          ? e[t][r][s][a][i]
          : n,
      Na = (e, t, r, a = null, s = Da) =>
        ka({ state: e, namespace: t, resourceName: r, query: a, ids: s }),
      xa = (e, t, r, a = null, s = Da) =>
        ka({
          state: e,
          namespace: t,
          resourceName: r,
          query: a,
          ids: s,
          type: "error",
          fallback: null,
        }),
      La = (e, t, r, a, s = null, i = Da) => {
        const n = ((e, t, r, a = null, s = Da) =>
          ka({
            state: e,
            namespace: t,
            resourceName: r,
            query: a,
            ids: s,
            type: "headers",
            fallback: void 0,
          }))(e, r, a, s, i);
        return n && n.get ? (n.has(t) ? n.get(t) : void 0) : null;
      },
      Ya = (e) => e.lastModified || 0,
      Ua = {
        RECEIVE_COLLECTION: "RECEIVE_COLLECTION",
        RESET_COLLECTION: "RESET_COLLECTION",
        ERROR: "ERROR",
        RECEIVE_LAST_MODIFIED: "RECEIVE_LAST_MODIFIED",
        INVALIDATE_RESOLUTION_FOR_STORE: "INVALIDATE_RESOLUTION_FOR_STORE",
      };
    let ja = window.Headers || null;
    function Ha(e, t, r = "", a = [], s = { items: [], headers: ja }, i = !1) {
      return {
        type: i ? Ua.RESET_COLLECTION : Ua.RECEIVE_COLLECTION,
        namespace: e,
        resourceName: t,
        queryString: r,
        ids: a,
        response: s,
      };
    }
    function Va(e, t, r, a, s) {
      return {
        type: "ERROR",
        namespace: e,
        resourceName: t,
        queryString: r,
        ids: a,
        response: { items: [], headers: ja, error: s },
      };
    }
    function qa(e) {
      return { type: Ua.RECEIVE_LAST_MODIFIED, timestamp: e };
    }
    ja = ja ? new ja() : { get: () => {}, has: () => {} };
    const Ba = "wc/store/schema";
    function* Fa(e, t, r, a) {
      const s = yield T.controls.resolveSelect(Ba, "getRoute", e, t, a),
        i = (0, Ut.addQueryArgs)("", r);
      if (s)
        try {
          const { response: r = Da, headers: n } = yield je({ path: s + i });
          n &&
            n.get &&
            n.has("last-modified") &&
            (yield (function* (e) {
              const t = yield T.controls.resolveSelect(
                Ia,
                "getCollectionLastModified"
              );
              t
                ? e > t &&
                  (yield T.controls.dispatch(
                    Ia,
                    "invalidateResolutionForStore"
                  ),
                  yield T.controls.dispatch(Ia, "receiveLastModified", e))
                : yield T.controls.dispatch(Ia, "receiveLastModified", e);
            })(parseInt(n.get("last-modified"), 10))),
            yield Ha(e, t, i, a, { items: r, headers: n });
        } catch (r) {
          yield Va(e, t, i, a, r);
        }
      else yield Ha(e, t, i, a);
    }
    function* $a(e, t, r, a, s) {
      const i = [t, r, a, s].filter((e) => void 0 !== e);
      yield T.controls.resolveSelect(Ia, "getCollection", ...i);
    }
    function Ga(e, t, r, a = 0) {
      const s = t[a];
      if (a === t.length - 1) return { ...e, [s]: r };
      const i = e[s] || {};
      return { ...e, [s]: Ga(i, t, r, a + 1) };
    }
    function za(e, t, r) {
      return Ga(e, t, r);
    }
    const Ka = (0, T.createReduxStore)(Ia, {
      reducer: (e = {}, t) => {
        if (t.type === Ua.RECEIVE_LAST_MODIFIED)
          return t.timestamp === e.lastModified
            ? e
            : { ...e, lastModified: t.timestamp };
        if (t.type === Ua.INVALIDATE_RESOLUTION_FOR_STORE) return {};
        const {
            type: r,
            namespace: a,
            resourceName: s,
            queryString: i,
            response: n,
          } = t,
          o = t.ids ? JSON.stringify(t.ids) : "[]";
        switch (r) {
          case Ua.RECEIVE_COLLECTION:
            if (Ma(e, [a, s, o, i])) return e;
            e = za(e, [a, s, o, i], n);
            break;
          case Ua.RESET_COLLECTION:
          case Ua.ERROR:
            e = za(e, [a, s, o, i], n);
        }
        return e;
      },
      actions: c,
      controls: { ...A.controls, ...qe },
      selectors: o,
      resolvers: l,
    });
    (0, T.register)(Ka);
    const Xa = Ia,
      Qa = {
        status: Gt.IDLE,
        activePaymentMethod: "",
        activeSavedToken: "",
        availablePaymentMethods: {},
        availableExpressPaymentMethods: {},
        savedPaymentMethods: (0, w.getSetting)("customerPaymentMethods", {}),
        paymentMethodData: {},
        paymentResult: null,
        paymentMethodsInitialized: !1,
        expressPaymentMethodsInitialized: !1,
        shouldSavePaymentMethod: !1,
      };
    let Wa = (function (e) {
      return (
        (e.SET_PAYMENT_IDLE = "SET_PAYMENT_IDLE"),
        (e.SET_EXPRESS_PAYMENT_STARTED = "SET_EXPRESS_PAYMENT_STARTED"),
        (e.SET_PAYMENT_READY = "SET_PAYMENT_READY"),
        (e.SET_PAYMENT_PROCESSING = "SET_PAYMENT_PROCESSING"),
        (e.SET_PAYMENT_ERROR = "SET_PAYMENT_ERROR"),
        (e.SET_PAYMENT_METHODS_INITIALIZED = "SET_PAYMENT_METHODS_INITIALIZED"),
        (e.SET_EXPRESS_PAYMENT_METHODS_INITIALIZED =
          "SET_EXPRESS_PAYMENT_METHODS_INITIALIZED"),
        (e.SET_ACTIVE_PAYMENT_METHOD = "SET_ACTIVE_PAYMENT_METHOD"),
        (e.SET_SHOULD_SAVE_PAYMENT_METHOD = "SET_SHOULD_SAVE_PAYMENT_METHOD"),
        (e.SET_AVAILABLE_PAYMENT_METHODS = "SET_AVAILABLE_PAYMENT_METHODS"),
        (e.SET_AVAILABLE_EXPRESS_PAYMENT_METHODS =
          "SET_AVAILABLE_EXPRESS_PAYMENT_METHODS"),
        (e.REMOVE_AVAILABLE_PAYMENT_METHOD = "REMOVE_AVAILABLE_PAYMENT_METHOD"),
        (e.REMOVE_AVAILABLE_EXPRESS_PAYMENT_METHOD =
          "REMOVE_AVAILABLE_EXPRESS_PAYMENT_METHOD"),
        (e.INITIALIZE_PAYMENT_METHODS = "INITIALIZE_PAYMENT_METHODS"),
        (e.SET_PAYMENT_METHOD_DATA = "SET_PAYMENT_METHOD_DATA"),
        (e.SET_PAYMENT_RESULT = "SET_PAYMENT_RESULT"),
        e
      );
    })({});
    const Za = (e) =>
        Object.fromEntries(
          e.map(({ package_id: e, shipping_rates: t }) => {
            var r;
            return [
              e,
              (null === (r = t.find((e) => e.selected)) || void 0 === r
                ? void 0
                : r.rate_id) || "",
            ];
          })
        ),
      Ja = window.wc.wcBlocksRegistry,
      es = [
        {
          destination: {
            address_1: "",
            address_2: "",
            city: "",
            state: "",
            postcode: "",
            country: "",
          },
          package_id: 0,
          name: (0, P.__)("Shipping", "woocommerce"),
          items: [
            {
              key: "33e75ff09dd601bbe69f351039152189",
              name: (0, P._x)(
                "Beanie with Logo",
                "example product in Cart Block",
                "woocommerce"
              ),
              quantity: 2,
            },
            {
              key: "6512bd43d9caa6e02c990b0a82652dca",
              name: (0, P._x)(
                "Beanie",
                "example product in Cart Block",
                "woocommerce"
              ),
              quantity: 1,
            },
          ],
          shipping_rates: [
            {
              currency_code: "USD",
              currency_symbol: "$",
              currency_minor_unit: 2,
              currency_decimal_separator: ".",
              currency_thousand_separator: ",",
              currency_prefix: "$",
              currency_suffix: "",
              name: (0, P.__)("Flat rate shipping", "woocommerce"),
              description: "",
              delivery_time: "",
              price: "500",
              taxes: "0",
              rate_id: "flat_rate:0",
              instance_id: 0,
              meta_data: [],
              method_id: "flat_rate",
              selected: !0,
            },
            {
              currency_code: "USD",
              currency_symbol: "$",
              currency_minor_unit: 2,
              currency_decimal_separator: ".",
              currency_thousand_separator: ",",
              currency_prefix: "$",
              currency_suffix: "",
              name: (0, P.__)("Free shipping", "woocommerce"),
              description: "",
              delivery_time: "",
              price: "0",
              taxes: "0",
              rate_id: "free_shipping:1",
              instance_id: 0,
              meta_data: [],
              method_id: "flat_rate",
              selected: !1,
            },
            {
              currency_code: "USD",
              currency_symbol: "$",
              currency_minor_unit: 2,
              currency_decimal_separator: ".",
              currency_thousand_separator: ",",
              currency_prefix: "$",
              currency_suffix: "",
              name: (0, P.__)("Local pickup", "woocommerce"),
              description: "",
              delivery_time: "",
              price: "0",
              taxes: "0",
              rate_id: "pickup_location:1",
              instance_id: 1,
              meta_data: [
                { key: "pickup_location", value: "New York" },
                {
                  key: "pickup_address",
                  value: "123 Easy Street, New York, 12345",
                },
              ],
              method_id: "pickup_location",
              selected: !1,
            },
            {
              currency_code: "USD",
              currency_symbol: "$",
              currency_minor_unit: 2,
              currency_decimal_separator: ".",
              currency_thousand_separator: ",",
              currency_prefix: "$",
              currency_suffix: "",
              name: (0, P.__)("Local pickup", "woocommerce"),
              description: "",
              delivery_time: "",
              price: "0",
              taxes: "0",
              rate_id: "pickup_location:2",
              instance_id: 1,
              meta_data: [
                { key: "pickup_location", value: "Los Angeles" },
                {
                  key: "pickup_address",
                  value: "123 Easy Street, Los Angeles, California, 90210",
                },
              ],
              method_id: "pickup_location",
              selected: !1,
            },
          ],
        },
      ],
      ts = (0, w.getSetting)("displayCartPricesIncludingTax", !1),
      rs = {
        coupons: [],
        shipping_rates:
          (0, w.getSetting)("shippingMethodsExist", !1) ||
          (0, w.getSetting)("localPickupEnabled", !1)
            ? es
            : [],
        items: [
          {
            key: "1",
            id: 1,
            type: "simple",
            quantity: 2,
            catalog_visibility: "visible",
            name: (0, P.__)("Beanie", "woocommerce"),
            summary: (0, P.__)("Beanie", "woocommerce"),
            short_description: (0, P.__)("Warm hat for winter", "woocommerce"),
            description:
              "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.",
            sku: "woo-beanie",
            permalink: "https://example.org",
            low_stock_remaining: 2,
            backorders_allowed: !1,
            show_backorder_badge: !1,
            sold_individually: !1,
            quantity_limits: {
              minimum: 1,
              maximum: 99,
              multiple_of: 1,
              editable: !0,
            },
            images: [
              {
                id: 10,
                src: pr + "previews/beanie.jpg",
                thumbnail: pr + "previews/beanie.jpg",
                srcset: "",
                sizes: "",
                name: "",
                alt: "",
              },
            ],
            variation: [
              {
                attribute: (0, P.__)("Color", "woocommerce"),
                value: (0, P.__)("Yellow", "woocommerce"),
              },
              {
                attribute: (0, P.__)("Size", "woocommerce"),
                value: (0, P.__)("Small", "woocommerce"),
              },
            ],
            prices: {
              currency_code: "USD",
              currency_symbol: "$",
              currency_minor_unit: 2,
              currency_decimal_separator: ".",
              currency_thousand_separator: ",",
              currency_prefix: "$",
              currency_suffix: "",
              price: ts ? "12000" : "10000",
              regular_price: ts ? "12000" : "10000",
              sale_price: ts ? "12000" : "10000",
              price_range: null,
              raw_prices: {
                precision: 6,
                price: ts ? "12000000" : "10000000",
                regular_price: ts ? "12000000" : "10000000",
                sale_price: ts ? "12000000" : "10000000",
              },
            },
            totals: {
              currency_code: "USD",
              currency_symbol: "$",
              currency_minor_unit: 2,
              currency_decimal_separator: ".",
              currency_thousand_separator: ",",
              currency_prefix: "$",
              currency_suffix: "",
              line_subtotal: "2000",
              line_subtotal_tax: "400",
              line_total: "2000",
              line_total_tax: "400",
            },
            extensions: {},
            item_data: [],
          },
          {
            key: "2",
            id: 2,
            type: "simple",
            quantity: 1,
            catalog_visibility: "visible",
            name: (0, P.__)("Cap", "woocommerce"),
            summary: (0, P.__)("Cap", "woocommerce"),
            short_description: (0, P.__)(
              "Lightweight baseball cap",
              "woocommerce"
            ),
            description:
              "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.",
            sku: "woo-cap",
            low_stock_remaining: null,
            permalink: "https://example.org",
            backorders_allowed: !1,
            show_backorder_badge: !1,
            sold_individually: !1,
            quantity_limits: {
              minimum: 1,
              maximum: 99,
              multiple_of: 1,
              editable: !0,
            },
            images: [
              {
                id: 11,
                src: pr + "previews/cap.jpg",
                thumbnail: pr + "previews/cap.jpg",
                srcset: "",
                sizes: "",
                name: "",
                alt: "",
              },
            ],
            variation: [
              {
                attribute: (0, P.__)("Color", "woocommerce"),
                value: (0, P.__)("Orange", "woocommerce"),
              },
            ],
            prices: {
              currency_code: "USD",
              currency_symbol: "$",
              currency_minor_unit: 2,
              currency_decimal_separator: ".",
              currency_thousand_separator: ",",
              currency_prefix: "$",
              currency_suffix: "",
              price: ts ? "2400" : "2000",
              regular_price: ts ? "2400" : "2000",
              sale_price: ts ? "2400" : "2000",
              price_range: null,
              raw_prices: {
                precision: 6,
                price: ts ? "24000000" : "20000000",
                regular_price: ts ? "24000000" : "20000000",
                sale_price: ts ? "24000000" : "20000000",
              },
            },
            totals: {
              currency_code: "USD",
              currency_symbol: "$",
              currency_minor_unit: 2,
              currency_decimal_separator: ".",
              currency_thousand_separator: ",",
              currency_prefix: "$",
              currency_suffix: "",
              line_subtotal: "2000",
              line_subtotal_tax: "400",
              line_total: "2000",
              line_total_tax: "400",
            },
            extensions: {},
            item_data: [],
          },
        ],
        cross_sells: [
          {
            id: 1,
            name: (0, P.__)("Polo", "woocommerce"),
            parent: 0,
            type: "simple",
            variation: "",
            permalink: "https://example.org",
            sku: "woo-polo",
            short_description: (0, P.__)("Polo", "woocommerce"),
            description: (0, P.__)("Polo", "woocommerce"),
            on_sale: !1,
            prices: {
              currency_code: "USD",
              currency_symbol: "$",
              currency_minor_unit: 2,
              currency_decimal_separator: ".",
              currency_thousand_separator: ",",
              currency_prefix: "$",
              currency_suffix: "",
              price: ts ? "24000" : "20000",
              regular_price: ts ? "24000" : "20000",
              sale_price: ts ? "12000" : "10000",
              price_range: null,
            },
            price_html: "",
            average_rating: "4.5",
            review_count: 2,
            images: [
              {
                id: 17,
                src: pr + "previews/polo.jpg",
                thumbnail: pr + "previews/polo.jpg",
                srcset: "",
                sizes: "",
                name: "",
                alt: "",
              },
            ],
            categories: [],
            tags: [],
            attributes: [],
            variations: [],
            has_options: !1,
            is_purchasable: !0,
            is_in_stock: !0,
            is_on_backorder: !1,
            low_stock_remaining: null,
            sold_individually: !1,
            add_to_cart: {
              text: "",
              description: "",
              url: "",
              minimum: 1,
              maximum: 99,
              multiple_of: 1,
            },
          },
          {
            id: 2,
            name: (0, P.__)("Long Sleeve Tee", "woocommerce"),
            parent: 0,
            type: "simple",
            variation: "",
            permalink: "https://example.org",
            sku: "woo-long-sleeve-tee",
            short_description: (0, P.__)("Long Sleeve Tee", "woocommerce"),
            description: (0, P.__)("Long Sleeve Tee", "woocommerce"),
            on_sale: !1,
            prices: {
              currency_code: "USD",
              currency_symbol: "$",
              currency_minor_unit: 2,
              currency_decimal_separator: ".",
              currency_thousand_separator: ",",
              currency_prefix: "$",
              currency_suffix: "",
              price: ts ? "30000" : "25000",
              regular_price: ts ? "30000" : "25000",
              sale_price: ts ? "30000" : "25000",
              price_range: null,
            },
            price_html: "",
            average_rating: "4",
            review_count: 2,
            images: [
              {
                id: 17,
                src: pr + "previews/long-sleeve-tee.jpg",
                thumbnail: pr + "previews/long-sleeve-tee.jpg",
                srcset: "",
                sizes: "",
                name: "",
                alt: "",
              },
            ],
            categories: [],
            tags: [],
            attributes: [],
            variations: [],
            has_options: !1,
            is_purchasable: !0,
            is_in_stock: !0,
            is_on_backorder: !1,
            low_stock_remaining: null,
            sold_individually: !1,
            add_to_cart: {
              text: "",
              description: "",
              url: "",
              minimum: 1,
              maximum: 99,
              multiple_of: 1,
            },
          },
          {
            id: 3,
            name: (0, P.__)("Hoodie with Zipper", "woocommerce"),
            parent: 0,
            type: "simple",
            variation: "",
            permalink: "https://example.org",
            sku: "woo-hoodie-with-zipper",
            short_description: (0, P.__)("Hoodie with Zipper", "woocommerce"),
            description: (0, P.__)("Hoodie with Zipper", "woocommerce"),
            on_sale: !0,
            prices: {
              currency_code: "USD",
              currency_symbol: "$",
              currency_minor_unit: 2,
              currency_decimal_separator: ".",
              currency_thousand_separator: ",",
              currency_prefix: "$",
              currency_suffix: "",
              price: ts ? "15000" : "12500",
              regular_price: ts ? "30000" : "25000",
              sale_price: ts ? "15000" : "12500",
              price_range: null,
            },
            price_html: "",
            average_rating: "1",
            review_count: 2,
            images: [
              {
                id: 17,
                src: pr + "previews/hoodie-with-zipper.jpg",
                thumbnail: pr + "previews/hoodie-with-zipper.jpg",
                srcset: "",
                sizes: "",
                name: "",
                alt: "",
              },
            ],
            categories: [],
            tags: [],
            attributes: [],
            variations: [],
            has_options: !1,
            is_purchasable: !0,
            is_in_stock: !0,
            is_on_backorder: !1,
            low_stock_remaining: null,
            sold_individually: !1,
            add_to_cart: {
              text: "",
              description: "",
              url: "",
              minimum: 1,
              maximum: 99,
              multiple_of: 1,
            },
          },
          {
            id: 4,
            name: (0, P.__)("Hoodie with Logo", "woocommerce"),
            parent: 0,
            type: "simple",
            variation: "",
            permalink: "https://example.org",
            sku: "woo-hoodie-with-logo",
            short_description: (0, P.__)("Polo", "woocommerce"),
            description: (0, P.__)("Polo", "woocommerce"),
            on_sale: !1,
            prices: {
              currency_code: "USD",
              currency_symbol: "$",
              currency_minor_unit: 2,
              currency_decimal_separator: ".",
              currency_thousand_separator: ",",
              currency_prefix: "$",
              currency_suffix: "",
              price: ts ? "4500" : "4250",
              regular_price: ts ? "4500" : "4250",
              sale_price: ts ? "4500" : "4250",
              price_range: null,
            },
            price_html: "",
            average_rating: "5",
            review_count: 2,
            images: [
              {
                id: 17,
                src: pr + "previews/hoodie-with-logo.jpg",
                thumbnail: pr + "previews/hoodie-with-logo.jpg",
                srcset: "",
                sizes: "",
                name: "",
                alt: "",
              },
            ],
            categories: [],
            tags: [],
            attributes: [],
            variations: [],
            has_options: !1,
            is_purchasable: !0,
            is_in_stock: !0,
            is_on_backorder: !1,
            low_stock_remaining: null,
            sold_individually: !1,
            add_to_cart: {
              text: "",
              description: "",
              url: "",
              minimum: 1,
              maximum: 99,
              multiple_of: 1,
            },
          },
          {
            id: 5,
            name: (0, P.__)("Hoodie with Pocket", "woocommerce"),
            parent: 0,
            type: "simple",
            variation: "",
            permalink: "https://example.org",
            sku: "woo-hoodie-with-pocket",
            short_description: (0, P.__)("Hoodie with Pocket", "woocommerce"),
            description: (0, P.__)("Hoodie with Pocket", "woocommerce"),
            on_sale: !0,
            prices: {
              currency_code: "USD",
              currency_symbol: "$",
              currency_minor_unit: 2,
              currency_decimal_separator: ".",
              currency_thousand_separator: ",",
              currency_prefix: "$",
              currency_suffix: "",
              price: ts ? "3500" : "3250",
              regular_price: ts ? "4500" : "4250",
              sale_price: ts ? "3500" : "3250",
              price_range: null,
            },
            price_html: "",
            average_rating: "3.75",
            review_count: 4,
            images: [
              {
                id: 17,
                src: pr + "previews/hoodie-with-pocket.jpg",
                thumbnail: pr + "previews/hoodie-with-pocket.jpg",
                srcset: "",
                sizes: "",
                name: "",
                alt: "",
              },
            ],
            categories: [],
            tags: [],
            attributes: [],
            variations: [],
            has_options: !1,
            is_purchasable: !0,
            is_in_stock: !0,
            is_on_backorder: !1,
            low_stock_remaining: null,
            sold_individually: !1,
            add_to_cart: {
              text: "",
              description: "",
              url: "",
              minimum: 1,
              maximum: 99,
              multiple_of: 1,
            },
          },
          {
            id: 6,
            name: (0, P.__)("T-Shirt", "woocommerce"),
            parent: 0,
            type: "simple",
            variation: "",
            permalink: "https://example.org",
            sku: "woo-t-shirt",
            short_description: (0, P.__)("T-Shirt", "woocommerce"),
            description: (0, P.__)("T-Shirt", "woocommerce"),
            on_sale: !1,
            prices: {
              currency_code: "USD",
              currency_symbol: "$",
              currency_minor_unit: 2,
              currency_decimal_separator: ".",
              currency_thousand_separator: ",",
              currency_prefix: "$",
              currency_suffix: "",
              price: ts ? "1800" : "1500",
              regular_price: ts ? "1800" : "1500",
              sale_price: ts ? "1800" : "1500",
              price_range: null,
            },
            price_html: "",
            average_rating: "3",
            review_count: 2,
            images: [
              {
                id: 17,
                src: pr + "previews/tshirt.jpg",
                thumbnail: pr + "previews/tshirt.jpg",
                srcset: "",
                sizes: "",
                name: "",
                alt: "",
              },
            ],
            categories: [],
            tags: [],
            attributes: [],
            variations: [],
            has_options: !1,
            is_purchasable: !0,
            is_in_stock: !0,
            is_on_backorder: !1,
            low_stock_remaining: null,
            sold_individually: !1,
            add_to_cart: {
              text: "",
              description: "",
              url: "",
              minimum: 1,
              maximum: 99,
              multiple_of: 1,
            },
          },
        ],
        fees: [
          {
            id: "fee",
            name: (0, P.__)("Fee", "woocommerce"),
            totals: {
              currency_code: "USD",
              currency_symbol: "$",
              currency_minor_unit: 2,
              currency_decimal_separator: ".",
              currency_thousand_separator: ",",
              currency_prefix: "$",
              currency_suffix: "",
              total: "100",
              total_tax: "20",
            },
          },
        ],
        items_count: 3,
        items_weight: 0,
        needs_payment: !0,
        needs_shipping: (0, w.getSetting)("shippingEnabled", !0),
        has_calculated_shipping: !0,
        shipping_address: {
          first_name: "",
          last_name: "",
          company: "",
          address_1: "",
          address_2: "",
          city: "",
          state: "",
          postcode: "",
          country: "",
          phone: "",
        },
        billing_address: {
          first_name: "",
          last_name: "",
          company: "",
          address_1: "",
          address_2: "",
          city: "",
          state: "",
          postcode: "",
          country: "",
          email: "",
          phone: "",
        },
        totals: {
          currency_code: "USD",
          currency_symbol: "$",
          currency_minor_unit: 2,
          currency_decimal_separator: ".",
          currency_thousand_separator: ",",
          currency_prefix: "$",
          currency_suffix: "",
          total_items: "4000",
          total_items_tax: "800",
          total_fees: "100",
          total_fees_tax: "20",
          total_discount: "0",
          total_discount_tax: "0",
          total_shipping: "0",
          total_shipping_tax: "0",
          total_tax: "820",
          total_price: "4920",
          tax_lines: [
            {
              name: (0, P.__)("Sales tax", "woocommerce"),
              rate: "20%",
              price: "820",
            },
          ],
        },
        errors: [],
        payment_methods: ["cod", "bacs", "cheque"],
        payment_requirements: ["products"],
        extensions: {},
      },
      as = (e, t, r = !1) => {
        const { createErrorNotice: a } = (0, T.dispatch)("core/notices"),
          s = r ? Ct.EXPRESS_PAYMENTS : Ct.PAYMENTS;
        a(
          `${(0, P.sprintf)(
            /* translators: %s the id of the payment method being registered (bank transfer, cheque...) */ /* translators: %s the id of the payment method being registered (bank transfer, cheque...) */
            (0, P.__)(
              "There was an error registering the payment method with id '%s': ",
              "woocommerce"
            ),
            e.paymentMethodId
          )} ${t}`,
          { context: s, id: `wc-${e.paymentMethodId}-registration-error` }
        );
      },
      ss = async (e = !1) => {
        let t = {};
        const r = e
            ? (0, Ja.getExpressPaymentMethods)()
            : (0, Ja.getPaymentMethods)(),
          a = (e) => {
            const { name: r } = e;
            t = { ...t, [e.name]: { name: r } };
          },
          s = e
            ? Object.keys(r)
            : Array.from(
                new Set([
                  ...(0, w.getSetting)("paymentMethodSortOrder", []),
                  ...Object.keys(r),
                ])
              ),
          i = (() => {
            let e;
            if ((0, T.select)("core/editor")) {
              const t = {
                cartCoupons: rs.coupons,
                cartItems: rs.items,
                crossSellsProducts: rs.cross_sells,
                cartFees: rs.fees,
                cartItemsCount: rs.items_count,
                cartItemsWeight: rs.items_weight,
                cartNeedsPayment: rs.needs_payment,
                cartNeedsShipping: rs.needs_shipping,
                cartItemErrors: k,
                cartTotals: rs.totals,
                cartIsLoading: !1,
                cartErrors: N,
                billingData: q.cartData.billingAddress,
                billingAddress: q.cartData.billingAddress,
                shippingAddress: q.cartData.shippingAddress,
                extensions: U,
                shippingRates: rs.shipping_rates,
                isLoadingRates: !1,
                cartHasCalculatedShipping: rs.has_calculated_shipping,
                paymentRequirements: rs.payment_requirements,
                receiveCart: () => {},
              };
              e = {
                cart: t,
                cartTotals: t.cartTotals,
                cartNeedsShipping: t.cartNeedsShipping,
                billingData: t.billingAddress,
                billingAddress: t.billingAddress,
                shippingAddress: t.shippingAddress,
                selectedShippingMethods: Za(t.shippingRates),
                paymentMethods: rs.payment_methods,
                paymentRequirements: t.paymentRequirements,
              };
            } else {
              const t = (0, T.select)(b),
                r = t.getCartData(),
                a = t.getCartErrors(),
                s = t.getCartTotals(),
                i = !t.hasFinishedResolution("getCartData"),
                n = t.isCustomerDataUpdating(),
                o = Za(r.shippingRates);
              e = {
                cart: {
                  cartCoupons: r.coupons,
                  cartItems: r.items,
                  crossSellsProducts: r.crossSells,
                  cartFees: r.fees,
                  cartItemsCount: r.itemsCount,
                  cartItemsWeight: r.itemsWeight,
                  cartNeedsPayment: r.needsPayment,
                  cartNeedsShipping: r.needsShipping,
                  cartItemErrors: r.errors,
                  cartTotals: s,
                  cartIsLoading: i,
                  cartErrors: a,
                  billingData: Ta(r.billingAddress),
                  billingAddress: Ta(r.billingAddress),
                  shippingAddress: Ta(r.shippingAddress),
                  extensions: r.extensions,
                  shippingRates: r.shippingRates,
                  isLoadingRates: n,
                  cartHasCalculatedShipping: r.hasCalculatedShipping,
                  paymentRequirements: r.paymentRequirements,
                  receiveCart: (0, T.dispatch)(b).receiveCart,
                },
                cartTotals: r.totals,
                cartNeedsShipping: r.needsShipping,
                billingData: r.billingAddress,
                billingAddress: r.billingAddress,
                shippingAddress: r.shippingAddress,
                selectedShippingMethods: o,
                paymentMethods: r.paymentMethods,
                paymentRequirements: r.paymentRequirements,
              };
            }
            return e;
          })(),
          n = i.paymentMethods,
          o = !!(0, T.select)("core/editor");
        for (let t = 0; t < s.length; t++) {
          const c = s[t],
            l = r[c];
          if (l)
            try {
              const t = !(!o && !e) || n.includes(c),
                r = !!o || (t && (await Promise.resolve(l.canMakePayment(i))));
              if (r) {
                if ("object" == typeof r && r.error)
                  throw new Error(r.error.message);
                a(l);
              }
            } catch (t) {
              (w.CURRENT_USER_IS_ADMIN || o) && as(l, t, e);
            }
        }
        const c = Object.keys(t),
          l = e
            ? (0, T.select)($t).getAvailableExpressPaymentMethods()
            : (0, T.select)($t).getAvailablePaymentMethods();
        if (
          Object.keys(l).length === c.length &&
          Object.keys(l).every((e) => c.includes(e))
        )
          return !0;
        const {
          __internalSetAvailablePaymentMethods: d,
          __internalSetAvailableExpressPaymentMethods: u,
        } = (0, T.dispatch)($t);
        return (e ? u : d)(t), !0;
      },
      is = async (e) => {
        const t = Object.keys(e),
          r = Object.keys(
            (0, T.select)($t).getAvailableExpressPaymentMethods()
          ),
          a = [...t, ...r],
          s = (0, T.select)($t).getSavedPaymentMethods(),
          i = Object.keys(s).flatMap((e) => s[e])[0] || void 0;
        if (i) {
          const e = i.tokenId.toString(),
            t = i.method.gateway,
            r = `wc-${t}-payment-token`;
          return void (0, T.dispatch)($t).__internalSetActivePaymentMethod(t, {
            token: e,
            payment_method: t,
            [r]: e,
            isSavedToken: !0,
          });
        }
        const n = (0, T.select)($t).getActivePaymentMethod();
        (n && a.includes(n)) ||
          ((0, T.dispatch)($t).__internalSetPaymentIdle(),
          (0, T.dispatch)($t).__internalSetActivePaymentMethod(t[0]));
      },
      ns = window.wp.deprecated;
    var os = r.n(ns);
    const cs = (e) =>
        [
          "first_name",
          "last_name",
          "company",
          "address_1",
          "address_2",
          "city",
          "state",
          "postcode",
          "country",
          "phone",
        ].every((t) => Fe(e, t)),
      ls = (e) => cs(e) && Fe(e, "email"),
      ds =
        (e) =>
        ({ registry: t }) => {
          const { createErrorNotice: r, removeNotice: a } = t.dispatch(v.store);
          e
            ? r(e, {
                id: "wc-express-payment-error",
                context: Ct.EXPRESS_PAYMENTS,
              })
            : a("wc-express-payment-error", Ct.EXPRESS_PAYMENTS);
        },
      us =
        (e, t) =>
        ({ dispatch: r, registry: a }) => {
          const { createErrorNotice: s, removeNotice: i } =
            a.dispatch("core/notices");
          return (
            i("wc-payment-error", Ct.PAYMENTS),
            ea(e, "payment_setup", {}).then((e) => {
              let i, n, o, c;
              e.forEach((e) => {
                Dt(e) && (i = e), (Ot(e) || Mt(e)) && (n = e);
                const {
                  billingAddress: t,
                  billingData: r,
                  shippingAddress: a,
                  shippingData: s,
                } = (null == e ? void 0 : e.meta) || {};
                (o = t),
                  (c = a),
                  r &&
                    ((o = r),
                    os()(
                      "returning billingData from an onPaymentProcessing observer in WooCommerce Blocks",
                      {
                        version: "9.5.0",
                        alternative: "billingAddress",
                        link: "https://github.com/woocommerce/woocommerce-blocks/pull/6369",
                      }
                    )),
                  Fe(s, "address") &&
                    s.address &&
                    ((c = s.address),
                    os()(
                      "returning shippingData from an onPaymentProcessing observer in WooCommerce Blocks",
                      {
                        version: "9.5.0",
                        alternative: "shippingAddress",
                        link: "https://github.com/woocommerce/woocommerce-blocks/pull/8163",
                      }
                    ));
              });
              const { setBillingAddress: l, setShippingAddress: d } =
                a.dispatch(Wt);
              if (Jr(i) && !n) {
                var u;
                const { paymentMethodData: e } =
                  (null === (u = i) || void 0 === u ? void 0 : u.meta) || {};
                ls(o) && l(o),
                  cs(c) && d(c),
                  r.__internalSetPaymentMethodData(Be(e) ? e : {}),
                  r.__internalSetPaymentReady();
              } else if (Mt(n)) {
                var p;
                const { paymentMethodData: e } =
                  (null === (p = n) || void 0 === p ? void 0 : p.meta) || {};
                if (Fe(n, "message") && fr(n.message) && n.message.length) {
                  let e = Ct.PAYMENTS;
                  Fe(n, "messageContext") &&
                    fr(n.messageContext) &&
                    n.messageContext.length &&
                    (e = n.messageContext),
                    s(n.message, {
                      id: "wc-payment-error",
                      isDismissible: !1,
                      context: e,
                    });
                }
                ls(o) && l(o),
                  r.__internalSetPaymentMethodData(Be(e) ? e : {}),
                  r.__internalSetPaymentError();
              } else if (Ot(n)) {
                if (Fe(n, "message") && fr(n.message) && n.message.length) {
                  let e = Ct.PAYMENTS;
                  Fe(n, "messageContext") &&
                    fr(n.messageContext) &&
                    n.messageContext.length &&
                    (e = n.messageContext),
                    s(n.message, {
                      id: "wc-payment-error",
                      isDismissible: !1,
                      context: e,
                    });
                }
                r.__internalSetPaymentError(),
                  (_ = n.validationErrors),
                  Be(_) &&
                    Object.entries(_).every(([e, t]) => {
                      return (
                        fr(e) &&
                        Be((r = t)) &&
                        Fe(r, "message") &&
                        Fe(r, "hidden") &&
                        fr(r.message) &&
                        "boolean" == typeof r.hidden
                      );
                      var r;
                    }) &&
                    t(n.validationErrors);
              } else r.__internalSetPaymentReady();
              var _;
            })
          );
        },
      ps = () => ({ type: Wa.SET_PAYMENT_IDLE }),
      _s = () => ({ type: Wa.SET_EXPRESS_PAYMENT_STARTED }),
      ms = () => ({ type: Wa.SET_PAYMENT_PROCESSING }),
      hs = () => ({ type: Wa.SET_PAYMENT_ERROR }),
      ys = () => ({ type: Wa.SET_PAYMENT_READY }),
      Es =
        (e) =>
        async ({ select: t, dispatch: r }) => {
          const a = t.getAvailablePaymentMethods();
          e && (await is(a)),
            r({ type: Wa.SET_PAYMENT_METHODS_INITIALIZED, initialized: e });
        },
      gs = (e) => ({
        type: Wa.SET_EXPRESS_PAYMENT_METHODS_INITIALIZED,
        initialized: e,
      }),
      Ss = (e) => ({
        type: Wa.SET_SHOULD_SAVE_PAYMENT_METHOD,
        shouldSavePaymentMethod: e,
      }),
      fs = (e, t = {}) => ({
        type: Wa.SET_ACTIVE_PAYMENT_METHOD,
        activePaymentMethod: e,
        paymentMethodData: t,
      }),
      vs = (e = {}) => ({
        type: Wa.SET_PAYMENT_METHOD_DATA,
        paymentMethodData: e,
      }),
      Ts = (e) => ({ type: Wa.SET_PAYMENT_RESULT, data: e }),
      As =
        (e) =>
        async ({ dispatch: t, select: r }) => {
          r.getActivePaymentMethod() in e || (await is(e)),
            t({ type: Wa.SET_AVAILABLE_PAYMENT_METHODS, paymentMethods: e });
        },
      Ps = (e) => ({
        type: Wa.SET_AVAILABLE_EXPRESS_PAYMENT_METHODS,
        paymentMethods: e,
      }),
      bs = (e) => ({ type: Wa.REMOVE_AVAILABLE_PAYMENT_METHOD, name: e }),
      Rs = (e) => ({
        type: Wa.REMOVE_AVAILABLE_EXPRESS_PAYMENT_METHOD,
        name: e,
      });
    function ws() {
      return async ({ select: e, dispatch: t }) => {
        const r = await ss(!0),
          a = await ss(!1),
          {
            paymentMethodsInitialized: s,
            expressPaymentMethodsInitialized: i,
          } = e;
        a && !s() && t(Es(!0)), r && !i() && t(gs(!0));
      };
    }
    const Cs = {};
    (0, w.getSetting)("globalPaymentMethods") &&
      (0, w.getSetting)("globalPaymentMethods").forEach((e) => {
        Cs[e.id] = e.title;
      });
    const Is = (e) => (
        os()("isPaymentPristine", {
          since: "9.6.0",
          alternative: "isPaymentIdle",
          plugin: "WooCommerce Blocks",
          link: "https://github.com/woocommerce/woocommerce-blocks/pull/8110",
        }),
        e.status === Gt.IDLE
      ),
      Ds = (e) => e.status === Gt.IDLE,
      Os = (e) => (
        os()("isPaymentStarted", {
          since: "9.6.0",
          alternative: "isExpressPaymentStarted",
          plugin: "WooCommerce Blocks",
          link: "https://github.com/woocommerce/woocommerce-blocks/pull/8110",
        }),
        e.status === Gt.EXPRESS_STARTED
      ),
      Ms = (e) => e.status === Gt.EXPRESS_STARTED,
      ks = (e) => e.status === Gt.PROCESSING,
      Ns = (e) => e.status === Gt.READY,
      xs = (e) => (
        os()("isPaymentSuccess", {
          since: "9.6.0",
          alternative: "isPaymentReady",
          plugin: "WooCommerce Blocks",
          link: "https://github.com/woocommerce/woocommerce-blocks/pull/8110",
        }),
        e.status === Gt.READY
      ),
      Ls = (e) => e.status === Gt.ERROR,
      Ys = (e) => (
        os()("isPaymentFailed", {
          since: "9.6.0",
          plugin: "WooCommerce Blocks",
          link: "https://github.com/woocommerce/woocommerce-blocks/pull/8110",
        }),
        e.status === Gt.ERROR
      ),
      Us = (e) =>
        Object.keys(e.availableExpressPaymentMethods).includes(
          e.activePaymentMethod
        ),
      js = (e) =>
        "object" == typeof e.paymentMethodData &&
        Fe(e.paymentMethodData, "token")
          ? e.paymentMethodData.token + ""
          : "",
      Hs = (e) => e.activePaymentMethod,
      Vs = (e) => e.availablePaymentMethods,
      qs = (e) => e.availableExpressPaymentMethods,
      Bs = (e) => e.paymentMethodData,
      Fs = (e) => {
        const {
          availablePaymentMethods: t,
          availableExpressPaymentMethods: r,
          paymentMethodsInitialized: a,
          expressPaymentMethodsInitialized: s,
        } = e;
        return a && s
          ? Object.fromEntries(
              Object.entries(Cs).filter(([e]) => !(e in { ...t, ...r }))
            )
          : {};
      },
      $s = (e) => e.savedPaymentMethods,
      Gs = (e) =>
        ((e = [], t) => {
          if (0 === e.length) return {};
          const r = (0, Ja.getPaymentMethods)(),
            a = Object.fromEntries(e.map((e) => [e, r[e]])),
            s = Object.keys(t),
            i = {};
          return (
            s.forEach((e) => {
              const r = t[e].filter(({ method: { gateway: e } }) => {
                var t;
                return (
                  e in a &&
                  (null === (t = a[e].supports) || void 0 === t
                    ? void 0
                    : t.showSavedCards)
                );
              });
              r.length && (i[e] = r);
            }),
            i
          );
        })(Object.keys(e.availablePaymentMethods), e.savedPaymentMethods),
      zs = (e) => e.paymentMethodsInitialized,
      Ks = (e) => e.expressPaymentMethodsInitialized,
      Xs = (e) => (
        os()("getCurrentStatus", {
          since: "8.9.0",
          alternative: "isPaymentIdle, isPaymentProcessing, hasPaymentError",
          plugin: "WooCommerce Blocks",
          link: "https://github.com/woocommerce/woocommerce-blocks/pull/7666",
        }),
        {
          get isPristine() {
            return (
              os()("isPristine", {
                since: "9.6.0",
                alternative: "isIdle",
                plugin: "WooCommerce Blocks",
              }),
              Ds(e)
            );
          },
          isIdle: Ds(e),
          isStarted: Ms(e),
          isProcessing: ks(e),
          get isFinished() {
            return (
              os()("isFinished", {
                since: "9.6.0",
                plugin: "WooCommerce Blocks",
                link: "https://github.com/woocommerce/woocommerce-blocks/pull/8110",
              }),
              Ls(e) || Ns(e)
            );
          },
          hasError: Ls(e),
          get hasFailed() {
            return (
              os()("hasFailed", {
                since: "9.6.0",
                plugin: "WooCommerce Blocks",
                link: "https://github.com/woocommerce/woocommerce-blocks/pull/8110",
              }),
              Ls(e)
            );
          },
          get isSuccessful() {
            return (
              os()("isSuccessful", {
                since: "9.6.0",
                plugin: "WooCommerce Blocks",
                link: "https://github.com/woocommerce/woocommerce-blocks/pull/8110",
              }),
              Ns(e)
            );
          },
          isDoingExpressPayment: Us(e),
        }
      ),
      Qs = (e) => e.shouldSavePaymentMethod,
      Ws = (e) => e.paymentResult,
      Zs = (e) => e,
      Js = {
        reducer: (e = Qa, t) => {
          let r = e;
          switch (t.type) {
            case Wa.SET_PAYMENT_IDLE:
              r = { ...e, status: Gt.IDLE };
              break;
            case Wa.SET_EXPRESS_PAYMENT_STARTED:
              r = { ...e, status: Gt.EXPRESS_STARTED };
              break;
            case Wa.SET_PAYMENT_PROCESSING:
              r = { ...e, status: Gt.PROCESSING };
              break;
            case Wa.SET_PAYMENT_READY:
              r = { ...e, status: Gt.READY };
              break;
            case Wa.SET_PAYMENT_ERROR:
              r = { ...e, status: Gt.ERROR };
              break;
            case Wa.SET_SHOULD_SAVE_PAYMENT_METHOD:
              r = { ...e, shouldSavePaymentMethod: t.shouldSavePaymentMethod };
              break;
            case Wa.SET_PAYMENT_METHOD_DATA:
              r = { ...e, paymentMethodData: t.paymentMethodData };
              break;
            case Wa.SET_PAYMENT_RESULT:
              r = { ...e, paymentResult: t.data };
              break;
            case Wa.REMOVE_AVAILABLE_PAYMENT_METHOD:
              const a = { ...e.availablePaymentMethods };
              delete a[t.name],
                (r = { ...e, availablePaymentMethods: { ...a } });
              break;
            case Wa.REMOVE_AVAILABLE_EXPRESS_PAYMENT_METHOD:
              const s = { ...e.availablePaymentMethods };
              delete s[t.name],
                (r = { ...e, availableExpressPaymentMethods: { ...s } });
              break;
            case Wa.SET_PAYMENT_METHODS_INITIALIZED:
              r = { ...e, paymentMethodsInitialized: t.initialized };
              break;
            case Wa.SET_EXPRESS_PAYMENT_METHODS_INITIALIZED:
              r = { ...e, expressPaymentMethodsInitialized: t.initialized };
              break;
            case Wa.SET_AVAILABLE_PAYMENT_METHODS:
              r = { ...e, availablePaymentMethods: t.paymentMethods };
              break;
            case Wa.SET_AVAILABLE_EXPRESS_PAYMENT_METHODS:
              r = { ...e, availableExpressPaymentMethods: t.paymentMethods };
              break;
            case Wa.SET_ACTIVE_PAYMENT_METHOD:
              const i =
                "object" == typeof e.paymentMethodData &&
                Fe(t.paymentMethodData, "token")
                  ? t.paymentMethodData.token + ""
                  : "";
              r = {
                ...e,
                activeSavedToken: i,
                activePaymentMethod: t.activePaymentMethod,
                paymentMethodData: t.paymentMethodData || e.paymentMethodData,
              };
              break;
            default:
              return r;
          }
          return r;
        },
        selectors: u,
        actions: d,
        controls: { ...A.controls, ...qe },
        __experimentalUseThunks: !0,
      },
      ei = (0, T.createReduxStore)($t, Js);
    (0, T.register)(ei);
    const ti = $t,
      ri = "wc/store/query-state",
      ai = (e, t) => (void 0 === e[t] ? null : e[t]),
      si = (e, t, r, a = {}) => {
        let s = ai(e, t);
        return null === s
          ? a
          : ((s = JSON.parse(s)), void 0 !== s[r] ? s[r] : a);
      },
      ii = (e, t, r = {}) => {
        const a = ai(e, t);
        return null === a ? r : JSON.parse(a);
      },
      ni = "SET_QUERY_KEY_VALUE",
      oi = "SET_QUERY_CONTEXT_VALUE",
      ci = (e, t, r) => ({ type: ni, context: e, queryKey: t, value: r }),
      li = (e, t) => ({ type: oi, context: e, value: t }),
      di = (0, T.createReduxStore)(ri, {
        reducer: (e = {}, t) => {
          const { type: r, context: a, queryKey: s, value: i } = t,
            n = ai(e, a);
          let o;
          switch (r) {
            case ni:
              const t = null !== n ? JSON.parse(n) : {};
              (t[s] = i),
                (o = JSON.stringify(t)),
                n !== o && (e = { ...e, [a]: o });
              break;
            case oi:
              (o = JSON.stringify(i)), n !== o && (e = { ...e, [a]: o });
          }
          return e;
        },
        actions: _,
        selectors: p,
      });
    (0, T.register)(di);
    const ui = ri,
      pi = (0, T.createRegistrySelector)((e) => (t, r, a, s = []) => {
        const i = e(Ba).hasFinishedResolution("getRoutes", [r]);
        let n = "";
        if (
          ((t = t.routes)[r]
            ? t[r][a] ||
              (n = (0, P.sprintf)(
                "There is no route for the given resource name (%s) in the store",
                a
              ))
            : (n = (0, P.sprintf)(
                "There is no route for the given namespace (%s) in the store",
                r
              )),
          "" !== n)
        ) {
          if (i) throw new Error(n);
          return "";
        }
        const o = ((e, t = []) => {
          const r = (e = Object.entries(e)).find(
              ([, e]) => t.length === e.length
            ),
            [a, s] = r || [];
          return a
            ? 0 === t.length
              ? a
              : ((e, t, r) => (
                  t.forEach((t, a) => {
                    e = e.replace(`{${t}}`, r[a]);
                  }),
                  e
                ))(a, s, t)
            : "";
        })(t[r][a], s);
        if ("" === o && i)
          throw new Error(
            (0, P.sprintf)(
              "While there is a route for the given namespace (%1$s) and resource name (%2$s), there is no route utilizing the number of ids you included in the select arguments. The available routes are: (%3$s)",
              r,
              a,
              JSON.stringify(t[r][a])
            )
          );
        return o;
      }),
      _i = (0, T.createRegistrySelector)((e) => (t, r) => {
        const a = e(Ba).hasFinishedResolution("getRoutes", [r]),
          s = t.routes[r];
        if (!s) {
          if (a)
            throw new Error(
              (0, P.sprintf)(
                "There is no route for the given namespace (%s) in the store",
                r
              )
            );
          return [];
        }
        let i = [];
        for (const e in s) i = [...i, ...Object.keys(s[e])];
        return i;
      }),
      mi = { RECEIVE_MODEL_ROUTES: "RECEIVE_MODEL_ROUTES" };
    function hi(e, t = C) {
      return { type: mi.RECEIVE_MODEL_ROUTES, routes: e, namespace: t };
    }
    function* yi(e) {
      yield T.controls.resolveSelect(Ba, "getRoutes", e);
    }
    function* Ei(e) {
      const t = yield (0, A.apiFetch)({ path: e }),
        r = t && t.routes ? Object.keys(t.routes) : [];
      yield hi(r, e);
    }
    const gi = (0, T.combineReducers)({
        routes: (e = {}, t) => {
          const { type: r, routes: a, namespace: s } = t;
          return (
            r === mi.RECEIVE_MODEL_ROUTES &&
              a.forEach((t) => {
                const r = ((e, t) =>
                  (t = t.replace(`${e}/`, "")).replace(
                    /\/\(\?P\<[a-z_]*\>\[\\*[a-z]\]\+\)/g,
                    ""
                  ))(s, t);
                if (r && r !== s) {
                  const a = ((e) => {
                      const t = e.match(/\<[a-z_]*\>/g);
                      return Array.isArray(t) && 0 !== t.length
                        ? t.map((e) => e.replace(/<|>/g, ""))
                        : [];
                    })(t),
                    i = ((e, t) =>
                      Array.isArray(t) && 0 !== t.length
                        ? (t.forEach((t) => {
                            const r = `\\(\\?P<${t}>.*?\\)`;
                            e = e.replace(new RegExp(r), `{${t}}`);
                          }),
                          e)
                        : e)(t, a);
                  Ma(e, [s, r, i]) || (e = za(e, [s, r, i], a));
                }
              }),
            e
          );
        },
      }),
      Si = (0, T.createReduxStore)(Ba, {
        reducer: gi,
        actions: h,
        controls: A.controls,
        selectors: m,
        resolvers: y,
      });
    (0, T.register)(Si);
    const fi = Ba;
    let vi = (function (e) {
      return (
        (e.REGISTER_CONTAINER = "REGISTER_CONTAINER"),
        (e.UNREGISTER_CONTAINER = "UNREGISTER_CONTAINER"),
        e
      );
    })({});
    const Ti = (e) => ({ type: vi.REGISTER_CONTAINER, containerContext: e }),
      Ai = (e) => ({ type: vi.UNREGISTER_CONTAINER, containerContext: e }),
      Pi = (e) => e.containers,
      bi = { containers: [] },
      Ri = "wc/store/store-notices",
      wi = {
        reducer: (e = bi, t) => {
          switch (t.type) {
            case vi.REGISTER_CONTAINER:
              return {
                ...e,
                containers: [...e.containers, t.containerContext],
              };
            case vi.UNREGISTER_CONTAINER:
              const r = e.containers.filter((e) => e !== t.containerContext);
              return { ...e, containers: r };
          }
          return e;
        },
        actions: E,
        selectors: g,
      },
      Ci = (0, T.createReduxStore)(Ri, wi);
    (0, T.register)(Ci);
    const Ii = Ri,
      Di = "SET_VALIDATION_ERRORS",
      Oi = "CLEAR_VALIDATION_ERROR",
      Mi = "CLEAR_VALIDATION_ERRORS",
      ki = "HIDE_VALIDATION_ERROR",
      Ni = "SHOW_VALIDATION_ERROR",
      xi = "SHOW_ALL_VALIDATION_ERRORS",
      Li = (e) => ({ type: Di, errors: e }),
      Yi = (e) => ({ type: Mi, errors: e }),
      Ui = () => (
        os()("clearAllValidationErrors", {
          version: "9.0.0",
          alternative: "clearValidationErrors",
          plugin: "WooCommerce Blocks",
          link: "https://github.com/woocommerce/woocommerce-blocks/pull/7601",
          hint: "Calling `clearValidationErrors` with no arguments will clear all validation errors.",
        }),
        Yi()
      ),
      ji = (e) => ({ type: Oi, error: e }),
      Hi = (e) => ({ type: ki, error: e }),
      Vi = (e) => ({ type: Ni, error: e }),
      qi = () => ({ type: xi }),
      Bi = (e, t) => e[t],
      Fi = (e, t) => {
        if (e.hasOwnProperty(t) && !e[t].hidden) return `validate-error-${t}`;
      },
      $i = (e) => Object.keys(e).length > 0,
      Gi = {
        reducer: (e = {}, t) => {
          const r = { ...e };
          switch (t.type) {
            case Di:
              return t.errors &&
                Object.entries(t.errors).some(
                  ([t, r]) =>
                    !(
                      "string" != typeof (null == r ? void 0 : r.message) ||
                      (e.hasOwnProperty(t) && bt()(e[t], r))
                    )
                )
                ? { ...e, ...t.errors }
                : e;
            case Oi:
              return fr(t.error) && r.hasOwnProperty(t.error)
                ? (delete r[t.error], r)
                : r;
            case Mi:
              const { errors: a } = t;
              return void 0 === a
                ? {}
                : Array.isArray(a)
                ? (a.forEach((e) => {
                    r.hasOwnProperty(e) && delete r[e];
                  }),
                  r)
                : r;
            case ki:
              return fr(t.error) && r.hasOwnProperty(t.error)
                ? ((r[t.error].hidden = !0), r)
                : r;
            case Ni:
              return fr(t.error) && r.hasOwnProperty(t.error)
                ? ((r[t.error].hidden = !1), r)
                : r;
            case xi:
              return (
                Object.keys(r).forEach((e) => {
                  r[e].hidden && (r[e].hidden = !1);
                }),
                { ...r }
              );
            default:
              return e;
          }
        },
        selectors: f,
        actions: S,
      },
      zi = (0, T.createReduxStore)(jt, Gi);
    (0, T.register)(zi);
    const Ki = jt;
  })(),
    ((this.wc = this.wc || {}).wcBlocksData = a);
})();
