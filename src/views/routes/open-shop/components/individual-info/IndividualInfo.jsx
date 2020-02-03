/**
 * 个体工商信息组件
 * 雷疆
 */
import {Form, Input, Popover} from 'antd';
import SUpload from '../../../../common/upload/upload';
import './IndividualInfo.less';

const {MESSAGE: {FORMVALIDATOR}} = Constants;
const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 10}
};
class Individual extends BaseComponent {
    state={
        shopData: {}, //父组件传入数据
        sliExp: {} //营业证信息
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.shopData !== this.props.shopData) {
            this.setState({
                shopData: nextProps.shopData
            });
        }
    }

     // 提交表单
     submit = () => {
         const {validateFieldsAndScroll} = this.props.form;
         const {value} = this.state;
         return new Promise((resoloved, rejected) => {
             validateFieldsAndScroll({first: true, force: true, firstFields: ['credit'], scroll: {offsetTop: 100}}, (err, val) => {
                 if (!err) {
                     val.threeInOne = value;
                     resoloved(val);
                 }
             });
         });
     }

     //传图的回调
     success = (obj) => {
         if (obj.status === 0) {
             if (obj.ix === 2) {
                 this.setState({
                     sliExp: obj
                 });
             }
         } else if (obj.status === 1) {
             if (obj.ix === 2) {
                 this.setState(prevState => {
                     prevState.shopData.shop_lic = '';
                     prevState.shopData.shop_lic_exp = '';
                     if (prevState.shopData.pics) {
                         prevState.shopData.pics[2] = '';
                     }
                     return {
                         shopData: prevState.shopData,
                         sliExp: {}
                     };
                 });
             }
         }
     }

     render() {
         const {getFieldDecorator} = this.props.form;
         const {sliExp, shopData} = this.state;
         return (
             <Form onSubmit={this.submit} className="login-form individual" {...formItemLayout} hideRequiredMark>

                 <Form.Item label="营业执照：" className="pictrue">
                     <div className="pic-title">
                    照片最大2M
                         <Popover placement="right" title="营业执照" trigger="hover" content={<img className="business-license" src={shopData.mana5}/>}>
                             <span className="look-both">查看示例</span>
                         </Popover>
                     </div>
                     {
                         getFieldDecorator('pic', {
                         })(
                             <SUpload
                                 form={this.props.form}
                                 ix={2}
                                 show
                                 onSuccess={this.success}
                                 init={(shopData.pics && shopData.pics[2]) || ''}
                                 btnText="营业执照"
                                 status="pic"
                                 messages={FORMVALIDATOR.bussiness_license_null}
                             />
                         )
                     }

                 </Form.Item>
                 <Form.Item label="统一社会信用代码：" className="open-shop-coder">
                     {getFieldDecorator('credit', {
                         initialValue: sliExp.reg_num || (shopData && shopData.shop_lic)
                     })(
                         <Input
                             disabled
                             placeholder="统一社会信用代码"
                         />,
                     )}
                 </Form.Item>
                 <Form.Item label="营业执照有效期" className="open-shop-coder">
                     {getFieldDecorator('businessPicker', {
                         initialValue: sliExp.exp || (shopData && shopData.shop_lic_exp)
                     })(
                         <Input
                             placeholder="营业证有效期"
                             disabled
                         />,
                     )}
                 </Form.Item>
             </Form>
         );
     }
}

export default Form.create()(Individual);
