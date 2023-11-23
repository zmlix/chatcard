import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import '@/app/github-markdown-light.css'

export default function Markdown({ message }:any) {
  const md = message 
//   ? message : `A paragraph with *emphasis* and **strong importance**.
// \`\`\`
// npm install react-markdown
// // or
// yarn add react-markdown
// \`\`\`
// > A block quote with ~strikethrough~ and a URL: https://reactjs.org.

// * Lists
// * [ ] todo
// * [x] done

// A table:

// | a | b |
// | - | - |

// \`\`\`jsx
// import React from 'react';
// import ReactMarkdown from 'react-markdown';

// function MyComponent() {
//   const markdown = '# This is a header\n\nAnd this is a paragraph';

//   return (
//     <div>
//       <ReactMarkdown>{markdown}</ReactMarkdown>
//     </div>
//   );
// }

// export default MyComponent;
// \`\`\`
// `
  return (
    <ReactMarkdown
      className='markdown-body'
      remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
      components={{
        code({node, inline, className, children, ...props}:any) {
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