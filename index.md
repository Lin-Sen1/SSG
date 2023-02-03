# island 可以使用是因为使用 cac 创建了 cli 实例, island dev [root] 命令,其中 dev 属于是 island 的子命令,它接受一个参数

# 执行 island dev docs 时,其实会把 root 定为 docs,这时会在 docs 下启动服务.
