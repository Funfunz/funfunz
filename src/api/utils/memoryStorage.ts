export class Memory {
  private storage: {
    [key: string]: {
      requestCounter: number,
      value: any
    }
  } = {}
  private totalRequests: number = 10

  constructor(totalRequests?: number) {
    if (totalRequests || totalRequests === 0) {
      this.totalRequests = totalRequests
    }
  }
  public setItem(key: string, value: any) {
    this.storage[key] = {
      requestCounter: 0,
      value,
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

  public resetItemCounter(key: string) {
    if (!this.storage[key]) {
      return false
    }

    this.storage[key].requestCounter = 0
    return true
  }

  public removeItem(key: string) {
    delete this.storage[key]
    return true
  }
}

const memory = new Memory()

export default memory
