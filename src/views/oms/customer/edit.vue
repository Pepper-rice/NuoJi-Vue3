<template>
  <div class="app-container">
    <el-form :model="customForm" :rules="customFormRules" ref="customForm" label-width="160px" class="demo-ruleForm" label-position="right">
    <el-row>
        <el-input type="hidden" v-model="customForm.id" disabled></el-input>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="客户名称" prop="customerName">
      <el-input v-model="customForm.customerName"></el-input>
    </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="客户类别" prop="customerType">
      <el-select v-model="customForm.customerType" clearable filterable placeholder="请选择客户类别">
        <el-option
          v-for="dict in customerTypeOptions"
          :key="dict.dictValue"
          :label="dict.dictLabel"
          :value="dict.dictValue"
        ></el-option>
      </el-select>
    </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item label="客户等级" prop="customerLevel">
      <el-select v-model="customForm.customerLevel" clearable filterable placeholder="请选择客户等级">
        <el-option
          v-for="dict in customerLevelOptions"
          :key="dict.dictValue"
          :label="dict.dictLabel"
          :value="dict.dictValue"
        ></el-option>
      </el-select>
    </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="余额日期">
        <el-form-item prop="balanceDate">
          <el-date-picker clearable type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="customForm.balanceDate"></el-date-picker>
        </el-form-item>
    </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="期初应收款" prop="firstGet">
      <el-input type="number" v-model="customForm.firstGet"></el-input>
    </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="期初预收款" prop="firstPreGet">
      <el-input type="number" v-model="customForm.firstPreGet"></el-input>
    </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="纳税人识别号" prop="taxIdentity">
      <el-input v-model="customForm.taxIdentity"></el-input>
    </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="开户银行" prop="bankInfo">
      <el-input v-model="customForm.bankInfo"></el-input>
    </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="银行账号" prop="bankNum">
      <el-input v-model="customForm.bankNum"></el-input>
    </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="销售人员" prop="sellerId">
      <el-select v-model="customForm.sellerId" placeholder="请选择销售人员">
        <el-option
          v-for="item in userOptions"
          :key="item.userId"
          :label="item.nickName"
          :value="item.userId"
        ></el-option>
      </el-select>
    </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="联系信息">
      <el-button type="primary" icon="el-icon-plus" plain size="mini" @click="addContact">新增行</el-button>
    <el-table
      :data="customForm.customerContactsList.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%; margin: 15px 0 0 0;"  stripe>
      <el-table-column
        label="联系人"
        prop="name">
        <template slot-scope="{row,$index}">
          <el-input v-model="row.name" v-if="showEdit[$index]"></el-input>
          <span v-if="!showEdit[$index]">{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="手机"
        prop="phone">
        <template slot-scope="{row,$index}">
          <el-input v-model="row.phone" v-if="showEdit[$index]"></el-input>
          <span v-if="!showEdit[$index]">{{row.phone}}</span>
        </template>
      </el-table-column>
            <el-table-column
        label="座机"
        prop="tel">
        <template slot-scope="{row,$index}">
          <el-input v-model="row.tel" v-if="showEdit[$index]"></el-input>
          <span v-if="!showEdit[$index]">{{row.tel}}</span>
        </template>
      </el-table-column>
            <el-table-column
        label="qq/微信/Email"
        prop="email">
        <template slot-scope="{row,$index}">
          <el-input v-model="row.email" v-if="showEdit[$index]"></el-input>
          <span v-if="!showEdit[$index]">{{row.email}}</span>
        </template>
      </el-table-column>
            <el-table-column
        label="联系地址"
        prop="address"
        width="300px">
        <template slot-scope="{row,$index}">
          <el-input v-model="row.address" v-if="showEdit[$index]"></el-input>
          <span v-if="!showEdit[$index]">{{row.address}}</span>
        </template>
      </el-table-column>
            <el-table-column
        label="首要联系人"
        prop="isDefault">
        <template slot-scope="{row,$index}">
          <el-switch
              v-model="row.isDefault" :disabled = "!showEdit[$index]" :active-value="true" :inactive-value="false"
            ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        align="right"
        width="200px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain icon="el-icon-edit"   @click.native="handleUpdate(scope.$index, scope.row)"     v-if="showBtn[scope.$index]">更新</el-button>
          <el-button type="danger" size="mini" plain icon="el-icon-delete"   @click.native="handleCancel(scope.$index, scope.row)"     v-if="showBtn[scope.$index]">取消</el-button>
          <el-button type="primary" size="mini" plain icon="el-icon-edit"   @click.native="handleEdit(scope.$index, scope.row)"     v-if="!showBtn[scope.$index]">编辑</el-button>
          <el-button type="danger" size="mini" plain icon="el-icon-delete"   @click.native="handleDelete(scope.$index, scope.row)"     v-if="!showBtn[scope.$index]">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-form-item>
    <el-form-item style="margin-top: 100px">
      <el-button type="primary" @click="submitForm('customForm')" v-if="!this.$route.params.id">立即创建</el-button>
      <el-button type="primary" @click="submitForm('customForm')" v-else>立即修改</el-button>
      <el-button @click="resetForm('customForm')">重置</el-button>
    </el-form-item>
    </el-form>

  </div>
</template>
<script>
import { getCustomer, saveCustomer } from "@/api/oms/customer";

export default {
  name: "CustomerEdit",
  data() {
    return {
      showEdit: [], //显示编辑框
      showBtn: [],
      search: '',
      // 客户类别字典
      customerTypeOptions: [],
      // 销售人员列表
      userOptions: [],
      // 客户等级字典
      customerLevelOptions: [],
      customForm: {
        id: '',
        customerName: '',
        customerType: '',
        customerLevel: '',
        balanceDate: '',
        firstGet: '',
        firstPreGet: '',
        taxIdentity: '',
        bankInfo: '',
        bankNum: '',
        sellerId: '',
        customerContactsList: []
      },
      customFormRules: {
        customerName: [
          { required: true, message: '请输入客户名称', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    const id = this.$route.params.id
    if(id) {
      getCustomer(id).then(response => {
          this.msgSuccess("获取数据成功");
          this.customForm = response.data
          this.userOptions = response.users.data;
      });
    }else{
      getCustomer().then(response => {
        this.userOptions = response.users.data;
      });
    }
    this.getDicts("customer_type").then(response => {
      this.customerTypeOptions = response.data;
    });
    this.getDicts("customer_level").then(response => {
      this.customerLevelOptions = response.data;
    });
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveCustomer(this.customForm).then(res => {
            if (res.code === 200) {
              this.msgSuccess(res.msg);
              this.close();
            }
          });
        } else {
          this.msgError("表单校验未通过，请重新检查提交内容");
        }
      });
    },
    // 重置表单
    resetForm(customForm) {
      this.customForm.customerContactsList = []
      this.$refs[customForm].resetFields();
    },
    //点击编辑
    handleEdit(index, row) {
      this.$set(this.showEdit,index,true)
      this.$set(this.showBtn,index,true)
    },
    //取消编辑
    handleCancel(index, row) {
      this.$set(this.showEdit,index,false)
      this.$set(this.showBtn,index,false)
    },
    //点击更新
    handleUpdate(index, row) {
      this.customForm.customerContactsList.splice(index, 1, row)
      this.handleCancel(index, row)
    },
    //点击删除
    handleDelete(index, row) {
      this.customForm.customerContactsList.splice(index, 1)
    },
    // 增加一行联系人
    addContact() {
      var newValue = {
            name: '',
            phone: '',
            tel: '',
            email: '',
            address: '',
            isDefault: false
            };
    this.customForm.customerContactsList.push(newValue);
    var index = this.customForm.customerContactsList.indexOf(newValue)
    this.handleEdit(index, newValue)
    },
    /** 关闭按钮 */
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/info/customer", query: { t: Date.now()}})
    }
  }
}
</script>
