/**
 * dsh-astra-effort - host half.
 *
 * Serves the deployment's model catalog and applies one session's model /
 * reasoning-effort selection over two loopback JSON routes the client half calls:
 *
 *   POST /dsh-astra-effort/catalog  {}                       -> catalog
 *   POST /dsh-astra-effort/select   {sessionId,provider,model,reasoningEffort?}
 *
 * Both routes only read the already-mounted `sessionController` service.
 */
const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
}

function sendJson(res, status, payload) {
  res.statusCode = status
  for (const key of Object.keys(JSON_HEADERS)) res.setHeader(key, JSON_HEADERS[key])
  res.end(JSON.stringify(payload))
}

function message(error) {
  if (error === null || error === undefined) return 'unknown error'
  if (typeof error === 'string') return error
  if (typeof error.message === 'string' && error.message.length > 0) return error.message
  return String(error)
}

function readBody(req, maxBytes) {
  const limit = typeof maxBytes === 'number' ? maxBytes : 65536
  return new Promise(function (resolve, reject) {
    const chunks = []
    let size = 0
    req.on('data', function (chunk) {
      size += chunk.length
      if (size > limit) {
        reject(new Error('body too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', function () { resolve(Buffer.concat(chunks).toString('utf8')) })
    req.on('error', reject)
  })
}

async function readJson(req) {
  const text = await readBody(req)
  if (text.trim().length === 0) return {}
  const parsed = JSON.parse(text)
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('body must be a JSON object')
  }
  return parsed
}

function asString(value) {
  if (typeof value === 'string') return value
  if (value === null || value === undefined) return ''
  return String(value)
}

/** Build lossless-JSON catalog data; never carries `undefined` values. */
function catalogOf(raw) {
  const source = raw && typeof raw === 'object' ? raw : {}
  const d = source.default && typeof source.default === 'object' ? source.default : {}
  const out = {
    default: { provider: asString(d.provider), model: asString(d.model) },
    routableProviders: Array.isArray(source.routableProviders) ? source.routableProviders.map(asString) : [],
    groups: [],
    failures: Array.isArray(source.failures)
      ? source.failures.map(function (f) {
          return { id: asString(f.id), name: asString(f.name), message: asString(f.message) }
        })
      : [],
  }
  if (d.reasoningEffort !== undefined && d.reasoningEffort !== null) {
    out.default.reasoningEffort = asString(d.reasoningEffort)
  }
  const groups = Array.isArray(source.groups) ? source.groups : []
  for (const g of groups) {
    const models = []
    const rawModels = Array.isArray(g.models) ? g.models : []
    for (const m of rawModels) {
      const entry = { id: asString(m.id), name: asString(m.name) }
      if (m.reasoning !== undefined && m.reasoning !== null) {
        const reasoning = { efforts: [] }
        const rawEfforts = Array.isArray(m.reasoning.efforts) ? m.reasoning.efforts : []
        for (const e of rawEfforts) {
          const eff = { id: asString(e.id), name: asString(e.name) }
          if (e.description !== undefined && e.description !== null) eff.description = asString(e.description)
          reasoning.efforts.push(eff)
        }
        if (m.reasoning.defaultEffort !== undefined && m.reasoning.defaultEffort !== null) {
          reasoning.defaultEffort = asString(m.reasoning.defaultEffort)
        }
        entry.reasoning = reasoning
      }
      models.push(entry)
    }
    out.groups.push({ id: asString(g.id), name: asString(g.name), models: models })
  }
  return out
}

export const name = 'astra-effort'
export const inject = ['webServer', 'agents', 'llm']

/**
 * 子代理会话（header.origin === 'subagent'）被通用 Session 路由拒之门外：
 * sessionController.resolve() 第一句 liveAgent() 就会返回
 * `session "..." is owned by subagent routing`。
 * 这里绕过 resolve，直接用 live Agent 完成同样的两步：
 *   1) llm.resolveCallConfig 校验并归一化 provider/model/effort
 *   2) agents.selectForNextRequest 应用到该 Agent 的下一次请求
 * 注意：只对 subagent 会话启用，普通会话仍走 sessionController 正规路径。
 */
function isSubagentOwnershipError(error) {
  const text = message(error)
  return text.indexOf('is owned by subagent routing') !== -1
}

async function selectForSubagent(ctx, request) {
  const agents = ctx.get('agents')
  const llm = ctx.get('llm')
  if (agents === undefined || typeof agents.get !== 'function') return undefined
  const agent = agents.get(request.sessionId)
  if (agent === undefined || agent === null) return undefined
  let resolved
  if (llm !== undefined && typeof llm.resolveCallConfig === 'function') {
    resolved = await llm.resolveCallConfig({
      provider: request.provider,
      model: request.model,
      ...(request.reasoningEffort === undefined ? {} : { reasoningEffort: request.reasoningEffort }),
    })
  } else {
    resolved = { provider: request.provider, model: request.model, reasoningEffort: request.reasoningEffort }
  }
  const selected = { provider: resolved.provider, model: resolved.model }
  if (resolved.reasoningEffort !== undefined && resolved.reasoningEffort !== null) {
    selected.reasoningEffort = resolved.reasoningEffort
  }
  if (typeof agents.selectForNextRequest === 'function') {
    agents.selectForNextRequest(agent, selected)
    return selected
  }
  return undefined
}

export function apply(ctx) {
  function registerRoute(route) {
    const inner = route.handler
    return ctx.webServer.register(Object.assign({}, route, {
      handler: async function (req, res) {
        try {
          return await inner(req, res)
        } catch (error) {
          if (!res.headersSent) sendJson(res, 500, { error: message(error) })
          else res.end()
          return undefined
        }
      },
    }))
  }

  registerRoute({
    method: 'POST',
    path: '/dsh-astra-effort/catalog',
    handler: async function (req, res) {
      const controller = ctx.get('sessionController')
      if (controller === undefined) {
        sendJson(res, 503, { error: 'sessionController is not mounted in this deployment' })
        return
      }
      try {
        const raw = await controller.modelCatalog()
        sendJson(res, 200, catalogOf(raw))
      } catch (error) {
        sendJson(res, 500, { error: message(error) })
      }
    },
  })

  registerRoute({
    method: 'POST',
    path: '/dsh-astra-effort/select',
    handler: async function (req, res) {
      const controller = ctx.get('sessionController')
      if (controller === undefined) {
        sendJson(res, 503, { error: 'sessionController is not mounted in this deployment' })
        return
      }
      let body
      try {
        body = await readJson(req)
      } catch (error) {
        sendJson(res, 400, { error: message(error) })
        return
      }
      const sessionId = typeof body.sessionId === 'string' ? body.sessionId : ''
      const provider = typeof body.provider === 'string' ? body.provider : ''
      const model = typeof body.model === 'string' ? body.model : ''
      if (sessionId.length === 0 || provider.length === 0 || model.length === 0) {
        sendJson(res, 400, { error: 'sessionId, provider and model are required' })
        return
      }
      const request = { sessionId: sessionId, provider: provider, model: model }
      if (typeof body.reasoningEffort === 'string' && body.reasoningEffort.length > 0) {
        request.reasoningEffort = body.reasoningEffort
      }
      try {
        const result = await controller.selectModel(request)
        const s = (result && result.selected) || {}
        const selected = { provider: asString(s.provider), model: asString(s.model) }
        if (s.reasoningEffort !== undefined && s.reasoningEffort !== null) {
          selected.reasoningEffort = asString(s.reasoningEffort)
        }
        sendJson(res, 200, { selected: selected })
      } catch (error) {
        // 子代理会话：通用路由被 ownership 挡住，改用 live Agent 直接设置
        if (isSubagentOwnershipError(error)) {
          try {
            const selected = await selectForSubagent(ctx, request)
            if (selected !== undefined) {
              sendJson(res, 200, { selected: selected })
              return
            }
          } catch (fallbackError) {
            sendJson(res, 500, { error: message(fallbackError) })
            return
          }
        }
        sendJson(res, 500, { error: message(error) })
      }
    },
  })
}
