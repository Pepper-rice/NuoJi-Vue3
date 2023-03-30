<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="商品名称" prop="params['productName']">
        <el-input
          v-model="queryParams.params['productName']"
          placeholder="请输入商品名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="仓库名称" prop="params['warehouseName']">
        <el-input
          v-model="queryParams.params['warehouseName']"
          placeholder="请输入仓库名称"
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

    <el-table v-loading="loading" :data="inventoryList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="商品名称" align="center" prop="product.productName" />
      <el-table-column label="商品编号" align="center" prop="productSku.sn" />
      <el-table-column label="商品条码" align="center" prop="productSku.barCode" />
      <el-table-column label="商品规格" align="center" prop="productSku.specifications" />
      <el-table-column label="仓库名称" align="center" prop="warehouse.warehouseName" />
      <el-table-column label="库存数量" align="center" prop="qty" />
      <el-table-column label="商品单位" align="center" prop="product.unit">
        <template slot-scope="scope">
          <span>{{unitFormat(scope.row.product.unit)}}</span>
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
import { listInventory  } from "@/api/oms/inventory";

export default {
  name: "Inventory",
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
      // 库存信息表格数据
      inventoryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //单位
      unitOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        params: {}
      },
      // 表单参数
      form: {}
    };
  },
  created() {
    this.getList();
    // 单位字典
    this.getDicts("unit").then(response => {
      this.unitOptions = response.data;
    });
  },
  methods: {
    /** 查询库存信息列表 */
    getList() {
      this.loading = true;
      listInventory(this.queryParams).then(response => {
        this.inventoryList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 字典状态字典翻译 */
    unitFormat(val) {
      return this.selectDictLabel(this.unitOptions, val);
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
    }
  }
};
</script>
