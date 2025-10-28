import { getReasonPhrase } from 'http-status-codes'

export type ALLOWED_HTTP_STATUS_CODES =
	| '400'
	| '401'
	| '403'
	| '404'
	| '500'
	| '501'
	| '502'
	| '503'
	| '504'
	| '505'

export class HTTPError extends Error {
	code: ALLOWED_HTTP_STATUS_CODES
	constructor(code: ALLOWED_HTTP_STATUS_CODES, message: string) {
		super(message)
		this.name = getReasonPhrase(code)
		this.code = code
	}
}
/**
 * Asserts that a condition is true, otherwise throws an HTTPError with the specified status code and message.
 * @param {any} condition - The condition to assert.
 * @param {string} [message] - The message to include in the error. If not provided, the default HTTP STATUS message will be used.
 * @param {ALLOWED_HTTP_STATUS_CODES} [code='400'] - The HTTP status code to include in the error. Defaults to 400 Bad Request.
 * @returns {void}
 * @throws {HTTPError} Throws an HTTPError if the condition is false.
 */
export function assertHTTP(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// biome-ignore lint/suspicious/noExplicitAny: this param accepts *anything* for real
	condition: any,
	message?: string,
	code: ALLOWED_HTTP_STATUS_CODES = '400',
): asserts condition {
	if (condition) return
	const origSTL = Error.stackTraceLimit // a trick for ~3x faster exceptions
	Error.stackTraceLimit = 0
	try {
		throw new HTTPError(code, message || getReasonPhrase(code))
	} finally {
		Error.stackTraceLimit = origSTL
	}
}