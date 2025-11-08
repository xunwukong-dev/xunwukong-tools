# Release Configuration

本 monorepo 使用 semantic-release 进行自动化版本管理和发布。配置已优化为支持多个包的独立发布。

## 工作原理

1. **自动检测变化的包**：GitHub Actions 会自动检测哪些包发生了变化
2. **独立发布**：每个包根据其提交历史独立决定版本号和发布
3. **自动生成 CHANGELOG**：每个包在 `packages/{package-name}/CHANGELOG.md` 生成独立的 changelog

## 使用方法

### 本地发布单个包

```bash
# 发布 withdraw 包
PACKAGE_NAME=withdraw pnpm release:package

# 发布其他包（例如 future-package）
PACKAGE_NAME=future-package pnpm release:package
```

### GitHub Actions 自动发布

当代码推送到 `main` 或 `beta` 分支时：

1. **自动检测变化的包**：workflow 会检测哪些包的文件发生了变化
2. **并行发布**：为每个变化的包并行运行发布流程
3. **独立版本管理**：每个包根据其提交历史独立决定版本号

## 配置说明

### release.config.js

使用 `PACKAGE_NAME` 环境变量来指定要发布的包：

- `changelogFile`: `packages/{PACKAGE_NAME}/CHANGELOG.md`
- `pkgRoot`: `packages/{PACKAGE_NAME}`
- `prepareCmd`: `pnpm --filter {PACKAGE_NAME} build`

### 添加新包

添加新包时，无需修改配置：

1. 在 `packages/` 目录下创建新包
2. 确保包有 `package.json` 和 `build` 脚本
3. 提交代码时，使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范
4. GitHub Actions 会自动检测并发布

### 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` - 新功能（minor 版本）
- `fix:` - 修复 bug（patch 版本）
- `BREAKING CHANGE:` 或 `!` - 破坏性变更（major 版本）

示例：

```bash
git commit -m "feat(withdraw): add getAllCoins API"
git commit -m "fix(withdraw): fix signature generation"
git commit -m "feat(withdraw)!: change API structure"
```

## 环境变量

- `PACKAGE_NAME`: 要发布的包名（必需）
- `GITHUB_TOKEN`: GitHub token（CI 中自动提供）
- `NPM_TOKEN`: NPM token（需要在 GitHub Secrets 中配置）

## 注意事项

1. **包名必须匹配**：`PACKAGE_NAME` 必须与 `packages/` 目录下的文件夹名一致
2. **需要 build 脚本**：每个包必须有 `build` 脚本
3. **需要 package.json**：每个包必须有有效的 `package.json`
4. **发布权限**：确保 API 密钥有发布到 npm 的权限

