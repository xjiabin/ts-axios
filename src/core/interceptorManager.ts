import { RejectedFn, ResolvedFn } from '../types'

interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

export default class InterceptorManager<T> {
  private _interceptors: Array<Interceptor<T> | null>

  constructor() {
    this._interceptors = []
  }

  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this._interceptors.push({
      resolved,
      rejected,
    })
    return this._interceptors.length - 1
  }

  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this._interceptors.forEach((interceptor) => {
      if (interceptor !== null) {
        fn(interceptor)
      }
    })
  }

  eject(id: number): void {
    if (this._interceptors[id]) {
      this._interceptors[id] = null
    }
  }
}
