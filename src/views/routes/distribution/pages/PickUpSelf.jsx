/*
* 上门自提  邓小妹
* */
import PickMain from '../components/pickupself/PickMain';
import PickEdit from '../components/pickupself/PickEdit';
import ErrPage from '../../../common/default-page/NoRoot';
import './PickUpSelf.less';

class PickUpSelf extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            showStatus: '',  //页面显示状态
            editInfo: {},    //编辑的信息
            editArea: [],  //编辑的地区
            latitude: '',
            longitude: ''
        };
    }

    componentDidMount() {
        console.log('父组件');
    }

    setEditInfo = (data) => {
        this.setState({
            editInfo: data.editInfo,
            latitude: data.latitude,
            longitude: data.longitude,
            editArea: data.editArea
        });
    }

    //切换页面
    changeRoute = (edit = '') => {
        this.setState({
            showStatus: edit
        });
    };

    render() {
        const {showStatus, longitude, latitude, editInfo, editArea} = this.state;
        return (
            showStatus !== 'two' ? (
                <React.Fragment>
                    <PickMain
                        displayStatus={showStatus}
                        changeRoute={this.changeRoute}
                        setEditInfo={this.setEditInfo}
                    />
                    {
                        showStatus === 'one' && (
                            <PickEdit
                                longitude={longitude}
                                latitude={latitude}
                                editInfo={editInfo}
                                editArea={editArea}
                                changeRoute={this.changeRoute}
                            />
                        )
                    }
                </React.Fragment>
            ) : (<ErrPage/>)
        );
    }
}
export default PickUpSelf;
