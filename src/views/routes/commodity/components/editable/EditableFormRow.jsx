/**
 * 可编辑表格行组件
 */
import {Form} from 'antd';
import PropTypes from 'prop-types';

const EditableContext = React.createContext();

const EditableRow = ({form, ...props}) => (
    <EditableContext.Provider value={form}>
        <tr {...props}/>
    </EditableContext.Provider>
);

EditableRow.propTypes = {
    form: PropTypes.object.isRequired
};

const EditableFormRow = Form.create()(EditableRow);

export default EditableFormRow;
