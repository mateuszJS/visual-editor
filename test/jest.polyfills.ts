import { TextDecoder, TextEncoder } from 'node:util'
import { ReadableStream, TransformStream, WritableStream } from 'node:stream/web'

Object.assign(globalThis, {
  TextDecoder,
  TextEncoder,
  ReadableStream,
  TransformStream,
  WritableStream,
})
