# DSHAstraEffort

一个为 **DeepSeek Harness（DSH）** 开发的持久插件。把输入框原本朴素的模型/思考强度选择器，换成 **Astra 风格白色卡片**：大号强度名称、拖拽滑条、粒子动画，并附带**强度合法性兜底**（防止用户在某个模型上选择了它不支持的思考强度而报错）。

## 功能

- **Astra 风格卡片**
  - 深色/浅色主题自动跟随，卡片始终不透明
  - 顶部强度名称实时跟随滑条变化（拖动中实时更新颜色与名称）
  - 滑条：蓝 → 紫渐变填充、白色圆球、档位圆点
  - 粒子系统（星星/闪点/彗星/流光）速度随强度联动（高强度更快、更躁动）
  - 不支持思考强度的模型显示提示文案
- **交互动画**（全部可打断、从当前帧接手）
  - 打开：从按钮处弹开（带回弹）
  - 关闭：缩回到按钮处
  - 切面板（主界面 ↔ 模型列表）：高度平滑展开/收缩（底边锚定向上撑开）
  - 拖动圆球：连续无极跟手；松手吸附最近档位；点击档位点圆球平滑滑过去
- **强度护栏**（重要 bugfix）
  - 切换模型时若新模型不支持当前强度，自动改走该模型的默认强度
  - 打开面板时若会话里残留着非法强度，自动纠正为合法值
  - 重启后异常不再卡死；成功时清除旧错误条
- **子代理会话兼容**
  - 兼容 `session "xxx" is owned by subagent routing`：降级用 live Agent 直接设置

## 安装

### 1. 复制插件到 profile

```bash
# DSH 默认 web profile 的插件目录（示例）
PLUGINS="$HOME/.dsh/profiles/web/plugins/dsh-astra-effort"
mkdir -p "$PLUGINS"
cp index.js client.js package.json "$PLUGINS/"
```

> 如果你用的是其他 profile，把 `$HOME/.dsh/profiles/web` 换成你实际使用的目录。

### 2. 注册到 `cordis.patch.yml`

在 `$HOME/.dsh/profiles/web/cordis.patch.yml` 的 patches 列表追加一项：

```yaml
- insert:
    - id: dsh-astra-effort
      name: ./plugins/dsh-astra-effort/index.js
```

**注意**：YAML 写完后必须校验一次语法（注意缩进），否则 DSH 启动会失败：

```bash
python3 -c "import yaml; yaml.safe_load(open('$HOME/.dsh/profiles/web/cordis.patch.yml'))"
```

### 3. 重启 DSH

重启 DSH web（命令随你的启动方式而定；正在运行的话先停掉再启动）。

启动后浏览器 **硬刷新**（`Ctrl+Shift+R`，或 `Ctrl+F5`）——因为客户端 bundle 用 `immutable` 缓存，普通刷新可能仍拿到旧代码。

### 4. 验证

- 输入框模型名称处出现新的下拉触发器
- 点开后看到白色卡片：强度名称 / 模型名 / 滑条 / 档位圆点
- 拖动滑条：颜色蓝→紫渐变、粒子加速、档位名实时跟随
- 点「模型名 ›」进入模型列表；点一个新模型，强度自动适配

## 目录结构

```
index.js      # host 半边：暴露 /dsh-astra-effort/catalog 与 /dsh-astra-effort/select
client.js     # client 半边：注册 conversation.input.model 座位 + 完整的 Astra UI
package.json  # 插件元数据（dsh.client 声明平台/注入）
```

## 技术说明

- 持久插件形式（profile 级），重启/刷新都不丢
- 替换 DSH 自带的 `client-ui-model-selection` 占位器
- 不依赖任何第三方库；CSS 内联在 `client.js` 中通过 `insertCssOnce()` 一次注入
- 完整保留了强度兼容性：切换到不支持 `max` 的模型时自动回退默认档

## 许可

MIT
