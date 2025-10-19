type SessionPayload = {
  userId: string
}

// PagesFunction types from cloduflare doesnt not provide correct typing for Env
type Handler<Params extends string = never, Data = never> = (
  context: EventContext<Env, Params, Data>
) => Response | Promise<Response>
//  Handler<'projectId' | 'id', { name: string }>

type SessionHandler<Params extends string = never, Data = never> = (
  context: EventContext<Env, Params, Data>,
  session: SessionPayload
) => Response | Promise<Response>
//  SessionHandler<'projectId' | 'id', { name: string }>
