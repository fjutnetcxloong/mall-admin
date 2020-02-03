//修改标题  xwb

import {Input} from 'antd';
import './title.less';

class Title extends BaseComponent {
    state = {
        smollTitle: '',
        bigTitle: '',
        secendTitle: ''
    };

    //设置名字
    setParentTitle = (el, value) => {
        this.props.setExplosiveInfo(el, value);
    }

    render() {
        const {defaultModelInfo, top, titleName1, titleName2, titleName3, show} = this.props;
        const content = defaultModelInfo.get('content');
        return (
            <div className="new-model-bar" style={{top: top + 'px'}}>
                <div onClick={() => this.props.mainShow(false)} className="hide-choise">X</div>
                <div className="headline">编辑标题</div>
                <div className="import-headline-box">
                    <div className="import-headline">
                        <div>大标题:</div>
                        <Input maxLength={10} value={content && content.get(titleName1)} onChange={(value) => this.setParentTitle(titleName1, value.target.value)} placeholder="请输入"/>
                    </div>
                    <div className="import-headline">
                        <div>小标题:</div>
                        <Input maxLength={30} value={content && content.get(titleName2)} onChange={(value) => this.setParentTitle(titleName2, value.target.value)} placeholder="请输入"/>
                    </div>
                    {
                        show && (
                            <div className="import-headline">
                                <div>副标题:</div>
                                <Input maxLength={20} value={content && content.get(titleName3)} onChange={(value) => this.setParentTitle(titleName3, value.target.value)} placeholder="请输入"/>
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }
}

export default Title;
