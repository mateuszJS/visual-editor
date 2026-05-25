import { ProgramCompilationInfo } from '@mateuszjs/magic-render/types'
import { Token, TokenStream } from 'prism-react-editor/prism'

export default function onTokenize(info: ProgramCompilationInfo | undefined, tokens: TokenStream) {
  if (!info) return

  let currLineNum = 1
  let currLineCol = 1

  const getText = (t: string | Token): string => {
    if (typeof t === 'string') return t
    if (Array.isArray(t.content)) return t.content.map(getText).join('')
    return t.content as string
  }

  const className = info.type === 'error' ? 'magic-error' : 'magic-warning'

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    const content = getText(token)
    const lines = content.split('\n')

    const endLineNum = currLineNum + lines.length - 1
    const endLineCol =
      lines.length === 1 ? currLineCol + lines[0].length : lines[lines.length - 1].length + 1

    // Check if token intersects with the info line
    if (currLineNum <= info.lineNum && endLineNum >= info.lineNum) {
      const startColOnTarget = currLineNum === info.lineNum ? currLineCol : 1
      const endColOnTarget = endLineNum === info.lineNum ? endLineCol : Infinity

      const rangeStart = info.linePos
      const rangeEnd = info.linePos + info.length

      if (startColOnTarget < rangeEnd && endColOnTarget > rangeStart) {
        // Calculate offset to the start of the target line within the token
        let offset = 0
        if (currLineNum < info.lineNum) {
          for (let j = 0; j < info.lineNum - currLineNum; j++) {
            offset += lines[j].length + 1 // +1 for newline
          }
        }

        const lineSegmentLength = lines[info.lineNum - currLineNum].length
        const relStart = offset + Math.max(0, rangeStart - startColOnTarget)
        const relEnd = offset + Math.min(lineSegmentLength, rangeEnd - startColOnTarget)

        if (relStart < relEnd) {
          const pre = content.slice(0, relStart)
          const mid = content.slice(relStart, relEnd)
          const post = content.slice(relEnd)

          const newTokens: (string | Token)[] = []
          if (pre) {
            if (token instanceof Token) {
              newTokens.push(new Token(token.type, pre, pre, token.alias))
            } else {
              newTokens.push(pre)
            }
          }

          if (token instanceof Token) {
            const newAlias = token.alias ? `${token.alias} ${className}` : className
            newTokens.push(new Token(token.type, mid, mid, newAlias))
          } else {
            newTokens.push(new Token(className, mid, mid, className))
          }

          if (post) {
            if (token instanceof Token) {
              newTokens.push(new Token(token.type, post, post, token.alias))
            } else {
              newTokens.push(post)
            }
          }

          tokens.splice(i, 1, ...newTokens)
          i += newTokens.length - 1
        }
      }
    }

    currLineNum = endLineNum
    currLineCol = endLineCol
  }
}
