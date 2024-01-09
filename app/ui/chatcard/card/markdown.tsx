import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css'
import '@/app/github-markdown-light.css'

export default function Markdown({ message, classname }: any) {
  const md = message
  if (!!!classname) {
    classname = 'markdown-body'
  }
  return (
    <ReactMarkdown
      className={classname}
      remarkPlugins={[[remarkGfm, { singleTilde: false }], remarkMath]}
      rehypePlugins={[rehypeKatex]}
      urlTransform={(value: string) => value}
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <SyntaxHighlighter
              style={oneDark}
              language={match[1]}
              PreTag="div"
              {...props}
            >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
          ) : (
            <code {...props} className={className}>
              {children}
            </code>
          )
        }
      }}
    >{md}</ReactMarkdown>
  )
}