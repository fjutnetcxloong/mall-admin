import {Cascader} from 'antd';
import './GetArea.less';
import React from 'react';
import PropTypes from 'prop-types';

const {api} = Configs;
class GetArea extends BaseComponent {
  state = {
      options: [],
      province: '',
      areaValue: '',
      AreaId: '' //地区地址
  };

    static propTypes = {
        getAreaArr: PropTypes.func,
        editArea: PropTypes.array,
        getAreaName: PropTypes.func
    };

    //组件API默认值
    static defaultProps = {
        getAreaArr() {},
        getAreaName() {},
        editArea: [],
        getCity: () => {}
    };

    componentDidMount() {
        this.getArea();
    }

    //获取编辑的城
    getEditCity = (options) => {
        const {editArea} = this.props;
        if (editArea[0]) {
            const arr = [];
            const  code = editArea[0];
            const obj = options.find(item => item.value === editArea[0]);
            arr.push(obj);
            this.getCity(code, arr);
        }
    };

    //获取编辑的县
    getEditCounty = (options) => {
        const {editArea} = this.props;
        if (editArea[1]) {
            const arr = [];
            const code = editArea[1];
            const obj1 = options.find(item => item.value === editArea[0]);
            const obj2 = obj1.children.find(item2 => item2.value === editArea[1]);
            arr.push(obj1);
            arr.push(obj2);
            this.getCounty(code, arr);
        }
    };

    //获取省
    getArea = () => {
        this.fetch(api.getPcat, {method: 'post',
            data: {
                code: 0
            }}).subscribe(res => {
            const arr = [];
            res.data.forEach(item => {
                arr.push({value: item.code,
                    label: item.name,
                    children: [
                        {
                            value: '',
                            label: '',
                            children: [
                                {
                                    value: '',
                                    label: ''
                                }
                            ]
                        }
                    ]
                });
            });
            this.setState({
                options: arr
            }, () => this.getEditCity(this.state.options));
        });
    };

    //获取城市
    getCity = (code, selected) => {
        const {options} = this.state;
        this.fetch(api.getPcat, {method: 'post',
            data: {
                code
            }}).subscribe(res => {
            const arr = [];
            res.data.forEach(item => {
                const obj = {};
                obj.value = item.code;
                obj.label = item.name;
                obj.children = [{
                    value: '',
                    label: ''
                }];
                arr.push(obj);
            });
            selected[0].children = arr;
            options.forEach((item, index) => {
                if (item.value === code) {
                    this.setState(preState => {
                        const ary = preState.options.concat([]);
                        ary.splice(index, 1, selected[0]);
                        return {
                            options: ary
                        };
                    }, () => this.getEditCounty(this.state.options));
                }
            });
        });
    };

    //获取县
    getCounty = (code, selected) => {
        const {options} = this.state;
        this.fetch(api.getPcat, {method: 'post',
            data: {
                code
            }}).subscribe(res => {
            const arr = [];
            res.data.forEach(item => {
                const obj = {};
                obj.value = item.code;
                obj.label = item.name;
                arr.push(obj);
            });
            selected[1].children = arr;
            options.forEach((item, index) => {
                item.children.forEach(item2 => {
                    if (item2.value === code) {
                        this.setState(preState => {
                            const ary = preState.options.concat([]);
                            ary.splice(index, 1, selected[0]);
                            return {
                                options: ary
                            };
                        });
                    }
                });
            });
        });
    };

    //改变地区
    onChange = (value, selectedOptions) => {
        const {getAreaArr} = this.props;
        if (value.length === 1 && value[0] !== '') {
            this.getCity(value[0], selectedOptions);
            const arr = [selectedOptions[0].label];
            this.props.getAreaName(arr);
        }
        if (value.length === 2 && value[1] !== '') {
            this.getCounty(value[1], selectedOptions);
            const arr = [selectedOptions[0].label, selectedOptions[1].label];
            this.props.getAreaName(arr);
        }
        if (value.length === 3 && value[2] !== '') {
            const arr = [selectedOptions[0].label, selectedOptions[1].label, selectedOptions[2].label];
            this.props.getAreaName(arr);
        }
        this.setState({
            AreaId: value
        });
        getAreaArr(value);
    };

    render() {
        const {options, AreaId} = this.state;
        return (
            <div className="get-area">
                <Cascader
                    allowClear={false}
                    value={AreaId || this.props.editArea}
                    options={options}
                    changeOnSelect
                    onChange={(value, selectedOptions) => this.onChange(value, selectedOptions)}
                    placeholder="请选择"
                />
            </div>
        );
    }
}
export default GetArea;
