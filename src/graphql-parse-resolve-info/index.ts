'use strict'
import assert from 'assert'
import graphql_1, { DirectiveNode, FieldNode, GraphQLResolveInfo } from 'graphql'
import values_1 from 'graphql/execution/values.js'
import debugFactory from 'debug'
const debug = debugFactory('graphql-parse-resolve-info')
const DEBUG_ENABLED = debug.enabled
function getArgVal(resolveInfo, argument) {
  if (argument.kind === 'Variable') {
    return resolveInfo.variableValues[argument.name.value]
  }
  else if (argument.kind === 'BooleanValue') {
    return argument.value
  }
}
function argNameIsIf(arg) {
  return arg && arg.name ? arg.name.value === 'if' : false
}

type directives = {
  directives: {
    name: {
      value: string
    },
    arguments?: {
      value: string
    }[]
  }[],
  kind: string,
  name: {
    value: string
  }
  alias: {
    value: string
  }
}

function skipField(resolveInfo, { directives = [] }: directives) {
  let skip = false
  directives.forEach(directive => {
    const directiveName = directive.name.value
    if (Array.isArray(directive.arguments)) {
      const ifArgumentAst = directive.arguments.find(argNameIsIf)
      if (ifArgumentAst) {
        const argumentValueAst = ifArgumentAst.value
        if (directiveName === 'skip') {
          skip = skip || getArgVal(resolveInfo, argumentValueAst)
        }
        else if (directiveName === 'include') {
          skip = skip || !getArgVal(resolveInfo, argumentValueAst)
        }
      }
    }
  })
  return skip
}

type parseResolveInfoOptions = {
  keepRoot?: boolean | null,
  deep?: boolean | null
}

export function parseResolveInfo(resolveInfo: GraphQLResolveInfo, options: parseResolveInfoOptions = {} ): unknown {
  const fieldNodes: readonly FieldNode[] | DirectiveNode[] =
    resolveInfo.fieldNodes || (resolveInfo as unknown as Record<string, unknown>).fieldASTs
  const { parentType } = resolveInfo
  if (!fieldNodes) {
    throw new Error('No fieldNodes provided!')
  }
  if (options.keepRoot == null) {
    options.keepRoot = false
  }
  if (options.deep == null) {
    options.deep = true
  }
  const tree = fieldTreeFromAST(fieldNodes, resolveInfo, undefined, options, parentType)
  if (!options.keepRoot) {
    const typeKey = firstKey(tree)
    if (!typeKey) {
      return null
    }
    const fields = tree[typeKey]
    const fieldKey = firstKey(fields)
    if (!fieldKey) {
      return null
    }
    return fields[fieldKey]
  }
  return tree
}

