import contentType from 'content-type'
import type { Request } from 'express'
import httpError from 'http-errors'
import zlib from 'zlib'
/**
 * Provided a "Request" provided by express or connect (typically a node style
 * HTTPClientRequest), Promise the body data contained.
 */
export async function parseBody(req: Request): Promise<Request['body']> {
  const { body } = req
  // If express has already parsed a body as a keyed object, use it.
  if (typeof body === 'object' && !(body instanceof Buffer)) {
    return body
  }
  // Skip requests without content types.
  if (req.headers['content-type'] === undefined) {
    return {}
  }
  const typeInfo = contentType.parse(req)
  // If express has already parsed a body as a string, and the content-type
  // was application/graphql, parse the string body.
  if (typeof body === 'string' && typeInfo.type === 'application/graphql') {
    return { query: body }
  }
  // Already parsed body we didn't recognise? Parse nothing.
  if (body !== undefined) {
    return {}
  }
  const rawBody = await readBody(req, typeInfo)
  // Use the correct body parser based on Content-Type header.
  switch (typeInfo.type) {
  case 'application/graphql':
    return { query: rawBody }
  case 'application/json':
    if (jsonObjRegex.test(rawBody)) {
      try {
        return JSON.parse(rawBody)
      }
      catch {
        // Do nothing
      }
    }
    throw httpError(400, 'POST body sent invalid JSON.')
  case 'application/x-www-form-urlencoded':
    return Array.from(new URLSearchParams(rawBody).entries()).reduce((previous, current) => {
      previous[current[0]] = current[1]
      return previous
    }, {})
  }
  // If no Content-Type header matches, parse nothing.
  return {}
}
/**
 * RegExp to match an Object-opening brace "{" as the first non-space
 * in a string. Allowed whitespace is defined in RFC 7159:
 *
 *     ' '   Space
 *     '\t'  Horizontal tab
 *     '\n'  Line feed or New line
 *     '\r'  Carriage return
 */
const jsonObjRegex = /^[ \t\n\r]*\{/
/**
 * Read and parse a request body.
 * @param req
 * @param typeInfo
 * @returns
 */
async function readBody(req, typeInfo) {
  let _a, _b
  const charset = (_b = (_a = typeInfo.parameters['charset']) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : 'utf-8'
  // Assert charset encoding per JSON RFC 7159 sec 8.1
  if (charset !== 'utf8' && charset !== 'utf-8' && charset !== 'utf16le') {
    throw httpError(415, `Unsupported charset "${charset.toUpperCase()}".`)
  }
  return decompressed(req, charset)
}
/**
 * Checks if a request is compressed and decompresses it into a string.
 * @param req Request to decompress.
 * @param charset Charset to use when parsing the request into a string.
 * @returns The request in String form.
 */
async function decompressed(req, charset: BufferEncoding = 'utf-8', maxSize = 100 * 1024) {
  let _a
  let stream
  const encoding = (_a = req.headers['content-encoding']) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase()
  switch (encoding) {
  case undefined:
  case 'identity':
    stream = req
    break
  case 'deflate':
    stream = req.pipe(zlib.createInflate())
    break
  case 'gzip':
    stream = req.pipe(zlib.createGunzip())
    break
  default:
    throw httpError(415, `Unsupported content-encoding "${encoding}".`)
  }
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of stream) {
    size += chunk.byteLength
    if (size > maxSize)
      throw httpError(413, 'Invalid body: request entity too large.')
    chunks.push(Buffer.from(chunk))
  }
  return Buffer.concat(chunks).toString(charset)
}
//# sourceMappingURL=parseBody.js.map