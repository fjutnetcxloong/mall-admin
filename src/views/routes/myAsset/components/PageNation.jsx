import React from 'react';
// import {Pagination} from 'antd';
import HandlePage from '../../../common/handle-page/HandlePage';

class MyPagenation extends BaseComponent {
    render() {
        const {total, pageChange, pageSizeChange, pageNow, size} = this.props;
        return (
            <div className="pagenation-box">
                <HandlePage
                    page={pageNow}
                    size={size}
                    count={Number(total)}
                    onShowSizeChange={pageSizeChange}
                    onChangePage={pageChange}
                />
                {/* <Pagination
                    size="small"
                    total={total}
                    showTotal={() => this.showTotal(total)}
                    showSizeChanger
                    showQuickJumper
                    defaultPageSize={10}
                    current={pageNow || 1}
                    onChange={(data) => pageChange(data)} //点击不同的页码时
                    onShowSizeChange={(data, value) => pageSizeChange(value)} //分页如20条每页变化时
                /> */}
            </div>
        );
    }
}

export default MyPagenation;