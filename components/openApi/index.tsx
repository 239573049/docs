import React, { Component, ReactNode } from "react";
import { Input, Spin, Button, Select } from 'antd';
import axios from '../../src/utils/reqeust'
import Editor from "@monaco-editor/react";

class OpenApi extends Component {
    state = {
        module: {
            model: "text-davinci-003",
            prompt: "",
            temperature: 0,
            max_tokens: 4096
        },
        loading: false,
        language: 'markdown',
        value: ''
    }
    get() {
        this.setState({
            loading: true
        })
        axios.post('http://localhost:5225/api/open-api', this.state.module)
            .then((res: any) => {
                var { value } = this.state;
                value = res.content;
                this.setState({
                    value,
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
                <Select
                    defaultValue="markdown"
                    style={{ width: 120 }}
                    onChange={(value) => this.handleChange(value)}
                    options={[
                        {
                            value: 'markdown',
                            label: 'markdown',
                        },
                        {
                            value: 'c#',
                            label: 'c#',
                        },
                        {
                            value: 'json',
                            label: 'json',
                        },
                        {
                            value: 'java',
                            label: 'java',
                        },
                        {
                            value: 'javasrcipt',
                            label: 'javasrcipt',
                        },
                        {
                            value: 'shell',
                            label: 'shell',
                        },
                        {
                            value: 'cpp',
                            label: 'cpp',
                        },
                        {
                            value: 'css',
                            label: 'css',
                        },
                        {
                            value: 'delphi',
                            label: 'delphi',
                        },
                        {
                            value: 'php',
                            label: 'php',
                        },
                        {
                            value: 'sql',
                            label: 'sql',
                        },
                        {
                            value: 'html',
                            label: 'html',
                        },
                        {
                            value: 'go',
                            label: 'go',
                        },
                        {
                            value: 'python',
                            label: 'python',
                        },
                        {
                            value: 'text',
                            label: 'text',
                        },
                        {
                            value: 'jfx',
                            label: 'jfx',
                        },
                        {
                            value: 'scss',
                            label: 'scss',
                        },
                        {
                            value: 'lua',
                            label: 'lua',
                        },
                        {
                            value: 'less',
                            label: 'less',
                        },
                        {
                            value: 'css',
                            label: 'css',
                        },
                    ]}
                />
                <Spin spinning={loading}>
                    <Editor
                        height="500px"
                        language={language}
                        value={value}
                    />
                </Spin>
            </div>)
    }
}

export default OpenApi