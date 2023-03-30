<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户编号" prop="sn">
        <el-input
          v-model="queryParams.sn"
          placeholder="请输入客户编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['oms:customer:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['oms:customer:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="customerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" v-if="show"/>
      <el-table-column label="客户编号" align="center" prop="sn" />
      <el-table-column label="客户名称" align="center" prop="customerName" />
      <el-table-column label="客户类别" align="center" prop="customerType" :formatter="customerTypeFormat"/>
      <el-table-column label="客户等级" align="center" prop="customerLevel" :formatter="customerLevelFormat"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['oms:customer:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['oms:customer:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改客户信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客户编号" prop="sn">
          <el-input v-model="form.sn" placeholder="请输入客户编号" />
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="客户类别" prop="customerType">
          <el-select v-model="form.customerType" placeholder="请选择客户类别">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户等级" prop="customerLevel">
          <el-input v-model="form.customerLevel" placeholder="请输入客户等级" />
        </el-form-item>
        <el-form-item label="余额日期" prop="balanceDate">
          <el-date-picker clearable size="small"
                          v-model="form.balanceDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择余额日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="期初应收" prop="firstGet">
          <el-input v-model="form.firstGet" placeholder="请输入期初应收" />
        </el-form-item>
        <el-form-item label="期初预收" prop="firstPreGet">
          <el-input v-model="form.firstPreGet" placeholder="请输入期初预收" />
        </el-form-item>
        <el-form-item label="纳税人识别号" prop="taxIdentity">
          <el-input v-model="form.taxIdentity" placeholder="请输入纳税人识别号" />
        </el-form-item>
        <el-form-item label="开户银行" prop="bankInfo">
          <el-input v-model="form.bankInfo" placeholder="请输入开户银行" />
        </el-form-item>
        <el-form-item label="银行账号" prop="bankNum">
          <el-input v-model="form.bankNum" placeholder="请输入银行账号" />
        </el-form-item>
        <el-form-item label="销售人员id" prop="sellerId">
          <el-input v-model="form.sellerId" placeholder="请输入销售人员id" />
        </el-form-item>
        <el-form-item label="租户ID" prop="tenantId">
          <el-input v-model="form.tenantId" placeholder="请输入租户ID" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCustomer, delCustomer, addCustomer, updateCustomer } from "@/api/oms/customer";

export default {
  name: "Customer",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 是否显示
      show: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 客户信息表格数据
      customerList: [],
      // 客户类别
      customerTypeOptions: [],
      // 客户等级
      customerLevelOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sn: null,
        customerName: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        sn: [
          { required: true, message: "客户编号不能为空", trigger: "blur" }
        ],
        customerName: [
          { required: true, message: "客户名称不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("customer_type").then(response => {
      this.customerTypeOptions = response.data;
    });
    this.getDicts("customer_level").then(response => {
      this.customerLevelOptions = response.data;
    });
  },
  activated() {
    const time = this.$route.query.t;
    if (time != null && time != this.uniqueId) {
      this.uniqueId = time;
      this.resetQuery();
    }
  },
  methods: {
    /** 查询客户信息列表 */
    getList() {
      this.loading = true;
      listCustomer(this.queryParams).then(response => {
        this.customerList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 字典状态字典翻译 */
    customerTypeFormat(row, column) {
      return this.selectDictLabel(this.customerTypeOptions, row.customerType);
    },
    /** 字典状态字典翻译 */
    customerLevelFormat(row, column) {
        return this.selectDictLabel(this.customerLevelOptions, row.customerLevel);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        sn: null,
        customerName: null,
        customerType: null,
        customerLevel: null,
        balanceDate: null,
        firstGet: null,
        firstPreGet: null,
        taxIdentity: null,
        bankInfo: null,
        bankNum: null,
        sellerId: null,
        delFlag: null,
        tenantId: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({name: "CustomerEdit"});
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id = row.id || this.ids.toString()
      this.$router.push({name: "CustomerEdit", params: {id}});
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCustomer(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCustomer(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除当前数据?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delCustomer(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    }
  }
};
</script>
