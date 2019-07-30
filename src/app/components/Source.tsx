import React from "react"
import SyntaxHighlighter from "react-syntax-highlighter"

export default function Source({ code }) {
  return (
    <div className="p-4 my-4 text-gray-300 bg-gray-700">
      <SyntaxHighlighter language="typescript" useInlineStyles={false}>
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
