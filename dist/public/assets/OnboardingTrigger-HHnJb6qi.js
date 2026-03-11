import{A as o,aC as l,r as u,j as i,B as m}from"./index-BsM9OSGD.js";/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=o("CircleHelp",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);function x({pageId:e,autoStart:r=!0,className:n=""}){const{startOnboarding:s,isPageOnboarded:t,state:a}=l();return u.useEffect(()=>{if(r&&!t(e)&&!a.isActive){const c=setTimeout(()=>{s(e)},1500);return()=>clearTimeout(c)}},[e,r,t,s,a.isActive]),i.jsxs(m,{variant:"outline",size:"sm",onClick:()=>s(e),className:`gap-2 ${n}`,"data-testid":`onboarding-trigger-${e}`,children:[i.jsx(d,{className:"h-4 w-4"}),i.jsx("span",{className:"hidden sm:inline",children:"Tour"})]})}export{x as O};
