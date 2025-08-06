'use client';

import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface TinyMCEEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({
  value,
  onChange,
  height = 400,
  placeholder = 'Mulai menulis...',
  disabled = false,
  id = 'tinymce-editor'
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  return (
    <div className="tinymce-wrapper">
      <Editor
        id={id}
        apiKey="46xpnnaco4j4mjqv6pk3npdfni307v6m5szyurxsv3rb1g3z"
        onInit={(evt, editor) => {
          editorRef.current = editor;
        }}
        value={value}
        onEditorChange={handleEditorChange}
        disabled={disabled}
        init={{
          height: height,
          menubar: false, 
          statusbar: true,
          branding: false, 
          promotion: false, 
          resize: 'both',

          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'charmap', 
            'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'help', 'wordcount', 'emoticons',
            'quickbars', 'pagebreak', 'nonbreaking', 'visualchars'
          ],

          toolbar1: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | ' +
                   'forecolor backcolor | align lineheight | numlist bullist outdent indent | removeformat',
          toolbar2: 'link charmap emoticons | searchreplace visualblocks code fullscreen | ' +
                   'insertdatetime pagebreak nonbreaking | help',

          menu: {},

          quickbars_selection_toolbar: 'bold italic underline | forecolor backcolor | blocks | link',
          quickbars_insert_toolbar: false, 

          content_style: `
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
          `,

          block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Blockquote=blockquote',

          font_family_formats: 'Arial=arial,helvetica,sans-serif; Georgia=georgia,serif; Times New Roman=times new roman,times,serif; Verdana=verdana,sans-serif; Tahoma=tahoma,sans-serif',

          font_size_formats: '12px 14px 16px 18px 20px 22px 24px 28px 32px 36px',

          advlist_bullet_styles: 'square circle disc',
          advlist_number_styles: 'lower-alpha,lower-roman,upper-alpha,upper-roman',

          link_title: false,
          target_list: [
            { title: 'Same window', value: '_self' },
            { title: 'New window', value: '_blank' }
          ],

          browser_spellcheck: true,

          paste_as_text: false,
          paste_auto_cleanup_on_paste: true,
          paste_remove_styles_if_webkit: true,

          placeholder: placeholder,
          contextmenu: 'link', 
          directionality: 'ltr',
          language: 'id',

          style_formats: [
            { title: 'Headings', items: [
              { title: 'Heading 1', format: 'h1' },
              { title: 'Heading 2', format: 'h2' },
              { title: 'Heading 3', format: 'h3' },
              { title: 'Heading 4', format: 'h4' }
            ]},
            { title: 'Inline', items: [
              { title: 'Bold', format: 'bold' },
              { title: 'Italic', format: 'italic' },
              { title: 'Underline', format: 'underline' },
              { title: 'Strikethrough', format: 'strikethrough' }
            ]},
            { title: 'Blocks', items: [
              { title: 'Paragraph', format: 'p' },
              { title: 'Blockquote', format: 'blockquote' }
            ]},
            { title: 'Alignment', items: [
              { title: 'Left', format: 'alignleft' },
              { title: 'Center', format: 'aligncenter' },
              { title: 'Right', format: 'alignright' },
              { title: 'Justify', format: 'alignjustify' }
            ]}
          ],

          formats: {
            alignleft: { selector: 'p,h1,h2,h3,h4,h5,h6,div,ul,ol,li', styles: { textAlign: 'left' } },
            aligncenter: { selector: 'p,h1,h2,h3,h4,h5,h6,div,ul,ol,li', styles: { textAlign: 'center' } },
            alignright: { selector: 'p,h1,h2,h3,h4,h5,h6,div,ul,ol,li', styles: { textAlign: 'right' } },
            alignjustify: { selector: 'p,h1,h2,h3,h4,h5,h6,div,ul,ol,li', styles: { textAlign: 'justify' } },
            bold: { inline: 'strong' },
            italic: { inline: 'em' },
            underline: { inline: 'u' },
            strikethrough: { inline: 'del' },
            forecolor: { inline: 'span', styles: { color: '%value' } },
            hilitecolor: { inline: 'span', styles: { backgroundColor: '%value' } }
          },

          wordcount_countregex: /[\w\u2019\'-]+/g,

          setup: (editor) => {

            editor.addShortcut('ctrl+shift+z', 'Redo', 'Redo');
            editor.addShortcut('ctrl+shift+l', 'Align Left', () => {
              editor.execCommand('JustifyLeft');
            });
            editor.addShortcut('ctrl+shift+c', 'Align Center', () => {
              editor.execCommand('JustifyCenter');
            });
            editor.addShortcut('ctrl+shift+r', 'Align Right', () => {
              editor.execCommand('JustifyRight');
            });
            editor.addShortcut('ctrl+shift+j', 'Justify', () => {
              editor.execCommand('JustifyFull');
            });
          }
        }}
      />

      {}
      <style jsx global>{`
        .tinymce-wrapper .tox-tinymce {
          border: 1px solid #d1d5db !important;
          border-radius: 8px !important;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important;
        }

        .tinymce-wrapper .tox-editor-header {
          border-bottom: 1px solid #e5e7eb !important;
        }

        .tinymce-wrapper .tox-toolbar {
          background: #f9fafb !important;
          border-bottom: 1px solid #e5e7eb !important;
          padding: 8px !important;
        }

        .tinymce-wrapper .tox-toolbar__primary {
          background: transparent !important;
        }

        .tinymce-wrapper .tox-button {
          color: #374151 !important;
          margin: 2px !important;
          border-radius: 4px !important;
        }

        .tinymce-wrapper .tox-button:hover {
          background: #f3f4f6 !important;
        }

        .tinymce-wrapper .tox-button--enabled {
          background: #dbeafe !important;
          color: #1d4ed8 !important;
        }

        .tinymce-wrapper .tox-statusbar {
          border-top: 1px solid #e5e7eb !important;
          background: #f9fafb !important;
          padding: 8px 12px !important;
        }

        .tinymce-wrapper .tox-promotion,
        .tinymce-wrapper .tox-branding,
        .tinymce-wrapper [data-mce-name="upgrade"] {
          display: none !important;
        }

        .tox-pop .tox-toolbar {
          background: #ffffff !important;
          border: 1px solid #d1d5db !important;
          border-radius: 6px !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        }

        .tinymce-wrapper .tox-tinymce--focused {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }

        @media (max-width: 768px) {
          .tinymce-wrapper .tox-toolbar__group {
            flex-wrap: wrap;
          }

          .tinymce-wrapper .tox-toolbar {
            padding: 6px !important;
          }

          .tinymce-wrapper .tox-button {
            margin: 1px !important;
          }
        }

        @media (max-width: 640px) {
          .tinymce-wrapper .tox-toolbar {
            padding: 4px !important;
          }

          .tinymce-wrapper .tox-button {
            padding: 4px !important;
            font-size: 12px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TinyMCEEditor;