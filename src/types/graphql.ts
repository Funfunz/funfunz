import { ExecutionResult } from 'graphql'

export type ExecuteGraphQL = (document: string) => Promise<ExecutionResult>