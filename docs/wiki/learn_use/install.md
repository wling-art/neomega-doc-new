# 🔨 下载，安装！

> 不是，咱们用之前是不是得先安装呢？对吧？对吧？

## 安卓、linux、macos

如果你是 安卓、linux、macos 用户

那么在你的黑框框 (终端) 里复制黏贴下面一整段：

```bash
curl -o install.sh https://omega-1259160345.cos.ap-nanjing.myqcloud.com/fastbuilder_launcher/install.sh && bash install.sh && rm install.sh
```

再输入 `./fastbuilder` 即可

## Windows

windows 下载这个：
| [windows-amd64.exe](https://omega-1259160345.cos.ap-nanjing.myqcloud.com/fastbuilder_launcher/windows-amd64.exe) |
| -- |

然后双击运行即可

## Dockerfile

如果你是 Docker 用户，可以使用下面的 Dockerfile，自己构建镜像啦！

```dockerfile
FROM ubuntu:20.04
RUN export DEBIAN_FRONTEND=noninteractive && export DEBIAN_FRONTEND=teletype \
    && sed -i 's/archive.ubuntu.com/mirrors.bfsu.edu.cn/g' /etc/apt/sources.list \
    && apt-get update -yq && apt-get install -yq --no-install-recommends \
    ca-certificates \
    && apt clean -yq && apt autoclean -yq && apt autoremove -yq && rm -rf /var/lib/apt/lists/*

ADD https://omega-1259160345.cos.ap-nanjing.myqcloud.com/fastbuilder_launcher/linux-amd64 /usr/bin/fastbuilder
RUN mkdir -p /workspace/cache/default_config/fastbuilder && mkdir -p root/.config && ln -s /workspace/cache/default_config/fastbuilder /root/.config/fastbuilder \
    && echo -n 'zh_CN' > /root/.config/fastbuilder/language \
    && chmod +x /usr/bin/fastbuilder
RUN fastbuilder -b
ADD https://omega-1259160345.cos.ap-nanjing.myqcloud.com/fastbuilder_launcher/certs.tar.gz /etc/ssl/certs.tar.gz
RUN mkdir -p /workspace

RUN echo "#!/bin/sh" >> /usr/bin/start \
    && echo "sleep 1" >> /usr/bin/start \
    && echo "fastbuilder" >> /usr/bin/start \
    && chmod +x /usr/bin/start
WORKDIR /workspace
ENTRYPOINT [ "/usr/bin/start" ]
```