function getFieldFromAST(ast, parentType) {
  if (ast.kind === 'Field') {
    const fieldNode = ast
    const fieldName = fieldNode.name.value
    if (!(parentType instanceof graphql_1.GraphQLUnionType)) {
      const type = parentType
      return type.getFields()[fieldName]
    }
    else {
      // XXX: TODO: Handle GraphQLUnionType
    }
  }
  return undefined
}
let iNum = 1
function fieldTreeFromAST(inASTs: readonly FieldNode[] | DirectiveNode[], resolveInfo, initTree = {}, options: parseResolveInfoOptions = {}, parentType, depth = '') {
  const instance = iNum++
  if (DEBUG_ENABLED)
    debug('%s[%d] Entering fieldTreeFromAST with parent type "%s"', depth, instance, parentType)
  const { variableValues } = resolveInfo
  const fragments = resolveInfo.fragments || {}
  const asts = Array.isArray(inASTs) ? inASTs : [inASTs]
  if (!initTree[parentType.name]) {
    initTree[parentType.name] = {}
  }
  const outerDepth = depth
  return (asts.reduce as any)((tree, selectionVal, idx) => {
    const depth = DEBUG_ENABLED ? `${outerDepth}  ` : null
    if (DEBUG_ENABLED)
      debug('%s[%d] Processing AST %d of %d kind = %s', depth, instance, idx + 1, asts.length, selectionVal.kind)
    if (skipField(resolveInfo, selectionVal)) {
      if (DEBUG_ENABLED)
        debug('%s[%d] IGNORING due to directive', depth, instance)
    }
    else if (selectionVal.kind === 'Field') {
      const val = selectionVal
      const name = val.name.value
      const isReserved = name[0] === '_' && name[1] === '_' && name !== '__id'
      if (isReserved) {
        if (DEBUG_ENABLED)
          debug('%s[%d] IGNORING because field "%s" is reserved', depth, instance, name)
      }
      else {
        const alias = val.alias && val.alias.value ? val.alias.value : name
        if (DEBUG_ENABLED)
          debug('%s[%d] Field "%s" (alias = "%s")', depth, instance, name, alias)
        const field = getFieldFromAST(val, parentType)
        if (field == null) {
          return tree
        }
        const fieldGqlTypeOrUndefined: any = graphql_1.getNamedType(field.type)
        if (!fieldGqlTypeOrUndefined) {
          return tree
        }
        const fieldGqlType = fieldGqlTypeOrUndefined
        const args = values_1.getArgumentValues(field, val, variableValues) || {}
        if (parentType.name && !tree[parentType.name][alias]) {
          const newTreeRoot = {
            name,
            alias,
            args,
            fieldsByTypeName: graphql_1.isCompositeType(fieldGqlType)
              ? {
                [fieldGqlType.name]: {},
              }
              : {},
          }
          tree[parentType.name][alias] = newTreeRoot
        }
        const selectionSet = val.selectionSet
        if (selectionSet != null &&
          options.deep &&
          graphql_1.isCompositeType(fieldGqlType)) {
          const newParentType = fieldGqlType
          if (DEBUG_ENABLED)
            debug('%s[%d] Recursing into subfields', depth, instance)
          fieldTreeFromAST(selectionSet.selections, resolveInfo, tree[parentType.name][alias].fieldsByTypeName, options, newParentType, `${depth}  `)
        }
        else {
          // No fields to add
          if (DEBUG_ENABLED)
            debug('%s[%d] Exiting (no fields to add)', depth, instance)
        }
      }
    }
    else if (selectionVal.kind === 'FragmentSpread' && options.deep) {
      const val = selectionVal
      const name = val.name && val.name.value
      if (DEBUG_ENABLED)
        debug('%s[%d] Fragment spread "%s"', depth, instance, name)
      const fragment = fragments[name]
      assert(fragment, 'unknown fragment "' + name + '"')
      let fragmentType = parentType
      if (fragment.typeCondition) {
        fragmentType = getType(resolveInfo, fragment.typeCondition)
      }
      if (fragmentType && graphql_1.isCompositeType(fragmentType)) {
        const newParentType = fragmentType
        fieldTreeFromAST(fragment.selectionSet.selections, resolveInfo, tree, options, newParentType, `${depth}  `)
      }
    }
    else if (selectionVal.kind === 'InlineFragment' && options.deep) {
      const val = selectionVal
      const fragment = val
      let fragmentType = parentType
      if (fragment.typeCondition) {
        fragmentType = getType(resolveInfo, fragment.typeCondition)
      }
      if (DEBUG_ENABLED)
        debug('%s[%d] Inline fragment (parent = "%s", type = "%s")', depth, instance, parentType, fragmentType)
      if (fragmentType && graphql_1.isCompositeType(fragmentType)) {
        const newParentType = fragmentType
        fieldTreeFromAST(fragment.selectionSet.selections, resolveInfo, tree, options, newParentType, `${depth}  `)
      }
    }
    else {
      if (DEBUG_ENABLED)
        debug('%s[%d] IGNORING because kind "%s" not understood', depth, instance, selectionVal.kind)
    }
    // Ref: https://github.com/graphile/postgraphile/pull/342/files#diff-d6702ec9fed755c88b9d70b430fda4d8R148
    return tree
  }, initTree as any)
}
const hasOwnProperty = Object.prototype.hasOwnProperty
function firstKey(obj) {
  for (const key in obj) {
    if (hasOwnProperty.call(obj, key)) {
      return key
    }
  }
}
function getType(resolveInfo, typeCondition) {
  const { schema } = resolveInfo
  const { kind, name } = typeCondition
  if (kind === 'NamedType') {
    const typeName = name.value
    return schema.getType(typeName)
  }
}
export function simplifyParsedResolveInfoFragmentWithType(parsedResolveInfoFragment, type) {
  const { fieldsByTypeName } = parsedResolveInfoFragment
  const fields = {}
  const strippedType: any = graphql_1.getNamedType(type)
  if (graphql_1.isCompositeType(strippedType)) {
    Object.assign(fields, fieldsByTypeName[strippedType.name])
    if (strippedType instanceof graphql_1.GraphQLObjectType) {
      const objectType = strippedType
      // GraphQL ensures that the subfields cannot clash, so it's safe to simply overwrite them
      for (const anInterface of objectType.getInterfaces()) {
        Object.assign(fields, fieldsByTypeName[anInterface.name])
      }
    }
  }
  return {
    ...parsedResolveInfoFragment,
    fields,
  }
}
export const parse = parseResolveInfo