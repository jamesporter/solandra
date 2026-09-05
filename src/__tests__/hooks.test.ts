import { afterEach, describe, expect, it, vi } from "vitest"

afterEach(() => vi.restoreAllMocks())

describe("useInterval", () => {
  it("runs the latest callback and clears its timer", async () => {
    const effects: Array<() => void | (() => void)> = []
    const ref = { current: undefined as (() => void) | undefined }
    vi.doMock("react", () => ({
      useRef: () => ref,
      useEffect: (effect: () => void | (() => void)) => effects.push(effect),
    }))
    const setIntervalSpy = vi
      .spyOn(globalThis, "setInterval")
      .mockReturnValue(4 as never)
    const clearIntervalSpy = vi
      .spyOn(globalThis, "clearInterval")
      .mockImplementation(() => {})
    const callback = vi.fn()
    const { default: useInterval } = await import("../hooks/useInterval")

    useInterval(callback, 250)
    effects[0]()
    const cleanup = effects[1]() as () => void
    const tick = setIntervalSpy.mock.calls[0][0] as () => void
    tick()
    expect(callback).toHaveBeenCalledOnce()
    cleanup()
    expect(clearIntervalSpy).toHaveBeenCalledWith(4)
  })
})

describe("useKeypresses", () => {
  it("dispatches matching keys and removes its listener", async () => {
    let effect: (() => void | (() => void)) | undefined
    vi.doMock("react", () => ({
      useEffect: (value: typeof effect) => (effect = value),
    }))
    const addEventListener = vi.fn()
    const removeEventListener = vi.fn()
    vi.stubGlobal("document", { addEventListener, removeEventListener })
    const handler = vi.fn()
    const { default: useKeypresses } = await import("../hooks/useKeypresses")

    useKeypresses([["ArrowRight", handler]])
    const cleanup = effect!() as () => void
    const listener = addEventListener.mock.calls[0][1] as (
      event: KeyboardEvent
    ) => void
    listener({ key: "ArrowLeft" } as KeyboardEvent)
    listener({ key: "ArrowRight" } as KeyboardEvent)
    expect(handler).toHaveBeenCalledOnce()
    cleanup()
    expect(removeEventListener).toHaveBeenCalledWith("keydown", listener)
  })
})
