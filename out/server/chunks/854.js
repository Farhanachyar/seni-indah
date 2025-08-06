"use strict";exports.id=854,exports.ids=[854],exports.modules={59:(e,t,i)=>{i.d(t,{Z:()=>s});var r=i(326),a=i(7626),o=i.n(a),n=i(7577),l=i(8393);let s=({title:e,subtitle:t,icon:i,children:a,defaultOpen:s=!1,className:p="",headerClassName:d="",contentClassName:c="",onToggle:m})=>{let[x,b]=(0,n.useState)(s),[f,h]=(0,n.useState)(s?void 0:0),u=(0,n.useRef)(null);return(0,n.useEffect)(()=>{if(u.current){let e=u.current.scrollHeight;h(x?e:0)}},[x]),(0,n.useEffect)(()=>{if(u.current){let e=new ResizeObserver(e=>{x&&h(e[0].target.scrollHeight)});return e.observe(u.current),()=>{e.disconnect()}}},[x]),(0,r.jsxs)("div",{className:`jsx-cebe4fafa4b8e412 bg-white rounded-lg shadow-md overflow-hidden ${p}`,children:[r.jsx("button",{onClick:()=>{let e=!x;b(e),m?.(e)},className:`jsx-cebe4fafa4b8e412 w-full p-4 lg:p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 ${d}`,children:(0,r.jsxs)("div",{className:"jsx-cebe4fafa4b8e412 flex items-center justify-between",children:[(0,r.jsxs)("div",{className:"jsx-cebe4fafa4b8e412 flex items-center space-x-3 text-left",children:[i&&r.jsx("div",{className:"jsx-cebe4fafa4b8e412 flex-shrink-0",children:i}),(0,r.jsxs)("div",{className:"jsx-cebe4fafa4b8e412",children:[r.jsx("h2",{className:"jsx-cebe4fafa4b8e412 text-lg font-semibold text-gray-900",children:e}),t&&r.jsx("p",{className:"jsx-cebe4fafa4b8e412 text-sm text-gray-600 mt-1",children:t})]})]}),r.jsx("div",{className:"jsx-cebe4fafa4b8e412 flex-shrink-0 ml-4",children:r.jsx("div",{className:`jsx-cebe4fafa4b8e412 transform transition-transform duration-300 ease-in-out ${x?"rotate-180":"rotate-0"}`,children:r.jsx(l.Z,{className:"w-5 h-5 text-gray-500"})})})]})}),r.jsx("div",{ref:u,style:{height:f},className:`jsx-cebe4fafa4b8e412 overflow-hidden transition-all duration-500 ease-in-out ${x?"opacity-100":"opacity-0"}`,children:r.jsx("div",{className:`jsx-cebe4fafa4b8e412 p-4 lg:p-6 ${c}`,children:a})}),r.jsx(o(),{id:"cebe4fafa4b8e412",children:".transition-all.jsx-cebe4fafa4b8e412{-webkit-transition-property:height,opacity;-moz-transition-timing-function:height,opacity;-o-transition-timing-function:height,opacity;transition-property:height,opacity;-webkit-transition-timing-function:cubic-bezier(.4,0,.2,1);-moz-transition-timing-function:cubic-bezier(.4,0,.2,1);-o-transition-timing-function:cubic-bezier(.4,0,.2,1);transition-timing-function:cubic-bezier(.4,0,.2,1)}"})]})}},3058:(e,t,i)=>{i.d(t,{Z:()=>l});var r=i(326),a=i(7577),o=i(5047),n=i(9686);let l=({children:e,requiredRole:t,redirectTo:i="/login"})=>{let{isAuthenticated:l,user:s,loading:p}=(0,n.E)(),d=(0,o.useRouter)(),c=e=>({super_admin:3,admin:2,moderator:1,user:0})[e]||0,m=(e,t)=>c(e)>=c(t);return((0,a.useEffect)(()=>{if(!p){if(!l){d.push(i);return}if(t&&s?.role&&!m(s.role,t)){d.push("/unauthorized");return}}},[l,s,p,t,i,d]),p)?r.jsx("div",{className:"min-h-screen flex items-center justify-center",children:(0,r.jsxs)("div",{className:"flex items-center space-x-4",children:[r.jsx("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"}),(0,r.jsxs)("div",{children:[r.jsx("p",{className:"text-gray-600 font-medium",children:"Loading..."}),r.jsx("p",{className:"text-xs text-gray-400",children:"Checking authentication & permissions..."})]})]})}):!l||t&&s?.role&&!m(s.role,t)?null:r.jsx(r.Fragment,{children:e})}},2273:(e,t,i)=>{i.d(t,{Z:()=>s});var r=i(326),a=i(7626),o=i.n(a),n=i(7577),l=i(2344);let s=({value:e,onChange:t,height:i=400,placeholder:a="Mulai menulis...",disabled:s=!1,id:p="tinymce-editor"})=>{let d=(0,n.useRef)(null);return(0,r.jsxs)("div",{className:"jsx-3822d4f327367a1c tinymce-wrapper",children:[r.jsx(l.M,{id:p,apiKey:"46xpnnaco4j4mjqv6pk3npdfni307v6m5szyurxsv3rb1g3z",onInit:(e,t)=>{d.current=t},value:e,onEditorChange:e=>{t(e)},disabled:s,init:{height:i,menubar:!1,statusbar:!0,branding:!1,promotion:!1,resize:"both",plugins:["advlist","autolink","lists","link","charmap","searchreplace","visualblocks","code","fullscreen","insertdatetime","help","wordcount","emoticons","quickbars","pagebreak","nonbreaking","visualchars"],toolbar1:"undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor | align lineheight | numlist bullist outdent indent | removeformat",toolbar2:"link charmap emoticons | searchreplace visualblocks code fullscreen | insertdatetime pagebreak nonbreaking | help",menu:{},quickbars_selection_toolbar:"bold italic underline | forecolor backcolor | blocks | link",quickbars_insert_toolbar:!1,content_style:`
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
          `,block_formats:"Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Blockquote=blockquote",font_family_formats:"Arial=arial,helvetica,sans-serif; Georgia=georgia,serif; Times New Roman=times new roman,times,serif; Verdana=verdana,sans-serif; Tahoma=tahoma,sans-serif",font_size_formats:"12px 14px 16px 18px 20px 22px 24px 28px 32px 36px",advlist_bullet_styles:"square circle disc",advlist_number_styles:"lower-alpha,lower-roman,upper-alpha,upper-roman",link_title:!1,target_list:[{title:"Same window",value:"_self"},{title:"New window",value:"_blank"}],browser_spellcheck:!0,paste_as_text:!1,paste_auto_cleanup_on_paste:!0,paste_remove_styles_if_webkit:!0,placeholder:a,contextmenu:"link",directionality:"ltr",language:"id",style_formats:[{title:"Headings",items:[{title:"Heading 1",format:"h1"},{title:"Heading 2",format:"h2"},{title:"Heading 3",format:"h3"},{title:"Heading 4",format:"h4"}]},{title:"Inline",items:[{title:"Bold",format:"bold"},{title:"Italic",format:"italic"},{title:"Underline",format:"underline"},{title:"Strikethrough",format:"strikethrough"}]},{title:"Blocks",items:[{title:"Paragraph",format:"p"},{title:"Blockquote",format:"blockquote"}]},{title:"Alignment",items:[{title:"Left",format:"alignleft"},{title:"Center",format:"aligncenter"},{title:"Right",format:"alignright"},{title:"Justify",format:"alignjustify"}]}],formats:{alignleft:{selector:"p,h1,h2,h3,h4,h5,h6,div,ul,ol,li",styles:{textAlign:"left"}},aligncenter:{selector:"p,h1,h2,h3,h4,h5,h6,div,ul,ol,li",styles:{textAlign:"center"}},alignright:{selector:"p,h1,h2,h3,h4,h5,h6,div,ul,ol,li",styles:{textAlign:"right"}},alignjustify:{selector:"p,h1,h2,h3,h4,h5,h6,div,ul,ol,li",styles:{textAlign:"justify"}},bold:{inline:"strong"},italic:{inline:"em"},underline:{inline:"u"},strikethrough:{inline:"del"},forecolor:{inline:"span",styles:{color:"%value"}},hilitecolor:{inline:"span",styles:{backgroundColor:"%value"}}},wordcount_countregex:/[\w\u2019\'-]+/g,setup:e=>{e.addShortcut("ctrl+shift+z","Redo","Redo"),e.addShortcut("ctrl+shift+l","Align Left",()=>{e.execCommand("JustifyLeft")}),e.addShortcut("ctrl+shift+c","Align Center",()=>{e.execCommand("JustifyCenter")}),e.addShortcut("ctrl+shift+r","Align Right",()=>{e.execCommand("JustifyRight")}),e.addShortcut("ctrl+shift+j","Justify",()=>{e.execCommand("JustifyFull")})}}}),r.jsx(o(),{id:"3822d4f327367a1c",children:'.tinymce-wrapper .tox-tinymce{border:1px solid#d1d5db!important;-webkit-border-radius:8px!important;-moz-border-radius:8px!important;border-radius:8px!important;-webkit-box-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px 0 rgba(0,0,0,.06)!important;-moz-box-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px 0 rgba(0,0,0,.06)!important;box-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px 0 rgba(0,0,0,.06)!important}.tinymce-wrapper .tox-editor-header{border-bottom:1px solid#e5e7eb!important}.tinymce-wrapper .tox-toolbar{background:#f9fafb!important;border-bottom:1px solid#e5e7eb!important;padding:8px!important}.tinymce-wrapper .tox-toolbar__primary{background:transparent!important}.tinymce-wrapper .tox-button{color:#374151!important;margin:2px!important;-webkit-border-radius:4px!important;-moz-border-radius:4px!important;border-radius:4px!important}.tinymce-wrapper .tox-button:hover{background:#f3f4f6!important}.tinymce-wrapper .tox-button--enabled{background:#dbeafe!important;color:#1d4ed8!important}.tinymce-wrapper .tox-statusbar{border-top:1px solid#e5e7eb!important;background:#f9fafb!important;padding:8px 12px!important}.tinymce-wrapper .tox-promotion,.tinymce-wrapper .tox-branding,.tinymce-wrapper [data-mce-name="upgrade"]{display:none!important}.tox-pop .tox-toolbar{background:#fff!important;border:1px solid#d1d5db!important;-webkit-border-radius:6px!important;-moz-border-radius:6px!important;border-radius:6px!important;-webkit-box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -2px rgba(0,0,0,.05)!important;-moz-box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -2px rgba(0,0,0,.05)!important;box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -2px rgba(0,0,0,.05)!important}.tinymce-wrapper .tox-tinymce--focused{border-color:#3b82f6!important;-webkit-box-shadow:0 0 0 3px rgba(59,130,246,.1)!important;-moz-box-shadow:0 0 0 3px rgba(59,130,246,.1)!important;box-shadow:0 0 0 3px rgba(59,130,246,.1)!important}@media(max-width:768px){.tinymce-wrapper .tox-toolbar__group{-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap}.tinymce-wrapper .tox-toolbar{padding:6px!important}.tinymce-wrapper .tox-button{margin:1px!important}}@media(max-width:640px){.tinymce-wrapper .tox-toolbar{padding:4px!important}.tinymce-wrapper .tox-button{padding:4px!important;font-size:12px!important}}'})]})}}};