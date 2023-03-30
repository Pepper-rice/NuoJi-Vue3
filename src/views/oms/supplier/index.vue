<template>
  <div class="app-container">
    <avue-crud :data="data" :page.sync="page"
               @on-load="onLoad"
               @search-change="searchChange"
               @selection-change="selectionChange"
               @refresh-change="refreshChange"
               @row-save="rowSave"
               @row-update="rowUpdate"
               @row-del="rowDel"
               :option="option" v-model="supplierForm" :search.sync="search"
               :before-open="beforeOpen">
      <template slot="menuLeft" slot-scope="{}">
        <el-button icon="el-icon-delete" size="small" type="danger" @click="rowDel" :disabled="multiple">删除</el-button>
      </template>
      <template slot-scope="{row}" slot="inputForm">
        <el-tag>{{row}}</el-tag>
      </template>
    </avue-crud>
  </div>
</template>
<script>
import {listSupplier, getSupplier, saveSupplier, delSupplier } from "@/api/oms/supplier";

export default {
  name: "supplier",
  data() {
    return {
      page: {
      },
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sn: null,
        supplierName: null
      },
      data: [],
      supplierForm: {},
      option: {
        searchMenuSpan:4,
        selection: true,
        tip: false,
        reserveSelection:true,
        labelWidth: 110,
        searchLabelWidth: 100,
        column: [{
          label: '供应商编号',
          prop: "sn",
          span:12,
          search:true,
          disabled:true,
          width: 140
        },{
          label: '供应商名称',
          prop: "supplierName",
          span:12,
          search:true,
          rules: [{
            required: true,
            message: "请输入供应商名称",
            trigger: "blur"
          }]
        },{
          label: '供应商类别',
          prop: "supplierType",
          type: "select",
          dicData: this.supplierTypeOptions,
          span:12
        },{
          label: '余额日期',
          prop: "balanceDate",
          type: "date",
          hide: true,
          span:12,
          rules: [{
            required: true,
            message: "请输入余额日期",
            trigger: "blur"
          }]
        },{
          label: '期初应付',
          prop: "firstPay",
          type: "number",
          hide: true,
          span:12,
          rules: [{
            required: true,
            message: "请输入期初应付",
            trigger: "blur"
          }]
        },{
          label: '期初预付款',
          prop: "firstPrePay",
          type: "number",
          hide: true,
          span:12,
          rules: [{
            required: true,
            message: "请输入期初预付款",
            trigger: "blur"
          }]
        },{
          label: '纳税人识别号',
          prop: "taxIdentity",
          hide: true,
          span:12,
          rules: [{
            required: true,
            message: "请输入纳税人识别号",
            trigger: "blur"
          }]
        },{
          label: '增值税税率',
          prop: "taxRate",
          type: "number",
          hide: true,
          span:12
        },{
          label: '开户银行',
          prop: "bankInfo",
          hide: true,
          span:12
        },{
          label: '银行账号',
          prop: "bankNum",
          hide: true,
          span:12
        },
          {
            label: '联系人信息',
            prop: 'supplierContactsList',
            type: 'dynamic',
            span:24,
            hide: true,
            children: {
              align: 'center',
              headerAlign: 'center',
              cellBtn: true,
              column: [{
                width: 200,
                label: '姓名',
                prop: "name",
                rules: [{
                  required: true,
                  message: "请输入姓名",
                  trigger: "blur"
                }]
              }, {
                width: 200,
                label: '手机',
                prop: "phone",
                rules: [{
                  required: true,
                  message: "请输入手机",
                  trigger: "blur"
                }]
              }, {
                width: 200,
                label: '座机',
                prop: "tel"
              }, {
                width: 200,
                label: '邮箱',
                prop: "email"
              }, {
                width: 200,
                label: '地址',
                prop: "address"
              }, {
                width: 200,
                label: '备注',
                prop: "remark",
                hide: true
              },  {
                width: 200,
                label: '是否默认',
                prop: "isDefault",
                type: 'switch',
                cell: true,
                dicData: [{
                  label: '否',
                  value: false
                }, {
                  label: '是',
                  value: true
                }]
              }]
            }
          },

        ]
      },
      showEdit: [], //显示编辑框
      showBtn: [],
      search: {},
      // 客户类别字典
      supplierTypeOptions: []
    };
  },
  created() {
    this.getDicts("supplier_type").then(response => {
      this.supplierTypeOptions = response.data.map(d => {
        return {label: d.dictLabel, value: d.dictValue}
      })
      var column = this.findObject(this.option.column,'supplierType');
      column.dicData = this.supplierTypeOptions
    });
  },
  methods: {
    error(err){
      console.log(err)
    },
    rowSave(form,done,loading){
      saveSupplier(form).then(res => {
        if (res.code === 200) {
          setTimeout(()=>{
            this.refreshChange()
            this.$message.success(res.msg)
          },1000)
          setTimeout(()=>{
            done()
          },2000)
        }
      });
    },
    rowUpdate(form,index,done,loading){
      saveSupplier(form).then(res => {
        if (res.code === 200) {
          setTimeout(()=>{
            this.refreshChange()
            this.$message.success(res.msg)
          },1000)
          setTimeout(()=>{
            done()
          },2000)
        }
      });
    },
    rowDel(form,index){
      const ids = form.id || this.ids;
      this.$confirm('是否确认删除当前数据?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delSupplier(ids);
      }).then(() => {
        setTimeout(()=>{
          this.refreshChange()
          this.$message.success('删除成功')
        },1000)
        setTimeout(()=>{
          done()
        },2000)
      })
    },
    /** 查询供应商信息列表 */
    onLoad(page) {
      this.queryParams.pageNum = page.currentPage ? page.currentPage:1
      this.queryParams.pageSize = page.pageSize
      listSupplier(this.queryParams).then(response => {
        this.data = response.rows;
        this.page.total = response.total;
      });
    },

    // 多选
    selectionChange(list){
      this.ids = list.map(item => item.id)
      this.multiple = !list.length
    },

    // 条件搜索
    searchChange(params,done) {
      done();
      listSupplier(params).then(response => {
        this.data = response.rows;
        this.page.total = response.total;
      });
    },

    // 刷新
    refreshChange(){
      this.queryParams.pageNum = this.page.currentPage ? this.page.currentPage:1
      this.queryParams.pageSize = this.page.pageSize
      this.queryParams.sn = this.search.sn
      this.queryParams.supplierName = this.search.supplierName
      listSupplier(this.queryParams).then(response => {
        this.data = response.rows;
        this.page.total = response.total;
      });
    },

    // 编辑或查看时
    beforeOpen(done,type){
      if(['view','edit'].includes(`${type}`)){
        // 查看和编辑逻辑
        getSupplier(this.supplierForm.id).then(response => {
          this.msgSuccess("获取数据成功");
          this.supplierForm = response.data
        });
      }else{
        //新增逻辑
        //一定要用setTimeout包裹，由于form组件底层一些机制的设计
        setTimeout(()=>{
        },0)
      }
      done();
    }
  },
  watch: {
    // supplierForm: {
    //   handler(newValue, oldValue) {
    //   console.log(newValue)
    //   console.log(oldValue)
    //
    // },
    // deep: true,
    // immediate: true
    // }
  }
}
</script>
