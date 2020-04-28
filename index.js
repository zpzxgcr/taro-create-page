/* eslint-disable */
const babylon = require('@babel/parser')
const traverse = require('@babel/traverse').default
const t = require('@babel/types')
const path = require('path')
const chalk = require('chalk')
const template = require('art-template')
const fs = require('fs-extra')
const classTemplat = require.resolve('./template/class.art')
const hooksTemplat = require.resolve('./template/hooks.art')
const log = console.log

const babylonConfig = {
  sourceType: 'module',
  plugins: [
    'typescript',
    'classProperties',
    'jsx',
    'trailingFunctionCommas',
    'asyncFunctions',
    'exponentiationOperator',
    'asyncGenerators',
    'objectRestSpread',
    'dynamicImport'
  ]

}

/**
 * 首字母大写
 * @param {string} str
 */
function firetUpperCase (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

class AutoCreatePage {
  constructor () {
    this.source = 'src'
    this.pages = []
    this.parseCode = this.parseCode.bind(this)
    this.writeTemplate = this.writeTemplate.bind(this)
    const jsType = ['app.tsx', 'app.js', 'app.ts']
    const cssType = ['app.css', 'app.scss', 'app.less', 'app.styl']
    const rootJsType = jsType.filter(item => fs.pathExistsSync(path.join(this.source, item)))
    const rootCssType = cssType.filter(item => fs.pathExistsSync(path.join(this.source, item)))
    this.rootJsType = rootJsType[0] || 'app.jsx'
    this.rootCssType = rootCssType[0] || 'app.css'
    const _this = this
    fs.watchFile(path.join(this.source, this.rootJsType), (path) => {
      _this.parseCode()
    })
  }

  apply (builder) {
    builder.hooks.beforeBuild.tap('BuildPlugin', (config) => {
      this.source = config.sourceRoot
    })
  }

  parseCode () {
    const _this = this
    const code = fs.readFileSync(path.join(this.source, this.rootJsType), 'utf8')
    let ast = babylon.parse(code, babylonConfig)
    let pages = []
    traverse(ast, {
      ObjectProperty(astPath) {
        const node = astPath.node
        const key = node.key
        const value = node.value

        if (key.name === 'pages' && t.isArrayExpression(value)) {
          // 分包
          let root = ''
          const rootNode = astPath.parent.properties.find(v => {
            return v.key.value === 'root'
          })
          root = rootNode ? rootNode.value.value : ''

          value.elements.forEach(v => {
            if (t.isStringLiteral(v)) {
              const pagePath = `${root}/${v.value}`.replace(/\/{2,}/g, '/').replace(/^\//, '')
              const fielName = pagePath.slice(pagePath.lastIndexOf('/') + 1, pagePath.length)
              const name = firetUpperCase(fielName)
              const cssType = `${fielName}${path.extname(_this.rootCssType)}`
              let title = fielName
              let isHooks = false
              if (v.trailingComments) {
                const { value } = v.trailingComments[0]
                title = value.match(/[\u4e00-\u9fa5]+/g)[0]
                isHooks = /ishooks/i.test(value)
              }
              _this.writeTemplate({
              title, isHooks, cssType, name, fielName, pagePath})
            }
          })
        }
      }
    })
  }

  writeTemplate ({title, isHooks, cssType, name, fielName, pagePath}) {
    const exists = fs.pathExistsSync(path.join(this.source, `${pagePath}${path.extname(this.rootJsType)}`))

    if (!exists) {
      const html = template(isHooks ? hooksTemplat : classTemplat, {
        title,
        name,
        type: cssType
      })
      fs.outputFile(path.join(this.source, `${pagePath}${path.extname(this.rootJsType)}`), html)
      fs.ensureFile(path.join(this.source, `${pagePath}${path.extname(this.rootCssType)}`))
      log(chalk.green(`编译`), ` 发现路径 ${pagePath}`)
    }
  }
}
module.exports = AutoCreatePage
