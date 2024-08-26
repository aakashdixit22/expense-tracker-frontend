import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button } from 'react-bootstrap';
import { Input, message, Modal, Select, Form ,DatePicker} from 'antd';
import axios from 'axios';
import {UnorderedListOutlined,AreaChartOutlined,EditOutlined,DeleteOutlined} from '@ant-design/icons';
import Spinner from '../components/Spinner';
import { Table } from 'antd';
import moment from 'moment';
import Analytics from '../components/Analytics';

const {RangePicker} =  DatePicker;// Import RangePicker from antd used to select range date

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransection, setAllTransections] = useState([]); // State to store all transactions
  const [frequency, setFrequency] = useState("7"); // State to store frequency of transactions
  const [selectedDate, setSelectedDate] = useState([]); // State to store selected date range
  const[type,setType] = useState("all");// State to store type of transaction
  const[viewData,setViewData] = useState("table");// State to store view data
  const[editable,setEditable] = useState(null);// State to store editable data

  // Define columns for the table
  const columns = [
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
      
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Date",
      dataIndex: "date",
      render : (text) => <span>{moment(text).format('YYYY-MM-DD')}</span>
    },
    {
      title: "Refrence",
      dataIndex: "refrence",
    },
    {
      title: "Actions",
      render:(text,record) => (
        <div>
          <EditOutlined className='mx-2' onClick={() =>{
            setEditable(record);
            setShowModal(true);
          }
          }/>
          <DeleteOutlined className='mx-2' onClick={ () =>{handleDelete(record)}}/>
        </div>
      )
    },
  ];

  // Define the function to get all transactions
  const getAllTransections = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user')); // Get user from localStorage
      const res = await axios.post('https://expense-tracker-backend-u48t.onrender.comhttps://expense-tracker-backend-u48t.onrender.com/transections/get-transection', { userid: user._id,frequency,selectedDate,type});
      setAllTransections(res.data);
      setLoading(false);
      console.log(res.data);
    } catch (error) {
      setLoading(false);
      message.error("Failed to fetch transactions");
    }
  };

  // useEffect hook to call getAllTransections when frequency changes
  useEffect(() => {
    const getAllTransections = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user')); // Get user from localStorage
        const res = await axios.post('https://expense-tracker-backend-u48t.onrender.com/transections/get-transection', { userid: user._id, frequency ,selectedDate,type});
        setAllTransections(res.data);
        setLoading(false);
        console.log(res.data);
      } catch (error) {
        setLoading(false);
        message.error("Failed to fetch transactions");
        
      }
    };
    getAllTransections();
  }, [frequency,selectedDate,type,setAllTransections]);
//delete handler
const handleDelete = async (record) => {
  try {
    setLoading(true);
    await axios.post('https://expense-tracker-backend-u48t.onrender.com/transections/delete-transection', { transactionId: record._id });
    setLoading(false);
    message.success("Transaction Deleted successfully");
    getAllTransections(); // Refresh transactions after adding a new one
  } catch (error) {
    setLoading(false);
    message.error("Failed to delete transaction");
    console.error(error); // Log the error for debugging
  }
};
  // Form handling
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem('user')); // Get user from localStorage
      setLoading(true);
      if (editable) {
        await axios.post('https://expense-tracker-backend-u48t.onrender.com/transections/edit-transection', { payload:{...values,userId:user._id},transactionId:editable._id });
      setLoading(false);
      message.success("Transaction Updated successfully");

      }
      else{
        await axios.post('https://expense-tracker-backend-u48t.onrender.com/transections/add-transection', { ...values, userid: user._id });
      setLoading(false);
      message.success("Transaction Added successfully");
      }

      setShowModal(false);
      setEditable(null);
      getAllTransections(); // Refresh transactions after adding a new one
    } catch (error) {
      setLoading(false);
      message.error("Failed to add transaction");
      console.error(error); // Log the error for debugging
    }
  };

  return (
    <Layout>
      {loading && <Spinner />}
      <div className='filters'>
        <div>
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value="7">LAST 1 WEEK</Select.Option>
            <Select.Option value="30">LAST 1 MONTH</Select.Option>
            <Select.Option value="365">LAST 1 YEAR</Select.Option>
            <Select.Option value="custom">CUSTOM</Select.Option>
          </Select>
          {frequency === "custom" && 
          (<RangePicker value ={selectedDate} 
          onChange={(values)=> setSelectedDate(values)} 

          />
          )}
        </div>
        <div>
          <h6>Select Type</h6>
          <Select value={type} onChange={(values) => setType(values)}>
            <Select.Option value="all">ALL</Select.Option>
            <Select.Option value="income">INCOME</Select.Option>
            <Select.Option value="expense">EXPENSE</Select.Option>
            
          </Select>
          {frequency === "custom" && (
           <RangePicker
            value={selectedDate}
            onChange={(values) => setSelectedDate(values)}
            /> 
          )}
        </div>
        <div className='switch-icons'>
          <UnorderedListOutlined className={`mx-2 ${viewData === 'table' ? 'active-icon': 'inactive-icon'}`} onClick={() => setViewData('table')}/>
          <AreaChartOutlined className={`mx-2 ${viewData === 'analytics' ? 'active-icon': 'inactive-icon'}`} onClick={() => setViewData('analytics')}/>
        </div>
        <div>
          <Button className='btn btn-primary' onClick={() => setShowModal(true)}>Add New</Button>
        </div>
        
      </div>
      <div className='content'>
        {viewData === 'table' ?(
          <Table dataSource={allTransection} columns={columns} />
        ):(<Analytics allTransection={allTransection}/>
        )}
      </div>
      <Modal
        title={editable ? "Edit Transaction" : "Add New Transaction"}
        open={showModal} // Use 'open' here as per Ant Design API
        onCancel={() => setShowModal(false)}
        footer={false} // Set footer to null to disable default footer
      >
        <Form layout="vertical" onFinish={handleSubmit} initialValues={editable}>
          <Form.Item label="Amount" name="amount">
            <Input type="number" />
          </Form.Item>

          <Form.Item label="Type" name="type">
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tip">Tip</Select.Option>
              <Select.Option value="project">Project</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="fees">Fees</Select.Option>
              <Select.Option value="tax">Tax</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Date" name="date">
            <Input type="Date" />
          </Form.Item>

          <Form.Item label="Refrence" name="refrence">
            <Input type="text" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input type="text" />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              SAVE
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
