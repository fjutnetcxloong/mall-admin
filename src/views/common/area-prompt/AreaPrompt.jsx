/**
 * 地区选择弹框
 */
import PropTypes from 'prop-types';
import './AreaPrompt.less';
import {Button, Checkbox, message} from 'antd';
import React from 'react';

const CheckboxGroup = Checkbox.Group;

// const checkboxFlag = [];
class AreaPrompt extends React.PureComponent {
    state = {
        area: '', //地区
        whole: '',
        checkAll: [],
        checkedList: [],
        checkboxFlag: [],
        selectedArea: 0,  //显示地区选择的个数
        alreadySelect: 0   //失效记录的个数
    };

    static propTypes = {
        switching: PropTypes.func,
        chose: PropTypes.func,
        allProvince: PropTypes.array,
        cancelDisable: PropTypes.bool,
        editTempArr: PropTypes.array,
        updateIndex: PropTypes.string
    };

    //组件API默认值
    static defaultProps = {
        switching() {},
        chose() {},
        allProvince: [],
        cancelDisable: false,
        editTempArr: [],
        updateIndex: ''
    };

    componentWillMount() {
        this.initArea();
    }

    //初始化地区状态
    initArea = () => {
        const {allProvince} = this.props;
        this.setState({
            selectProvince: allProvince
        });
        //去除所有不可选状态
        this.cancelDisable();
        //重新设置不可选转态
        this.resetStatus();
    };

    //重新设置不可选转态
    resetStatus = () => {
        const {allProvince, editTempArr, cancelDisable, updateIndex} = this.props;
        const {checkboxFlag, checkAll} = this.state;
        const arrChecked = [];
        let resArr = [];
        let alreadyNum = 0;
        let select = 0;
        if (editTempArr.length !== 0) {
            const  array = [...editTempArr];
            if (cancelDisable) {
                const res = array.splice(parseInt(updateIndex, 10), 1);
                resArr = res[0].area.split(',');
                select += resArr.length;
            }
            let arr = [];
            array.forEach(item => {
                arr = arr.concat(item.area.split(','));
            });
            const ary = [];
            allProvince.forEach(item => {
                const data =  JSON.parse(JSON.stringify(item));
                ary.push(data);
            });
            ary.forEach((item, index) => {
                let num = 0;
                checkAll[index] = false;
                arrChecked[index] = [];
                item.data.forEach(item2 => {
                    if (resArr.length !== 0) {
                        for (let i = 0; i < resArr.length; i++) {
                            if (item2.value === resArr[i]) {
                                arrChecked[index].push(resArr[i]);
                            }
                        }
                    }
                    for (let i = 0; i < arr.length; i++) {
                        if (item2.value === arr[i]) {
                            num++;
                            alreadyNum++;
                            item2.disabled = true;
                            if (num === item.data.length) {
                                checkboxFlag[index] = true;
                            }
                        }
                    }
                });
                if (arrChecked[index].length === item.data.length || num + arrChecked[index].length === item.data.length) {
                    checkAll[index] = true;
                }
            });
            const result =  checkboxFlag.every(item => item !== false);
            const result2 =  checkAll.every(item => item === true);
            if (result) {
                this.setState({
                    wholeFlag: true
                });
            }
            this.setState({
                selectProvince: ary,
                checkboxFlag,
                checkAll,
                whole: result2,
                alreadySelect: alreadyNum,
                selectedArea: select + alreadyNum,
                checkedList: arrChecked
            });
        }
    };

    //关闭
    close = () => {
        this.props.switching();
    };

    //保存地区
    saveArea = () => {
        const {area} = this.state;
        const {chose} = this.props;
        if (!area) {
            message.info('请先选择地区');
        } else {
            chose(area);
            this.close();
        }
    };

    //去除所有不可选状态
     cancelDisable = () => {
         const {allProvince} = this.props;
         const {checkboxFlag} = this.state;
         const ary = [];
         allProvince.forEach(item => {
             const data =  JSON.parse(JSON.stringify(item));
             ary.push(data);
         });
         ary.forEach(item => {
             item.data.forEach(item2 => {
                 if (item2.disabled) {
                     delete item2.disabled;
                 }
             });
         });
         for (let i = 0; i < allProvince.length; i++) {
             checkboxFlag[i] = false;
         }
         this.setState({
             selectProvince: ary,
             wholeFlag: false,
             checkboxFlag
         });
     };

