import { ExecutionResult } from 'graphql'

// eslint-disable-next-line no-unused-vars
export type ExecuteGraphQL = (document: string) => Promise<ExecutionResult>