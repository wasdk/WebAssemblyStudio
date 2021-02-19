(; Sample module to generate frames for the Arc project ;)
(module
  (global $allocated (mut i32) (i32.const 0))
  (global $memoryStarts i32 (i32.const 128))
  (global $colors i32 (i32.const 0))

  (func (export "transform")
    (param $buffer i32) (param $rows i32) (param $cols i32) (param $frameCount i32) (param $fps i32) (param $isFirst i32)
    (local $colorStart i32) (local $frame i32) (local $frameSize i32) (local $i i32)

    get_local $rows
    get_local $cols
    i32.mul
    set_local $frameSize

    i32.const 0
    set_local $frame

    block $frames_end loop $frames
      get_local $frame
      get_local $frameCount
      i32.ge_s
      br_if $frames_end

      (; Fill frame with solid color ;)
      get_local $frame
      i32.const 8
      i32.rem_u
      i32.const 3
      i32.mul
      get_global $colors
      i32.add
      set_local $colorStart

      i32.const 0
      set_local $i
      block $frame_end loop $frame
        get_local $i
        get_local $frameSize
        i32.ge_s
        br_if $frame_end

        get_local $buffer
        get_local $colorStart
        i32.load8_u
        i32.store8

        get_local $buffer
        get_local $colorStart
        i32.load8_u offset=1
        i32.store8 offset=1

        get_local $buffer
        get_local $colorStart
        i32.load8_u offset=2
        i32.store8 offset=2

        get_local $buffer
        i32.const 3
        i32.add
        set_local $buffer

        get_local $i
        i32.const 1
        i32.add
        set_local $i
        br $frame  
      end end

      get_local $frame
      i32.const 1
      i32.add
      set_local $frame
      br $frames
    end end
  )

  (; Very simplistic allocation/deallocation functions ;)
  (func (export "alloc") (param $size i32) (result i32)
    get_global $allocated
    if unreachable end
    i32.const 1
    set_global $allocated
    get_global $memoryStarts
  )
  (func (export "free") (param $p i32)
    get_global $allocated
    i32.const 1
    i32.xor
    if unreachable end
    get_local $p
    get_global $memoryStarts
    i32.ne
    if unreachable end
    i32.const 0
    set_global $allocated    
  )

  (memory (export "memory") 1024)
  (data (i32.const 0) "\FF\00\00\FF\FF\00\00\FF\00\00\00\00\00\00\FF\FF\00\FF\FF\FF\FF\00\FF\FF") 
)