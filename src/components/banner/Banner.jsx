import React from 'react';
import reqwest from 'reqwest';
import {Breadcrumb,Button,Icon,Menu,Dropdown,Input} from 'antd';
import { Table, Divider } from 'antd';
import AddOrEditModel from './addOrEditModel.jsx';
import  $ from  'jquery';
// import EditModel from './editModel';
import DeleteModel from './deleteModel.jsx';
import './Banner.css';

const Search = Input.Search;




class Banner extends React.Component {
    constructor(props){
        super(props);
    }
    //组件中的变量
    state = {
        searchKey: "旅游",
        arr: ['旅游', '教育', '科技金庸','体育娱乐'],
        selectedRowKeys: [], 
        loading: false,
        dataList: [],
        pagination: {},
        visibleModel: false,
    };

    //父组件调用子组件方法
    onRef = (ref) => {
        this.child = ref
    }

    showAddModel = (type,showModal,e) => {
        this.child.showModal(type,showModal,e);
    }

    // 表格
    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.fetch({
            results: pagination.pageSize,
            pageNo: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
        });
    }

    handleSearchClick = (keyWord,pagination) => {
        console.log(keyWord,'keyword');
        this.fetch({
            pageNo: 1,
            keyword: keyWord
        });
    }

    fetch = (params = {}) => {
        this.setState({ loading: true });
        reqwest({
            url: '/api/investmentCase/list',
            method: 'get',
            data: {
                pageSize: 5,
                ...params,
            },
            type: 'json',
        }).then((data) => {
            const pagination = { ...this.state.pagination };
            pagination.total = 80;
            if (this._isMounted) {
                this.setState({
                    loading: false,
                    dataList: data.obj.list,
                    pagination,
                });
            }
        });
    }

    //表格传参给编辑模态框
    findObjByID(id){
        let arr = this.state.dataList;
        for(var k in arr){
            if(arr[k].id === id){
                return arr[k];
            }
        }
        return null
    }

    click_a(event){
        this.setState({
            searchKey: $(event.target).text()
        })
        event.preventDefault();
    }

    //模态框的书写
    showModal = () => {
        this.setState({
            isModalVisible: true,
        });
    }

    componentDidMount() {
        this._isMounted = true;
        this.fetch();

    }

    componentWillUnmount(){
        this._isMounted = false;
    }
    
    render() {
        //配合下面的this.showAddModel方法,所以写在这里
        const columns = [{
            title: '案例名称',
            dataIndex: 'name',
            sorter: true,
            render: name => `${name}`,
            width: '8%',
        },
            {
            title: '所属领域',
            dataIndex: 'style_id',
            render: title => {
                return (
                    title
                )
            },
            filters: [
                { text: '体游', value: '8' },
                { text: '旅游', value: '13' },
            ],
            width: '6%',
        },
            {
                title: '案例Logo(移动端)',
                dataIndex: 'img',
                render: img=> (
                    <img src={img} alt="" style={{  height: "50px" }} />
                )
            },
            {
                title: '案例Logo(PC端)',
                dataIndex: 'logo',
                render: logo => (
                    <img src={logo} alt="" style={{ height: "50px" }} />
                )
            },
            {
                title: '描述',
                dataIndex: 'detail',
            },
            {
                title: '官网',
                dataIndex: 'url',
                width: '5%',
            },
            {
                title: '标题',
                dataIndex: 'title',
                width: '5%',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                width: '5%',
            },
            {
                title: '操作',
                dataIndex: 'id',
                render: (id, record) => {
                    var targetObj = this.findObjByID(id);
                    return (
                        <span style={{fontWeight: 400,fontSize: '12px'}}>
            <a href="javascript:;" style={{ color: '#1990FF'}} onClick={this.showAddModel.bind(this,'edit',{targetObj})}>编辑</a>
            <Divider type="vertical" />
            <DeleteModel id={id}></DeleteModel>
            <Divider type="vertical" />
        </span>
                    )
                },
                width: '5%',
            },
        ];


        const menu = (
                <Menu>
                    {this.state.arr.map(option => (
                        <Menu.Item key={option}>
                            <a target="_blank" rel="noopener noreferrer" href="javascript:void(0)" onClick={this.click_a.bind(this)}>{option}</a>
                        </Menu.Item>
                    ))}
                    
                </Menu>
            );
        return (
            <div>

                {/*面包屑*/}
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item><a href="">Application Center</a></Breadcrumb.Item>
                    <Breadcrumb.Item><a href="">Application List</a></Breadcrumb.Item>
                    <Breadcrumb.Item>An Application</Breadcrumb.Item>
                </Breadcrumb>
                {/*表格*/}
                <div className="content-wrapper">
                    <Button type="primary" onClick={this.showAddModel.bind(this,'add',null)}>添加<Icon type="plus"/></Button>
                    <Dropdown overlay={menu} placement="bottomLeft">
                        <Button>{this.state.searchKey}</Button>
                    </Dropdown>
                    <Search style={{ marginLeft: '10px', width: '190px'}}
                        placeholder="input search text"
                        onSearch={keyWord => {
                            console.log(keyWord);
                            this.handleSearchClick(keyWord);
                        }}
                        enterButton
                    />
                    <Table
                        columns={columns}
                        rowKey={record => record.id}
                        dataSource={this.state.dataList}
                        pagination={this.state.pagination}
                        loading={this.state.loading}
                        onChange={this.handleTableChange}
                    />
                </div>

                {/*弹窗层*/}
                <AddOrEditModel style={{width: '180px'}} className="addModel" onRef={this.onRef}></AddOrEditModel>
            </div>
        );
    }
}

export default Banner;