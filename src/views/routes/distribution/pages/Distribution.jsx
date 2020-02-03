/*
* 快递发货  邓小妹
* */
import FreightList from '../components/distribution/FreightList';
import NewTemplate from '../components/distribution/NewTemplate';
import './Distribution.less';


const {getUrlParam} = Utils;
class Distribution extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            showStatus: '',  //显示运费模板主页还是新增运费模板页面
            editId: '',  //编辑模板id
            handleState: ''   //指定新增还是编辑
        };
    }

    componentDidMount() {
        console.log('父级组件');
        this.getUrlParam();
    }

    //切换页面
    changeRoute = (edit = '') => {
        this.setState({
            showStatus: edit
        });
    };

    //设置新增或编辑转态
    setHandleState = (flag) => {
        this.setState({
            handleState: flag
        });
    };

    //获取url传的参数
    getUrlParam = () => {
        const status = getUrlParam('status', this.props.location.search);
        if (status && status === '1') {
            this.setState({
                showStatus: 'one',
                handleState: 'create'
            });
        }
    };

    setEditId = (id) => {
        this.setState({
            editId: id
        });
    };

    render() {
        const {showStatus, editId, handleState} = this.state;
        return (
            <React.Fragment>
                <FreightList
                    displayStatus={showStatus}
                    changeRoute={this.changeRoute}
                    setEditId={this.setEditId}
                    setHandleState={this.setHandleState}
                />
                {
                    showStatus === 'one'
                    && (
                        <NewTemplate
                            changeRoute={this.changeRoute}
                            editId={editId}
                            handleState={handleState}
                        />
                    )
                }
            </React.Fragment>
        );
    }
}
export default  Distribution;
