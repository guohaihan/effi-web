<template>
  <codemirror
    ref="myCm"
    :value="editorValue"
    :options="cmOptions"
    @changes="onCmCodeChanges"
    @blur="onCmBlur"
    @keydown.native="onKeyDown"
    @mousedown.native="onMouseDown"
    @paste.native="OnPaste"
  />
</template>

<script>
import { codemirror } from 'vue-codemirror'

import 'codemirror/theme/blackboard.css'

import 'codemirror/mode/javascript/javascript.js'

import 'codemirror/mode/xml/xml.js'

import 'codemirror/mode/htmlmixed/htmlmixed.js'

import 'codemirror/mode/css/css.js'

import 'codemirror/mode/yaml/yaml.js'

import 'codemirror/mode/sql/sql.js'

import 'codemirror/mode/python/python.js'

import 'codemirror/mode/markdown/markdown.js'

import 'codemirror/addon/hint/show-hint.css'

import 'codemirror/addon/hint/show-hint.js'

import 'codemirror/addon/hint/javascript-hint.js'

import 'codemirror/addon/hint/xml-hint.js'

import 'codemirror/addon/hint/css-hint.js'

import 'codemirror/addon/hint/html-hint.js'

import 'codemirror/addon/hint/sql-hint.js'

import 'codemirror/addon/hint/anyword-hint.js'

import 'codemirror/addon/lint/lint.css'

import 'codemirror/addon/lint/lint.js'

import 'codemirror/addon/lint/json-lint'

require('script-loader!jsonlint')

// import "codemirror/addon/lint/html-lint.js";

// import "codemirror/addon/lint/css-lint.js";

import 'codemirror/addon/lint/javascript-lint.js'

import 'codemirror/addon/fold/foldcode.js'

import 'codemirror/addon/fold/foldgutter.js'

import 'codemirror/addon/fold/foldgutter.css'

import 'codemirror/addon/fold/brace-fold.js'

import 'codemirror/addon/fold/xml-fold.js'

import 'codemirror/addon/fold/comment-fold.js'

import 'codemirror/addon/fold/markdown-fold.js'

import 'codemirror/addon/fold/indent-fold.js'

import 'codemirror/addon/edit/closebrackets.js'

import 'codemirror/addon/edit/closetag.js'

import 'codemirror/addon/edit/matchtags.js'

import 'codemirror/addon/edit/matchbrackets.js'

import 'codemirror/addon/selection/active-line.js'

import 'codemirror/addon/search/jump-to-line.js'

import 'codemirror/addon/dialog/dialog.js'

import 'codemirror/addon/dialog/dialog.css'

import 'codemirror/addon/search/searchcursor.js'

import 'codemirror/addon/search/search.js'

import 'codemirror/addon/display/autorefresh.js'

import 'codemirror/addon/selection/mark-selection.js'

import 'codemirror/addon/search/match-highlighter.js'

