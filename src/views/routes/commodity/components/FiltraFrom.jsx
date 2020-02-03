/**
 * 筛选表单组件
 */
import PropTypes from 'prop-types';
import {Form, Skeleton, Input, Select, Button, Cascader, Row, Col} from 'antd';

const FormItem = Form.Item;
const {Option} = Select;
export default class FiltraFrom extends React.PureComponent {
     static propTypes = {
         form: PropTypes.object.isRequired,
         isFormLoad: PropTypes.bool.isRequired, //筛选表单是否显示骨架
         isTableSpin: PropTypes.bool.isRequired, //是否不可筛选
         sortOption: PropTypes.array.isRequired, //分类选项
         groupOption: PropTypes.array.isRequired, //分组选项
         onFiltrate: PropTypes.func.isRequired, //点击筛选回调
         onClear: PropTypes.func.isRequired //清空筛选条件回调
     }

     onFiltra=(e) => {
         e.preventDefault();
         const {form: {getFieldsValue}, onFiltrate} = this.props;
         const values = getFieldsValue(); //获取全部控件的值
         console.log('获取全部控件的值', values);
         onFiltrate(values);
     }

     onClear=() => {
         const {onClear} = this.props;
         onClear();
     }

     render() {
         const {form: {getFieldDecorator}, isFormLoad, isTableSpin, sortOption, groupOption} = this.props;
         //商品状态
         const goodsStatus = [
             {name: '全部', id: ''},
             {name: '已下架', id: 0},
             {name: '已上架', id: 1},
             {name: '已封锁', id: 2},
             {name: '库存不足', id: 3},
             {name: '审核中', id: 4}
         ];
         //配送方式
         const deliveryTypes = [
             {name: '全部', id: ''},
             {name: '快递发货', id: 1},
             {name: '到店自提', id: 2},
             {name: '到店消费', id: 3}
         ];
         return (
             <Skeleton active loading={isFormLoad}>
                 <div className="method">
                     <Row >
                         <Col span={8}>
                             <FormItem className="commodity-name" label="商品名称">
                                 {getFieldDecorator('title')(
                                     <Input
                                         placeholder="请输入关键字"
                                         allowClear
                                         maxLength={30}
                                     />
                                 )}
                             </FormItem>
                         </Col>
                         <Col span={8}>
                             <FormItem className="commodity-select" label="配送方式">
                                 {getFieldDecorator('type', {
                                     initialValue: deliveryTypes[0].id
                                 })(
                                     <Select>
                                         {
                                             deliveryTypes.map(item => (
                                                 <Option key={item.id.toString} value={item.id}>{item.name}</Option>
                                             ))
                                         }
                                     </Select>
                                 )}
                             </FormItem>
                         </Col>
                         <Col span={8}>
                             <FormItem className="commodity-select" label="商品分类">
                                 {getFieldDecorator('cate')(
                                     <Cascader
                                         placeholder="请选择商品分类"
                                         options={sortOption}
                                         changeOnSelect
                                     />
                                 )}
                             </FormItem>
                         </Col>
                         <Col span={8}>
                             <FormItem className="commodity-select" label="商品状态">
                                 {getFieldDecorator('status', {
                                     initialValue: goodsStatus[0].id
                                 })(
                                     <Select>
                                         {
                                             goodsStatus.map(item => (
                                                 <Option key={item.id.toString} value={item.id}>{item.name}</Option>
                                             ))
                                         }
                                     </Select>
                                 )}
                             </FormItem>
                         </Col>
                         <Col span={8}>
                             <FormItem className="commodity-select" label="商品分组">
                                 {getFieldDecorator('group')(
                                     <Select placeholder="请选择">
                                         {
                                             groupOption.map(item => (
                                                 <Option key={item.group_id}>{item.group_name}</Option>
                                             ))
                                         }
                                     </Select>
                                 )}
                             </FormItem>
                         </Col>
                     </Row>
                 </div>
                 <div className="screen">
                     <span {...!isTableSpin && {onClick: this.onClear}}>清空筛选条件</span>
                     <Button onClick={this.onFiltra} disabled={isTableSpin}>筛选</Button>
                 </div>
             </Skeleton>
         );
     }
}
