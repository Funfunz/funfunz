import { Memory } from '../src/api/utils/memoryStorage'

const memory = new Memory(2)

describe('Memory storage', () => {

  it('Should answer false on hasItem if item not present', () => {
    expect(memory.hasItem('stuff')).toBe(false)
  })

  it('Should answer undefined on getItem if item not present', () => {
    expect(memory.getItem('stuff')).toBe(undefined)
  })

  it('Should answer true on setItem', () => {
    expect(memory.setItem('stuff', 'cool')).toBe(true)
  })

  it('Should get the item correctly on getItem', () => {
    expect(memory.getItem('stuff')).toBe('cool')
  })

  it('Should answer true on hasItem if item present', () => {
    expect(memory.hasItem('stuff')).toBe(true)
  })

  it('Should answer true on resetItemCount if item present', () => {
    expect(memory.resetItemCounter('stuff')).toBe(true)
  })

  it('Should answer true on removeItem', () => {
    expect(memory.removeItem('stuff')).toBe(true)
  })

  it('Should answer false on resetItemCount if item not present', () => {
    expect(memory.resetItemCounter('stuff')).toBe(false)
  })

  it('Should remove item after resetCounter is reached', () => {
    memory.setItem('stuff', true)
    memory.getItem('stuff')
    memory.getItem('stuff')
    const result = memory.hasItem('stuff')
    expect(result).toBe(false)
  })
})
