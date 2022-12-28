import React, { Component, ReactNode } from "react";
import { Input, Button, message } from 'antd';
import axios from '../../src/utils/reqeust'
import { marked } from 'marked';
import hljs from "highlight.js";
import './index.css'
import 'highlight.js/styles/monokai-sublime.css';

marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function (code) {
        return hljs.highlightAuto(code).value;
    },
    gfm: true, // 允许 Git Hub标准的markdown.
    pedantic: false, // 不纠正原始模型任何的不良行为和错误（默认为false）
    sanitize: false, // 对输出进行过滤（清理），将忽略任何已经输入的html代码（标签）
    breaks: false, // 允许回车换行（该选项要求 gfm 为true）
    smartLists: true, // 使用比原生markdown更时髦的列表
    smartypants: false, // 使用更为时髦的标点
})


class OpenApi extends Component {
    state = {
        module: {
            model: "text-davinci-003",
            prompt: "",
            temperature: 0,
            max_tokens: 2048
        },
        loading: false,
        language: 'markdown',
        value: ''
    }
    get() {
        this.setState({
            loading: true
        })
        axios.post('http://docs-api.tokengo.top:80/api/open-api', this.state.module)
            .then((res: any) => {
                document.getElementById('contnet').innerHTML = marked(res.content)
                this.setState({
                    loading: false
                })
            }).catch((error) => {
                message.error("出现了异常！")
                this.setState({
                    loading: false
                })
            })
    }

    handleChange(value) {
        this.setState({
            language: value
        })
        console.log(value);
    }

    render(): ReactNode {
        var { module, loading } = this.state;
        return (
            <div>
                <Input style={{ width: "70%" }} value={module.prompt} onChange={(t) => {
                    module.prompt = t.target.value;
                    this.setState({ module })
                }}></Input>
                <Button onClick={() => this.get()} loading={loading}>查询</Button>
                <div id="contnet" className="content show-html">
                </div>
            </div>)
    }
}

export default OpenApi