---
id: benchmark
title: "⏲ ベンチマーク"
sidebar_position: 3
image: /img/png/theme/z/320x320.png
description: ベンチマーク、プロファイリング & 統計情報
keywords:
  - statistics
  - benchmark
  - profiling
  - レポート
---

<!-- @format -->

import APITable from '@site/src/components/APITable'; import ReportZprofExample from '@site/src/components/Markdown/\_report_zprof_example.mdx';

:::info

統計およびレポートに使用可能なコマンドを表示するには、 `zi analytics` を実行します。

:::

## <i class="fa-solid fa-gauge-high"></i> プラグインをプロファイルする

```shell title="~/.zshrc" showLineNumbers
zi ice atinit'zmodload zsh/zprof' \
  atload'zprof | head -n 20; zmodload -u zsh/zprof'
zi light z-shell/F-Sy-H
```

```mdx-code-block
<APITable>
```

| 構文          | 説明                                                                                                                       |
| ----------- |:------------------------------------------------------------------------------------------------------------------------ |
| `atinit'…'` | loads the `zsh/zprof` module, shipped with Zsh, before loading the plugin – this starts the profiling.                   |
| `atload'…'` | works after loading the plugin – shows profiling results `zprof / head`, unloads `zsh/zprof` - this stops the profiling. |

```mdx-code-block
</APITable>
```

While in effect, only a single plugin, in this case, `z-shell/F-Sy-H`, will be profiled.

The rest plugins will go on completely normally, as when plugins are loaded with `light` - reporting is disabled.

Less code is being run in the background, the automatic data gathering, during loading of a plugin, for the reports and the possibility to unload the plugin will be activated and the functions will not appear in the `zprof` report.

Example `zprof` report:

<ReportZprofExample/>

The first column is the time in milliseconds:

- It denotes the amount of time spent in a function in total
- For example, `--zi-shadow-autoload` consumed 10.71 ms of the execution time

The fourth column is also a time in milliseconds, but it denotes the amount of time spent on executing only of function's **own code**, it doesn't count the time spent in **descendant functions** that is called from the function:

- For example, `--zi-shadow-autoload` spent 8.71 ms on executing only its code

The table is sorted in the **self-time** column.

## <i class="fas fa-spinner fa-spin"></i> `.zshrc`起動時のプロファイル

### 方法1

> `PROFILE_STARTUP=true` でプロファイリングを有効にします。

以下を `.zshrc` の最上部に配置します。

```shell title="~/.zshrc" showLineNumbers
PROFILE_STARTUP=false

if [[ "$PROFILE_STARTUP" == true ]]; then
  zmodload zsh/zprof
  PS4=$'%D{%M%S%.} %N:%i> '
  exec 3>&2 2>$HOME/startlog.$$
  setopt xtrace prompt_subst
fi
```

:::info PS4 プロンプト拡張

Zsh Sourceforge docs: [プロンプトの展開][prompt-expansion]

:::

`.zshrc`の最下部に配置します。

```shell title="~/.zshrc" showLineNumbers
if [[ "$PROFILE_STARTUP" == true ]]; then
  unsetopt xtrace
  exec 2>&3 3>&-; zprof > ~/zshprofile$(date +'%s')
fi
```

次回 `.zshrc`がロードされるとき、2つのファイルが`$HOME` ディレクトリ以下に生成されます。

### 方法2

Store multiple values to a variable:

```shell title="~/.zshrc" showLineNumbers
# Set variable
typeset -Ag ZLOGS
# Message to store
zmsg() { ZLOGS+=( "\n[$1]: ${(M)$(( SECONDS * 1000 ))#*.?} ms" ); }

# Start profiling
typeset -F4 SECONDS=0

# <RUN SOME FUNCTIONS TO MEASURE>

zmsg "Loaded functions"

# <RUN SOMETHING ELSE>

zmsg "Loaded something else"

# <THE FINAL CODE BLOCK HERE>

zmsg "Done"
```

Then use the `$ZLOGS` variable to retrieve:

```shell title="print $ZLOGS" showLineNumbers
[Loaded functions]: 0.0 ms
[Loaded something else]: 0.0 ms
[Done]: 0.1 ms
```

[prompt-expansion]: https://zsh.sourceforge.net/Doc/Release/Prompt-Expansion.html
