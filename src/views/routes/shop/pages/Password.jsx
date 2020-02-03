import ForgetPass from '../../login/components/ForgetPass';
import ErrPage from '../../../common/default-page/NoRoot';
import '../index.less';
import './Password.less';

const {getShopInfo} = Utils;

class Password extends BaseComponent {
    state = {
        errPage: false
    }

    componentDidMount = () => {
        const status = getShopInfo().data.status;
        if (status !== 6) {
            this.setState({
                errPage: true
            });
        }
    };

    render() {
        const {errPage} = this.state;
        return (
            <div className="shop-setting">
                <div className="page password-container">
                    <div className="password-box">
                        {
                            errPage ? (<ErrPage/>) : (<ForgetPass/>)
                        }
                    </div>
                </div>
            </div>
        );
    }
}
export default Password;
