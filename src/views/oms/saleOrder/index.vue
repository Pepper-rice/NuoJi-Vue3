<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="订单编号" prop="sn">
        <el-input
          v-model="queryParams.sn"
          placeholder="请输入订单编号"
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
          v-hasPermi="['oms:saleOrder:add']"
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
          v-hasPermi="['oms:saleOrder:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="销售单编号" align="center" prop="sn" />
      <el-table-column label="客户" align="center" prop="customer.customerName" />
      <el-table-column label="单据日期" align="center" prop="billDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.billDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="inventoryStatus" :formatter="statusFormat"/>
      <el-table-column label="合计金额" align="center" prop="totalAmount" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['oms:purchase:edit']"
            v-if="scope.row.inventoryStatus == 2"
          >查看</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['oms:saleOrder:edit']"
            v-if="scope.row.inventoryStatus == 0"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-success"
            @click="handleConfirm(scope.row)"
            v-hasPermi="['oms:purchase:edit']"
            v-if="scope.row.inventoryStatus == 0"
          >确认出库</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['oms:saleOrder:remove']"
            v-if="scope.row.inventoryStatus == 0"
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
  </div>
</template>

<script>
import { listSaleOrder, delSaleOrder, confirmSaleOrder } from "@/api/oms/saleOrder";

export default {
  name: "Order",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
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
      // 销售订单表格数据
      orderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,

      // 库存状态字典
      inventoryStatusOptions: [],

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sn: null
      },
      // 表单参数
      form: {}
    };
  },
  created() {
    this.getList();
    this.getDicts("inventory_status").then(response => {
      this.inventoryStatusOptions = response.data;
    });
  },

  // 编辑后刷新数据
  activated () {
    const time = this.$route.query.t;
    if (time != null && time != this.uniqueId) {
      this.uniqueId = time;
      this.resetQuery();
    }
  },

  methods: {
    /** 查询销售订单列表 */
    getList() {
      this.loading = true;
      listSaleOrder(this.queryParams).then(response => {
        this.orderList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
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
      this.$router.push({name: "SaleOrderEdit"});
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id = row.id || this.ids.toString()
      this.$router.push({name: "SaleOrderEdit", params: {id}});
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除销售订单编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delSaleOrder(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 字典状态字典翻译 */
    statusFormat(row, column) {
      return this.selectDictLabel(this.inventoryStatusOptions, row.inventoryStatus);
    },
    /** 确认出库 */
    handleConfirm(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认销售订单编号为"' + ids + '"进行出库?', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return confirmSaleOrder(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("出库成功");
      })
    }
  }
};
</script>
