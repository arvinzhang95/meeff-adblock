# MEEFF AdBlock - Shadowrocket 去广告模块

去除 MEEFF 应用中广告的 Shadowrocket 模块，分为基础版和进阶版。

## 模块做了什么

经对 MEEFF Android 版（6.x）安装包的分析（Exodus Privacy 静态分析报告），MEEFF 内嵌了 19 个第三方 SDK，其中广告相关的主要有：

- AppLovin MAX（主广告聚合平台）
- Google AdMob / DoubleClick
- Meta Audience Network（Facebook 广告）
- ironSource、Pangle（TikTok）、Tapjoy、Unity Ads
- Amazon Ads、Mintegral、Fyber、AD(X)
- 韩国本土广告网络：AdFit（Daum/Kakao）、AdPie（GOM Factory）、TNK Factory

模块对上述 SDK 的请求域名做了 REJECT 拦截。广告请求被拒绝后，App 拿不到广告素材，横幅/插屏/激励视频等第三方广告会被挡住。

## 两个版本怎么选

| 版本 | 特点 | 适用场景 |
|------|------|----------|
| **基础版** | 只做域名拦截，**无需 HTTPS 解密** | 快速使用、不想折腾 |
| **进阶版** | 域名拦截 + API 拦截 + 脚本过滤，**需要 HTTPS 解密** | 追求最佳效果 |

## 文件说明

| 文件 | 用途 |
|------|------|
| `MEEFF_AdBlock.sgmodule` | 基础版模块，域名级广告屏蔽 |
| `MEEFF_AdBlock_Pro.sgmodule` | 进阶版模块，域名拦截 + API 拦截 + 脚本过滤 |
| `MEEFF_Ads_Filter.js` | 可选的广告过滤脚本（进阶版用） |

## 安装方法

### 基础版

1. 打开 Shadowrocket → 配置 → 模块
2. 点击右上角 + 号
3. 粘贴链接：

```
https://raw.githubusercontent.com/arvinzhang95/meeff-adblock/main/MEEFF_AdBlock.sgmodule
```

导入即用，无需其他设置。

### 进阶版

1. 打开 Shadowrocket → 配置 → 模块
2. 点击右上角 + 号
3. 粘贴链接：

```
https://raw.githubusercontent.com/arvinzhang95/meeff-adblock/main/MEEFF_AdBlock_Pro.sgmodule
```

4. 确保「HTTPS 解密」已开启且 CA 证书已安装并信任
5. 打开 VPN 开关，再打开 MEEFF

**进阶版默认已生效的内容：**

- 第一层：拦截 MEEFF 集成的全部第三方广告 SDK 域名
- 第二层：拦截 `api.meeff.com` 下路径以 ad/ads/banner/interstitial/splash 等开头的广告接口

## 第三层（可选）：JSON 广告过滤脚本

如果信息流里仍有少量广告（由 MEEFF 服务器以 JSON 形式下发），可以启用脚本层：

1. 把 `MEEFF_Ads_Filter.js` 传到任意可访问的 HTTPS 地址（推荐 GitHub Gist：https://gist.github.com → New gist → 粘贴脚本 → Create public gist → 用 raw 链接）
2. 编辑 `MEEFF_AdBlock_Pro.sgmodule`，把 `[Script]` 段里 `script-path=https://你的地址/MEEFF_Ads_Filter.js` 替换成你的真实 raw 地址，并去掉该行行首的 `#`
3. 重新加载模块并重开 MEEFF

不想折腾时保持脚本行注释即可，不影响前两层。

## 常见问题

### MEEFF 出现无法登录/无法加载

说明 App 做了证书锁定（HTTPS 解密被识破）。此时请把进阶版换回基础版（只保留域名拦截），或临时关闭「HTTPS 解密」使用。

### 还有广告怎么办

1. 先在 Shadowrocket「配置 → 日志」里确认广告请求的真实域名
2. 把域名告诉我，我可以把它补进模块的规则里
3. 也可以自己在模块 `[Rule]` 段追加一行：`DOMAIN-SUFFIX,域名,REJECT`

## 注意事项

- 模块是全局生效的，会拦截所有 App 对这些广告域名的访问
- 不拦截 Facebook 登录/分享、Firebase 分析等非广告功能
- 若要删除 `AD(X)` 两条规则（`adx.com` 等），可在模块里直接删除，不影响其他拦截

## 搭配使用

除 Shadowrocket 外，以下工具也可配合使用：

- **Loon / Stash**：支持类似模块语法，可直接导入 .sgmodule
- **Surge**：部分兼容，需手动调整语法
- **Quantumult X**：支持重写规则，需手动转换

## 免责声明

本模块仅供学习交流使用，请遵守相关法律法规。使用本模块产生的一切后果由用户自行承担。
