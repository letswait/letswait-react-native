export default class Queue<T> {
  public items: T[] = []
  private limit: number = 0

  constructor(limit?: number) {
    if(limit) {
      this.limit = limit
    }
  }

  public enqueue(item: T) {
    if(this.limit !== 0 && this.items.length >= this.limit) {
      this.items.shift()
    }
    this.items = this.items.concat([item])
  }

  public dequeue(): T | undefined {
    if(this.isEmpty()) {
      return undefined
    }
    return this.items.shift()
  }

  public isEmpty(): boolean {
    return !this.items.length
  }

  public front(): T | undefined {
    if(this.isEmpty) {
      return undefined
    }
    return this.items[0]
  }

  public printQueue(): string {
    let str = ''
    // tslint:disable-next-line: prefer-for-of
    for(let i = 0; i < this.items.length; i++) {
      str += `${this.items[i]} `
    }
    return str
  }
}
