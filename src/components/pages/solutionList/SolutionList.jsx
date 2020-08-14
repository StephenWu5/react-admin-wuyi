import React from 'react';
import {Button,Icon,Menu,Dropdown,Input,Row, Col, Card,Table, Divider} from 'antd';
import AddOrEditModel from './addOrEditModel.jsx';
import { http } from '@/axios/server.js';
import  $ from  'jquery';
import DeleteModel from './deleteModel.jsx';
import './SolutionList.css';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import Base from '../../../commonjs/base.js';

const Search = Input.Search;




class SolutionList extends React.Component {
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
        this.fetchList({
            results: pagination.pageSize,
            page: pagination.current - 1,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
        });
    }

    handleSearchClick = (keyWord,pagination) => {
        this.fetchList({
            page: 0,
            keyword: keyWord
        });
    }

    fetchList = (params = {}) => {
        var href = window.location.href,type = href.substr(href.length - 1),defaultType = 1;
        //如果type的值为n ,默认值为1
        type =  type == 'n' ? defaultType : type;

        var opt = {
            method: 'get',
            url: '/api/plan/findPlanByTypeId?id=' + type,
            params: {
                size: 5,
                ...params,
            },
            type: 'json',
        }
        this.setState({ loading: true });

        http(opt).then((response) => {
            //设置列表的分页
            const pagination = { ...this.state.pagination };
            pagination.total = response.data.data.totalElements;
            pagination.pageSize = response.data.data.size;
            if (this._isMounted) {
                this.setState({
                    loading: false,
                    dataList: response.data.data.content,
                    pagination,
                });
            }
        })
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


    componentWillMount(){
        this._isMounted = true;
        this.fetchList();
    }

    componentDidMount() {
        // this.fetchList();
    }

    componentWillUnmount(){
        this._isMounted = false;
    }
    
    render() {
        //配合下面的this.showAddModel方法,所以写在这里
        const columns = [
            {
                title: '标题',
                dataIndex: 'planName',
                render: planName => {
                    return planName
                },
                width: '15%',
            },
            {
                title: '图片',
                sorter: true,
                render: (text, record) => {
                    return <a href={record.planPath} target="_blank">
                        <img src={record.planPath} alt="" style={{height: 110, width: 180}}/>
                    </a>
                },
                width: '20%',
            },
            // {
            //     title: '内容',
            //     sorter: true,
            //     render: (text, record) => {
            //         // return record.dynaContent;
            //         let html = { __html: record.planContent };
            //         return <div dangerouslySetInnerHTML={html}></div>;
            //     },
            //     width: '15%',
            // },
            {
                title: '创建时间',
                dataIndex: 'updateTime',
                render: time => {
                    return Base.formatDateTime(time);
                },
                width: '20%',
            },
            {
                title: '使用状态',
                dataIndex: 'planStatus',
                render: status => {
                    return status == 0 ? '启用' : '禁用';
                },
                width: '10%',
            },
            {
                title: '操作',
                dataIndex: 'id',
                render: (id, record) => {
                    var targetObj = this.findObjByID(id);
                    return (
                    <span style={{fontWeight: 400,fontSize: '12px'}}>
                        <a href="javascript:;" style={{ color: '#1990FF'}} onClick={this.showAddModel.bind(this,'edit',{targetObj})}>编辑</a>
                        <DeleteModel id={id} fetchList={this.fetchList}></DeleteModel>
                    </span>
                    )
                },
                width: '33%',
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
            <div className="gutter-example">
                {/*面包屑*/}
                <BreadcrumbCustom first="解决方案" />
                {/*表格*/}
                <Row gutter={16}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card title="" bordered={false}>
                                <div className="content-wrapper">
                                    <Button type="primary" onClick={this.showAddModel.bind(this,'add',null)}>添加<Icon type="plus"/></Button>
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
                            </Card>
                        </div>
                    </Col>
                </Row>

                {/*弹窗层*/}
                <AddOrEditModel style={{width: '180px'}} className="addModel" onRef={this.onRef} fetchList={this.fetchList}></AddOrEditModel>
            </div>
        );
    }
}

export default SolutionList;