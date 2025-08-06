"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1014],{9338:function(t,e,i){i.d(e,{Z:function(){return r}});/**
 * @license lucide-react v0.445.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,i(8030).Z)("Star",[["polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2",key:"8f66p6"}]])},8954:function(t,e,i){i.d(e,{Z:function(){return r}});/**
 * @license lucide-react v0.445.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,i(8030).Z)("Video",[["path",{d:"m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",key:"ftymec"}],["rect",{x:"2",y:"6",width:"14",height:"12",rx:"2",key:"158x01"}]])},1340:function(t,e,i){var r=i(7437),a=i(8059),o=i.n(a),n=i(2265),l=i(2421);e.Z=t=>{let{title:e,subtitle:i,icon:a,children:s,defaultOpen:p=!1,className:c="",headerClassName:d="",contentClassName:m="",onToggle:b}=t,[x,f]=(0,n.useState)(p),[h,u]=(0,n.useState)(p?void 0:0),g=(0,n.useRef)(null);return(0,n.useEffect)(()=>{if(g.current){let t=g.current.scrollHeight;u(x?t:0)}},[x]),(0,n.useEffect)(()=>{if(g.current){let t=new ResizeObserver(t=>{x&&u(t[0].target.scrollHeight)});return t.observe(g.current),()=>{t.disconnect()}}},[x]),(0,r.jsxs)("div",{className:`jsx-cebe4fafa4b8e412 bg-white rounded-lg shadow-md overflow-hidden ${c}`,children:[(0,r.jsx)("button",{onClick:()=>{let t=!x;f(t),b?.(t)},className:`jsx-cebe4fafa4b8e412 w-full p-4 lg:p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 ${d}`,children:(0,r.jsxs)("div",{className:"jsx-cebe4fafa4b8e412 flex items-center justify-between",children:[(0,r.jsxs)("div",{className:"jsx-cebe4fafa4b8e412 flex items-center space-x-3 text-left",children:[a&&(0,r.jsx)("div",{className:"jsx-cebe4fafa4b8e412 flex-shrink-0",children:a}),(0,r.jsxs)("div",{className:"jsx-cebe4fafa4b8e412",children:[(0,r.jsx)("h2",{className:"jsx-cebe4fafa4b8e412 text-lg font-semibold text-gray-900",children:e}),i&&(0,r.jsx)("p",{className:"jsx-cebe4fafa4b8e412 text-sm text-gray-600 mt-1",children:i})]})]}),(0,r.jsx)("div",{className:"jsx-cebe4fafa4b8e412 flex-shrink-0 ml-4",children:(0,r.jsx)("div",{className:`jsx-cebe4fafa4b8e412 transform transition-transform duration-300 ease-in-out ${x?"rotate-180":"rotate-0"}`,children:(0,r.jsx)(l.Z,{className:"w-5 h-5 text-gray-500"})})})]})}),(0,r.jsx)("div",{ref:g,style:{height:h},className:`jsx-cebe4fafa4b8e412 overflow-hidden transition-all duration-500 ease-in-out ${x?"opacity-100":"opacity-0"}`,children:(0,r.jsx)("div",{className:`jsx-cebe4fafa4b8e412 p-4 lg:p-6 ${m}`,children:s})}),(0,r.jsx)(o(),{id:"cebe4fafa4b8e412",children:".transition-all.jsx-cebe4fafa4b8e412{-webkit-transition-property:height,opacity;-moz-transition-timing-function:height,opacity;-o-transition-timing-function:height,opacity;transition-property:height,opacity;-webkit-transition-timing-function:cubic-bezier(.4,0,.2,1);-moz-transition-timing-function:cubic-bezier(.4,0,.2,1);-o-transition-timing-function:cubic-bezier(.4,0,.2,1);transition-timing-function:cubic-bezier(.4,0,.2,1)}"})]})}},3260:function(t,e,i){var r=i(7437),a=i(8059),o=i.n(a),n=i(2265),l=i(4481);e.Z=t=>{let{value:e,onChange:i,height:a=400,placeholder:s="Mulai menulis...",disabled:p=!1,id:c="tinymce-editor"}=t,d=(0,n.useRef)(null);return(0,r.jsxs)("div",{className:"jsx-3822d4f327367a1c tinymce-wrapper",children:[(0,r.jsx)(l.M,{id:c,apiKey:"46xpnnaco4j4mjqv6pk3npdfni307v6m5szyurxsv3rb1g3z",onInit:(t,e)=>{d.current=e},value:e,onEditorChange:t=>{i(t)},disabled:p,init:{height:a,menubar:!1,statusbar:!0,branding:!1,promotion:!1,resize:"both",plugins:["advlist","autolink","lists","link","charmap","searchreplace","visualblocks","code","fullscreen","insertdatetime","help","wordcount","emoticons","quickbars","pagebreak","nonbreaking","visualchars"],toolbar1:"undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor | align lineheight | numlist bullist outdent indent | removeformat",toolbar2:"link charmap emoticons | searchreplace visualblocks code fullscreen | insertdatetime pagebreak nonbreaking | help",menu:{},quickbars_selection_toolbar:"bold italic underline | forecolor backcolor | blocks | link",quickbars_insert_toolbar:!1,content_style:`
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              font-size: 14px; 
              line-height: 1.6;
              color: #333;
              max-width: 100%;
              margin: 0 auto;
              padding: 16px;
            }

            h1, h2, h3, h4, h5, h6 {
              color: #2d3748;
              margin-top: 1.5em;
              margin-bottom: 0.5em;
              font-weight: 600;
            }

            h1 { font-size: 2em; }
            h2 { font-size: 1.5em; }
            h3 { font-size: 1.25em; }
            h4 { font-size: 1.1em; }

            p {
              margin-bottom: 1em;
              text-align: justify;
            }

            ul, ol {
              margin: 1em 0;
              padding-left: 2em;
            }

            li {
              margin-bottom: 0.5em;
            }

            a {
              color: #3182ce;
              text-decoration: underline;
            }

            a:hover {
              color: #2c5282;
            }

            blockquote {
              border-left: 4px solid #cbd5e0;
              margin: 1.5em 0;
              padding: 1em 1.5em;
              background-color: #f7fafc;
              font-style: italic;
            }

            hr {
              border: 0;
              height: 2px;
              background: linear-gradient(to right, transparent, #cbd5e0, transparent);
              margin: 2em 0;
            }

            strong {
              font-weight: 600;
            }

            em {
              font-style: italic;
            }

            del, s {
              text-decoration: line-through;
            }

            u {
              text-decoration: underline;
            }
          `,block_formats:"Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Blockquote=blockquote",font_family_formats:"Arial=arial,helvetica,sans-serif; Georgia=georgia,serif; Times New Roman=times new roman,times,serif; Verdana=verdana,sans-serif; Tahoma=tahoma,sans-serif",font_size_formats:"12px 14px 16px 18px 20px 22px 24px 28px 32px 36px",advlist_bullet_styles:"square circle disc",advlist_number_styles:"lower-alpha,lower-roman,upper-alpha,upper-roman",link_title:!1,target_list:[{title:"Same window",value:"_self"},{title:"New window",value:"_blank"}],browser_spellcheck:!0,paste_as_text:!1,paste_auto_cleanup_on_paste:!0,paste_remove_styles_if_webkit:!0,placeholder:s,contextmenu:"link",directionality:"ltr",language:"id",style_formats:[{title:"Headings",items:[{title:"Heading 1",format:"h1"},{title:"Heading 2",format:"h2"},{title:"Heading 3",format:"h3"},{title:"Heading 4",format:"h4"}]},{title:"Inline",items:[{title:"Bold",format:"bold"},{title:"Italic",format:"italic"},{title:"Underline",format:"underline"},{title:"Strikethrough",format:"strikethrough"}]},{title:"Blocks",items:[{title:"Paragraph",format:"p"},{title:"Blockquote",format:"blockquote"}]},{title:"Alignment",items:[{title:"Left",format:"alignleft"},{title:"Center",format:"aligncenter"},{title:"Right",format:"alignright"},{title:"Justify",format:"alignjustify"}]}],formats:{alignleft:{selector:"p,h1,h2,h3,h4,h5,h6,div,ul,ol,li",styles:{textAlign:"left"}},aligncenter:{selector:"p,h1,h2,h3,h4,h5,h6,div,ul,ol,li",styles:{textAlign:"center"}},alignright:{selector:"p,h1,h2,h3,h4,h5,h6,div,ul,ol,li",styles:{textAlign:"right"}},alignjustify:{selector:"p,h1,h2,h3,h4,h5,h6,div,ul,ol,li",styles:{textAlign:"justify"}},bold:{inline:"strong"},italic:{inline:"em"},underline:{inline:"u"},strikethrough:{inline:"del"},forecolor:{inline:"span",styles:{color:"%value"}},hilitecolor:{inline:"span",styles:{backgroundColor:"%value"}}},wordcount_countregex:/[\w\u2019\'-]+/g,setup:t=>{t.addShortcut("ctrl+shift+z","Redo","Redo"),t.addShortcut("ctrl+shift+l","Align Left",()=>{t.execCommand("JustifyLeft")}),t.addShortcut("ctrl+shift+c","Align Center",()=>{t.execCommand("JustifyCenter")}),t.addShortcut("ctrl+shift+r","Align Right",()=>{t.execCommand("JustifyRight")}),t.addShortcut("ctrl+shift+j","Justify",()=>{t.execCommand("JustifyFull")})}}}),(0,r.jsx)(o(),{id:"3822d4f327367a1c",children:'.tinymce-wrapper .tox-tinymce{border:1px solid#d1d5db!important;-webkit-border-radius:8px!important;-moz-border-radius:8px!important;border-radius:8px!important;-webkit-box-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px 0 rgba(0,0,0,.06)!important;-moz-box-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px 0 rgba(0,0,0,.06)!important;box-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px 0 rgba(0,0,0,.06)!important}.tinymce-wrapper .tox-editor-header{border-bottom:1px solid#e5e7eb!important}.tinymce-wrapper .tox-toolbar{background:#f9fafb!important;border-bottom:1px solid#e5e7eb!important;padding:8px!important}.tinymce-wrapper .tox-toolbar__primary{background:transparent!important}.tinymce-wrapper .tox-button{color:#374151!important;margin:2px!important;-webkit-border-radius:4px!important;-moz-border-radius:4px!important;border-radius:4px!important}.tinymce-wrapper .tox-button:hover{background:#f3f4f6!important}.tinymce-wrapper .tox-button--enabled{background:#dbeafe!important;color:#1d4ed8!important}.tinymce-wrapper .tox-statusbar{border-top:1px solid#e5e7eb!important;background:#f9fafb!important;padding:8px 12px!important}.tinymce-wrapper .tox-promotion,.tinymce-wrapper .tox-branding,.tinymce-wrapper [data-mce-name="upgrade"]{display:none!important}.tox-pop .tox-toolbar{background:#fff!important;border:1px solid#d1d5db!important;-webkit-border-radius:6px!important;-moz-border-radius:6px!important;border-radius:6px!important;-webkit-box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -2px rgba(0,0,0,.05)!important;-moz-box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -2px rgba(0,0,0,.05)!important;box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -2px rgba(0,0,0,.05)!important}.tinymce-wrapper .tox-tinymce--focused{border-color:#3b82f6!important;-webkit-box-shadow:0 0 0 3px rgba(59,130,246,.1)!important;-moz-box-shadow:0 0 0 3px rgba(59,130,246,.1)!important;box-shadow:0 0 0 3px rgba(59,130,246,.1)!important}@media(max-width:768px){.tinymce-wrapper .tox-toolbar__group{-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap}.tinymce-wrapper .tox-toolbar{padding:6px!important}.tinymce-wrapper .tox-button{margin:1px!important}}@media(max-width:640px){.tinymce-wrapper .tox-toolbar{padding:4px!important}.tinymce-wrapper .tox-button{padding:4px!important;font-size:12px!important}}'})]})}}}]);