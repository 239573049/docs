import React, { Component, ReactNode } from "react";
import { Input, Spin, Button } from 'antd';
import axios from '../../src/utils/reqeust'
const { TextArea } = Input;

class OpenApi extends Component {
    state = {
        module: {
            model: "text-davinci-003",
            prompt: "",
            temperature: 0,
            max_tokens: 1000
        },
        loading: false,
        value: ''
    }

    get() {
        this.setState({
            loading: true
        })
        axios.post('http://docs-api.tokengo.top:81/api/open-api', this.state.module)
            .then((res: any) => {
                var { value } = this.state;
                value = res.content;
                this.setState({
                    value,
                    loading: false
                })

            })
    }

    render(): ReactNode {
        var { module, value, loading } = this.state;
        return (
            <div>
                <Input style={{ width: "70%" }} value={module.prompt} onChange={(t) => {
                    module.prompt = t.target.value;
                    this.setState({ module })
                }}></Input>
                <Button onClick={() => this.get()}>查询</Button>
                <Spin spinning={loading}>
                    <TextArea style={{ height: "500px" }} placeholder="Borderless" autoSize={{ minRows: 2, maxRows: 6 }} bordered={false} value={value} />
                </Spin>
            </div>)
    }
}

export default OpenApi