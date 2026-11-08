/**
 * dsh-astra-effort - web client half.
 *
 * Replaces the composer's model/effort seat (`conversation.input.model`) with the
 * Astra card: effort name, model row, and a filled slider whose particle field
 * speeds up with the selected reasoning effort. Data comes from the host half
 * over its two loopback routes.
 */
window.__ModuleLoader__.load({
  id: "dsh-astra-effort",
  factory: (require) => {
    var module = { exports: {} }
function __dshClamp() {
  try {
    var VS = window.__dshVS;
    if (!VS) return null;
    var v = VS.getVisibleViewport ? VS.getVisibleViewport() : null;
    if (!v || !(v.w > 0 && v.h > 0)) return null;
    return v;
  } catch (e) { return null; }
}
function __dshVis(n, v) { var z = (v && v.zoom) ? v.zoom : 1; return n * z; }
function __dshLayout(n, v) { var z = (v && v.zoom) ? v.zoom : 1; return z > 0 ? n / z : n; }
function __dshMax(n, m, v) { var z = (v && v.zoom) ? v.zoom : 1; return (n > 0 && z > 0) ? n / z : n; }

/* Shared clamp helper for every patched bundle. Returns the box to clamp against, or
   null -> caller runs its ORIGINAL clamp. */
    var exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" })

    const React = require("react")

    const CSS = [
      ".astraX-root{min-width:0;position:relative}",
      ".astraX-trigger{position:relative;z-index:1200;min-width:0;max-width:min(360px,45cqw);height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:999px;corner-shape:round;outline:none;align-items:center;gap:4px;padding:0 6px 0 10px;font-size:13px;font-weight:500;line-height:20px;display:flex}",
      ".astraX-trigger:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}",
      ".astraX-trigger:disabled{color:var(--dsw-alias-label-dimmed);cursor:default}",
      ".astraX-triggerLabel{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}",
      ".astraX-triggerEffort{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--dsw-alias-label-caption);flex-shrink:1000;overflow:hidden}",
      ".astraX-chevron{color:var(--dsw-alias-label-caption);flex:none;transition:transform .12s}",
      ".astraX-chevronOpen{transform:rotate(180deg)}",
      ".astraX-menu{z-index:1100;background:#fff!important;opacity:1!important;box-shadow:0 8px 32px rgba(0,0,0,.12),0 2px 8px rgba(0,0,0,.06);color:var(--dsw-alias-label-primary);border:0;border-radius:26px!important;corner-shape:round;flex-direction:column;width:min(360px,100vw - 32px);max-height:min(420px,100vh - 96px);padding:12px 14px;display:flex;position:fixed;overflow:hidden;box-sizing:border-box;transform-origin:bottom right}",
      ".astraX-menuClosing{pointer-events:none}",
      "body[data-ds-dark-theme] .astraX-menu{background:#26262a!important;box-shadow:0 12px 40px rgba(0,0,0,.55)}",
      ".astraX-headRow{display:flex;align-items:center;justify-content:center;min-height:24px}",
      ".astraX-tier{color:#3b82f6;font-weight:600;font-size:16px;line-height:22px;background:none;border:none;padding:0;font-family:inherit}",
      "body[data-ds-dark-theme] .astraX-tier{color:#5b9bf8}",
      ".astraX-modelBtn{display:flex;align-items:center;justify-content:center;gap:4px;width:100%;background:none;border:none;cursor:pointer;padding:0;margin:5px 0 2px;font-family:inherit;text-align:center}",
      ".astraX-model{font-size:15px;line-height:22px;color:#4b5058;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      "body[data-ds-dark-theme] .astraX-model{color:#b9bcc4}",
      ".astraX-modelBtn:hover .astraX-model{color:var(--dsw-alias-label-primary)}",
      ".astraX-modelArrow{color:#a8aeb8;font-size:13px;line-height:1;flex:none;transition:transform .12s}",
      ".astraX-modelBtn:hover .astraX-modelArrow{color:#5a5f69;transform:translateX(2px)}",
      ".astraX-sliderRow{display:flex;padding:12px 0 4px}",
      ".astraX-sliderWrap{display:flex;flex-direction:column;gap:6px;flex:1;min-width:0}",
      ".astraX-slider{position:relative;width:100%;height:40px;border-radius:999px!important;corner-shape:round;cursor:pointer;touch-action:none;background:#dcdcdc;overflow:hidden!important}",
      "body[data-ds-dark-theme] .astraX-slider{background:#c8ccd2}",
      ".astraX-colorLayer{transition:clip-path .32s cubic-bezier(.3,1.1,.4,1);position:absolute;top:0;bottom:0;left:0;right:0;border-radius:999px!important;corner-shape:round;overflow:hidden;pointer-events:none;z-index:1;background:#4285f4}",
      // 拖动中圆球贴手指（无过渡），点击/松手时有平滑滑动
      ".astraX-drag .astraX-knob,.astraX-drag .astraX-colorLayer{transition:none}",
      ".astraX-star{position:absolute;border-radius:50%!important;corner-shape:round;background:#fff;opacity:.7;animation:astraX-tw 2.4s ease-in-out infinite}",
      "@keyframes astraX-tw{0%,100%{opacity:.25;transform:scale(.5)}50%{opacity:1;transform:scale(1.25)}}",
      ".astraX-spark{position:absolute;border-radius:50%!important;corner-shape:round;background:#fff;opacity:0;box-shadow:0 0 5px 1px rgba(255,255,255,.8);animation:astraX-spark 5s ease-in-out infinite}",
      "@keyframes astraX-spark{0%,100%{opacity:0}15%{opacity:1}45%{opacity:.4}70%{opacity:1}}",
      ".astraX-comet{position:absolute;width:3px;height:3px;border-radius:50%!important;corner-shape:round;background:#fff;opacity:0;box-shadow:0 0 6px 1px #ffffffd9;animation:astraX-comet 9s linear infinite}",
      "@keyframes astraX-comet{0%{left:-2%;opacity:0}6%{opacity:1}70%{opacity:.9}100%{left:102%;opacity:0}}",
      ".astraX-trail{position:absolute;height:1px;border-radius:999px!important;corner-shape:round;background:linear-gradient(90deg,transparent,#ffffffcc);transform-origin:left center;opacity:0;animation:astraX-trail 7s linear infinite}",
      "@keyframes astraX-trail{0%{left:-16%;opacity:0}8%{opacity:.9}60%{opacity:.9}72%,100%{left:100%;opacity:0}}",
      ".astraX-dot{position:absolute;top:50%;border-radius:50%!important;corner-shape:round;transform:translate(-50%,-50%);background:#a9aeb8;pointer-events:none;z-index:2}",
      ".astraX-dotLit{background:#ffffff}",
      ".astraX-knob{position:absolute;top:50%;width:34px;height:34px;border-radius:50%!important;corner-shape:round!important;background:#fff;transform:translate(-50%,-50%);box-shadow:0 1px 3px rgba(0,0,0,.2),0 2px 6px rgba(0,0,0,.12);pointer-events:none;z-index:3;transition:left .32s cubic-bezier(.3,1.1,.4,1)}",
      ".astraX-sliderHint{display:flex;justify-content:space-between;color:#9aa0aa;font-size:11px;line-height:14px;padding:0 6px}",
      ".astraX-status{color:#9aa0aa;padding:12px 16px;font-size:13px;line-height:20px;text-align:center;background:#f2f3f5;border-radius:16px!important;corner-shape:round;margin:4px 0}",
      "body[data-ds-dark-theme] .astraX-status{background:#32333a}",
      ".astraX-error{background:var(--dsw-alias-interactive-bg-hover-danger);color:var(--dsw-alias-state-error-primary);border-radius:16px!important;corner-shape:round;margin:4px 0;padding:8px 12px;font-size:12px;line-height:18px}",
      ".astraX-pane{display:flex;flex-direction:column;min-height:0}",
      "@keyframes astraX-paneIn{from{opacity:0;transform:translateY(14px) scale(.94)}to{opacity:1;transform:translateY(0) scale(1)}}",
      ".astraX-rowIn{animation:astraX-rowIn .34s cubic-bezier(.2,.8,.3,1) both}",
      "@keyframes astraX-rowIn{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}",
      ".astraX-cell{box-sizing:border-box;width:auto;min-width:100%;height:40px;color:var(--dsw-alias-label-primary);cursor:pointer;text-align:left;background:0 0;border:none;border-radius:14px!important;corner-shape:round;align-items:center;gap:8px;padding:0 16px;font-size:14px;line-height:22px;display:flex;font-family:inherit}",
      ".astraX-cell:hover{background:var(--dsw-alias-interactive-bg-hover)}",
      ".astraX-cellLabel{white-space:nowrap;flex:none}",
      ".astraX-cellValue{text-overflow:ellipsis;white-space:nowrap;text-align:right;min-width:0;color:var(--dsw-alias-label-tertiary);flex:auto;overflow:hidden}",
      ".astraX-group{overflow-y:auto;min-height:0}",
      ".astraX-groupTitle{z-index:1;background:#fff;color:#9aa0aa;padding:6px 12px 3px;font-size:12px;font-weight:500;line-height:18px;position:sticky;top:0}",
      "body[data-ds-dark-theme] .astraX-groupTitle{background:#26262a}",
      ".astraX-option{box-sizing:border-box;width:auto;min-width:100%;min-height:44px;color:var(--dsw-alias-label-primary);text-align:left;cursor:pointer;background:0 0;border:none;border-radius:14px!important;corner-shape:round;outline:none;align-items:center;gap:8px;padding:7px 14px;display:flex;font-family:inherit}",
      ".astraX-option:hover{background:var(--dsw-alias-interactive-bg-hover)}",
      ".astraX-optionCopy{flex-direction:column;flex:1;min-width:0;display:flex}",
      ".astraX-optName{color:inherit;text-overflow:ellipsis;white-space:nowrap;font-size:14px;font-weight:500;line-height:20px;overflow:hidden}",
      ".astraX-optSub{color:#9aa0aa;font-size:12px;line-height:16px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".astraX-check{color:var(--dsw-alias-label-primary);flex:0 0 18px;place-items:center;display:grid}",
      "@media (prefers-reduced-motion:reduce){.astraX-star,.astraX-spark,.astraX-comet,.astraX-trail{animation:none!important;opacity:.7}.astraX-menu,.astraX-pane,.astraX-rowIn{animation:none!important;opacity:1!important}}",
    ].join("\n")

    function insertCssOnce() {
      if (typeof document === "undefined") return
      if (document.getElementById("astra-effort-css")) return
      const el = document.createElement("style")
      el.id = "astra-effort-css"
      el.textContent = CSS
      document.head.appendChild(el)
    }

    const STAR_FIELD = [
      { left: 8, top: 28, size: 2, dur: 2.2, delay: 0 },
      { left: 18, top: 64, size: 1.5, dur: 3.1, delay: 0.4 },
      { left: 28, top: 20, size: 1, dur: 2.6, delay: 1.1 },
      { left: 38, top: 54, size: 2, dur: 3.4, delay: 0.2 },
      { left: 48, top: 34, size: 1.5, dur: 2.1, delay: 1.6 },
      { left: 58, top: 70, size: 1, dur: 2.9, delay: 0.8 },
      { left: 67, top: 26, size: 2, dur: 3.3, delay: 1.3 },
      { left: 76, top: 60, size: 1.5, dur: 2.4, delay: 0.5 },
      { left: 85, top: 38, size: 1, dur: 3.0, delay: 1.0 },
      { left: 93, top: 56, size: 2, dur: 2.7, delay: 0.7 },
    ]
    const SPARKS = [
      { left: 22, top: 30, dur: 4.2, delay: 0.2 },
      { left: 44, top: 62, dur: 5.1, delay: 1.4 },
      { left: 62, top: 24, dur: 4.8, delay: 2.6 },
      { left: 80, top: 58, dur: 5.6, delay: 0.9 },
      { left: 94, top: 34, dur: 4.5, delay: 3.4 },
    ]
    const COMETS = [
      { top: 30, dur: 9, delay: 0 },
      { top: 62, dur: 13, delay: 4.5 },
    ]
    const TRAILS = [
      { top: 40, dur: 7, delay: 0, w: 14 },
      { top: 62, dur: 10, delay: 3.5, w: 10 },
    ]

    /**
     * 强度 → 颜色：低档位偏蓝 (#3b82f6)，高档位偏紫 (#8b5cf6)。
     * ratio 0..1 之间做 HSL 插值，色相从 217°(蓝) 平滑推到 262°(紫)。
     */
    function effortColor(ratio) {
      const t = Math.max(0, Math.min(1, ratio))
      const hue = 217 + (262 - 217) * t
      const sat = 91 - 8 * t
      const light = 61 - 4 * t
      return "hsl(" + hue.toFixed(1) + " " + sat.toFixed(1) + "% " + light.toFixed(1) + "%)"
    }

    function effortInfo(model, selection) {
      if (!model || !model.reasoning) return null
      const efforts = model.reasoning.efforts || []
      if (efforts.length === 0) return null
      const id = selection && selection.reasoningEffort !== undefined ? selection.reasoningEffort : model.reasoning.defaultEffort
      const index = id === undefined ? -1 : efforts.findIndex((e) => e.id === id)
      return { efforts: efforts, id: id, index: index, name: index >= 0 ? efforts[index].name : (id === undefined ? "默认" : id) }
    }

    async function api(path, body) {
      const res = await fetch(path, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body || {}),
      })
      let payload = null
      try {
        payload = await res.json()
      } catch (error) {
        payload = null
      }
      if (!res.ok) {
        const detail = payload && typeof payload.error === "string" ? payload.error : "HTTP " + res.status
        throw new Error(detail)
      }
      if (payload === null) throw new Error("empty response")
      return payload
    }

    function AstraPicker(props) {
      const locked = props.locked === true
      const sessionId = props.sessionId
      const useProjection = props.useProjection
      const projectedRaw = useProjection ? useProjection("modelSelection") : undefined
      const catalogState = React.useState(null)
      const catalog = catalogState[0]
      const setCatalog = catalogState[1]
      const currentState = React.useState(null)
      const localCurrent = currentState[0]
      const setLocalCurrent = currentState[1]
      const errorState = React.useState(null)
      const error = errorState[0]
      const setError = errorState[1]
      const openState = React.useState(false)
      const open = openState[0]
      const setOpen = openState[1]
      // 关闭时先播收起动画再卸载：open=false 后 visible 仍为 true 一小段时间
      const visibleState = React.useState(false)
      const visible = visibleState[0]
      const setVisible = visibleState[1]
      const paneState = React.useState("main")
      const pane = paneState[0]
      const setPane = paneState[1]
      const posState = React.useState(null)
      const pos = posState[0]
      const setPos = posState[1]
      const dragState = React.useState(null)
      const dragIdx = dragState[0]
      const setDragIdx = dragState[1]
      // 拖动中的连续位置（0~1）：圆球逐帧跟手，不在档位间跳变
      const dragPctState = React.useState(null)
      const dragPct = dragPctState[0]
      const setDragPct = dragPctState[1]
      const rootRef = React.useRef(null)
      const triggerRef = React.useRef(null)
      const menuRef = React.useRef(null)
      const trackRef = React.useRef(null)
      const dragIdxRef = React.useRef(null)
      const inflightRef = React.useRef(null)
      const pendingRef = React.useRef(null)
      // 收起/展开动画句柄：可打断，每次从当前视觉状态接手
      const closeAnimRef = React.useRef(null)
      const openAnimRef = React.useRef(null)
      const openRef = React.useRef(open)
      openRef.current = open
      const resumeHeightRef = React.useRef(null)
      // 切面板高度形变：点击瞬间锁定旧卡片高度，切换后逐帧长到新高度（底边锚定向上撑开）
      const prevHeightRef = React.useRef(null)
      const growRef = React.useRef(null)
      // 卡片当前定位（动画逐帧更新，供 JSX 直接读取，避免 setState 抖动）
      const posRef = React.useRef(null)
      const placeRef = React.useRef(null)
      const readTransform = function (el) {
        try {
          const value = window.getComputedStyle(el).transform
          if (!value || value === "none") return null
          const matched = value.match(/matrix\(([^)]+)\)/)
          if (!matched) return null
          const parts = matched[1].split(",")
          const sx = parseFloat(parts[0])
          const ty = parseFloat(parts[5])
          if (!isFinite(sx)) return null
          return { sx: sx, ty: isFinite(ty) ? ty : 0 }
        } catch (error) { return null }
      }
      const reduceMotion = function () {
        try { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) } catch (error) { return false }
      }
      // 取消动画会让 finished reject；先挂空 catch，避免 unhandled rejection
      const swallow = function (anim) {
        if (anim && anim.finished && typeof anim.finished.catch === "function") {
          anim.finished.catch(function () { /* cancel 属于正常打断 */ })
        }
        return anim
      }
      const cancelAnim = function (ref) {
        const running = ref.current
        ref.current = null
        if (running) { try { running.cancel() } catch (error) { /* 已结束 */ } }
      }

      React.useEffect(function () {
        let alive = true
        api("/dsh-astra-effort/catalog")
          .then(function (value) {
            if (!alive) return
            setCatalog(value)
            setError(null)
          })
          .catch(function (failure) {
            if (alive) setError(String(failure && failure.message ? failure.message : failure))
          })
        return function () { alive = false }
      }, [])

      React.useEffect(function () {
        if (!open) return undefined
        const closeOutside = function (event) {
          if (rootRef.current && rootRef.current.contains(event.target)) return
          if (menuRef.current && menuRef.current.contains(event.target)) return
          setOpen(false)
        }
        document.addEventListener("mousedown", closeOutside)
        return function () { document.removeEventListener("mousedown", closeOutside) }
      }, [open])

      React.useLayoutEffect(function () {
        if (!open) {
          placeRef.current = null
          // 收起动画期间保留坐标，等卸载后再清，否则卡片会闪到左上角
          if (!visible) { setPos(null); posRef.current = null }
          return undefined
        }
        const place = function (overrideH) {
          const rect = triggerRef.current ? triggerRef.current.getBoundingClientRect() : undefined
          if (rect === undefined) return null
          const menu = menuRef.current
          if (!menu) return null
          const lw = menu.offsetWidth
          const lh = overrideH === undefined ? menu.offsetHeight : overrideH
          const MARGIN = 12
          const __v = __dshClamp()
          const __lw = __dshVis(lw, __v), __lh = __dshVis(lh, __v)
          const __m = MARGIN
          let x = rect.right - __lw
          let y = rect.top - 8 - __lh
          if (lw > 0) x = Math.min(Math.max(x, __m), Math.max(__m, (__v ? __v.w : window.innerWidth) - __lw - __m))
          if (lh > 0) {
            if (y < __m) y = Math.min(rect.bottom + 8, Math.max(__m, (__v ? __v.h : window.innerHeight) - __lh - __m))
            y = Math.max(y, __m)
          }
          x = __dshLayout(x, __v); y = __dshLayout(y, __v)
          const next = { left: x, top: y }
          posRef.current = next
          if (overrideH === undefined) setPos(next)
          return next
        }
        placeRef.current = place
        place()
        window.addEventListener("scroll", place, true)
        window.addEventListener("resize", place)
        return function () {
          window.removeEventListener("scroll", place, true)
          window.removeEventListener("resize", place)
        }
      }, [open, visible, pane, catalog, projectedRaw, localCurrent])

      // ---- 切面板高度形变：从旧高度慢慢长到新高度（底边锚定、向上撑开）----
      React.useLayoutEffect(function () {
        if (!open) {
          if (growRef.current !== null) {
            if (typeof window.cancelAnimationFrame === "function") window.cancelAnimationFrame(growRef.current)
            growRef.current = null
          }
          prevHeightRef.current = null
          return
        }
        const card = menuRef.current
        if (!card) return
        const from = prevHeightRef.current
        prevHeightRef.current = null
        if (from === null) return
        // 量自然高度：临时清掉行内高度
        const inlineHeight = card.style.height
        if (inlineHeight) card.style.height = ""
        const to = card.offsetHeight
        if (inlineHeight) card.style.height = inlineHeight
        if (Math.abs(to - from) < 2) return
        if (growRef.current !== null && typeof window.cancelAnimationFrame === "function") window.cancelAnimationFrame(growRef.current)
        const now = function () { return (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now() }
        const start = now()
        const DUR = 460
        const place = placeRef.current
        const tick = function () {
          const t = Math.min(1, (now() - start) / DUR)
          const eased = 1 - Math.pow(1 - t, 3)
          const h = Math.round(from + (to - from) * eased)
          card.style.height = h + "px"
          if (place) {
            const p = place(h)
            if (p) { card.style.left = p.left + "px"; card.style.top = p.top + "px" }
          }
          if (t < 1) { growRef.current = window.requestAnimationFrame(tick) }
          else {
            card.style.height = ""
            growRef.current = null
            if (place) place()
          }
        }
        growRef.current = window.requestAnimationFrame(tick)
      }, [open, visible, pane])

      // ---- 打开/收起动画：统一 WAAPI，每次从"当前视觉状态"接手（可打断）----
      React.useLayoutEffect(function () {
        if (open) {
          const card = menuRef.current
          // 必须在 cancel 之前读当前视觉状态，否则读到的是被取消后的原位
          const current = card ? readTransform(card) : null
          cancelAnim(closeAnimRef)
          setVisible(true)
          if (!card || typeof card.animate !== "function" || reduceMotion()) return undefined
          if (current && Math.abs(current.sx - 1) < 0.01 && Math.abs(current.ty) < 0.5) return undefined
          const from = current
            ? "scale(" + current.sx + ") translateY(" + current.ty + "px)"
            : "scale(.86) translateY(8px)"
          cancelAnim(openAnimRef)
          try {
            openAnimRef.current = swallow(card.animate(
              [{ transform: from }, { transform: "scale(1) translateY(0)" }],
              { duration: 240, easing: "cubic-bezier(.34,1.2,.64,1)", fill: "forwards" },
            ))
          } catch (error) { /* 不支持则静态显示 */ }
          return undefined
        }
        if (!visible) return undefined
        const card = menuRef.current
        if (!card || typeof card.animate !== "function" || reduceMotion()) { setVisible(false); return undefined }
        if (closeAnimRef.current) return undefined
        cancelAnim(openAnimRef)
        if (growRef.current !== null) {
          if (typeof window.cancelAnimationFrame === "function") window.cancelAnimationFrame(growRef.current)
          growRef.current = null
        }
        card.style.height = ""
        resumeHeightRef.current = null
        const current = readTransform(card)
        const from = current
          ? "scale(" + current.sx + ") translateY(" + current.ty + "px)"
          : "scale(1) translateY(0)"
        let settled = false
        const finish = function () {
          if (settled) return
          settled = true
          closeAnimRef.current = null
          if (openRef.current) return
          resumeHeightRef.current = null
          setVisible(false)
        }
        let anim
        try {
          anim = card.animate(
            [{ transform: from }, { transform: "scale(.04) translateY(18px)" }],
            { duration: 240, easing: "cubic-bezier(.55,0,.85,.35)", fill: "forwards" },
          )
        } catch (error) { setVisible(false); return undefined }
        swallow(anim)
        closeAnimRef.current = anim
        if (anim.finished && typeof anim.finished.then === "function") {
          anim.finished.then(finish, finish)
        } else if (typeof anim.onfinish !== "undefined") {
          anim.onfinish = finish
        } else {
          window.setTimeout(finish, 300)
        }
        return undefined
      }, [open, visible])

      let projectedCurrent = null
      if (projectedRaw && typeof projectedRaw === "object") {
        projectedCurrent = projectedRaw.next || projectedRaw.lastUsed || null
      }
      const current = localCurrent || projectedCurrent || (catalog ? catalog.default || null : null)
      const currentRef = React.useRef(null)
      currentRef.current = current

      let model = null
      if (catalog && current) {
        // 先按 provider+model 精确匹配；同 id 模型常出现在多个 provider（如 h/trae/workbuddy
        // 都有 step-5-preview），只按 model.id 匹配会撞上别的 provider 的同名模型，
        // 拿到错误的能力信息（有档位的被无档位的挡住 → 滑条消失）。
        for (const g of catalog.groups) {
          if (g.id !== current.provider) continue
          const m = g.models.find(function (x) { return x.id === current.model })
          if (m) { model = m; break }
        }
        // 兜底：目录里没有这个 provider 时退回旧行为
        if (model === null) {
          for (const g of catalog.groups) {
            const m = g.models.find(function (x) { return x.id === current.model })
            if (m) { model = m; break }
          }
        }
      }

      const eff = effortInfo(model, current)
      const efforts = eff ? eff.efforts : []
      const effortId = eff ? eff.id : undefined
      const effortIndex = eff ? eff.index : -1
      const shownIndex = dragIdx !== null ? dragIdx : effortIndex
      const pct = dragPct !== null ? dragPct : (efforts.length > 1 ? (shownIndex >= 0 ? shownIndex / (efforts.length - 1) : 0) : (efforts.length === 1 ? 1 : 0))
      const levelRatio = efforts.length > 1 ? Math.max(0, Math.min(1, shownIndex / (efforts.length - 1))) : (efforts.length === 1 ? 1 : 0)
      const fillColor = effortColor(levelRatio)
      // 粒子速度：低档从容漂浮、高档极速躁动，拉开约 8 倍差距，快慢一眼可辨
      const starSpeed = 1.2 + levelRatio * 8.8
      const cometSpeed = 1.5 + levelRatio * 10.0
      const effortLabel = eff ? eff.name : null
      // 拖动过程中档位名实时跟随圆点，而不是等提交后才更新
      const shownEffortLabel = efforts.length > 0 && shownIndex >= 0 && efforts[shownIndex]
        ? efforts[shownIndex].name
        : effortLabel
      const modelLabel = model ? model.name : (current ? current.provider + "/" + current.model : "选择模型")
      const knobInset = 3
      const knobSize = 34
      const travelPx = knobSize + knobInset * 2
      const travel = "(100% - " + travelPx + "px)"
      const reach = travel + " * " + pct
      const knobLeft = "calc(" + (knobInset + knobSize / 2) + "px + " + reach + ")"
      // 拉满时不能再加 round 圆角（会在圆球右侧切出圆弧露出灰边），直接用完整矩形，
      // 圆角交给父级 .astraX-slider 的 border-radius + overflow:hidden 裁切
      const clipRight = "calc(100% - " + (knobInset + knobSize) + "px - " + reach + ")"
      const clipPath = pct >= 1
        ? "inset(0 0 0 0)"
        : "inset(0 " + clipRight + " 0 0 round 999px)"
      const dotPos = function (i) {
        return "calc(" + (knobInset + knobSize / 2) + "px + " + travel + " * " + (efforts.length > 1 ? i / (efforts.length - 1) : 0.5) + ")"
      }

      const predict = function (args) {
        const selected = { provider: args.provider, model: args.model }
        if (args.reasoningEffort !== undefined) selected.reasoningEffort = args.reasoningEffort
        return selected
      }
      const fireSelect = function (args, prev) {
        inflightRef.current = args
        api("/dsh-astra-effort/select", args)
          .then(function (result) {
            inflightRef.current = null
            if (result && result.selected) setLocalCurrent(result.selected)
            const next = pendingRef.current
            pendingRef.current = null
            if (next) { setLocalCurrent(predict(next)); fireSelect(next, currentRef.current) }
          })
          .catch(function (failure) {
            inflightRef.current = null
            const message = String(failure && failure.message ? failure.message : failure)
            setError(message)
            if (pendingRef.current === null) setLocalCurrent(prev)
            const next = pendingRef.current
            pendingRef.current = null
            if (next) { setLocalCurrent(predict(next)); fireSelect(next, currentRef.current) }
          })
      }
      const doSelect = function (providerId, modelId, newEffort) {
        const args = { sessionId: sessionId, provider: providerId, model: modelId }
        if (newEffort !== undefined) args.reasoningEffort = newEffort
        const prev = current
        setLocalCurrent(predict(args))
        if (inflightRef.current !== null) { pendingRef.current = args; return }
        fireSelect(args, prev)
      }

      // 自愈：会话里残留着目标模型不支持的强度时（例：从 workbuddy 的 max 切到
      // workbuddy-ai 的同名「无强度」模型），主动改写成该模型支持的档位。
      // 不做这一步的话，发消息时 resolveCallConfig 会抛 UNSUPPORTED_REASONING_EFFORT。
      const healKey = model && current && current.reasoningEffort !== undefined &&
        (!model.reasoning || (model.reasoning.efforts || []).every(function (e) { return e.id !== current.reasoningEffort }))
        ? current.provider + "/" + current.model + "@" + current.reasoningEffort
        : null
      const healRef = React.useRef(null)
      React.useEffect(function () {
        if (healKey === null) { healRef.current = null; return }
        if (healRef.current === healKey) return
        healRef.current = healKey
        var target
        if (model.reasoning && model.reasoning.defaultEffort !== undefined) target = model.reasoning.defaultEffort
        doSelect(current.provider, current.model, target)
      }, [healKey])

      const chooseModel = function (g, m) {
        if (current && current.provider === g.id && current.model === m.id) { setOpen(false); setPane("main"); return }        // 切模型时自动适配强度：目标模型不支持当前强度（含"无强度"模型）时一律不带强度，
        // 交给服务端归一化到该模型的默认档，避免 UNSUPPORTED_REASONING_EFFORT。
        var compatibleEffort = undefined
        if (current && current.reasoningEffort !== undefined && m.reasoning) {
          var validIds = (m.reasoning.efforts || []).map(function (e) { return e.id })
          if (validIds.indexOf(current.reasoningEffort) !== -1) {
            compatibleEffort = current.reasoningEffort
          }
        }
        doSelect(g.id, m.id, compatibleEffort)
        setOpen(false)
        setPane("main")
      }
      const indexAt = function (clientX) {
        const track = trackRef.current
        if (!track || efforts.length === 0) return null
        const rect = track.getBoundingClientRect()
        if (rect.width <= 0) return null
        const usable = rect.width - travelPx
        if (usable <= 0) return efforts.length - 1
        const t = Math.min(1, Math.max(0, (clientX - rect.left - (knobInset + knobSize / 2)) / usable))
        const idx = Math.round(t * (efforts.length - 1))
        return Math.min(efforts.length - 1, Math.max(0, idx))
      }
      const onPointerDown = function (event) {
        if (event.button !== 0 && event.pointerType === "mouse") return
        let moved = false
        const idx = indexAt(event.clientX)
        // 点击只记候选档位不进拖动态：松手后圆球带过渡滑到点中的档位，而不是瞬移
        if (idx !== null) dragIdxRef.current = idx
        const move = function (e) {
          const next = indexAt(e.clientX)
          if (next === null) return
          dragIdxRef.current = next
          if (!moved) moved = true   // 真正移动才进入拖动态
          setDragIdx(next)
          // 拖动中给圆球连续比例：逐帧跟手，不在档位间跳变
          const track = trackRef.current
          if (track) {
            const rect = track.getBoundingClientRect()
            const usable = rect.width - travelPx
            if (usable > 0) {
              const t = Math.min(1, Math.max(0, (e.clientX - rect.left - (knobInset + knobSize / 2)) / usable))
              setDragPct(t)
            }
          }
        }
        const up = function () {
          window.removeEventListener("pointermove", move)
          window.removeEventListener("pointerup", up)
          const finalIdx = dragIdxRef.current
          dragIdxRef.current = null
          setDragIdx(null)
          setDragPct(null)   // 松手吸附最近档位（带 .32s 过渡）
          if (finalIdx !== null && current) {
            const target = efforts[finalIdx]
            if (target && target.id !== effortId) doSelect(current.provider, current.model, target.id)
          }
        }
        window.addEventListener("pointermove", move)
        window.addEventListener("pointerup", up)
      }
      // 切面板：点击瞬间量当前卡片高度（此刻 DOM 还是旧面板），切换后从它长到新高度
      const switchPane = function (next) {
        if (pane === next) return
        const card = menuRef.current
        prevHeightRef.current = card ? card.offsetHeight : null
        // 切换瞬间取消可能在跑的形变循环
        if (growRef.current !== null) {
          if (typeof window.cancelAnimationFrame === "function") window.cancelAnimationFrame(growRef.current)
          growRef.current = null
        }
        setPane(next)
      }

      const toggle = function () {
        // 关闭时不动 pane：否则从模型列表收起时内容会瞬间换回主面板
        if (open) { setOpen(false) } else { setPane("main"); setOpen(true) }
      }

      if (catalog === null && error === null) {
        return React.createElement("div", { className: "astraX-root", ref: rootRef },
          React.createElement("button", { type: "button", className: "astraX-trigger", disabled: locked },
            React.createElement("span", { className: "astraX-triggerLabel" }, "加载中…")))
      }

      const colorLayer = React.createElement("div", {
        className: "astraX-colorLayer",
        style: { clipPath: clipPath, WebkitClipPath: clipPath, background: fillColor },
      },
        STAR_FIELD.map(function (s, i) {
          return React.createElement("span", {
            className: "astraX-star", key: "s" + i,
            style: {
              left: s.left + "%", top: s.top + "%", width: s.size + "px", height: s.size + "px",
              animationDuration: (s.dur / starSpeed) + "s", animationDelay: s.delay + "s",
            },
          })
        }),
        SPARKS.map(function (s, i) {
          return React.createElement("span", {
            className: "astraX-spark", key: "p" + i,
            style: {
              left: s.left + "%", top: s.top + "%", width: "2px", height: "2px",
              animationDuration: (s.dur / starSpeed) + "s", animationDelay: s.delay + "s",
            },
          })
        }),
        TRAILS.map(function (s, i) {
          return React.createElement("span", {
            className: "astraX-trail", key: "t" + i,
            style: {
              top: s.top + "%", width: s.w + "px",
              animationDuration: (s.dur / cometSpeed) + "s", animationDelay: s.delay + "s",
            },
          })
        }),
        COMETS.map(function (s, i) {
          return React.createElement("span", {
            className: "astraX-comet", key: "c" + i,
            style: {
              top: s.top + "%",
              animationDuration: (s.dur / cometSpeed) + "s", animationDelay: (s.delay / cometSpeed) + "s",
            },
          })
        }))

      const dots = efforts.map(function (e, i) {
        return React.createElement("span", {
          className: "astraX-dot" + (i <= shownIndex ? " astraX-dotLit" : ""),
          key: "d" + i,
          style: { left: dotPos(i), width: "4px", height: "4px" },
        })
      })

      const mainPane = [
        React.createElement("div", { className: "astraX-headRow", key: "head" },
          React.createElement("span", { className: "astraX-tier", style: { color: fillColor } }, shownEffortLabel || "默认")),
        React.createElement("button", {
          type: "button", className: "astraX-modelBtn", key: "mbtn",
          onClick: function () { switchPane("model") }, title: "切换模型",
        },
          React.createElement("span", { className: "astraX-model" }, modelLabel),
          React.createElement("span", { className: "astraX-modelArrow" }, "›")),
        efforts.length > 0
          ? React.createElement("div", { className: "astraX-sliderRow", key: "sliderRow" },
              React.createElement("div", { className: "astraX-sliderWrap" },
                React.createElement("div", {
                  className: "astraX-slider" + (dragIdx !== null ? " astraX-drag" : ""),
                  ref: trackRef, onPointerDown: onPointerDown,
                },
                  colorLayer,
                  dots,
                  React.createElement("div", { className: "astraX-knob", style: { left: knobLeft } })),
                React.createElement("div", { className: "astraX-sliderHint" },
                  React.createElement("span", null, efforts[0] ? efforts[0].name : ""),
                  React.createElement("span", null, efforts[efforts.length - 1] ? efforts[efforts.length - 1].name : ""))))
          : React.createElement("div", { className: "astraX-status", key: "nostatus" }, "该模型不支持调节思考强度"),
      ]

      const modelPane = [
        React.createElement("button", {
          type: "button", role: "menuitem", className: "astraX-cell astraX-rowIn", key: "cell-back",
          style: { animationDelay: "0ms" },
          onClick: function () { switchPane("main") },
        },
          React.createElement("span", { className: "astraX-cellLabel" }, "◂ 返回"),
          React.createElement("span", { className: "astraX-cellValue" }, "选择模型")),
        React.createElement("div", { className: "astraX-group", key: "groups" },
          (catalog && catalog.groups.length > 0)
            ? catalog.groups.map(function (g) {
                return [
                  React.createElement("div", {
                    className: "astraX-groupTitle astraX-rowIn", key: "g:" + g.id,
                    style: { animationDelay: "40ms" },
                  }, g.name),
                  g.models.map(function (m, mi) {
                    return React.createElement("button", {
                      type: "button", role: "menuitemradio",
                      className: "astraX-option astraX-rowIn",
                      key: g.id + "/" + m.id,
                      style: { animationDelay: (60 + mi * 18) + "ms" },
                      onClick: function () { chooseModel(g, m) },
                    },
                      React.createElement("span", { className: "astraX-optionCopy" },
                        React.createElement("span", { className: "astraX-optName" }, m.name),
                        m.reasoning && m.reasoning.efforts && m.reasoning.efforts.length > 0
                          ? React.createElement("span", { className: "astraX-optSub" }, "强度: " + m.reasoning.efforts.map(function (e) { return e.name }).join(" / "))
                          : null),
                      React.createElement("span", { className: "astraX-check" },
                        current && current.provider === g.id && current.model === m.id ? "✓" : null))
                  }),
                ]
              })
            : React.createElement("div", { className: "astraX-status astraX-rowIn", style: { animationDelay: "40ms" } }, "暂无可用模型")),
      ]

      return React.createElement("div", { className: "astraX-root", ref: rootRef },
        React.createElement("button", {
          ref: triggerRef, type: "button", className: "astraX-trigger",
          "aria-haspopup": "menu", "aria-expanded": open,
          title: modelLabel + (effortLabel ? " · " + effortLabel : ""),
          disabled: locked,
          // pointerdown 立即响应：动画期间卡片可能短暂压住按钮，click 会被浏览器吞掉
          onPointerDown: function (event) {
            if (event.pointerType === "mouse" && event.button !== 0) return
            toggle()
          },
          onClick: function (event) {
            if (event.detail === 0) toggle()
          },
        },
          React.createElement("span", { className: "astraX-triggerLabel" }, modelLabel),
          effortLabel ? React.createElement("span", { className: "astraX-triggerEffort" }, effortLabel) : null,
          React.createElement("span", { className: "astraX-chevron" + (open ? " astraX-chevronOpen" : "") }, "▾")),
        visible
          ? React.createElement("div", {
              ref: menuRef, className: "astraX-menu" + (open ? "" : " astraX-menuClosing"),
              style: posRef.current || { visibility: "hidden", left: 0, top: 0 }, role: "menu",
            },
              error ? React.createElement("div", { className: "astraX-error" }, error) : null,
              React.createElement("div", { className: "astraX-pane", key: pane },
                pane === "model" ? modelPane : mainPane))
          : null)
    }

    function apply(ctx) {
      insertCssOnce()
      const slots = ctx.slots || ctx.get("slots")
      if (!slots) return
      slots.inject("conversation.input.model", function () {
        return slots.register({ name: "conversation.input.model", priority: -1 }, AstraPicker)
      })
    }

    exports.name = "dsh-astra-effort"
    exports.inject = ["slots"]
    exports.apply = apply
    return module.exports
  },
})
