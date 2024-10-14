import { openBlock as a, createElementBlock as r, normalizeClass as O, normalizeStyle as D, createElementVNode as u, withModifiers as B, createCommentVNode as p, reactive as ge, toDisplayString as A, Fragment as S, createBlock as V, Teleport as Ce, renderList as T, resolveComponent as we, createVNode as J, computed as E, withDirectives as re, vModelText as $e, vModelSelect as Ae, ref as g, watch as se, onMounted as Se, unref as m, renderSlot as oe, resolveDynamicComponent as Me, markRaw as ae } from "vue";
const De = ["v-slot"], Fe = ["innerHTML"], Le = {
  __name: "v3-d-table-td",
  props: {
    col: {
      type: Object,
      required: !0
    },
    row: {
      type: Object,
      required: !0
    },
    lastLeftFixedColIdx: {
      type: Number,
      default: -1
    },
    level: {
      type: Number,
      default: 0
    },
    emptyValue: {
      type: String,
      default: "-"
    }
  },
  emits: ["click", "dblclick", "mouseenter", "mouseleave"],
  setup(e) {
    const y = e, $ = function(l, n) {
      let h = n.renderer && n.renderer instanceof Function ? n.renderer(l, n) : l[n.code];
      return [void 0, null, ""].indexOf(h) > -1 && (h = y.emptyValue), h;
    }, M = function(l) {
      l.children && l.children.forEach((n) => {
        n._hidden_ = !l._expanded_, M(n);
      });
    }, d = function(l) {
      l.children && l.children.forEach((n) => {
        n._hidden_ = !0, d(n);
      });
    }, b = async function(l) {
      l._expanded_ = !l._expanded_, l._expanded_ ? (!l.children && y.col.srcGetChildren instanceof Function && (l._loading_ = !0, l.children = await y.col.srcGetChildren(l), l._loading_ = !1), M(l)) : d(l);
    };
    return (l, n) => e.col.type === "data" && !e.col.hidden ? (a(), r("td", {
      key: 0,
      class: O(e.col.cssClass),
      style: D(e.col.style),
      onClick: n[1] || (n[1] = (h) => l.$emit("click")),
      onDblclick: n[2] || (n[2] = (h) => l.$emit("dblclick")),
      onMouseenter: n[3] || (n[3] = (h) => l.$emit("mouseenter")),
      onMouseleave: n[4] || (n[4] = (h) => l.$emit("mouseleave"))
    }, [
      u("div", null, [
        e.col.expandable ? (a(), r("div", {
          key: 0,
          class: O(`v3-d-table-cell-lv lv${e.level}`)
        }, [
          e.row.children ? (a(), r("span", {
            key: 0,
            class: O({
              "v3-d-table-cell-expander": !0,
              loading: e.row._loading_,
              expanded: e.row._expanded_
            }),
            onClick: n[0] || (n[0] = B((h) => b(e.row), ["prevent", "stop"]))
          }, null, 2)) : p("", !0)
        ], 2)) : p("", !0),
        e.col.tpl ? (a(), r("div", {
          key: 1,
          class: "flex-fill",
          "v-slot": e.col.tpl
        }, null, 8, De)) : (a(), r("div", {
          key: 2,
          class: "flex-fill",
          innerHTML: $(e.row, e.col)
        }, null, 8, Fe))
      ])
    ], 38)) : p("", !0);
  }
}, Re = (e, y) => {
  const $ = e.__vccOpts || e;
  for (const [M, d] of y)
    $[M] = d;
  return $;
}, z = ge([]), Te = {
  name: "v3-d-table-actions",
  expose: ["close"],
  props: {
    actions: {
      type: Array,
      required: !0
    }
  },
  data: function() {
    return {
      expanded: !1,
      myActions: this.actions.filter((e) => e.canShow instanceof Function ? e.canShow(...e.params || []) : !0),
      dropdownStyle: {}
    };
  },
  methods: {
    closeOthers: function() {
      z.forEach((e) => {
        this !== e && e.close();
      });
    },
    handleAction: function(e) {
      this.closeOthers(), e.handle(...e.params || []), this.expanded = !1;
    },
    dropdown: function() {
      if (this.expanded) {
        this.expanded = !1;
        return;
      }
      this.closeOthers(), this.expanded = !0;
      let e = this.$refs.elActionBox.getBoundingClientRect(), y = this.$refs.elDropdown.getBoundingClientRect();
      this.dropdownStyle.left = window.innerWidth - (e.x + y.width) > 0 ? `${e.x}px` : `${e.x + e.width - y.width}px`, this.dropdownStyle.top = window.innerHeight - (e.y + y.height) > 0 ? `${e.y + e.height + 1}px` : `${e.y - y.height - 1}px`;
    },
    close: function() {
      this.expanded = !1;
    },
    docClickListener: function(e) {
      this.$refs.elContainer.contains(e.target) || (this.expanded = !1);
    }
  },
  mounted: function() {
    z.push(this), document.addEventListener("click", this.docClickListener);
  },
  unmounted: function() {
    z.splice(z.indexOf(this), 1), document.removeEventListener("click", this.docClickListener);
  }
}, Oe = {
  class: "v3-d-table-actions",
  ref: "elContainer"
}, Be = ["textContent"], Ne = {
  ref: "elActionBox",
  class: "v3-d-table-action-box"
}, Ee = ["textContent"], He = ["textContent", "onClick"];
function Pe(e, y, $, M, d, b) {
  return a(), r("div", Oe, [
    e.myActions.length === 1 ? (a(), r("a", {
      key: 0,
      class: "v3-d-table-action",
      textContent: A(e.myActions[0].label),
      onClick: y[0] || (y[0] = B((l) => b.handleAction(e.myActions[0]), ["stop"]))
    }, null, 8, Be)) : p("", !0),
    e.myActions.length > 1 ? (a(), r(S, { key: 1 }, [
      u("div", Ne, [
        u("a", {
          class: "v3-d-table-main-action",
          textContent: A(e.myActions[0].label),
          onClick: y[1] || (y[1] = B((l) => b.handleAction(e.myActions[0]), ["stop"]))
        }, null, 8, Ee),
        u("span", {
          class: "v3-d-table-actions-expander",
          onClick: y[2] || (y[2] = B((l) => b.dropdown(l), ["stop"]))
        })
      ], 512),
      (a(), V(Ce, { to: "body" }, [
        u("div", {
          ref: "elDropdown",
          class: O({ "v3-d-table-actions-dropdown": !0, expanded: e.expanded }),
          style: D(e.dropdownStyle)
        }, [
          (a(!0), r(S, null, T(e.myActions, (l, n) => (a(), r(S, null, [
            n > 0 ? (a(), r("a", {
              key: 0,
              class: "v3-d-table-actions-dropdown-action",
              textContent: A(l.label),
              onClick: B((h) => b.handleAction(l), ["stop"])
            }, null, 8, He)) : p("", !0)
          ], 64))), 256))
        ], 6)
      ]))
    ], 64)) : p("", !0)
  ], 512);
}
const de = /* @__PURE__ */ Re(Te, [["render", Pe]]), Ue = ["checked"], ze = ["textContent"], Ve = { key: 0 }, Ie = {
  __name: "v3-d-table-tr",
  props: {
    idx: {
      type: Number
    },
    row: {
      type: Object,
      required: !0
    },
    cols: {
      type: Array,
      required: !0
    },
    showAutoWidthCol: {
      type: Boolean,
      default: !1
    },
    emptyValue: {
      type: String,
      default: "-"
    },
    lastLeftFixedColIdx: {
      type: Number,
      default: -1
    },
    activatedRows: {
      type: Array,
      default: () => []
    },
    level: {
      type: Number,
      default: 0
    }
  },
  emits: [
    "click",
    "dblclick",
    "mouseenter",
    "mouseleave",
    "check",
    "cell-click",
    "cell-dblclick",
    "cell-mouseenter",
    "cell-mouseleave"
  ],
  setup(e, { emit: y }) {
    const $ = y, M = e, d = function(l) {
      $("check", M.row, l);
    }, b = function(l, n) {
      return l.map((h) => ({
        label: h.label,
        canShow: h.canShow,
        handle: h.handle,
        params: [n]
      }));
    };
    return (l, n) => {
      const h = we("v3-d-table-tr", !0);
      return a(), r(S, null, [
        u("tr", {
          ref: "tr",
          class: O({ activated: e.activatedRows.indexOf(e.row) > -1, hidden: e.row._hidden_ }),
          onClick: n[2] || (n[2] = (v) => l.$emit("click", e.row)),
          onDblclick: n[3] || (n[3] = (v) => l.$emit("dblclick", e.row))
        }, [
          (a(!0), r(S, null, T(e.cols, (v, k) => (a(), r(S, null, [
            v.type === "checkbox" ? (a(), r("td", {
              key: 0,
              class: "checkbox",
              style: D(v.style)
            }, [
              u("div", null, [
                u("input", {
                  type: "checkbox",
                  checked: e.row._checked_,
                  onClick: n[0] || (n[0] = B(() => {
                  }, ["stop"])),
                  onChange: n[1] || (n[1] = (C) => d(C.currentTarget.checked))
                }, null, 40, Ue)
              ])
            ], 4)) : p("", !0),
            v.type === "index" ? (a(), r("td", {
              key: 1,
              class: "index",
              style: D(v.style)
            }, [
              u("div", {
                textContent: A(e.idx + 1 || "")
              }, null, 8, ze)
            ], 4)) : p("", !0),
            v.type === "actions" ? (a(), r("td", {
              key: 2,
              class: "actions",
              style: D(v.style)
            }, [
              u("div", null, [
                J(de, {
                  actions: b(v.actions, e.row)
                }, null, 8, ["actions"])
              ])
            ], 4)) : p("", !0),
            J(Le, {
              ref_for: !0,
              ref: "td",
              col: v,
              row: e.row,
              "row-idx": e.idx,
              level: e.level,
              "empty-value": e.emptyValue,
              class: O({ data: !0, "last-fixed-left": e.lastLeftFixedColIdx === k }),
              onClick: (C) => l.$emit("cell-click", e.row, v),
              onDblclick: (C) => l.$emit("cell-dblclick", e.row, v),
              onMouseenter: (C) => l.$emit("cell-mouseenter", e.row, v),
              onMouseleave: (C) => l.$emit("cell-mouseleave", e.row, v)
            }, null, 8, ["col", "row", "row-idx", "level", "empty-value", "class", "onClick", "onDblclick", "onMouseenter", "onMouseleave"])
          ], 64))), 256)),
          e.showAutoWidthCol ? (a(), r("td", Ve)) : p("", !0)
        ], 34),
        e.row.children && e.row._expanded_ ? (a(!0), r(S, { key: 0 }, T(e.row.children, (v) => (a(), V(h, {
          row: v,
          cols: e.cols,
          "show-auto-width-col": e.showAutoWidthCol,
          "empty-value": e.emptyValue,
          "last-left-fixed-col-idx": e.lastLeftFixedColIdx,
          "activated-rows": e.activatedRows,
          level: e.level + 1,
          onClick: n[4] || (n[4] = (k) => l.$emit("click", k)),
          onDblclick: n[5] || (n[5] = (k) => l.$emit("dblclick", k)),
          onMouseenter: n[6] || (n[6] = (k) => l.$emit("mouseenter", k)),
          onMouseleave: n[7] || (n[7] = (k) => l.$emit("mouseleave", k)),
          onCheck: n[8] || (n[8] = (k, C) => l.$emit("check", k, C)),
          onCellClick: n[9] || (n[9] = (k, C) => l.$emit("cell-click", k, C)),
          onCellDblclick: n[10] || (n[10] = (k, C) => l.$emit("cell-dblclick", k, C)),
          onCellMouseenter: n[11] || (n[11] = (k, C) => l.$emit("cell-mouseenter", k, C)),
          onCellMouseleave: n[12] || (n[12] = (k, C) => l.$emit("cell-mouseleave", k, C))
        }, null, 8, ["row", "cols", "show-auto-width-col", "empty-value", "last-left-fixed-col-idx", "activated-rows", "level"]))), 256)) : p("", !0)
      ], 64);
    };
  }
}, qe = {
  __name: "v3-d-table-filter-text",
  props: {
    value: {
      type: String
    }
  },
  emits: ["update:value", "execute"],
  setup(e, { emit: y }) {
    const $ = y, M = e, d = E({
      get: () => M.value,
      set: (l) => $("update:value", l)
    }), b = function(l) {
      l.code === "Enter" && $("execute");
    };
    return (l, n) => re((a(), r("input", {
      type: "text",
      "onUpdate:modelValue": n[0] || (n[0] = (h) => d.value = h),
      onKeyup: b
    }, null, 544)), [
      [$e, d.value]
    ]);
  }
}, je = ["value", "textContent"], We = {
  __name: "v3-d-table-filter-select",
  props: {
    value: {
      type: String
    },
    options: {
      type: Array
    }
  },
  emits: ["update:value", "execute"],
  setup(e, { emit: y }) {
    const $ = y, M = e, d = E({
      get: () => M.value,
      set: (l) => $("update:value", l)
    }), b = function() {
      $("execute");
    };
    return (l, n) => re((a(), r("select", {
      "onUpdate:modelValue": n[0] || (n[0] = (h) => d.value = h),
      onChange: b
    }, [
      n[1] || (n[1] = u("option", { value: "" }, null, -1)),
      (a(!0), r(S, null, T(e.options, (h) => (a(), r("option", {
        value: h.value,
        textContent: A(h.label)
      }, null, 8, je))), 256))
    ], 544)), [
      [Ae, d.value]
    ]);
  }
}, Ge = { class: "v3-d-table-toolbar-left" }, Je = { class: "v3-d-table-toolbar-actions" }, Ke = ["textContent"], Xe = { class: "v3-d-table-toolbar-right" }, Qe = ["textContent"], Ye = ["textContent"], Ze = ["onClick"], _e = ["textContent"], et = {
  key: 0,
  class: "auto"
}, tt = { key: 0 }, lt = {
  key: 0,
  class: "auto"
}, nt = { key: 1 }, it = ["colspan"], st = ["textContent"], ot = { class: "v3-d-table-page-sizes" }, at = ["value", "selected", "textContent"], rt = ["textContent"], dt = { class: "paginator" }, ut = ["textContent"], ct = ["value", "selected", "textContent"], ft = ["textContent"], yt = {
  __name: "v3-d-table",
  props: {
    columns: {
      type: Array,
      required: !0
    },
    showToolbar: {
      type: Boolean,
      default: !0
    },
    toolbarActions: {
      type: Array,
      default: () => []
    },
    showColumnFilter: {
      type: Boolean,
      default: !0
    },
    customFilterTypes: {
      type: Object
    },
    data: {
      type: Array,
      default: []
    },
    srcUrl: {
      type: String
    },
    srcMethod: {
      type: String,
      default: "GET"
    },
    srcHeaders: {
      type: Object,
      default: { Accept: "application/json" }
    },
    srcParams: {
      type: Array
    },
    srcHandler: {
      type: Function
    },
    height: {
      type: String
    },
    autoLoad: {
      type: Boolean,
      default: !0
    },
    pageSize: {
      type: Number,
      default: 50
    },
    pageSizes: {
      type: Array,
      default: [20, 50, 100, 200]
    },
    page: {
      type: Number,
      default: 1
    },
    i18nCheckedStatus: {
      type: String,
      default: ":checked item(s) checked"
    },
    i18nPaging: {
      type: String,
      default: "Page :page of :page_count (:row_total items)"
    },
    i18nNoData: {
      type: String,
      default: "No matched data"
    },
    emptyValue: {
      type: String,
      default: "-"
    },
    i18nPrevPage: {
      type: String,
      default: "Prev"
    },
    i18nNextPage: {
      type: String,
      default: "Next"
    }
  },
  emits: [
    "row-click",
    "row-dblclick",
    "row-mouseenter",
    "row-mouseleave",
    "cell-click",
    "cell-dblclick",
    "cell-mouseenter",
    "cell-mouseleave",
    "update:page-size"
  ],
  setup(e, { expose: y, emit: $ }) {
    const M = $, d = e;
    let b = g([]), l = g([]), n = [], h = [], v = g([]), k = [], C = [], K = g(!1), P = g(!1), X = g(-1), H = g(0), ue = g(d.toolbarActions.map((t) => (t.params = [v.value], t))), ce = E(() => d.i18nCheckedStatus.replace(":checked", v.value.length).replace(":total", l.value.length)), x = g(1), w = g(d.pageSize), U = E(() => Math.ceil(H.value / w.value)), fe = E(() => {
      let t = [];
      for (let o = 1; o <= U.value; o++)
        t.push(o);
      return t;
    }), ve = E(() => d.i18nPaging.replace(":page_count", U.value).replace(":page", x.value).replace(":row_total", H.value)), L = [];
    const Q = g(), Y = g(), Z = g(), ye = g(), _ = g(), I = g();
    se(
      () => d.columns,
      (t) => {
        K.value = t.filter((s) => s.type === "checkbox").length > 0;
        let o = ["checkbox", "index"], i = -1;
        for (let s = 0; s < t.length; s++)
          if (t[s].fixed === "left")
            i = s;
          else if (o.indexOf(t[s].type) === -1)
            break;
        if (X.value = i, i !== -1)
          for (let s = 0; s < t.length; s++)
            t[s].type === "checkbox" ? (t[s].width = t[s].width || 40, t[s].fixed = "left") : t[s].type === "index" && (t[s].width = t[s].width || 60, t[s].fixed = "left");
        let f = [];
        for (let s = 0; s < t.length && t[s].fixed === "left"; s++)
          f[s] = f[s - 1] !== void 0 ? f[s - 1] + t[s - 1].width : 0;
        let c = [];
        for (let s = t.length - 1; s >= 0 && t[s].fixed === "right"; s--)
          c[s] += c[s + 1] || 0;
        const R = function(s) {
          let F = s.filter;
          const N = {
            select: { type: ae(We), op: "=" },
            text: { type: ae(qe), op: "like" },
            date: { type: "v3-d-table-filter-date-range", op: "date" }
          };
          return N[F.type] && (!F.op && (F.op = N[F.type].op), F.type = N[F.type].type), F.f = s.field || s.code, F.v = g(), F;
        };
        let ie = [];
        k = [], t.forEach((s, F) => {
          let N = s.filter ? R(s) : !1;
          N && k.push(N), ie.push({
            code: s.code || s.field,
            type: s.type || "data",
            field: s.field || !1,
            hidden: s.hidden || !1,
            title: s.title || !1,
            width: s.width || !1,
            sort: s.sort || !1,
            sortDir: s.sortDir || !1,
            renderer: s.renderer || !1,
            filter: N,
            expandable: s.expandable || !1,
            actions: s.actions || !1,
            cssClass: {
              data: s.type === "data" || s.type === void 0,
              "align-center": s.align === "center",
              "align-right": s.align === "right",
              sort: s.sort,
              asc: s.sortDir === "asc",
              desc: s.sortDir === "desc"
            },
            style: {
              left: s.fixed ? f[F] + "px" : "unset",
              right: s.fixed ? c[F] + "px" : "unset",
              position: s.fixed ? "sticky" : "unset",
              zIndex: s.fixed ? 2 : 1,
              width: s.width ? s.width + "px" : "auto"
            }
          }), s.width && (P.value = !0);
        }), b = g(ie);
      },
      { immediate: !0 }
    ), se(
      () => w.value,
      (t) => {
        ne(t);
      }
    );
    const q = function(t) {
      let o = [];
      return t.forEach((i) => {
        o.push(i), i.children && i.children.length > 0 && o.push(...q(i.children));
      }), o;
    }, j = function() {
      let t = !0, o = !1;
      q(l.value).forEach((i) => {
        i._checked_ ? o = !0 : t = !1;
      }), I.value[0].checked = t, I.value[0].indeterminate = !t && o;
    }, he = function(t) {
      q(l.value).forEach((o) => {
        o._checked_ = t, t ? v.value.push(o) : v.value.splice(v.value.indexOf(o), 1);
      });
    }, ee = function(t, o) {
      t._checked_ = o, o ? v.value.push(t) : v.value.splice(v.value.indexOf(t), 1), j();
    }, pe = function(t) {
      ee(t, !t._checked_), M("row-click", t);
    }, ke = function() {
      n = h.filter((t) => {
        let o = k.concat(C);
        for (let i = 0; i < o.length; i++) {
          let f = o[i];
          if (!(!t[f.f] || f.v.value === "" || f.v.value === null || f.v.value === void 0)) {
            if (f.op === "=" && t[f.f] + "" != f.v.value + "")
              return !1;
            if (f.op === "like" && (t[f.f] + "").indexOf(f.v.value + "") === -1)
              return !1;
            f.op;
          }
        }
        return !0;
      }), l.value = n.slice(0, w.value), H.value = n.length, x.value = 1;
    }, te = function() {
      d.srcUrl ? W() : ke();
    }, le = function(t) {
      l.value = t.data, H.value = t.total;
    }, W = function() {
      if (d.srcHandler instanceof Function)
        d.srcHandler(le, d);
      else {
        let t = new XMLHttpRequest(), o = d.srcUrl, i = "";
        d.srcMethod.toUpperCase() === "GET" ? o = d.srcUrl.indexOf("?") === -1 ? `${d.srcUrl}?p=${x.value}&ps=${w.value}` : `${d.srcUrl}&p=${x.value}&ps=${w.value}` : i = `p=${x.value}&ps=${w.value}`, t.open(d.srcMethod, o);
        for (let f in d.srcHeaders)
          t.setRequestHeader(f, d.srcHeaders[f]);
        t.onload = () => {
          le(JSON.parse(t.responseText));
        }, t.send(i);
      }
    }, me = function() {
      n.sort((t, o) => {
        for (let i = 0; i < L.length; i++) {
          let f = t[L[i].field], c = o[L[i].field];
          if (L[i].gbk && (f = f && f.toString().localeCompare(c), c = c && c.toString().localeCompare(f)), f !== c)
            return L[i].dir === "asc" ? f > c ? 1 : -1 : f < c ? 1 : -1;
        }
        return 0;
      }), l.value = n.slice((x.value - 1) * w.value, x.value * w.value);
    }, xe = function() {
    }, be = function(t) {
      t.sort && (L.filter((o) => o.field === t.field).length > 0 ? (L.sort((o, i) => o.field === t.code ? -1 : i.field === t.code ? 1 : 0), L[0].dir = L[0].dir === "asc" ? "desc" : "asc") : L.unshift({ field: t.code, dir: "asc", gbk: t.gbk || !1 }), t.sortDir = L[0].dir, t.cssClass.asc = t.sortDir === "asc", t.cssClass.desc = t.sortDir === "desc", d.srcUrl ? xe() : me());
    }, G = function(t) {
      t < 1 || t > U.value || (x.value = t, d.srcUrl ? W() : (l.value = n.slice((x.value - 1) * w.value, x.value * w.value), j()));
    }, ne = function(t) {
      w.value = parseInt(t), x.value = 1, l.value = n.slice((x.value - 1) * w.value, x.value * w.value), j(), M("update:page-size", w.value);
    };
    return y({ filter: te }), d.autoLoad && (d.srcUrl ? W() : (h = d.data, n = d.data, l.value = n.slice((x.value - 1) * w.value, x.value * w.value), H.value = n.length)), Se(() => {
      d.height && (Q.value.style.height = `calc(100% - ${_.value.offsetHeight}px)`, Z.value.style.top = `${Y.value.offsetHeight}px`);
    }), (t, o) => (a(), r("div", {
      class: "v3-d-table",
      style: D({ height: e.height }),
      ref: "elTable"
    }, [
      u("div", {
        class: "v3-d-table-main",
        ref_key: "elMain",
        ref: Q
      }, [
        e.showToolbar ? (a(), r("div", {
          key: 0,
          class: "v3-d-table-toolbar",
          ref_key: "elToolbar",
          ref: Y
        }, [
          u("div", Ge, [
            u("div", Je, [
              J(de, { actions: m(ue) }, null, 8, ["actions"]),
              m(K) ? (a(), r("div", {
                key: 0,
                class: "v3-d-table-header-checked-status",
                textContent: A(m(ce))
              }, null, 8, Ke)) : p("", !0)
            ]),
            u("div", null, [
              oe(t.$slots, "toolbar-left")
            ])
          ]),
          u("div", Xe, [
            oe(t.$slots, "toolbar-right")
          ])
        ], 512)) : p("", !0),
        u("div", {
          class: "v3-d-table-header",
          ref_key: "elHeader",
          ref: Z
        }, [
          u("table", null, [
            u("thead", null, [
              u("tr", null, [
                (a(!0), r(S, null, T(m(b), (i, f) => (a(), r(S, null, [
                  i.type === "checkbox" ? (a(), r("th", {
                    key: 0,
                    class: "checkbox",
                    style: D(i.style)
                  }, [
                    u("div", null, [
                      u("input", {
                        ref_for: !0,
                        ref_key: "elCheckAll",
                        ref: I,
                        type: "checkbox",
                        onClick: o[0] || (o[0] = (c) => he(c.currentTarget.checked))
                      }, null, 512)
                    ])
                  ], 4)) : p("", !0),
                  i.type === "index" ? (a(), r("th", {
                    key: 1,
                    class: "index",
                    style: D(i.style)
                  }, [
                    u("div", {
                      textContent: A(i.title || "#")
                    }, null, 8, Qe)
                  ], 4)) : p("", !0),
                  i.type === "actions" ? (a(), r("th", {
                    key: 2,
                    class: "actions",
                    style: D(i.style)
                  }, [
                    u("div", {
                      textContent: A(i.title || "")
                    }, null, 8, Ye)
                  ], 4)) : p("", !0),
                  i.type === "data" && !i.hidden ? (a(), r("th", {
                    key: 3,
                    class: O(i.cssClass),
                    style: D(i.style)
                  }, [
                    u("div", {
                      onClick: (c) => be(i)
                    }, [
                      u("span", {
                        textContent: A(i.title)
                      }, null, 8, _e)
                    ], 8, Ze)
                  ], 6)) : p("", !0)
                ], 64))), 256)),
                m(P) ? (a(), r("th", et)) : p("", !0)
              ]),
              e.showColumnFilter ? (a(), r("tr", tt, [
                (a(!0), r(S, null, T(m(b), (i, f) => (a(), r(S, null, [
                  i.type === "checkbox" ? (a(), r("th", {
                    key: 0,
                    class: "checkbox",
                    style: D(i.style)
                  }, null, 4)) : p("", !0),
                  i.type === "index" ? (a(), r("th", {
                    key: 1,
                    class: "index",
                    style: D(i.style)
                  }, null, 4)) : p("", !0),
                  i.type === "actions" ? (a(), r("th", {
                    key: 2,
                    class: "actions",
                    style: D(i.style)
                  }, null, 4)) : p("", !0),
                  i.type === "data" && !i.hidden ? (a(), r("th", {
                    key: 3,
                    style: D(i.style)
                  }, [
                    i.filter ? (a(), V(Me(i.filter.type), {
                      key: 0,
                      props: i.filter.params,
                      value: i.filter.v,
                      "onUpdate:value": (c) => i.filter.v = c,
                      onExecute: te
                    }, null, 40, ["props", "value", "onUpdate:value"])) : p("", !0)
                  ], 4)) : p("", !0)
                ], 64))), 256)),
                m(P) ? (a(), r("th", lt)) : p("", !0)
              ])) : p("", !0)
            ])
          ])
        ], 512),
        u("div", {
          class: "v3-d-table-body",
          ref_key: "elBody",
          ref: ye
        }, [
          u("table", null, [
            u("tbody", null, [
              m(l).length > 0 ? (a(!0), r(S, { key: 0 }, T(m(l), (i, f) => (a(), V(Ie, {
                idx: f,
                row: i,
                cols: m(b),
                "show-auto-width-col": m(P),
                "empty-value": e.emptyValue,
                "last-left-fixed-col-idx": m(X),
                "activated-rows": m(v),
                onClick: o[1] || (o[1] = (c) => pe(c)),
                onDblclick: o[2] || (o[2] = (c) => t.$emit("row-dblclick", c)),
                onMouseenter: o[3] || (o[3] = (c) => t.$emit("row-mouseenter", c)),
                onMouseleave: o[4] || (o[4] = (c) => t.$emit("row-mouseleave", c)),
                onCheck: o[5] || (o[5] = (c, R) => ee(c, R)),
                onCellClick: o[6] || (o[6] = (c, R) => t.$emit("cell-click", c, R)),
                onCellDblclick: o[7] || (o[7] = (c, R) => t.$emit("cell-dblclick", c, R)),
                onCellMouseenter: o[8] || (o[8] = (c, R) => t.$emit("cell-mouseenter", c, R)),
                onCellMouseleave: o[9] || (o[9] = (c, R) => t.$emit("cell-mouseleave", c, R))
              }, null, 8, ["idx", "row", "cols", "show-auto-width-col", "empty-value", "last-left-fixed-col-idx", "activated-rows"]))), 256)) : (a(), r("tr", nt, [
                u("td", {
                  colspan: m(b).length,
                  class: "no-data"
                }, [
                  u("div", {
                    textContent: A(e.i18nNoData)
                  }, null, 8, st)
                ], 8, it)
              ]))
            ])
          ])
        ], 512)
      ], 512),
      u("div", {
        class: "v3-d-table-footer",
        ref_key: "elFooter",
        ref: _
      }, [
        u("div", ot, [
          u("select", {
            onChange: o[10] || (o[10] = (i) => ne(i.currentTarget.value))
          }, [
            (a(!0), r(S, null, T(e.pageSizes, (i) => (a(), r("option", {
              value: i,
              selected: i === m(w),
              textContent: A(i)
            }, null, 8, at))), 256))
          ], 32)
        ]),
        u("div", {
          textContent: A(m(ve))
        }, null, 8, rt),
        u("div", dt, [
          u("a", {
            href: "#",
            class: O({ disabled: m(x) === 1 }),
            textContent: A(d.i18nPrevPage),
            onClick: o[11] || (o[11] = B((i) => G(m(x) - 1), ["prevent"]))
          }, null, 10, ut),
          u("select", {
            onChange: o[12] || (o[12] = (i) => G(i.currentTarget.value))
          }, [
            (a(!0), r(S, null, T(m(fe), (i) => (a(), r("option", {
              value: i,
              selected: i === m(x),
              textContent: A(i)
            }, null, 8, ct))), 256))
          ], 32),
          u("a", {
            href: "#",
            class: O({ disabled: m(x) === m(U) }),
            textContent: A(d.i18nNextPage),
            onClick: o[13] || (o[13] = B((i) => G(m(x) + 1), ["prevent"]))
          }, null, 10, ft)
        ])
      ], 512),
      o[14] || (o[14] = u("div", { class: "v3-d-table-loader" }, null, -1))
    ], 4));
  }
};
export {
  yt as v3DTable
};
