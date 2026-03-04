import{t as o,ax as l,r as u,j as t,B as m}from"./index-BtoDw1ix.js";/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=o("CircleHelp",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);function p({pageId:e,autoStart:i=!0,className:n=""}){const{startOnboarding:s,isPageOnboarded:r,state:a}=l();return u.useEffect(()=>{if(i&&!r(e)&&!a.isActive){const c=setTimeout(()=>{s(e)},1500);return()=>clearTimeout(c)}},[e,i,r,s,a.isActive]),t.jsxs(m,{variant:"outline",size:"sm",onClick:()=>s(e),className:`gap-2 ${n}`,"data-testid":`onboarding-trigger-${e}`,children:[t.jsx(d,{className:"h-4 w-4"}),t.jsx("span",{className:"hidden sm:inline",children:"Tour"})]})}export{p as O};
