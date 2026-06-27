import{u as z,r as d,j as e}from"./index-COD8-WXm.js";const c="#0A0F2E",T="#141B45",s="#C9A84C",f="#2B8A6E",u="#F8F7F4",j="#6B7280",N="#C0392B";function $(){const[,C]=z(),l=d.useRef(-1),p=d.useRef(null),n=d.useRef(null),g=d.useRef(null),h=d.useRef(0),k=d.useRef(0),b=6e4,a=d.useCallback(t=>{const i=document.getElementById(t);i&&i.classList.add("ad-show")},[]),r=d.useCallback(t=>{t.forEach(i=>{const o=document.getElementById(i);o&&o.classList.remove("ad-show")})},[]),m=[{id:"ad-scene-1",duration:8e3,onEnter:()=>{setTimeout(()=>a("ad-clock-num"),200),setTimeout(()=>a("ad-clock-lbl"),800),setTimeout(()=>a("ad-ci-1"),1400),setTimeout(()=>a("ad-ci-2"),2e3),setTimeout(()=>a("ad-ci-3"),2600),setTimeout(()=>a("ad-ci-4"),3200)},onExit:()=>r(["ad-clock-num","ad-clock-lbl","ad-ci-1","ad-ci-2","ad-ci-3","ad-ci-4"])},{id:"ad-scene-2",duration:8e3,onEnter:()=>{setTimeout(()=>a("ad-t-eyebrow"),200),setTimeout(()=>a("ad-t-time"),600),setTimeout(()=>a("ad-ts-1"),1200),setTimeout(()=>a("ad-ts-2"),1800),setTimeout(()=>a("ad-ts-3"),2400),setTimeout(()=>a("ad-ts-4"),3e3),setTimeout(()=>a("ad-t-q"),4500)},onExit:()=>r(["ad-t-eyebrow","ad-t-time","ad-ts-1","ad-ts-2","ad-ts-3","ad-ts-4","ad-t-q"])},{id:"ad-scene-3",duration:9e3,onEnter:()=>{setTimeout(()=>a("ad-q-header"),200),setTimeout(()=>a("ad-qr-1"),800),setTimeout(()=>a("ad-qr-2"),1800),setTimeout(()=>a("ad-qr-3"),2800),setTimeout(()=>a("ad-qr-4"),3800)},onExit:()=>r(["ad-q-header","ad-qr-1","ad-qr-2","ad-qr-3","ad-qr-4"])},{id:"ad-scene-4",duration:8e3,onEnter:()=>{setTimeout(()=>a("ad-a-eyebrow"),200),setTimeout(()=>a("ad-a-headline"),500),setTimeout(()=>a("ad-a-sub"),1200),setTimeout(()=>a("ad-sb-1"),1800),setTimeout(()=>a("ad-sb-2"),2200),setTimeout(()=>a("ad-sb-3"),2600),setTimeout(()=>a("ad-sb-4"),3e3)},onExit:()=>r(["ad-a-eyebrow","ad-a-headline","ad-a-sub","ad-sb-1","ad-sb-2","ad-sb-3","ad-sb-4"])},{id:"ad-scene-5",duration:9e3,onEnter:()=>{setTimeout(()=>a("ad-hw-header"),200),setTimeout(()=>a("ad-fs-1"),800),setTimeout(()=>a("ad-fs-2"),2e3),setTimeout(()=>a("ad-fs-3"),3200),setTimeout(()=>a("ad-fs-4"),4400)},onExit:()=>r(["ad-hw-header","ad-fs-1","ad-fs-2","ad-fs-3","ad-fs-4"])},{id:"ad-scene-6",duration:8e3,onEnter:()=>{setTimeout(()=>a("ad-m-eyebrow"),200),setTimeout(()=>a("ad-m-headline"),600),setTimeout(()=>a("ad-m-body"),1400),setTimeout(()=>a("ad-m-metric"),2600)},onExit:()=>r(["ad-m-eyebrow","ad-m-headline","ad-m-body","ad-m-metric"])},{id:"ad-scene-7",duration:1e4,onEnter:()=>{setTimeout(()=>a("ad-dr"),300),setTimeout(()=>a("ad-dt"),700),setTimeout(()=>a("ad-pi-1"),2e3),setTimeout(()=>a("ad-pi-2"),2400),setTimeout(()=>a("ad-pi-3"),2800),setTimeout(()=>a("ad-pi-4"),3200),setTimeout(()=>a("ad-du"),4e3),setTimeout(()=>a("ad-db"),4600),setTimeout(()=>a("ad-replay-btn"),6e3)},onExit:()=>{r(["ad-dr","ad-dt","ad-pi-1","ad-pi-2","ad-pi-3","ad-pi-4","ad-du","ad-db"]);const t=document.getElementById("ad-replay-btn");t&&t.classList.remove("ad-show")}}],v=d.useCallback(()=>{if(!g.current)return;const t=Date.now();h.current=k.current+(t-g.current);const i=Math.min(100,h.current/b*100),o=document.getElementById("ad-progress");o&&(o.style.width=i+"%"),h.current<b&&(n.current=requestAnimationFrame(v))},[b]),y=d.useCallback(t=>{if(l.current>=0&&l.current<m.length){const x=m[l.current],E=document.getElementById(x.id);E&&E.classList.remove("ad-active"),x.onExit()}if(l.current=t,t>=m.length)return;const i=m[t],o=document.getElementById(i.id);o&&o.classList.add("ad-active"),i.onEnter(),p.current=setTimeout(()=>y(t+1),i.duration)},[]),w=d.useCallback(()=>{p.current&&clearTimeout(p.current),n.current&&cancelAnimationFrame(n.current),m.forEach(o=>{const x=document.getElementById(o.id);x&&x.classList.remove("ad-active"),o.onExit()});const t=document.getElementById("ad-replay-btn");t&&t.classList.remove("ad-show"),h.current=0,k.current=0;const i=document.getElementById("ad-progress");i&&(i.style.width="0%"),l.current=-1,setTimeout(()=>{g.current=Date.now(),n.current=requestAnimationFrame(v),y(0)},100)},[y,v]);return d.useEffect(()=>(w(),()=>{p.current&&clearTimeout(p.current),n.current&&cancelAnimationFrame(n.current)}),[w]),e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
        .ad-wrap {
          background: ${c};
          color: ${u};
          font-family: 'Barlow', sans-serif;
          overflow: hidden;
          width: 100vw;
          height: 100vh;
          position: fixed;
          inset: 0;
          z-index: 0;
        }

        .ad-grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }

        .ad-glow-teal {
          position: fixed;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(43,138,110,0.08) 0%, transparent 70%);
          top: -200px; right: -200px;
          pointer-events: none; z-index: 0;
        }

        .ad-glow-gold {
          position: fixed;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
          bottom: -150px; left: -150px;
          pointer-events: none; z-index: 0;
        }

        .ad-scanline {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent);
          animation: ad-scan 8s linear infinite;
          pointer-events: none; z-index: 50;
        }

        @keyframes ad-scan {
          0% { top: -2px; }
          100% { top: 100%; }
        }

        .ad-progress-bar {
          position: fixed;
          bottom: 0; left: 0;
          height: 3px;
          background: ${s};
          width: 0%;
          transition: width 0.1s linear;
          z-index: 100;
        }

        .ad-scene {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity 0.8s ease;
          padding: clamp(40px, 7vw, 80px);
          pointer-events: none;
        }
        .ad-scene.ad-active {
          opacity: 1;
          pointer-events: auto;
        }
        .ad-scene > * { position: relative; z-index: 1; }

        /* ── SHARED SHOW TRANSITIONS ── */
        .ad-fade { opacity: 0; transition: opacity 0.8s ease; }
        .ad-fade.ad-show { opacity: 1; }

        /* ── SCENE 1 ── */
        #ad-scene-1 { text-align: center; gap: 0; background: ${c}; }

        #ad-clock-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(90px, 16vw, 180px);
          font-weight: 700;
          color: ${N};
          letter-spacing: -4px;
          line-height: 1;
          opacity: 0;
          transform: scale(0.8);
          transition: all 1s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        #ad-clock-num.ad-show { opacity: 1; transform: scale(1); }

        #ad-clock-lbl {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(14px, 2vw, 22px);
          font-weight: 500;
          letter-spacing: 6px;
          color: ${j};
          text-transform: uppercase;
          margin-top: 16px;
          opacity: 0;
          transition: opacity 0.8s ease 0.4s;
        }
        #ad-clock-lbl.ad-show { opacity: 1; }

        .ad-cost-items {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 40px;
          width: 100%;
          max-width: 600px;
        }

        .ad-cost-item {
          display: flex;
          align-items: center;
          gap: 20px;
          opacity: 0;
          transform: translateX(-20px);
          transition: all 0.5s ease;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-left: 3px solid ${N};
          padding: clamp(12px, 1.4vw, 16px) clamp(16px, 2vw, 24px);
          border-radius: 2px;
        }
        .ad-cost-item.ad-show { opacity: 1; transform: translateX(0); }

        .ad-cost-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: ${N};
          flex-shrink: 0;
        }
        .ad-cost-text {
          font-size: clamp(14px, 1.6vw, 18px);
          color: rgba(248,247,244,0.75);
        }

        /* ── SCENE 2 ── */
        #ad-scene-2 { text-align: center; gap: 28px; background: ${c}; }

        .ad-eyebrow {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 600;
          letter-spacing: 8px;
          color: ${s};
          text-transform: uppercase;
          opacity: 0;
          transition: opacity 0.6s ease;
        }
        .ad-eyebrow.ad-show { opacity: 1; }

        #ad-t-time {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(56px, 9vw, 96px);
          font-weight: 700;
          color: ${s};
          letter-spacing: -2px;
          line-height: 1;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s;
        }
        #ad-t-time.ad-show { opacity: 1; transform: translateY(0); }

        .ad-trigger-scenarios {
          display: flex; flex-direction: column;
          gap: 10px; width: 100%; max-width: 560px;
        }

        .ad-trigger-scenario {
          display: flex; align-items: center; gap: 16px;
          padding: 13px 22px;
          background: rgba(201,168,76,0.06);
          border: 1px solid rgba(201,168,76,0.15);
          border-radius: 2px;
          opacity: 0; transform: translateY(10px);
          transition: all 0.5s ease;
        }
        .ad-trigger-scenario.ad-show { opacity: 1; transform: translateY(0); }

        .ad-scenario-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: ${s};
          flex-shrink: 0;
          animation: ad-pulse 2s infinite;
        }
        @keyframes ad-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.5); }
        }

        .ad-scenario-text { font-size: clamp(13px, 1.5vw, 17px); color: rgba(248,247,244,0.85); }

        #ad-t-q {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(22px, 3.5vw, 36px);
          font-style: italic;
          color: rgba(248,247,244,0.6);
          opacity: 0; transition: opacity 0.8s ease 0.3s;
          line-height: 1.3;
        }
        #ad-t-q.ad-show { opacity: 1; }

        /* ── SCENE 3 ── */
        #ad-scene-3 { align-items: flex-start; gap: 0; background: ${c}; }

        .ad-section-header {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 600;
          letter-spacing: 8px; color: ${s};
          text-transform: uppercase;
          margin-bottom: 36px;
          opacity: 0; transition: opacity 0.6s ease;
          width: 100%;
        }
        .ad-section-header.ad-show { opacity: 1; }

        .ad-question-row {
          display: flex; align-items: flex-start;
          gap: 24px; padding: 18px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          width: 100%;
          opacity: 0; transform: translateX(-16px);
          transition: all 0.5s ease;
        }
        .ad-question-row.ad-show { opacity: 1; transform: translateX(0); }
        .ad-question-row:last-child { border-bottom: none; }

        .ad-q-number {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 600;
          color: ${s}; letter-spacing: 2px;
          flex-shrink: 0; padding-top: 2px; width: 32px;
        }
        .ad-q-text { font-size: clamp(14px, 1.6vw, 18px); color: rgba(248,247,244,0.8); line-height: 1.5; }

        /* ── SCENE 4 ── */
        #ad-scene-4 { text-align: center; gap: 0; background: ${T}; }

        .ad-teal-eyebrow {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 600;
          letter-spacing: 8px; color: ${f};
          text-transform: uppercase; margin-bottom: 22px;
          opacity: 0; transition: opacity 0.6s ease;
        }
        .ad-teal-eyebrow.ad-show { opacity: 1; }

        #ad-a-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(52px, 8vw, 72px);
          font-weight: 700; color: ${u};
          line-height: 1.1; margin-bottom: 14px;
          opacity: 0; transform: translateY(20px);
          transition: all 0.8s ease 0.2s;
        }
        #ad-a-headline.ad-show { opacity: 1; transform: translateY(0); }
        #ad-a-headline em { color: ${s}; font-style: italic; }

        #ad-a-sub {
          font-size: clamp(15px, 1.8vw, 20px);
          color: rgba(248,247,244,0.55); margin-bottom: 48px;
          opacity: 0; transition: opacity 0.6s ease 0.5s;
        }
        #ad-a-sub.ad-show { opacity: 1; }

        .ad-stats-row { display: flex; gap: 2px; width: 100%; }
        .ad-stat-block {
          flex: 1; padding: clamp(18px, 2.5vw, 28px) clamp(12px, 1.5vw, 20px);
          background: rgba(255,255,255,0.04);
          border-top: 2px solid ${s};
          opacity: 0; transform: translateY(20px);
          transition: all 0.5s ease;
        }
        .ad-stat-block.ad-show { opacity: 1; transform: translateY(0); }
        .ad-stat-val {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(30px, 4.5vw, 48px);
          font-weight: 700; color: ${s};
          line-height: 1; margin-bottom: 8px;
        }
        .ad-stat-lbl {
          font-size: 12px; color: ${j};
          text-transform: uppercase; letter-spacing: 2px;
        }

        /* ── SCENE 5 ── */
        #ad-scene-5 { gap: 0; align-items: flex-start; background: ${c}; }

        .ad-flow-step {
          display: flex; gap: 28px;
          padding: 22px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          opacity: 0; transform: translateX(-20px);
          transition: all 0.6s ease;
          width: 100%; position: relative;
        }
        .ad-flow-step.ad-show { opacity: 1; transform: translateX(0); }

        .ad-step-time {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(22px, 3vw, 32px);
          font-weight: 700; color: ${f};
          width: 110px; flex-shrink: 0; padding-top: 4px;
        }
        .ad-step-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(14px, 1.6vw, 18px);
          font-weight: 600; color: ${s};
          letter-spacing: 2px; text-transform: uppercase;
          margin-bottom: 5px;
        }
        .ad-step-desc { font-size: clamp(13px, 1.4vw, 16px); color: rgba(248,247,244,0.65); line-height: 1.5; }

        /* ── SCENE 6 ── */
        #ad-scene-6 { text-align: center; gap: 40px; background: ${T}; }

        #ad-m-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(40px, 6vw, 64px);
          font-weight: 700; color: ${u};
          line-height: 1.15;
          opacity: 0; transform: translateY(16px);
          transition: all 0.8s ease 0.2s;
        }
        #ad-m-headline.ad-show { opacity: 1; transform: translateY(0); }
        #ad-m-headline em { color: ${f}; font-style: italic; }

        #ad-m-body {
          font-size: clamp(15px, 1.7vw, 20px);
          color: rgba(248,247,244,0.6); line-height: 1.7;
          max-width: 640px;
          opacity: 0; transition: opacity 0.6s ease 0.5s;
        }
        #ad-m-body.ad-show { opacity: 1; }

        #ad-m-metric {
          display: flex; align-items: center; gap: 24px;
          padding: 22px 36px;
          border: 1px solid rgba(43,138,110,0.3);
          background: rgba(43,138,110,0.08);
          border-radius: 2px;
          opacity: 0; transition: opacity 0.6s ease 0.8s;
        }
        #ad-m-metric.ad-show { opacity: 1; }

        .ad-moat-val {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(36px, 5.5vw, 56px);
          font-weight: 700; color: ${f}; flex-shrink: 0;
        }
        .ad-moat-lbl { font-size: clamp(13px, 1.4vw, 16px); color: rgba(248,247,244,0.6); text-align: left; line-height: 1.5; }

        /* ── SCENE 7 ── */
        #ad-scene-7 { text-align: center; gap: 0; justify-content: center; background: ${c}; }

        #ad-dr {
          width: 60px; height: 2px;
          background: ${s}; margin: 0 auto 36px;
          opacity: 0; transition: opacity 0.6s ease;
        }
        #ad-dr.ad-show { opacity: 1; }

        #ad-dt {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 5.5vw, 60px);
          font-weight: 700; font-style: italic;
          color: ${u}; line-height: 1.2; margin-bottom: 44px;
          opacity: 0; transform: translateY(20px);
          transition: all 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s;
        }
        #ad-dt.ad-show { opacity: 1; transform: translateY(0); }
        #ad-dt em { color: ${s}; }

        .ad-decl-proof { display: flex; gap: 2px; width: 100%; margin-bottom: 48px; }
        .ad-proof-item {
          flex: 1; padding: 18px 14px;
          background: rgba(255,255,255,0.03);
          border-top: 2px solid rgba(201,168,76,0.4);
          opacity: 0; transition: all 0.4s ease;
        }
        .ad-proof-item.ad-show { opacity: 1; }
        .ad-proof-val {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(22px, 3vw, 32px);
          font-weight: 700; color: ${s}; margin-bottom: 4px;
        }
        .ad-proof-lbl { font-size: 11px; color: ${j}; text-transform: uppercase; letter-spacing: 2px; }

        #ad-du {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(18px, 2.5vw, 28px);
          font-weight: 500; letter-spacing: 4px;
          color: ${s}; text-transform: uppercase;
          opacity: 0; transition: opacity 0.6s ease 0.8s;
          margin-bottom: 10px;
        }
        #ad-du.ad-show { opacity: 1; }

        #ad-db {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; letter-spacing: 5px;
          color: rgba(248,247,244,0.3); text-transform: uppercase;
          opacity: 0; transition: opacity 0.6s ease 1s;
        }
        #ad-db.ad-show { opacity: 1; }

        /* ── CONTROLS ── */
        #ad-replay-btn {
          position: fixed; bottom: 40px; right: 40px;
          padding: 11px 26px;
          background: transparent;
          border: 1px solid rgba(201,168,76,0.4);
          color: ${s};
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; letter-spacing: 4px;
          text-transform: uppercase;
          cursor: pointer;
          opacity: 0; transition: all 0.4s ease;
          z-index: 200;
        }
        #ad-replay-btn:hover { background: rgba(201,168,76,0.1); border-color: ${s}; }
        #ad-replay-btn.ad-show { opacity: 1; }

        #ad-back-btn {
          position: fixed; top: 28px; left: 32px;
          background: transparent;
          border: none;
          color: rgba(248,247,244,0.35);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; letter-spacing: 4px;
          text-transform: uppercase;
          cursor: pointer;
          z-index: 200;
          transition: color 0.3s ease;
          padding: 0;
        }
        #ad-back-btn:hover { color: ${s}; }
      `}),e.jsxs("div",{className:"ad-wrap",children:[e.jsx("div",{className:"ad-grid-bg"}),e.jsx("div",{className:"ad-glow-teal"}),e.jsx("div",{className:"ad-glow-gold"}),e.jsx("div",{className:"ad-scanline"}),e.jsx("div",{className:"ad-progress-bar",id:"ad-progress"}),e.jsx("button",{id:"ad-back-btn",onClick:()=>C("/"),children:"← Exit"}),e.jsxs("div",{className:"ad-scene",id:"ad-scene-1",children:[e.jsx("div",{id:"ad-clock-num",children:"30"}),e.jsx("div",{id:"ad-clock-lbl",children:"days. before a single action is taken."}),e.jsxs("div",{className:"ad-cost-items",children:[e.jsxs("div",{className:"ad-cost-item",id:"ad-ci-1",children:[e.jsx("div",{className:"ad-cost-dot"}),e.jsx("div",{className:"ad-cost-text",children:"Figuring out who needs to be in the room"})]}),e.jsxs("div",{className:"ad-cost-item",id:"ad-ci-2",children:[e.jsx("div",{className:"ad-cost-dot"}),e.jsx("div",{className:"ad-cost-text",children:"Agreeing on a plan. Getting budget approved."})]}),e.jsxs("div",{className:"ad-cost-item",id:"ad-ci-3",children:[e.jsx("div",{className:"ad-cost-dot"}),e.jsx("div",{className:"ad-cost-text",children:"Coordinating stakeholders. Building the project plan."})]}),e.jsxs("div",{className:"ad-cost-item",id:"ad-ci-4",children:[e.jsx("div",{className:"ad-cost-dot"}),e.jsx("div",{className:"ad-cost-text",children:"Starting from zero. Every. Single. Time."})]})]})]}),e.jsxs("div",{className:"ad-scene",id:"ad-scene-2",children:[e.jsx("div",{className:"ad-eyebrow",id:"ad-t-eyebrow",children:"It fires without warning"}),e.jsx("div",{id:"ad-t-time",children:"3:17 AM"}),e.jsxs("div",{className:"ad-trigger-scenarios",children:[e.jsxs("div",{className:"ad-trigger-scenario",id:"ad-ts-1",children:[e.jsx("div",{className:"ad-scenario-dot"}),e.jsx("div",{className:"ad-scenario-text",children:"23 servers encrypted. Ransom note across payment infrastructure."})]}),e.jsxs("div",{className:"ad-trigger-scenario",id:"ad-ts-2",children:[e.jsx("div",{className:"ad-scenario-dot"}),e.jsx("div",{className:"ad-scenario-text",children:"Activist investor files 13D. Board seat demanded."})]}),e.jsxs("div",{className:"ad-trigger-scenario",id:"ad-ts-3",children:[e.jsx("div",{className:"ad-scenario-dot"}),e.jsx("div",{className:"ad-scenario-text",children:"Federal enforcement notice. 48-hour disclosure window open."})]}),e.jsxs("div",{className:"ad-trigger-scenario",id:"ad-ts-4",children:[e.jsx("div",{className:"ad-scenario-dot"}),e.jsx("div",{className:"ad-scenario-text",children:"Primary supplier declares force majeure. 14 facilities exposed."})]})]}),e.jsx("div",{id:"ad-t-q",children:"Is the response already built?"})]}),e.jsxs("div",{className:"ad-scene",id:"ad-scene-3",children:[e.jsx("div",{className:"ad-section-header",id:"ad-q-header",children:"Ask yourself honestly"}),e.jsxs("div",{style:{width:"100%",maxWidth:760},children:[e.jsxs("div",{className:"ad-question-row",id:"ad-qr-1",children:[e.jsx("div",{className:"ad-q-number",children:"01"}),e.jsx("div",{className:"ad-q-text",children:"How did you find out about it. Did a defined detection system notify you — or did you hear through someone in a meeting?"})]}),e.jsxs("div",{className:"ad-question-row",id:"ad-qr-2",children:[e.jsx("div",{className:"ad-q-number",children:"02"}),e.jsx("div",{className:"ad-q-text",children:"When it crossed the line — who got notified. Automatically. Within minutes. Or did someone have to make calls?"})]}),e.jsxs("div",{className:"ad-question-row",id:"ad-qr-3",children:[e.jsx("div",{className:"ad-q-number",children:"03"}),e.jsx("div",{className:"ad-q-text",children:"Were roles already defined. Tasks already assigned. Budget already routed. Or did the first two weeks get consumed figuring it out?"})]}),e.jsxs("div",{className:"ad-question-row",id:"ad-qr-4",children:[e.jsx("div",{className:"ad-q-number",children:"04"}),e.jsx("div",{className:"ad-q-text",children:"When it was over — what did you encode so the next response is faster? Or did the learning disappear with the debrief document?"})]})]})]}),e.jsxs("div",{className:"ad-scene",id:"ad-scene-4",children:[e.jsx("div",{className:"ad-teal-eyebrow",id:"ad-a-eyebrow",children:"The alternative"}),e.jsxs("div",{id:"ad-a-headline",children:["12 ",e.jsx("em",{children:"minutes."})]}),e.jsx("div",{id:"ad-a-sub",children:"From signal detection to full coordinated execution."}),e.jsxs("div",{className:"ad-stats-row",children:[e.jsxs("div",{className:"ad-stat-block",id:"ad-sb-1",children:[e.jsx("div",{className:"ad-stat-val",children:"180"}),e.jsx("div",{className:"ad-stat-lbl",children:"Pre-Staged Protocols"})]}),e.jsxs("div",{className:"ad-stat-block",id:"ad-sb-2",children:[e.jsx("div",{className:"ad-stat-val",children:"231"}),e.jsx("div",{className:"ad-stat-lbl",children:"Triggers Monitored"})]}),e.jsxs("div",{className:"ad-stat-block",id:"ad-sb-3",children:[e.jsx("div",{className:"ad-stat-val",children:"3,600×"}),e.jsx("div",{className:"ad-stat-lbl",children:"Execution Head Start"})]}),e.jsxs("div",{className:"ad-stat-block",id:"ad-sb-4",children:[e.jsx("div",{className:"ad-stat-val",children:"39"}),e.jsx("div",{className:"ad-stat-lbl",children:"Live Data Sources"})]})]})]}),e.jsxs("div",{className:"ad-scene",id:"ad-scene-5",children:[e.jsx("div",{className:"ad-section-header",id:"ad-hw-header",children:"What happens when the trigger fires"}),e.jsxs("div",{style:{width:"100%"},children:[e.jsxs("div",{className:"ad-flow-step",id:"ad-fs-1",children:[e.jsx("div",{className:"ad-step-time",children:"0:00"}),e.jsxs("div",{children:[e.jsx("div",{className:"ad-step-label",children:"Signal Detected"}),e.jsx("div",{className:"ad-step-desc",children:"39 live data sources. 231 detection thresholds. Threshold crossed. Protocol matched."})]})]}),e.jsxs("div",{className:"ad-flow-step",id:"ad-fs-2",children:[e.jsx("div",{className:"ad-step-time",children:"2:00"}),e.jsxs("div",{children:[e.jsx("div",{className:"ad-step-label",children:"Executive Decides"}),e.jsx("div",{className:"ad-step-desc",children:"Four pre-staged choices. Execute. Adjust. Choose different. Stand down with a record."})]})]}),e.jsxs("div",{className:"ad-flow-step",id:"ad-fs-3",children:[e.jsx("div",{className:"ad-step-time",children:"4:15"}),e.jsxs("div",{children:[e.jsx("div",{className:"ad-step-label",children:"Tasks Deploy"}),e.jsx("div",{className:"ad-step-desc",children:"Every role assigned. Every stakeholder notified. Budget routed. Communications staged."})]})]}),e.jsxs("div",{className:"ad-flow-step",id:"ad-fs-4",children:[e.jsx("div",{className:"ad-step-time",children:"12:00"}),e.jsxs("div",{children:[e.jsx("div",{className:"ad-step-label",children:"Execution Live"}),e.jsx("div",{className:"ad-step-desc",children:"Coordinated across your entire stack. Microsoft. Salesforce. ServiceNow. Everything you already own."})]})]})]})]}),e.jsxs("div",{className:"ad-scene",id:"ad-scene-6",children:[e.jsx("div",{className:"ad-teal-eyebrow",id:"ad-m-eyebrow",children:"The irreversible advantage"}),e.jsxs("div",{id:"ad-m-headline",children:["Every activation makes",e.jsx("br",{}),"the next response ",e.jsx("em",{children:"smarter."})]}),e.jsx("div",{id:"ad-m-body",children:"The ADVANCE loop encodes what held and what did not back into the preparation before the next trigger arrives. The institutional memory that compounds with every use is the only moat that cannot be rebuilt."}),e.jsxs("div",{id:"ad-m-metric",children:[e.jsx("div",{className:"ad-moat-val",children:"14–18"}),e.jsxs("div",{className:"ad-moat-lbl",children:["months for a competitor to replicate",e.jsx("br",{}),"your organization's activation history",e.jsx("br",{}),"on any other platform"]})]})]}),e.jsxs("div",{className:"ad-scene",id:"ad-scene-7",children:[e.jsx("div",{id:"ad-dr"}),e.jsxs("div",{id:"ad-dt",children:["The response is ready",e.jsx("br",{}),"before the ",e.jsx("em",{children:"trigger fires."})]}),e.jsxs("div",{className:"ad-decl-proof",children:[e.jsxs("div",{className:"ad-proof-item",id:"ad-pi-1",children:[e.jsx("div",{className:"ad-proof-val",children:"180"}),e.jsx("div",{className:"ad-proof-lbl",children:"Protocols"})]}),e.jsxs("div",{className:"ad-proof-item",id:"ad-pi-2",children:[e.jsx("div",{className:"ad-proof-val",children:"12 min"}),e.jsx("div",{className:"ad-proof-lbl",children:"To Execution"})]}),e.jsxs("div",{className:"ad-proof-item",id:"ad-pi-3",children:[e.jsx("div",{className:"ad-proof-val",children:"3,600×"}),e.jsx("div",{className:"ad-proof-lbl",children:"Head Start"})]}),e.jsxs("div",{className:"ad-proof-item",id:"ad-pi-4",children:[e.jsx("div",{className:"ad-proof-val",children:"24/7"}),e.jsx("div",{className:"ad-proof-lbl",children:"Monitoring"})]})]}),e.jsx("div",{id:"ad-du",children:"vaughnmartin.com"}),e.jsx("div",{id:"ad-db",children:"VaughnMartin · Readiness OS · Coordination Infrastructure"})]}),e.jsx("button",{id:"ad-replay-btn",onClick:w,children:"↺ REPLAY"})]})]})}export{$ as default};
