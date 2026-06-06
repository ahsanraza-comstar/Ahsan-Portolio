import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useRef } from 'react'
import { uploadFile } from '../../lib/api'
import {
  Bold, Italic, UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Minus,
  Heading2, Heading3,
  Link as LinkIcon, Image as ImageIcon,
  Undo, Redo,
} from 'lucide-react'

function ToolBtn({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      className={`w-7 h-7 flex items-center justify-center rounded transition-all text-xs
        ${active
          ? 'bg-[var(--amber-bright)] text-black'
          : 'text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-raised)]'
        }`}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-5 bg-[var(--border-subtle)] mx-1 shrink-0" />
}

export default function RichEditor({ value, onChange, placeholder = 'Write project details…' }) {
  const imgInputRef = useRef(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[280px] px-5 py-4 text-sm text-[var(--text-body)] leading-relaxed',
      },
    },
  })

  // Sync external value changes (e.g. when form resets)
  useEffect(() => {
    if (editor && value !== undefined && editor.getHTML() !== value) {
      editor.commands.setContent(value || '')
    }
  }, [value])

  const setLink = () => {
    const url = window.prompt('Enter URL:')
    if (url) editor.chain().focus().setLink({ href: url }).run()
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await uploadFile(fd)
      editor.chain().focus().setImage({ src: res.data.url }).run()
    } catch {
      // silent
    }
    e.target.value = ''
  }

  if (!editor) return null

  const tb = (cmd, opts) => () => editor.chain().focus()[cmd](opts).run()
  const is  = (cmd, opts) => editor.isActive(cmd, opts)

  return (
    <div className="border border-[var(--border-subtle)] rounded-[var(--radius-sm)] overflow-hidden bg-[var(--bg-surface)] focus-within:border-[var(--amber-bright)] transition-colors">

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-deep)]">

        {/* History */}
        <ToolBtn title="Undo" onClick={tb('undo')}><Undo size={13} /></ToolBtn>
        <ToolBtn title="Redo" onClick={tb('redo')}><Redo size={13} /></ToolBtn>
        <Divider />

        {/* Headings */}
        <ToolBtn title="Heading 2" active={is('heading', { level: 2 })} onClick={tb('toggleHeading', { level: 2 })}><Heading2 size={13} /></ToolBtn>
        <ToolBtn title="Heading 3" active={is('heading', { level: 3 })} onClick={tb('toggleHeading', { level: 3 })}><Heading3 size={13} /></ToolBtn>
        <Divider />

        {/* Inline */}
        <ToolBtn title="Bold"          active={is('bold')}      onClick={tb('toggleBold')}     ><Bold          size={13} /></ToolBtn>
        <ToolBtn title="Italic"        active={is('italic')}    onClick={tb('toggleItalic')}   ><Italic        size={13} /></ToolBtn>
        <ToolBtn title="Underline"     active={is('underline')} onClick={tb('toggleUnderline')}><UnderlineIcon size={13} /></ToolBtn>
        <ToolBtn title="Strikethrough" active={is('strike')}    onClick={tb('toggleStrike')}   ><Strikethrough size={13} /></ToolBtn>
        <Divider />

        {/* Alignment */}
        <ToolBtn title="Align left"    active={is({ textAlign: 'left' })}    onClick={tb('setTextAlign', 'left')}   ><AlignLeft    size={13} /></ToolBtn>
        <ToolBtn title="Align center"  active={is({ textAlign: 'center' })}  onClick={tb('setTextAlign', 'center')} ><AlignCenter  size={13} /></ToolBtn>
        <ToolBtn title="Align right"   active={is({ textAlign: 'right' })}   onClick={tb('setTextAlign', 'right')}  ><AlignRight   size={13} /></ToolBtn>
        <ToolBtn title="Justify"       active={is({ textAlign: 'justify' })} onClick={tb('setTextAlign', 'justify')}><AlignJustify size={13} /></ToolBtn>
        <Divider />

        {/* Lists */}
        <ToolBtn title="Bullet list"   active={is('bulletList')}  onClick={tb('toggleBulletList')} ><List         size={13} /></ToolBtn>
        <ToolBtn title="Ordered list"  active={is('orderedList')} onClick={tb('toggleOrderedList')}><ListOrdered  size={13} /></ToolBtn>
        <ToolBtn title="Blockquote"    active={is('blockquote')}  onClick={tb('toggleBlockquote')} ><Quote        size={13} /></ToolBtn>
        <ToolBtn title="Divider"       onClick={tb('setHorizontalRule')}                           ><Minus        size={13} /></ToolBtn>
        <Divider />

        {/* Link & Image */}
        <ToolBtn title="Add link"  active={is('link')} onClick={setLink}><LinkIcon size={13} /></ToolBtn>
        <ToolBtn title="Insert image" onClick={() => imgInputRef.current?.click()}><ImageIcon size={13} /></ToolBtn>
        <input ref={imgInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  )
}
