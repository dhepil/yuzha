// @ts-nocheck
declare module 'https://esm.sh/@supabase/supabase-js@2' {
  export * from '@supabase/supabase-js'
}

declare module 'https://deno.land/std@0.168.0/http/server.ts' {
  export function serve(
    handler: (request: Request) => Response | Promise<Response>,
    options?: Record<string, unknown>
  ): Promise<void>
}

declare const Deno: {
  env: {
    get(key: string): string | undefined
  }
}
