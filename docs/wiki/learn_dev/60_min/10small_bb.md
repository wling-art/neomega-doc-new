# Step X.

太好了，这刚好是第 X 步。罗马数字 X 很适合以此为标题揭露一些有趣的秘密。

你有没有想过，如果当一个玩家唤起菜单，且当 Omega 正在询问他信息或者与他交流时，如果另一个玩家也唤起了菜单，或者你自己在终端正在输入，那么会怎么样呢？

如果你此前没有任何代码经验的话，你大概会觉得不明所以。是啊？所以会怎么样呢？

但是，如果你此前有任何代码经验，你大概会顿感不妙。天呐，程序该不会卡住吧？

你这么想到，因为你很清楚，当程序运行到 `input`、`ask`、`sleep` 这种地方时，程序就会停下来等待输入或者时间到达，这时候如果有别的事件，比如另一个玩家唤起菜单，程序就会卡住...吗？

神奇的是，你测试了一下，发现这种事情并没有发生，但这是为什么呢？

这就是 Coromega 背后的秘密，也是它为什么叫 Coro-Omega 的原因。注意到 `start_new` 这个函数了吗？

有没有考虑过 `start_new` 的究竟是什么呢？

答案是 `start_new` 的是一个 coroutine。

coroutine 是一个远比线程轻的东西，它和普通的函数调用几乎没有任何区别...但是代价是什么？

代价是，coroutine 必须主动让出执行权，而这会使得程序变得异常复杂...

而 Coromega 则在背后做了大量的工作，`coromega:run()` 隐藏了这些复杂的细节，并将异步、回调，以及复杂的协程编程用一种简单的方式提供。

你只需要记得 `start_new` 的是一个协程，而当协程内的程序运行到需要等待的函数（`input`、`ask`、`sleep`、`send_ws/player_cmd`、`http` 等等）的时候，这个协程就会被自动挂起，并执行其他协程，直到结果返回。

它用起来比线程简单，性能比线程好，而代价（编程的困难）则由 Coromega 支付。

> 这就是 Coromega 的秘密，也是它的强大之处。