(; Sample module to generate frames for the Arc project ;)
(module
  (global $allocated (mut i32) (i32.const 0))
  (global $memoryStarts i32 (i32.const 128))
  (global $colors i32 (i32.const 0))

  (func (export "transform")
    (param $buffer i32) (param $rows i32) (param $cols i32) (param $frameCount i32) (param $fps i32) (param $isFirst i32)
    (local $colorStart i32) (local $frame i32) (local $frameSize i32) (local $i i32)

    local.get $rows
    local.get $cols
    i32.mul
    local.set $frameSize

    i32.const 0
    local.set $frame

    block $frames_end loop $frames
      local.get $frame
      local.get $frameCount
      i32.ge_s
      br_if $frames_end

      (; Fill frame with solid color ;)
      local.get $frame
      i32.const 8
      i32.rem_u
      i32.const 3
      i32.mul
      global.get $colors
      i32.add
      local.set $colorStart

      i32.const 0
      local.set $i
      block $frame_end loop $frame
        local.get $i
        local.get $frameSize
        i32.ge_s
        br_if $frame_end

        local.get $buffer
        local.get $colorStart
        i32.load8_u
        i32.store8

        local.get $buffer
        local.get $colorStart
        i32.load8_u offset=1
        i32.store8 offset=1

        local.get $buffer
        local.get $colorStart
        i32.load8_u offset=2
        i32.store8 offset=2

        local.get $buffer
        i32.const 3
        i32.add
        local.set $buffer

        local.get $i
        i32.const 1
        i32.add
        local.set $i
        br $frame  
      end end

      local.get $frame
      i32.const 1
      i32.add
      local.set $frame
      br $frames
    end end
  )

  (; Very simplistic allocation/deallocation functions ;)
  (func (export "alloc") (param $size i32) (result i32)
    global.get $allocated
    if unreachable end
    i32.const 1
    global.set $allocated
    global.get $memoryStarts
  )
  (func (export "free") (param $p i32)
    global.get $allocated
    i32.const 1
    i32.xor
    if unreachable end
    local.get $p
    global.get $memoryStarts
    i32.ne
    if unreachable end
    i32.const 0
    global.set $allocated    
  )

  (memory (export "memory") 1024)
  (data (i32.const 0) "\FF\00\00\FF\FF\00\00\FF\00\00\00\00\00\00\FF\FF\00\FF\FF\FF\FF\00\FF\FF") 
)