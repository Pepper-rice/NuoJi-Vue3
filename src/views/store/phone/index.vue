<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="手机名称" prop="phoneName">
        <el-input
            v-model="queryParams.phoneName"
            placeholder="请输入手机名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机品牌" prop="phoneBrand">
        <el-input
            v-model="queryParams.phoneBrand"
            placeholder="请输入手机品牌"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input
            v-model="queryParams.price"
            placeholder="请输入价格"
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
            v-hasPermi="['store:phone:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['store:phone:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['store:phone:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['store:phone:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="phoneList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="手机id" align="center" prop="phoneId" />
      <el-table-column label="手机名称" align="center" prop="phoneName" />
      <el-table-column label="手机品牌" align="center" prop="phoneBrand" />
      <el-table-column label="存储容量" align="center" prop="phoneStorage" />
      <el-table-column label="价格" align="center" prop="price" />
      <el-table-column label="手机库存" align="center" prop="phoneQuantity"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['store:phone:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['store:phone:remove']">删除</el-button>
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
      <el-form ref="phoneRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="手机名称" prop="phoneName">
          <el-input v-model="form.phoneName" placeholder="请输入手机名称" />
        </el-form-item>
        <el-form-item label="手机品牌" prop="phoneBrand">
          <el-input v-model="form.phoneBrand" placeholder="请输入手机品牌" />
        </el-form-item>
        <el-form-item label="存储容量" prop="phoneStorage">
          <el-input v-model="form.phoneStorage" placeholder="请输入存储容量" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="手机库存" prop="phoneQuantity">
          <el-input v-model="form.phoneQuantity" placeholder="请输入手机库存" />
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

<script setup name="Phone">
import { listPhone, getPhone, delPhone, addPhone, updatePhone } from "@/api/store/phone";
import {onMounted ,onUnmounted} from "vue";


const { proxy } = getCurrentInstance();
const { sys_normal_disable } = proxy.useDict("sys_normal_disable");

const phoneList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    phoneCode: undefined,
    phoneName: undefined,
    status: undefined,
    saleQuantity: undefined,
    phoneQuantity: undefined,
    timer: null
  },
  //表单校验
  rules: {
    phoneName: [{ required: true, message: "手机名称不能为空", trigger: "blur" }],
    phoneBrand: [{ required: true, message: "手机品牌不能为空", trigger: "blur" }],
    phoneStorage: [{ required: true, message: "储存容量不能为空", trigger: "blur" }],
    price: [{ required: true, message: "价格不能为空", trigger: "blur" }],
    phoneQuantity: [{ required: true, message: "手机库存不能为空", trigger: "blur" }],
  },

});



const { queryParams, form, rules } = toRefs(data);

/** 设置定时器 */
let timer = null
onMounted(() => {
      getList();
      setTimer();
    },
)
onUnmounted(() =>
{
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

/** 查询手机列表 */
function getList() {
  loading.value = true;
  listPhone(queryParams.value).then(response => {
    phoneList.value = response.rows;
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
    phoneId: undefined,
    phoneCode: undefined,
    phoneName: undefined,
    phoneSort: 0,
    status: "0",
    remark: undefined,
    phoneQuantity: undefined
  };
  proxy.resetForm("phoneRef");
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
  ids.value = selection.map(item => item.phoneId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加手机";
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const phoneId = row.phoneId || ids.value;
  getPhone(phoneId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改手机";
  });
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["phoneRef"].validate(valid => {
    if (valid) {
      if (form.value.phoneId != undefined) {
        updatePhone(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPhone(form.value).then(response => {
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
  const phoneIds = row.phoneId || ids.value;
  proxy.$modal.confirm('是否确认删除手机编号为"' + phoneIds + '"的数据项？').then(function() {
    return delPhone(phoneIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download("store/phone/export", {
    ...queryParams.value
  }, `phone_${new Date().getTime()}.xlsx`);
}



getList();
</script>
