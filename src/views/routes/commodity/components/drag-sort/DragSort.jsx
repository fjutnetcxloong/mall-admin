/**
 * 拖拽排序组件
 */
import React, {PureComponent} from 'react';
import {Row, Col, Card, Button} from 'antd';
import PropTypes from 'prop-types';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import HandleModal from '../../../../common/handle-modal/HandleModal';
import './DragSort.less';

export default class DragSort extends PureComponent {
    static propTypes = {
        visible: PropTypes.bool.isRequired, //是否显示组件
        list: PropTypes.array.isRequired, //传入的图片列表数组
        onConfim: PropTypes.func.isRequired, //点击确定回调
        onCancel: PropTypes.func.isRequired //关闭或取消回调
    }

    state = {
        fileList: this.props.list
    };

    //子组件放下时触发的回调
    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState(({fileList}) => ({
            //arrayMove(array, from, to)，将元素移动到新位置并返回一个新数组
            fileList: arrayMove(fileList, oldIndex, newIndex)
        }), () => {
            console.log('拿得起放得下', this.state.fileList, oldIndex, newIndex);
        });
    };

    render() {
        const {visible, onConfim, onCancel} = this.props;
        const {fileList} = this.state;
        //允许拖拽的子组件
        const SortItem = SortableElement(({value}) => (
            <Col span={6} style={{zIndex: '99999'}}>
                <Card
                    className="drag-img"
                    hoverable
                    cover={<img alt="" src={value.url || value.thumbUrl}/>}
                />
            </Col>
        ));
        //接受拖放的容器组件
        const SortContainer = SortableContainer(({items}) => (
            <Row gutter={16}>
                {items.map((value, index) => (
                    <SortItem
                        className="fdsfsdfd"
                        key={value.uid}
                        index={index}
                        value={value}
                    />
                ))}
            </Row>
        ));
        return (
            <HandleModal
                visible={visible}
                closable={false}
                content={(
                    <SortContainer
                        items={fileList}
                        onSortEnd={this.onSortEnd}
                        axis="xy" //轴 x:水平 y:垂直 xy：宫格
                    />
                )}
                width={1000}
                footer={(
                    <div>
                        <Button onClick={onCancel}>取消</Button>
                        <Button
                            type="primary"
                            onClick={() => onConfim(fileList)}
                        >确定
                        </Button>
                    </div>
                )}
            />
        );
    }
}