export default {
  components: {
    codemirror
  },

  props: ['cmTheme', 'cmMode', 'autoFormatJson', 'jsonIndentation'],

  data() {
    return {
      mode: 'sql',
      editorValue: '',

      cmOptions: {
        theme:
          !this.cmTheme || this.cmTheme === 'default'
            ? 'blackboard'
            : this.cmTheme,
        mode: 'sql',
        lineWrapping: true,
        lineNumbers: true,
        autofocus: true,
        smartIndent: false,
        autocorrect: true,
        spellcheck: true,
        extraKeys: {
          Tab: 'autocomplete',
          'Ctrl-Alt-L': () => {
            try {
              if (
                this.cmOptions.mode === 'application/json' &&
                this.editorValue
              ) {
                this.editorValue = this.formatStrInJson(this.editorValue)
              }
            } catch (e) {
              this.$message.error('????????????????????????' + e.toString())
            }
          }
        },
        lint: true,
        gutters: [
          'CodeMirror-lint-markers',
          'CodeMirror-linenumbers',
          'CodeMirror-foldgutter'
        ],
        foldGutter: true,
        autoCloseBrackets: true,
        autoCloseTags: true,
        matchTags: { bothTags: true },
        matchBrackets: true,
        styleActiveLine: true,
        autoRefresh: true,
        highlightSelectionMatches: {
          minChars: 2,
          style: 'matchhighlight',
          showToken: true
        },
        styleSelectedText: true,
        enableAutoFormatJson:
          this.autoFormatJson === null ? true : this.autoFormatJson,
        defaultJsonIndentation:
          !this.jsonIndentation || typeof this.jsonIndentation !== typeof 1
            ? 2
            : this.jsonIndentation
      },
      enableAutoFormatJson:
        this.autoFormatJson === null ? true : this.autoFormatJson,

      defaultJsonIndentation:
        !this.jsonIndentation || typeof this.jsonIndentation !== typeof 1
          ? 2
          : this.jsonIndentation
    }
  },

  watch: {
    cmTheme: function(newValue, oldValue) {
      try {
        const theme = this.cmTheme === 'default' ? 'blackboard' : this.cmTheme

        require('codemirror/theme/' + theme + '.css')

        this.cmOptions.theme = theme

        this.resetLint()
      } catch (e) {
        this.$message.error('??????????????????????????????' + e.toString())
      }
    },

    cmMode: function(newValue, oldValue) {
      this.$set(this.cmOptions, 'mode', this.cmMode)

      this.resetLint()

      this.resetFoldGutter()
    }
  },

  created() {
    try {
      if (!this.editorValue) {
        this.cmOptions.lint = false

        return
      }

      if (this.cmOptions.mode === 'application/json') {
        if (!this.enableAutoFormatJson) {
          return
        }

        this.editorValue = this.formatStrInJson(this.editorValue)
      }
    } catch (e) {
      console.log('?????????codemirror?????????' + e)

      // this.$message.error("?????????codemirror?????????" + e);
    }
  },

  methods: {
    resetLint() {
      if (!this.$refs.myCm.codemirror.getValue()) {
        this.$nextTick(() => {
          this.$refs.myCm.codemirror.setOption('lint', false)
        })

        return
      }

      this.$refs.myCm.codemirror.setOption('lint', false)

      this.$nextTick(() => {
        this.$refs.myCm.codemirror.setOption('lint', true)
      })
    },

    resetFoldGutter() {
      this.$refs.myCm.codemirror.setOption('foldGutter', false)

      this.$nextTick(() => {
        this.$refs.myCm.codemirror.setOption('foldGutter', true)
      })
    },

    // ?????????????????????

    setStyle(style) {
      try {
        this.$nextTick(() => {
          const cm = this.$refs.myCm.$el.querySelector('.CodeMirror')

          if (cm) {
            cm.style.cssText = style
          } else {
            this.$message.error('??????????????????????????????????????????????????????')
          }
        })
      } catch (e) {
        this.$message.error('??????????????????????????????' + e.toString())
      }
    },

    // ?????????

    getValue() {
      try {
        return this.$refs.myCm.codemirror.getValue()
      } catch (e) {
        const errorInfo = e.toString()

        this.$message.error('??????????????????????????????' + errorInfo)

        return errorInfo
      }
    },

    // ?????????

    setValue(value) {
      try {
        if (typeof value !== typeof '') {
          this.$message.error('???????????????????????????????????????????????????????????????')

          return
        }

        if (this.cmOptions.mode === 'application/json') {
          this.editorValue = this.formatStrInJson(value)
        } else {
          this.editorValue = value
        }
      } catch (e) {
        this.$message.error('??????????????????????????????' + e.toString())
      }
    },

    // ????????????????????????

    OnPaste(event) {
      if (this.cmOptions.mode === 'application/json') {
        try {
          this.editorValue = this.formatStrInJson(this.editorValue)
        } catch (e) {
          // ????????????
        }
      }
    },

    // ???????????????????????????

    onCmBlur(cm, event) {
      try {
        const editorValue = cm.getValue()

        if (this.cmOptions.mode === 'application/json' && editorValue) {
          if (!this.enableAutoFormatJson) {
            return
          }

          this.editorValue = this.formatStrInJson(editorValue)
        }
      } catch (e) {
        // ????????????
      }
    },

    // ??????????????????????????????

    onKeyDown(event) {
      const keyCode = event.keyCode || event.which || event.charCode

      const keyCombination = event.ctrlKey || event.altKey || event.metaKey

      if (!keyCombination && keyCode > 64 && keyCode < 123) {
        this.$refs.myCm.codemirror.showHint({ completeSingle: false })
      }
    },

    // ?????????????????????????????????

    onMouseDown(event) {
      this.$refs.myCm.codemirror.closeHint()
    },

    onCmCodeChanges(cm, changes) {
      this.editorValue = cm.getValue()

      this.resetLint()
    },

    // ?????????????????????json???????????????

    formatStrInJson(strValue) {
      return JSON.stringify(
        JSON.parse(strValue),

        null,

        this.defaultJsonIndentation
      )
    }
  }
}
</script>

<style>
.CodeMirror-selected {
  background-color: blue !important;
}

.CodeMirror-selectedtext {
  color: white !important;
}

.cm-matchhighlight {
  background-color: #ae00ae;
}
</style>
