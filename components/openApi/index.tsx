import React, { Component, ReactNode } from "react";
import { Input, Button } from 'antd';
import axios from '../../src/utils/reqeust'
import { marked } from 'marked';
import './index.css'


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
            })
    }

    handleChange(value) {
        this.setState({
            language: value
        })
        console.log(value);
    }

    render(): ReactNode {
        var { module, value, loading, language } = this.state;
        return (
            <div>
                <Input style={{ width: "70%" }} value={module.prompt} onChange={(t) => {
                    module.prompt = t.target.value;
                    this.setState({ module })
                }}></Input>
                <Button onClick={() => this.get()} loading={loading}>查询</Button>
                <div id="contnet" className="content">
                    <p>
                        测试
                    </p>
                </div>
            </div>)
    }
}

export default OpenApi