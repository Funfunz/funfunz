export class Memory {
  private storage: {
    [key: string]: {
      requestCounter: number,
      value: any
      timeoutId: NodeJS.Timeout
    }
  } = {}
  private totalRequests: number = 10
  private TTL: number = 10 * 60 * 1000

  constructor(totalRequests?: number, TTL?: number) {
    if (totalRequests || totalRequests === 0) {
      this.totalRequests = totalRequests
    }

    if (TTL || TTL === 0) {
      this.TTL = TTL * 60 * 1000
    }
  }
  public setItem(key: string, value: any, TTL?: number) {
    const timeoutId = this.createTimeout(key, TTL)
    this.storage[key] = {
      requestCounter: 0,
      value,
      timeoutId,
    }
    return true
  }

  public getItem(key: string) {
    if (!this.storage[key]) {
      return undefined
    }

    this.storage[key].requestCounter += 1
    const item = this.storage[key]
    if (item.requestCounter >= this.totalRequests) {
      clearTimeout(this.storage[key].timeoutId)
      delete this.storage[key]
    }

    return item.value
  }

  public hasItem(key: string) {
    if (!this.storage[key]) {
      return false
    }
    return true
  }

  public resetItemCounter(key: string, TTL?: number) {
    if (!this.storage[key]) {
      return false
    }

    clearTimeout(this.storage[key].timeoutId)
    this.storage[key].requestCounter = 0
    this.storage[key].timeoutId = this.createTimeout(key, TTL)
    return true
  }

  public removeItem(key: string) {
    clearTimeout(this.storage[key].timeoutId)
    delete this.storage[key]
    return true
  }

  private createTimeout(key: string, TTL?: number) {
    return setTimeout(
      () => {
        this.removeItem(key)
      },
      (TTL || TTL === 0) ? TTL * 60 * 1000 : this.TTL
    )
  }
}

const memory = new Memory()

export default memory
