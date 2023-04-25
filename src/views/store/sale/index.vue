<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="客户名称" prop="customerName">
        <el-input
            v-model="queryParams.customerName"
            placeholder="请输入客户名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机ID" prop="phoneId">
        <el-input
            v-model="queryParams.phoneId"
            placeholder="请输入手机ID"
            clearable
            style="width: 200px"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="销售数量" prop="saleQuantity">
        <el-input
            v-model="queryParams.saleQuantity"
            placeholder="请输入销售数量"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="销售总价" prop="salePrice">
        <el-input
            v-model="queryParams.salePrice"
            placeholder="请输入销售总价"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['store:sale:add']"
        >购买</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['store:sale:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['store:sale:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['store:sale:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="saleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="销售id" align="center" prop="saleId" />
      <el-table-column label="客户名称" align="center" prop="customerName" />
      <el-table-column label="手机ID" align="center" prop="phoneId" />
      <el-table-column label="销售数量" align="center" prop="saleQuantity" />
      <el-table-column label="销售总价" align="center" prop="salePrice" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="销售时间" align="center" prop="createTime" width="180">

        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['store:sale:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['store:sale:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="saleRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="手机ID" prop="phoneId">
          <el-input v-model="form.phoneId" placeholder="请输入手机ID" />
        </el-form-item>
        <el-form-item label="销售数量" prop="saleQuantity">
          <el-input v-model="form.saleQuantity" placeholder="请输入销售数量" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Sale">
import { listSale, getSale, delSale, addSale, updateSale } from "@/api/store/sale";
import {onMounted, onUnmounted} from "vue";

const { proxy } = getCurrentInstance();
const { sys_normal_disable } = proxy.useDict("sys_normal_disable");

const saleList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    saleCode: undefined,
    saleName: undefined,
    status: undefined
  },
  //表单校验
  rules: {
    saleId: [{ required: true, message: "销售ID不能为空", trigger: "blur" }],
    customerName: [{ required: true, message: "客戶名称不能为空", trigger: "blur" }],
    phoneId: [{ required: true, message: "手机ID不能为空", trigger: "blur" }],
    saleQuantity: [{ required: true, message: "销售数量不能为空", trigger: "blur" }],
  }
});



const { queryParams, form, rules } = toRefs(data);

/** 设置定时器 */
let timer = null
onMounted(() => {
      getList();
      setTimer();
    },
)
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
})

function setTimer() {
  //在上面的私有变量中定义定时器变量，在这里赋值
  timer = setInterval(()=>{
    //任务内容
    getList();
  },3000)
}

/** 查询销售列表 */
function getList() {
  loading.value = true;
  listSale(queryParams.value).then(response => {
    saleList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 表单重置 */
function reset() {
  form.value = {
    saleId: undefined,
    saleCode: undefined,
    saleName: undefined,
    saleSort: 0,
    status: "0",
    remark: undefined
  };
  proxy.resetForm("saleRef");
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.saleId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加订单";
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  queryParams.value.pageNum = 1;
  getList();
  const saleId = row.saleId || ids.value;
  getSale(saleId).then(response => {
  //   form.value = response.data;
  //   open.value = true;
    title.value = "查看订单";
  });
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["saleRef"].validate(valid => {
    if (valid) {
      if (form.value.saleId != undefined) {
        updateSale(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addSale(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}
/** 删除按钮操作 */
function handleDelete(row) {
  const saleIds = row.saleId || ids.value;
  proxy.$modal.confirm('是否确认删除订单编号为"' + saleIds + '"的数据项？').then(function() {
    return delSale(saleIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download("store/sale/export", {
    ...queryParams.value
  }, `sale_${new Date().getTime()}.xlsx`);
}

getList();
</script>