    //全部选择
    entire = e => {
        const {checkAll, selectProvince, checkboxFlag, alreadySelect} = this.state;
        const arr = [];
        let select = 0;
        for (let i = 0; i < selectProvince.length; i++) {
            if (!checkboxFlag[i]) {
                checkAll[i] = e.target.checked;
            }
        }
        selectProvince.forEach(item => {
            const arr2 = [];
            item.data.forEach(item2 => {
                if (!item2.disabled) {
                    arr2.push(item2.value);
                    if (e.target.checked) {
                        select++;
                    } else {
                        select = 0;
                    }
                }
            });
            arr.push(arr2);
        });
        let areaChoice = '';
        arr.forEach(item => {
            if (item.length !== 0) {
                areaChoice += item.join(',') + ',';
            }
        });
        const result =  areaChoice.substr(0, areaChoice.length - 1);
        this.setState({
            checkedList: e.target.checked ? arr : [],
            checkAll,
            whole: e.target.checked,
            area: result,
            selectedArea: alreadySelect + select
        });
    };

    //区域选择
    region = (e, item, index) => {
        // const num = item.data.length;
        const {checkAll, checkedList, alreadySelect} = this.state;
        const arr = [];
        let select = 0;
        checkAll[index] = e.target.checked;
        item.data.forEach((i) => {
            if (!i.disabled) {
                arr.push(i.value);
            }
        });
        let areaChoice = '';
        const ary = checkedList.concat([]);
        ary[index] =  e.target.checked ? arr : [];
        ary.forEach(item2 => {
            if (item2.length !== 0) {
                areaChoice += item2.join(',') + ',';
                select += item2.length;
            }
        });
        const result =  areaChoice.substr(0, areaChoice.length - 1);
        this.setState({
            checkedList: ary,
            checkAll,
            area: result,
            selectedArea: alreadySelect + select
        }, () => {
            const re = checkAll.some(selected => selected === false);
            if (checkAll.length === this.props.allProvince.length && !re) {
                this.setState({
                    whole: true
                });
            } else {
                this.setState({
                    whole: false
                });
            }
        });
    };

    //单个地区选择
    singleChange = (index, checked) => {
        const {checkAll, alreadySelect, selectProvince} = this.state;
        let select = 0;
        const num = [];
        selectProvince.forEach((item, index2) => {
            num[index2] = 0;
            item.data.forEach(item2 => {
                if (item2.disabled) {
                    num[index2]++;
                }
            });
        });
        checkAll[index] = selectProvince[index].data.length === checked.length || selectProvince[index].data.length  === num[index] +  checked.length;
        this.setState(preState => {
            const ary = preState.checkedList.concat([]);
            ary[index] = checked;
            let areaChoice = '';
            ary.forEach(item => {
                if (item && item.length !== 0) {
                    areaChoice += item.join(',') + ',';
                    select += item.length;
                }
            });
            const result =  areaChoice.substr(0, areaChoice.length - 1);
            return ({
                checkedList: ary,
                checkAll,
                area: result,
                selectedArea: alreadySelect + select
            });
        }, () => {
            const re = checkAll.some(selected => selected === false);
            if (checkAll.length === this.props.allProvince.length && !re) {
                this.setState({
                    whole: true
                });
            } else {
                this.setState({
                    whole: false
                });
            }
        });
    };

    render() {
        const {selectProvince, wholeFlag, checkboxFlag, selectedArea} = this.state;
        return (
            <div className="area-selection">
                <div className="shade"/>
                <div className="content">
                    <div className="upper">
                        <div>选择区域</div>
                        <span className="icon" onClick={this.close}/>
                    </div>
                    <div className="choice-box">
                        <div className="entire">
                            <Checkbox onChange={this.entire} checked={this.state.whole} disabled={wholeFlag}>全选</Checkbox>
                            <span className="entire-selected">已选择{selectedArea}个区域</span>
                        </div>
                        {
                            selectProvince.map((item, index) => (
                                <div className="district">
                                    <div className="district-left">
                                        <Checkbox
                                            onChange={(e) => this.region(e, item, index)}
                                            checked={this.state.checkAll[index]}
                                            disabled={checkboxFlag[index]}
                                        >
                                            {item.name}
                                        </Checkbox>
                                    </div>
                                    <div className="district-right">
                                        <CheckboxGroup
                                            options={item.data}
                                            value={this.state.checkedList[index]}
                                            onChange={(checked) => this.singleChange(index, checked, item.data)}
                                        />
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="selector-button">
                        <Button onClick={this.close}>取消</Button>
                        <Button onClick={this.saveArea}>保存</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default AreaPrompt;
